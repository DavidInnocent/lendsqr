import db from '../database';
import Transaction from '../models/transaction';
import TransactionType from '../models/transaction.type';

class TransactionRepository {
    async create(
        data: {
            walletId: number;
            amount: number;
            type: TransactionType;
            reference: string;
            status?: string;
        },
        trx?: any
    ): Promise<Transaction> {
        try {
            const [id] = await (trx || db)('transactions').insert({
                ...data,
                status: data.status || 'completed',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return this.findById(id, trx);
        } catch (error) {
            throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findById(id: number, trx?: any): Promise<Transaction> {
        const transaction = await (trx || db)('transactions').where({ id }).first();
        if (!transaction) throw new Error('Transaction not found');
        return transaction;
    }

    async findByReference(reference: string, trx?: any): Promise<Transaction | null> {
        return (trx || db)('transactions').where({ reference }).first() || null;
    }

    async findByWalletId(walletId: number, trx?: any): Promise<Transaction[]> {
        return (trx || db)('transactions')
            .where({ walletId })
            .orderBy('createdAt', 'desc');
    }

    async getWalletBalance(walletId: number, trx?: any): Promise<number> {
        const result = await (trx || db)('transactions')
            .where({ walletId, status: 'completed' })
            .sum('amount as balance')
            .first();
        return Number(result?.balance) || 0;
    }
}

export default new TransactionRepository();