const {DataTypes} = require("sequelize")

const subStoresModel = (sequelize)=>{

    sequelize.define("Substore",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:DataTypes.STRING,
        },   
      },{timestamps:false}    
    )
}

module.exports = subStoresModel