import express from 'express';
import cors from 'cors';
import router from '../routes/api';

export class Server {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(Bun.env.PORT as string, 10) || 3000;
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  private routes() {
    this.app.use('/', router);
  }

  public listen() {
    if (!this.port || this.port < 0 || this.port > 65535 || isNaN(this.port)) {
      throw new Error("Invalid port number");
    }
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port} 🚀`);
    });
  }
}