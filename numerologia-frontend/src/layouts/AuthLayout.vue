<template>
  <div class="auth-layout">
    <!-- Partículas estelares -->
    <div class="stars-container">
      <div v-for="star in stars" :key="star.id" class="star" :style="star.style"></div>
    </div>

    <!-- Nubes cósmicas -->
    <div class="cosmic-cloud cosmic-cloud--top"></div>
    <div class="cosmic-cloud cosmic-cloud--bottom"></div>

    <!-- Contenido central -->
    <div class="auth-layout__content">
      <router-view />
    </div>

    <!-- Frase mística al pie -->
    <footer class="auth-layout__footer">
      <p class="mystic-quote">
        "Los números son el lenguaje universal que el cosmos utiliza para
        revelarnos el camino de nuestra alma."
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Precalcular estrellas una sola vez
const stars = ref(
  Array.from({ length: 30 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 2}s`,
    }
  }))
);
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 0%, #1a0a2e 0%, #0a0a1a 60%),
    radial-gradient(ellipse at 80% 80%, rgba(232, 132, 42, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 20% 90%, rgba(124, 58, 237, 0.1) 0%, transparent 50%);
  background-color: var(--cosmic-bg);
  padding: 40px 20px;
}

/* ── Estrellas ── */
.stars-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
  background: var(--violet-soft);
  border-radius: 50%;
  animation: twinkle ease-in-out infinite;
  box-shadow: 0 0 6px rgba(192, 132, 252, 0.6);
}

/* ── Nubes cósmicas ── */
.cosmic-cloud {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}

.cosmic-cloud--top {
  top: -200px;
  right: -150px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
}

.cosmic-cloud--bottom {
  bottom: -250px;
  left: -100px;
  background: radial-gradient(circle, rgba(232, 132, 42, 0.1) 0%, transparent 70%);
}

/* ── Contenido ── */
.auth-layout__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  animation: fadeInUp 0.8s ease-out;
}

/* ── Footer ── */
.auth-layout__footer {
  position: relative;
  z-index: 1;
  margin-top: 40px;
  text-align: center;
  max-width: 500px;
}

.mystic-quote {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
  letter-spacing: 0.02em;
}

/* ── Responsive ── */
@media (max-width: 520px) {
  .auth-layout {
    padding: 24px 16px;
  }

  .auth-layout__content {
    max-width: 100%;
  }
}
</style>
