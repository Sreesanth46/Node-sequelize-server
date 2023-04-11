module.exports = (sequelize, DataTypes) => {
    const Workspace = sequelize.define("workspace_master", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        code: {
            type: DataTypes.STRING(100),
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

    Workspace.associate = (models) => {
        Workspace.hasMany(models.project_master, {
            foreignKey: 'workspaceId',
            // as: 'project_master',
            onDelete: "cascade"
        });

        Workspace.hasMany(models.workspace_admin, {
            foreignKey: 'workspaceId',
            // as: 'workspace_admin',
            onDelete: "cascade"
        })
    };
    
    return Workspace;
}