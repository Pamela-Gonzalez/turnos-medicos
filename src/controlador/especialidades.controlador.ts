import { arrayEspecialidades } from "../data/resources.js"
import type { Especialidad } from "../data/resources.js"
import { type Response, type Request } from "express"

export class EspecialidadesControlador {
    static statusCode = 200
    
    static getAll = async (req: Request, res: Response) => {
        this.statusCode = 200
      try {
         const especialidadesActivas = arrayEspecialidades.filter((esp: any)=> esp.activa === true)
    
        if (!especialidadesActivas) {
            this.statusCode = 400
            throw new Error ('No hay especialidades activas en este momento')
        }
    
         return res.status(this.statusCode)
                   .json(especialidadesActivas)
    
      } catch (error: any) {
        return res.status(this.statusCode)
                  .json({ success: false, message: error.message});
      }
    }

    static findById = async (req: Request, res: Response) => {
        this.statusCode = 200
      try {
        const especialidadId: number | undefined = Number(req.params.id) 
    
        if (!especialidadId) {
            this.statusCode = 400
            throw new Error ('Verifica el código o ID de la especialidad que buscas') 
        }
    
        const especialidadSolicitada = arrayEspecialidades.find((esp: any)=> esp.especialidadId === especialidadId)
    
        if (!especialidadSolicitada) {
            this.statusCode = 404
            throw new Error ('No se encontro una especialidad con el código o ID indicado.')
        }
    
             //else {
            //console.clear()
            //console.table(especialidadSolicitada)
            return res.status(this.statusCode)
            .json(especialidadSolicitada)
        
        } catch (error: any) {
        return res.status(this.statusCode)
           .json({ status: false, errorMessage: 'Error al buscar la especialidad' });
        }
    }
    
    static create = async (req: Request, res: Response) => {
        this.statusCode = 201
  try {
    const {nombreEspecialidad, activa} = req.body

    if (!nombreEspecialidad || !activa) {
        this.statusCode = 400
        throw new Error ('Verifica los datos enviados para la nueva especialidades')
    }

    const nuevaEspecialidad: Especialidad = {
        especialidadId: arrayEspecialidades.length + 1,
        nombreEspecialidad: nombreEspecialidad, 
        activa: Boolean(activa)
    }
    arrayEspecialidades.push(nuevaEspecialidad)

    console.clear()
    return res.status(this.statusCode)
              .json(nuevaEspecialidad)


  } catch (error: any) {
    return res.status(this.statusCode)
              .json({status: false, message: error.message });
  }
    }

    static delete = async (req: Request, res: Response) => {
        this.statusCode = 204
  try {
    
    const idParam = Number(req.params.id)

    if (!idParam) {
        this.statusCode = 400
        throw new Error ('Verifica el código o ID de la especialidades')
    }

    const indice: number = arrayEspecialidades.findIndex((esp:any)=> Number(esp.especialidadId) === idParam)

    if (!idParam) {
        this.statusCode = 404
        throw new Error ('No se encontró especialidad con el código indicado')
    }

        arrayEspecialidades[indice].activa = false

        console.table(arrayEspecialidades)

        return res.status(this.statusCode)
                  .json({status: true, message: "La especialidad se ha desactivado correctamente", especialidad: arrayEspecialidades[indice]})


     } catch (error: any) {
         return res.status(this.statusCode)
                   .json({ status: false, message: error.message });
     }
    }
}
