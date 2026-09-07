import { configuracionAgenda } from "./data/resources.js";
import { arrayProfesionales, arrayEspecialidades } from "./data/resources.js";

console.clear()
console.log("CONFIGURACION")
console.table(configuracionAgenda)
console.log("PROFESIONALES")
console.table(arrayProfesionales)
console.log("ESPECIALIDADES")
console.table(arrayEspecialidades)