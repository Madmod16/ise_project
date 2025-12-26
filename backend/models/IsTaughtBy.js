module.exports = (sequelize, DataTypes) => {
  const IsTaughtBy = sequelize.define(
    "IsTaughtBy",
    {
      TutorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Tutor",
          key: "TutorID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      CourseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Course",
          key: "CourseID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "IsTaughtBy",
      timestamps: false,
    }
  );

  return IsTaughtBy;
};
