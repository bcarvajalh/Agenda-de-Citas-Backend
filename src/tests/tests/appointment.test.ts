import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

const mockDelete = vi.fn();
const mockFindMany = vi.fn();

vi.mock('@prisma/client', () => {
  const mockPrismaInstance = {
    appointment: {
      delete: vi.fn().mockResolvedValue({ id: 'appointment-id-123' }),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn(),
    },
  };

  return {
    PrismaClient: vi.fn().mockImplementation(function() {
      return mockPrismaInstance;
    }),
    Role: { PACIENTE: 'PACIENTE', DOCTOR: 'DOCTOR' }
  };
});

vi.mock('../../services/appointment.service', () => ({
  AppointmentService: {
    create: vi.fn(),
  }
}));

import * as AppointmentController from '../../controllers/appointment.controller';
import { AppointmentService } from '../../services/appointment.service';

const app = express();
app.use(express.json());
app.post('/schedule', AppointmentController.schedule);
app.delete('/cancel/:id', AppointmentController.cancelAppointment);

describe('Appointment Controller Tests', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /schedule', () => {
    it('debería retornar 201 si los datos son correctos', async () => {
      vi.mocked(AppointmentService.create).mockResolvedValue({ id: '123' } as any);

      const response = await request(app)
        .post('/schedule')
        .send({
          dateTime: '2026-05-20T10:00:00Z',
          doctorId: 'doc-1',
          patientId: 'pat-1'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Cita agendada con éxito");
    });

    it('debería retornar 400 si faltan datos', async () => {
      const response = await request(app)
        .post('/schedule')
        .send({ doctorId: 'doc-1' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /cancel/:id', () => {
    it('debería retornar 204 al cancelar con éxito', async () => {
      const response = await request(app).delete('/cancel/appointment-id-123');
      
      expect(response.status).toBe(204);
    });
  });
});