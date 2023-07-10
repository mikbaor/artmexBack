const{DataTypes}= require("sequelize")

const priceBoxesModel = (sequelize)=>{

    sequelize.define("Pricebox",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        stateName:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        ratio:{
            type:DataTypes.FLOAT,
            allowNull:false
        }
    },{timestamps:false})
    

}

module.exports = priceBoxesModel