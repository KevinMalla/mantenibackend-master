import { Request, Response } from 'express';
import sql from '../../database';
//Query general para obtener datos de la tabla orden de trabajo de la bbdd mantenimiento
const consulta = `SELECT ot.OrdenId, 
pre.Descripcion as 'Preventivo', 
case when ot.Area is null then p.Descripcion 
	 when ot.Zona is null then concat(p.Denominacion, '/', a.Descripcion) 
	 when ot.Seccion is null then concat(p.Denominacion, '/', a.Denominacion, '/', z.Descripcion)
	 when ot.Codigo is null then concat(p.Denominacion, '/', a.Denominacion, '/', z.Denominacion, '/', s.Descripcion) 
	 when ot.Grupo is null then concat(p.Denominacion, '/', a.Denominacion, '/', z.Denominacion, '/', s.Denominacion, '/', c.Descripcion ) 
	 when ot.Equipo is null then concat(p.Denominacion, '/', a.Denominacion, '/', z.Denominacion, '/', s.Denominacion, '/', c.Denominacion, '/', g.Descripcion ) 
	 else concat(p.Denominacion,'/', a.Denominacion,'/' ,z.Denominacion ,'/', s.Denominacion,'/', c.Denominacion,'/', g.Denominacion, '/', eq.Denominacion) 
    end as 'UbicacionTecnica',
    eq.Denominacion as 'Equipo',
    a.Descripcion as 'Localizacion',
    db.Nombre as 'PersonaResponsable',
    ot.PersonaResponsable as 'PersonaResponsableId',
	e.Descripcion as 'Estado',
    ot.EstadoId,
    s.Descripcion as 'Linea',
	t.Descripcion as 'Tipo',
    ot.TipoId,
    ot.ComentarioResponsable,
    ot.Comentario,
    ot.TiempoEmpleado,
    ot.TituloCorrectivo,
    ot.DescripcionCorrectivo,
    ot.FechaCreacion,
    ot.FechaPendiente,
    ot.FechaTerminado,
    ot.FechaValidado,
    ot.OperarioId,
    da.Nombre as 'Operario',
    pri.Descripcion as 'Prioridad',
    per.Dias,
    ot.PrioridadId
    FROM OrdenDeTrabajo ot 
    inner join EstadoOt e on e.EstadoId=ot.EstadoId
    inner join TipoDeOrden t on t.TipoId = ot.TipoId
    inner join Preventivo pre on pre.PreventivoId = ot.Preventivo
    left join Periodicidad per on per.PeriodicidadId = pre.PeriodicidadId
    left join DATOS7QB_ISRI_SPAIN.dbo.usuario da on da.Codigo = ot.OperarioId
    left join DATOS7QB_ISRI_SPAIN.dbo.trabajador db on db.CodigoTrabajador like ot.PersonaResponsable
    inner join Prioridad pri on pri.PrioridadId = ot.PrioridadId
    inner join Planta p on p.plantaid = ot.Planta
    left join Area a on a.areaid = ot.area
    left join Zona z on Z.ZonaId = ot.Zona
    left join Seccion s on s.SeccionId = ot.Seccion
    left join Codigo c on c.CodigoId = ot.Codigo
    left join Grupo g on g.GrupoId = ot.Grupo
    left join Equipo eq on eq.equipoid = ot.Equipo`
class OrdenDeTrabajoController {
    //Obtiene las OT de los preventivos planificados
    public async selectPreventivoPlanificada(req: Request, res: Response) {
        const ordendetrabajo = await sql.query(consulta + ` where ot.estadoid=1 and ot.tipoid=1`);
        res.json(ordendetrabajo.recordset);
    }

    //Obtiene las OT de los preventivos pendiente
    public async selectPreventivoPendiente(req: Request, res: Response) {
        let where = ' where ot.estadoid=2 and ot.tipoid=1'
        const ordendetrabajo = await sql.query(consulta + where);
        res.json(ordendetrabajo.recordset);
    }

