<template>
  <!-- Contenedor principal estándar -->
  <div class="dashboard-admin">
    
    <!-- Encabezado con bienvenida -->
    <div class="header-section">
      <h2 class="text-h3 text-white q-mb-sm">Resumen del Sistema</h2>
      <p class="text-grey-4">Hola administrador, aquí tienes el estado actual de la plataforma.</p>
    </div>

    <!-- Grid de tarjetas con estadísticas (Uso de divs para estructura) -->
    <div class="row q-col-gutter-lg q-mb-xl">
      
      <!-- Card Usuarios -->
      <div class="col-12 col-sm-4">
        <div class="stat-box shadow-5 bg-indigo-10 text-white">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-h6 opacity-70">Usuarios</div>
              <div class="text-h3 text-weight-bolder">{{ stats?.usuarios?.total || 0 }}</div>
            </div>
            <q-icon name="group" size="64px" class="opacity-30" />
          </div>
          <div class="q-mt-md">
            <q-badge color="positive" class="q-mr-xs">Activos: {{ stats?.usuarios?.activos }}</q-badge>
            <q-badge color="orange">{{ stats?.usuarios?.administradores }} Admins</q-badge>
          </div>
        </div>
      </div>

      <!-- Card Pagos / Ingresos -->
      <div class="col-12 col-sm-4">
        <div class="stat-box shadow-5 bg-teal-10 text-white">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-h6 opacity-70">Ingresos Totales</div>
              <div class="text-h3 text-weight-bolder">${{ stats?.pagos?.ingresoTotal || 0 }}</div>
            </div>
            <q-icon name="payments" size="64px" class="opacity-30" />
          </div>
          <div class="q-mt-md">
            <span class="text-subtitle2">Total transacciones: {{ stats?.pagos?.total }}</span>
          </div>
        </div>
      </div>

      <!-- Card Lecturas -->
      <div class="col-12 col-sm-4">
        <div class="stat-box shadow-5 bg-deep-purple-10 text-white">
          <div class="row items-center justify-between no-wrap">
            <div>
              <div class="text-h6 opacity-70">Lecturas</div>
              <div class="text-h3 text-weight-bolder">{{ stats?.lecturas?.total || 0 }}</div>
            </div>
            <q-icon name="auto_stories" size="64px" class="opacity-30" />
          </div>
          <div class="q-mt-md">
            <span class="text-subtitle2 text-grey-3">Generadas por usuarios</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Accesos Directos Rápidos -->
    <div class="header-section q-mb-md">
      <h3 class="text-h5 text-white">Accesos Rápidos</h3>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <q-btn 
          class="full-width q-py-lg text-bold" 
          color="white" 
          text-color="primary" 
          icon="group" 
          label="Gestionar Usuarios" 
          to="/admin/usuarios"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-btn 
          class="full-width q-py-lg text-bold" 
          color="white" 
          text-color="secondary" 
          icon="receipt_long" 
          label="Revisar Pagos" 
          to="/admin/pagos"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { getData } from "@/services/baseService";

const $q = useQuasar();
const stats = ref(null);

/**
 * Carga las estadísticas reales del backend
 */
const cargarEstadisticas = async () => {
  // Feedback visual (Regla obligatoria)
  $q.loading.show({ message: 'Obteniendo datos del servidor...' });

  try {
    const data = await getData("admin/dashboard");
    // El backend nos manda el objeto { success, estadisticas }
    stats.value = data.estadisticas;

    $q.notify({
      type: 'info',
      message: 'Panel actualizado',
      position: 'top',
      timeout: 1000
    });
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    $q.notify({
      type: 'negative',
      message: 'Error al conectar con el backend'
    });
  } finally {
    // Cerramos el feedback visual
    $q.loading.hide();
  }
};

onMounted(cargarEstadisticas);
</script>

<style>
/* Estilos globales y sencillos (Junior Style) */
.dashboard-admin {
  padding: 40px;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  min-height: 100vh;
}

.header-section {
  margin-bottom: 40px;
}

/* Caja de estadísticas personalizada */
.stat-box {
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.stat-box:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.3);
}

.opacity-70 { opacity: 0.7; }
.opacity-30 { opacity: 0.3; }

@media (max-width: 600px) {
  .dashboard-admin {
    padding: 20px;
  }
}
</style>
