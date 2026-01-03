module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define(
    "Enrollment",
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      MemberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Member",
          key: "Id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      CourseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Course",
          key: "Id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },

      Date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      Validity: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: "Enrollment",
      timestamps: false,

      indexes: [
        {
          unique: true,
          fields: ["MemberId", "CourseId"],
        },
      ],
    }
  );

  return Enrollment;
};
