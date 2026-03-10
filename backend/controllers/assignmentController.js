const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const path = require("path");

// ─────────────────────────────────────────────────────────────
// Helper: verify faculty owns the course
// ─────────────────────────────────────────────────────────────
const verifyFacultyCourse = async (courseId, facultyId) => {
  const course = await Course.findById(courseId);
  if (!course) throw { statusCode: 404, message: "Course not found" };
  if (course.facultyId.toString() !== facultyId.toString())
    throw { statusCode: 403, message: "You are not assigned to this course" };
  return course;
};

// ─────────────────────────────────────────────────────────────
// GET /api/assignments?courseId=&status=
// Faculty or student fetches assignments for a course
// ─────────────────────────────────────────────────────────────
const getAssignments = async (req, res, next) => {
  try {
    const { courseId, status } = req.query;
    if (!courseId) return res.status(400).json({ success: false, message: "courseId is required" });

    const filter = { courseId };
    if (status) filter.status = status;

    const assignments = await Assignment.find(filter)
      .select("-submissions") // don't send all submissions in list view
      .sort({ createdAt: -1 });

    const today = new Date().toISOString().split("T")[0];
    const enriched = assignments.map((a) => {
      const diff = Math.ceil((new Date(a.dueDate) - new Date(today)) / 86400000);
      return {
        ...a.toObject(),
        daysUntilDue: diff,
        isOverdue: diff < 0,
        isDueSoon: diff >= 0 && diff <= 7,
        // Submission counts
        submittedCount: a.submissions?.length || 0,
      };
    });

    res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/assignments/:id
// Full assignment including all submissions
// ─────────────────────────────────────────────────────────────
const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "submissions.studentId",
      "profile.firstName profile.lastName profile.registrationNo email"
    );

    if (!assignment)
      return res.status(404).json({ success: false, message: "Assignment not found" });

    res.status(200).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/assignments  [faculty only]
// Body: { courseId, title, description, assignedDate, dueDate, totalMarks }
// ─────────────────────────────────────────────────────────────
const createAssignment = async (req, res, next) => {
  try {
    const { courseId, title, description, assignedDate, dueDate, totalMarks } = req.body;

    if (!courseId || !title || !assignedDate || !dueDate)
      return res.status(400).json({ success: false, message: "courseId, title, assignedDate, dueDate are required" });

    const course = await verifyFacultyCourse(courseId, req.user._id);

    const assignment = await Assignment.create({
      courseId,
      facultyId: req.user._id,
      aisheCode: course.aisheCode,
      title,
      description,
      assignedDate,
      dueDate,
      totalMarks: totalMarks || 100,
      submissions: [],
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/assignments/:id  [faculty only]
// Update assignment details (not submissions)
// ─────────────────────────────────────────────────────────────
const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ success: false, message: "Assignment not found" });

    if (assignment.facultyId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    const allowed = ["title", "description", "assignedDate", "dueDate", "totalMarks", "status"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/assignments/:id/toggle-status  [faculty only]
// Toggle active ↔ completed
// ─────────────────────────────────────────────────────────────
const toggleAssignmentStatus = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ success: false, message: "Assignment not found" });

    if (assignment.facultyId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    assignment.status = assignment.status === "active" ? "completed" : "active";
    await assignment.save();

    res.status(200).json({
      success: true,
      message: `Assignment marked as ${assignment.status}`,
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/assignments/:id  [faculty only]
// ─────────────────────────────────────────────────────────────
const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ success: false, message: "Assignment not found" });

    if (assignment.facultyId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    await assignment.deleteOne();

    res.status(200).json({ success: true, message: "Assignment deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/assignments/:id/submit  [student only]
// Student uploads a file → marks as submitted
// Requires multer middleware on the route
// req.file = uploaded file info
// ─────────────────────────────────────────────────────────────
const submitAssignment = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "File upload is required to submit" });

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ success: false, message: "Assignment not found" });

    if (assignment.status === "completed")
      return res.status(400).json({ success: false, message: "Assignment is closed for submissions" });

    const studentId = req.user._id.toString();

    // Check if already submitted — update if so (resubmission)
    const existing = assignment.submissions.find(
      (s) => s.studentId.toString() === studentId
    );

    const today = new Date().toISOString().split("T")[0];
    const isLate = today > assignment.dueDate;

    if (existing) {
      // Resubmission: update file, reset grade
      existing.fileUrl = req.file.path;
      existing.fileName = req.file.originalname;
      existing.submittedAt = new Date();
      existing.isLate = isLate;
      existing.marks = null;
      existing.grade = null;
      existing.feedback = null;
      existing.gradedAt = null;
      existing.gradedBy = null;
    } else {
      assignment.submissions.push({
        studentId: req.user._id,
        fileUrl: req.file.path,
        fileName: req.file.originalname,
        submittedAt: new Date(),
        isLate,
      });
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      message: existing ? "Resubmitted successfully" : "Submitted successfully",
      isLate,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/assignments/:id/submissions  [faculty only]
// All submissions for an assignment with student info
// ─────────────────────────────────────────────────────────────
const getSubmissions = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "submissions.studentId",
      "profile.firstName profile.lastName profile.registrationNo email"
    );

    if (!assignment)
      return res.status(404).json({ success: false, message: "Assignment not found" });

    if (assignment.facultyId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    res.status(200).json({
      success: true,
      totalSubmissions: assignment.submissions.length,
      data: assignment.submissions,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/assignments/:id/submissions/:submissionId/grade  [faculty only]
// Body: { marks, grade, feedback }
// Faculty enters marks manually for a single submission
// ─────────────────────────────────────────────────────────────
const gradeSubmission = async (req, res, next) => {
  try {
    const { marks, grade, feedback } = req.body;

    if (marks === undefined || marks === null)
      return res.status(400).json({ success: false, message: "marks is required" });

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ success: false, message: "Assignment not found" });

    if (assignment.facultyId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: "Not authorized" });

    if (marks > assignment.totalMarks)
      return res.status(400).json({
        success: false,
        message: `Marks cannot exceed totalMarks (${assignment.totalMarks})`,
      });

    const submission = assignment.submissions.id(req.params.submissionId);
    if (!submission)
      return res.status(404).json({ success: false, message: "Submission not found" });

    submission.marks = marks;
    submission.grade = grade || null;
    submission.feedback = feedback || null;
    submission.gradedAt = new Date();
    submission.gradedBy = req.user._id;

    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Marks saved successfully",
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/assignments/:id/my-submission  [student only]
// Student views their own submission + marks
// ─────────────────────────────────────────────────────────────
const getMySubmission = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ success: false, message: "Assignment not found" });

    const submission = assignment.submissions.find(
      (s) => s.studentId.toString() === req.user._id.toString()
    );

    res.status(200).json({
      success: true,
      data: submission || null, // null = not submitted yet
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  toggleAssignmentStatus,
  deleteAssignment,
  submitAssignment,
  getSubmissions,
  gradeSubmission,
  getMySubmission,
};
