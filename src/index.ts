import express from "express";
import { EspecialidadesControlador } from "./controlador/especialidades.controlador";
import { ProfesionalesControlador } from "./controlador/profesionales.controlador";
import { GeneralControlador } from "./controlador/general.controlador";

const PORT = process.env.PORT || 3000;
const app = express();

// MIDDLEWARE
app.use(express.json());

// ENDPOINTS

// Hello World
app.get("/", GeneralControlador.helloworld);

// Especialidades
app.get("/especialidades", EspecialidadesControlador.getAll);
app.get("/especialidades/:id", EspecialidadesControlador.findById);
app.post("/especialidades", EspecialidadesControlador.create);
app.delete("/especialidades/:id", EspecialidadesControlador.delete);

// Profesionales
app.get("/profesionales", ProfesionalesControlador.getAll);
app.get("/profesionales/:id", ProfesionalesControlador.findById);
app.post("/profesionales", ProfesionalesControlador.create);
app.put("/profesionales/:id", ProfesionalesControlador.modify);
app.delete("/profesionales/:id", ProfesionalesControlador.delete);

// Middleware 404 - Ruta no encontrada
app.use(GeneralControlador.notFound);

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// ==========================================
// ENDPOINTS DE ESPECIALIDADES
// ==========================================

// GET /especialidades - Obtener el listado completo de especialidades
app.get('/especialidades', async (req: Request, res: Response) => {
  try {
     const especialidadesActivas = arrayEspecialidades.filter((esp: any)=> esp.activa === true)

    if (!especialidadesActivas) {
        throw new Error ('No hay especialidades activas en este momento')
    }

     return res.status(200)
               .json(especialidadesActivas)

  } catch (error: any) {
    return res.status(400)
              .json({ success: false, message: error.message});
  }
});

// GET /especialidades/:id - Buscar una especialidad por especialidadId
app.get('/especialidades/:id', async (req: Request, res: Response) => {
  try {
    const especialidadId: number = Number(req.params.id);

    if (!especialidadId || isNaN(especialidadId)) {
      throw new Error('Verifica el código o ID de la especialidad que buscas');
    }

    const especialidadSolicitada = arrayEspecialidades.find(
      (esp: any) => esp.especialidadId === especialidadId
    );

    if (!especialidadSolicitada) {
      throw new Error('No se encontró una especialidad con el código o ID indicado.');
    }

    return res.status(200)
              .json(especialidadSolicitada);

  } catch (error: any) {
    return res.status(400).json({
      status: false,
      errorMessage: error.message || 'Error al buscar la especialidad'
    });
  }
});

// POST /especialidades - Crear una nueva especialidad
app.post('/especialidades', async (req: Request, res: Response) => {
  try {
    const {nombreEspecialidad, activa} = req.body

    if (!nombreEspecialidad || !activa) {
        throw new Error ('Verifica los datos enviados para la nueva especialidades')
    }

    const nuevaEspecialidad: Especialidad = {
        especialidadId: arrayEspecialidades.length + 1,
        nombreEspecialidad: nombreEspecialidad, 
        activa: Boolean(activa)
    }
    arrayEspecialidades.push(nuevaEspecialidad)

    console.clear()
    return res.status(201)
              .json(nuevaEspecialidad)


  } catch (error: any) {
    return res.status(400)
              .json({status: false, message: error.message });
  }
});

// DELETE /especialidades/:id - Borrado lógico (activa: false)
app.delete('/especialidades/:id', async (req: Request, res: Response) => {
  try {
    
    const idParam = Number(req.params.id)

    if (!idParam) {
        throw new Error ('Verifica el código o ID de la especialidades')
    }

    const indice: number = arrayEspecialidades.findIndex((esp:any)=> Number(esp.especialidadId) === idParam)

    if (!idParam) {
        throw new Error ('No se encontró especialidad con el código indicado')
    }

        arrayEspecialidades[indice].activa = false

        console.table(arrayEspecialidades)

        return res.status(200)
                  .json({status: true, message: "La especialidad se ha desactivado correctamente",
            especialidad: arrayEspecialidades[indice]
           })


    } catch (error: any) {
         return res.status(400)
                   .json({ status: false, message: error.message });
  }

})

    // Respuesta obligatoria si no existe la especialidad 
    // res.status(404).json({
    // status: false,
    // errorMessage: 'Especialidad no encontrada'
    // });

