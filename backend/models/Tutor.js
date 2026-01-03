module.exports = (sequelize, DataTypes) => {
    const Tutor = sequelize.define(
        "Tutor",
        {
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            SupervisorId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Tutor",
                    key: "Id",
                },
                onUpdate: "CASCADE",
            },
            Name: {
                type: DataTypes.STRING(80),
                allowNull: false,
            },
            Surname: {
                type: DataTypes.STRING(80),
                allowNull: false,
            },
            Specialization: {
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
