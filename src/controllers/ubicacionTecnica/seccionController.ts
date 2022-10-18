import { Request, Response } from 'express';
import sql from '../../database';

class SeccionController{
    //Obtiene todas las secciones
    public async getSecciones(req: Request, res: Response):Promise<any>{
        try {
            const secciones = await sql.query(`SELECT * FROM seccion`);
            if (secciones.recordset.length>0) {
                res.json(secciones.recordset);
            } else {
                res.status(404).json({ message: "No existen secciones para esta zona" })
            }
        } catch (error) {
            res.json(error)
        }
    }
    //Obtiene las secciones de una determinada zona
    public async selectSecciones(req: Request, res: Response):Promise<any>{
        try {
            const secciones = await sql.query(`SELECT * FROM seccion WHERE zonaid = '${req.params.zonaid}'`);
            if (secciones.recordset.length>0) {
                res.json(secciones.recordset);
            } else {
                res.status(404).json({ message: "No existen secciones para esta zona" })
            }
        } catch (error) {
            res.json(error)
        }
    }
    //Añade una sección a una determinada zona
     public async addSeccion(req:Request, res:Response):Promise<void>{
        try{
            await sql.query(`insert into seccion(Denominacion, Descripcion, ZonaId) values('${req.body.Denominacion}', '${req.body.Descripcion}', '${req.body.ZonaId}')`);
            res.status(200).json({message:"Sección introducida correctamente"});
        }catch(error){
            res.json(error)
        }
    }
    //Actualiza una sección pasada por parámetro
    public async updateSeccion(req:Request, res:Response):Promise<void>{
        await sql.query(`UPDATE seccion set Denominacion = '${req.body.Denominacion}', Descripcion = '${req.body.Descripcion}' where SeccionId='${req.params.seccionid}'`);
        res.json({message:"Sección modificada correctamente"});
    }
    //Elimina una sección pasada por parámetro
    public async deleteSeccion(req:Request, res:Response):Promise<void>{
        try{
        await sql.query(`DELETE FROM seccion WHERE SeccionId = '${req.params.seccionid}'`);
        res.status(201).json({message:"Sección eliminada correctamente"});
        }catch(error){
            res.json(error)
        }
    }
}
const seccionController = new SeccionController();
export default seccionController;