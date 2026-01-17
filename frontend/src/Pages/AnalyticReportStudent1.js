import axios from 'axios'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ReportConvertor } from '../Logic/analyticsReportConvertor'
import '../PagesCSS/AnalyticReportStudent1.css'


function AnalyticsReportStudent1() {
    const [resultsOfReport, setresultsOfReport] = useState([]);
    const [noSQLMode, setNoSQLMode] = useState(null);
    const location = useLocation();
    const selectedProgram = location.state?.ProgramID;

    useEffect(() =>{
    axios.get("http://localhost:3001/mongodb/check").then((resp)=>{
      setNoSQLMode(resp.data)
    })
    }, [])

    useEffect(() =>{
      if(noSQLMode){
        axios.post("http://localhost:3001/mongodb/mongoReport", {
            ProgramId : selectedProgram,
          }).then((resp)=>{
        const convertedData = ReportConvertor(resp.data);
        setresultsOfReport(convertedData)
        console.log(selectedProgram)
      })
      }
      else{
        axios.post("http://localhost:3001/program/student1Report",{
            ProgramId : selectedProgram,
          }).then((resp) => {setresultsOfReport(resp.data)})
      }
    }, [noSQLMode])

    return ( 
    <div className="analytics-container">
        <h2 className="report-title">Analytics Report</h2>
        <div className="report-grid">
        {resultsOfReport.map((report) => (
        <div key={report.StudentID} className="report-card">
            <div className="card-header">
            <h3>{report.ProgramName}</h3>
            <span className="program-id">ID: {report.ProgramID}</span>
        </div>
        
        <div className="card-body">
          <div className="student-info">
            <strong>Student:</strong> {report.StudentName}
            <span className="student-id">#{report.StudentID}</span>
        </div>
          
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-label">Courses Enrolled</span>
              <span className="stat-value">{report.CoursesInProgram}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Income</span>
              <span className="stat-value income">${report.TotalProgramIncome}</span>
            </div>
          </div>
          
          <div className="courses-section">
            <strong>Courses:</strong>
            <p className="course-list">{report.CourseList}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}

export default AnalyticsReportStudent1;