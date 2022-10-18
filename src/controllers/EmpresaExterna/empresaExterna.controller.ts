import { Request, Response } from 'express';
import sql from '../../database';
const bcrypt = require('bcrypt');  


class EmpresaExternaController {

    public async getEmpresasExternas(req: Request, res: Response): Promise<any> {
        try {
            let empresas = await sql.query(`SELECT id, nombre, descripcion FROM empresa_externa`);
            res.status(200).json(empresas.recordset);
        } catch (err) {
            res.status(404).json(err)
            console.log(err);
        }
    }

    public async addEmpresaExterna(req: Request, res: Response): Promise<void> {
        try {
            await sql.query(`INSERT INTO empresa_externa (nombre, descripcion) VALUES ('${req.body.nombre}', '${req.body.descripcion}')`);
            res.status(201).json({ message:"Nueva empresa externa añadida" });
        } catch (err) {
            res.json(err);
            console.log(err);
        }
    }

    public async deleteEmpresaExterna(req: Request, res: Response): Promise<void> {
        try {
            await sql.query(`DELETE FROM empresa_externa WHERE id = ${req.params.id}`);
            res.status(201).json({ message: "Empresa Externa eliminada" });
        } catch (err) {
            res.json(err);
            console.log(err);
        }
    }

    public async updateEmpresaExterna(req: Request, res: Response) {
        try {
            await sql.query(`UPDATE empresa_externa 
                                    SET nombre = '${req.body.nombre}', descripcion = '${req.body.descripcion}' 
                                    WHERE id = ${req.params.id}`);
            res.json({message: "Datos de la empresa externa actualizados"});
        } catch (err) {
            res.json({ message: "No se pudo actualizar la empresa externa" });
            console.log(err);
        }
    }

}

const empresaExternaController = new EmpresaExternaController();
export default empresaExternaController;