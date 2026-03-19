<template>
  <!-- Contenedor principal con un div estándar -->
  <div class="pagos-container">
    
    <!-- Encabezado simple -->
    <div class="header-section">
      <h2 class="text-h4 text-white q-mb-xs">Historial de Pagos</h2>
      <p class="text-grey-5">Listado general de todas las transacciones realizadas por los usuarios.</p>
    </div>

    <!-- Barra de herramientas (Búsqueda y Filtros) -->
    <div class="actions-bar q-mb-lg">
      <div class="row q-col-gutter-md items-center">
        <div class="col-12 col-sm-6">
          <q-input 
            v-model="filtro" 
            placeholder="Buscar por nombre o método..." 
            outlined 
            dense 
            bg-color="white"
          >
            <template v-slot:prepend>
              <q-icon name="payments" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6 text-right">
          <q-btn 
            color="secondary" 
            icon="sync" 
            label="Actualizar" 
            @click="obtenerPagos" 
          />
        </div>
      </div>
    </div>

    <!-- Tabla de Pagos usando QTable -->
    <div class="table-container shadow-2">
      <q-table
        :rows="pagosFiltrados"
        :columns="columnas"
        row-key="_id"
        flat
        bordered
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No hay registros de pagos"
      >
        <!-- Formatear la columna de Usuario -->
        <template v-slot:body-cell-usuario="props">
          <q-td :props="props">
            <div class="text-weight-bold">{{ props.row.usuario_id?.nombre || 'N/A' }}</div>
            <div class="text-caption text-grey-7">{{ props.row.usuario_id?.email || '' }}</div>
          </q-td>
        </template>

        <!-- Formatear el Monto con un color llamativo -->
        <template v-slot:body-cell-monto="props">
          <q-td :props="props" class="text-weight-bolder text-primary">
            ${{ props.value }}
          </q-td>
        </template>

        <!-- Formatear el Estado con QBadge -->
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'activo' ? 'positive' : 'grey-7'">
              {{ props.value.toUpperCase() }}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
// Usamos el servicio base que creamos antes
import { getData } from "@/services/baseService";

const $q = useQuasar();

// --- ESTADO ---
const pagos = ref([]);
const filtro = ref("");

// Definición de las columnas de la tabla
const columnas = [
  { 
    name: 'usuario', 
    label: 'USUARIO', 
    align: 'left',
    field: row => row.usuario_id?.nombre 
  },
  { 
    name: 'fecha_pago', 
    label: 'FECHA PAGO', 
    field: 'fecha_pago', 
    format: val => new Date(val).toLocaleDateString(),
    align: 'left' 
  },
  { 
    name: 'metodo', 
    label: 'MÉTODO', 
    field: 'metodo', 
    align: 'center' 
  },
  { 
    name: 'monto', 
    label: 'MONTO', 
    field: 'monto', 
    align: 'right' 
  },
  { 
    name: 'estado', 
    label: 'ESTADO', 
    field: 'estado', 
    align: 'center' 
  }
];

// --- LÓGICA ---

/**
 * Función para traer los pagos desde el backend
 */
const obtenerPagos = async () => {
  // Feedback visual de carga (OBLIGATORIO)
  $q.loading.show({ message: 'Consultando transacciones...' });

  try {
    const data = await getData("admin/pagos");
    pagos.value = data.pagos || [];

    // Feedback de éxito
    $q.notify({
      type: 'positive',
      message: 'Historial actualizado',
      position: 'bottom-right'
    });
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    $q.notify({
      type: 'negative',
      message: 'No se pudieron cargar los pagos',
      position: 'bottom-right'
    });
  } finally {
    // Siempre ocultar el loading
    $q.loading.hide();
  }
};

/**
 * Filtrado simple para la barra de búsqueda
 */
const pagosFiltrados = computed(() => {
  if (!filtro.value) return pagos.value;
  const search = filtro.value.toLowerCase();
  return pagos.value.filter(p => 
    p.usuario_id?.nombre?.toLowerCase().includes(search) || 
    p.metodo?.toLowerCase().includes(search)
  );
});

// Al cargar el componente, pedimos los datos
onMounted(obtenerPagos);

</script>

<style>
/* Estilos globales y sencillos (SIN scoped) */
.pagos-container {
  padding: 30px;
  background-color: #121212; /* Un fondo oscuro elegante */
  min-height: 100vh;
}

.header-section {
  margin-bottom: 25px;
}

.actions-bar {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.table-container {
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

/* Ajustes para la tabla */
.q-table__title {
  color: #1976d2;
  font-weight: bold;
}

.q-table thead tr th {
  background-color: #eceff1;
  color: #455a64;
  font-weight: 800;
}

@media (max-width: 600px) {
  .pagos-container {
    padding: 10px;
  }
}
</style>
