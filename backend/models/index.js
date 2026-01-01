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

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Program = require('./Program')(sequelize, Sequelize);
db.Course = require('./Course')(sequelize, Sequelize);
db.Member = require('./Member')(sequelize, Sequelize);
db.UniversityStudent = require('./UniversityStudent')(sequelize, Sequelize);
db.PrivateCustomer = require('./PrivateCustomer')(sequelize, Sequelize);
db.Enrollment = require('./Enrollment')(sequelize, Sequelize);
db.Payment = require('./Payment')(sequelize, Sequelize)

db.Program.hasMany(db.Course, { foreignKey: 'ProgramID' });
db.Course.belongsTo(db.Program, { foreignKey: 'ProgramID' });

db.Member.hasOne(db.UniversityStudent, { foreignKey: 'MemberID' });
db.UniversityStudent.belongsTo(db.Member, { foreignKey: 'MemberID' });

db.Member.hasOne(db.PrivateCustomer, { foreignKey: 'MemberID' });
db.PrivateCustomer.belongsTo(db.Member, { foreignKey: 'MemberID' });

db.Member.hasMany(db.Enrollment, { foreignKey: 'MemberID' });
db.Enrollment.belongsTo(db.Member, { foreignKey: 'MemberID' });

db.Course.hasOne(db.Enrollment, { foreignKey: 'CourseID' });
db.Enrollment.belongsTo(db.Course, { foreignKey: 'CourseID' });

db.Enrollment.hasOne(db.Payment, { foreignKey: 'EnrollmentID' });
db.Payment.belongsTo(db.Enrollment, { foreignKey: 'EnrollmentID' });

module.exports = db;
