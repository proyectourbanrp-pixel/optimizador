/**
 * System Monitor - Monitorea recursos del sistema (CPU, RAM)
 */

const os = require('os');

class SystemMonitor {
    constructor() {
        this.prevIdle = 0;
        this.prevTotal = 0;
    }

    /**
     * Obtiene el porcentaje de CPU en uso
     * @returns {number} Porcentaje de CPU (0-100)
     */
    getCPU() {
        const cpus = os.cpus();
        let idle = 0;
        let total = 0;

        cpus.forEach(cpu => {
            for (let type in cpu.times) {
                total += cpu.times[type];
            }
            idle += cpu.times.idle;
        });

        const diffIdle = idle - this.prevIdle;
        const diffTotal = total - this.prevTotal;

        this.prevIdle = idle;
        this.prevTotal = total;

        return 100 - Math.round((diffIdle / diffTotal) * 100) || 0;
    }

    /**
     * Obtiene el porcentaje de RAM en uso
     * @returns {number} Porcentaje de RAM (0-100)
     */
    getRAM() {
        const total = os.totalmem();
        const free = os.freemem();
        const used = total - free;
        return Math.round((used / total) * 100);
    }

    /**
     * Obtiene estadísticas de sistema
     * @returns {Object} Objeto con CPU y RAM
     */
    getStats() {
        return {
            cpu: this.getCPU(),
            ram: this.getRAM(),
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = SystemMonitor;
