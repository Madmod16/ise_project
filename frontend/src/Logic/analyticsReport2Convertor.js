function ReportConvertor(courseArray) {
    const reportData = [];

    courseArray.forEach(course => {
        const moduleList = course.modules.map(module => module.name);

        reportData.push({
            CourseID: course._id,
            CourseName: course.name,
            Field: course.field,
            Price: course.price,
            TutorID: course.tutor_id,
            TotalModules: course.modules.length,
            ModuleList: moduleList,
            DesignType: "Embedded-Modules/Referenced-Tutor"
        });
    });

    return reportData;
}

module.exports = { ReportConvertor };