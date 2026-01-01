
function MemberConvertor(membersArray){
    const members = []
    membersArray.forEach(memberToConvert =>{
        members.push({
            MemberID : memberToConvert._id,
            MemberName : memberToConvert.member.firstname,
            MemberSurname : memberToConvert.member.lastname,
            MemberAge : memberToConvert.member.age,
            type : memberToConvert.type
        })
    })
    return members;
}

module.exports = { MemberConvertor }