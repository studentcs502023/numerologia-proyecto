import { createRouter, createWebHashHistory } from "vue-router";

import AuthLayout from "../layouts/AuthLayout.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import UserLayout from "../layouts/UserLayout.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import RecuperarView from "../views/RecuperarView.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminUsuarios from "../views/admin/AdminUsuarios.vue";
import AdminPagos from "../views/admin/AdminPagos.vue";
import UserDashboard from "../views/user/UserDashboard.vue";
import UserDashboardPremium from "../views/user/UserDashboardPremium.vue";
import UserPerfil from "../views/user/UserPerfil.vue";
import MembresiaView from "../views/user/MembresiaView.vue";
import PagoExitosoView from "../views/user/PagoExitosoView.vue";

const routes = [
  // ═══ Rutas Públicas (Auth) ═══
  {
    path: "/",
    component: AuthLayout,
    children: [
      {
        path: "",
        redirect: "/login",
      },
      {
        path: "login",
        name: "Login",
        component: LoginView,
      },
      {
        path: "registro",
        name: "Registro",
        component: RegisterView,
      },
      {
        path: "recuperar",
        name: "Recuperar",
        component: RecuperarView,
      },
    ],
  },

  // ═══ Rutas Admin (protegidas) ═══
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: AdminDashboard,
      },
      {
        path: "usuarios",
        name: "AdminUsuarios",
        component: AdminUsuarios,
      },
      {
        path: "pagos",
        name: "AdminPagos",
        component: AdminPagos,
      },
    ],
  },

  // ═══ Rutas Usuario (protegidas) ═══
  {
    path: "/usuario",
    component: UserLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "UserDashboard",
        component: UserDashboard,
      },
      {
        path: "perfil",
        name: "UserPerfil",
        component: UserPerfil,
      },
      {
        path: "membresia",
        name: "Membresia",
        component: MembresiaView,
      },
      {
        path: "premium",
        name: "UserDashboardPremium",
        component: UserDashboardPremium,
      },
      {
        path: "pago-exitoso",
        name: "PagoExitoso",
        component: PagoExitosoView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


export default router;
