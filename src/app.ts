import express from 'express';

import { userEKYCRouter } from './module/user-ekyc/user-ekyc.router';

export class ServerApplication {
  private readonly port: number = 3456;

  public async run() {
    // create and setup express app
    const app = express();
    app.use(express.json());

    // init data source connect to DB
    await this.initDatabaseConnection();

    // register routes
    app.get('/api/health', (req, res) => {
      res.json({ message: 'application is ready' });
    });
    app.use('/api/v1/user-ekyc', userEKYCRouter);

    // start express server
    app.listen(this.port, () => {
      console.log(`EKYC Service Started on ${Date()}, Port ${this.port}`);
    });
  }

  async initDatabaseConnection() {
    console.info('Data Source initialization successfully!');
  }
}
