import * as clientsService from './clients.service.js';

export async function listClients(req, res) {
  try {
    const { page, limit, search, status, type } = req.query;
    const result = await clientsService.getAllClients({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      search: search || '',
      status: status || '',
      type: type || '',
    });
    res.json(result);
  } catch (err) {
    console.error('listClients error:', err);
    res.status(500).json({ message: 'Failed to retrieve clients', error: err.message });
  }
}

export async function getClient(req, res) {
  try {
    const client = await clientsService.getClientById(req.params.id);
    res.json(client);
  } catch (err) {
    console.error('getClient error:', err);
    if (err.message === 'CLIENT_NOT_FOUND') return res.status(404).json({ message: 'Client not found' });
    res.status(500).json({ message: 'Failed to retrieve client', error: err.message });
  }
}

export async function createClient(req, res) {
  try {
    const client = await clientsService.createClient(req.body);
    res.status(201).json(client);
  } catch (err) {
    console.error('createClient error:', err);
    if (err.message === 'MISSING_FIELDS') return res.status(400).json({ message: 'Name, email and type are required' });
    if (err.message === 'CLIENT_EMAIL_EXISTS') return res.status(409).json({ message: 'A client with this email already exists' });
    res.status(500).json({ message: 'Failed to create client', error: err.message });
  }
}

export async function updateClient(req, res) {
  try {
    const client = await clientsService.updateClient(req.params.id, req.body);
    res.json(client);
  } catch (err) {
    console.error('updateClient error:', err);
    if (err.message === 'CLIENT_NOT_FOUND') return res.status(404).json({ message: 'Client not found' });
    if (err.message === 'CLIENT_EMAIL_EXISTS') return res.status(409).json({ message: 'A client with this email already exists' });
    res.status(500).json({ message: 'Failed to update client', error: err.message });
  }
}

export async function deleteClient(req, res) {
  try {
    await clientsService.deleteClient(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('deleteClient error:', err);
    if (err.message === 'CLIENT_NOT_FOUND') return res.status(404).json({ message: 'Client not found' });
    res.status(500).json({ message: 'Failed to delete client', error: err.message });
  }
}
