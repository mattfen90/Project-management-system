import * as usersService from './users.service.js';

export async function listUsers(req, res) {
  try {
    const { page, limit, search, role, status } = req.query;
    const result = await usersService.getAllUsers({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      search: search || '',
      role: role || '',
      status: status || '',
    });
    res.json(result);
  } catch {
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
}

export async function getUser(req, res) {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'User not found' });
    res.status(500).json({ message: 'Failed to retrieve user' });
  }
}

export async function createUser(req, res) {
  try {
    const user = await usersService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.message === 'MISSING_FIELDS') return res.status(400).json({ message: 'All fields are required' });
    if (err.message === 'USER_ALREADY_EXISTS') return res.status(409).json({ message: 'Username or email already exists' });
    res.status(500).json({ message: 'Failed to create user' });
  }
}

export async function updateUser(req, res) {
  try {
    const user = await usersService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'User not found' });
    res.status(500).json({ message: 'Failed to update user' });
  }
}

export async function deleteUser(req, res) {
  try {
    await usersService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') return res.status(404).json({ message: 'User not found' });
    res.status(500).json({ message: 'Failed to delete user' });
  }
}

export async function listRoles(req, res) {
  try {
    const roles = await usersService.getRoles();
    res.json(roles);
  } catch {
    res.status(500).json({ message: 'Failed to retrieve roles' });
  }
}