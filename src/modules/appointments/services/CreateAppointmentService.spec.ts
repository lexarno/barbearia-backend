import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const creatAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointment = await creatAppointment.execute({
            date: new Date(),
            provider_id: '123456789',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456789');
    });

    it('should not be able to create two appointments on the same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const creatAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointmentDate = new Date(2020, 5, 6, 16);

        await creatAppointment.execute({
            date: appointmentDate,
            provider_id: '123456789',
        });

        expect(
            creatAppointment.execute({
                date: appointmentDate,
                provider_id: '123456789',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
