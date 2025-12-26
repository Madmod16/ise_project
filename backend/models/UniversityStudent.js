module.exports = (sequelize, DataTypes) => {
  const UniversityStudent = sequelize.define(
    "UniversityStudent",
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
      StudentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      Degree: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
    },
    {
      tableName: "UniversityStudent",
      timestamps: false,
    }
  );

  return UniversityStudent;
};