    //Obtiene las OT de los preventivos terminados
    public async selectPreventivoTerminada(req: Request, res: Response) {
        let where = ' where ot.estadoid=3 and ot.tipoid=1'
        const ordendetrabajo = await sql.query(consulta + where);
        res.json(ordendetrabajo.recordset);
    }
    //Obtiene las OT de los preventivos validados
    public async selectPreventivoValidada(req: Request, res: Response) {
        let where = ' WHERE ot.estadoid=4 AND ot.tipoid=1 AND ot.FechaValidado > dateadd(day, -7, GETDATE())'
        const ordendetrabajo = await sql.query(consulta + where);
        res.json(ordendetrabajo.recordset);
    }
    //Crear orden correctiva, si quien la crea es un operario de mantenimiento, se le asigna a el mismo y pasa a estado 2 pendiente
    public async crearCorrectivo(req: Request, res: Response) {
        try {

            let insert = '', insert1 = '', PersonaResponsable = '', PrioridadId = 0
            if (req.body.Planta) { insert += ', Planta'; insert1 += `, ${req.body.Planta}` }
            if (req.body.Area) { insert += ', Area'; insert1 += `, ${req.body.Area}` }
            if (req.body.Zona) { insert += ', Zona'; insert1 += `, ${req.body.Zona}` }
            if (req.body.Seccion) { insert += ', Seccion'; insert1 += `, ${req.body.Seccion}` }
            if (req.body.Codigo) { insert += ', Codigo'; insert1 += `, ${req.body.Codigo}` }
            if (req.body.Grupo) { insert += ', Grupo'; insert1 += `, ${req.body.Grupo}` }
            if (req.body.Equipo) { insert += ', Equipo'; insert1 += `, ${req.body.Equipo}` }

            PersonaResponsable = req.body.PersonaResponsable
            PrioridadId = req.body.PrioridadId

            await sql.query(`if exists ( SELECT * FROM DATOS7QB_ISRI_SPAIN.dbo.usuario da WHERE da.Codigo = ${PersonaResponsable} and da.TipoUsuario = 6 )
                    INSERT INTO OrdenDeTrabajo(TituloCorrectivo, DescripcionCorrectivo, FechaCreacion, FechaPendiente, PersonaResponsable, OperarioId, EstadoId, PrioridadId, TipoId, Preventivo, TiempoEmpleado ${insert})
                    VALUES('${req.body.TituloCorrectivo}', '${req.body.DescripcionCorrectivo}', CAST(GetDate() as Date), CAST(GetDate() as Date), ${PersonaResponsable}, ${PersonaResponsable},2, ${PrioridadId},2, 0, 0  ${insert1})
                else 
                    INSERT INTO OrdenDeTrabajo(TituloCorrectivo, DescripcionCorrectivo, FechaCreacion, PersonaResponsable, EstadoId, PrioridadId, TipoId, Preventivo ${insert})
                    VALUES('${req.body.TituloCorrectivo}', '${req.body.DescripcionCorrectivo}', CAST(GetDate() as Date), ${PersonaResponsable}, 1, ${PrioridadId},2, 0  ${insert1})`)

            await sql.query(``)

            res.status(200).json({ message: "Se ha creado la orden de trabajo correctiva" })

        } catch (e) {
            console.error(e)
        }
    }

    //Obtener ordenes correctivas de los 4 estados
    public async getCorrectivos(req: Request, res: Response) {
        try {
            const planificadas = await sql.query(`${consulta} WHERE ot.TipoId=2 and ot.EstadoId=1 and db.Planta = 1`)//Atención todo: Traer planta de localstorage a todas las queries que estan sin poner
            const pendientes = await sql.query(`${consulta} WHERE ot.TipoId=2 and ot.EstadoId=2 and db.Planta = 1`)
            const terminadas = await sql.query(`${consulta} WHERE ot.TipoId=2 and ot.EstadoId=3 and db.Planta = 1`)
            const validadas = await sql.query(`${consulta} WHERE ot.TipoId=2 and ot.EstadoId=4 AND ot.FechaValidado > dateadd(day, -7, GETDATE()) and db.Planta = 1`)

            res.status(200).json([{ ordenes: planificadas.recordset, "nombre": 'Planificadas' }, { ordenes: pendientes.recordset, "nombre": 'Pendientes' }, { ordenes: terminadas.recordset, "nombre": 'Terminadas' }, { ordenes: validadas.recordset, "nombre": 'Validadas' }])

        } catch (e) {
            console.error(e)
        }
    }
    //Actualiza los datos cuando pasa de estado planificada a pendiente
    public async updatePlanificada(req: Request, res: Response) {

        let ComentarioResponsable = ''
        if (req.body.ComentarioResponsable == null) { ComentarioResponsable = '' }
        else { ComentarioResponsable = req.body.ComentarioResponsable }

        await sql.query(`UPDATE OrdenDeTrabajo SET OperarioId='${req.body.OperarioId}', PrioridadId='${req.body.PrioridadId}', FechaPendiente = CAST(GETDATE() AS date), ComentarioResponsable='${ComentarioResponsable}' , EstadoId=2, TiempoEmpleado=0
        WHERE OrdenId='${req.params.ordenid}'`);
        res.json({ message: `Orden de trabajo actualizada de planificada a pendiente` });
    }

