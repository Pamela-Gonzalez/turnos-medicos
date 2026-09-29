import { arrayProfesionales } from "../data/resources.js"
import type { Profesional } from "../data/resources.js"
import { type Response, type Request } from "express"

export class ProfesionalesControlador{
    static statusCode = 200
     
    static getAll = async (req: Request, res: Response) => {
        this.statusCode = 200
  try {
        const profesionalesFiltrados: [] = arrayProfesionales.filter((prof: any)=> prof.activo === true)

    return res.status(this.statusCode)
        .json(profesionalesFiltrados)
  } catch (error: any) {
    this.statusCode = 400
    return res.status(this.statusCode)
              .json({status: false, message: error.message });
  }
}

    static findById = async (req: Request, res: Response) => {
        this.statusCode = 200
  try {
    const profesionalId = req.params.id

    if (!profesionalId) {
        this.statusCode = 400
        throw new Error ('Verifica el código o ID del profesional')
    }

    const profesionalSeleccionado = arrayProfesionales.find((prof: any)=> prof.profesionalId === Number(profesionalId))

    if (!profesionalSeleccionado) {
        this.statusCode = 404
        throw new Error ('Error al buscar un Profesional médico')
    }

        return res.status(this.statusCode)
                  .json(arrayProfesionales)

   } catch (error: any) {
     return res.status(this.statusCode)
               .json({success: false, message: error.message });
   }
}

    static create = async (req: Request, res: Response) => {
        this.statusCode = 201
  try {
        const { nombre, especialidad, activo} = req.body

        if (!nombre || !especialidad || !activo) {
            this.statusCode = 400
        throw new Error ('Verifica los datos del nuevo profesional a crear')
    }

        const nuevoProfesional: Profesional = {
            profesionalId: arrayProfesionales.length + 1,
            nombre: nombre,
            especialidad: especialidad,
            activo: Boolean(activo)
        }

        arrayProfesionales.push(nuevoProfesional)

        return res.status(this.statusCode)
                  .json(nuevoProfesional)


  } catch (error: any) {
    return res.status(this.statusCode)
              .json({success: false, message: error.message });
  }
}

    static modify = async (req: Request, res: Response) => {
        this.statusCode = 200
  try {
       const Id = Number(req.params.profesionalid)

      if (!Id) {
        this.statusCode = 400
        throw new Error ('Verifica el código o ID del profesional a buscar')
    }

       console.log("ID recibido:", Id)
       console.table(arrayProfesionales)

       const { nombre, especialidad, activo } = req.body

       if (!nombre || !especialidad || !activo) {
        this.statusCode = 400
        throw new Error ('Verifica los datos del profesional a modificar')
    }


       const indice = arrayProfesionales.findIndex((prof: any) => Number(prof.profesionalid ?? prof.id) === Id)
       
      if (indice === -1) {
        this.statusCode = 404
        throw new Error ('No se encontro un profesional con el código indicado')
    }


       console.log("Índice encontrado:", indice)

       if (indice === -1) {
          throw new Error ('No se encontro un profesional con el código indicado')
       }
         
        arrayProfesionales[indice].nombre = nombre 
        arrayProfesionales[indice].especialidad = especialidad
        arrayProfesionales[indice].activo = Boolean(activo)

        console.table(arrayProfesionales)

        return res.status(this.statusCode)
                  .json({status: true, message: "Profesional actualizado correctamente", profesional: arrayProfesionales[indice]})


       } catch (error: any) {
           console.log(error) // <-- Esto te dirá exactamente qué falla
           
         return res.status(this.statusCode)
                   .json({success: false, message: error.message })
       } 
}

    static delete = async (req: Request, res: Response) => {
        this.statusCode = 204
  try {
    const Id = Number(req.params.id)

    if (!Id) {
        this.statusCode = 400
          throw new Error ('Verifica el código o ID del profesional a buscar')
       }

    const indice = arrayProfesionales.findIndex((prof: any)=> Number(prof.profesionalid) === Id)

    if (indice === -1) {
        this.statusCode = 404
       throw new Error ('Error al intentar cambiar activo de un profesional') 
    }
      // Borrado lógico: cambiamos la propiedad activo a false
        arrayProfesionales[indice].activo = false

        console.table(arrayProfesionales)

        return res.status(this.statusCode)
                  .json({}) 
    
  } catch (error: any) {
    console.error(error)
    return res.status(this.statusCode)
              .json({success: false, message: error.message})
  }
}

}
