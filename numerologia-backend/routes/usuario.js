import { Router } from "express";
import {
  getUsuarios,
  getUsuario,
  postUsuario,
  putUsuario,
  deleteUsuario,
  login,
  obtenerPerfil,
} from "../controllers/usuario.js";
import { validarJWT } from "../helpers/validar-JWT.js";
import {
  validarObtenerUsuario,
  validarCrearUsuario,
  validarActualizarUsuario,
  validarEliminarUsuario,
  validarLogin,
} from "../middlewares/usuarios.js";
import {
  validarOlvideContraseña,
  validarVerificarCodigo,
  validarCambiarContraseña,
} from "../middlewares/recuperacion.js";
import {
  postOlvideContraseña,
  postVerificarCodigo,
  postCambiarContraseña,
} from "../controllers/recuperacion.js";

const routerUsuario = Router();

// ═══════════════════════════════════════════════
// RUTAS PÚBLICAS (sin autenticación)
// ═══════════════════════════════════════════════


routerUsuario.post("/", validarCrearUsuario, postUsuario);


routerUsuario.post("/login", validarLogin, login);


routerUsuario.post(
  "/olvide-contrasena",
  validarOlvideContraseña,
  postOlvideContraseña,
);


routerUsuario.post(
  "/verificar-codigo",
  validarVerificarCodigo,
  postVerificarCodigo,
);


routerUsuario.post(
  "/cambiar-contrasena",
  validarCambiarContraseña,
  postCambiarContraseña,
);

// ═══════════════════════════════════════════════
// RUTAS PROTEGIDAS (requieren token JWT)
// ═══════════════════════════════════════════════


routerUsuario.get("/", validarJWT, getUsuarios);


routerUsuario.get("/perfil", validarJWT, obtenerPerfil);


routerUsuario.get("/:id", validarJWT, validarObtenerUsuario, getUsuario);


routerUsuario.put("/:id", validarJWT, validarActualizarUsuario, putUsuario);


routerUsuario.delete("/:id", validarJWT, validarEliminarUsuario, deleteUsuario);

export default routerUsuario;
