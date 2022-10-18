import { Router } from 'express';
import utpreventivoController from '../../controllers/UT_Preventivo/utpreventivoController';

class UTPreventivosRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }
    config(){
        this.router.post('/preventivos', utpreventivoController.selectAllUtPreventivos);
        this.router.post('/', utpreventivoController.addUtPreventivo);
        this.router.get('/comprobarfin/:utprevid', utpreventivoController.comprobarOTFin)
        this.router.put('/:utprevid', utpreventivoController.updatePreventivo)
    }
}
const utpreventivosRoutes = new UTPreventivosRoutes();
export default utpreventivosRoutes.router;