module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("project_master", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        outline: {
            type: DataTypes.STRING,
        },
        file: {
            type: DataTypes.STRING,
        },
        assigneeFlag: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        dueDateFlag: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        priorityFlag: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        stepFag: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        tagsFlag: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        memoFlag: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        displayNameFlag: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        companyNameFlag: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        departmentNameFlag: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        companyCodeFlag: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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

    Project.associate = (models) => {
        Project.hasMany(models.project_member, {
            foreignKey: 'projectId',
            as: 'projectMember',
            onDelete: "cascade"
        });

        Project.hasMany(models.item_master, {
            foreignKey: 'projectId',
            as: 'items',
            onDelete: "cascade"
        });

        Project.belongsTo(models.workspace_master, {
            foreignKey: 'workspaceId',
            as: 'workspace',
        });
    };

    return Project;
}