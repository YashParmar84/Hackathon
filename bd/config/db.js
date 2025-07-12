const mongose = require('mongoose');    

const connectDb = async () =>{
    
    try {
        
        await mongose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully");

    } catch (error) {
    console.error('MongoDB Connection Failed ❌', err.message);
    process.exit(1); // Exit process with failure

    }
    
}

module.exports = connectDb;