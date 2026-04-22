# 👨‍💻 Guía de Desarrollo - VYRONIX Optimizer

## 🎯 Principios de Desarrollo

Este proyecto sigue los siguientes principios:

1. **Seguridad Primero** - Especialmente en contexto de Electron
2. **Modularidad** - Código separado en módulos lógicos
3. **Legibilidad** - Código claro y bien documentado
4. **Performance** - Optimizaciones donde sea posible
5. **Mantenibilidad** - Fácil de entender y modificar

## 📐 Arquitectura

### Procesos de Electron

```
┌─────────────────────────────────────────┐
│         MAIN PROCESS                    │
│  (Node.js, acceso al SO)                │
│                                         │
│  • main.js (entry point)               │
│  • main-ipc.js (IPC handlers)          │
│  • utils/* (módulos reutilizables)     │
└────────────────┬────────────────────────┘
                 │ IPC
                 ↓
┌─────────────────────────────────────────┐
│         RENDERER PROCESS                │
│  (Browser, no acceso directo al SO)     │
│                                         │
│  • preload.js (API segura)             │
│  • renderer-ui.js (lógica de UI)       │
│  • index.html (interfaz)               │
│  • styles.css (estilos)                │
└─────────────────────────────────────────┘
```

## 📝 Estructura de Código

### Nuevos Módulos en `utils/`

Cada módulo debe:

```javascript
/**
 * DescripciónDelMódulo - qué hace y para qué
 */

class MiModulo {
    /**
     * Constructor - inicializa el módulo
     */
    constructor() {
        // ...
    }

    /**
     * Descripción del método
     * @param {type} param1 - Descripción del parámetro
     * @param {type} param2 - Descripción del parámetro
     * @returns {type} Descripción del retorno
     */
    miMetodo(param1, param2) {
        // ...
    }
}

module.exports = MiModulo;
```

### Nuevos Handlers IPC

En `main-ipc.js`, agrega:

```javascript
ipcMain.handle('mi-accion', async (event, params) => {
    try {
        // Validar entrada
        if (!params.required) {
            throw new Error('Parámetro requerido');
        }

        // Ejecutar acción
        const resultado = await realizarAccion(params);

        // Enviar logs si es necesario
        mainWindow.webContents.send('log', logger.log('Acción completada', 'success'));

        return { success: true, data: resultado };
    } catch (error) {
        return { success: false, message: error.message };
    }
});
```

### Nuevas Funciones en Renderer

En `renderer-ui.js`:

```javascript
/**
 * Descripción de qué hace la función
 */
async function miNuevaAccion() {
    try {
        const resultado = await window.electronAPI.miAccion(params);
        
        if (resultado.success) {
            ui.addLog(`✅ ${resultado.message}`);
        } else {
            ui.addLog(`❌ ${resultado.message}`);
        }
    } catch (error) {
        ui.addLog(`❌ Error: ${error.message}`);
    }
}
```

## 🔒 Checklist de Seguridad

Antes de hacer push, verifica:

- [ ] No uses `nodeIntegration: true` en BrowserWindow
- [ ] No desactives `contextIsolation`
- [ ] No exposes funciones peligrosas en `preload.js`
- [ ] Valida SIEMPRE la entrada del usuario
- [ ] No uses `eval()` o `Function()`
- [ ] Los scripts PowerShell validan la entrada
- [ ] No guardas contraseñas o datos sensibles sin encriptación

## 🧪 Testing

### Manual Testing Checklist

```
[ ] El app inicia sin errores
[ ] Los botones ejecutan los scripts correctamente
[ ] Los logs se muestran correctamente
[ ] La tabla de procesos se actualiza
[ ] Puedo matar procesos sin crashes
[ ] No hay fugas de memoria (DevTools → Memory)
[ ] El UI es responsivo
[ ] Los mensajes de error son claros
```

### Comando de Desarrollo

```bash
npm run dev
```

Abre DevTools: F12

## 📊 Performance Tips

1. **Debounce en actualizaciones frecuentes**
   ```javascript
   setTimeout(() => { actualizar(); }, 100);
   ```

2. **Limita logs en memoria**
   ```javascript
   if (this.logs.length > this.maxLogs) {
       this.logs.shift();
   }
   ```

3. **Usa `async/await` para operaciones largas**
   ```javascript
   const resultado = await operacionLarga();
   ```

4. **Evita renders innecesarios**
   ```javascript
   // No: this.render() cada 100ms
   // Sí: renderizar solo si hay cambios
   ```

## 🐛 Debugging Tips

### DevTools Console

```javascript
// Ver logs
window.electronAPI.onLog(log => console.log(log));

// Ejecutar comando
await window.electronAPI.ejecutarScript('optimizar.ps1', 'Test');

// Ver procesos
await window.electronAPI.obtenerProcesos();
```

### Main Process Logs

Los logs aparecen en la consola donde ejecutaste `npm start`

```bash
# Ver logs con timestamps
npm start 2>&1 | tee app.log
```

## 📚 Referencias

- [Electron Security](https://www.electronjs.org/docs/tutorial/security)
- [IPC](https://www.electronjs.org/docs/api/ipc-main)
- [Process Model](https://www.electronjs.org/docs/tutorial/process-model)
- [Best Practices](https://www.electronjs.org/docs/tutorial/security/native-nodeintegration)

## 🚀 Deployment

### Build

```bash
npm run dist
```

Genera:
- `VYRONIX Optimizer Setup X.X.X.exe` - Installer
- `VYRONIX Optimizer X.X.X.exe` - Portable

### Release Checklist

- [ ] Actualiza version en `package.json`
- [ ] Crea tag en git: `v1.X.X`
- [ ] Genera binarios
- [ ] Prueba instalación
- [ ] Prueba portabilidad
- [ ] Genera changelog

## 💡 Mejoras Futuras

Cuando agregues nuevas features:

1. **Diseña la arquitectura primero**
2. **Escribe tests antes de código** (TDD)
3. **Documenta tu código**
4. **Pide code review**
5. **Verifica seguridad**

## 📞 Preguntas Frecuentes

### ¿Cómo agrego una nueva acción?

1. Crea handler en `main-ipc.js`
2. Expone en `preload.js`
3. Crea función en `renderer-ui.js`
4. Agrega botón en `index.html`

### ¿Cómo envío datos entre procesos?

- Main → Renderer: `mainWindow.webContents.send('evento', data)`
- Renderer → Main: `await window.electronAPI.accion(data)`

### ¿Cómo debuggeo?

Descomenta esta línea en `main.js`:
```javascript
mainWindow.webContents.openDevTools();
```

### ¿Cómo optimizo performance?

1. Usa Profiler en DevTools
2. Busca renders innecesarios
3. Debounce eventos frecuentes
4. Limpia event listeners

---

**Última actualización**: Abril 2026  
**Versión**: 1.0.0
