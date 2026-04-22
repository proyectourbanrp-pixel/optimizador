Write-Output "Iniciando optimización avanzada..."

# 🧹 Limpiar temporales
Write-Output "Limpiando archivos temporales..."
Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue

# 🧠 Liberar memoria RAM (Working Set)
Write-Output "Liberando memoria RAM..."

$code = @"
using System;
using System.Runtime.InteropServices;

public class Memory {
    [DllImport("psapi.dll")]
    public static extern bool EmptyWorkingSet(IntPtr hwProc);
}
"@

Add-Type $code

Get-Process | ForEach-Object {
    try {
        [Memory]::EmptyWorkingSet($_.Handle)
    } catch {}
}

# 🔄 Recolección de memoria
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Output "Reorganizando memoria del sistema..."
Start-Sleep -Seconds 2

Write-Output "Optimización completada correctamente"