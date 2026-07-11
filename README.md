# NEVOLUX — API Backend

Plataforma para conectar estudiantes de TI (Desarrollo de Software y Redes Digitales) con
asesores de su misma especialidad. Roles: **administrador, asesor, estudiante**.

## Stack

Node.js + Express + MySQL (mysql2) + JWT + bcryptjs + Swagger (swagger-jsdoc/swagger-ui-express) + Multer

## Arquitectura (Clean Architecture por capas)

```
routes  →  controllers  →  services (logica de negocio)  →  models (queries MySQL)
```

Nunca hay lógica de negocio en `routes/` ni en `controllers/`; solo en `services/`.

## 1. Instalación local / Codespaces

```bash
git clone <URL_DE_TU_REPO>
cd nevolux
npm install
cp .env.example .env      # y llena tus valores reales
```

## 2. Base de datos

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

> Antes de usar el módulo de exámenes, agrega preguntas reales a la tabla `preguntas`
> (mínimo 25 por materia) siguiendo el ejemplo comentado en `database/seed.sql`.

## 3. Ejecutar

```bash
npm run dev     # con nodemon
# o
npm start
```

El servidor crea automáticamente la cuenta de administrador (con los datos de `.env`) la
primera vez que arranca — el admin **nunca** se registra desde un formulario público.

- API: `http://localhost:4000/api`
- Documentación Swagger: `http://localhost:4000/api-docs`

## 4. Estructura de carpetas

```
nevolux/
├── docs/                  <- PDF maestro + diagrama relacional (requisito del profesor)
├── database/
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── config/            <- conexión MySQL y mailer
│   ├── models/             <- solo queries
│   ├── services/            <- lógica de negocio
│   ├── controllers/          <- request/response
│   ├── routes/                <- endpoints + anotaciones swagger
│   ├── middlewares/            <- auth, roles, errores, uploads
│   ├── validators/
│   ├── swagger.js
│   ├── seedAdmin.js
│   └── app.js
├── public/                <- frontend estático
├── uploads/                <- fotos de perfil
└── server.js
```

## 5. Reglas de negocio implementadas

- Registro con correo institucional (`@alumno.utpuebla.edu.mx`) obligatorio.
- Asesor solo puede registrarse desde 4to cuatrimestre en adelante.
- Examen: 25 preguntas, 10 minutos, 80% mínimo para aprobar.
- Si repruebas, la materia queda bloqueada 4 meses antes de reintentar.
- Máximo 2 materias por asesor (una en el registro, otra vía `/asesores/segunda-materia`).
- Notificación por correo del resultado del examen.
- Chat solo habilitado cuando el asesor acepta la solicitud.
- El administrador no se registra: se crea automáticamente al iniciar el servidor.

## 6. Correspondencia con la rúbrica del profesor

| Punto de la rúbrica | Dónde está |
|---|---|
| Carpeta `/docs` con PDF maestro + relacional | `docs/` |
| Manual de API | Swagger en `/api-docs` |
| Arquitectura por capas | `src/routes` → `src/controllers` → `src/services` → `src/models` |
| CRUD completo | Un controller/service/model por entidad |
| Manejo de errores | `AppError` + `manejadorErrores.js` (nunca se expone el error crudo de MySQL) |
| Documentación Swagger | `src/swagger.js` + anotaciones `@swagger` en cada archivo de `routes/` |
