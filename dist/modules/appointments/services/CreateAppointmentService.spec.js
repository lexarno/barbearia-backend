"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeNotificationsRepository = _interopRequireDefault(require("../../notifications/repositories/fakes/FakeNotificationsRepository"));

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _CreateAppointmentService = _interopRequireDefault(require("./CreateAppointmentService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentsRepository;
let fakeNotificationsRepository;
let creatAppointment;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentsRepository.default();
    fakeNotificationsRepository = new _FakeNotificationsRepository.default();
    creatAppointment = new _CreateAppointmentService.default(fakeAppointmentsRepository, fakeNotificationsRepository);
  });
  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointment = await creatAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'provider-id',
      user_id: 'user-id'
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });
  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 5, 6, 16);
    await creatAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider-id',
      user_id: 'user-id'
    });
    expect(creatAppointment.execute({
      date: appointmentDate,
      provider_id: 'provider-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('sholud not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(creatAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: 'provider-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('sholud not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(creatAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: 'user-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('sholud not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(creatAppointment.execute({
      date: new Date(2020, 4, 11, 7),
      provider_id: 'provider-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
    await expect(creatAppointment.execute({
      date: new Date(2020, 4, 11, 18),
      provider_id: 'provider-id',
      user_id: 'user-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});