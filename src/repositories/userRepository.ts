import db from '../database';
import User from './../models/user';

class UserRepository {
    async create(userData: Partial<User>): Promise<User> {
        const [id] = await db('users').insert(userData);
        return this.findById(id);
    }

    async findById(id: number): Promise<User> {
        return db('users').where({ id }).first();
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return db('users').where({ email }).first();
    }

    async findByToken(token: string): Promise<User | undefined> {
        return db('users').where({ token }).first();
    }
}

export default new UserRepository();