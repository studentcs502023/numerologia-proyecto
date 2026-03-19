<template>
  <div class="auth-header">
    <!-- Ícono estrella animado -->
    <div class="auth-header__icon animate-float">
  
    </div>

    <!-- Título -->
    <h1 class="auth-header__title">
      {{ title }}
      <span class="auth-header__highlight">{{ highlight }}</span>
    </h1>

    <!-- Subtítulo -->
    <p v-if="subtitle" class="auth-header__subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "PORTAL" },
  highlight: { type: String, default: "ASTRAL" },
  subtitle: { type: String, default: "" },
});
</script>

<style>
.auth-header {
  text-align: center;
  margin-bottom: 28px;
  position: relative;
  z-index: 2;
}




.auth-header__title {
  margin: 0;
  font-family: var(--font-body);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.02;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #f2c94c;
}



.auth-header__subtitle {
  margin: 10px auto 0;
  max-width: 460px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-style: italic;
  line-height: 1.5;
  color: rgba(230, 234, 255, 0.58);
}

.animate-float {
  animation: subtleFloat 3.2s ease-in-out infinite;
}

@keyframes subtleFloat {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0px);
  }
}

@media (max-width: 520px) {
  .auth-header {
    margin-bottom: 22px;
  }


  .auth-header__title {
    font-size: 1.65rem;
  }

  .auth-header__subtitle {
    font-size: 0.76rem;
    padding: 0 8px;
  }
}
</style>
