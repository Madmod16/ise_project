module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      CourseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      ProgramID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Program",
          key: "ProgramID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      Field: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      CourseName: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    },
    {
      tableName: "Course",
      timestamps: false,
    }
  );

  return Course;
};
