const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL ,{
    useNewUrlParser : true,
    useCreateIndex:true,
    useFindAndModify:false
})



// const me = new User ({
//     name:'abhishek        ',
//     age:44,
//     email:'shwetay1508@gmail.com',
//     password:'password'
// })

// me.save().then( ( ) =>{
//     console.log(me)
// }).catch( (error) =>{
//     console.log('error : ' , error)
// })


// const me= new task({
//     description: 'This is description field    ',
    
// })

// me.save().then( () => {
//    console.log(me)
// }).catch( (error) => {
//     console.log(error)
// })