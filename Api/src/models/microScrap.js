const {DataTypes} = require("sequelize")

const microScrapModels = (sequelize)=>{

    sequelize.define("MicroScrap",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
       productScrapAmmount:{
            type:DataTypes.INTEGER
        }       

    },{timestamps:false})

}

module.exports = microScrapModels