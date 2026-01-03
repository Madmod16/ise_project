module.exports = (sequelize, DataTypes) => {
    const Module = sequelize.define(
        "Module",
        {
            CourseId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "Course",
                    key: "Id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            ModuleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            Name: {
                type: DataTypes.STRING(80),
                allowNull: false,
            },
            Subject: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        {
            tableName: "Module",
            timestamps: false,
        }
    );

    return Module;
};
