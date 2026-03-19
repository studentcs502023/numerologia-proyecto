<template>
  <!-- Contenedor principal con div estándar -->
  <div class="login-page">
    
    <!-- Tarjeta de Login (Diseño limpio) -->
    <div class="login-card shadow-10">
      
      <!-- Logo o Título -->
      <div class="text-center q-mb-xl">
        <q-icon name="stars" size="64px" color="orange-8" />
        <h1 class="text-h4 text-white text-weight-bolder q-mt-md">BIENVENIDO</h1>
        <p class="text-grey-5">Ingresa al portal de numerología</p>
      </div>

      <!-- Formulario con QInput de Quasar -->
      <div class="q-gutter-y-md">
        <q-input 
          v-model="email" 
          label="Correo Electrónico" 
          outlined 
          dark 
          color="orange-8"
          placeholder="ejemplo@correo.com"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <q-input 
          v-model="password" 
          label="Contraseña" 
          type="password" 
          outlined 
          dark 
          color="orange-8"
          placeholder="••••••••"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>

        <div class="row justify-end">
          <router-link to="/recuperar" class="text-orange-8 text-caption text-weight-bold" style="text-decoration:none">
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>

        <!-- Botón de Acción Principal -->
        <q-btn 
          color="orange-9" 
          label="INICIAR SESIÓN" 
          class="full-width q-py-md text-weight-bolder" 
          size="lg"
          @click="realizarLogin" 
        />

        <div class="text-center q-mt-lg text-grey-5">
          ¿No tienes una cuenta? 
          <router-link to="/registro" class="text-white text-weight-bolder">Registrate aquí</router-link>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from "@/store/auth";
import { postData } from "@/services/baseService";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

// --- ESTADO ---
const email = ref("");
const password = ref("");

// --- LÓGICA ---

/**
 * Función para validar e iniciar sesión
 */
const realizarLogin = async () => {
  // Validación básica de Junior
  if (!email.value || !password.value) {
    return $q.notify({
      type: 'warning',
      message: 'Por favor, completa todos los campos'
    });
  }

  // Feedback de carga (Regla obligatoria)
  $q.loading.show({ message: 'Validando tus datos con el cosmos...' });

  try {
    const res = await postData("usuarios/login", { 
      email: email.value, 
      password: password.value 
    });

    // Guardamos la sesión en el Store
    authStore.setAuth({
      token: res.token,
      usuario: res.usuario,
    });

    $q.notify({
      type: 'positive',
      message: `¡Bienvenido de nuevo, ${res.usuario.nombre}!`,
      position: 'top'
    });

    // Redirección inteligente según el rol del usuario
    if (res.usuario.rol === "administrador") {
      router.push("/admin");
    } else {
      router.push("/usuario");
    }

  } catch (error) {
    console.error("Error en login:", error);
    const mensajeError = error.response?.data?.msg || "Credenciales incorrectas";
    
    $q.notify({
      type: 'negative',
      message: mensajeError
    });
  } finally {
    // Siempre ocultar el loading
    $q.loading.hide();
  }
};
</script>

<style>
/* Estilos globales y sencillos (Junior Style) */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh; /* Ajustado para el AuthLayout */
}

.login-card {
  background: rgba(15, 12, 41, 0.9);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255, 152, 0, 0.3);
  max-width: 400px;
  width: 100%;
  backdrop-filter: blur(10px);
}

/* Ajustes para inputs en modo oscuro */
.q-field--outlined.q-field--dark .q-field__control:before {
  border-color: rgba(255, 255, 255, 0.2);
}

.q-field--outlined.q-field--dark:hover .q-field__control:before {
  border-color: rgba(255, 152, 0, 0.5);
}
</style>
