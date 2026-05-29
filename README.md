# RodAppV1 - Sistema de Gestión para Motociclistas

RodApp es una solución integral para el seguimiento y mantenimiento de motocicletas, permitiendo a los usuarios gestionar tanqueadas, documentos legales, mantenimientos y perfiles de vehículos.

## 🚀 Tecnologías y Versiones
- **Backend:** Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security, MySQL.
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Estructura de Páginas Estáticas.
- **Gestión de Dependencias:** Maven (Backend).

## 🗄️ Arquitectura del Backend
La estructura sigue un patrón multicapa:
- `controller/`: Endpoints REST que gestionan las peticiones HTTP.
- `service/`: Lógica de negocio y validaciones.
- `repository/`: Interfaces JPA para persistencia en MySQL.
- `model/`: Entidades del dominio y Enums.
- `dto/`: Objetos de transferencia para registro, login y respuestas seguras.
- `config/`: Seguridad (BCrypt), excepciones globales y configuración de CORS.

### Endpoints Principales (API REST)
- **Usuarios (`/api/usuarios`):**
  - `POST /registrar`: Creación de nuevos usuarios con contraseñas encriptadas.
  - `POST /login`: Autenticación de usuarios.
  - `GET /{id}`: Obtención de perfil de usuario.
- **Motos (`/api/motos`):**
  - `POST /`: Registrar nueva motocicleta.
  - `GET /`: Listar todas las motos.
  - `GET /usuario/{usuarioId}`: Listar motos de un usuario específico.
  - `PUT /{id}`: Actualizar datos del vehículo.
  - `DELETE /{id}`: Eliminar registro.
- **Tanqueadas (`/api/tanqueadas`):**
  - `POST /`: Registrar carga de combustible.
  - `GET /moto/{motoId}`: Historial de consumo por moto.
- **Mantenimientos (`/api/mantenimientos`):**
  - `POST /`: Registrar servicio técnico.
  - `GET /moto/{motoId}`: Historial de servicios.
- **Documentos (`/api/documentos`):**
  - `GET /moto/{motoId}`: Consulta de SOAT, Tecnomecánica y otros documentos.

## 🎨 Interfaz Frontend (Public HTML)
El frontend está organizado en módulos funcionales:
- **Gestión Vehicular:** `garage.html`, `moto-register.html`, `moto-detail.html`.
- **Operaciones Diarias:** `fuel-register.html`, `maintenance.html`.
- **Información y Utilidades:** `history.html`, `map.html`, `tips.html`, `notifications.html`.
- **Autenticación:** `index.html` (Landing), `register.html`, `profile.html`.

## 🛠️ Instalación y Configuración

### 1. Requisitos
- JDK 17 o superior.
- MySQL Server 8.x.
- Maven.

### 2. Base de Datos
1. Crear base de datos: `CREATE DATABASE rodapp_db;`
2. Configurar `rodapp-backend/src/main/resources/application.properties` con tus credenciales:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rodapp_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

### 3. Ejecución
```bash
cd rodapp-backend
./mvnw spring-boot:run
```
Luego, abre `rodapp-frontend/public_html/index.html` en tu navegador.

---
*Documentación actualizada al estado actual del proyecto (Rama Main).*
