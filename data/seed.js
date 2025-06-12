import mongoose, { mongo } from "mongoose";
import Task from "../models/Task.js";
import data from "./mock.js";
import { DATABASE_URL } from "../env.js";

await mongoose
    .connect(DATABASE_URL)
    .then(() => console.log('Connected to DB'));

await Task.deleteMany({})
await Task.insertMany(data.map((data) =>{
    delete data.id
    return data
}));

await mongoose.connection.close();