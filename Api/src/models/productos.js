const{DataTypes}= require("sequelize")

const productsModel = (sequelize)=>{

    sequelize.define("Product",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        state:{
            type:DataTypes.STRING,
            defaultValue:true
        },
        tipo:{
            type:DataTypes.STRING,
            allowNull:false
        },
        peso:{
            type:DataTypes.FLOAT
        },
        colorPrimario:{
            type:DataTypes.STRING
        },
        colorSecundario:{
            type:DataTypes.STRING
        },
        ammount:{
            type:DataTypes.BIGINT,
            defaultValue:0 
        },
        ammountDispatch:{
            type:DataTypes.BIGINT,
            defaultValue:0 
        },
        averageCost:{
            type:DataTypes.FLOAT
        },
        imageProduct:{
            type:DataTypes.STRING,           
        },
        stateController: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
          },            
    },{timestamps:false})
    

}

module.exports = productsModel