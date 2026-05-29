# RodAppV1 - Guía de Desarrollo y Convenciones

Este documento contiene las reglas y estándares que debemos seguir para mantener la consistencia en el proyecto.

## 📝 Estándar de Documentación (Comentariado)

Todas las implementaciones de CRUD (especialmente en Backend) deben seguir el formato de JavaDoc detallado que se encuentra en `MotoController`, `MantenimientoController` y sus respectivos servicios.

### En Controladores (Controllers)
Cada método del endpoint debe incluir:
1. **ENDPOINT:** Especificar el método HTTP y la ruta (ej: `POST /api/motos`).
2. **Propósito:** Breve explicación funcional (para qué sirve en el frontend).
3. **Viaje del dato:** Explicación técnica de cómo se transforma la información (ej: Jackson mapping, `@RequestBody`, `@PathVariable`).
4. **Parámetros/Retorno:** Uso de `@param` y `@return`.

### En Servicios (Services)
Cada método de lógica de negocio debe incluir:
1. **Descripción:** Qué hace la lógica.
2. **Viaje del dato:** Detalle de la interacción con la base de datos (ej: SELECT, INSERT, actualización vía JPA, lanzamiento de excepciones).
3. **Parámetros/Retorno/Excepciones:** Uso de `@param`, `@return` y `@throws`.

## 🛠️ Estado y Metas del Proyecto
- **Estado Actual:** CRUDs sincronizados, Navegación lateral dinámica implementada, Historial real operativo.
- **Meta Actual:** Refinamiento de UX/UI y robustez del sistema (validaciones, manejo de errores avanzado).

## 🛠️ Tecnologías y Versiones
- Java 17
- Spring Boot 3.x (Puerto: **8081**)
- MySQL
- Frontend: HTML/JS/CSS (Vanilla)
- Seguridad: Spring Security + BCrypt + CORS (Origen: :3000)

## 📍 Estándares de Navegación
- **Menú Global:** Se utiliza el componente **Side Nav** (Menú Lateral Retráctil) inyectado dinámicamente desde `js/main.js`. NO agregar etiquetas `<nav>` manuales en los archivos HTML.
- **Toggle de Navegación:** Todas las páginas deben contar con el botón toggle en el borde izquierdo para permitir el despliegue del menú.
- **Control de Sesión:** El cierre de sesión debe realizarse exclusivamente a través de la función `handleLogout()` definida en `main.js`.
- **Acceso a API:** Siempre utilizar el puerto 8081 para peticiones al backend.
