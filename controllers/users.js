const express = require('express');
const router = express.Router();
const User = require("../models/User")
const bcrypt = require('bcrypt');
const { createJWTToken } = require('../utils/util');
const {verifyUser} = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');

router.use(['/add','/edit','/delete','/profile','/profile-update'], verifyUser);

router.post("/add", async (req, res) => {
    const userExist = await User.findOne({email:req.body.email})
    try {
        if(userExist) throw new Error("email already exsit")
        const {
            name,
            email,
            phone_number,
            profile_picture,
            password,
            type,
            created_on,
            modified_on

        } = req.body

        const user = new User({
            name: name,
            email,
            phone_number,
            profile_picture,
            password: await bcrypt.hash(req.body.password, 10),
            type,
            created_on,
            modified_on
        })
        await user.save()
        res.json({ user })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})



router.post("/edit", async (req, res) => {
   
    const userExist = await User.findOne({email:req.body.email,_id:{$ne:req.body.id}})
    try {
        if(userExist) throw new Error("email already exsit")

        if(!req.body.id) throw new Error("user id is required")
        if(!mongoose.isValidObjectId(req.body.id))
        throw new Error("user id is invalid")
        if(req.user._id.toString() !== req.body.id)
        throw new Error("invalid request")

        const user = await User.findById(req.body.id);
        if(!user) throw new Error("user do not exsits")


        const {
            name,
            email,
            phone_number,
            profile_picture,
            password,
            type,
            created_on,
            modified_on

        } = req.body

     let updatedUser = await User.findByIdAndUpdate(req.body.id,{
            name: name,
            email,
            phone_number,
            profile_picture,
            password: await bcrypt.hash(req.body.password, 10),
            type,
            modified_on
        })
        await user.save()
        res.json({ user: updatedUser  })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post("/signin", async (req, res) => {
    try {
        if (!req.body.email) throw new Error('Email is required');
        if (!req.body.password) throw new Error('password is required');
        let user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error('Email or password is incorrect');
        if (!(await bcrypt.compare(req.body.password, user.password)))
            throw new Error('Email or Password is incorrect')

        user = user.toObject()
        delete user.password

        const token = await createJWTToken(user,12)

        res.json({ user, token })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete("/delete", async(req,res)=>{
    try{
        if(!req.body.id)throw new Error("User id is required");
        if(!mongoose.isValidObjectId(req.body.id))
        throw new Error("User id is invalid");

        const user = await User.findById(req.body.id)
        if(!user)throw new Error("User do not exsits");
        await User.findOneAndDelete(req.body.id)
        res.json({success:true})
    }catch(error){
        res.status(400).json({error:error.message})
    }
});

router.get("/profile",async(req,res) =>{
    try{
        let user = await User.findById(req.user._id);
        user = user.toObject()
        delete user.password

        res.json({user})
    }catch(error){
        res.status(400).json({error:error.message})
    }
})



router.post("/profile-update", async (req, res) => {
    console.log(req.user)
    const userExist = await User.findOne({email:req.body.email,_id:{$ne:req.user._id}})
    try {
        if(userExist) throw new Error("email already exsit")

        const {
            name,
            email,
            phone_number,
            profile_picture,
            password,
            type,
            active,
            created_on,
            modified_on

        } = req.body

     let updatedUser = await User.findByIdAndUpdate(req.user._id,{
            name: name,
            email,
            phone_number,
            profile_picture,
            password: await bcrypt.hash(req.body.password, 10),
            type,
            active,
            modified_on
        })

        updatedUser= updatedUser.toObject()
        delete updatedUser.password
     
        res.json({ user: updatedUser  })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get("/",async(req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json({users})
    }catch(error){
        res.status(400).json({error:error.message})

    }
})
module.exports = router;








