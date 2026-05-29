# Memoria del Proyecto - RodAppV1

## 📌 Estado del Proyecto (Actualizado al 27 de mayo de 2026)
- **Backend:** 
    - CRUDs Completos: Usuario, Motocicleta, Mantenimiento, Tanqueada, DocumentoLegal.
    - Seguridad: Spring Security + BCrypt + CORS (Puerto 3000).
    - Endpoints Globales: Implementados filtros por usuario para Tanqueadas y Mantenimientos para soportar la vista de historial unificado.
- **Frontend:** 
    - Navegación Dinámica: Implementado un **Side Nav (Menú Lateral Retráctil)** inyectado desde `main.js`. El antiguo `bottom-nav` ha sido eliminado de todos los archivos HTML.
    - Cierre de Sesión: Centralizado en `main.js` vía `handleLogout()`, accesible desde cualquier pantalla.
    - Registros Inteligentes: La página de combustible ahora gestiona automáticamente la selección de moto o muestra un selector si el usuario tiene varias.
    - Historial Real: La vista de historial es 100% dinámica, combinando gastos de combustible y mantenimientos reales.
    - Funcionalidades Bloqueadas: La opción "Mapa" ha sido deshabilitada en todo el sistema hasta que el módulo sea desarrollado.

## 🛠️ Ajustes Realizados en esta Sesión (27 Mayo 2026)
1. **Navegación:** Rediseño total de la navegación. De menú inferior fijo a menú lateral retráctil para maximizar el área de trabajo en formularios.
2. **Centralización:** Movida la lógica de sesión y navegación activa a `main.js` para reducir redundancia en los archivos HTML.
3. **Robustez Backend:** Creación de métodos en Repositorios, Servicios y Controladores para consultar historial por `usuarioId` (antes solo existía por `motoId`).
4. **UX de Registros:** Se corrigió el error de "Moto no válida" al acceder a registros directamente desde el menú, agregando auto-detección de vehículos.
5. **Limpieza de Datos:** Eliminación definitiva de todos los datos de prueba (Mocks) en la vista de Historial.

## 🚀 Próximos Pasos Sugeridos
1. Implementar la edición real de documentos legales (la carga ya es dinámica).
2. Refinar la lógica de alertas de vencimiento en el Home basándose en fechas reales.
3. Consolidar la vista de "Registros" para permitir elegir entre tanqueo o mantenimiento desde un solo lugar.
