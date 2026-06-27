import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import symptomRoutes from './routes/symptoms';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'https://urbanhealthpulse-production.up.railway.app'
}));
app.use(express.json());
app.use('/api', symptomRoutes);

app.listen(Number(process.env.PORT) || 3001, '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});
