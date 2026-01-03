'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 1) Modelle automatisch laden
fs.readdirSync(__dirname)
    .filter(file =>
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
    )
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });

// 2) Associations (FIXED)
if (db.Program && db.Course) {
  db.Program.hasMany(db.Course, { foreignKey: "ProgramId", as: "Courses" });
  db.Course.belongsTo(db.Program, { foreignKey: "ProgramId", as: "Program" });
}

if (db.Course && db.Module) {
  db.Course.hasMany(db.Module, { foreignKey: "CourseId", as: "Modules" });
  db.Module.belongsTo(db.Course, { foreignKey: "CourseId", as: "Course" });
}

if (db.Member && db.PrivateCustomer) {
  db.Member.hasOne(db.PrivateCustomer, { foreignKey: "MemberId", as: "PrivateCustomer" });
  db.PrivateCustomer.belongsTo(db.Member, { foreignKey: "MemberId", as: "Member" });
}

if (db.Member && db.UniversityStudent) {
  db.Member.hasOne(db.UniversityStudent, { foreignKey: "MemberId", as: "UniversityStudent" });
  db.UniversityStudent.belongsTo(db.Member, { foreignKey: "MemberId", as: "Member" });
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

// optional: falls du associate() Methoden in Models hast
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
