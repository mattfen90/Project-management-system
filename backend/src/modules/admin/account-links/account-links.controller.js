import * as accountLinksService from './account-links.service.js';

export async function listLinkableUsers(req, res) {
  try {
    const { role } = req.query;
    const users = await accountLinksService.getLinkableUsers(role);
    res.json(users);
  } catch (err) {
    console.error('listLinkableUsers error:', err);

    if (err.message === 'INVALID_ROLE') {
      return res.status(400).json({
        message: 'Invalid role parameter. Must be "Client" or "Worker".',
      });
    }

    res.status(500).json({
      message: 'An error occurred while fetching linkable users.',
      error: err.message,
    });
  }
}

export async function linkClientUser(req, res) {
  try {
    const result = await accountLinksService.linkClientToUser(
      req.params.id,
      req.body.userId
    );
    res.json(result);
  } catch (err) {
    console.error('linkClientUser error:', err);

    if (err.message === 'USER_ID_REQUIRED') {
      return res.status(400).json({ message: 'userId is required' });
    }
    if (err.message === 'CLIENT_NOT_FOUND') {
      return res.status(404).json({ message: 'Client not found' });
    }
    if (err.message === 'USER_NOT_FOUND_OR_INVALID_ROLE') {
      return res.status(400).json({ message: 'User not found or invalid Client role' });
    }
    if (err.message === 'USER_ALREADY_LINKED') {
      return res.status(409).json({ message: 'User is already linked to another client' });
    }

    res.status(500).json({ message: 'Failed to link client to user', error: err.message });
  }
}

export async function unlinkClientUser(req, res) {
  try {
    const result = await accountLinksService.unlinkClientFromUser(req.params.id);
    res.json(result);
  } catch (err) {
    console.error('unlinkClientUser error:', err);

    if (err.message === 'CLIENT_NOT_FOUND') {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(500).json({ message: 'Failed to unlink client user', error: err.message });
  }
}

export async function linkWorkerUser(req, res) {
  try {
    const result = await accountLinksService.linkWorkerToUser(
      req.params.id,
      req.body.userId
    );
    res.json(result);
  } catch (err) {
    console.error('linkWorkerUser error:', err);

    if (err.message === 'USER_ID_REQUIRED') {
      return res.status(400).json({ message: 'userId is required' });
    }
    if (err.message === 'WORKER_NOT_FOUND') {
      return res.status(404).json({ message: 'Worker not found' });
    }
    if (err.message === 'USER_NOT_FOUND_OR_INVALID_ROLE') {
      return res.status(400).json({ message: 'User not found or invalid Worker role' });
    }
    if (err.message === 'USER_ALREADY_LINKED') {
      return res.status(409).json({ message: 'User is already linked to another worker' });
    }

    res.status(500).json({ message: 'Failed to link worker to user', error: err.message });
  }
}

export async function unlinkWorkerUser(req, res) {
  try {
    const result = await accountLinksService.unlinkWorkerFromUser(req.params.id);
    res.json(result);
  } catch (err) {
    console.error('unlinkWorkerUser error:', err);

    if (err.message === 'WORKER_NOT_FOUND') {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(500).json({ message: 'Failed to unlink worker user', error: err.message });
  }
}