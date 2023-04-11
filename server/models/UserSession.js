module.exports = (sequelize, DataTypes) => {
    const UserSession = sequelize.define("user_session", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        idToken: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        loginTime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    })

    return UserSession;
}