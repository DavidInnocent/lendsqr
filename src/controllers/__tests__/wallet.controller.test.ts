import request from 'supertest';
import express from 'express';
import walletRoutes from '../../routes/wallet.routes';
import walletService from '../../services/wallet.service';

jest.mock('../../services/wallet.service');

const app = express();
app.use(express.json());


app.use((req, res, next) => {
    req.user = { id: 1, email: 'test@example.com' };
    next();
});

app.use('/api/wallets', walletRoutes);

describe('WalletController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fundWallet - success', async () => {
        (walletService.fundWallet as jest.Mock).mockResolvedValue(1000);

        const response = await request(app)
            .post('/api/wallets/fund')
            .send({ amount: 500, reference: 'ref-123' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ balance: 1000 });
        expect(walletService.fundWallet).toHaveBeenCalledWith(1, 500, 'ref-123');
    });

    test('transferFunds - success', async () => {
        (walletService.transferFunds as jest.Mock).mockResolvedValue({
            senderBalance: 500,
            recipientBalance: 1500,
        });

        const response = await request(app)
            .post('/api/wallets/transfer')
            .send({ recipientEmail: 'recipient@example.com', amount: 200 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            senderBalance: 500,
            recipientBalance: 1500,
        });
    });

    test('withdrawFunds - success', async () => {
        (walletService.withdrawFunds as jest.Mock).mockResolvedValue(300);

        const response = await request(app)
            .post('/api/wallets/withdraw')
            .send({ amount: 200 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ balance: 300 });
    });
});
