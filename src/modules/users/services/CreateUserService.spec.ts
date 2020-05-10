import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let creatUser: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        creatUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to create a new user', async () => {
        const user = await creatUser.execute({
            name: 'Jhon Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with same email from another', async () => {
        await creatUser.execute({
            name: 'Jhon Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(
            creatUser.execute({
                name: 'Jhon Doe',
                email: 'johndoe@example.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
