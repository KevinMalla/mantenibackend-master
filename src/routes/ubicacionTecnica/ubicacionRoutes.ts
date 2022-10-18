import { Router } from 'express';
import ubicacionController from '../../controllers/ubicacionTecnica/ubicacionController';

class UbicacionRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.post('/', ubicacionController.selectUbicaciones);
    }
}
const ubicacionRoutes = new UbicacionRoutes();
export default ubicacionRoutes.router;