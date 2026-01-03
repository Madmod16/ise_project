// models/index.js
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      dialect: "mariadb",
      logging: false,
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

/* -------------------- load ALL models -------------------- */
db.Program = require("./Program")(sequelize, DataTypes);
db.Course = require("./Course")(sequelize, DataTypes);
db.Tutor = require("./Tutor")(sequelize, DataTypes);
db.IsTaughtBy = require("./IsTaughtBy")(sequelize, DataTypes);

db.Module = require("./Module")(sequelize, DataTypes);
db.Member = require("./Member")(sequelize, DataTypes);
db.PrivateCustomer = require("./PrivateCustomer")(sequelize, DataTypes);
db.UniversityStudent = require("./UniversityStudent")(sequelize, DataTypes);
db.Enrollment = require("./Enrollment")(sequelize, DataTypes);
db.Payment = require("./Payment")(sequelize, DataTypes);

/* -------------------- associations (use correct FK names) -------------------- */
/**
 * IMPORTANT:
 * You told me: "überall ist id groß" -> ProgramID, CourseID, TutorID etc.
 * So foreignKeys must match your MODEL attributes / DB columns.
 *
 * If your Course model uses ProgramID, then foreignKey MUST be "ProgramID" (not ProgramId).
 */

// Program 1..N Course
if (db.Program && db.Course) {
  db.Program.hasMany(db.Course, { foreignKey: "ProgramID", sourceKey: "ProgramID", as: "Courses" });
  db.Course.belongsTo(db.Program, { foreignKey: "ProgramID", targetKey: "ProgramID", as: "Program" });
}

// Course 1..N Module (weak entity via composite PK)
if (db.Course && db.Module) {
  db.Course.hasMany(db.Module, { foreignKey: "CourseID", sourceKey: "CourseID", as: "Modules" });
  db.Module.belongsTo(db.Course, { foreignKey: "CourseID", targetKey: "CourseID", as: "Course" });
}

// Member 1..1 PrivateCustomer (subtype)
if (db.Member && db.PrivateCustomer) {
  db.Member.hasOne(db.PrivateCustomer, { foreignKey: "MemberID", sourceKey: "MemberID", as: "PrivateCustomer" });
  db.PrivateCustomer.belongsTo(db.Member, { foreignKey: "MemberID", targetKey: "MemberID", as: "Member" });
}

// Member 1..1 UniversityStudent (subtype)
if (db.Member && db.UniversityStudent) {
  db.Member.hasOne(db.UniversityStudent, { foreignKey: "MemberID", sourceKey: "MemberID", as: "UniversityStudent" });
  db.UniversityStudent.belongsTo(db.Member, { foreignKey: "MemberID", targetKey: "MemberID", as: "Member" });
}

// Member 1..N Enrollment
if (db.Member && db.Enrollment) {
  db.Member.hasMany(db.Enrollment, { foreignKey: "MemberID", sourceKey: "MemberID", as: "Enrollments" });
  db.Enrollment.belongsTo(db.Member, { foreignKey: "MemberID", targetKey: "MemberID", as: "Member" });
}

// Course 1..N Enrollment
if (db.Course && db.Enrollment) {
  db.Course.hasMany(db.Enrollment, { foreignKey: "CourseID", sourceKey: "CourseID", as: "Enrollments" });
  db.Enrollment.belongsTo(db.Course, { foreignKey: "CourseID", targetKey: "CourseID", as: "Course" });
}

// Enrollment 1..1 Payment (EnrollmentID UNIQUE in Payment)
if (db.Enrollment && db.Payment) {
  db.Enrollment.hasOne(db.Payment, { foreignKey: "EnrollmentID", sourceKey: "EnrollmentID", as: "Payment" });
  db.Payment.belongsTo(db.Enrollment, { foreignKey: "EnrollmentID", targetKey: "EnrollmentID", as: "Enrollment" });
}

// Many-to-many Tutor <-> Course via IsTaughtBy
if (db.Tutor && db.Course && db.IsTaughtBy) {
  db.Tutor.belongsToMany(db.Course, {
    through: db.IsTaughtBy,
    foreignKey: "TutorID",
    otherKey: "CourseID",
    as: "Courses",
  });

  db.Course.belongsToMany(db.Tutor, {
    through: db.IsTaughtBy,
    foreignKey: "CourseID",
    otherKey: "TutorID",
    as: "Tutors",
  });
}

module.exports = db;
