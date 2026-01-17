
function MemberConvertor(reportArray){
    const members = []
    reportArray.forEach(memberToConvert =>{
        members.push({
            Id : memberToConvert.enrolled_courses.program_details._id,
            Name : memberToConvert.enrolled_courses.program_details._id,
            Surname : memberToConvert.member.lastname,
            Age : memberToConvert.member.age,
            type : memberToConvert.type
        })
    })
    return members;
}

module.exports = { MemberConvertor }