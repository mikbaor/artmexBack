const {DataTypes} = require("sequelize")

const fotoChofersModel = (sequelize)=>{

    sequelize.define("Chofersphotos",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        path1:{
            type:DataTypes.STRING,            
        },
        path2:{
            type:DataTypes.STRING,            
        },
    },{timestamps:false}    


    )
}

module.exports = fotoChofersModel