import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database/db.js';
import cors from 'cors';
import userRoute from './Routes/userRoute.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin:[process.env.FRONTEND_URL],
  methods:['GET','POST','PUT','DELETE'],
  credentials:true
}));
app.use(cookieParser());

app.use('/api/user', userRoute);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
