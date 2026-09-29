
import { type Response, type Request } from "express"


export class GeneralControler {
    
    static helloworld = async (req: Request, res: Response) => {
      return res.status(200);
      res.json({ success: true, errorMessage: "Bienvenido al servidor web de MedTurnos" });
    }

    static notFound = async (req: Request, res: Response) => {
  try {
    return res.status(404).json({
      error: 'Endpoint no encontrado',
      ruta: req.originalUrl,
      metodo: req.method})

  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}


}