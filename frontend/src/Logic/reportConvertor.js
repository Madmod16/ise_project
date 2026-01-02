
function MemberConvertor(reportArray){
    const members = []
    reportArray.forEach(memberToConvert =>{
        members.push({
            ProgramID : memberToConvert.enrolled_courses.program_details._id,
            ProgramName : memberToConvert.enrolled_courses.program_details._id,
            MemberSurname : memberToConvert.member.lastname,
            MemberAge : memberToConvert.member.age,
            type : memberToConvert.type
        })
    })
    return members;
}

module.exports = { MemberConvertor }