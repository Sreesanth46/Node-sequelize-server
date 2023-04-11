module.exports = (sequelize, DataTypes) => {
    const Collaboration = sequelize.define("collaboration", {
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

    // Collaboration.associate = (models) => {
    //     Collaboration.hasMany(models.item_master, {
    //         foreignKey: 'CollaborationId',
    //         // as: 'item_master',
    //         onDelete: "cascade"
    //     });
    // };
    
    return Collaboration;
}