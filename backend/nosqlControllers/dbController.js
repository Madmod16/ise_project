const db = require("../mongoDB")
const { Member, UniversityStudent, PrivateCustomer, Enrollment, Payment, Program, Course } = require('../models')
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
}

const checkIfMongoDBIsActive = async (err, res) =>{
    const record = await dbo.collection("members").findOne();
    res.status(200).json(record); 
    return record === null ? false : true
}

const migrateMembers = async () =>{
    const membersCollection = db.getDb().collection('members');
    membersCollection.deleteMany({})
    members = {}
    const students = await UniversityStudent.findAll({
        include : [{
            model: Member,
            required: true,
            include : [{
            model: Enrollment,
            required: true,
                    include : [{
                    model: Payment,
                    required: true
                }]
            }]
        }]
    })

    const studentData = students.map(s => s.get({ plain: true }));

    studentData.forEach(student =>{
        if(!members[student.MemberID]){
            members[student.MemberID] = {
                _id: student.MemberID,
                type: "student",
                member: {firstname: student.Member.MemberName, lastname: student.Member.MemberSurname, age: student.Member.MemberAge},
                student: {student_id: student.StudentID, degree: student.Degree},
                Enrollments: [],
                Payments: []
            };
        }
        if(student.Member.Enrollments){
            student.Member.Enrollments.forEach((enrollment) => {
            members[student.MemberID].Enrollments.push({
                CourseID: enrollment.CourseID,
                EnrollDate: enrollment.EnrollDate
            });

            if (enrollment.Payment) {
                members[student.MemberID].Payments.push({
                    CourseID: enrollment.CourseID,
                    Amount: enrollment.Payment.TotalAmount,
                    PayDate: enrollment.Payment.PayDate,
                    Discount: enrollment.Payment.Discount
                });
            }
        });
        }
    })

    const customers = await PrivateCustomer.findAll({
        include : [{
            model: Member,
            required: true,
            include : [{
            model: Enrollment,
            required: true,
                    include : [{
                    model: Payment,
                    required: true
                }]
            }]
        }]
    })

    const customersData = customers.map(s => s.get({ plain: true }));
    customersData.forEach(customer =>{
        if(!members[customer.MemberID]){
            members[customer.MemberID] = {
                _id: customer.MemberID,
                type: "customer",
                member: {firstname: customer.Member.MemberName, lastname: customer.Member.MemberSurname, age: customer.Member.MemberAge},
                customer: {company_name: customer.CompanyName, occupation: customer.Occupation},
                Enrollments: [],
                Payments: []
            };
        }
        if(customer.Member.Enrollments){
            customer.Member.Enrollments.forEach((enrollment) => {
            members[customer.MemberID].Enrollments.push({
                CourseID: enrollment.CourseID,
                EnrollDate: enrollment.EnrollDate
            });

            if (enrollment.Payment) {
                members[customer.MemberID].Payments.push({
                    CourseID: enrollment.CourseID,
                    Amount: enrollment.Payment.TotalAmount,
                    PayDate: enrollment.Payment.PayDate
                });
            }
        });
        }
    })

    membersCollection.insertMany(Object.values(members), (err, res) => {
        if (err) throw err;
        console.log('Data migrated to MongoDB');
    });
}

const migrateProgram = async () =>{
    const membersCollection = db.getDb().collection('programs');
    membersCollection.deleteMany({})
    mongo_programs = {}
    const programs = await Program.findAll({})
    const programsData = programs.map(s => s.get({ plain: true }));

    const courses = await Course.findAll({})
    const coursesData = courses.map(s => s.get({ plain: true }));

    programsData.forEach(program =>{
        if(!mongo_programs[program.ProgramID]){
            mongo_programs[program.ProgramID] = {
                _id: program.ProgramID,
                program_name: program.ProgramName,
                duration: program.Duration,
                courses : []
            };

            coursesData.forEach(course =>{
            if(course.ProgramID === program.ProgramID){
            mongo_programs[program.ProgramID].courses.push({
                CourseID : course.CourseID
                    })
                }
            })
        }
    })

    membersCollection.insertMany(Object.values(mongo_programs), (err, res) => {
        if (err) throw err;
        console.log('Data migrated to MongoDB');
    });
}

const migrateCourses = async () =>{
    const membersCollection = db.getDb().collection('courses');
    membersCollection.deleteMany({})
    mongo_courses = {}
    const courses = await Course.findAll({})

    const coursesData = courses.map(s => s.get({ plain: true }));

    coursesData.forEach(course =>{
        if(!mongo_courses[course.CourseID]){
            mongo_courses[course.CourseID] = {
                _id: course.CourseID,
                program_id: course.ProgramID,
                course_name: course.CourseName,
                Field: course.Field,
                Price: course.Price
            };
        }
    })

    membersCollection.insertMany(Object.values(mongo_courses), (err, res) => {
        if (err) throw err;
        console.log('Data migrated to MongoDB');
    });
}

module.exports = {createCollections, migrateMembers, migrateProgram, migrateCourses, checkIfMongoDBIsActive}
