import { Model } from 'objection';
import User from './user';
import Transaction from './transaction';

export default class Wallet extends Model {
    id!: number;
    userId!: number;
    balance!: number;
    currency!: string;
    createdAt!: Date;
    updatedAt!: Date;

    static get tableName() {
        return 'wallets';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userId', 'balance', 'currency'],
            properties: {
                id: { type: 'integer' },
                userId: { type: 'integer' },
                balance: {
                    type: 'number',
                    default: 0,
                    minimum: 0 
                },
                currency: {
                    type: 'string',
                    default: 'NGN',
                    minLength: 3,
                    maxLength: 3 
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        };
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'wallets.userId',
                    to: 'users.id'
                }
            },
            transactions: {
                relation: Model.HasManyRelation,
                modelClass: Transaction,
                join: {
                    from: 'wallets.id',
                    to: 'transactions.walletId'
                }
            }
        };
    }

    $beforeInsert() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    $beforeUpdate() {
        this.updatedAt = new Date();
    }
}