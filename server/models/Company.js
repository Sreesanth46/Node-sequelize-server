module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define("company_master", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        remaining_account: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        code: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        collabration: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
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

    Company.associate = (models) => {
        Company.hasMany(models.user_master, {
            foreignKey: 'companyId',
            // as: 'user_master',
            onDelete: "cascade"
        })
    };
    
    return Company;
}