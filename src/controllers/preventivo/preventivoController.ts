import { Request, Response } from 'express';
import sql from '../../database';


class PreventivoController{

    /** Obtener todos los preventivos; si existe un operario asociado a ese preventivo, lo mostrará. En caso contrario, lo mostrará como ninguno y su codigo será 0 */
    public async selectAllPreventivos(req:Request, res:Response){
        const preventivos = await sql.query(`SELECT pre.*, per.Descripcion as 'Periodicidad', 
		CASE WHEN usu.Codigo IS NULL THEN 0
		ELSE usu.Codigo
		END
		AS 'Codigo', 
        CASE WHEN usu.Nombre IS NULL THEN  'NINGUNO'
        ELSE usu.Nombre
		END
		AS 'Operario'
        FROM Preventivo pre 
        INNER JOIN Periodicidad per ON pre.PeriodicidadId = per.PeriodicidadId
        LEFT JOIN Preventivo_Operario po ON po.PreventivoId = pre.PreventivoId
        LEFT JOIN [DATOS7QB_ISRI_SPAIN].[dbo].[usuario] usu ON usu.Codigo = po.OperarioId`);
        res.json(preventivos.recordset);
    }
    /** Obtiene el id del último preventivo */
    public async selectLastPreventivo(req:Request, res:Response){
        const area = await sql.query(`SELECT MAX(PreventivoId) AS id FROM Preventivo`);
        res.json(area.recordset[0].id);
    }
    /** Añade un nuevo preventivo */
    public async addPreventivo(req: Request, res: Response) {
        try {           
            await sql.query(`INSERT INTO Preventivo(Descripcion, PeriodicidadId) VALUES('${req.body.nombre}','${req.body.periodicidad}')`);
            if(req.body.OperarioId){
            await sql.query(`INSERT INTO Preventivo_Operario(PreventivoId, OperarioId) VALUES((SELECT IDENT_CURRENT('Preventivo')), (${req.body.OperarioId})`)
            }
            res.status(200).json({ message: "Preventivo creado correctamente" });
        } catch (error) {
            res.status(400).json(error)
        }
    }
    /** Actualiza un preventivo en concreto */
    public async updatePreventivo(req:Request, res:Response){
        console.log(req.body)
        //Si existe el codigo del operario para actualizar, actualiza el registro asociado al operario y el preventivo y actualiza el preventivo
        if(req.body.Codigo){
            await sql.query(`
            IF EXISTS (SELECT * FROM Preventivo_Operario WHERE PreventivoId=${req.params.preventivoid})
            UPDATE Preventivo_Operario SET OperarioId = ${req.body.Codigo}
            ELSE
            INSERT INTO Preventivo_Operario(PreventivoId, OperarioId) VALUES (${req.params.preventivoid}, ${req.body.Codigo})`);
        }else {
           //Si no existe el codigo, borra el registro que asocia el preventivo al operario y actualiza el preventivo 
            await sql.query(`
            DELETE FROM Preventivo_Operario WHERE PreventivoId = ${req.params.preventivoid};
            UPDATE preventivo SET Descripcion = '${req.body.Descripcion}', PeriodicidadId = ${req.body.PeriodicidadId} where PreventivoId = ${req.params.preventivoid}`);
        }
        res.json({message:"Preventivo modificado correctamente"});
    }
    /** Elimina un preventivo en concreto */
    public async deletePreventivo(req:Request, res:Response){
        await sql.query(`delete from preventivo where PreventivoId = '${req.params.preventivoid}'`);
        res.json({message:"Preventivo eliminado correctamente"});
    }
    /**Periodicidades */
    public async selectPeriodicidad(req:Request, res:Response){
        const periodicidades = await sql.query(`SELECT * FROM Periodicidad`)
        res.json(periodicidades.recordset)
    }
}
const preventivoController = new PreventivoController();
export default preventivoController;