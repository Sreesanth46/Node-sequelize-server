module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("comment", {
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        file: {
            type: DataTypes.STRING,
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

    Comment.associate = (models) => {
        Comment.hasMany(models.comment, {
            foreignKey: 'parentId',
            // as: 'comment',
            onDelete: "cascade"
        });
    };
    
    return Comment;
}