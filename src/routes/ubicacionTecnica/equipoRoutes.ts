import { Router } from 'express';
import equipoController from '../../controllers/ubicacionTecnica/equipoController';

class EquipoRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/:grupoid', equipoController.selectEquipos);
        this.router.post('/', equipoController.addEquipo);
        this.router.put('/:equipoid', equipoController.updateEquipo);
        this.router.delete('/:equipoid', equipoController.deleteEquipo);
    }
}
const equipoRoutes = new EquipoRoutes();
export default equipoRoutes.router;