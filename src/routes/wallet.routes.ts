import express from 'express';
import WalletController from '../controllers/wallet.controller';
import {
  validateFund,
  validateTransfer,
  validateWithdraw
} from '../utils/validation';
import { authenticate } from './../middleware/auth.middleware';

const router = express.Router();

// router.use(authenticate);

router.post('/fund', validateFund, WalletController.fundWallet);
router.post('/transfer', validateTransfer, WalletController.transferFunds);
router.post('/withdraw', validateWithdraw, WalletController.withdrawFunds);

export default router;
