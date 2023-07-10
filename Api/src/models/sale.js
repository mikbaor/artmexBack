const {DataTypes} = require("sequelize")

const saleModels = (sequelize)=>{

    sequelize.define("Sale",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
       date:{
            type:DataTypes.DATE
       },      
       totalCost:{
        type:DataTypes.FLOAT
       },
       totalBoxes:{
        type:DataTypes.INTEGER
       }
    },{timestamps:false})

}

module.exports = saleModels