/**
 * Preload.js - Puente seguro entre el renderer y main process
 * Expone una API limitada y segura al renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    /**
     * Ejecuta un script PowerShell
     * @param {string} script - Nombre del script en la carpeta scripts/
     * @param {string} titulo - Título del proceso
     * @returns {Promise<Object>} Resultado de la ejecución
     */
    ejecutarScript: (script, titulo) => 
        ipcRenderer.invoke('ejecutar-script', { script, titulo }),
    
    /**
     * Obtiene la lista de procesos top
     * @returns {Promise<Array>} Array de procesos
     */
    obtenerProcesos: () => 
        ipcRenderer.invoke('obtener-procesos'),
    
    /**
     * Termina un proceso
     * @param {number} pid - ID del proceso
     * @returns {Promise<Object>} Resultado de la operación
     */
    cerrarProceso: (pid) => 
        ipcRenderer.invoke('cerrar-proceso', { pid }),
    
    /**
     * Inicia monitoreo de CPU/RAM
     */
    iniciarMonitoreo: () => 
        ipcRenderer.invoke('iniciar-monitoreo'),
    
    /**
     * Detiene monitoreo de CPU/RAM
     */
    detenerMonitoreo: () => 
        ipcRenderer.invoke('detener-monitoreo'),
    
    /**
     * Analiza drivers del sistema
     */
    analizarDrivers: () => 
        ipcRenderer.invoke('analizar-drivers'),
    
    /**
     * Limpia la RAM
     */
    limpiarRAM: () => 
        ipcRenderer.invoke('limpiar-ram'),
    
    /**
     * Actualiza drivers
     */
    actualizarDrivers: () => 
        ipcRenderer.invoke('actualizar-drivers'),
    
    /**
     * Listener para recibir logs desde el main process
     * @param {Function} callback - Función a ejecutar cuando hay un nuevo log
     */
    onLog: (callback) => 
        ipcRenderer.on('log', (event, logEntry) => callback(logEntry)),
    
    /**
     * Listener para estado de ejecución
     * @param {Function} callback - Función a ejecutar cuando cambia el estado
     */
    onExecuting: (callback) => 
        ipcRenderer.on('ejecutando', (event, isExecuting) => callback(isExecuting)),
    
    /**
     * Listener para actualización de CPU/RAM
     */
    onStatsUpdate: (callback) => 
        ipcRenderer.on('stats-update', (event, stats) => callback(stats)),
    
    /**
     * Listener para datos de drivers
     */
    onDriversData: (callback) => 
        ipcRenderer.on('drivers-data', (event, drivers) => callback(drivers))
});

