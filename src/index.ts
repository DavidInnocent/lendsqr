import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes'
import walletRoutes from './routes/wallet.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/wallets', walletRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));