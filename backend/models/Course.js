module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      ProgramId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Program",
          key: "Id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      Name: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      Field: {
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
