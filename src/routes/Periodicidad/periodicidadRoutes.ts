import { Router } from 'express';
import PeriodicidadController from '../../controllers/Periodicidad/periodicidadController';

class PeriodicidadRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/', PeriodicidadController.selectPeriodiciad);
        this.router.post('/', PeriodicidadController.addPeriodicidad);
        this.router.put('/:periodicidadid', PeriodicidadController.updatePeriodicidad);
        this.router.delete('/:periodicidadid', PeriodicidadController.deletePeriodicidad);
        this.router.get('/:id', PeriodicidadController.selectPeriodicidadPorId);
    }
}
const periodicidadRoutes = new PeriodicidadRoutes();
export default periodicidadRoutes.router;