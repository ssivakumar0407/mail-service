/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express';
import { pick } from 'lodash';
import { CompanyModel, CompanySchema } from '../models/companyDetails';
import { connectToDatabase } from '../config/db.config';

const router: Router = Router();

// Getting all data
router.get('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const allData: CompanySchema[] = await CompanyModel.find();
        return res.json({ status: true, result: allData });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message, error: err });
    }
});

// Update company details
router.patch('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const id: any = req.body._id;
        const data: Pick<any, string> = pick(req.body, [
            'company_details',
            'address',
            'county',
            'city',
            'email',
            'mobile',
            'websiteUrl',
            'contactPerson',
            'state',
            'postalCode',
            'phoneNo',
        ]);
        await CompanyModel.findByIdAndUpdate(id, { $set: data });
        return res.status(200).json({ status: true, message: 'Updated Successfully' });
    } catch (error) {
        return res.json({ status: false, message: error.message, error: error });
    }
});

export = router;
