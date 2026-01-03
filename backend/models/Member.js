module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define(
        "Member",
        {
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            Name: {
                type: DataTypes.STRING(80),
                allowNull: false,
            },
            Surname: {
                type: DataTypes.STRING(80),
                allowNull: false,
            },
            Age: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    min: 18,
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