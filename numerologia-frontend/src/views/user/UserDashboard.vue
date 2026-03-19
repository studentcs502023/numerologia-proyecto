<template>
  <!-- Contenedor principal con div estándar -->
  <div class="user-dashboard-container">
    
    <!-- Sección de Bienvenida -->
    <div class="welcome-box text-center q-mb-xl">
      <div class="text-overline text-orange-8 text-weight-bolder q-mb-sm">
        {{ fechaHoy }}
      </div>
      <h1 class="text-h3 text-white text-weight-bold q-mb-md">
        ¡Hola, {{ authStore.nombreUsuario }}!
      </h1>
      <p class="text-subtitle1 text-grey-4">
        Descubre lo que los números tienen preparado para ti hoy.
      </p>
    </div>

    <!-- Accion Principal: Generar Lectura -->
    <div v-if="!lectura" class="generate-section text-center q-mb-xl">
      <div class="magic-card q-pa-xl shadow-10">
        <q-icon name="auto_awesome" size="80px" color="orange-8" class="q-mb-lg pulse-animation" />
        <h2 class="text-h5 text-white q-mb-md">Tu Lectura de Vida</h2>
        <p class="text-grey-5 q-mb-xl">Analizaremos tu nombre y fecha de nacimiento para revelar tu propósito.</p>
        
        <q-btn 
          color="orange-9" 
          size="xl" 
          label="GENERAR MI LECTURA" 
          icon="auto_fix_high"
          class="full-width q-py-md text-weight-bolder"
          @click="generarLectura"
        />
      </div>
    </div>

    <!-- Lectura ya generada -->
    <div v-else class="reading-result q-mb-xl">
      <div class="glass-card q-pa-lg">
        <div class="row items-center q-mb-md">
          <q-icon name="menu_book" size="30px" color="primary" class="q-mr-sm" />
          <h3 class="text-h5 text-white q-ma-none">Tu Destino Revelado</h3>
          <q-space />
          <q-badge color="positive">LECTURA ACTIVA</q-badge>
        </div>
        
        <div class="reading-content text-grey-3 q-pa-md bg-black-transparent rounded-borders">
          {{ lectura.contenido?.substring(0, 300) }}...
        </div>

        <div class="text-center q-mt-lg">
          <q-btn 
            outline 
            color="primary" 
            label="Leer Completo" 
            icon="visibility" 
            @click="abrirLecturaCompleta"
          />
        </div>
      </div>
    </div>

    <!-- Banner para No-Premium -->
    <div v-if="!esPremium" class="premium-banner q-pa-lg shadow-5 q-mb-xl">
      <div class="row items-center no-wrap">
        <q-icon name="workspace_premium" size="50px" color="amber-8" class="q-mr-lg" />
        <div>
          <div class="text-h6 text-white">¿Quieres ver tu lectura diaria?</div>
          <div class="text-body2 text-grey-4">Los usuarios Premium reciben consejos personalizados todos los días.</div>
        </div>
        <q-space />
        <q-btn color="amber-9" label="Ser Premium" to="/usuario/membresia" />
      </div>
    </div>

    <!-- Modal de Lectura Completa -->
    <q-dialog v-model="modalLectura">
      <q-card class="bg-dark text-white" style="min-width: 350px; max-width: 800px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Tu Lectura Completa</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-lg scroll" style="max-height: 70vh">
          <div class="reading-text" v-html="contenidoFormateado"></div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="white" v-close-popup />
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
const lectura = ref(null);
const modalLectura = ref(false);

const esPremium = computed(() => authStore.usuario?.estado === 'activo');

const fechaHoy = computed(() => {
  return new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).toUpperCase();
});

// Convertir el texto de la lectura a párrafos para mostrarlo bien
const contenidoFormateado = computed(() => {
  if (!lectura.value?.contenido) return '';
  return lectura.value.contenido.split('\n').map(p => `<p>${p}</p>`).join('');
});

// --- LÓGICA ---

/**
 * Busca si el usuario ya tiene una lectura generada
 */
const cargarLecturaExistente = async () => {
  const userId = authStore.usuario?.id || authStore.usuario?._id;
  try {
    const res = await getData(`lecturas/usuario/${userId}`);
    // Buscamos la lectura de tipo 'principal'
    const principal = res.data?.find(l => l.tipo === 'principal');
    if (principal) {
      lectura.value = principal;
    }
  } catch (error) {
    console.log("No hay lectura previa.");
  }
};

/**
 * Llama a la IA para generar una nueva lectura
 */
const generarLectura = async () => {
  const userId = authStore.usuario?.id || authStore.usuario?._id;
  
  // Feedback visual (Regla obligatoria)
  $q.loading.show({
    message: 'Los astros se están alineando para ti...',
    spinnerColor: 'orange'
  });

  try {
    const res = await postData(`lecturas/principal/${userId}`);
    lectura.value = res.data;
    
    $q.notify({
      type: 'positive',
      message: '¡Lectura revelada!',
      icon: 'auto_awesome'
    });
    
    modalLectura.value = true;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Hubo un problema con la conexión astral. Intenta más tarde.'
    });
  } finally {
    $q.loading.hide();
  }
};

const abrirLecturaCompleta = () => {
  modalLectura.value = true;
};

onMounted(cargarLecturaExistente);
</script>

<style>
/* Estilos globales (Junior Style: Simples y directos) */
.user-dashboard-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.magic-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 152, 0, 0.3);
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bg-black-transparent {
  background: rgba(0, 0, 0, 0.4);
}

.premium-banner {
  background: linear-gradient(90deg, #2c3e50, #000000);
  border-radius: 15px;
  border-left: 5px solid #ffc107;
}

.reading-text p {
  margin-bottom: 15px;
  line-height: 1.6;
  font-size: 1.1rem;
}

/* Animación simple de pulso */
.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}
</style>
