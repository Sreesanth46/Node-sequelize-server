module.exports = (sequelize, DataTypes) => {
    const ActionLog = sequelize.define("action_log", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        module: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    })

    return ActionLog;
}