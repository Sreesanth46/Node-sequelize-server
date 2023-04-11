module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("user_master", {
        accountId: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        nickName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        profilePic: {
            type: DataTypes.STRING,
        },
        department: {
            type: DataTypes.STRING,
        },
        jobTitle: {
            type: DataTypes.STRING(100),
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        disclosure: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            validate: {
                notEmpty: true
            }
        },
        disallowCollabration: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            validate: {
                notEmpty: true
            }
        },
        profileEditing: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            validate: {
                notEmpty: true
            }
        },
        downloadLink: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            validate: {
                notEmpty: true
            }
        },
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            validate: {
                notEmpty: true
            }
        },
    })
    
    Users.associate = (models) => {
        Users.hasOne(models.login_master, {
            foreignKey: 'userId',
            // as: 'login_master',
            onDelete: "cascade"
        })
    };

    return Users
}