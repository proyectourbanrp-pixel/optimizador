# 🚀 VYRONIX OPTIMIZER - Documentación del Proyecto Refactorizado

## 📋 Descripción General

VYRONIX Optimizer es una aplicación Electron para monitoreo y optimización de sistemas Windows. Permite analizar, optimizar y revertir cambios del sistema de manera segura.

## 🏗️ Estructura del Proyecto (Refactorizado)

```
pagina/
├── main.js                 # Proceso principal de Electron (seguro)
├── preload.js             # Puente seguro renderer ↔ main
├── main-ipc.js            # Handlers de IPC
├── renderer-ui.js         # Lógica de UI del renderer
├── app.js                 # Punto de entrada (mínimo)
├── index.html             # Interfaz HTML
├── styles.css             # Estilos mejorados
├── package.json           # Dependencias
├── backup_services.json   # Configuración de servicios
│
├── utils/                 # Módulos reutilizables
│   ├── system-monitor.js  # Monitoreo CPU/RAM
│   ├── process-manager.js # Gestión de procesos
│   └── logger.js          # Sistema de logging
│
└── scripts/               # Scripts PowerShell
    ├── backup.ps1
    ├── optimizar.ps1
    └── revertir.ps1
```

## 🔒 Mejoras de Seguridad

### ❌ Problemas Encontrados:
- ✗ `nodeIntegration: true` - Vulnerabilidad crítica
- ✗ `contextIsolation: false` - Sin aislamiento de contexto
- ✗ Acceso directo a Node.js desde renderer

### ✅ Soluciones Implementadas:
- ✓ `nodeIntegration: false` - Deshabilitado
- ✓ `contextIsolation: true` - Contexto aislado
- ✓ `preload.js` - API segura con IPC
- ✓ Validación de entrada en todos los handlers
- ✓ Sandbox habilitado
- ✓ `enableRemoteModule: false`

## 🎯 Mejoras Realizadas

### 1. **Modularización**
- Código separado en módulos lógicos
- Cada módulo tiene responsabilidad única
- Fácil de mantener y escalar

### 2. **Organización de Código**
- `utils/`: Módulos reutilizables y testables
- `main-ipc.js`: Centraliza toda la comunicación IPC
- `renderer-ui.js`: Lógica de UI separada

### 3. **Mejor Performance**
- Debouncing en actualizaciones de procesos
- Limitación de logs en memoria (máx 500)
- Evita fugas de memoria

### 4. **Manejo de Errores**
- Try-catch en operaciones críticas
- Validación de entrada
- Mensajes de error claros

### 5. **UI Mejorada**
- Diseño responsivo
- Mejor visual feedback
- Confirmación antes de cerrar procesos
- Scrollbar personalizado
- Tooltips en botones

### 6. **Documentación**
- Comentarios JSDoc completos
- Documentación inline
- Este README

## 📦 Módulos Principales

### `SystemMonitor` (utils/system-monitor.js)
```javascript
const monitor = new SystemMonitor();
const stats = monitor.getStats(); // { cpu: 45, ram: 60, timestamp: '...' }
```

### `ProcessManager` (utils/process-manager.js)
```javascript
const manager = new ProcessManager();
const processes = await manager.getTopProcesses();
await manager.killProcess(1234);
```

### `Logger` (utils/logger.js)
```javascript
const logger = new Logger();
logger.log('Mensaje', 'success');
const logs = logger.getLogs();
```

### `RendererUI` (renderer-ui.js)
```javascript
const ui = new RendererUI();
ui.init();
ui.executeScript('optimizar.ps1', 'Optimizando');
```

## 🔄 Flujo de IPC

```
Renderer (renderer-ui.js)
    ↓ IPC invoke
Main Process (main-ipc.js)
    ↓ spawn PowerShell
    ↓ capture stdout/stderr
Main Process (main-ipc.js)
    ↓ IPC send (logs)
Renderer (renderer-ui.js)
    ↓ update UI
User
```

## 🚀 Cómo Usar

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm start
```

Para ver DevTools, descomenta la línea en `main.js`:
```javascript
// mainWindow.webContents.openDevTools();
```

### Construcción
Para crear un ejecutable:
```bash
npm install -D electron-builder
npx electron-builder
```

## 🛠️ APIs Seguras del Renderer

El renderer process tiene acceso SOLO a:

```javascript
window.electronAPI.ejecutarScript(script, titulo)
window.electronAPI.obtenerProcesos()
window.electronAPI.cerrarProceso(pid)
window.electronAPI.onLog(callback)
window.electronAPI.onExecuting(callback)
```

## 📝 Funciones Disponibles

### HTML Buttons
```html
<button onclick="analizar()">🔍 Analizar</button>
<button onclick="optimizar()">🚀 Optimizar</button>
<button onclick="optimizarInteligente()">🧠 Auto</button>
<button onclick="revertir()">♻️ Revertir</button>
```

### Funciones JavaScript
```javascript
analizar()              // Ejecuta backup.ps1
optimizar()             // Ejecuta optimizar.ps1
optimizarInteligente()  // Auto optimización
revertir()              // Ejecuta revertir.ps1
ui.closeProcess(pid)    // Termina un proceso
```

## 🐛 Debugging

1. **Descomenta DevTools en main.js**
2. **Abre DevTools**: F12
3. **Console**: Ver errores y logs
4. **Application**: Ver almacenamiento local

## 📚 Mejores Prácticas Implementadas

- ✓ Separación de concernos (SoC)
- ✓ DRY (Don't Repeat Yourself)
- ✓ SOLID principles
- ✓ Validación de entrada
- ✓ Manejo de errores
- ✓ JSDoc documentation
- ✓ Seguridad en Electron
- ✓ Performance optimization

## 🔄 Próximas Mejoras Sugeridas

1. **Tests unitarios** - Jest/Mocha
2. **Persistencia** - Base de datos local (SQLite)
3. **Notificaciones** - Sistema de alertas
4. **Configuración** - Archivo de config personalizable
5. **Export de logs** - Guardar logs a archivo
6. **Gráficos** - Chart.js para historial de recursos
7. **Temas** - Soporte para dark/light mode
8. **Internacionalización** - Soporte multiidioma

## 📞 Soporte

Para reportar issues o sugerencias, contacta al desarrollador.

---

**Última actualización**: Abril 2026  
**Versión**: 1.0.0  
**Autor**: Juan Camilo (Refactorizado)
