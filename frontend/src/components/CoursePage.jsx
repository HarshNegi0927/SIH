import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, BookOpen, Clock, Save, Plus, Trash2, Edit2, CheckCircle, XCircle, Download, ArrowLeft, Bell, LogOut } from 'lucide-react';

export default function CourseManagement() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [saveStatus, setSaveStatus] = useState('');

  // Mock course data based on courseId
  const coursesData = {
    1: {
      name: 'Data Structures & Algorithms',
      code: 'CS301',
      semester: 'SEMESTER 3',
      section: 'A',
      schedule: 'Mon, Wed, Fri - 10:00 AM',
      totalStudents: 45,
      faculty: 'Dr. Rajesh Kumar'
    },
    2: {
      name: 'Database Management Systems',
      code: 'CS302',
      semester: 'SEMESTER 3',
      section: 'B',
      schedule: 'Tue, Thu - 11:00 AM',
      totalStudents: 42,
      faculty: 'Dr. Rajesh Kumar'
    },
    3: {
      name: 'Operating Systems',
      code: 'CS303',
      semester: 'SEMESTER 4',
      section: 'A',
      schedule: 'Mon, Wed, Fri - 2:00 PM',
      totalStudents: 48,
      faculty: 'Dr. Rajesh Kumar'
    },
    4: {
      name: 'Computer Networks',
      code: 'CS304',
      semester: 'SEMESTER 4',
      section: 'B',
      schedule: 'Tue, Thu - 3:00 PM',
      totalStudents: 40,
      faculty: 'Dr. Rajesh Kumar'
    },
    5: {
      name: 'Software Engineering',
      code: 'CS305',
      semester: 'SEMESTER 5',
      section: 'A',
      schedule: 'Mon, Wed - 9:00 AM',
      totalStudents: 38,
      faculty: 'Dr. Rajesh Kumar'
    }
  };

  const courseData = coursesData[courseId] || coursesData[1];

  // Sample students data with attendance
  const [students, setStudents] = useState([
    { id: 1, rollNo: 'CS2021001', name: 'Aarav Sharma', email: 'aarav@university.edu', attendance: {} },
    { id: 2, rollNo: 'CS2021002', name: 'Priya Patel', email: 'priya@university.edu', attendance: {} },
    { id: 3, rollNo: 'CS2021003', name: 'Rohan Verma', email: 'rohan@university.edu', attendance: {} },
    { id: 4, rollNo: 'CS2021004', name: 'Ananya Singh', email: 'ananya@university.edu', attendance: {} },
    { id: 5, rollNo: 'CS2021005', name: 'Arjun Kumar', email: 'arjun@university.edu', attendance: {} },
    { id: 6, rollNo: 'CS2021006', name: 'Diya Gupta', email: 'diya@university.edu', attendance: {} },
    { id: 7, rollNo: 'CS2021007', name: 'Kabir Reddy', email: 'kabir@university.edu', attendance: {} },
    { id: 8, rollNo: 'CS2021008', name: 'Ishita Mehta', email: 'ishita@university.edu', attendance: {} },
    { id: 9, rollNo: 'CS2021009', name: 'Vihaan Joshi', email: 'vihaan@university.edu', attendance: {} },
    { id: 10, rollNo: 'CS2021010', name: 'Saanvi Desai', email: 'saanvi@university.edu', attendance: {} },
  ]);

  // Sample assignments data
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Binary Search Tree Implementation',
      description: 'Implement a balanced BST with insert, delete, and search operations',
      assignedDate: '2024-01-15',
      dueDate: '2024-02-05',
      totalMarks: 100,
      status: 'active',
      submitted: 35,
      pending: 10
    },
    {
      id: 2,
      title: 'Graph Algorithms Project',
      description: 'Implement Dijkstra\'s and A* pathfinding algorithms',
      assignedDate: '2024-01-20',
      dueDate: '2024-02-15',
      totalMarks: 150,
      status: 'active',
      submitted: 28,
      pending: 17
    },
    {
      id: 3,
      title: 'Dynamic Programming Solutions',
      description: 'Solve 10 DP problems with detailed explanations',
      assignedDate: '2024-01-10',
      dueDate: '2024-01-30',
      totalMarks: 80,
      status: 'completed',
      submitted: 45,
      pending: 0
    },
  ]);

  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    totalMarks: 100
  });

  // Toggle attendance for a student
  const toggleAttendance = (studentId, status) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          attendance: {
            ...student.attendance,
            [selectedDate]: status
          }
        };
      }
      return student;
    }));
  };

  // Mark all students
  const markAll = (status) => {
    setStudents(students.map(student => ({
      ...student,
      attendance: {
        ...student.attendance,
        [selectedDate]: status
      }
    })));
  };

  // Save attendance
  const saveAttendance = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 500);
  };

  // Calculate attendance percentage
  const getAttendancePercentage = (student) => {
    const attendanceRecords = Object.values(student.attendance);
    if (attendanceRecords.length === 0) return 0;
    const presentCount = attendanceRecords.filter(status => status === 'present').length;
    return ((presentCount / attendanceRecords.length) * 100).toFixed(1);
  };

  // Add new assignment
  const addAssignment = () => {
    if (newAssignment.title && newAssignment.dueDate) {
      setAssignments([
        ...assignments,
        {
          ...newAssignment,
          id: assignments.length + 1,
          status: 'active',
          submitted: 0,
          pending: courseData.totalStudents
        }
      ]);
      setNewAssignment({
        title: '',
        description: '',
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        totalMarks: 100
      });
      setShowAddAssignment(false);
    }
  };

  // Delete assignment
  const deleteAssignment = (id) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  // Toggle assignment status
  const toggleAssignmentStatus = (id) => {
    setAssignments(assignments.map(a => 
      a.id === id 
        ? { ...a, status: a.status === 'active' ? 'completed' : 'active' }
        : a
    ));
  };

  // Get days until due
  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: '#0aa5b7' }}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{courseData.name}</h1>
                  <p className="text-sm text-gray-600">{courseData.faculty} | {courseData.code}</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ background: '#0aa5b7' }}>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Course Info Cards */}
      <div className="w-full px-6 lg:px-12 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Semester</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{courseData.semester}</p>
                <p className="text-xs text-gray-500 mt-1">Section {courseData.section}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#e0f7fa' }}>
                <Calendar className="w-6 h-6" style={{ color: '#0aa5b7' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{courseData.totalStudents}</p>
                <p className="text-xs text-gray-500 mt-1">Enrolled</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-50">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Schedule</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{courseData.schedule.split('-')[0]}</p>
                <p className="text-xs text-gray-500 mt-1">{courseData.schedule.split('-')[1]}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{assignments.filter(a => a.status === 'active').length}</p>
                <p className="text-xs text-gray-500 mt-1">Pending</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-50">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="w-full px-6 lg:px-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            {[
              { id: 'attendance', label: 'Attendance', icon: Calendar },
              { id: 'assignments', label: 'Assignments', icon: BookOpen },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === tab.id ? { borderColor: '#0aa5b7', background: '#0aa5b7' } : {}}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="w-full px-6 lg:px-12 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Student Attendance</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#0aa5b7]"
                  />
                </div>
                
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => markAll('present')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => markAll('absent')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                  >
                    Mark All Absent
                  </button>
                  <button
                    onClick={saveAttendance}
                    disabled={saveStatus === 'saving'}
                    className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2 disabled:opacity-50 text-sm"
                    style={{ background: '#0aa5b7' }}
                  >
                    <Save size={18} />
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Attendance'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => {
                      const status = student.attendance[selectedDate];
                      const percentage = parseFloat(getAttendancePercentage(student));
                      return (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.rollNo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => toggleAttendance(student.id, 'present')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                                  status === 'present'
                                    ? 'bg-green-500 text-white shadow-lg scale-105'
                                    : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                                }`}
                              >
                                <CheckCircle size={18} className="inline mr-1" />
                                Present
                              </button>
                              <button
                                onClick={() => toggleAttendance(student.id, 'absent')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                                  status === 'absent'
                                    ? 'bg-red-500 text-white shadow-lg scale-105'
                                    : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                                }`}
                              >
                                <XCircle size={18} className="inline mr-1" />
                                Absent
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${percentage}%`,
                                    background: percentage >= 75 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444'
                                  }}
                                />
                              </div>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                percentage >= 75
                                  ? 'bg-green-100 text-green-800'
                                  : percentage >= 60
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {percentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="w-full px-6 lg:px-12 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Course Assignments</h2>
              <button
                onClick={() => setShowAddAssignment(!showAddAssignment)}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2"
                style={{ background: '#0aa5b7' }}
              >
                <Plus size={18} />
                Add New Assignment
              </button>
            </div>

            {/* Add Assignment Form */}
            {showAddAssignment && (
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">New Assignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0aa5b7] focus:outline-none"
                      placeholder="Assignment title"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0aa5b7] focus:outline-none"
                      rows="3"
                      placeholder="Assignment description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Date</label>
                    <input
                      type="date"
                      value={newAssignment.assignedDate}
                      onChange={(e) => setNewAssignment({ ...newAssignment, assignedDate: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0aa5b7] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0aa5b7] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
                    <input
                      type="number"
                      value={newAssignment.totalMarks}
                      onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0aa5b7] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={addAssignment}
                    className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    style={{ background: '#0aa5b7' }}
                  >
                    Add Assignment
                  </button>
                  <button
                    onClick={() => setShowAddAssignment(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Assignments List */}
            <div className="p-6 space-y-4">
              {assignments.map((assignment) => {
                const daysUntil = getDaysUntilDue(assignment.dueDate);
                const isOverdue = daysUntil < 0;
                const isDueSoon = daysUntil >= 0 && daysUntil <= 7;

                return (
                  <div
                    key={assignment.id}
                    className={`border-2 rounded-lg p-6 transition-all ${
                      assignment.status === 'completed'
                        ? 'bg-gray-50 border-gray-300'
                        : 'bg-white border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-xl font-bold ${
                            assignment.status === 'completed' ? 'text-gray-500' : 'text-gray-800'
                          }`}>
                            {assignment.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            assignment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : isOverdue
                              ? 'bg-red-100 text-red-800'
                              : isDueSoon
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {assignment.status === 'completed'
                              ? 'Completed'
                              : isOverdue
                              ? 'Overdue'
                              : isDueSoon
                              ? `Due in ${daysUntil} days`
                              : 'Active'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{assignment.description}</p>
                        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                          <div>
                            <span className="font-semibold">Assigned:</span> {new Date(assignment.assignedDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-semibold">Due:</span> {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-semibold">Total Marks:</span> {assignment.totalMarks}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => toggleAssignmentStatus(assignment.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            assignment.status === 'completed'
                              ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title={assignment.status === 'completed' ? 'Mark as Active' : 'Mark as Completed'}
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => deleteAssignment(assignment.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete Assignment"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Assignment Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{assignment.submitted}</p>
                        <p className="text-xs text-gray-600 mt-1">Submitted</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{assignment.pending}</p>
                        <p className="text-xs text-gray-600 mt-1">Pending</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{courseData.totalStudents}</p>
                        <p className="text-xs text-gray-600 mt-1">Total</p>
                      </div>
                    </div>

                    <button className="w-full mt-4 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity font-medium" style={{ background: '#0aa5b7' }}>
                      View Submissions
                    </button>
                  </div>
                );
              })}
            </div>

            {assignments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No assignments yet. Click "Add New Assignment" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