// ==========================================
// ENDPOINTS DE PROFESIONALES MÉDICOS
// ==========================================

// GET /profesionales - Obtener el listado completo de profesionales
app.get('/profesionales', async (req: Request, res: Response) => {
  try {
        const profesionalesFiltrados: [] = arrayProfesionales.filter((prof: any)=> prof.activo === true)

    return res.status(200)
        .json(profesionalesFiltrados)
  } catch (error: any) {
    return res.status(400)
              .json({status: false, message: error.message });
  }
});


// GET /profesionales/:id - Buscar un médico específico por medicoId
app.get('/profesionales/:id', async (req: Request, res: Response) => {
  try {
    const profesionalId = req.params.id

    if (!profesionalId) {
        throw new Error ('Verifica el código o ID del profesional')
    }

    const profesionalSeleccionado = arrayProfesionales.find((prof: any)=> prof.profesionalId === Number(profesionalId))

    if (!profesionalSeleccionado) {
        throw new Error ('Error al buscar un Profesional médico')
    }

        return res.status(200)
                  .json(arrayProfesionales)

   } catch (error: any) {
     return res.status(400)
               .json({success: false, message: error.message });
   }
});


// POST /profesionales - Registrar nuevo médico asignando especialidad existente
app.post('/profesionales', async (req: Request, res: Response) => {
  try {
        const { nombre, especialidad, activo} = req.body

        if (!nombre || !especialidad || !activo) {
        throw new Error ('Verifica los datos del nuevo profesional a crear')
    }

        const nuevoProfesional: Profesional = {
            profesionalId: arrayProfesionales.length + 1,
            nombre: nombre,
            especialidad: especialidad,
            activo: Boolean(activo)
        }

        arrayProfesionales.push(nuevoProfesional)

        return res.status(201)
                  .json(nuevoProfesional)


  } catch (error: any) {
    return res.status(400)
              .json({success: false, message: error.message });
  }
});


// PUT /profesionales/:id - Modificación completa de datos de un profesional
app.put('/profesionales/:profesionalid', async (req: Request, res: Response) => {
  try {
       const Id = Number(req.params.profesionalid)

      if (!Id) {
        throw new Error ('Verifica el código o ID del profesional a buscar')
    }

       console.log("ID recibido:", Id)
       console.table(arrayProfesionales)

       const { nombre, especialidad, activo } = req.body

       if (!nombre || !especialidad || !activo) {
        throw new Error ('Verifica los datos del profesional a modificar')
    }


       const indice = arrayProfesionales.findIndex((prof: any) => Number(prof.profesionalid ?? prof.id) === Id)
       
      if (indice === -1) {
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

        return res.status(200)
                  .json({status: true, message: "Profesional actualizado correctamente", profesional: arrayProfesionales[indice]})

       //else  {
        //console.log(Error) // <-- Esto te dirá exactamente qué falla
        //return res.status(404).json({
        //status: false,
        //errorMessage: 'Profesional no encontrado'


       } catch (error: any) {
           console.log(error) // <-- Esto te dirá exactamente qué falla
           
         return res.status(400)
                   .json({success: false, message: error.message })
       } 
});


// DELETE /profesionales/:id - Borrado lógico (activo: false)
app.delete('/profesionales/:id', async (req: Request, res: Response) => {
  try {
    const Id = Number(req.params.id)

    if (!Id) {
          throw new Error ('Verifica el código o ID del profesional a buscar')
       }

    const indice = arrayProfesionales.findIndex((prof: any)=> Number(prof.profesionalid) === Id)

    if (indice === -1) {
       throw new Error ('Error al intentar cambiar activo de un profesional') 
    }
      // Borrado lógico: cambiamos la propiedad activo a false
        arrayProfesionales[indice].activo = false

        console.table(arrayProfesionales)

        return res.status(204)
                  .json({}) //success: true, message: 'Profesional desactivado correctamente', profesional: arrayProfesionales[indice]
       
       //} else {
       //  return res.status(404).json({
       // status: false,
       // errorMessage: 'Endpoint no encontrado' 
    
  } catch (error: any) {
    console.error(error)
    return res.status(400)
              .json({success: false, message: error.message})
  }
})


