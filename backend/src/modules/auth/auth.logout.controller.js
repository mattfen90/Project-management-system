import prisma from '../../lib/prisma.js';

/**
 * POST /api/auth/logout
 * Records the logout event and instructs the client to discard the token.
 * Token-based auth is stateless, so true server-side invalidation requires a blocklist.
 * Here we record the logout in userlogintable and clear any active session markers.
 */
export async function logoutController(req, res) {
  try {
    const userId = parseInt(req.user?.userId);
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (userId) {
      // Record logout event in login history
      await prisma.userlogintable.create({
        data: {
          UserID: userId,
          IPAddress: ipAddress,
          Success: true,
          UserAgent: userAgent,
          FailureReason: 'Logged out',
        },
      });

      // Store the invalidated token in the DB so authenticate middleware can reject it
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        await prisma.invalidatedtokenstable.create({
          data: {
            Token: token,
            UserID: userId,
            InvalidatedAt: new Date(),
          },
        }).catch(() => {
          // If table doesn\'t exist yet, silently skip — client-side logout still works
        });
      }
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong during logout' });
  }
}
