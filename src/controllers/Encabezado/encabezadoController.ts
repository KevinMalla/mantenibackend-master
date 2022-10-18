import { Request, Response } from 'express';
import db from '../../databse2';

const bcrypt = require('bcrypt');


class EncabezadoController {

    /**Get para todas las plantas  */
    public async selectAllPlantas(req: Request, res: Response) {
        try {
            const plantas = await db.query(`select * from DATOS7QB_ISRI_SPAIN.dbo.planta`);

            if (plantas.recordset.length > 0) {
                res.status(200).json(plantas.recordset);
            } else {
                res.status(404).json({ message: "Plantas no encontradas" })
            }
        } catch (error) {
            res.json(error)
            console.log(error)
        }
    }
    /**Get para trabajador sin password */
    public async selectTrabajador(req: Request, res: Response) {
        try {
            const {planta, codigoTrabajador} = req.params
            const trabajador = await db.query(`SELECT * FROM DATOS7QB_ISRI_SPAIN.dbo.trabajador WHERE Planta=${planta} AND CodigoTrabajador like '${codigoTrabajador}'`)

            if (trabajador.recordset.length > 0) {
                res.status(200).json(trabajador.recordset[0])
            } else {
                res.status(404).json({ message: "Trabajador no encontrado" })
            }
        } catch (error) {
            res.json(error)
            console.log(error)
        }
    }
    /**Devuelve el usuario si existe en la tabla usuario si no existe devulve una respuesta vacía */
    public async selectUsuario(req: Request, res: Response) {
        try {
            const {codigo} = req.params
            const usuario = await db.query(`SELECT * FROM DATOS7QB_ISRI_SPAIN.dbo.usuario WHERE Codigo='${codigo}'`)
            
            res.status(200).json(usuario.recordset[0])
        } catch (error) {
            res.json(error)
        }
    }
    /**Devuelve los datos del usuario cuando hace correctamente el login */
    public async login(req: Request, res: Response) {
        try {
            const { Codigo, Password } = req.params;
            const usuario = await db.query(`SELECT * FROM DATOS7QB_ISRI_SPAIN.dbo.usuario WHERE Codigo='${Codigo}'`)
            if (usuario.recordset.length > 0) {
                bcrypt.compare(Password, usuario.recordset[0].Password).then(function (result: any) {
                    if (result == true) {
                        res.status(200).json(usuario.recordset[0])
                    } else {
                        res.status(404).json({ message: "La contraseña es incorrecta" })
                    }
                });
            } else {
                res.status(404).json({ message: "No se ha encontrado el usuario" })
            }
        } catch (error) {
            res.json(error)
        }
    }
    /** Cambio de contraseña de los registros de la tabla usuario*/
    public async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const { codigo } = req.params;
            let password = req.body.Password
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            await db.query(`UPDATE DATOS7QB_ISRI_SPAIN.dbo.usuario SET password='${password}' WHERE Codigo=${codigo}`)
            res.json({ message: "La contraseña se ha actualizado correctamente" })

        } catch (error) {
            res.json(error)
            console.log(error)
        }
    }
}
const encabezadoController = new EncabezadoController();
export default encabezadoController;