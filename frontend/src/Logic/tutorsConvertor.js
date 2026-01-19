export function TutorConvertor(tutorsArray) {
    const tutors = [];

    (tutorsArray || []).forEach((t) => {
        const rawCoursesTaught = Array.isArray(t?.coursesTaught) ? t.coursesTaught : [];
        const rawCoursesRefs = Array.isArray(t?.Courses) ? t.Courses : [];

        const courses = [];

        if (rawCoursesTaught.length > 0) {
            rawCoursesTaught.forEach((course) => {
                const courseId =
                    course?._id ?? course?.CourseID ?? course?.CourseId ?? course?.id ?? course;

                courses.push({
                    CourseID: courseId != null ? String(courseId) : undefined,
                    Name: course?.course_name ?? course?.CourseName ?? course?.name ?? "(no name)",
                    Field: course?.Field ?? course?.field ?? "-",
                    Price: course?.Price ?? course?.price ?? 0,
                });
            });
        } else {
            rawCoursesRefs.forEach((ref) => {
                const courseId = ref?.CourseID ?? ref?.courseId ?? ref?._id ?? ref?.Id ?? ref?.id ?? ref;
                courses.push({
                    CourseID: courseId != null ? String(courseId) : undefined,
                    Name: courseId != null ? `Course ${String(courseId)}` : "(no name)",
                    Field: "-",
                    Price: 0,
                });
            });
        }

        tutors.push({
            Id: t?._id != null ? String(t._id) : t?.Id != null ? String(t.Id) : undefined,
            SupervisorId: t?.supervisor_id ?? t?.SupervisorId ?? null,
            Name: t?.Name ?? t?.name ?? "",
            Surname: t?.Surname ?? t?.surname ?? "",
            Specialization: t?.Specialization ?? t?.specialization ?? "-",
            Accreditation: t?.Accreditation ?? t?.accreditation ?? "-",
            coursesTaught: courses,
            _raw: t,
        });
    });

    return tutors;
}
