<template>
  <!-- Contenedor principal usando Flexbox estándar -->
  <div class="admin-wrapper">
    
    <!-- BARRA LATERAL (SIDEBAR) -->
    <div :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]">
      
      <!-- Logo -->
      <div class="sidebar-header q-pa-md text-center">
        <q-icon name="admin_panel_settings" size="40px" color="orange-8" />
        <div v-if="!isCollapsed" class="text-subtitle2 text-white text-weight-bolder q-mt-sm">
          ADMIN PANEL
        </div>
      </div>

      <!-- Menú de Navegación -->
      <div class="sidebar-menu q-mt-md">
        <q-btn 
          flat 
          align="left" 
          class="full-width q-py-md text-grey-4" 
          icon="dashboard" 
          label="Dashboard" 
          to="/admin" 
          :hide-label="isCollapsed"
        />
        <q-btn 
          flat 
          align="left" 
          class="full-width q-py-md text-grey-4" 
          icon="group" 
          label="Usuarios" 
          to="/admin/usuarios" 
          :hide-label="isCollapsed"
        />
        <q-btn 
          flat 
          align="left" 
          class="full-width q-py-md text-grey-4" 
          icon="payments" 
          label="Pagos" 
          to="/admin/pagos" 
          :hide-label="isCollapsed"
        />
      </div>

      <q-space />

      <!-- Botón de Colapsar -->
      <div class="text-center q-pa-sm">
        <q-btn 
          flat 
          round 
          dense 
          color="grey-6" 
          :icon="isCollapsed ? 'chevron_right' : 'chevron_left'" 
          @click="isCollapsed = !isCollapsed" 
        />
      </div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="main-body">
      
      <!-- Barra Superior (TopBar) -->
      <div class="top-bar shadow-2 q-px-lg row items-center justify-between">
        <div class="text-weight-bold text-grey-8">
          Numerología Mística | <span class="text-primary">Administración</span>
        </div>

        <div class="row items-center q-gutter-md">
          <div class="text-right">
            <div class="text-caption text-weight-bold">{{ authStore.nombreUsuario }}</div>
            <q-badge color="orange-9" label="SUPER ADMIN" />
          </div>
          <q-btn 
            flat 
            round 
            color="negative" 
            icon="logout" 
            @click="cerrarSesion" 
          >
            <q-tooltip>Cerrar Sesión</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Espacio para las Vistas (donde se cargan los componentes) -->
      <div class="content-area q-pa-lg">
        <router-view />
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from "@/store/auth";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const isCollapsed = ref(false);

/**
 * Función para salir del panel
 */
const cerrarSesion = () => {
  $q.dialog({
    title: 'Cerrar Sesión',
    message: '¿Estás seguro de que quieres salir del panel de administración?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    $q.loading.show({ message: 'Cerrando sesión de forma segura...' });
    
    // Simulamos un pequeño retraso para que se vea el feedback
    setTimeout(() => {
      authStore.logout();
      $q.loading.hide();
      router.push("/login");
    }, 800);
  });
};
</script>

<style>
/* Junior Style: Flexbox puro y sin complicaciones */
.admin-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f4f7f6;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background-color: #1a1a2e;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-collapsed {
  width: 70px;
}

.sidebar .q-btn {
  border-radius: 0;
}

.sidebar .q-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white !important;
}

/* Cuerpo Principal */
.main-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 70px;
  background: white;
  border-bottom: 1px solid #ddd;
}

.content-area {
  flex: 1;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 600px) {
  .sidebar {
    display: none; /* En móvil podríamos ocultarla o hacerla flotante */
  }
}
</style>
