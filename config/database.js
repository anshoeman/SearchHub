const mongoose = require('mongoose')
const srv = "mongodb+srv://Cygnus2002:Cygnus2002@cluster0.xhsmb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const connectDB = async ()=>{
    try{
    await mongoose.connect(srv);
    console.log('MongoDB connected')
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectDB