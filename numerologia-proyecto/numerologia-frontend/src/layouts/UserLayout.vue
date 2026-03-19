<template>
  <div class="app-layout">
    <!-- Header -->
    <header class="app-header">
      <div class="app-header__left">
        <router-link :to="isActive ? '/usuario/premium' : '/usuario'" class="app-header__logo">
          <img src="@/assets/icono/logo.svg" alt="Logo" class="app-header__logo-img" />
          <span class="app-header__logo-text">NUMEROLOGÍA</span>
        </router-link>
      </div>

      <div class="app-header__right">
        <!-- Badge de plan -->
        <div class="plan-indicator" :class="{ 'plan-indicator--premium': isActive }">
          <q-icon :name="isActive ? 'workspace_premium' : 'radio_button_unchecked'" size="16px" />
          <span>{{ isActive ? 'Premium' : 'Gratuito' }}</span>
        </div>

        <!-- Menú usuario -->
        <div class="user-menu-trigger" @click="showMenu = !showMenu">
          <span class="user-name">{{ authStore.nombreUsuario }}</span>
          <div class="user-avatar">
            {{ initials }}
          </div>
          <q-icon name="expand_more" size="18px" class="dropdown-icon" :class="{ 'dropdown-icon--open': showMenu }" />
        </div>

        <!-- Dropdown menú -->
        <transition name="dropdown">
          <div v-if="showMenu" class="dropdown-menu">
            <div class="dropdown-menu__header">
              <div class="dropdown-menu__user">
                <div class="dropdown-menu__avatar">{{ initials }}</div>
                <div class="dropdown-menu__info">
                  <span class="dropdown-menu__name">{{ authStore.nombreUsuario }}</span>
                  <span class="dropdown-menu__plan">{{ isActive ? 'Premium' : 'Plan gratuito' }}</span>
                </div>
              </div>
            </div>
            
            <div class="dropdown-menu__divider"></div>

            <button v-if="!isActive" class="dropdown-menu__item" @click="goTo('/usuario')">
              <q-icon name="dashboard" size="18px" />
              <span>Dashboard</span>
            </button>
            
            <button v-if="!isActive" class="dropdown-menu__item dropdown-menu__item--highlight" @click="goTo('/usuario/membresia')">
              <q-icon name="star" size="18px" />
              <span>Actualizar a Premium</span>
              <q-icon name="north_east" size="14px" class="item-arrow" />
            </button>
            
            <button v-if="isActive" class="dropdown-menu__item" @click="goTo('/usuario/premium')">
              <q-icon name="workspace_premium" size="18px" />
              <span>Panel Premium</span>
            </button>
            
            <button class="dropdown-menu__item" @click="goTo('/usuario/perfil')">
              <q-icon name="settings" size="18px" />
              <span>Configuración</span>
            </button>
            
            <div class="dropdown-menu__divider"></div>
            
            <button class="dropdown-menu__item dropdown-menu__item--logout" @click="handleLogout">
              <q-icon name="logout" size="18px" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </transition>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer simplificado -->
    <footer class="app-footer">
      <div class="app-footer__left">
        <span>© {{ currentYear }} Numerología</span>
      </div>
      <div class="app-footer__right">
        <router-link to="/terminos" class="footer-link">Términos</router-link>
        <span class="footer-separator">•</span>
        <router-link to="/privacidad" class="footer-link">Privacidad</router-link>
        <span class="footer-separator">•</span>
        <router-link to="/ayuda" class="footer-link">Ayuda</router-link>
      </div>
    </footer>

    <!-- Overlay -->
    <div v-if="showMenu" class="menu-overlay" @click="showMenu = false"></div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.js";

const router = useRouter();
const authStore = useAuthStore();
const showMenu = ref(false);

const isActive = computed(() => authStore.usuario?.estado === "activo");

const initials = computed(() => {
  const name = authStore.nombreUsuario;
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
});

function goTo(path) {
  showMenu.value = false;
  router.push(path);
}

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>

<style>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a14;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 40px;
  background: rgba(10, 10, 20, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #2a2a3a;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header__left {
  display: flex;
  align-items: center;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.app-header__logo-img {
  width: 24px;
  height: 24px;
  filter: brightness(0.8) sepia(1) hue-rotate(220deg);
}

.app-header__logo-text {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: #7c3aed;
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

/* Plan indicator */
.plan-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6a6a88;
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  padding: 4px 12px;
  border-radius: 20px;
}

.plan-indicator--premium {
  color: #e8842a;
  background: rgba(232, 132, 42, 0.1);
  border-color: rgba(232, 132, 42, 0.3);
}

/* User menu trigger */
.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 30px;
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  transition: all 0.2s;
}

.user-menu-trigger:hover {
  background: #2a2a3a;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #ffffff;
  margin-left: 4px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #9d6cff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.dropdown-icon {
  color: #6a6a88;
  transition: transform 0.2s;
}

.dropdown-icon--open {
  transform: rotate(180deg);
}

/* Dropdown menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: #121220;
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  min-width: 240px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 200;
}

.dropdown-menu__header {
  padding: 16px;
}

.dropdown-menu__user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropdown-menu__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #9d6cff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.dropdown-menu__info {
  flex: 1;
}

.dropdown-menu__name {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.dropdown-menu__plan {
  font-size: 0.7rem;
  color: #6a6a88;
}

.dropdown-menu__divider {
  height: 1px;
  background: #2a2a3a;
  margin: 4px 0;
}

.dropdown-menu__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: #a0a0c0;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-menu__item:hover {
  background: #1a1a2a;
  color: #ffffff;
}

.dropdown-menu__item--highlight {
  color: #e8842a;
}

.dropdown-menu__item--highlight:hover {
  background: rgba(232, 132, 42, 0.1);
}

.dropdown-menu__item--logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.item-arrow {
  margin-left: auto;
  color: #6a6a88;
}

.dropdown-menu__item:hover .item-arrow {
  color: #e8842a;
}

/* Main content */
.main-content {
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}

/* Footer */
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  border-top: 1px solid #2a2a3a;
  font-size: 0.75rem;
  color: #6a6a88;
  background: #0a0a14;
}

.app-footer__left {
  color: #6a6a88;
}

.app-footer__right {
  display: flex;
  gap: 12px;
}

.footer-link {
  color: #6a6a88;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #e8842a;
}

.footer-separator {
  color: #2a2a3a;
}

/* Overlay */
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive */
@media (max-width: 768px) {
  .app-header {
    padding: 10px 16px;
  }

  .app-header__logo-text {
    display: none;
  }

  .user-name {
    display: none;
  }

  .main-content {
    padding: 20px 16px;
  }

  .app-footer {
    flex-direction: column;
    gap: 8px;
    text-align: center;
    padding: 16px;
  }

  .dropdown-menu {
    min-width: 200px;
  }
}
</style>
