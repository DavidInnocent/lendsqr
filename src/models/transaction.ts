import { Model } from 'objection';
import TransactionType from './transaction.type';

export default class Transaction extends Model {
    id!: number;
    walletId!: number;
    amount!: number;
    type!: TransactionType;
    reference!: string;
    status?: string;
    metadata?: Record<string, any>;
    createdAt!: Date;
    updatedAt!: Date;

    static get tableName() {
        return 'transactions';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['walletId', 'amount', 'type', 'reference'],
            properties: {
                id: { type: 'integer' },
                walletId: { type: 'integer' },
                amount: {
                    type: 'number',
                    minimum: 0.01 // This is minmun but should be removed ideal
                },
                type: {
                    type: 'string',
                    enum: Object.values(TransactionType)
                },
                reference: {
                    type: 'string',
                    minLength: 5,
                    maxLength: 50
                },
                status: {
                    type: 'string',
                    enum: ['pending', 'completed', 'failed'],
                    default: 'completed'
                },
                metadata: { type: 'object' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        };
    }

    static get relationMappings() {
        return {
            wallet: {
                relation: Model.BelongsToOneRelation,
                modelClass: 'Wallet',
                join: {
                    from: 'transactions.walletId',
                    to: 'wallets.id'
                }
            }
        };
    }

    // Timestamp columns
    static get timestamps() {
        return true;
    }

    // Optional: Add indexes for better query performance
    static get indexes() {
        return [
            {
                name: 'transactions_walletId_index',
                columns: ['walletId']
            },
            {
                name: 'transactions_reference_index',
                columns: ['reference'],
                unique: true
            },
            {
                name: 'transactions_createdAt_index',
                columns: ['createdAt']
            }
        ];
    }
}