import { Router } from 'express';
import empresaExternaController from '../../controllers/EmpresaExterna/empresaExterna.controller';

class EmpresaExternaRoutes {

    public router:Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', empresaExternaController.getEmpresasExternas);
        this.router.post('/', empresaExternaController.addEmpresaExterna);
        this.router.delete('/:id', empresaExternaController.deleteEmpresaExterna);
        this.router.put('/:id', empresaExternaController.updateEmpresaExterna);
    }

}

const empresaExternaRoutes = new EmpresaExternaRoutes();
export default empresaExternaRoutes.router;
