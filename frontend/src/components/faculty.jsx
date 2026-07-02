import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Award, Calendar, FileText, Clock, Search, Download, Bell, LogOut, Menu, X, BookOpen, ChevronDown, AlertCircle, Loader, User } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { apiGet, apiPost, apiPatch } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import FacultyProfile from './faculty/FacultyProfile';

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [menuOpen, setMenuOpen] = useState(false);

  // Courses state
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Attendance state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Assignments state
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '', description: '',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '', totalMarks: 100,
  });
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  // Submissions panel state
  const [selectedAssignment, setSelectedAssignment] = useState(null); // assignment whose submissions to view
  const [submissions, setSubmissions] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [gradingId, setGradingId] = useState(null); // submissionId being graded
  const [gradeInputs, setGradeInputs] = useState({}); // { [subId]: { marks, feedback } }

  // Attendance summary state
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const facultyName = user?.profile
    ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim() || user.email
    : user?.email || 'Faculty';

  // ── Load courses on mount ──────────────────────────────────
  useEffect(() => {
    apiGet('/courses')
      .then(res => {
        setCourses(res.data || []);
        if (res.data?.length > 0) setSelectedCourse(res.data[0]);
      })
      .catch(err => console.error('Courses fetch failed:', err))
      .finally(() => setCoursesLoading(false));
  }, []);

  // ── Load attendance when course/date changes ───────────────
  useEffect(() => {
    if (!selectedCourse || activeTab !== 'attendance') return;
    setAttendanceLoading(true);
    setAttendanceSaved(false);
    apiGet(`/attendance?courseId=${selectedCourse._id}&date=${selectedDate}`)
      .then(res => setAttendanceData(res.data || []))
      .catch(err => console.error('Attendance fetch failed:', err))
      .finally(() => setAttendanceLoading(false));
  }, [selectedCourse, selectedDate, activeTab]);

  // ── Fetch submissions for an assignment ──────────────────────
  const fetchSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    setSubLoading(true);
    setSubmissions([]);
    try {
      const res = await apiGet(`/assignments/${assignment._id}/submissions`);
      setSubmissions(res.data || []);
    } catch (err) {
      alert('Failed to load submissions: ' + err.message);
    } finally {
      setSubLoading(false);
    }
  };

  const submitGrade = async (assignmentId, submissionId) => {
    const input = gradeInputs[submissionId] || {};
    if (input.marks === undefined || input.marks === '') return alert('Enter marks first');
    if (Number(input.marks) > selectedAssignment.totalMarks) return alert(`Max marks: ${selectedAssignment.totalMarks}`);
    try {
      await apiPatch(`/assignments/${assignmentId}/submissions/${submissionId}/grade`, {
        marks: Number(input.marks),
        feedback: input.feedback || '',
      });
      setSubmissions(prev => prev.map(s =>
        s._id === submissionId ? { ...s, marks: Number(input.marks), feedback: input.feedback, gradedAt: new Date() } : s
      ));
      setGradingId(null);
    } catch (err) {
      alert('Failed to grade: ' + err.message);
    }
  };

  // ── Load assignments when course changes ───────────────────
  useEffect(() => {
    if (!selectedCourse || activeTab !== 'assignments') return;
    setAssignmentsLoading(true);
    apiGet(`/assignments?courseId=${selectedCourse._id}`)
      .then(res => setAssignments(res.data || []))
      .catch(err => console.error('Assignments fetch failed:', err))
      .finally(() => setAssignmentsLoading(false));
  }, [selectedCourse, activeTab]);

  // ── Load attendance summary ────────────────────────────────
  useEffect(() => {
    if (!selectedCourse || activeTab !== 'summary') return;
    setSummaryLoading(true);
    apiGet(`/attendance/summary?courseId=${selectedCourse._id}`)
      .then(res => setAttendanceSummary(res.data || []))
      .catch(err => console.error('Summary fetch failed:', err))
      .finally(() => setSummaryLoading(false));
  }, [selectedCourse, activeTab]);

  // ── Toggle attendance status locally ──────────────────────
  const toggleStatus = (studentId, status) => {
    setAttendanceSaved(false);
    setAttendanceData(prev =>
      prev.map(s => s._id === studentId ? { ...s, attendanceStatus: status } : s)
    );
  };

  const markAll = (status) => {
    setAttendanceSaved(false);
    setAttendanceData(prev => prev.map(s => ({ ...s, attendanceStatus: status })));
  };

  // ── Save attendance to backend ─────────────────────────────
  const saveAttendance = async () => {
    if (!selectedCourse) return;
    setSavingAttendance(true);
    try {
      const payload = attendanceData
        .filter(s => s.attendanceStatus)
        .map(s => ({ studentId: s._id, status: s.attendanceStatus }));

      if (payload.length === 0) {
        alert('Mark at least one student before saving.');
        return;
      }

      await apiPost('/attendance/save', {
        courseId: selectedCourse._id,
        date: selectedDate,
        attendance: payload,
      });
      setAttendanceSaved(true);
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSavingAttendance(false);
    }
  };

  // ── Create assignment ──────────────────────────────────────
  const createAssignment = async () => {
    if (!newAssignment.title || !newAssignment.dueDate) {
      alert('Title and due date are required.');
      return;
    }
    setSubmittingAssignment(true);
    try {
      const res = await apiPost('/assignments', {
        ...newAssignment,
        courseId: selectedCourse._id,
      });
      setAssignments(prev => [res.data, ...prev]);
      setNewAssignment({
        title: '', description: '',
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: '', totalMarks: 100,
      });
      setShowAddAssignment(false);
    } catch (err) {
      alert(`Failed to create assignment: ${err.message}`);
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const filteredStudents = attendanceData.filter(s => {
    const name = `${s.profile?.firstName || ''} ${s.profile?.lastName || ''}`.toLowerCase();
    const reg = (s.profile?.registrationNo || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || reg.includes(searchQuery.toLowerCase());
  });

  const presentCount = attendanceData.filter(s => s.attendanceStatus === 'present').length;
  const absentCount = attendanceData.filter(s => s.attendanceStatus === 'absent').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: '#0aa5b7' }}>
                {facultyName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Faculty Dashboard</h1>
                <p className="text-sm text-gray-600">{facultyName}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900"><Bell className="w-5 h-5" /></button>
              <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90" style={{ background: '#0aa5b7' }}>
                <LogOut className="w-4 h-4" /><span>Logout</span>
              </button>
            </div>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Course Selector */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Select Course:</span>
            {coursesLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500"><Loader className="w-4 h-4 animate-spin" /> Loading...</div>
            ) : courses.length === 0 ? (
              <span className="text-sm text-gray-500">No courses assigned yet.</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {courses.map(course => (
                  <button
                    key={course._id}
                    onClick={() => setSelectedCourse(course)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCourse?._id === course._id
                        ? 'text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={selectedCourse?._id === course._id ? { background: '#0aa5b7' } : {}}
                  >
                    {course.code} — {course.name}
                    <span className="ml-2 text-xs opacity-75">Sec {course.section}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {selectedCourse && (
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Course', value: selectedCourse.code, icon: BookOpen, color: '#e0f7fa', iconColor: '#0aa5b7' },
              { label: 'Semester', value: `Sem ${selectedCourse.semester}`, icon: Calendar, color: '#ede9fe', iconColor: '#7c3aed' },
              { label: 'Credits', value: selectedCourse.credits, icon: Award, color: '#fef3c7', iconColor: '#d97706' },
              { label: 'Type', value: selectedCourse.type, icon: FileText, color: '#dcfce7', iconColor: '#16a34a' },
            ].map(({ label, value, icon: Icon, color, iconColor }) => (
              <div key={label} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">{label}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1 capitalize">{value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: color }}>
                    <Icon className="w-5 h-5" style={{ color: iconColor }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            {[
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'courses', label: 'My Courses', icon: BookOpen },
              { id: 'attendance', label: 'Attendance', icon: Calendar },
              { id: 'summary', label: 'Attendance Summary', icon: Users },
              { id: 'assignments', label: 'Assignments', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'border-b-2 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === tab.id ? { borderColor: '#0aa5b7', background: '#0aa5b7' } : {}}
              >
                <tab.icon className="w-5 h-5" /><span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <FacultyProfile />
        )}

        {/* ── MY COURSES TAB ── */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesLoading ? (
              <div className="col-span-3 text-center py-12 text-gray-500"><Loader className="w-8 h-8 animate-spin mx-auto mb-2" />Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No courses assigned yet.</p>
              </div>
            ) : courses.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: '#0aa5b7' }}>
                    {course.code.slice(0, 2)}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.type === 'core' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {course.type}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{course.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{course.code} • Section {course.section}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Semester {course.semester} • {course.credits} credits</div>
                  <div>{course.department} — {course.program}</div>
                  {course.schedule && <div className="text-gray-400">{course.schedule}</div>}
                </div>
                <button
                  onClick={() => { setSelectedCourse(course); setActiveTab('attendance'); }}
                  className="mt-4 w-full py-2 text-white rounded-lg text-sm font-medium hover:opacity-90"
                  style={{ background: '#0aa5b7' }}
                >
                  Manage Attendance
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── ATTENDANCE TAB ── */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Mark Attendance {selectedCourse && `— ${selectedCourse.name}`}
              </h2>
            </div>
            <div className="p-6">
              {!selectedCourse ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  Select a course from the dropdown above.
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type="text" placeholder="Search students..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0aa5b7]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-400 w-5 h-5" />
                      <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0aa5b7]" />
                    </div>
                  </div>

                  {attendanceData.length > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <button onClick={() => markAll('present')} className="px-4 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Mark All Present</button>
                      <button onClick={() => markAll('absent')} className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Mark All Absent</button>
                      <span className="ml-auto text-sm text-gray-500 self-center">
                        ✅ {presentCount} present · ❌ {absentCount} absent · ⬜ {attendanceData.length - presentCount - absentCount} unmarked
                      </span>
                    </div>
                  )}

                  {attendanceLoading ? (
                    <div className="text-center py-8 text-gray-500"><Loader className="w-6 h-6 animate-spin mx-auto mb-2" />Loading students...</div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      {attendanceData.length === 0 ? 'No students found for this course.' : 'No students match your search.'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg No</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredStudents.map(student => (
                            <tr key={student._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.profile?.registrationNo || '—'}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {`${student.profile?.firstName || ''} ${student.profile?.lastName || ''}`.trim() || student.email}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">{student.email}</td>
                              <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => toggleStatus(student._id, 'present')}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                      student.attendanceStatus === 'present'
                                        ? 'bg-green-500 text-white scale-105 shadow'
                                        : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                                    }`}
                                  >
                                    <CheckCircle className="w-4 h-4" /> P
                                  </button>
                                  <button
                                    onClick={() => toggleStatus(student._id, 'absent')}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                      student.attendanceStatus === 'absent'
                                        ? 'bg-red-500 text-white scale-105 shadow'
                                        : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                                    }`}
                                  >
                                    <XCircle className="w-4 h-4" /> A
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end items-center gap-3">
                    {attendanceSaved && <span className="text-green-600 text-sm font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved!</span>}
                    <button
                      onClick={saveAttendance}
                      disabled={savingAttendance || attendanceData.length === 0}
                      className="px-6 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-medium"
                      style={{ background: '#0aa5b7' }}
                    >
                      {savingAttendance ? 'Saving...' : 'Save Attendance'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── ATTENDANCE SUMMARY TAB ── */}
        {activeTab === 'summary' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Attendance Summary {selectedCourse && `— ${selectedCourse.name}`}
              </h2>
            </div>
            <div className="p-6">
              {!selectedCourse ? (
                <div className="text-center py-8 text-gray-500">Select a course above.</div>
              ) : summaryLoading ? (
                <div className="text-center py-8 text-gray-500"><Loader className="w-6 h-6 animate-spin mx-auto mb-2" />Loading summary...</div>
              ) : attendanceSummary.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No attendance records yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg No</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Present</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Absent</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">%</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {attendanceSummary.map(s => (
                        <tr key={s.studentId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{s.registrationNo || '—'}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-900">{s.totalClasses}</td>
                          <td className="px-4 py-3 text-sm text-center text-green-600 font-medium">{s.present}</td>
                          <td className="px-4 py-3 text-sm text-center text-red-500 font-medium">{s.absent}</td>
                          <td className="px-4 py-3 text-sm text-center font-bold text-gray-900">{s.percentage}%</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              s.status === 'safe' ? 'bg-green-100 text-green-800' :
                              s.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ASSIGNMENTS TAB ── */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Assignments {selectedCourse && `— ${selectedCourse.name}`}
              </h2>
              {selectedCourse && (
                <button
                  onClick={() => setShowAddAssignment(!showAddAssignment)}
                  className="px-4 py-2 text-white rounded-lg hover:opacity-90 text-sm font-medium"
                  style={{ background: '#0aa5b7' }}
                >
                  + New Assignment
                </button>
              )}
            </div>

            {/* Add Assignment Form */}
            {showAddAssignment && (
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-base font-semibold mb-4 text-gray-800">Create Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" value={newAssignment.title}
                      onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0aa5b7] focus:outline-none"
                      placeholder="Assignment title" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={newAssignment.description}
                      onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0aa5b7] focus:outline-none"
                      rows="2" placeholder="Description (optional)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Date</label>
                    <input type="date" value={newAssignment.assignedDate}
                      onChange={e => setNewAssignment({ ...newAssignment, assignedDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0aa5b7] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                    <input type="date" value={newAssignment.dueDate}
                      onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0aa5b7] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                    <input type="number" value={newAssignment.totalMarks}
                      onChange={e => setNewAssignment({ ...newAssignment, totalMarks: parseInt(e.target.value) || 100 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#0aa5b7] focus:outline-none" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={createAssignment} disabled={submittingAssignment}
                    className="px-5 py-2 text-white rounded-lg hover:opacity-90 font-medium disabled:opacity-50"
                    style={{ background: '#0aa5b7' }}>
                    {submittingAssignment ? 'Creating...' : 'Create Assignment'}
                  </button>
                  <button onClick={() => setShowAddAssignment(false)}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="p-6">
              {!selectedCourse ? (
                <div className="text-center py-8 text-gray-500">Select a course above.</div>
              ) : assignmentsLoading ? (
                <div className="text-center py-8 text-gray-500"><Loader className="w-6 h-6 animate-spin mx-auto mb-2" />Loading assignments...</div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No assignments yet. Create one above.
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map(a => {
                    const daysLeft = Math.ceil((new Date(a.dueDate) - new Date()) / 86400000);
                    const isOverdue = daysLeft < 0;
                    const isDueSoon = !isOverdue && daysLeft <= 7;
                    return (
                      <div key={a._id} className={`border-2 rounded-lg p-5 ${a.status === 'completed' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:shadow-md'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-base font-bold text-gray-900">{a.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                a.status === 'completed' ? 'bg-green-100 text-green-800' :
                                isOverdue ? 'bg-red-100 text-red-800' :
                                isDueSoon ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {a.status === 'completed' ? 'Completed' : isOverdue ? 'Overdue' : isDueSoon ? `Due in ${daysLeft}d` : 'Active'}
                              </span>
                            </div>
                            {a.description && <p className="text-sm text-gray-500 mb-2">{a.description}</p>}
                            <div className="text-xs text-gray-500 flex gap-4 flex-wrap">
                              <span>Assigned: {a.assignedDate}</span>
                              <span>Due: {a.dueDate}</span>
                              <span>Marks: {a.totalMarks}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex gap-3">
                            <div className="text-center p-2 bg-green-50 rounded-lg min-w-[70px]">
                              <p className="text-lg font-bold text-green-600">{a.submittedCount ?? a.submissions?.length ?? 0}</p>
                              <p className="text-xs text-gray-500">Submitted</p>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded-lg min-w-[70px]">
                              <p className="text-lg font-bold text-blue-600">{a.totalMarks}</p>
                              <p className="text-xs text-gray-500">Total Marks</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded-lg min-w-[70px]">
                              <p className="text-lg font-bold text-gray-600 capitalize">{a.status}</p>
                              <p className="text-xs text-gray-500">Status</p>
                            </div>
                          </div>
                          <button
                            onClick={() => fetchSubmissions(a)}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90"
                            style={{ background: '#0aa5b7' }}
                          >
                            <Users className="w-4 h-4" /> View Submissions
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SUBMISSIONS PANEL ── */}
        {selectedAssignment && activeTab === 'assignments' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Submissions — {selectedAssignment.title}</h2>
                <p className="text-sm text-gray-500 mt-0.5">Total marks: {selectedAssignment.totalMarks}</p>
              </div>
              <button onClick={() => { setSelectedAssignment(null); setGradingId(null); }}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold px-2">✕</button>
            </div>
            <div className="p-5">
              {subLoading ? (
                <div className="text-center py-8 text-gray-400"><Loader className="w-6 h-6 animate-spin mx-auto mb-2" />Loading submissions...</div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No submissions yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reg No</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Submitted At</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">File</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Marks</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Feedback</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {submissions.map(s => {
                        const student = s.studentId;
                        const name = student ? `${student.profile?.firstName || ''} ${student.profile?.lastName || ''}`.trim() || student.email : '—';
                        const regNo = student?.profile?.registrationNo || '—';
                        const isGrading = gradingId === s._id;
                        const input = gradeInputs[s._id] || { marks: s.marks ?? '', feedback: s.feedback || '' };
                        return (
                          <tr key={s._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{name}</td>
                            <td className="px-4 py-3 text-gray-500">{regNo}</td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                              {new Date(s.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              {s.isLate && <span className="ml-1 text-xs text-red-500">(Late)</span>}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {s.fileUrl ? (
                                <a href={s.fileUrl} target="_blank" rel="noreferrer"
                                  className="text-xs font-medium text-[#0aa5b7] hover:underline flex items-center justify-center gap-1">
                                  <FileText className="w-3.5 h-3.5" /> View
                                </a>
                              ) : '—'}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isGrading ? (
                                <input type="number" min="0" max={selectedAssignment.totalMarks}
                                  value={input.marks}
                                  onChange={e => setGradeInputs(prev => ({ ...prev, [s._id]: { ...input, marks: e.target.value } }))}
                                  className="w-16 text-center border border-gray-300 rounded px-1 py-1 text-sm focus:outline-none focus:border-[#0aa5b7]"
                                />
                              ) : (
                                <span className={`font-semibold ${s.marks !== null && s.marks !== undefined ? 'text-green-600' : 'text-gray-400'}`}>
                                  {s.marks !== null && s.marks !== undefined ? `${s.marks}/${selectedAssignment.totalMarks}` : 'Not graded'}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {isGrading ? (
                                <input type="text"
                                  value={input.feedback}
                                  onChange={e => setGradeInputs(prev => ({ ...prev, [s._id]: { ...input, feedback: e.target.value } }))}
                                  placeholder="Optional feedback"
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#0aa5b7]"
                                />
                              ) : (
                                <span className="text-gray-500 text-xs">{s.feedback || '—'}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {isGrading ? (
                                <div className="flex gap-1 justify-center">
                                  <button onClick={() => submitGrade(selectedAssignment._id, s._id)}
                                    className="px-3 py-1 text-xs text-white rounded-lg hover:opacity-90"
                                    style={{ background: '#0aa5b7' }}>Save</button>
                                  <button onClick={() => setGradingId(null)}
                                    className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => { setGradingId(s._id); setGradeInputs(prev => ({ ...prev, [s._id]: { marks: s.marks ?? '', feedback: s.feedback || '' } })); }}
                                  className="px-3 py-1 text-xs font-medium border border-[#0aa5b7] text-[#0aa5b7] rounded-lg hover:bg-[#0aa5b7] hover:text-white transition-colors">
                                  {s.marks !== null && s.marks !== undefined ? 'Re-grade' : 'Grade'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;