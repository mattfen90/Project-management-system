import { loginUser } from './auth.services.js';

export async function login(req, res) {

    try{
        const result = await loginUser(req);

        return res.status(200).json({
            message: 'Login successful',
            ...result,
        });
    } catch (error) {
        if (error.message === 'MISSING_FIELDS') {
            return res.status(400).json({ message: 'Username/Email and password are required' });
        }
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        if (error.message === 'ACCOUNT_LOCKED') {
            return res.status(400).json({ message: 'Account is temporarily locked' });
        }
        if (error.message === 'ACCOUNT_INACTIVE') {
            return res.status(400).json({ message: 'Account is not active' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong' });

    }



}
