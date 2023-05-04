const express = require('express');
const router = express.Router();
const Department = require("../models/Department")
const User = require("../models/User")
const {verifyUser} = require('../middlewares/auth');
const {  mongoose } = require('mongoose');
const { userTypes } = require('../utils/util');

router.use(verifyUser);

router.post("/add", async (req, res) => {
 
    try {
        
       if(req.user.type !== userTypes.USER_TYPE_SUPER)
       throw new Error("Invalid request")
        const {
            name,
            email,
            phone,
            logo,
            adress,
            user_id
             

        } = req.body

        const department = new Department({
            name,
            email,
            phone,
            logo,
            adress,
            user_id
             
        })
        await department.save()
        res.json({ department })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



router.post("/edit", async (req, res) => {
   
    try {

        if(!req.body.id) throw new Error("Department id is required")
        if(!mongoose.isValidObjectId(req.body.id))
        throw new Error("Department id is invalid")
        

        const department = await Department.findById(req.body.id);
        if(!department) throw new Error("Department do not exsits")

        if(req.user.type !== userTypes.USER_TYPE_SUPER && req.user._id.toString() !== department.user_id.toString())
        throw new Error("invalid request")


        const {
            name,
            email,
            phone,
            logo,
            adress,
             

        } = req.body

     let updatedDepartment = await Department.findByIdAndUpdate(req.body.id,{
        name,
        email,
        phone,
        logo,
        adress,
         
        })
        res.json({ department: updatedDepartment  })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// router.post("/signin", async (req, res) => {
//     try {
//         if (!req.body.email) throw new Error('Email is required');
//         if (!req.body.password) throw new Error('password is required');
//         let user = await User.findOne({ email: req.body.email });
//         if (!user) throw new Error('Email or password is incorrect');
//         if (!(await bcrypt.compare(req.body.password, user.password)))
//             throw new Error('Email or Password is incorrect')

//         user = user.toObject()
//         delete user.password

//         const token = await createJWTToken(user,12)

//         res.json({ user, token })

//     } catch (error) {
//         res.status(400).json({ error: error.message })
//     }
// })

router.delete("/delete", async(req,res)=>{
    try{
        if(!req.body.id)throw new Error("Department id is required");
        if(!mongoose.isValidObjectId(req.body.id))
        throw new Error("deaprmrnt id is invalid");

        if(req.user.type !== userTypes.USER_TYPE_SUPER)
        throw new Error("Invalid request")

        const department = await Department.findById(req.body.id)
        if(!department)throw new Error("Deparment do not exsits");

        // department.user_id = '6450eebb94dba2b177eec1c3'
        if(req.user._id.toString() !== department.user_id.toString())
        throw new Error("invalid request")

        await Department.findOneAndDelete(req.body.id)
        res.json({success:true})
    }catch(error){
        res.status(400).json({error:error.message})
    }
});


router.get("/",async(req,res)=>{
    try{
        if(req.user.type !== userTypes.USER_TYPE_SUPER)
        throw new Error("Invalid request")
        
        const deaprmrnts = await Department.find();
        res.status(200).json({deaprmrnts})
    }catch(error){
        res.status(400).json({error:error.message})

    }
})

module.exports = router;