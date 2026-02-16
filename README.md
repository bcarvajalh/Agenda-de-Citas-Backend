# 🚀 Backend - Agenda de citas

Este es el servidor de la aplicación, construido con **Node.js**, **Express** y **Prisma ORM**. Maneja la autenticación de usuarios, gestión de roles (User/Admin) y operaciones CRUD para proyectos.

## 🛠️ Tecnologías utilizadas

* **Node.js**: Entorno de ejecución para JavaScript.
* **Express**: Framework para la creación de la API REST.
* **Prisma ORM**: Interacción técnica con la base de datos PostgreSQL.
* **TypeScript**: Tipado estático para mayor seguridad en el código.
* **JWT (JSON Web Tokens)**: Manejo de sesiones y seguridad.
* **Bcrypt**: Encriptación de contraseñas.

## 📋 Requisitos Previos

Antes de configurar el proyecto, asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (v18 o superior)
* [Git](https://git-scm.com/)
* Una instancia de base de datos PostgreSQL (local o en la nube)

## ⚙️ Instalación y Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/TU_USUARIO/TU_REPOSITORIO.git](https://github.com/TU_USUARIO/TU_REPOSITORIO.git)
    cd TU_REPOSITORIO
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade lo siguiente:
    ```env
    DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db"
    JWT_SECRET="tu_clave"
    PORT=3000
    ```

4.  **Genera el cliente de Prisma y ejecuta las migraciones:**
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

5.  **Inicia el servidor en modo desarrollo:**
    ```bash
    npm run dev
    ```

## 🔐 Endpoints Principales

### Autenticación
* `POST /api/auth/register` - Registro de nuevos usuarios.
* `POST /api/auth/login` - Inicio de sesión y entrega de Token.

---
Desarrollado por Brayan Stiven Carvajal Hernandez - 2026