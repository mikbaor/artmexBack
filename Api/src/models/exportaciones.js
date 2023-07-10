const {DataTypes} = require("sequelize")

const exportsModel = (sequelize)=>{

    sequelize.define("Export",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },             
        journeyCost:{
            type:DataTypes.FLOAT
        },
        aduanalCost:{
            type:DataTypes.FLOAT
        },
        arrivalDate:{
            type:DataTypes.STRING  
        },
        montacargasCost:{
            type:DataTypes.FLOAT
        },
        otherCost:{
            type:DataTypes.FLOAT  
        }        

    },{timestamps:false}    


    )
}

module.exports = exportsModel