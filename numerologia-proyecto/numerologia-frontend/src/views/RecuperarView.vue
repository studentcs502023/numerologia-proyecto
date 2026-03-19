<template>
  <div class="recuperar-container">
    
    <!-- TARJETA PRINCIPAL -->
    <div class="recovery-card shadow-10">
      
      <!-- Icono Central -->
      <div class="text-center q-mb-lg">
        <q-icon 
          :name="paso === 4 ? 'check_circle' : 'lock_reset'" 
          :color="paso === 4 ? 'positive' : 'orange-8'" 
          size="64px" 
        />
      </div>

      <!-- PASO 1: Ingresar Email -->
      <div v-if="paso === 1">
        <h2 class="text-h5 text-white text-center text-weight-bolder q-mb-sm">¿Olvidaste tu contraseña?</h2>
        <p class="text-grey-5 text-center q-mb-xl">No te preocupes, dinos tu correo y te ayudaremos.</p>
        
        <q-input 
          v-model="email" 
          label="Tu correo electrónico" 
          outlined dark color="orange-8"
          class="q-mb-lg"
        >
          <template v-slot:prepend><q-icon name="email" /></template>
        </q-input>

        <q-btn 
          color="orange-9" label="ENVIAR CÓDIGO" 
          class="full-width q-py-md text-weight-bolder" 
          @click="solicitarCodigo" 
        />
      </div>

      <!-- PASO 2: Verificar Código -->
      <div v-if="paso === 2">
        <h2 class="text-h5 text-white text-center text-weight-bolder q-mb-sm">Verifica tu correo</h2>
        <p class="text-grey-5 text-center q-mb-xl">Hemos enviado un código de 6 dígitos a su bandeja.</p>
        
        <q-input 
          v-model="codigo" 
          label="Código de verificación" 
          outlined dark color="orange-8"
          mask="######"
          unmasked-value
          placeholder="123456"
          class="q-mb-lg"
        >
          <template v-slot:prepend><q-icon name="pin" /></template>
        </q-input>

        <q-btn 
          color="orange-9" label="VERIFICAR CÓDIGO" 
          class="full-width q-py-md text-weight-bolder" 
          @click="verificarCodigo" 
        />
      </div>

      <!-- PASO 3: Nueva Contraseña -->
      <div v-if="paso === 3">
        <h2 class="text-h5 text-white text-center text-weight-bolder q-mb-sm">Nueva Contraseña</h2>
        <p class="text-grey-5 text-center q-mb-xl">Elige una clave que no olvides esta vez.</p>
        
        <q-input 
          v-model="nuevaPassword" 
          label="Nueva Contraseña" 
          type="password"
          outlined dark color="orange-8"
          class="q-mb-md"
        >
          <template v-slot:prepend><q-icon name="key" /></template>
        </q-input>

        <q-btn 
          color="orange-9" label="ACTUALIZAR CONTRASEÑA" 
          class="full-width q-py-md text-weight-bolder" 
          @click="cambiarPassword" 
        />
      </div>

      <!-- PASO 4: Éxito -->
      <div v-if="paso === 4" class="text-center">
        <h2 class="text-h5 text-white text-weight-bolder q-mb-sm">¡Todo listo!</h2>
        <p class="text-grey-5 q-mb-xl">Tu contraseña ha sido actualizada con éxito.</p>
        
        <q-btn 
          color="positive" label="IR AL INICIO DE SESIÓN" 
          class="full-width q-py-md text-weight-bolder" 
          to="/login" 
        />
      </div>

      <!-- Botón Volver -->
      <div class="text-center q-mt-xl" v-if="paso < 4">
        <router-link to="/login" class="text-grey-6 text-caption text-weight-bold" style="text-decoration:none">
          <q-icon name="arrow_back" /> VOLVER ATRÁS
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { postData } from "@/services/baseService";

const $q = useQuasar();

// --- ESTADO ---
const paso = ref(1);
const email = ref("");
const codigo = ref("");
const nuevaPassword = ref("");

// --- LÓGICA ---

/**
 * Paso 1: Enviar correo de recuperación
 */
const solicitarCodigo = async () => {
  if (!email.value) return $q.notify({ type: 'warning', message: 'Dinos tu correo' });

  $q.loading.show({ message: 'Enviando código secreto...' });
  try {
    await postData("usuarios/olvide-contrasena", { email: email.value });
    $q.notify({ type: 'positive', message: '¡Código enviado!' });
    paso.value = 2;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'No pudimos enviar el código' });
  } finally {
    $q.loading.hide();
  }
};

/**
 * Paso 2: Validar el código recibido
 */
const verificarCodigo = async () => {
  if (codigo.value.length < 6) return $q.notify({ type: 'warning', message: 'El código tiene 6 dígitos' });

  $q.loading.show({ message: 'Verificando identidad...' });
  try {
    await postData("usuarios/verificar-codigo", { email: email.value, codigo: codigo.value });
    $q.notify({ type: 'positive', message: '¡Identidad confirmada!' });
    paso.value = 3;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'El código no es correcto' });
  } finally {
    $q.loading.hide();
  }
};

/**
 * Paso 3: Guardar la nueva contraseña
 */
const cambiarPassword = async () => {
  if (nuevaPassword.value.length < 6) return $q.notify({ type: 'warning', message: 'La clave debe tener al menos 6 caracteres' });

  $q.loading.show({ message: 'Actualizando portal...' });
  try {
    await postData("usuarios/cambiar-contrasena", { 
      email: email.value, 
      codigo: codigo.value, 
      nueva_contraseña: nuevaPassword.value 
    });
    paso.value = 4;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cambiar la contraseña' });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style>
/* Junior Style: Código limpio y estilos directos */
.recuperar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.recovery-card {
  background: rgba(15, 12, 41, 0.95);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 152, 0, 0.2);
  max-width: 450px;
  width: 100%;
  backdrop-filter: blur(10px);
}
</style>
