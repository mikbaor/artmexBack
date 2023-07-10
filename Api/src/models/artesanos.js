const {DataTypes}= require("sequelize")

const artisansModel = (sequelize)=>{

    sequelize.define("Artisan",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        firstName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        lastName:{
            type:DataTypes.STRING
        },
        country:{
            type:DataTypes.STRING
        },
        state:{
            type:DataTypes.STRING,
            allowNull:false
        },
        phone:{
            type:DataTypes.STRING
        },
        direccion:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        satId:{ 
            type:DataTypes.STRING
        },
        fiscalAddres:{ 
            type:DataTypes.STRING
        },
        fiscalName:{  
            type:DataTypes.STRING
        },
        fiscalType:{
            type:DataTypes.STRING
        },
        stateController: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
          },

    },{timestamps:false})
   
}

module.exports= artisansModel
