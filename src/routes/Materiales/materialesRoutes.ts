import { Router } from 'express';
import materialController from '../../controllers/Materiales/materialController';

class MaterialesRoutes{
    public router:Router = Router();

    constructor(){
        this.config();

    }
    config(){        
        this.router.get('/', materialController.selectMateriales); 
        this.router.post('/', materialController.addMaterial)
        this.router.put('/:matid',materialController.updateMaterial)
        this.router.delete('/:matid', materialController.deleteMaterial) 
    }
}
const materialesRoutes = new MaterialesRoutes();
export default materialesRoutes.router;