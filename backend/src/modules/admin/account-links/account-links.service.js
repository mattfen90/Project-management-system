import prisma from '../../../lib/prisma.js';

export async function getLinkableUsers(roleName) {
  if (!roleName || !['Client', 'Worker'].includes(roleName)) {
    throw new Error('INVALID_ROLE');
  }

  const relationFilter =
    roleName === 'Client'
      ? { clienttable: null }
      : { workertable: null };

  return prisma.usertable.findMany({
    where: {
      deleted_at: null,
      userrolestable: {
        UserRoleName: roleName,
      },
      ...relationFilter,
    },
    select: {
      UserID: true,
      Username: true,
      Email: true,
      AccountStatus: true,
      userrolestable: {
        select: {
          UserRoleID: true,
          UserRoleName: true,
        },
      },
    },
    orderBy: {
      Username: 'asc',
    },
  });
}

export async function linkClientToUser(clientId, userId) {
  if (!userId) throw new Error('USER_ID_REQUIRED');

  const client = await prisma.clienttable.findFirst({
    where: {
      ClientID: Number(clientId),
      deleted_at: null,
    },
    include: {
      usertable: true,
    },
  });

  if (!client) throw new Error('CLIENT_NOT_FOUND');

  const user = await prisma.usertable.findFirst({
    where: {
      UserID: Number(userId),
      deleted_at: null,
      userrolestable: {
        UserRoleName: 'Client',
      },
    },
    include: {
      clienttable: true,
    },
  });

  if (!user) throw new Error('USER_NOT_FOUND_OR_INVALID_ROLE');

  if (user.clienttable && user.clienttable.ClientID !== Number(clientId)) {
    throw new Error('USER_ALREADY_LINKED');
  }

  return prisma.clienttable.update({
    where: {
      ClientID: Number(clientId),
    },
    data: {
      UserID: Number(userId),
    },
    select: {
      ClientID: true,
      UserID: true,
      ClientName: true,
      ClientSurname: true,
      ClientEmail: true,
      ClientStatus: true,
      usertable: {
        select: {
          UserID: true,
          Username: true,
          Email: true,
          AccountStatus: true,
          userrolestable: {
            select: {
              UserRoleID: true,
              UserRoleName: true,
            },
          },
        },
      },
    },
  });
}

export async function unlinkClientFromUser(clientId) {
  const client = await prisma.clienttable.findFirst({
    where: {
      ClientID: Number(clientId),
      deleted_at: null,
    },
  });

  if (!client) throw new Error('CLIENT_NOT_FOUND');

  return prisma.clienttable.update({
    where: {
      ClientID: Number(clientId),
    },
    data: {
      UserID: null,
    },
    select: {
      ClientID: true,
      UserID: true,
    },
  });
}

export async function linkWorkerToUser(workerId, userId) {
  if (!userId) throw new Error('USER_ID_REQUIRED');

  const worker = await prisma.workertable.findFirst({
    where: {
      WorkerID: Number(workerId),
      deleted_at: null,
    },
    include: {
      usertable: true,
    },
  });

  if (!worker) throw new Error('WORKER_NOT_FOUND');

  const user = await prisma.usertable.findFirst({
    where: {
      UserID: Number(userId),
      deleted_at: null,
      userrolestable: {
        UserRoleName: 'Worker',
      },
    },
    include: {
      workertable: true,
    },
  });

  if (!user) throw new Error('USER_NOT_FOUND_OR_INVALID_ROLE');

  if (user.workertable && user.workertable.WorkerID !== Number(workerId)) {
    throw new Error('USER_ALREADY_LINKED');
  }

  return prisma.workertable.update({
    where: {
      WorkerID: Number(workerId),
    },
    data: {
      UserID: Number(userId),
    },
    select: {
      WorkerID: true,
      UserID: true,
      WorkerName: true,
      WorkerSurname: true,
      WorkerEmail: true,
      WorkerStatus: true,
      usertable: {
        select: {
          UserID: true,
          Username: true,
          Email: true,
          AccountStatus: true,
          userrolestable: {
            select: {
              UserRoleID: true,
              UserRoleName: true,
            },
          },
        },
      },
    },
  });
}

export async function unlinkWorkerFromUser(workerId) {
  const worker = await prisma.workertable.findFirst({
    where: {
      WorkerID: Number(workerId),
      deleted_at: null,
    },
  });

  if (!worker) throw new Error('WORKER_NOT_FOUND');

  return prisma.workertable.update({
    where: {
      WorkerID: Number(workerId),
    },
    data: {
      UserID: null,
    },
    select: {
      WorkerID: true,
      UserID: true,
    },
  });
}