module.exports = (sequelize, DataTypes) => {
    const Label = sequelize.define("label", {
        name: {
            type: DataTypes.STRING,
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

    Label.associate = (models) => {
        Label.hasMany(models.label_list, {
            foreignKey: 'LabelId',
            // as: 'label_list',
            onDelete: "cascade"
        });
    };
    
    return Label;
}