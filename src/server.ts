import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import 'dotenv/config';
import appointmentRoutes from './routes/appointment.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/citas', appointmentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});