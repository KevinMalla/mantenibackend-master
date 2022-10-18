import sql from '../database';

class Ordenes {

    //Obtiene los id de los preventivos
    public async obtenerPreventivos() {
        const preventivos = await sql.query(`SELECT UtPrevId FROM UT_Preventivo`)
        return preventivos.recordset;
    }
    //Obtiene las fechas, si ese preventivo tiene una orden de trabajo asociada, obtendrá su fecha validado. En caso contrario, obtendrá la fecha de inicio
    public async obtenerFechas(preventivoid: number) {
        const fechas = await sql.query(`if exists(
            select ot.OrdenId from OrdenDeTrabajo ot 
            inner join UTPreventivo_OrdenDeTrabajo uto on uto.OrdenId=ot.OrdenId
            inner join UT_Preventivo ut on ut.UtPrevId = uto.UTPrevId
            where ut.UtPrevId= ${preventivoid}) 
        begin 
            select top 1 ut.UtPrevId, ot.FechaValidado, per.Dias from OrdenDeTrabajo ot 
            inner join UTPreventivo_OrdenDeTrabajo uto on uto.OrdenId=ot.OrdenId
            inner join UT_Preventivo ut on ut.UtPrevId = uto.UTPrevId
            inner join Preventivo pre on pre.PreventivoId = ut.Preventivo
            inner join Periodicidad per on pre.PeriodicidadId = per.PeriodicidadId
            where ut.UtPrevId= ${preventivoid}
            order by ot.OrdenId DESC
        end 
        else
        begin
            select utp.UTPrevId, utp.FechaInicio, per.Dias from UT_Preventivo utp
            inner join Preventivo pre on pre.PreventivoId = utp.Preventivo
            inner join Periodicidad per on pre.PeriodicidadId = per.PeriodicidadId
            where utp.UtPrevId = ${preventivoid}
        end`)

        return fechas.recordset[0];
    }
    //Si existe un operario asociado al preventivo creará la orden en estado 2, con fecha planificado y el operario asignado y por último devuelve el id de la orden insertada
    public async crearOT(preventivoId: number) {
        try {
            const ultimoId = await sql.query(` 
            IF EXISTS (SELECT OperarioId FROM Preventivo_Operario po
                INNER JOIN Preventivo pre on pre.PreventivoId = po.PreventivoId
                INNER JOIN UT_Preventivo utp on utp.Preventivo = pre.PreventivoId
                WHERE utp.UtPrevId = ${preventivoId})
            INSERT INTO OrdenDeTrabajo(FechaCreacion, EstadoId, TipoId, PrioridadId, OperarioId, PersonaResponsable, Planta, Area, Zona, Seccion, Codigo, Grupo, Equipo, Preventivo, FechaPendiente)
                SELECT CAST(GETDATE() AS date), 2, 1, 2, po.OperarioId,2482, utp.Planta, utp.Area, utp.Zona, utp.Seccion, utp.Codigo, utp.Grupo, utp.Equipo, utp.Preventivo, CAST(GETDATE() AS date) 
                FROM UT_Preventivo utp 
                LEFT JOIN Preventivo_Operario po on po.PreventivoId = utp.Preventivo
                LEFT JOIN [DATOS7QB_ISRI_SPAIN].[dbo].[usuario] usu ON usu.Codigo = po.OperarioId
                WHERE utp.UtPrevId = ${preventivoId}
            ELSE
            INSERT INTO OrdenDeTrabajo (FechaCreacion, EstadoId, TipoId,PrioridadId, PersonaResponsable, Planta, Area, Zona, Seccion, Codigo, Grupo, Equipo, Preventivo)
                SELECT CAST(GETDATE() AS date), 1, 1, 2, 2392, utp.Planta, utp.Area, utp.Zona, utp.Seccion, utp.Codigo, utp.Grupo, utp.Equipo, utp.Preventivo from UT_Preventivo utp WHERE utp.UtPrevId = ${preventivoId};
            SELECT IDENT_CURRENT('OrdenDeTrabajo') as 'id'`)
            return ultimoId.recordset[0];

        } catch (e) {
            console.error(e)
        }
    }
    //Asocia la orden de trabajo al preventivo
    public async asociarPreventivoAOT(utprevid: number, ordenid: number) {
        try {
            await sql.query(`INSERT INTO UTPreventivo_OrdenDeTrabajo(UTPrevId, OrdenId) VALUES(${utprevid}, ${ordenid})`)
        } catch (e) {
            console.log("Error asociando OT a PREV " + e)
        }
    }
    //Añade las tareas del preventivo a la orden de trabajo
    public async crearTareasDeOt(ulitmoid: number) {
        try {
            await sql.query(`INSERT INTO TareaDeOT(Descripcion, Estado, OrdenId)
            SELECT T.Descripcion, 0, ${ulitmoid}
            FROM Tarea T
            INNER JOIN Tarea_Preventivo TP ON T.TareaId=TP.TareaId
            INNER JOIN Preventivo P ON P.PreventivoId=TP.PreventivoId
            where p.PreventivoId = ( select x.Preventivo from ordendetrabajo x  where x.OrdenId = ${ulitmoid})`)

        } catch (e) {
            console.error(e)
        }
    }

}
const ordenes = new Ordenes();
export default ordenes;