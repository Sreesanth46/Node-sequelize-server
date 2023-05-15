module.exports = (sequelize, DataTypes) => {
    return sequelize.define("notification_master", {
        message: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        fromDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        toDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                notEmpty: true
            }
        },
    })
}