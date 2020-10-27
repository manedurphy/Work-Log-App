import * as express from 'express';
import * as controllers from './controllers';
import * as cors from 'cors';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

class MyServer extends Server {
  private readonly SERVER_STARTED = 'Listening on port: ';

  constructor() {
    super(true);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.setupControllers();
  }

  private setupControllers(): void {
    const controllerInstances = [];
    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        const controller = (controllers as any)[name];
        controllerInstances.push(new controller());
      }
    }
    super.addControllers(controllerInstances);
  }

  public start(port: number): void {
    this.app.get('*', (req, res) => {
      res.send(this.SERVER_STARTED + port);
    });
    this.app.listen(port, () => {
      Logger.Imp(this.SERVER_STARTED + port);
    });
  }
}

export default MyServer;
