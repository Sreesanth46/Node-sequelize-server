module.exports = (sequelize, DataTypes) => {
    const LabelGroup = sequelize.define("label_group", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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

    LabelGroup.associate = (models) => {
        LabelGroup.hasMany(models.label_list, {
            foreignKey: 'labelGroupId',
            // as: 'label_list',
            onDelete: "cascade"
        });

        LabelGroup.hasMany(models.project_master, {
            foreignKey: 'labelGroupId',
            // as: 'project_master',
            onDelete: "cascade"
        });
    };
    
    return LabelGroup;
}