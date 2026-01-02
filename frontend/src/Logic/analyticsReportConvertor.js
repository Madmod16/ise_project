
function ReportConvertor(reportArray){
    const members = []
    reportArray.forEach(memberToConvert =>{
        memberToConvert.students_in_program.forEach(student =>{
            let convertedCourses = []
            student.enrolled_courses.forEach(courses =>{
                convertedCourses.push(courses.course_name)
            })
            members.push({
                ProgramID : memberToConvert._id,
                ProgramName : memberToConvert.program_name,
                StudentID : student.student_data.student_id,
                StudentName : student.name.firstname + " " + student.name.lastname,
                TotalProgramIncome : student.total_paid,
                CoursesInProgram : convertedCourses.length,
                CourseList : convertedCourses
        })
    })})
    return members;
}

module.exports = { ReportConvertor }