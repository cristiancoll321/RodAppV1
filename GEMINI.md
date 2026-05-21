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

## 🛠️ Tecnologías y Versiones
- Java 17
- Spring Boot 3.x
- MySQL
- Frontend: HTML/JS/CSS (Public HTML)
