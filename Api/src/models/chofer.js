const {DataTypes} = require("sequelize")

const chofersModel = (sequelize)=>{

    sequelize.define("Chofer",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        dateRegister:{
            type:DataTypes.DATE,
            allowNull:false
        },        
        firstName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        lastName:{
            type:DataTypes.STRING,
        },
        license:{
            type:DataTypes.STRING,
            unique:true
        },
        company:{
            type:DataTypes.STRING,
        }               

    },{timestamps:false}    


    )
}

module.exports = chofersModel