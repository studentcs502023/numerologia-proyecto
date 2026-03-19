import { ref, computed } from "vue";

/**
 * Composable para manejo de errores de formularios.
 * Validación UX mínima (requerido, formato email).
 * El backend valida lógica de negocio.
 */
export function useAuthForm() {
  const errors = ref({});

  // Validación UX mínima: email requerido y formato
  function validateRequiredEmail(email) {
    if (!email?.trim()) return "El email es obligatorio";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return "Email inválido";
    return "";
  }

  // Validación UX: campo requerido genérico
  function validateRequired(value, fieldName = "Campo") {
    return !value?.trim() ? `${fieldName} es obligatorio` : "";
  }

  // Agrupar errores
  function setErrors(newErrors) {
    errors.value = newErrors;
  }

  function clearError(field) {
    const { [field]: _, ...rest } = errors.value;
    errors.value = rest;
  }

  function clearAllErrors() {
    errors.value = {};
  }

  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  return {
    errors,
    hasErrors,
    validateRequiredEmail,
    validateRequired,
    setErrors,
    clearError,
    clearAllErrors,
  };
}
