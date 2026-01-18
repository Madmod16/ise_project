const db = require("../mongoDB")
const { Member, UniversityStudent, PrivateCustomer, Enrollment, Payment, Program, Course, Tutor, Module, IsTaughtBy } = require('../models')
const dbo = db.getDb();

const createCollections = () =>{
    dbo.createCollection("courses", function(err, res) {
        if (err) throw err;
        console.log("Collection courses created!");
    });

    dbo.createCollection("members", function(err, res) {
        if (err) throw err;
        console.log("Collection members created!");
    });

    dbo.createCollection("programs", function(err, res) {
        if (err) throw err;
        console.log("Collection programs created!");
    });

    dbo.createCollection("tutors", function(err, res) {
        if (err) throw err;
        console.log("Collection tutors created!");
    });
}

const checkIfMongoDBIsActive = async (err, res) =>{
    const record = await dbo.collection("members").findOne();
    const result = record === null ? false : true
    res.status(200).json(result);
}

const migrateMembers = async () =>{
    const membersCollection = db.getDb().collection('members');
    await membersCollection.deleteMany({})
    members = {}
    const students = await UniversityStudent.findAll({
        include : [{
            model: Member,
            required: true,
        }]
    })

    const students_info = await UniversityStudent.findAll({
        include : [{
            model: Member,
            required: true,
            include : [{
            model: Enrollment,
            required: true,
                include : [{
                    model: Payment,
                    required: true,
                },
                {
                    model: Course,
                    required: true,
                    include : [{
                        model: Program,
                        required: true
                    }]
                }   
                ],
            }]
        }]
    })

    const customers = await PrivateCustomer.findAll({
        include : [{
            model: Member,
            required: true,
        }]
    })

    const customers_info = await PrivateCustomer.findAll({
        include : [{
            model: Member,
            required: true,
            include : [{
            model: Enrollment,
            required: true,
                include : [{
                    model: Payment,
                    required: true,
                },
                {
                    model: Course,
                    required: true,
                    include : [{
                        model: Program,
                        required: true
                    }]
                }   
                ],
            }]
        }]
    })

    const studentData = students.map(s => s.get({ plain: true }));
    const studentInfoData = students_info.map(s => s.get({ plain: true }));
    const customersData = customers.map(s => s.get({ plain: true }));
    const customersInfoData = customers_info.map(s => s.get({ plain: true }));

    studentData.forEach(student =>{
        if(!members[student.MemberId]){
            members[student.MemberId] = {
                _id: student.MemberId,
                type: "student",
                member: {firstname: student.Member.Name, lastname: student.Member.Surname, age: student.Member.Age},
                student: {student_id: student.StudentID, degree: student.Degree},
                Enrollments: []
            };
        }
    })

    studentInfoData.forEach(student =>{
        if(student.Member.Enrollments){
            student.Member.Enrollments.forEach((enrollment) => {
            members[student.MemberId].Enrollments.push({
                ProgramID: enrollment.Course.Program.Id,
                CourseID: enrollment.Course.Id,
                EnrollDate: enrollment.Date,
                Validity : enrollment.Validity,
                Payment: {
                    Amount: enrollment.Payment.Amount,
                    PayDate: enrollment.Payment.PayDate,
                    Discount: enrollment.Payment.Discount
                }
                });
            });
        }
    })

    customersData.forEach(customer =>{
        if(!members[customer.Member.Id]){
            members[customer.Member.Id] = {
                _id: customer.Member.Id,
                type: "customer",
                member: {firstname: customer.Member.Name, lastname: customer.Member.Surname, age: customer.Member.Age},
                customer: {company_name: customer.Company, occupation: customer.Occupation},
                Enrollments: []
            };
        }
    })

    customersInfoData.forEach(customer =>{
         if(customer.Member.Enrollments){
            customer.Member.Enrollments.forEach((enrollment) => {
            members[customer.Id].Enrollments.push({
                ProgramID: enrollment.Course.Program.Id,
                CourseID: enrollment.Course.Id,
                EnrollDate: enrollment.Date,
                Validity : enrollment.Validity,
                Payment: {
                    Amount: enrollment.Payment.Amount,
                    PayDate: enrollment.Payment.PayDate}
            });
        });
        }
    })

    await membersCollection.insertMany(Object.values(members), (err, res) => {
        if (err) throw err;
        console.log('Data migrated to MongoDB');
    });
}

