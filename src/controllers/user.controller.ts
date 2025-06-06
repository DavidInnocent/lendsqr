import { Request, Response } from 'express';
import userService from '../services/user.service';

class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = req.body;
            const newUser = await userService.createUser(userData);


            const { password, ...safeUser } = newUser;

            res.status(201).json(safeUser);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            res.status(400).json({ error: errorMessage });
        }
    }
}

export default new UserController();
