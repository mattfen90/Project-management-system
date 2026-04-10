import { resetPassword } from './auth.reset-password.service.js';

export async function resetPasswordController(req, res) {
  try {
    const { token, newPassword } = req.body;

    const result = await resetPassword(token, newPassword);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Reset password failed',
    });
  }
}