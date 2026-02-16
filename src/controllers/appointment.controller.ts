import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

export const getDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await AppointmentService.getAllDoctors();
    res.json(doctors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDoctorAgenda = async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  try {
    let whereClause: any = { doctorId: doctorId };

    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);

      whereClause.dateTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const agenda = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: { select: { name: true } }
      },
      orderBy: { dateTime: 'asc' }
    });

    res.json(agenda);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la agenda" });
  }
};

export const schedule = async (req: Request, res: Response) => {
  try {
    const { dateTime, doctorId, patientId } = req.body;

    if (!dateTime || !doctorId || !patientId) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const newAppointment = await AppointmentService.create(dateTime, doctorId, patientId);
    
    res.status(201).json({
      message: "Cita agendada con éxito",
      data: newAppointment
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointmentId = id as string;

    if (!appointmentId) {
      return res.status(400).json({ error: "El ID de la cita es obligatorio" });
    }

    await prisma.appointment.delete({
      where: { 
        id: appointmentId
      }
    });

    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar la cita o no existe." });
  }
};