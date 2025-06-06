import db from '../database';
import WalletRepository from '../repositories/walletRepository';
import TransactionRepository from '../repositories/transactionRepository';
import UserRepository from '../repositories/userRepository';
import TransactionType from '../models/transaction.type';

class WalletService {
    async fundWallet(userId: number, amount: number, reference: string) {
        return db.transaction(async trx => {

            const existingTx = await TransactionRepository.findByReference(reference, trx);
            if (existingTx) throw new Error('Duplicate transaction reference');
            const walletExists = await WalletRepository.create(1, trx);
            console.log(walletExists);
            const wallet = await WalletRepository.findByUserId(userId, trx);
            const newBalance = wallet.balance + amount;

            await WalletRepository.updateBalance(wallet.id, newBalance, trx);
            await TransactionRepository.create({
                walletId: wallet.id,
                amount,
                type: TransactionType.FUNDING,
                reference
            }, trx);

            return newBalance;
        });
    }

    async transferFunds(senderId: number, recipientEmail: string, amount: number) {
        return db.transaction(async trx => {
            const senderWallet = await WalletRepository.findByUserId(senderId, trx);

            // Check insuficient balance
            if (senderWallet.balance < amount) {
                throw new Error('Insufficient funds');
            }

        
            const recipient = await UserRepository.findByEmail(recipientEmail);
            if (!recipient) throw new Error('Recipient not found');

            const recipientWallet = await WalletRepository.findByUserId(recipient.id, trx);

            // Update balance for both wallets down here
            const senderNewBalance = senderWallet.balance - amount;
            const recipientNewBalance = recipientWallet.balance + amount;

            await WalletRepository.updateBalance(senderWallet.id, senderNewBalance, trx);
            await WalletRepository.updateBalance(recipientWallet.id, recipientNewBalance, trx);

            const txReference = `TRANSFER-${Date.now()}`;
            await TransactionRepository.create({
                walletId: senderWallet.id,
                amount,
                type: TransactionType.TRANSFER_OUT,
                reference: `${txReference}-OUT`
            }, trx);

            await TransactionRepository.create({
                walletId: recipientWallet.id,
                amount,
                type: TransactionType.TRANSFER_IN,
                reference: `${txReference}-IN`
            }, trx);

            return { senderBalance: senderNewBalance, recipientBalance: recipientNewBalance };
        });
    }

    async withdrawFunds(userId: number, amount: number) {
        return db.transaction(async trx => {
            const wallet = await WalletRepository.findByUserId(userId, trx);

            if (wallet.balance < amount) {
                throw new Error('Insufficient funds');
            }

            const newBalance = wallet.balance - amount;
            await WalletRepository.updateBalance(wallet.id, newBalance, trx);

            await TransactionRepository.create({
                walletId: wallet.id,
                amount,
                type: TransactionType.WITHDRAWAL,
                reference: `WITHDRAW-${Date.now()}`
            }, trx);

            return newBalance;
        });
    }
}

export default new WalletService();