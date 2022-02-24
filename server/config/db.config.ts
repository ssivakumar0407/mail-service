/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
dotenv.config();

const URI: string = process.env.MONGODB_URI;

export async function connectToDatabase(): Promise<void> {
    if (mongoose.connection.readyState) {
        console.log('Continued in existing database connection');
        return Promise.resolve();
    } else {
        await mongoose
            .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.info('Successfully connected to database');
                return Promise.resolve();
            })
            .catch((error: any) => {
                console.error(`Error connecting to database: ${error}`);
                return process.exit(1);
            });
    }
}
