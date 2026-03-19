<template>
  <!-- Estructura principal con etiquetas HTML estándar (div) -->
  <div class="admin-container">
    
    <!-- Título y descripción -->
    <div class="header-section">
      <h2 class="text-h4 text-white q-mb-xs">Gestión de Usuarios</h2>
      <p class="text-grey-5">Panel administrativo para visualizar y gestionar cuentas del sistema.</p>
    </div>

    <!-- Barra de acciones y búsqueda -->
    <div class="actions-bar q-mb-lg">
      <div class="row q-col-gutter-md items-center">
        <div class="col-12 col-sm-6">
          <q-input 
            v-model="filtro" 
            placeholder="Buscar por nombre o correo..." 
            outlined 
            dense 
            bg-color="white"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6 text-right">
          <q-btn 
            color="primary" 
            icon="refresh" 
            label="Actualizar Lista" 
            @click="obtenerUsuarios" 
          />
        </div>
      </div>
    </div>

    <!-- Listado de Usuarios (Usando QTable por eficiencia pero dentro de un div) -->
    <div class="table-container shadow-2">
      <q-table
        :rows="usuariosFiltrados"
        :columns="columnas"
        row-key="_id"
        flat
        bordered
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No se encontraron usuarios"
      >
        <!-- Slot para personalizar la columna de Rol -->
        <template v-slot:body-cell-rol="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'administrador' ? 'deep-orange' : 'blue-8'">
              {{ props.value.toUpperCase() }}
            </q-badge>
          </q-td>
        </template>

        <!-- Slot para personalizar la columna de Estado -->
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge :color="props.value === 'activo' ? 'positive' : 'negative'">
              {{ props.value }}
            </q-badge>
          </q-td>
        </template>

        <!-- Slot para Acciones -->
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn 
              flat 
              round 
              color="primary" 
              icon="edit" 
              size="sm" 
              @click="abrirEditor(props.row)" 
            />
            <q-btn 
              flat 
              round 
              color="negative" 
              icon="delete" 
              size="sm" 
              @click="confirmarEliminar(props.row)" 
            />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Modal para Editar Usuario (QDialog) -->
    <q-dialog v-model="modalAbierto" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Editar Usuario</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input 
            v-model="usuarioEditado.nombre" 
            label="Nombre completo" 
            dense 
            autofocus 
            class="q-mb-md" 
          />
          <q-select 
            v-model="usuarioEditado.rol" 
            :options="['usuario', 'administrador']" 
            label="Rol del sistema" 
            dense 
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Guardar Cambios" @click="guardarCambios" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
// Importación obligatoria según tus reglas
import { getData, putData, deleteData } from "@/services/baseService";

// --- CONFIGURACIÓN DE QUASAR ---
const $q = useQuasar();

// --- ESTADO (Data) ---
const usuarios = ref([]);
const filtro = ref("");
const modalAbierto = ref(false);
const usuarioEditado = ref({ _id: '', nombre: '', rol: '' });

// Definición de columnas para la QTable
const columnas = [
  { name: 'nombre', label: 'NOMBRE', field: 'nombre', align: 'left', sortable: true },
  { name: 'email', label: 'CORREO', field: 'email', align: 'left', sortable: true },
  { name: 'rol', label: 'ROL', field: 'rol', align: 'center' },
  { name: 'estado', label: 'ESTADO', field: 'estado', align: 'center' },
  { name: 'acciones', label: 'ACCIONES', align: 'center' }
];

// --- LÓGICA DE NEGOCIO ---

/**
 * Obtiene la lista de usuarios del backend
 */
const obtenerUsuarios = async () => {
  // Mostramos feedback de carga (REGLA OBLIGATORIA)
  $q.loading.show({ message: 'Cargando usuarios...' });

  try {
    const data = await getData("admin/usuarios");
    // Asumimos que el backend devuelve un objeto con la propiedad 'usuarios'
    usuarios.value = data.usuarios || [];
    
    $q.notify({
      type: 'positive',
      message: 'Usuarios cargados correctamente',
      position: 'top-right'
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    $q.notify({
      type: 'negative',
      message: 'No se pudo conectar con el servidor',
      position: 'top-right'
    });
  } finally {
    // Siempre ocultamos el loading al terminar
    $q.loading.hide();
  }
};

/**
 * Filtra los usuarios según el input de búsqueda
 */
const usuariosFiltrados = computed(() => {
  if (!filtro.value) return usuarios.value;
  const busqueda = filtro.value.toLowerCase();
  return usuarios.value.filter(u => 
    u.nombre.toLowerCase().includes(busqueda) || 
    u.email.toLowerCase().includes(busqueda)
  );
});

/**
 * Prepara el modal para editar un usuario
 */
const abrirEditor = (usuario) => {
  usuarioEditado.value = { ...usuario };
  modalAbierto.value = true;
};

/**
 * Envía los cambios al servidor
 */
const guardarCambios = async () => {
  $q.loading.show({ message: 'Guardando cambios...' });

  try {
    const endpoint = `admin/usuario/${usuarioEditado.value._id}/rol`;
    await putData(endpoint, { rol: usuarioEditado.value.rol });

    // Actualizamos localmente para que el usuario vea el cambio de inmediato
    const index = usuarios.value.findIndex(u => u._id === usuarioEditado.value._id);
    if (index !== -1) usuarios.value[index] = { ...usuarioEditado.value };

    modalAbierto.value = false;
    $q.notify({ type: 'positive', message: 'Usuario actualizado con éxito' });
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al actualizar el usuario' });
  } finally {
    $q.loading.hide();
  }
};

/**
 * Elimina un usuario tras confirmación
 */
const confirmarEliminar = (usuario) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro de que deseas eliminar a ${usuario.nombre}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    $q.loading.show({ message: 'Eliminando...' });
    try {
      await deleteData(`admin/usuario/${usuario._id}`);
      usuarios.value = usuarios.value.filter(u => u._id !== usuario._id);
      $q.notify({ type: 'positive', message: 'Usuario eliminado' });
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al eliminar' });
    } finally {
      $q.loading.hide();
    }
  });
};

// Al montar el componente, cargamos los datos
onMounted(obtenerUsuarios);

</script>

<style>
/* Estilos globales (SIN scoped) según tus reglas */
.admin-container {
  padding: 40px;
  background-color: #1a1a2e; /* Fondo oscuro profesional */
  min-height: 100vh;
}

.header-section {
  margin-bottom: 30px;
}

.actions-bar {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

/* Personalización de la tabla para que se vea más profesional */
.q-table__container {
  background-color: #ffffff;
}

.q-table thead tr th {
  font-weight: bold;
  background-color: #f5f5f5;
  color: #333;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .admin-container {
    padding: 15px;
  }
}
</style>
