import { Request, Response } from 'express';
import sql from '../../database';


class TareasController{

    /**Get para todas las tareas; si existe la tarea se mostrará como asignada. En caso contrario, se mostrará como no asignada */
    public async selectAllTareas(req:Request, res:Response):Promise<any>{
        try{
            const preventivos = await sql.query(`select *,
            case when exists (SELECT * from Tarea_Preventivo t2 WHERE t1.tareaid=t2.TareaId)
            then 'Asignada'
            else 'No Asignada'
            end as Estado
            from Tarea t1`);

            if(preventivos.recordset.length>0){
                res.status(200).json(preventivos.recordset);
            }else{
                res.status(404).json({message:"Tareas no encontradas"})
            }

        }catch (error){
            res.status(404).json(error)
            console.log(error)
        }
    }
    /** Obtiene el id de la última tarea insertada */
    public async selectLastTarea(req:Request, res:Response):Promise<any>{
        try{
            const id = await sql.query(`SELECT MAX(TareaId) AS id FROM Tarea`)
            res.json(id.recordset[0].id)
        }catch(error){
            console.log(error)
        }
    }
    /**Get para las tareas de un preventivo pasado por parámetro; si esta asociada a un preventivo se mostrará como asignada. En caso contrario, se mostrará como no asignada*/
    public async selectAllTareasPreventivo(req:Request, res:Response):Promise<any>{
        try{
            const {preventivoid} = req.params
            const preventivos = await sql.query(`select t.TareaId, t.Descripcion,
            case when exists (SELECT * from Tarea_Preventivo tp WHERE t.tareaid=tp.TareaId)
                then 'Asignada'
                else 'No Asignada'
                end as Estado
            from Tarea t inner join tarea_preventivo tp on t.tareaid=tp.tareaid
            inner join preventivo p on p.preventivoid = tp.preventivoid
            where p.preventivoid = '${preventivoid}'`);
    
            if(preventivos.recordset.length>0){
                res.status(200).json(preventivos.recordset);
            }else{
                res.status(404).json({message: "Tareas del preventivo no existentes"})
            }
        }catch(error){
            res.json(error)
            console.log(error)
        }
    }

    /** Insert para tarea o tareas a la tabla de tareas pasadas en array de string */
    public async insertTarea(req:Request, res:Response):Promise<void>{
        try{
            let tareas:string[] = req.body
            for(let i of tareas){await sql.query(`INSERT INTO Tarea(Descripcion) VALUES('${i}')`)}
            res.status(201).json({message:"Tarea(s) creadas correctamente"})
        }catch(error){
            res.json(error)
            console.log(error)
        }
    }

    /**Insert tarea en preventivo */
    public async insertTareaPrev(req:Request, res:Response):Promise<void>{
        try{
            let id:number = req.body.preventivo
            let tar:string[] = req.body.tarea
    
            for (let i = 0; i < tar.length; i++) {
                await sql.query(`INSERT INTO Tarea_Preventivo(PreventivoId, TareaId) VALUES('${id}','${tar[i]}')`)
            }
                res.status(200).json({message:"Tareas introducidas en el preventivo"})
        }catch(error){
            res.status(400).json({message:"Tarea(s) ya existente(s) en el preventivo"})
            console.log(error)

        }
    }

    /**Eliminar tarea */
    public async deleteTarea(req:Request, res:Response):Promise<void>{
        try{
            await sql.query(`DELETE from Tarea WHERE TareaId='${req.params.tareaid}'`)
            res.status(200).json({message: "Tarea eliminada correctamente"})

        }catch(error){
            res.json(error)
            console.log(error)
        }
    }

    /**Eliminar tarea de preventivo */
    public async deleteTareaPrev(req:Request, res:Response):Promise<void>{
        try{
            await sql.query(`DELETE FROM Tarea_Preventivo WHERE PreventivoId='${req.params.preventivoid}'
            AND TareaId='${req.params.tareaid}'`)
    
            res.status(201).json({message: "Tarea desasociada de preventivo"})

        }catch(error){
            res.json(error)
            console.log(error)
        }
    }

    /**Actualizar descripción de tarea*/
    public async updateTarea(req:Request, res:Response):Promise<void>{ 
        try{
            await sql.query(`UPDATE Tarea SET Descripcion='${req.body.Descripcion}'
            WHERE TareaId='${req.params.tareaid}'`)
            res.status(200).json({message:"Tarea actualizada correctamente"})

        }catch(error){
            res.json(error)
            console.log(error)
        }
    }

    public async selectTareaDeOrden(req: Request, res: Response) {
        const tareas = await sql.query(`SELECT * FROM TareaDeOT WHERE OrdenId = ${req.params.ordenid}`)
        res.status(200).json(tareas.recordset)

    }

    public async updateTareaOt(req: Request, res: Response) {
        try {
            await sql.query(`UPDATE TareaDeOt SET Estado = CASE 
            WHEN Estado = 0 then 1
            WHEN Estado = 1 then 0
            END
            WHERE TareaId=${req.params.tareaid}`)

            res.status(200).json({message:"Estado cambiado correctamente"})

        } catch (error) {
            console.log(error)
        }

    }

    public async deleteTareaOt(req: Request, res: Response){
        try {
            await sql.query(`DELETE FROM TareaDeOT WHERE TareaId=${req.params.tareaid}`)

            res.status(200).json({message:"Estado cambiado correctamente"})

        } catch (error) {
            console.log(error)
        }
    }
}
const tareasController = new TareasController();
export default tareasController;