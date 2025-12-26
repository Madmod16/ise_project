module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    "Member",
    {
      MemberID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      MemberName: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      MemberSurname: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      MemberAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 18, // MemberAge > 17
        },
      },
    },
    {
      tableName: "Member",
      timestamps: false,
    }
  );

  return Member;
};