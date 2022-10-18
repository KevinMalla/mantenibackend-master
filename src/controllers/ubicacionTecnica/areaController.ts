import { Request, Response } from 'express';
import sql from '../../database';

class AreaController{

    //Obtiene las areas que pertenezcan a una planta determinada pasada por parámetro
    public async selectAreas(req: Request, res: Response):Promise<any>{
        try {
            const areas = await sql.query(`SELECT * FROM area WHERE PlantaId = '${req.params.plantaid}'`);
            if (areas.recordset.length>0) {
                res.status(200).json(areas.recordset);
            } else {
                res.status(404).json({ message: "No existen áreas para esta planta" })
            }
        } catch (error) {
            res.json(error)
            console.log(error)
        }
    }
    //Añade una área a una planta determinada
    public async addArea(req:Request, res:Response):Promise<void>{
        try{
            await sql.query(`INSERT INTO area(Denominacion, Descripcion, PlantaId) VALUES('${req.body.Denominacion}', '${req.body.Descripcion}','${req.body.PlantaId}')`);
            res.status(200).json({message:"Área introducida correctamente"});
        }catch(error){
            res.json(error)
            console.log(error)
        }
    }
    //actualiza el redistro de una orden determinada
    public async updateArea(req:Request, res:Response):Promise<void>{
        try{
            await sql.query(`UPDATE area SET Denominacion = '${req.body.Denominacion}', Descripcion = '${req.body.Descripcion}' WHERE AreaId = '${req.params.areaid}'`);
            res.status(201).json({message:"Área modificada correctamente"});
        }catch(error){
            res.json(error)
        }
    }
    //Elimina el area determinada por parámetro
    public async deleteArea(req:Request, res:Response):Promise<void>{
        try{
            await sql.query(`DELETE FROM area WHERE areaid = '${req.params.areaid}'`);
            res.status(201).json({message:"Área eliminada correctamente"});
        }catch(error){
            res.json(error)
        }

    }
}
const areaController = new AreaController();
export default areaController;