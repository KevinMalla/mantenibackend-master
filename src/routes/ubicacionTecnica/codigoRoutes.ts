import { Router } from 'express';
import codigoController from '../../controllers/ubicacionTecnica/codigoController';

class CodigoRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/:seccionid', codigoController.selectCodigos);
        this.router.post('/', codigoController.addCodigo);
        this.router.put('/:codigoid', codigoController.updateCodigo);
        this.router.delete('/:codigoid', codigoController.deleteCodigo);
    }
}
const codigoRoutes = new CodigoRoutes();
export default codigoRoutes.router;