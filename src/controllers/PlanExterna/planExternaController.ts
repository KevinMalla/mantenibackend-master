import { Request, Response } from 'express';
import sql from '../../database';
const bcrypt = require('bcrypt');


class PlanExternaController {

    public async getAllPlanExternas(req: Request, res: Response): Promise<any> {
        try {
            let planExternas = await sql.query(`
                SELECT id, idEmpresa, idPeriodicidad, descripcion, fecha, estado
                FROM plan_externa 
            `);
            res.status(200).json(planExternas.recordset);
        } catch (err) {
            res.status(404).json(err);
            console.log(err);
        }
    }

    // los campos idPeriodicidad e idEmpresa se muestran con su nombre y descripción. Se han relacionado las tablas
    public async getAllPlanExternasRelacionadas(req: Request, res: Response): Promise<any> {
        try {
            let planExterna = await sql.query(`
            SELECT pe.id, ee.Nombre as Empresa, ee.id as idEmpresa, p.Descripcion as Periodicidad, p.PeriodicidadId as idPeriodicidad,
                    pe.descripcion as Descripcion, pe.fecha as Fecha, pe.estado as Estado
            FROM plan_externa pe 
                INNER JOIN empresa_externa ee
                    ON pe.idEmpresa = ee.id
                INNER JOIN Periodicidad p
                    ON pe.idPeriodicidad = p.PeriodicidadId
            `);
            res.status(200).json(planExterna.recordset);
        } catch (err) {
            res.status(404).json(err);
            console.log(err);
        }
    }

        // los campos idPeriodicidad e idEmpresa se muestran con su nombre y descripción. Se han relacionado las tablas. Solo con estado 'ABIERTO'.
        public async getAllPlanExternasAbiertas(req: Request, res: Response): Promise<any> {
            try {
                let planExterna = await sql.query(`
                SELECT pe.id, ee.Nombre as Empresa, ee.id as idEmpresa, p.Descripcion as Periodicidad, p.PeriodicidadId as idPeriodicidad,
                        pe.descripcion as Descripcion, pe.fecha as Fecha, pe.estado as Estado
                FROM plan_externa pe 
                    INNER JOIN empresa_externa ee
                        ON pe.idEmpresa = ee.id
                    INNER JOIN Periodicidad p
                        ON pe.idPeriodicidad = p.PeriodicidadId
                WHERE pe.estado = 'abierto'
                `);
                res.status(200).json(planExterna.recordset);
            } catch (err) {
                res.status(404).json(err);
                console.log(err);
            }
        }

        // los campos idPeriodicidad e idEmpresa se muestran con su nombre y descripción. Se han relacionado las tablas. Solo con estado 'ABIERTO'.
        public async getAllPlanExternaById(req: Request, res: Response): Promise<any> {
            try {
                let planExterna = await sql.query(`
                    SELECT pe.id, ee.Nombre as Empresa, ee.id as idEmpresa, p.Descripcion as Periodicidad, p.PeriodicidadId as idPeriodicidad,
                        pe.descripcion as Descripcion, pe.fecha as Fecha, pe.estado as Estado, pe.proximaFecha
                    FROM plan_externa pe 
                        INNER JOIN empresa_externa ee
                        ON pe.idEmpresa = ee.id
                        INNER JOIN Periodicidad p
                        ON pe.idPeriodicidad = p.PeriodicidadId
                    WHERE pe.id = ${req.params.id}
                        `);
                res.status(200).json(planExterna.recordset);
            } catch (err) {
                res.status(404).json(err);
                console.log(err);
            }
        }

    public async addPlanExterna(req: Request, res: Response): Promise<void> {
        try {
            await sql.query(`
                INSERT INTO plan_externa (idEmpresa, idPeriodicidad, descripcion, fecha, estado, proximaFecha)
                VALUES (${req.body.idEmpresa}, ${req.body.idPeriodicidad}, '${req.body.descripcion}',
                '${req.body.fecha}', '${req.body.estado}', '${req.body.proximaFecha}')
            `);
            res.status(201).json({ message: "Planificación externa introducida." });
            console.log(req.body.proximaFecha);
        } catch (err) {
            res.status(404).json(err);
            console.log(err);
        }
    }

    public async updatePlanExterna(req: Request, res: Response): Promise<void> {
        try {
            await sql.query(`
                UPDATE plan_externa SET idEmpresa = ${req.body.idEmpresa}, 
                                        idPeriodicidad = ${req.body.idPeriodicidad}, 
                                        descripcion = '${req.body.descripcion}', 
                                        fecha = '${req.body.fecha}', 
                                        estado = '${req.body.estado}'
                WHERE id = ${req.params.id}
            `)
            res.status(201).json({ message: "Planificación externa actualizada."});
        } catch (err) {
            res.status(404).json(err);
            console.log(err);
        }
        
    }

    public async validarPlanExterna(req: Request, res: Response): Promise<void> {
        try {
            await sql.query(`UPDATE plan_externa SET estado = 'cerrado' WHERE id = ${req.params.id}`);
            res.status(201).json({ message: "Planificación externa actualizada."});
        } catch (err) {
            res.status(400).json(err);
            console.log(err);
        }
    }

    public async deletePlanExterna(req: Request, res: Response): Promise<void> {
        try {
            await sql.query(`DELETE FROM plan_externa WHERE id = ${req.params.id}`);
            res.status(200).json({ message: "Planificación externa eliminada." });
        } catch (err) {
            res.status(404).json(err);
            console.log(err);
        }
    }

    // los campos idPeriodicidad e idEmpresa se muestran con su nombre y descripción. Se han relacionado las tablas
    public async getHistoricoFiltrado(req: Request, res: Response): Promise<any> {
        try {

            if (req.params.periodicidad == "x") {req.params.periodicidad = ""}
            if (req.params.empresa == "x") {req.params.empresa = ""}
            if (req.params.estado == "x") {req.params.estado = ""}

            let historico = await sql.query(`
                SELECT pe.id, ee.Nombre as Empresa, ee.id as idEmpresa, p.Descripcion as Periodicidad,
                        p.PeriodicidadId as idPeriodicidad, pe.descripcion as Descripcion, pe.fecha as Fecha,
                        pe.estado as Estado
                FROM plan_externa pe INNER JOIN empresa_externa ee ON pe.idEmpresa = ee.id
                INNER JOIN Periodicidad p ON pe.idPeriodicidad = p.PeriodicidadId
                WHERE pe.idPeriodicidad LIKE '%${req.params.periodicidad}%' AND
                        pe.idEmpresa LIKE '%${req.params.empresa}%' AND
                        pe.estado LIKE '%${req.params.estado}%'
            `);
            
            console.log(req.params.periodicidad);
            console.log(req.params.empresa);
            console.log(req.params.estado);
            
            res.status(200).json(historico.recordset);
        } catch (err) {
            console.log("Se hace mierda")
            res.status(404).json(err);
            console.log(err);
        }
    }

}

const planExternaController = new PlanExternaController();
export default planExternaController;