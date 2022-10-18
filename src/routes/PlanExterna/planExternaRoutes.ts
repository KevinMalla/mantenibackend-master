import { Router } from "express";
import planExternaController from "../../controllers/PlanExterna/planExternaController";

class PlanExternaRoutes {

    public router:Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/', planExternaController.getAllPlanExternas);
        this.router.get('/relacion', planExternaController.getAllPlanExternasRelacionadas);
        this.router.post('/', planExternaController.addPlanExterna);
        this.router.put('/:id', planExternaController.updatePlanExterna);
        this.router.delete('/:id', planExternaController.deletePlanExterna);
        this.router.get('/abiertas', planExternaController.getAllPlanExternasAbiertas);
        this.router.get('/:id', planExternaController.getAllPlanExternaById);
        this.router.put('/validar/:id', planExternaController.validarPlanExterna);
        this.router.get('/historicofiltrado/:periodicidad/:empresa/:estado', planExternaController.getHistoricoFiltrado);
    }

}

const planExternaRoutes = new PlanExternaRoutes();
export default planExternaRoutes.router;