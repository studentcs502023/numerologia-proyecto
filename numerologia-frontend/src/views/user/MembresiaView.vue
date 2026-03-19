<template>
  <!-- Estructura con divs estándar -->
  <div class="membresia-container">
    
    <!-- Encabezado -->
    <div class="header-section text-center q-mb-xl">
      <q-icon name="workspace_premium" size="64px" color="orange-8" />
      <h2 class="text-h3 text-white text-weight-bolder q-mt-md">Hazte Premium</h2>
      <p class="text-grey-4 text-subtitle1">Desbloquea el poder completo de la numerología.</p>
    </div>

    <!-- Layout de Membresía -->
    <div class="row q-col-gutter-xl">
      
      <!-- Lado Izquierdo: Beneficios -->
      <div class="col-12 col-md-7">
        <div class="benefits-card q-pa-lg">
          <h3 class="text-h5 text-white q-mb-lg">¿Por qué ser Premium?</h3>
          
          <div v-for="b in beneficios" :key="b.title" class="row items-start q-mb-md no-wrap">
            <q-icon :name="b.icon" color="primary" size="30px" class="q-mr-md" />
            <div>
              <div class="text-weight-bold text-white">{{ b.title }}</div>
              <div class="text-grey-5">{{ b.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lado Derecho: Checkout -->
      <div class="col-12 col-md-5">
        <div class="checkout-card q-pa-xl text-center shadow-10">
          
          <!-- Si ya es premium -->
          <div v-if="yaEsActivo">
            <q-icon name="stars" size="80px" color="positive" class="q-mb-md" />
            <h4 class="text-h5 text-white q-mb-md">¡Ya eres Premium!</h4>
            <p class="text-grey-4 q-mb-xl">Tienes acceso total a todas las funciones cósmicas.</p>
            <q-btn color="primary" label="Ir a mi Dashboard" to="/usuario" class="full-width q-py-md" />
          </div>

          <!-- Si no es premium -->
          <div v-else>
            <div class="text-overline text-orange-8">SUSCRIPCIÓN MENSUAL</div>
            <div class="price-text text-white text-weight-bolder q-my-md">$9.900 <span class="text-subtitle2 text-grey-5">/ mes</span></div>
            
            <q-separator dark class="q-my-lg" />
            
            <div class="text-left q-mb-md">
              <div class="text-grey-4 text-caption">MÉTODO DE PAGO</div>
              <div class="row items-center bg-dark-transparent q-pa-sm rounded-borders">
                <q-icon name="credit_card" color="white" size="20px" class="q-mr-sm" />
                <span class="text-white">Tarjeta de Crédito / Débito</span>
              </div>
            </div>

            <q-btn 
              color="orange-9" 
              icon="payment" 
              label="ACTIVAR AHORA" 
              class="full-width q-py-lg text-weight-bolder q-mt-lg"
              @click="procesarPago" 
            />
            
            <p class="text-grey-6 text-caption q-mt-md">Cobro automático cada mes. Cancela en cualquier momento.</p>
          </div>

        </div>
      </div>

    </div>

    <!-- Botón Volver -->
    <div class="text-center q-mt-xl">
      <q-btn flat color="grey-5" icon="arrow_back" label="Volver al Dashboard" to="/usuario" />
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from "@/store/auth";
import { postData } from "@/services/baseService";

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const yaEsActivo = computed(() => authStore.usuario?.estado === 'activo');

const beneficios = [
  { icon: 'auto_awesome', title: 'Lecturas Diarias', desc: 'Consejos nuevos cada día según tu energía.' },
  { icon: 'history', title: 'Historial Ilimitado', desc: 'Guarda y revisa todas tus lecturas pasadas.' },
  { icon: 'psychology', title: 'Análisis Profundo', desc: 'Reportes extendidos sobre tu personalidad y destino.' },
  { icon: 'verified', title: 'Soporte Prioritario', desc: 'Atención 24/7 para tus consultas numerológicas.' }
];

/**
 * Función principal para procesar el "pago" y activar la cuenta
 */
const procesarPago = async () => {
  // Feedback visual (Regla obligatoria)
  $q.loading.show({
    message: 'Procesando transacción bancaria...',
    spinnerColor: 'orange'
  });

  try {
    const userId = authStore.usuario?.id || authStore.usuario?._id;
    
    // 1. Enviamos el registro del pago al backend
    await postData("pagos", {
      usuario_id: userId,
      monto: 9900,
      metodo: "tarjeta"
    });

    // 2. Si el pago fue exitoso, actualizamos el estado del usuario en el frontend
    // Esto hace que el Dashboard cambie a modo Premium de inmediato
    authStore.usuario.estado = 'activo';

    $q.notify({
      type: 'positive',
      message: '¡Pago Exitoso! Bienvenido al club Premium.',
      icon: 'stars',
      position: 'center'
    });

    // 3. Redirigimos al usuario para que vea su nuevo contenido
    router.push("/usuario");

  } catch (error) {
    console.error("Error al procesar pago:", error);
    $q.notify({
      type: 'negative',
      message: 'No pudimos procesar el pago. Verifica tu tarjeta e intenta de nuevo.'
    });
  } finally {
    $q.loading.hide();
  }
};
</script>

<style>
/* Estilos globales (Junior Style) */
.membresia-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.benefits-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.checkout-card {
  background: white;
  border-radius: 25px;
}

.checkout-card h4, .checkout-card p, .checkout-card div {
  /* Aseguramos que el texto en la card blanca se vea bien */
  color: #1a1a2e;
}

/* Sobrescribimos colores para textos claros en fondo oscuro */
.text-white { color: white !important; }
.text-grey-4 { color: #bdbdbd !important; }
.text-grey-5 { color: #9e9e9e !important; }

.price-text {
  font-size: 3rem;
  line-height: 1;
}

.bg-dark-transparent {
  background: #1a1a2e;
  color: white !important;
}

.bg-dark-transparent span {
  color: white !important;
}
</style>
