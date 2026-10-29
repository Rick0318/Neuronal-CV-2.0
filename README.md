# Neural CV 2.0 — CV Interactivo con Red Neuronal en Espiral

Una página web personal para currículum vitae con estética futurista, red neuronal animada en 3D y sistema de acceso por roles: propietario y empresa visitante.

## ✨ Características

- 🧠 **Red neuronal en espiral 3D** con Three.js — nodos, conexiones y pulsos animados
- 👤 **Sistema de dos vistas** — vista de propietario (edición completa) y vista de empresa (solo lectura)
- 🔑 **Acceso con PIN** — el propietario protege su portafolio con un PIN personal
- 🏢 **Registro de empresas visitantes** — las empresas deben identificarse antes de ver el CV
- 🔔 **Notificaciones de visitas** — el propietario ve qué empresas consultaron su portafolio, con fecha y hora
- ✏️ **Edición directa** desde la página — sin tocar código
- 💾 **Guardado automático** en localStorage — los datos persisten al recargar
- 📄 **Exportar a PDF** — versión profesional y limpia del CV
- 🔒 **Backup / Importar** — copia de seguridad en JSON
- 🎨 **3 paletas de color** — azul, violeta, cian
- 📱 **Responsive** — funciona en móvil, tablet y escritorio
- ♿ **Accesible** — navegación por teclado, opción de reducir movimiento

---

## 🔐 Sistema de acceso por roles

Al abrir la aplicación aparece una **pantalla de inicio** con dos opciones:

### Propietario del portafolio
1. Pulsa **"Soy el propietario"**.
2. La primera vez se te pedirá crear un **PIN** de al menos 4 caracteres.
3. Las veces siguientes simplemente ingresas tu PIN para acceder.
4. Una vez dentro tienes acceso completo: editar, cambiar colores, exportar PDF, backup, etc.
5. En la barra superior aparece la **campana 🔔** — el ícono muestra un badge rojo con el número de visitas de empresas no leídas. Al hacer clic se abre el historial con nombre de empresa, contacto y fecha/hora.
6. El botón **"Salir"** vuelve a la pantalla de inicio.

### Empresa visitante
1. Pulsa **"Soy una empresa"**.
2. Se abre un modal donde debes ingresar el **nombre de la empresa** (obligatorio) y tu nombre de contacto (opcional).
3. La visita queda registrada automáticamente con marca de tiempo.
4. El CV se muestra en **modo solo lectura** — sin barra de herramientas ni controles de edición.
5. Una banda azul en la parte superior indica con qué empresa se está viendo el portafolio, con un botón para volver al inicio.

> **Nota:** El registro de visitas se almacena en `localStorage`, por lo que las notificaciones son visibles cuando propietario y empresa acceden desde el mismo dispositivo/navegador. Ideal para compartir el archivo directamente.

---

## 📂 Secciones del CV

- Perfil principal (foto, nombre, contacto, redes)
- Sobre mí
- Experiencia laboral
- Educación
- Habilidades técnicas y personales
- Proyectos (con imagen, links, tecnologías)
- Certificaciones y cursos
- Idiomas
- Información adicional (voluntariado, premios, publicaciones...)

---

## 🚀 Inicio rápido

### Requisitos
- Node.js 18+
- npm 9+

### Instalar dependencias
```bash
npm install
```

### Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre http://localhost:5173 en tu navegador.

### Construir para producción
```bash
npm run build
```

### Vista previa del build
```bash
npm run preview
```

---

## 🖊️ Cómo usar (propietario)

1. Abre la página — aparece la **pantalla de inicio**.
2. Pulsa **"Soy el propietario"** y crea o ingresa tu PIN.
3. Una vez dentro, pulsa **"Editar CV"** en la barra superior o en el hero.
4. Completa los campos haciendo clic en ellos.
5. Los cambios se guardan automáticamente.
6. Para exportar el PDF pulsa el botón **"PDF"** en la barra.
7. Para hacer un backup pulsa **"Backup"** → descarga un JSON.
8. Para restaurar un backup pulsa **"Importar"**.
9. Consulta las visitas de empresas haciendo clic en la **campana 🔔**.
10. Para salir al inicio pulsa **"Salir"** (ícono de puerta) en la barra.

---

## 🎨 Personalización

- Cambia el color de acento con los tres puntos de color en la barra.
- Oculta/muestra cualquier sección con el ícono del ojo (en modo edición).
- Renombra los títulos de sección haciendo clic en el ícono de edición junto a ellos.
- Pausa/reanuda la animación con el botón de pausa.

---

## 🛠️ Tecnologías

- **React 18** + **TypeScript**
- **Three.js** — red neuronal 3D
- **jsPDF** — exportación a PDF
- **Lucide React** — iconos
- **Vite** — bundler

---

## 📁 Estructura del proyecto

```
src/
├── types/cv.ts              # Modelo de datos del CV
├── hooks/useCV.ts           # Estado y persistencia del CV
├── utils/
│   ├── storage.ts           # localStorage, backup/import, visitas, PIN
│   └── pdfExport.ts         # Generación de PDF
├── components/
│   ├── neural/
│   │   └── NeuralSpiral.tsx       # Animación 3D
│   ├── ui/
│   │   ├── LandingScreen.tsx      # Pantalla de inicio con selector de rol
│   │   ├── CompanyModal.tsx       # Modal de registro para empresas
│   │   ├── VisitsPanel.tsx        # Panel de notificaciones de visitas
│   │   ├── GlassCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── Toolbar.tsx            # Barra de herramientas del propietario
│   │   └── EditableField.tsx
│   └── sections/
│       ├── ProfileSection.tsx
│       ├── AboutSection.tsx
│       ├── ExperienceSection.tsx
│       ├── EducationSection.tsx
│       ├── SkillsSection.tsx
│       ├── ProjectsSection.tsx
│       ├── CertificationsSection.tsx
│       ├── LanguagesSection.tsx
│       └── AdditionalSection.tsx
└── App.tsx                  # Orquestación de vistas y estado global
```

---

## 🗃️ Datos almacenados en localStorage

| Clave                  | Contenido                                              |
|------------------------|--------------------------------------------------------|
| `neural-cv-data`       | Todos los datos del CV (perfil, secciones, color)      |
| `neural-cv-owner-pin`  | PIN del propietario (texto plano)                      |
| `neural-cv-visits`     | Array de visitas de empresas con timestamp y estado    |
