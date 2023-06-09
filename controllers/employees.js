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

router.use(["/add","/edit","/details/:employeeId","/delete","/search","/dashboard","/ratings"],verifyUser);

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
        const ext = path.extname(file.originalname)
        const newFileName = Math.random().toString(36).substring(2,7)
        cb(null, newFileName + ext)
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


router.get("/publicDetails/:employeeId", async (req, res) => {
   
    try {

        if(!req.params.employeeId) throw new Error("Employee id is required")
        if(!mongoose.isValidObjectId(req.params.employeeId))
        throw new Error("Employee id is invalid")


        const employee = await Employee.findById(req.params.employeeId,{_id: 1, name:1,profilePicture:1,departmentId: 1});
        if(!employee) throw new Error("invalid Employee id")

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

        await Rating.deleteMany({employeeId: req.body.id})

        
    
         const result = await Rating.aggregate([
            {$match: {departmentId: { $eq: employee.departmentId}}},
            {$group: {_id: null, avg_value: {$avg: '$rating'}}}
        ]);
        if(result && result.length)
        {
            await Department.findByIdAndUpdate(employee.departmentId, {rating: result[0].avg_value.toFixed(1) });
        }else
        {
            await Department.findByIdAndUpdate(employee.departmentId,{rating: 0})
        }
        

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

router.post("/ratings", async (req, res) => {
    try {
      if(!req.body.employeeId)throw new Error("Employee Id is Required")

      const employee = await Employee.findById(req.body.employeeId)
      if (!employee) throw new Error("employee does not exists")
      
      if (req.user.type !== userTypes.USER_TYPE_SUPER && employee.departmentId !== req.user.departmentId.toString())
        throw new Error("invalid request")
  
      const filters = { employeeId: req.body.employeeId }
  
  
      const page = req.body.page ? req.body.page : 1;
      const skip = (page - 1) * process.env.RECORDS_PER_PAGE
  
      const ratings = await Rating.find(filters, {_id: 1,name : 1, phone : 1 ,rating: 1, createdOn : 1 , message : 1}, { limit: process.env.RECORDS_PER_PAGE, skip , sort : { createdOn : -1 }  })
  
      const totalRatings = await Rating.countDocuments(filters);
      const numOfPages = Math.ceil(totalRatings / process.env.RECORDS_PER_PAGE)
      res.json({ ratings, numOfPages })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  })

router.get('/dashboard',async(req, res) =>{
        
        try{
            const stats = {
                departments: 0,
                employees: 0,
                ratings: 0
                }

            if(req.user.type == userTypes.USER_TYPE_SUPER)
                stats.departments = await Department.estimatedDocumentCount()

            if(req.user.type == userTypes.USER_TYPE_SUPER)
            {
                stats.employees = await Employee.estimatedDocumentCount()
                stats.ratings = await Rating.estimatedDocumentCount()
            }else{
                stats.employees = await Employee.countDocuments({departmentId: req.user.departmentId})
                stats.ratings = await Rating.countDocuments({departmentId: req.user.departmentId})
            }

            res.json({stats})
        }catch(error){
            res.status(400).json({error:error.message})
    
        }
    })

router.post("/publicSearch",async(req,res)=>{
        try{
            if(!req.body.departmentId)
                throw new Error("DepartmentId is Required")
            if(!req.body.name)
                throw new Error("Name is Required")

            const department = await Department.findById(req.body.departmentId);
            if(!department) throw new Error("Deparment does not exist")
    
            const filter = {departmentId: req.body.departmentId, name:{$regex: req.body.name, $options: 'i'}};
     
            const employees = await Employee.find(filter,{_id: 1,profilePicture: 1,name: 1,departmentId: 1});
            
    
           res.status(200).json({employees})
        }catch(error){
            res.status(400).json({error:error.message})
    
        }
    })


router.post("/feedback", async(req,res)=>{
try {
    if(!req.body.employeeId)
        throw new error('Employee Id is Required')
    
        if(!req.body.rating)
        throw new error('Rating is Required')
    
        if(!req.body.name)
        throw new error('Name is Required')

        const employee = await Employee.findById(req.body.employeeId);
        if(!employee) 
            throw new Error("invalid id")
    const{
        name,
        phone,
        message,
        employeeId,
        rating,
    } = req.body

   

    if(rating < 0 || rating > 5)
        throw new Error("invalid Request")

    const ratingData = new Rating({
        name,
        phone,
        message,
        departmentId: employee.departmentId,
        employeeId,
        rating,
        createdOn: new Date()
    });
    await ratingData.save()
    let result = await Rating.aggregate([
        {$match: {departmentId: { $eq: employee.departmentId}}},
        {$group: {_id: null, avg_value: {$avg: '$rating'}}}
    ]);
    if(result && result.length)
    {
        await Employee.findByIdAndUpdate(employeeId, {rating: result[0].avg_value.toFixed(1) });
    }

     result = await Rating.aggregate([
        {$match: {departmentId: { $eq: employee.departmentId}}},
        {$group: {_id: null, avg_value: {$avg: '$rating'}}}
    ]);
    if(result && result.length)
    {
        await Department.findByIdAndUpdate(employee.departmentId, {rating: result[0].avg_value.toFixed(1) });
    }

    


    res.json({success: true})
    
} catch (error) {
    res.status(400).json({error:error.message})
    
}
})

module.exports = router;