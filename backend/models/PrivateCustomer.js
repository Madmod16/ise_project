module.exports = (sequelize, DataTypes) => {
  const PrivateCustomer = sequelize.define(
    "PrivateCustomer",
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
      Occupation: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      CompanyName: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
    },
    {
      tableName: "PrivateCustomer",
      timestamps: false,
    }
  );

  return PrivateCustomer;
};
