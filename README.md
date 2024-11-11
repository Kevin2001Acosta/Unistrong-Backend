# **UniStrong - Gestión de Gimnasio**

**UniStrong** es un sistema de gestión para gimnasios que permite administrar coaches, nutriologos, clientes, sus rutinas y dietas. El proyecto está desarrollado utilizando **Node.js**, **TypeScript**, **Express**, y **Sequelize** para manejar la lógica del backend y PostgreSQL como base de datos. UniStrong facilita la administración de clientes y la asignación de coaches a cada cliente, brindando un control completo de los usuarios del gimnasio.

## **Tabla de Contenidos**

1. [Tecnologías utilizadas](#tecnologías-utilizadas)
2. [Instalación y configuración](#instalación-y-configuración)


## **Tecnologías utilizadas**

- **Node.js**: Entorno de ejecución para el backend.
- **Express**: Framework para la creación de APIs RESTful.
- **TypeScript**: Lenguaje de programación con tipado estático, usado para mejorar el desarrollo y mantenimiento.
- **Sequelize**: ORM que facilita las interacciones con bases de datos SQL.
- **PostgreSQL**: Base de datos relacional donde se almacenan los datos de coaches, clientes, y otros elementos del sistema.
- **dotenv**: Para el manejo de variables de entorno.

## **Instalación y configuración**

### 1. **Clonar el repositorio**
### 2. **Instalar dependencias**
npm install

### 2.1. **Configurar variables de entorno**
PORT=puerto
DB_USER=usuario
DB_PASSWORD=contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unistrong
EMAIL_USER=correo dedicado
EMAIL_PASS=contraseña dedicada 


### 2.3. **Inicializar el servidor y la base de datos**
npm run dev
