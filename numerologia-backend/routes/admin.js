import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import {
    getDashboard,
    getAllUsuarios,
    getAllPagos,
    getAllLecturas,
    cambiarRolUsuario,
    deleteUsuarioAdmin
} from "../controllers/admin.js";

const routerAdmin = Router();

routerAdmin.get("/dashboard", getDashboard);


routerAdmin.get("/usuarios", getAllUsuarios);


routerAdmin.get("/pagos", getAllPagos);


routerAdmin.get("/lecturas", getAllLecturas);


routerAdmin.put(
    "/usuario/:usuario_id/rol",
    [
        check("usuario_id", "ID de usuario inválido").isMongoId(),
        check("rol", "Rol requerido").notEmpty(),
        check("rol", "Rol debe ser 'usuario' o 'administrador'")
            .isIn(['usuario', 'administrador']),
        validarCampos
    ],
    cambiarRolUsuario
);


routerAdmin.delete(
    "/usuario/:usuario_id",
    [
        check("usuario_id", "ID de usuario inválido").isMongoId(),
        validarCampos
    ],
    deleteUsuarioAdmin
);

export default routerAdmin;