const {DataTypes} = require("sequelize")

const printerModel = (sequelize)=>{

    sequelize.define("Printer",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },            
        name:{
            type:DataTypes.STRING,
            unique:true
        }       

    },{timestamps:false})

}

module.exports = printerModel