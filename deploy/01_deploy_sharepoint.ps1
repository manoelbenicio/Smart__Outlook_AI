# =============================================================================
# Deploy SharePoint Libraries — Phase 1 (CODEX-01, CODEX-02)
# Uses existing site: indra365.sharepoint.com/sites/Grp_T_DN_Arquitetura_...
# =============================================================================

param(
    [string]$SiteUrl = "https://indra365.sharepoint.com/sites/Grp_T_DN_Arquitetura_Solucoes_Multi_Praticas_QA",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host " CODEX DEPLOY: SharePoint Libraries" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Site: $SiteUrl"
Write-Host "DryRun: $DryRun"
Write-Host ""

# --- Step 1: Connect ---
Write-Host "[1/5] Connecting to SharePoint..." -ForegroundColor Yellow
if (-not $DryRun) {
    Connect-PnPOnline -Url $SiteUrl -DeviceLogin -LaunchBrowser
    Write-Host "  [OK] Connected" -ForegroundColor Green
} else {
    Write-Host "  [DRY RUN] Would connect to $SiteUrl" -ForegroundColor Gray
}

# --- Step 2: Create Document Libraries ---
$libraries = @(
    @{ Name = "RFP_Templates"; Description = "Word templates for GO/NO-GO report generation" },
    @{ Name = "RFP_Input"; Description = "Raw email body and attachments per offer" },
    @{ Name = "RFP_Extracted"; Description = "Extracted text from documents" },
    @{ Name = "RFP_Output"; Description = "AI outputs (JSON) and generated reports (PDF)" }
)

Write-Host "[2/5] Creating document libraries..." -ForegroundColor Yellow
foreach ($lib in $libraries) {
    $exists = $null
    if (-not $DryRun) {
        $exists = Get-PnPList -Identity $lib.Name -ErrorAction SilentlyContinue
    }
    
    if ($exists) {
        Write-Host "  [SKIP] Library '$($lib.Name)' already exists" -ForegroundColor Gray
    } else {
        if (-not $DryRun) {
            New-PnPList -Title $lib.Name -Template DocumentLibrary -Url $lib.Name
            Set-PnPList -Identity $lib.Name -Description $lib.Description
            Write-Host "  [OK] Created library: $($lib.Name)" -ForegroundColor Green
        } else {
            Write-Host "  [DRY RUN] Would create library: $($lib.Name)" -ForegroundColor Gray
        }
    }
}

# --- Step 3: Add Custom Columns ---
Write-Host "[3/5] Adding custom columns..." -ForegroundColor Yellow

# OfferID column on Input, Extracted, Output
$libsWithOfferID = @("RFP_Input", "RFP_Extracted", "RFP_Output")
foreach ($libName in $libsWithOfferID) {
    if (-not $DryRun) {
        $field = Get-PnPField -List $libName -Identity "OfferID" -ErrorAction SilentlyContinue
        if (-not $field) {
            Add-PnPField -List $libName -DisplayName "OfferID" -InternalName "OfferID" -Type Text -AddToDefaultView
            Write-Host "  [OK] Added OfferID to $libName" -ForegroundColor Green
        } else {
            Write-Host "  [SKIP] OfferID already exists on $libName" -ForegroundColor Gray
        }
    } else {
        Write-Host "  [DRY RUN] Would add OfferID to $libName" -ForegroundColor Gray
    }
}

# ReportType choice on Output
if (-not $DryRun) {
    $field = Get-PnPField -List "RFP_Output" -Identity "ReportType" -ErrorAction SilentlyContinue
    if (-not $field) {
        Add-PnPField -List "RFP_Output" -DisplayName "ReportType" -InternalName "ReportType" -Type Choice -Choices "PDF","JSON" -AddToDefaultView
        Write-Host "  [OK] Added ReportType to RFP_Output" -ForegroundColor Green
    } else {
        Write-Host "  [SKIP] ReportType already exists on RFP_Output" -ForegroundColor Gray
    }
} else {
    Write-Host "  [DRY RUN] Would add ReportType choice to RFP_Output" -ForegroundColor Gray
}

# Recommendation choice on Output
if (-not $DryRun) {
    $field = Get-PnPField -List "RFP_Output" -Identity "Recommendation" -ErrorAction SilentlyContinue
    if (-not $field) {
        Add-PnPField -List "RFP_Output" -DisplayName "Recommendation" -InternalName "Recommendation" -Type Choice -Choices "GO","GO_CONDITIONAL","NO_GO" -AddToDefaultView
        Write-Host "  [OK] Added Recommendation to RFP_Output" -ForegroundColor Green
    } else {
        Write-Host "  [SKIP] Recommendation already exists on RFP_Output" -ForegroundColor Gray
    }
} else {
    Write-Host "  [DRY RUN] Would add Recommendation choice to RFP_Output" -ForegroundColor Gray
}

# --- Step 4: Create sample folder structure ---
Write-Host "[4/5] Creating sample folder..." -ForegroundColor Yellow
$sampleFolder = "OFR-20260405-000000-SAMPLE"
foreach ($libName in @("RFP_Input", "RFP_Extracted", "RFP_Output")) {
    if (-not $DryRun) {
        $folder = Get-PnPFolder -Url "$libName/$sampleFolder" -ErrorAction SilentlyContinue
        if (-not $folder) {
            Add-PnPFolder -Name $sampleFolder -Folder $libName
            Write-Host "  [OK] Created $libName/$sampleFolder" -ForegroundColor Green
        } else {
            Write-Host "  [SKIP] Folder already exists in $libName" -ForegroundColor Gray
        }
    } else {
        Write-Host "  [DRY RUN] Would create $libName/$sampleFolder" -ForegroundColor Gray
    }
}

# --- Step 5: Verify ---
Write-Host "[5/5] Verifying deployment..." -ForegroundColor Yellow
if (-not $DryRun) {
    $results = @()
    foreach ($lib in $libraries) {
        $list = Get-PnPList -Identity $lib.Name -ErrorAction SilentlyContinue
        $status = if ($list) { "OK" } else { "MISSING" }
        $results += [PSCustomObject]@{ Library = $lib.Name; Status = $status; ItemCount = $list.ItemCount }
    }
    $results | Format-Table -AutoSize
    
    Disconnect-PnPOnline
    Write-Host "  [OK] Disconnected from SharePoint" -ForegroundColor Green
} else {
    Write-Host "  [DRY RUN] Would verify libraries" -ForegroundColor Gray
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host " SharePoint deployment complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
