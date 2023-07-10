const {DataTypes}= require("sequelize")

const clientsModel = (sequelize)=>{
    
    sequelize.define("Client",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        nombreDueño:{
            type:DataTypes.STRING
        },
        taxID:{
            type:DataTypes.STRING
        },
        direccion:{
            type:DataTypes.STRING
        },
        telefono:{
            type:DataTypes.STRING
        },
        tiendaNombre:{
            type:DataTypes.STRING
        },
        NombreDelEncargado:{
            type:DataTypes.STRING
        },
        state:{
            type:DataTypes.STRING
        },
        city:{
            type:DataTypes.STRING
        },
        email:{
            type:DataTypes.STRING
        },
        imageTaxId:{
            type:DataTypes.STRING
        },
        stateController: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
          },
    },{timestamps:false})


}

module.exports = clientsModel
