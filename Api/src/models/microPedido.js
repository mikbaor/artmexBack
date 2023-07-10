const {DataTypes} = require("sequelize")

const microOrdersModels = (sequelize)=>{

    sequelize.define("Microorder",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },       
       ammountRequired:{
        type:DataTypes.INTEGER
       },
       ammountDispatch:{
        type:DataTypes.INTEGER
       },

    },{timestamps:false})

}

module.exports = microOrdersModels