import { Router } from 'express';
import plantaController from '../../controllers/ubicacionTecnica/plantaController';

class PlantaRoutes{

    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/', plantaController.selectAll);
        this.router.post('/', plantaController.createPlanta)
        this.router.put('/:plantaid',plantaController.updatePlanta)
        this.router.delete('/:plantaid', plantaController.deletePlanta)
    }
}
const plantaRoutes = new PlantaRoutes();
export default plantaRoutes.router;