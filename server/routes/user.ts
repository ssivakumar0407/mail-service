import { Request, Response, Router } from 'express';
import { UserModel, UserSchema } from '../models/userSchema';
import { connectToDatabase } from '../config/db.config';
import { UpdateWriteOpResult } from 'mongoose';

const router: Router = Router();

// Getting all data
router.get('/', async (req: Request, res: Response) => {
    try {
        const allData: UserSchema[] = await UserModel.find();
        return res.json({ status: true, result: allData });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
});

// Getting one data
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const oneData: UserSchema = await UserModel.findById({ _id: req.params.id });
        return res.json({ status: true, result: oneData });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
});

// Creating one data
router.post('/', async (req: Request, res: Response) => {
    const insertData: UserSchema = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });
    try {
        await connectToDatabase();
        const newUser: UserSchema = await insertData.save();
        return res.status(201).json({ status: true, result: newUser });
    } catch (err) {
        return res.status(400).json({ status: false, message: err.message });
    }
});

// Update data
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        // update automatically detect which one going to be update
        const updateData: UpdateWriteOpResult = await UserModel.updateOne({ _id: req.params.id }, { $set: req.body });
        return res.json({ status: true, result: updateData });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
});

// Delete one data
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deleteData: UserSchema = await UserModel.findByIdAndDelete({ _id: req.params.id });
        return res.json({ status: true, result: deleteData });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
});

export = router;
