/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import { LeanDocument } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { generate } from 'generate-password';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EmployeeModel, EmployeeSchema } from '../models/employee';
import { authenticateToken, generateAccessToken } from '../helpers/jwt';
import { mailService } from '../helpers/nodemailer';
import { connectToDatabase } from '../config/db.config';

const router: Router = Router();

router.post('/login', async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ status: false, message: 'Email/Password empty', error: 'error' });
        }
        const user: LeanDocument<EmployeeSchema> = await EmployeeModel.findOne({ email: email }).lean();
        if (!user) {
            return res.json({ status: false, message: 'Invalid username/password', error: 'error' });
        }
        if (await compare(password, user.password)) {
            // the username, password combination is successful
            const token: string = await generateAccessToken(user.email);
            return res.json({ status: true, token: token, result: user });
        }
        return res.json({ status: false, message: 'Invalid username/password', error: 'error' });
    } catch (error) {
        return res.status(401).json({ status: false, message: error.message, error: error });
    }
});

router.post('/update-password', authenticateToken, async (req: Request, res: Response) => {
    await connectToDatabase();
    const { newPassword: plainTextPassword, email } = req.body;
    const user: LeanDocument<EmployeeSchema> = await EmployeeModel.findOne({ email: email }).lean();
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: false, message: 'Invalid password', error: 'error' });
    }
    if (plainTextPassword.length < 5) {
        return res.json({
            status: false,
            message: 'Password too small. Should be atleast 6 characters',
            error: 'error',
        });
    }
    if (!user) {
        return res.status(401).json({ status: false, message: 'User not found' });
    }
    try {
        const subject: any = 'Updated Password';
        const text: any = ' Updated Password is ';
        const salt: string = await genSalt(10);
        const pass: string = await hash(plainTextPassword, salt);
        const updatedData: Record<string, any> = { password: pass };
        await EmployeeModel.findByIdAndUpdate(user._id, { $set: updatedData });
        await mailService('', plainTextPassword, subject, text);
        return res.status(200).json({ status: true, message: ' Update successfully' });
    } catch (error) {
        return res.status(401).json({ status: false, message: error.message, error: error });
    }
});

router.post('/forgot-password', authenticateToken, async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const subject: any = 'Forgot Password';
        const text: any = 'Your temp password is';
        const { email } = req.body;
        if (!email) {
            return res.status(401).json('Please enter email');
        }
        const user: EmployeeSchema = await EmployeeModel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ status: false, email: email, message: 'Does not exits' });
        }
        const password: string = generate({ length: 10, numbers: true });
        if (password) {
            const result: SMTPTransport.SentMessageInfo = await mailService(email, password, subject, text);
            if (result.accepted.length > 0) {
                const salt: string = await genSalt(10);
                const newPassword: string = await hash(password, salt);
                const updatedData: Record<string, any> = { password: newPassword };
                await EmployeeModel.findByIdAndUpdate(user._id, { $set: updatedData });
                return res.send({ status: true, message: 'Please check your mail' });
            }
        }
    } catch (error) {
        return res.status(401).json({ status: false, message: error.message, error: error });
    }
});

router.put('/logout', authenticateToken, async (req: Request, res: Response) => {
    const authHeader: string = req.headers.authorization;
    sign(authHeader, '', { expiresIn: 1 }, (error: Error, success: string) => {
        return res.send({ msg: error || 'You have been Logged Out ' + success });
    });
});

export = router;
