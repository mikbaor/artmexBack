const {DataTypes} = require("sequelize")

const checkPassModel = (sequelize)=>{

    sequelize.define("Checkpass",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        word:{
            type:DataTypes.STRING,           
        },
    },{timestamps:false})

}

module.exports = checkPassModel