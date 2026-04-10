import * as accountLinksService from './account-links.service.js';

export async function listLinkableUsers(req, res) {
  try {
    const { role } = req.query;
    const users = await accountLinksService.getLinkableUsers(role);
    res.json(users);
  } catch (err) {
    if (err.message === 'INVALID_ROLE') {
      return res.status(400).json({ message: 'Role must be Client or Worker' });
    }

    res.status(500).json({ message: 'Failed to retrieve linkable users' });
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
    if (err.message === 'CLIENT_NOT_FOUND') {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (err.message === 'USER_NOT_FOUND_OR_INVALID_ROLE') {
      return res.status(400).json({ message: 'User not found or does not have Client role' });
    }

    if (err.message === 'USER_ALREADY_LINKED') {
      return res.status(409).json({ message: 'User is already linked to another client' });
    }
    if (err.message === 'USER_ID_REQUIRED') {
         return res.status(400).json({ message: 'userId is required' });
    }
    res.status(500).json({ message: 'Failed to link client to user' });
  }
}

export async function unlinkClientUser(req, res) {
  try {
    const result = await accountLinksService.unlinkClientFromUser(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'CLIENT_NOT_FOUND') {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(500).json({ message: 'Failed to unlink client user' });
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
    if (err.message === 'WORKER_NOT_FOUND') {
      return res.status(404).json({ message: 'Worker not found' });
    }

    if (err.message === 'USER_NOT_FOUND_OR_INVALID_ROLE') {
      return res.status(400).json({ message: 'User not found or does not have Worker role' });
    }

    if (err.message === 'USER_ALREADY_LINKED') {
      return res.status(409).json({ message: 'User is already linked to another worker' });
    }
    if (err.message === 'USER_ID_REQUIRED') {
         return res.status(400).json({ message: 'userId is required' });
    }
    res.status(500).json({ message: 'Failed to link worker to user' });
  }
}

export async function unlinkWorkerUser(req, res) {
  try {
    const result = await accountLinksService.unlinkWorkerFromUser(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'WORKER_NOT_FOUND') {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(500).json({ message: 'Failed to unlink worker user' });
  }
}