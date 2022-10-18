import { Router } from 'express';
import areaController from '../../controllers/ubicacionTecnica/areaController';

class AreaRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/:plantaid', areaController.selectAreas);
        this.router.post('/', areaController.addArea);
        this.router.put('/:areaid', areaController.updateArea);
        this.router.delete('/:areaid', areaController.deleteArea);
    }
}
const areaRoutes = new AreaRoutes();
export default areaRoutes.router;