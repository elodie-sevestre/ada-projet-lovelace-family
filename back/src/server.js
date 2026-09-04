import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes.js';
import tasksRoutes from './routes/tasksRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import { config } from '../config/env.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = config.port_back;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/auth', loginRoutes);

app.listen(PORT, () => {
  // console.log(`Backend running on http://localhost:${PORT}`);
});
