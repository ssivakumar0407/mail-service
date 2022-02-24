/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express';
import { UserDetailsModel, UserDetailsSchema } from '../models/userDetails';
import { connectToDatabase } from '../config/db.config';

const router: Router = Router();

//get all the data
router.get('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const response: UserDetailsSchema[] = await UserDetailsModel.find();
        return res.status(200).json({ status: true, result: response });
    } catch (error) {
        return res.status(401).json({ status: false, message: error.message });
    }
});

// create  one data
router.post('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const User: UserDetailsSchema = new UserDetailsModel({
            userGroupName: req.body.name,
            userGroupCode: Math.floor(Math.random() * 90000) + 10000,
        });
        const response: UserDetailsSchema = await User.save();
        return res.status(200).json({ status: true, message: 'User Added Successfully!', result: response });
    } catch (error) {
        return res.status(404).json({ status: false, message: error.message });
    }
});

//update user
router.patch('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const userGroupCode: any = req.body.userGroupCode;
        const updatedData: Record<string, any> = { userGroupName: req.body.name };
        await UserDetailsModel.findOneAndUpdate(userGroupCode, { $set: updatedData });
        return res.status(200).json({ status: true, message: 'Update Successfully' });
    } catch (error) {
        return res.json({ status: false, message: error.message });
    }
});

// delete user
router.delete('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const userGroupCode: any = req.body.userGroupCode;
        await UserDetailsModel.findOneAndDelete(userGroupCode);
        return res.status(200).json({ status: true, message: 'Delete Successfully' });
    } catch (error) {
        return res.status(401).json({ status: false, message: error.message });
    }
});

export = router;
