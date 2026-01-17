
function MemberConvertor(membersArray){
    const members = []
    membersArray.forEach(memberToConvert =>{
        members.push({
            Id : memberToConvert._id,
            Name : memberToConvert.member.firstname,
            Surname : memberToConvert.member.lastname,
            Age : memberToConvert.member.age,
            type : memberToConvert.type
        })
    })
    return members;
}

module.exports = { MemberConvertor }