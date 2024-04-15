const mongoose = require('mongoose');

URI = "mongodb+srv://forsejennyb:LC7b7wowIXqsCsE3@dev-aws-exercise-tracke.mogbzip.mongodb.net/?retryWrites=true&w=majority&appName=dev-aws-exercise-tracker";

function connectDB(){
    try { 
        mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true,})
    }
    catch(err) {
        console.error(err.message);
        process.exit();
    }
    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
        console.log(`Database connected`);
    });


    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
    })
    return;
}

module.exports = { connectDB };