import { Router } from 'express';
import gastoMaterialController from '../../controllers/GastoMaterial/gastoMaterialController';

class GastoMaterialRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){

        this.router.get('/', gastoMaterialController.getGastoMaterial)    
        this.router.put('/', gastoMaterialController.updateGastoMaterial);    
        this.router.post('/', gastoMaterialController.addGastoMaterial);    
        //this.router.delete('/:gastoid', gastoMaterialController.deleteGastoMaterial);    

        //Para ordenes de trabajo
        this.router.get('/:ordenid', gastoMaterialController.getGastoMaterialDeOrden)        
        this.router.delete('/:gastoid/:ordenid', gastoMaterialController.deleteGastoMaterialOrden)
        this.router.post('/:ordenid', gastoMaterialController.addGastoMaterialOrden); 
    }
}
const gastoMaterialRoutes = new GastoMaterialRoutes();
export default gastoMaterialRoutes.router;