    //Actualiza los datos cuando pasa de estado planificada a pendiente
    public async updatePendiente(req: Request, res: Response) {

        let Comentario = ''
        if (req.body.Comentario == null) { Comentario = '' }
        else { Comentario = req.body.Comentario }

        await sql.query(`UPDATE OrdenDeTrabajo SET Comentario='${Comentario}', TiempoEmpleado=${req.body.TiempoEmpleado} ,  FechaTerminado = CAST(GETDATE() AS date) , EstadoId=3
            WHERE OrdenId='${req.params.ordenid}'`);
        res.json({ message: `Orden de trabajo actualizada de pendiente a terminada` });

    }

    //Actualiza el estado de la orde a 4 = validada
    public async updateTerminada(req: Request, res: Response) {
        await sql.query(`UPDATE OrdenDeTrabajo SET FechaValidado = CAST(GETDATE() AS date) , EstadoId=4
        WHERE OrdenId='${req.params.ordenid}'`);
        res.json({ message: `Orden de trabajo actualizada de pendiente a terminada` });
    }

    //Actualiza la OT sin cambiar de estado
    public async updateOrden(req: Request, res: Response) {
        let Comentario = ''
        if (req.body.Comentario == null) { Comentario = '' }
        else { Comentario = req.body.Comentario }

        let ComentarioResponsable = ''
        if (req.body.ComentarioResponsable == null) { ComentarioResponsable = '' }
        else { ComentarioResponsable = req.body.ComentarioResponsable }

        await sql.query(`UPDATE OrdenDeTrabajo SET Comentario='${Comentario}', TiempoEmpleado=${req.body.TiempoEmpleado}, ComentarioResponsable='${ComentarioResponsable}'
            WHERE OrdenId='${req.params.ordenid}'`);
        res.json({ message: `Orden de trabajo actualizada de pendiente a terminada` });
    }

    //Get para todas las ordenes según el tipo
    public async getOrdenes(req: Request, res: Response) {
        try {
            const ordenes = await sql.query(`${consulta} WHERE ot.TipoId=${req.params.tipoid}`)
            res.status(200).json(ordenes.recordset)
        }
        catch (e) {
            console.error(e)
        }
    }

    //Obtiene los datos de una orden de trabajo según el id pasado por parámetro
    public async selectOrden(req: Request, res: Response) {
        const orden = await sql.query(consulta + ` WHERE ot.OrdenId=${req.params.ordenid}`)
        res.status(200).json(orden.recordset[0])
    }

    //Actualizar los campos de la orden que se hayan modificado
    public async updateOrdenDeTrabajo(req: Request, res: Response) {
        try {
            let ordenid = req.params.ordenid
            let valores = Object.entries(req.body)
            for (let i = 0; i < valores.length; i++) {
                let key = valores[i][0]
                let valor = valores[i][1]
                if (valor != null) {
                    await sql.query(`UPDATE OrdenDeTrabajo SET ${key}='${valor}' WHERE OrdenId=${ordenid}`)

                }
            }
            res.status(200).json({ message: "Se ha actualizado la orden de trabajo correctamente" })

        } catch (e) {
            console.log(e)
        }
    }
    
    //Elimina Orden; elimina de la tabla para ordenes y de la tabla donde se asocia un preventivo con ut a una orden
    public async deleteOrden(req: Request, res: Response) {
        try {
            await sql.query(`DELETE FROM UTPreventivo_OrdenDeTrabajo WHERE OrdenId=${req.params.ordenid};
            DELETE FROM OrdenDeTrabajo WHERE OrdenId=${req.params.ordenid};
            `)
            res.status(200).json({ message: "Orden eliminada correctamente" })
        } catch (e) {
            res.status(400).json({ message: e })
            console.error(e)
        }

    }

    public async actualizarOperarioDeOrden(req: Request, res: Response) {
        try {
            await sql.query(`UPDATE OrdenDeTrabajo SET OperarioId=${req.params.operarioId} WHERE OrdenId=${req.params.ordenId}`)
            res.status(200).json({ message: "Operario actualizado" })
        } catch (error) {
            res.status(400).json({ message: "Error: " + error });
        }
    }

}
const ordendetrabajoController = new OrdenDeTrabajoController();
export default ordendetrabajoController;