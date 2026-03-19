<template>
  <!-- Contenedor principal con div estándar -->
  <div class="pago-exitoso-container">
    
    <!-- Tarjeta de éxito con diseño limpio -->
    <div class="success-card shadow-10 q-pa-xl text-center">
      
      <!-- Icono de Éxito animado -->
      <div class="q-mb-lg">
        <q-icon name="check_circle" size="100px" color="positive" class="pulse-animation" />
      </div>

      <h1 class="text-h3 text-white text-weight-bolder q-mb-sm">¡PAGO CONFIRMADO!</h1>
      <p class="text-subtitle1 text-grey-4 q-mb-xl">Tu energía ahora vibra en sintonía con el cosmos. Ya eres usuario <strong>PREMIUM</strong>.</p>

      <!-- Beneficios Activados (Lista simple con divs) -->
      <div class="row justify-center q-mb-xl">
        <div class="col-12 col-sm-8 text-left bg-dark-transparent q-pa-lg rounded-borders">
          <div class="text-overline text-orange-8 q-mb-sm">BENEFICIOS ACTIVADOS</div>
          <div class="row items-center q-mb-sm">
            <q-icon name="done" color="positive" size="20px" class="q-mr-sm" />
            <span class="text-white">Lecturas diarias personalizadas desbloqueadas.</span>
          </div>
          <div class="row items-center q-mb-sm">
            <q-icon name="done" color="positive" size="20px" class="q-mr-sm" />
            <span class="text-white">Acceso ilimitado a tu historial de consultas.</span>
          </div>
          <div class="row items-center">
            <q-icon name="done" color="positive" size="20px" class="q-mr-sm" />
            <span class="text-white">Soporte prioritario y análisis avanzado.</span>
          </div>
        </div>
      </div>

      <!-- Botones de Acción -->
      <div class="row q-col-gutter-md justify-center">
        <div class="col-12 col-sm-6">
          <q-btn 
            color="primary" 
            label="EXPLORAR MI PANEL PREMIUM" 
            icon="auto_awesome" 
            size="lg" 
            class="full-width q-py-md text-weight-bolder" 
            to="/usuario" 
          />
        </div>
      </div>

      <p class="text-grey-6 text-caption q-mt-xl">Se ha enviado un recibo detallado a tu correo electrónico registrado.</p>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

/**
 * Al montar la vista, lanzamos unos confetis visuales (Notificación)
 */
onMounted(() => {
  $q.notify({
    type: 'positive',
    message: '¡Transacción completada con éxito!',
    position: 'top',
    icon: 'verified',
    timeout: 3000
  });
});
</script>

<style>
/* Junior Style: Código limpio y estilos directos */
.pago-exitoso-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
}

.success-card {
  background: rgba(15, 12, 41, 0.95);
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 30px;
  max-width: 700px;
  width: 100%;
  backdrop-filter: blur(15px);
}

.bg-dark-transparent {
  background: rgba(0, 0, 0, 0.4);
}

/* Animación de pulso para el icono de éxito */
.pulse-animation {
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(34, 197, 94, 0.4)); }
  50% { transform: scale(1.1); filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.6)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(34, 197, 94, 0.4)); }
}

@media (max-width: 600px) {
  .text-h3 { font-size: 2rem; }
  .success-card { padding: 30px 20px; }
}
</style>
