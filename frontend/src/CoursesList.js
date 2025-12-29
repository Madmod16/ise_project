import axios from 'axios'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function CoursesList() {
  const [listOfPrograms, setlistOfProgram] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const location = useLocation();
  const selectedMember = location.state?.selectedMember;

  useEffect(() =>{
    axios.get("http://localhost:3001/program").then((resp)=>{
      setlistOfProgram(resp.data)
    })
  }, [])

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
      console.log(enrollmentId)
      console.log(member.type)
      console.log(course.Price)
      const responsePayment = await axios.post("http://localhost:3001/payment",
          {
            EnrollmentID : enrollmentId,
            Type : member.type,
            Price : course.Price
          }
      )
      console.log("Enrollment created:", responsePayment.data)
    } catch (error) {
      console.error("Enrollment failed:", error)
    }
  }

  const handleCourseSelection = (course) => {
    setSelectedOption(course);
  };
  

  return ( 
  <div>
      <h3> {selectedMember.MemberSurname + " " + selectedMember.MemberName} </h3>
      <h2> Programs </h2>
      <div classProgram="program-grid">
        {listOfPrograms.map((program) => (
          <div
            key={program.ProgramID}
          >
            <h3>{program.ProgramName}</h3>
            <p>Duration: {program.Duration}</p>
            <div classProgram="course-grid">
              {program.Courses.map((courses) => (
              <div
                key={courses.CourseID}
                onClick={() => handleCourseSelection(courses)}
              >
                <h4>{courses.CourseName}</h4>
                <p>Field: {courses.Field}</p>
                <p>Price: {courses.Price}</p>
             </div>
            ))}
            </div>
          </div>
        ))}
      </div>
      {selectedOption && selectedMember && (
        <div className="selection-info-course">
          <p>Selected Course: {selectedOption.CourseName}</p>
          <button onClick={() => handleButton(selectedMember, selectedOption)}>
            Continue
          </button>
        </div>
      )}
  </div>
  );
}

export default CoursesList;