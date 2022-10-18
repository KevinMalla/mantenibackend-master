import { Router } from 'express';
import operarioController from '../../controllers/Operario/operarioController';

class OperarioRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/trabajador', operarioController.selectTrabajadores);
        this.router.get('/trabajador/:codigo', operarioController.selectDatosDeOperario);
        this.router.get('/usuario', operarioController.selectUsuarios)
        this.router.post('/usuario/:CodigoTrabajador', operarioController.convertirAUsuario6)
        this.router.delete('/usuario/:CodigoTrabajador', operarioController.eliminarAlUsuarioDeTipo6)
    }
}
const operarioRoutes = new OperarioRoutes();
export default operarioRoutes.router;