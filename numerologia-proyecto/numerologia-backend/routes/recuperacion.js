import { Router } from "express";
import {
  postOlvideContraseña,
  postVerificarCodigo,
  postCambiarContraseña,
} from "../controllers/recuperacion.js";
import {
  validarOlvideContraseña,
  validarVerificarCodigo,
  validarCambiarContraseña,
} from "../middlewares/recuperacion.js";

const routerRecuperacion = Router();


routerRecuperacion.post(
  "/olvide-contraseña",
  validarOlvideContraseña,
  postOlvideContraseña,
);


routerRecuperacion.post(
  "/verificar-codigo",
  validarVerificarCodigo,
  postVerificarCodigo,
);

routerRecuperacion.post(
  "/cambiar-contraseña",
  validarCambiarContraseña,
  postCambiarContraseña,
);

export default routerRecuperacion;
