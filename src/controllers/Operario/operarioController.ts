import { Request, Response } from 'express';
import db from '../../databse2';
const bcrypt = require('bcrypt');

class OperarioController {
    /**Obtiene los registros que aparecen en tabla trabajadores*/
    public async selectTrabajadores(req: Request, res: Response): Promise<any> {
        try {
            const trabajadores = await db.query(`SELECT * FROM [DATOS7QB_ISRI_SPAIN].[dbo].[Trabajador]`)
            if (trabajadores.recordset.length > 0) {
                res.status(200).json(trabajadores.recordset)
            }
        } catch (error) {
            res.status(404).json(error)
            console.log(error)
        }
    }

    /**Obtiene los datos del usuario con codigo pasado por parámetro*/
    public async selectDatosDeOperario(req: Request, res: Response): Promise<any> {
        try {
            const trabajadores = await db.query(`SELECT Nombre FROM [DATOS7QB_ISRI_SPAIN].[dbo].[Usuario] where Codigo='${req.params.codigo}'`)
            if (trabajadores.recordset.length > 0) {
                res.status(200).json(trabajadores.recordset[0])
            }
        } catch (error) {
            res.status(404).json(error)
            console.log(error)
        }
    }   
    /**Obtiene los registros de la tabla de usuarios con el tipo usuario 6 y tipo 5 */
    public async selectUsuarios(req: Request, res: Response): Promise<any> {
        try {
            const usuarios = await db.query(`SELECT * FROM [DATOS7QB_ISRI_SPAIN].[dbo].[usuario] WHERE tipoUsuario=6 OR tipoUsuario=5`)
            res.status(200).json(usuarios.recordset)
        } catch (error) {
            res.json(error)
            console.log(error)
        }
    }
    /**Convierte el trabajador a tipo 6 y lo inserta en la tabla de usuario */
    public async convertirAUsuario6(req: Request, res: Response) {
        try {
  
            const { CodigoTrabajador } = req.params          
            let password = await db.query(`SELECT Password FROM [DATOS7QB_ISRI_SPAIN].[dbo].[trabajador] WHERE CodigoTrabajador like '${CodigoTrabajador}'`)
            const salt = await bcrypt.genSalt(10);
            //Encripta la contraseña antes de insertarla
            password = password.recordset[0].Password
            password = await bcrypt.hash(password, salt);
            password = password.toString();
            await db.query(`INSERT INTO [DATOS7QB_ISRI_SPAIN].[dbo].[usuario] (Codigo, Validado, TipoUsuario, Planta, Nombre, Password)
            SELECT CodigoTrabajador, 1, 6,Planta, Nombre, '${password}' FROM [DATOS7QB_ISRI_SPAIN].[dbo].[Trabajador] WHERE CodigoTrabajador like '${CodigoTrabajador}'`)

            res.status(200).json({ message: "Trabajador convertido a usuario correctamente" })
        } catch (error) {
            res.status(400).json({message:"El trabajador ya es usuario"})
            console.log(error)
        }
    }
    /**Elimina al registro pasado como parámetro de la tabla de usuarios */
    public async eliminarAlUsuarioDeTipo6(req: Request, res: Response) {
        try {
            const { CodigoTrabajador } = req.params
            await db.query(`DELETE FROM [DATOS7QB_ISRI_SPAIN].[dbo].[usuario] WHERE Codigo=${CodigoTrabajador}`)
            res.status(200).json({ message: "Usuario eliminado correctamente" })
        } catch (error) {
            res.json(error)
            console.log(error)
        }
    }
}
const operarioController = new OperarioController();
export default operarioController