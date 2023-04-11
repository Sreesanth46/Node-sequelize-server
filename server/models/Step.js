module.exports = (sequelize, DataTypes) => {
    const Step = sequelize.define("step", {
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

    Step.associate = (models) => {
        Step.hasMany(models.item_master, {
            foreignKey: 'StepId',
            // as: 'item_master',
            onDelete: "cascade"
        });

        Step.hasMany(models.comment_annotation, {
            foreignKey: 'StepId',
            // as: 'comment_annotation',
            onDelete: "cascade"
        });
    };
    
    return Step;
}