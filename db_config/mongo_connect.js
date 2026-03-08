import mongoose from 'mongoose';


const connectDB = async () => {
    try {
        // Appending authSource=admin as it is required for authentication on some cloud providers
        const uri = `${process.env.MONGO_URI}/${process.env.MONGO_DB}?authSource=admin`;
        const sanitizedUri = uri.replace(/:([^:@]+)@/, ":****@");
        await mongoose.connect(uri);
        console.log("Connected to mongo db");
    } catch (e) {
        console.error("Error while connecting to mongo server: ", e);
        process.exit(1);
    }
};
export default connectDB;
