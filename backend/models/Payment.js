module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      EnrollmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "Enrollment",
          key: "Id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      PayDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      Amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },

      Discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      tableName: "Payment",
      timestamps: false,

      validate: {
        discountNotGreaterThanPrice() {
          if (this.Discount > this.Price) {
            throw new Error("Discount cannot be greater than the price");
          }
        },
      },
    }
  );

  return Payment;
};
