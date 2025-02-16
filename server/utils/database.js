const mongoose = require("mongoose");

//----- Function To Connect To MongoDB -----
const database = async () => {
  try {
    //Establish Connection With MongoDB
    const connectDB = await mongoose.connect(
      "mongodb+srv://joewrdd:Ghoul1212@aiwrddcluster.otnux.mongodb.net/aiwrdd?retryWrites=true&w=majority&appName=AIWrddCluster"
    );

    //Log Successful Connection
    console.log(`MongoDB Connected ${connectDB.connection.host}`);
  } catch (error) {
    //Log Error & Exit Process If Connection Fails
    console.error(`Error connecting to MongoDB ${error.message}`);
    process.exit(1);
  }
};

module.exports = database;
