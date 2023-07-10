const {DataTypes} = require("sequelize")

const microPaymentsModels = (sequelize)=>{

    sequelize.define("Micropayment",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
       date:{
            type:DataTypes.DATE
       },
       payAmmount:{
        type:DataTypes.STRING
       },       

    },{timestamps:false})

}

module.exports = microPaymentsModels 