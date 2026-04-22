# 📁 ESTRUCTURA DEL PROYECTO REFACTORIZADO

## Árbol de Archivos

```
pagina/
│
├── 📄 ARCHIVOS PRINCIPALES
│   ├── main.js                    🔹 Punto de entrada (Electron main process)
│   ├── preload.js                 🔹 API segura entre procesos
│   ├── main-ipc.js                🔹 Handlers de IPC
│   ├── renderer-ui.js             🔹 Lógica de UI (renderer process)
│   ├── app.js                     🔹 Punto de entrada del renderer (mínimo ahora)
│   │
│   ├── index.html                 🔹 Interfaz HTML
│   ├── styles.css                 🔹 Estilos CSS mejorados
│   ├── package.json               🔹 Dependencias y scripts
│   ├── backup_services.json       🔹 Configuración de servicios
│   │
├── 📂 CARPETA UTILS (MÓDULOS REUTILIZABLES)
│   ├── system-monitor.js          🔹 Monitoreo CPU/RAM
│   ├── process-manager.js         🔹 Gestión de procesos del SO
│   └── logger.js                  🔹 Sistema de logging centralizado
│   │
├── 📂 CARPETA SCRIPTS (POWERSHELL)
│   ├── backup.ps1                 🔹 Script de análisis
│   ├── optimizar.ps1              🔹 Script de optimización
│   └── revertir.ps1               🔹 Script de reversión
│   │
├── 📂 DOCUMENTACIÓN
│   ├── README.md                  🔹 Documentación principal
│   ├── DEVELOPMENT.md             🔹 Guía para desarrolladores
│   ├── CHANGES.md                 🔹 Resumen de cambios
│   └── PROJECT_STRUCTURE.md       🔹 Este archivo
│   │
├── 🔧 CONFIGURACIÓN
│   ├── .eslintrc.js               🔹 Reglas de linting
│   └── .gitignore                 🔹 Archivos ignorados por git
│   │
└── 📋 OTROS
    ├── node_modules/              📦 Dependencias (creada al hacer npm install)
    └── dist/ / out/               📦 Build outputs (creada al hacer npm run dist)
```

## 📊 Descripción de Cada Archivo

### 🔹 Archivos Principales

#### `main.js` (30 líneas)
**Responsabilidad**: Punto de entrada de Electron
- Crea ventana principal
- Configura seguridad
- Setup de IPC
- Manejo de ciclo de vida

```javascript
const { app, BrowserWindow } = require('electron');
// ... configuración segura
app.whenReady().then(createWindow);
```

---

#### `preload.js` (35 líneas)
**Responsabilidad**: Puente seguro entre renderer y main
- Expone API limitada y segura
- Listeners para IPC
- Validación de tipos

```javascript
contextBridge.exposeInMainWorld('electronAPI', {
    ejecutarScript: (...) => ipcRenderer.invoke(...),
    // ... más métodos seguros
});
```

---

#### `main-ipc.js` (140 líneas)
**Responsabilidad**: Maneja toda la comunicación IPC
- Handler para ejecutar scripts
- Handler para obtener procesos
- Handler para matar procesos
- Manejo centralizado de errores

```javascript
ipcMain.handle('ejecutar-script', async (event, { script, titulo }) => {
    // Validación
    // Ejecución
    // Manejo de errores
    // Return resultado
});
```

---

#### `renderer-ui.js` (200 líneas)
**Responsabilidad**: Lógica completa de UI
- Inicialización del DOM
- Listeners de eventos
- Actualización de tabla de procesos
- Manejo de logs
- Llamadas a IPC

```javascript
class RendererUI {
    init() { /* ... */ }
    executeScript(script, titulo) { /* ... */ }
    updateProcesses() { /* ... */ }
    addLog(msg) { /* ... */ }
}
```

---

#### `app.js` (5 líneas)
**Responsabilidad**: Punto de entrada minimalista
- Solo comentario sobre la estructura

```javascript
/**
 * App.js - Ahora simplificado
 * Ver renderer-ui.js para lógica
 */
```

---

#### `index.html` (55 líneas)
**Responsabilidad**: Estructura HTML
- Elementos del DOM
- Importa renderer-ui.js
- Importa styles.css

```html
<!DOCTYPE html>
<html>
    <div id="cpu">--%</div>
    <button onclick="analizar()">🔍 Analizar</button>
    <!-- ... más elementos -->
    <script src="renderer-ui.js"></script>
</html>
```

---

#### `styles.css` (250 líneas)
**Responsabilidad**: Estilos visuales
- Tema dark mode
- Animaciones
- Responsiveness
- Componentes (cards, botones, tabla)

