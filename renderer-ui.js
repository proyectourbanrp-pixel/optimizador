/**
 * Renderer UI - Manejo completo de UI y eventos
 */

class RendererUI {
    constructor() {
        this.isExecuting = false;
        this.logBox = null;
        this.processTable = null;
        this.cpuDisplay = null;
        this.ramDisplay = null;
        this.driversList = null;
        this.systemStatus = null;
        this.cpuBar = null;
        this.ramBar = null;
    }

    /**
     * Inicializa la UI
     */
    init() {
        this.logBox = document.getElementById('log');
        this.processTable = document.getElementById('processTable');
        this.cpuDisplay = document.getElementById('cpu');
        this.ramDisplay = document.getElementById('ram');
        this.driversList = document.getElementById('driversList');
        this.systemStatus = document.getElementById('system-status');
        this.cpuBar = document.getElementById('cpu-bar');
        this.ramBar = document.getElementById('ram-bar');

        if (!this.logBox || !this.processTable) {
            console.error('No se encontraron elementos requeridos en el DOM');
            return;
        }

        this.setupEventListeners();
        this.setupMonitoring();
        this.updateProcesses();
    }

    /**
     * Configura listeners de eventos
     */
    setupEventListeners() {
        // Listener para logs
        window.electronAPI.onLog((logEntry) => {
            this.addLog(logEntry.fullMessage);
        });

        // Listener para estado de ejecución
        if (window.electronAPI.onExecuting) {
            window.electronAPI.onExecuting((isExecuting) => {
                this.isExecuting = isExecuting;
                this.toggleButtons(isExecuting);
            });
        }

        // Listener para actualización de CPU/RAM
        if (window.electronAPI.onStatsUpdate) {
            window.electronAPI.onStatsUpdate((stats) => {
                this.updateStats(stats);
            });
        }

        // Listener para datos de drivers
        if (window.electronAPI.onDriversData) {
            window.electronAPI.onDriversData((drivers) => {
                this.renderDrivers(drivers);
            });
        }
    }

    /**
     * Configura el monitoreo
     */
    setupMonitoring() {
        // Iniciar monitoreo de CPU/RAM
        window.electronAPI.iniciarMonitoreo();

        // Actualizar procesos cada 3 segundos
        setInterval(() => this.updateProcesses(), 3000);
    }

    /**
     * Actualiza estadísticas de sistema
     */
    updateStats(stats) {
        if (!stats) return;

        this.cpuDisplay.textContent = stats.cpu + '%';
        this.ramDisplay.textContent = stats.ram + '%';
        
        if (this.cpuBar) this.cpuBar.style.width = stats.cpu + '%';
        if (this.ramBar) this.ramBar.style.width = stats.ram + '%';

        // Determinar estado del sistema
        if (stats.ram > 80 || stats.cpu > 80) {
            this.systemStatus.textContent = '⚠️ Alto';
            this.systemStatus.style.color = '#ff3366';
        } else if (stats.ram > 60 || stats.cpu > 60) {
            this.systemStatus.textContent = '📊 Moderado';
            this.systemStatus.style.color = '#ffaa00';
        } else {
            this.systemStatus.textContent = '✨ Óptimo';
            this.systemStatus.style.color = '#00ff88';
        }
    }

    /**
     * Agrega un mensaje al log
     * @param {string} msg - Mensaje a mostrar
     */
    addLog(msg) {
        const p = document.createElement('p');
        p.textContent = msg;
        this.logBox.appendChild(p);
        this.logBox.scrollTop = this.logBox.scrollHeight;
    }

