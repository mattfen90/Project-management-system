import prisma from '../../../lib/prisma.js';

const CLIENT_SELECT = {
  ClientID: true,
  UserID: true,
  ClientName: true,
  ClientSurname: true,
  ClientEmail: true,
  ClientTelephone: true,
  ClientMobile: true,
  ClientAddress: true,
  ClientWebsite: true,
  ClientType: true,
  ClientStatus: true,
  Notes: true,
  created_at: true,
  updated_at: true,
  usertable: {
    select: {
      UserID: true,
      Username: true,
      Email: true,
      AccountStatus: true,
    },
  },
};

export async function getAllClients({ page = 1, limit = 20, search = '', status = '', type = '' }) {
  const skip = (page - 1) * limit;

  const where = {
    deleted_at: null,
    ...(search && {
      OR: [
        { ClientName: { contains: search, mode: 'insensitive' } },
        { ClientSurname: { contains: search, mode: 'insensitive' } },
        { ClientEmail: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(status && { ClientStatus: status }),
    ...(type && { ClientType: { contains: type, mode: 'insensitive' } }),
  };

  const [clients, total] = await Promise.all([
    prisma.clienttable.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: CLIENT_SELECT,
    }),
    prisma.clienttable.count({ where }),
  ]);

  return { clients, total, page, limit };
}

export async function getClientById(id) {
  const client = await prisma.clienttable.findFirst({
    where: { ClientID: Number(id), deleted_at: null },
    select: CLIENT_SELECT,
  });

  if (!client) throw new Error('CLIENT_NOT_FOUND');
  return client;
}

export async function createClient({
  clientName,
  clientSurname,
  clientEmail,
  clientTelephone,
  clientMobile,
  clientAddress,
  clientWebsite,
  clientType,
  clientStatus = 'Active',
  notes,
}) {
  if (!clientName || !clientEmail || !clientType) throw new Error('MISSING_FIELDS');

  const existing = await prisma.clienttable.findFirst({
    where: { ClientEmail: clientEmail, deleted_at: null },
  });
  if (existing) throw new Error('CLIENT_EMAIL_EXISTS');

  return prisma.clienttable.create({
    data: {
      ClientName: clientName,
      ClientSurname: clientSurname || null,
      ClientEmail: clientEmail,
      ClientTelephone: clientTelephone || null,
      ClientMobile: clientMobile || null,
      ClientAddress: clientAddress || null,
      ClientWebsite: clientWebsite || null,
      ClientType: clientType,
      ClientStatus: clientStatus,
      Notes: notes || null,
    },
    select: CLIENT_SELECT,
  });
}

export async function updateClient(id, {
  clientName,
  clientSurname,
  clientEmail,
  clientTelephone,
  clientMobile,
  clientAddress,
  clientWebsite,
  clientType,
  clientStatus,
  notes,
}) {
  const client = await prisma.clienttable.findFirst({
    where: { ClientID: Number(id), deleted_at: null },
  });
  if (!client) throw new Error('CLIENT_NOT_FOUND');

  if (clientEmail && clientEmail !== client.ClientEmail) {
    const emailTaken = await prisma.clienttable.findFirst({
      where: { ClientEmail: clientEmail, deleted_at: null, NOT: { ClientID: Number(id) } },
    });
    if (emailTaken) throw new Error('CLIENT_EMAIL_EXISTS');
  }

  const data = {};
  if (clientName !== undefined) data.ClientName = clientName;
  if (clientSurname !== undefined) data.ClientSurname = clientSurname || null;
  if (clientEmail !== undefined) data.ClientEmail = clientEmail;
  if (clientTelephone !== undefined) data.ClientTelephone = clientTelephone || null;
  if (clientMobile !== undefined) data.ClientMobile = clientMobile || null;
  if (clientAddress !== undefined) data.ClientAddress = clientAddress || null;
  if (clientWebsite !== undefined) data.ClientWebsite = clientWebsite || null;
  if (clientType !== undefined) data.ClientType = clientType;
  if (clientStatus !== undefined) data.ClientStatus = clientStatus;
  if (notes !== undefined) data.Notes = notes || null;

  return prisma.clienttable.update({
    where: { ClientID: Number(id) },
    data,
    select: CLIENT_SELECT,
  });
}

export async function deleteClient(id) {
  const client = await prisma.clienttable.findFirst({
    where: { ClientID: Number(id), deleted_at: null },
  });
  if (!client) throw new Error('CLIENT_NOT_FOUND');

  return prisma.clienttable.update({
    where: { ClientID: Number(id) },
    data: { deleted_at: new Date() },
  });
}
