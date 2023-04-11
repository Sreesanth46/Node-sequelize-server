module.exports = (sequelize, DataTypes) => {
    const LabelList = sequelize.define("label_list", {
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
            validate: {
                notEmpty: true
            }
        },
    })

    LabelList.associate = (models) => {
        LabelList.hasMany(models.comment_annotation, {
            foreignKey: 'labelListId',
            // as: 'comment_annotation',
            onDelete: "cascade"
        });
    };
    
    return LabelList;
}