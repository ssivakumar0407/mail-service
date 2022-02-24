import { Router } from 'express';
import usersRouter from './user';
import companyDetails from './company';
import UserDetails from './userDetails';
import holiday from './holiday';
import employee from './employee';
import auth from './auth';

const apiRouter: Router = Router();

apiRouter.use('/user', usersRouter);
apiRouter.use('/company', companyDetails);
apiRouter.use('/UserDetails', UserDetails);
apiRouter.use('/holiday', holiday);
apiRouter.use('/employee', employee);
apiRouter.use('/auth', auth);

export default apiRouter;
