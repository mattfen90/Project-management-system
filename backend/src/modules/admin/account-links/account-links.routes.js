import { Router } from 'express';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorise } from '../../../middleware/authorise.js';
import * as accountLinksController from './account-links.controller.js';

const router = Router();

router.use(authenticate);
router.use(authorise('Admin'));

router.get('/users', accountLinksController.listLinkableUsers);
router.put('/clients/:id/link-user', accountLinksController.linkClientUser);
router.put('/clients/:id/unlink-user', accountLinksController.unlinkClientUser);
router.put('/workers/:id/link-user', accountLinksController.linkWorkerUser);
router.put('/workers/:id/unlink-user', accountLinksController.unlinkWorkerUser);

export default router;