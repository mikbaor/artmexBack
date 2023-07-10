const {DataTypes} = require("sequelize")

const fotoSalesModel = (sequelize)=>{

    sequelize.define("Salephotos",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        path:{
            type:DataTypes.STRING,            
        },
    },{timestamps:false}    


    )
}

module.exports = fotoSalesModel