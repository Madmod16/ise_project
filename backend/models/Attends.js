module.exports = (sequelize, DataTypes) => {
  const Attends = sequelize.define(
    "Attends",
    {
      MemberID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Member",
          key: "MemberID",
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
      tableName: "Attends",
      timestamps: false,
    }
  );

  return Attends;
};
