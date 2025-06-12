import mongoose, { mongo } from "mongoose";
import * as dotenv from "dotenv";
import cors from 'cors';
import express from "express";
import data from "./data/mock.js";
import Task from "./models/Task.js";
import { DATABASE_URL } from "./env.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const asyncHandler = (handle) => {
    return async (req, res) => {
        try{
            await handle(req, res);
        } catch(err){
            if(err.name === 'ValidationError') {
                res.status(400).send({message: err.message});
            } else{
                res.status(500).send({message: err.message});
            }
        }
    }
}

await mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'));

app.get('/tasks', asyncHandler( async (req, res) => {
	const sort = req.query.sort
	const count = Number(req.query.count)

    const sortOption = {
        createdAt: sort === 'oldest' ? 'asc' : 'desc',
    }
	
    const tasks = await Task.find().sort(sortOption).limit(count);
    res.send(tasks);

	// const compareFn = sort === 'oldest' ? (a, b) => a.createdAt - b.createdAt : (a, b) => b.createdAt - a.createdAt
	// let sortedTasks = mockTasks.sort(compareFn)
	
	// if (count) {
	// 	sortedTasks = sortedTasks.slice(0, count)
	// }
	
	// res.send(sortedTasks)
}));

app.get('/tasks/:id', async(req, res) => {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (task){
        res.send(task);
    } else {
        res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
    }
})

app.post('/tasks', async (req, res) => {
  const task = await Task.create(req.body);
  res.send(task);
})

app.delete('/tasks/:id', async(req, res) => {
    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);

    if (task){
        res.send(task);
    } else {
        res.status(404).send({ message: '해당 id를 찾을 수 없습니다.' });
    }
})

app.patch('/tasks/:id', async(req, ress) => {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if(task){
        Object.keys(req.body).forEach((keyName) => {
            task[keyName] = req.body[keyName];
        })
        await task.save();
        res.send(task);
    }
})

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
