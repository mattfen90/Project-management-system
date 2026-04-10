import { Router } from 'express';
import { authenticate } from '../../../middleware/authenticate.js';
import { authorise } from '../../../middleware/authorise.js';
import * as usersController from './users.controller.js';

const router = Router();

router.use(authenticate);
router.use(authorise('Admin'));

router.get('/',        usersController.listUsers);
router.get('/roles',   usersController.listRoles);
router.get('/:id',     usersController.getUser);
router.post('/',       usersController.createUser);
router.put('/:id',     usersController.updateUser);
router.delete('/:id',  usersController.deleteUser);

export default router;