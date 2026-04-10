import { Router } from 'express';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorise } from '../../../middleware/authorise.js';
import * as clientsController from './clients.controller.js';

const router = Router();

router.use(authenticate);
router.use(authorise('Admin'));

router.get('/',     clientsController.listClients);
router.get('/:id', clientsController.getClient);
router.post('/',    clientsController.createClient);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);

export default router;
