const express = require('express');
const router = express.Router();
const User = require("../models/User")
const bcrypt = require('bcrypt');
const { createJWTToken, userTypes } = require('../utils/util');
const {verifyUser} = require('../middlewares/auth');
const { default: mongoose } = require('mongoose');
const { randomBytes } = require('crypto');
const { default: axios } = require('axios');
const  ejs = require('ejs');
const  multer = require('multer');
const fs = require('fs').promises;
const path = require('path')




router.use(['/all','/add','/edit','/delete','/profile','/profile-update'], verifyUser);

router.post("/add", async (req, res) => {
    try {
     
  
      const userExist = await User.findOne({ email: req.body.email });
      if (userExist) throw new Error("This email is already registered");
  
      const record = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: await bcrypt.hash(req.body.password, 10),
        type: req.body.type,
        createdOn: new Date()
        
      }

      if(req.body.type === userTypes.USER_TYPE_STANDARD)
      record.departmentId = req.body.departmentId
  
      const user = new User(record)
  
      await user.save();
      res.json({ user });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  router.post("/edit", async (req, res) => {
    try {
  
  
      if (!req.body.id) throw new Error("User id is required");
      if (!mongoose.isValidObjectId(req.body.id))
        throw new Error("User id is invalid");
  
      const user = await User.findById(req.body.id);
      if (!user) throw new Error("User does not exists");
  
  
      const record = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        modifiedOn: new Date()
      }
  
      if(req.body.password)
        record.password = await bcrypt.hash(req.body.password, 10);
  
      await User.findByIdAndUpdate(req.body.id, record)
  
      let updatedUser = await User.findById(req.body.id);
      delete updatedUser.password;
  
      res.json({ user: updatedUser });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


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

        const token = await createJWTToken(user,24*365*50)

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


router.post("/forgot-password", async (req, res) => {
    try {
        if (!req.body.email) throw new Error('Email is required');
        let user = await User.findOne({ email: req.body.email });
        if (!user) throw new Error('invalid request');

        const code = user._id.toString() + randomBytes(Math.ceil(25/2)).toString('hex').slice(0,25);
        await User.findByIdAndUpdate(user._id,{passwordResetCode : code})
        const resetPasswordURL = process.env.BASE_URL + 'admin/reset-password/' + code;
        console.log(resetPasswordURL)

        const data = {
            Recipients: {
              To: [user.email]
            },
            Content: {
              Body: [{
                ContentType: 'HTML',
                Content: await ejs.renderFile('./emails/resetPassword.ejs', {name: user.name, resetPasswordURL}),
                Charset: "utf8"
              }],
              Subject: "Reset Password",
              from: process.env.EMAIL_FROM
            }
          }

          const response = await axios.post('https://api.elasticemail.com/v4/emails/transactional', data, {
            headers: {
                'X-ElasticEmail-ApiKey': process.env.EMAIL_API_KEY
             }
            })
            res.json({success: true})

    } catch (error) {
    

        res.status(400).json({ error: error.message })
    }
})


router.post("/verify-reset-code", async (req, res) => {
    try {
        if (!req.body.code) throw new Error('code is required');
        let user = await User.findOne({ passwordResetCode: req.body.code });
        if (!user) throw new Error('invalid request');

          res.json({success: true})

    } catch (error) {
         res.status(400).json({ error: error.message })
    }
})


router.post("/reset-password", async (req, res) => {

    try {
      if (!req.body.code) throw new Error("Code is required");
      if (!req.body.newPassword) throw new Error("New password is required");
      if (!req.body.confirmPassword) throw new Error("please confirm password");
  
      if(req.body.newPassword.length < 6)  
        throw new Error("Password should have at least 6 characters");
  
      if(req.body.newPassword !== req.body.confirmPassword)
        throw new Error("Passwords are not same");
  
      let user = await User.findOne({ passwordResetCode: req.body.code });
      if (!user) throw new Error("Invalid request");
  
      await User.findByIdAndUpdate(user._id, {
        password: await bcrypt.hash(req.body.newPassword, 10),
        passwordResetCode: ''
      })
      
      res.json({ success: true });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try{
        await fs.mkdir(`content/${req.user._id}/`,{recursive: true})
        cb(null, `content/${req.user._id}/`)
        }catch(err)
        {
            cb(err, null)
        }
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
  })

  const upload = multer({
    storage,
    fileFilter:(req,file,cb) => {
        const allowedTypes =['jpg', 'png', 'gif', 'bmp', 'jpeg'];
        const ext = path.extname(file.originalname).replace('.','');
        if(allowedTypes.includes(ext))
          cb(null, true)
        else
        {
          cb(new Error("File type is not allowed"),false)
        }

    }
})

router.post("/profile-update", upload.single('profilePicture'), async (req, res) => {
    try {
        if(!req.body.name) throw new Error('Name is Required')

        const record = {
            name: req.body.name,
            phoneNumber:req.body.phoneNumber,
            modifiedOn: new Date()
        }
        if(req.file && req.file.filename)
        {
        record.profilePicture = req.file.filename;
        if(req.user.profilePicture && req.user.profilePicture !== req.file.filename)
        {
            const oldPicPath = `content/${req.user._id}/${req.user.profilePicture}`
            await fs.unlink(oldPicPath)
        }
        }
        if(req.body.newPassword)
        {
            if(!req.body.currentPassword) throw new Error('Current password Is Requried')
            if(!(await bcrypt.compare(req.body.currentPassword, req.user.password)))
              throw new Error('Current password Is Incorrect')
            if(req.body.newPassword.length < 6) throw new Error('New Password should have at least  6 characters')
            if(req.body.newPassword !== req.body.confirmPassword) throw new Error('Password are not Same')
            record.password = await bcrypt.hash(req.body.password, 10)

        }
        

        await User.findByIdAndUpdate(req.user._id, record);
        let user = await User.findById(req.user._id);
        user = user.toObject();
        delete user.password;
        res.json({ user });


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get("/all",async(req,res)=>{
    try{
      let conditions = {};
      if(req.user.type === userTypes.USER_TYPE_STANDARD)
        {
        conditions.departmentId = req.user.departmentId
        conditions.type = userTypes.USER_TYPE_STANDARD
        }
        const users = await User.find(conditions);
        res.status(200).json({users})
    }catch(error){
        res.status(400).json({error:error.message})

    }
})
module.exports = router;








