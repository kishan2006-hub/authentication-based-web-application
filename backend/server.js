import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import {connectDB} from '../backend/config/db.js';
import authRouter from "../backend/routes/auth.js" 
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

app.listen(5000, () => console.log('Server running on port 5000'));

