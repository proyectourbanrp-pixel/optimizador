/**
 * Main IPC - Manejador de IPC para el proceso principal
 */

const { ipcMain } = require('electron');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const ProcessManager = require('./utils/process-manager');
const Logger = require('./utils/logger');
const SystemMonitor = require('./utils/system-monitor');

const processManager = new ProcessManager();
const logger = new Logger();
const systemMonitor = new SystemMonitor();
const execPromise = promisify(exec);

let isRunning = false;
let monitorInterval = null;

/**
 * Configura los handlers de IPC
 * @param {BrowserWindow} mainWindow - Ventana principal
 */
function setupIPC(mainWindow) {
    /**
     * IPC: ejecutar-script
     * Ejecuta un script PowerShell
     */
    ipcMain.handle('ejecutar-script', async (event, { script, titulo }) => {
        if (isRunning) {
            const logEntry = logger.log('Ya hay un proceso en ejecución', 'warning');
            mainWindow.webContents.send('log', logEntry);
            return { success: false, message: 'Proceso en ejecución' };
        }

        try {
            isRunning = true;
            mainWindow.webContents.send('ejecutando', true);

            const logEntry = logger.log(`==== ${titulo} ====`, 'process');
            mainWindow.webContents.send('log', logEntry);

            const scriptPath = path.join(__dirname, 'scripts', script);

            return new Promise((resolve) => {
                const proceso = spawn('powershell.exe', [
                    '-ExecutionPolicy', 'Bypass',
                    '-File', scriptPath
                ], {
                    stdio: ['pipe', 'pipe', 'pipe']
                });

                proceso.stdout.on('data', (data) => {
                    const logEntry = logger.log(data.toString().trim(), 'info');
                    mainWindow.webContents.send('log', logEntry);
                });

                proceso.stderr.on('data', (data) => {
                    const logEntry = logger.log(data.toString().trim(), 'error');
                    mainWindow.webContents.send('log', logEntry);
                });

                proceso.on('close', (code) => {
                    const logEntry = logger.log(
                        code === 0 ? 'Proceso finalizado exitosamente' : `Proceso finalizado con código ${code}`,
                        code === 0 ? 'success' : 'error'
                    );
                    mainWindow.webContents.send('log', logEntry);
                    
                    isRunning = false;
                    mainWindow.webContents.send('ejecutando', false);
                    
                    resolve({
                        success: code === 0,
                        message: `Script ejecutado con código ${code}`
                    });
                });

                proceso.on('error', (err) => {
                    const logEntry = logger.log(`Error: ${err.message}`, 'error');
                    mainWindow.webContents.send('log', logEntry);
                    
                    isRunning = false;
                    mainWindow.webContents.send('ejecutando', false);
                    
                    resolve({
                        success: false,
                        message: err.message
                    });
                });
            });
        } catch (error) {
            isRunning = false;
            mainWindow.webContents.send('ejecutando', false);
            return { success: false, message: error.message };
        }
    });

    /**
     * IPC: obtener-procesos
     * Obtiene lista de procesos top
     */
    ipcMain.handle('obtener-procesos', async () => {
        try {
            return await processManager.getTopProcesses();
        } catch (error) {
            console.error('Error en IPC obtener-procesos:', error);
            return [];
        }
    });

    /**
     * IPC: cerrar-proceso
     * Termina un proceso específico
     */
    ipcMain.handle('cerrar-proceso', async (event, { pid }) => {
        try {
            return await processManager.killProcess(pid);
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    });

    /**
     * IPC: iniciar-monitoreo
     * Inicia envío de CPU/RAM en tiempo real
     */
    ipcMain.handle('iniciar-monitoreo', () => {
        if (monitorInterval) return { success: true };

        monitorInterval = setInterval(() => {
            const stats = systemMonitor.getStats();
            mainWindow.webContents.send('stats-update', stats);
        }, 1000);

        return { success: true };
    });

    /**
     * IPC: detener-monitoreo
     * Detiene envío de CPU/RAM
     */
    ipcMain.handle('detener-monitoreo', () => {
        if (monitorInterval) {
            clearInterval(monitorInterval);
            monitorInterval = null;
        }
        return { success: true };
    });

    /**
     * IPC: analizar-drivers
     * Analiza el estado de los drivers
     */
    ipcMain.handle('analizar-drivers', async () => {
        try {
            const logEntry = logger.log('🔍 Analizando estado de drivers...', 'process');
            mainWindow.webContents.send('log', logEntry);

            const command = `powershell -Command "Get-WmiObject Win32_PnPSignedDriver | Select-Object Description,DeviceName,DriverVersion,Status | ConvertTo-Json"`;
            
            const { stdout } = await execPromise(command);
            let drivers = [];
            
            try {
                drivers = JSON.parse(stdout);
                if (!Array.isArray(drivers)) drivers = [drivers];
            } catch (e) {
                drivers = [];
            }

            const logEntry2 = logger.log(`📊 Se encontraron ${drivers.length} drivers`, 'info');
            mainWindow.webContents.send('log', logEntry2);

            mainWindow.webContents.send('drivers-data', drivers);
            
            return { success: true, drivers };
        } catch (error) {
            const logEntry = logger.log(`❌ Error analizando drivers: ${error.message}`, 'error');
            mainWindow.webContents.send('log', logEntry);
            return { success: false, message: error.message };
        }
    });

    /**
     * IPC: limpiar-ram
     * Limpia la memoria RAM del sistema
     */
    ipcMain.handle('limpiar-ram', async () => {
        try {
            const logEntry = logger.log('🧹 Limpiando RAM...', 'process');
            mainWindow.webContents.send('log', logEntry);

            const command = `powershell -Command "[System.GC]::Collect(); [System.GC]::WaitForPendingFinalizers(); Get-Process | Where-Object {$_.ProcessName -ne 'System' -and $_.ProcessName -ne 'svchost'} | ForEach-Object {$_.Dispose()}"`;
            
            await execPromise(command);

            const stats = systemMonitor.getStats();
            const logEntry2 = logger.log(`✅ RAM limpiada. Uso actual: ${stats.ram}%`, 'success');
            mainWindow.webContents.send('log', logEntry2);
            mainWindow.webContents.send('stats-update', stats);

            return { success: true, stats };
        } catch (error) {
            const logEntry = logger.log(`⚠️ Error limpiando RAM: ${error.message}`, 'warning');
            mainWindow.webContents.send('log', logEntry);
            return { success: false, message: error.message };
        }
    });

    /**
     * IPC: actualizar-drivers
     * Actualiza los drivers del sistema
     */
    ipcMain.handle('actualizar-drivers', async () => {
        try {
            const logEntry = logger.log('⬇️ Descargando actualizaciones de drivers...', 'process');
            mainWindow.webContents.send('log', logEntry);

            // Iniciar Windows Update
            const command = `powershell -Command "Start-Process ms-settings:windowsupdate"`;
            await execPromise(command);

            const logEntry2 = logger.log('✅ Se abrió Windows Update. Descargando drivers...', 'success');
            mainWindow.webContents.send('log', logEntry2);

            return { success: true };
        } catch (error) {
            const logEntry = logger.log(`❌ Error actualizando drivers: ${error.message}`, 'error');
            mainWindow.webContents.send('log', logEntry);
            return { success: false, message: error.message };
        }
    });
}

module.exports = { setupIPC };
