import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserRepository from '../repositories/userRepository';
import AdjutorService from './adjutorService';
import User from './../models/user';

class UserService {
    async createUser(userData: Partial<User>): Promise<User> {
        // Karma checking
        const isBlacklisted = await AdjutorService.checkBlacklist(userData.email!);
        if (isBlacklisted) {
            throw new Error('User is blacklisted and cannot be onboarded');
        }

        // Check if user existt
        const existingUser = await UserRepository.findByEmail(userData.email!);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password!, 10);

        const newUser = await UserRepository.create({
            ...userData,
            password: hashedPassword,
            token: this.generateToken(userData.email!)
        });

        return newUser;
    }

    private generateToken(email: string): string {
        return jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '2h' });
    }
}

export default new UserService();