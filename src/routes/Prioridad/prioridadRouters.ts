import { Router } from 'express';
import prioridadController from '../../controllers/Prioridad/prioridadController';

class PrioridadRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/', prioridadController.selectPrioridad);
    }
}
const prioridadRoutes = new PrioridadRoutes();
export default prioridadRoutes.router;