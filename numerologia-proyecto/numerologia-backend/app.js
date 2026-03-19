
import dotenv from 'dotenv';
const result = dotenv.config();

if (result.error) {
  console.error("❌ Error cargando .env:", result.error);
} else {
  console.log("✅ Variables cargadas:", Object.keys(result.parsed));
}
import express from "express";
import cors from "cors";
console.log("¿Las llaves cargaron?:", process.env.GEMINI_API_KEYS);
import dns from "node:dns";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// IPv4 primero (ya no necesario para emails, ahora usamos Brevo API REST)
dns.setDefaultResultOrder("ipv4first");

import routerUsuario from "./routes/usuario.js";
import routerPago from "./routes/pago.js";
import routerAdmin from "./routes/admin.js";
import routerLectura from "./routes/lecturas.js";
import { conectarMongo } from "./database/cnx-mongo.js";
import { iniciarTareaVerificacionMembresias } from "./cron/validarMembresia.js";
import { iniciarRecordatoriosDiarios } from "./cron/recordatorios.js";
import { validarJWT } from "./helpers/validar-JWT.js";
import { validarAdmin } from "./middlewares/admin.js";
// dotenv.config();

const app = express();
await conectarMongo();

iniciarTareaVerificacionMembresias();
iniciarRecordatoriosDiarios();
app.use(cors());
app.use(express.json());

app.use("/api/usuarios", routerUsuario);
app.use("/api/pagos", routerPago);
app.use("/api/lecturas", routerLectura);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/admin", validarJWT, validarAdmin, routerAdmin);
app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});
