# 🚀 Guía de Despliegue - RodApp

## 📋 Requisitos Previos

- **Java 11+** (para el backend)
- **Maven 3.6+** (incluido en el proyecto)
- **Node.js** (opcional, solo si deseas usar un servidor HTTP avanzado)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

---

## 1️⃣ DESPLEGAR EL BACKEND (Spring Boot)

### Opción A: Ejecutar directamente con Maven

```bash
cd rodapp-backend

# En Windows
mvnw.cmd clean package spring-boot:run

# En Linux/Mac
./mvnw clean package spring-boot:run
```

El backend estará disponible en: **http://localhost:8080**

### Opción B: Ejecutar el JAR generado

```bash
cd rodapp-backend
mvnw.cmd clean package

# Ejecutar el JAR
java -jar target/rodapp-backend-0.0.1-SNAPSHOT.jar
```

---

## 2️⃣ DESPLEGAR EL FRONTEND (HTML/CSS/JS estático)

### Opción A: Usar Python (más simple)

```bash
cd rodapp-frontend/public_html

# Python 3
python -m http.server 3000

# Python 2 (si no tienes Python 3)
python -m SimpleHTTPServer 3000
```

El frontend estará en: **http://localhost:3000**

### Opción B: Usar Node.js (http-server)

```bash
cd rodapp-frontend/public_html

# Instalar si no lo tienes
npm install -g http-server

# Ejecutar
http-server -p 3000 -c-1
```

### Opción C: Usar Live Server en VS Code

1. Abre la carpeta `rodapp-frontend/public_html` en VS Code
2. Instala la extensión **"Live Server"** (Five Server)
3. Click derecho en `index.html` → "Open with Live Server"
4. Se abrirá automáticamente en `http://localhost:5500`

---

## 3️⃣ CONFIGURAR CORS (Si es necesario)

Si el frontend y backend están en puertos diferentes (ej: localhost:3000 y localhost:8080), puede haber problemas de CORS.

**Solución**: Verifica que tu `SecurityConfig.java` tenga CORS configurado:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors() // ← Habilita CORS
            .and()
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/usuarios/login", "/api/usuarios/registrar").permitAll()
                .anyRequest().authenticated();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5500"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

---

## 4️⃣ FLUJO DE FUNCIONAMIENTO

```
Usuario llena formulario en index.html
           ↓
JavaScript (auth.js) envía POST a:
  - http://localhost:8080/api/usuarios/login  (LOGIN)
  - http://localhost:8080/api/usuarios/registrar  (REGISTRO)
           ↓
Backend valida, encripta contraseña, guarda en BD
           ↓
Backend devuelve UsuarioResponseDTO con datos
           ↓
Frontend guarda usuario en localStorage
           ↓
Frontend redirige a pages/home.html
```

---

## 5️⃣ VERIFICAR QUE TODO FUNCIONA

### ✅ Backend activo
```bash
curl http://localhost:8080/api/usuarios/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test1234"}'
```

### ✅ Frontend cargando
- Abre en navegador: `http://localhost:3000`
- Verifica que cargue el login sin errores en la consola (F12)

### ✅ Prueba de login
1. Crea una cuenta en http://localhost:3000/pages/register.html
2. Intenta iniciar sesión con esas credenciales
3. Deberías redirigirse a home.html

---

## 6️⃣ DESPLIEGUE EN PRODUCCIÓN

### Backend (Heroku, AWS, etc.)
```bash
# Generar JAR
mvnw clean package

# Cambiar puerto (si es necesario en producción)
java -jar target/rodapp-backend-*.jar --server.port=8080
```

### Frontend (GitHub Pages, Netlify, Vercel, etc.)
Sube la carpeta `rodapp-frontend/public_html` a tu hosting.

**Importante**: Cambia `API_BASE` en `auth.js`:
```javascript
// De esto:
const API_BASE = 'http://localhost:8080/api';

// A esto (tu servidor en producción):
const API_BASE = 'https://tu-api.com/api';
```

---

## 7️⃣ ESTRUCTURA DE CARPETAS

```
RodApp/
├── rodapp-backend/          ← Servidor Spring Boot (Puerto 8080)
│   ├── src/main/java/...    ← Código Java
│   ├── pom.xml              ← Dependencias Maven
│   └── target/              ← JAR compilado
│
└── rodapp-frontend/         ← Aplicación web (Puerto 3000)
    └── public_html/
        ├── index.html       ← Login
        ├── pages/
        │   ├── home.html
        │   ├── register.html
        │   └── ...
        ├── js/
        │   ├── auth.js      ← Consume APIs ✅ (nuevo)
        │   └── main.js
        └── css/
            └── styles.css
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

| Problema | Solución |
|----------|----------|
| **Error: API no responde** | Verifica que el backend esté corriendo en puerto 8080 |
| **CORS error en consola** | Habilita CORS en SecurityConfig.java |
| **Contraseña incorrecta** | Verifica PasswordEncoder en PasswordConfig.java |
| **404 en frontend** | Asegúrate de servir desde la carpeta `public_html` |
| **Puerto 8080 en uso** | `lsof -ti:8080 \| xargs kill -9` o cambia el puerto |

---

## 🎯 RESUMEN RÁPIDO

```bash
# Terminal 1: Backend
cd rodapp-backend
mvnw.cmd clean package spring-boot:run

# Terminal 2: Frontend
cd rodapp-frontend/public_html
python -m http.server 3000

# Luego abre en navegador:
# http://localhost:3000
```

¡Listo! 🚀

