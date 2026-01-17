
function ProgramConvertor(programsArray){
    const members = []

    programsArray.forEach(programToConvert =>{
        const courses = []
        programToConvert.enrolled_courses.forEach(course =>{
            courses.push({
                Id : programToConvert._id,
                CourseID : course._id,
                Name : course.course_name,
                Field : course.Field,
                Price : course.Price
            })
        })
        members.push({
            Id : programToConvert._id,
            Name : programToConvert.program_name,
            Duration : programToConvert.duration,
            Courses : courses
        })
    })
    return members;
}

module.exports = { ProgramConvertor }