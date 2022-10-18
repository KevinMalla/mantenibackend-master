import { Request, Response } from 'express';
import sql from '../../database';


class GastoMaterialController {

    //Obtiene todos los materiales de la bbdd
    public async getGastoMaterialDeOrden(req: Request, res: Response) {
        const gasto = await sql.query(`SELECT gm.GastoId, ma.Material, ma.Descripcion, gm.Cantidad, convert(varchar,gm.FechaYHora, 20) as Fecha, tra.Nombre FROM GastoMaterial gm
        INNER JOIN Orden_Gasto og on og.GastoId = gm.GastoId
        INNER JOIN Material ma on ma.MatId = gm.MatId
		INNER JOIN OrdenDeTrabajo ot on ot.OrdenId = og.OrdenId
        LEFT JOIN DATOS7QB_ISRI_SPAIN.dbo.Trabajador tra on CodigoTrabajador LIKE gm.OperarioId
        WHERE ot.OrdenId =${req.params.ordenid}`)

        res.status(200).json(gasto.recordset)
    }

    //Elimina un gasto;  elimina de la tabla donde se guardan los gastos y además de la tabla donde se asocia el gasto a una orden
    public async deleteGastoMaterialOrden(req: Request, res: Response) {
        try {
            await sql.query(`
            DELETE FROM Orden_Gasto WHERE GastoId = ${req.params.gastoid} AND OrdenId=${req.params.ordenid};
            DELETE FROM GastoMaterial WHERE GastoId=${req.params.gastoid}`)
            res.status(200).json({ message: 'Gasto eliminado correctamente' })

        } catch (error) {
            console.log(error)
        }
    }
    //Añadir Gasto
    public async addGastoMaterialOrden(req: Request, res: Response) {
        try {
            await sql.query(`
            INSERT INTO GastoMaterial(Cantidad,FechaYHora, MatId,OperarioId, Descontado) VALUES (${req.body.cantidad}, GETDATE(), ${req.body.matid}, ${req.body.operarioid}, 0);
            INSERT INTO Orden_Gasto (OrdenId,GastoId) VALUES(${req.params.ordenid},IDENT_CURRENT('GastoMaterial'));`)
            res.status(200).json({ message: 'Se ha introducido el gasto de material' })
        } catch (error) {
            console.log(error)
            res.status(400).json(error)
        }
    }


    //Obtiene el gasto general de todas las OT
    public async getGastoMaterial(req: Request, res: Response) {
        try {
            const gastomaterial = await sql.query(`
            SELECT gm.GastoId, ma.Material, ma.Descripcion, gm.Cantidad, convert(varchar,gm.FechaYHora, 20) as Fecha, tra.Nombre, ot.OrdenId, se.Descripcion as 'Linea', gm.Descontado FROM GastoMaterial gm
            LEFT JOIN Orden_Gasto og on og.GastoId = gm.GastoId
            LEFT JOIN OrdenDeTrabajo ot on ot.OrdenId = og.OrdenId
            INNER JOIN Material ma on ma.MatId = gm.MatId
            LEFT JOIN Seccion se on se.SeccionId = gm.SeccionId
            LEFT JOIN DATOS7QB_ISRI_SPAIN.dbo.trabajador tra on tra.CodigoTrabajador LIKE gm.OperarioId`)
            res.status(200).json(gastomaterial.recordset)

        } catch (error) {
            res.status(400).json(error)
        }
    }


    //Dar por descontado el gasto
    public async updateGastoMaterial(req: Request, res: Response) {
        try {
            await sql.query(`UPDATE GastoMaterial SET Descontado=1 WHERE Descontado=0`)
            res.status(200).json({ message: "Se ha dado por descontado correctamente" })
        } catch (e) {
            console.log(e)
        }
    }

    //Añadir Gasto
    public async addGastoMaterial(req: Request, res: Response) {
        try {
            console.log(req.body)
            await sql.query(`INSERT INTO GastoMaterial(Cantidad,FechaYHora, MatId,OperarioId, Descontado) VALUES (${req.body.cantidad}, GETDATE(), ${req.body.matid}, ${req.body.operarioid}, 0)`)
            res.status(200).json({ message: 'Se ha introducido el gasto de material' })
        } catch (error) {
            console.log(error)
            res.status(400).json(error)
        }
    }



}
const gastoMaterialController = new GastoMaterialController();
export default gastoMaterialController;