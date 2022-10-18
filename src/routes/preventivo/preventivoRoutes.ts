import { Router } from 'express';
import preventivoController from '../../controllers/preventivo/preventivoController';

class PreventivoRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/', preventivoController.selectAllPreventivos);
        this.router.get('/last', preventivoController.selectLastPreventivo);
        this.router.post('/', preventivoController.addPreventivo);
        this.router.put('/:preventivoid', preventivoController.updatePreventivo);
        this.router.delete('/:preventivoid', preventivoController.deletePreventivo);
        /**Periodicidades */
        this.router.get('/periodicidad/all', preventivoController.selectPeriodicidad,)
    }
}
const preventivoRoutes = new PreventivoRoutes();
export default preventivoRoutes.router;