const migrateProgram = async () =>{
    const membersCollection = db.getDb().collection('programs');
    await membersCollection.deleteMany({})
    mongo_programs = {}

    const programs = await Program.findAll({})
    const programsData = programs.map(s => s.get({ plain: true }));

    const courses = await Course.findAll({})
    const coursesData = courses.map(s => s.get({ plain: true }));

    programsData.forEach(program =>{
        if(!mongo_programs[program.Id]){
            mongo_programs[program.Id] = {
                _id: program.Id,
                program_name: program.Name,
                duration: program.Duration,
                courses : []
            };

            coursesData.forEach(course =>{
            if(course.ProgramId === program.Id){
            mongo_programs[program.Id].courses.push({
                CourseID : course.Id
                    })
                }
            })
        }
    })

    await membersCollection.insertMany(Object.values(mongo_programs), (err, res) => {
        if (err) throw err;
        console.log('Data migrated to MongoDB');
    });
}

const migrateCourses = async () =>{
    const membersCollection = db.getDb().collection('courses');
    await membersCollection.deleteMany({})
    mongo_courses = {}
    const courses = await Course.findAll({
        include : [
            {
                model : Module,
                required: true
            },
            {
                model: Tutor,
                as: "Tutors",
            }
        ]
    })

    const coursesData = courses.map(s => s.get({ plain: true }));

    coursesData.forEach(course =>{
        if(!mongo_courses[course.Id]){
            mongo_courses[course.Id] = {
                _id: course.Id,
                program_id: course.ProgramId,
                course_name: course.Name,
                Field: course.Field,
                Price: course.Price,
                Modules: [],
                Tutors: []
            };
        }
        if(course.Modules){
            course.Modules.forEach((module) => {
                mongo_courses[course.Id].Modules.push({
                    _id : module.ModuleId,
                    name : module.Name,
                    subject : module.Subject
                })
            })
        }
        if(course.Tutors){
        course.Tutors.forEach((tutor) => {
            mongo_courses[course.Id].Tutors.push({
                    tutor_id : tutor.Id
                });
            });
        }
    })

    await membersCollection.insertMany(Object.values(mongo_courses), (err, res) => {
        if (err) throw err;
        console.log('Data migrated to MongoDB');
    });
}

const migrateTutors = async () =>{
    const tutorsCollection = db.getDb().collection('tutors');
    tutorsCollection.deleteMany({})
    mongo_tutors = {}

    const tutors = await Tutor.findAll({
        include : [
        {
            model: Course,
            as: "Courses",
        }
    ]
    })

    const tutorsData = tutors.map(t => t.get({ plain: true }));

    tutorsData.forEach(tutuor =>{
        if(!mongo_tutors[tutuor.Id]){
            mongo_tutors[tutuor.Id] = {
                _id: tutuor.Id,
                supervisor_id: tutuor.SupervisorId,
                Name: tutuor.Name,
                Surname: tutuor.Surname,
                Specialization: tutuor.Specialization,
                Accreditation : tutuor.Accreditation,
                Courses : []
            };
        }
        if(tutuor.Courses){
        tutuor.Courses.forEach((course) => {
            mongo_tutors[tutuor.Id].Courses.push({
                    CourseID : course.Id
                });
            });
        }
    })

    tutorsCollection.insertMany(Object.values(mongo_tutors), (err, res) => {
        if (err) throw err;
        console.log('Data migrated to MongoDB');
    });
}

module.exports = {createCollections, migrateMembers, migrateProgram, migrateCourses, checkIfMongoDBIsActive, migrateTutors}
