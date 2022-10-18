import { Request, Response } from 'express';
import sql from '../../database';
class SeccionController {

    public async selectAllUtPreventivos(req: Request, res: Response) {
 
        //Obtiene los preventivos con su ubicación técnica, la descripción del preventivo su fecha de inicio y su línea.
        let  consulta = `select utp.utprevid,
        case when utp.Area is null then p.Descripcion 
             when utp.Zona is null then concat(p.Denominacion, '/', a.Descripcion) 
             when utp.Seccion is null then concat(p.Denominacion, '/', a.Denominacion, '/', z.Descripcion)
             when utp.Codigo is null then concat(p.Denominacion, '/', a.Denominacion, '/', z.Denominacion, '/', s.Descripcion) 
             when utp.Grupo is null then concat(p.Denominacion, '/', a.Denominacion, '/', z.Denominacion, '/', s.Denominacion, '/', c.Descripcion ) 
             when utp.Equipo is null then concat(p.Denominacion, '/', a.Denominacion, '/', z.Denominacion, '/', s.Denominacion, '/', c.Denominacion, '/', g.Descripcion ) 
             else concat(p.Denominacion,'/', a.Denominacion,'/' ,z.Denominacion ,'/', s.Denominacion,'/', c.Denominacion,'/', g.Denominacion, '/', e.Denominacion) 
        end as 'UbicacionTecnica', 
        pre.Descripcion as 'Preventivo', per.Descripcion as 'Periodicidad', per.Dias as 'Dias', ISNULL(CAST(utp.fechainicio AS NVARCHAR), 'SIN FECHA') as 'FechaInicio',
        s.Descripcion as 'Linea'
        from UT_Preventivo utp
        left join Planta p on p.PlantaId = utp.Planta 
        left join Area a on a.AreaId = utp.Area
        left join Zona z on z.ZonaId = utp.Zona
        left join Seccion s on s.SeccionId = utp.Seccion
        left join Codigo c on c.CodigoId = utp.Codigo
        left join Grupo g on g.GrupoId = utp.Grupo
        left join Equipo e on e.EquipoId = utp.Equipo
        inner join Preventivo pre on pre.PreventivoId=utp.Preventivo
        inner join Periodicidad per on per.PeriodicidadId = pre.periodicidadid
        where (p.PlantaId = ${req.body.PlantaId})`
        
        if(req.body.AreaId!=''){
            consulta+= ` and (a.AreaId = ${req.body.AreaId})`
        }
        if(req.body.ZonaId!=''){
            consulta+= ` and (z.ZonaId = ${req.body.ZonaId})`
        }
        if(req.body.SeccionId!=''){
            consulta+= ` and (s.SeccionId = ${req.body.SeccionId})`
        }
        if(req.body.CodigoId!=''){
            consulta+= ` and (c.CodigoId = ${req.body.CodigoId})`
        }
        if(req.body.GrupoId!=''){
            consulta+= ` and (g.GrupoId = ${req.body.GrupoId})`
        }
        if(req.body.EquipoId!=''){
            consulta+= ` and (e.EquipoId = ${req.body.EquipoId})`
        }

        const preventivos = await sql.query(consulta);

        if(preventivos.recordset.length>0) res.json(preventivos.recordset);
        else res.status(404).json({message:"No se han encontrado preventivos"})
    }
    //Añade un preventivo, si recibe campos vacíos los inserta como NULL
    public async addUtPreventivo(req: Request, res: Response) {
        try {
            let Planta = req.body.ubicacionTecnica.PlantaId
            let Area = req.body.ubicacionTecnica.AreaId
            if (Area == "") Area = 'NULL'

            let Zona = req.body.ubicacionTecnica.ZonaId
            if (Zona == "") Zona = 'NULL'

            let Seccion = req.body.ubicacionTecnica.SeccionId
            if (Seccion == "") Seccion = 'NULL'

            let Codigo = req.body.ubicacionTecnica.CodigoId
            if (Codigo == "") Codigo = 'NULL'

            let Grupo = req.body.ubicacionTecnica.GrupoId
            if (Grupo == "") Grupo = 'NULL'

            let Equipo = req.body.ubicacionTecnica.EquipoId
            if (Equipo == "") Equipo = 'NULL'

            let Fecha = req.body.fecha
            if (Fecha == "") Fecha = 'NULL'
            else Fecha = "'" + Fecha + "'"

            let Preventivo = req.body.preventivo

            await sql.query(`INSERT INTO UT_Preventivo(Planta, Area, Zona, Seccion, Codigo, Grupo, Equipo, Preventivo, FechaInicio)
            VALUES(${Planta}, ${Area}, ${Zona}, ${Seccion}, ${Codigo}, ${Grupo}, ${Equipo}, ${Preventivo}, ${Fecha})`)

            res.status(200).json({ message: "UT Preventivo creado correctamente" })
        } catch (error) {
            console.log(error)
            res.json(error)
        }
    }
    //Comprueba si el preventivo pasado tiene OT con fecha finalizada, si tiene fecha devuelve true y la fecha, en caso contrario, devuelve solamente false
    public async comprobarOTFin(req: Request, res: Response) {
        try {

            let preventivo = req.params.utprevid
            const OT = await sql.query(`if exists(
                select ot.OrdenId from OrdenDeTrabajo ot 
                inner join UTPreventivo_OrdenDeTrabajo uto on uto.OrdenId=ot.OrdenId
                inner join UT_Preventivo ut on ut.UtPrevId = uto.UTPrevId
                where ut.UtPrevId= ${preventivo}) 
                begin 
                    select top 1 'true' as 'Estado', ot.FechaValidado from OrdenDeTrabajo ot 
                inner join UTPreventivo_OrdenDeTrabajo uto on uto.OrdenId=ot.OrdenId
                inner join UT_Preventivo ut on ut.UtPrevId = uto.UTPrevId
                where ut.UtPrevId= ${preventivo}
                order by ot.OrdenId DESC
                end 
                else
                begin
                    select 'false' as 'Estado'
                end`)

            res.status(200).json(OT.recordset[0])

        } catch (error) {
            console.log(error)
        }
    }
    //Actualiza la fecha de un preventivo con fecha de inicio
    public async updatePreventivo(req:Request, res:Response){
        try{
            await sql.query(`update ut_preventivo set fechainicio='${req.body.FechaInicio}' where utprevid='${req.params.utprevid}'`)
            res.status(200).json({message:"Preventivo actualizado correctamente"})

        }catch(error){
            console.log(error)
        }
    }
}
const seccionController = new SeccionController();
export default seccionController;