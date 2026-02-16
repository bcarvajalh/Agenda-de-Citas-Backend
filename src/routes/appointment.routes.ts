import { Router } from 'express';
import { 
  getDoctors, 
  schedule, 
  getDoctorAgenda, 
  cancelAppointment 
} from '../controllers/appointment.controller';

const router = Router();

router.get('/doctors', getDoctors);
router.post('/schedule', schedule);
router.get('/agenda/:doctorId', getDoctorAgenda);
router.delete('/cancel/:id', cancelAppointment);

export default router;