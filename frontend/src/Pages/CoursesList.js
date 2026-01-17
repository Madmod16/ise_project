import axios from 'axios'
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProgramConvertor } from '../Logic/programsConvertor'
import '../PagesCSS/CoursesList.css'

function CoursesList() {
  const [listOfPrograms, setlistOfProgram] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [noSQLMode, setNoSQLMode] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedMember = location.state?.selectedMember;

  useEffect(() =>{
    axios.get("http://localhost:3001/mongodb/check").then((resp)=>{
      setNoSQLMode(resp.data)
    })
  }, [])

  useEffect(() =>{
    if(noSQLMode){
      axios.get("http://localhost:3001/mongodb/mongoPrograms").then((resp)=>{
      const convertedData = ProgramConvertor(resp.data);
      setlistOfProgram(convertedData)
      console.log("The NoSQL mode is used")
      })
    }else{
      axios.get("http://localhost:3001/program").then((resp)=>{
      setlistOfProgram(resp.data)})
    }
  }, [noSQLMode])
  

  const handleProceed = () => {
    navigate('/AnalyticsReportStudent1', { 
      state: { ProgramID: selectedProgram.Id } 
    });
  };

  const handleMigrateDB = async () => {
  try {
      await axios.get("http://localhost:3001/mongodb/migrateAll");
      alert("Database migrated successfully!");
    } catch (error) {
      console.error("Migration failed:", error);
      alert("Migration failed. Check console for details.");
    }
  };

  const handleButton = async (member, course) =>{
    try {
      if(noSQLMode){
        await axios.post("http://localhost:3001/mongodb/mongoAddEnrollment",
          {
            MemberID : member.Id,
            CourseID : course.CourseID,
            ProgramID : course.Id,
            Type : member.type,
            Price : course.Price
          }
        )
      }
      else{
        const responseEnrollment = await axios.post("http://localhost:3001/enrollment",
          {
            MemberID : member.Id,
            CourseID : course.Id
          }
        )
        const enrollmentId = await responseEnrollment.data.enrollment.Id;
        const responsePayment = await axios.post("http://localhost:3001/payment",
          {
            EnrollmentID : enrollmentId,
            Type : member.type,
            Price : course.Price
          }
        )
      }
      
    } catch (error) {
      console.error("Enrollment failed:", error)
    }
  }

  const handleCourseSelection = (course) => {
    setSelectedOption(course);
  };

  const handleProgramSelection = (program) => {
    console.log(program)
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
        key={program.Id}
        className={`program-card ${selectedProgram?.Id === program.Id ? 'selected' : ''}`}
        onClick={() => handleProgramSelection(program)}
      >
        <div className="program-header">
          <h3>{program.Name}</h3>
          <span className="duration-badge">Duration: {program.Duration}</span>
        </div>

        <div className="course-grid">
          {program.Courses.map((course) => (
            <div
              key={course.Id}
              className={`course-card ${selectedOption?.Id === course.Id ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleCourseSelection(course);
              }}
            >
              <h4>{course.Name}</h4>
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
        <p><strong>Selected Course:</strong> {selectedOption.Name}</p>
        <button className="continue-btn" onClick={() => handleButton(selectedMember, selectedOption)}>
          Continue with Course
        </button>
      </div>
    </div>
  )}

  <div className="migrate-db-container">
  <button className="migrate-db-btn" onClick={handleMigrateDB}>
    Migrate DB
  </button>
  </div>


  {selectedProgram && (
    <div className="selection-analytics-report">
      <div className="selection-content">
        <p><strong>Selected Program:</strong> {selectedProgram.Name}</p>
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