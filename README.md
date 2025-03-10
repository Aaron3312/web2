# Cuevana by aaron 🎬

Link de la página: [Cuevana by aaron](https://aaron3312.github.io/web2/)

Una aplicación web moderna para explorar películas, series y estrenos, construida con React, Node.js y Vite, utilizando la API de TMDB (The Movie Database).

![CineView Demo](/image.png)

## 🌟 Características

- Exploración de películas y series populares, mejor valoradas y estrenos
- Detalles completos de cada título: sinopsis, reparto, trailers, etc.
- Sistema de valoración y reseñas para usuarios
- Interfaz responsiva y moderna
- Búsqueda avanzada de contenido
- Sección de recomendaciones personalizadas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React.js, Vite
- **Estilizado**: CSS/SCSS (o TailwindCSS/MaterialUI, etc.)
- **API**: TMDB (The Movie Database)
- **Testing**: Cypress para pruebas E2E
- **CI/CD**: GitHub Actions
- **Despliegue**: GitHub Pages

## ⚙️ Instalación y Configuración

### Prerrequisitos

- Node.js v18 o superior
- npm o yarn
- Cuenta y API Key de TMDB

### Pasos para la instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/Aaron3312/web2.git
cd web2
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
VITE_TMDB_API_KEY=tu_api_key_de_tmdb
```

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`.

## 🧪 Pruebas

Este proyecto utiliza Cypress para pruebas end-to-end.

### Ejecutar pruebas

```bash
# Abrir la interfaz de Cypress para pruebas interactivas
npm run cypress:open
# o
yarn cypress:open

# Ejecutar pruebas en modo headless
npm run cypress:run
# o
yarn cypress:run
```

## 🚀 Despliegue

El proyecto está configurado para desplegarse automáticamente en GitHub Pages a través de GitHub Actions.

1. Asegúrate de que el secreto `TMDB_API_KEY` esté configurado en tu repositorio de GitHub (Settings > Secrets > Actions).

2. Cualquier push a las ramas `main` o `master` desencadenará el flujo de trabajo de CI/CD:
   - Ejecutará las pruebas de Cypress
   - Construirá la aplicación
   - Desplegará en GitHub Pages

## 📝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [TMDB](https://www.themoviedb.org/) por su excelente API
- A todos los contribuidores que han ayudado a mejorar este proyecto
