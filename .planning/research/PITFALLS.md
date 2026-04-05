# Pitfalls Research — Power Platform RFP Automation

## P1: AI Builder Credit Exhaustion

**What goes wrong:** AI Builder credits run out mid-month, blocking all AI operations. Flows fail silently or return empty results.

**Warning signs:**
- Increasing `429 Too Many Requests` errors in flow run history
- AI Builder prompts returning empty or truncated responses
- Monthly credit consumption spiking unexpectedly

**Prevention:**
- Check credits BEFORE deployment: Admin Center → AI Builder → Credits
- Budget: ~4 credits per offer × ~15 offers/month = ~60 credits/month
- Set alert at 80% consumption
- If credits run low: reduce prompt complexity or process fewer pages

**Phase:** Sprint 0 (verify during setup)

---

## P2: Token Limit Exceeded for Large Documents

**What goes wrong:** RFP PDFs can be 50-100+ pages. Concatenating all text into a single AI Builder prompt exceeds the GPT-4o context window (~128K tokens). The call fails or silently truncates.

**Warning signs:**
- AI Builder returns `context_length_exceeded` error
- Classification returns wrong results (saw only first 10% of document)
- `A_VALIDAR` on fields that are clearly in the document

**Prevention:**
- **Chunk strategy:** Process first 30 pages for classification (Prompt 1), then targeted sections for field extraction (Prompt 2)
- **Page range parameter:** Use AI Builder's page range feature to extract specific pages
- **Summarize-then-analyze:** Use a cheap first pass to identify key sections, then deep-analyze only those
- **Character limit:** Truncate `raw_extract` to 100K characters before passing to prompts

**Phase:** Sprint 1 (prompt design)

---

## P3: JSON Parse Failures from AI Outputs

**What goes wrong:** AI Builder prompts return text that isn't valid JSON — maybe with markdown formatting, trailing commas, or natural language mixed in. Power Automate's `Parse JSON` action fails.

**Warning signs:**
- `Parse JSON` action fails with "Invalid type" or "Expected value"
- Flow succeeds but Dataverse record has null values

**Prevention:**
- Add explicit instruction in prompts: "Return ONLY valid JSON, no markdown, no comments"
- Set temperature to 0.1 (minimize creative deviation)
- Add a `Compose` action to clean output before parsing (strip ```json markers)
- Add try/catch: if parse fails, save raw output to SharePoint + mark status = PARSE_ERROR
- **Test with 5+ real offers** before going to production

**Phase:** Sprint 1 (prompt testing)

---

## P4: Power Automate Connection Expiration

**What goes wrong:** OAuth connections used by Power Automate expire or get revoked (e.g., password change, admin policy). Flows fail silently.

**Warning signs:**
- Flows suddenly stop running
- "Connection is not available" in run history
- Outlook connector shows "Invalid connection"

**Prevention:**
- Use a **service account** for flow connections (not personal account)
- Set up **connection monitoring** in Power Platform Admin Center
- Re-authenticate quarterly as preventive maintenance
- Configure **email alerts** on flow failures

**Phase:** Sprint 0 (setup)

---

## P5: SharePoint Folder Name Conflicts

**What goes wrong:** Two offers arrive simultaneously or with identical subjects. Folder creation fails or overwrites existing offer data.

**Warning signs:**
- Missing offer data in SharePoint
- Flow fails at "Create folder" action
- Two different offers mixed in same folder

**Prevention:**
- Use **unique offer ID** in folder name: `OFR-{yyyyMMdd-HHmmss}` (timestamp-based)
- Never use email subject as folder name (subjects repeat)
- Add error handling on "Create folder" with retry using modified ID

**Phase:** Sprint 1 (Flow 1 design)

---

## P6: Content Moderation Blocking Legitimate Content

**What goes wrong:** Microsoft content safety filters block AI Builder prompts that contain legal/contractual language (penalties, liability clauses). The prompt returns nothing.

**Warning signs:**
- AI Builder returns "content moderation" error
- Scoring prompt fails for offers with aggressive SLA penalties
- Empty results for specific offers but not others

**Prevention:**
- Frame prompts as "business analysis" not "generate content"
- If triggered: split the problematic section, summarize first, then analyze summary
- Document which types of content trigger filters for the support team

**Phase:** Sprint 1 (prompt testing)

---

## P7: Word Template Field Mapping Breaks

**What goes wrong:** Word Online "Populate template" action fails because: (a) content controls in the .docx don't match field names in the flow, (b) field contains too-long text that overflows, or (c) special characters break XML.

**Warning signs:**
- "Populate template" action fails with "Invalid content control"
- Generated PDF has missing sections or garbage characters
- Template works in test but fails with real data

**Prevention:**
- **Build template with Content Controls** (not merge fields) in Word Desktop
- **Test with longest possible values** for each field
- Sanitize all AI outputs before inserting (strip special XML characters: &, <, >)
- Keep a **backup template** in SharePoint /Templates/

**Phase:** Sprint 1 (Flow 3 design)

---

## P8: Mailbox Permissions for Shared Mailbox

**What goes wrong:** Power Automate's Outlook V3 trigger can't access the "Ofertas DN" shared mailbox because the service account doesn't have delegate permissions.

**Warning signs:**
- Flow trigger never fires despite new emails arriving
- "Mailbox not found" or "Access denied" errors

**Prevention:**
- Grant **Full Access** or **Read** delegate permissions on "Ofertas DN" to the flow owner
- Test trigger with a manual email BEFORE building the rest of the flow
- Alternative: use "Shared Mailbox" parameter in the V3 trigger (requires exact mailbox address)

**Phase:** Sprint 0 (setup)
