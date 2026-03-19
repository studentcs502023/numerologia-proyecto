<template>
  <!-- Contenedor principal con div estándar -->
  <div class="premium-container">
    
    <!-- Encabezado de Bienvenida Premium -->
    <div class="header-section text-center q-mb-xl">
      <q-badge color="amber-9" class="q-pa-xs q-px-md text-weight-bolder">
        <q-icon name="stars" size="14px" class="q-mr-xs" />
        USUARIO PREMIUM
      </q-badge>
      <h2 class="text-h3 text-white text-weight-bolder q-mt-md">Tu Espacio Sagrado</h2>
      <p class="text-grey-4 text-subtitle1">Hola {{ authStore.nombreUsuario }}, tus lecturas diarias están listas.</p>
    </div>

    <!-- Sección de Lectura Diaria (Lo más importante para el Premium) -->
    <div class="row justify-center q-mb-xl">
      <div class="col-12 col-md-8">
        <div class="daily-reading-box q-pa-xl shadow-15 text-center">
          <div v-if="!lecturaDiaria">
            <q-icon name="brightness_low" size="80px" color="amber-8" class="q-mb-md rotate-animation" />
            <h3 class="text-h5 text-white">¿Qué te deparan los números hoy?</h3>
            <p class="text-grey-5 q-mb-xl">Genera tu consejo personalizado basado en la vibración de este día.</p>
            <q-btn 
              color="amber-9" 
              label="REVELAR MI DÍA" 
              icon="auto_awesome" 
              size="lg" 
              class="full-width q-py-md text-weight-bolder" 
              @click="generarLecturaDiaria" 
            />
          </div>
          
          <div v-else class="text-left">
            <div class="row items-center q-mb-md">
              <q-badge color="amber-10" label="LECTURA DE HOY" class="q-mr-sm" />
              <q-space />
              <div class="text-grey-6 text-caption">{{ fechaHoy }}</div>
            </div>
            <div class="reading-preview text-grey-3 q-pa-md bg-dark rounded-borders q-mb-lg">
              {{ lecturaDiaria.contenido?.substring(0, 250) }}...
            </div>
            <q-btn 
              flat 
              color="amber-8" 
              label="Leer sabiduría completa" 
              icon="visibility" 
              @click="abrirLectura(lecturaDiaria)" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Lecturas (Para que vea el valor de su cuenta) -->
    <div class="history-section">
      <h3 class="text-h5 text-white q-mb-lg">Tu Historial de Consultas</h3>
      
      <div class="table-container shadow-5 bg-white rounded-borders overflow-hidden">
        <q-table
          :rows="historial"
          :columns="columnas"
          row-key="_id"
          flat
          :pagination="{ rowsPerPage: 5 }"
          no-data-label="Aún no tienes lecturas guardadas"
        >
          <!-- Columna Tipo -->
          <template v-slot:body-cell-tipo="props">
            <q-td :props="props">
              <q-badge :color="props.value === 'principal' ? 'primary' : 'amber-9'">
                {{ props.value.toUpperCase() }}
              </q-badge>
            </q-td>
          </template>

          <!-- Columna Acción -->
          <template v-slot:body-cell-accion="props">
            <q-td :props="props">
              <q-btn flat round icon="open_in_new" color="grey-7" @click="abrirLectura(props.row)" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Modal para ver lecturas -->
    <q-dialog v-model="modalAbierto">
      <q-card class="bg-dark text-white" style="min-width: 350px; max-width: 700px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Sabiduría Revelada</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-xl scroll" style="max-height: 70vh">
          <div class="reading-text" v-html="contenidoFormateado"></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="amber-8" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from "@/store/auth";
import { getData, postData } from "@/services/baseService";

const $q = useQuasar();
const authStore = useAuthStore();

// --- ESTADO ---
const lecturaDiaria = ref(null);
const historial = ref([]);
const modalAbierto = ref(false);
const lecturaSeleccionada = ref(null);

const fechaHoy = computed(() => {
  return new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
});

const columnas = [
  { name: 'tipo', label: 'TIPO', field: 'tipo', align: 'left' },
  { name: 'fecha', label: 'FECHA', field: 'fecha_lectura', format: val => new Date(val).toLocaleDateString(), align: 'left' },
  { name: 'accion', label: 'VER', align: 'center' }
];

const contenidoFormateado = computed(() => {
  if (!lecturaSeleccionada.value?.contenido) return '';
  return lecturaSeleccionada.value.contenido.split('\n').map(p => `<p>${p}</p>`).join('');
});

// --- LÓGICA ---

/**
 * Carga todo el historial de lecturas del usuario
 */
const cargarDatos = async () => {
  $q.loading.show({ message: 'Consultando los registros cósmicos...' });
  try {
    const userId = authStore.usuario?.id || authStore.usuario?._id;
    const res = await getData(`lecturas/usuario/${userId}`);
    historial.value = res.data || [];

    // Buscamos si ya tiene la diaria de hoy
    const hoy = new Date().toDateString();
    lecturaDiaria.value = historial.value.find(l => 
      l.tipo === 'diaria' && new Date(l.fecha_lectura).toDateString() === hoy
    );

  } catch (error) {
    console.error("Error cargando premium dashboard:", error);
  } finally {
    $q.loading.hide();
  }
};

/**
 * Genera la lectura diaria (Solo permitido 1 vez al día por el backend)
 */
const generarLecturaDiaria = async () => {
  $q.loading.show({ message: 'Analizando la energía del día...' });
  try {
    const userId = authStore.usuario?.id || authStore.usuario?._id;
    const res = await postData(`lecturas/diaria/${userId}`);
    
    lecturaDiaria.value = res.data;
    historial.value.unshift(res.data); // Añadir al inicio de la tabla

    $q.notify({
      type: 'positive',
      message: 'Tu guía diaria ha sido revelada',
      icon: 'brightness_5'
    });
    
    abrirLectura(res.data);
  } catch (error) {
    const msg = error.response?.status === 409 
      ? "Ya has recibido tu sabiduría hoy. ¡Vuelve mañana!" 
      : "Error al conectar con la IA.";
    $q.notify({ type: 'warning', message: msg });
  } finally {
    $q.loading.hide();
  }
};

const abrirLectura = (lectura) => {
  lecturaSeleccionada.value = lectura;
  modalAbierto.value = true;
};

onMounted(cargarDatos);
</script>

<style>
/* Estilos globales (Junior Style) */
.premium-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.daily-reading-box {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

.table-container {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.reading-preview {
  font-style: italic;
  line-height: 1.6;
}

.reading-text p {
  margin-bottom: 20px;
  line-height: 1.8;
  font-size: 1.1rem;
}

/* Animación de rotación para el icono de espera */
.rotate-animation {
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Ajustes para la tabla en blanco */
.q-table__container { background: white !important; }
.q-table th { font-weight: bold; background: #fdf2d2; }

@media (max-width: 600px) {
  .premium-container { padding: 20px; }
  .text-h3 { font-size: 2rem; }
}
</style>
