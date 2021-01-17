const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Task= require('../model/task')

router.get('/tasks', auth ,async (req,res) =>{

    const match={}
    const sort={}

    

    if(req.query.complete)
    {
        match.complete = req.query.complete === 'true'
    }

    if(req.query.sortBy)
    {
       const parts = req.query.sortBy.split(':')
       sort[parts[0]] = parts[1]==='asc' ?1:-1
    } 
   // console.log(match)
    try {

       await req.user.populate({
           path: 'tasks',
           match,
           options : {
               limit: parseInt(req.query.limit),
               skip: parseInt(req.query.skip),
               sort
           }
       }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id' , auth , async (req,res) =>{
    const _id = req.params.id
   // console.log(_id)
    try{
         const task= await Task.findOne({_id , owner: req.user._id })

         if(!task) {
             res.status(404).send()
            }

         res.send(task)

    }catch(error)
    { 
        res.status(500).send(error)
    }
})


router.post('/tasks', auth, async (req,res) =>{
    const newTask = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await newTask.save()
        res.send(newTask)
    }
    catch(error){
       res.status(400).send(e)
    }
    // newTask.save().then( () => {
    //     res.send(newTask)
    // }).catch( (e)=>{
    //     res.status(400).send(e)
    // })
})


router.patch('/tasks/:id',auth , async (req,res) =>{
    const updates = Object.keys(req.body)
    const isAllowed=['description' , 'complete']
    const toValidate = updates.every((update)=>  isAllowed.includes(update))

    if(!toValidate)
    {
        return res.status(404).send('Validation Key not found !!')
    }

    try {
        const task= await Task.findOne({_id:req.params.id, owner: req.user._id})
        updates.forEach( (update) => task[update]= req.body[update] )
         await task.save()

        if(!task)
        {
            res.status(404)
             //res.status(400).send('no task with given id ', req.params.id)
        }
        res.status(200).send(task)

    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id' ,auth , async (req,res) =>{
    try {
        const task= await  Task.findOneAndDelete({_id: req.params.id , owner:req.user._id} )
        if(!task)
        {
            res.status(400).send()
        }
        res.send(task)
        
    } catch (error) {
        res.send(500).send(error)
    }
})




module.exports = router