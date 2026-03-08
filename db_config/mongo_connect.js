import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = `${process.env.MONGO_URI}/${process.env.MONGO_DB}`;
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
