import { Router } from 'express';
import estadosController from '../../controllers/Estados/estadosController,';

class EstadosRoutes{
    public router:Router = Router();

    constructor(){
        this.config();

    }
    config(){        
        this.router.get('/', estadosController.selectEstados); 
    }
}
const estadosRoutes = new EstadosRoutes();
export default estadosRoutes.router;