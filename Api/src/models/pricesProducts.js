const{DataTypes}= require("sequelize")

const priceProductsModel = (sequelize)=>{

    sequelize.define("Priceproduct",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        price:{
            type:DataTypes.FLOAT,
            allowNull:false            
        },
        factor:{
            type:DataTypes.FLOAT,
            
        }
    },{timestamps:false})
    

}

module.exports = priceProductsModel