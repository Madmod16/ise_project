function TutorConvertor(tutorsArray){
    const tutors = []
    tutorsArray.forEach(tutorToConvert =>{
        tutors.push({
            Id : tutorToConvert._id,
            SupervisorId : tutorToConvert._id,
            Name : tutorToConvert.Name,
            Surname : tutorToConvert.Surname,
            Specialization : tutorToConvert.Specialization,
            Accreditation : tutorToConvert.Accreditation
        })
    })
    return tutors;
}

module.exports = { TutorConvertor }