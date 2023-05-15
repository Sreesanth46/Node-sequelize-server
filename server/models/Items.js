module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define("item_master", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        file: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        dueDate: {
            type: DataTypes.DATE,
        },
        priority: {
            type: DataTypes.TINYINT,
        },
        // Use case // works like array
        tag: {
            type: DataTypes.STRING,
        },
        memo: {
            type: DataTypes.TEXT('long'),
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

    Item.associate = (models) => {
        Item.hasMany(models.comment, {
            foreignKey: 'ItemId',
            // as: 'comment',
            onDelete: "cascade"
        });

        Item.hasMany(models.comment_annotation, {
            foreignKey: 'ItemId',
            // as: 'comment_annotation',
            onDelete: "cascade"
        });

        Item.belongsTo(models.project_master, {
            foreignKey: 'projectId',
            as: 'project'
        });

        Item.belongsTo(models.project_member, {
            foreignKey: 'projectMemberId',
            as: 'projectMember'
        });
    };

    return Item;
}