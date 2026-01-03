module.exports = (sequelize, DataTypes) => {
  const PrivateCustomer = sequelize.define(
    "PrivateCustomer",
    {
      MemberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Member",
          key: "Id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      Occupation: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      Company: {
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