    /**
     * Alterna el estado de los botones
     * @param {boolean} disabled - Si deben estar deshabilitados
     */
    toggleButtons(disabled) {
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.classList.contains('tab-btn')) {
                btn.disabled = disabled;
            }
        });
    }

    /**
     * Limpia los logs
     */
    clearLogs() {
        if (confirm('¿Seguro que deseas limpiar todos los logs?')) {
            this.logBox.innerHTML = '';
            this.addLog('📋 Logs limpiados');
        }
    }

    /**
     * Ejecuta un script
     * @param {string} script - Nombre del script
     * @param {string} titulo - Título del proceso
     */
    async executeScript(script, titulo) {
        if (this.isExecuting) {
            this.addLog('⚠️ Ya hay un proceso en ejecución');
            return;
        }

        try {
            this.isExecuting = true;
            this.toggleButtons(true);
            
            const result = await window.electronAPI.ejecutarScript(script, titulo);
            
            if (!result.success) {
                this.addLog(`❌ Error: ${result.message}`);
            }
        } catch (error) {
            this.addLog(`❌ Error al ejecutar script: ${error.message}`);
        } finally {
            this.isExecuting = false;
            this.toggleButtons(false);
        }
    }

    /**
     * Actualiza la tabla de procesos
     */
    async updateProcesses() {
        try {
            const processes = await window.electronAPI.obtenerProcesos();
            this.renderProcessTable(processes);
        } catch (error) {
            console.error('Error actualizando procesos:', error);
        }
    }

    /**
     * Renderiza la tabla de procesos
     * @param {Array} processes - Array de procesos
     */
    renderProcesses(processes) {
        this.processTable.innerHTML = '';

        if (!Array.isArray(processes) || processes.length === 0) {
            this.processTable.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #94a3b8;">No hay procesos para mostrar</td></tr>';
            return;
        }

        processes.forEach(process => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${this.escapeHtml(process.Name)}</strong></td>
                <td>${process.Id}</td>
                <td>${process.RAM.toFixed(2)} MB</td>
                <td>-</td>
                <td><button class="btn-kill" onclick="ui.closeProcess(${process.Id})">✕ Detener</button></td>
            `;
            this.processTable.appendChild(row);
        });
    }

    /**
     * Cierra un proceso
     * @param {number} pid - ID del proceso
     */
    async closeProcess(pid) {
        if (!confirm(`¿Está seguro que desea terminar el proceso ${pid}?`)) {
            return;
        }

        try {
            const result = await window.electronAPI.cerrarProceso(pid);
            
            if (result.success) {
                this.addLog(`✅ ${result.message}`);
                await this.updateProcesses();
            } else {
                this.addLog(`❌ ${result.message}`);
            }
        } catch (error) {
            this.addLog(`❌ Error al cerrar proceso: ${error.message}`);
        }
    }

    /**
     * Analiza drivers del sistema
     */
    async analizarDrivers() {
        this.addLog('🔍 Analizando drivers...');
        try {
            await window.electronAPI.analizarDrivers();
        } catch (error) {
            this.addLog(`❌ Error: ${error.message}`);
        }
    }

    /**
     * Renderiza la lista de drivers
     */
    renderDrivers(drivers) {
        this.driversList.innerHTML = '';

        if (!Array.isArray(drivers) || drivers.length === 0) {
            this.driversList.innerHTML = '<p style="text-align: center; color: #94a3b8;">No se encontraron drivers</p>';
            return;
        }

        drivers.forEach(driver => {
            const div = document.createElement('div');
            div.className = 'driver-item';
            
            const statusClass = driver.Status === 'OK' ? 'ok' : 'warning';
            const statusIcon = driver.Status === 'OK' ? '✅' : '⚠️';

            div.innerHTML = `
                <div class="driver-name">${this.escapeHtml(driver.Description || 'Driver desconocido')}</div>
                <div class="driver-version">v${driver.DriverVersion || 'N/A'}</div>
                <div class="driver-status ${statusClass}">${statusIcon} ${driver.Status || 'Desconocido'}</div>
            `;
            
            this.driversList.appendChild(div);
        });

        // Mostrar botón de actualizar si hay drivers con problemas
        const tieneProblemas = drivers.some(d => d.Status !== 'OK');
        const updateBtn = document.getElementById('update-btn');
        if (updateBtn) {
            updateBtn.style.display = tieneProblemas ? 'block' : 'none';
        }
    }

    /**
     * Actualiza drivers
     */
    async actualizarDrivers() {
        if (confirm('¿Descargar actualizaciones de drivers desde Windows Update?')) {
            this.addLog('⬇️ Abriendo Windows Update...');
            try {
                await window.electronAPI.actualizarDrivers();
            } catch (error) {
                this.addLog(`❌ Error: ${error.message}`);
            }
        }
    }

    /**
     * Limpia RAM
     */
    async limpiarRAM() {
        if (confirm('¿Limpiar memoria RAM del sistema?')) {
            this.addLog('🧹 Iniciando limpieza de RAM...');
            try {
                const result = await window.electronAPI.limpiarRAM();
                if (result.success) {
                    this.addLog('✅ RAM limpiada exitosamente');
                    await this.updateProcesses();
                }
            } catch (error) {
                this.addLog(`❌ Error: ${error.message}`);
            }
        }
    }

    /**
     * Escapa caracteres HTML para prevenir XSS
     * @param {string} text - Texto a escapar
     * @returns {string} Texto escapado
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Crear instancia global de UI
const ui = new RendererUI();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    ui.init();
});

// Funciones de acción de botones
function switchTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Desactivar todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar tab seleccionado
    document.getElementById(`tab-${tabName}`)?.classList.add('active');
    
    // Activar botón
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function analizar() {
    ui.executeScript('backup.ps1', 'Analizando Sistema');
}

function optimizar() {
    ui.limpiarRAM();
    ui.executeScript('optimizar.ps1', 'Optimizando Sistema');
}

function optimizarInteligente() {
    ui.limpiarRAM();
    ui.executeScript('optimizar.ps1', 'Auto Optimización Inteligente');
}

function revertir() {
    ui.executeScript('revertir.ps1', 'Revirtiendo Cambios');
}
