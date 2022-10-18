import { Request, Response } from 'express';
import sql from '../../database';


class EstadosController{

    /** Obtener todos los estados de la tabla estado ot; se utilizará para definir el estado de las ordenes de trabajo */
    public async selectEstados(req:Request, res:Response){
        const estados = await sql.query(`SELECT * FROM EstadoOt`);
        res.json(estados.recordset);
    }

}
const estadosController = new EstadosController();
export default estadosController;