import * as express from 'express';
import * as controllers from '../controllers';
import * as cors from 'cors';
import * as path from 'path';
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
    this.app.use(
      express.static(
        path.join(__dirname, '..', '..', '..', 'frontend', 'build')
      )
    );
    this.app.get('*', (req, res) => {
      res.sendFile(
        path.join(
          __dirname,
          '..',
          '..',
          '..',
          'frontend',
          'build',
          'index.html'
        )
      );
    });
    this.app.listen(port, () => {
      Logger.Imp(this.SERVER_STARTED + port);
    });
  }
}

const server = new MyServer();
export default server;
