import { Request, Response } from 'express';
import walletService from './../services/wallet.service';

class WalletController {
  async fundWallet(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { amount, reference } = req.body;
      const newBalance = await walletService.fundWallet(userId, amount, reference);
      res.json({ balance: newBalance });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

        res.status(400).json({ error: errorMessage });
    }
  }

  async transferFunds(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { recipientEmail, amount } = req.body;
      const result = await walletService.transferFunds(userId, recipientEmail, amount);
      res.json(result);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

        res.status(400).json({ error: errorMessage });
    }
  }

  async withdrawFunds(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { amount } = req.body;
      const newBalance = await walletService.withdrawFunds(userId, amount);
      res.json({ balance: newBalance });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        res.status(400).json({ error: errorMessage });
    }
  }
}

export default new WalletController();
