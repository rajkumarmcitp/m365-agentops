(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=i(n);fetch(n.href,a)}})();const jt=[{id:"priya",name:"Priya Kumar",email:"priya@contoso.com",role:"user",initials:"PK",color:"#0C447C",navAccess:["portal","myreqs","chat"]},{id:"sanjay",name:"Sanjay Kumar",email:"sanjay@contoso.com",role:"manager",initials:"SK",color:"#3C3489",navAccess:["approvals","portal","myreqs","chat"],pendingApprovals:3},{id:"chen",name:"Chen Wei",email:"chen@contoso.com",role:"admin",initials:"CW",color:"#633806",navAccess:["dashboard","requests","security","zerotrust","privaccts","m365config","licenses","agents","msgcenter","applications","intune","portal","myreqs","chat","audit","settings"]},{id:"aisha",name:"Aisha Raza",email:"aisha@contoso.com",role:"super",initials:"AR",color:"#791F1F",navAccess:["dashboard","requests","security","zerotrust","privaccts","m365config","licenses","agents","msgcenter","applications","intune","portal","myreqs","chat","audit","settings","graphapi","sso"]}],bi="modulepreload",xi=function(e){return"/"+e},ct={},Ht=function(t,i,s){let n=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),o=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));n=Promise.allSettled(i.map(c=>{if(c=xi(c),c in ct)return;ct[c]=!0;const l=c.endsWith(".css"),u=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const y=document.createElement("link");if(y.rel=l?"stylesheet":bi,l||(y.as="script"),y.crossOrigin="",y.href=c,o&&y.setAttribute("nonce",o),document.head.appendChild(y),l)return new Promise((re,W)=>{y.addEventListener("load",re),y.addEventListener("error",()=>W(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(r){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r}return n.then(r=>{for(const o of r||[])o.status==="rejected"&&a(o.reason);return t().catch(a)})};function wi(){const e=document.getElementById("app-header"),t=d.currentUser;t&&(e.innerHTML=`
    <div class="header-brand">
      <div class="brand-icon"><i class="ti ti-shield-bolt"></i></div>
      <span>M365 AgentOps</span>
    </div>
    <div class="header-spacer"></div>
    <div class="header-actions">
      <button class="header-icon-btn" title="Notifications" id="hdr-bell">
        <i class="ti ti-bell"></i>
        <span class="bell-badge"></span>
      </button>
      <button class="header-icon-btn" title="Admin Settings" id="hdr-settings">
        <i class="ti ti-settings"></i>
      </button>
      <div class="user-avatar" style="background:${t.color}" title="${t.name} — ${t.email}">${t.initials}</div>
      <span class="role-badge ${t.role}">${t.role}</span>
      <button class="signout-btn" id="hdr-signout">
        <i class="ti ti-logout"></i> Sign out
      </button>
    </div>
  `,document.getElementById("hdr-settings").addEventListener("click",async()=>{var i;(i=d.currentUser)!=null&&i.navAccess.includes("settings")&&await x("settings")}),document.getElementById("hdr-signout").addEventListener("click",()=>{d.currentUser=null,Ht(()=>Promise.resolve().then(()=>fi),void 0).then(i=>{document.getElementById("app").innerHTML="",window.location.reload()})}))}const oe={admin:[{id:"dashboard",label:"Dashboard",icon:"ti-layout-dashboard"},{id:"requests",label:"Requests",icon:"ti-inbox",badge:"7",badgeCls:"blue"},{id:"security",label:"Security",icon:"ti-shield-exclamation",badge:"3",badgeCls:"red"},{id:"zerotrust",label:"Zero Trust",icon:"ti-lock-check",badge:"2",badgeCls:"amber"},{id:"privaccts",label:"Privileged Accounts",icon:"ti-crown",badge:"2",badgeCls:"red"},{id:"m365config",label:"M365 Config",icon:"ti-settings-2",badge:"4",badgeCls:"amber"},{id:"msgcenter",label:"Change Intelligence",icon:"ti-antenna",badge:"8",badgeCls:"red"},{id:"applications",label:"Entra Apps",icon:"ti-app-window",badge:"2",badgeCls:"red"},{id:"intune",label:"Intune Insights",icon:"ti-device-laptop",badge:"2",badgeCls:"red"},{id:"licenses",label:"Licenses",icon:"ti-license"},{id:"agents",label:"AI Agents",icon:"ti-robot"}],selfservice:[{id:"portal",label:"Portal",icon:"ti-grid-dots"},{id:"myreqs",label:"My Requests",icon:"ti-list-check"},{id:"chat",label:"AI Copilot",icon:"ti-message-circle"}],manager:[{id:"approvals",label:"Pending Approvals",icon:"ti-check-list",badge:"3",badgeCls:"red"}],config:[{id:"audit",label:"Audit Log",icon:"ti-database"},{id:"settings",label:"Admin Settings",icon:"ti-adjustments-horizontal"}],super:[{id:"graphapi",label:"Graph API",icon:"ti-api",badge:"Live",badgeCls:"green"},{id:"sso",label:"SSO / Entra ID",icon:"ti-key"}]};function Ai(){const e=document.getElementById("sidebar"),t=d.currentUser;if(!t||!e)return;const i=t.navAccess;let s=`
    <div class="nav-logo">
      <div class="nav-logo-icon"><i class="ti ti-shield-bolt"></i></div>
      <div>
        <div class="nav-logo-text">M365 AgentOps</div>
        <div class="nav-logo-sub">Contoso.com</div>
      </div>
    </div>
  `;const n=l=>l.filter(u=>i.includes(u.id)).map(u=>`
      <div class="nav-item" id="n-${u.id}" data-page="${u.id}">
        <i class="ti ${u.icon}"></i>
        <span class="nav-label">${u.label}</span>
        ${u.badge?`<span class="nav-badge ${u.badgeCls}">${u.badge}</span>`:""}
      </div>
    `).join(""),a=n(oe.admin);if(a&&(s+=`<div class="nav-section"><div class="nav-section-label">Administration</div>${a}</div>`),t.role==="manager"){const l=n(oe.manager);l&&(s+=`<div class="nav-section"><div class="nav-section-label">Approvals</div>${l}</div>`)}const r=n(oe.selfservice);r&&(s+=`<div class="nav-divider"></div><div class="nav-section"><div class="nav-section-label">Self-Service</div>${r}</div>`);const o=n(oe.config),c=n(oe.super);(o||c)&&(s+=`<div class="nav-divider"></div><div class="nav-section"><div class="nav-section-label">Config</div>${o}${c}</div>`),s+=`
    <div class="nav-footer">
      <strong>${t.name}</strong>
      ${t.email}
    </div>
  `,e.innerHTML=s,e.querySelectorAll(".nav-item").forEach(l=>{l.addEventListener("click",async()=>await x(l.dataset.page))})}const dt={success:"ti-circle-check",error:"ti-circle-x",warning:"ti-alert-triangle",info:"ti-info-circle"};function p(e,t="info",i=3500){const s=document.getElementById("toast-container");if(!s)return;const n=document.createElement("div");n.className=`toast ${t}`,n.innerHTML=`
    <i class="ti ${dt[t]||dt.info} toast-icon"></i>
    <span class="toast-text">${e}</span>
    <button class="toast-close"><i class="ti ti-x"></i></button>
  `,s.appendChild(n);const a=()=>{n.style.animation="toast-out 200ms ease forwards",setTimeout(()=>n.remove(),200)};n.querySelector(".toast-close").addEventListener("click",a),setTimeout(a,i)}const Si={auth:{clientId:"04d3be8d-d433-4367-893e-eccc82190a11",authority:"https://login.microsoftonline.com/b9cc8284-05ed-452f-877a-970779430dcb",redirectUri:window.location.origin+"/callback"},cache:{cacheLocation:"sessionStorage",storeAuthStateInCookie:!1},system:{allowNativeBroker:!1}},ki={scopes:["openid","profile","email","User.Read"]};let V=null;async function Ei(){try{if(!window.msal)return console.warn("MSAL not loaded yet"),null;V=new window.msal.PublicClientApplication(Si),await V.initialize();const e=await V.handleRedirectPromise();if(e)return console.log("✓ Authenticated from redirect:",e.account.name),e.account;const t=V.getAllAccounts();return t.length>0?(console.log("✓ Already authenticated as:",t[0].name),t[0]):null}catch(e){return console.error("MSAL init error:",e.message),null}}async function Ci(){try{if(!V)return console.error("MSAL not initialized"),null;const e=await V.loginPopup(ki);return console.log("✓ Login successful:",e.account.name),e.account}catch(e){return e.errorCode==="user_cancelled"?console.log("User cancelled login"):console.error("Login error:",e.errorCode,e.errorMessage),null}}const $i="https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api";async function ne(e){try{const t=`${$i}${e}`;console.log(`🔄 Calling: ${t}`);const i=await fetch(t,{method:"GET",headers:{"Content-Type":"application/json"},credentials:"include"});if(!i.ok)throw new Error(`HTTP ${i.status}: ${i.statusText}`);const s=await i.json();return console.log(`✓ ${e}:`,s),s}catch(t){return console.error(`✗ API error on ${e}:`,t.message),{success:!1,error:t.message,data:[],count:0}}}async function Wt(){return ne("/devices")}async function Pi(){return ne("/device-compliance-policies")}async function _t(){return ne("/security/score")}async function Mi(){return ne("/users")}async function Ri(){return ne("/applications")}async function Ii(){return ne("/service-principals")}const C={"Exchange Online":{icon:"ti-mail",color:"#854F0B",bg:"#FAEEDA"},"Microsoft Teams":{icon:"ti-brand-teams",color:"#3C3489",bg:"#EEEDFE"},"SharePoint Online":{icon:"ti-brand-sharepoint",color:"#3B6D11",bg:"#EAF3DE"},OneDrive:{icon:"ti-cloud",color:"#0C447C",bg:"#E6F1FB"},"Microsoft Entra ID":{icon:"ti-user-check",color:"#185FA5",bg:"#E6F1FB"},"Microsoft Intune":{icon:"ti-device-laptop",color:"#0C447C",bg:"#E6F1FB"},"Microsoft Copilot":{icon:"ti-sparkles",color:"#3C3489",bg:"#EEEDFE"},"Power Platform":{icon:"ti-bolt",color:"#3B6D11",bg:"#EAF3DE"},"Microsoft Defender":{icon:"ti-shield-exclamation",color:"#A32D2D",bg:"#FCEBEB"},"Microsoft 365":{icon:"ti-apps",color:"#185FA5",bg:"#E6F1FB"}},S=[{id:"MC892341",title:"Microsoft Teams: Legacy Authentication Methods Being Retired",service:"Microsoft Teams",category:"planForChange",severity:"high",actionRequired:!0,actionByDate:"2026-06-30",publishedDate:"2026-05-28",targetRelease:"2026-06-30",tags:["Authentication","Deprecation","Teams Phone"],status:"new",body:"Microsoft Teams will retire support for legacy authentication methods including ADAL and basic authentication. Applications relying on these methods will lose connectivity to Teams services after June 30, 2026. This affects all tenants using Teams-connected applications built on older MSAL v1 or ADAL libraries.",aiSummary:"Action required before 30 June 2026. Legacy Teams authentication (ADAL, MSAL v1, basic auth) will be disabled. All connected apps must migrate to MSAL v3 or Microsoft Identity platform. Failure to act will break Teams integrations post-deadline.",aiRec:{actionRequired:!0,impacted:["IT Administrators","App developers","Teams Phone users","ISV-connected apps"],deadline:"30 June 2026",tasks:["Audit all applications using legacy Teams authentication via Azure AD app registrations","Update app registrations to use MSAL v3 or Microsoft.Identity.Client","Run pilot migration with non-critical apps before June 15","Notify application owners and ISVs of the mandatory deadline","Update IT helpdesk runbook with migration guidance"],automatable:!0,automationNote:"Run GET /v1.0/applications?$filter=signInAudience to identify affected apps. Graph API can batch-update authentication settings."}},{id:"MC891567",title:"Exchange Online: Basic Authentication Enforcement — Final Phase",service:"Exchange Online",category:"planForChange",severity:"high",actionRequired:!0,actionByDate:"2026-07-15",publishedDate:"2026-05-26",targetRelease:"2026-07-15",tags:["Authentication","Exchange","SMTP Auth","Security"],status:"new",body:"Microsoft will enforce the final phase of Basic Authentication deprecation for Exchange Online. SMTP AUTH, POP3, and IMAP with basic authentication will be permanently blocked. Tenants with active usage will be automatically disabled on July 15, 2026.",aiSummary:"Final basic auth enforcement for Exchange. SMTP AUTH, POP3, IMAP basic auth permanently blocked from 15 July 2026. Any printers, scanners, legacy apps using basic SMTP must be reconfigured to OAuth or app passwords immediately.",aiRec:{actionRequired:!0,impacted:["Email admins","Helpdesk","Users with legacy email clients","Network printers/scanners"],deadline:"15 July 2026",tasks:["Run Exchange Online auth report to identify active basic auth connections","Migrate printers/scanners to OAuth or Direct Send (relay via SMTP no-auth)","Disable basic auth per-user via Authentication Policy before deadline","Identify users on legacy clients (Outlook 2010/2013) and upgrade","Create Conditional Access policy blocking basic auth as a safeguard"],automatable:!0,automationNote:"Use GET /reports/authenticationMethods/usersRegisteredByFeature and Exchange Online PowerShell Get-AuthenticationPolicy to identify all impacted connections."}},{id:"MC890234",title:"Microsoft Entra ID: Conditional Access — Mandatory MFA for All Admins",service:"Microsoft Entra ID",category:"preventOrFixIssue",severity:"high",actionRequired:!0,actionByDate:"2026-06-15",publishedDate:"2026-05-22",targetRelease:"2026-06-15",tags:["Conditional Access","MFA","Security","Admins"],status:"new",body:"Microsoft will enforce mandatory MFA for all users assigned privileged administrator roles in Microsoft Entra ID. Administrators who do not comply will be blocked from signing in to all Microsoft portals after June 15, 2026. This is a platform-level enforcement independent of existing Conditional Access policies.",aiSummary:"Critical: All privileged admins MUST have MFA registered by 15 June 2026 or lose portal access. This is a platform-level block, not just a CA policy recommendation. Review all admin accounts now — especially break-glass and shared admin accounts.",aiRec:{actionRequired:!0,impacted:["All Global Admins","All privileged role holders","Break-glass accounts","Service account admins"],deadline:"15 June 2026",tasks:["Run MFA registration report for all admin role holders via Entra ID","Force MFA enrollment for any admin without a registered method","Verify break-glass accounts have FIDO2 or certificate-based MFA","Update all shared admin accounts to use individual MFA-registered identities","Test all admin workflows post-enforcement in staging tenant"],automatable:!0,automationNote:"GET /reports/credentialUserRegistrationDetails to identify admin accounts without MFA. POST /users/{id}/authentication/requireReAuthentication to force re-registration."}},{id:"MC889456",title:"SharePoint Online: External Sharing Default Settings Update",service:"SharePoint Online",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-07-01",publishedDate:"2026-05-20",targetRelease:"2026-07-01",tags:["External Sharing","SharePoint","Governance","Security"],status:"read",body:'Microsoft will update the default external sharing settings for new SharePoint sites to "Existing guests only" (currently "New and existing guests"). Existing site sharing settings will not be changed. New sites created after July 1 will default to the more restrictive setting.',aiSummary:'New SharePoint sites will default to "Existing guests only" from 1 July. Existing sites unaffected. Review sites that need more permissive sharing before the change, and update provisioning templates to align with new defaults.',aiRec:{actionRequired:!0,impacted:["SharePoint admins","Site owners creating new collaboration spaces"],deadline:"1 July 2026",tasks:["Review and update SharePoint site provisioning templates",'Document sites requiring "New and existing guests" sharing — configure explicitly',"Communicate to project managers that new sites will be more restrictive","Update SharePoint governance policy documentation"],automatable:!1,automationNote:"Site-specific overrides require per-site configuration via PnP PowerShell. Bulk review via Get-SPOSite -Limit All."}},{id:"MC888765",title:"Microsoft Intune: Android Enterprise Enrollment Changes",service:"Microsoft Intune",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-08-01",publishedDate:"2026-05-18",targetRelease:"2026-08-01",tags:["Intune","Android","Enrollment","MDM"],status:"new",body:"Google is retiring Android Device Administrator (DA) enrollment in favor of Android Enterprise. Microsoft Intune will cease support for Android DA enrollment on August 1, 2026. All devices enrolled via DA must migrate to Android Enterprise (Work Profile or Fully Managed).",aiSummary:"Android Device Administrator enrollment retiring 1 August 2026 in Intune. All DA-enrolled Android devices must re-enroll as Android Enterprise. Affects BYOD users (Work Profile) and corporate-owned devices (Fully Managed). Coordinate with HR for BYOD re-enrollment.",aiRec:{actionRequired:!0,impacted:["Android device users","Intune admins","HR / BYOD programme owners"],deadline:"1 August 2026",tasks:["Run Intune device report to count DA-enrolled Android devices","Create Android Enterprise Work Profile enrollment profile","Test re-enrollment workflow with pilot group","Send communication to BYOD users with step-by-step guide","Set DA enrollment deprecation date in Intune portal"],automatable:!1,automationNote:"User re-enrollment is manual, but device inventory and policy creation can be automated via Intune Graph API."}},{id:"MC887234",title:"Power Platform: Premium Connector Policy Enforcement Update",service:"Power Platform",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-06-30",publishedDate:"2026-05-15",targetRelease:"2026-06-30",tags:["Power Platform","DLP","Connectors","Governance"],status:"new",body:'Microsoft is updating the default DLP policy classification for several connectors from "Business" to "Blocked" in default environments. This includes Dropbox, Twitter/X, and several AI builder connectors. Flows using these connectors in the Default environment will be suspended unless moved to an approved environment.',aiSummary:"DLP connector reclassification on 30 June: Dropbox, Twitter/X, and certain AI Builder connectors move to Blocked in Default environment. Power Automate flows using these will be suspended. Inventory all flows using affected connectors and migrate to isolated environments.",aiRec:{actionRequired:!0,impacted:["Power Platform admins","Citizen developers","Users with flows in Default environment"],deadline:"30 June 2026",tasks:["Inventory all Power Automate flows in Default environment using affected connectors","Create isolated non-default environments for legitimate business flows","Migrate flows to appropriate environments before deadline","Update DLP policies to explicitly classify approved connectors","Communicate impact to citizen developer community"],automatable:!0,automationNote:"Use Power Platform Admin APIs to enumerate flows: GET /providers/Microsoft.ProcessSimple/scopes/admin/environments/{env}/flows"}},{id:"MC886543",title:"Microsoft Teams: Meeting Recording Auto-Expiry Policy Enforcement",service:"Microsoft Teams",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-09-01",publishedDate:"2026-05-12",targetRelease:"2026-09-01",tags:["Teams","Meetings","Recording","Storage"],status:"read",body:"Microsoft will enforce a 120-day default auto-expiry for Teams meeting recordings stored in OneDrive and SharePoint. Recordings without an explicit expiry date set will have a 120-day expiry applied automatically. Users will be notified 14 days before expiry.",aiSummary:"Teams meeting recordings will auto-expire after 120 days from 1 September unless explicitly extended. Recordings older than 120 days will be deleted. Review compliance recordings and legal holds before deadline — these must be exempt via retention policies.",aiRec:{actionRequired:!0,impacted:["Teams users","Compliance admins","Legal team (holds)","Training content owners"],deadline:"1 September 2026",tasks:["Identify recordings that must be retained for compliance or legal hold","Apply retention labels to recordings that must not expire","Set up Purview retention policy for Teams recordings","Communicate auto-expiry policy to all users","Create process for users to request recording extension"],automatable:!0,automationNote:"Graph API: GET /drives/{id}/items to enumerate recordings. Apply retention labels via PATCH /drives/{driveId}/items/{itemId}."}},{id:"MC885678",title:"OneDrive: Storage Quota Policy Changes for Inactive Accounts",service:"OneDrive",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-08-15",publishedDate:"2026-05-10",targetRelease:"2026-08-15",tags:["OneDrive","Storage","Lifecycle","Governance"],status:"new",body:"Microsoft will automatically reduce the OneDrive storage allocation for inactive accounts to 1 GB after 180 days of inactivity. Data exceeding 1 GB will be retained but made read-only. Active storage usage policies require admin review of leaver accounts.",aiSummary:"OneDrive inactive accounts (180+ days) automatically reduced to 1 GB on 15 August. Excess data becomes read-only, not deleted. Review leaver accounts, export required data, and update joiner/mover/leaver processes to include OneDrive management.",aiRec:{actionRequired:!0,impacted:["IT admins managing leavers","HR / offboarding process owners"],deadline:"15 August 2026",tasks:["Run report of OneDrive accounts inactive for 90+ days","Export data from leaver accounts where required","Update offboarding runbook to include OneDrive review step","Identify accounts that legitimately need quota despite inactivity (shared project storage)","Configure lifecycle workflow to trigger OneDrive review on account disable"],automatable:!0,automationNote:"GET /users?$filter=signInActivity/lastSignInDateTime le datetime to identify inactive accounts."}},{id:"MC884321",title:"Microsoft Entra ID: MFA Registration Campaign — Mandatory Completion",service:"Microsoft Entra ID",category:"preventOrFixIssue",severity:"medium",actionRequired:!0,actionByDate:"2026-07-31",publishedDate:"2026-05-08",targetRelease:"2026-07-31",tags:["MFA","Entra ID","Security","Registration"],status:"actioned",body:"Microsoft is launching a mandatory MFA registration campaign for all users not yet registered for MFA. Users will be shown an MFA registration prompt at sign-in starting June 1 with a mandatory completion deadline of July 31. Users not registered by this date will be blocked from signing in.",aiSummary:"Mandatory MFA registration for all non-enrolled users. Registration prompts begin 1 June, sign-in block from 31 July for non-compliant users. Current coverage at 87% — 130 users still need to register. Prioritise by risk level.",aiRec:{actionRequired:!0,impacted:["~130 unregistered users in tenant","Helpdesk (increased registration calls expected)"],deadline:"31 July 2026",tasks:["Export MFA registration status report for all users","Contact the 130 unregistered users directly with registration instructions","Set up helpdesk ready-to-send article for MFA registration","Create exemption process for special cases (long-term sick, contractors)","Monitor registration progress weekly"],automatable:!1,automationNote:"GET /reports/credentialUserRegistrationDetails to track progress. Cannot auto-register users — requires user action."}},{id:"MC883456",title:"Microsoft Copilot: New Copilot for Microsoft 365 Features — General Availability",service:"Microsoft Copilot",category:"stayInformed",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-05-06",targetRelease:"2026-06-01",tags:["Copilot","AI","Productivity","New Feature"],status:"read",body:"Microsoft is releasing new Copilot capabilities including Copilot in Excel with data analysis enhancements, Copilot in Teams with improved meeting intelligence and real-time translation, and Copilot Pages for collaborative AI content creation.",aiSummary:"New Copilot features rolling out 1 June across Excel, Teams, and Pages. No action required — features auto-enable for licensed users. Consider communicating new capabilities to Copilot licence holders and updating adoption guidance.",aiRec:{actionRequired:!1,impacted:["All Microsoft 365 Copilot licence holders (~48 users)"],deadline:null,tasks:["Update Copilot adoption guide with new feature overview","Schedule lunch-and-learn for Copilot licence holders","Monitor usage analytics post-rollout"],automatable:!1,automationNote:"No automation available — informational only."}},{id:"MC882234",title:"Microsoft Teams: New Teams App Store Policy — Verified Publishers Only",service:"Microsoft Teams",category:"planForChange",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-05-04",targetRelease:"2026-07-01",tags:["Teams","Apps","Governance","Policy"],status:"new",body:'Microsoft Teams App Store will begin flagging apps from unverified publishers with a "Unverified" badge. Tenant admins can optionally restrict the store to only allow verified publisher apps. No automatic blocking will occur without admin action.',aiSummary:"Teams App Store will badge unverified publisher apps from 1 July. No blocking occurs automatically — admin must explicitly restrict to verified only. Review current approved app list and consider enabling verified-publisher-only policy for enhanced security.",aiRec:{actionRequired:!1,impacted:["Teams admins","End users using third-party Teams apps"],deadline:null,tasks:["Review currently approved Teams apps for publisher verification status","Consider enabling verified publisher restriction in Teams admin centre","Communicate upcoming badge change to end users"],automatable:!1,automationNote:"Teams app governance requires manual configuration in Teams Admin Centre."}},{id:"MC881567",title:"Microsoft Defender: Attack Simulation Training — New Social Engineering Templates",service:"Microsoft Defender",category:"stayInformed",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-05-02",targetRelease:"2026-05-15",tags:["Defender","Attack Simulation","Training","Security"],status:"read",body:"New attack simulation training templates are available including QR code phishing, Teams-based social engineering, and business email compromise (BEC) scenarios. Templates reflect the latest real-world threat actor techniques observed by Microsoft security researchers.",aiSummary:"New attack simulation templates available: QR code phishing, Teams social engineering, BEC scenarios. Schedule updated simulations to measure and improve user resilience. Current click rate is 8% — target <5% by Q3.",aiRec:{actionRequired:!1,impacted:["All users (security awareness training)"],deadline:null,tasks:["Schedule new QR code phishing simulation campaign","Review current 8% click-through rate and set Q3 improvement target","Update security awareness training content library"],automatable:!1,automationNote:"Campaign scheduling available via Microsoft Defender portal — no Graph API for this feature."}},{id:"MC880456",title:"Exchange Online: Transport Rule Migration to Mail Flow Rules V2",service:"Exchange Online",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-10-01",publishedDate:"2026-04-28",targetRelease:"2026-10-01",tags:["Exchange","Mail Flow","Transport Rules","Migration"],status:"new",body:"Microsoft will migrate all existing Exchange Online transport rules to the new Mail Flow Rules V2 engine on October 1, 2026. Rules using deprecated predicates or actions will be automatically disabled at migration. Review all transport rules and update any using deprecated conditions before the migration date.",aiSummary:"Transport rules using deprecated predicates automatically DISABLED on 1 October migration. Review all mail flow rules urgently — deprecated conditions silently fail. Run Exchange transport rule audit now and update before deadline.",aiRec:{actionRequired:!0,impacted:["Exchange admins","Email security team","Business processes relying on mail routing"],deadline:"1 October 2026",tasks:["Export all transport rules: Get-TransportRule | Export-Csv","Identify rules using deprecated predicates (see MC880456 documentation)","Rewrite deprecated rules using V2-compatible conditions","Test updated rules in Exchange test environment","Document mail flow rule inventory for change record"],automatable:!0,automationNote:"Get-TransportRule -ResultSize Unlimited via Exchange Online PowerShell. Microsoft provides migration validation script in MC documentation."}},{id:"MC879345",title:"Microsoft 365: Admin Center Unified Navigation — Phase 2 Rollout",service:"Microsoft 365",category:"stayInformed",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-04-25",targetRelease:"2026-06-15",tags:["Admin Center","UX","Navigation"],status:"read",body:"The Microsoft 365 Admin Center will receive Phase 2 of its unified navigation update, consolidating service-specific admin centres into a single navigation experience. The Exchange admin center, Teams admin center, and SharePoint admin center will be accessible from a unified left navigation.",aiSummary:"Admin portal navigation redesign Phase 2 rolling out 15 June. Exchange, Teams, and SharePoint admin centres unified under one navigation. No functional changes — purely UI update. Brief admins to avoid confusion post-rollout.",aiRec:{actionRequired:!1,impacted:["All IT administrators and helpdesk staff"],deadline:null,tasks:["Brief IT team on upcoming navigation changes","Update internal IT runbooks with new navigation paths","Communicate to end users if any self-service portal links change"],automatable:!1,automationNote:"No automation applicable — informational update."}},{id:"MC878234",title:"SharePoint Online: OOTB Page Layouts Retirement",service:"SharePoint Online",category:"planForChange",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-04-22",targetRelease:"2026-08-01",tags:["SharePoint","Page Layouts","Classic","Deprecation"],status:"dismissed",body:"Several classic SharePoint OOTB (out-of-the-box) page layouts are being retired as part of the ongoing migration to modern SharePoint. This primarily affects tenants using classic communication sites. Modern SharePoint sites are unaffected.",aiSummary:"Classic SharePoint OOTB page layouts retired 1 August. Only affects classic SharePoint sites (not modern). If tenant uses classic sites, inventory pages using retired layouts and migrate to modern pages. Modern SharePoint users: no action needed.",aiRec:{actionRequired:!1,impacted:["SharePoint admins with classic sites (may not apply)"],deadline:null,tasks:["Check if tenant has any classic SharePoint sites","If yes: inventory page layouts in use and plan migration to modern"],automatable:!1,automationNote:"Get-SPOSite -Template to identify classic vs modern sites."}},{id:"MC877456",title:"Microsoft Intune: Windows 11 Compliance Policy — New Security Baseline",service:"Microsoft Intune",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-07-15",publishedDate:"2026-04-20",targetRelease:"2026-07-15",tags:["Intune","Windows 11","Compliance","Security Baseline"],status:"new",body:"Microsoft is releasing a new Windows 11 security baseline for Intune. The updated baseline includes new requirements for TPM 2.0 verification, Secure Boot attestation, and Microsoft Pluton security processor checks. Existing Windows 10 baselines will continue to apply until August 2026.",aiSummary:"New Windows 11 Intune security baseline (TPM 2.0, Secure Boot, Pluton) available from 15 July. Review current device fleet for Windows 11 compatibility. Update compliance policies to adopt new baseline. Devices not meeting new requirements will show as non-compliant.",aiRec:{actionRequired:!0,impacted:["Intune admins","Windows device users","IT hardware team"],deadline:"15 July 2026",tasks:["Run Intune hardware attestation report to assess Windows 11 readiness","Review new security baseline requirements vs current fleet capabilities","Deploy new baseline in report-only mode first","Identify devices that will fail new baseline requirements","Plan hardware refresh for devices not meeting TPM 2.0 / Secure Boot requirements"],automatable:!0,automationNote:"GET /deviceManagement/managedDevices?$filter=operatingSystem eq 'Windows' to get device inventory. Hardware attestation details via GET /deviceManagement/managedDevices/{id}."}},{id:"MC876543",title:"Microsoft Copilot for Teams: Phone and Calling Intelligence — General Availability",service:"Microsoft Copilot",category:"stayInformed",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-04-18",targetRelease:"2026-06-01",tags:["Copilot","Teams Phone","AI","New Feature"],status:"new",body:"Microsoft Copilot for Teams Phone is entering general availability. Copilot can now summarise phone calls, extract action items, provide caller context before answering, and suggest follow-up tasks after calls — all in real time.",aiSummary:"Copilot for Teams Phone GA on 1 June. Call summaries, action item extraction, and caller intelligence added for Teams Phone users. Requires Microsoft 365 Copilot licence + Teams Phone System licence. Communicate to Teams Phone users and update adoption materials.",aiRec:{actionRequired:!1,impacted:["Teams Phone System users with Copilot licence (~48 users)"],deadline:null,tasks:["Communicate new Teams Phone Copilot features to phone system users","Update Teams calling adoption guide with AI features"],automatable:!1,automationNote:"Feature enables automatically for licensed users."}},{id:"MC875432",title:"Microsoft 365: Global Secure Access — General Availability",service:"Microsoft 365",category:"stayInformed",severity:"medium",actionRequired:!1,actionByDate:null,publishedDate:"2026-04-15",targetRelease:"2026-05-01",tags:["Global Secure Access","Zero Trust","Network","Security"],status:"read",body:"Microsoft Global Secure Access (the unified ZTNA platform including Microsoft Entra Internet Access and Entra Private Access) is now generally available. Tenants with E5 Security or Microsoft Entra Suite licences can begin deploying the Global Secure Access client for cloud-native network security.",aiSummary:"Global Secure Access (ZTNA) is now GA for E5 Security / Entra Suite licensed tenants. Enables Zero Trust network access without traditional VPN. Consider piloting for remote workers as a VPN replacement strategy. No action required if not deploying.",aiRec:{actionRequired:!1,impacted:["Network security team","Remote workers (potential benefit)","VPN infrastructure owners"],deadline:null,tasks:["Evaluate Global Secure Access as VPN replacement strategy","Review Entra Internet Access for web filtering use case","Consider pilot deployment for remote worker group"],automatable:!1,automationNote:"Requires Global Secure Access client deployment and Entra Private Access connector configuration."}},{id:"MC874321",title:"Exchange Online: DKIM Automatic Key Rotation — Now Enabled",service:"Exchange Online",category:"stayInformed",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-04-12",targetRelease:null,tags:["Exchange","DKIM","Email Security","Automatic"],status:"read",body:"Exchange Online will now automatically rotate DKIM keys every 6 months for domains with DKIM signing enabled. No admin action is required. Key rotation happens transparently with no email interruption. The new keys are published to DNS automatically via Microsoft-managed DNS.",aiSummary:"DKIM keys now auto-rotate every 6 months automatically. No admin action needed. If you manage your own DNS (not Microsoft-managed), you may need to ensure auto-rotation propagates correctly. Check your DNS provider setup.",aiRec:{actionRequired:!1,impacted:["Exchange admins (awareness only)"],deadline:null,tasks:["Verify DKIM is enabled for all domains: Get-DkimSigningConfig","If using external DNS provider: confirm DNS records update automatically"],automatable:!1,automationNote:"Automatic — no action needed if Microsoft manages DNS."}},{id:"MC873210",title:"Microsoft 365: License Overage Alert — Microsoft 365 E5 Critical",service:"Microsoft 365",category:"preventOrFixIssue",severity:"high",actionRequired:!0,actionByDate:"2026-06-10",publishedDate:"2026-04-10",targetRelease:null,tags:["Licensing","E5","Compliance","Cost"],status:"new",body:"Your tenant is approaching the Microsoft 365 E5 license capacity limit. Current consumption is 148/150 licences (98.7%). If licence count is exceeded, new assignments will fail and service access issues may occur. Review licence allocation immediately.",aiSummary:"CRITICAL: E5 licences at 98.7% (148/150). Only 2 remaining. Any new user onboarding with E5 will fail. Immediate action: review unused E5 assignments, reclaim from inactive users, or purchase additional licences before capacity breach.",aiRec:{actionRequired:!0,impacted:["IT admins","HR (new starters requiring E5)","Finance (licence cost)"],deadline:"10 June 2026",tasks:["Export E5 licence assignment list and identify inactive holders (90+ days no sign-in)","Reclaim E5 from 3-5 inactive users and reassign as E3 if appropriate","Submit budget request for additional E5 licences","Create licence capacity alert policy in Microsoft 365 Admin Center","Review E5 vs E3 feature need for existing holders — downgrade where E5 not used"],automatable:!0,automationNote:"GET /users?$filter=assignedLicenses/any(x:x/skuId eq {E5-SKU-ID}) and signInActivity/lastSignInDateTime le datetime combined to find inactive E5 holders."}}],O=[{id:"EX498712",title:"Exchange Online: Delays in Email Delivery",service:"Exchange Online",feature:"Mail flow",status:"serviceDegradation",severity:"medium",startTime:"Today 07:15",lastUpdated:"Today 09:30",nextUpdate:"11:00 today",userImpact:"Emails sent to external recipients may be delayed by up to 30 minutes. Internal mail flow is unaffected. Mail is queuing and will be delivered.",updates:[{time:"09:30",text:"Root cause identified: network routing issue in EU West datacentre. Fix being deployed."},{time:"08:45",text:"Investigation ongoing. Traffic being redirected to backup mail relay."},{time:"07:15",text:"Issue detected. Engineering team investigating increased mail delivery latency."}]},{id:"TM492341",title:"Microsoft Teams: Meeting Join Failures — EMEA Region",service:"Microsoft Teams",feature:"Audio/video calls",status:"investigating",severity:"high",startTime:"Today 06:42",lastUpdated:"Today 10:15",nextUpdate:"12:00 today",userImpact:"Users in the EMEA region are unable to join Teams meetings via browser client. Desktop client and mobile are unaffected. Workaround: join via Teams desktop app.",updates:[{time:"10:15",text:"Identified intermittent failures in EMEA Teams relay infrastructure. Traffic failover in progress."},{time:"08:00",text:"Issue scoped to EMEA region, specifically UK, Germany, and Netherlands users."},{time:"06:42",text:"Monitoring detected elevated Teams meeting join failure rate. Investigation started."}]},{id:"SP441892",title:"SharePoint Online: Search Indexing Delay",service:"SharePoint Online",feature:"Search",status:"serviceAdvisory",severity:"low",startTime:"Yesterday 18:30",lastUpdated:"Today 08:00",nextUpdate:"No update needed — advisory",userImpact:"Recently uploaded documents in SharePoint may not appear in search results for up to 2 hours. Documents are accessible via direct link or navigation — only search index is delayed.",updates:[{time:"08:00",text:"Advisory issued. Search indexing running at reduced speed due to scheduled maintenance. Expected to resolve by end of day."}]},{id:"AAD438712",title:"Microsoft Entra ID: Sign-in Latency in US East Region",service:"Microsoft Entra ID",feature:"User authentication",status:"resolved",severity:"medium",startTime:"Yesterday 14:20",lastUpdated:"Yesterday 17:45",nextUpdate:null,userImpact:"Some users in US East experienced 10-30 second sign-in delays. Issue fully resolved at 17:45. No data was lost or compromised.",updates:[{time:"17:45",text:"Issue fully resolved. Authentication latency returned to normal. Post-incident review scheduled."},{time:"16:30",text:"Mitigation applied. Latency reducing. Monitoring closely."},{time:"14:20",text:"Elevated authentication latency detected in US East region. Engineering engaged."}]},{id:"OF421345",title:"Microsoft 365 Admin Center: Intermittent Access Errors",service:"Microsoft 365",feature:"Admin portal",status:"resolved",severity:"low",startTime:"2 days ago 09:15",lastUpdated:"2 days ago 11:30",nextUpdate:null,userImpact:"Some administrators received HTTP 500 errors when accessing the Microsoft 365 Admin Center. Issue was isolated to report generation. All other admin functionality was unaffected.",updates:[{time:"11:30",text:"Issue fully resolved. Admin Center reporting restored to normal operation."},{time:"10:00",text:"Identified issue with report generation service. Restart in progress."},{time:"09:15",text:"Reports of HTTP 500 errors in Admin Center. Investigating."}]}],Di={totalMessages:20,actionRequired:8,majorChanges:3,newSinceLastWeek:5,upcoming30Days:4,resolved:2,highlights:[{service:"Microsoft Teams",title:"Legacy auth retirement deadline: 30 June 2026",severity:"high"},{service:"Microsoft Entra ID",title:"Mandatory admin MFA enforcement: 15 June 2026",severity:"high"},{service:"Microsoft 365",title:"E5 licence capacity at 98.7% — immediate review required",severity:"high"},{service:"Exchange Online",title:"Basic auth final phase — deadline 15 July 2026",severity:"high"},{service:"Microsoft Intune",title:"Android Enterprise enrollment migration: 1 August 2026",severity:"medium"}]};let pt=0,ut=0,Ti=null;async function qi(){var i,s,n,a,r,o;const e=document.getElementById("page-dashboard");if(!e)return;e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading dashboard data...</p></div>';try{console.log("📡 Fetching real dashboard data from backend...");const c=await Wt(),l=await Mi(),u=await _t();pt=c.success&&c.count?c.count:847,ut=l.success&&l.count?l.count:1e3,Ti=u.success?u.data:null,console.log(`✅ Loaded dashboard data: ${pt} devices, ${ut} users`)}catch(c){console.error("❌ Error loading dashboard data:",c)}e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
        <div class="page-subtitle">Contoso.com — last updated just now</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <!-- KPI Tiles -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">7</div>
        <div class="kpi-label">Pending Requests</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">3</div>
        <div class="kpi-label">Risky Users</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">14</div>
        <div class="kpi-label">Privileged Accounts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">7/12</div>
        <div class="kpi-label">Zero Trust Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">78%</div>
        <div class="kpi-label">M365 Config Score</div>
      </div>
    </div>

    <!-- Row 1 -->
    <div class="dash-cards-row mb-3">
      <!-- Pending Approvals snapshot -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-check-list"></i> Pending Approvals</span>
          <span class="badge danger dot">3 pending</span>
        </div>
        <table>
          <thead><tr>
            <th style="width:35%">Requestor</th>
            <th style="width:30%">Type</th>
            <th style="width:20%">SLA</th>
            <th style="width:15%">Status</th>
          </tr></thead>
          <tbody>
            <tr>
              <td>Priya Kumar</td>
              <td>Distribution Group</td>
              <td>2h left</td>
              <td><span class="badge warning dot">Pending</span></td>
            </tr>
            <tr>
              <td>James Liu</td>
              <td>MFA Reset</td>
              <td class="sla-overdue">Overdue</td>
              <td><span class="badge danger dot">Overdue</span></td>
            </tr>
            <tr>
              <td>Sara Ogden</td>
              <td>SharePoint Access</td>
              <td>4h left</td>
              <td><span class="badge warning dot">Pending</span></td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:12px">
          <button class="btn btn-primary" id="dash-to-requests"><i class="ti ti-arrow-right"></i> View all requests</button>
        </div>
      </div>

      <!-- M365 Config snapshot -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-settings-2"></i> M365 Config — CIS Controls</span>
          <span class="badge warning dot">78% compliant</span>
        </div>
        <table>
          <thead><tr>
            <th style="width:20%">Control</th>
            <th style="width:45%">Title</th>
            <th style="width:20%">Status</th>
            <th style="width:15%">Type</th>
          </tr></thead>
          <tbody>
            <tr>
              <td class="monospace">1.1.4</td>
              <td>Security Defaults disabled</td>
              <td><span class="badge danger">Failed</span></td>
              <td><span class="badge info">Auto</span></td>
            </tr>
            <tr>
              <td class="monospace">5.2.2.5</td>
              <td>Device compliance CA policy</td>
              <td><span class="badge danger">Failed</span></td>
              <td><span class="badge info">Auto</span></td>
            </tr>
            <tr>
              <td class="monospace">2.1.3</td>
              <td>Safe Attachments enabled</td>
              <td><span class="badge danger">Failed</span></td>
              <td><span class="badge info">Auto</span></td>
            </tr>
            <tr>
              <td class="monospace">1.2.1</td>
              <td>M365 Groups creation</td>
              <td><span class="badge warning">Warning</span></td>
              <td><span class="badge info">Auto</span></td>
            </tr>
            <tr>
              <td class="monospace">5.1.2.1</td>
              <td>Security Defaults status</td>
              <td><span class="badge warning">Warning</span></td>
              <td><span class="badge info">Auto</span></td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:12px">
          <button class="btn btn-primary" id="dash-to-m365"><i class="ti ti-arrow-right"></i> View M365 Config</button>
        </div>
      </div>
    </div>

    <!-- Row 2 -->
    <div class="dash-cards-row">
      <!-- Zero Trust snapshot -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-lock-check"></i> Zero Trust Score</span>
          <span class="badge warning dot">7/12 passed</span>
        </div>
        <div style="margin-bottom:12px">
          <div class="seg-bar" style="height:10px;border-radius:5px">
            <div class="seg pass" style="width:58%"></div>
            <div class="seg warn" style="width:25%"></div>
            <div class="seg fail" style="width:17%"></div>
          </div>
          <div style="display:flex;gap:16px;margin-top:6px">
            <span style="font-size:10px;color:var(--clr-success-text)">● 7 Pass</span>
            <span style="font-size:10px;color:var(--clr-warning-text)">● 3 Warn</span>
            <span style="font-size:10px;color:var(--clr-danger-text)">● 2 Fail</span>
          </div>
        </div>
        <table>
          <thead><tr>
            <th style="width:40%">Control</th>
            <th style="width:30%">Pillar</th>
            <th style="width:30%">Status</th>
          </tr></thead>
          <tbody>
            <tr>
              <td>Legacy Auth Blocked</td>
              <td>Identity</td>
              <td><span class="badge danger dot">Failed</span></td>
            </tr>
            <tr>
              <td>Device Risk CA</td>
              <td>Device</td>
              <td><span class="badge danger dot">Failed</span></td>
            </tr>
            <tr>
              <td>MFA Coverage</td>
              <td>Identity</td>
              <td><span class="badge warning dot">Warning</span></td>
            </tr>
            <tr>
              <td>PIM Assignments</td>
              <td>Priv. Access</td>
              <td><span class="badge warning dot">Warning</span></td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:12px">
          <button class="btn btn-primary" id="dash-to-zt"><i class="ti ti-arrow-right"></i> View Zero Trust</button>
        </div>
      </div>

      <!-- Audit events -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-activity"></i> Recent Audit Events</span>
          <button class="btn btn-sm" id="dash-to-audit">View all</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[{dot:"var(--clr-danger-text)",msg:"High-risk user sign-in detected — kevin.osei@contoso.com",time:"14 min ago"},{dot:"var(--clr-warning-text)",msg:"MFA registration incomplete — 3 users below policy threshold",time:"1 hour ago"},{dot:"var(--clr-info-text)",msg:"Config scan completed — 4 new failures found",time:"08:45 today"}].map(c=>`
            <div style="display:flex;align-items:flex-start;gap:10px;padding-bottom:10px;border-bottom:0.5px solid var(--color-border-tertiary)">
              <div class="dash-event-dot" style="background:${c.dot};margin-top:5px"></div>
              <div style="flex:1">
                <div style="font-size:11px;color:var(--color-text-primary);line-height:1.4">${c.msg}</div>
                <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${c.time}</div>
              </div>
            </div>
          `).join("")}
        </div>
        <div style="margin-top:4px;padding-top:12px">
          <div class="card-title" style="margin-bottom:10px"><i class="ti ti-crown"></i> Privileged Account Alerts</div>
          <div class="alert-banner danger">
            <i class="ti ti-alert-triangle"></i>
            2 privileged accounts have active risk detections (High severity).
          </div>
          <div class="alert-banner warning" style="margin-bottom:0">
            <i class="ti ti-shield-off"></i>
            1 privileged account (tom.brooks) has no MFA registered.
          </div>
        </div>
      </div>
    </div>
  `;const t=document.createElement("div");t.style.marginTop="16px",t.innerHTML=Li(),e.querySelector("#page-dashboard-inner")||e.appendChild(t),(i=e.querySelector("#dash-to-msgcenter-health"))==null||i.addEventListener("click",async()=>await x("msgcenter")),(s=e.querySelector("#dash-to-requests"))==null||s.addEventListener("click",async()=>await x("requests")),(n=e.querySelector("#dash-to-m365"))==null||n.addEventListener("click",async()=>await x("m365config")),(a=e.querySelector("#dash-to-zt"))==null||a.addEventListener("click",async()=>await x("zerotrust")),(r=e.querySelector("#dash-to-audit"))==null||r.addEventListener("click",async()=>await x("audit")),(o=e.querySelector("#dash-to-msgcenter"))==null||o.addEventListener("click",async()=>await x("msgcenter"))}function Li(){const e=S.filter(n=>n.actionRequired&&n.severity==="high").slice(0,3),t=O.filter(n=>n.status!=="resolved"),i=S.filter(n=>n.actionRequired).length,s=Object.entries(C).map(([n,a])=>{const r=O.find(c=>c.service===n&&c.status!=="resolved"),o=r?r.severity==="high"?"fail":"warn":"pass";return`<span title="${n}: ${r?r.status:"Operational"}" style="display:inline-flex;align-items:center;gap:3px;font-size:9px;color:var(--color-text-tertiary);margin-right:6px">
      <span class="status-dot ${o}" style="width:6px;height:6px"></span>${n.replace("Microsoft ","").replace(" Online","").replace(" ID","").substring(0,7)}</span>`}).join("");return`
    <div class="dash-cards-row">
      <!-- Change Intelligence Critical Messages -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-antenna" style="color:var(--clr-danger-text)"></i> Change Intelligence</span>
          <span class="badge danger dot">${i} action required</span>
        </div>
        <div style="margin-bottom:10px">
          ${e.map(n=>{const a=C[n.service]||{icon:"ti-apps",color:"#185FA5",bg:"#E6F1FB"};return`<div style="display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
              <div style="width:20px;height:20px;border-radius:4px;background:${a.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:${a.color}">
                <i class="ti ${a.icon}"></i>
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:10px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${n.title}</div>
                <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:1px">${n.id} · ${n.service} · Act by: <strong style="color:var(--clr-danger-text)">${n.actionByDate}</strong></div>
              </div>
              <span class="badge danger" style="font-size:8px;flex-shrink:0">High</span>
            </div>`}).join("")}
        </div>
        <button class="btn btn-primary" id="dash-to-msgcenter"><i class="ti ti-arrow-right"></i> View all messages</button>
      </div>

      <!-- Service Health Summary -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-heartbeat"></i> Service Health</span>
          <span class="badge ${t.length>0?"warning":"success"}">${t.length>0?t.length+" active":"All clear"}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px 0;border-bottom:0.5px solid var(--color-border-tertiary);margin-bottom:10px">
          ${s}
        </div>
        ${t.length>0?t.map(n=>`
          <div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;font-size:11px">
            <span class="status-dot ${n.severity==="high"?"fail":"warn"} pulse"></span>
            <div>
              <div style="font-weight:600">${n.service}</div>
              <div style="font-size:10px;color:var(--color-text-secondary)">${n.title}</div>
            </div>
          </div>
        `).join(""):`
          <div style="font-size:11px;color:var(--clr-success-text);display:flex;align-items:center;gap:6px">
            <i class="ti ti-circle-check"></i> All ${Object.keys(C).length} monitored services operational.
          </div>
        `}
        <div style="margin-top:10px">
          <button class="btn btn-sm" id="dash-to-msgcenter-health">
            <i class="ti ti-heartbeat"></i> Service Health
          </button>
        </div>
      </div>
    </div>
  `}const Gi=[{id:"REQ-001",type:"Distribution Group",requestor:"Priya Kumar",sla:"2h left",status:"pending"},{id:"REQ-002",type:"Mail-Enabled SG",requestor:"Sara Ogden",sla:"1h left",status:"pending"},{id:"REQ-003",type:"MFA Reset",requestor:"James Liu",sla:"Overdue",status:"overdue"},{id:"REQ-004",type:"SharePoint Access",requestor:"Kevin Osei",sla:"4h left",status:"in-progress"},{id:"REQ-005",type:"Shared Mailbox",requestor:"Lucy Chan",sla:"Completed",status:"approved"}];let We=Gi.map(e=>({...e}));function Ni(){const e=document.getElementById("page-requests");e&&Oi(e)}function Oi(e){e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-inbox"></i> Access Requests</div>
        <div class="page-subtitle">Manage all pending and recent access requests</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-filter"></i> Filter</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">7</div><div class="kpi-label">Total Open</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">4</div><div class="kpi-label">Pending</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">1</div><div class="kpi-label">Overdue</div></div>
      <div class="kpi-tile"><div class="kpi-value success">2</div><div class="kpi-label">Approved Today</div></div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:10%">#</th>
          <th style="width:22%">Type</th>
          <th style="width:18%">Requestor</th>
          <th style="width:12%">SLA</th>
          <th style="width:15%">Status</th>
          <th style="width:23%">Action</th>
        </tr></thead>
        <tbody id="req-tbody">
          ${We.map(t=>Fi(t)).join("")}
        </tbody>
      </table>
    </div>
  `,Ui(e)}function _e(e){return e==="approved"?'<span class="badge success dot">Approved</span>':e==="overdue"?'<span class="badge danger dot">Overdue</span>':e==="in-progress"?'<span class="badge info dot">In Progress</span>':e==="rejected"?'<span class="badge neutral dot">Rejected</span>':'<span class="badge warning dot">Pending</span>'}function Fi(e){const t=e.status==="pending"||e.status==="overdue"||e.status==="in-progress";return`
    <tr data-id="${e.id}">
      <td class="monospace">${e.id}</td>
      <td>${e.type}</td>
      <td>${e.requestor}</td>
      <td ${e.sla==="Overdue"?'class="sla-overdue"':""}>${e.sla}</td>
      <td class="req-status-cell">${_e(e.status)}</td>
      <td>
        ${t?`
          <button class="btn btn-xs btn-success req-approve-btn" data-id="${e.id}"><i class="ti ti-check"></i> Approve</button>
          <button class="btn btn-xs btn-danger req-reject-btn" data-id="${e.id}" style="margin-left:4px"><i class="ti ti-x"></i> Reject</button>
        `:""}
      </td>
    </tr>
  `}function Ui(e){e.querySelectorAll(".req-approve-btn").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.id,s=We.find(a=>a.id===i);s&&(s.status="approved");const n=e.querySelector(`tr[data-id="${i}"]`);n&&(n.querySelector(".req-status-cell").innerHTML=_e("approved"),n.querySelector("td:last-child").innerHTML=""),p(`Request ${i} approved successfully.`,"success")})}),e.querySelectorAll(".req-reject-btn").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.id,s=We.find(a=>a.id===i);s&&(s.status="rejected");const n=e.querySelector(`tr[data-id="${i}"]`);n&&(n.querySelector(".req-status-cell").innerHTML=_e("rejected"),n.querySelector("td:last-child").innerHTML=""),p(`Request ${i} rejected.`,"warning")})})}const te={current:64,max:95,percentOf100:67.4,delta7d:2,delta30d:5,delta90d:-1,avgComparable:53,trend7d:[58,60,61,61,62,63,64],trend30d:[55,56,57,58,57,58,58,59,59,60,60,60,61,61,62,62,62,62,63,63,63,63,63,64,64,64,64,64,63,64],categories:[{name:"Identity",score:68,max:100,color:"#0C447C",icon:"ti-user-check"},{name:"Devices",score:58,max:100,color:"#3B6D11",icon:"ti-device-laptop"},{name:"Apps",score:72,max:100,color:"#854F0B",icon:"ti-apps"},{name:"Data",score:61,max:100,color:"#3C3489",icon:"ti-database"},{name:"Infrastructure",score:54,max:100,color:"#633806",icon:"ti-server"}]},$={totalUsers:1e3,privAccounts:14,globalAdmins:2,serviceAccounts:12,breakGlass:2,mfaEnabled:870,mfaExcluded:130,passwordlessAdoption:23,fido2Adoption:5,legacyAuthConnections:12,highRiskUsers:3,riskySignIns30d:47,impossibleTravel30d:2,anonymousIP30d:8,passwordSpray30d:0,caPoliciesEnabled:25,caPoliciesDisabled:5,caPoliciesReportOnly:3,caUsersExcluded:18,identitySecureScore:72},Vt={malwareDetected30d:247,phishingAttempts30d:1834,becAttempts30d:3,spoofedDomainActivity30d:12,quarantined30d:4782,spf:"pass",dkim:"pass",dmarc:"quarantine",safeLinks:"enabled",externalForwardingRules:2,suspiciousInboxRules:1,sharedMailboxExposed:14,antiSpamPolicy:"standard"},ye={totalManaged:847,nonCompliant:15,vulnerable:8,avCoverage:99.4,bitlockerCoverage:95.7,firewallEnabled:98.2,tamperProtection:94.8,activeThreats:2,highSeverityAlerts:4,ransomwareIndicators:1,missingCriticalPatches:23,windows11Pct:71,windows10Pct:27},Jt={totalTeams:187,publicTeams:8,guestEnabledTeams:34,inactiveTeams90d:23,guestsAdded30d:12,externalDomainsAllowed:3,teamsWithExternalSharing:11,unownedTeams:5},Kt={totalSites:234,externallyShared:18,anonymousLinks:3,publicContent:2,oversharedSites:5,sensitiveFiles:47,largeDownloads30d:8,dlpCoveragePct:78},Ve={sensitivityLabelsApplied:34,filesWithoutLabels:18e3,retentionPoliciesActive:4,dlpViolations30d:23,financialDataExposure:8,piiExposure:11,healthcareData:4,dataExfiltration30d:2,unusualDownloads30d:5,usbTransfers30d:3,complianceScore:61,insiderRiskPolicies:2},Yt={globalAdminCount:2,securityAdminCount:2,exchangeAdminCount:2,sharePointAdminCount:1,teamsAdminCount:1,intuneAdminCount:1,newAdmins30d:1,privRoleAssignments30d:4,emergencyAccess30d:0,pimAdoption:85,permanentAssignments:4,pimEligibleRoles:10},Je={totalGuests:87,dormantGuests90d:12,expiredGuests:3,guestsWithPrivAccess:0,quarterlyReviewOverdue:14,guestsAddedLast30d:7,guestsRemovedLast30d:3,avgGuestAgeDays:142},b=[{id:"INC-2341",severity:"critical",title:"Ransomware Indicators — Device MBX-LAPTOP-047",category:"Malware",status:"active",assignee:"Aisha Raza",created:"3h ago",services:["Endpoint","Identity"]},{id:"INC-2338",severity:"high",title:"BEC Attempt — Invoice Fraud Pattern Detected",category:"Phishing",status:"active",assignee:"Chen Wei",created:"6h ago",services:["Exchange"]},{id:"INC-2335",severity:"high",title:"Risky Sign-in — kevin.osei@contoso.com (Unfamiliar Location)",category:"Identity Attack",status:"active",assignee:"Aisha Raza",created:"14h ago",services:["Identity"]},{id:"INC-2330",severity:"high",title:"Suspicious Inbox Rule — Auto-Forward to External",category:"Data Exposure",status:"investigating",assignee:"Chen Wei",created:"Yesterday",services:["Exchange"]},{id:"INC-2298",severity:"medium",title:"Multiple Failed Sign-ins — Brute Force Pattern",category:"Identity Attack",status:"monitoring",assignee:"Chen Wei",created:"2 days ago",services:["Identity"]},{id:"INC-2290",severity:"medium",title:"Sensitive File Shared Externally — Finance folder",category:"Data Exposure",status:"monitoring",assignee:"Aisha Raza",created:"3 days ago",services:["SharePoint","OneDrive"]},{id:"INC-2281",severity:"medium",title:"DLP Policy Violation — PII Data in Teams Chat",category:"Insider Threat",status:"resolved",assignee:"Chen Wei",created:"4 days ago",services:["Teams","Purview"]},{id:"INC-2267",severity:"low",title:"Guest Account — Excessive Resource Access",category:"Identity Attack",status:"resolved",assignee:"Aisha Raza",created:"5 days ago",services:["Identity"]}],I=[{id:"R01",priority:"critical",title:"Enable MFA for 130 unregistered users",category:"Identity",impact:"Identity",scoreGain:15,effort:"low",status:"open",apiHint:"GET /beta/reports/authenticationMethods/userRegistrationDetails"},{id:"R02",priority:"critical",title:"Block legacy authentication via Conditional Access",category:"Identity",impact:"Identity",scoreGain:8,effort:"low",status:"open",apiHint:"POST /beta/identity/conditionalAccess/policies"},{id:"R03",priority:"high",title:"Upgrade DMARC from quarantine to reject policy",category:"Email",impact:"Email",scoreGain:6,effort:"medium",status:"open",apiHint:"DNS: _dmarc.contoso.com TXT v=DMARC1;p=reject"},{id:"R04",priority:"high",title:"Enable Safe Attachments for all users",category:"Email",impact:"Email",scoreGain:4,effort:"low",status:"open",apiHint:"New-SafeAttachmentPolicy + New-SafeAttachmentRule"},{id:"R05",priority:"high",title:"Disable 2 active external mail forwarding rules",category:"Email",impact:"Email",scoreGain:5,effort:"low",status:"open",apiHint:"GET /beta/users/{id}/mailFolders/inbox/messageRules"},{id:"R06",priority:"high",title:"Remediate 8 vulnerable devices (critical patches missing)",category:"Endpoint",impact:"Devices",scoreGain:6,effort:"medium",status:"open",apiHint:"GET /beta/deviceManagement/managedDevices?$filter=complianceState ne 'compliant'"},{id:"R07",priority:"high",title:"Enable BitLocker on 36 unencrypted devices",category:"Endpoint",impact:"Devices",scoreGain:4,effort:"medium",status:"in-progress",apiHint:"GET /beta/deviceManagement/managedDevices?$select=isEncrypted"},{id:"R08",priority:"medium",title:"Convert 4 permanent admin assignments to PIM eligible",category:"Identity",impact:"Identity",scoreGain:5,effort:"medium",status:"open",apiHint:"GET /beta/roleManagement/directory/roleAssignmentSchedules"},{id:"R09",priority:"medium",title:"Remove or review 12 dormant guest accounts",category:"Guests",impact:"Collaboration",scoreGain:3,effort:"low",status:"open",apiHint:"GET /beta/users?$filter=userType eq 'Guest'&$select=signInActivity"},{id:"R10",priority:"medium",title:"Enable sensitivity auto-labeling for Office files",category:"Data",impact:"Data",scoreGain:4,effort:"high",status:"open",apiHint:"Microsoft Purview → Sensitivity Labels → Auto-labeling"},{id:"R11",priority:"medium",title:"Resolve DLP policy gap — Teams messages not covered",category:"Data",impact:"Data",scoreGain:3,effort:"low",status:"open",apiHint:"GET /beta/compliance/ediscovery/cases or Purview DLP console"},{id:"R12",priority:"medium",title:"Enable phishing-resistant MFA for all admins (FIDO2/CBA)",category:"Identity",impact:"Identity",scoreGain:7,effort:"medium",status:"open",apiHint:"GET /beta/policies/authenticationMethodsPolicy"},{id:"R13",priority:"low",title:"Archive 23 inactive Teams (90d+)",category:"Teams",impact:"Collaboration",scoreGain:2,effort:"low",status:"open",apiHint:"GET /v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')"},{id:"R14",priority:"low",title:"Conduct overdue quarterly access review for 14 guests",category:"Guests",impact:"Collaboration",scoreGain:2,effort:"low",status:"open",apiHint:"GET /v1.0/identityGovernance/accessReviews/definitions"},{id:"R15",priority:"low",title:"Restrict anonymous sharing links in SharePoint",category:"SharePoint",impact:"Data",scoreGain:3,effort:"low",status:"open",apiHint:"Set-SPOTenant -SharingCapability ExistingExternalUserSharingOnly"}],vt=[{category:"Secure Score",source:"Graph Security API",method:"GET",endpoint:"/v1.0/security/secureScores",returns:"Current score, max score, control categories",auth:"SecurityEvents.Read.All"},{category:"Secure Score",source:"Graph Security API",method:"GET",endpoint:"/v1.0/security/secureScoreControlProfiles",returns:"Individual control details and improvement actions",auth:"SecurityEvents.Read.All"},{category:"Identity",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/users?$count=true",returns:"Total user count",auth:"User.Read.All"},{category:"Identity",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/directoryRoles/{id}/members",returns:"Global Administrator members",auth:"Directory.Read.All"},{category:"Identity",source:"Graph Reporting",method:"GET",endpoint:"/beta/reports/authenticationMethods/userRegistrationDetails",returns:"MFA registration status, passwordless, FIDO2 per user",auth:"Reports.Read.All"},{category:"Identity",source:"Entra ID P2",method:"GET",endpoint:"/beta/riskyUsers",returns:"High/medium/low risk users with risk level",auth:"IdentityRiskyUser.Read.All"},{category:"Identity",source:"Entra ID P2",method:"GET",endpoint:"/beta/riskDetections",returns:"Risky sign-in events, impossible travel, anonymous IP",auth:"IdentityRiskEvent.Read.All"},{category:"Identity",source:"Microsoft Graph",method:"GET",endpoint:"/beta/auditLogs/signIns?$filter=clientAppUsed ne 'Browser'",returns:"Legacy authentication sign-ins",auth:"AuditLog.Read.All"},{category:"Conditional Access",source:"Microsoft Graph",method:"GET",endpoint:"/beta/identity/conditionalAccess/policies",returns:"All CA policies, state (enabled/disabled/reportOnly), conditions",auth:"Policy.Read.All"},{category:"Email Security",source:"Exchange Online PS",method:"PS",endpoint:"Get-SafeAttachmentPolicy | Select Name,Action,Enable",returns:"Safe Attachments policy coverage and action mode",auth:"Exchange Admin"},{category:"Email Security",source:"Exchange Online PS",method:"PS",endpoint:"Get-SafeLinksPolicy | Select Name,IsEnabled,ScanUrls",returns:"Safe Links policy status and URL scanning",auth:"Exchange Admin"},{category:"Email Security",source:"Exchange Online PS",method:"PS",endpoint:"Get-DkimSigningConfig | Select Domain,Enabled",returns:"DKIM signing status per domain",auth:"Exchange Admin"},{category:"Email Security",source:"Exchange Online PS",method:"PS",endpoint:"Get-HostedOutboundSpamFilterPolicy | Select AutoForwardingMode",returns:"External mail forwarding policy setting",auth:"Exchange Admin"},{category:"Email Security",source:"Exchange Online PS",method:"PS",endpoint:"Get-InboxRule -Mailbox All | Where {$_.ForwardTo}",returns:"Inbox rules forwarding to external addresses",auth:"Exchange Admin"},{category:"Email Security",source:"DNS Query",method:"DNS",endpoint:"Resolve-DnsName _dmarc.contoso.com -Type TXT",returns:"DMARC policy (none/quarantine/reject)",auth:"None (public DNS)"},{category:"Endpoint",source:"Microsoft Graph (Intune)",method:"GET",endpoint:"/v1.0/deviceManagement/managedDevices",returns:"All managed devices with compliance state, OS, owner",auth:"DeviceManagementManagedDevices.Read.All"},{category:"Endpoint",source:"Microsoft Graph (Intune)",method:"GET",endpoint:"/v1.0/deviceManagement/managedDevices?$filter=complianceState ne 'compliant'",returns:"Non-compliant devices",auth:"DeviceManagementManagedDevices.Read.All"},{category:"Endpoint",source:"Microsoft Graph (Intune)",method:"GET",endpoint:"/beta/deviceManagement/managedDevices?$select=id,deviceName,isEncrypted",returns:"BitLocker encryption status per device",auth:"DeviceManagementManagedDevices.Read.All"},{category:"Defender XDR",source:"Defender API",method:"GET",endpoint:"/api/incidents?$filter=status ne 'Resolved'",returns:"Active incidents with severity, status, assignee",auth:"Incident.Read.All"},{category:"Defender XDR",source:"Defender API",method:"GET",endpoint:"/api/alerts?$filter=severity eq 'High'",returns:"High/critical alerts with category and evidence",auth:"Alert.Read.All"},{category:"Defender XDR",source:"Defender API",method:"GET",endpoint:"/api/recommendations",returns:"Threat and vulnerability management recommendations",auth:"Tvm.Read.All"},{category:"Teams Security",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&$select=id,displayName,visibility",returns:"All Teams with visibility (Public/Private)",auth:"Group.Read.All"},{category:"Teams Security",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/groups/{id}/members?$filter=userType eq 'Guest'",returns:"Guest members within a Team",auth:"GroupMember.Read.All"},{category:"Teams Security",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/teams/{id}/channels",returns:"Team channels including private/shared channel count",auth:"Channel.ReadBasic.All"},{category:"SharePoint",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/sites?$select=id,displayName,webUrl",returns:"All SharePoint site collections",auth:"Sites.Read.All"},{category:"SharePoint",source:"SharePoint Admin PS",method:"PS",endpoint:"Get-SPOSite -Limit All | Select Url,SharingCapability",returns:"Per-site external sharing configuration",auth:"SharePoint Admin"},{category:"SharePoint",source:"Microsoft Graph",method:"GET",endpoint:"/drives/{id}/items/{id}/permissions",returns:"Anonymous link status for files/folders",auth:"Files.Read.All"},{category:"Privileged Access",source:"Microsoft Graph",method:"GET",endpoint:"/beta/roleManagement/directory/roleEligibilitySchedules",returns:"PIM eligible role assignments",auth:"PrivilegedAccess.Read.AzureAD"},{category:"Privileged Access",source:"Microsoft Graph",method:"GET",endpoint:"/beta/roleManagement/directory/roleAssignmentSchedules",returns:"Active (permanent) privileged role assignments",auth:"PrivilegedAccess.Read.AzureAD"},{category:"Guest Governance",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/users?$filter=userType eq 'Guest'&$select=id,displayName,signInActivity",returns:"Guest users with last sign-in timestamp",auth:"User.Read.All"},{category:"Guest Governance",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/identityGovernance/accessReviews/definitions",returns:"Scheduled access reviews and completion status",auth:"AccessReview.Read.All"},{category:"Data Protection",source:"Purview PS",method:"PS",endpoint:"Get-DlpCompliancePolicy | Select Name,Mode,Enabled",returns:"DLP policy names, enforcement mode, workloads",auth:"Compliance Admin"},{category:"Data Protection",source:"Purview PS",method:"PS",endpoint:"Get-Label | Select DisplayName,Priority,IsActive",returns:"Sensitivity label hierarchy and status",auth:"Compliance Admin"},{category:"Data Protection",source:"Purview PS",method:"PS",endpoint:"Get-RetentionCompliancePolicy | Select Name,Enabled,Workload",returns:"Retention policies and covered workloads",auth:"Compliance Admin"},{category:"Service Health",source:"Microsoft Graph",method:"GET",endpoint:"/admin/serviceAnnouncement/issues",returns:"Active service health incidents and advisories",auth:"ServiceHealth.Read.All"},{category:"Service Health",source:"Microsoft Graph",method:"GET",endpoint:"/admin/serviceAnnouncement/messages",returns:"Message Center posts, planned maintenance",auth:"ServiceHealth.Read.All"}],Bi=[{keywords:["high risk user","risky user","show me risky","risk users"],response:`**High-Risk Users (3 Active)**

| User | Risk Level | Detection | Last Sign-in |
|---|---|---|---|
| kevin.osei@contoso.com | 🔴 High | Unknown location sign-in | 14 min ago |
| nina.patel@contoso.com | 🟡 Medium | Anomalous activity | Yesterday |
| sara.ogden@contoso.com | 🟡 Medium | Inactive account activity | 2 days ago |

**Recommended actions:**
1. Force password reset for Kevin Osei immediately
2. Block sign-in until investigation complete
3. Review authentication logs for all three

**Graph API:** GET /beta/riskyUsers?$filter=riskLevel eq 'high'`},{keywords:["secure score","score drop","why did score","score this week"],response:`**Secure Score Analysis — 64/95 (67.4%)**

📈 +2 points this week (was 62)
📊 +5 points this month
🏭 Industry average for similar orgs: 53/100

**Category breakdown:**
| Category | Score | Status |
|---|---|---|
| Identity | 68/100 | 🟡 Needs attention |
| Apps | 72/100 | 🟡 Good |
| Data | 61/100 | 🔴 Needs improvement |
| Devices | 58/100 | 🔴 Needs improvement |
| Infrastructure | 54/100 | 🔴 Needs improvement |

**Biggest improvement opportunities:** Enable MFA for 130 users (+15), Block legacy auth (+8), DMARC reject (+6)`},{keywords:["teams guest","which teams","teams with guest","external teams"],response:`**Microsoft Teams — External & Guest Access**

📊 **187 total teams** in Contoso tenant

| Risk Category | Count | Action |
|---|---|---|
| Public teams | 8 | Review — anyone can join |
| Guest-enabled teams | 34 | Review membership |
| Inactive 90d+ | 23 | Archive or delete |
| External sharing | 11 | Audit content |
| Unowned teams | 5 | Assign owner |

**Graph API to enumerate:** GET /v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&$select=displayName,visibility

**Recommended:** Run quarterly guest access review for all 34 guest-enabled teams.`},{keywords:["top 10 security","security improvements","what to fix","improve security"],response:`**Top 10 Security Improvements (by score impact)**

| # | Action | Category | Score Gain |
|---|---|---|---|
| 1 | Enable MFA for 130 users | Identity | +15 |
| 2 | Block legacy authentication | Identity | +8 |
| 3 | Phishing-resistant MFA for admins | Identity | +7 |
| 4 | Upgrade DMARC to reject | Email | +6 |
| 5 | Remediate 8 vulnerable devices | Endpoint | +6 |
| 6 | Convert permanent admins to PIM | Identity | +5 |
| 7 | Disable external mail forwarding | Email | +5 |
| 8 | Enable Safe Attachments (all) | Email | +4 |
| 9 | BitLocker on 36 devices | Endpoint | +4 |
| 10 | Enable sensitivity auto-labeling | Data | +4 |

**Total potential gain: +64 points → would bring score to ~128%... recalibrating to 84/95 max**`},{keywords:["ransomware","vulnerable device","malware","endpoint threat"],response:`**Endpoint Security Status**

🚨 **CRITICAL: Ransomware indicators detected on MBX-LAPTOP-047**
- Incident INC-2341 — Active investigation
- Isolate device immediately if not already done

**Device security summary:**
- 847 managed devices total
- 15 non-compliant
- 8 missing critical patches
- 2 active threats
- BitLocker: 95.7% coverage (36 devices unencrypted)

**Defender AV coverage:** 99.4% ✅
**Tamper protection:** 94.8% ⚠️

**Intune API:** GET /beta/deviceManagement/managedDevices?$filter=complianceState ne 'compliant'`},{keywords:["today security","security posture","daily summary","summarize security"],response:`**Today's Security Posture Summary — ${new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}**

🔴 **Requires immediate action:**
- INC-2341: Ransomware indicators on MBX-LAPTOP-047
- 130 users without MFA (7 June enforcement deadline approaching)
- 3 high-risk users active (Kevin Osei, Nina Patel, Sara Ogden)

📊 **Secure Score:** 64/95 (+2 this week)
🔒 **CA Coverage:** 94.6% of sign-ins protected
📧 **Email threats blocked today:** 156 phishing, 8 malware
💻 **Device compliance:** 98.2% (15 non-compliant)

**Priority:** Isolate MBX-LAPTOP-047 and force password reset for high-risk users immediately.`},{keywords:["mfa coverage","mfa adoption","who has no mfa","mfa status"],response:`**MFA Adoption Status — 87% coverage**

✅ Registered: 870 / 1,000 users
❌ Not registered: 130 users

**Authentication methods in use:**
| Method | Users | Security Level |
|---|---|---|
| Microsoft Authenticator | 742 | 🟢 Strong |
| FIDO2 security key | 5 | 🟢 Phishing-resistant |
| Certificate-based | 3 | 🟢 Phishing-resistant |
| SMS (legacy) | 120 | 🔴 Weak |
| No MFA | 130 | 🔴 Critical |

**Deadline:** Microsoft enforcing mandatory MFA registration by 31 July 2026

**Graph API:** GET /beta/reports/authenticationMethods/userRegistrationDetails`},{keywords:["email security","spf dkim dmarc","email protection","email threats"],response:`**Email Security Status**

**Authentication records:**
✅ SPF: Configured and passing
✅ DKIM: Enabled for contoso.com
⚠️ DMARC: quarantine (should be reject for full protection)

**Last 30 days threat activity:**
- 1,834 phishing attempts blocked
- 247 malware detections
- 3 BEC (Business Email Compromise) attempts
- 4,782 messages quarantined

**Active risks:**
🔴 2 mailboxes with active external forwarding rules
🔴 1 suspicious inbox rule detected
⚠️ Safe Attachments: partial coverage only

**Priority action:** Upgrade DMARC to p=reject for full anti-spoofing protection.`},{keywords:["guest user","external user","dormant guest","guest governance"],response:`**Guest & External User Governance**

👥 **87 total guest accounts** in tenant

| Status | Count | Action Needed |
|---|---|---|
| Active (signed in 30d) | 62 | None |
| Dormant 90d+ | 12 | 🔴 Remove or review |
| Expired | 3 | 🔴 Remove immediately |
| Review overdue | 14 | 🟡 Schedule review |
| With privileged access | 0 | ✅ Clean |

**Average guest account age:** 142 days

**Graph API to find dormant guests:**
GET /v1.0/users?$filter=userType eq 'Guest'&$select=displayName,signInActivity

Filter for: signInActivity/lastSignInDateTime <= [90 days ago]`},{keywords:["conditional access","ca coverage","ca policy","access policy"],response:`**Conditional Access — Policy Status**

📊 **25 policies enabled** | 5 disabled | 3 report-only mode
🎯 **CA coverage:** 94.6% of sign-ins protected
⚠️ **18 users explicitly excluded** from one or more policies

**Key policies active:**
- ✅ Require MFA — All Users (all cloud apps)
- ✅ Require MFA — All Admins
- ✅ Block Legacy Authentication
- ✅ Require compliant device (with 12 exclusions)
- ✅ Risk-based policy (High risk = block)

**Risks:**
- 18 CA exclusions should be reviewed quarterly
- 3 policies in report-only may be masking gaps

**Graph API:** GET /beta/identity/conditionalAccess/policies`}];let Ke=te,X="executive",h={priority:"all",category:"all",status:"all"},Ce="7d",ce=[],gt=!1;const zi=[{id:"executive",label:"Executive",icon:"ti-layout-dashboard"},{id:"securescore",label:"Secure Score",icon:"ti-shield-check"},{id:"identity",label:"Identity",icon:"ti-user-check"},{id:"email",label:"Email",icon:"ti-mail"},{id:"endpoint",label:"Endpoint",icon:"ti-device-laptop"},{id:"teams",label:"Teams",icon:"ti-brand-teams"},{id:"sharepoint",label:"SharePoint",icon:"ti-brand-sharepoint"},{id:"dataprotection",label:"Data Protection",icon:"ti-lock"},{id:"privaccess",label:"Priv. Access",icon:"ti-crown"},{id:"guests",label:"Guests",icon:"ti-user-plus"},{id:"incidents",label:"Incidents",icon:"ti-alert-triangle"},{id:"recommendations",label:"Recommendations",icon:"ti-checklist"},{id:"copilot",label:"Security Copilot",icon:"ti-robot"},{id:"apiref",label:"API Reference",icon:"ti-api"}];async function ji(){const e=document.getElementById("page-security");if(e){try{console.log("📡 Fetching real security data from backend...");const t=await _t();t.success&&(Ke=t.data||te,console.log("✅ Loaded real secure score from API"))}catch(t){console.warn("⚠️ Using simulated secure score:",t.message),Ke=te}L(e)}}function L(e){var s,n;const t=b.filter(a=>a.severity==="critical").length;b.filter(a=>a.severity==="high"&&a.status!=="resolved").length;const i=I.filter(a=>a.priority==="critical"||a.priority==="high").length;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-shield-exclamation"></i> Security Command Center</div>
        <div class="page-subtitle">Single-pane-of-glass across Identity, Email, Endpoint, Apps & Data · Last scan: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="sec-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="sec-report"><i class="ti ti-download"></i> Export report</button>
      </div>
    </div>

    <!-- Top-5 always-visible KPI strip -->
    <div class="sec-top5">
      ${Hi()}
    </div>

    <!-- Internal sub-navigation -->
    <div class="sec-subnav" id="sec-subnav">
      ${zi.map(a=>`
        <button class="sec-tab-btn ${X===a.id?"active":""}" data-sec="${a.id}">
          <i class="ti ${a.icon}"></i><span>${a.label}</span>
          ${a.id==="incidents"&&t>0?`<span class="sec-tab-badge red">${t}</span>`:""}
          ${a.id==="recommendations"?`<span class="sec-tab-badge amber">${i}</span>`:""}
          ${a.id==="identity"&&$.highRiskUsers>0?`<span class="sec-tab-badge red">${$.highRiskUsers}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Section content -->
    <div id="sec-content" style="margin-top:16px">${Vi()}</div>
  `,e.querySelectorAll(".sec-tab-btn").forEach(a=>{a.addEventListener("click",()=>{var r;X=a.dataset.sec,L(e),(r=e.querySelector("#sec-subnav"))==null||r.scrollIntoView({behavior:"smooth",block:"nearest"})})}),(s=e.querySelector("#sec-refresh"))==null||s.addEventListener("click",()=>{const a=e.querySelector("#sec-refresh");a.innerHTML='<span class="spinner dark"></span> Scanning...',a.disabled=!0,setTimeout(()=>{a.innerHTML='<i class="ti ti-refresh"></i> Refresh',a.disabled=!1,p("Security posture refreshed — all 15 data sources updated.","success")},2200)}),(n=e.querySelector("#sec-report"))==null||n.addEventListener("click",()=>p("Security report exported as PDF.","success")),os(e)}function Hi(){const e=Ke||te,t=e.percentOf100,i=t>=80?"success":t>=60?"warning":"danger",s=b.filter(n=>n.severity==="critical"&&n.status!=="resolved").length;return`
    <div class="kpi-tile sec-kpi-primary" style="min-width:160px">
      <div style="display:flex;align-items:center;gap:12px">
        ${Pe(e.current,e.max,52)}
        <div>
          <div class="kpi-value ${i}" style="font-size:24px">${e.current}<span style="font-size:12px;font-weight:500;color:var(--color-text-tertiary)">/${e.max}</span></div>
          <div class="kpi-label">Secure Score</div>
          <div style="font-size:10px;margin-top:3px;color:${e.delta7d>=0?"var(--clr-success-text)":"var(--clr-danger-text)"}">
            ${e.delta7d>=0?"+":""}${e.delta7d} this week
          </div>
        </div>
      </div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value ${s>0?"danger":"success"}">${s>0?s:"✓"}</div>
      <div class="kpi-label">Critical Incidents</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${b.filter(n=>n.status!=="resolved").length} open total</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value danger">${$.highRiskUsers}</div>
      <div class="kpi-label">High-Risk Users</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${$.riskySignIns30d} risky sign-ins (30d)</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value danger">${ye.vulnerable}</div>
      <div class="kpi-label">Vulnerable Devices</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${ye.nonCompliant} non-compliant</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value warning">${I.filter(n=>n.priority==="critical"||n.priority==="high").length}</div>
      <div class="kpi-label">Top Recommendations</div>
      <div style="font-size:10px;margin-top:3px;color:var(--clr-warning-text)">+${I.reduce((n,a)=>n+a.scoreGain,0)} pts potential</div>
    </div>
  `}function Pe(e,t,i=80){const s=e/t,n=i/2*.82,a=i/2,r=i/2,o=2*Math.PI*n,c=o*s,l=s>=.8?"#3B6D11":s>=.6?"#854F0B":"#A32D2D",u=i<60?11:14;return`<svg width="${i}" height="${i}" viewBox="0 0 ${i} ${i}" style="flex-shrink:0">
    <circle cx="${a}" cy="${r}" r="${n}" fill="none" stroke="var(--color-border-tertiary)" stroke-width="${i<60?5:7}"/>
    <circle cx="${a}" cy="${r}" r="${n}" fill="none" stroke="${l}" stroke-width="${i<60?5:7}"
      stroke-dasharray="${c} ${o}" stroke-dashoffset="${o*.25}"
      stroke-linecap="round" transform="rotate(-90 ${a} ${r})"/>
    <text x="${a}" y="${r+4}" text-anchor="middle" font-size="${u}" font-weight="700" fill="${l}">${Math.round(s*100)}%</text>
  </svg>`}function Wi(e,t=24){const i=Math.max(...e),s=Math.min(...e),n=i-s||1;return`<div style="display:flex;align-items:flex-end;gap:2px;height:${t}px">
    ${e.map((a,r)=>{const o=Math.max(3,(a-s)/n*t),c=r===e.length-1;return`<div style="width:8px;height:${o}px;background:${c?"var(--clr-primary)":"var(--color-border-secondary)"};border-radius:2px 2px 0 0;flex-shrink:0" title="${a}"></div>`}).join("")}
  </div>`}function _i(e,t){return e==="pass"||e===!0?`<span style="color:var(--clr-success-text)"><i class="ti ti-circle-check"></i> ${t}</span>`:e==="partial"||e==="warn"?`<span style="color:var(--clr-warning-text)"><i class="ti ti-alert-triangle"></i> ${t}</span>`:`<span style="color:var(--clr-danger-text)"><i class="ti ti-circle-x"></i> ${t}</span>`}function Vi(){return({executive:mt,securescore:Ji,identity:Ki,email:Yi,endpoint:Qi,teams:Xi,sharepoint:Zi,dataprotection:es,privaccess:ts,guests:is,incidents:ss,recommendations:as,copilot:ns,apiref:rs}[X]||mt)()}function mt(){const e=te;return`
    <!-- Secondary KPI row -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value warning">${$.identitySecureScore}</div>
        <div class="kpi-label">Identity Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${Ve.complianceScore}</div>
        <div class="kpi-label">Compliance Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${Math.round($.mfaEnabled/$.totalUsers*100)}%</div>
        <div class="kpi-label">MFA Adoption</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${$.riskySignIns30d}</div>
        <div class="kpi-label">Risky Sign-ins (30d)</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${ye.nonCompliant}</div>
        <div class="kpi-label">Non-Compliant Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${Je.dormantGuests90d}</div>
        <div class="kpi-label">Dormant Guests</div>
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <!-- Score trend + category breakdown -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-trending-up"></i> Secure Score Trend</span>
          <div style="display:flex;gap:4px">
            <button class="btn btn-xs ${Ce==="7d"?"btn-primary":""}" data-trend="7d">7d</button>
            <button class="btn btn-xs ${Ce==="30d"?"btn-primary":""}" data-trend="30d">30d</button>
          </div>
        </div>
        <div style="display:flex;align-items:flex-end;gap:16px;margin-bottom:16px">
          ${Pe(e.current,e.max,80)}
          <div>
            <div style="font-size:26px;font-weight:800;color:var(--clr-warning-text)">${e.current}<span style="font-size:13px;font-weight:500;color:var(--color-text-tertiary)"> / ${e.max}</span></div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:6px">Industry avg: ${e.avgComparable}/100 — you are +${e.current-e.avgComparable} above</div>
            <div style="display:flex;gap:12px;font-size:10px">
              <span style="color:${e.delta7d>=0?"var(--clr-success-text)":"var(--clr-danger-text)"}">${e.delta7d>=0?"▲":"▼"}${Math.abs(e.delta7d)} this week</span>
              <span style="color:${e.delta30d>=0?"var(--clr-success-text)":"var(--clr-danger-text)"}">${e.delta30d>=0?"▲":"▼"}${Math.abs(e.delta30d)} this month</span>
            </div>
          </div>
        </div>
        <div style="margin-bottom:12px" id="exec-trend-chart">
          ${Wi(Ce==="30d"?e.trend30d:e.trend7d,32)}
        </div>
        <div class="section-heading">Category breakdown</div>
        ${e.categories.map(t=>`
          <div class="score-bar-row" style="margin-bottom:6px">
            <span class="score-label" style="display:flex;align-items:center;gap:5px;min-width:120px">
              <i class="ti ${t.icon}" style="color:${t.color};font-size:12px"></i>${t.name}
            </span>
            <div class="score-bar" style="flex:1">
              <div class="score-bar-fill" style="width:${t.score}%;background:${t.color}"></div>
            </div>
            <span class="score-pct" style="color:${t.color}">${t.score}%</span>
          </div>
        `).join("")}
      </div>

      <!-- Service security grid -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-layout-grid"></i> Service Security Posture</span>
        </div>
        <div class="sec-svc-grid">
          ${[{name:"Identity",icon:"ti-user-check",score:68,color:"#0C447C",bg:"#E6F1FB",issues:$.highRiskUsers},{name:"Email",icon:"ti-mail",score:71,color:"#854F0B",bg:"#FAEEDA",issues:Vt.externalForwardingRules+1},{name:"Endpoint",icon:"ti-device-laptop",score:58,color:"#3B6D11",bg:"#EAF3DE",issues:ye.vulnerable},{name:"Teams",icon:"ti-brand-teams",score:74,color:"#3C3489",bg:"#EEEDFE",issues:Jt.publicTeams},{name:"SharePoint",icon:"ti-brand-sharepoint",score:66,color:"#3B6D11",bg:"#EAF3DE",issues:Kt.anonymousLinks},{name:"Data",icon:"ti-database",score:61,color:"#3C3489",bg:"#EEEDFE",issues:Ve.dlpViolations30d},{name:"Priv Access",icon:"ti-crown",score:78,color:"#854F0B",bg:"#FAEEDA",issues:Yt.permanentAssignments},{name:"Guests",icon:"ti-user-plus",score:72,color:"#633806",bg:"#FAEEDA",issues:Je.dormantGuests90d}].map(t=>(t.score>=80||t.score>=65,`<div class="sec-svc-tile" data-goto="${t.name.toLowerCase().replace(" ","").replace(".","")}" style="cursor:pointer">
              ${Pe(t.score,100,40)}
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:22px;height:22px;border-radius:5px;background:${t.bg};color:${t.color};display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0"><i class="ti ${t.icon}"></i></div>
                  <span style="font-size:11px;font-weight:600">${t.name}</span>
                </div>
                ${t.issues>0?`<div style="font-size:9px;color:var(--clr-warning-text);margin-top:2px">${t.issues} issue${t.issues>1?"s":""}</div>`:'<div style="font-size:9px;color:var(--clr-success-text);margin-top:2px">No issues</div>'}
              </div>
            </div>`)).join("")}
        </div>
      </div>
    </div>

    <!-- Incidents summary + Top recommendations -->
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Active Incidents</span>
          <button class="btn btn-xs btn-primary" id="exec-view-incidents">View all</button>
        </div>
        ${b.filter(t=>t.status!=="resolved").slice(0,4).map(t=>`
          <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span class="badge ${t.severity==="critical"||t.severity==="high"?"danger":"warning"}" style="flex-shrink:0;min-width:56px;justify-content:center">${t.severity}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.title}</div>
              <div style="font-size:9px;color:var(--color-text-tertiary)">${t.id} · ${t.category} · ${t.created}</div>
            </div>
          </div>
        `).join("")}
        <div style="margin-top:10px;padding:8px 10px;background:var(--clr-danger-bg);border-radius:var(--border-radius-md);font-size:11px;color:var(--clr-danger-text);line-height:1.5">
          <i class="ti ti-robot"></i> <strong>AI Summary:</strong>
          ${b.filter(t=>t.severity==="critical").length} critical incident${b.filter(t=>t.severity==="critical").length!==1?"s":""} detected.
          Ransomware indicators found on MBX-LAPTOP-047 — isolate device immediately.
          3 high-severity incidents include BEC attempt and risky sign-ins from unfamiliar locations.
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-checklist"></i> Top Recommendations</span>
          <button class="btn btn-xs btn-primary" id="exec-view-recs">View all</button>
        </div>
        ${I.filter(t=>t.priority==="critical"||t.priority==="high").slice(0,5).map(t=>`
          <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span class="badge ${t.priority==="critical"?"danger":"warning"}" style="flex-shrink:0;font-size:9px">${t.priority}</span>
            <span style="flex:1;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.title}</span>
            <span class="badge success" style="flex-shrink:0;font-size:9px">+${t.scoreGain}pts</span>
          </div>
        `).join("")}
      </div>
    </div>
  `}function Ji(){const e=te;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Microsoft Secure Score</div>
        <div style="display:flex;align-items:center;gap:24px;margin-bottom:20px">
          ${Pe(e.current,e.max,100)}
          <div>
            <div style="font-size:32px;font-weight:800;color:var(--clr-warning-text);line-height:1">${e.current}</div>
            <div style="font-size:16px;color:var(--color-text-tertiary)">out of ${e.max}</div>
            <div style="font-size:12px;color:var(--color-text-secondary);margin-top:8px">
              You are in the <strong style="color:var(--clr-info-text)">top 40%</strong> of similar organisations
            </div>
            <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Industry average: ${e.avgComparable}</div>
          </div>
        </div>
        <div class="kpi-row" style="gap:8px">
          <div class="kpi-tile" style="text-align:center">
            <div class="kpi-value ${e.delta7d>=0?"success":"danger"}">${e.delta7d>=0?"+":""}${e.delta7d}</div>
            <div class="kpi-label">7-day</div>
          </div>
          <div class="kpi-tile" style="text-align:center">
            <div class="kpi-value ${e.delta30d>=0?"success":"danger"}">${e.delta30d>=0?"+":""}${e.delta30d}</div>
            <div class="kpi-label">30-day</div>
          </div>
          <div class="kpi-tile" style="text-align:center">
            <div class="kpi-value ${e.delta90d>=0?"success":"danger"}">${e.delta90d>=0?"+":""}${e.delta90d}</div>
            <div class="kpi-label">90-day</div>
          </div>
          <div class="kpi-tile" style="text-align:center">
            <div class="kpi-value warning">${I.reduce((t,i)=>t+i.scoreGain,0)}</div>
            <div class="kpi-label">Potential gain</div>
          </div>
        </div>
        <div class="alert-banner info mt-3" style="margin-bottom:0">
          <i class="ti ti-api" style="font-size:12px"></i>
          <code style="font-size:10px">GET /v1.0/security/secureScores</code>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-chart-bar"></i> Score by Category</span>
        </div>
        ${e.categories.map(t=>`
          <div style="margin-bottom:14px">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
              <span style="font-size:12px;font-weight:600;display:flex;align-items:center;gap:6px">
                <i class="ti ${t.icon}" style="color:${t.color}"></i>${t.name}
              </span>
              <span style="font-size:12px;font-weight:700;color:${t.color}">${t.score}%</span>
            </div>
            <div class="score-bar" style="height:10px">
              <div class="score-bar-fill" style="width:${t.score}%;background:${t.color}"></div>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${t.score>=80?"✅ Good":t.score>=65?"⚠️ Needs attention":"🔴 Needs improvement"}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-list-check"></i> Improvement Actions</span>
        <span class="badge info">${I.length} recommendations · ${I.reduce((t,i)=>t+i.scoreGain,0)} pts potential</span>
      </div>
      <table>
        <thead><tr>
          <th style="width:12%">Priority</th>
          <th style="width:38%">Recommendation</th>
          <th style="width:13%">Category</th>
          <th style="width:10%">Score Gain</th>
          <th style="width:10%">Effort</th>
          <th style="width:12%">Status</th>
          <th style="width:5%"></th>
        </tr></thead>
        <tbody>
          ${I.slice(0,8).map(t=>`
            <tr>
              <td><span class="badge ${t.priority==="critical"?"danger":t.priority==="high"?"warning":t.priority==="medium"?"info":"neutral"}">${t.priority}</span></td>
              <td style="font-size:11px;font-weight:500">${t.title}</td>
              <td><span class="pill">${t.category}</span></td>
              <td><span class="badge success">+${t.scoreGain}</span></td>
              <td><span class="badge neutral">${t.effort}</span></td>
              <td><span class="badge ${t.status==="open"?"warning":"info"}">${t.status}</span></td>
              <td><button class="btn btn-xs"><i class="ti ti-arrow-right"></i></button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Ki(){const e=$;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-user-check"></i> Identity Posture</div>
        ${P([{label:"Total Users",val:e.totalUsers.toLocaleString(),cls:"info"},{label:"Privileged Accounts",val:e.privAccounts,cls:"warning"},{label:"Global Admins",val:e.globalAdmins,cls:"success"},{label:"Service Accounts",val:e.serviceAccounts,cls:"info"},{label:"Break Glass Accounts",val:e.breakGlass,cls:"success"},{label:"Identity Secure Score",val:e.identitySecureScore+"%",cls:"warning"}])}
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-device-mobile"></i> Authentication</div>
        ${P([{label:"MFA Enabled",val:e.mfaEnabled+" / "+e.totalUsers,cls:"success"},{label:"MFA Excluded",val:e.mfaExcluded,cls:"danger"},{label:"Passwordless %",val:e.passwordlessAdoption+"%",cls:"warning"},{label:"FIDO2 Adopted",val:e.fido2Adoption,cls:"info"},{label:"Legacy Auth Connections",val:e.legacyAuthConnections,cls:"danger"}])}
        <div style="margin-top:12px">
          <div class="section-heading">MFA Adoption</div>
          <div class="score-bar" style="height:10px;margin-bottom:4px">
            <div class="score-bar-fill warning" style="width:${Math.round(e.mfaEnabled/e.totalUsers*100)}%"></div>
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary)">${Math.round(e.mfaEnabled/e.totalUsers*100)}% — target 100%</div>
        </div>
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-eye"></i> Risk Monitoring (30 days)</div>
        <div class="alert-banner danger" style="margin-bottom:12px">
          <i class="ti ti-alert-triangle"></i>
          ${`${e.highRiskUsers} high-risk users require immediate attention.`}
        </div>
        ${P([{label:"High-Risk Users",val:e.highRiskUsers,cls:"danger"},{label:"Risky Sign-ins",val:e.riskySignIns30d,cls:"warning"},{label:"Impossible Travel",val:e.impossibleTravel30d,cls:"danger"},{label:"Anonymous IP Sign-ins",val:e.anonymousIP30d,cls:"warning"},{label:"Password Spray Attacks",val:e.passwordSpray30d,cls:"success"}])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/riskyUsers · GET /beta/riskDetections</code></div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-lock-access"></i> Conditional Access</div>
        ${P([{label:"Policies Enabled",val:e.caPoliciesEnabled,cls:"success"},{label:"Policies Disabled",val:e.caPoliciesDisabled,cls:"warning"},{label:"Report-Only Mode",val:e.caPoliciesReportOnly,cls:"warning"},{label:"Users Excluded",val:e.caUsersExcluded,cls:"warning"}])}
        ${z(["Require phishing-resistant MFA (FIDO2/CBA) for all admins","Remove legacy authentication via dedicated CA policy","Reduce Global Admin count to maximum 2 PIM-protected accounts","Review 18 CA policy exclusions — remove unnecessary exemptions"])}
      </div>
    </div>
  `}function Yi(){const e=Vt;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value danger">${e.phishingAttempts30d.toLocaleString()}</div><div class="kpi-label">Phishing Blocked (30d)</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.malwareDetected30d}</div><div class="kpi-label">Malware Detected</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.becAttempts30d}</div><div class="kpi-label">BEC Attempts</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.spoofedDomainActivity30d}</div><div class="kpi-label">Spoofed Domain</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${e.quarantined30d.toLocaleString()}</div><div class="kpi-label">Quarantined</div></div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Email Authentication Status</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${[{label:"SPF Record",ok:e.spf==="pass",note:"Configured — v=spf1 include:protection.outlook.com -all"},{label:"DKIM Signing",ok:e.dkim==="pass",note:"Enabled for contoso.com"},{label:"DMARC Policy",ok:"warn",note:`Policy: ${e.dmarc} — upgrade to reject for full protection`},{label:"Safe Links",ok:e.safeLinks==="enabled",note:"Active for all users"},{label:"Safe Attachments",ok:"warn",note:"Partial — not all users covered"},{label:"Anti-spam Policy",ok:"warn",note:`Level: ${e.antiSpamPolicy} — recommend strict`}].map(t=>`
            <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-tertiary)">
              <div style="font-size:10px;font-weight:700;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:5px">${t.label}</div>
              <div style="font-size:12px;font-weight:600;margin-bottom:3px">${_i(t.ok,t.ok==="pass"||t.ok===!0?"Pass":t.ok==="warn"?"Warning":"Fail")}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);line-height:1.3">${t.note}</div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-mail-forward"></i> Mail Flow Security</div>
        <div class="alert-banner danger mb-3">
          <i class="ti ti-alert-triangle"></i>
          ${`${e.externalForwardingRules} mailboxes have active external forwarding rules — potential data exfiltration risk.`}
        </div>
        ${P([{label:"External Forwarding Rules",val:e.externalForwardingRules,cls:"danger"},{label:"Suspicious Inbox Rules",val:e.suspiciousInboxRules,cls:"danger"},{label:"Shared Mailboxes",val:e.sharedMailboxExposed,cls:"info"}])}
        ${z(["Enable Strict Preset Security Policies in Defender for Office 365","Disable automatic external mail forwarding tenant-wide","Upgrade DMARC policy from quarantine to reject","Extend Safe Attachments coverage to all users (currently partial)"])}
      </div>
    </div>
  `}function Qi(){const e=ye;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${e.totalManaged}</div><div class="kpi-label">Managed Devices</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.nonCompliant}</div><div class="kpi-label">Non-Compliant</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.vulnerable}</div><div class="kpi-label">Vulnerable</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.ransomwareIndicators}</div><div class="kpi-label">Ransomware Indicators</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.missingCriticalPatches}</div><div class="kpi-label">Missing Patches</div></div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Protection Coverage</div>
        ${[{label:"Defender AV",pct:e.avCoverage,target:100},{label:"BitLocker",pct:e.bitlockerCoverage,target:100},{label:"Firewall Enabled",pct:e.firewallEnabled,target:100},{label:"Tamper Protection",pct:e.tamperProtection,target:100}].map(t=>{const i=t.pct>=99?"success":t.pct>=95?"warning":"danger";return`<div class="score-bar-row mb-2">
            <span class="score-label" style="min-width:140px">${t.label}</span>
            <div class="score-bar" style="flex:1;height:8px">
              <div class="score-bar-fill ${i}" style="width:${t.pct}%"></div>
            </div>
            <span class="score-pct" style="color:${t.pct<99?"var(--clr-warning-text)":"var(--clr-success-text)"}">${t.pct}%</span>
          </div>`}).join("")}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/deviceManagement/managedDevices?$select=isEncrypted,deviceName</code></div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-alert-triangle"></i> Threat Analytics</div>
        <div class="alert-banner danger mb-3">
          <i class="ti ti-virus"></i>
          <strong>Ransomware indicators detected on MBX-LAPTOP-047.</strong> INC-2341 is active — isolate device immediately.
        </div>
        ${P([{label:"Active Threats",val:e.activeThreats,cls:"danger"},{label:"High Severity Alerts",val:e.highSeverityAlerts,cls:"danger"},{label:"Windows 11 (%)",val:e.windows11Pct+"%",cls:"success"},{label:"Windows 10 (%)",val:e.windows10Pct+"%",cls:"warning"}])}
        ${z(["Patch 23 devices missing critical security updates","Isolate ransomware-affected device MBX-LAPTOP-047","Enable BitLocker on remaining 36 unencrypted devices","Harden SMB and RDP access on Windows 10 devices"])}
      </div>
    </div>
  `}function Xi(){const e=Jt;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${e.totalTeams}</div><div class="kpi-label">Total Teams</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.publicTeams}</div><div class="kpi-label">Public Teams</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.guestEnabledTeams}</div><div class="kpi-label">Guest Enabled</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.inactiveTeams90d}</div><div class="kpi-label">Inactive (90d+)</div></div>
      <div class="kpi-tile"><div class="kpi-value success">✓ Off</div><div class="kpi-label">Anon Meeting</div></div>
    </div>

    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-settings"></i> Teams Governance</div>
        ${P([{label:"Teams with External Sharing",val:e.teamsWithExternalSharing,cls:"warning"},{label:"Unowned Teams",val:e.unownedTeams,cls:"warning"},{label:"Guests Added (30d)",val:e.guestsAdded30d,cls:"info"},{label:"External Domains Allowed",val:e.externalDomainsAllowed,cls:"warning"}])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&$select=displayName,visibility</code></div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${z(["Archive 23 inactive Teams (90d+) to reduce sprawl and exposure","Assign owners to 5 unowned Teams","Conduct guest access review for 34 guest-enabled Teams","Review 8 public Teams — consider making private","Restrict external domains to known partners only"])}
      </div>
    </div>
  `}function Zi(){const e=Kt;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${e.totalSites}</div><div class="kpi-label">Total Sites</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.externallyShared}</div><div class="kpi-label">Externally Shared</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.anonymousLinks}</div><div class="kpi-label">Anonymous Links</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.sensitiveFiles}</div><div class="kpi-label">Sensitive Files Flagged</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.oversharedSites}</div><div class="kpi-label">Overshared Sites</div></div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-share"></i> Data Exposure</div>
        ${P([{label:"Public Content",val:e.publicContent,cls:"danger"},{label:"Large Downloads (30d)",val:e.largeDownloads30d,cls:"warning"},{label:"DLP Coverage",val:e.dlpCoveragePct+"%",cls:"warning"},{label:"Ext. Sharing Restricted",val:"Yes",cls:"success"}])}
        <div class="alert-banner danger mt-3" style="margin-bottom:0">
          <i class="ti ti-alert-triangle"></i>
          ${`${e.anonymousLinks} anonymous "Anyone" links allow unauthenticated access to content.`}
        </div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${z(["Remove 3 anonymous sharing links — replace with authenticated sharing","Review 5 overshared sites with > 100 members","Enable sensitivity labels for automatic file classification",'Restrict external sharing to "Existing guests only" on high-risk sites',"Configure DLP policy for SharePoint to reach 100% coverage"])}
      </div>
    </div>
  `}function es(){const e=Ve;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value warning">${e.sensitivityLabelsApplied}%</div><div class="kpi-label">Labels Applied</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.dlpViolations30d}</div><div class="kpi-label">DLP Violations (30d)</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.dataExfiltration30d}</div><div class="kpi-label">Exfiltration Events</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.usbTransfers30d}</div><div class="kpi-label">USB Transfers</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${e.complianceScore}</div><div class="kpi-label">Compliance Score</div></div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-tag"></i> Data Governance</div>
        ${P([{label:"Files Without Labels",val:e.filesWithoutLabels.toLocaleString(),cls:"danger"},{label:"Retention Policies",val:e.retentionPoliciesActive,cls:"info"},{label:"Insider Risk Policies",val:e.insiderRiskPolicies,cls:"info"},{label:"Unusual Downloads (30d)",val:e.unusualDownloads30d,cls:"warning"}])}
        <div class="section-heading mt-3">DLP Violation Categories</div>
        ${[{label:"PII Exposure",val:e.piiExposure},{label:"Financial Data",val:e.financialDataExposure},{label:"Healthcare Data",val:e.healthcareData}].map(t=>`
          <div class="score-bar-row mb-2">
            <span class="score-label" style="min-width:120px">${t.label}</span>
            <div class="score-bar" style="flex:1;height:7px">
              <div class="score-bar-fill danger" style="width:${(t.val/e.dlpViolations30d*100).toFixed(0)}%"></div>
            </div>
            <span style="font-size:10px;color:var(--clr-danger-text);min-width:24px;text-align:right">${t.val}</span>
          </div>
        `).join("")}
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${z(["Enable sensitivity auto-labeling for ~18,000 unlabeled Office files","Extend DLP policy coverage to include Teams messages","Configure insider risk policy for data exfiltration patterns","Review 3 USB transfer events — check device compliance policy","Expand retention policies to cover Teams chat and OneDrive"])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">Get-DlpCompliancePolicy | Get-Label | Get-RetentionCompliancePolicy</code></div>
      </div>
    </div>
  `}function ts(){const e=Yt;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${e.globalAdminCount}</div><div class="kpi-label">Global Admins</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${e.securityAdminCount}</div><div class="kpi-label">Security Admins</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.permanentAssignments}</div><div class="kpi-label">Permanent Roles</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${e.pimAdoption}%</div><div class="kpi-label">PIM Adoption</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.newAdmins30d}</div><div class="kpi-label">New Admins (30d)</div></div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-crown"></i> Admin Role Distribution</div>
        ${[{role:"Global Administrator",count:e.globalAdminCount,pim:!0},{role:"Security Administrator",count:e.securityAdminCount,pim:!0},{role:"Exchange Administrator",count:e.exchangeAdminCount,pim:!0},{role:"SharePoint Administrator",count:e.sharePointAdminCount,pim:!1},{role:"Teams Administrator",count:e.teamsAdminCount,pim:!1},{role:"Intune Administrator",count:e.intuneAdminCount,pim:!1}].map(t=>`
          <div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span style="flex:1;font-size:11px">${t.role}</span>
            <span class="badge info">${t.count}</span>
            <span class="badge ${t.pim?"success":"warning"}">${t.pim?"PIM":"Permanent"}</span>
          </div>
        `).join("")}
        <div class="alert-banner warning mt-3" style="margin-bottom:0">
          <i class="ti ti-alert-triangle"></i>
          ${e.permanentAssignments} permanent role assignments should be converted to PIM eligible.
        </div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-alert-triangle"></i> Critical Alerts (30d)</div>
        ${P([{label:"New Admin Created",val:e.newAdmins30d,cls:"warning"},{label:"Priv. Role Assignments",val:e.privRoleAssignments30d,cls:"info"},{label:"Emergency Access Used",val:e.emergencyAccess30d,cls:"success"},{label:"PIM Eligible Roles",val:e.pimEligibleRoles,cls:"success"}])}
        ${z(["Convert 4 permanent admin role assignments to PIM eligible","Implement Just-in-Time access for all privileged roles","Conduct quarterly access review for all admin role holders","Enable PIM access review notifications for approvers"])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/roleManagement/directory/roleEligibilitySchedules</code></div>
      </div>
    </div>
  `}function is(){const e=Je;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${e.totalGuests}</div><div class="kpi-label">Total Guests</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.dormantGuests90d}</div><div class="kpi-label">Dormant (90d+)</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.expiredGuests}</div><div class="kpi-label">Expired</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${e.guestsWithPrivAccess}</div><div class="kpi-label">With Priv. Access</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.quarterlyReviewOverdue}</div><div class="kpi-label">Review Overdue</div></div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-user-plus"></i> Guest Activity</div>
        ${P([{label:"Added (30d)",val:e.guestsAddedLast30d,cls:"info"},{label:"Removed (30d)",val:e.guestsRemovedLast30d,cls:"success"},{label:"Avg Account Age",val:e.avgGuestAgeDays+"d",cls:"warning"}])}
        <div class="alert-banner danger mt-3" style="margin-bottom:0">
          <i class="ti ti-clock"></i>
          ${e.expiredGuests} expired guest accounts should be removed immediately.
          ${e.dormantGuests90d} dormant guests require review.
        </div>
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /v1.0/users?$filter=userType eq 'Guest'&$select=displayName,signInActivity</code></div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${z(["Remove 3 expired guest accounts immediately","Review and remove 12 dormant guests (90d+ no sign-in)","Schedule overdue quarterly access review for 14 guests","Require manager attestation for all guest renewals","Implement automatic expiry policy (365 days max)"])}
      </div>
    </div>
  `}function ss(){const e=b.filter(r=>r.status!=="resolved"),t=b.filter(r=>r.status==="resolved"),i=b.filter(r=>r.severity==="critical").length,s=b.filter(r=>r.severity==="high").length,n=b.filter(r=>r.severity==="medium").length,a=b.filter(r=>r.severity==="low").length;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value ${i>0?"danger":"success"}">${i}</div><div class="kpi-label">Critical</div></div>
      <div class="kpi-tile"><div class="kpi-value ${s>0?"danger":"success"}">${s}</div><div class="kpi-label">High</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${n}</div><div class="kpi-label">Medium</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${a}</div><div class="kpi-label">Low</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${t.length}</div><div class="kpi-label">Resolved (7d)</div></div>
    </div>

    <div class="alert-banner danger mb-3">
      <i class="ti ti-robot"></i>
      <div>
        <strong>AI Security Summary:</strong> ${i} critical incident detected involving ransomware indicators on a managed endpoint.
        ${s} high-severity incidents include a BEC (business email compromise) attempt and risky identity sign-ins from unfamiliar locations.
        Immediate actions: isolate MBX-LAPTOP-047, force password reset for kevin.osei@contoso.com, and remediate suspicious inbox forwarding rule.
      </div>
    </div>

    <div class="section-heading mb-2">Active Incidents</div>
    ${e.map(r=>`
      <div class="card mb-2" style="border-left:3px solid ${r.severity==="critical"||r.severity==="high"?"var(--clr-danger-text)":"var(--clr-warning-text)"}">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
              <span class="monospace" style="font-size:10px;color:var(--color-text-tertiary)">${r.id}</span>
              <span class="badge ${r.severity==="critical"||r.severity==="high"?"danger":"warning"}">${r.severity}</span>
              <span class="badge neutral">${r.category}</span>
              <span class="badge ${r.status==="active"?"danger":r.status==="investigating"?"warning":"info"} dot">${r.status}</span>
            </div>
            <div style="font-size:12px;font-weight:700;margin-bottom:4px">${r.title}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary)">
              Assignee: ${r.assignee} · Services: ${r.services.join(", ")} · Created: ${r.created}
            </div>
          </div>
          <div style="margin-left:auto;display:flex;gap:6px;flex-shrink:0">
            <button class="btn btn-xs btn-danger">Investigate</button>
            <button class="btn btn-xs">Assign</button>
          </div>
        </div>
      </div>
    `).join("")}

    ${t.length>0?`
      <div class="section-heading mb-2" style="margin-top:16px">Recently Resolved</div>
      ${t.map(r=>`
        <div class="card mb-2" style="opacity:0.65">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="monospace" style="font-size:10px;color:var(--color-text-tertiary)">${r.id}</span>
            <span class="badge neutral">${r.severity}</span>
            <span style="flex:1;font-size:11px">${r.title}</span>
            <span class="badge success dot">Resolved</span>
            <span style="font-size:10px;color:var(--color-text-tertiary)">${r.created}</span>
          </div>
        </div>
      `).join("")}
    `:""}
  `}function as(){const e=I.filter(s=>!(h.priority!=="all"&&s.priority!==h.priority||h.category!=="all"&&s.category!==h.category||h.status!=="all"&&s.status!==h.status)),t=e.reduce((s,n)=>s+n.scoreGain,0),i=[...new Set(I.map(s=>s.category))];return`
    <div class="filter-bar mb-3">
      <select class="form-select" id="rec-priority">
        <option value="all" ${h.priority==="all"?"selected":""}>All Priorities</option>
        <option value="critical" ${h.priority==="critical"?"selected":""}>Critical</option>
        <option value="high" ${h.priority==="high"?"selected":""}>High</option>
        <option value="medium" ${h.priority==="medium"?"selected":""}>Medium</option>
        <option value="low" ${h.priority==="low"?"selected":""}>Low</option>
      </select>
      <select class="form-select" id="rec-category">
        <option value="all">All Categories</option>
        ${i.map(s=>`<option value="${s}" ${h.category===s?"selected":""}>${s}</option>`).join("")}
      </select>
      <select class="form-select" id="rec-status">
        <option value="all" ${h.status==="all"?"selected":""}>All Status</option>
        <option value="open" ${h.status==="open"?"selected":""}>Open</option>
        <option value="in-progress" ${h.status==="in-progress"?"selected":""}>In Progress</option>
      </select>
      <span class="badge info" style="align-self:center">${e.length} items · +${t} pts potential</span>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:11%">Priority</th>
          <th style="width:35%">Recommendation</th>
          <th style="width:11%">Category</th>
          <th style="width:23%">Graph / API Hint</th>
          <th style="width:8%">Score ↑</th>
          <th style="width:7%">Effort</th>
          <th style="width:5%">Status</th>
        </tr></thead>
        <tbody>
          ${e.map(s=>`
            <tr>
              <td><span class="badge ${s.priority==="critical"?"danger":s.priority==="high"?"warning":s.priority==="medium"?"info":"neutral"}" style="font-size:9px">${s.priority}</span></td>
              <td style="font-size:11px;font-weight:500;line-height:1.3">${s.title}</td>
              <td><span class="pill" style="font-size:9px">${s.category}</span></td>
              <td><code style="font-size:9px;color:var(--clr-info-text);word-break:break-all;line-height:1.4">${s.apiHint}</code></td>
              <td><span class="badge success" style="font-size:9px">+${s.scoreGain}</span></td>
              <td><span class="badge neutral" style="font-size:9px">${s.effort}</span></td>
              <td><span class="badge ${s.status==="in-progress"?"info":"warning"}" style="font-size:9px">${s.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function ns(){(!gt||ce.length===0)&&(ce=[{role:"ai",text:`**M365 Security Copilot** — I have full context of your security posture across all 15 data sources.

Current tenant: **Contoso.com** · Secure Score: **64/95** · ${b.filter(t=>t.status!=="resolved").length} active incidents

Ask me anything about your security posture, specific risks, or recommended actions.`}],gt=!0);const e=["Show me all high-risk users","Why did Secure Score drop this week?","Which Teams have external guests?","Top 10 security improvements","Which devices are vulnerable to ransomware?","Summarize today's security posture","Email security status","MFA coverage and gaps","Conditional Access coverage","Guest user governance"];return`
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="sec-copilot-msgs">
        ${ce.map(t=>`
          <div class="chat-msg ${t.role==="ai"?"ai":"user-msg"}" style="max-width:85%;margin-bottom:12px">
            ${t.role==="ai"?'<div class="chat-sender"><i class="ti ti-shield-check" style="color:var(--clr-info-text)"></i> Security Copilot</div>':'<div class="chat-sender" style="justify-content:flex-end">You</div>'}
            <div class="chat-bubble">${Qt(t.text)}</div>
          </div>
        `).join("")}
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:5px;padding:8px 0 8px;border-top:0.5px solid var(--color-border-tertiary)">
        ${e.slice(0,5).map(t=>`<button class="suggestion-pill sec-cop-pill" data-q="${t}">${t}</button>`).join("")}
      </div>

      <div class="chat-input-area" style="padding:0;border-top:none;margin-top:4px">
        <textarea class="chat-input" id="sec-cop-input" placeholder="Ask about Secure Score, risky users, vulnerabilities, recommendations..." rows="1"></textarea>
        <button class="btn btn-primary" id="sec-cop-send"><i class="ti ti-send"></i></button>
      </div>
    </div>
  `}function rs(){return`
    <div class="alert-banner info mb-3">
      <i class="ti ti-info-circle"></i>
      <div style="line-height:1.5">
        <strong>Security Data Abstraction Layer</strong> — AgentOps uses a hybrid collection model:
        <strong>Microsoft Graph API</strong> (Identity, Intune, Teams, SharePoint, Secure Score) +
        <strong>Defender XDR API</strong> (Incidents, Alerts) +
        <strong>Exchange Online PowerShell</strong> (DKIM, Mail Flow) +
        <strong>Purview PowerShell</strong> (DLP, Labels, Retention)
      </div>
    </div>

    ${[...new Set(vt.map(t=>t.category))].map(t=>`
      <div class="card mb-3" style="padding:0;overflow:hidden">
        <div class="section-heading" style="padding:8px 14px;margin:0;background:var(--color-background-secondary)">
          ${t}
        </div>
        <table>
          <thead><tr>
            <th style="width:7%">Method</th>
            <th style="width:18%">Source</th>
            <th style="width:40%">Endpoint / Command</th>
            <th style="width:25%">Data Returned</th>
            <th style="width:10%">Auth Scope</th>
          </tr></thead>
          <tbody>
            ${vt.filter(i=>i.category===t).map(i=>`
              <tr>
                <td><span class="method-badge ${i.method}" style="font-size:9px">${i.method}</span></td>
                <td style="font-size:10px;color:var(--color-text-secondary)">${i.source}</td>
                <td>
                  <code style="font-size:10px;color:var(--clr-info-text);word-break:break-all;line-height:1.5">${i.endpoint}</code>
                  <button class="btn btn-xs api-copy" data-code="${i.endpoint.replace(/"/g,"&quot;")}" style="margin-left:4px;padding:1px 5px;font-size:9px"><i class="ti ti-copy"></i></button>
                </td>
                <td style="font-size:10px;color:var(--color-text-secondary)">${i.returns}</td>
                <td><span class="pill" style="font-size:8px;word-break:break-all">${i.auth}</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `).join("")}

    <div class="card" style="background:var(--color-background-secondary)">
      <div class="card-title mb-2"><i class="ti ti-sitemap"></i> AgentOps Collector Architecture</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-top:8px">
        ${[{name:"Graph Collector",items:["Entra ID","Teams","Intune","SharePoint","Secure Score"],icon:"ti-api",color:"info"},{name:"Defender Collector",items:["Incidents","Alerts","Recommendations","TVM"],icon:"ti-shield-exclamation",color:"danger"},{name:"Exchange Collector",items:["Mailboxes","DKIM","Transport Rules","Permissions"],icon:"ti-mail",color:"warning"},{name:"Purview Collector",items:["DLP","Labels","Retention","Audit"],icon:"ti-lock",color:"purple"},{name:"Message Center",items:["Health Issues","MC Posts","Maintenance","Changes"],icon:"ti-antenna",color:"info"}].map(t=>`
          <div class="card" style="padding:10px">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
              <i class="ti ${t.icon}" style="color:var(--clr-${t.color}-text);font-size:14px"></i>
              <span style="font-size:11px;font-weight:700">${t.name}</span>
            </div>
            ${t.items.map(i=>`<div style="font-size:10px;color:var(--color-text-secondary);padding:2px 0;display:flex;gap:4px"><i class="ti ti-chevron-right" style="font-size:9px;margin-top:2px"></i>${i}</div>`).join("")}
          </div>
        `).join("")}
      </div>
    </div>
  `}function os(e){var n,a,r,o,c;const t=e.querySelector("#sec-content");if(!t)return;t.querySelectorAll("[data-trend]").forEach(l=>{l.addEventListener("click",()=>{Ce=l.dataset.trend,L(e)})}),t.querySelectorAll("[data-goto]").forEach(l=>{l.addEventListener("click",()=>{const y={identity:"identity",email:"email",endpoint:"endpoint",teams:"teams",sharepoint:"sharepoint",data:"dataprotection",privaccess:"privaccess",guests:"guests"}[l.dataset.goto];y&&(X=y,L(e))})}),(n=t.querySelector("#exec-view-incidents"))==null||n.addEventListener("click",()=>{X="incidents",L(e)}),(a=t.querySelector("#exec-view-recs"))==null||a.addEventListener("click",()=>{X="recommendations",L(e)}),(r=t.querySelector("#rec-priority"))==null||r.addEventListener("change",l=>{h.priority=l.target.value,L(e)}),(o=t.querySelector("#rec-category"))==null||o.addEventListener("change",l=>{h.category=l.target.value,L(e)}),(c=t.querySelector("#rec-status"))==null||c.addEventListener("change",l=>{h.status=l.target.value,L(e)});const i=t.querySelector("#sec-cop-send"),s=t.querySelector("#sec-cop-input");i&&s&&(i.addEventListener("click",()=>Fe(e,s)),s.addEventListener("keydown",l=>{l.key==="Enter"&&!l.shiftKey&&(l.preventDefault(),Fe(e,s))})),t.querySelectorAll(".sec-cop-pill").forEach(l=>{l.addEventListener("click",()=>{const u=t.querySelector("#sec-cop-input");u&&(u.value=l.dataset.q,Fe(e,u))})}),t.querySelectorAll(".api-copy").forEach(l=>{l.addEventListener("click",()=>{navigator.clipboard.writeText(l.dataset.code),p("Endpoint copied to clipboard.","success")})})}function Fe(e,t){const i=t.value.trim();if(!i)return;ce.push({role:"user",text:i}),t.value="";const s=e.querySelector("#sec-copilot-msgs");s&&(s.innerHTML+=`<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${i}</div>
    </div>`,s.scrollTop=s.scrollHeight),setTimeout(()=>{const n=i.toLowerCase(),a=Bi.find(o=>o.keywords.some(c=>n.includes(c))),r=(a==null?void 0:a.response)||`Analysing your query across all 15 security data sources...

For **"${i}"**: Based on current tenant data, navigate to the relevant section in the Security Command Center for detailed information. Use the Recommendations tab for prioritised action items, or check the Incidents section for active threats.

Current status: Secure Score 64/95 · ${b.filter(o=>o.status!=="resolved").length} active incidents · ${$.highRiskUsers} high-risk users.`;ce.push({role:"ai",text:r}),s&&(s.innerHTML+=`<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-shield-check" style="color:var(--clr-info-text)"></i> Security Copilot</div>
        <div class="chat-bubble">${Qt(r)}</div>
      </div>`,s.scrollTop=s.scrollHeight)},600)}function Qt(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n\n/g,"<br><br>").replace(/\n/g,"<br>").replace(/\|(.+)\|\n\|[-|: ]+\|\n/g,"").replace(/\|(.+)\|/g,t=>`<span style="display:flex;gap:16px;font-size:11px;padding:2px 0">${t.split("|").filter(s=>s.trim()).map(s=>`<span>${s.trim()}</span>`).join("")}</span>`)}function P(e){return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${e.map(t=>`
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-tertiary)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600;letter-spacing:0.3px">${t.label}</div>
        <div style="font-size:16px;font-weight:700;color:${t.cls==="success"?"var(--clr-success-text)":t.cls==="danger"?"var(--clr-danger-text)":t.cls==="warning"?"var(--clr-warning-text)":t.cls==="info"?"var(--clr-info-text)":"var(--color-text-primary)"}">${t.val}</div>
      </div>
    `).join("")}
  </div>`}function z(e){return`<div style="margin-top:12px">
    <div class="section-heading">Recommendations</div>
    ${e.map(t=>`
      <div style="display:flex;gap:6px;padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px;color:var(--color-text-secondary)">
        <i class="ti ti-arrow-right" style="color:var(--clr-warning-text);font-size:11px;flex-shrink:0;margin-top:2px"></i>
        ${t}
      </div>
    `).join("")}
  </div>`}const Xt=[{id:"identity",name:"Identity & Authentication",icon:"ti-user-shield",controls:[{id:"mfa-reg",name:"MFA Registration Coverage",desc:"Percentage of users registered for MFA across the tenant.",status:"warn",value:"87% of users have MFA registered (target: 100%)",remediation:"Enforce MFA registration via Conditional Access policy targeting all users. Set registration deadline and monitor via Entra ID MFA reporting."},{id:"ca-mfa",name:"MFA Conditional Access Policy",desc:"Conditional Access policy enforcing MFA for all sign-ins.",status:"pass",value:'Policy "Require MFA — All Users" is enabled and targeting all cloud apps.',remediation:"No action required. Policy is active and enforcing MFA."},{id:"ca-legacy",name:"Legacy Authentication Blocked",desc:"Conditional Access policy blocking all legacy authentication protocols.",status:"fail",value:"No Conditional Access policy blocking legacy authentication found.",remediation:'Create a Conditional Access policy with condition "Client apps: Other clients (legacy auth)" and grant control "Block access". Test in report-only mode first.'},{id:"ca-compliant",name:"Device Compliance Required",desc:"Conditional Access policy requiring compliant or Hybrid Azure AD joined devices.",status:"warn",value:"Policy exists but excludes 3 admin accounts and 2 service accounts.",remediation:"Review and reduce exclusions in the device compliance CA policy. Create named locations for legitimate breakglass exclusions only."}]},{id:"device",name:"Device Compliance & App Protection",icon:"ti-device-laptop",controls:[{id:"dev-comp",name:"Intune Device Compliance Policies",desc:"Compliance policies configured for Windows, iOS and Android platforms.",status:"warn",value:"Windows and iOS policies exist; Android policy missing.",remediation:"Create an Android device compliance policy in Intune covering OS version, device encryption, and screen lock requirements."},{id:"app-prot",name:"App Protection Policies",desc:"Intune MAM policies protecting corporate data on managed apps.",status:"pass",value:"iOS and Android APP policies configured and assigned.",remediation:"No action required."},{id:"workload",name:"Defender for Endpoint Integration",desc:"Microsoft Defender for Endpoint integrated with Intune for device risk signals.",status:"pass",value:"Connector enabled. Device risk level used in compliance policy.",remediation:"No action required."},{id:"risk-ca",name:"Device Risk-Based Access",desc:"Conditional Access blocking access from high-risk devices.",status:"fail",value:"No Conditional Access policy found using Defender device risk signal.",remediation:"Create a CA policy using the Defender for Endpoint device risk connector. Block or require password change for High risk device sign-ins."}]},{id:"priv",name:"Privileged Access & Entitlements",icon:"ti-crown",controls:[{id:"entitlement",name:"Entitlement Management (PIM)",desc:"Azure AD PIM deployed for privileged role activation.",status:"pass",value:"PIM is activated. Global Admin and Security Admin roles are managed.",remediation:"No action required."},{id:"pim",name:"Permanent Privileged Role Assignments",desc:"No users should hold permanent (non-PIM) privileged role assignments.",status:"warn",value:"4 accounts have permanent Global Admin assignment (recommend < 2).",remediation:"Convert permanent role assignments to PIM eligible assignments. Require justification and approval for activation. Target ≤ 2 break-glass Global Admin accounts."},{id:"reviews",name:"Access Reviews Configured",desc:"Regular access reviews scheduled for privileged roles.",status:"pass",value:"Quarterly access reviews configured for all directory roles.",remediation:"No action required."}]},{id:"guest",name:"Guest & External Governance",icon:"ti-users",controls:[{id:"guest",name:"Guest Access Governance",desc:"Guest user invitations restricted and access reviewed regularly.",status:"pass",value:"Guest invite policy: Admins and guest inviters only. Annual reviews configured.",remediation:"No action required."}]}];function ls(){const e=document.getElementById("page-zerotrust");if(!e)return;let t=Xt.flatMap(l=>l.controls),i=t.filter(l=>l.status==="pass").length,s=t.filter(l=>l.status==="warn").length,n=t.filter(l=>l.status==="fail").length;const a=t.length,r=(i/a*100).toFixed(0),o=(s/a*100).toFixed(0),c=(n/a*100).toFixed(0);e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">12 controls across 4 pillars — last assessed today</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="zt-rescan"><i class="ti ti-refresh"></i> Re-scan</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value warning">${i}/${a}</div>
        <div class="kpi-label">Overall Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${i}</div>
        <div class="kpi-label">Passed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${s}</div>
        <div class="kpi-label">Warnings</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${n}</div>
        <div class="kpi-label">Failed</div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Overall Zero Trust Posture</span>
        <span class="badge warning">${i}/${a} controls passed</span>
      </div>
      <div class="seg-bar" style="height:10px;border-radius:5px">
        <div class="seg pass" style="width:${r}%"></div>
        <div class="seg warn" style="width:${o}%"></div>
        <div class="seg fail" style="width:${c}%"></div>
      </div>
      <div style="display:flex;gap:20px;margin-top:8px">
        <span style="font-size:10px;color:var(--clr-success-text)">● ${i} Passed</span>
        <span style="font-size:10px;color:var(--clr-warning-text)">● ${s} Warnings</span>
        <span style="font-size:10px;color:var(--clr-danger-text)">● ${n} Failed</span>
      </div>
    </div>

    <div id="zt-pillars"></div>
  `,cs(e),e.querySelector("#zt-rescan").addEventListener("click",()=>{const l=e.querySelector("#zt-rescan");l.innerHTML='<span class="spinner dark"></span> Scanning...',l.disabled=!0,setTimeout(()=>{l.innerHTML='<i class="ti ti-refresh"></i> Re-scan',l.disabled=!1,p("Zero Trust scan complete — 12 controls assessed.","success")},2e3)})}function cs(e){const t=e.querySelector("#zt-pillars");t&&(t.innerHTML=Xt.map((i,s)=>{const n=i.controls.filter(l=>l.status==="pass").length,a=i.controls.filter(l=>l.status==="warn").length,r=i.controls.filter(l=>l.status==="fail").length,o=i.controls.length,c=r>0?"danger":a>0?"warning":"success";return`
      <div class="card mb-3" style="padding:0;overflow:hidden">
        <div class="collapsible-header" id="zt-pillar-hdr-${s}" style="border-radius:0;background:var(--color-background-secondary)">
          <i class="ti ${i.icon}" style="font-size:15px;color:var(--color-text-secondary)"></i>
          <span style="flex:1;font-size:12px;font-weight:600">${i.name}</span>
          <div style="display:flex;gap:6px;align-items:center;margin-right:8px">
            ${r>0?`<span class="badge danger">${r} fail</span>`:""}
            ${a>0?`<span class="badge warning">${a} warn</span>`:""}
            ${n>0?`<span class="badge success">${n} pass</span>`:""}
          </div>
          <div style="width:80px;margin-right:8px">
            <div class="score-bar"><div class="score-bar-fill ${c}" style="width:${(n/o*100).toFixed(0)}%"></div></div>
          </div>
          <i class="ti ti-chevron-down" style="font-size:13px;transition:transform 150ms ease" id="zt-pillar-chevron-${s}"></i>
        </div>
        <div class="collapsible-body open" id="zt-pillar-body-${s}">
          ${i.controls.map((l,u)=>`
            <div>
              <div class="zt-control-row" data-pi="${s}" data-ci="${u}">
                <div class="zt-status-icon ${l.status}">
                  <i class="ti ${l.status==="pass"?"ti-check":l.status==="warn"?"ti-alert-triangle":"ti-x"}"></i>
                </div>
                <div style="flex:1">
                  <div style="font-size:11px;font-weight:600">${l.name}</div>
                  <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:1px">${l.desc}</div>
                </div>
                <div style="font-size:10px;color:var(--color-text-secondary);max-width:180px;text-align:right;margin-right:8px;font-style:italic">${l.value||""}</div>
                <button class="chevron-btn zt-expand-btn"><i class="ti ti-chevron-right"></i></button>
              </div>
              <div class="zt-expand-panel ${l.status}-border" data-pi="${s}" data-ci="${u}">
                <strong>Remediation guidance</strong>
                <p style="margin-top:6px">${l.remediation||"No remediation required."}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `}).join(""),t.querySelectorAll('[id^="zt-pillar-hdr-"]').forEach(i=>{i.addEventListener("click",()=>{const s=i.id.replace("zt-pillar-hdr-",""),n=t.querySelector(`#zt-pillar-body-${s}`),a=t.querySelector(`#zt-pillar-chevron-${s}`);n.classList.toggle("open"),a&&(a.style.transform=n.classList.contains("open")?"rotate(0deg)":"rotate(-90deg)")})}),t.querySelectorAll(".zt-control-row").forEach(i=>{i.addEventListener("click",s=>{if(s.target.closest(".zt-expand-btn")){const{pi:n,ci:a}=i.dataset,r=t.querySelector(`.zt-expand-panel[data-pi="${n}"][data-ci="${a}"]`),o=i.querySelector(".zt-expand-btn");r&&(r.classList.toggle("open"),o.classList.toggle("open",r.classList.contains("open")))}})}))}const ke=[{id:"t1",num:"1",name:"Microsoft 365 Admin Center",icon:"ti-apps",iconBg:"#E6F1FB",iconColor:"#0C447C",subsections:[{id:"t1s1",name:"1.1 Users",controls:[{id:"1.1.1",title:"Ensure that between two and four global admins are designated",type:"auto",profile:"E3 L1",status:"pass",value:"2 Global Admins active in tenant.",desc:"Maintains the minimum necessary Global Admin accounts to reduce attack surface.",ps:`Get-MgDirectoryRoleMember -DirectoryRoleId (Get-MgDirectoryRole -Filter "displayName eq 'Global Administrator'").Id | Select DisplayName,UserPrincipalName`},{id:"1.1.2",title:"Ensure third-party integrated applications are not allowed",type:"auto",profile:"E3 L1",status:"warn",value:"User consent for third-party apps is set to: Allow user consent for apps from verified publishers.",desc:"Restricts OAuth app consent to reduce risk of malicious app data access.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateApps"},{id:"1.1.3",title:"Ensure the default user role has no ability to create tenants",type:"auto",profile:"E3 L1",status:"pass",value:"AllowedToCreateTenants: false",desc:"Prevents non-admin users from creating new Entra ID tenants.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions | Select AllowedToCreateTenants"},{id:"1.1.4",title:"Ensure Security Defaults are disabled when Conditional Access is used",type:"auto",profile:"E3 L1",status:"fail",value:"Security Defaults: ENABLED — conflicts with existing Conditional Access policies.",desc:"Security Defaults and Conditional Access are mutually exclusive and should not coexist.",ps:"(Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy).IsEnabled"}]},{id:"t1s2",name:"1.2 Teams & Groups",controls:[{id:"1.2.1",title:"Ensure Microsoft 365 Groups creation is restricted to admins",type:"auto",profile:"E3 L1",status:"warn",value:"Group creation: All users can create Microsoft 365 groups.",desc:"Limits group sprawl by restricting M365 group creation to administrators.",ps:"(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values"},{id:"1.2.2",title:"Ensure a dynamic group for guest users is configured",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Dynamic group enables governance and access management across all guest identities.",ps:null}]},{id:"t1s3",name:"1.3 Settings",controls:[{id:"1.3.1",title:"Ensure the admin consent workflow is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Admin consent workflow: Enabled. Reviewers: 2 admins configured.",desc:"Allows users to request admin approval for apps instead of self-consenting.",ps:"Get-MgPolicyAdminConsentRequestPolicy | Select IsEnabled"},{id:"1.3.2",title:"Ensure sign-in to shared mailboxes is blocked",type:"auto",profile:"E3 L1",status:"pass",value:"All 14 shared mailboxes have accounts blocked from interactive sign-in.",desc:"Shared mailbox accounts should not allow interactive login to prevent account abuse.",ps:`Get-MgUser -Filter "assignedLicenses/any() and userType eq 'Member'" -All | Where {$_.Mail -like '*shared*'}`},{id:"1.3.3",title:"Ensure the customer lockbox feature is enabled",type:"auto",profile:"E3 L2",status:"pass",value:"Customer Lockbox: Enabled",desc:"Customer Lockbox requires admin approval before Microsoft support can access tenant data.",ps:"Get-OrganizationConfig | Select CustomerLockBoxEnabled"},{id:"1.3.4",title:"Ensure notifications for internal phishing are enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Internal phishing notifications: Enabled via Defender anti-phishing policy.",desc:"Notifies users when internal phishing attempts are detected.",ps:"Get-AntiPhishPolicy | Select Name,EnableMailboxIntelligence,EnableFirstContactSafetyTips"},{id:"1.3.5",title:"Ensure Microsoft 365 audit log search is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Unified Audit Log: Enabled",desc:"Audit log enables security investigations and compliance reporting.",ps:"Get-AdminAuditLogConfig | Select UnifiedAuditLogIngestionEnabled"},{id:"1.3.6",title:"Ensure DLP policies are enabled for Microsoft Teams",type:"auto",profile:"E3 L1",status:"fail",value:"No DLP policy found targeting Microsoft Teams workload.",desc:"DLP policies prevent sensitive data from being shared via Teams messages.",ps:"Get-DlpCompliancePolicy | Where {$_.Workload -like '*Teams*'} | Select Name,Mode,Enabled"},{id:"1.3.7",title:"Ensure that Microsoft 365 passwords are not set to expire",type:"auto",profile:"E3 L1",status:"pass",value:"Password expiration policy: Disabled (never expire).",desc:"NIST guidance recommends not forcing periodic password changes; MFA is more effective.",ps:"Get-MgDomain | Select Id,PasswordNotificationWindowInDays,PasswordValidityPeriodInDays"},{id:"1.3.8",title:"Ensure self-service password reset is enabled",type:"auto",profile:"E3 L1",status:"warn",value:"SSPR: Enabled for selected users only (not all users).",desc:"SSPR reduces helpdesk burden and allows users to recover accounts securely.",ps:"Get-MgPolicySelfServiceSignUpPolicy | Select IsEnabled"},{id:"1.3.9",title:"Ensure the option to stay signed in is hidden",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Hiding the stay signed-in prompt reduces the risk of persistent session tokens on shared devices.",ps:null}]}]},{id:"t2",num:"2",name:"Microsoft Defender",icon:"ti-shield-check",iconBg:"#FCEBEB",iconColor:"#A32D2D",subsections:[{id:"t2s1",name:"2.1 Email & Collaboration",controls:[{id:"2.1.1",title:"Ensure Exchange Online Spam Policies are set correctly",type:"auto",profile:"E3 L1",status:"pass",value:"Default spam policy: HighConfidenceSpam = MoveToJmf, Spam = MoveToJmf.",desc:"Correct spam policy settings reduce phishing and junk mail exposure.",ps:"Get-HostedContentFilterPolicy -Identity Default | Select SpamAction,HighConfidenceSpamAction"},{id:"2.1.2",title:"Ensure Safe Links policy is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Safe Links: Enabled for all users. URL detonation enabled.",desc:"Safe Links protects users from malicious URLs in email and Office documents.",ps:"Get-SafeLinksPolicy | Select Name,IsEnabled,ScanUrls,EnableForInternalSenders"},{id:"2.1.3",title:"Ensure Safe Attachments policy is enabled",type:"auto",profile:"E3 L1",status:"fail",value:"Safe Attachments: No policy assigned to all users. Default policy only in report mode.",desc:"Safe Attachments detonates email attachments in a sandbox to detect malware.",ps:"Get-SafeAttachmentPolicy | Select Name,Action,Enable,Redirect"},{id:"2.1.4",title:"Ensure the anti-phishing policy is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Anti-phishing policy: Enabled with impersonation protection.",desc:"Anti-phishing policy protects against spoofing and impersonation attacks.",ps:"Get-AntiPhishPolicy | Select Name,Enabled,EnableSpoofIntelligence,EnableMailboxIntelligence"},{id:"2.1.5",title:"Ensure that SPF records are published for all Exchange Domains",type:"auto",profile:"E3 L1",status:"pass",value:"contoso.com: SPF record present — v=spf1 include:spf.protection.outlook.com -all",desc:"SPF records help prevent email spoofing by specifying authorized mail senders.",ps:'Resolve-DnsName contoso.com -Type TXT | Where {$_.Strings -like "*spf*"}'},{id:"2.1.6",title:"Ensure DKIM is enabled for all Exchange Online Domains",type:"auto",profile:"E3 L1",status:"pass",value:"DKIM signing: Enabled for contoso.com",desc:"DKIM signing adds cryptographic authentication to outbound email.",ps:"Get-DkimSigningConfig | Select Domain,Enabled"},{id:"2.1.7",title:"Ensure DMARC Records for all Exchange Online Domains are published",type:"auto",profile:"E3 L1",status:"pass",value:"contoso.com: DMARC record — v=DMARC1; p=quarantine; rua=mailto:dmarc@contoso.com",desc:"DMARC policy instructs receivers on how to handle emails failing SPF/DKIM checks.",ps:"Resolve-DnsName _dmarc.contoso.com -Type TXT"},{id:"2.1.8",title:"Ensure Priority account protection is enabled and configured",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Priority account protection provides enhanced threat protection for high-value users.",ps:null},{id:"2.1.9",title:"Ensure that Microsoft Defender for Office 365 is enabled",type:"auto",profile:"E5 L1",status:"pass",value:"Microsoft Defender for Office 365 Plan 2: Active",desc:"Defender for Office 365 provides advanced threat protection for email and collaboration.",ps:"Get-MgSubscribedSku | Where {$_.SkuPartNumber -like '*ATP*'}"},{id:"2.1.10",title:"Ensure Exchange Online Content Filtering is set to block malicious email",type:"auto",profile:"E3 L1",status:"pass",value:"Content filter: BulkThreshold=5, QuarantineTag=AdminOnlyAccessPolicy",desc:"Proper content filtering prevents bulk and malicious mail from reaching inboxes.",ps:"Get-HostedContentFilterPolicy | Select BulkThreshold,QuarantineTag"},{id:"2.1.11",title:"Ensure the connection filter policy is configured",type:"auto",profile:"E3 L1",status:"pass",value:"Connection filter: SafeList=False, IPAllowList empty.",desc:"Proper connection filter configuration prevents bypass of Exchange Online Protection.",ps:"Get-HostedConnectionFilterPolicy -Identity Default | Select SafeList,IPAllowList"},{id:"2.1.12",title:"Ensure tenant allow/block list is not configured for exceptions",type:"auto",profile:"E3 L1",status:"pass",value:"Allow list entries: 0. Block list entries: 3 (known malicious domains).",desc:"Excessive allow list entries bypass security controls and increase phishing risk.",ps:"Get-TenantAllowBlockListItems -ListType Sender -Allow | Measure-Object"},{id:"2.1.13",title:"Ensure alerts for suspicious email activity are configured",type:"auto",profile:"E3 L1",status:"pass",value:'Alert policy "Suspicious email sending patterns" is active.',desc:"Email activity alerts enable rapid detection of compromised accounts.",ps:"Get-ProtectionAlert | Where {$_.Category -eq 'ThreatManagement'} | Select Name,Severity,IsEnabled"},{id:"2.1.14",title:"Ensure the Report Message add-in is enabled",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Report Message add-in allows users to report suspicious emails directly to Microsoft.",ps:null},{id:"2.1.15",title:"Ensure mail forwarding rules are not forwarding to external domains",type:"auto",profile:"E3 L1",status:"pass",value:"External mail forwarding: Disabled at transport rule level.",desc:"Blocking external auto-forwarding prevents data exfiltration via compromised mailboxes.",ps:"Get-RemoteDomain Default | Select AutoForwardEnabled"}]},{id:"t2s2",name:"2.2 Cloud Apps",controls:[{id:"2.2.1",title:"Ensure Microsoft Defender for Cloud Apps is enabled",type:"auto",profile:"E5 L1",status:"warn",value:"Defender for Cloud Apps: Licensed but not fully configured — 3 connectors pending.",desc:"Defender for Cloud Apps provides CASB capabilities for cloud app governance.",ps:"# Check via Defender for Cloud Apps portal — no PowerShell equivalent"}]},{id:"t2s4",name:"2.4 System",controls:[{id:"2.4.1",title:"Ensure Microsoft Defender for Endpoint is deployed to all endpoints",type:"auto",profile:"E5 L1",status:"pass",value:"MDE onboarded: 847 / 847 devices (100%)",desc:"Defender for Endpoint provides endpoint detection and response capabilities.",ps:"# Review onboarding status in Defender portal: security.microsoft.com/machines"},{id:"2.4.2",title:"Ensure Microsoft Defender for Identity is enabled",type:"auto",profile:"E5 L1",status:"pass",value:"Defender for Identity workspace: Active. 2 domain controllers instrumented.",desc:"Defender for Identity detects lateral movement and privilege escalation in AD.",ps:"# Check workspace status in Defender XDR portal"},{id:"2.4.3",title:"Ensure Microsoft Defender XDR alert notifications are configured",type:"auto",profile:"E5 L1",status:"warn",value:"Notification rules: 1 configured (High severity only). Medium severity alerts not notified.",desc:"Alert notifications ensure security teams are informed of critical incidents.",ps:"# Configure in Microsoft Defender XDR Settings → Email notifications"},{id:"2.4.4",title:"Ensure Attack Simulation Training is enabled",type:"auto",profile:"E5 L1",status:"pass",value:"Attack Simulation: Active. Last campaign: 30 days ago. Click-through rate: 8%.",desc:"Attack simulation training measures and improves user phishing resilience.",ps:"# Review campaigns at security.microsoft.com/attacksimulator"},{id:"2.4.5",title:"Ensure Secure Score recommended actions are reviewed",type:"manual",profile:"E3 L1",status:"fail",value:null,desc:"Regular review of Secure Score actions ensures continuous security improvement.",ps:null}]}]},{id:"t3",num:"3",name:"Microsoft Purview",icon:"ti-lock",iconBg:"#EEEDFE",iconColor:"#3C3489",subsections:[{id:"t3s1",name:"3.1 Audit",controls:[{id:"3.1.1",title:"Ensure Microsoft 365 audit log search is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Unified Audit Log ingestion: Enabled",desc:"Audit log must be enabled to record all user and admin activities in Microsoft 365.",ps:"Get-AdminAuditLogConfig | Select UnifiedAuditLogIngestionEnabled"}]},{id:"t3s2",name:"3.2 Data Loss Prevention",controls:[{id:"3.2.1",title:"Ensure DLP policies are enabled for SharePoint and OneDrive",type:"auto",profile:"E3 L1",status:"pass",value:'DLP policy "Protect PII — SharePoint/OneDrive" active in Enforce mode.',desc:"DLP policies prevent sensitive data from being inappropriately shared via SharePoint.",ps:"Get-DlpCompliancePolicy | Where {$_.Workload -like '*SharePoint*'} | Select Name,Mode"},{id:"3.2.2",title:"Ensure DLP policies are enabled for Exchange Online",type:"auto",profile:"E3 L1",status:"pass",value:'DLP policy "Protect PII — Exchange" active in Enforce mode.',desc:"DLP policies prevent sensitive data from being emailed outside the organisation.",ps:"Get-DlpCompliancePolicy | Where {$_.Workload -like '*Exchange*'} | Select Name,Mode"},{id:"3.2.3",title:"Ensure DLP policies are enabled for Microsoft Teams",type:"auto",profile:"E3 L1",status:"fail",value:"No DLP policy found targeting Microsoft Teams workload.",desc:"Teams DLP prevents sensitive information from being shared in chat messages.",ps:"Get-DlpCompliancePolicy | Where {$_.Workload -like '*Teams*'} | Select Name,Mode,Enabled"}]},{id:"t3s3",name:"3.3 Information Protection",controls:[{id:"3.3.1",title:"Ensure sensitivity labels are established",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Sensitivity labels enable classification and protection of organisational data.",ps:null}]}]},{id:"t4",num:"4",name:"Microsoft Intune",icon:"ti-device-desktop",iconBg:"#EAF3DE",iconColor:"#3B6D11",subsections:[{id:"t4s1",name:"4. Device Compliance",controls:[{id:"4.1",title:"Ensure mobile device management policies are set to require advanced security configurations",type:"auto",profile:"E3 L1",status:"pass",value:"Compliance policies enforce encryption, PIN, and OS version for all platforms.",desc:"MDM compliance policies ensure devices meet minimum security requirements.",ps:"Get-MgDeviceManagementDeviceCompliancePolicy | Select DisplayName,Id"},{id:"4.2",title:"Ensure mobile device management policies are set to wipe on excessive failed attempts",type:"auto",profile:"E3 L1",status:"pass",value:"Device wipe configured after 10 failed sign-in attempts on managed devices.",desc:"Remote wipe capability protects corporate data on lost or stolen devices.",ps:"Get-MgDeviceManagementDeviceConfiguration | Select DisplayName | Where {$_.DisplayName -like '*Wipe*'}"}]}]},{id:"t5",num:"5",name:"Microsoft Entra Admin Center",icon:"ti-user-check",iconBg:"#E6F1FB",iconColor:"#185FA5",subsections:[{id:"t5s1",name:"5.1.2 Users",controls:[{id:"5.1.2.1",title:"Ensure Security Defaults is disabled on Azure Active Directory",type:"auto",profile:"E3 L1",status:"warn",value:"Security Defaults is enabled — may conflict with custom Conditional Access policies.",desc:"Security Defaults should be disabled when managing CA policies manually.",ps:"(Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy).IsEnabled"},{id:"5.1.2.2",title:"Ensure that only organisationally managed/approved public groups exist",type:"auto",profile:"E3 L1",status:"pass",value:"No unmanaged public groups found.",desc:"Public groups expose membership to all users and should be governed.",ps:`Get-MgGroup -Filter "visibility eq 'Public'" | Measure-Object`},{id:"5.1.2.3",title:"Ensure sign-in frequency is enabled and browser sessions are not persistent for administrative users",type:"auto",profile:"E3 L1",status:"pass",value:"Admin sign-in frequency: 1 hour. Persistent browser: Disabled.",desc:"Limiting admin session lifetime reduces risk from unattended privileged sessions.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Admin*Session*'}"},{id:"5.1.2.4",title:"Ensure the 'Password Hash Sync' feature is enabled for hybrid environments",type:"auto",profile:"E3 L1",status:"warn",value:"Hybrid detected — Password Hash Sync status could not be verified via Graph API.",desc:"PHS enables cloud-based password protection and leaked credential detection.",ps:"# Check via Azure AD Connect health dashboard"},{id:"5.1.2.5",title:"Ensure that password protection is enabled for on-premises Active Directory",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Entra ID Password Protection enforces banned password list on-premises.",ps:null},{id:"5.1.2.6",title:"Ensure multi-factor authentication is enabled for all users",type:"auto",profile:"E3 L1",status:"pass",value:"MFA enforced via Conditional Access for all users: Policy active.",desc:"Ensuring all users are enrolled in MFA prevents account compromise.",ps:"Get-MgUser -All | Where {$_.StrongAuthenticationRequirements.Count -eq 0}"}]},{id:"t5s2",name:"5.1.3 Groups",controls:[{id:"5.1.3.1",title:"Ensure that group owners can manage group membership requests in the Access Panel",type:"auto",profile:"E3 L1",status:"pass",value:"Self-service group management: Enabled for group owners.",desc:"Delegating group management to owners reduces admin burden while maintaining control.",ps:"(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values"},{id:"5.1.3.2",title:"Ensure that Microsoft 365 group creation is restricted to administrators",type:"auto",profile:"E3 L1",status:"warn",value:"M365 group creation: Allowed for all users.",desc:"Restricting group creation prevents uncontrolled group sprawl.",ps:"(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values | Where {$_.Name -eq 'EnableGroupCreation'}"},{id:"5.1.3.3",title:"Ensure that users can create security groups",type:"auto",profile:"E3 L1",status:"warn",value:"Security group creation: Allowed for all users.",desc:"Non-admin security group creation can lead to unmanaged group proliferation.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateSecurityGroups"},{id:"5.1.3.4",title:"Ensure expiration policies are set for Office 365 groups",type:"auto",profile:"E3 L1",status:"pass",value:"Group expiration policy: 180 days. Notifications to owners enabled.",desc:"Expiration policies remove stale groups and reduce security exposure.",ps:"Get-MgGroupLifecyclePolicy | Select GroupLifetimeInDays,AlternateNotificationEmails"}]},{id:"t5s3",name:"5.1.4 Devices",controls:[{id:"5.1.4.1",title:"Ensure that devices are joined to or registered with Azure Active Directory",type:"auto",profile:"E3 L1",status:"pass",value:"Device registration: 832 / 847 devices (98.2%) Entra-registered.",desc:"Device registration enables device-based Conditional Access policies.",ps:"Get-MgDevice -All | Group-Object TrustType | Select Name,Count"},{id:"5.1.4.2",title:"Ensure users can register apps",type:"auto",profile:"E3 L1",status:"pass",value:"User app registration: Disabled (admin only).",desc:"Restricting app registration prevents unauthorised app creation in Entra ID.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateApps"},{id:"5.1.4.3",title:"Ensure that the device inactivity limit is set to 15 minutes or fewer",type:"auto",profile:"E3 L1",status:"pass",value:"Device inactivity timeout: 15 minutes.",desc:"Screen timeout protects devices left unattended in shared environments.",ps:"# Configured via Intune device configuration profile"},{id:"5.1.4.4",title:"Ensure that BitLocker is enabled on Windows devices",type:"auto",profile:"E3 L1",status:"pass",value:"BitLocker compliance: 98% of Windows devices encrypted.",desc:"BitLocker encryption protects data at rest on Windows endpoints.",ps:`Get-MgDeviceManagementManagedDevice -Filter "operatingSystem eq 'Windows'" -All | Where {$_.IsEncrypted -eq $false}`},{id:"5.1.4.5",title:"Ensure Intune is used for device management",type:"auto",profile:"E3 L1",status:"pass",value:"Intune MDM authority: Active. Enrolled devices: 847.",desc:"Intune provides unified endpoint management and compliance enforcement.",ps:"Get-MgDeviceManagementManagedDevice -All | Measure-Object"},{id:"5.1.4.6",title:"Ensure that a diagnostic data sharing policy exists",type:"manual",profile:"E3 L2",status:"pass",value:null,desc:"Diagnostic data policies ensure compliance with data residency requirements.",ps:null}]},{id:"t5s4",name:"5.1.5 Enterprise Apps",controls:[{id:"5.1.5.1",title:"Ensure the option 'Users can consent to apps accessing company data on their behalf' is set to 'Do not allow user consent'",type:"auto",profile:"E3 L1",status:"pass",value:"User consent for company data: Do not allow user consent.",desc:"Preventing user consent stops OAuth phishing attacks via malicious app permissions.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.PermissionGrantPoliciesAssigned"},{id:"5.1.5.2",title:"Ensure that password hashes are not synced to Entra ID for cloud-only accounts",type:"auto",profile:"E3 L1",status:"pass",value:"Cloud-only accounts: No password hash sync configured.",desc:"Cloud-only accounts should not have PHS enabled as it is unnecessary.",ps:"# Verify via Azure AD Connect configuration"},{id:"5.1.5.3",title:"Ensure that only admin users have access to create service principals",type:"auto",profile:"E3 L1",status:"pass",value:"Service principal creation: Restricted to admins only.",desc:"Restricting service principal creation prevents abuse of application identities.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateApps"},{id:"5.1.5.4",title:"Ensure the admin consent workflow is enabled for applications",type:"auto",profile:"E3 L1",status:"pass",value:"Admin consent workflow: Enabled.",desc:"Admin consent workflow provides oversight of application permission grants.",ps:"Get-MgPolicyAdminConsentRequestPolicy | Select IsEnabled"},{id:"5.1.5.5",title:"Ensure that all service principals have certificate-based authentication",type:"auto",profile:"E5 L1",status:"pass",value:"Service principals with password credentials: 2 (legacy, being migrated).",desc:"Certificate auth is more secure than client secrets for service principals.",ps:"Get-MgApplication -All | Where {$_.PasswordCredentials.Count -gt 0} | Select DisplayName"},{id:"5.1.5.6",title:"Ensure that app registrations have an owner",type:"auto",profile:"E3 L1",status:"pass",value:"App registrations without owner: 0",desc:"App registration owners ensure accountability and lifecycle management.",ps:"Get-MgApplication -All | ForEach {Get-MgApplicationOwner -ApplicationId $_.Id} | Where {$_ -eq $null}"}]},{id:"t5s5",name:"5.1.6 External Identities",controls:[{id:"5.1.6.1",title:"Ensure that 'Guest invite restrictions' are set to 'Only users assigned to specific admin roles can invite guest users'",type:"auto",profile:"E3 L1",status:"pass",value:"Guest invite restrictions: Admin and guest inviters only.",desc:"Restricting guest invitations prevents uncontrolled external access.",ps:"(Get-MgPolicyAuthorizationPolicy).AllowInvitesFrom"},{id:"5.1.6.2",title:"Ensure that guest users have limited access to Azure AD directory objects",type:"auto",profile:"E3 L1",status:"pass",value:"Guest access level: Restricted (guests can't enumerate directory objects).",desc:"Limiting guest directory access prevents reconnaissance by external users.",ps:"(Get-MgPolicyAuthorizationPolicy).GuestUserRoleId"},{id:"5.1.6.3",title:"Ensure that external users cannot share files, folders, or sites they do not own",type:"auto",profile:"E3 L1",status:"pass",value:"SharePoint: External sharing restricted to existing guest users only.",desc:"Preventing re-sharing by guests limits data leakage to unauthorised parties.",ps:"Get-SPOTenant | Select ExternalUserExpirationRequired,RequireAcceptingAccountMatchInvitedAccount"}]},{id:"t5s6",name:"5.1.8 Hybrid Management",controls:[{id:"5.1.8.1",title:"Ensure Azure AD cloud sync is properly configured for hybrid environments",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Cloud sync ensures consistent identity management across on-premises and cloud.",ps:null}]},{id:"t5s7",name:"5.2.2 Conditional Access",controls:[{id:"5.2.2.1",title:"Ensure Conditional Access policies enforce MFA for all users",type:"auto",profile:"E3 L1",status:"pass",value:'CA policy "Require MFA — All Users" is enabled.',desc:"MFA for all users is the most impactful single security control available.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*MFA*All*'} | Select DisplayName,State"},{id:"5.2.2.2",title:"Ensure Conditional Access policies enforce MFA for all administrators",type:"auto",profile:"E3 L1",status:"pass",value:'CA policy "Require MFA — Admins" is enabled targeting all admin roles.',desc:"Admin accounts are high-value targets and require mandatory MFA enforcement.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Admin*MFA*'} | Select DisplayName,State"},{id:"5.2.2.3",title:"Ensure Conditional Access policies enforce MFA for Azure management",type:"auto",profile:"E3 L1",status:"pass",value:'CA policy "Require MFA — Azure Management" is active.',desc:"Azure management MFA prevents attackers from making infrastructure changes.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Azure*'} | Select DisplayName,State"},{id:"5.2.2.4",title:"Ensure Conditional Access policies block access from unknown or anonymous IP addresses",type:"auto",profile:"E3 L1",status:"pass",value:"Named locations defined. Anonymous IP policy active in block mode.",desc:"Blocking anonymous IP access prevents attacks from Tor and proxy networks.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Anonymous*'} | Select DisplayName,State"},{id:"5.2.2.5",title:"Ensure Conditional Access policies enforce a approved device compliance requirement",type:"auto",profile:"E3 L1",status:"fail",value:"Device compliance CA policy excludes 12 users (>10% of users). Policy incomplete.",desc:"Requiring compliant devices ensures corporate access only from managed endpoints.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Device*Compliant*'} | Select DisplayName,State,Conditions"},{id:"5.2.2.6",title:"Ensure Conditional Access policy blocks access for high sign-in risk",type:"auto",profile:"E5 L1",status:"pass",value:"Risk-based CA policy: High risk sign-ins blocked.",desc:"Risk-based CA leverages Microsoft threat intelligence to block suspicious sign-ins.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.SignInRiskLevels -contains 'high'} | Select DisplayName,State"},{id:"5.2.2.7",title:"Ensure Conditional Access policy blocks access for high user risk",type:"auto",profile:"E5 L1",status:"pass",value:"User risk policy: High risk users required to change password.",desc:"User risk policies force password reset for compromised account detection.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.UserRiskLevels -contains 'high'} | Select DisplayName,State"},{id:"5.2.2.8",title:"Ensure Conditional Access policy restricts access to legacy authentication",type:"auto",profile:"E3 L1",status:"pass",value:"Legacy auth block policy: Enabled.",desc:"Legacy authentication protocols do not support MFA and must be blocked.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.ClientAppTypes -contains 'exchangeActiveSync'} | Select DisplayName,State"},{id:"5.2.2.9",title:"Ensure that Conditional Access policies enforce MFA for device registration",type:"auto",profile:"E3 L1",status:"pass",value:"MFA required for device registration: Policy active.",desc:"MFA for device registration prevents attacker-controlled device enrolment.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Register Device*'} | Select DisplayName,State"},{id:"5.2.2.10",title:"Ensure that Conditional Access requires phishing-resistant MFA for admins",type:"auto",profile:"E5 L1",status:"pass",value:"Phishing-resistant MFA (FIDO2 / Certificate) required for admin roles.",desc:"Phishing-resistant MFA prevents real-time phishing bypass of standard MFA.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*FIDO*Admin*'} | Select DisplayName,State"},{id:"5.2.2.11",title:"Ensure that Conditional Access enforces Token Protection",type:"auto",profile:"E5 L2",status:"pass",value:"Token Protection policy: Active (preview).",desc:"Token Protection binds access tokens to specific devices to prevent token theft.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.SessionControls.SignInFrequency.AuthenticationType -eq 'primaryAndSecondaryAuthentication'}"},{id:"5.2.2.12",title:"Ensure that Conditional Access enforces Continuous Access Evaluation",type:"auto",profile:"E5 L1",status:"pass",value:"CAE: Enabled for all supported applications.",desc:"CAE enables near real-time enforcement of access policy changes and revocations.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.SessionControls.ContinuousAccessEvaluation -ne $null}"},{id:"5.2.2.13",title:"Ensure that Conditional Access Application Enforcement is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"App-enforced restrictions: Active for Exchange and SharePoint.",desc:"App-enforced restrictions apply policy directly within supported applications.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.SessionControls.ApplicationEnforcedRestrictions.IsEnabled -eq $true}"},{id:"5.2.2.14",title:"Ensure that Conditional Access blocks access to unsupported device platforms",type:"auto",profile:"E3 L1",status:"pass",value:"Unknown device platforms: Blocked.",desc:"Blocking unsupported platforms prevents access from unmanaged or unknown devices.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.Platforms.ExcludePlatforms -contains 'unknownFutureValue'}"},{id:"5.2.2.15",title:"Ensure that Conditional Access policies enforce Global Secure Access",type:"auto",profile:"E5 L1",status:"pass",value:"Global Secure Access traffic forwarding: Active.",desc:"Global Secure Access extends Zero Trust network access to all corporate resources.",ps:"# Verify in Entra ID → Global Secure Access → Dashboard"},{id:"5.2.2.16",title:"Ensure Conditional Access policy enforces MFA for all Microsoft Graph API calls",type:"auto",profile:"E5 L2",status:"pass",value:"Graph API MFA enforcement: CA policy active.",desc:"Requiring MFA for Graph access prevents programmatic data access by compromised accounts.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Graph*MFA*'}"},{id:"5.2.2.17",title:"Ensure named locations are defined",type:"auto",profile:"E3 L1",status:"pass",value:"3 named locations configured: UK Office (IP), US Office (IP), Trusted WiFi (IP).",desc:"Named locations enable risk-based policies distinguishing trusted from untrusted networks.",ps:"Get-MgIdentityConditionalAccessNamedLocation | Select DisplayName,OdataType"}]},{id:"t5s8",name:"5.2.3 Authentication Methods",controls:[{id:"5.2.3.1",title:"Ensure the Authentication Methods policy enables passwordless sign-in",type:"auto",profile:"E3 L1",status:"pass",value:"Microsoft Authenticator: Enabled. Passwordless phone sign-in: Enabled.",desc:"Passwordless authentication eliminates password theft risk entirely.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId MicrosoftAuthenticator"},{id:"5.2.3.2",title:"Ensure that SSPR policy is configured to require at least two authentication methods",type:"auto",profile:"E3 L1",status:"pass",value:"SSPR: Requires 2 methods. Allowed: Authenticator app + backup email.",desc:"Two-method SSPR requirement prevents account takeover via single-factor password reset.",ps:"Get-MgPolicySelfServiceSignUpPolicy | Select NumberOfMethodsRequired"},{id:"5.2.3.3",title:"Ensure the Authentication Methods Policy is configured to disable SMS and Voice",type:"auto",profile:"E3 L1",status:"pass",value:"SMS MFA: Disabled in auth methods policy.",desc:"SMS-based MFA is vulnerable to SIM-swapping and should be replaced by stronger methods.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId Sms"},{id:"5.2.3.4",title:"Ensure that FIDO2 security key authentication is enabled",type:"auto",profile:"E5 L1",status:"warn",value:"FIDO2: Enabled but restricted to IT group only (not all users).",desc:"FIDO2 hardware keys provide the strongest phishing-resistant authentication.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId Fido2"},{id:"5.2.3.5",title:"Ensure that certificate-based authentication is configured",type:"auto",profile:"E5 L1",status:"pass",value:"CBA: Enabled. PKI trust configured.",desc:"Certificate-based authentication provides strong, phishing-resistant authentication.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId X509Certificate"},{id:"5.2.3.6",title:"Ensure that Microsoft Authenticator is configured to show context for MFA requests",type:"auto",profile:"E3 L1",status:"pass",value:"Number matching: Enabled. Location context: Enabled. App name: Enabled.",desc:"MFA context helps users identify and reject suspicious push notifications (MFA fatigue).",ps:"(Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId MicrosoftAuthenticator).AdditionalProperties"},{id:"5.2.3.7",title:"Ensure TAP (Temporary Access Pass) is enabled for onboarding",type:"auto",profile:"E3 L1",status:"pass",value:"Temporary Access Pass: Enabled for admins only.",desc:"TAP enables secure onboarding of passwordless credentials for new users.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId TemporaryAccessPass"},{id:"5.2.3.8",title:"Ensure authentication strength is configured for privileged admin MFA",type:"auto",profile:"E5 L1",status:"pass",value:'Custom auth strength "Privileged Admin MFA" active: requires FIDO2 or CBA.',desc:"Authentication strengths enforce specific method requirements for privileged roles.",ps:"Get-MgPolicyAuthenticationStrengthPolicy | Select DisplayName,AllowedCombinations"},{id:"5.2.3.9",title:"Ensure that report-suspicious activity is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Report suspicious activity (MFA fraud): Enabled.",desc:"Fraud reporting enables users to flag unexpected MFA requests for investigation.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId Voice"},{id:"5.2.3.10",title:"Ensure the number of methods required to reset a password is set to 2",type:"auto",profile:"E3 L1",status:"pass",value:"SSPR: 2 authentication methods required to reset password.",desc:"Requiring two methods for SSPR prevents single-point password reset compromise.",ps:"(Get-MgPolicySelfServiceSignUpPolicy).NumberOfMethodsRequired"}]},{id:"t5s9",name:"5.2.4 Password Reset",controls:[{id:"5.2.4.1",title:"Ensure Self-Service Password Reset Activity report is reviewed weekly",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Regular SSPR activity review detects unusual reset patterns indicating account compromise.",ps:null},{id:"5.2.4.2",title:"Ensure custom banned passwords list is configured",type:"auto",profile:"E3 L1",status:"pass",value:"Custom banned passwords: 47 entries. Smart lockout: Enabled.",desc:"Custom banned passwords prevent use of known-weak or company-specific weak passwords.",ps:"# Verify in Entra ID → Authentication Methods → Password protection"},{id:"5.2.4.3",title:"Ensure password protection is enabled for on-premises AD",type:"auto",profile:"E3 L1",status:"pass",value:"Entra ID Password Protection: Active (Enforce mode) on DCs.",desc:"On-premises password protection extends cloud banned password list to AD.",ps:"# Check DC Agent installer status in Entra ID → Password protection"},{id:"5.2.4.4",title:"Ensure lockout threshold is set to 10 or fewer invalid sign-in attempts",type:"auto",profile:"E3 L1",status:"pass",value:"Smart lockout threshold: 10 attempts. Lockout duration: 60 seconds.",desc:"Lockout policy prevents brute-force attacks against user accounts.",ps:"# Check in Entra ID → Authentication Methods → Password protection"},{id:"5.2.4.5",title:"Ensure that the password reset notification is set to notify both users and admins",type:"auto",profile:"E3 L1",status:"pass",value:"SSPR notifications: User notified on reset. Admins notified when admin account reset.",desc:"Password reset notifications alert users to suspicious account changes.",ps:"Get-MgPolicySelfServiceSignUpPolicy | Select NotifyOnAdminPasswordReset,NotifyUsersOnPasswordReset"}]},{id:"t5s10",name:"5.3 Identity Governance",controls:[{id:"5.3.1",title:"Ensure Entitlement Management access packages are configured",type:"manual",profile:"E5 L1",status:"pass",value:null,desc:"Access packages streamline access request and lifecycle management.",ps:null},{id:"5.3.2",title:"Ensure access reviews are configured for privileged roles",type:"auto",profile:"E5 L1",status:"pass",value:"Access reviews: Quarterly for all directory roles. Last review: 45 days ago.",desc:"Regular access reviews ensure privileged access remains appropriate over time.",ps:"Get-MgIdentityGovernanceAccessReviewDefinition | Select DisplayName,Status"},{id:"5.3.3",title:"Ensure lifecycle workflows are configured for joiner/mover/leaver processes",type:"manual",profile:"E5 L1",status:"pass",value:null,desc:"Lifecycle workflows automate identity management for HR-driven events.",ps:null},{id:"5.3.4",title:"Ensure PIM access reviews are configured for eligible role assignments",type:"auto",profile:"E5 L1",status:"pass",value:"PIM access reviews: Active for Global Admin, Security Admin, Exchange Admin.",desc:"PIM access reviews prevent stale eligible role assignments from persisting.",ps:"Get-MgIdentityGovernancePrivilegedAccessGroupAssignmentApproval | Select Id,Status"},{id:"5.3.5",title:"Ensure that PIM activation approval is required for critical roles",type:"auto",profile:"E5 L1",status:"pass",value:"PIM approval: Required for Global Admin and Security Admin activation.",desc:"Requiring approval for PIM activation adds a human verification step for critical access.",ps:"# Check in Entra ID → PIM → Settings for each role"}]}]},{id:"t6",num:"6",name:"Exchange Admin Center",icon:"ti-mail",iconBg:"#FAEEDA",iconColor:"#854F0B",subsections:[{id:"t6s1",name:"6.1 Audit",controls:[{id:"6.1.1",title:"Ensure Microsoft Exchange Online audit logging is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Mailbox audit logging: Enabled by default for all users.",desc:"Exchange audit logging records mailbox access and admin actions for forensic review.",ps:"Get-OrganizationConfig | Select AuditDisabled"},{id:"6.1.2",title:"Ensure mailbox auditing for E3 users is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"AuditBypassEnabled: False for all mailboxes.",desc:"Per-mailbox audit settings ensure all mailbox activity is captured.",ps:"Get-Mailbox -ResultSize Unlimited | Where {$_.AuditEnabled -eq $false} | Measure-Object"},{id:"6.1.3",title:"Ensure the Exchange administrator audit log is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Admin audit log: Enabled. Log age limit: 90 days.",desc:"Admin audit logs capture all Exchange administrative changes.",ps:"Get-AdminAuditLogConfig | Select AdminAuditLogEnabled,AdminAuditLogAgeLimit"}]},{id:"t6s2",name:"6.2 Mail Flow",controls:[{id:"6.2.1",title:"Ensure all forms of mail forwarding are blocked and/or disabled",type:"auto",profile:"E3 L1",status:"pass",value:"Auto-forwarding to external domains: Blocked via transport rule.",desc:"Blocking external mail forwarding prevents data exfiltration from compromised mailboxes.",ps:"Get-TransportRule | Where {$_.RedirectMessageTo -ne $null} | Select Name,State"},{id:"6.2.2",title:"Ensure mail transport rules do not whitelist specific domains",type:"auto",profile:"E3 L1",status:"pass",value:"No transport rules bypassing spam filtering found.",desc:"Domain whitelisting in transport rules can allow phishing emails to bypass protection.",ps:"Get-TransportRule | Where {$_.SetSCL -eq -1} | Select Name,Conditions"},{id:"6.2.3",title:"Ensure email from external senders is tagged",type:"auto",profile:"E3 L1",status:"pass",value:'External email tagging: Enabled. Prepends "[EXTERNAL]" to subject.',desc:"External sender tagging helps users identify potentially suspicious emails.",ps:"Get-ExternalInOutlook | Select Enabled"}]},{id:"t6s3",name:"6.3 Roles",controls:[{id:"6.3.1",title:"Ensure the Exchange admin role is limited to an appropriate number of users",type:"auto",profile:"E3 L1",status:"pass",value:"Exchange Admins: 2 accounts.",desc:"Minimizing Exchange Admin accounts reduces the attack surface for email infrastructure.",ps:'Get-RoleGroupMember "Organization Management" | Select Name,RecipientType'},{id:"6.3.2",title:"Ensure Exchange role assignments are reviewed regularly",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Regular role reviews ensure Exchange admin assignments remain appropriate.",ps:null}]},{id:"t6s4",name:"6.5 Settings",controls:[{id:"6.5.1",title:"Ensure modern authentication for Exchange Online is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Modern Authentication (OAuth): Enabled for Exchange Online.",desc:"Modern auth is required for MFA to work with Exchange Online clients.",ps:"Get-OrganizationConfig | Select OAuth2ClientProfileEnabled"},{id:"6.5.2",title:"Ensure MailTips are enabled for end users",type:"auto",profile:"E3 L1",status:"pass",value:"MailTips: Enabled. Shows warnings for large audiences and external recipients.",desc:"MailTips provide visual warnings to reduce accidental email disclosure.",ps:"Get-OrganizationConfig | Select MailTipsAllTipsEnabled,MailTipsExternalRecipientsTipsEnabled"},{id:"6.5.3",title:"Ensure access to Exchange admin center is limited by IP address",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"IP-restricted EAC access reduces the attack surface for Exchange administration.",ps:null},{id:"6.5.4",title:"Ensure that mobile devices require complex passwords",type:"auto",profile:"E3 L1",status:"pass",value:"Mobile device policy: Requires PIN length ≥ 6, alphanumeric.",desc:"Complex mobile PINs protect against brute-force attacks on lost devices.",ps:"Get-MobileDeviceMailboxPolicy | Select Name,PasswordEnabled,MinPasswordLength,AlphanumericPasswordRequired"},{id:"6.5.5",title:"Ensure that additional storage providers are restricted in Outlook on the web",type:"auto",profile:"E3 L1",status:"pass",value:"Additional storage (e.g. Dropbox, Google Drive): Blocked in OWA.",desc:"Restricting external storage prevents data exfiltration via consumer cloud services.",ps:"Get-OwaMailboxPolicy | Select AdditionalStorageProvidersAvailable"}]}]},{id:"t7",num:"7",name:"SharePoint Admin Center",icon:"ti-brand-sharepoint",iconBg:"#EAF3DE",iconColor:"#3B6D11",subsections:[{id:"t7s1",name:"7.2 Policies",controls:[{id:"7.2.1",title:"Ensure SharePoint Online external sharing is managed",type:"auto",profile:"E3 L1",status:"pass",value:"Tenant-level external sharing: New and existing guests only (not Anyone links).",desc:"External sharing controls prevent unauthorised data access by external parties.",ps:"Get-SPOTenant | Select SharingCapability"},{id:"7.2.2",title:"Ensure OneDrive content sharing is restricted",type:"auto",profile:"E3 L1",status:"pass",value:"OneDrive sharing: Existing guests only.",desc:"OneDrive sharing restrictions prevent personal file shares from leaking corporate data.",ps:"Get-SPOTenant | Select OneDriveDefaultShareLinkRole"},{id:"7.2.3",title:"Ensure SharePoint access requests are limited to site owners",type:"auto",profile:"E3 L1",status:"pass",value:"Access request notifications: Sent to site owners only.",desc:"Directing access requests to owners ensures appropriate approvals.",ps:"# Review per-site setting via SPO admin center"},{id:"7.2.4",title:"Ensure guest access to sites is reviewed regularly",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Regular guest access reviews ensure external access remains appropriate.",ps:null},{id:"7.2.5",title:"Ensure that SharePoint guest users cannot share items they don't own",type:"auto",profile:"E3 L1",status:"pass",value:"RequireAcceptingAccountMatchInvitedAccount: True",desc:"Preventing guest re-sharing limits uncontrolled propagation of shared content.",ps:"Get-SPOTenant | Select RequireAcceptingAccountMatchInvitedAccount"},{id:"7.2.6",title:"Ensure SharePoint and OneDrive integration with Azure AD B2B is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"SharePoint B2B integration: Enabled.",desc:"B2B integration ensures external sharing uses Entra ID guest accounts for governance.",ps:"Get-SPOTenant | Select EnableAzureADB2BIntegration"},{id:"7.2.7",title:"Ensure SharePoint access restriction for unmanaged devices is configured",type:"auto",profile:"E3 L1",status:"pass",value:"Unmanaged device access: Limited web access only (no sync/download).",desc:"Restricting unmanaged device access prevents data sync to personal devices.",ps:"Get-SPOTenant | Select ConditionalAccessPolicy"},{id:"7.2.8",title:"Ensure idle session timeout for SharePoint and OneDrive is set",type:"auto",profile:"E3 L1",status:"pass",value:"Browser session timeout: 8 hours.",desc:"Session timeout protects SharePoint sessions left open on shared computers.",ps:"Get-SPOBrowserIdleSignOut | Select Enabled,SignOutAfter"},{id:"7.2.9",title:"Ensure SharePoint Online information barriers mode is configured",type:"manual",profile:"E5 L1",status:"pass",value:null,desc:"Information barriers prevent specific users or groups from communicating.",ps:null},{id:"7.2.10",title:"Ensure that SharePoint sends email notifications for sharing",type:"auto",profile:"E3 L1",status:"pass",value:"Sharing email notifications: Enabled.",desc:"Sharing notifications alert users when their content is shared with others.",ps:"Get-SPOTenant | Select NotificationsInSharePointEnabled"},{id:"7.2.11",title:"Ensure SharePoint external sharing is configured to 'Existing guests only' or more restrictive",type:"auto",profile:"E3 L1",status:"pass",value:"Sharing capability: ExistingExternalUserSharingOnly",desc:"Restricting to existing guests prevents new unauthenticated external sharing.",ps:"Get-SPOTenant | Select SharingCapability"}]},{id:"t7s2",name:"7.3 Settings",controls:[{id:"7.3.1",title:"Ensure custom script execution is restricted in SharePoint Online",type:"auto",profile:"E3 L1",status:"pass",value:"Custom scripts: DenyAndDisablePersonalSite + DenyCustomScriptUserSites.",desc:"Blocking custom scripts prevents injection attacks and unauthorised functionality.",ps:"Get-SPOSite -Limit All | Where {$_.DenyAddAndCustomizePages -eq 0}"}]}]},{id:"t8",num:"8",name:"Microsoft Teams Admin Center",icon:"ti-brand-teams",iconBg:"#EEEDFE",iconColor:"#3C3489",subsections:[{id:"t8s1",name:"8.1 Teams",controls:[{id:"8.1.1",title:"Ensure external domains are restricted in Teams",type:"auto",profile:"E3 L1",status:"pass",value:"External access: Specific allowed domains only (3 trusted partner domains).",desc:"Restricting external domains prevents communication with unknown organisations.",ps:"Get-CsTenantFederationConfiguration | Select AllowFederatedUsers,AllowedDomains"},{id:"8.1.2",title:"Ensure Teams is restricted from automatically accepting incoming meeting requests",type:"auto",profile:"E3 L1",status:"pass",value:"Auto-accept meeting invitations: Disabled.",desc:"Preventing auto-accept stops attendees from joining meetings without host presence.",ps:"Get-CsMeetingConfiguration | Select AutoAdmitUsers"}]},{id:"t8s2",name:"8.2 Users & External Access",controls:[{id:"8.2.1",title:"Ensure anonymous users cannot join Teams meetings",type:"auto",profile:"E3 L1",status:"pass",value:"Anonymous meeting join: Disabled.",desc:"Blocking anonymous join prevents uninvited parties from accessing meetings.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowAnonymousUsersToJoinMeeting"},{id:"8.2.2",title:"Ensure that users cannot bypass the lobby in Teams meetings",type:"auto",profile:"E3 L1",status:"pass",value:"Lobby bypass: Only organiser can bypass. All others enter lobby.",desc:"The meeting lobby gives organisers control over who joins their meetings.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AutoAdmitUsers"},{id:"8.2.3",title:"Ensure external participants cannot give or request control",type:"auto",profile:"E3 L1",status:"pass",value:"External control: AllowExternalParticipantGiveRequestControl = False.",desc:"Preventing external screen control reduces risk of social engineering attacks.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowExternalParticipantGiveRequestControl"},{id:"8.2.4",title:"Ensure Teams external chat is restricted",type:"auto",profile:"E3 L1",status:"pass",value:"External chat: Allowed with specific domains only.",desc:"Restricting external chat prevents data leakage via uncontrolled external communications.",ps:"Get-CsTenantFederationConfiguration | Select AllowTeamsConsumer,AllowTeamsConsumerInbound"}]},{id:"t8s3",name:"8.4 Teams Apps",controls:[{id:"8.4.1",title:"Ensure users are not able to install Teams apps from the App Store",type:"auto",profile:"E3 L1",status:"pass",value:"Teams app policy: Allow org-approved apps only.",desc:"Restricting app installs prevents unapproved or potentially malicious apps.",ps:"Get-CsTeamsAppPermissionPolicy | Select UserPinnedAppsSetting,DefaultCatalogApps"}]},{id:"t8s4",name:"8.5 Meetings",controls:[{id:"8.5.1",title:"Ensure that meeting recording is disabled for all non-essential users",type:"auto",profile:"E3 L1",status:"pass",value:"Meeting recording: Enabled for standard users. Stored in OneDrive.",desc:"Meeting recording policies control sensitive conversation capture.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowCloudRecording"},{id:"8.5.2",title:"Ensure external meeting recordings cannot be shared",type:"auto",profile:"E3 L1",status:"pass",value:"Recording sharing: Internal only.",desc:"Preventing external sharing of recordings protects confidential meeting content.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowRecordingStorageOutsideRegion"},{id:"8.5.3",title:"Ensure meeting chat does not allow anonymous users",type:"auto",profile:"E3 L1",status:"pass",value:"Meeting chat: Anonymous users cannot post.",desc:"Blocking anonymous meeting chat prevents uninvited contributions.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select MeetingChatEnabledType"},{id:"8.5.4",title:"Ensure presenter roles are restricted in Teams meetings",type:"auto",profile:"E3 L1",status:"pass",value:"Presenter role: Organiser and co-organisers only.",desc:"Restricting presenter roles limits who can share content or manage meeting controls.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowUserToBePresenter"},{id:"8.5.5",title:"Ensure Teams meeting recordings do not expire",type:"auto",profile:"E3 L1",status:"pass",value:"Meeting recording expiry: Disabled (no auto-expiry).",desc:"No-expiry recordings ensure evidence is available for compliance investigations.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select NewMeetingRecordingExpirationDays"},{id:"8.5.6",title:"Ensure NDI streaming is disabled",type:"auto",profile:"E3 L1",status:"pass",value:"NDI streaming: Disabled.",desc:"NDI streaming can expose meeting content to local network capture.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowNDIStreaming"},{id:"8.5.7",title:"Ensure watermarking is enabled for sensitive meetings",type:"manual",profile:"E5 L1",status:"pass",value:null,desc:"Watermarks on meeting content deter screenshot sharing of sensitive material.",ps:null},{id:"8.5.8",title:"Ensure screen capture is restricted for sensitive meetings",type:"auto",profile:"E5 L1",status:"pass",value:"Sensitivity label-based screen capture restriction: Active.",desc:"Screen capture restrictions protect sensitive meeting content from unauthorised capture.",ps:"Get-CsTeamsMeetingPolicy | Where {$_.AllowIPVideo -eq $false}"},{id:"8.5.9",title:"Ensure meeting transcription is managed",type:"auto",profile:"E3 L1",status:"pass",value:"Transcription: Allowed for all users. Stored in SharePoint.",desc:"Managing transcription ensures sensitive spoken content is appropriately protected.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowTranscription"}]},{id:"t8s5",name:"8.6 Messaging",controls:[{id:"8.6.1",title:"Ensure external Teams message sharing is restricted",type:"auto",profile:"E3 L1",status:"pass",value:"Teams consumer external chat: Blocked.",desc:"Blocking consumer Teams chat prevents data leakage to personal accounts.",ps:"Get-CsTenantFederationConfiguration | Select AllowTeamsConsumer"}]}]},{id:"t9",num:"9",name:"Microsoft Fabric",icon:"ti-chart-area",iconBg:"#E0F5F4",iconColor:"#0D6B68",subsections:[{id:"t9s1",name:"9.1 Tenant Settings",controls:[{id:"9.1.1",title:"Ensure Publish to web is restricted",type:"auto",profile:"E3 L1",status:"pass",value:"Publish to web: Disabled tenant-wide.",desc:"Publish to web creates public anonymous URLs and should be restricted.",ps:"# Check in Fabric admin portal: app.fabric.microsoft.com/admin-portal"},{id:"9.1.2",title:"Ensure external data sharing is disabled",type:"auto",profile:"E3 L1",status:"pass",value:"External data sharing: Disabled.",desc:"External data sharing controls prevent Fabric lakehouses from sharing data outside the tenant.",ps:"# Check in Fabric admin portal → Tenant settings → External data sharing"},{id:"9.1.3",title:"Ensure Fabric guest user access is managed",type:"auto",profile:"E3 L1",status:"pass",value:"Guest access to Fabric: Limited to specific workspaces via security groups.",desc:"Guest access governance prevents external users from accessing sensitive data assets.",ps:"# Review via Fabric admin portal → Users"},{id:"9.1.4",title:"Ensure that guest users can browse and access Fabric content is disabled",type:"auto",profile:"E3 L1",status:"pass",value:"Guest browsing: Disabled.",desc:"Preventing guests from browsing Fabric content limits exposure of data assets.",ps:"# Check Fabric admin portal → Tenant settings → Allow guest users to browse Fabric"},{id:"9.1.5",title:"Ensure custom visuals are restricted in Fabric reports",type:"auto",profile:"E3 L1",status:"pass",value:"Custom visuals: AppSource and certified only.",desc:"Restricting custom visuals reduces risk from malicious third-party Power BI visuals.",ps:"# Fabric admin portal → Tenant settings → Custom visuals"},{id:"9.1.6",title:"Ensure that R and Python visuals are restricted",type:"auto",profile:"E3 L1",status:"pass",value:"R/Python visuals: Disabled.",desc:"R and Python visuals can execute arbitrary code and should be restricted.",ps:"# Fabric admin portal → Tenant settings → R visual settings"},{id:"9.1.7",title:"Ensure data export to Excel is governed",type:"auto",profile:"E3 L1",status:"pass",value:"Export to Excel: Allowed but audited.",desc:"Governing Excel exports ensures sensitive data exports are tracked.",ps:"# Fabric admin portal → Export and sharing settings → Export to Excel"},{id:"9.1.8",title:"Ensure that Fabric workspaces have sensitivity labels applied",type:"manual",profile:"E5 L1",status:"pass",value:null,desc:"Sensitivity labels on Fabric workspaces enforce data protection policies on reports.",ps:null},{id:"9.1.9",title:"Ensure Fabric admin API audit logs are reviewed",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Regular audit log review detects unauthorised Fabric administrative changes.",ps:null},{id:"9.1.10",title:"Ensure service principals cannot use Fabric APIs",type:"auto",profile:"E3 L2",status:"pass",value:"Service principal API access: Disabled except for approved SPNs in allow group.",desc:"Restricting SPN access to Fabric APIs prevents abuse by compromised service accounts.",ps:"# Fabric admin portal → Developer settings → Allow service principals to use Fabric APIs"},{id:"9.1.11",title:"Ensure Fabric capacity admin roles are limited",type:"auto",profile:"E3 L1",status:"pass",value:"Fabric capacity admins: 2 accounts.",desc:"Minimizing Fabric admins reduces the blast radius of a compromised admin account.",ps:"# Review in Fabric admin portal → Capacity settings → Admins"},{id:"9.1.12",title:"Ensure Microsoft Purview integration with Fabric is enabled for data governance",type:"auto",profile:"E5 L1",status:"pass",value:"Purview integration: Active. Data lineage scanning enabled.",desc:"Purview integration provides data cataloguing and compliance visibility for Fabric assets.",ps:"# Fabric admin portal → Tenant settings → Microsoft Purview integration"}]}]}];let ie="main",Me=null;const Re={t1:{bg:"#E6F1FB",color:"#0C447C"},t2:{bg:"#FCEBEB",color:"#A32D2D"},t3:{bg:"#EEEDFE",color:"#3C3489"},t4:{bg:"#EAF3DE",color:"#3B6D11"},t5:{bg:"#E6F1FB",color:"#185FA5"},t6:{bg:"#FAEEDA",color:"#854F0B"},t7:{bg:"#EAF3DE",color:"#3B6D11"},t8:{bg:"#EEEDFE",color:"#3C3489"},t9:{bg:"#E0F5F4",color:"#0D6B68"}};function at(e){const t=e.subsections.flatMap(c=>c.controls),i=t.length;let s=0,n=0,a=0,r=0;t.forEach(c=>{const l=he(c);l==="pass"?s++:l==="fail"?n++:l==="warn"&&a++,c.type==="manual"&&r++});const o=i>0?Math.round(s/i*100):0;return{total:i,pass:s,fail:n,warn:a,manual:r,score:o}}function he(e){return d.cfgAttested[e.id]?"pass":e.status}function ds(){return ke.flatMap(e=>e.subsections.flatMap(t=>t.controls))}function Zt(){const e=ds();let t=0,i=0,s=0,n=0;e.forEach(o=>{const c=he(o);c==="pass"?t++:c==="fail"?i++:c==="warn"&&s++,o.type==="manual"&&n++});const a=e.length,r=Math.round(t/a*100);return{total:a,pass:t,fail:i,warn:s,manual:n,score:r}}function ps(e){const t={pass:["success","Pass"],fail:["danger","Failed"],warn:["warning","Warning"]},[i,s]=t[e]||["neutral","Unknown"];return`<span class="badge ${i}">${s}</span>`}function us(e){return e==="manual"?'<span class="badge purple">Manual</span>':'<span class="badge info">Auto</span>'}function vs(e){return`<span class="badge neutral" style="font-size:9px">${e}</span>`}function Ye(e){return e>=85?"success":e>=65?"warning":"danger"}function gs(){const e=document.getElementById("page-m365config");e&&(ie="main",Me=null,Le(e))}function Le(e){ie="main";const t=Zt(),i=Ye(t.score);e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> M365 Config — CIS Benchmark v7.0.0</div>
        <div class="page-subtitle">Last validated: Today at 08:45 AM · ${t.total} controls across 9 topics</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-scan-now"><i class="ti ti-refresh"></i> Run scan now</button>
        <button class="btn btn-primary" id="cfg-agent-btn"><i class="ti ti-robot"></i> Config Agent</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value ${i}">${t.score}%</div>
        <div class="kpi-label">Overall Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${t.pass}</div>
        <div class="kpi-label">Passed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${t.fail}</div>
        <div class="kpi-label">Failed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${t.warn}</div>
        <div class="kpi-label">Warnings</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value purple">${t.manual}</div>
        <div class="kpi-label">Manual</div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Overall Compliance Posture</span>
        <span class="badge ${i}">${t.score}% compliant</span>
      </div>
      <div class="seg-bar" style="height:12px;border-radius:6px">
        <div class="seg pass" style="width:${(t.pass/t.total*100).toFixed(1)}%"></div>
        <div class="seg warn" style="width:${(t.warn/t.total*100).toFixed(1)}%"></div>
        <div class="seg fail" style="width:${(t.fail/t.total*100).toFixed(1)}%"></div>
      </div>
      <div style="display:flex;gap:20px;margin-top:8px">
        <span style="font-size:10px;color:var(--clr-success-text)">● ${t.pass} Passed</span>
        <span style="font-size:10px;color:var(--clr-warning-text)">● ${t.warn} Warnings</span>
        <span style="font-size:10px;color:var(--clr-danger-text)">● ${t.fail} Failed</span>
        <span style="font-size:10px;color:var(--clr-purple-text)">● ${t.manual} Manual</span>
      </div>
    </div>

    <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">Topics</div>
    <div class="cfg-topic-grid" id="cfg-topic-grid"></div>
  `;const s=e.querySelector("#cfg-topic-grid");ke.forEach(n=>{const a=at(n),r=Ye(a.score),o=document.createElement("div");o.className="cfg-topic-card";const c=Re[n.id]||{bg:"#f0f0f0",color:"#555"};o.innerHTML=`
      <div class="cfg-topic-icon" style="background:${c.bg};color:${c.color}">
        <i class="ti ${n.icon}"></i>
      </div>
      <div class="cfg-topic-num">Topic ${n.num}</div>
      <div class="cfg-topic-name">${n.name}</div>
      <div class="cfg-topic-badges">
        ${a.fail>0?`<span class="badge danger">${a.fail} fail</span>`:""}
        ${a.warn>0?`<span class="badge warning">${a.warn} warn</span>`:""}
        ${a.pass>0?`<span class="badge success">${a.pass} pass</span>`:""}
      </div>
      <div class="cfg-topic-bar">
        <div class="score-bar">
          <div class="score-bar-fill ${r}" style="width:${a.score}%"></div>
        </div>
      </div>
      <div class="cfg-topic-pct">${a.score}% · ${a.total} controls</div>
    `,o.addEventListener("click",()=>ei(e,n)),s.appendChild(o)}),e.querySelector("#cfg-scan-now").addEventListener("click",()=>{const n=e.querySelector("#cfg-scan-now");n.innerHTML='<span class="spinner dark"></span> Scanning...',n.disabled=!0,setTimeout(()=>{n.innerHTML='<i class="ti ti-refresh"></i> Run scan now',n.disabled=!1,p("Scan complete — 96 controls validated.","success")},2200)}),e.querySelector("#cfg-agent-btn").addEventListener("click",()=>ys(e))}let f={search:"",status:"all",profile:"all"};function ei(e,t){ie="topic",Me=t,f={search:"",status:"all",profile:"all"};const i=at(t),s=Ye(i.score),n=Re[t.id]||{bg:"#f0f0f0",color:"#555"};e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="cfg-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div class="cfg-topic-icon" style="background:${n.bg};color:${n.color};width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px"><i class="ti ${t.icon}"></i></div>
        <div>
          <div class="page-title">Topic ${t.num} — ${t.name}</div>
          <div class="page-subtitle">${i.total} controls</div>
        </div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-topic-settings-btn" title="Admin Settings"><i class="ti ti-settings"></i></button>
        <button class="btn" id="cfg-topic-scan"><i class="ti ti-refresh"></i> Scan topic</button>
      </div>
    </div>

    ${d.settings.showPSCommands?"":`
      <div class="alert-banner info" style="margin-bottom:14px">
        <i class="ti ti-info-circle"></i>
        PowerShell commands are hidden. Enable in <a href="#" id="cfg-topic-settings-link" style="text-decoration:underline">Admin Settings</a>.
      </div>
    `}

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value ${s}">${i.score}%</div>
        <div class="kpi-label">Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${i.pass}</div>
        <div class="kpi-label">Passed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${i.fail}</div>
        <div class="kpi-label">Failed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${i.warn}</div>
        <div class="kpi-label">Warnings</div>
      </div>
    </div>

    <div class="filter-bar">
      <input type="text" class="form-input search" id="cfg-filter-search" placeholder="Search controls..." value="${f.search}">
      <select class="form-select" id="cfg-filter-status">
        <option value="all" ${f.status==="all"?"selected":""}>All Status</option>
        <option value="pass" ${f.status==="pass"?"selected":""}>Pass</option>
        <option value="fail" ${f.status==="fail"?"selected":""}>Failed</option>
        <option value="warn" ${f.status==="warn"?"selected":""}>Warning</option>
      </select>
      <select class="form-select" id="cfg-filter-profile">
        <option value="all">All Profiles</option>
        <option value="E3 L1">E3 L1</option>
        <option value="E3 L2">E3 L2</option>
        <option value="E5 L1">E5 L1</option>
        <option value="E5 L2">E5 L2</option>
      </select>
    </div>

    <div id="cfg-controls-area"></div>
  `,e.querySelector("#cfg-back").addEventListener("click",()=>Le(e)),e.querySelector("#cfg-topic-settings-btn").addEventListener("click",async()=>await x("settings"));const a=e.querySelector("#cfg-topic-settings-link");a&&a.addEventListener("click",async r=>{r.preventDefault(),await x("settings")}),e.querySelector("#cfg-topic-scan").addEventListener("click",()=>{const r=e.querySelector("#cfg-topic-scan");r.innerHTML='<span class="spinner dark"></span> Scanning...',r.disabled=!0,setTimeout(()=>{r.innerHTML='<i class="ti ti-refresh"></i> Scan topic',r.disabled=!1,p(`Topic ${t.num} scan complete.`,"success")},1800)}),e.querySelector("#cfg-filter-search").addEventListener("input",r=>{f.search=r.target.value,J(e,t)}),e.querySelector("#cfg-filter-status").addEventListener("change",r=>{f.status=r.target.value,J(e,t)}),e.querySelector("#cfg-filter-profile").addEventListener("change",r=>{f.profile=r.target.value,J(e,t)}),J(e,t)}function J(e,t){const i=e.querySelector("#cfg-controls-area");i&&(i.innerHTML=t.subsections.map(s=>{const n=s.controls.filter(a=>{const r=he(a);if(f.status!=="all"&&r!==f.status||f.profile!=="all"&&a.profile!==f.profile)return!1;if(f.search){const o=f.search.toLowerCase();if(!a.id.toLowerCase().includes(o)&&!a.title.toLowerCase().includes(o))return!1}return!0});return n.length===0?"":`
      <div class="card mb-3" style="padding:0;overflow:hidden">
        <div class="section-heading" style="padding:10px 14px;margin:0;border-bottom:0.5px solid var(--color-border-tertiary)">
          ${s.name}
        </div>
        ${n.map(a=>ms(a)).join("")}
      </div>
    `}).join(""),i.querySelectorAll(".cfg-control-row").forEach(s=>{s.addEventListener("click",n=>{if(n.target.closest("button"))return;const a=s.dataset.id,r=i.querySelector(`.cfg-expand-panel[data-id="${a}"]`),o=s.querySelector(".chevron-btn");r&&(r.classList.toggle("open"),o&&o.classList.toggle("open",r.classList.contains("open")))})}),i.querySelectorAll(".cfg-copy-btn").forEach(s=>{s.addEventListener("click",n=>{n.stopPropagation();const a=s.dataset.code;navigator.clipboard.writeText(a).then(()=>{s.classList.add("copy-flash"),s.innerHTML='<i class="ti ti-check"></i>',setTimeout(()=>{s.classList.remove("copy-flash"),s.innerHTML='<i class="ti ti-copy"></i>'},1500)})})}),i.querySelectorAll(".cfg-attest-btn").forEach(s=>{s.addEventListener("click",n=>{n.stopPropagation();const a=s.dataset.id,r=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});d.cfgAttested[a]=r,m(),J(e,t),p(`Control ${a} marked as compliant.`,"success")})}),i.querySelectorAll(".cfg-revoke-btn").forEach(s=>{s.addEventListener("click",n=>{n.stopPropagation();const a=s.dataset.id;delete d.cfgAttested[a],m(),J(e,t),p(`Attestation for ${a} revoked.`,"warning")})}),d.settings.autoExpandFailed&&i.querySelectorAll(".cfg-expand-panel").forEach(s=>{const n=s.dataset.id,a=t.subsections.flatMap(r=>r.controls).find(r=>r.id===n);if(a&&he(a)==="fail"){s.classList.add("open");const r=i.querySelector(`.cfg-control-row[data-id="${n}"] .chevron-btn`);r&&r.classList.add("open")}}))}function ms(e){const t=he(e),i=d.cfgAttested[e.id];let s="";i?s=`
      <div class="cfg-attestation-strip attested">
        <span><i class="ti ti-circle-check"></i> Verified and marked compliant — ${i}</span>
        <button class="btn btn-xs btn-danger cfg-revoke-btn" data-id="${e.id}">Revoke</button>
      </div>
    `:e.type==="manual"&&t!=="pass"?s=`
      <div class="cfg-attestation-strip manual-strip">
        <span><i class="ti ti-clipboard-check"></i> Manual validation required — verify in admin portal.</span>
        <button class="btn btn-xs btn-success cfg-attest-btn" data-id="${e.id}">Mark as compliant</button>
      </div>
    `:t==="fail"&&(s=`
      <div class="cfg-attestation-strip fail-strip">
        <span><i class="ti ti-alert-triangle"></i> Non-compliant — after remediation confirm here</span>
        <button class="btn btn-xs btn-success cfg-attest-btn" data-id="${e.id}">Mark as remediated</button>
      </div>
    `);let n="";return d.settings.showPSCommands&&e.ps&&(n+=`
      <div class="code-block-header">
        <span>PowerShell Validation</span>
        <button class="btn btn-xs cfg-copy-btn" data-code="${fs(e.ps)}"><i class="ti ti-copy"></i> Copy</button>
      </div>
      <div class="cfg-ps-block">${ft(e.ps)}</div>
    `),d.settings.showTenantResult&&e.value&&(n+=`
      <div class="code-block-header"><span>Tenant Result</span></div>
      <div class="cfg-result-block" style="color:${t==="fail"?"var(--clr-danger-text)":"var(--clr-success-text)"}">${ft(e.value)}</div>
    `),!e.ps&&e.type==="manual"&&(n+='<div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;font-style:italic">Manual validation required — verify in admin portal.</div>'),n+=s,`
    <div class="cfg-control-row" data-id="${e.id}">
      <div class="cfg-control-id">${e.id}</div>
      ${vs(e.profile)}
      <div class="cfg-control-title">${e.title}</div>
      <div class="cfg-control-badges">
        ${ps(t)}
        ${us(e.type)}
      </div>
      <button class="chevron-btn"><i class="ti ti-chevron-right"></i></button>
    </div>
    <div class="cfg-expand-panel" data-id="${e.id}">
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.5">${e.desc}</div>
      ${n}
    </div>
  `}const yt=Object.fromEntries(ke.map(e=>[e.id,!0]));function ys(e){ie="agent";const t=d.cfgAgentLog;e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="cfg-agent-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title"><i class="ti ti-robot"></i> M365 Config Agent</div>
          <div class="page-subtitle">Automated CIS compliance scanning agent</div>
        </div>
      </div>
    </div>

    <div class="agent-card-lg">
      <div class="agent-icon-lg" style="background:#E0F5F4;color:#0D6B68"><i class="ti ti-robot"></i></div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:700;margin-bottom:4px">M365 Config Compliance Agent</div>
        <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.5;margin-bottom:10px">
          Automated agent that scans all 9 CIS Benchmark topic areas across your Microsoft 365 tenant.
          Identifies compliance drift, sends alerts on new failures, and maintains audit evidence.
        </div>
        <div class="agent-status-row">
          <div class="status-dot active pulse"></div>
          <span style="font-size:12px;font-weight:600;color:var(--clr-success-text)">Active</span>
          <span style="font-size:10px;color:var(--color-text-tertiary);margin-left:8px">Running on schedule</span>
        </div>
      </div>
      <button class="btn btn-primary" id="cfg-agent-run-now"><i class="ti ti-player-play"></i> Run scan now</button>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">Today 08:45</div>
        <div class="kpi-label">Last Scan</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">78%</div>
        <div class="kpi-label">Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">96</div>
        <div class="kpi-label">Controls</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">4</div>
        <div class="kpi-label">New Fails</div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-settings"></i> Agent Configuration</div>
        <div class="form-group">
          <label class="form-label">Scan frequency</label>
          <select class="form-select" id="agent-schedule">
            <option value="daily-0800" ${d.settings.agentSchedule==="daily-0800"?"selected":""}>Daily at 08:00</option>
            <option value="every-6h" ${d.settings.agentSchedule==="every-6h"?"selected":""}>Every 6 hours</option>
            <option value="weekly" ${d.settings.agentSchedule==="weekly"?"selected":""}>Weekly</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Alert email</label>
          <input type="email" class="form-input" id="agent-email" value="${d.settings.agentAlertEmail}">
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="agent-alert-fail" ${d.settings.agentAlertOnFail?"checked":""}>
            <span style="font-size:12px">Alert on new failures</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="agent-daily-digest" ${d.settings.agentDailyDigest?"checked":""}>
            <span style="font-size:12px">Daily digest email</span>
          </label>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" checked>
            <span style="font-size:12px">Auto-remediation suggestions</span>
          </label>
        </div>
        <button class="btn btn-primary" id="agent-save-cfg"><i class="ti ti-device-floppy"></i> Save configuration</button>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-list-check"></i> Topics Monitored</div>
        ${ke.map(i=>{var s,n;return`
          <div class="topic-toggle-row">
            <div class="cfg-topic-icon" style="background:${((s=Re[i.id])==null?void 0:s.bg)||"#f0f0f0"};color:${((n=Re[i.id])==null?void 0:n.color)||"#555"};width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0">
              <i class="ti ${i.icon}"></i>
            </div>
            <span style="flex:1;font-size:11px">${i.name}</span>
            <label class="toggle-switch">
              <input type="checkbox" class="topic-enabled-toggle" data-tid="${i.id}" ${yt[i.id]?"checked":""}>
              <span class="toggle-track"></span>
            </label>
          </div>
        `}).join("")}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-terminal"></i> Scan Log</span>
        <button class="btn btn-sm" id="agent-clear-log">Clear</button>
      </div>
      <div id="agent-scan-log" style="max-height:300px;overflow-y:auto">
        ${t.length===0?'<div class="empty-state">No scan log entries yet. Run a scan to generate log entries.</div>':t.map(ti).join("")}
      </div>
    </div>
  `,e.querySelector("#cfg-agent-back").addEventListener("click",()=>Le(e)),e.querySelector("#agent-save-cfg").addEventListener("click",()=>{d.settings.agentSchedule=e.querySelector("#agent-schedule").value,d.settings.agentAlertEmail=e.querySelector("#agent-email").value,d.settings.agentAlertOnFail=e.querySelector("#agent-alert-fail").checked,d.settings.agentDailyDigest=e.querySelector("#agent-daily-digest").checked,m(),p("Agent configuration saved.","success")}),e.querySelector("#agent-clear-log").addEventListener("click",()=>{d.cfgAgentLog=[],m(),e.querySelector("#agent-scan-log").innerHTML='<div class="empty-state">Log cleared.</div>'}),e.querySelector("#cfg-agent-run-now").addEventListener("click",()=>{hs(e)}),e.querySelectorAll(".topic-enabled-toggle").forEach(i=>{i.addEventListener("change",s=>{yt[s.target.dataset.tid]=s.target.checked})})}function ti(e){const t={scan:"ti-scan",pass:"ti-circle-check",fail:"ti-circle-x",warn:"ti-alert-triangle",info:"ti-info-circle",done:"ti-check"},i={scan:"var(--clr-info-text)",pass:"var(--clr-success-text)",fail:"var(--clr-danger-text)",warn:"var(--clr-warning-text)",info:"var(--clr-info-text)",done:"var(--clr-success-text)"};return`
    <div class="scan-log-entry">
      <span class="scan-log-time">${e.time}</span>
      <i class="ti ${t[e.type]||"ti-info-circle"} scan-log-icon" style="color:${i[e.type]||"inherit"}"></i>
      <span style="flex:1;color:var(--color-text-secondary)">${e.msg}</span>
    </div>
  `}async function hs(e){const t=e.querySelector("#cfg-agent-run-now");t.innerHTML='<span class="spinner"></span> Scanning...',t.disabled=!0;const i=e.querySelector("#agent-scan-log");i.innerHTML="";const s=new Date,n=()=>s.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"}),a=[],r=(c,l)=>{const u={type:c,msg:l,time:n()};a.unshift(u),d.cfgAgentLog=a.slice(0,50),m(),i.innerHTML=a.map(ti).join("")};r("info","Agent scan initiated — scanning 9 topic areas...");for(const c of ke){await ht(350);const l=at(c),u=l.fail>0?"fail":l.warn>0?"warn":"pass";r(u,`Topic ${c.num}: ${c.name} — ${l.pass} pass, ${l.warn} warn, ${l.fail} fail`)}await ht(400);const o=Zt();r("done",`Scan complete — Score: ${o.score}% · ${o.pass} pass · ${o.warn} warn · ${o.fail} fail`),t.innerHTML='<i class="ti ti-player-play"></i> Run scan now',t.disabled=!1,p("Agent scan complete — 96 controls validated.","success")}function ht(e){return new Promise(t=>setTimeout(t,e))}function Ue(){const e=document.getElementById("page-m365config");!e||!e.classList.contains("active")||(ie==="topic"&&Me?ei(e,Me):ie==="main"&&Le(e))}function ft(e){return e?e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}function fs(e){return e?e.replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}const nt=[{id:"pa1",upn:"aisha.raza@contoso.com",name:"Aisha Raza",bg:"#791F1F",roles:["Global Admin","Security Admin"],mfa:["FIDO2","Authenticator"],risk:"None",pim:!0,tagged:!0,isSPN:!1},{id:"pa2",upn:"chen.wei@contoso.com",name:"Chen Wei",bg:"#633806",roles:["Global Admin","Exchange Admin"],mfa:["Authenticator"],risk:"None",pim:!0,tagged:!0,isSPN:!1},{id:"pa3",upn:"kevin.osei@contoso.com",name:"Kevin Osei",bg:"#0C447C",roles:["Exchange Admin"],mfa:["Authenticator"],risk:"High",pim:!0,tagged:!1,isSPN:!1},{id:"pa4",upn:"nina.patel@contoso.com",name:"Nina Patel",bg:"#3C3489",roles:["Teams Admin"],mfa:["SMS"],risk:"High",pim:!1,tagged:!1,isSPN:!1},{id:"pa5",upn:"tom.brooks@contoso.com",name:"Tom Brooks",bg:"#4A6741",roles:["Power Platform Admin"],mfa:[],risk:"None",pim:!1,tagged:!1,isSPN:!1},{id:"pa6",upn:"dev.bot@contoso.com",name:"Dev Bot (SPN)",bg:"#5a5a5a",roles:["Application Admin"],mfa:[],risk:"None",pim:!1,tagged:!1,isSPN:!0},{id:"pa7",upn:"james.liu@contoso.com",name:"James Liu",bg:"#4B3B8C",roles:["SharePoint Admin"],mfa:["Authenticator"],risk:"None",pim:!0,tagged:!0,isSPN:!1},{id:"pa8",upn:"sara.ogden@contoso.com",name:"Sara Ogden",bg:"#6B3C4A",roles:["User Admin"],mfa:["Authenticator"],risk:"Medium",pim:!1,tagged:!1,isSPN:!1},{id:"pa9",upn:"raj.mehta@contoso.com",name:"Raj Mehta",bg:"#2C5F6A",roles:["Helpdesk Admin"],mfa:["Authenticator"],risk:"None",pim:!1,tagged:!1,isSPN:!1},{id:"pa10",upn:"lucy.chan@contoso.com",name:"Lucy Chan",bg:"#7A4E2D",roles:["Billing Admin"],mfa:["Authenticator"],risk:"Medium",pim:!1,tagged:!1,isSPN:!1},{id:"pa11",upn:"sam.torres@contoso.com",name:"Sam Torres",bg:"#1F5C47",roles:["Compliance Admin"],mfa:["Authenticator","FIDO2"],risk:"None",pim:!0,tagged:!0,isSPN:!1},{id:"pa12",upn:"backup.admin@contoso.com",name:"Backup Admin",bg:"#555555",roles:["Global Admin"],mfa:["Authenticator"],risk:"None",pim:!0,tagged:!0,isSPN:!1},{id:"pa13",upn:"reporting.svc@contoso.com",name:"Reporting SVC",bg:"#5a5a5a",roles:["Reports Reader"],mfa:[],risk:"None",pim:!1,tagged:!1,isSPN:!0},{id:"pa14",upn:"intune.admin@contoso.com",name:"Intune Admin",bg:"#3B6D11",roles:["Intune Admin"],mfa:["Authenticator"],risk:"None",pim:!1,tagged:!1,isSPN:!1}],Qe=[{id:"pg1",name:"Global Administrators",roles:["Global Admin"],members:2,pim:!0,pimType:"Eligible",lastActivity:"2 hours ago",ml:["aisha.raza@contoso.com","chen.wei@contoso.com"]},{id:"pg2",name:"Security Admins",roles:["Security Admin"],members:2,pim:!0,pimType:"Eligible",lastActivity:"1 day ago",ml:["aisha.raza@contoso.com","sam.torres@contoso.com"]},{id:"pg3",name:"Exchange Admins",roles:["Exchange Admin"],members:2,pim:!0,pimType:"Active",lastActivity:"3 days ago",ml:["chen.wei@contoso.com","kevin.osei@contoso.com"]},{id:"pg4",name:"SharePoint Admins",roles:["SharePoint Admin"],members:1,pim:!1,pimType:null,lastActivity:"5 days ago",ml:["james.liu@contoso.com"]},{id:"pg5",name:"Teams Admins",roles:["Teams Admin"],members:1,pim:!1,pimType:null,lastActivity:"1 week ago",ml:["nina.patel@contoso.com"]},{id:"pg6",name:"Helpdesk Admins",roles:["Helpdesk Admin","User Admin"],members:2,pim:!1,pimType:null,lastActivity:"1 day ago",ml:["raj.mehta@contoso.com","sara.ogden@contoso.com"]},{id:"pg7",name:"Compliance Admins",roles:["Compliance Admin"],members:1,pim:!0,pimType:"Eligible",lastActivity:"4 days ago",ml:["sam.torres@contoso.com"]},{id:"pg8",name:"Break Glass Accounts",roles:["Global Admin"],members:2,pim:!0,pimType:"Active",lastActivity:"30 days ago",ml:["aisha.raza@contoso.com","backup.admin@contoso.com"]}],bs=[{id:"l1",type:"add",icls:"ti-user-plus",ic:"var(--clr-info-text)",bg:"var(--clr-info-bg)",title:"Role assignment added",detail:"aisha.raza assigned Global Admin via PIM",by:"System",time:"2 min ago"},{id:"l2",type:"risk",icls:"ti-alert-triangle",ic:"var(--clr-danger-text)",bg:"var(--clr-danger-bg)",title:"Risk detected",detail:"kevin.osei — High risk sign-in from unknown location",by:"Entra ID",time:"14 min ago"},{id:"l3",type:"remove",icls:"ti-user-minus",ic:"var(--clr-warning-text)",bg:"var(--clr-warning-bg)",title:"Member removed from group",detail:"sara.ogden removed from Helpdesk Admins",by:"Chen Wei",time:"1 hour ago"},{id:"l4",type:"add",icls:"ti-user-plus",ic:"var(--clr-info-text)",bg:"var(--clr-info-bg)",title:"PIM role activated",detail:"sam.torres activated Compliance Admin for 8 hours",by:"Sam Torres",time:"3 hours ago"},{id:"l5",type:"remove",icls:"ti-user-minus",ic:"var(--clr-warning-text)",bg:"var(--clr-warning-bg)",title:"PIM role deactivated",detail:"chen.wei deactivated Exchange Admin role",by:"Chen Wei",time:"5 hours ago"},{id:"l6",type:"mfa",icls:"ti-shield",ic:"var(--clr-success-text)",bg:"var(--clr-success-bg)",title:"MFA method registered",detail:"tom.brooks enrolled Authenticator app",by:"Tom Brooks",time:"7 hours ago"},{id:"l7",type:"tag",icls:"ti-tag",ic:"var(--clr-info-text)",bg:"var(--clr-info-bg)",title:"Account tagged as privileged",detail:"james.liu tagged as SharePoint Admin",by:"Aisha Raza",time:"Yesterday"},{id:"l8",type:"risk",icls:"ti-alert-triangle",ic:"var(--clr-danger-text)",bg:"var(--clr-danger-bg)",title:"Risk detected",detail:"nina.patel — High risk user detection",by:"Entra ID",time:"Yesterday"},{id:"l9",type:"add",icls:"ti-user-plus",ic:"var(--clr-info-text)",bg:"var(--clr-info-bg)",title:"New admin account created",detail:"intune.admin created with Intune Admin role",by:"Aisha Raza",time:"2 days ago"},{id:"l10",type:"review",icls:"ti-clipboard-check",ic:"var(--clr-success-text)",bg:"var(--clr-success-bg)",title:"Access review completed",detail:"Q1 review — Global Admins. 0 removed.",by:"Aisha Raza",time:"3 days ago"},{id:"l11",type:"add",icls:"ti-key",ic:"var(--clr-warning-text)",bg:"var(--clr-warning-bg)",title:"Break glass account used",detail:"backup.admin signed in — emergency access",by:"backup.admin",time:"30 days ago"},{id:"l12",type:"remove",icls:"ti-user-minus",ic:"var(--clr-warning-text)",bg:"var(--clr-warning-bg)",title:"Role removed",detail:"lucy.chan removed from Exchange Admins",by:"Chen Wei",time:"35 days ago"}];let ii=[...bs];function xs(){const e=document.getElementById("page-privaccts");e&&(e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-crown"></i> Privileged Accounts</div>
        <div class="page-subtitle">Manage and monitor privileged identities in Contoso.com</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="pa-sync"><i class="ti ti-refresh"></i> Sync tenant</button>
        <button class="btn btn-primary" id="pa-tag-account"><i class="ti ti-plus"></i> Tag account</button>
      </div>
    </div>

    <div class="alert-banner danger mb-3">
      <i class="ti ti-alert-triangle"></i>
      2 privileged accounts have active risk detections.
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">14</div><div class="kpi-label">Accounts</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">2</div><div class="kpi-label">At Risk</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">1</div><div class="kpi-label">No MFA</div></div>
      <div class="kpi-tile"><div class="kpi-value info">8</div><div class="kpi-label">Groups</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">4</div><div class="kpi-label">Permanent</div></div>
    </div>

    <div class="tabs" id="pa-tabs">
      <button class="tab-btn active" data-tab="accounts">Privileged Accounts</button>
      <button class="tab-btn" data-tab="groups">Privileged Groups</button>
      <button class="tab-btn" data-tab="log">Membership Log</button>
    </div>

    <div class="tab-panel active" id="pa-tab-accounts"></div>
    <div class="tab-panel" id="pa-tab-groups"></div>
    <div class="tab-panel" id="pa-tab-log"></div>
  `,Ss(e),ks(e),Es(e),e.querySelectorAll("#pa-tabs .tab-btn").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll("#pa-tabs .tab-btn").forEach(i=>i.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(i=>i.classList.remove("active")),t.classList.add("active"),e.querySelector(`#pa-tab-${t.dataset.tab}`).classList.add("active")})}),e.querySelector("#pa-sync").addEventListener("click",()=>{const t=e.querySelector("#pa-sync");t.innerHTML='<span class="spinner dark"></span> Syncing...',t.disabled=!0,setTimeout(()=>{t.innerHTML='<i class="ti ti-refresh"></i> Sync tenant',t.disabled=!1,p("Tenant sync complete — 14 accounts updated.","success")},2e3)}),e.querySelector("#pa-tag-account").addEventListener("click",()=>{p("Tag account: select an account from the table below.","info")}))}function bt(e){return e==="High"?'<span class="badge danger dot">High</span>':e==="Medium"?'<span class="badge warning dot">Medium</span>':'<span class="badge neutral dot">None</span>'}function ws(e){return!e||e.length===0?'<span class="pa-mfa-pill none">No MFA</span>':e.map(t=>t==="SMS"?'<span class="pa-mfa-pill sms">SMS</span>':`<span class="pa-mfa-pill">${t}</span>`).join("")}function As(e){return`<span class="pa-role-chip ${e.toLowerCase().includes("global")?"global":""}">${e}</span>`}function Ss(e){var n,a;const t=e.querySelector("#pa-tab-accounts"),i="pa-acct-search";let s=`
    <div class="filter-bar" style="margin-bottom:12px">
      <input type="text" class="form-input search" id="${i}" placeholder="Search accounts...">
      <select class="form-select" id="pa-risk-filter">
        <option value="all">All Risk</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="None">None</option>
      </select>
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:22%">User</th>
          <th style="width:25%">Roles</th>
          <th style="width:20%">MFA Methods</th>
          <th style="width:10%">Risk</th>
          <th style="width:8%">PIM</th>
          <th style="width:10%">Type</th>
          <th style="width:5%"></th>
        </tr></thead>
        <tbody id="pa-acct-tbody">
          ${nt.map(r=>si(r)).join("")}
        </tbody>
      </table>
    </div>
  `;t.innerHTML=s,ai(t),(n=t.querySelector(`#${i}`))==null||n.addEventListener("input",r=>{var l;const o=r.target.value.toLowerCase(),c=((l=t.querySelector("#pa-risk-filter"))==null?void 0:l.value)||"all";xt(t,o,c)}),(a=t.querySelector("#pa-risk-filter"))==null||a.addEventListener("change",r=>{var c;const o=((c=t.querySelector(`#${i}`))==null?void 0:c.value.toLowerCase())||"";xt(t,o,r.target.value)})}function xt(e,t,i){const s=e.querySelector("#pa-acct-tbody");s&&(s.innerHTML=nt.filter(n=>{const a=!t||n.upn.toLowerCase().includes(t)||n.name.toLowerCase().includes(t),r=i==="all"||n.risk===i;return a&&r}).map(n=>si(n)).join(""),ai(e))}function si(e){return`
    <tr class="pa-acct-row" data-id="${e.id}">
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="user-avatar" style="background:${e.bg};width:24px;height:24px;font-size:9px">${e.isSPN?"SP":e.name.split(" ").map(t=>t[0]).join("")}</div>
          <div>
            <div style="font-size:11px;font-weight:600">${e.name}</div>
            <div class="monospace" style="font-size:9px">${e.upn}</div>
          </div>
        </div>
      </td>
      <td><div class="pill-group">${e.roles.map(As).join("")}</div></td>
      <td><div class="pill-group">${ws(e.mfa)}</div></td>
      <td>${bt(e.risk)}</td>
      <td>${e.pim?'<span class="badge info">PIM</span>':'<span class="badge neutral">None</span>'}</td>
      <td>${e.isSPN?'<span class="badge purple">SPN</span>':'<span class="badge neutral">User</span>'}</td>
      <td><button class="chevron-btn pa-acct-expand"><i class="ti ti-chevron-right"></i></button></td>
    </tr>
    <tr class="pa-acct-expand-row" data-id="${e.id}" style="display:none">
      <td colspan="7" style="padding:0">
        <div class="pa-expand-panel" style="display:block">
          <div class="grid-2" style="gap:16px">
            <div>
              <div class="section-heading">Roles & PIM</div>
              <table>
                <thead><tr><th>Role</th><th>Assignment</th><th>Expiry</th></tr></thead>
                <tbody>
                  ${e.roles.map(t=>`
                    <tr><td>${t}</td>
                    <td>${e.pim?'<span class="badge info">Eligible</span>':'<span class="badge warning">Permanent</span>'}</td>
                    <td>${e.pim?"8h session":'<span style="color:var(--clr-danger-text)">Never</span>'}</td></tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
            <div>
              <div class="section-heading">MFA & Risk</div>
              <table>
                <thead><tr><th>Method</th><th>Status</th></tr></thead>
                <tbody>
                  ${(e.mfa.length?e.mfa:["No MFA"]).map(t=>`
                    <tr><td>${t}</td><td>${t==="No MFA"?'<span class="badge danger">Missing</span>':t==="SMS"?'<span class="badge warning">Weak</span>':'<span class="badge success">Strong</span>'}</td></tr>
                  `).join("")}
                </tbody>
              </table>
              <div style="margin-top:8px">Risk level: ${bt(e.risk)}</div>
            </div>
          </div>
          <div class="pa-action-row">
            <button class="btn btn-sm btn-danger pa-action" data-action="pwd-reset" data-id="${e.id}"><i class="ti ti-key"></i> Force pwd reset</button>
            ${e.pim?"":`<button class="btn btn-sm btn-warning pa-action" data-action="convert-pim" data-id="${e.id}"><i class="ti ti-shield-bolt"></i> Convert to PIM</button>`}
            ${e.mfa.length?"":`<button class="btn btn-sm pa-action" data-action="mfa-enroll" data-id="${e.id}"><i class="ti ti-device-mobile"></i> Trigger MFA enrollment</button>`}
            <button class="btn btn-sm btn-danger pa-action" data-action="remove" data-id="${e.id}"><i class="ti ti-user-minus"></i> Remove</button>
          </div>
        </div>
      </td>
    </tr>
  `}function ai(e){e.querySelectorAll(".pa-acct-expand").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const n=t.closest(".pa-acct-row").dataset.id,a=e.querySelector(`.pa-acct-expand-row[data-id="${n}"]`),r=a.style.display!=="none";a.style.display=r?"none":"table-row",t.classList.toggle("open",!r)})}),e.querySelectorAll(".pa-action").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const{action:s,id:n}=t.dataset,a=nt.find(r=>r.id===n);s==="pwd-reset"?(p(`Password reset initiated for ${a==null?void 0:a.name}.`,"warning"),K("risk",`Password reset forced for ${a==null?void 0:a.upn}`,"Admin")):s==="convert-pim"?(p(`${a==null?void 0:a.name} converted to PIM eligible assignment.`,"success"),K("add",`${a==null?void 0:a.upn} converted to PIM eligible`,"Admin")):s==="mfa-enroll"?(p(`MFA enrollment triggered for ${a==null?void 0:a.name}.`,"info"),K("mfa",`MFA enrollment triggered for ${a==null?void 0:a.upn}`,"Admin")):s==="remove"&&(p(`${a==null?void 0:a.name} removed from privileged role.`,"danger"),K("remove",`${a==null?void 0:a.upn} removed from privileged role`,"Admin"))})})}function ks(e){const t=e.querySelector("#pa-tab-groups");t.innerHTML=`
    <div class="filter-bar" style="margin-bottom:12px">
      <input type="text" class="form-input search" id="pa-grp-search" placeholder="Search groups...">
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:25%">Group</th>
          <th style="width:20%">Roles</th>
          <th style="width:10%">Members</th>
          <th style="width:12%">PIM</th>
          <th style="width:18%">Last Activity</th>
          <th style="width:15%">Actions</th>
        </tr></thead>
        <tbody id="pa-grp-tbody">
          ${Qe.map(i=>wt(i)).join("")}
        </tbody>
      </table>
    </div>
  `,At(t),t.querySelector("#pa-grp-search").addEventListener("input",i=>{const s=i.target.value.toLowerCase();t.querySelector("#pa-grp-tbody").innerHTML=Qe.filter(n=>!s||n.name.toLowerCase().includes(s)).map(n=>wt(n)).join(""),At(t)})}function wt(e){return`
    <tr class="pa-grp-row" data-id="${e.id}">
      <td><strong style="font-size:11px">${e.name}</strong></td>
      <td><div class="pill-group">${e.roles.map(t=>`<span class="pa-role-chip">${t}</span>`).join("")}</div></td>
      <td>${e.members}</td>
      <td>${e.pim?`<span class="badge info">PIM ${e.pimType}</span>`:'<span class="badge neutral">None</span>'}</td>
      <td style="font-size:10px;color:var(--color-text-tertiary)">${e.lastActivity}</td>
      <td>
        <button class="btn btn-xs pa-grp-expand" data-id="${e.id}">Members</button>
        <button class="btn btn-xs btn-danger pa-grp-untag" data-id="${e.id}" style="margin-left:4px">Untag</button>
      </td>
    </tr>
    <tr class="pa-grp-expand-row" data-id="${e.id}" style="display:none">
      <td colspan="6" style="padding:0">
        <div class="pa-expand-panel" style="display:block">
          <div class="section-heading">Members</div>
          ${e.ml.map(t=>`
            <div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
              <span class="monospace">${t}</span>
              <button class="btn btn-xs btn-danger pa-grp-remove-member" data-grp="${e.id}" data-upn="${t}"><i class="ti ti-user-minus"></i> Remove</button>
            </div>
          `).join("")}
        </div>
      </td>
    </tr>
  `}function At(e){e.querySelectorAll(".pa-grp-expand").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.id,s=e.querySelector(`.pa-grp-expand-row[data-id="${i}"]`);s.style.display=s.style.display==="none"?"table-row":"none"})}),e.querySelectorAll(".pa-grp-untag").forEach(t=>{t.addEventListener("click",()=>{const i=Qe.find(s=>s.id===t.dataset.id);p(`${i==null?void 0:i.name} untagged as privileged group.`,"warning"),K("remove",`Group "${i==null?void 0:i.name}" untagged`,"Admin")})}),e.querySelectorAll(".pa-grp-remove-member").forEach(t=>{t.addEventListener("click",()=>{p(`${t.dataset.upn} removed from group.`,"success"),K("remove",`${t.dataset.upn} removed from group`,"Admin")})})}function Es(e){const t=e.querySelector("#pa-tab-log");ni(t)}function ni(e){e.innerHTML=`
    <div class="card" style="padding:12px 16px">
      <div class="card-title mb-3"><i class="ti ti-history"></i> Membership Change Log</div>
      ${ii.map(t=>`
        <div class="log-entry-row">
          <div class="log-icon-wrap" style="background:${t.bg}">
            <i class="ti ${t.icls}" style="color:${t.ic}"></i>
          </div>
          <div style="flex:1">
            <div style="font-size:11px;font-weight:600">${t.title}</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:1px">${t.detail}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:2px">By ${t.by} · ${t.time}</div>
          </div>
        </div>
      `).join("")}
    </div>
  `}function K(e,t,i){const s={add:"ti-user-plus",remove:"ti-user-minus",risk:"ti-alert-triangle",mfa:"ti-shield",tag:"ti-tag",review:"ti-clipboard-check"},n={add:"var(--clr-info-text)",remove:"var(--clr-warning-text)",risk:"var(--clr-danger-text)",mfa:"var(--clr-success-text)",tag:"var(--clr-info-text)",review:"var(--clr-success-text)"},a={add:"var(--clr-info-bg)",remove:"var(--clr-warning-bg)",risk:"var(--clr-danger-bg)",mfa:"var(--clr-success-bg)",tag:"var(--clr-info-bg)",review:"var(--clr-success-bg)"};ii.unshift({id:Date.now(),type:e,icls:s[e]||"ti-info-circle",ic:n[e]||"var(--clr-info-text)",bg:a[e]||"var(--clr-info-bg)",title:t,detail:t,by:i,time:"Just now"});const r=document.querySelector("#pa-tab-log");r&&ni(r)}function Cs(){const e=document.getElementById("page-licenses");if(!e)return;const t=[{name:"Microsoft 365 E3",total:600,consumed:581,available:19,status:"monitor",statusCls:"warning"},{name:"Microsoft 365 E5",total:150,consumed:148,available:2,status:"critical",statusCls:"danger"},{name:"Exchange Online P1",total:100,consumed:72,available:28,status:"healthy",statusCls:"success"},{name:"Power BI Pro",total:100,consumed:38,available:62,status:"healthy",statusCls:"success"}];e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-license"></i> License Management</div>
        <div class="page-subtitle">Track and manage Microsoft 365 license assignments</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">1,000</div><div class="kpi-label">Total Licenses</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">847</div><div class="kpi-label">Consumed</div></div>
      <div class="kpi-tile"><div class="kpi-value success">153</div><div class="kpi-label">Available</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">38</div><div class="kpi-label">Unused 90d+</div></div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:30%">License</th>
          <th style="width:12%">Total</th>
          <th style="width:12%">Consumed</th>
          <th style="width:12%">Available</th>
          <th style="width:22%">Usage</th>
          <th style="width:12%">Health</th>
        </tr></thead>
        <tbody>
          ${t.map(i=>{const s=Math.round(i.consumed/i.total*100);return`
              <tr>
                <td><strong style="font-size:11px">${i.name}</strong></td>
                <td>${i.total.toLocaleString()}</td>
                <td>${i.consumed.toLocaleString()}</td>
                <td>${i.available.toLocaleString()}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="score-bar" style="flex:1">
                      <div class="score-bar-fill ${i.statusCls}" style="width:${s}%"></div>
                    </div>
                    <span style="font-size:10px;font-weight:600;min-width:30px">${s}%</span>
                  </div>
                </td>
                <td><span class="badge ${i.statusCls}" style="text-transform:capitalize">${i.status}</span></td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>

    <div class="alert-banner warning mt-3">
      <i class="ti ti-alert-triangle"></i>
      <strong>Microsoft 365 E5</strong> is at 98.7% capacity. Consider purchasing additional licenses to prevent service disruption.
    </div>
  `}const St=[{id:"approval",name:"Approval Agent",desc:"Automates access request routing, approval workflows, and SLA tracking.",icon:"ti-check-list",bg:"#E6F1FB",color:"#0C447C",status:"active",statusLabel:"Active",statLabel:"7 pending",statIcon:"ti-inbox"},{id:"execution",name:"Execution Agent",desc:"Executes approved Graph API actions — group creation, license assignment, mailbox provisioning.",icon:"ti-bolt",bg:"#EAF3DE",color:"#3B6D11",status:"active",statusLabel:"Active",statLabel:"12 Graph actions today",statIcon:"ti-api"},{id:"security",name:"Security Agent",desc:"Monitors risky sign-ins, triggers automated responses to identity threats.",icon:"ti-shield-exclamation",bg:"#FCEBEB",color:"#A32D2D",status:"alert",statusLabel:"Alert",statLabel:"3 risky users",statIcon:"ti-user-exclamation"},{id:"audit",name:"Audit Agent",desc:"Collects and analyses audit log events, surfaces anomalous activity patterns.",icon:"ti-database",bg:"#FAEEDA",color:"#854F0B",status:"active",statusLabel:"Active",statLabel:"28 event types tracked",statIcon:"ti-activity"},{id:"config",name:"Config Agent",desc:"Scans CIS Benchmark controls against tenant configuration on schedule.",icon:"ti-robot",bg:"#E0F5F4",color:"#0D6B68",status:"active",statusLabel:"Active",statLabel:"Last scan 08:45",statIcon:"ti-clock",link:"m365config"},{id:"compliance",name:"Compliance Agent",desc:"Monitors regulatory compliance posture across Purview, DLP, and retention policies.",icon:"ti-clipboard-check",bg:"#EEEDFE",color:"#3C3489",status:"idle",statusLabel:"Idle",statLabel:"No recent scans",statIcon:"ti-info-circle"}];function $s(){const e=document.getElementById("page-agents");if(!e)return;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-robot"></i> AI Agents</div>
        <div class="page-subtitle">Automated intelligence agents managing your M365 tenant</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary"><i class="ti ti-plus"></i> Deploy agent</button>
      </div>
    </div>

    <div class="agents-grid" id="agents-grid"></div>
  `;const t=e.querySelector("#agents-grid");St.forEach(i=>{const s=i.status==="active"?"active pulse":i.status==="alert"?"alert pulse":"idle",n=i.status==="active"?"var(--clr-success-text)":i.status==="alert"?"var(--clr-danger-text)":"var(--color-text-tertiary)",a=document.createElement("div");a.className="agent-card",a.innerHTML=`
      <div class="agent-icon" style="background:${i.bg};color:${i.color}">
        <i class="ti ${i.icon}"></i>
      </div>
      <div class="agent-name">${i.name}</div>
      <div class="agent-desc">${i.desc}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <div class="status-dot ${s}"></div>
        <span style="font-size:11px;font-weight:600;color:${n}">${i.statusLabel}</span>
      </div>
      <div class="agent-stat">
        <i class="ti ${i.statIcon}" style="font-size:12px;color:${i.color}"></i>
        ${i.statLabel}
      </div>
      <div style="display:flex;gap:6px;margin-top:12px">
        <button class="btn btn-xs btn-primary agent-configure" data-id="${i.id}"><i class="ti ti-settings"></i> Configure</button>
        ${i.status!=="idle"?`<button class="btn btn-xs agent-pause" data-id="${i.id}"><i class="ti ti-player-pause"></i> Pause</button>`:`<button class="btn btn-xs btn-success agent-start" data-id="${i.id}"><i class="ti ti-player-play"></i> Start</button>`}
      </div>
    `,t.appendChild(a)}),e.querySelectorAll(".agent-configure").forEach(i=>{i.addEventListener("click",async()=>{var n;const s=i.dataset.id;s==="config"?await x("m365config"):p(`Opening configuration for ${(n=St.find(a=>a.id===s))==null?void 0:n.name}...`,"info")})}),e.querySelectorAll(".agent-pause").forEach(i=>{i.addEventListener("click",()=>p("Agent paused.","warning"))}),e.querySelectorAll(".agent-start").forEach(i=>{i.addEventListener("click",()=>p("Agent started.","success"))})}const Ps=[{id:"REQ-001",type:"Distribution Group",requestor:"Priya Kumar",submitted:"2h ago",sla:"2h left",status:"pending",detail:"Create DG: marketing-emea@contoso.com"},{id:"REQ-003",type:"MFA Reset",requestor:"James Liu",submitted:"3h ago",sla:"Overdue",status:"overdue",detail:"MFA reset requested — lost device"},{id:"REQ-006",type:"SharePoint Access",requestor:"Sara Ogden",submitted:"1h ago",sla:"3h left",status:"pending",detail:"SharePoint site: HR Documents — Read access"}];let de=Ps.map(e=>({...e}));function Ms(){const e=document.getElementById("page-approvals");e&&Rs(e)}function Rs(e){const t=de.filter(s=>s.status==="pending"||s.status==="overdue").length,i=de.filter(s=>s.status==="overdue").length;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-check-list"></i> Pending Approvals</div>
        <div class="page-subtitle">Access requests awaiting your decision</div>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value warning">${t}</div><div class="kpi-label">Pending</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${i}</div><div class="kpi-label">Overdue</div></div>
      <div class="kpi-tile"><div class="kpi-value success">4</div><div class="kpi-label">Approved Today</div></div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:10%">Ref</th>
          <th style="width:20%">Type</th>
          <th style="width:16%">Requestor</th>
          <th style="width:25%">Details</th>
          <th style="width:12%">SLA</th>
          <th style="width:17%">Action</th>
        </tr></thead>
        <tbody id="approvals-tbody">
          ${de.map(s=>Is(s)).join("")}
        </tbody>
      </table>
    </div>
  `,Ds(e)}function Is(e){const t=e.status==="pending"||e.status==="overdue";return`
    <tr data-id="${e.id}">
      <td class="monospace">${e.id}</td>
      <td>${e.type}</td>
      <td>${e.requestor}</td>
      <td style="font-size:10px;color:var(--color-text-secondary)">${e.detail}</td>
      <td ${e.sla==="Overdue"?'class="sla-overdue"':""}>${e.sla}</td>
      <td class="approval-action-cell">
        ${t?`
          <button class="btn btn-xs btn-success approval-approve" data-id="${e.id}"><i class="ti ti-check"></i> Approve</button>
          <button class="btn btn-xs btn-danger approval-reject" data-id="${e.id}" style="margin-left:4px"><i class="ti ti-x"></i> Reject</button>
        `:`<span class="badge ${e.status==="approved"?"success":"neutral"}">${e.status}</span>`}
      </td>
    </tr>
  `}function Ds(e){e.querySelectorAll(".approval-approve").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.id,s=de.find(r=>r.id===i);s&&(s.status="approved");const n=e.querySelector(`tr[data-id="${i}"] .approval-action-cell`);n&&(n.innerHTML='<span class="badge success">Approved</span>');const a=document.querySelector("#n-approvals .nav-badge");if(a){const r=parseInt(a.textContent)-1;a.textContent=Math.max(0,r),r<=1&&(a.style.display="none")}p(`Request ${i} approved.`,"success")})}),e.querySelectorAll(".approval-reject").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.id,s=de.find(a=>a.id===i);s&&(s.status="rejected");const n=e.querySelector(`tr[data-id="${i}"] .approval-action-cell`);n&&(n.innerHTML='<span class="badge neutral">Rejected</span>'),p(`Request ${i} rejected.`,"warning")})})}const Xe=[{id:"submit",label:"Request Submitted",icon:"ti-send",color:"info"},{id:"manager",label:"Manager Approval",icon:"ti-user-check",color:"warning"},{id:"dataowner",label:"Data Owner Approval",icon:"ti-shield-check",color:"purple"},{id:"it",label:"IT Review",icon:"ti-settings",color:"warning"},{id:"agent",label:"AI Agent Validation",icon:"ti-robot",color:"teal"},{id:"action",label:"System Provisioning",icon:"ti-api",color:"info"},{id:"done",label:"Completion",icon:"ti-circle-check",color:"success"}],Ie=[{id:"exchange",name:"Exchange Online",icon:"ti-mail",color:"#854F0B",bg:"#FAEEDA",desc:"Groups, shared mailboxes, room resources, and email settings",badge:"4 services"},{id:"teams",name:"Microsoft Teams",icon:"ti-brand-teams",color:"#3C3489",bg:"#EEEDFE",desc:"Create teams, manage members, channels, and guest access",badge:"5 actions"},{id:"sharepoint",name:"SharePoint Services",icon:"ti-brand-sharepoint",color:"#3B6D11",bg:"#EAF3DE",desc:"Sites, permissions, external sharing, and storage management",badge:"6 actions"},{id:"onedrive",name:"OneDrive Administration",icon:"ti-cloud",color:"#0C447C",bg:"#E6F1FB",desc:"Storage increases and former employee OneDrive access",badge:"2 actions"},{id:"ext-sharing",name:"External Sharing",icon:"ti-world",color:"#791F1F",bg:"#FCEBEB",desc:"Invite, extend, or remove external guest access",badge:"4 actions"},{id:"user-access",name:"User Access Management",icon:"ti-lock-access",color:"#185FA5",bg:"#E6F1FB",desc:"Request access to mailboxes, Teams, SharePoint and groups",badge:"5 actions"},{id:"licenses",name:"License Management",icon:"ti-license",color:"#854F0B",bg:"#FAEEDA",desc:"Request Microsoft 365, Power BI, Visio, Project licenses",badge:"6 licenses"},{id:"copilot",name:"Microsoft Copilot",icon:"ti-sparkles",color:"#3C3489",bg:"#EEEDFE",desc:"Request or remove Microsoft 365 Copilot licenses",badge:"2 actions"},{id:"power-platform",name:"Power Platform",icon:"ti-bolt",color:"#3B6D11",bg:"#EAF3DE",desc:"Environments, premium connectors, DLP exceptions",badge:"4 actions"},{id:"intune",name:"Intune Services",icon:"ti-device-laptop",color:"#0C447C",bg:"#E6F1FB",desc:"Device retirement, wipe, and compliance exceptions",badge:"3 actions"},{id:"guest-lifecycle",name:"Guest User Lifecycle",icon:"ti-user-plus",color:"#633806",bg:"#FAEEDA",desc:"Invite guests, extend or remove access, quarterly reviews",badge:"4 actions"}],se=[{id:"exchange-groups",name:"Distribution & Security Groups",icon:"ti-users-group",desc:"M365 Groups, Distribution Groups, Security Groups"},{id:"shared-mailbox",name:"Shared Mailboxes",icon:"ti-mailbox",desc:"Create, delete, and manage shared mailbox permissions"},{id:"room-equipment",name:"Room & Equipment Mailboxes",icon:"ti-building",desc:"Meeting rooms, equipment resources, booking policies"},{id:"email-services",name:"Email Services",icon:"ti-mail-forward",desc:"SMTP addresses, mail forwarding, auto-reply configuration"}],Ts={"exchange-groups":{parentGroup:"exchange",operations:[{id:"create-m365-group",group:"Microsoft 365 Groups",label:"Create M365 Group",approvalPath:["manager","it"],agentChecks:["Check for duplicate group names","Suggest existing groups with similar purpose","Validate naming convention","Verify requestor eligibility"],systemAction:"POST /v1.0/groups (groupTypes: Unified)",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. Marketing EMEA"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"marketing-emea",hint:"@contoso.com appended automatically"},{id:"privacy",label:"Privacy",type:"select",required:!0,options:["Private","Public"]},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"user1@contoso.com, user2@contoso.com",hint:"Comma-separated UPNs"},{id:"description",label:"Group Description",type:"textarea",required:!1,placeholder:"Purpose of this group..."},{id:"justification",label:"Business Justification",type:"textarea",required:!0,placeholder:"Why is this group needed?"}]},{id:"add-m365-members",group:"Microsoft 365 Groups",label:"Add Members to M365 Group",approvalPath:["manager"],agentChecks:["Verify group exists","Check member licensing","Validate UPNs"],systemAction:"POST /v1.0/groups/{id}/members/$ref",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0,placeholder:"marketing-emea@contoso.com"},{id:"members",label:"Members to Add",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0,placeholder:"Why do these users need to join?"}]},{id:"remove-m365-members",group:"Microsoft 365 Groups",label:"Remove Members from M365 Group",approvalPath:["manager"],agentChecks:["Verify group membership","Check if member is owner"],systemAction:"DELETE /v1.0/groups/{id}/members/{userId}/$ref",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0,placeholder:"marketing-emea@contoso.com"},{id:"members",label:"Members to Remove",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Reason",type:"textarea",required:!0}]},{id:"archive-m365-group",group:"Microsoft 365 Groups",label:"Archive M365 Group",approvalPath:["manager","it"],agentChecks:["Check last activity date","Identify active owners","Verify no active workflows depend on group"],systemAction:"PATCH /v1.0/groups/{id} (visibility: archived)",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0},{id:"archiveDate",label:"Archive By Date",type:"date",required:!1},{id:"dataRetention",label:"Data Retention Period",type:"select",required:!0,options:["30 days","90 days","180 days","1 year","Indefinite"]},{id:"justification",label:"Reason for Archiving",type:"textarea",required:!0}]},{id:"create-dg",group:"Distribution Groups",label:"Create Distribution Group",approvalPath:["manager"],agentChecks:["Duplicate DG check","Naming convention validation","Suggest existing DGs"],systemAction:"New-DistributionGroup via Exchange PowerShell",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. All Staff UK"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"all-staff-uk"},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"Comma-separated UPNs"},{id:"managedBy",label:"Managed By (Owner)",type:"text",required:!1,placeholder:"UPN of owner"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"modify-dg",group:"Distribution Groups",label:"Rename / Modify Distribution Group",approvalPath:["manager"],agentChecks:["Verify group ownership","Check for email references to current name"],systemAction:"Set-DistributionGroup via Exchange PowerShell",fields:[{id:"currentName",label:"Current Group Name",type:"text",required:!0},{id:"newName",label:"New Display Name",type:"text",required:!1,placeholder:"Leave blank if not changing"},{id:"newAlias",label:"New Email Alias",type:"text",required:!1,placeholder:"Leave blank if not changing"},{id:"changeOwner",label:"New Owner UPN",type:"text",required:!1},{id:"justification",label:"Reason for Change",type:"textarea",required:!0}]},{id:"delete-dg",group:"Distribution Groups",label:"Delete Distribution Group",approvalPath:["manager","it"],agentChecks:["Check group usage in mail flow rules","Identify group members","Check email references in other systems"],systemAction:"Remove-DistributionGroup via Exchange PowerShell",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0},{id:"confirmation",label:"Type group name to confirm deletion",type:"text",required:!0,placeholder:"Must match exactly"},{id:"justification",label:"Reason for Deletion",type:"textarea",required:!0}]},{id:"create-sg",group:"Security Groups",label:"Create Security Group",approvalPath:["manager","it"],agentChecks:["Duplicate check","Naming convention","Suggest existing groups","Review intended resource access"],systemAction:"POST /v1.0/groups (securityEnabled: true)",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. SG-Finance-ReadOnly"},{id:"purpose",label:"Purpose / Resource",type:"text",required:!0,placeholder:"What resource will this secure?"},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"Comma-separated UPNs"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"manage-sg-members",group:"Security Groups",label:"Add / Remove Security Group Members",approvalPath:["manager","it"],agentChecks:["Verify requester is group owner","Check member eligibility","Validate access to secured resource"],systemAction:"POST/DELETE /v1.0/groups/{id}/members/$ref",fields:[{id:"groupName",label:"Security Group Name",type:"text",required:!0},{id:"action",label:"Action",type:"select",required:!0,options:["Add members","Remove members"]},{id:"members",label:"Members (UPNs)",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"shared-mailbox":{parentGroup:"exchange",operations:[{id:"create-shared-mb",group:"Create / Delete",label:"Create Shared Mailbox",approvalPath:["manager","it"],agentChecks:["Duplicate mailbox check","License availability","Naming convention","Verify owner details"],systemAction:"New-Mailbox -Shared via Exchange PowerShell",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. HR Department"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"hr@contoso.com"},{id:"fullAccess",label:"Full Access Users",type:"text",required:!1,placeholder:"UPNs comma-separated"},{id:"sendAs",label:"Send As Users",type:"text",required:!1,placeholder:"UPNs comma-separated"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"delete-shared-mb",group:"Create / Delete",label:"Delete Shared Mailbox",approvalPath:["manager","it"],agentChecks:["Check mailbox usage in last 90 days","Identify users with permissions","Check mail flow dependencies"],systemAction:"Remove-Mailbox via Exchange PowerShell",fields:[{id:"mailboxEmail",label:"Mailbox Email Address",type:"email",required:!0},{id:"dataAction",label:"Data Disposition",type:"select",required:!0,options:["Export then delete","Retain for 90 days","Immediate deletion"]},{id:"justification",label:"Reason for Deletion",type:"textarea",required:!0}]},{id:"mb-permissions",group:"Permissions",label:"Modify Mailbox Permissions",approvalPath:["manager"],agentChecks:["Verify mailbox exists","Validate user licensing","Check current permission state"],systemAction:"Add/Remove-MailboxPermission via Exchange PowerShell",fields:[{id:"mailboxEmail",label:"Mailbox Email Address",type:"email",required:!0},{id:"permType",label:"Permission Type",type:"select",required:!0,options:["Full Access","Send As","Send on Behalf"]},{id:"action",label:"Action",type:"select",required:!0,options:["Add permission","Remove permission"]},{id:"users",label:"Users (UPNs)",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"room-equipment":{parentGroup:"exchange",operations:[{id:"create-room",group:"Create",label:"Create Room Mailbox",approvalPath:["manager","it"],agentChecks:["Check for duplicate room names","Validate capacity settings","Verify location exists in directory"],systemAction:"New-Mailbox -Room via Exchange PowerShell",fields:[{id:"displayName",label:"Room Name",type:"text",required:!0,placeholder:"e.g. London — Boardroom A"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"london-boardroom-a"},{id:"capacity",label:"Capacity (persons)",type:"text",required:!0,placeholder:"12"},{id:"location",label:"Building / Floor",type:"text",required:!1,placeholder:"e.g. 1 Canada Square, Floor 4"},{id:"autoAccept",label:"Auto-accept bookings",type:"select",required:!0,options:["Auto-accept all","Require approval","Manual only"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"create-equipment",group:"Create",label:"Create Equipment Mailbox",approvalPath:["manager","it"],agentChecks:["Duplicate equipment name check","Validate equipment type"],systemAction:"New-Mailbox -Equipment via Exchange PowerShell",fields:[{id:"displayName",label:"Equipment Name",type:"text",required:!0,placeholder:"e.g. Projector — Floor 3"},{id:"alias",label:"Email Alias",type:"text",required:!0},{id:"equipType",label:"Equipment Type",type:"select",required:!0,options:["Projector","Video conferencing unit","Laptop pool","Car/Fleet","Other"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"modify-booking",group:"Modify",label:"Modify Booking Policy",approvalPath:["manager"],agentChecks:["Verify resource exists","Check current booking conflicts"],systemAction:"Set-CalendarProcessing via Exchange PowerShell",fields:[{id:"resourceEmail",label:"Resource Email",type:"email",required:!0},{id:"autoAccept",label:"Auto-accept policy",type:"select",required:!1,options:["Auto-accept all","Require approval","Manual only"]},{id:"maxDuration",label:"Max booking duration",type:"select",required:!1,options:["1 hour","2 hours","4 hours","8 hours","1 day","Unlimited"]},{id:"bookingWindow",label:"Advance booking window",type:"select",required:!1,options:["1 week","2 weeks","1 month","3 months","6 months"]},{id:"justification",label:"Reason for Change",type:"textarea",required:!0}]},{id:"add-delegate",group:"Modify",label:"Add Room/Equipment Delegate",approvalPath:["manager"],agentChecks:["Verify resource exists","Verify delegate licensing"],systemAction:"Set-CalendarProcessing -ResourceDelegates",fields:[{id:"resourceEmail",label:"Resource Email",type:"email",required:!0},{id:"delegates",label:"Delegate UPNs",type:"text",required:!0,placeholder:"Comma-separated UPNs"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"delete-resource",group:"Delete",label:"Remove Room / Equipment Mailbox",approvalPath:["manager","it"],agentChecks:["Check for future bookings","Identify delegates","Cancel existing calendar entries"],systemAction:"Remove-Mailbox via Exchange PowerShell",fields:[{id:"resourceEmail",label:"Resource Email",type:"email",required:!0},{id:"deleteDate",label:"Removal Date",type:"date",required:!1,hint:"Leave blank for immediate removal"},{id:"justification",label:"Reason for Removal",type:"textarea",required:!0}]}]},"email-services":{parentGroup:"exchange",operations:[{id:"smtp-change",group:"Email Configuration",label:"SMTP Address Change",approvalPath:["manager","it"],agentChecks:["Verify mailbox ownership","Check SMTP address availability","Check for email references in other systems"],systemAction:"Set-Mailbox -EmailAddresses via Exchange PowerShell",fields:[{id:"mailboxUpn",label:"Mailbox UPN",type:"email",required:!0},{id:"newSmtp",label:"New Primary SMTP",type:"email",required:!0,hint:"New primary email address"},{id:"keepOld",label:"Retain old address as alias",type:"select",required:!0,options:["Yes — keep as alias","No — remove old address"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"mail-forwarding",group:"Email Configuration",label:"Configure Mail Forwarding",approvalPath:["manager","it"],agentChecks:["Check for external forwarding policy","Verify destination address","Flag if forwarding to external domain"],systemAction:"Set-Mailbox -ForwardingSmtpAddress via Exchange PowerShell",fields:[{id:"mailboxUpn",label:"Mailbox UPN",type:"email",required:!0},{id:"forwardTo",label:"Forward To",type:"email",required:!0},{id:"keepCopy",label:"Keep a copy in mailbox",type:"select",required:!0,options:["Yes","No"]},{id:"duration",label:"Forwarding Duration",type:"select",required:!1,options:["Indefinite","30 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"auto-reply",group:"Email Configuration",label:"Auto Reply Configuration",approvalPath:["manager"],agentChecks:["Validate mailbox ownership","Check message content for compliance"],systemAction:"Set-MailboxAutoReplyConfiguration via Exchange PowerShell",fields:[{id:"mailboxUpn",label:"Mailbox UPN",type:"email",required:!0},{id:"scope",label:"Reply Scope",type:"select",required:!0,options:["Internal only","Internal and external"]},{id:"startDate",label:"Start Date",type:"date",required:!1},{id:"endDate",label:"End Date",type:"date",required:!1},{id:"message",label:"Auto Reply Message",type:"textarea",required:!0,placeholder:"Out of office message..."}]}]},teams:{parentGroup:null,operations:[{id:"create-team",group:"Team Management",label:"Create Team",approvalPath:["manager"],agentChecks:["Duplicate team name check","Suggest existing teams","Validate naming convention","Check M365 group quota"],systemAction:"POST /v1.0/teams",fields:[{id:"displayName",label:"Team Name",type:"text",required:!0,placeholder:"e.g. Project Phoenix"},{id:"description",label:"Description",type:"textarea",required:!1},{id:"privacy",label:"Privacy",type:"select",required:!0,options:["Private (invite only)","Public (open to all)"]},{id:"template",label:"Team Template",type:"select",required:!1,options:["Standard","Project","Retail","Healthcare","Education"]},{id:"owners",label:"Team Owners",type:"text",required:!0,placeholder:"Comma-separated UPNs (at least 1)"},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"Comma-separated UPNs"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"add-team-members",group:"Team Management",label:"Add / Remove Team Members",approvalPath:["manager"],agentChecks:["Verify team exists","Check user licensing","Validate requester is owner"],systemAction:"POST/DELETE /v1.0/teams/{id}/members",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"action",label:"Action",type:"select",required:!0,options:["Add members","Remove members","Promote to owner","Demote from owner"]},{id:"users",label:"Users (UPNs)",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"create-channel",group:"Channel Management",label:"Create Channel",approvalPath:["manager"],agentChecks:["Verify team exists","Check for duplicate channel names","Validate channel type eligibility"],systemAction:"POST /v1.0/teams/{id}/channels",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"channelName",label:"Channel Name",type:"text",required:!0,placeholder:"e.g. Project Updates"},{id:"channelType",label:"Channel Type",type:"select",required:!0,options:["Standard","Private","Shared"]},{id:"description",label:"Description",type:"textarea",required:!1},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"team-guest-access",group:"Guest Access",label:"Request Guest Access to Team",approvalPath:["manager","it"],agentChecks:["Verify guest policy allows external access","Check guest domain restrictions","Validate team guest access setting"],systemAction:"POST /v1.0/teams/{id}/members (guest)",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"guestEmails",label:"Guest Email Addresses",type:"textarea",required:!0,placeholder:"One email per line (external addresses)"},{id:"guestOrg",label:"Guest Organisation",type:"text",required:!0,placeholder:"External company name"},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["30 days","60 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},sharepoint:{parentGroup:null,operations:[{id:"new-site",group:"Site Management",label:"Request New SharePoint Site",approvalPath:["manager","it"],agentChecks:["Check for similar existing sites","Validate site URL availability","Check storage quota","Verify naming convention"],systemAction:"POST /v1.0/sites — Invoke-RestMethod SharePoint REST API",fields:[{id:"siteTitle",label:"Site Title",type:"text",required:!0,placeholder:"e.g. Finance Department Hub"},{id:"siteUrl",label:"Site URL",type:"text",required:!0,placeholder:"finance-hub",hint:"contoso.sharepoint.com/sites/ prefix appended"},{id:"siteTemplate",label:"Template",type:"select",required:!0,options:["Team site","Communication site","Hub site","Document center"]},{id:"owners",label:"Site Owners",type:"text",required:!0,placeholder:"Comma-separated UPNs"},{id:"storageQuota",label:"Initial Storage Quota",type:"select",required:!1,options:["1 GB (default)","5 GB","10 GB","25 GB","100 GB"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"add-site-members",group:"Site Permissions",label:"Add Site Members / Owners",approvalPath:["manager"],agentChecks:["Verify site exists","Check user eligibility","Validate permission level request"],systemAction:"SharePoint REST API — /_api/web/roleassignments",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0,placeholder:"contoso.sharepoint.com/sites/..."},{id:"role",label:"Permission Level",type:"select",required:!0,options:["Read","Contribute","Edit","Full Control","Site Owner"]},{id:"users",label:"Users / Groups (UPNs)",type:"textarea",required:!0,placeholder:"One UPN or group name per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"external-sharing",group:"External Sharing",label:"Request External Sharing",approvalPath:["manager","dataowner","it"],agentChecks:["Check tenant external sharing policy","Verify domain not blocked","Classify data sensitivity","Check DLP policy applicability"],systemAction:"Set-SPOSite -SharingCapability via PnP PowerShell",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"sharingLevel",label:"Sharing Level",type:"select",required:!0,options:["Specific people (authenticated)","Anyone with link (no sign-in)","Existing guests only"]},{id:"externalOrg",label:"External Organisation",type:"text",required:!0},{id:"duration",label:"Duration",type:"select",required:!0,options:["30 days","90 days","6 months","1 year","Ongoing (reviewed annually)"]},{id:"dataSensitivity",label:"Data Sensitivity",type:"select",required:!0,options:["Public","Internal","Confidential","Highly Confidential"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"storage-increase",group:"Site Management",label:"Request Storage Increase",approvalPath:["manager","it"],agentChecks:["Check current usage vs quota","Validate increase request is proportionate","Check tenant storage pool"],systemAction:"Set-SPOSite -StorageQuota via PnP PowerShell",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"currentSize",label:"Current Storage Used",type:"text",required:!1,placeholder:"Approx. current usage (e.g. 4.5 GB)"},{id:"requestedGB",label:"Additional Storage (GB)",type:"text",required:!0,placeholder:"e.g. 10"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"delete-site",group:"Site Management",label:"Request Site Deletion",approvalPath:["manager","it"],agentChecks:["Check last site activity","Identify site owners","Check for active flows or apps referencing site","Verify data retention requirements"],systemAction:"Remove-SPOSite via PnP PowerShell",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"contentAction",label:"Content Action",type:"select",required:!0,options:["Export content then delete","Move to archive library","Immediate deletion"]},{id:"confirmation",label:"Type site name to confirm",type:"text",required:!0},{id:"justification",label:"Reason for Deletion",type:"textarea",required:!0}]}]},onedrive:{parentGroup:null,operations:[{id:"onedrive-storage",group:"Storage",label:"Request OneDrive Storage Increase",approvalPath:["manager","it"],agentChecks:["Check current OneDrive usage","Verify user licensing tier","Check tenant storage pool"],systemAction:"Set-SPOSite (OneDrive) -StorageQuota via PnP PowerShell",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0,placeholder:"user@contoso.com"},{id:"currentUsage",label:"Current Usage (approx)",type:"text",required:!1,placeholder:"e.g. 800 GB"},{id:"requestedQuota",label:"Requested Quota (GB)",type:"select",required:!0,options:["1 TB (default)","2 TB","5 TB","10 TB","25 TB (requires approval)"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"former-employee-od",group:"Access",label:"Access Former Employee OneDrive",approvalPath:["manager","it"],agentChecks:["Verify employee account status","Check data retention policy","Validate manager relationship","Check GDPR/legal hold status"],systemAction:"Set-SPOUser -Site (OneDrive URL) -LoginName via PnP PowerShell",fields:[{id:"formerEmployee",label:"Former Employee UPN",type:"email",required:!0},{id:"requestorUpn",label:"Requestor UPN",type:"email",required:!0,hint:"Your UPN — will be granted access"},{id:"reason",label:"Reason for Access",type:"select",required:!0,options:["Business continuity","Legal / compliance","Data recovery","Project handover","GDPR subject access request"]},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["7 days","30 days","90 days"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"ext-sharing":{parentGroup:null,operations:[{id:"invite-guest",group:"Guest Invitations",label:"Invite External Guest",approvalPath:["manager","it"],agentChecks:["Check domain against block list","Verify guest invitation policy","Check existing guest account","Validate business relationship"],systemAction:"POST /v1.0/invitations",fields:[{id:"guestEmail",label:"Guest Email Address",type:"email",required:!0},{id:"guestName",label:"Guest Full Name",type:"text",required:!0},{id:"guestOrg",label:"Guest Organisation",type:"text",required:!0},{id:"accessNeeded",label:"Access Required",type:"text",required:!0,placeholder:"Teams, SharePoint site, etc."},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["30 days","60 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"extend-guest",group:"Guest Lifecycle",label:"Extend Guest Access",approvalPath:["manager","dataowner"],agentChecks:["Verify current expiry date","Check if guest is still active","Validate business relationship still active"],systemAction:"PATCH /v1.0/users/{guestId} — update account expiry",fields:[{id:"guestEmail",label:"Guest Email Address",type:"email",required:!0},{id:"extension",label:"Extend By",type:"select",required:!0,options:["30 days","60 days","90 days","6 months","1 year"]},{id:"reviewDate",label:"Next Review Date",type:"date",required:!1},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"remove-guest",group:"Guest Lifecycle",label:"Remove Guest Access",approvalPath:["manager"],agentChecks:["Enumerate all resources guest has access to","Check for owned content","Schedule account removal"],systemAction:"DELETE /v1.0/users/{guestId}",fields:[{id:"guestEmail",label:"Guest Email Address",type:"email",required:!0},{id:"removeDate",label:"Removal Date",type:"date",required:!1,hint:"Leave blank for immediate removal"},{id:"reassignContent",label:"Reassign owned content to",type:"text",required:!1,placeholder:"UPN of new owner (optional)"},{id:"justification",label:"Reason",type:"textarea",required:!0}]},{id:"enable-ext-sharing",group:"Sharing Policy",label:"Request External Sharing Enablement",approvalPath:["manager","dataowner","it"],agentChecks:["Verify DLP policies cover new sharing scope","Check Conditional Access for guest sign-in","Review tenant sharing policy settings"],systemAction:"Set-SPOTenant -SharingCapability via PnP PowerShell",fields:[{id:"scope",label:"Sharing Scope",type:"select",required:!0,options:["Specific SharePoint sites","All SharePoint sites","OneDrive","All workloads"]},{id:"sharingLevel",label:"Sharing Level",type:"select",required:!0,options:["New and existing guests","Existing guests only","Anyone (anonymous links)"]},{id:"domains",label:"Allowed External Domains",type:"text",required:!1,placeholder:"partner1.com, partner2.com"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"user-access":{parentGroup:null,operations:[{id:"access-mailbox",group:"Access Requests",label:"Access to Shared Mailbox",approvalPath:["manager"],agentChecks:["Verify mailbox exists","Check existing permissions","Validate requester eligibility"],systemAction:"Add-MailboxPermission via Exchange PowerShell",fields:[{id:"mailboxEmail",label:"Shared Mailbox Email",type:"email",required:!0},{id:"permLevel",label:"Permission Level",type:"select",required:!0,options:["Full Access","Send As","Send on Behalf"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-teams",group:"Access Requests",label:"Access to Teams Team or Channel",approvalPath:["manager"],agentChecks:["Verify team exists","Check if team is private/public","Check channel accessibility"],systemAction:"POST /v1.0/teams/{id}/members",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"channelName",label:"Channel Name",type:"text",required:!1,placeholder:"Leave blank for general access"},{id:"role",label:"Role",type:"select",required:!0,options:["Member","Owner"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-sharepoint",group:"Access Requests",label:"Access to SharePoint Site",approvalPath:["manager"],agentChecks:["Verify site exists","Check current permissions","Classify data sensitivity"],systemAction:"SharePoint REST API — /_api/web/roleassignments",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"permLevel",label:"Permission Level",type:"select",required:!0,options:["Read","Contribute","Edit"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-dl",group:"Access Requests",label:"Access to Distribution List",approvalPath:["manager"],agentChecks:["Verify DL exists","Check for closed membership","Check for similar groups"],systemAction:"Add-DistributionGroupMember via Exchange PowerShell",fields:[{id:"dlEmail",label:"Distribution List Email",type:"email",required:!0},{id:"action",label:"Action",type:"select",required:!0,options:["Subscribe (add)","Unsubscribe (remove)"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-sg",group:"Access Requests",label:"Access to Security Group",approvalPath:["manager","it"],agentChecks:["Verify SG exists","Identify what resources are secured","Validate eligibility based on role/department"],systemAction:"POST /v1.0/groups/{id}/members/$ref",fields:[{id:"sgName",label:"Security Group Name",type:"text",required:!0},{id:"resourceAccess",label:"Resource you need to access",type:"text",required:!0,placeholder:"What will this SG membership unlock?"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},licenses:{parentGroup:null,operations:[{id:"req-e3",group:"Microsoft 365",label:"Request Microsoft 365 E3 License",approvalPath:["manager","it"],agentChecks:["Check E3 license availability","Verify current license assignment","Validate user eligibility"],systemAction:"POST /v1.0/users/{id}/assignLicense",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"startDate",label:"Required From Date",type:"date",required:!1},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-e5",group:"Microsoft 365",label:"Request Microsoft 365 E5 License",approvalPath:["manager","it"],agentChecks:["Check E5 license availability (CRITICAL — low stock)","Verify E5 features needed vs E3","Validate cost center approval"],systemAction:"POST /v1.0/users/{id}/assignLicense",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"featuresNeeded",label:"E5 Features Required",type:"select",required:!0,options:["Defender for Endpoint P2","Purview compliance","Advanced analytics","All E5 features"]},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"startDate",label:"Required From Date",type:"date",required:!1},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-powerbi",group:"Add-on Licenses",label:"Request Power BI Pro License",approvalPath:["manager"],agentChecks:["Check Power BI Pro availability","Verify user not already licensed","Check for Power BI Free upgrade path"],systemAction:"POST /v1.0/users/{id}/assignLicense (PBIPREMIUM)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"useCase",label:"Use Case",type:"textarea",required:!0,placeholder:"How will Power BI Pro be used?"},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-visio",group:"Add-on Licenses",label:"Request Visio Plan License",approvalPath:["manager"],agentChecks:["Check Visio license availability","Verify Visio Plan 1 vs Plan 2 need"],systemAction:"POST /v1.0/users/{id}/assignLicense (VISIO_PLAN2)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"visioTier",label:"Visio Plan",type:"select",required:!0,options:["Visio Plan 1 (web only)","Visio Plan 2 (desktop + web)"]},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-project",group:"Add-on Licenses",label:"Request Project Plan License",approvalPath:["manager"],agentChecks:["Check Project Plan availability","Validate PM role or equivalent"],systemAction:"POST /v1.0/users/{id}/assignLicense (PROJECT_PLAN3)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"projectTier",label:"Project Plan",type:"select",required:!0,options:["Project Plan 1 (web only)","Project Plan 3 (full)","Project Plan 5 (enterprise)"]},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},copilot:{parentGroup:null,operations:[{id:"req-copilot",group:"Copilot License",label:"Request Microsoft 365 Copilot License",approvalPath:["manager","it"],agentChecks:["Check Copilot license availability","Verify M365 E3/E5 prerequisite","Validate cost center budget"],systemAction:"POST /v1.0/users/{id}/assignLicense (COPILOT_M365)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"useCase",label:"Intended Use Case",type:"textarea",required:!0,placeholder:"How will Copilot improve your productivity?"},{id:"pilotGroup",label:"Pilot / rollout group",type:"text",required:!1,placeholder:"Team or department (optional)"},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"remove-copilot",group:"Copilot License",label:"Remove Microsoft 365 Copilot License",approvalPath:["manager"],agentChecks:["Verify current Copilot assignment","Check active Copilot usage metrics"],systemAction:"POST /v1.0/users/{id}/assignLicense (removeLicenses)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"reason",label:"Reason for Removal",type:"select",required:!0,options:["User departure","Cost reduction","Low utilisation","Role change","Other"]},{id:"justification",label:"Additional Details",type:"textarea",required:!1}]}]},"power-platform":{parentGroup:null,operations:[{id:"create-env",group:"Environments",label:"Create Power Platform Environment",approvalPath:["manager","it"],agentChecks:["Check environment quota","Validate environment type eligibility","Check DLP policy coverage for new environment"],systemAction:"Power Platform Admin API — POST /environments",fields:[{id:"envName",label:"Environment Name",type:"text",required:!0,placeholder:"e.g. Finance-Production"},{id:"envType",label:"Environment Type",type:"select",required:!0,options:["Sandbox","Production","Developer","Trial"]},{id:"region",label:"Region",type:"select",required:!0,options:["United Kingdom","Europe","United States","Australia"]},{id:"purpose",label:"Purpose",type:"textarea",required:!0},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"premium-connector",group:"Connectors",label:"Request Premium Connector Access",approvalPath:["manager","it"],agentChecks:["Check DLP policy for requested connector","Verify Power Automate license","Assess data exposure risk"],systemAction:"Power Platform DLP API — update connector classification",fields:[{id:"connector",label:"Premium Connector",type:"text",required:!0,placeholder:"e.g. Salesforce, SAP, ServiceNow"},{id:"environment",label:"Environment Name",type:"text",required:!0},{id:"useCase",label:"Use Case",type:"textarea",required:!0},{id:"dataFlow",label:"Data Flow Description",type:"textarea",required:!0,placeholder:"What data will flow through this connector?"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"dlp-exception",group:"Policies",label:"Request DLP Policy Exception",approvalPath:["manager","dataowner","it"],agentChecks:["Validate exception scope","Assess compliance risk","Check for alternative compliant approach","Flag sensitive connectors"],systemAction:"Power Platform DLP API — environment-level policy override",fields:[{id:"environment",label:"Environment",type:"text",required:!0},{id:"dlpPolicy",label:"DLP Policy Name",type:"text",required:!0},{id:"connector",label:"Connector(s) Affected",type:"text",required:!0},{id:"riskMitigation",label:"Risk Mitigation Plan",type:"textarea",required:!0},{id:"duration",label:"Exception Duration",type:"select",required:!0,options:["30 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"pa-license",group:"Licensing",label:"Request Power Automate License",approvalPath:["manager"],agentChecks:["Check Power Automate license availability","Verify M365 base license","Determine if Premium or per-flow license needed"],systemAction:"POST /v1.0/users/{id}/assignLicense (FLOW_PER_USER)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"licenseType",label:"License Type",type:"select",required:!0,options:["Power Automate Premium (per user)","Power Automate per flow","Power Automate Process"]},{id:"useCase",label:"Use Case",type:"textarea",required:!0},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},intune:{parentGroup:null,operations:[{id:"retire-device",group:"Device Actions",label:"Retire Device",approvalPath:["manager","it"],agentChecks:["Verify device ownership","Check for company data on device","Confirm MFA device registration","Check for pending updates"],systemAction:"POST /beta/deviceManagement/managedDevices/{id}/retire",fields:[{id:"deviceName",label:"Device Name",type:"text",required:!0,placeholder:"Device display name from Intune"},{id:"userUpn",label:"Device User UPN",type:"email",required:!0},{id:"reason",label:"Reason for Retirement",type:"select",required:!0,options:["Device being replaced","User departure","Device lost/stolen","End of lifecycle","Other"]},{id:"returnDate",label:"Device Return / Disposal Date",type:"date",required:!1},{id:"justification",label:"Additional Details",type:"textarea",required:!1}]},{id:"wipe-device",group:"Device Actions",label:"Wipe Device",approvalPath:["it"],agentChecks:["Verify device ownership","Check for unsynced data","CRITICAL: Confirm user awareness — device wipe is irreversible"],systemAction:"POST /beta/deviceManagement/managedDevices/{id}/wipe",fields:[{id:"deviceName",label:"Device Name",type:"text",required:!0},{id:"userUpn",label:"Device User UPN",type:"email",required:!0},{id:"wipeType",label:"Wipe Type",type:"select",required:!0,options:["Full wipe (factory reset)","Selective wipe (remove corporate data only)"]},{id:"reason",label:"Reason",type:"select",required:!0,options:["Device lost","Device stolen","Security incident","User departure","Other"]},{id:"confirmation",label:"Type CONFIRM to proceed",type:"text",required:!0,hint:"This action is irreversible"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"compliance-exception",group:"Compliance",label:"Request Compliance Exception",approvalPath:["manager","it"],agentChecks:["Assess compliance gap","Check for compensating controls","Review exception policy limits","Flag if exception creates Zero Trust gap"],systemAction:"Update device compliance policy exclusion group via Intune API",fields:[{id:"deviceName",label:"Device Name",type:"text",required:!0},{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"nonCompliantItem",label:"Non-Compliant Item",type:"select",required:!0,options:["OS version","Encryption","Screen lock","Jailbreak/Root detection","Threat level","Other"]},{id:"compensatingControls",label:"Compensating Controls",type:"textarea",required:!0,placeholder:"What security controls mitigate the compliance gap?"},{id:"duration",label:"Exception Duration",type:"select",required:!0,options:["7 days","30 days","90 days"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"guest-lifecycle":{parentGroup:null,operations:[{id:"invite-guest-user",group:"Guest Management",label:"Invite Guest User",approvalPath:["manager","it"],agentChecks:["Check domain against block list","Check for existing guest account","Verify guest invitation policy","Check Conditional Access guest policy"],systemAction:"POST /v1.0/invitations",fields:[{id:"guestEmail",label:"Guest Email",type:"email",required:!0},{id:"guestName",label:"Guest Full Name",type:"text",required:!0},{id:"guestOrg",label:"Organisation",type:"text",required:!0},{id:"accessScope",label:"Access Scope",type:"text",required:!0,placeholder:"Teams, SharePoint sites, etc."},{id:"sponsor",label:"Internal Sponsor UPN",type:"email",required:!0,hint:"Accountable internal contact for this guest"},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["30 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"extend-guest-access",group:"Guest Management",label:"Extend Guest Access",approvalPath:["manager","dataowner"],agentChecks:["Verify guest activity (last 30 days)","Check access scope still appropriate","Validate sponsor still in organisation"],systemAction:"PATCH /v1.0/users/{guestId} — update account expiry",fields:[{id:"guestEmail",label:"Guest Email",type:"email",required:!0},{id:"extension",label:"Extend Access By",type:"select",required:!0,options:["30 days","90 days","6 months","1 year"]},{id:"accessReview",label:"Access Still Required For",type:"textarea",required:!0,placeholder:"Confirm ongoing business need..."},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"remove-guest-user",group:"Guest Management",label:"Remove Guest User",approvalPath:["manager"],agentChecks:["Enumerate guest resource access","Check for owned content","Check active collaborations","Flag any open items"],systemAction:"DELETE /v1.0/users/{guestId}",fields:[{id:"guestEmail",label:"Guest Email",type:"email",required:!0},{id:"removeDate",label:"Removal Date",type:"date",required:!1,hint:"Leave blank for immediate removal"},{id:"contentAction",label:"Owned Content Action",type:"select",required:!0,options:["Reassign to sponsor","Export then delete","No action needed"]},{id:"justification",label:"Reason",type:"textarea",required:!0}]},{id:"quarterly-review",group:"Access Review",label:"Request Quarterly Access Review",approvalPath:["it"],agentChecks:["Enumerate all active guest accounts","Identify guests inactive >60 days","Check expiry dates","Identify guests without sponsors"],systemAction:'GET /v1.0/users?$filter=userType eq "Guest" — generate review report',fields:[{id:"scope",label:"Review Scope",type:"select",required:!0,options:["All guest users","Specific department guests","Guests expiring in 30 days","Inactive guests only"]},{id:"reviewerUpn",label:"Reviewer UPN",type:"email",required:!0,hint:"Who should receive the review report"},{id:"justification",label:"Additional Notes",type:"textarea",required:!1}]}]}};let k="landing",M=null,D=null,E=null,Ee={},ri=100;function qs(){const e=document.getElementById("page-portal");e&&(k="landing",M=null,D=null,E=null,Ee={},T(e))}function T(e){k==="landing"?Gs(e):k==="service"?Ns(e):k==="form"?Fs(e):k==="submitted"&&zs(e)}function De(e){const t=d.settings;return t.portalEnabled?t[e]!==!1:!1}function kt(e){return"portal_"+e.replace(/-/g,"_")}function ae(e){return Ts[e]||null}function rt(e){return Ie.find(t=>t.id===e)}function oi(e,t){const i=ae(e);return i?i.operations.find(s=>s.id===t):null}function fe(e){return e==="exchange"}function Ls(){const e={"exchange-groups":"portal_exchange_groups","shared-mailbox":"portal_shared_mailbox","room-equipment":"portal_room_equipment","email-services":"portal_email_services"};for(const t of se)if(De(e[t.id]))return t.id;return se[0].id}function Ge(){return fe(M)?D:M}function be(e){if(!e)return[];const t=["submit",...e.approvalPath,"agent","action","done"];return Xe.filter(i=>t.includes(i.id))}function Gs(e){const t=d.currentUser;if(!d.settings.portalEnabled){e.innerHTML=`
      <div class="page-header"><div class="page-title"><i class="ti ti-grid-dots"></i> Self-Service Portal</div></div>
      <div class="locked-banner">
        <i class="ti ti-plug-x"></i>
        <h3>Portal Temporarily Disabled</h3>
        <p>The self-service portal has been disabled by your administrator. Please contact IT for assistance.</p>
      </div>`;return}const i={user:"Standard user",manager:"Manager",admin:"Administrator",super:"Super Admin"},s=Ie.filter(a=>De(kt(a.id)));e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-grid-dots"></i> Self-Service Portal</div>
        <div class="page-subtitle">Submit requests — automated approval and provisioning via AI Agent</div>
      </div>
    </div>

    <div class="alert-banner info mb-3">
      <i class="ti ti-user-circle"></i>
      <span>Signed in as <strong>${t==null?void 0:t.name}</strong> (${i[t==null?void 0:t.role]||(t==null?void 0:t.role)}).
      All requests are logged and subject to approval workflow and AI Agent validation before provisioning.</span>
    </div>

    <div class="portal-workflow-banner mb-3">
      ${Xe.map((a,r)=>`
        <div class="pwf-step">
          <div class="pwf-circle pwf-${a.color}"><i class="ti ${a.icon}"></i></div>
          <div class="pwf-label">${a.label}</div>
        </div>
        ${r<Xe.length-1?'<div class="pwf-arrow"><i class="ti ti-arrow-right"></i></div>':""}
      `).join("")}
    </div>

    <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">
      ${s.length} services available
    </div>

    <div class="portal-service-grid" id="portal-service-grid"></div>
  `;const n=e.querySelector("#portal-service-grid");Ie.forEach(a=>{var l,u;const r=De(kt(a.id)),o=fe(a.id)?se.reduce((y,re)=>{var W,v;return y+(((v=(W=ae(re.id))==null?void 0:W.operations)==null?void 0:v.length)||0)},0):((u=(l=ae(a.id))==null?void 0:l.operations)==null?void 0:u.length)||0,c=document.createElement("div");c.className=`portal-svc-card ${r?"":"disabled"}`,c.innerHTML=`
      <div class="psc-icon" style="background:${a.bg};color:${a.color}"><i class="ti ${a.icon}"></i></div>
      <div class="psc-name">${a.name}</div>
      <div class="psc-desc">${a.desc}</div>
      <div class="psc-footer">
        <span class="badge ${r?"info":"neutral"}">${r?o+" actions":"Disabled"}</span>
        <button class="btn btn-xs btn-primary psc-open-btn" data-gid="${a.id}" ${r?"":"disabled"}>
          <i class="ti ti-arrow-right"></i> Open
        </button>
      </div>
    `,r||(c.title="This service has been disabled by your administrator."),n.appendChild(c)}),e.querySelectorAll(".psc-open-btn:not([disabled])").forEach(a=>{a.addEventListener("click",()=>{M=a.dataset.gid,fe(M)&&(D=Ls()),E=null,Ee={},k="service",T(e)})})}function Ns(e){const t=rt(M);if(!t){k="landing",T(e);return}const i=Ge(),s=ae(i);e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="svc-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div class="psc-icon sm" style="background:${t.bg};color:${t.color}"><i class="ti ${t.icon}"></i></div>
        <div>
          <div class="page-title">${t.name}</div>
          <div class="page-subtitle">${t.desc}</div>
        </div>
      </div>
    </div>

    ${fe(M)?Os():""}

    <div id="svc-ops-area"></div>
  `,e.querySelector("#svc-back").addEventListener("click",()=>{k="landing",T(e)}),fe(M)&&e.querySelectorAll(".ex-sub-tab").forEach(n=>{n.addEventListener("click",()=>{D=n.dataset.sub,E=null,Et(e,ae(D)),e.querySelectorAll(".ex-sub-tab").forEach(a=>a.classList.toggle("active",a.dataset.sub===D))})}),Et(e,s)}function Os(){const e={"exchange-groups":"portal_exchange_groups","shared-mailbox":"portal_shared_mailbox","room-equipment":"portal_room_equipment","email-services":"portal_email_services"};return`
    <div class="tabs mb-3" style="margin-bottom:16px">
      ${se.map(t=>{const i=De(e[t.id]);return`<button class="tab-btn ex-sub-tab ${t.id===D?"active":""} ${i?"":"disabled-tab"}"
          data-sub="${t.id}" ${i?"":"disabled"} title="${t.desc}">
          <i class="ti ${t.icon}" style="margin-right:4px"></i>${t.name}
          ${i?"":'<span class="badge neutral" style="margin-left:4px;font-size:8px">Off</span>'}
        </button>`}).join("")}
    </div>
  `}function Et(e,t){const i=e.querySelector("#svc-ops-area");if(!i)return;if(!t){i.innerHTML='<div class="empty-state">No operations available for this service.</div>';return}const s={};if(t.operations.forEach(n=>{s[n.group]||(s[n.group]=[]),s[n.group].push(n)}),i.innerHTML=`
    <div class="card">
      <div class="card-title mb-3"><i class="ti ti-list-check"></i> Select an action</div>
      ${Object.entries(s).map(([n,a])=>`
        <div style="margin-bottom:16px">
          <div class="section-heading">${n}</div>
          <div class="op-cards-grid">
            ${a.map(r=>`
              <div class="op-card ${E===r.id?"selected":""}" data-op="${r.id}">
                <div class="op-card-title">${r.label}</div>
                <div class="op-card-steps">
                  ${be(r).map(o=>`<span class="op-step-dot op-step-${o.color}" title="${o.label}"></span>`).join("")}
                </div>
                <div class="op-card-approval">
                  <i class="ti ti-route" style="font-size:10px"></i>
                  ${be(r).map(o=>o.label).join(" → ")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>

    <div id="svc-form-preview"></div>
  `,i.querySelectorAll(".op-card").forEach(n=>{n.addEventListener("click",()=>{i.querySelectorAll(".op-card").forEach(a=>a.classList.remove("selected")),n.classList.add("selected"),E=n.dataset.op,Ct(i,ae(Ge()),E)})}),E){const n=i.querySelector(`.op-card[data-op="${E}"]`);n&&n.classList.add("selected"),Ct(i,t,E)}}function Ct(e,t,i){var r;const s=e.querySelector("#svc-form-preview");if(!s)return;const n=(r=t==null?void 0:t.operations)==null?void 0:r.find(o=>o.id===i);if(!n)return;const a=be(n);s.innerHTML=`
    <div class="card mt-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-info-circle"></i> ${n.label}</span>
        <button class="btn btn-primary" id="svc-start-form"><i class="ti ti-arrow-right"></i> Start Request</button>
      </div>

      <div class="grid-2" style="gap:16px">
        <div>
          <div class="section-heading">Approval & Provisioning Workflow</div>
          <div class="workflow-timeline-h">
            ${a.map((o,c)=>`
              <div class="wfh-step">
                <div class="wfh-circle wfh-${o.color}"><i class="ti ${o.icon}"></i></div>
                <div class="wfh-label">${o.label}</div>
              </div>
              ${c<a.length-1?'<div class="wfh-arrow"></div>':""}
            `).join("")}
          </div>
        </div>
        <div>
          <div class="section-heading">AI Agent Validation Checks</div>
          <div style="display:flex;flex-direction:column;gap:5px">
            ${n.agentChecks.map(o=>`
              <div style="display:flex;align-items:flex-start;gap:6px;font-size:11px;color:var(--color-text-secondary)">
                <i class="ti ti-robot" style="color:var(--clr-teal-text);font-size:12px;flex-shrink:0;margin-top:1px"></i>
                ${o}
              </div>
            `).join("")}
          </div>
          <div style="margin-top:10px">
            <div class="section-heading">System Action</div>
            <code style="font-size:10px;font-family:var(--font-mono);color:var(--clr-info-text);background:var(--clr-info-bg);padding:4px 8px;border-radius:4px;display:block;word-break:break-all">${n.systemAction}</code>
          </div>
        </div>
      </div>
    </div>
  `,s.querySelector("#svc-start-form").addEventListener("click",()=>{k="form",Ee={};const o=document.getElementById("page-portal");T(o)})}function Fs(e){var a;const t=rt(M),i=Ge(),s=oi(i,E);if(!s||!t){k="service",T(e);return}const n=be(s);e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="form-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div class="psc-icon sm" style="background:${t.bg};color:${t.color}"><i class="ti ${t.icon}"></i></div>
        <div>
          <div class="page-title">${s.label}</div>
          <div class="page-subtitle">${t.name}${D?" — "+(((a=se.find(r=>r.id===D))==null?void 0:a.name)||""):""}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <!-- Form -->
      <div>
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-forms"></i> Request Details</div>
          <div id="dynamic-form">
            ${s.fields.map(r=>Us(r)).join("")}
          </div>
        </div>

        <div class="card" style="background:var(--clr-info-bg);border-color:var(--clr-info-border)">
          <div style="display:flex;align-items:flex-start;gap:10px">
            <i class="ti ti-robot" style="font-size:18px;color:var(--clr-teal-text);flex-shrink:0;margin-top:2px"></i>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--color-text-primary);margin-bottom:6px">AI Agent will validate before provisioning:</div>
              ${s.agentChecks.map(r=>`<div style="font-size:11px;color:var(--color-text-secondary);padding:2px 0;display:flex;align-items:flex-start;gap:5px"><i class="ti ti-check" style="color:var(--clr-teal-text);font-size:10px;flex-shrink:0;margin-top:2px"></i>${r}</div>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- Workflow sidebar -->
      <div>
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-route"></i> Approval & Provisioning Flow</div>
          <div class="workflow-timeline-v">
            ${n.map((r,o)=>`
              <div class="wfv-step">
                <div class="wfv-left">
                  <div class="wfv-circle wfv-${r.color}"><i class="ti ${r.icon}"></i></div>
                  ${o<n.length-1?'<div class="wfv-line"></div>':""}
                </div>
                <div class="wfv-content">
                  <div class="wfv-title">${r.label}</div>
                  ${$t(r.id,s)?`<div class="wfv-desc">${$t(r.id,s)}</div>`:""}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="card">
          <div class="card-title mb-2"><i class="ti ti-api"></i> System Action</div>
          <code style="font-size:10px;font-family:var(--font-mono);color:var(--clr-info-text);word-break:break-all;line-height:1.6">${s.systemAction}</code>
        </div>

        <div style="margin-top:16px">
          <button class="btn btn-primary w-full" id="form-submit" style="width:100%;justify-content:center;padding:10px">
            <i class="ti ti-send"></i> Submit Request
          </button>
          <p style="font-size:10px;color:var(--color-text-tertiary);text-align:center;margin-top:8px">
            By submitting, you acknowledge this request will be logged in the audit trail and routed for approval.
          </p>
        </div>
      </div>
    </div>
  `,e.querySelector("#form-back").addEventListener("click",()=>{k="service",T(e)}),e.querySelector("#form-submit").addEventListener("click",()=>Bs(e,s))}function Us(e){const t=e.required?" *":"",i=e.hint?`<div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${e.hint}</div>`:"";return e.type==="text"||e.type==="email"?`<div class="form-group" data-field="${e.id}">
      <label class="form-label" for="ff-${e.id}">${e.label}${t}</label>
      <input type="${e.type}" class="form-input" id="ff-${e.id}" name="${e.id}" placeholder="${e.placeholder||""}" ${e.required?"required":""}>
      ${i}
    </div>`:e.type==="date"?`<div class="form-group" data-field="${e.id}">
      <label class="form-label" for="ff-${e.id}">${e.label}${t}</label>
      <input type="date" class="form-input" id="ff-${e.id}" name="${e.id}" ${e.required?"required":""}>
      ${i}
    </div>`:e.type==="select"?`<div class="form-group" data-field="${e.id}">
      <label class="form-label" for="ff-${e.id}">${e.label}${t}</label>
      <select class="form-select" id="ff-${e.id}" name="${e.id}" ${e.required?"required":""}>
        <option value="">— Select —</option>
        ${(e.options||[]).map(s=>`<option value="${s}">${s}</option>`).join("")}
      </select>
      ${i}
    </div>`:e.type==="textarea"?`<div class="form-group" data-field="${e.id}">
      <label class="form-label" for="ff-${e.id}">${e.label}${t}</label>
      <textarea class="form-textarea" id="ff-${e.id}" name="${e.id}" placeholder="${e.placeholder||""}" ${e.required?"required":""}></textarea>
      ${i}
    </div>`:e.type==="checkbox"?`<div class="form-group" data-field="${e.id}">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" id="ff-${e.id}" name="${e.id}">
        <span class="form-label" style="margin:0">${e.label}</span>
      </label>
      ${i}
    </div>`:""}function $t(e,t){return t.approvalPath,e==="submit"?"Request submitted with required details":e==="manager"?"Your direct manager reviews and approves":e==="it"?"IT team validates technical feasibility and security":e==="dataowner"?"Data/resource owner confirms access appropriateness":e==="agent"?`AI Agent validates: ${t.agentChecks[0]}, and ${t.agentChecks.length-1} more checks`:e==="action"?`Provisioning via: ${t.systemAction}`:e==="done"?"Email notification sent. Request available in My Requests.":""}function Bs(e,t){const i=e.querySelector("#dynamic-form");let s=!0;const n=[];if(t.fields.filter(r=>r.required).forEach(r=>{const o=i.querySelector(`#ff-${r.id}`);if(!o)return;(o.type==="checkbox"?o.checked:o.value.trim())||(s=!1,n.push(r.label),o.style.borderColor="var(--clr-danger-text)",o.addEventListener("input",()=>{o.style.borderColor=""},{once:!0}))}),t.fields.find(r=>r.id==="confirmation")){const r=i.querySelector("#ff-confirmation"),o=i.querySelector("#ff-groupName, #ff-siteUrl, #ff-currentName");if(r&&r.value.toUpperCase()!=="CONFIRM"&&!o&&r.value!=="CONFIRM"){s=!1,p("Type CONFIRM in the confirmation field to proceed.","error");return}}if(!s){p(`Please fill in required fields: ${n.slice(0,3).join(", ")}`,"error");return}t.fields.forEach(r=>{const o=i.querySelector(`#ff-${r.id}`);o&&(Ee[r.id]=o.type==="checkbox"?o.checked:o.value)}),ri++,k="submitted",T(e)}function zs(e){var r,o;const t=rt(M),i=Ge(),s=oi(i,E);if(!s||!t){k="landing",T(e);return}const n=be(s),a=`REQ-${String(ri).padStart(4,"0")}`;e.innerHTML=`
    <div class="page-header">
      <div class="page-title"><i class="ti ti-circle-check" style="color:var(--clr-success-text)"></i> Request Submitted</div>
    </div>

    <div class="alert-banner success mb-3">
      <i class="ti ti-circle-check"></i>
      <strong>${a}</strong> — ${s.label} request submitted successfully. You will be notified at each approval stage.
    </div>

    <div class="grid-2" style="gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-receipt"></i> Request Summary</div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:5px 16px;font-size:11px">
          <span style="color:var(--color-text-tertiary)">Request ID</span>
          <span class="monospace" style="font-weight:600;color:var(--clr-info-text)">${a}</span>
          <span style="color:var(--color-text-tertiary)">Service</span>
          <span>${t.name}</span>
          <span style="color:var(--color-text-tertiary)">Action</span>
          <span>${s.label}</span>
          <span style="color:var(--color-text-tertiary)">Submitted by</span>
          <span>${(r=d.currentUser)==null?void 0:r.name}</span>
          <span style="color:var(--color-text-tertiary)">Time</span>
          <span>${new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})} today</span>
          <span style="color:var(--color-text-tertiary)">Next step</span>
          <span style="color:var(--clr-warning-text);font-weight:600">${((o=n[1])==null?void 0:o.label)||"AI Validation"}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-route"></i> Workflow Progress</div>
        <div class="workflow-timeline-v compact">
          ${n.map((c,l)=>`
            <div class="wfv-step">
              <div class="wfv-left">
                <div class="wfv-circle ${l===0?"wfv-success":"wfv-neutral"}">
                  ${l===0?'<i class="ti ti-check"></i>':`<span style="font-size:9px;font-weight:700">${l+1}</span>`}
                </div>
                ${l<n.length-1?'<div class="wfv-line"></div>':""}
              </div>
              <div class="wfv-content">
                <div class="wfv-title ${l===0?"done":l===1?"active":"pending"}">${c.label}</div>
                <div class="wfv-desc">${l===0?"Completed":l===1?"In progress — awaiting response":"Pending"}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" id="submit-new">
        <i class="ti ti-plus"></i> Submit another request
      </button>
      <button class="btn" id="submit-myreqs">
        <i class="ti ti-list-check"></i> View my requests
      </button>
    </div>
  `,e.querySelector("#submit-new").addEventListener("click",()=>{k="landing",M=null,D=null,E=null,Ee={},T(e)}),e.querySelector("#submit-myreqs").addEventListener("click",()=>{Ht(()=>Promise.resolve().then(()=>fi),void 0).then(c=>c.go("myreqs"))})}function js(){const e=document.getElementById("page-myreqs");e&&(e.innerHTML=`
    <div class="page-header">
      <div class="page-title"><i class="ti ti-list-check"></i> My Requests</div>
      <div class="page-subtitle">Track the status of your submitted access requests</div>
    </div>

    <!-- Request 1: MESG awaiting admin -->
    <div class="request-card">
      <div class="req-header">
        <div>
          <div style="font-size:13px;font-weight:700">Mail-Enabled Security Group</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">REQ-008 · Submitted 3 hours ago</div>
        </div>
        <span class="badge warning dot">Awaiting Admin Approval</span>
      </div>
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.5">
        <strong>Group:</strong> security-ops@contoso.com &nbsp;·&nbsp; <strong>Owner:</strong> ${localStorage.getItem("m365ops_user")||"You"} &nbsp;·&nbsp; <strong>Approval path:</strong> Admin approval required
      </div>
      <div class="alert-banner info" style="margin-bottom:10px">
        <i class="ti ti-api"></i>
        <span>Execution will use <strong>POST /groups</strong> via Graph API to provision the group with security settings.</span>
      </div>
      <div class="req-timeline">
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Submitted</strong> · 3 hours ago</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Manager approved</strong> · 2 hours ago</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot active"></div>
          <div class="tl-label active"><strong>Awaiting admin approval</strong> · SLA: 4h remaining</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot pending"></div>
          <div class="tl-label">Execution via Graph API</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot pending"></div>
          <div class="tl-label">Completed</div>
        </div>
      </div>
    </div>

    <!-- Request 2: DG awaiting manager -->
    <div class="request-card">
      <div class="req-header">
        <div>
          <div style="font-size:13px;font-weight:700">Distribution Group</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">REQ-007 · Submitted yesterday</div>
        </div>
        <span class="badge warning dot">Awaiting Manager Approval</span>
      </div>
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.5">
        <strong>Group:</strong> marketing-emea@contoso.com &nbsp;·&nbsp; <strong>Approval path:</strong> Manager approval
      </div>
      <div class="req-timeline">
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Submitted</strong> · Yesterday at 14:30</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot active"></div>
          <div class="tl-label active"><strong>Awaiting manager approval</strong> · SLA: 2h remaining</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot pending"></div>
          <div class="tl-label">Provisioning via Exchange Admin Center</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot pending"></div>
          <div class="tl-label">Completed</div>
        </div>
      </div>
    </div>

    <!-- Request 3: Completed SharePoint -->
    <div class="request-card">
      <div class="req-header">
        <div>
          <div style="font-size:13px;font-weight:700">SharePoint Site Access</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">REQ-005 · Completed 3 days ago</div>
        </div>
        <span class="badge success dot">Completed</span>
      </div>
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.5">
        <strong>Site:</strong> HR Documents &nbsp;·&nbsp; <strong>Level:</strong> Read &nbsp;·&nbsp; <strong>Granted by:</strong> Sanjay Kumar
      </div>
      <div class="req-timeline">
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Submitted</strong> · 4 days ago</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Manager approved</strong> · 3 days ago</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Access granted</strong> · 3 days ago at 09:15</div>
        </div>
        <div class="tl-step">
          <div class="tl-dot done"></div>
          <div class="tl-label done"><strong>Completed</strong> · Notification sent</div>
        </div>
      </div>
    </div>
  `)}const Pt={user:["What can I request?","How to create a Team?","Request SharePoint access","Request Copilot license"],manager:["Approve pending requests","Guest access policy","How to request a shared mailbox?","License request process"],admin:["M365 Config failures","Risky users summary","Zero Trust gaps","Portal service status"],super:["Graph API status","All service workflows","Failed CIS controls","Guest lifecycle policy"]},Hs=[{keywords:["m365 config","cis","benchmark","compliance score"],response:`**M365 Config — CIS Benchmark v7.0.0**

Your tenant scores **78%** across 96 controls. Current failures:

- **1.1.4** Security Defaults conflict with CA policies
- **1.3.6** No Teams DLP policy configured
- **2.1.3** Safe Attachments not covering all users
- **2.4.5** Secure Score recommended actions not reviewed
- **3.2.3** Teams DLP policy missing
- **5.2.2.5** Device compliance CA excludes 12 users

Navigate to **M365 Config** → select any topic → view remediation guidance.`},{keywords:["risky user","risk detection","risky sign"],response:`**Risky Users — 3 Active Detections**

1. **Kevin Osei** (kevin.osei@contoso.com) — **High risk** — sign-in from unknown location (14 min ago)
2. **Nina Patel** (nina.patel@contoso.com) — **Medium risk** — anomalous activity pattern
3. **Sara Ogden** (sara.ogden@contoso.com) — **Medium risk** — inactive account activity

**Recommended actions:** Force password reset for Kevin Osei immediately. Review all three accounts in the **Security** page.`},{keywords:["zero trust","zt","pillars"],response:`**Zero Trust Score — 7/12 controls passed**

❌ **Identity:** Legacy auth block policy missing (FAILED)
⚠️ **Identity:** MFA coverage 87% (target 100%) — WARNING
❌ **Device:** No device risk-based CA policy (FAILED)
⚠️ **Device:** Android compliance policy missing — WARNING
⚠️ **Priv. Access:** 4 permanent Global Admin assignments — WARNING
✅ **Guest Governance:** All controls passed

Top priority: Block legacy authentication via Conditional Access → navigate to **Zero Trust** for full details.`},{keywords:["approval","approve","pending approv"],response:`**Pending Approvals**

Currently awaiting action:
- **REQ-001** Distribution Group — Priya Kumar (2h SLA remaining)
- **REQ-003** MFA Reset — James Liu (**OVERDUE** — immediate action needed)
- **REQ-006** SharePoint Access — Sara Ogden (3h SLA)

Navigate to **Pending Approvals** to action these requests. Overdue requests affect your SLA metrics.`},{keywords:["license","e3","e5","power bi","visio","copilot license"],response:`**License Management**

Current capacity:
| License | Total | Used | Available |
|---|---|---|---|
| M365 E3 | 600 | 581 | 19 |
| **M365 E5** | 150 | 148 | **2 ⚠️** |
| Exchange P1 | 100 | 72 | 28 |
| Power BI Pro | 100 | 38 | 62 |

**To request a license:** Portal → License Management → select the license type → submit.
**Approval path:** Manager → IT → AI Agent validation → automatic assignment via Graph API.`},{keywords:["distribution group","create group","dg ","mail group"],response:`**Distribution Groups — How to Request**

Navigate to **Portal → Exchange Online → Distribution & Security Groups**

**You can request:**
- Create Distribution Group (email list, manager approval)
- Add/remove members
- Rename or delete a group
- Create Mail-Enabled Security Group (email + access control, admin approval)
- Create M365 Group (collaboration + email, manager → IT approval)

**Approval path:** Manager Approval → IT Review (for security groups) → **AI Agent checks:**
- Duplicate group detection
- Suggests existing groups with similar purpose
- Validates naming convention
- Checks group quota

**Provisioning:** Microsoft Graph API POST /v1.0/groups`},{keywords:["security group","sg ","mail-enabled","mesg","mail enabled security"],response:`**Mail-Enabled Security Groups & Security Groups**

Portal → Exchange Online → Distribution & Security Groups

**Mail-Enabled Security Group (MESG):**
- Email distribution + resource access control
- **Approval:** Manager → IT (required — security implications)
- AI Agent checks: duplicate detection, resource scope review, naming convention
- Provisioning: POST /v1.0/groups (securityEnabled + mailEnabled)

**Security Group (no email):**
- Access control only (SharePoint, Teams, resources)
- **Approval:** Manager → IT
- AI Agent: reviews intended resource access, checks for similar groups

**Note:** All changes are logged in the membership audit trail.`},{keywords:["shared mailbox","shared mail","mailbox permission"],response:`**Shared Mailboxes**

Portal → Exchange Online → Shared Mailboxes

**Available actions:**
- ✅ Create shared mailbox (admin approval)
- ✅ Delete shared mailbox
- ✅ Add Full Access, Send As, or Send on Behalf permissions
- ✅ Remove permissions

**Approval path:** Manager → IT → AI Agent → Exchange PowerShell

**AI Agent validates:**
- Duplicate mailbox check
- License availability
- Naming convention compliance
- Current permission state

**Note:** Shared mailboxes don't require separate licenses up to 50 GB.`},{keywords:["room mailbox","equipment mailbox","meeting room","room booking","resource mailbox"],response:`**Room & Equipment Mailboxes**

Portal → Exchange Online → Room & Equipment Mailboxes

**You can request:**
- Create a room mailbox (with capacity, location, booking policy)
- Create equipment mailbox (projectors, AV equipment, fleet)
- Modify booking policies (auto-accept, max duration, advance window)
- Add/remove delegates for booking management
- Remove a resource mailbox

**Approval:** Manager → IT
**AI Agent checks:** duplicate names, capacity validation, location verification
**Provisioning:** New-Mailbox -Room or -Equipment via Exchange PowerShell`},{keywords:["smtp","mail forwarding","forward email","auto reply","out of office","email alias"],response:`**Email Services**

Portal → Exchange Online → Email Services

**Available requests:**
1. **SMTP Address Change** — Change primary email address
   - Approval: Manager → IT
   - AI checks: address availability, existing references
   
2. **Mail Forwarding** — Forward mailbox to another address
   - Approval: Manager → IT (flags if forwarding to external domain)
   - AI checks: external forwarding policy, destination validity
   
3. **Auto Reply** — Configure out-of-office messages
   - Approval: Manager only
   - Options: internal-only or internal+external, with date range

All email service changes are audited in Exchange Online.`},{keywords:["create team","new team","teams team","microsoft teams"],response:`**Microsoft Teams — Service Requests**

Portal → Microsoft Teams

**You can request:**
- **Create Team** — private or public, with template options
- **Add/Remove Members** — member or owner role
- **Create Channel** — standard, private, or shared
- **Guest Access** — invite external users to a team

**Approval path:** Manager approval
**AI Agent checks:** duplicate team detection, suggests existing teams, validates naming, checks M365 group quota
**Provisioning:** Microsoft Graph API POST /v1.0/teams

**Tip:** Private teams require membership to view content. Public teams are visible to everyone in your org.`},{keywords:["teams guest","external team member","guest team"],response:`**Teams Guest Access Request**

Portal → Microsoft Teams → Guest Access Requests

**Requires:** Manager → IT approval (external users have elevated risk)

**You'll need to provide:**
- Guest email address(es)
- Guest organisation name
- Duration (30 days to 1 year)
- Business justification

**AI Agent checks:**
- Guest domain not on block list
- Teams guest policy enabled
- Conditional Access guest sign-in policy active
- Existing guest account check

**Provisioning:** POST /v1.0/teams/{id}/members with guest account`},{keywords:["sharepoint","spo","new site","request site","sharepoint access"],response:`**SharePoint Services**

Portal → SharePoint Services

**Available requests:**
- **New Site** — team site, communication site, hub site
- **Add Site Members/Owners** — specify permission level (Read/Contribute/Edit/Full Control)
- **External Sharing** — requires Manager → Data Owner → IT approval
- **Storage Increase** — request additional quota
- **Site Deletion** — with content export option

**Approval path:** Manager → IT (storage/external sharing also requires data owner)
**AI Agent:** duplicate site check, storage quota validation, DLP policy review for external sharing
**Provisioning:** SharePoint REST API + PnP PowerShell`},{keywords:["external sharing","sharepoint external","share with external","anyone link"],response:`**External Sharing Requests**

Portal → SharePoint Services → Request External Sharing

**Approval path:** Manager → **Data Owner** → IT (three-step approval)

**AI Agent performs critical checks:**
- Tenant external sharing policy compliance
- Verifies domain not on blocked list
- Data sensitivity classification
- DLP policy applicability
- Conditional Access for guest sign-in

**Note:** External sharing of Confidential or Highly Confidential data requires additional security review. The AI Agent will flag this automatically.

See also: **External Sharing Requests** service (Portal) for guest invitations and domain-level enablement.`},{keywords:["onedrive","one drive","storage","onedrive storage","former employee"],response:`**OneDrive Administration**

Portal → OneDrive Administration

**Available requests:**

1. **Storage Increase**
   - Approval: Manager → IT
   - Options: 1TB (default), 2TB, 5TB, 10TB, 25TB
   - AI checks current usage and tenant storage pool

2. **Former Employee OneDrive Access**
   - Approval: Manager → IT (GDPR considerations checked)
   - Requires: manager relationship verification, legal hold check
   - Duration: 7, 30, or 90 days (time-limited access)
   - Reasons: business continuity, legal, data recovery, handover

**Provisioning:** Set-SPOUser (SharePoint/OneDrive Admin PowerShell)`},{keywords:["invite guest","guest user","external guest","guest invitation"],response:`**External Guest Invitations**

Portal → External Sharing Requests → Invite External Guest

**Required information:**
- Guest email + full name + organisation
- Access scope (which Teams/sites)
- Internal sponsor (accountable contact)
- Duration (30 days to 1 year)
- Business justification

**Approval path:** Manager → IT

**AI Agent checks:**
- Domain not on block list
- No existing guest account for this email
- Guest invitation policy compliant
- Conditional Access guest MFA policy active

See also: **Guest User Lifecycle Management** (Portal) for quarterly reviews.`},{keywords:["extend guest","remove guest","guest access","guest lifecycle","quarterly review"],response:`**Guest User Lifecycle Management**

Portal → Guest User Lifecycle Management

**You can:**
- **Invite Guest** — new external collaborator
- **Extend Access** — renew expiring guest (Manager + Data Owner approval)
- **Remove Guest** — revoke all access (Manager approval)
- **Quarterly Access Review** — IT-initiated review of all active guests

**AI Agent automatically:**
- Lists all resources the guest has access to
- Checks guest activity in last 30 days
- Flags guests without active sponsors
- Verifies inactive guests (60+ days) for removal

**Best practice:** Set all guest accounts to expire after 1 year with a mandatory review.`},{keywords:["user access","request access","access to","mailbox access","team access"],response:`**User Access Management**

Portal → User Access Management

**Request access to:**
- **Shared Mailbox** — Full Access, Send As, Send on Behalf
- **Teams** — Member or Owner role
- **SharePoint Sites** — Read, Contribute, Edit
- **Distribution Lists** — Subscribe or unsubscribe
- **Security Groups** — membership for resource access

**All requests:** Manager approval → AI Agent validates ownership and eligibility → automated provisioning

**Tip:** If you need access to multiple related resources, submit a separate request for each. The AI Agent will check for efficiency and may suggest group-based access instead.`},{keywords:["copilot","m365 copilot","microsoft copilot","ai license","copilot request"],response:`**Microsoft 365 Copilot License Request**

Portal → Microsoft Copilot → Request Copilot License

**Requirements:**
- Active M365 E3 or E5 base license (checked automatically)
- Business justification and use case
- Cost center code

**Approval path:** Manager → IT (budget and license availability check)

**AI Agent checks:**
- Copilot license availability
- M365 prerequisite license verified
- Cost center budget validated

**Cost:** Approximately £25-30/user/month — attach business justification.

**Provisioning:** POST /v1.0/users/{id}/assignLicense with Microsoft 365 Copilot SKU`},{keywords:["power platform","power automate","power apps","environment","premium connector","dlp exception"],response:`**Power Platform Services**

Portal → Power Platform Services

**Available requests:**
1. **Create Environment** — Sandbox/Production/Developer (Manager → IT)
2. **Premium Connector Access** — e.g. Salesforce, SAP, ServiceNow (Manager → IT)
   - Requires: DLP policy review, data flow description
3. **DLP Policy Exception** — (Manager → Data Owner → IT — highest approval)
   - Risk mitigation plan required
   - Time-limited (30 days to 1 year)
4. **Power Automate License** — Premium per-user or per-flow (Manager)

**AI Agent:** checks DLP policy coverage, connector risk classification, license availability

**Note:** DLP exceptions are reviewed by the AI Agent for compliance risks.`},{keywords:["intune","device retire","wipe device","device management","compliance exception","mdm"],response:`**Intune Device Services**

Portal → Intune Services

**Available requests:**
1. **Retire Device** — removes corporate management, keeps personal data (Manager → IT)
2. **Wipe Device** — full factory reset (IT approval only, irreversible)
   ⚠️ Requires typing CONFIRM — this action cannot be undone
3. **Compliance Exception** — temporary exclusion from compliance policy (Manager → IT)
   - Max 90-day exceptions
   - Compensating controls required
   - AI Agent flags Zero Trust impact

**AI Agent checks for wipe/retire:**
- Verifies device ownership
- Checks for unsynced data
- Confirms user awareness
- Reviews pending Intune actions

**Provisioning:** Microsoft Graph Intune API`},{keywords:["secure score","security posture","security status","secure score trend"],response:`**Secure Score — 64/95 (67.4%)**

🎯 **Your Tenant:** 64 points — **above industry average** (53 pts for similar-sized orgs)

📊 **Trend:**
- This week: +2 points ↗️
- This month: +5 points ↗️
- vs industry: +11 points ahead

**Category breakdown:**
- Identity: 68/100 ⚠️
- Apps: 72/100 ✅
- Data: 61/100 ⚠️
- Devices: 58/100 🔴
- Infrastructure: 54/100 🔴

**Biggest wins:** Enable MFA (+15 pts) · Block legacy auth (+8 pts) · DMARC upgrade (+6 pts) = **+29 potential gain**

Navigate to **Security → Secure Score** to see detailed recommendations.`},{keywords:["critical incident","active incident","ransomware","incident summary"],response:`**Active Security Incidents — 5 Total**

🔴 **Critical (1):**
- INC-2341: Ransomware indicators on MBX-LAPTOP-047 (3h ago)
→ **ACTION:** Isolate device immediately!

🔴 **High Severity (3):**
- INC-2338: BEC (Business Email Compromise) attempt (6h ago)
- INC-2335: Risky sign-in — kevin.osei@contoso.com (14h ago)
- INC-2330: Suspicious auto-forwarding inbox rule (investigating)

🟡 **Medium (1):** Brute force sign-in pattern (2 days ago)

**AI Summary:** Multi-vector attack detected — ransomware + risky identity events + BEC attempt. Isolate endpoint, force password reset, review inbox rules immediately.

→ Navigate to **Security → Incidents** for full details.`},{keywords:["email security","spf dkim dmarc","email protection","phishing"],response:`**Email Security Status**

**Threats blocked (30 days):**
- 1,834 phishing attempts ✅
- 247 malware detections ✅
- 3 BEC (Business Email Compromise) attempts 🔴
- 4,782 messages quarantined ✅

**Authentication records:**
✅ SPF: Passing
✅ DKIM: Enabled
⚠️ DMARC: quarantine (upgrade to reject)
✅ Safe Links: Active
⚠️ Safe Attachments: Partial coverage

**Active risks:**
🔴 2 mailboxes with external forwarding
⚠️ 1 suspicious inbox rule detected

**Top action:** Disable external forwarding, upgrade DMARC to reject.

→ **Security → Email** for detailed mail flow analysis.`},{keywords:["endpoint security","device compliance","vulnerable","patch management"],response:`**Endpoint Security Summary**

📱 **847 managed devices**
- 15 non-compliant
- 8 vulnerable (missing patches)
- 5 missing EDR

**Protection coverage:**
✅ Defender AV: 99.4%
✅ BitLocker: 95.7% (36 devices unencrypted)
⚠️ Tamper Protection: 94.8%

**Active threats:**
🔴 1 ransomware (MBX-LAPTOP-047)
🟡 2 active threats

**Critical actions:**
1. Isolate MBX-LAPTOP-047 (ransomware)
2. Patch 23 devices missing updates
3. Enable BitLocker on 36 devices

→ **Security → Endpoint** for device inventory.`},{keywords:["mfa","multi-factor","passwordless","fido2"],response:`**MFA Adoption — 87% Coverage**

✅ 870 / 1,000 users registered
❌ 130 users without MFA
⏳ **Deadline:** 31 July 2026 (Microsoft enforcement)

**Methods in use:**
| Method | Count | Security |
|---|---|---|
| Microsoft Authenticator | 742 | 🟢 Strong |
| SMS (legacy) | 120 | 🔴 Weak |
| FIDO2 | 5 | 🟢 Phishing-resistant |
| Certificate | 3 | 🟢 Phishing-resistant |

**To reach 100%:** Contact 130 non-enrolled users by 31 July.

**For phishing-resistant:** Migrate 120 SMS users to FIDO2.

→ **Security → Identity** for detailed MFA breakdown.`},{keywords:["recommendation","best practice","security improvement","what to fix"],response:`**Top 5 Security Actions (Prioritized)**

**Critical (do now):**
1. Enable MFA for 130 unregistered users — **+15 pts**
2. Isolate ransomware device (MBX-LAPTOP-047) — **CRITICAL**

**High (this week):**
3. Block legacy authentication via CA — **+8 pts**
4. Upgrade DMARC to reject — **+6 pts**
5. Enable Safe Attachments for all users — **+4 pts**

**Total potential: +56 points** → would bring score to 80+ (excellent)

For all 15 recommendations with effort & API details:
→ Navigate to **Security → Recommendations** tab.`},{keywords:["conditional access","ca policy","risk-based","access control"],response:`**Conditional Access — Policy Overview**

✅ **25 policies enabled**
⚠️ **5 disabled** | ⏳ **3 report-only mode**

**Coverage: 94.6%** of sign-ins protected

**Key active policies:**
- ✅ Require MFA (all cloud apps)
- ✅ Require MFA (privileged admins)
- ✅ Block legacy authentication
- ✅ Require compliant device
- ✅ Risk-based sign-in protection

**⚠️ 18 users explicitly excluded** — review quarterly

**Risk:** 3 report-only policies may mask enforcement gaps

→ **Security → Identity** for detailed policy breakdown.`},{keywords:["message center","change intelligence","mc ","service announcement","message centre"],response:`**Change Intelligence — M365 Message Center**

Navigate to **Change Intelligence** (Admin section) to view:

📬 **20 messages** synced from Graph /admin/serviceAnnouncement/messages
⚠️ **8 require action** — 3 with high severity
🔴 **3 high-priority items** need immediate attention:
- MC892341: Teams legacy auth retirement (deadline 30 Jun)
- MC890234: Entra ID mandatory admin MFA (deadline 15 Jun)
- MC873210: E5 licence capacity critical (only 2 remaining)

**Tabs available:** All Messages | Service Health | Action Required | Upcoming | Copilot | Licenses | Security

**AI Agent features:** AI summary per message, recommended IT tasks, automation assessment, task creation, weekly digest generation.`},{keywords:["service health","incident","outage","service issue","service degradation"],response:`**Service Health — Current Status**

🔴 **Exchange Online:** Email delivery delays (EU West) — fix being deployed
🔴 **Microsoft Teams:** Meeting join failures EMEA — investigating
🟡 **SharePoint Online:** Search indexing delay — advisory
✅ **All other services:** Operational

**Recently resolved (last 48h):**
- Entra ID sign-in latency (US East) — resolved
- M365 Admin Center intermittent errors — resolved

Navigate to **Change Intelligence → Service Health** tab for full details and incident updates.

*Graph API: GET /admin/serviceAnnouncement/issues*`},{keywords:["weekly digest","digest","executive summary","weekly update"],response:`**Generate Weekly Digest**

In **Change Intelligence**, click the **"Weekly digest"** button to generate a formatted summary:

**This week's digest would show:**
- 📊 Total: 20 messages, 8 action required, 3 major changes
- 🆕 5 new messages since last week
- 📅 4 items due within 30 days

**Priority items:**
1. Teams legacy auth — deadline 30 Jun (HIGH)
2. Admin MFA enforcement — deadline 15 Jun (HIGH)
3. E5 licence overage — immediate (HIGH)
4. Exchange basic auth final phase — 15 Jul (HIGH)

The digest can be sent via **Teams**, **email**, or **exported as PDF** directly from the digest panel.`},{keywords:["portal","self service","what can i request","request options","service portal"],response:`**Self-Service Portal — 11 Services Available**

| Service | Key Actions |
|---|---|
| Exchange Online | Groups, mailboxes, room resources, email settings |
| Microsoft Teams | Create teams, channels, guest access |
| SharePoint | Sites, permissions, external sharing |
| OneDrive | Storage, former employee access |
| External Sharing | Guest invites, extend/remove access |
| User Access | Mailbox, Teams, SharePoint, group access |
| License Management | E3/E5, Power BI, Visio, Project |
| Microsoft Copilot | Request/remove Copilot licenses |
| Power Platform | Environments, connectors, DLP exceptions |
| Intune | Device retire, wipe, compliance exceptions |
| Guest Lifecycle | Invite, extend, remove, quarterly review |

**Navigate to Portal** → select a service → choose an action → complete the form → submit.`},{keywords:["workflow","approval workflow","approval process","how long","how does approval"],response:`**Approval & Provisioning Workflow**

All portal requests follow this standardised workflow:

1. **User Request** — you submit the form with required details
2. **Manager Approval** — your direct manager reviews (most requests)
3. **IT Review** — required for security groups, site creation, and high-risk actions
4. **Data Owner Approval** — required for external sharing requests
5. **AI Agent Validation** — automatically checks:
   - Duplicates & conflicts
   - Licensing availability
   - Naming conventions
   - Security policy compliance
   - Suggests alternatives if better options exist
6. **System Provisioning** — Microsoft Graph API / Exchange / SharePoint
7. **Completion Notification** — email sent to you and approvers

**SLAs:** Standard: 24h, Urgent: 4h (mark urgent in justification field)`},{keywords:["ai agent","automation","graph api action","auto provision","automated"],response:`**AI Agent Capabilities**

The M365 AgentOps AI Agent automatically:

✅ **Deduplication** — checks for existing groups, mailboxes, or sites with similar names
✅ **Suggests alternatives** — recommends existing resources instead of creating new ones
✅ **License verification** — confirms availability before assignment
✅ **Provisioning** — executes all requests via Microsoft Graph API or Exchange/SharePoint PowerShell
✅ **Security checks** — validates CA policies, DLP coverage, and guest policies
✅ **Completion notifications** — emails you and your approvers at each stage
✅ **Audit logging** — all actions recorded with timestamps and approver trail

The agent runs in the background — you'll receive email updates at each workflow stage.`},{keywords:["graph","graph api","api"],response:`**Graph API Status**

🟢 **Connection:** Active
📊 **Tenant:** contoso.com
🔑 **App Registration:** M365 AgentOps Agent
⚡ **Rate limit:** 6,000 requests remaining today (10,000/day limit)

**Today's activity:**
- 312 API calls made
- 0 throttled
- Last call: 8 minutes ago

**Endpoints used by the portal:**
- POST /v1.0/groups (group creation)
- POST /v1.0/teams (team creation)
- POST /v1.0/invitations (guest invites)
- POST /v1.0/users/{id}/assignLicense

Full details available in **Graph API** page (super admin only).`}],Ws=`I'm your **M365 AgentOps AI Copilot**. I can help you with:

- 🔧 **Portal requests** — how to request groups, mailboxes, Teams, licenses, and more
- 🔒 **Security** — CIS compliance, Zero Trust, risky users
- 📊 **Tenant status** — licenses, pending approvals, audit events
- 🤖 **AI Agent** — automation workflows and provisioning

Try asking:
- "How do I request a Distribution Group?"
- "What's the Teams guest access workflow?"
- "How do I request a Copilot license?"
- "What are the M365 Config failures?"`;let Te=[],Mt=!1;function _s(){const e=document.getElementById("page-chat");if(!e)return;const t=d.currentUser,i=Pt[t==null?void 0:t.role]||Pt.user;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-message-circle"></i> AI Copilot</div>
        <div class="page-subtitle">Ask about your M365 tenant, services, approvals, and more</div>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;height:calc(100vh - 200px);min-height:400px">
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-suggestions" id="chat-suggestions">
        ${i.map(a=>`<button class="suggestion-pill" data-text="${a}">${a}</button>`).join("")}
      </div>
      <div class="chat-input-area">
        <textarea class="chat-input" id="chat-input" placeholder="Ask about the portal, services, approvals, M365 Config..." rows="1"></textarea>
        <button class="btn btn-primary" id="chat-send"><i class="ti ti-send"></i></button>
      </div>
    </div>
  `;const s=e.querySelector("#chat-messages"),n=e.querySelector("#chat-input");!Mt||Te.length===0?(Te=[],Ze("ai",Ws),Mt=!0):et(s),e.querySelector("#chat-send").addEventListener("click",()=>Be(e)),n.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),Be(e))}),n.addEventListener("input",()=>{n.style.height="auto",n.style.height=Math.min(n.scrollHeight,120)+"px"}),e.querySelectorAll(".suggestion-pill").forEach(a=>{a.addEventListener("click",()=>{n.value=a.dataset.text,Be(e)})})}function Ze(e,t){Te.push({role:e,text:t,ts:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})})}function et(e){e.innerHTML=Te.map(t=>{var n;const i=t.role==="ai",s=Vs(t.text);return`
      <div class="chat-msg ${i?"ai":"user-msg"}">
        ${i?`<div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-teal-text)"></i> M365 Copilot · ${t.ts}</div>`:`<div class="chat-sender" style="justify-content:flex-end">${((n=d.currentUser)==null?void 0:n.name)||"You"} · ${t.ts}</div>`}
        <div class="chat-bubble">${s}</div>
      </div>
    `}).join(""),e.scrollTop=e.scrollHeight}function Vs(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/^#{1,3} (.+)$/gm,'<strong style="font-size:12px">$1</strong>').replace(/\|(.+)\|\n\|[-| ]+\|\n/g,t=>`<table style="width:100%;border-collapse:collapse;font-size:11px;margin:6px 0"><thead><tr>${t.split(`
`)[0].split("|").filter(s=>s.trim()).map(s=>`<th style="padding:4px 8px;font-size:10px">${s.trim()}</th>`).join("")}</tr></thead><tbody>`).replace(/\|(.+)\|(?!\n\|[-|])/g,t=>`<tr>${t.split("|").filter(s=>s.trim()).map(s=>`<td style="padding:3px 8px;border-top:1px solid var(--color-border-tertiary)">${s.trim()}</td>`).join("")}</tr>`).replace(/<\/tbody>(?![\s\S]*<\/tbody>)/g,"</tbody></table>").replace(/\n/g,"<br>").replace(/❌/g,'<span style="color:var(--clr-danger-text)">❌</span>').replace(/✅/g,'<span style="color:var(--clr-success-text)">✅</span>').replace(/⚠️/g,'<span style="color:var(--clr-warning-text)">⚠️</span>').replace(/🟢/g,'<span style="color:var(--clr-success-text)">●</span>')}function Be(e){const t=e.querySelector("#chat-input"),i=t.value.trim();if(!i)return;Ze("user",i),t.value="",t.style.height="auto";const s=e.querySelector("#chat-messages");et(s),setTimeout(()=>{const n=i.toLowerCase(),a=Hs.find(o=>o.keywords.some(c=>n.includes(c))),r=(a==null?void 0:a.response)||Js(n);Ze("ai",r),et(s)},500)}function Js(e){return e.includes("help")||e.includes("what")||e.includes("how")?`I'm here to help! I can answer questions about:

- **Portal requests** (groups, mailboxes, Teams, SharePoint, licenses, guests)
- **Approval workflows** and SLAs
- **AI Agent** automation and Graph API provisioning
- **M365 Config** CIS benchmark results
- **Security** posture, Zero Trust, risky users

Try a more specific question, e.g. "How do I create a Teams channel?" or "What's the approval process for a Copilot license?"`:`I searched the knowledge base for **"${e}"** but didn't find a specific answer. Here are some things I can help with:

- Portal service requests (11 services available)
- Approval workflows and provisioning steps
- CIS benchmark compliance status
- License availability and requests
- Guest access policies

Try rephrasing your question or ask about a specific service name.`}function Ks(){var t,i,s,n,a,r;const e=document.getElementById("page-graphapi");if(e){if(((t=d.currentUser)==null?void 0:t.role)!=="super"){e.innerHTML=`
      <div class="page-header"><div class="page-title"><i class="ti ti-api"></i> Graph API</div></div>
      <div class="locked-banner">
        <i class="ti ti-lock"></i>
        <h3>Super Admin access required</h3>
        <p>The Graph API configuration page is restricted to Super Admin role. Contact your administrator to request elevated access.</p>
      </div>
    `;return}e.innerHTML=`
    <div class="page-header">
      <div class="page-title"><i class="ti ti-api"></i> Graph API Configuration</div>
      <div class="page-subtitle">Microsoft Graph API connection and permissions</div>
    </div>

    <div class="alert-banner success mb-3">
      <i class="ti ti-circle-check"></i>
      <strong>Connected</strong> — Graph API connection is active. Last token refresh: 14 min ago.
      <span class="badge success" style="margin-left:auto">Live</span>
    </div>

    <div class="tabs" id="graph-tabs">
      <button class="tab-btn active" data-tab="reg">App Registration</button>
      <button class="tab-btn" data-tab="perms">Permissions</button>
      <button class="tab-btn" data-tab="endpoints">Endpoints</button>
      <button class="tab-btn" data-tab="throttle">Throttling</button>
      <button class="tab-btn" data-tab="logs">Logs</button>
    </div>

    <div class="tab-panel active" id="graph-tab-reg">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-apps"></i> App Registration</div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Client ID</label>
            <div style="display:flex;gap:6px">
              <input type="text" class="form-input monospace" value="a1b2c3d4-e5f6-7890-abcd-ef1234567890" readonly>
              <button class="btn btn-icon copy-val" data-val="a1b2c3d4-e5f6-7890-abcd-ef1234567890"><i class="ti ti-copy"></i></button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tenant ID</label>
            <div style="display:flex;gap:6px">
              <input type="text" class="form-input monospace" value="9f8e7d6c-5b4a-3210-fedc-ba9876543210" readonly>
              <button class="btn btn-icon copy-val" data-val="9f8e7d6c-5b4a-3210-fedc-ba9876543210"><i class="ti ti-copy"></i></button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Client Secret</label>
            <div style="display:flex;gap:6px">
              <input type="password" class="form-input monospace" id="graph-secret" value="•••••••••••••••••••••••••••••">
              <button class="btn btn-icon" id="graph-secret-toggle"><i class="ti ti-eye"></i></button>
            </div>
            <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
              <span class="badge warning"><i class="ti ti-clock"></i> Expires in 47 days</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Redirect URI</label>
            <input type="text" class="form-input monospace" value="https://m365agentops.contoso.com/auth/callback" readonly>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary" id="graph-save"><i class="ti ti-device-floppy"></i> Save</button>
          <button class="btn" id="graph-refresh-token"><i class="ti ti-refresh"></i> Refresh token</button>
        </div>
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-perms">
      <div class="card mb-3">
        <div class="card-title mb-3">Application Permissions</div>
        <table>
          <thead><tr><th style="width:35%">Permission</th><th style="width:45%">Description</th><th style="width:20%">Enabled</th></tr></thead>
          <tbody>
            ${[["User.Read.All","Read all users"],["Group.ReadWrite.All","Read and write all groups"],["Mail.ReadWrite","Read and write all mailboxes"],["Directory.Read.All","Read directory data"],["AuditLog.Read.All","Read audit log data"],["Policy.Read.All","Read all policies"],["DeviceManagementConfiguration.Read.All","Read Intune device configuration"]].map(([o,c])=>`
              <tr>
                <td class="monospace" style="font-size:10px">${o}</td>
                <td style="font-size:11px;color:var(--color-text-secondary)">${c}</td>
                <td>
                  <label class="toggle-switch">
                    <input type="checkbox" checked>
                    <span class="toggle-track"></span>
                  </label>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <button class="btn btn-primary mt-3" id="graph-grant-consent"><i class="ti ti-shield-check"></i> Grant admin consent</button>
      </div>
      <div class="card">
        <div class="card-title mb-3">Delegated Permissions</div>
        <table>
          <thead><tr><th style="width:35%">Permission</th><th style="width:45%">Description</th><th style="width:20%">Enabled</th></tr></thead>
          <tbody>
            ${[["User.Read","Read signed-in user profile"],["openid","OpenID Connect sign-in"],["offline_access","Maintain access offline"]].map(([o,c])=>`
              <tr>
                <td class="monospace" style="font-size:10px">${o}</td>
                <td style="font-size:11px;color:var(--color-text-secondary)">${c}</td>
                <td>
                  <label class="toggle-switch">
                    <input type="checkbox" checked>
                    <span class="toggle-track"></span>
                  </label>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-endpoints">
      <div class="card">
        <div class="card-title mb-3">Graph API Endpoints</div>
        ${[{section:"Groups",endpoints:[{method:"GET",path:"/v1.0/groups",desc:"List all groups"},{method:"POST",path:"/v1.0/groups",desc:"Create a new group"},{method:"PATCH",path:"/v1.0/groups/{id}",desc:"Update group properties"}]},{section:"Mailbox",endpoints:[{method:"GET",path:"/v1.0/users/{id}/mailboxSettings",desc:"Get mailbox settings"},{method:"POST",path:"/v1.0/users/{id}/sendMail",desc:"Send a message"}]},{section:"Identity",endpoints:[{method:"GET",path:"/v1.0/users",desc:"List all users"},{method:"GET",path:"/v1.0/identity/conditionalAccess/policies",desc:"List CA policies"}]}].map(o=>`
          <div class="section-heading">${o.section}</div>
          ${o.endpoints.map(c=>`
            <div class="graph-endpoint-row">
              <span class="method-badge ${c.method}">${c.method}</span>
              <span class="graph-path">${c.path}</span>
              <span style="flex:1;font-size:10px;color:var(--color-text-secondary)">${c.desc}</span>
              <div class="status-dot active" title="Online"></div>
            </div>
          `).join("")}
        `).join("")}
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-throttle">
      <div class="card">
        <div class="card-title mb-3">Throttling Configuration</div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Max retries</label>
            <input type="number" class="form-input" value="3" min="1" max="10">
          </div>
          <div class="form-group">
            <label class="form-label">Backoff interval (ms)</label>
            <input type="number" class="form-input" value="1000" min="500">
          </div>
          <div class="form-group">
            <label class="form-label">Retry strategy</label>
            <select class="form-select"><option>Exponential backoff</option><option>Linear backoff</option><option>Fixed interval</option></select>
          </div>
          <div class="form-group">
            <label class="form-label">Concurrent requests</label>
            <input type="number" class="form-input" value="4" min="1" max="20">
          </div>
        </div>
        <button class="btn btn-primary" id="throttle-save"><i class="ti ti-device-floppy"></i> Save throttling config</button>
      </div>
    </div>

    <div class="tab-panel" id="graph-tab-logs">
      <div class="card" style="padding:0;overflow:hidden">
        <table>
          <thead><tr>
            <th style="width:10%">Status</th>
            <th style="width:8%">Method</th>
            <th style="width:40%">Endpoint</th>
            <th style="width:25%">Description</th>
            <th style="width:17%">Time</th>
          </tr></thead>
          <tbody>
            ${[{status:200,method:"GET",path:"/v1.0/groups",desc:"List groups",time:"08:47:12"},{status:201,method:"POST",path:"/v1.0/groups",desc:"Create group: marketing-emea",time:"08:45:58"},{status:200,method:"GET",path:"/v1.0/users",desc:"List users (all)",time:"08:45:03"},{status:429,method:"GET",path:"/v1.0/auditLogs/signIns",desc:"Throttled — retrying",time:"08:44:21"}].map(o=>`
              <tr>
                <td><span class="badge ${o.status>=400?"danger":o.status>=200&&o.status<300?"success":"warning"}">${o.status}</span></td>
                <td class="monospace" style="font-size:10px">${o.method}</td>
                <td class="graph-path">${o.path}</td>
                <td style="font-size:10px;color:var(--color-text-secondary)">${o.desc}</td>
                <td class="monospace" style="font-size:10px">${o.time}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelectorAll("#graph-tabs .tab-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll("#graph-tabs .tab-btn").forEach(c=>c.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(c=>c.classList.remove("active")),o.classList.add("active"),e.querySelector(`#graph-tab-${o.dataset.tab}`).classList.add("active")})}),e.querySelectorAll(".copy-val").forEach(o=>{o.addEventListener("click",()=>{navigator.clipboard.writeText(o.dataset.val),p("Copied to clipboard.","success")})}),(i=e.querySelector("#graph-secret-toggle"))==null||i.addEventListener("click",()=>{const o=e.querySelector("#graph-secret");o.type=o.type==="password"?"text":"password"}),(s=e.querySelector("#graph-save"))==null||s.addEventListener("click",()=>p("Configuration saved.","success")),(n=e.querySelector("#graph-refresh-token"))==null||n.addEventListener("click",()=>p("Token refreshed successfully.","success")),(a=e.querySelector("#graph-grant-consent"))==null||a.addEventListener("click",()=>p("Admin consent granted for all permissions.","success")),(r=e.querySelector("#throttle-save"))==null||r.addEventListener("click",()=>p("Throttling configuration saved.","success"))}}function Ys(){var t,i,s;const e=document.getElementById("page-sso");if(e){if(((t=d.currentUser)==null?void 0:t.role)!=="super"){e.innerHTML=`
      <div class="page-header"><div class="page-title"><i class="ti ti-key"></i> SSO / Entra ID</div></div>
      <div class="locked-banner">
        <i class="ti ti-lock"></i>
        <h3>Super Admin access required</h3>
        <p>SSO configuration is restricted to Super Admin role only.</p>
      </div>
    `;return}e.innerHTML=`
    <div class="page-header">
      <div class="page-title"><i class="ti ti-key"></i> SSO / Entra ID Configuration</div>
      <div class="page-subtitle">Single Sign-On integration with Microsoft Entra ID</div>
    </div>

    <div class="grid-2" style="gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-shield-check"></i> SSO Status</span>
          <span class="badge success dot">Active</span>
        </div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:11px;margin-bottom:14px">
          <span style="color:var(--color-text-tertiary)">Protocol</span><span>OpenID Connect / OAuth 2.0</span>
          <span style="color:var(--color-text-tertiary)">Role source</span><span>Entra ID group membership</span>
          <span style="color:var(--color-text-tertiary)">Managed users</span><span>1,000</span>
        </div>
        <div class="form-group">
          <label class="form-label">Client ID</label>
          <div style="display:flex;gap:6px">
            <input type="text" class="form-input monospace" value="a1b2c3d4-e5f6-7890-abcd-ef1234567890" readonly>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Redirect URI</label>
          <input type="text" class="form-input" value="https://m365agentops.contoso.com/auth/callback">
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary" id="sso-save"><i class="ti ti-device-floppy"></i> Save</button>
          <button class="btn" id="sso-test"><i class="ti ti-player-play"></i> Test SSO</button>
        </div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-users"></i> Role Assignments</div>
        <table>
          <thead><tr><th style="width:30%">Role</th><th style="width:50%">Assignment</th><th style="width:20%">Users</th></tr></thead>
          <tbody>
            <tr>
              <td><span class="role-badge user">user</span></td>
              <td style="font-size:10px">Default — all authenticated Entra ID users</td>
              <td>850+</td>
            </tr>
            <tr>
              <td><span class="role-badge manager">manager</span></td>
              <td style="font-size:10px">M365AgentOps-Managers Entra group</td>
              <td>24</td>
            </tr>
            <tr>
              <td><span class="role-badge admin">admin</span></td>
              <td style="font-size:10px">M365AgentOps-Admins Entra group</td>
              <td>8</td>
            </tr>
            <tr>
              <td><span class="role-badge super">super</span></td>
              <td style="font-size:10px">M365AgentOps-SuperAdmins Entra group</td>
              <td>2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-title mb-3"><i class="ti ti-list-numbers"></i> SSO Setup Guide</div>
      ${["Register application in Entra ID → App Registrations → New registration","Set redirect URI to your M365 AgentOps deployment URL + /auth/callback","Add required API permissions: User.Read, openid, profile, email","Create security groups in Entra ID for each application role","Configure group claims in token configuration to include group membership","Copy the Client ID and Tenant ID to M365 AgentOps Graph API settings","Test SSO flow with a test user from each role group"].map((n,a)=>`
        <div class="sso-step">
          <div class="sso-step-num">${a+1}</div>
          <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.5">${n}</div>
        </div>
      `).join("")}
    </div>
  `,(i=e.querySelector("#sso-save"))==null||i.addEventListener("click",()=>p("SSO configuration saved.","success")),(s=e.querySelector("#sso-test"))==null||s.addEventListener("click",()=>{p("SSO test initiated — check your browser for the Entra ID sign-in prompt.","info")})}}function Qs(){const e=document.getElementById("page-audit");if(!e)return;const t=[{time:"Today 08:47",event:"Config Agent scan completed",user:"M365 Config Agent",category:"Compliance",severity:"info",sevCls:"info"},{time:"Today 08:15",event:"High-risk sign-in detected",user:"kevin.osei@contoso.com",category:"Security",severity:"high",sevCls:"danger"},{time:"Yesterday 16:30",event:"Access request approved (REQ-005)",user:"Sanjay Kumar",category:"Access",severity:"low",sevCls:"success"},{time:"Yesterday 14:12",event:"PIM role activated — Compliance Admin",user:"sam.torres@contoso.com",category:"Identity",severity:"medium",sevCls:"warning"}];e.innerHTML=`
    <div class="page-header">
      <div class="page-title"><i class="ti ti-database"></i> Audit Log</div>
      <div class="page-subtitle">Administrative and security event audit trail</div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">248</div><div class="kpi-label">Events today</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">3</div><div class="kpi-label">High severity</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">14</div><div class="kpi-label">Medium severity</div></div>
    </div>

    <div class="filter-bar mb-3">
      <input type="text" class="form-input search" placeholder="Search events...">
      <select class="form-select"><option>All categories</option><option>Security</option><option>Compliance</option><option>Identity</option><option>Access</option></select>
      <select class="form-select"><option>All severity</option><option>High</option><option>Medium</option><option>Low</option></select>
      <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:15%">Time</th>
          <th style="width:35%">Event</th>
          <th style="width:20%">User</th>
          <th style="width:15%">Category</th>
          <th style="width:15%">Severity</th>
        </tr></thead>
        <tbody>
          ${t.map(i=>`
            <tr>
              <td class="monospace" style="font-size:10px">${i.time}</td>
              <td style="font-size:11px">${i.event}</td>
              <td class="monospace" style="font-size:10px">${i.user}</td>
              <td><span class="badge neutral">${i.category}</span></td>
              <td><span class="badge ${i.sevCls}" style="text-transform:capitalize">${i.severity}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function R({id:e,checked:t,label:i,sublabel:s,onChange:n}){const a=document.createElement("div");a.className="toggle-wrap",a.innerHTML=`
    <label class="toggle-switch">
      <input type="checkbox" id="${e}" ${t?"checked":""}>
      <span class="toggle-track"></span>
    </label>
    <label for="${e}" class="toggle-label">
      ${i}
      ${s?`<div class="toggle-sublabel">${s}</div>`:""}
    </label>
  `;const r=a.querySelector("input");return r.addEventListener("change",()=>n(r.checked)),a}function Xs(){const e=document.getElementById("page-settings");e&&li(e)}function li(e){const t=d.settings;e.innerHTML=`
    <div class="page-header">
      <div class="page-title"><i class="ti ti-adjustments-horizontal"></i> Admin Settings</div>
      <div class="page-subtitle">Configure application display, agent behaviour, and self-service portal</div>
    </div>

    <!-- M365 Config display preferences -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-settings-2"></i> M365 Config — Display Preferences</div>
      <div id="settings-ps-wrap" style="margin-bottom:14px"></div>
      <div id="settings-result-wrap" style="margin-bottom:14px"></div>
      <div id="settings-expand-wrap" style="margin-bottom:4px"></div>
    </div>

    <!-- Config Agent -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-robot"></i> Config Agent</div>
      <div class="form-group">
        <label class="form-label">Scan frequency</label>
        <select class="form-select" id="settings-schedule">
          <option value="daily-0800" ${t.agentSchedule==="daily-0800"?"selected":""}>Daily at 08:00</option>
          <option value="every-6h" ${t.agentSchedule==="every-6h"?"selected":""}>Every 6 hours</option>
          <option value="weekly" ${t.agentSchedule==="weekly"?"selected":""}>Weekly</option>
        </select>
      </div>
      <div id="settings-alert-fail-wrap" style="margin-bottom:10px"></div>
      <div class="form-group">
        <label class="form-label">Alert email</label>
        <input type="email" class="form-input" id="settings-alert-email" value="${t.agentAlertEmail}">
      </div>
    </div>

    <!-- Platform display -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-layout-dashboard"></i> Platform Display</div>
      <div id="settings-graph-health-wrap" style="margin-bottom:14px"></div>
      <div id="settings-zt-score-wrap" style="margin-bottom:14px"></div>
      <div id="settings-cfg-score-wrap" style="margin-bottom:4px"></div>
    </div>

    <!-- Self-Service Portal Management -->
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-grid-dots"></i> Self-Service Portal Management</span>
        <span class="badge info">11 services</span>
      </div>

      <div class="alert-banner info mb-3" style="margin-top:8px">
        <i class="ti ti-info-circle"></i>
        Enable or disable the portal entirely, or toggle individual services and Exchange sub-services.
        Disabled services show as unavailable to end users.
      </div>

      <!-- Master toggle -->
      <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:16px">
        <div id="settings-portal-master-wrap"></div>
      </div>

      <div id="portal-services-section">
        <!-- Main services -->
        <div class="section-heading" style="margin-bottom:8px">Service Availability</div>
        <div class="portal-svc-settings-grid" id="portal-main-toggles"></div>

        <!-- Exchange sub-services -->
        <div class="section-heading" style="margin-top:16px;margin-bottom:8px">
          Exchange Online — Sub-Services
          <span style="font-size:10px;color:var(--color-text-tertiary);text-transform:none;letter-spacing:0;font-weight:400;margin-left:6px">
            Only applies when Exchange Online is enabled above
          </span>
        </div>
        <div class="portal-svc-settings-grid" id="portal-exchange-toggles"></div>
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button class="btn btn-primary" id="settings-save"><i class="ti ti-device-floppy"></i> Save settings</button>
      <button class="btn btn-danger" id="settings-reset"><i class="ti ti-rotate"></i> Reset to defaults</button>
    </div>
  `;const i=R({id:"toggle-ps",checked:t.showPSCommands,label:"Show PowerShell validation commands",sublabel:"Displays the PowerShell command used for each control in the M365 Config topic view.",onChange:v=>{d.settings.showPSCommands=v,m(),Ue()}});e.querySelector("#settings-ps-wrap").appendChild(i);const s=R({id:"toggle-result",checked:t.showTenantResult,label:"Show simulated tenant result",sublabel:"Displays the simulated tenant scan result for each control.",onChange:v=>{d.settings.showTenantResult=v,m(),Ue()}});e.querySelector("#settings-result-wrap").appendChild(s);const n=R({id:"toggle-expand",checked:t.autoExpandFailed,label:"Auto-expand failed controls",sublabel:"Automatically opens the details panel for failed controls on topic load.",onChange:v=>{d.settings.autoExpandFailed=v,m()}});e.querySelector("#settings-expand-wrap").appendChild(n);const a=R({id:"toggle-alert-fail",checked:t.agentAlertOnFail,label:"Alert on new failures",sublabel:"Send email notification when agent detects new failed controls.",onChange:v=>{d.settings.agentAlertOnFail=v,m()}});e.querySelector("#settings-alert-fail-wrap").appendChild(a);const r=R({id:"toggle-graph-health",checked:t.showGraphHealth,label:"Show Graph API health on dashboard",onChange:v=>{d.settings.showGraphHealth=v,m()}});e.querySelector("#settings-graph-health-wrap").appendChild(r);const o=R({id:"toggle-zt-score",checked:t.showZeroTrustScore,label:"Show Zero Trust score on dashboard",onChange:v=>{d.settings.showZeroTrustScore=v,m()}});e.querySelector("#settings-zt-score-wrap").appendChild(o);const c=R({id:"toggle-cfg-score",checked:t.showM365ConfigScore,label:"Show M365 Config score on dashboard",onChange:v=>{d.settings.showM365ConfigScore=v,m()}});e.querySelector("#settings-cfg-score-wrap").appendChild(c);const l=R({id:"toggle-portal-master",checked:t.portalEnabled!==!1,label:"Self-Service Portal — Master Switch",sublabel:"Disable to prevent all users from accessing the portal globally.",onChange:v=>{d.settings.portalEnabled=v,m();const w=e.querySelector("#portal-services-section");w&&(w.style.opacity=v?"1":"0.4"),p(v?"Self-Service Portal enabled.":"Self-Service Portal disabled globally.",v?"success":"warning")}});e.querySelector("#settings-portal-master-wrap").appendChild(l);const u=e.querySelector("#portal-services-section");u&&(u.style.opacity=t.portalEnabled!==!1?"1":"0.4");const y=e.querySelector("#portal-main-toggles");Ie.forEach(v=>{const w="portal_"+v.id.replace(/-/g,"_"),q=document.createElement("div");q.className="portal-svc-setting-row",q.innerHTML=`
      <div class="psc-icon" style="background:${v.bg};color:${v.color};width:28px;height:28px;font-size:13px;border-radius:6px;flex-shrink:0">
        <i class="ti ${v.icon}"></i>
      </div>
      <span style="flex:1;font-size:11px;font-weight:500">${v.name}</span>
      <div id="portal-toggle-${w}"></div>
    `,y.appendChild(q);const Ne=R({id:`chk-${w}`,checked:t[w]!==!1,label:"",onChange:Oe=>{d.settings[w]=Oe,m()}});q.querySelector(`#portal-toggle-${w}`).appendChild(Ne)});const re=e.querySelector("#portal-exchange-toggles"),W={"exchange-groups":"portal_exchange_groups","shared-mailbox":"portal_shared_mailbox","room-equipment":"portal_room_equipment","email-services":"portal_email_services"};se.forEach(v=>{const w=W[v.id],q=document.createElement("div");q.className="portal-svc-setting-row",q.innerHTML=`
      <i class="ti ${v.icon}" style="color:var(--color-text-secondary)"></i>
      <span style="flex:1;font-size:11px;font-weight:500">${v.name}</span>
      <div id="portal-toggle-${w}"></div>
    `,re.appendChild(q);const Ne=R({id:`chk-${w}`,checked:t[w]!==!1,label:"",onChange:Oe=>{d.settings[w]=Oe,m()}});q.querySelector(`#portal-toggle-${w}`).appendChild(Ne)}),e.querySelector("#settings-save").addEventListener("click",()=>{d.settings.agentSchedule=e.querySelector("#settings-schedule").value,d.settings.agentAlertEmail=e.querySelector("#settings-alert-email").value,m(),p("Settings saved successfully.","success")}),e.querySelector("#settings-reset").addEventListener("click",()=>{mi(),li(e),p("Settings reset to defaults.","info"),Ue()})}function xe(){return d.mcMessages||(d.mcMessages=S.map(e=>({id:e.id,status:e.status,tasksCreated:!1}))),d.mcMessages}function N(e){var t;return((t=xe().find(i=>i.id===e))==null?void 0:t.status)||"new"}function Rt(e,t){const i=xe().find(s=>s.id===e);i?i.status=t:xe().push({id:e,status:t,tasksCreated:!1}),m()}function ci(e){var t;return((t=xe().find(i=>i.id===e))==null?void 0:t.tasksCreated)||!1}function di(e){const t=xe().find(i=>i.id===e);t&&(t.tasksCreated=!0),m()}let U="all",g={search:"",service:"all",category:"all",actionRequired:"all",status:"all"},Z=new Set,_=!1;const Zs=[{id:"all",label:"All Messages",icon:"ti-inbox"},{id:"health",label:"Service Health",icon:"ti-heartbeat"},{id:"required",label:"Action Required",icon:"ti-alert-circle",badgeKey:"actionRequired"},{id:"upcoming",label:"Upcoming Changes",icon:"ti-calendar-event"},{id:"copilot",label:"Copilot",icon:"ti-sparkles"},{id:"licenses",label:"License Alerts",icon:"ti-license"},{id:"security",label:"Security",icon:"ti-shield-exclamation"}],ea=["All Services","Exchange Online","Microsoft Teams","SharePoint Online","OneDrive","Microsoft Entra ID","Microsoft Intune","Microsoft Copilot","Power Platform","Microsoft Defender","Microsoft 365"],ta=[{val:"all",label:"All Categories"},{val:"planForChange",label:"Plan for Change"},{val:"preventOrFixIssue",label:"Prevent or Fix Issue"},{val:"stayInformed",label:"Stay Informed"}];function ia(){const e=document.getElementById("page-msgcenter");e&&(Z=new Set,_=!1,pe(e))}function pe(e){var n;const t=S.filter(a=>a.actionRequired&&N(a.id)!=="actioned").length,i=S.filter(a=>N(a.id)==="new").length,s=O.filter(a=>a.status!=="resolved").length;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
        <div class="page-subtitle">
          Graph: /admin/serviceAnnouncement/messages · Last sync: Today at 08:45 · ${S.length} messages
        </div>
      </div>
      <div class="page-actions">
        <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync now</button>
        <button class="btn" id="mc-digest"><i class="ti ti-file-text"></i> Weekly digest</button>
        <button class="btn btn-primary" id="mc-create-tasks"><i class="ti ti-circle-plus"></i> Create tasks (${t})</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${S.length}</div>
        <div class="kpi-label">Total Messages</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${t}</div>
        <div class="kpi-label">Action Required</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${S.filter(a=>a.severity==="high").length}</div>
        <div class="kpi-label">High Severity</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${S.filter(a=>a.targetRelease).length}</div>
        <div class="kpi-label">Upcoming Changes</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${s>0?"danger":"success"}">${s>0?s:"✓"}</div>
        <div class="kpi-label">Active Incidents</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${S.filter(a=>N(a.id)==="actioned").length}</div>
        <div class="kpi-label">Actioned</div>
      </div>
    </div>

    <!-- Graph API source banner -->
    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Graph API</strong> · GET /admin/serviceAnnouncement/messages</span>
      <span style="margin-left:8px">|</span>
      <span>GET /admin/serviceAnnouncement/issues</span>
      <span style="margin-left:auto" class="badge success">Connected · 20 messages · 5 health events</span>
    </div>

    <!-- Tabs -->
    <div class="tabs mc-tabs" id="mc-tabs">
      ${Zs.map(a=>{let r="";return a.id==="required"&&(r=`<span class="nav-badge red" style="margin-left:5px">${t}</span>`),a.id==="health"&&(r=s>0?`<span class="nav-badge red" style="margin-left:5px">${s}</span>`:'<span class="nav-badge green" style="margin-left:5px">All clear</span>'),a.id==="all"&&i>0&&(r=`<span class="nav-badge blue" style="margin-left:5px">${i} new</span>`),`<button class="tab-btn ${U===a.id?"active":""}" data-tab="${a.id}">
          <i class="ti ${a.icon}" style="margin-right:4px"></i>${a.label}${r}
        </button>`}).join("")}
    </div>

    <!-- Content area -->
    <div id="mc-content"></div>

    <!-- Digest overlay -->
    ${_?la():""}
  `,e.querySelectorAll("#mc-tabs .tab-btn").forEach(a=>{a.addEventListener("click",()=>{U=a.dataset.tab,Z=new Set,pe(e)})}),e.querySelector("#mc-sync").addEventListener("click",()=>ca(e)),e.querySelector("#mc-digest").addEventListener("click",()=>{_=!_,pe(e)}),e.querySelector("#mc-create-tasks").addEventListener("click",()=>{S.filter(r=>r.actionRequired&&N(r.id)!=="actioned").forEach(r=>{ci(r.id)||di(r.id)}),p(`${t} task groups created from action-required messages.`,"success")}),U==="health"?oa(e):B(e),_&&((n=e.querySelector("#mc-digest-close"))==null||n.addEventListener("click",()=>{_=!1,pe(e)}))}function sa(){let e=[...S];if(U==="required"&&(e=e.filter(t=>t.actionRequired&&N(t.id)!=="actioned")),U==="upcoming"&&(e=e.filter(t=>t.targetRelease)),U==="copilot"&&(e=e.filter(t=>t.service==="Microsoft Copilot"||t.tags.some(i=>i.toLowerCase().includes("copilot")||i.toLowerCase().includes("ai")))),U==="licenses"&&(e=e.filter(t=>t.tags.some(i=>i.toLowerCase().includes("licens")))),U==="security"&&(e=e.filter(t=>t.tags.some(i=>["security","mfa","authentication","defender","conditional access","zero trust"].includes(i.toLowerCase())))),g.search){const t=g.search.toLowerCase();e=e.filter(i=>i.id.toLowerCase().includes(t)||i.title.toLowerCase().includes(t)||i.aiSummary.toLowerCase().includes(t))}return g.service!=="all"&&(e=e.filter(t=>t.service===g.service)),g.category!=="all"&&(e=e.filter(t=>t.category===g.category)),g.actionRequired==="yes"&&(e=e.filter(t=>t.actionRequired)),g.actionRequired==="no"&&(e=e.filter(t=>!t.actionRequired)),g.status!=="all"&&(e=e.filter(t=>N(t.id)===g.status)),e}function B(e){const t=e.querySelector("#mc-content");if(!t)return;const i=sa();t.innerHTML=`
    <!-- Filter bar -->
    <div class="filter-bar mc-filter-bar">
      <input type="text" class="form-input search" id="mc-search" placeholder="Search message ID, title, summary..." value="${g.search}" style="min-width:220px">
      <select class="form-select" id="mc-svc-filter">
        ${ea.map(s=>`<option value="${s==="All Services"?"all":s}" ${g.service===(s==="All Services"?"all":s)?"selected":""}>${s}</option>`).join("")}
      </select>
      <select class="form-select" id="mc-cat-filter">
        ${ta.map(s=>`<option value="${s.val}" ${g.category===s.val?"selected":""}>${s.label}</option>`).join("")}
      </select>
      <select class="form-select" id="mc-req-filter" style="min-width:140px">
        <option value="all" ${g.actionRequired==="all"?"selected":""}>All Messages</option>
        <option value="yes" ${g.actionRequired==="yes"?"selected":""}>Action Required</option>
        <option value="no" ${g.actionRequired==="no"?"selected":""}>No Action Needed</option>
      </select>
      <select class="form-select" id="mc-status-filter">
        <option value="all" ${g.status==="all"?"selected":""}>All Status</option>
        <option value="new" ${g.status==="new"?"selected":""}>New</option>
        <option value="read" ${g.status==="read"?"selected":""}>Read</option>
        <option value="actioned" ${g.status==="actioned"?"selected":""}>Actioned</option>
        <option value="dismissed" ${g.status==="dismissed"?"selected":""}>Dismissed</option>
      </select>
    </div>

    <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:10px">
      Showing ${i.length} of ${S.length} messages
    </div>

    <div id="mc-msg-list">
      ${i.length===0?'<div class="empty-state"><i class="ti ti-inbox-off" style="font-size:32px;margin-bottom:8px"></i><p>No messages match your filters.</p></div>':i.map(s=>aa(s)).join("")}
    </div>
  `,t.querySelector("#mc-search").addEventListener("input",s=>{g.search=s.target.value,B(e)}),t.querySelector("#mc-svc-filter").addEventListener("change",s=>{g.service=s.target.value,B(e)}),t.querySelector("#mc-cat-filter").addEventListener("change",s=>{g.category=s.target.value,B(e)}),t.querySelector("#mc-req-filter").addEventListener("change",s=>{g.actionRequired=s.target.value,B(e)}),t.querySelector("#mc-status-filter").addEventListener("change",s=>{g.status=s.target.value,B(e)}),ra(t,e)}function aa(e){const t=C[e.service]||{icon:"ti-apps",color:"#185FA5",bg:"#E6F1FB"},i=N(e.id),s=Z.has(e.id),n=ci(e.id),a={high:'<span class="badge danger">High</span>',medium:'<span class="badge warning">Medium</span>',low:'<span class="badge neutral">Low</span>'}[e.severity]||"",r={planForChange:'<span class="badge info">Plan for Change</span>',preventOrFixIssue:'<span class="badge danger">Prevent / Fix Issue</span>',stayInformed:'<span class="badge neutral">Stay Informed</span>'}[e.category]||"",o={new:'<span class="mc-status-dot new"></span>',read:"",actioned:'<span class="badge success" style="font-size:9px">✓ Actioned</span>',dismissed:'<span class="badge neutral" style="font-size:9px">Dismissed</span>'}[i]||"";return`
    <div class="mc-card ${i}" data-id="${e.id}">
      <!-- Card header row -->
      <div class="mc-card-header">
        <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">
          ${o}
          <span class="monospace" style="font-size:10px;color:var(--color-text-tertiary);flex-shrink:0">${e.id}</span>
          <div class="mc-svc-chip" style="background:${t.bg};color:${t.color}">
            <i class="ti ${t.icon}"></i> ${e.service}
          </div>
          <span style="font-size:10px;color:var(--color-text-tertiary);flex-shrink:0">Published ${e.publishedDate}</span>
        </div>
        <div style="display:flex;gap:4px;align-items:center;flex-shrink:0">
          ${a}
          ${e.actionRequired?'<span class="badge danger"><i class="ti ti-alert-circle"></i> Action Required</span>':""}
        </div>
      </div>

      <!-- Title -->
      <div class="mc-card-title">${e.title}</div>

      <!-- Meta row -->
      <div class="mc-meta-row">
        ${r}
        ${e.targetRelease?`<span style="font-size:10px;color:var(--color-text-secondary)"><i class="ti ti-calendar" style="font-size:10px"></i> Target: <strong>${e.targetRelease}</strong></span>`:""}
        ${e.actionByDate?`<span style="font-size:10px;color:${e.severity==="high"?"var(--clr-danger-text)":"var(--clr-warning-text)"}"><i class="ti ti-clock" style="font-size:10px"></i> Act by: <strong>${e.actionByDate}</strong></span>`:""}
        <div style="margin-left:auto;display:flex;gap:4px;flex-wrap:wrap">
          ${e.tags.map(c=>`<span class="pill">${c}</span>`).join("")}
        </div>
      </div>

      <!-- AI Summary -->
      <div class="mc-ai-summary">
        <div class="mc-ai-label"><i class="ti ti-robot"></i> AI Summary</div>
        <div class="mc-ai-text">${e.aiSummary}</div>
      </div>

      <!-- Action bar -->
      <div class="mc-action-bar">
        <button class="btn btn-xs mc-expand-rec" data-id="${e.id}">
          <i class="ti ti-brain"></i> AI Recommendations ${s?'<i class="ti ti-chevron-up"></i>':'<i class="ti ti-chevron-down"></i>'}
        </button>
        <div style="margin-left:auto;display:flex;gap:5px">
          ${i!=="actioned"&&e.actionRequired?`<button class="btn btn-xs btn-success mc-action-btn" data-action="actioned" data-id="${e.id}"><i class="ti ti-circle-check"></i> Mark actioned</button>`:""}
          ${i==="new"?`<button class="btn btn-xs mc-action-btn" data-action="read" data-id="${e.id}"><i class="ti ti-eye"></i> Mark read</button>`:""}
          ${n?'<span class="badge success" style="font-size:9px"><i class="ti ti-check"></i> Tasks created</span>':`<button class="btn btn-xs btn-primary mc-create-task-btn" data-id="${e.id}"><i class="ti ti-circle-plus"></i> Create tasks</button>`}
          <button class="btn btn-xs mc-action-btn" data-action="dismissed" data-id="${e.id}"><i class="ti ti-x"></i></button>
        </div>
      </div>

      <!-- Expanded AI Recommendations -->
      ${s?na(e):""}
    </div>
  `}function na(e){const t=e.aiRec;return`
    <div class="mc-rec-panel">
      <div class="mc-rec-header">
        <i class="ti ti-robot" style="color:var(--clr-teal-text);font-size:16px"></i>
        <span style="font-weight:700;font-size:12px">AI Agent Analysis — ${e.id}</span>
        <span class="badge teal" style="margin-left:6px">Change Intelligence</span>
      </div>

      <div class="grid-2" style="gap:16px;margin-top:12px">
        <div>
          <div class="section-heading">Assessment</div>
          <div style="display:grid;grid-template-columns:auto 1fr;gap:5px 14px;font-size:11px;margin-bottom:12px">
            <span style="color:var(--color-text-tertiary)">Action Required</span>
            <span style="font-weight:600;color:${t.actionRequired?"var(--clr-danger-text)":"var(--clr-success-text)"}">
              ${t.actionRequired?"✓ YES":"✗ No"}
            </span>
            <span style="color:var(--color-text-tertiary)">Deadline</span>
            <span style="font-weight:600;color:${e.actionByDate?"var(--clr-warning-text)":"var(--color-text-secondary)"}">
              ${t.deadline||"—"}
            </span>
            <span style="color:var(--color-text-tertiary)">Impacted</span>
            <span>${t.impacted.join(", ")}</span>
          </div>

          <div class="section-heading">Automation</div>
          <div style="font-size:11px;display:flex;align-items:flex-start;gap:6px;margin-bottom:8px">
            <span style="font-weight:600;color:${t.automatable?"var(--clr-success-text)":"var(--color-text-tertiary)"}">
              ${t.automatable?"✓ Available":"✗ Not available"}
            </span>
          </div>
          ${t.automationNote?`<div style="font-size:10px;color:var(--color-text-secondary);background:var(--color-background-secondary);padding:8px 10px;border-radius:var(--border-radius-md);font-family:var(--font-mono);line-height:1.5">${t.automationNote}</div>`:""}
        </div>

        <div>
          <div class="section-heading">Recommended IT Tasks</div>
          <div style="display:flex;flex-direction:column;gap:5px;margin-bottom:12px">
            ${t.tasks.map((i,s)=>`
              <div style="display:flex;align-items:flex-start;gap:8px;font-size:11px;padding:5px 8px;background:var(--color-background-secondary);border-radius:var(--border-radius-sm);border:0.5px solid var(--color-border-tertiary)">
                <span style="width:16px;height:16px;border-radius:50%;background:var(--clr-info-bg);color:var(--clr-info-text);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${s+1}</span>
                <span style="flex:1;line-height:1.4">${i}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="mc-rec-actions">
        <button class="btn btn-xs btn-primary mc-create-task-btn" data-id="${e.id}"><i class="ti ti-circle-plus"></i> Create all tasks</button>
        ${t.automatable?'<button class="btn btn-xs" style="border-color:var(--clr-teal-text);color:var(--clr-teal-text)"><i class="ti ti-api"></i> Run Graph query</button>':""}
        <button class="btn btn-xs"><i class="ti ti-brand-teams"></i> Notify via Teams</button>
        ${e.actionRequired?`<button class="btn btn-xs btn-success mc-action-btn" data-action="actioned" data-id="${e.id}"><i class="ti ti-circle-check"></i> Mark actioned</button>`:""}
      </div>
    </div>
  `}function ra(e,t){e.querySelectorAll(".mc-expand-rec").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.id;Z.has(s)?Z.delete(s):(Z.add(s),Rt(s,N(s)==="new"?"read":N(s))),B(t)})}),e.querySelectorAll(".mc-action-btn").forEach(i=>{i.addEventListener("click",s=>{s.stopPropagation();const{action:n,id:a}=i.dataset;Rt(a,n),p({read:"Marked as read.",actioned:"Marked as actioned.",dismissed:"Message dismissed."}[n]||"Updated.",n==="actioned"?"success":"info"),pe(t)})}),e.querySelectorAll(".mc-create-task-btn").forEach(i=>{i.addEventListener("click",s=>{s.stopPropagation();const n=i.dataset.id;di(n),p(`Tasks created for ${n}. Check task tracker.`,"success"),B(t)})})}function oa(e){const t=e.querySelector("#mc-content");if(!t)return;const i=O.filter(o=>o.status!=="resolved"),s=O.filter(o=>o.status==="resolved"),n=Object.keys(C).map(o=>{const c=O.find(y=>y.service===o&&y.status!=="resolved"),l=c?c.severity==="high"?"var(--clr-danger-text)":"var(--clr-warning-text)":"var(--clr-success-text)";c&&c.severity;const u=c?c.severity==="high"?"fail":"warn":"pass";return`
      <div class="mc-health-svc-tile" style="border-color:${c?"var(--color-border-secondary)":"var(--clr-success-border)"}">
        <div class="psc-icon" style="background:${C[o].bg};color:${C[o].color};width:28px;height:28px;font-size:13px;border-radius:6px">
          <i class="ti ${C[o].icon}"></i>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o}</div>
          <div style="font-size:9px;color:${l};font-weight:600">${c?c.status==="investigating"?"Investigating":"Degraded":"Operational"}</div>
        </div>
        <div class="status-dot ${u}" style="flex-shrink:0"></div>
      </div>
    `}).join(""),a={investigating:"Investigating",serviceDegradation:"Service degradation",serviceAdvisory:"Advisory",serviceInterruption:"Interrupted",resolved:"Resolved"},r={investigating:"danger",serviceDegradation:"warning",serviceAdvisory:"info",serviceInterruption:"danger",resolved:"success"};t.innerHTML=`
    <!-- Service health grid -->
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-heartbeat"></i> Service Health Overview</span>
        <span class="badge ${i.length>0?"danger":"success"}">${i.length>0?i.length+" active issue"+(i.length>1?"s":""):"All services operational"}</span>
      </div>
      <div class="mc-health-grid">${n}</div>
    </div>

    <!-- Active incidents -->
    ${i.length>0?`
      <div style="font-size:10px;font-weight:700;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Active Incidents & Advisories</div>
      ${i.map(o=>It(o,a,r)).join("")}
    `:""}

    <!-- Resolved -->
    <div style="font-size:10px;font-weight:700;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 8px">Recently Resolved</div>
    ${s.map(o=>It(o,a,r)).join("")}
  `}function It(e,t,i){const s=C[e.service]||{icon:"ti-apps",color:"#185FA5",bg:"#E6F1FB"};return`
    <div class="card mb-3" style="border-left:3px solid ${e.status==="resolved"?"var(--clr-success-text)":e.severity==="high"?"var(--clr-danger-text)":"var(--clr-warning-text)"}">
      <div class="mc-card-header" style="margin-bottom:8px">
        <div class="mc-svc-chip" style="background:${s.bg};color:${s.color}">
          <i class="ti ${s.icon}"></i> ${e.service}
        </div>
        <span class="monospace" style="font-size:10px;color:var(--color-text-tertiary)">${e.id}</span>
        <span class="badge ${i[e.status]||"neutral"}">${t[e.status]||e.status}</span>
        <span style="margin-left:auto;font-size:10px;color:var(--color-text-tertiary)">Feature: ${e.feature}</span>
      </div>
      <div style="font-size:12px;font-weight:700;margin-bottom:6px">${e.title}</div>
      <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.5">${e.userImpact}</div>
      <div style="display:flex;gap:16px;font-size:10px;color:var(--color-text-tertiary);margin-bottom:10px">
        <span><i class="ti ti-clock"></i> Started: ${e.startTime}</span>
        <span><i class="ti ti-refresh"></i> Updated: ${e.lastUpdated}</span>
        ${e.nextUpdate?`<span><i class="ti ti-calendar"></i> Next update: ${e.nextUpdate}</span>`:""}
      </div>
      ${e.updates.length>0?`
        <div class="section-heading">Updates</div>
        ${e.updates.map(a=>`
          <div style="display:flex;gap:10px;padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
            <span class="monospace" style="color:var(--color-text-tertiary);flex-shrink:0;min-width:52px">${a.time}</span>
            <span style="color:var(--color-text-secondary);line-height:1.4">${a.text}</span>
          </div>
        `).join("")}
      `:""}
    </div>
  `}function la(){const e=Di;return`
    <div class="digest-overlay" id="mc-digest-overlay">
      <div class="digest-panel">
        <div class="digest-header">
          <div>
            <div style="font-size:14px;font-weight:800">Microsoft 365 Weekly Change Digest</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">Generated ${new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} · Contoso.com</div>
          </div>
          <button class="btn btn-xs" id="mc-digest-close"><i class="ti ti-x"></i> Close</button>
        </div>

        <div class="digest-body">
          <!-- Stats row -->
          <div class="digest-stats-row">
            <div class="digest-stat"><span class="ds-val info">${e.totalMessages}</span><span class="ds-lbl">Total Messages</span></div>
            <div class="digest-stat"><span class="ds-val danger">${e.actionRequired}</span><span class="ds-lbl">Action Required</span></div>
            <div class="digest-stat"><span class="ds-val warning">${e.majorChanges}</span><span class="ds-lbl">Major Changes</span></div>
            <div class="digest-stat"><span class="ds-val info">${e.newSinceLastWeek}</span><span class="ds-lbl">New This Week</span></div>
            <div class="digest-stat"><span class="ds-val info">${e.upcoming30Days}</span><span class="ds-lbl">Due in 30 Days</span></div>
            <div class="digest-stat"><span class="ds-val success">${e.resolved}</span><span class="ds-lbl">Resolved Issues</span></div>
          </div>

          <!-- Highlights -->
          <div class="section-heading" style="margin-bottom:10px">⚠️ This Week's Priority Items</div>
          ${e.highlights.map(i=>{var s,n,a;return`
            <div style="display:flex;gap:10px;padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:6px;border-left:3px solid ${i.severity==="high"?"var(--clr-danger-text)":"var(--clr-warning-text)"}">
              <div class="mc-svc-chip" style="background:${((s=C[i.service])==null?void 0:s.bg)||"#f0f0f0"};color:${((n=C[i.service])==null?void 0:n.color)||"#555"};flex-shrink:0">
                <i class="ti ${((a=C[i.service])==null?void 0:a.icon)||"ti-apps"}"></i> ${i.service}
              </div>
              <span style="font-size:11px;line-height:1.4;flex:1">${i.title}</span>
              <span class="badge ${i.severity==="high"?"danger":"warning"}" style="flex-shrink:0">${i.severity}</span>
            </div>
          `}).join("")}

          <!-- Action Required section -->
          <div class="section-heading" style="margin-top:16px;margin-bottom:10px">📋 Action Required — ${e.actionRequired} items</div>
          ${S.filter(i=>i.actionRequired).slice(0,5).map(i=>`
            <div style="display:flex;gap:10px;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <span class="monospace" style="color:var(--color-text-tertiary);flex-shrink:0">${i.id}</span>
              <span style="flex:1">${i.title}</span>
              ${i.actionByDate?`<span style="color:var(--clr-danger-text);font-size:10px;flex-shrink:0">By ${i.actionByDate}</span>`:""}
            </div>
          `).join("")}

          <!-- Service health -->
          <div class="section-heading" style="margin-top:16px;margin-bottom:10px">🟢 Service Health Summary</div>
          <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.7">
            ${O.filter(i=>i.status!=="resolved").length===0?"✅ All Microsoft 365 services are operating normally.":O.filter(i=>i.status!=="resolved").map(i=>`⚠️ <strong>${i.service}</strong>: ${i.title}`).join("<br>")}
            <br>✅ ${O.filter(i=>i.status==="resolved").length} incidents resolved since last digest.
          </div>

          <!-- Footer actions -->
          <div style="display:flex;gap:8px;margin-top:20px;padding-top:14px;border-top:0.5px solid var(--color-border-secondary)">
            <button class="btn btn-primary" onclick="this.textContent='Sent!';setTimeout(()=>this.textContent='',2000)">
              <i class="ti ti-send"></i> Send via Teams
            </button>
            <button class="btn" onclick="this.textContent='Sent!';setTimeout(()=>this.textContent='',2000)">
              <i class="ti ti-mail"></i> Send via email
            </button>
            <button class="btn" onclick="window.print()">
              <i class="ti ti-printer"></i> Print / PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function ca(e){const t=e.querySelector("#mc-sync");t.innerHTML='<span class="spinner dark"></span> Syncing...',t.disabled=!0,setTimeout(()=>{t.innerHTML='<i class="ti ti-refresh"></i> Sync now',t.disabled=!1,p("Synced 20 messages from /admin/serviceAnnouncement/messages. 5 health events from /issues.","success")},2e3)}const le={totalAppRegistrations:87,totalEnterpriseApplications:124,multiTenantApps:12,highPrivilegeApps:8,expiringSecrets60d:9,certificateBasedApps:18,appsRequiringConsent:3},F=[{id:"app-001",name:"HR Portal API",appId:"8f4c3d1e-2b5a-4f9e-8c2d-3a1b9f5e8c2d",objectId:"obj-hr-001",created:"2024-03-15",owners:["Aisha Raza"],audience:"AzureADMyOrg",type:"Web",status:"active",category:"Business"},{id:"app-002",name:"CRM Connector",appId:"9e5d4e2f-3c6b-5g0f-9d3e-4b2c0g6f9d3e",objectId:"obj-crm-001",created:"2024-01-20",owners:["Chen Wei","Priya Kumar"],audience:"AzureADMultipleOrgs",type:"Web",status:"active",category:"Production"},{id:"app-003",name:"Mobile Auth App",appId:"0f6e5f3g-4d7c-6h1g-0e4f-5c3d1h7g0e4f",objectId:"obj-mobile-001",created:"2024-02-10",owners:["Priya Kumar"],audience:"AzureADMyOrg",type:"Mobile/Desktop",status:"active",category:"Production"},{id:"app-004",name:"Test Integration",appId:"1g7f6g4h-5e8d-7i2h-1f5g-6d4e2i8h1f5g",objectId:"obj-test-001",created:"2024-05-01",owners:["Chen Wei"],audience:"AzureADMyOrg",type:"Web",status:"active",category:"Test"},{id:"app-005",name:"Legacy App (Orphaned)",appId:"2h8g7h5i-6f9e-8j3i-2g6h-7e5f3j9i2g6h",objectId:"obj-legacy-001",created:"2022-11-05",owners:[],audience:"AzureADMyOrg",type:"Web",status:"inactive",category:"Production",risk:"critical"},{id:"app-006",name:"Partner Integration",appId:"3i9h8i6j-7g0f-9k4j-3h7i-8f6g4k0j3h7i",objectId:"obj-partner-001",created:"2023-08-22",owners:["Aisha Raza"],audience:"AzureADMultipleOrgs",type:"Web",status:"active",category:"Business",risk:"high"},{id:"app-007",name:"Finance Automation",appId:"4j0i9j7k-8h1g-0l5k-4i8j-9g7h5l1k4i8j",objectId:"obj-finance-001",created:"2024-04-12",owners:["Chen Wei","Aisha Raza","Priya Kumar"],audience:"AzureADMyOrg",type:"Web",status:"active",category:"Business"},{id:"app-008",name:"Inactive App",appId:"5k1j0k8l-9i2h-1m6l-5j9k-0h8i6m2l5j9k",objectId:"obj-inactive-001",created:"2023-12-01",owners:["Priya Kumar"],audience:"AzureADMyOrg",type:"Web",status:"inactive",category:"Test",lastSignIn:"2025-12-10",risk:"medium"},{id:"app-009",name:"Compliance Bot",appId:"6l2k1l9m-0j3i-2n7m-6k0l-1i9j7n3m6k0l",objectId:"obj-bot-001",created:"2024-06-05",owners:["Aisha Raza"],audience:"AzureADMyOrg",type:"Web",status:"active",category:"Business"},{id:"app-010",name:"DataSync Engine",appId:"7m3l2m0n-1k4j-3o8n-7l1m-2j0k8o4n7l1m",objectId:"obj-datasync-001",created:"2024-01-08",owners:["Chen Wei"],audience:"AzureADMyOrg",type:"Web",status:"active",category:"Production"}],$e=[{id:"sp-001",name:"Microsoft Office 365",publisher:"Microsoft",category:"Microsoft",usersAssigned:1e3,adminConsent:!0,riskLevel:"low",lastSignIn:"Today",signInCount30d:45e3},{id:"sp-002",name:"Microsoft Teams",publisher:"Microsoft",category:"Microsoft",usersAssigned:950,adminConsent:!0,riskLevel:"low",lastSignIn:"Today",signInCount30d:28e3},{id:"sp-003",name:"Salesforce",publisher:"Salesforce Inc.",category:"SaaS",usersAssigned:450,adminConsent:!0,riskLevel:"low",lastSignIn:"Today",signInCount30d:8500},{id:"sp-004",name:"Slack",publisher:"Slack Technologies",category:"SaaS",usersAssigned:620,adminConsent:!0,riskLevel:"low",lastSignIn:"Today",signInCount30d:12e3},{id:"sp-005",name:"Custom HR System",publisher:"Internal",category:"Custom",usersAssigned:280,adminConsent:!1,riskLevel:"medium",lastSignIn:"2 days ago",signInCount30d:1200},{id:"sp-006",name:"ServiceNow",publisher:"ServiceNow",category:"SaaS",usersAssigned:180,adminConsent:!0,riskLevel:"low",lastSignIn:"Today",signInCount30d:2800},{id:"sp-007",name:"Okta Integration",publisher:"Okta Inc.",category:"SaaS",usersAssigned:12,adminConsent:!0,riskLevel:"high",lastSignIn:"5 days ago",signInCount30d:340},{id:"sp-008",name:"Unused App (Archive)",publisher:"External Vendor",category:"SaaS",usersAssigned:0,adminConsent:!0,riskLevel:"medium",lastSignIn:"180 days ago",signInCount30d:0}],H=[{appName:"HR Portal API",appId:"app-001",secretId:"sec-001",type:"secret",expiryDate:"2026-06-15",daysRemaining:13,status:"expiring",created:"2024-06-15",rotation:"Manual"},{appName:"CRM Connector",appId:"app-002",secretId:"sec-002",type:"certificate",expiryDate:"2026-12-20",daysRemaining:202,status:"healthy",created:"2024-12-20",rotation:"Automatic"},{appName:"Mobile Auth App",appId:"app-003",secretId:"sec-003",type:"secret",expiryDate:"2026-05-30",daysRemaining:-2,status:"expired",created:"2024-05-30",rotation:"Manual"},{appName:"Test Integration",appId:"app-004",secretId:"sec-004",type:"secret",expiryDate:"2026-07-10",daysRemaining:38,status:"expiring",created:"2024-07-10",rotation:"Manual"},{appName:"Finance Automation",appId:"app-007",secretId:"sec-007",type:"certificate",expiryDate:"2027-03-15",daysRemaining:287,status:"healthy",created:"2024-03-15",rotation:"Automatic"},{appName:"Compliance Bot",appId:"app-009",secretId:"sec-009",type:"secret",expiryDate:"2026-06-01",daysRemaining:0,status:"expired",created:"2024-06-01",rotation:"Manual"},{appName:"DataSync Engine",appId:"app-010",secretId:"sec-010",type:"secret",expiryDate:"2026-07-25",daysRemaining:53,status:"expiring",created:"2024-07-25",rotation:"Manual"},{appName:"Partner Integration",appId:"app-006",secretId:"sec-006",type:"certificate",expiryDate:"2026-09-10",daysRemaining:100,status:"healthy",created:"2024-09-10",rotation:"Automatic"}],Dt=[{appName:"HR Portal API",appId:"app-001",permissions:["User.Read.All","Mail.Read","Directory.Read.All"],riskLevel:"high",requiredGrant:!0},{appName:"CRM Connector",appId:"app-002",permissions:["Directory.ReadWrite.All","User.ReadWrite.All"],riskLevel:"critical",requiredGrant:!0},{appName:"Mobile Auth App",appId:"app-003",permissions:["User.Read","Mail.Read"],riskLevel:"low",requiredGrant:!1},{appName:"Finance Automation",appId:"app-007",permissions:["Directory.ReadWrite.All","AppRoleAssignment.ReadWrite.All"],riskLevel:"critical",requiredGrant:!0},{appName:"Compliance Bot",appId:"app-009",permissions:["Directory.Read.All","User.Read.All"],riskLevel:"high",requiredGrant:!0},{appName:"Partner Integration",appId:"app-006",permissions:["User.Read","Directory.Read.All","Mail.ReadWrite"],riskLevel:"high",requiredGrant:!0}],Tt=[{appName:"CRM Connector",grantedBy:"Aisha Raza",grantDate:"2024-01-22",permissions:"Directory.ReadWrite.All, User.ReadWrite.All",scope:"Tenant-wide",riskAlert:!0},{appName:"Finance Automation",grantedBy:"Chen Wei",grantDate:"2024-04-15",permissions:"Directory.ReadWrite.All, AppRoleAssignment.ReadWrite.All",scope:"Tenant-wide",riskAlert:!0},{appName:"HR Portal API",grantedBy:"Aisha Raza",grantDate:"2024-03-18",permissions:"User.Read.All, Mail.Read, Directory.Read.All",scope:"Tenant-wide",riskAlert:!1},{appName:"Partner Integration",grantedBy:"Chen Wei",grantDate:"2023-08-25",permissions:"User.Read, Directory.Read.All, Mail.ReadWrite",scope:"Tenant-wide",riskAlert:!0},{appName:"Custom HR System",grantedBy:"Priya Kumar",grantDate:"2024-05-10",permissions:"Directory.Read.All",scope:"User",riskAlert:!1}],ue=[{appName:"HR Portal API",lastSignIn:"2 hours ago",signInCount30d:3400,activeUsers30d:280,failedSignins:12,status:"active"},{appName:"CRM Connector",lastSignIn:"15 min ago",signInCount30d:8900,activeUsers30d:420,failedSignins:45,status:"active"},{appName:"Mobile Auth App",lastSignIn:"Yesterday",signInCount30d:2100,activeUsers30d:150,failedSignins:8,status:"active"},{appName:"Inactive App",lastSignIn:"180 days ago",signInCount30d:0,activeUsers30d:0,failedSignins:0,status:"unused",riskLevel:"medium"},{appName:"Legacy App (Orphaned)",lastSignIn:"200 days ago",signInCount30d:0,activeUsers30d:0,failedSignins:0,status:"unused",riskLevel:"critical"},{appName:"Finance Automation",lastSignIn:"1 day ago",signInCount30d:5600,activeUsers30d:320,failedSignins:78,status:"active"},{appName:"Test Integration",lastSignIn:"3 days ago",signInCount30d:180,activeUsers30d:8,failedSignins:2,status:"lowuse"}],we=[{appName:"CRM Connector",riskScore:95,risks:["Directory.ReadWrite.All","Admin Consent Granted","Multi-Tenant"],severity:"critical"},{appName:"Finance Automation",riskScore:92,risks:["AppRoleAssignment.ReadWrite.All","Directory.ReadWrite.All","Admin Consent"],severity:"critical"},{appName:"Partner Integration",riskScore:78,risks:["Multi-Tenant App","Admin Consent","External Publisher"],severity:"high"},{appName:"Legacy App (Orphaned)",riskScore:85,risks:["No Owner","Unused 200+ days","Expired Secret"],severity:"critical"},{appName:"HR Portal API",riskScore:68,risks:["Directory.Read.All","Admin Consent","Secret Expires in 13 days"],severity:"high"},{appName:"Inactive App",riskScore:55,risks:["Unused 180+ days","Single Owner"],severity:"medium"},{appName:"Mobile Auth App",riskScore:28,risks:["Secret Expired"],severity:"low"},{appName:"Okta Integration",riskScore:72,risks:["Admin Consent","Low Activity","External SaaS"],severity:"high"}],ot=[{id:"rec-001",priority:"critical",title:"Remove expired secret from Mobile Auth App",app:"Mobile Auth App",category:"Secrets",effort:"low"},{id:"rec-002",priority:"critical",title:"Assign owner to Legacy App (Orphaned)",app:"Legacy App (Orphaned)",category:"Governance",effort:"low"},{id:"rec-003",priority:"critical",title:"Review Directory.ReadWrite.All permissions for CRM Connector",app:"CRM Connector",category:"Permissions",effort:"medium"},{id:"rec-004",priority:"high",title:"Rotate HR Portal API secret (expires in 13 days)",app:"HR Portal API",category:"Secrets",effort:"low"},{id:"rec-005",priority:"high",title:"Assign owner to Finance Automation (3 owners is excessive)",app:"Finance Automation",category:"Governance",effort:"low"},{id:"rec-006",priority:"high",title:"Decommission Inactive App (unused 180+ days)",app:"Inactive App",category:"Lifecycle",effort:"medium"},{id:"rec-007",priority:"high",title:"Reduce DataSync Engine secret expiry to every 90 days",app:"DataSync Engine",category:"Secrets",effort:"medium"},{id:"rec-008",priority:"medium",title:"Replace client secrets with Managed Identity (eligible apps)",app:"Multiple",category:"Architecture",effort:"high"},{id:"rec-009",priority:"medium",title:"Audit unused enterprise application (Archive app)",app:"Unused App (Archive)",category:"Lifecycle",effort:"low"},{id:"rec-010",priority:"medium",title:"Implement secret rotation automation",app:"Multiple",category:"Governance",effort:"high"}],da=[{keywords:["expiring secret","secret expir","secret rotation","credential"],response:`**Application Secrets Expiring — Action Required**

🔴 **Expired (immediate):**
- Mobile Auth App: Secret expired 2 days ago
- Compliance Bot: Secret expired TODAY

🟠 **Expiring soon (<30 days):**
- HR Portal API: 13 days remaining
- Test Integration: 38 days remaining

🟢 **Healthy (>60 days):**
- Finance Automation: 287 days
- Partner Integration: 100 days
- CRM Connector: 202 days

**Recommended actions:**
1. Rotate expired secrets immediately
2. Schedule rotation for HR Portal API this week
3. Consider automatic certificate-based rotation
4. Set calendar reminders for Test Integration (38d)

→ Navigate to **Applications → Secret & Certificate Expiry** to see full list and rotation history.`},{keywords:["directory.readwrite","high privilege","critical permission","readwrite"],response:`**High-Risk Applications — Directory.ReadWrite.All Permissions**

🔴 **Critical (2 apps):**
1. **CRM Connector** — Directory.ReadWrite.All + User.ReadWrite.All
   - Risk Score: 95/100 (CRITICAL)
   - Admin Consent: Tenant-wide
   - Multi-Tenant: Yes (external access)
   - Last Sign-in: 15 min ago
   
2. **Finance Automation** — Directory.ReadWrite.All + AppRoleAssignment.ReadWrite.All
   - Risk Score: 92/100 (CRITICAL)
   - Admin Consent: Tenant-wide
   - Last Sign-in: 1 day ago

**Immediate actions:**
1. Review current permission usage for both apps
2. Consider reducing to Directory.Read.All if possible
3. Implement Conditional Access restrictions
4. Monitor for anomalous activity

→ **Applications → Permissions & Consent** to audit all grants.`},{keywords:["application owner","no owner","owner assignment"],response:`**Applications Without Owners — Governance Risk**

🔴 **Critical (1 app):**
- **Legacy App (Orphaned)** — No owner assigned
  - Created: Nov 2022 (18 months old)
  - Last Sign-in: 200 days ago (UNUSED)
  - Risk Score: 85/100 (CRITICAL)
  - Action: Decommission or assign owner immediately

**Multi-owner issue:**
- Finance Automation has 3 owners (excessive)
  - Recommend: 1 primary + 1 backup

**Best practices:**
1. Assign minimum 2 owners per app (primary + backup)
2. Owners must be active employees
3. Review ownership quarterly
4. Automated alerts when owner leaves

→ **Applications → Owners & Governance** for full audit.`},{keywords:["unused application","no sign-in","inactive","90 day"],response:`**Unused Applications (90+ days inactive)**

🔴 **Critical for decommissioning (1 app):**
- **Legacy App (Orphaned)** — 200+ days, no sign-ins, no owner
  - Recommendation: Delete immediately

🟡 **Consider archiving (2 apps):**
1. **Inactive App** — 180 days no activity, 0 users assigned
2. **Unused App (Archive)** — Never used in tenant, 0 sign-ins

**Before decommissioning:**
1. Notify app owners 30 days in advance
2. Verify no scheduled jobs use the app
3. Check for any OAuth token grants
4. Export audit logs as archive

→ **Applications → Lifecycle Management** to see decommission checklist.`},{keywords:["multi-tenant","external","third party"],response:`**Multi-Tenant Applications — External Access Risk**

📊 **Inventory:**
- Total multi-tenant apps: 12
- With admin consent: 4
- High-risk: 2 (CRM Connector, Partner Integration)

🔴 **Critical multi-tenant apps:**
1. **CRM Connector** — Risk 95/100
   - Directory.ReadWrite.All + User.ReadWrite.All
   - Tenant-wide admin consent granted
   
2. **Partner Integration** — Risk 78/100
   - Directory.Read.All + Mail.ReadWrite
   - External publisher (Okta)

**Security controls:**
1. Require admin consent (already configured)
2. Restrict to specific users/groups via CA
3. Monitor for unusual activity
4. Quarterly permission audit

→ **Applications → Risk Assessment** for full risk scoring.`},{keywords:["admin consent","tenant-wide","consent grant"],response:`**Admin Consent Grants — Tenant-Wide Permissions**

📋 **Summary:**
- Total consent grants: 5
- Tenant-wide: 4
- User-scoped: 1
- High-risk: 2

🔴 **High-risk tenant-wide grants:**
1. **CRM Connector** — Directory.ReadWrite.All, User.ReadWrite.All
   - Granted by: Aisha Raza (Jan 2024)
   - Risk: CRITICAL — full directory modification
   
2. **Finance Automation** — Directory.ReadWrite.All, AppRoleAssignment.ReadWrite.All
   - Granted by: Chen Wei (Apr 2024)
   - Risk: CRITICAL — can assign admin roles

**Governance:**
- Tenant-wide consent should be rare
- Review all grants quarterly
- Consider user-scoped consent instead
- Implement consent risk assessment workflow

→ **Applications → Permissions & Consent** for consent audit trail.`},{keywords:["risk assessment","risk score","high risk"],response:`**High-Risk Applications — Risk Scoring**

📊 **Risk Distribution:**
| Score | Count | Severity |
|---|---|---|
| 90+ | 2 | 🔴 Critical |
| 70-89 | 3 | 🟠 High |
| 50-69 | 2 | 🟡 Medium |
| <50 | 2 | 🟢 Low |

🔴 **Critical (2 apps):**
1. CRM Connector — 95/100 (Directory.ReadWrite.All, admin consent, multi-tenant)
2. Finance Automation — 92/100 (AppRoleAssignment.ReadWrite.All, admin consent)

🟠 **High (3 apps):**
1. Partner Integration — 78/100 (External, admin consent)
2. Legacy App (Orphaned) — 85/100 (No owner, unused 200d)
3. HR Portal API — 68/100 (Admin consent, expiring secret)

**Risk factors:** Directory write perms, admin consent, multi-tenant, no owner, expired secrets, unused apps.

→ **Applications → Risk Assessment** for detailed risk breakdown per app.`},{keywords:["certificate","managed identity","secret rotation"],response:`**Application Credentials — Certificate vs Secret**

📊 **Current State:**
| Type | Count | Status |
|---|---|---|
| Secrets | 6 | 2 expired, 2 expiring |
| Certificates | 2 | All healthy |
| Managed Identity | 0 | Recommended! |

✅ **Certificate-based apps (2):**
- CRM Connector — Auto-rotated, 202 days remaining
- Finance Automation — Auto-rotated, 287 days remaining

❌ **Secret-based apps needing rotation:**
- Mobile Auth App — EXPIRED (2 days ago)
- Compliance Bot — EXPIRED (TODAY)
- HR Portal API — Expires in 13 days
- Test Integration — Expires in 38 days
- DataSync Engine — Expires in 53 days

**Recommendation:** Replace all secrets with certificates or Managed Identities where possible.

→ **Applications → Secret & Certificate Expiry** for rotation roadmap.`}];let Ae="executive",A={type:"all",status:"all",search:""},ve=[],qt=!1,Y=[],Q=[];const pa=[{id:"executive",label:"Executive",icon:"ti-layout-dashboard"},{id:"appregistrations",label:"App Registrations",icon:"ti-app-window"},{id:"enterprise",label:"Enterprise Apps",icon:"ti-grid-dots"},{id:"secrets",label:"Secrets & Certs",icon:"ti-lock"},{id:"permissions",label:"Permissions",icon:"ti-shield-check"},{id:"consents",label:"Admin Consents",icon:"ti-user-check"},{id:"owners",label:"Owners",icon:"ti-users"},{id:"usage",label:"Usage Analytics",icon:"ti-chart-line"},{id:"risk",label:"Risk Assessment",icon:"ti-alert-triangle"},{id:"lifecycle",label:"Lifecycle",icon:"ti-timeline"},{id:"recommendations",label:"Recommendations",icon:"ti-checklist"},{id:"copilot",label:"App Copilot",icon:"ti-robot"}];async function ua(){const e=document.getElementById("page-applications");if(e){e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading real M365 application data...</p></div>';try{console.log("📡 Fetching real application data from backend...");const t=await Ri(),i=await Ii();t.success?(Y=t.data||F,console.log(`✅ Loaded ${Y.length} real applications from API`)):(console.warn("⚠️ Failed to fetch applications, using simulated data:",t.error),Y=F),i.success?(Q=i.data||$e,console.log(`✅ Loaded ${Q.length} real service principals from API`)):(console.warn("⚠️ Failed to fetch service principals, using simulated data"),Q=$e)}catch(t){console.error("❌ Error loading application data:",t),Y=F,Q=$e}j(e)}}function j(e){var n,a;const t=H.filter(r=>r.status==="expiring").length,i=H.filter(r=>r.status==="expired").length,s=we.filter(r=>r.severity==="critical").length;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-app-window"></i> Entra Applications</div>
        <div class="page-subtitle">Application Registrations & Enterprise Apps · ${le.totalAppRegistrations} app registrations · Last sync: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="app-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="app-audit"><i class="ti ti-download"></i> Export audit</button>
      </div>
    </div>

    <!-- Top-5 KPI strip -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value info">${le.totalAppRegistrations}</div>
        <div class="kpi-label">App Registrations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${le.totalEnterpriseApplications}</div>
        <div class="kpi-label">Enterprise Apps</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${i>0?"danger":t>0?"warning":"success"}">${i}</div>
        <div class="kpi-label">Expired Secrets</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${t}</div>
        <div class="kpi-label">Expiring (30d)</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${s>0?"danger":"warning"}">${s}</div>
        <div class="kpi-label">Critical Risk Apps</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${le.highPrivilegeApps}</div>
        <div class="kpi-label">High Privilege</div>
      </div>
    </div>

    <!-- Sub-navigation tabs -->
    <div class="app-subnav" id="app-subnav">
      ${pa.map(r=>`
        <button class="app-tab-btn ${Ae===r.id?"active":""}" data-app-section="${r.id}">
          <i class="ti ${r.icon}"></i><span>${r.label}</span>
          ${r.id==="secrets"&&i+t>0?`<span class="app-tab-badge red">${i+t}</span>`:""}
          ${r.id==="risk"&&s>0?`<span class="app-tab-badge red">${s}</span>`:""}
          ${r.id==="recommendations"?`<span class="app-tab-badge amber">${ot.length}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Content area -->
    <div id="app-content" style="margin-top:16px">${va()}</div>
  `,e.querySelectorAll(".app-tab-btn").forEach(r=>{r.addEventListener("click",()=>{Ae=r.dataset.appSection,j(e)})}),(n=e.querySelector("#app-refresh"))==null||n.addEventListener("click",()=>{const r=e.querySelector("#app-refresh");r.innerHTML='<span class="spinner dark"></span> Scanning...',r.disabled=!0,setTimeout(()=>{r.innerHTML='<i class="ti ti-refresh"></i> Refresh',r.disabled=!1,p("Application inventory updated — 87 app registrations, 124 service principals scanned.","success")},2200)}),(a=e.querySelector("#app-audit"))==null||a.addEventListener("click",()=>p("Application audit exported as CSV.","success")),Ea(e)}function va(){return({executive:Lt,appregistrations:ga,enterprise:ma,secrets:ya,permissions:ha,consents:fa,owners:ba,usage:xa,risk:wa,lifecycle:Aa,recommendations:Sa,copilot:ka}[Ae]||Lt)()}function Lt(){const e=le,t=H.filter(a=>a.status==="expiring").length,i=H.filter(a=>a.status==="expired").length,s=we.filter(a=>a.severity==="critical").length,n=ue.filter(a=>a.status==="unused").length;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-app-window"></i> Application Inventory</span>
        </div>
        ${Gt([{label:"Total App Registrations",val:e.totalAppRegistrations,cls:"info"},{label:"Enterprise Applications",val:e.totalEnterpriseApplications,cls:"info"},{label:"Multi-Tenant Apps",val:e.multiTenantApps,cls:"warning"},{label:"High Privilege Apps",val:e.highPrivilegeApps,cls:"danger"},{label:"Certificate-Based",val:e.certificateBasedApps,cls:"success"},{label:"Unused (90+ days)",val:n,cls:"warning"}])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-lock"></i> Credential Health</span>
        </div>
        <div class="alert-banner danger mb-3">
          <i class="ti ti-alert-triangle"></i>
          <span><strong>${i} secrets EXPIRED</strong> — require immediate replacement</span>
        </div>
        ${Gt([{label:"Expired Secrets",val:i,cls:"danger"},{label:"Expiring (30 days)",val:t,cls:"warning"},{label:"Expiring (60 days)",val:e.expiringSecrets60d,cls:"warning"},{label:"Apps Requiring Admin Consent",val:e.appsRequiringConsent,cls:"warning"}])}
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Risk Summary</span>
          <span class="badge danger dot">${s} critical</span>
        </div>
        ${we.slice(0,5).map(a=>`
          <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span class="badge ${a.severity==="critical"?"danger":a.severity==="high"?"warning":"info"}" style="min-width:72px">${a.riskScore}/100</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis">${a.appName}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">${a.risks.slice(0,2).join(" · ")}</div>
            </div>
            <span class="badge ${a.severity==="critical"?"danger":"warning"}" style="flex-shrink:0">${a.severity}</span>
          </div>
        `).join("")}
        <button class="btn btn-primary mt-3" id="exec-view-risk"><i class="ti ti-arrow-right"></i> View all risks</button>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-checklist"></i> Critical Actions</span>
        </div>
        ${ot.filter(a=>a.priority==="critical").slice(0,4).map(a=>`
          <div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
            <span class="badge danger" style="flex-shrink:0;font-size:9px;min-width:56px;justify-content:center">${a.priority}</span>
            <div style="flex:1">
              <div style="font-size:11px;font-weight:600;line-height:1.3">${a.title}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">${a.app}</div>
            </div>
          </div>
        `).join("")}
        <button class="btn btn-primary mt-3" id="exec-view-recs"><i class="ti ti-arrow-right"></i> View all recommendations</button>
      </div>
    </div>
  `}function ga(){const e=Y.length>0?Y:F,t=e.filter(s=>!(A.type!=="all"&&s.category!==A.type||A.status!=="all"&&s.status!==A.status||A.search&&!s.name.toLowerCase().includes(A.search.toLowerCase()))),i=[...new Set(e.map(s=>s.category))];return`
    <div class="filter-bar mb-3">
      <input type="text" class="form-input" id="app-search" placeholder="Search app name..." value="${A.search}" style="min-width:200px">
      <select class="form-select" id="app-type-filter">
        <option value="all">All Categories</option>
        ${i.map(s=>`<option value="${s}" ${A.type===s?"selected":""}>${s}</option>`).join("")}
      </select>
      <select class="form-select" id="app-status-filter">
        <option value="all" ${A.status==="all"?"selected":""}>All Status</option>
        <option value="active" ${A.status==="active"?"selected":""}>Active</option>
        <option value="inactive" ${A.status==="inactive"?"selected":""}>Inactive</option>
      </select>
      <span style="font-size:10px;color:var(--color-text-tertiary)">Showing ${t.length} of ${e.length}</span>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:25%">Application Name</th>
          <th style="width:15%">Application ID</th>
          <th style="width:12%">Created</th>
          <th style="width:12%">Owners</th>
          <th style="width:11%">Type</th>
          <th style="width:10%">Status</th>
          <th style="width:5%">Risk</th>
        </tr></thead>
        <tbody>
          ${t.map(s=>`
            <tr>
              <td style="font-weight:600">${s.name}${s.risk?` <span class="badge danger" style="font-size:8px">${s.risk}</span>`:""}</td>
              <td><code style="font-size:10px;color:var(--clr-info-text)">${s.appId.substring(0,8)}...</code></td>
              <td style="font-size:11px">${s.created}</td>
              <td style="font-size:10px">${s.owners.length===0?'<span class="badge danger">No owner</span>':s.owners.join(", ")}</td>
              <td><span class="pill">${s.type}</span></td>
              <td><span class="badge ${s.status==="active"?"success":"warning"}">${s.status}</span></td>
              <td style="text-align:center;font-size:16px">${s.risk==="critical"?"🔴":s.risk==="high"?"🟠":"🟢"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function ma(){const e=Q.length>0?Q:$e;return`
    <div class="filter-bar mb-3">
      <select class="form-select" style="min-width:150px">
        <option>All Categories</option>
        ${[...new Set(e.map(i=>i.category||"Other"))].map(i=>`<option>${i}</option>`).join("")}
      </select>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      ${e.map(i=>`
        <div class="card">
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:8px">
            <div style="flex:1">
              <div style="font-size:12px;font-weight:700">${i.name}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">${i.publisher}</div>
            </div>
            <span class="badge ${i.riskLevel==="low"?"success":i.riskLevel==="high"?"danger":"info"}">${i.riskLevel}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
            <div>
              <div style="color:var(--color-text-tertiary)">Users Assigned</div>
              <div style="font-weight:700;font-size:14px">${i.usersAssigned}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Last Sign-in</div>
              <div style="font-weight:600">${i.lastSignIn}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Sign-ins (30d)</div>
              <div style="font-weight:700">${i.signInCount30d.toLocaleString()}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Admin Consent</div>
              <div style="color:${i.adminConsent?"var(--clr-success-text)":"var(--clr-warning-text)"};font-weight:600">${i.adminConsent?"Granted":"Pending"}</div>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `}function ya(){const e=H.filter(s=>s.status==="expired"),t=H.filter(s=>s.status==="expiring"),i=H.filter(s=>s.status==="healthy");return`
    ${e.length>0?`
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${e.length} secrets have EXPIRED</strong> — require immediate replacement</span>
      </div>
    `:""}

    ${t.length>0?`
      <div class="alert-banner warning mb-3">
        <i class="ti ti-clock"></i>
        <span><strong>${t.length} secrets expiring within 30 days</strong> — schedule rotation</span>
      </div>
    `:""}

    <div style="margin-bottom:16px">
      <div class="section-heading">Expired Credentials (${e.length})</div>
      ${e.length===0?'<p style="font-size:11px;color:var(--color-text-tertiary)">None — all credentials valid</p>':`
        <div class="card" style="padding:0;overflow:hidden">
          <table style="width:100%;font-size:11px">
            <thead><tr>
              <th style="width:25%">Application</th>
              <th style="width:15%">Type</th>
              <th style="width:15%">Expired Date</th>
              <th style="width:20%">Days Overdue</th>
              <th style="width:15%">Rotation</th>
              <th style="width:10%">Action</th>
            </tr></thead>
            <tbody>
              ${e.map(s=>`
                <tr>
                  <td style="font-weight:600">${s.appName}</td>
                  <td><span class="pill">${s.type}</span></td>
                  <td style="color:var(--clr-danger-text);font-weight:600">${s.expiryDate}</td>
                  <td style="color:var(--clr-danger-text);font-weight:700">${Math.abs(s.daysRemaining)} days overdue</td>
                  <td><span class="badge warning">${s.rotation}</span></td>
                  <td><button class="btn btn-xs btn-danger">Rotate now</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `}
    </div>

    <div style="margin-bottom:16px">
      <div class="section-heading">Expiring Soon (${t.length})</div>
      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;font-size:11px">
          <thead><tr>
            <th style="width:25%">Application</th>
            <th style="width:15%">Type</th>
            <th style="width:15%">Expiry Date</th>
            <th style="width:20%">Days Remaining</th>
            <th style="width:15%">Rotation</th>
            <th style="width:10%">Action</th>
          </tr></thead>
          <tbody>
            ${t.map(s=>{const n=s.daysRemaining<30?"danger":s.daysRemaining<60?"warning":"success";return`
                <tr>
                  <td style="font-weight:600">${s.appName}</td>
                  <td><span class="pill">${s.type}</span></td>
                  <td>${s.expiryDate}</td>
                  <td style="color:var(--clr-${n}-text);font-weight:700">${s.daysRemaining} days</td>
                  <td><span class="badge ${n}">${s.rotation}</span></td>
                  <td><button class="btn btn-xs">Schedule</button></td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <div class="section-heading">Healthy Credentials (${i.length})</div>
      ${i.map(s=>`
        <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:5px;font-size:11px">
          <i class="ti ti-circle-check" style="color:var(--clr-success-text);font-size:14px"></i>
          <span style="flex:1">${s.appName}</span>
          <span style="color:var(--color-text-tertiary)">${s.type}</span>
          <span style="color:var(--clr-success-text);font-weight:600">${s.daysRemaining} days</span>
        </div>
      `).join("")}
    </div>
  `}function ha(){const e=Dt.filter(i=>i.riskLevel==="critical"),t=Dt.filter(i=>i.riskLevel==="high");return`
    ${e.length>0?`
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${e.length} app${e.length>1?"s":""} with CRITICAL permissions</strong> — require urgent review</span>
      </div>
    `:""}

    <div class="section-heading">Critical Permission Assignments</div>
    ${e.map(i=>`
      <div class="card mb-2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="font-weight:700;color:var(--clr-danger-text)">${i.appName}</div>
          <span class="badge danger">CRITICAL</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${i.permissions.map(s=>`<code style="background:var(--clr-danger-bg);color:var(--clr-danger-text);padding:3px 6px;border-radius:4px;font-size:10px;font-family:monospace">${s}</code>`).join("")}
        </div>
        <div style="margin-top:8px;padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)">
          ${i.requiredGrant?"✓ Admin consent required — verify necessity":"User-level permissions"}
        </div>
      </div>
    `).join("")}

    <div class="section-heading mt-4">High Permission Assignments</div>
    ${t.map(i=>`
      <div class="card mb-2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="font-weight:700;color:var(--clr-warning-text)">${i.appName}</div>
          <span class="badge warning">HIGH</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;font-size:10px">
          ${i.permissions.map(s=>`<code style="background:var(--clr-warning-bg);color:var(--clr-warning-text);padding:2px 5px;border-radius:3px;font-family:monospace">${s}</code>`).join("")}
        </div>
      </div>
    `).join("")}
  `}function fa(){const e=Tt.filter(i=>i.scope==="Tenant-wide"),t=Tt.filter(i=>i.scope==="User");return`
    <div class="alert-banner warning mb-3">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>${e.length} tenant-wide admin consents granted</strong> — review quarterly</span>
    </div>

    <div class="section-heading">Tenant-Wide Consent Grants (${e.length})</div>
    ${e.map(i=>`
      <div class="card mb-2" style="border-left:3px solid ${i.riskAlert?"var(--clr-danger-text)":"var(--color-border-secondary)"}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
          <div>
            <div style="font-weight:700">${i.appName}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary)">Granted by ${i.grantedBy} on ${i.grantDate}</div>
          </div>
          ${i.riskAlert?'<span class="badge danger">⚠️ High Risk</span>':""}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
          ${i.permissions.split(", ").map(s=>`<code style="background:var(--color-background-secondary);padding:2px 6px;border-radius:3px;font-size:10px">${s}</code>`).join("")}
        </div>
      </div>
    `).join("")}

    <div class="section-heading mt-4">User-Scoped Consent (${t.length})</div>
    ${t.map(i=>`
      <div class="card mb-2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <div style="font-weight:700">${i.appName}</div>
          <span style="font-size:10px;color:var(--color-text-tertiary)">Granted ${i.grantDate}</span>
        </div>
        <div style="font-size:10px;color:var(--color-text-secondary)">${i.permissions}</div>
      </div>
    `).join("")}
  `}function ba(){const e=F.filter(s=>s.owners.length===0),t=F.filter(s=>s.owners.length===1),i=F.filter(s=>s.owners.length>1);return`
    ${e.length>0?`
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${e.length} application${e.length>1?"s":""} without assigned owner</strong> — governance risk</span>
      </div>
    `:""}

    <div class="section-heading">No Owner Assigned (${e.length})</div>
    ${e.length===0?'<p style="font-size:11px;color:var(--color-text-tertiary)">All applications have at least one owner.</p>':`
      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;font-size:11px">
          <thead><tr><th style="width:40%">Application</th><th style="width:30%">Created</th><th style="width:20%">Status</th><th style="width:10%">Action</th></tr></thead>
          <tbody>
            ${e.map(s=>`
              <tr>
                <td style="font-weight:700;color:var(--clr-danger-text)">${s.name}</td>
                <td>${s.created}</td>
                <td><span class="badge warning">${s.status}</span></td>
                <td><button class="btn btn-xs btn-danger">Assign owner</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `}

    <div class="section-heading mt-4">Single Owner (${t.length}) — At Risk</div>
    <p style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:8px">Recommendation: Assign secondary owner for redundancy</p>
    ${t.slice(0,5).map(s=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:4px;font-size:11px">
        <div>
          <div style="font-weight:600">${s.name}</div>
          <div style="color:var(--color-text-tertiary)">Owner: ${s.owners[0]}</div>
        </div>
        <button class="btn btn-xs">Add owner</button>
      </div>
    `).join("")}

    <div class="section-heading mt-4">Multiple Owners (${i.length}) ✅</div>
    ${i.map(s=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px;background:var(--clr-success-bg);border-radius:var(--border-radius-md);margin-bottom:4px;font-size:11px">
        <div>
          <div style="font-weight:600">${s.name}</div>
          <div style="color:var(--color-text-tertiary)">${s.owners.join(", ")}</div>
        </div>
      </div>
    `).join("")}
  `}function xa(){const e=ue.filter(s=>s.status==="active"),t=ue.filter(s=>s.status==="lowuse"),i=ue.filter(s=>s.status==="unused");return`
    <div class="section-heading">Actively Used Applications (${e.length})</div>
    ${e.map(s=>`
      <div class="card mb-2">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <div style="font-weight:700">${s.appName}</div>
          <span class="badge success">Active</span>
        </div>
        <div class="grid-2" style="gap:12px;font-size:10px;margin-top:8px">
          <div>
            <div style="color:var(--color-text-tertiary)">Last Sign-in</div>
            <div style="font-weight:600">${s.lastSignIn}</div>
          </div>
          <div>
            <div style="color:var(--color-text-tertiary)">Sign-ins (30d)</div>
            <div style="font-weight:600">${s.signInCount30d.toLocaleString()}</div>
          </div>
          <div>
            <div style="color:var(--color-text-tertiary)">Active Users</div>
            <div style="font-weight:600">${s.activeUsers30d}</div>
          </div>
          <div>
            <div style="color:var(--color-text-tertiary)">Failed Sign-ins</div>
            <div style="color:var(--clr-warning-text);font-weight:600">${s.failedSignins}</div>
          </div>
        </div>
      </div>
    `).join("")}

    <div class="section-heading mt-4">Low Usage Applications (${t.length})</div>
    ${t.map(s=>`
      <div class="card mb-2" style="background:var(--color-background-secondary);border-left:3px solid var(--clr-warning-text)">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="font-weight:700">${s.appName}</div>
          <span class="badge warning">Low Use</span>
        </div>
      </div>
    `).join("")}

    <div class="section-heading mt-4">Unused Applications (${i.length}) — Decommission Candidates</div>
    ${i.map(s=>`
      <div class="alert-banner warning mb-2">
        <i class="ti ti-clock"></i>
        <div>
          <div style="font-weight:700">${s.appName}</div>
          <div style="font-size:10px">Last sign-in: ${s.lastSignIn}</div>
        </div>
      </div>
    `).join("")}
  `}function wa(){const e=we.filter(i=>i.severity==="critical"),t=we.filter(i=>i.severity==="high");return`
    <div class="alert-banner danger mb-3">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>${e.length} applications pose CRITICAL risk</strong> — require immediate security review</span>
    </div>

    <div class="section-heading">Critical Risk Applications (${e.length})</div>
    ${e.map(i=>`
      <div class="card mb-2" style="border-left:3px solid var(--clr-danger-text)">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
          <div>
            <div style="font-size:14px;font-weight:800;color:var(--clr-danger-text)">${i.riskScore}/100</div>
            <div style="font-weight:700;font-size:12px;margin-top:4px">${i.appName}</div>
          </div>
          <span class="badge danger">CRITICAL</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${i.risks.map(s=>`<span class="badge danger" style="font-size:9px">${s}</span>`).join("")}
        </div>
      </div>
    `).join("")}

    <div class="section-heading mt-4">High Risk Applications (${t.length})</div>
    ${t.map(i=>`
      <div class="card mb-2">
        <div style="display:flex;align-items:flex-start;justify-content:space-between">
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--clr-warning-text)">${i.riskScore}/100</div>
            <div style="font-weight:700;margin-top:4px">${i.appName}</div>
          </div>
          <span class="badge warning">HIGH</span>
        </div>
      </div>
    `).join("")}
  `}function Aa(){const e=F.filter(s=>{const n=new Date(s.created),a=new Date(Date.now()-30*24*60*60*1e3);return n>a}),t=F.filter(s=>s.owners.length===0||s.status==="inactive"&&s.risk==="critical"),i=ue.filter(s=>s.status==="unused");return`
    <div class="section-heading">Recently Created (Last 30 Days)</div>
    ${e.length===0?'<p style="font-size:11px;color:var(--color-text-tertiary)">No new applications created.</p>':`
      ${e.map(s=>`
        <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:8px">
          <div style="font-weight:700">${s.name}</div>
          <div style="font-size:10px;color:var(--color-text-tertiary)">Created ${s.created} · Owners: ${s.owners.length>0?s.owners.join(", "):"NONE"}</div>
        </div>
      `).join("")}
    `}

    <div class="section-heading mt-4">Orphaned Applications</div>
    ${t.map(s=>`
      <div class="alert-banner danger mb-2">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${s.name}</strong> — no owner, unused, or expired credentials</span>
      </div>
    `).join("")}

    <div class="section-heading mt-4">Decommission Candidates (${i.length})</div>
    ${i.map(s=>`
      <div style="padding:10px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border-radius:var(--border-radius-md);margin-bottom:6px;font-size:11px">
        <div style="font-weight:700">${s.appName}</div>
        <div>No sign-ins for ${Math.round((Date.now()-new Date("2025-12-10"))/(24*60*60*1e3))} days</div>
      </div>
    `).join("")}
  `}function Sa(){return`
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:12%">Priority</th>
          <th style="width:40%">Recommendation</th>
          <th style="width:15%">Application</th>
          <th style="width:15%">Category</th>
          <th style="width:10%">Effort</th>
          <th style="width:8%">Action</th>
        </tr></thead>
        <tbody>
          ${ot.map(e=>`
            <tr>
              <td><span class="badge ${e.priority==="critical"?"danger":e.priority==="high"?"warning":"info"}">${e.priority}</span></td>
              <td style="font-size:11px;font-weight:500">${e.title}</td>
              <td style="font-size:11px">${e.app}</td>
              <td><span class="pill">${e.category}</span></td>
              <td style="font-size:11px">${e.effort}</td>
              <td><button class="btn btn-xs">Review</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function ka(){(!qt||ve.length===0)&&(ve=[{role:"ai",text:`**Applications & App Registrations Copilot** — Ask me about app security, secrets, permissions, risks, and more.

Current state: **87 app registrations**, **124 enterprise apps**, **5 expiring secrets (30d)**, **2 critical risk apps**`}],qt=!0);const e=["Show expiring secrets","Which apps have Directory.ReadWrite.All?","List apps without owners","Show high-risk applications","Unused apps (90+ days)","Multi-tenant applications"];return`
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="app-cop-msgs">
        ${ve.map(t=>`
          <div class="chat-msg ${t.role==="ai"?"ai":"user-msg"}" style="max-width:85%;margin-bottom:12px">
            ${t.role==="ai"?'<div class="chat-sender"><i class="ti ti-app-window" style="color:var(--clr-info-text)"></i> App Copilot</div>':'<div class="chat-sender" style="justify-content:flex-end">You</div>'}
            <div class="chat-bubble">${pi(t.text)}</div>
          </div>
        `).join("")}
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:5px;padding:8px 0 8px;border-top:0.5px solid var(--color-border-tertiary)">
        ${e.slice(0,5).map(t=>`<button class="suggestion-pill app-cop-pill" data-q="${t}">${t}</button>`).join("")}
      </div>

      <div class="chat-input-area" style="padding:0;border-top:none;margin-top:4px">
        <textarea class="chat-input" id="app-cop-input" placeholder="Ask about app security, secrets, permissions, risks..." rows="1"></textarea>
        <button class="btn btn-primary" id="app-cop-send"><i class="ti ti-send"></i></button>
      </div>
    </div>
  `}function Gt(e){return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${e.map(t=>`
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600">${t.label}</div>
        <div style="font-size:16px;font-weight:700;color:${t.cls==="success"?"var(--clr-success-text)":t.cls==="danger"?"var(--clr-danger-text)":t.cls==="warning"?"var(--clr-warning-text)":"var(--clr-info-text)"}">${t.val}</div>
      </div>
    `).join("")}
  </div>`}function Ea(e){var n,a,r,o,c;const t=e.querySelector("#app-content");if(!t)return;(n=t.querySelector("#app-search"))==null||n.addEventListener("input",l=>{A.search=l.target.value,j(e)}),(a=t.querySelector("#app-type-filter"))==null||a.addEventListener("change",l=>{A.type=l.target.value,j(e)}),(r=t.querySelector("#app-status-filter"))==null||r.addEventListener("change",l=>{A.status=l.target.value,j(e)}),(o=t.querySelector("#exec-view-risk"))==null||o.addEventListener("click",()=>{Ae="risk",j(e)}),(c=t.querySelector("#exec-view-recs"))==null||c.addEventListener("click",()=>{Ae="recommendations",j(e)});const i=t.querySelector("#app-cop-send"),s=t.querySelector("#app-cop-input");i&&s&&(i.addEventListener("click",()=>ze(e,s)),s.addEventListener("keydown",l=>{l.key==="Enter"&&!l.shiftKey&&(l.preventDefault(),ze(e,s))})),t.querySelectorAll(".app-cop-pill").forEach(l=>{l.addEventListener("click",()=>{const u=t.querySelector("#app-cop-input");u&&(u.value=l.dataset.q,ze(e,u))})})}function ze(e,t){const i=t.value.trim();if(!i)return;ve.push({role:"user",text:i}),t.value="";const s=e.querySelector("#app-cop-msgs");s&&(s.innerHTML+=`<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${i}</div>
    </div>`,s.scrollTop=s.scrollHeight),setTimeout(()=>{const n=i.toLowerCase(),a=da.find(o=>o.keywords.some(c=>n.includes(c))),r=(a==null?void 0:a.response)||`Searching application data for **"${i}"**...

Based on your question, navigate to the relevant section above. Current state: 87 app registrations, 2 expired secrets, 2 critical risk apps, 5 recommendations.`;ve.push({role:"ai",text:r}),s&&(s.innerHTML+=`<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-app-window" style="color:var(--clr-info-text)"></i> App Copilot</div>
        <div class="chat-bubble">${pi(r)}</div>
      </div>`,s.scrollTop=s.scrollHeight)},600)}function pi(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}const ee={totalManagedDevices:847,activeDevices:821,inactiveDevices:26,nonCompliant:15,unmanaged:34,corporateDevices:620,byodDevices:227,deviceHealthScore:74,compliancePercentage:98.2,encryptionCoverage:95.7,patchCompliance:87.4,endpointProtection:94.2},Ca={windows:{count:512,percentage:60.4,compliant:498,nonCompliant:14},macos:{count:187,percentage:22.1,compliant:186,nonCompliant:1},ios:{count:92,percentage:10.9,compliant:91,nonCompliant:1},android:{count:42,percentage:5,compliant:40,nonCompliant:2},linux:{count:14,percentage:1.6,compliant:14,nonCompliant:0}},tt=[{id:"policy-001",name:"Windows 11 Standard",assignedDevices:512,compliant:498,nonCompliant:14,pending:0,coverage:100},{id:"policy-002",name:"macOS Security Policy",assignedDevices:187,compliant:186,nonCompliant:1,pending:0,coverage:100},{id:"policy-003",name:"iOS Device Policy",assignedDevices:92,compliant:91,nonCompliant:1,pending:0,coverage:100},{id:"policy-004",name:"Android Security Policy",assignedDevices:42,compliant:40,nonCompliant:2,pending:0,coverage:100}],it=[{id:"DEV-001",name:"LAPTOP-CHEN-001",type:"Windows",manufacturer:"Dell",model:"XPS 13",osVersion:"23H2",lastSync:"2 hours ago",owner:"Chen Wei",compliance:"compliant",encryption:!0,patched:!0,riskLevel:"low"},{id:"DEV-002",name:"LAPTOP-AISHA-001",type:"macOS",manufacturer:"Apple",model:"MacBook Pro 16",osVersion:"14.5",lastSync:"1 hour ago",owner:"Aisha Raza",compliance:"compliant",encryption:!0,patched:!0,riskLevel:"low"},{id:"DEV-003",name:"SURFACE-PRIYA-001",type:"Windows",manufacturer:"Microsoft",model:"Surface Laptop 5",osVersion:"22H2",lastSync:"45 min ago",owner:"Priya Kumar",compliance:"non-compliant",encryption:!1,patched:!1,riskLevel:"high"},{id:"DEV-004",name:"IPHONE-USER-045",type:"iOS",manufacturer:"Apple",model:"iPhone 15 Pro",osVersion:"17.5",lastSync:"Today",owner:"BYOD User",compliance:"compliant",encryption:!0,patched:!0,riskLevel:"low"},{id:"DEV-005",name:"ANDROID-USER-023",type:"Android",manufacturer:"Samsung",model:"Galaxy S24",osVersion:"14",lastSync:"3 days ago",owner:"BYOD User",compliance:"non-compliant",encryption:!0,patched:!1,riskLevel:"medium"},{id:"DEV-006",name:"LAPTOP-UNUSED-001",type:"Windows",manufacturer:"HP",model:"EliteBook 850",osVersion:"21H2",lastSync:"45 days ago",owner:"Former Employee",compliance:"non-compliant",encryption:!1,patched:!1,riskLevel:"critical"},{id:"DEV-007",name:"MAC-CONTRACTOR-001",type:"macOS",manufacturer:"Apple",model:"MacBook Air M2",osVersion:"13.4",lastSync:"120 days ago",owner:"Contractor",compliance:"non-compliant",encryption:!0,patched:!1,riskLevel:"critical"},{id:"DEV-008",name:"SURFACE-GO-LAB-001",type:"Windows",manufacturer:"Microsoft",model:"Surface Go 3",osVersion:"22H2",lastSync:"6 hours ago",owner:"Lab",compliance:"compliant",encryption:!0,patched:!0,riskLevel:"low"}],$a={antivirus:{defenderEnabled:821,realTimeProtection:819,cloudProtection:815,coverage:96.9},firewall:{enabled:812,coverage:95.9},asr:{coverage:69.3},smartscreen:{coverage:82.8}},G={criticalUpdatesMissing:23,securityUpdatesMissing:58,compliancePercentage:87.4,avgDaysBehind:8,devices:[{name:"LAPTOP-UNUSED-001",missingUpdates:47,daysBehind:92,severity:"critical"},{name:"MAC-CONTRACTOR-001",missingUpdates:23,daysBehind:120,severity:"critical"},{name:"SURFACE-PRIYA-001",missingUpdates:12,daysBehind:15,severity:"high"},{name:"ANDROID-USER-023",missingUpdates:5,daysBehind:60,severity:"high"}]},Pa=[{id:"app-001",name:"Microsoft Office 365",deployedDevices:847,outdated:0,unauthorized:0,status:"compliant"},{id:"app-002",name:"Microsoft Teams",deployedDevices:821,outdated:8,unauthorized:0,status:"warning"},{id:"app-003",name:"Microsoft Defender",deployedDevices:821,outdated:0,unauthorized:0,status:"compliant"},{id:"app-004",name:"Adobe Creative Cloud",deployedDevices:234,outdated:12,unauthorized:3,status:"warning"},{id:"app-005",name:"VLC Media Player",deployedDevices:15,outdated:0,unauthorized:15,status:"risk"},{id:"app-006",name:"Slack",deployedDevices:412,outdated:0,unauthorized:12,status:"warning"}],Se=[{deviceId:"DEV-003",deviceName:"SURFACE-PRIYA-001",riskScore:78,severity:"high",risks:["Missing encryption","Unpatched OS","Non-compliant"],owner:"Priya Kumar"},{deviceId:"DEV-006",deviceName:"LAPTOP-UNUSED-001",riskScore:95,severity:"critical",risks:["Not synced 45 days","Missing 47 updates","No BitLocker","Non-compliant"],owner:"Former Employee"},{deviceId:"DEV-007",deviceName:"MAC-CONTRACTOR-001",riskScore:92,severity:"critical",risks:["Not synced 120 days","Missing 23 updates","Non-compliant"],owner:"Contractor"},{deviceId:"DEV-005",deviceName:"ANDROID-USER-023",riskScore:62,severity:"medium",risks:["Missing 5 updates","Non-compliant","60 days inactive"],owner:"BYOD User"}],Ma=[{id:"ca-001",name:"Require Compliant Device - All Users",enabled:!0,enforcedDevices:821,nonCompliantBlocked:26,coverage:96.9},{id:"ca-002",name:"Block Unmanaged Devices",enabled:!0,blockedDevices:34,coverage:100},{id:"ca-003",name:"Require MFA + Compliant Device",enabled:!0,enforcedDevices:621,coverage:73.3},{id:"ca-004",name:"Require Hybrid Joined Devices",enabled:!1,coverage:0}],Nt=[{id:"config-001",name:"Windows 11 Security Baseline",assigned:512,compliant:498,nonCompliant:14,conflicts:0},{id:"config-002",name:"Microsoft Defender Configuration",assigned:821,compliant:815,nonCompliant:6,conflicts:2},{id:"config-003",name:"Password Policy - 14 Characters",assigned:847,compliant:789,nonCompliant:58,conflicts:1},{id:"config-004",name:"Browser Security Policy",assigned:621,compliant:601,nonCompliant:20,conflicts:0}],Ra={windowsBaseline:{compliant:498,partiallyCompliant:12,nonCompliant:2,score:96},defenderBaseline:{compliant:815,partiallyCompliant:4,nonCompliant:2,score:99},edgeBaseline:{compliant:456,partiallyCompliant:45,nonCompliant:34,score:87},msAppsBaseline:{compliant:821,partiallyCompliant:18,nonCompliant:8,score:98}},je=[{deviceId:"DEV-001",name:"LAPTOP-CHEN-001",encryptionScore:100,complianceScore:100,patchScore:95,epScore:98,healthScore:98,riskLevel:"low"},{deviceId:"DEV-002",name:"LAPTOP-AISHA-001",encryptionScore:100,complianceScore:100,patchScore:98,epScore:96,healthScore:98,riskLevel:"low"},{deviceId:"DEV-003",name:"SURFACE-PRIYA-001",encryptionScore:0,complianceScore:45,patchScore:32,epScore:78,healthScore:39,riskLevel:"high"},{deviceId:"DEV-006",name:"LAPTOP-UNUSED-001",encryptionScore:0,complianceScore:20,patchScore:5,epScore:45,healthScore:17,riskLevel:"critical"}],lt=[{id:"rec-001",priority:"critical",title:"Enable BitLocker on SURFACE-PRIYA-001",category:"Encryption",impact:"Security",effort:"low",status:"open"},{id:"rec-002",priority:"critical",title:"Decommission LAPTOP-UNUSED-001 (45 days inactive)",category:"Lifecycle",impact:"Risk",effort:"low",status:"open"},{id:"rec-003",priority:"critical",title:"Patch 23 devices with critical updates",category:"Patching",impact:"Security",effort:"medium",status:"open"},{id:"rec-004",priority:"high",title:"Deploy ASR rules to 260 devices",category:"Endpoint Protection",impact:"Security",effort:"high",status:"open"},{id:"rec-005",priority:"high",title:"Enable SmartScreen on 146 devices",category:"Endpoint Protection",impact:"Security",effort:"low",status:"open"},{id:"rec-006",priority:"high",title:"Assign compliance policy to 34 unmanaged devices",category:"Compliance",impact:"Governance",effort:"low",status:"open"},{id:"rec-007",priority:"medium",title:"Update Teams app on 8 devices",category:"App Management",impact:"Stability",effort:"low",status:"open"},{id:"rec-008",priority:"medium",title:"Review and remove 15 unauthorized applications",category:"App Management",impact:"Security",effort:"medium",status:"open"},{id:"rec-009",priority:"medium",title:"Create Fast update ring for 200 pilot devices",category:"Patching",impact:"Testing",effort:"high",status:"open"},{id:"rec-010",priority:"medium",title:"Enforce Hybrid Join for corporate devices",category:"Device Management",impact:"Security",effort:"high",status:"open"}],Ia=[{keywords:["device health","health score","device posture"],response:`**Device Health Assessment — Tenant Overview**

📊 **Overall Health Score: 74/100** (Good)

**Breakdown by component:**
- Encryption: 95.7% ✅ (Excellent)
- Compliance: 98.2% ✅ (Excellent)
- Patching: 87.4% ⚠️ (Good, target 95%)
- Endpoint Protection: 94.2% ✅ (Excellent)

**At-Risk Devices (3 critical):**
1. LAPTOP-UNUSED-001 — Health 17/100 (inactive 45 days)
2. MAC-CONTRACTOR-001 — Health 18/100 (inactive 120 days)
3. SURFACE-PRIYA-001 — Health 39/100 (unencrypted, unpatched)

**Immediate actions:**
1. Decommission inactive devices
2. Patch SURFACE-PRIYA-001 (12 missing updates)
3. Enable BitLocker on 46 unencrypted Windows devices

→ Navigate to **Intune → Device Health** for detailed per-device scores.`},{keywords:["patch","update","windows update","security update"],response:`**Patch Management Status — Update Rings**

⚠️ **87.4% devices patched** (target: 95%+)

**Outstanding updates:**
- Critical: 23 devices (avg 3 days behind)
- Security: 58 devices (avg 8 days behind)
- Quality: 142 devices (avg 12 days behind)

**Highest-risk devices:**
1. LAPTOP-UNUSED-001 — 47 updates missing (92 days behind)
2. MAC-CONTRACTOR-001 — 23 updates missing (120 days behind)
3. SURFACE-PRIYA-001 — 12 updates missing (15 days behind)

**Recommendation:**
1. Create Fast ring (1 week): 200 pilot devices
2. Create Broad ring (2 weeks): 400 standard devices
3. Create Final ring (4 weeks): 247 conservative users
4. Force sync on high-risk devices

→ **Intune → Patch Management** to review update rings and create deployment schedule.`},{keywords:["bitlocker","encryption","device encryption"],response:`**Device Encryption Status — BitLocker & Full Disk Encryption**

✅ **95.7% encryption coverage** (847 / 847 devices)
- Windows encrypted: 801 / 512 (96.3%)
- macOS encrypted: 187 / 187 (100%) ✓
- iOS encrypted: 92 / 92 (100%) ✓
- Android encrypted: 40 / 42 (95.2%)

❌ **46 Windows devices unencrypted:**
1. SURFACE-PRIYA-001 — No BitLocker
2. LAPTOP-UNUSED-001 — Not synced (encryption policy may not have applied)
3. 44 other devices pending BitLocker deployment

**Encryption errors: 3 devices**
- Failed to escrow recovery keys to Entra ID

**Recommended actions:**
1. Force BitLocker deployment on 46 unencrypted devices
2. Troubleshoot 3 devices with escrow errors
3. Review recovery key escrow process

→ **Intune → Endpoint Security → Encryption** for BitLocker management.`},{keywords:["attack surface reduction","asr","endpoint protection"],response:`**Attack Surface Reduction (ASR) Deployment Status**

📊 **Coverage: 69.3%** (587 of 847 devices)

**Currently deployed (4 rules):**
✓ Block execution of potentially obfuscated scripts
✓ Block Office apps from creating child processes
✓ Block Office apps from injecting code
✓ Block JavaScript or VBScript from launching downloaded executable content

**Missing critical rules (260 devices not covered):**
❌ Block Office communication app from creating child processes
❌ Block creation of executable content
❌ Use advanced protection against ransomware

**High-priority devices without ASR:**
- SURFACE-PRIYA-001, LAPTOP-UNUSED-001, and 258 others

**Recommended actions:**
1. Deploy all 7 ASR rules to remaining 260 devices
2. Monitor for application compatibility issues (2-week rollout)
3. Enable ransomware protection rule on high-risk devices

→ **Intune → Endpoint Security → Attack Surface Reduction** to deploy rules.`},{keywords:["compliance","non-compliant","device compliance"],response:`**Device Compliance Status — Policy Assessment**

✅ **98.2% compliant** (821 of 847 devices)

**Non-compliant devices (26 total):**
- Windows: 14 non-compliant (512 total)
- macOS: 1 non-compliant (187 total)
- iOS: 1 non-compliant (92 total)
- Android: 2 non-compliant (42 total)
- Linux: 0 non-compliant (14 total)

**Common compliance failures:**
1. Missing encryption (SURFACE-PRIYA-001)
2. Missing security updates (LAPTOP-UNUSED-001, MAC-CONTRACTOR-001)
3. Missing firewall configuration (5 devices)
4. Password policy violation (ANDROID-USER-023)

**Unmanaged devices: 34** (not assigned compliance policy)

**Recommended actions:**
1. Assign compliance policies to 34 unmanaged devices
2. Force remediation on SURFACE-PRIYA-001 (enable BitLocker)
3. Review 5 devices with firewall configuration issues
4. Force password reset on ANDROID-USER-023

→ **Intune → Device Compliance** for policy assignment.`},{keywords:["risk","risky device","high risk","critical risk"],response:`**Device Risk Assessment — Critical & High-Risk Devices**

🔴 **Critical Risk (2 devices):**
1. LAPTOP-UNUSED-001 (Risk Score: 95/100)
   - Not synced: 45 days
   - Missing 47 updates (92 days behind)
   - No BitLocker
   - Non-compliant
   → **Action:** Decommission or force compliance

2. MAC-CONTRACTOR-001 (Risk Score: 92/100)
   - Not synced: 120 days
   - Missing 23 updates
   - Non-compliant
   → **Action:** Decommission contractor device

🟠 **High Risk (1 device):**
1. SURFACE-PRIYA-001 (Risk Score: 78/100)
   - Missing encryption
   - Missing 12 updates
   - Non-compliant
   → **Action:** Enable BitLocker + force patch

🟡 **Medium Risk (1 device):**
1. ANDROID-USER-023 (Risk Score: 62/100)
   - Missing 5 updates
   - Non-compliant
   - Inactive 60 days
   → **Action:** Force update + sync

→ **Intune → Risk Assessment** for full risk scoring matrix.`},{keywords:["application","app management","shadow it"],response:`**Application Inventory & Management**

📱 **Total applications tracked: 6**

**Compliant applications (3):**
✓ Microsoft Office 365 — 847 devices
✓ Microsoft Defender — 821 devices
✓ Microsoft Teams — 821 devices (8 outdated)

**Applications with issues (3):**
⚠️ Adobe Creative Cloud — 234 devices (12 outdated, 3 unauthorized)
⚠️ Slack — 412 devices (12 unauthorized installations)
🔴 VLC Media Player — 15 devices (ALL unauthorized)

**Unauthorized app summary:**
- Total unauthorized installations: 30
- Highest-risk: VLC Media Player (15 instances)

**Recommended actions:**
1. Remove all 15 VLC instances from BYOD devices
2. Review 12 unauthorized Slack installations
3. Update Adobe Creative Cloud on 12 devices
4. Create app deployment policy for standardization
5. Implement app allow-list for corporate devices

→ **Intune → App Management** to view full app catalog and create policies.`},{keywords:["defender","antivirus","endpoint detection"],response:`**Microsoft Defender & Antivirus Coverage**

✅ **Defender Status: 96.9% coverage**

**Enabled:**
- 821 devices with Defender enabled
- Real-time protection: 819 devices
- Cloud protection: 815 devices

**Disabled:**
- 26 devices without Defender

**Defender configuration status:**
- Cloud protection enabled: 815 / 821 (99.3%)
- Real-time scanning enabled: 819 / 821 (99.8%)
- Signature updates: 98.7% current

**Recent threats detected:**
- Last 30 days: 3 malware detections (2 quarantined, 1 remediated)
- False positives: 1

**Recommended actions:**
1. Enable Defender on 26 non-compliant devices
2. Enable cloud protection on 6 devices
3. Monitor 1 device with real-time protection disabled
4. Review false positive from last week

→ **Intune → Endpoint Security → Antivirus** for detailed Defender policy configuration.`},{keywords:["firewall","windows defender firewall"],response:`**Windows Firewall & Network Security**

✅ **95.9% firewall coverage** (812 of 847 devices)

**Status:**
- Enabled: 812 devices
- Disabled: 35 devices (4.1%)

**Disabled firewall breakdown:**
- Windows: 28 devices (all non-compliant)
- macOS: 4 devices
- Linux: 3 devices

**Risk assessment:**
- Devices with firewall disabled + not behind Conditional Access: 12
- Devices with firewall disabled + missing updates: 18

**Recommended actions:**
1. Enable firewall on 35 devices
2. Investigate why 28 Windows devices have firewall disabled
3. Review 12 high-risk devices without firewall + no CA coverage
4. Deploy firewall policy to all Windows devices

→ **Intune → Endpoint Security → Windows Firewall** to configure policy.`}];let st="executive",qe=[],Ot=!1,ge=[],me=[];const Da=[{id:"executive",label:"Executive",icon:"ti-layout-dashboard"},{id:"health",label:"Device Health",icon:"ti-heartbeat"},{id:"compliance",label:"Compliance",icon:"ti-check-circle"},{id:"inventory",label:"Device Inventory",icon:"ti-device-laptop"},{id:"security",label:"Endpoint Security",icon:"ti-shield-check"},{id:"patches",label:"Patch Management",icon:"ti-refresh"},{id:"apps",label:"Applications",icon:"ti-app-window"},{id:"risk",label:"Risk Assessment",icon:"ti-alert-triangle"},{id:"policies",label:"Policies",icon:"ti-settings-2"},{id:"recommendations",label:"Recommendations",icon:"ti-checklist"},{id:"copilot",label:"Intune Copilot",icon:"ti-robot"}];async function Ta(){const e=document.getElementById("page-intune");if(!e)return;e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading real M365 device data...</p></div>',console.log("📡 Fetching real device data from backend...");const t=await Wt(),i=await Pi();t.success?(ge=t.data||it,console.log(`✅ Loaded ${ge.length} real devices from API`)):(console.warn("⚠️ Failed to fetch devices, using simulated data:",t.error),p(`Device data unavailable: ${t.error}. Using demo data.`,"warning"),ge=it),i.success?(me=i.data||tt,console.log(`✅ Loaded ${me.length} real policies from API`)):(console.warn("⚠️ Failed to fetch policies, using simulated data"),me=tt),ui(e)}function ui(e){var n,a;const t=ee,i=Se.filter(r=>r.severity==="critical").length,s=Se.filter(r=>r.severity==="high").length;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-device-laptop"></i> Microsoft Intune Insights</div>
        <div class="page-subtitle">Device Management & Security Assessment · ${t.totalManagedDevices} devices managed · Last sync: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="intune-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="intune-remediate"><i class="ti ti-send"></i> Remediate critical</button>
      </div>
    </div>

    <!-- Top-5 KPI strip -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value info">${t.totalManagedDevices}</div>
        <div class="kpi-label">Managed Devices</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${t.activeDevices} active</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${t.compliancePercentage}%</div>
        <div class="kpi-label">Compliance</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${t.nonCompliant} non-compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${t.patchCompliance}%</div>
        <div class="kpi-label">Patch Status</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${G.criticalUpdatesMissing} critical</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${t.encryptionCoverage}%</div>
        <div class="kpi-label">Encryption</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${i>0?"danger":"warning"}">${i+s}</div>
        <div class="kpi-label">At-Risk Devices</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${i} critical</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${t.deviceHealthScore}</div>
        <div class="kpi-label">Health Score</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">0-100 scale</div>
      </div>
    </div>

    <!-- Sub-navigation -->
    <div class="intune-subnav" id="intune-subnav">
      ${Da.map(r=>`
        <button class="intune-tab-btn ${st===r.id?"active":""}" data-intune-section="${r.id}">
          <i class="ti ${r.icon}"></i><span>${r.label}</span>
          ${r.id==="risk"&&i>0?`<span class="intune-tab-badge red">${i}</span>`:""}
          ${r.id==="compliance"&&t.nonCompliant>0?`<span class="intune-tab-badge red">${t.nonCompliant}</span>`:""}
          ${r.id==="patches"&&G.criticalUpdatesMissing>0?`<span class="intune-tab-badge red">${G.criticalUpdatesMissing}</span>`:""}
          ${r.id==="recommendations"?`<span class="intune-tab-badge amber">${lt.length}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Content -->
    <div id="intune-content" style="margin-top:16px">${qa()}</div>
  `,e.querySelectorAll(".intune-tab-btn").forEach(r=>{r.addEventListener("click",()=>{st=r.dataset.intuneSection,ui(e)})}),(n=e.querySelector("#intune-refresh"))==null||n.addEventListener("click",()=>{const r=e.querySelector("#intune-refresh");r.innerHTML='<span class="spinner dark"></span> Scanning...',r.disabled=!0,setTimeout(()=>{r.innerHTML='<i class="ti ti-refresh"></i> Refresh',r.disabled=!1,p("Intune inventory updated — 847 devices scanned, 4 compliance policies evaluated.","success")},2200)}),(a=e.querySelector("#intune-remediate"))==null||a.addEventListener("click",()=>p("Remediation workflow initiated — ${criticalRisks} critical devices tagged for action.","info")),Wa(e)}function qa(){return({executive:Ft,health:La,compliance:Ga,inventory:Na,security:Oa,patches:Fa,apps:Ua,risk:Ba,policies:za,recommendations:ja,copilot:Ha}[st]||Ft)()}function Ft(){const e=ee,t=Ca;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-layout-dashboard"></i> Device Overview</span>
        </div>
        ${vi([{label:"Total Managed",val:e.totalManagedDevices,cls:"info"},{label:"Active",val:e.activeDevices,cls:"success"},{label:"Inactive",val:e.inactiveDevices,cls:"warning"},{label:"Non-Compliant",val:e.nonCompliant,cls:"danger"},{label:"Unmanaged",val:e.unmanaged,cls:"warning"},{label:"Corporate / BYOD",val:`${e.corporateDevices} / ${e.byodDevices}`,cls:"info"}])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-chart-pie"></i> Platform Distribution</span>
        </div>
        ${["windows","macos","ios","android","linux"].map(i=>{const s=t[i];return`
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px;font-weight:600">
                <span style="text-transform:capitalize">${i}</span>
                <span>${s.count} (${s.percentage}%)</span>
              </div>
              <div class="score-bar" style="height:8px">
                <div class="score-bar-fill" style="width:${s.percentage}%"></div>
              </div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${s.compliant} compliant · ${s.nonCompliant} non-compliant</div>
            </div>
          `}).join("")}
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-alert-triangle"></i> Critical Issues Summary</span>
      </div>
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${Se.filter(i=>i.severity==="critical").length} critical risk devices</strong> require immediate attention</span>
      </div>
      ${Se.filter(i=>i.severity==="critical").map(i=>`
        <div style="padding:8px 10px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border-radius:var(--border-radius-md);margin-bottom:6px;font-size:11px">
          <div style="font-weight:700">${i.deviceName}</div>
          <div style="font-size:10px;margin-top:2px">Risk: ${i.riskScore}/100 · ${i.risks.join(" · ")}</div>
        </div>
      `).join("")}
    </div>

    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-heartbeat"></i> Security Baseline Compliance</span>
        </div>
        ${["windowsBaseline","defenderBaseline","edgeBaseline","msAppsBaseline"].map((i,s)=>{const n=Ra[i];return`
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px;font-weight:600">
                <span>${["Windows","Defender","Edge","M365 Apps"][s]}</span>
                <span style="color:${n.score>=90?"var(--clr-success-text)":"var(--clr-warning-text)"}">${n.score}/100</span>
              </div>
              <div class="score-bar" style="height:8px">
                <div class="score-bar-fill ${n.score>=90?"success":"warning"}" style="width:${n.score}%"></div>
              </div>
            </div>
          `}).join("")}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-chart-line"></i> Top Recommendations</span>
        </div>
        ${lt.filter(i=>i.priority==="critical").slice(0,4).map(i=>`
          <div style="display:flex;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
            <span class="badge danger" style="flex-shrink:0;min-width:56px;justify-content:center">${i.priority}</span>
            <span style="flex:1">${i.title}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `}function La(){const e=ee;return Math.round(je.reduce((t,i)=>t+i.healthScore,0)/je.length),`
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value warning">${e.deviceHealthScore}</div>
        <div class="kpi-label">Tenant Health Score</div>
        <div style="font-size:10px;margin-top:3px">Range: 0-100 (higher is better)</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${e.encryptionCoverage}%</div>
        <div class="kpi-label">Encryption Coverage</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${e.compliancePercentage}%</div>
        <div class="kpi-label">Compliance Rate</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${e.patchCompliance}%</div>
        <div class="kpi-label">Patch Compliance</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${e.endpointProtection}%</div>
        <div class="kpi-label">Endpoint Protection</div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-title mb-2"><i class="ti ti-heartbeat"></i> Device Health Details</div>
      <table style="width:100%;font-size:11px">
        <thead><tr>
          <th style="width:22%">Device</th>
          <th style="width:12%">Encryption</th>
          <th style="width:12%">Compliance</th>
          <th style="width:12%">Patching</th>
          <th style="width:12%">EP Score</th>
          <th style="width:15%">Health</th>
          <th style="width:15%">Risk Level</th>
        </tr></thead>
        <tbody>
          ${je.map(t=>`
            <tr>
              <td style="font-weight:600">${t.name}</td>
              <td>${t.encryptionScore}</td>
              <td>${t.complianceScore}</td>
              <td>${t.patchScore}</td>
              <td>${t.epScore}</td>
              <td><span class="badge ${t.healthScore>=80?"success":t.healthScore>=60?"warning":"danger"}">${t.healthScore}/100</span></td>
              <td><span class="badge ${t.riskLevel==="low"?"success":t.riskLevel==="high"?"danger":"warning"}">${t.riskLevel}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Ga(){return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value success">${ee.compliancePercentage}%</div>
        <div class="kpi-label">Overall Compliance</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">821</div>
        <div class="kpi-label">Compliant Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${ee.nonCompliant}</div>
        <div class="kpi-label">Non-Compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">0</div>
        <div class="kpi-label">Pending Evaluation</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${ee.unmanaged}</div>
        <div class="kpi-label">Unmanaged Devices</div>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:30%">Policy</th>
          <th style="width:15%">Assigned</th>
          <th style="width:15%">Compliant</th>
          <th style="width:15%">Non-Compliant</th>
          <th style="width:15%">Pending</th>
          <th style="width:10%">Coverage</th>
        </tr></thead>
        <tbody>
          ${(me.length>0?me:tt).map(e=>`
            <tr>
              <td style="font-weight:600">${e.name}</td>
              <td>${e.assignedDevices}</td>
              <td style="color:var(--clr-success-text);font-weight:600">${e.compliant}</td>
              <td style="color:var(--clr-danger-text);font-weight:600">${e.nonCompliant}</td>
              <td>${e.pending}</td>
              <td><span class="badge success">${e.coverage}%</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Na(){return`
    <div class="filter-bar mb-3">
      <select class="form-select" style="min-width:120px">
        <option>All Compliance</option>
        <option>Compliant</option>
        <option>Non-Compliant</option>
      </select>
      <select class="form-select" style="min-width:100px">
        <option>All Types</option>
        <option>Windows</option>
        <option>macOS</option>
        <option>iOS</option>
        <option>Android</option>
      </select>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table style="font-size:11px">
        <thead><tr>
          <th style="width:15%">Device Name</th>
          <th style="width:10%">Type</th>
          <th style="width:12%">Model</th>
          <th style="width:10%">OS Version</th>
          <th style="width:12%">Last Sync</th>
          <th style="width:12%">Owner</th>
          <th style="width:12%">Compliance</th>
          <th style="width:7%">Encryption</th>
          <th style="width:7%">Risk</th>
        </tr></thead>
        <tbody>
          ${(ge.length>0?ge:it).slice(0,50).map(e=>`
            <tr>
              <td style="font-weight:600">${e.deviceName||e.name||"Unknown"}</td>
              <td>${e.operatingSystem||e.type||"N/A"}</td>
              <td>${e.model||"N/A"}</td>
              <td style="font-size:10px">${e.osVersion||"N/A"}</td>
              <td style="font-size:10px">${e.lastSyncDateTime?new Date(e.lastSyncDateTime).toLocaleString():e.lastSync||"N/A"}</td>
              <td>${e.userId||e.owner||"N/A"}</td>
              <td><span class="badge ${e.isCompliant===!0||e.compliance==="compliant"?"success":"danger"}">${e.isCompliant===!0?"compliant":"non-compliant"}</span></td>
              <td>${e.encryptionStatus===!0||e.encryption===!0?"✓":"✗"}</td>
              <td><span style="font-weight:700;color:var(--clr-success-text)">🟢</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Oa(){const e=$a;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Antivirus & Firewall</div>
        ${vi([{label:"Defender Enabled",val:e.antivirus.defenderEnabled,cls:"success"},{label:"Real-Time Protection",val:e.antivirus.realTimeProtection,cls:"success"},{label:"Cloud Protection",val:e.antivirus.cloudProtection,cls:"success"},{label:"Firewall Enabled",val:e.firewall.enabled,cls:"success"}])}
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-lock"></i> Protection Coverage</div>
        ${[{label:"Defender",pct:e.antivirus.coverage,target:100},{label:"Firewall",pct:e.firewall.coverage,target:100},{label:"SmartScreen",pct:e.smartscreen.coverage,target:100},{label:"ASR Rules",pct:e.asr.coverage,target:100}].map(t=>`
          <div class="score-bar-row mb-2">
            <span class="score-label" style="min-width:100px">${t.label}</span>
            <div class="score-bar" style="flex:1;height:8px">
              <div class="score-bar-fill ${t.pct>=90?"success":t.pct>=70?"warning":"danger"}" style="width:${t.pct}%"></div>
            </div>
            <span class="score-pct">${t.pct}%</span>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-alert-triangle"></i> Security Gaps</span>
      </div>
      <div style="font-size:11px">
        <div style="margin-bottom:10px">
          <span class="badge warning" style="margin-bottom:4px">ASR Rules Not Deployed</span>
          <div style="color:var(--color-text-secondary);margin-top:4px">260 devices missing advanced endpoint protection rules</div>
        </div>
        <div>
          <span class="badge warning" style="margin-bottom:4px">SmartScreen Gap</span>
          <div style="color:var(--color-text-secondary);margin-top:4px">146 devices without SmartScreen enabled</div>
        </div>
      </div>
    </div>
  `}function Fa(){return`
    <div class="alert-banner danger mb-3">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>${G.criticalUpdatesMissing} devices missing critical updates</strong> — schedule patching immediately</span>
    </div>

    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value warning">${G.compliancePercentage}%</div>
        <div class="kpi-label">Patch Compliance</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${G.criticalUpdatesMissing}</div>
        <div class="kpi-label">Critical Updates</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${G.securityUpdatesMissing}</div>
        <div class="kpi-label">Security Updates</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${G.avgDaysBehind}</div>
        <div class="kpi-label">Avg Days Behind</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title mb-2">Devices with Missing Critical Updates</div>
      ${G.devices.map(e=>`
        <div style="padding:10px;background:var(--clr-${e.severity==="critical"?"danger":"warning"}-bg);color:var(--clr-${e.severity}-text);border-radius:var(--border-radius-md);margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;font-weight:700">${e.name} <span>${e.missingUpdates} updates</span></div>
          <div style="font-size:10px;margin-top:3px">${e.daysBehind} days behind schedule</div>
        </div>
      `).join("")}
    </div>
  `}function Ua(){return`
    <div class="grid-2 mb-3" style="gap:16px">
      ${Pa.map(e=>`
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="font-weight:700">${e.name}</div>
            <span class="badge ${e.status==="compliant"?"success":e.status==="warning"?"warning":"danger"}">${e.status}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
            <div><div style="color:var(--color-text-tertiary)">Deployed</div><div style="font-weight:700">${e.deployedDevices}</div></div>
            <div><div style="color:var(--color-text-tertiary)">Outdated</div><div style="font-weight:700;color:${e.outdated>0?"var(--clr-warning-text)":"var(--clr-success-text)"}">${e.outdated}</div></div>
            <div><div style="color:var(--color-text-tertiary)">Unauthorized</div><div style="font-weight:700;color:${e.unauthorized>0?"var(--clr-danger-text)":"var(--clr-success-text)"}">${e.unauthorized}</div></div>
          </div>
        </div>
      `).join("")}
    </div>
  `}function Ba(){return`
    ${Se.map(e=>`
      <div class="card mb-2" style="border-left:3px solid ${e.severity==="critical"?"var(--clr-danger-text)":"var(--clr-warning-text)"}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div>
            <div style="font-size:14px;font-weight:800;color:${e.severity==="critical"?"var(--clr-danger-text)":"var(--clr-warning-text)"}">${e.riskScore}/100</div>
            <div style="font-weight:700;margin-top:4px">${e.deviceName}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary)">${e.owner}</div>
          </div>
          <span class="badge ${e.severity==="critical"?"danger":"warning"}">${e.severity}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${e.risks.map(t=>`<span class="badge danger" style="font-size:9px">${t}</span>`).join("")}
        </div>
      </div>
    `).join("")}
  `}function za(){return`
    <div class="section-heading">Configuration Policies (${Nt.length})</div>
    ${Nt.map(e=>`
      <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px">${e.name}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:10px">
          <div><span style="color:var(--color-text-tertiary)">Assigned:</span> ${e.assigned}</div>
          <div><span style="color:var(--clr-success-text);font-weight:600">✓</span> ${e.compliant}</div>
          <div><span style="color:var(--clr-danger-text);font-weight:600">✗</span> ${e.nonCompliant}</div>
        </div>
      </div>
    `).join("")}

    <div class="section-heading mt-4">Conditional Access Policies</div>
    ${Ma.map(e=>`
      <div style="padding:10px;background:${e.enabled?"var(--clr-success-bg)":"var(--color-background-secondary)"};border-radius:var(--border-radius-md);margin-bottom:6px">
        <div style="display:flex;justify-content:space-between">
          <span style="font-weight:700">${e.name}</span>
          <span class="badge ${e.enabled?"success":"neutral"}">${e.enabled?"Enabled":"Disabled"}</span>
        </div>
      </div>
    `).join("")}
  `}function ja(){return`
    <div class="card" style="padding:0;overflow:hidden">
      <table>
        <thead><tr>
          <th style="width:11%">Priority</th>
          <th style="width:38%">Recommendation</th>
          <th style="width:12%">Category</th>
          <th style="width:12%">Impact</th>
          <th style="width:12%">Effort</th>
          <th style="width:15%">Status</th>
        </tr></thead>
        <tbody>
          ${lt.map(e=>`
            <tr>
              <td><span class="badge ${e.priority==="critical"?"danger":e.priority==="high"?"warning":"info"}">${e.priority}</span></td>
              <td style="font-size:11px;font-weight:500">${e.title}</td>
              <td><span class="pill">${e.category}</span></td>
              <td style="font-size:11px">${e.impact}</td>
              <td><span class="pill">${e.effort}</span></td>
              <td><span class="badge warning">${e.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Ha(){Ot||(qe=[{role:"ai",text:`**Intune Security Advisor** — Ask me about device health, compliance, security posture, patch status, or remediation recommendations.

**Current state:** 847 managed devices, 98.2% compliant, 74/100 health score, 2 critical risks`}],Ot=!0);const e=["Show device health summary","Patch management status","Encryption coverage","Firewall & protection status","Critical risk devices","Compliance policies"];return`
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="intune-cop-msgs">
        ${qe.map(t=>`
          <div class="chat-msg ${t.role==="ai"?"ai":"user-msg"}" style="max-width:85%;margin-bottom:12px">
            ${t.role==="ai"?'<div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-info-text)"></i> Intune Advisor</div>':'<div class="chat-sender" style="justify-content:flex-end">You</div>'}
            <div class="chat-bubble">${gi(t.text)}</div>
          </div>
        `).join("")}
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:5px;padding:8px 0;border-top:0.5px solid var(--color-border-tertiary)">
        ${e.map(t=>`<button class="suggestion-pill intune-cop-pill" data-q="${t}">${t}</button>`).join("")}
      </div>

      <div class="chat-input-area" style="padding:0;border-top:none;margin-top:4px">
        <textarea class="chat-input" id="intune-cop-input" placeholder="Ask about device health, compliance, security..." rows="1"></textarea>
        <button class="btn btn-primary" id="intune-cop-send"><i class="ti ti-send"></i></button>
      </div>
    </div>
  `}function vi(e){return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${e.map(t=>`
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600">${t.label}</div>
        <div style="font-size:16px;font-weight:700;color:${t.cls==="success"?"var(--clr-success-text)":t.cls==="danger"?"var(--clr-danger-text)":t.cls==="warning"?"var(--clr-warning-text)":"var(--clr-info-text)"}">${t.val}</div>
      </div>
    `).join("")}
  </div>`}function Wa(e){const t=e.querySelector("#intune-content");if(!t)return;const i=t.querySelector("#intune-cop-send"),s=t.querySelector("#intune-cop-input");i&&s&&(i.addEventListener("click",()=>He(e,s)),s.addEventListener("keydown",n=>{n.key==="Enter"&&!n.shiftKey&&(n.preventDefault(),He(e,s))})),t.querySelectorAll(".intune-cop-pill").forEach(n=>{n.addEventListener("click",()=>{const a=t.querySelector("#intune-cop-input");a&&(a.value=n.dataset.q,He(e,a))})})}function He(e,t){const i=t.value.trim();if(!i)return;qe.push({role:"user",text:i}),t.value="";const s=e.querySelector("#intune-cop-msgs");s&&(s.innerHTML+=`<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${i}</div>
    </div>`,s.scrollTop=s.scrollHeight),setTimeout(()=>{const n=i.toLowerCase(),a=Ia.find(o=>o.keywords.some(c=>n.includes(c))),r=(a==null?void 0:a.response)||`Searching Intune data for **"${i}"**...

Based on your question, navigate to the relevant section above. Current status: 847 devices, 98.2% compliant, 2 critical risks.`;qe.push({role:"ai",text:r}),s&&(s.innerHTML+=`<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-info-text)"></i> Intune Advisor</div>
        <div class="chat-bubble">${gi(r)}</div>
      </div>`,s.scrollTop=s.scrollHeight)},600)}function gi(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}const d={currentUser:null,currentPage:"dashboard",settings:{showPSCommands:!0,showTenantResult:!0,autoExpandFailed:!0,showGraphHealth:!0,showZeroTrustScore:!0,showM365ConfigScore:!0,agentSchedule:"daily-0800",agentAlertEmail:"security@contoso.com",agentAlertOnFail:!0,agentDailyDigest:!0,portalEnabled:!0,portal_exchange:!0,portal_teams:!0,portal_sharepoint:!0,portal_onedrive:!0,portal_ext_sharing:!0,portal_user_access:!0,portal_licenses:!0,portal_copilot:!0,portal_power_platform:!0,portal_intune:!0,portal_guest_lifecycle:!0,portal_exchange_groups:!0,portal_shared_mailbox:!0,portal_room_equipment:!0,portal_email_services:!0},cfgAttested:{},cfgAgentLog:[],mcMessages:null},_a={showPSCommands:!0,showTenantResult:!0,autoExpandFailed:!0,showGraphHealth:!0,showZeroTrustScore:!0,showM365ConfigScore:!0,portalEnabled:!0,portal_exchange:!0,portal_teams:!0,portal_sharepoint:!0,portal_onedrive:!0,portal_ext_sharing:!0,portal_user_access:!0,portal_licenses:!0,portal_copilot:!0,portal_power_platform:!0,portal_intune:!0,portal_guest_lifecycle:!0,portal_exchange_groups:!0,portal_shared_mailbox:!0,portal_room_equipment:!0,portal_email_services:!0,agentSchedule:"daily-0800",agentAlertEmail:"security@contoso.com",agentAlertOnFail:!0,agentDailyDigest:!0};function m(){localStorage.setItem("m365ops_settings",JSON.stringify(d.settings)),localStorage.setItem("m365ops_attested",JSON.stringify(d.cfgAttested)),localStorage.setItem("m365ops_agentlog",JSON.stringify(d.cfgAgentLog))}function Va(){try{const e=localStorage.getItem("m365ops_settings");e&&Object.assign(d.settings,JSON.parse(e));const t=localStorage.getItem("m365ops_attested");t&&(d.cfgAttested=JSON.parse(t));const i=localStorage.getItem("m365ops_agentlog");i&&(d.cfgAgentLog=JSON.parse(i))}catch{}}function mi(){Object.assign(d.settings,_a),m()}function yi(e){return d.currentUser?d.currentUser.navAccess.includes(e):!1}function Ja(...e){return d.currentUser&&e.includes(d.currentUser.role)}const Ut={dashboard:qi,msgcenter:ia,applications:ua,intune:Ta,requests:Ni,security:ji,zerotrust:ls,m365config:gs,privaccts:xs,licenses:Cs,agents:$s,approvals:Ms,portal:qs,myreqs:js,chat:_s,graphapi:Ks,sso:Ys,audit:Qs,settings:Xs};async function x(e){if(!yi(e)){p("You do not have access to that page.","error");return}d.currentPage=e,document.querySelectorAll(".page").forEach(s=>s.classList.remove("active"));const t=document.getElementById("page-"+e);t&&t.classList.add("active"),document.querySelectorAll(".nav-item").forEach(s=>s.classList.remove("active"));const i=document.getElementById("n-"+e);i&&i.classList.add("active"),Ut[e]&&await Ut[e]()}async function Bt(){const e=document.getElementById("app"),t=await Ei();if(t){await zt(t);return}e.innerHTML=`
    <div id="login-screen">
      <div class="login-card">
        <div class="login-logo">
          <div class="login-logo-icon"><i class="ti ti-shield-bolt"></i></div>
          <div class="login-logo-text">
            <h1>M365 AgentOps</h1>
            <p>Enterprise Tenant Administration</p>
          </div>
        </div>

        <div style="margin-bottom:16px">
          <p style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:8px;text-transform:uppercase">Real Account</p>
          <button class="btn-ms" id="entra-login-btn" style="width:100%">
            <svg width="16" height="16" viewBox="0 0 21 21" fill="none"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
            Sign in with Microsoft Entra ID
          </button>
          <p style="font-size:9px;color:var(--color-text-tertiary);margin-top:6px">Use your Office 365 account for real M365 data</p>
        </div>

        <div class="login-divider">or Demo</div>

        <p style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:8px;text-transform:uppercase">Demo Account</p>
        <p style="font-size:11px;color:var(--color-text-secondary);margin-bottom:12px;">Test with simulated data:</p>
        <div class="user-tiles">
          ${jt.map(i=>`
            <div class="user-tile" data-user="${i.id}">
              <div class="user-avatar" style="background:${i.color}">${i.initials}</div>
              <div class="user-tile-info">
                <h4>${i.name}</h4>
                <p>${i.email}</p>
                <p style="margin-top:3px"><span class="role-badge ${i.role}">${i.role}</span></p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `,document.getElementById("entra-login-btn").addEventListener("click",async()=>{const i=document.getElementById("entra-login-btn");i.innerHTML='<span class="spinner" style="margin-right:8px"></span> Signing in...',i.disabled=!0;const s=await Ci();s?await zt(s):(i.innerHTML=`
        <svg width="16" height="16" viewBox="0 0 21 21" fill="none"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
        Sign in with Microsoft Entra ID
      `,i.disabled=!1,p("Login cancelled or failed. Try again or use demo account.","warning"))}),document.querySelectorAll(".user-tile").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".user-tile").forEach(s=>s.classList.remove("selected")),i.classList.add("selected"),i.dataset.user}),i.addEventListener("dblclick",async()=>{await Ka(i.dataset.user)})})}async function Ka(e){const t=jt.find(s=>s.id===e);if(!t)return;d.currentUser=t,hi();const i=t.navAccess[0];await x(i),p(`Welcome back, ${t.name}!`,"success")}async function zt(e){const t=(e.name||e.username).split(" ");let i="user";try{console.log(`📡 Determining role for user: ${e.localAccountId}`);const o=await(await fetch("https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/user/role",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:e.localAccountId})})).json();o.success&&(i=o.role,console.log(`✓ User role: ${i}`))}catch(r){console.warn("⚠️ Could not determine role from backend, using default:",r.message),i="user"}const s={super:["dashboard","requests","security","zerotrust","privaccts","m365config","licenses","agents","msgcenter","applications","intune","portal","myreqs","chat","graphapi","sso","audit","settings"],admin:["dashboard","requests","security","zerotrust","privaccts","m365config","licenses","agents","msgcenter","applications","intune","portal","myreqs","chat","audit","settings"],manager:["dashboard","requests","approvals","msgcenter","portal","myreqs","chat","settings"],user:["dashboard","portal","myreqs","chat","settings"]},n={id:e.localAccountId,name:e.name||e.username,email:e.username,role:i,initials:t.map(r=>r[0]).join("").toUpperCase(),color:"#0C447C",isEntraID:!0,account:e,navAccess:s[i]||s.user};d.currentUser=n,hi();const a=n.navAccess[0];await x(a),p(`Welcome, ${n.name}! Role: ${i}`,"success")}function hi(){var t,i;const e=document.getElementById("app");if(e.innerHTML=`
    <div id="app-shell">
      <nav id="sidebar"></nav>
      <div id="main-content">
        <header id="app-header"></header>
        ${((t=d.currentUser)==null?void 0:t.role)==="manager"?`
          <div class="manager-alert-bar">
            <i class="ti ti-alert-triangle"></i>
            <strong>3 requests pending your approval</strong> — including 1 overdue.
            <a href="#" id="alert-approvals-link" style="margin-left:4px;text-decoration:underline;cursor:pointer;">Review now</a>
          </div>
        `:""}
        <div id="page-area">
          ${Ya()}
        </div>
      </div>
    </div>
  `,wi(),Ai(),((i=d.currentUser)==null?void 0:i.role)==="manager"){const s=document.getElementById("alert-approvals-link");s&&s.addEventListener("click",async n=>{n.preventDefault(),await x("approvals")})}}function Ya(){return["dashboard","requests","security","zerotrust","privaccts","m365config","msgcenter","applications","intune","licenses","agents","approvals","portal","myreqs","chat","graphapi","sso","audit","settings"].map(t=>`<div class="page" id="page-${t}"></div>`).join("")}Va();Bt().catch(e=>{console.error("Login render error:",e),Bt()});const fi=Object.freeze(Object.defineProperty({__proto__:null,go:x,hasAccess:yi,isRole:Ja,resetSettings:mi,saveState:m,state:d},Symbol.toStringTag,{value:"Module"}));
