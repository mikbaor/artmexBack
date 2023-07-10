const {DataTypes} = require("sequelize")

const lotesModel = (sequelize)=>{

    sequelize.define("Lote",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        date:{
            type:DataTypes.DATE,
            allowNull:false
        },
        totalAmmount:{
            type:DataTypes.BIGINT,
          //  allowNull:false
        }
            
    },{timestamps:false}    
    )
}

//

module.exports = lotesModel