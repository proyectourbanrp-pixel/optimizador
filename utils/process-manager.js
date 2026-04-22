/**
 * Process Manager - Gestiona procesos del sistema
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

class ProcessManager {
    /**
     * Obtiene los 10 procesos que más memoria consumen
     * @returns {Promise<Array>} Array de procesos
     */
    async getTopProcesses() {
        try {
            const command = `powershell -Command "Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10 -Property Name,Id,@{Name='RAM';Expression={[math]::Round($_.WorkingSet/1MB,2)}} | ConvertTo-Json"`;
            
            const { stdout } = await execPromise(command);
            
            let data = JSON.parse(stdout);
            
            // Asegurar que siempre sea un array
            if (!Array.isArray(data)) {
                data = [data];
            }
            
            return data;
        } catch (error) {
            console.error('Error obteniendo procesos:', error);
            return [];
        }
    }

    /**
     * Detiene un proceso por su PID
     * @param {number} pid - ID del proceso
     * @returns {Promise<Object>} Resultado de la operación
     */
    async killProcess(pid) {
        try {
            if (!Number.isInteger(pid) || pid <= 0) {
                throw new Error('PID inválido');
            }
            
            const command = `powershell -Command "Stop-Process -Id ${pid} -Force -ErrorAction Stop"`;
            await execPromise(command);
            
            return {
                success: true,
                message: `Proceso ${pid} terminado exitosamente`
            };
        } catch (error) {
            console.error(`Error cerrando proceso ${pid}:`, error);
            return {
                success: false,
                message: `Error al terminar proceso: ${error.message}`
            };
        }
    }
}

module.exports = ProcessManager;
