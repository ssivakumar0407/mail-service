/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express';
import { pick } from 'lodash';
import { EmployeeModel, EmployeeSchema } from '../models/employee';
import { connectToDatabase } from '../config/db.config';

const router: Router = Router();

//get all the data
router.get('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const response: EmployeeSchema[] = await EmployeeModel.find();
        res.status(200).json({ status: true, result: response });
    } catch (error) {
        res.status(401).json({ status: false, message: error.message });
    }
});

// create  one data
router.post('/', async function (req: Request, res: Response) {
    try {
        await connectToDatabase();
        const employeeData: EmployeeSchema = new EmployeeModel({
            name: req.body.name,
            designation: req.body.designation,
            employeeId: req.body.employeeId,
            phone: req.body.phone,
            dob: req.body.dob,
            email: req.body.email,
            address: req.body.address,
            gender: req.body.gender,
            skills: req.body.skills,
            educationInformation: req.body.educationInformation,
            experience: req.body.experience,
        });
        const response: EmployeeSchema = await employeeData.save();
        return res.status(200).json({ status: true, message: 'User Added Successfully!', result: response });
    } catch (error) {
        return res.status(404).json({ status: false, message: error.message });
    }
});

//update user
router.patch('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const id: any = req.body._id;
        const data: Pick<any, string> = pick(req.body, [
            'name',
            'designation',
            'employeeId',
            'phone',
            'email',
            'dob',
            'address',
            'gender',
            'skills',
            'educationInformation',
            'experience',
        ]);
        await EmployeeModel.findOneAndUpdate(id, { $set: data });
        return res.status(200).json({ status: true, message: 'Updated Successfully' });
    } catch (error) {
        return res.json({ status: false, message: error.message });
    }
});

//delete employee data by employeeId
router.delete('/', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const employeeId: any = req.body.employeeId;
        await EmployeeModel.findOneAndDelete(employeeId);
        return res.status(200).json({ status: true, message: 'Delete Successfully' });
    } catch (error) {
        return res.status(401).json({ status: false, message: error.message });
    }
});

export = router;
