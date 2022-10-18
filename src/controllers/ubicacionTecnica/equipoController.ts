import { Request, Response } from 'express';
import sql from '../../database';

class EquipoController {
    
    public async selectEquipos(req: Request, res: Response): Promise<any> {
        try {
            const equipos = await sql.query(`select * from equipo where grupoid = '${req.params.grupoid}'`);
            if (equipos.recordset.length > 0) {
                res.status(200).json(equipos.recordset)
            } else {
                res.status(404).json({ message: "No existen equipos para este grupo" })
            }
        } catch (error) {
            res.json(error)
        }
    }
    public async addEquipo(req: Request, res: Response): Promise<void> {
        try {
            await sql.query(`insert into equipo(Denominacion, GrupoId) values('${req.body.Denominacion}', '${req.body.GrupoId}')`);
            res.status(200).json({ message: "Equipo introducido correctamente" });
        } catch (error) {
            res.json(error)
            console.log(error)
        }
    }
    public async updateEquipo(req: Request, res: Response): Promise<void> {
        try {
            await sql.query(`update equipo set Denominacion = '${req.body.Denominacion}' where equipoid='${req.params.equipoid}'`);
            res.status(201).json({ message: "Equipo modificado correctamente" });
        } catch (error) {
            res.json(error)
        }
    }
    public async deleteEquipo(req: Request, res: Response): Promise<void> {
        try {
            await sql.query(`delete from equipo where equipoid='${req.params.equipoid}'`);
            res.status(201).json({ message: "Equipo eliminado correctamente" });
        } catch (error) {
            res.json(error)
        }
    }
}
const equipoController = new EquipoController();
export default equipoController;