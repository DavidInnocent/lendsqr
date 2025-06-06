import walletService from '../wallet.service';
import WalletRepository from '../../repositories/walletRepository';
import TransactionRepository from '../../repositories/transactionRepository';
import UserRepository from '../../repositories/userRepository';

jest.mock('../../repositories/walletRepository');
jest.mock('../../repositories/transactionRepository');
jest.mock('../../repositories/userRepository');

describe('WalletService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fundWallet', () => {
        test('should fund wallet successfully', async () => {
            (TransactionRepository.findByReference as jest.Mock).mockResolvedValue(undefined);
            (WalletRepository.findByUserId as jest.Mock).mockResolvedValue({ id: 1, balance: 500 });
            (WalletRepository.updateBalance as jest.Mock).mockResolvedValue({ id: 1, balance: 1000 });
            (TransactionRepository.create as jest.Mock).mockResolvedValue({});

            const newBalance = await walletService.fundWallet(1, 500, 'ref-123');
            expect(newBalance).toBe(1000);
        });
    });

    describe('transferFunds', () => {
        test('should throw if insufficient funds', async () => {
            (WalletRepository.findByUserId as jest.Mock).mockResolvedValueOnce({ id: 1, balance: 100 });

            await expect(walletService.transferFunds(1, 'recipient@example.com', 200))
                .rejects
                .toThrow('Insufficient funds');
        });
    });

    describe('withdrawFunds', () => {
        test('should withdraw funds successfully', async () => {
            (WalletRepository.findByUserId as jest.Mock).mockResolvedValue({ id: 1, balance: 500 });
            (WalletRepository.updateBalance as jest.Mock).mockResolvedValue({ id: 1, balance: 300 });
            (TransactionRepository.create as jest.Mock).mockResolvedValue({});

            const newBalance = await walletService.withdrawFunds(1, 200);
            expect(newBalance).toBe(300);
        });
    });
});
