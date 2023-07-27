const {DataTypes} = require("sequelize")

const paymentMethodModel = (sequelize)=>{

    sequelize.define("Paymentmethod",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        ammount:{
            type:DataTypes.FLOAT,
            allowNull: false
        },
        paymentMethod:{
            type:DataTypes.STRING,
            allowNull: false
        }
    },{timestamps:false})

}

module.exports = paymentMethodModel