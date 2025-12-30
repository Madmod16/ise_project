import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CoursesList.css'

function CoursesList() {
  const [listOfPrograms, setlistOfProgram] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedMember = location.state?.selectedMember;

  useEffect(() =>{
    axios.get("http://localhost:3001/program").then((resp)=>{
      setlistOfProgram(resp.data)
    })
  }, [])

  const handleProceed = () => {
    navigate('/AnalyticsReportStudent1', { 
      state: { ProgramID: selectedProgram.ProgramID} 
    });
  };

  const handleButton = async (member, course) =>{
    try {
      const responseEnrollment = await axios.post("http://localhost:3001/enrollment",
          {
            MemberID : member.MemberID,
            CourseID : course.CourseID
          }
      )
      console.log("Enrollment created:", responseEnrollment.data)
      const enrollmentId = await responseEnrollment.data.enrollment.EnrollmentID;
      const responsePayment = await axios.post("http://localhost:3001/payment",
          {
            EnrollmentID : enrollmentId,
            Type : member.type,
            Price : course.Price
          }
      )
      console.log("Payment created:", responsePayment.data)
    } catch (error) {
      console.error("Enrollment failed:", error)
    }
  }

  const handleCourseSelection = (course) => {
    setSelectedOption(course);
  };

  const handleProgramSelection = (program) => {
    setSelectedProgram(program);
  };

  return ( 
  <div className="member-selection-container">
  <div className="member-header">
    <h3>{selectedMember.MemberSurname} {selectedMember.MemberName}</h3>
  </div>

  <h2 className="section-title">Programs</h2>
  
  <div className="program-grid">
    {listOfPrograms.map((program) => (
      <div
        key={program.ProgramID}
        className={`program-card ${selectedProgram?.ProgramID === program.ProgramID ? 'selected' : ''}`}
        onClick={() => handleProgramSelection(program)}
      >
        <div className="program-header">
          <h3>{program.ProgramName}</h3>
          <span className="duration-badge">Duration: {program.Duration}</span>
        </div>

        <div className="course-grid">
          {program.Courses.map((course) => (
            <div
              key={course.CourseID}
              className={`course-card ${selectedOption?.CourseID === course.CourseID ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent program selection when clicking course
                handleCourseSelection(course);
              }}
            >
              <h4>{course.CourseName}</h4>
              <div className="course-details">
                <span className="field-tag">{course.Field}</span>
                <span className="price-tag">${course.Price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

  {selectedOption && (
    <div className="selection-info-course">
      <div className="selection-content">
        <p><strong>Selected Course:</strong> {selectedOption.CourseName}</p>
        <button className="continue-btn" onClick={() => handleButton(selectedMember, selectedOption)}>
          Continue with Course
        </button>
      </div>
    </div>
  )}

  {selectedProgram && (
    <div className="selection-analytics-report">
      <div className="selection-content">
        <p><strong>Selected Program:</strong> {selectedProgram.ProgramName}</p>
        <button className="continue-btn analytics" onClick={handleProceed}>
          View Analytics Report
        </button>
      </div>
    </div>
  )}
</div>
  );
}

export default CoursesList;