module.exports = (sequelize, DataTypes) => {
  const IsTaughtBy = sequelize.define(
    "IsTaughtBy",
    {
      TutorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Tutor",
          key: "Id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      CourseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Course",
          key: "Id",
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
