import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Award, Calendar, FileText, Clock, Search, Filter, Download, Eye, Bell, LogOut, Menu, X, BookOpen, ChevronDown } from 'lucide-react';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('certificates');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  // Mock data for courses
  const [courses] = useState([
    { id: 1, code: 'CS301', name: 'Data Structures & Algorithms', students: 45, credits: 4 },
    { id: 2, code: 'CS302', name: 'Database Management Systems', students: 42, credits: 4 },
    { id: 3, code: 'CS303', name: 'Operating Systems', students: 48, credits: 3 },
    { id: 4, code: 'CS304', name: 'Computer Networks', students: 40, credits: 3 },
    { id: 5, code: 'CS305', name: 'Software Engineering', students: 38, credits: 4 },
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

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
    setShowCourseDropdown(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: '#0aa5b7' }}>
                F
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
                <p className="text-sm text-gray-600">Dr. Rajesh Kumar | Computer Science</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell size={20} />
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="w-full px-6 lg:px-12 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Courses with Dropdown */}
          <div className="relative">
            <div 
              onClick={() => setShowCourseDropdown(!showCourseDropdown)}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(10, 165, 183, 0.1)' }}>
                    <BookOpen size={24} style={{ color: '#0aa5b7' }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                  </div>
                </div>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform ${showCourseDropdown ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
            
            {/* Courses Dropdown */}
            {showCourseDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-96 overflow-y-auto">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course.id)}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.code}</h3>
                        <p className="text-sm text-gray-600">{course.name}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            <Users size={14} className="inline mr-1" />
                            {course.students} students
                          </span>
                          <span className="text-xs text-gray-500">
                            {course.credits} credits
                          </span>
                        </div>
                      </div>
                      <ChevronDown size={16} className="text-gray-400 -rotate-90" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {certificates.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <FileText size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Assignments Due</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200">
            {[
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
                <tab.icon size={20} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Certificate Approvals Tab */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Certificate Approvals</h2>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={20} />
                <span>Filter</span>
              </button>
            </div>

            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Student</p>
                      <p className="font-semibold text-gray-900">{cert.studentName}</p>
                      <p className="text-sm text-gray-500">{cert.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Certificate Type</p>
                      <p className="font-semibold text-gray-900">{cert.type}</p>
                      <p className="text-sm text-gray-500">{cert.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Submission Date</p>
                      <p className="font-semibold text-gray-900">{cert.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cert.status)}`}>
                        {cert.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye size={16} />
                      <span>View Document</span>
                    </button>
                    {cert.status === 'pending' && (
                      <div className="flex space-x-2 ml-auto">
                        <button
                          onClick={() => handleCertificateAction(cert.id, 'approved')}
                          className="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                          style={{ background: '#0aa5b7' }}
                        >
                          <CheckCircle size={16} className="inline mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleCertificateAction(cert.id, 'rejected')}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={16} className="inline mr-2" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Assignments & Submissions</h2>
              <button className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ background: '#0aa5b7' }}>
                Create New Assignment
              </button>
            </div>

            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">Due Date: {assignment.dueDate}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{assignment.submitted}</p>
                      <p className="text-sm text-gray-600">Submitted</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">{assignment.pending}</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{assignment.total}</p>
                      <p className="text-sm text-gray-600">Total</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" style={{ background: '#0aa5b7' }}>
                    View Submissions
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Student Grades</h2>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={20} />
                <span>Export Grades</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Roll No</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student Name</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Midterm</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Assignment</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Project</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Attendance</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => {
                    const total = Math.round((grade.midterm * 0.3 + grade.assignment * 0.2 + grade.project * 0.3 + grade.attendance * 0.2));
                    const gradeStr = total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : 'D';
                    return (
                      <tr key={grade.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-900">{grade.rollNo}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{grade.studentName}</td>
                        <td className="py-4 px-4 text-sm text-center text-gray-900">{grade.midterm}</td>
                        <td className="py-4 px-4 text-sm text-center text-gray-900">{grade.assignment}</td>
                        <td className="py-4 px-4 text-sm text-center text-gray-900">{grade.project}</td>
                        <td className="py-4 px-4 text-sm text-center text-gray-900">{grade.attendance}</td>
                        <td className="py-4 px-4 text-sm text-center font-semibold text-gray-900">{total}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold" style={{ background: '#0aa5b7', color: 'white' }}>
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
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
