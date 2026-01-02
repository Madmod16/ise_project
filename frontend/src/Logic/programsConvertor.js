
function ProgramConvertor(programsArray){
    const members = []

    programsArray.forEach(programToConvert =>{
        const courses = []
        programToConvert.enrolled_courses.forEach(course =>{
            courses.push({
                ProgramID : programToConvert._id,
                CourseID : course._id,
                CourseName : course.course_name,
                Field : course.Field,
                Price : course.Price
            })
        })
        members.push({
            ProgramID : programToConvert._id,
            ProgramName : programToConvert.program_name,
            Duration : programToConvert.duration,
            Courses : courses
        })
    })
    return members;
}

module.exports = { ProgramConvertor }