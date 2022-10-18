import { Request, Response } from 'express';
import sql from '../../database';


class MaterialController{

    //Obtiene todos los materiales de la bbdd
    public async selectMateriales(req:Request, res:Response){
        const material = await sql.query(`SELECT * FROM Material`);
        res.status(200).json(material.recordset);
    }
    //Actualiza la descripcion y el material de un material pasado por parámetro
    public async updateMaterial(req:Request, res:Response){
        try{
            console.log(req.body)
            await sql.query(`UPDATE Material SET Material='${req.body.Material}', Descripcion='${req.body.Descripcion}' WHERE MatId=${req.params.matid}`)
            res.status(200).json({message: "Se ha actualizado el material correctamente"})
        }
        catch(e){
            console.log(e)
            res.status(404).json({message:"No se ha actualizado el material"})
        }
        await sql.query(``)
        res.status
    }

    //Añade un material a la tabla
    public async addMaterial(req:Request, res:Response){
        try{       
            await sql.query(`INSERT INTO Material(Material, Descripcion) VALUES('${req.body.Material}','${req.body.Descripcion}')`)
            res.status(200).json({message: "Se ha introducido el material correctamente"})
        }catch(e){
            console.log(e)
            res.status(404).json({message:"No se ha introducido el material"})
        }
    }
    //Elimina el material con id definido por parametro
    public async deleteMaterial(req:Request, res:Response){
        try{
            await sql.query(`DELETE FROM Material WHERE MatId=${req.params.matid}`)
            res.status(200).json({message: "Se ha eliminado el material correctamente"})
        }catch(e){
            console.log(e)
            res.status(404).json({message:"No se ha eliminado el material"})
        }
    }
}
const materialController = new MaterialController();
export default materialController;