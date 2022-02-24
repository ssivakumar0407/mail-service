import { Router } from 'express';
import email from './email';

const apiRouter: Router = Router();
apiRouter.use('/email', email);

export default apiRouter;
