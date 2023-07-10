const {DataTypes} = require("sequelize")

const boxesModel = (sequelize)=>{

    sequelize.define("Box",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        high:{
            type:DataTypes.INTEGER,
        //    allowNull:false
        },
        wide:{
            type:DataTypes.INTEGER,
        //    allowNull:false
        },
        large:{
            type:DataTypes.INTEGER,
          //  allowNull:false
        },
        type:{
            type:DataTypes.STRING,
          // allowNull:false
        },
        height:{
            type:DataTypes.FLOAT,
         //   allowNull:false
        },
        date:{
            type:DataTypes.DATE,
           // allowNull:false
        },
        ammount:{
            type:DataTypes.INTEGER,
           // allowNull:false
        },        
        etiqueta:{
            type:DataTypes.TEXT,
        },
        isImpress:{         //tipo: TAR, BOX, O STO
            type:DataTypes.STRING,   //lo cambio
            defaultValue: "pending"
        },
        isScaned:{
            type:DataTypes.STRING,
            defaultValue: "pending"
        },
        reimpressionAmmount:{    //se suma
            type:DataTypes.INTEGER,
            defaultValue: 0
        },
        itsSell:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        cost:{
            type:DataTypes.FLOAT,
            defaultValue:0
        },
        dollarCost:{
            type:DataTypes.FLOAT,
            defaultValue:0
        },
        detailOrder:{
            type:DataTypes.STRING,
        }
      

    },{timestamps:false}    
    )
}

module.exports = boxesModel