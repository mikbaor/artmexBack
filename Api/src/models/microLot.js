const {DataTypes} = require("sequelize")

const microLotModels = (sequelize)=>{

    sequelize.define("MicroLot",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
       productMicroLotAmmount:{
            type:DataTypes.INTEGER
        },        
        adquisitionCost:{
            type:DataTypes.FLOAT,
        }, 
        productEachBox:{
            type:DataTypes.INTEGER
        },
        pricePerProduct:{
            type:DataTypes.FLOAT,
        }
    },{timestamps:false})

}

module.exports = microLotModels