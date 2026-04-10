import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import adminUsersRoutes from './modules/admin/users/users.routes.js';

import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ message: 'API is running'});
});
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminUsersRoutes);
export default app;