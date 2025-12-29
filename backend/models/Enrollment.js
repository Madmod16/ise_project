module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define(
    "Enrollment",
    {
      EnrollmentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      MemberID: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        references: {
          model: "Course",
          key: "CourseID",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },

      EnrollDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      tableName: "Enrollment",
      timestamps: false,

      indexes: [
        {
          unique: true,
          fields: ["MemberID", "CourseID"],
        },
      ],
    }
  );

  return Enrollment;
};
