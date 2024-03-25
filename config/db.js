import {config} from 'dotenv'
import { mongoose } from 'mongoose';

config();

const user=process.env.mongoURI

const connectDb= async () =>{
    try{
        await mongoose.connect(`mongodb+srv://${user}@cluster0.dwnwv8t.mongodb.net/event-mnager`)
        console.log('DB Connected')
    }catch(err){
        console.log(err)
    }
}

export default connectDb;
connectDb();