<template>
  <!-- Contenedor principal estándar -->
  <div class="register-page">
    
    <!-- Tarjeta de Registro (Diseño limpio con div) -->
    <div class="register-card shadow-10">
      
      <div class="text-center q-mb-lg">
        <q-icon name="person_add" size="56px" color="primary" />
        <h2 class="text-h4 text-white text-weight-bolder q-mt-sm">CREAR CUENTA</h2>
        <p class="text-grey-5">Únete al viaje del autodescubrimiento</p>
      </div>

      <!-- Formulario con componentes Quasar -->
      <div class="q-gutter-y-md">
        
        <q-input 
          v-model="nombre" 
          label="Nombre Completo" 
          outlined 
          dark 
          color="primary"
          placeholder="¿Cómo te llamas?"
        >
          <template v-slot:prepend>
            <q-icon name="face" />
          </template>
        </q-input>

        <q-input 
          v-model="email" 
          label="Correo Electrónico" 
          outlined 
          dark 
          color="primary"
          type="email"
          placeholder="tu@correo.com"
        >
          <template v-slot:prepend>
            <q-icon name="alternate_email" />
          </template>
        </q-input>

        <q-input 
          v-model="password" 
          label="Contraseña" 
          outlined 
          dark 
          color="primary"
          type="password"
          placeholder="Mínimo 6 caracteres"
        >
          <template v-slot:prepend>
            <q-icon name="lock_open" />
          </template>
        </q-input>

        <q-input 
          v-model="fechaNacimiento" 
          label="Fecha de Nacimiento" 
          outlined 
          dark 
          color="primary"
          type="date"
          hint="Usaremos esto para tu lectura numerológica"
          persistent-hint
        >
          <template v-slot:prepend>
            <q-icon name="event" />
          </template>
        </q-input>

        <!-- Botón de Acción -->
        <q-btn 
          color="primary" 
          label="REGISTRARME AHORA" 
          class="full-width q-py-md text-weight-bolder q-mt-lg" 
          size="lg"
          @click="realizarRegistro" 
        />

        <div class="text-center q-mt-md text-grey-5">
          ¿Ya tienes una cuenta? 
          <router-link to="/login" class="text-primary text-weight-bolder">Inicia sesión</router-link>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { postData } from "@/services/baseService";

const $q = useQuasar();
const router = useRouter();

// --- ESTADO ---
const nombre = ref("");
const email = ref("");
const password = ref("");
const fechaNacimiento = ref("");

// --- LÓGICA ---

/**
 * Función para registrar un nuevo usuario
 */
const realizarRegistro = async () => {
  // Validación básica
  if (!nombre.value || !email.value || !password.value || !fechaNacimiento.value) {
    return $q.notify({
      type: 'warning',
      message: 'Por favor, llena todos los campos sagrados'
    });
  }

  // Feedback de carga (Regla obligatoria)
  $q.loading.show({ message: 'Escribiendo tu nombre en las estrellas...' });

  try {
    await postData("usuarios", {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      fechaNacimiento: fechaNacimiento.value
    });

    $q.notify({
      type: 'positive',
      message: '¡Cuenta creada con éxito! Ahora puedes iniciar sesión.',
      position: 'top'
    });

    // Redirigimos al login para que el usuario entre formalmente
    router.push("/login");

  } catch (error) {
    console.error("Error en registro:", error);
    const msg = error.response?.data?.error || error.response?.data?.msg || "No pudimos crear tu cuenta";
    
    $q.notify({
      type: 'negative',
      message: msg
    });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style>
/* Estilos globales y sencillos (Junior Style) */
.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
}

.register-card {
  background: rgba(10, 10, 26, 0.95);
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(124, 58, 237, 0.3);
  max-width: 450px;
  width: 100%;
  backdrop-filter: blur(15px);
}

/* Hint de Quasar en color gris suave */
.q-field__bottom {
  color: #a0a0c0 !important;
}
</style>
