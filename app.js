require("dotenv").config();
const express = require("express");
const app = express();
const { Sequelize,DataTypes, json } = require("sequelize");
const port = process.env.PORT || 9091;
console.log(process.env.PORT);

app.use(express.json());

//sequelize connection

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.MYSQLUSERNAME,
    process.env.MYSQLPASSWORD,
    {
      host: "localhost",
      dialect: "mysql" ,
    }
  );

async function connection() {
  
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    return null;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return error;
  }
}

const Employee = sequelize.define('employeedetails', {
    // Model attributes are defined here
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
       //allowNull defaults to true
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    address: {
      type: DataTypes.STRING
       //allowNull defaults to true
    },
    phoneNo: {
      type: DataTypes.INTEGER
       //allowNull defaults to true
    },
    qualification: {
      type: DataTypes.STRING
       //allowNull defaults to true
    }
  }, {
    // Other model options go here
  });


  // 1) post operation---->

  app.post("/api/create",async(req,res)=>{

      
      try{
        const detail = await Employee.create({
           fullName: req.body.fullName,
           lastName:req.body.lastName,
           address: req.body.address,
           phoneNo:req.body.phoneNo,
           qualification:req.body.qualification,
           });

        res.json({message:"Success",data:detail})
      }
      catch(err){

        res.json({message:"Error",data:err})

      }


  })

// 2) get all operation---->  

  app.get("/api/getAll",async(req,res)=>{
    try{
      const detail = await Employee.findAll();
      

      res.json({message:"Success",data:detail})
    }
    catch(err){

      res.json({message:"Error",data:err})

    }


 })

 // 3) update operation---->  

 app.put("/api/update/:id",async(req,res)=>{

    const detail = await Employee.update(
      { 
        fullName: req.body.fullName,
        lastName:req.body.lastName,
        address: req.body.address,
        phoneNo:req.body.phoneNo,
        qualification:req.body.qualification,
       },
      {
        where: {
          id: req.params.id,
        },
      }
    );
  
    res.json({ message: "Succes", data: detail });
  });

  // 4) delete operation---->  

  app.delete("/api/delete/:id",async(req,res)=>{
    
    await Employee.destroy({
      where: {
        id: req.params.id,
       
      }
  
    });
    res.json({message:"Success"})
  
  })
// Env file

connection().then((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log("Server running");
    });
  } else {
    console.log(err);
  }
});
