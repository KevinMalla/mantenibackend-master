import { Request, Response } from 'express';
import sql from '../../database';

class GrupoController{
    //Obtiene los grupos de un determinado código pasado por parámetro
    public async selectGrupos(req: Request, res: Response):Promise<any> {
        try {
            const grupos = await sql.query(`select * from grupo where codigoid = '${req.params.codigoid}'`);
            if (grupos.recordset.length>0) {
                res.status(200).json(grupos.recordset);
            }else {
                 res.status(404).json({ message: "No existen grupos para este código" })
            }
        } catch (error) {
            res.json(error)
            console.log(error)
        }
    }
    //Añade un grupo a un determinado código pasado por parámetro
    public async addGrupo(req:Request, res:Response):Promise<void>{
        try{
            await sql.query(`insert into grupo(Denominacion, Descripcion, CodigoId) values('${req.body.Denominacion}', '${req.body.Descripcion}', '${req.body.CodigoId}')`);
            res.status(200).json({message:"Grupo introducido correctamente"});     
        }catch(error){
            res.json(error)
            console.log(error)
        }
    }
    //Actualiza el grupo pasado por parámetro
    public async updateGrupo(req:Request, res:Response):Promise<void>{
        try{
        await sql.query(`UPDATE grupo SET Denominacion = '${req.body.Denominacion}', Descripcion = '${req.body.Descripcion}' WHERE grupoid='${req.params.grupoid}'`);
        res.status(201).json({message:"Grupo modificado correctamente"});
        }catch(error){
            res.json(error)
        }
    }
    //Elimina un grupo pasado por parámetro
    public async deleteGrupo(req:Request, res:Response):Promise<void>{
        try{
            await sql.query(`delete from grupo where grupoid='${req.params.grupoid}'`);
        res.status(201).json({message:"Grupo eliminado correctamente"});        

        }catch(error){
            res.json(error)
        }
    }
}
const grupoController = new GrupoController();
export default grupoController;