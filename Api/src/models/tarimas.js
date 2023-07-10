const {DataTypes} = require("sequelize")

const tarimasModel = (sequelize)=>{

    sequelize.define("Tarima",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        date:{
            type:DataTypes.DATE,
            allowNull:false
        },
        weight:{
            type:DataTypes.FLOAT,
            allowNull:false
        },
        height:{
            type:DataTypes.FLOAT,
            allowNull:false
        },
        wide:{
            type:DataTypes.INTEGER,
        //    allowNull:false
        },
        large:{
            type:DataTypes.INTEGER,
          //  allowNull:false
        },
        etiqueta:{
            type:DataTypes.TEXT,
        },
        isImpress:{
            type:DataTypes.STRING,
            defaultValue: "pending"
        },
        isScaned:{
            type:DataTypes.STRING,
            defaultValue: "pending"
        },
        reimpressionAmmount:{
            type:DataTypes.INTEGER,
            defaultValue: 0
        },
        detailTarima:{
            type:DataTypes.STRING,
        }

    },{timestamps:false}    
)
}

module.exports = tarimasModel