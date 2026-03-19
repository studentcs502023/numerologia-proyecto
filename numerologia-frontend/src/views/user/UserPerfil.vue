<template>
  <!-- Contenedor principal estándar con div -->
  <div class="perfil-container">
    
    <!-- Encabezado del perfil -->
    <div class="header-section text-center q-mb-xl">
      <div class="avatar-large q-mb-md">{{ iniciales }}</div>
      <h2 class="text-h4 text-white q-mb-xs">{{ usuario.nombre }}</h2>
      <p class="text-grey-5">Gestiona tu información personal y cuenta.</p>
    </div>

    <!-- Formulario de edición (Diseño limpio con divs) -->
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <div class="glass-card shadow-10">
          
          <div class="row q-col-gutter-lg">
            <!-- Nombre -->
            <div class="col-12">
              <q-input 
                v-model="usuario.nombre" 
                label="Nombre completo" 
                outlined 
                bg-color="white" 
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>

            <!-- Email (Solo lectura) -->
            <div class="col-12 col-sm-6">
              <q-input 
                v-model="usuario.email" 
                label="Correo electrónico" 
                outlined 
                bg-color="grey-2" 
                dense 
                readonly
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>

            <!-- Fecha Nacimiento -->
            <div class="col-12 col-sm-6">
              <q-input 
                v-model="usuario.fechaNacimiento" 
                label="Fecha de nacimiento" 
                outlined 
                bg-color="white" 
                dense 
                type="date"
              >
                <template v-slot:prepend>
                  <q-icon name="cake" />
                </template>
              </q-input>
            </div>

            <!-- Botón de guardado -->
            <div class="col-12 text-center q-mt-md">
              <q-btn 
                color="primary" 
                icon="save" 
                label="Guardar cambios" 
                size="lg" 
                class="full-width" 
                @click="actualizarPerfil" 
              />
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Sección de Cuenta (Membresía) -->
    <div class="row justify-center q-mt-xl">
      <div class="col-12 col-md-8">
        <div class="glass-card bg-indigo-10 text-white row items-center no-wrap">
          <div class="q-pa-md">
            <div class="text-h6">Estado de Membresía</div>
            <div class="row items-center q-mt-sm">
              <q-badge :color="usuario.estado === 'activo' ? 'positive' : 'grey'" class="q-py-xs q-px-md text-subtitle2">
                {{ usuario.estado === 'activo' ? 'PREMIUM' : 'PLAN GRATUITO' }}
              </q-badge>
            </div>
          </div>
          <q-space />
          <div class="q-pa-md">
            <q-btn 
              v-if="usuario.estado !== 'activo'" 
              color="orange" 
              label="Hacerme Premium" 
              to="/usuario/membresia" 
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from "@/store/auth";
import { getData, putData } from "@/services/baseService";

const $q = useQuasar();
const authStore = useAuthStore();

// --- ESTADO ---
const usuario = ref({
  nombre: '',
  email: '',
  fechaNacimiento: '',
  estado: ''
});

// Iniciales para el círculo del perfil
const iniciales = computed(() => {
  if (!usuario.value.nombre) return '??';
  return usuario.value.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
});

// --- LÓGICA ---

/**
 * Carga los datos del perfil actual
 */
const cargarPerfil = async () => {
  $q.loading.show({ message: 'Obteniendo tus datos...' });

  try {
    // Usamos el ID del authStore
    const userId = authStore.usuario?.id || authStore.usuario?._id;
    const res = await getData(`usuarios/perfil/${userId}`);
    
    // El backend nos manda el objeto usuario
    usuario.value = {
      ...res.usuario,
      // Formatear fecha para el input date (YYYY-MM-DD)
      fechaNacimiento: res.usuario.fechaNacimiento ? res.usuario.fechaNacimiento.split('T')[0] : ''
    };
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'No pudimos cargar tus datos'
    });
  } finally {
    $q.loading.hide();
  }
};

/**
 * Actualiza los datos en el servidor
 */
const actualizarPerfil = async () => {
  if (!usuario.value.nombre) {
    return $q.notify({ type: 'warning', message: 'El nombre es obligatorio' });
  }

  $q.loading.show({ message: 'Guardando cambios...' });

  try {
    const userId = authStore.usuario?.id || authStore.usuario?._id;
    await putData(`usuarios/perfil/${userId}`, {
      nombre: usuario.value.nombre,
      fechaNacimiento: usuario.value.fechaNacimiento
    });

    $q.notify({
      type: 'positive',
      message: 'Perfil actualizado con éxito'
    });

    // Actualizamos el nombre en el Store para que cambie en todo el frontend
    authStore.usuario.nombre = usuario.value.nombre;

  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar el perfil'
    });
  } finally {
    $q.loading.hide();
  }
};

onMounted(cargarPerfil);
</script>

<style>
/* Estilos globales (Junior Style) */
.perfil-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.avatar-large {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-left: auto;
  margin-right: auto;
  border: 4px solid rgba(255, 255, 255, 0.2);
}

.glass-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
}

/* Background del container */
body {
  background-color: #0f0c29 !important;
}
</style>
