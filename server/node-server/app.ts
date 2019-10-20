import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Routes } from './routes/app.routes';

class App {

    app: express.Application = express();
    routePrv: Routes = new Routes();

    constructor() {
        this.config();
        this.configureRoutes();
    }

    private config(): void {
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        // serving static files
        this.app.use(express.static('dist'));
    }

    private configureRoutes() {
        this.routePrv.routes(this.app);
    }

}

export default new App().app;
