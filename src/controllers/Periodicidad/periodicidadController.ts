import { Request, Response } from 'express';
import sql from '../../database';


class PeriodicidadController{

    /** Obtener todos los preventivos */
    public async selectPeriodiciad(req:Request, res:Response){
        const preventivos = await sql.query(`SELECT * FROM Periodicidad`);
        res.status(200).json(preventivos.recordset);
    }

    public async selectPeriodicidadPorId(req: Request, res: Response) {
        try {
            let periodicidades = await sql.query(`SELECT * FROM Periodicidad WHERE PeriodicidadId = ${req.params.id}`)
            res.status(200).json(periodicidades.recordset);
        } catch (err) {
            console.log(err);
        }
    }

    public async addPeriodicidad(req:Request, res:Response){
        try{
            await sql.query(`INSERT INTO Periodicidad(Dias, Descripcion) VALUES(${req.body.Dias},'${req.body.Descripcion}')`);
            res.status(200).json({message: "Se ha creado nueva periodicidad correctamente"});
        }catch(e){
            console.log(e)
            res.status(400).json({message:"No se ha podido agregar la periodicidad"})
        }
    }

    //Actualiza la periodicidad
    public async updatePeriodicidad(req:Request, res:Response){
        try{
            await sql.query(`UPDATE Periodicidad SET Descripcion='${req.body.Descripcion}', Dias='${req.body.Dias}' WHERE PeriodicidadId=${req.params.periodicidadid}`)
            res.status(200).json({message: "Se ha actualizado la periodicidad"})

        }catch(e){
            console.log(e)
            res.status(400).json({message:"No se ha podido actualizar la periodicidad"})
        }
    }

    //Elimina la periodicidad con periodicidadid pasada por paramétro
    public async deletePeriodicidad(req:Request, res:Response){
        try{
            await sql.query(`DELETE FROM Periodicidad WHERE PeriodicidadId=${req.params.periodicidadid}`)
            res.status(200).json({message:"Se ha eliminado la periodicidad correctamente"})

        }catch(e){
            console.log(e)
            res.status(400).json({message:"No se ha eliminado la periodicidad"})
        }
    }
}
const periodicidadController = new PeriodicidadController();
export default periodicidadController;