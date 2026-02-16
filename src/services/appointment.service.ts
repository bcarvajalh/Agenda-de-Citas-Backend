import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

export const AppointmentService = {
  async getAllDoctors() {
    return await prisma.user.findMany({
      where: { role: Role.MEDICO },
      select: { id: true, name: true, email: true }
    });
  },

  async getAgenda(doctorId: string, date: string | undefined) { 
    let whereClause: any = { doctorId };

    if (date && typeof date === 'string') {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.999Z`);
      whereClause.dateTime = { gte: startOfDay, lte: endOfDay };
    }

    return await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: { select: { name: true, email: true } },
        doctor: { select: { name: true } }
      },
      orderBy: { dateTime: 'asc' }
    });
  },

  async create(dateTime: string, doctorId: string, patientId: string) {
    const dateObj = new Date(dateTime);

    const doctor = await prisma.user.findUnique({ where: { id: doctorId } });
    if (!doctor || doctor.role !== Role.MEDICO) {
      throw new Error("El usuario seleccionado no es un médico válido.");
    }

    const existing = await prisma.appointment.findFirst({
      where: { doctorId, dateTime: dateObj }
    });

    if (existing) {
      throw new Error("El médico ya tiene una cita programada para esta hora.");
    }

    return await prisma.appointment.create({
      data: {
        dateTime: dateObj,
        doctorId,
        patientId,
        status: "PENDIENTE"
      }
    });
  },

  async delete(id: string) {
    return await prisma.appointment.delete({
      where: { id }
    });
  }
};