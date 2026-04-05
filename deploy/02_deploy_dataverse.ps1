# =============================================================================
# Deploy Dataverse Tables — Phase 1 (CODEX-03, CODEX-04)
# Uses PAC CLI + Dataverse Web API
# Env: ColOfertasBrasilPro (https://colofertasbrasilpro.crm4.dynamics.com)
# =============================================================================

param(
    [string]$EnvironmentUrl = "https://colofertasbrasilpro.crm4.dynamics.com",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host " CODEX DEPLOY: Dataverse Tables" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment: $EnvironmentUrl"
Write-Host "DryRun: $DryRun"
Write-Host ""

# --- Step 1: Verify PAC auth ---
Write-Host "[1/6] Verifying PAC authentication..." -ForegroundColor Yellow
$authResult = pac auth list 2>&1
if ($authResult -match "mbenicios@minsait.com") {
    Write-Host "  ✓ Authenticated as mbenicios@minsait.com" -ForegroundColor Green
} else {
    Write-Host "  ✗ Not authenticated. Run: pac auth create --environment $EnvironmentUrl" -ForegroundColor Red
    exit 1
}

# --- Step 2: Create Solution container ---
Write-Host "[2/6] Creating solution container..." -ForegroundColor Yellow
$solutionName = "RFPAutoDiligence"
$solutionPrefix = "rfp"

if (-not $DryRun) {
    # Check if solution exists
    $existingSolution = pac solution list 2>&1 | Select-String $solutionName
    if ($existingSolution) {
        Write-Host "  ⏭ Solution '$solutionName' already exists" -ForegroundColor Gray
    } else {
        # Create solution via PAC
        pac solution create --publisher-name "RFPPublisher" --publisher-prefix $solutionPrefix --name $solutionName
        Write-Host "  ✓ Solution '$solutionName' created with prefix '$solutionPrefix'" -ForegroundColor Green
    }
} else {
    Write-Host "  [DRY RUN] Would create solution '$solutionName'" -ForegroundColor Gray
}

# --- Step 3: Generate table definitions ---
Write-Host "[3/6] Preparing table definitions..." -ForegroundColor Yellow

# Table 1: rfp_ofertas — generate XML metadata
$ofertasTableXml = @"
<?xml version="1.0" encoding="utf-8"?>
<Entity xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Name>cr_rfp_ofertas</Name>
  <DisplayName>RFP Ofertas</DisplayName>
  <DisplayCollectionName>RFP Ofertas</DisplayCollectionName>
  <Description>Tracks RFP/offers through the diligence pipeline</Description>
  <OwnershipType>OrganizationOwned</OwnershipType>
  <IsActivity>false</IsActivity>
</Entity>
"@

Write-Host "  ✓ Table definitions prepared" -ForegroundColor Green

# --- Step 4: Create tables via Web API ---
Write-Host "[4/6] Creating Dataverse tables via Web API..." -ForegroundColor Yellow

# Get access token from PAC
if (-not $DryRun) {
    # Use pac tool to get token
    $tokenInfo = pac auth token --resource $EnvironmentUrl 2>&1
    
    # Extract token (output format: "Token: eyJ...")
    $token = ($tokenInfo | Select-String "^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+").Matches.Value
    if (-not $token) {
        # Token might be the entire output
        $token = $tokenInfo.Trim()
    }

    $headers = @{
        "Authorization" = "Bearer $token"
        "OData-MaxVersion" = "4.0"
        "OData-Version" = "4.0"
        "Content-Type" = "application/json"
        "Accept" = "application/json"
        "MSCRM.SuppressDuplicateDetection" = "false"
    }

    $apiUrl = "$EnvironmentUrl/api/data/v9.2"

    # --- Create Table: rfp_ofertas ---
    Write-Host "  Creating table rfp_ofertas..." -ForegroundColor Yellow
    
    $tablePayload = @{
        "SchemaName" = "rfp_ofertas"
        "DisplayName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "RFP Ofertas"; "LanguageCode" = 1046 }) }
        "DisplayCollectionName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "RFP Ofertas"; "LanguageCode" = 1046 }) }
        "Description" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "Tracks RFP/offers through the diligence pipeline"; "LanguageCode" = 1046 }) }
        "OwnershipType" = "OrganizationOwned"
        "HasActivities" = $false
        "PrimaryNameAttribute" = "rfp_email_subject"
        "Attributes" = @(
            @{
                "AttributeType" = "String"
                "SchemaName" = "rfp_email_subject"
                "MaxLength" = 500
                "DisplayName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "Email Subject"; "LanguageCode" = 1046 }) }
                "@odata.type" = "Microsoft.Dynamics.CRM.StringAttributeMetadata"
                "RequiredLevel" = @{ "Value" = "ApplicationRequired" }
            }
        )
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod -Uri "$apiUrl/EntityDefinitions" -Method Post -Headers $headers -Body $tablePayload
        Write-Host "  ✓ Table rfp_ofertas created" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 409 -or $_ -match "already exists") {
            Write-Host "  ⏭ Table rfp_ofertas already exists" -ForegroundColor Gray
        } else {
            Write-Host "  ⚠ Error creating rfp_ofertas: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "  Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }

    # --- Add columns to rfp_ofertas ---
    Write-Host "  Adding columns to rfp_ofertas..." -ForegroundColor Yellow

    $columns = @(
        @{ Schema="rfp_email_from"; Type="String"; Label="Email From"; MaxLen=200; Required=$true },
        @{ Schema="rfp_client"; Type="String"; Label="Client"; MaxLen=200; Required=$false },
        @{ Schema="rfp_horizontal"; Type="String"; Label="Horizontal"; MaxLen=200; Required=$false },
        @{ Schema="rfp_sharepoint_folder"; Type="String"; Label="SharePoint Folder"; MaxLen=500; Required=$true },
        @{ Schema="rfp_report_url"; Type="String"; Label="Report URL"; MaxLen=500; Required=$false },
        @{ Schema="rfp_error_message"; Type="String"; Label="Error Message"; MaxLen=2000; Required=$false },
        @{ Schema="rfp_classification_json"; Type="Memo"; Label="Classification JSON"; MaxLen=10000; Required=$false },
        @{ Schema="rfp_gonogo_json"; Type="Memo"; Label="GO/NO-GO JSON"; MaxLen=10000; Required=$false }
    )

    foreach ($col in $columns) {
        $attrPayload = @{
            "SchemaName" = $col.Schema
            "DisplayName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = $col.Label; "LanguageCode" = 1046 }) }
            "RequiredLevel" = @{ "Value" = if ($col.Required) { "ApplicationRequired" } else { "None" } }
        }

        if ($col.Type -eq "String") {
            $attrPayload["@odata.type"] = "Microsoft.Dynamics.CRM.StringAttributeMetadata"
            $attrPayload["AttributeType"] = "String"
            $attrPayload["MaxLength"] = $col.MaxLen
            $attrPayload["FormatName"] = @{ "Value" = "Text" }
        } elseif ($col.Type -eq "Memo") {
            $attrPayload["@odata.type"] = "Microsoft.Dynamics.CRM.MemoAttributeMetadata"
            $attrPayload["AttributeType"] = "Memo"
            $attrPayload["MaxLength"] = $col.MaxLen
        }

        $body = $attrPayload | ConvertTo-Json -Depth 10
        try {
            Invoke-RestMethod -Uri "$apiUrl/EntityDefinitions(LogicalName='rfp_ofertas')/Attributes" -Method Post -Headers $headers -Body $body
            Write-Host "    ✓ $($col.Schema)" -ForegroundColor Green
        } catch {
            if ($_ -match "already exists") {
                Write-Host "    ⏭ $($col.Schema) already exists" -ForegroundColor Gray
            } else {
                Write-Host "    ⚠ $($col.Schema): $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }

    # Add DateTime columns
    $dateColumns = @(
        @{ Schema="rfp_email_received"; Label="Email Received"; Required=$true },
        @{ Schema="rfp_deadline"; Label="Submission Deadline"; Required=$false },
        @{ Schema="rfp_processing_started"; Label="Processing Started"; Required=$false },
        @{ Schema="rfp_processing_completed"; Label="Processing Completed"; Required=$false }
    )

    foreach ($col in $dateColumns) {
        $attrPayload = @{
            "@odata.type" = "Microsoft.Dynamics.CRM.DateTimeAttributeMetadata"
            "AttributeType" = "DateTime"
            "SchemaName" = $col.Schema
            "DisplayName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = $col.Label; "LanguageCode" = 1046 }) }
            "RequiredLevel" = @{ "Value" = if ($col.Required) { "ApplicationRequired" } else { "None" } }
            "Format" = "DateAndTime"
        } | ConvertTo-Json -Depth 10

        try {
            Invoke-RestMethod -Uri "$apiUrl/EntityDefinitions(LogicalName='rfp_ofertas')/Attributes" -Method Post -Headers $headers -Body $attrPayload
            Write-Host "    ✓ $($col.Schema)" -ForegroundColor Green
        } catch {
            if ($_ -match "already exists") { Write-Host "    ⏭ $($col.Schema) exists" -ForegroundColor Gray }
            else { Write-Host "    ⚠ $($col.Schema): $($_.Exception.Message)" -ForegroundColor Red }
        }
    }

    # Add Integer columns
    $intColumns = @(
        @{ Schema="rfp_a_validar_count"; Label="A_VALIDAR Count" },
        @{ Schema="rfp_processing_duration_sec"; Label="Duration (seconds)" },
        @{ Schema="rfp_raw_extract_chars"; Label="Raw Extract Size" },
        @{ Schema="rfp_attachment_count"; Label="Attachment Count" }
    )

    foreach ($col in $intColumns) {
        $attrPayload = @{
            "@odata.type" = "Microsoft.Dynamics.CRM.IntegerAttributeMetadata"
            "AttributeType" = "Integer"
            "SchemaName" = $col.Schema
            "DisplayName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = $col.Label; "LanguageCode" = 1046 }) }
            "RequiredLevel" = @{ "Value" = "None" }
            "MinValue" = 0
            "MaxValue" = 2147483647
        } | ConvertTo-Json -Depth 10

        try {
            Invoke-RestMethod -Uri "$apiUrl/EntityDefinitions(LogicalName='rfp_ofertas')/Attributes" -Method Post -Headers $headers -Body $attrPayload
            Write-Host "    ✓ $($col.Schema)" -ForegroundColor Green
        } catch {
            if ($_ -match "already exists") { Write-Host "    ⏭ $($col.Schema) exists" -ForegroundColor Gray }
            else { Write-Host "    ⚠ $($col.Schema): $($_.Exception.Message)" -ForegroundColor Red }
        }
    }

    # Add Decimal column (weighted score)
    $decPayload = @{
        "@odata.type" = "Microsoft.Dynamics.CRM.DecimalAttributeMetadata"
        "AttributeType" = "Decimal"
        "SchemaName" = "rfp_weighted_score"
        "DisplayName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "Weighted Score"; "LanguageCode" = 1046 }) }
        "RequiredLevel" = @{ "Value" = "None" }
        "Precision" = 2
        "MinValue" = 0
        "MaxValue" = 5
    } | ConvertTo-Json -Depth 10

    try {
        Invoke-RestMethod -Uri "$apiUrl/EntityDefinitions(LogicalName='rfp_ofertas')/Attributes" -Method Post -Headers $headers -Body $decPayload
        Write-Host "    ✓ rfp_weighted_score" -ForegroundColor Green
    } catch {
        if ($_ -match "already exists") { Write-Host "    ⏭ rfp_weighted_score exists" -ForegroundColor Gray }
        else { Write-Host "    ⚠ rfp_weighted_score: $($_.Exception.Message)" -ForegroundColor Red }
    }

    # Add Currency column (estimated value)
    $currPayload = @{
        "@odata.type" = "Microsoft.Dynamics.CRM.MoneyAttributeMetadata"
        "AttributeType" = "Money"
        "SchemaName" = "rfp_estimated_value"
        "DisplayName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "Estimated Value"; "LanguageCode" = 1046 }) }
        "RequiredLevel" = @{ "Value" = "None" }
        "Precision" = 2
    } | ConvertTo-Json -Depth 10

    try {
        Invoke-RestMethod -Uri "$apiUrl/EntityDefinitions(LogicalName='rfp_ofertas')/Attributes" -Method Post -Headers $headers -Body $currPayload
        Write-Host "    ✓ rfp_estimated_value" -ForegroundColor Green
    } catch {
        if ($_ -match "already exists") { Write-Host "    ⏭ rfp_estimated_value exists" -ForegroundColor Gray }
        else { Write-Host "    ⚠ rfp_estimated_value: $($_.Exception.Message)" -ForegroundColor Red }
    }

    # Add Choice columns (status, recommendation, offer_type)
    Write-Host "  Adding choice columns..." -ForegroundColor Yellow

    # Status choice
    $statusPayload = @{
        "@odata.type" = "Microsoft.Dynamics.CRM.PicklistAttributeMetadata"
        "AttributeType" = "Picklist"
        "SchemaName" = "rfp_status"
        "DisplayName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "Status"; "LanguageCode" = 1046 }) }
        "RequiredLevel" = @{ "Value" = "ApplicationRequired" }
        "OptionSet" = @{
            "@odata.type" = "Microsoft.Dynamics.CRM.OptionSetMetadata"
            "IsGlobal" = $false
            "OptionSetType" = "Picklist"
            "Options" = @(
                @{ "Value" = 100000000; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "RECEIVED"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000001; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "PROCESSING"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000002; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "SCORED"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000003; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "COMPLETED"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000004; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "FAILED"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000005; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "PARSE_ERROR"; "LanguageCode" = 1046 }) } }
            )
        }
        "DefaultFormValue" = 100000000
    } | ConvertTo-Json -Depth 15

    try {
        Invoke-RestMethod -Uri "$apiUrl/EntityDefinitions(LogicalName='rfp_ofertas')/Attributes" -Method Post -Headers $headers -Body $statusPayload
        Write-Host "    ✓ rfp_status (6 choices)" -ForegroundColor Green
    } catch {
        if ($_ -match "already exists") { Write-Host "    ⏭ rfp_status exists" -ForegroundColor Gray }
        else { Write-Host "    ⚠ rfp_status: $($_.Exception.Message)" -ForegroundColor Red }
    }

    # Recommendation choice
    $recPayload = @{
        "@odata.type" = "Microsoft.Dynamics.CRM.PicklistAttributeMetadata"
        "AttributeType" = "Picklist"
        "SchemaName" = "rfp_recommendation"
        "DisplayName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "Recommendation"; "LanguageCode" = 1046 }) }
        "RequiredLevel" = @{ "Value" = "None" }
        "OptionSet" = @{
            "@odata.type" = "Microsoft.Dynamics.CRM.OptionSetMetadata"
            "IsGlobal" = $false
            "OptionSetType" = "Picklist"
            "Options" = @(
                @{ "Value" = 100000000; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "GO"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000001; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "GO_CONDITIONAL"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000002; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "NO_GO"; "LanguageCode" = 1046 }) } }
            )
        }
    } | ConvertTo-Json -Depth 15

    try {
        Invoke-RestMethod -Uri "$apiUrl/EntityDefinitions(LogicalName='rfp_ofertas')/Attributes" -Method Post -Headers $headers -Body $recPayload
        Write-Host "    ✓ rfp_recommendation (3 choices)" -ForegroundColor Green
    } catch {
        if ($_ -match "already exists") { Write-Host "    ⏭ rfp_recommendation exists" -ForegroundColor Gray }
        else { Write-Host "    ⚠ rfp_recommendation: $($_.Exception.Message)" -ForegroundColor Red }
    }

    # Offer type choice
    $typePayload = @{
        "@odata.type" = "Microsoft.Dynamics.CRM.PicklistAttributeMetadata"
        "AttributeType" = "Picklist"
        "SchemaName" = "rfp_offer_type"
        "DisplayName" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "Offer Type"; "LanguageCode" = 1046 }) }
        "RequiredLevel" = @{ "Value" = "None" }
        "OptionSet" = @{
            "@odata.type" = "Microsoft.Dynamics.CRM.OptionSetMetadata"
            "IsGlobal" = $false
            "OptionSetType" = "Picklist"
            "Options" = @(
                @{ "Value" = 100000000; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "RFP"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000001; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "RFI"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000002; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "RFQ"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000003; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "PROACTIVE"; "LanguageCode" = 1046 }) } },
                @{ "Value" = 100000004; "Label" = @{ "@odata.type" = "Microsoft.Dynamics.CRM.Label"; "LocalizedLabels" = @(@{ "Label" = "OTHER"; "LanguageCode" = 1046 }) } }
            )
        }
    } | ConvertTo-Json -Depth 15

    try {
        Invoke-RestMethod -Uri "$apiUrl/EntityDefinitions(LogicalName='rfp_ofertas')/Attributes" -Method Post -Headers $headers -Body $typePayload
        Write-Host "    ✓ rfp_offer_type (5 choices)" -ForegroundColor Green
    } catch {
        if ($_ -match "already exists") { Write-Host "    ⏭ rfp_offer_type exists" -ForegroundColor Gray }
        else { Write-Host "    ⚠ rfp_offer_type: $($_.Exception.Message)" -ForegroundColor Red }
    }

} else {
    Write-Host "  [DRY RUN] Would create tables and columns via Web API" -ForegroundColor Gray
}

# --- Step 5: Publish customizations ---
Write-Host "[5/6] Publishing customizations..." -ForegroundColor Yellow
if (-not $DryRun) {
    try {
        Invoke-RestMethod -Uri "$apiUrl/PublishAllXml" -Method Post -Headers $headers
        Write-Host "  ✓ Customizations published" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ Publish failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# --- Step 6: Verify ---
Write-Host "[6/6] Verifying tables..." -ForegroundColor Yellow
if (-not $DryRun) {
    try {
        $table = Invoke-RestMethod -Uri "$apiUrl/EntityDefinitions(LogicalName='rfp_ofertas')?`$select=LogicalName,DisplayName" -Method Get -Headers $headers
        Write-Host "  ✓ rfp_ofertas verified" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ rfp_ofertas NOT found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host " Dataverse deployment complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTE: Table rfp_scorecarditem will be created in a follow-up"
Write-Host "      script after rfp_ofertas is confirmed."
