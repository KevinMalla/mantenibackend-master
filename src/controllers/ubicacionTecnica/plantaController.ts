import { Request, Response } from 'express';
import sql from '../../database'

class PlantaController{
    //Obtiene todas las plantas
    public async selectAll(req:Request, res:Response):Promise<any>{
        try{
            const plantas = await sql.query("select * from planta");
            res.json(plantas.recordset)

        }catch(error){
            res.json(error)
        }
    }
    //Crea una planta
    public async createPlanta(req: Request, res: Response):Promise<void>{
        try {
            await sql.query(`INSERT INTO Planta(Denominacion, Descripcion) VALUES('${req.body.Denominacion}', '${req.body.Descripcion}')`)
            res.status(200).json({ message: "Planta creada correctamente" })
        } catch (error) {
            res.json(error)
        }
    }
    //Actualiza una planta pasada por parámetro
    public async updatePlanta(req:Request, res:Response):Promise<void>{
        try{  
            await sql.query(`UPDATE PLANTA set Denominacion='${req.body.Denominacion}', Descripcion='${req.body.Descripcion}' WHERE PlantaId='${req.params.plantaid}'`)
            res.status(200).json({message:"Planta actualizada correctamente"})
        }catch(error){
            res.json(error)
        }
    }
    //Elimina una planta pasada por parámetro
    public async deletePlanta(req:Request, res:Response):Promise<void>{
        try{           
            await sql.query(`DELETE FROM Planta WHERE PlantaId='${req.params.plantaid}'`)
            res.status(201).json({message:"Planta eliminada correctamente"})
        }catch(error){
            res.json(error)
        }
    }
}
const plantaController = new PlantaController();
export default plantaController;