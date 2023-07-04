/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import fs from 'fs';
import apiRouter from './routes';

export class MongoDBServer {
    private port: number;
    private server: Application;

    constructor() {
        dotenv.config();
        this.port = (process.env.PORT || 3000) as number;
        this.config();
    }

    private config(): void {
        this.server = express();
        this.server.use(cors());
        this.server.use(express.json({ limit: '30mb' }));
        this.server.use(express.urlencoded({ limit: '30mb', extended: true }));

        this.server.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            if (req.method === 'OPTIONS') {
                res.status(200).end();
            }

            next();
        });


        this.server.use('/api', apiRouter);

        this.server.get('/', (req: Request, res: Response) => {
            const apiHtml: any = this.getAPIRoutes(apiRouter.stack);
            let html: string = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
            html = html.replace('{{content}}', apiHtml);
            res.status(200).send(html);
        });
    }



    private getAPIRoutes(stacks: Record<string, any>[]): string {
        const colorMapper: Record<string, string> = {
            get: 'info',
            post: 'success',
            put: 'warning',
            patch: 'warning',
            delete: 'danger',
        };
        let html: any = '<div class="row pt-4">';
        stacks.forEach((stack: Record<string, any>, index: number) => {
            const guid: any = `accordion-${(Math.random().toString(36) + '00000000000000000').slice(2, 8)}-${index}`;
            const routerName: any = stack.regexp
                .toString()
                .replace(/[^\w\s]/g, '')
                .slice(0, -1);
            html += `<div class="card p-0 mb-4">
                <div class="card-header">
                    <span class="card-title text-primary">${routerName}</span>
                </div>
                <div class="card-body">
                    <div class="accordion" id="${guid}">`;
            let content: any = '';
            stack.handle.stack.forEach((routeObj: Record<string, any>, i: number) => {
                const routeType: string = Object.keys(routeObj.route.methods)[0];
                const textColor: any = colorMapper[routeType];
                const itemGuid: any = (Math.random().toString(36) + '00000000000000000').slice(2, 8);
                const itemHeaderId: any = `heading-${itemGuid}-${i}`;
                const itemContentId: any = `collapse-${itemGuid}-${i}`;
                content += `<div class="accordion-item">
                    <h2 class="accordion-header" id="${itemHeaderId}">
                        <button class="accordion-button py-2 collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${itemContentId}" aria-expanded="false" aria-controls="${itemContentId}">
                           <span class="text-uppercase text-${textColor}" style="width:70px">${routeType}</span> 
                           <span class="text-primary">/api/${routerName + routeObj.route.path}</span>
                        </button>
                    </h2>
                    <div id="${itemContentId}" class="accordion-collapse collapse" aria-labelledby="${itemHeaderId}" data-bs-parent="#${guid}">
                        <div class="accordion-body">
                            Route Schema
                        </div>
                    </div>
                </div>`;
            });
            html += content + '</div></div></div>';
        });
        html += '</div>';
        return html;
    }

    public start(): void {
        this.server.listen(this.port, () => {
            console.log(`Express server listening on port ${this.port}`);
        });
    }
}
