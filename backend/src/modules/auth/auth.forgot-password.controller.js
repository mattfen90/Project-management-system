import { forgotPassword } from './auth.forgot-password.service.js';

export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;
    const result = await forgotPassword(email);
    // Never expose the token in the response
    return res.status(200).json({ message: result.message });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Forgot password failed',
    });
  }
}
