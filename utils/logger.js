/**
 * Logger - Sistema de logging para la aplicación
 */

class Logger {
    constructor() {
        this.logs = [];
        this.maxLogs = 500; // Máximo de logs en memoria
    }

    /**
     * Agrega un log con timestamp
     * @param {string} message - Mensaje a loguear
     * @param {string} type - Tipo: 'info', 'success', 'error', 'warning'
     */
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        
        let icon = '📝';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'warning') icon = '⚠️';
        if (type === 'process') icon = '▶️';
        
        const logEntry = {
            timestamp,
            message,
            type,
            icon,
            fullMessage: `[${timestamp}] ${icon} ${message}`
        };
        
        this.logs.push(logEntry);
        
        // Limitar logs en memoria
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        return logEntry;
    }

    /**
     * Obtiene todos los logs
     * @returns {Array} Array de logs
     */
    getLogs() {
        return [...this.logs];
    }

    /**
     * Limpia los logs
     */
    clear() {
        this.logs = [];
    }

    /**
     * Obtiene los últimos N logs
     * @param {number} count - Cantidad de logs
     * @returns {Array} Array de logs
     */
    getLast(count = 10) {
        return this.logs.slice(-count);
    }
}

module.exports = Logger;
