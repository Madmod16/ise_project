module.exports = (sequelize, DataTypes) => {
  const Tutor = sequelize.define(
    "Tutor",
    {
      TutorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      SupervisorID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Tutor",
          key: "TutorID",
        },
        onUpdate: "CASCADE",
        // NOTE: your SQL doesn't specify ON DELETE; default is usually RESTRICT/NO ACTION
      },
      TutorName: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      TutorSurname: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      Specialisation: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      Accreditation: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
    },
    {
      tableName: "Tutor",
      timestamps: false,
    }
  );

  return Tutor;
};
