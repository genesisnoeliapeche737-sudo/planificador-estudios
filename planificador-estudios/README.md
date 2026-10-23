# Mi Ruta Académica 🎓

**Trabajo práctico de Desarrollo de Aplicaciones**: planificador de estudios para organizar carreras, cursos, fechas de inscripción y tareas.

## Problema que resuelve

Al terminar la secundaria, muchas personas necesitan investigar carreras y cursos, recordar fechas de inscripción y preparar documentación. Tener la información en distintos lugares puede hacer que se olviden pasos importantes. Esta aplicación permite organizar esos datos en una sola página.

## Funciones

- Agregar, editar y eliminar carreras, cursos y talleres.
- Registrar institución, modalidad, fecha de inscripción y estado.
- Crear tareas relacionadas con un estudio, con fecha y prioridad.
- Marcar tareas como completadas y ver porcentaje de progreso.
- Buscar tareas y filtrar por estado o prioridad.
- Guardar automáticamente los datos en el mismo navegador mediante **localStorage**.
- Diseño adaptable a celular y computadora.

## Tecnologías

- **HTML**: estructura de la página y formularios.
- **CSS**: colores, tarjetas, diseño adaptable y estilos.
- **JavaScript**: agregar, modificar, borrar, buscar, filtrar y guardar información.
- **Git y GitHub**: control de versiones y repositorio del código.
- **Vercel**: publicación de la página.

## Cómo abrirlo

1. Abrí esta carpeta en **Visual Studio Code**.
2. Abrí `index.html` en un navegador o ejecutalo con la extensión **Live Server**.
3. Tocá **Agregar estudio** o **Nueva tarea** para probar la aplicación.
4. Cerrá y volvé a abrir la página: tus datos deben seguir apareciendo.

No necesita instalar paquetes ni configurar un servidor.

## Cómo subirlo a GitHub

Abrí la terminal de VS Code dentro de esta carpeta e ingresá, en orden:

```bash
git init
git add .
git commit -m "Primera version del planificador de estudios"
```

Después creá un repositorio nuevo y vacío en GitHub (sin README inicial) y copiá la URL HTTPS de tu repositorio. Reemplazá `TU_USUARIO` por tu nombre de usuario:

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/planificador-estudios.git
git push -u origin main
```

**Importante:** `git push` necesita que Git esté autenticado con tu cuenta de GitHub.

## Cómo publicarlo en Vercel

1. Iniciá sesión en Vercel con GitHub.
2. Elegí **Add New > Project** e importá el repositorio.
3. Como es un sitio estático de HTML/CSS/JS, no hace falta instalar dependencias ni ejecutar una compilación. Dejá sin comando de build si Vercel lo permite.
4. Desplegá el proyecto y abrí el enlace que Vercel proporciona.

> **Límite importante:** los datos se guardan solo en el navegador donde se agregan. Si abrís la web desde otro dispositivo o borrás los datos del navegador, no aparecerán los registros anteriores. No es una app con cuentas ni base de datos.

## Ideas para futuras mejoras

- Agregar recordatorios de fechas.
- Crear un calendario mensual.
- Exportar tareas a un archivo.
- Usar una base de datos para sincronizar entre dispositivos.
