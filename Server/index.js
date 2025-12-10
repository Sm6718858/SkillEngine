import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Database/db.js';
import cors from 'cors';
import userRoute from './Routes/userRoute.js';
import courseRoute from './Routes/courseRoute.js'
import cookieParser from 'cookie-parser';
import mediaRoute from './Routes/mediaRoute.js';
import purchaseRoute from './Routes/purchaseRoute.js';  
import courseProgressRoute from './Routes/courseProgressRoute.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin:["https://skill-engine.vercel.app",
  "http://localhost:5173"],
  methods:['GET','POST','PUT','DELETE','PATCH'],
  credentials:true
}));
app.use(cookieParser());

app.use('/api/media',mediaRoute);
app.use('/api/user', userRoute);
app.use('/api/course',courseRoute)
app.use('/api/purchase', purchaseRoute);
app.use("/api/progress", courseProgressRoute);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
