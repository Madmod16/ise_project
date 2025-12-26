module.exports = (sequelize, DataTypes) => {
  const Program = sequelize.define(
    "Program",
    {
      ProgramID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      ProgramName: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      Duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1, // Duration > 0
        },
      },
    },
    {
      tableName: "Program",
      timestamps: false,
    }
  );

  return Program;
};
