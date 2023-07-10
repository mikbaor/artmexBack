const {DataTypes} = require("sequelize")

const microSalesModels = (sequelize)=>{

    sequelize.define("Microsale",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },         
       priceBox:{
        type:DataTypes.FLOAT
       },
       ratio:{
        type:DataTypes.FLOAT
       }     
    },{timestamps:false})

}

module.exports = microSalesModels