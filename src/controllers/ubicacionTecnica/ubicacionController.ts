import { Request, Response } from 'express';
import sql from '../../database';

class UbicacionController{
    //Obtiene las ubicaciones técnicas de una determinada planta, area, zona, sección, código, grupo o equipo
    public async selectUbicaciones(req:Request, res:Response):Promise<any>{
    try{
        let consulta = `select p.Denominacion as 'Planta',
        ISNULL(a.Descripcion,'-') as 'Area',
        ISNULL(z.Descripcion,'-') as 'Zona',
        ISNULL(s.Descripcion,'-') as 'Seccion', 
        ISNULL(c.Descripcion,'-') as 'Codigo', 
        ISNULL(g.Descripcion,'-') as 'Grupo',
        ISNULL(e.Denominacion,'-') as 'Equipo'
        from planta p
        left join Area a on p.PlantaId = a.PlantaId
        left join Zona z on a.AreaId = z.AreaId
        left join Seccion s on z.ZonaId = s.ZonaId
        left join Codigo c on s.SeccionId = c.SeccionId
        left join Grupo g on c.CodigoId = g.CodigoId
        left join Equipo e on g.GrupoId = e.GrupoId
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
        

        const ubicaciones = await sql.query(consulta);

        if(ubicaciones.recordset.length>0) res.status(200).json(ubicaciones.recordset)
        else res.status(404).json({message:"No se han encontrado ubicaciones técnicas"})
        
    }catch(error){
        res.json(error)
        console.log(error)
    }
    }

    
}
const ubicacionController = new UbicacionController();
export default ubicacionController;