```css
body {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #e2e8f0;
}

.card:hover {
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.4);
}
```

---

#### `package.json` (60 líneas)
**Responsabilidad**: Configuración del proyecto
- Dependencias (Electron)
- Scripts npm
- Metadata del proyecto
- Configuración de build

```json
{
    "name": "pagina",
    "scripts": {
        "start": "electron .",
        "dev": "electron . --remote-debugging-port=9222"
    },
    "devDependencies": {
        "electron-builder": "^24.0.0"
    }
}
```

---

### 📂 Carpeta `utils/`

#### `system-monitor.js` (50 líneas)
**Responsabilidad**: Monitoreo de recursos del sistema
- Cálculo de CPU
- Cálculo de RAM
- Acumulación de estadísticas

```javascript
class SystemMonitor {
    getCPU() { /* ... */ }
    getRAM() { /* ... */ }
    getStats() { return { cpu, ram, timestamp }; }
}
```

---

#### `process-manager.js` (60 líneas)
**Responsabilidad**: Gestión de procesos del SO
- Obtener top processes
- Matar procesos
- Validación y error handling

```javascript
class ProcessManager {
    async getTopProcesses() { /* ... */ }
    async killProcess(pid) { /* ... */ }
}
```

---

#### `logger.js` (50 líneas)
**Responsabilidad**: Sistema centralizado de logging
- Almacenamiento de logs
- Límite de logs en memoria
- Filtrado de logs

```javascript
class Logger {
    log(message, type = 'info') { /* ... */ }
    getLogs() { /* ... */ }
    clear() { /* ... */ }
}
```

---

### 📂 Carpeta `scripts/`

#### `backup.ps1`
Script PowerShell para análisis del sistema

#### `optimizar.ps1`
Script PowerShell para optimización

#### `revertir.ps1`
Script PowerShell para reversión de cambios

---

### 📄 Archivos de Documentación

#### `README.md`
- Descripción general
- Cómo instalar
- Cómo usar
- Estructura del proyecto
- Mejoras realizadas

#### `DEVELOPMENT.md`
- Guía para desarrolladores
- Cómo agregar nuevas features
- Checklist de seguridad
- Debugging tips
- Testing

#### `CHANGES.md` (Este archivo)
- Resumen de cambios
- Antes/Después
- Métricas de mejora
- Próximas mejoras

---

### 🔧 Archivos de Configuración

#### `.eslintrc.js`
Reglas de linting para mantener código consistente

#### `.gitignore`
Archivos a ignorar en git (node_modules, dist, etc)

---

## 🔄 Flujo de Datos

### Cuando haces click en un botón

```
Usuario hace click en botón "Optimizar"
    ↓
onclick="optimizar()"  [index.html]
    ↓
ui.executeScript('optimizar.ps1', 'Optimizando')  [renderer-ui.js]
    ↓
window.electronAPI.ejecutarScript(...)  [preload.js → IPC]
    ↓
ipcMain.handle('ejecutar-script', ...)  [main-ipc.js]
    ↓
spawn PowerShell proceso  [child_process]
    ↓
Captura stdout/stderr
    ↓
mainWindow.webContents.send('log', ...)  [IPC inverso]
    ↓
window.electronAPI.onLog(callback)  [preload.js → renderer-ui.js]
    ↓
ui.addLog(message)  [renderer-ui.js]
    ↓
DOM actualizado, usuario ve el log
```

---

## 📊 Estadísticas de Archivos

| Archivo | Líneas | Propósito |
|---------|--------|----------|
| main.js | 30 | Entry point |
| preload.js | 35 | API segura |
| main-ipc.js | 140 | IPC handlers |
| renderer-ui.js | 200 | Lógica UI |
| app.js | 5 | Mínimo |
| index.html | 55 | Estructura |
| styles.css | 250 | Estilos |
| **Total** | **715** | **Total** |

---

## 🎯 Patrón de Responsabilidades

```
┌─────────────────┐
│   index.html    │  ← Estructura HTML
└────────┬────────┘
         │
┌────────▼────────┐
│ renderer-ui.js  │  ← Lógica de UI
└────────┬────────┘
         │ IPC
┌────────▼──────────┐
│  main-ipc.js      │  ← Handlers IPC
└────────┬──────────┘
         │
    ┌────┴───┬────┬─────┐
    │         │    │     │
    ▼         ▼    ▼     ▼
 spawn    process logger util
```

---

**Última actualización**: 22 Abril 2026  
**Versión**: 1.1.0
