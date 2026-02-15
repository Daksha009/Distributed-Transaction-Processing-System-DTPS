$ErrorActionPreference = "Stop"
Write-Host "Step 1: Checking Java..."
try {
    $java = Get-Command java -ErrorAction Stop
    Write-Host "Java found at: $($java.Source)"
} catch {
    Write-Error "Java not found in PATH."
    exit 1
}

Write-Host "Step 2: Checking Maven..."
$mvnCmd = "mvn"
$hasMvn = $false
try {
    Get-Command mvn -ErrorAction Stop | Out-Null
    $hasMvn = $true
    Write-Host "Maven found in PATH."
} catch {
    Write-Host "Maven NOT in PATH. Checking portable..."
}

if (-not $hasMvn) {
    $projectRoot = "C:\Users\iamda\OneDrive\Desktop\Internship Assignment"
    $mvnDirName = "apache-maven-3.9.6"
    $mvnBinPath = Join-Path $projectRoot "$mvnDirName\bin\mvn.cmd"
    
    $mvnCmd = $mvnBinPath
    if (-not (Test-Path $mvnCmd)) {
        Write-Error "Maven executable not found at $mvnCmd."
        exit 1
    }
}

Write-Host "Step 3: Running App via Start-Process..."
Set-Location "C:\Users\iamda\OneDrive\Desktop\Internship Assignment"
$logFile = "C:\Users\iamda\OneDrive\Desktop\Internship Assignment\run.log"
Write-Host "Logging to $logFile"

# Set AWS Region to avoid startup failure
$env:AWS_REGION = "us-east-1"
Write-Host "Set AWS_REGION=us-east-1"

$proc = Start-Process -FilePath $mvnCmd -ArgumentList "-f backend/pom.xml clean spring-boot:run -DskipTests -e" -RedirectStandardOutput "${logFile}.out" -RedirectStandardError "${logFile}.err" -PassThru -NoNewWindow
$proc.WaitForExit()
Write-Host "Exited with $($proc.ExitCode)"
