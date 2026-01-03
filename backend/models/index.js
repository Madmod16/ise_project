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

if (db.Program && db.Course) {
  db.Program.hasMany(db.Course, { foreignKey: "ProgramId", as: "Courses" });
  db.Course.belongsTo(db.Program, { foreignKey: "ProgramId", as: "Program" });
}

if (db.Course && db.Module) {
  db.Course.hasMany(db.Module, { foreignKey: "CourseId", as: "Modules" });
  db.Module.belongsTo(db.Course, { foreignKey: "CourseId", as: "Course" });
}

if (db.Member && db.PrivateCustomer) {
  db.Member.hasOne(db.PrivateCustomer, { foreignKey: "Id", as: "PrivateCustomer" });
  db.PrivateCustomer.belongsTo(db.Member, { foreignKey: "Id", as: "Member" });
}

if (db.Member && db.UniversityStudent) {
  db.Member.hasOne(db.UniversityStudent, { foreignKey: "Id", as: "UniversityStudent" });
  db.UniversityStudent.belongsTo(db.Member, { foreignKey: "Id", as: "Member" });
}

if (db.Member && db.Enrollment) {
  db.Member.hasMany(db.Enrollment, { foreignKey: "MemberId", as: "Enrollments" });
  db.Enrollment.belongsTo(db.Member, { foreignKey: "MemberId", as: "Member" });
}

if (db.Course && db.Enrollment) {
  db.Course.hasMany(db.Enrollment, { foreignKey: "CourseId", as: "Enrollments" });
  db.Enrollment.belongsTo(db.Course, { foreignKey: "CourseId", as: "Course" });
}

if (db.Enrollment && db.Payment) {
  db.Enrollment.hasOne(db.Payment, { foreignKey: "EnrollmentId", as: "Payment" });
  db.Payment.belongsTo(db.Enrollment, { foreignKey: "EnrollmentId", as: "Enrollment" });
}

if (db.Tutor && db.Course && db.IsTaughtBy) {
  db.Tutor.belongsToMany(db.Course, {
    through: db.IsTaughtBy,
    foreignKey: "TutorId",
    otherKey: "CourseId",
    as: "Courses",
  });

  db.Course.belongsToMany(db.Tutor, {
    through: db.IsTaughtBy,
    foreignKey: "CourseId",
    otherKey: "TutorId",
    as: "Tutors",
  });
}

module.exports = db;
