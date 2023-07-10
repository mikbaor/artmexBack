const {DataTypes} = require("sequelize")

const scrapsModel = (sequelize)=>{

    sequelize.define("Scrap",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        date:{
            type:DataTypes.DATE,
            allowNull:false
        },
        totalScrap:{
            type:DataTypes.INTEGER,
            allowNull:false
        } ,
        origin:{
            type:DataTypes.STRING
       },   
        comment:{
            type:DataTypes.STRING,            
        }
    },{timestamp:false} 
    )
}

module.exports = scrapsModel