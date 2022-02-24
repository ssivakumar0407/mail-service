/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express';
import { HolidayModel, HolidaySchema } from '../models/holiday';
import { connectToDatabase } from '../config/db.config';

const router: Router = Router();

//get all the data
router.get('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const response: HolidaySchema[] = await HolidayModel.find();
        return res.status(200).json({ status: true, result: response });
    } catch (error) {
        return res.status(401).json({ status: false, message: error.message });
    }
});

// create  one data
router.post('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const Holiday: HolidaySchema = new HolidayModel({
            name: req.body.name,
            holidayCode: Math.floor(Math.random() * 90000) + 10000,
        });
        const response: HolidaySchema = await Holiday.save();
        return res.status(200).json({ status: true, message: 'Holiday Added Successfully!', result: response });
    } catch (error) {
        return res.status(404).json({ status: false, message: error.message });
    }
});

//update holiday
router.patch('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const holidayCode: any = req.body.holidayCode;
        await HolidayModel.findOneAndUpdate(holidayCode, { $set: req.body.name });
        return res.status(200).json({ status: true, message: 'Updated Successfully' });
    } catch (error) {
        return res.status(401).json({ status: false, message: error.message });
    }
});

export = router;
