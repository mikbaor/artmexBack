const {DataTypes} = require("sequelize")

const ordersModels = (sequelize)=>{

    sequelize.define("Order",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
       date:{
            type:DataTypes.DATE
       },
       status:{
        type:DataTypes.STRING
       },
       totalAmmount:{
        type:DataTypes.INTEGER
       },
       totalDispatch:{
        type:DataTypes.INTEGER
       }


    },{timestamps:false})

}

module.exports = ordersModels