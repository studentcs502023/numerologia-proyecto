import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    // ═══ Estado ═══
    const token = ref("");
    const usuario = ref(null); // { id, nombre, email, rol, estado }

    // ═══ Getters ═══
    const isAuthenticated = computed(() => !!token.value);
    const nombreUsuario = computed(() => usuario.value?.nombre || "");
    const rolUsuario = computed(() => usuario.value?.rol || "");

    // ═══ Acciones ═══
    function setAuth(data) {
      token.value = data.token;
      usuario.value = data.usuario;
    }

    function logout() {
      token.value = "";
      usuario.value = null;
    }

    return {
      token,
      usuario,
      isAuthenticated,
      nombreUsuario,
      rolUsuario,
      setAuth,
      logout,
    };
  },

  { persist: true },
);
