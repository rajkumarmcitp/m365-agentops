# SharePoint List Column Setup Guide

## 🎯 Current Status

✅ **Text & Date Columns**: Successfully created
❌ **Choice Columns**: Require manual setup or PowerShell

The JavaScript/Graph API script has limitations with choice column creation. Use one of the methods below:

---

## 🔧 Option 1: Manual Setup via SharePoint UI (EASIEST - 5 minutes)

### For SelfServiceRequests List:

1. **Go to SharePoint**: https://nasstech.sharepoint.com → Find "SelfServiceRequests" list
2. **Add Column**: Click "Add column" button
3. **Create Choice Columns** (repeat for each):

#### Service
- **Name**: Service
- **Type**: Choice
- **Choices** (one per line):
  ```
  Exchange
  Teams
  SharePoint
  M365 Groups
  User Management
  Other
  ```

#### Status
- **Name**: Status
- **Type**: Choice
- **Choices**:
  ```
  Submitted
  Approved
  Rejected
  Completed
  Cancelled
  ```

#### Priority
- **Name**: Priority
- **Type**: Choice
- **Choices**:
  ```
  Low
  Normal
  High
  Critical
  ```

### For SelfServiceApprovals List:

#### Status
- **Name**: Status
- **Type**: Choice
- **Choices**:
  ```
  Pending
  Approved
  Rejected
  ```

#### ApprovalLevel
- **Name**: ApprovalLevel
- **Type**: Choice
- **Choices**:
  ```
  Manager
  Admin
  Executive
  ```

### For SelfServiceAudit List:

#### Action
- **Name**: Action
- **Type**: Choice
- **Choices**:
  ```
  Submitted
  Approved
  Rejected
  Completed
  Commented
  Delegated
  Escalated
  ```

---

## 📜 Option 2: PowerShell Script (Automated)

### Prerequisites:
```bash
# Install PnP PowerShell
Install-Module PnP.PowerShell -Scope CurrentUser
```

### Steps:
1. Update the `$SiteUrl` in `scripts/add-choice-columns.ps1` with your actual site URL
2. Run the script:
   ```powershell
   .\scripts\add-choice-columns.ps1
   ```

---

## 💻 Option 3: Graph API with Correct Payload

The Graph API requires a specific payload structure. The issue was with how choice columns are represented.

For future reference, the correct format should be:
```json
{
  "name": "ColumnName",
  "columnType": "choice",
  "choice": {
    "choices": ["Option1", "Option2"],
    "allowMultipleSelection": false,
    "displayAs": "dropDownMenu"
  }
}
```

However, this endpoint may have limitations depending on your Graph API version.

---

## ✅ Verification

After adding columns, verify they appear in SharePoint:

1. Go to each list
2. Click "Settings" → "List Settings"
3. Look under "Columns" section
4. Confirm all columns are present

---

## 🚀 Next Steps After Column Setup

Once all columns are created:

1. **Restart Backend**:
   ```bash
   pkill -f "node backend/server.js"
   npm run dev  # This starts both backend and frontend
   ```

2. **Test the Portal**:
   - Open http://localhost:5173
   - Submit a request
   - Check if it appears in SharePoint SelfServiceRequests list

3. **Test Admin Workflow**:
   - View the request in admin dashboard
   - Approve or reject it
   - Verify status updates in SharePoint

---

## 🆘 Troubleshooting

**Issue**: "Field with name X already exists"
- **Solution**: The column is already there, skip it

**Issue**: Choice columns not appearing
- **Solution**: Refresh SharePoint page, browser cache might be outdated

**Issue**: Backend still saying "Field not recognized"
- **Solution**: Restart the backend server after adding columns

---

## 📊 Completion Checklist

- [ ] SelfServiceRequests list has Service, Status, Priority columns
- [ ] SelfServiceApprovals list has Status, ApprovalLevel columns
- [ ] SelfServiceAudit list has Action column
- [ ] All columns are set to "Choice" type with correct values
- [ ] Backend server restarted
- [ ] Can submit request without error
- [ ] Request appears in SharePoint list
