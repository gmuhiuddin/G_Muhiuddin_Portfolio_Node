import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongoDbPass = process.env.mongoDb_Pass;

mongoose.connect(`mongodb+srv://gMuhiuddin:${mongoDbPass}@cluster0.xdif6qu.mongodb.net/G_Muhiuddin_Portfolio`);

export default mongoose;