module.exports = (sequelize, DataTypes) => {
    const StepGroup = sequelize.define("step_group", {
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

    StepGroup.associate = (models) => {
        StepGroup.hasMany(models.step, {
            foreignKey: 'stepGroupId',
            // as: 'step',
            onDelete: "cascade"
        });

        StepGroup.hasMany(models.project_master, {
            foreignKey: 'stepGroupId',
            // as: 'project_master',
            onDelete: "cascade"
        });
    };
    
    
    return StepGroup;
}