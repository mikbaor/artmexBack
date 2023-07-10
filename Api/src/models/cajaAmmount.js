const {DataTypes} = require("sequelize")

const AmmountBoxesModel = (sequelize)=>{

    sequelize.define("Boxammount",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },      
        ammount:{
            type:DataTypes.INTEGER,          
        }

    },{timestamps:false}    
    )
}

module.exports = AmmountBoxesModel