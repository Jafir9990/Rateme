const express = require('express');
const router = express.Router();
const Employee = require("../models/Employee")
const User = require("../models/User")
const {verifyUser} = require('../middlewares/auth');
const {  mongoose } = require('mongoose');
const { userTypes } = require('../utils/util');
const Department = require('../models/Department');
const Rating = require('../models/Rating');
const  multer = require('multer');
const fs = require('fs').promises;
const path = require('path')

router.use(["/add","/edit","/details/:employeeId","/delete","/search"],verifyUser);

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        await fs.mkdir(`content/${req.body.deptId}`, { recursive: true })
        cb(null, `content/${req.body.deptId}`)
      } catch (error) {
        cb(error, null)
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      // cb = callback
      const allowedTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp']
      const ext = path.extname(file.originalname).replace('.', '')
      if (allowedTypes.includes(ext)) {
        cb(null, true)
      } else {
        cb(new Error('File type not allowed'), false)
      }
    }
  })

router.post("/add", upload.single('profilePicture'), async (req, res) => {
 
    try {
        
        if(req.user.type !== userTypes.USER_TYPE_SUPER && req.body.deptId !== req.user.departmentId.toString())
            throw new Error("Invalid request")

        
        const department = await Department.findById(req.body.deptId);
        if(!department) throw new Error("Deparment does not exist")

      
        const {
            name,
            email,
            phone,
            cnic,
            designation,
        
        } = req.body

        const employee = new Employee({
            name,
            email,
            phone,
            cnic,
            departmentId: department._id,
            designation,
            profilePicture: req.file ? req.file.filename : '',
            createdOn: new Date(),
            modifiedOn: new Date()
             
        })
        await employee.save()
        res.json({ success :true })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



router.post("/edit",upload.single('profilePicture'),  async (req, res) => {
   
    try {

        if(!req.body.id) throw new Error("Employee id is required")
        if(!mongoose.isValidObjectId(req.body.id))
        throw new Error("Employee id is invalid")

        const employee = await Employee.findById(req.body.id);
        if(!employee) throw new Error("invalid Employee id")

        
        if(req.user.type !== userTypes.USER_TYPE_SUPER && employee.departmentId.toString() !== req.user.departmentId.toString())
            throw new Error("Invalid request")

        const {
            name,
            email,
            phone,
            cnic,
            designation,
        
        } = req.body

        const record = {
            name,
            email,
            phone,
            cnic,
            designation,
            modifiedOn: new Date()
             
        }
        if(req.file && req.file.filename)
        {
            record.profilePicture = req.file.filename;
            if(employee.profilePicture && employee.profilePicture !== req.file.filename)
                fs.access(`./content/${employee.departmentId}/${employee.profilePicture}`,require('fs').constants.F_OK)
                .then(async () =>{
                    await fs.unlink(`./content/${employee.departmentId}/${employee.profilePicture}`)
                }).catch(err =>{

                })
        }
       
        await Employee.findByIdAndUpdate(req.body.id, record)
        
        res.json({ success: true })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


router.get("/details/:employeeId", async (req, res) => {
   
    try {

        if(!req.params.employeeId) throw new Error("Employee id is required")
        if(!mongoose.isValidObjectId(req.params.employeeId))
        throw new Error("Employee id is invalid")


        const employee = await Employee.findById(req.params.employeeId);
        if(!employee) throw new Error("invalid Employee id")

        if(req.user.type !== userTypes.USER_TYPE_SUPER && employee.departmentId.toString() !== req.user.departmentId.toString())
            throw new Error("Invalid request")


        
        res.json({employee} )


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post("/delete", async(req,res)=>{
    
        try {

        if(!req.body.id) throw new Error("Employee id is required")
        if(!mongoose.isValidObjectId(req.body.id))
        throw new Error("Employee id is invalid")

        const employee = await Employee.findById(req.body.id)
        if(!employee) throw new Error("Employee Does not Exsits")


        if(req.user.type !== userTypes.USER_TYPE_SUPER && req.body.deptId !== req.user.departmentId.toString())
            throw new Error("Invalid request")

       await Employee.findByIdAndDelete(req.body.id);
       if(employee.profilePicture)
            await fs.unlink(`content/${employee.departmentId}/${employee.profilePicture}`)
        

        res.json({success:true})
    }catch(error){
        res.status(400).json({error:error.message})
    }
});


router.post("/search",async(req,res)=>{
    try{
        if(req.user.type !== userTypes.USER_TYPE_SUPER && req.body.deptId !== req.user.departmentId.toString())
            throw new Error("Invalid request")


        const department = await Department.findById(req.body.deptId);
        if(!department) throw new Error("Deparment does not exist")

        const filter = {departmentId: req.body.deptId}
            if(req.body.query)
                filter['$text'] = {$search: req.body.query}

        const page = req.body.page ? req.body.page : 1;
        const skip = (page -1) * process.env.RECORDS_PER_PAGE
 
        const employees = await Employee.find(filter,{_id: 1,profilePicture: 1,name: 1,phone: 1,cnic: 1},{limit: process.env.RECORDS_PER_PAGE,skip});
        const totalEmployees = await Employee.countDocuments(filter)
        const numOfPages = Math.ceil(totalEmployees / process.env.RECORDS_PER_PAGE);

       res.status(200).json({department,employees,numOfPages})
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