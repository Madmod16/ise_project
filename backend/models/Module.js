module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define(
    "Module",
    {
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
      ModuleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      ModuleName: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      TopicsCovered: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "Module",
      timestamps: false,
    }
  );

  return Module;
};
