/* eslint-disable prefer-arrow/prefer-arrow-functions */
import express, {
    Application,
    NextFunction,
    Request,
    Response,
  } from 'express';

  import fileUpload from 'express-fileupload';
  
  import Controller from './Controller';
  
  class App {
    public app: Application;
    private readonly port: number;
    private readonly controllers: Controller[];
  
    public constructor(controllers: Controller[], port: number) {
      this.app = express();
      this.port = port;
      this.controllers = controllers;
  
      this.initializeMiddlewares();
      this.initializeControllers();
    }
  
    public listen = () => {
      this.app.listen(this.port, () => {
        console.log(`App listening on the port ${this.port}`);
      });
    };
  
    private initializeMiddlewares = () => {
      this.app.use(express.json());
      this.app.use(fileUpload());
      this.app.use(express.static('/storage'));
    };
  
    private initializeControllers = () => {
      this.controllers.forEach((controller: { path: any; router: any; }) => {
        this.app.use(controller.path, controller.router);
      });
    };
  }
  
  export default App;
  