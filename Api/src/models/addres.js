const {DataTypes} = require("sequelize")

const addressModel = (sequelize)=>{

    sequelize.define("Address",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        country:{
            type:DataTypes.STRING,
            allowNull: false
        },
        state:{
            type:DataTypes.STRING,
            allowNull: false
        },
        zipCode:{
            type:DataTypes.STRING,
            allowNull:false
        },
        address:{
            type:DataTypes.STRING,
            allowNull:false
        }



    },{timestamps:false})

}

module.exports = addressModel