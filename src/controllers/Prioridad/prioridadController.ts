import { Request, Response } from 'express';
import sql from '../../database';


class PrioridadController{
    //Obtiene las prioridades de la tabla
    public async selectPrioridad(req:Request, res:Response){
        const prioridad = await sql.query(`SELECT * FROM Prioridad`);
        res.status(200).json(prioridad.recordset);
    }

}
const prioridadController = new PrioridadController();
export default prioridadController;