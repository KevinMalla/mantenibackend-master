import { Router } from 'express';
import zonaController from '../../controllers/ubicacionTecnica/zonaController';

class ZonaRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/:areaid', zonaController.selectZonas);
        this.router.post('/', zonaController.addZona);
        this.router.put('/:zonaid', zonaController.updateZona);
        this.router.delete('/:zonaid', zonaController.deleteZona);
    }
}
export default new ZonaRoutes().router;