import { Router } from 'express';
import seccionController from '../../controllers/ubicacionTecnica/seccionController';

class SeccionRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/:zonaid', seccionController.selectSecciones);
        this.router.get('/', seccionController.getSecciones);
        this.router.post('/', seccionController.addSeccion);
        this.router.put('/:seccionid', seccionController.updateSeccion);
        this.router.delete('/:seccionid', seccionController.deleteSeccion);
    }
}
const seccionRoutes = new SeccionRoutes();
export default seccionRoutes.router;