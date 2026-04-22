# ⚡ GUÍA RÁPIDA DE INICIO

## 🚀 Primeros Pasos

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Ejecutar la Aplicación
```bash
npm start
```

### 3️⃣ Usar la Aplicación
- 🔍 **Analizar**: Analiza el estado del sistema
- 🚀 **Optimizar**: Ejecuta optimización completa
- 🧠 **Auto**: Auto optimización inteligente
- ♻️ **Revertir**: Revierte cambios previos

---

## 📚 Documentación

| Documento | Para... |
|-----------|---------|
| `README.md` | Entender qué es y cómo funciona |
| `DEVELOPMENT.md` | Desarrollar nuevas características |
| `PROJECT_STRUCTURE.md` | Entender la estructura de archivos |
| `CHANGES.md` | Ver qué cambió en la refactorización |

---

## 🐛 Debugging

### Abrir DevTools
Descomenta esta línea en `main.js`:
```javascript
mainWindow.webContents.openDevTools();
```

Luego ejecuta:
```bash
npm run dev
```

---

## ✅ Verificar que Funciona

1. Ejecuta `npm start`
2. Espera a que abra la ventana
3. Haz click en cada botón
4. Verifica que aparezcan logs
5. Verifica que se actualice la tabla de procesos

Si todo funciona → ¡Éxito! ✨

---

## 🔧 Problemas Comunes

### Error: "cannot find module electron"
```bash
npm install
```

### Error: "PowerShell not found"
VYRONIX solo funciona en Windows con PowerShell

### Logs no aparecen
- Abre DevTools (F12)
- Mira la consola por errores
- Verifica que los scripts existan en `scripts/`

### No se actualiza la tabla de procesos
- Espera 3 segundos (intervalo de actualización)
- Mira la consola por errores

---

## 📝 Próximos Pasos

1. **Lee** `README.md` para entender el proyecto
2. **Explora** `DEVELOPMENT.md` si quieres hacer cambios
3. **Consulta** `PROJECT_STRUCTURE.md` si necesitas navegar el código

---

## 💡 Tips

- Usa `npm run dev` para desarrollo con DevTools
- Los cambios en `*.js` requieren reiniciar la app
- Los cambios en `*.css` requieren f5 (refresh)
- Puedes abrir DevTools con F12 si lo habilitaste

---

¡Listo para empezar! 🎉
