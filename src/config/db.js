const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://Mbuvi:0606%2F2022@joshskitenge.la4ymqs.mongodb.net/?retryWrites=true&w=majority&appName=Joshskitenge'
          , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
