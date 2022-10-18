import { Router } from 'express';
import encabezadoController from '../../controllers/Encabezado/encabezadoController';

class EncabezadoRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.get('/planta', encabezadoController.selectAllPlantas);
        this.router.get('/trabajador/:planta/:codigoTrabajador', encabezadoController.selectTrabajador);
        this.router.get('/login/:Codigo/:Password', encabezadoController.login);
        this.router.get('/usuario/:codigo', encabezadoController.selectUsuario);
        this.router.put('/usuario/:codigo', encabezadoController.changePassword);
        // this.router.delete('/tarea/:preventivoid/:tareaid', encabezadoController.deleteTareaPrev);
        // this.router.put('/tarea/:tareaid', encabezadoController.updateTarea);
    }
}
const encabezadoRoutes = new EncabezadoRoutes();
export default encabezadoRoutes.router;