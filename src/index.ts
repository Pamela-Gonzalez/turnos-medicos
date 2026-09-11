import { configuracionAgenda } from "./data/resources.js";
import { arrayProfesionales, arrayEspecialidades } from "./data/resources.js";
import type { Especialidad, Profesional } from "./data/resources.js";


import express, {type Response, type Request} from "express";
const PORT = process.env.PORT || 3000;
const app = express();


//MIDDLEWARE
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//ENDPOINTS
//Hello World
app.get("/", (req: Request, res: Response) => {
  res.status(200);
  res.json({ success: true, errorMessage: "Bienvenido al servidor web de MedTurnos" });
});


// ==========================================
// ENDPOINTS DE ESPECIALIDADES
// ==========================================

// GET /especialidades - Obtener el listado completo de especialidades
app.get('/especialidades', (req: Request, res: Response) => {
  try {
     res.status(200)
        .json(arrayEspecialidades)
  } catch (error) {
    res.status(400)
       .json({ success: false, errorMessage: 'Error al obtener las especialidades' });
  }
});

// GET /especialidades/:id - Buscar una especialidad por especialidadId
app.get('/especialidades/:id', (req: Request, res: Response) => {
  try {
    const especialidadId: number | undefined = Number(req.params.id) 

    if (!especialidadId) {
        throw new Error ('Error al obtener el código de la especialidad') 
    }

    const especialidadSolicitada = arrayEspecialidades.find((esp: any)=> esp.especialidadId === especialidadId)

    if (!especialidadSolicitada) {
        throw new Error ('No se encontro la especialidad indicada.')
    } else {
        console.clear()
        console.table(especialidadSolicitada)
        res.status(200)
        .json(especialidadSolicitada)
    }

  } catch (error) {
    res.status(400)
       .json({ status: false, errorMessage: 'Error al buscar la especialidad' });
  }
});


// POST /especialidades - Crear una nueva especialidad
app.post('/especialidades', (req: Request, res: Response) => {
  try {
    const {nombreEspecialidad, activa} = req.body

    const nuevaEspecialidad: Especialidad = {
        especialidadId: arrayEspecialidades.length + 1,
        nombreEspecialidad: nombreEspecialidad, 
        activa: Boolean(activa)
    }
    arrayEspecialidades.push(nuevaEspecialidad)

    console.clear()
    console.table(nuevaEspecialidad)
    res.status(201)
       .json(nuevaEspecialidad)


  } catch (error) {
    res.status(400)
       .json({status: false, errorMessage: 'Error al crear la especialidad' });
  }
});


// DELETE /especialidades/:id - Borrado lógico (activa: false)
app.delete('/especialidades/:id', (req: Request, res: Response) => {
  try {
    const especialidadId: number = Number(req.params.id as string)

    const indice: number = arrayEspecialidades.findIndex((esp:any)=> esp.especialidadId === especialidadId)

    if (indice > -1) {
        arrayEspecialidades(indice).activa = false

        res.status(200)
           .json({})
    }

  } catch (error) {
    res.status(400)
       .json({ status: false, errorMessage: 'Error al desactivar la especialidad' });
  }
});

// ==========================================
// ENDPOINTS DE PROFESIONALES MÉDICOS
// ==========================================

// GET /profesionales - Obtener el listado completo de profesionales
app.get('/profesionales', (req: Request, res: Response) => {
  try {
        const profesionalesFiltrados: [] = arrayProfesionales.filter((prof: any)=> prof.activo === true)

    res.status(200)
        .json(profesionalesFiltrados)
  } catch (error) {
    res.status(400)
       .json({status: false, errorMessage: 'Verifica el código de especialidad enviada.' });
  }
});


// GET /profesionales/:id - Buscar un médico específico por medicoId
app.get('/profesionales/:id', (req: Request, res: Response) => {
  try {
    const profesionalId = req.params.id

    const profesionalSeleccionado = arrayProfesionales.find((prof: any)=> prof.profesionalId === Number(profesionalId))

    if (profesionalSeleccionado) {
        res.status(200)
           .json(arrayProfesionales)
    } else {
        throw new Error('Error al buscar un Profesional médico')
    }


  } catch (error) {
    res.status(400)
       .json({status: false, errorMessage: "Error buscando un profesional" });
  }
});


// POST /profesionales - Registrar nuevo médico asignando especialidad existente
app.post('/profesionales', (req: Request, res: Response) => {
  try {
        const { nombre, especialidad, activo} = req.body

        const nuevoProfesional: Profesional = {
            profesionalId: arrayProfesionales.length + 1,
            nombre: nombre,
            especialidad: especialidad,
            activo: Boolean(activo)
        }

        arrayProfesionales.push(nuevoProfesional)

        res.status(201)
        .json(nuevoProfesional)


  } catch (error) {
    res.status(400)
       .json({status: false, errorMessage: 'Error creando un nuevo profesional' });
  }
});


// PUT /profesionales/:id - Modificación completa de datos de un profesional
app.put('/profesionales/:id', (req: Request, res: Response) => {
  try {
       const profesionalId = req.params.profesionalId
       const { nombre, especialidad, activo } = req.body

       const indice = arrayProfesionales.findIndex((prof: any)=> prof.profesionalId === Number(profesionalId))
       if (indice > -1) {
         
        arrayProfesionales(indice).nombre = nombre 
        arrayProfesionales(indice).especialidad = especialidad
        arrayProfesionales(indice).activo = Boolean(activo)

        res.status(200)
           .json(arrayProfesionales(indice))

       } else {
            throw new Error("No se encontro el profesional indicado")
       }


  } catch (error) {
    res.status(400)
       .json({ status: false, errorMessage: 'Error al actualizar el profesional' });
  }
});

// DELETE /profesionales/:id - Borrado lógico (activo: false)
app.delete('/profesionales/:id', (req: Request, res: Response) => {
  try {
    const profesionalId = req.params.profesionalId
    const indice = arrayProfesionales.findIndex((prof: any)=> prof.profesionalId === Number(profesionalId))

    if (indice > -1) {
        arrayProfesionales(indice).activo = false
        res.status(204)
           .json({})
    } else {
        throw new Error("Error al intentar cambiar el estado activo de un profesional.")
    }

  } catch (error) {
    res.status(400)
       .json({status: false, errorMessage: 'Error al intentar realizar la operación' });
  }
});


app.delete('/profesionales/:id', (req: Request, res: Response) => {
})

app.use((req: Request, res: Response) => {
    try {
        res.status(404).json({
            error: 'Endpoint no encontrado',
            ruta: req.originalUrl,
            metodo: req.method
           });
    }catch (error) {
        res.status(500).json({error: 'Error internodel servidor' });
    }
});
