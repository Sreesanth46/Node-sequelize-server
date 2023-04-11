module.exports = (sequelize, DataTypes) => {
    const ProjectMember = sequelize.define("project_member", {
        addEditItem: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        deleteItem: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        postComment: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        deleteComment: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        editLabel: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        notification: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
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

    ProjectMember.associate = (models) => {
        ProjectMember.hasMany(models.item_master, {
            foreignKey: 'projectMemberId',
            // as: 'item_master',
            onDelete: "cascade"
        });

        ProjectMember.hasMany(models.comment, {
            foreignKey: 'projectMemberId',
            // as: 'comment',
            onDelete: "cascade"
        });

        ProjectMember.hasMany(models.comment_annotation, {
            foreignKey: 'projectMemberId',
            // as: 'comment_annotation',
            onDelete: "cascade"
        });
    };
    
    return ProjectMember;
}