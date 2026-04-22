# 🚀 GUÍA RÁPIDA - VYRONIX Optimizer v1.2

## Inicio Rápido

1. **Abre la aplicación**:
   ```bash
   npm start
   ```

2. **Verifica el panel principal**:
   - CPU % en tiempo real
   - RAM % en tiempo real
   - Estado del sistema (Óptimo/Normal/Crítico)

## Botones Principales

### 🔍 **Analizar**
- Ejecuta análisis del sistema
- Crea backup de estado actual
- Genera logs detallados
- **Uso**: Cuando quieras revisar el estado actual

### ⚡ **Optimizar**
- Limpia RAM automáticamente
- Ejecuta script de optimización
- Termina procesos innecesarios
- **Uso**: Cuando sientas que el PC está lento

### 🤖 **Auto Optimización Inteligente**
- Optimización automática inteligente
- Limpia RAM y procesos
- Ajustes del sistema
- **Uso**: Para dejar la PC al máximo rendimiento

### 🔄 **Revertir**
- Deshace cambios de optimización
- Restaura estado anterior
- **Uso**: Si algo va mal después de optimizar

## Pestaña: Procesos

### Ver Procesos
- Lista todos los procesos en ejecución
- **Columnas**:
  - Proceso: Nombre del programa
  - PID: ID del proceso
  - RAM: Memoria usada en MB
  - CPU: Uso de procesador
  - Acción: Botón para terminar

### Terminar Procesos
1. Busca el proceso que quieres cerrar
2. Haz clic en botón **"✕ Detener"**
3. Confirma la acción
4. El proceso se cerrará inmediatamente

⚠️ **Cuidado**: No termines procesos del sistema (svchost, explorer, etc.)

## Pestaña: Drivers

### Analizar Drivers
1. Haz clic en botón **"Analizar"**
2. Espera a que se carguen los drivers
3. Verás una tarjeta para cada driver

### Entender Estados
- ✅ **OK**: Driver funcionando correctamente
- ⚠️ **Problemas**: Necesita atención

### Actualizar Drivers
1. Si ves drivers con problemas, aparece botón **"Actualizar"**
2. Haz clic en el botón
3. Se abrirá Windows Update
4. Descarga e instala las actualizaciones

## Pestaña: Logs

### Ver Historial
- Todos los eventos y operaciones
- Códigos de color por tipo:
  - ✅ Verde: Operación exitosa
  - ❌ Rojo: Errores
  - 🔍 Cyan: Análisis
  - 🧹 Amarillo: Limpiezas

### Limpiar Logs
1. Haz clic en **"Limpiar Logs"**
2. Confirma que deseas limpiar
3. Se borrará el historial completo

## 💡 Tips de Uso

### Optimización Diaria
1. Abre VYRONIX
2. Haz clic en **"Auto Optimización Inteligente"**
3. Espera a que termine
4. Cierra programas que no uses

### Mantenimiento Semanal
1. Ve a **Procesos**
2. Revisa qué está usando mucha RAM
3. Termina lo que no necesites
4. Ve a **Drivers** y verifica actualizaciones

### Si el PC está Muy Lento
1. Abre VYRONIX
2. Haz clic en **"Optimizar"**
3. Cierra navegador y otros programas pesados
4. Haz clic en **"Revertir"** si algo no funciona bien

### Para Juegos/Programas Pesados
1. Antes de iniciar: **"Optimizar"** para liberar RAM
2. Cierra VYRONIX para usar todos los recursos
3. Después: **"Revertir"** si necesitas restaurar

## ⚙️ Entender los Stats

### CPU %
- **0-20%**: Muy bajo ✅
- **20-50%**: Normal ✅
- **50-70%**: Moderado ⚠️
- **70%+**: Alto 🔴

### RAM %
- **0-40%**: Excelente ✅
- **40-70%**: Normal ✅
- **70-85%**: Considera optimizar ⚠️
- **85%+**: Optimiza ahora 🔴

### Estado del Sistema
- **Óptimo**: PC funciona perfectamente
- **Normal**: Todo funciona bien
- **Crítico**: Considera optimizar

## 🛡️ Precauciones

✅ **Es Seguro**:
- Analizar el sistema
- Ver procesos
- Limpiar RAM
- Revisar drivers

⚠️ **Ten Cuidado**:
- Terminar procesos del sistema
- Desactivar drivers de hardware crítico
- Realizar optimizaciones durante programas importantes

❌ **No Hagas**:
- Terminar explorer.exe (gestor de archivos)
- Terminar procesos de antivirus
- Desinstalar drivers necesarios

## 🆘 Troubleshooting

### "La app no inicia"
```bash
# Instala dependencias
npm install

# Intenta de nuevo
npm start
```

### "No ve procesos"
- Necesitas ejecutar como Administrador
- Click derecho → Ejecutar como administrador

### "Drivers no aparecen"
- Algunos sistemas no exponen todos los drivers
- Verifica en Administrador de Dispositivos de Windows

### "Stats no se actualizan"
- Reinicia la app
- Verifica conexión de energía
- Comprueba permisos de administrador

## 📞 Soporte

Si encuentras problemas:
1. Revisa los **Logs** para mensajes de error
2. Toma una **screenshot** del error
3. Consulta la sección **Troubleshooting**
4. Intenta **"Revertir"** los cambios

---

**Versión**: 1.2
**Última actualización**: 2024
**Estado**: ✅ Completamente funcional y seguro
