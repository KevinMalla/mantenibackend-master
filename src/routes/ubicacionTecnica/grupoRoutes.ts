import { Router } from 'express';
import grupoController from '../../controllers/ubicacionTecnica/grupoController';

class GrupoRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/:codigoid', grupoController.selectGrupos);
        this.router.post('/', grupoController.addGrupo);
        this.router.put('/:grupoid', grupoController.updateGrupo);
        this.router.delete('/:grupoid', grupoController.deleteGrupo);
    }
}
const grupoRoutes = new GrupoRoutes();
export default grupoRoutes.router;