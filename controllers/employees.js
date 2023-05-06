const express = require('express');
const router = express.Router();
const Employee = require("../models/Employee")
const User = require("../models/User")
const {verifyUser} = require('../middlewares/auth');
const {  mongoose } = require('mongoose');
const { userTypes } = require('../utils/util');
const Department = require('../models/Department');
const Rating = require('../models/Rating');

router.use(["/add","/edit","/details/:employeeId","/delete","/search"],verifyUser);

router.post("/add", async (req, res) => {
 
    try {
        
        if(req.user.type !== userTypes.USER_TYPE_STANDARD)
       throw new Error("Invalid request")

        
        const department = await Department.findOne({userId: req.user._id});
        if(!department) throw new Error("Deparment does not exist")

       if(req.user._id.toString() !== department.userId.toString())
       throw new Error("Invalid request")
        const {
            name,
            email,
            phoneNumber,
            idCard,
            profilePicture,
            designation,
            

        } = req.body

        const employee = new Employee({
            name,
            email,
            phoneNumber,
            idCard,
            departmentId: department._id,
            profilePicture,
            designation,
             
        })
        await employee.save()
        res.json({ employee })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



router.post("/edit", async (req, res) => {
   
    try {

        if(!req.body.id) throw new Error("Employee id is required")
        if(!mongoose.isValidObjectId(req.body.id))
        throw new Error("Employee id is invalid")

        if(req.user.type !== userTypes.USER_TYPE_STANDARD)
        throw new Error("invalid request")


        const department = await Department.findOne({userId: req.user._id});
        if(!department) throw new Error("Deparment does not exist")

       if(req.user._id.toString() !== department.userId.toString())
       throw new Error("Invalid request")
        

        const employee = await Employee.findById(req.body.id);
        if(!employee) throw new Error("Employee does not exsits")

        if(department._id.toString() !== employee.departmentId.toString())
        throw new Error("invalid request")

        await Employee.updateOne(
            {_id:employee._id, departmentId: department._id},
            {$set: req.body }
        );
        const updatedEmployee = await Employee.findById(req.body.id)
        
        res.json({ employee: updatedEmployee  })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


router.get("/details/:employeeId", async (req, res) => {
   
    try {

        if(!req.params.employeeId) throw new Error("Employee id is required")
        if(!mongoose.isValidObjectId(req.params.employeeId))
        throw new Error("Employee id is invalid")

        if(req.user.type !== userTypes.USER_TYPE_STANDARD)
        throw new Error("invalid request")


        const department = await Department.findOne({userId: req.user._id});
        if(!department) throw new Error("Deparment does not exist")

       if(req.user._id.toString() !== department.userId.toString())
       throw new Error("Invalid request")
        

        const employee = await Employee.findById(req.params.employeeId);
        if(!employee) throw new Error("Employee does not exsits")

        if(department._id.toString() !== employee.departmentId.toString())
        throw new Error("invalid request")
        
        res.json(employee )


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete("/delete", async(req,res)=>{
    
        try {

           if(!req.body.id) throw new Error("Employee id is required")
        if(!mongoose.isValidObjectId(req.body.id))
        throw new Error("Employee id is invalid")

        if(req.user.type !== userTypes.USER_TYPE_STANDARD)
        throw new Error("invalid request")


        const department = await Department.findOne({userId: req.user._id});
        if(!department) throw new Error("Deparment does not exist")

       if(req.user._id.toString() !== department.userId.toString())
       throw new Error("Invalid request")
        

        const employee = await Employee.findById(req.body.id);
        if(!employee) throw new Error("Employee does not exsits")

        if(department._id.toString() !== employee.departmentId.toString())
        throw new Error("invalid request")

        await Employee.deleteOne({_id: req.body.id,departmentId: department._id})
        res.json({success:true})
    }catch(error){
        res.status(400).json({error:error.message})
    }
});


router.post("/search",async(req,res)=>{
    try{
        

        if(req.user.type !== userTypes.USER_TYPE_STANDARD)
        throw new Error("invalid request")


        const department = await Department.findOne({userId: req.user._id});
        if(!department) throw new Error("Deparment does not exist")

       if(req.user._id.toString() !== department.userId.toString())
       throw new Error("Invalid request")

        
       const employees = await Employee.find(req.body);
       
       res.status(200).json({employees})
    }catch(error){
        res.status(400).json({error:error.message})

    }
})

router.post("/feedback", async(req,res)=>{
try {

    const{
        name,
        phoneNumber,
        feedbackData,
        employeeId,
        rating,
    } = req.body

    const employee = await Employee.findById(employeeId);
        if(!employee) throw new Error("invalid id")

    if(rating < 0 || rating > 5)
    throw new Error("invalid Request")

    const ratingData = Rating({
        name,
        phoneNumber,
        feedbackData,
        departmentId: employee.departmentId,
        employeeId,
        rating,
    });
    await ratingData.save()
    res.json({ratingData})
    
} catch (error) {
    res.status(400).json({error:error.message})
    
}
})

module.exports = router;