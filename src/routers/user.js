const express = require('express')
const router = express.Router()
const User=require('../model/user')
const auth= require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')




router.post('/users',async  (req,res) => {
    const user = new User(req.body)
 
    try{
        await user.save()
        const token= await user.generateAuthToken()
        res.status(201).send({user, token})
    }
    catch(e)
    {
        res.status(404).send(e)
    }
 
 //    user.save().then( () => {
 //          res.status(201).send(user)
 //    }).catch( (e) => {
 //        res.status(400).send(e)
 //    })
 })

 router.post('/users/login' ,  async (req,res) =>{
     try {
         const user = await User.findByCredentials(req.body.email,req.body.password)
         const token= await user.generateAuthToken()
         res.status(200).send({user , token})
     } catch (error) {
         res.status(400).send(error)
     }
 })


 

 router.post('/users/logout' , auth , async (req, res) => {
     try {
         req.user.tokens = req.user.tokens.filter( (token ) =>{
             return token.token !== req.token
         })
         await req.user.save()
         res.send()
     } catch (e) {
         res.status(500).send(e)
     }
 })

 router.post('/users/logoutAll' , auth , async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

 
 router.get('/users/me', auth , async (req,res)=>{
     res.send(req.user)
 })
 
 
 router.get('/users/:id' , async (req,res) => {
     const _id = req.params.id
 
     try{
         const user= await  User.findById(_id)
         if(!user)
         {
             res.status(404).send()
         }
         res.status(201).send(user)
 
     }catch(e)
     {
         res.status(500).send()
     }
 })
 
 
 router.patch('/users/me' , auth , async (req,res) =>{
     const updates= Object.keys(req.body)
     const isAllowed =['name' , 'age' , 'email' , 'password' ]
     const isValidKey = updates.every( (update) => isAllowed.includes(update) )
 
     if(!isValidKey)
     {
         return  res.status(400).send( {error : ' invalid update' } )
     }
 
     try {
          //await User.findByIdAndUpdate(req.user._id )
          updates.forEach( (update) => req.user[update] = req.body[update]  )
          await req.user.save()
           res.send(req.user)
 
     } catch (error) {
         res.status(500).send(error)
     }
 })
 
 
 router.delete('/users/me' , auth , async (req,res) =>{
     try {
         await  req.user.remove()
         res.send(req.user)
     } catch (error) {
         res.send(500).send()
     }
 })

 const upload = multer({
     limits: {
         fileSize :1000000,

     },
     fileFilter(req,file,cb) {
         if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            cb( new Error( 'please upload a valid file !! '))
        }

        cb(undefined , true)

     }

     
 })

 router.post('/users/me/avatar' ,auth ,  upload.single('avatar') ,async  (req,res) =>{
     const buffer  = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
    // console.log(buffer)
     req.user.avatar = buffer
     await req.user.save()
     res.send()
 }, (error,req,res,next)=>{ res.statuc(400).send({error: error.message})})


 router.get('/users/:id/avatar' , async (req, res) =>{
     try{
     const user= await User.findById(req.params.id)

     if(!user || ! user.avatar ) 
     {
         throw new Error('invalid request')
     }
      res.set('Content-Type' , 'image/png')
     res.send(user.avatar)

 }catch(e) {
     res.status(400).send({'error' : e})
 } } )

 router.delete('/users/me/avatar' , auth , async(req,res) =>{
     req.user.avatar = undefined 
     await req.user.save()
     res.send()
 },(error, req , res, next) =>{
     res.stataus(400).send({error:error.message})
 })

 module.exports = router 