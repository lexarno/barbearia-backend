import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../../infra/typeorm/entities/User';

// SOLID (L) - Liskov Substitution Principle
// Libs externas (ex. BD) podem ser substituídas sem causar impacto na aplicação
// Por isso adicionei a interface IAppointmentsRepository

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const userData = this.users.find(user => user.id === id);

        return userData;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const userData = this.users.find(user => user.email === email);

        return userData;
    }

    public async create({
        name,
        email,
        password,
    }: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid(), name, email, password });

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(
            findUser => findUser.id === user.id,
        );

        this.users[findIndex] = user;

        return user;
    }
}

export default FakeUsersRepository;
