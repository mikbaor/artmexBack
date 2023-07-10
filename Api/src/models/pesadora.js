const {DataTypes} = require("sequelize")

const weighterModels = (sequelize)=>{

    sequelize.define("Weighter",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
       state:{
            type:DataTypes.INTEGER
        },
        value:{
            type:DataTypes.FLOAT
        },
        name:{
            type:DataTypes.STRING
        }       

    },{timestamps:false})

}

module.exports = weighterModels