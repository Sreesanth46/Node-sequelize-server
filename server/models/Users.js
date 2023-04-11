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
            type: DataTypes.STRING(100),
            
        },
        lastName: {
            type: DataTypes.STRING(100),
  
        },
        nickName: {
            type: DataTypes.STRING(100),
        },
        profilePic: {
            type: DataTypes.STRING,
        },
        department: {
            type: DataTypes.STRING(100),
        },
        jobTitle: {
            type: DataTypes.STRING(100),
        },
        phone: {
            type: DataTypes.STRING(50),
     
        },
        disclosure: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            validate: {
                notEmpty: true
            }
        },
        disallowCollaboration: {
            type: DataTypes.TINYINT,
        },
        profileEditing: {
            type: DataTypes.TINYINT,
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
            as: 'auth',
            onDelete: "cascade"
        });

        Users.hasMany(models.workspace_admin, {
            foreignKey: 'userId',
            // as: 'workspace_admin',
            onDelete: "cascade"
        });

        Users.hasMany(models.project_member, {
            foreignKey: 'userId',
            // as: 'project_member',
            onDelete: "cascade"
        });

        Users.hasMany(models.comment, {
            foreignKey: 'userId',
            // as: 'comment',
            onDelete: "cascade"
        });

        Users.hasMany(models.comment_annotation, {
            foreignKey: 'userId',
            // as: 'comment_annotation',
            onDelete: "cascade"
        });
    };

    return Users
}