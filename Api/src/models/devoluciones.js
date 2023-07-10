const {DataTypes} = require("sequelize")

const returnsModel = (sequelize)=>{

    sequelize.define("Return",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        date:{
            type:DataTypes.DATE,
            allowNull:false
        },      

    },{timestamps:false}    


    )
}

module.exports = returnsModel