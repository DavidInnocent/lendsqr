import { Model } from 'objection';

export default class User extends Model {
    id!: number;
    name!: string;
    email!: string;
    password!: string;
    token!: string;

    static get tableName() {
        return 'users';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'email', 'password'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 3, maxLength: 100 },
                email: { type: 'string', format: 'email' },
                password: { type: 'string' },
                token: { type: 'string' },
            }
        };
    }
}