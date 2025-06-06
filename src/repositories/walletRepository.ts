import db from '../database';
import Wallet from '../models/wallet';

class WalletRepository {
    async create(
        userId: number,
        trx?: any
    ): Promise<Wallet> {
        try {
            const [id] = await (trx || db)('wallets').insert({
                userId,
                balance: 0,
                currency: 'KES',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return this.findById(id, trx);
        } catch (error) {
            throw new Error(`Failed to create wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findById(id: number, trx?: any): Promise<Wallet> {
        const wallet = await (trx || db)('wallets').where({ id }).first();
        if (!wallet) throw new Error('Wallet not found');
        return wallet;
    }

    async findByUserId(userId: number, trx?: any): Promise<Wallet> {
        const wallet = await (trx || db)('wallets').where({ userId }).first();
        if (!wallet) throw new Error('Wallet not found for user');
        return wallet;
    }

    async updateBalance(
        id: number,
        newBalance: number,
        trx?: any
    ): Promise<Wallet> {
        try {
            await (trx || db)('wallets')
                .where({ id })
                .update({
                    balance: newBalance,
                    updatedAt: new Date()
                });
            return this.findById(id, trx);
        } catch (error) {
            throw new Error(`Failed to update wallet balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async walletExists(userId: number, trx?: any): Promise<boolean> {
        const result = await (trx || db)('wallets')
            .where({ userId })
            .count('* as count')
            .first();
        return Number(result?.count) > 0;
    }
}

export default new WalletRepository();