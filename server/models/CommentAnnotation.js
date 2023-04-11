module.exports = (sequelize, DataTypes) => {
    const CommentAnnotation = sequelize.define("comment_annotation", {
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        jsonData: {
            type: DataTypes.TEXT('long'),
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

    CommentAnnotation.associate = (models) => {
        CommentAnnotation.hasMany(models.comment_annotation, {
            foreignKey: 'parentId',
            // as: 'comment_annotation',
            onDelete: "cascade"
        });
    };
    
    return CommentAnnotation;
}