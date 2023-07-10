const {DataTypes} = require("sequelize")

const storesModel = (sequelize)=>{

    sequelize.define("Store",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:DataTypes.STRING,
            unique:true,
        },        
        country:{
            type:DataTypes.STRING,
        },
        state:{
            type:DataTypes.STRING,
        },
        city:{
            type:DataTypes.STRING, 
        },
        address:{
            type:DataTypes.STRING
        },
        etiqueta:{
            type:DataTypes.TEXT,
        },
        isImpress:{
            type:DataTypes.STRING,
            defaultValue: "pending"
        },
        reimpressionAmmount:{
            type:DataTypes.INTEGER,
            defaultValue: 0
        },              
      },{timestamps:false}    
    )
}

module.exports = storesModel
