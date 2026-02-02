import { useState } from 'react';
import { Users, CheckCircle, XCircle, Award, Calendar, FileText, Clock, Search, Filter, Download, Eye, Bell, LogOut, Menu, X, BookOpen } from 'lucide-react';

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  // Mock data for students
  const [students] = useState([
    { id: 1, name: 'Rahul Sharma', rollNo: 'CS001', email: 'rahul@example.com', attendance: 85, present: true },
    { id: 2, name: 'Priya Singh', rollNo: 'CS002', email: 'priya@example.com', attendance: 92, present: true },
    { id: 3, name: 'Amit Kumar', rollNo: 'CS003', email: 'amit@example.com', attendance: 78, present: false },
    { id: 4, name: 'Sneha Patel', rollNo: 'CS004', email: 'sneha@example.com', attendance: 88, present: true },
    { id: 5, name: 'Vikram Rao', rollNo: 'CS005', email: 'vikram@example.com', attendance: 95, present: true },
  ]);

  // Mock data for certificate approvals
  const [certificates, setCertificates] = useState([
    { id: 1, studentName: 'Rahul Sharma', rollNo: 'CS001', type: 'Hackathon', title: 'Smart India Hackathon 2024', date: '2024-12-15', status: 'pending', document: 'certificate.pdf' },
    { id: 2, studentName: 'Priya Singh', rollNo: 'CS002', type: 'MOOC', title: 'Machine Learning Specialization', date: '2024-12-10', status: 'pending', document: 'ml_cert.pdf' },
    { id: 3, studentName: 'Amit Kumar', rollNo: 'CS003', type: 'Internship', title: 'Summer Internship at TCS', date: '2024-11-30', status: 'approved', document: 'internship.pdf' },
    { id: 4, studentName: 'Sneha Patel', rollNo: 'CS004', type: 'Conference', title: 'IEEE Conference 2024', date: '2024-12-01', status: 'pending', document: 'conference.pdf' },
  ]);

  // Mock data for assignments
  const [assignments] = useState([
    { id: 1, title: 'Data Structures Project', dueDate: '2024-12-30', submitted: 18, total: 25, pending: 7 },
    { id: 2, title: 'Algorithm Analysis Report', dueDate: '2024-12-28', submitted: 22, total: 25, pending: 3 },
    { id: 3, title: 'Database Design Assignment', dueDate: '2025-01-05', submitted: 12, total: 25, pending: 13 },
  ]);

  // Mock data for grades
  const [grades] = useState([
    { id: 1, studentName: 'Rahul Sharma', rollNo: 'CS001', midterm: 85, assignment: 90, project: 88, attendance: 85 },
    { id: 2, studentName: 'Priya Singh', rollNo: 'CS002', midterm: 92, assignment: 95, project: 93, attendance: 92 },
    { id: 3, studentName: 'Amit Kumar', rollNo: 'CS003', midterm: 75, assignment: 80, project: 78, attendance: 78 },
    { id: 4, studentName: 'Sneha Patel', rollNo: 'CS004', midterm: 88, assignment: 87, project: 90, attendance: 88 },
  ]);

  const handleCertificateAction = (id, action) => {
    setCertificates(certificates.map(cert =>
      cert.id === id ? { ...cert, status: action } : cert
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: '#0aa5b7' }}>
                F
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Faculty Dashboard</h1>
                <p className="text-sm text-gray-600">Dr. Rajesh Kumar | Computer Science</p>
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
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#e0f7fa' }}>
                <BookOpen className="w-6 h-6" style={{ color: '#0aa5b7' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{certificates.filter(c => c.status === 'pending').length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#fff3cd' }}>
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assignments Due</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            {[
              { id: 'attendance', label: 'Attendance', icon: Calendar },
              { id: 'certificates', label: 'Certificate Approvals', icon: Award },
              { id: 'assignments', label: 'Assignments', icon: FileText },
              { id: 'grades', label: 'Grades', icon: CheckCircle },
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
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Student Attendance</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0aa5b7]"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0aa5b7]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mark</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.rollNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${student.attendance}%`,
                                  background: student.attendance >= 75 ? '#10b981' : '#ef4444'
                                }}
                              />
                            </div>
                            <span className="text-gray-900 font-medium">{student.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            student.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {student.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button className="p-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ background: '#0aa5b7' }}>
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ background: '#0aa5b7' }}>
                  Save Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Approvals Tab */}
      {activeTab === 'certificates' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Certificate Approvals</h2>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Student</p>
                      <p className="text-sm font-medium text-gray-900">{cert.studentName}</p>
                      <p className="text-xs text-gray-600">{cert.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Certificate Type</p>
                      <p className="text-sm font-medium text-gray-900">{cert.type}</p>
                      <p className="text-xs text-gray-600">{cert.title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Submission Date</p>
                      <p className="text-sm text-gray-900">{cert.date}</p>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                        {cert.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Document</span>
                    </button>
                    {cert.status === 'pending' && (
                      <div className="flex gap-2 flex-1">
                        <button
                          onClick={() => handleCertificateAction(cert.id, 'approved')}
                          className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                          style={{ background: '#0aa5b7' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleCertificateAction(cert.id, 'rejected')}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Assignments & Submissions</h2>
              <button className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ background: '#0aa5b7' }}>
                Create New Assignment
              </button>
            </div>
            <div className="p-6 space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">Due Date: {assignment.dueDate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{assignment.submitted}</p>
                      <p className="text-xs text-gray-600 mt-1">Submitted</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{assignment.pending}</p>
                      <p className="text-xs text-gray-600 mt-1">Pending</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{assignment.total}</p>
                      <p className="text-xs text-gray-600 mt-1">Total</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ background: '#0aa5b7' }}>
                    View Submissions
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grades Tab */}
      {activeTab === 'grades' && (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Student Grades</h2>
              <button className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ background: '#0aa5b7' }}>
                <Download className="w-4 h-4" />
                <span>Export Grades</span>
              </button>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Midterm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grades.map((grade) => {
                    const total = Math.round((grade.midterm * 0.3 + grade.assignment * 0.2 + grade.project * 0.3 + grade.attendance * 0.2));
                    const gradeStr = total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : 'D';
                    return (
                      <tr key={grade.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grade.rollNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.midterm}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.assignment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.project}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.attendance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {gradeStr}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
