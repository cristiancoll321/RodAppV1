# RodAppV1

# RodApp - Backend con Spring Boot

API REST para la aplicación RodApp de gestión de motos, tanqueadas y documentos.

## 🚀 Tecnologías

- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Security (próximamente)
- MySQL
- Maven

## 📦 Estructura del proyecto

src/main/java/com/rodapp/backend/
├── controller/ # Endpoints REST
├── service/ # Lógica de negocio
├── repository/ # Acceso a datos (JPA)
├── model/ # Entidades JPA
├── dto/ # Objetos de transferencia
└── config/ # Configuraciones (CORS, Security)


## 🗄️ Configuración de base de datos

Editar `application.properties`:
properties
spring.datasource.url=jdbc:mysql://localhost:3306/rodapp_db
spring.datasource.username=root
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update

# Clonar el repo
git clone [URL_DEL_REPO]

# Entrar al directorio
cd rodapp-backend

# Ejecutar con Maven
./mvnw spring-boot:run



---

## 📋 Checklist para que organices el trabajo

### Tuyo (Terminar Usuario)
java
// UsuarioController.java - métodos necesarios:
✅ POST /api/usuarios/registrar
✅ POST /api/usuarios/login  
✅ GET /api/usuarios/{id}
✅ PUT /api/usuarios/{id}
✅ DELETE /api/usuarios/{id}

// MotoController.java - métodos necesarios:
✅ POST /api/motos
✅ GET /api/motos
✅ GET /api/motos/{id}
✅ GET /api/motos/usuario/{usuarioId}  // motos de un usuario
✅ PUT /api/motos/{id}
✅ DELETE /api/motos/{id}

Tips para trabajar en equipo con Git
# Cada uno trabaja en su rama
git checkout -b feature/usuario    # tú
git checkout -b feature/moto       # tu compañero

# Al terminar, hacen merge a main
git checkout main
git merge feature/usuario
git push origin main
