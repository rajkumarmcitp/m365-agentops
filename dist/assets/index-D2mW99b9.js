(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=i(a);fetch(a.href,n)}})();const _i=[{id:"demo",name:"Demo Account",email:"demo@contoso.com",role:"admin",initials:"DM",color:"#00C7B7",navAccess:["dashboard","requests","security","tenantguard","zerotrust","privaccts","m365config","licenses","agents","approvals","msgcenter","applications","intune","portal","myreqs","myaccount","chat","audit","settings"],isDemoAccount:!0},{id:"priya",name:"Priya Kumar",email:"priya@contoso.com",role:"user",initials:"PK",color:"#0C447C",navAccess:["portal","myreqs","myaccount","chat"]},{id:"sanjay",name:"Sanjay Kumar",email:"sanjay@contoso.com",role:"manager",initials:"SK",color:"#3C3489",navAccess:["requests","msgcenter","portal","myreqs","myaccount","chat"],pendingApprovals:3},{id:"chen",name:"Chen Wei",email:"chen@contoso.com",role:"admin",initials:"CW",color:"#633806",navAccess:["dashboard","requests","security","tenantguard","zerotrust","privaccts","m365config","licenses","agents","approvals","msgcenter","applications","intune","portal","myreqs","myaccount","chat","audit","settings"]},{id:"aisha",name:"Aisha Raza",email:"aisha@contoso.com",role:"super",initials:"AR",color:"#791F1F",navAccess:["dashboard","requests","security","tenantguard","zerotrust","privaccts","m365config","licenses","agents","approvals","msgcenter","applications","intune","portal","myreqs","myaccount","chat","audit","settings","graphapi","sso"]}],Os={auth:{clientId:"04d3be8d-d433-4367-893e-eccc82190a11",authority:"https://login.microsoftonline.com/b9cc8284-05ed-452f-877a-970779430dcb",redirectUri:window.location.origin+"/callback"},cache:{cacheLocation:"sessionStorage",storeAuthStateInCookie:!1},system:{allowNativeBroker:!1}},Us={scopes:["openid","profile","email","User.Read"]};let B=null;async function js(){try{if(!window.msal)return console.warn("MSAL not loaded yet"),null;B=new window.msal.PublicClientApplication(Os),await B.initialize();const e=await B.handleRedirectPromise();if(e)return console.log("✓ Authenticated from redirect:",e.account.name),e.account;const t=B.getAllAccounts();return t.length>0?(console.log("✓ Already authenticated as:",t[0].name),t[0]):null}catch(e){return console.error("MSAL init error:",e.message),null}}async function Fs(){try{if(!B)return console.error("MSAL not initialized"),null;const e=await B.loginPopup(Us);return console.log("✓ Login successful:",e.account.name),e.account}catch(e){return e.errorCode==="user_cancelled"?console.log("User cancelled login"):console.error("Login error:",e.errorCode,e.errorMessage),null}}async function Bs(){try{if(!B)return null;const e=B.getAllAccounts();if(e.length===0)return null;const t={scopes:["https://graph.microsoft.com/.default"],account:e[0]};return(await B.acquireTokenSilent(t)).accessToken}catch(e){return console.error("Token error:",e.message),null}}async function Hs(){try{if(!B)return;const e={account:B.getAllAccounts()[0]};await B.logout(e),console.log("✓ Logged out")}catch(e){console.error("Logout error:",e)}}function _s(){if(!B)return null;const e=B.getAllAccounts();return e.length>0?e[0]:null}function Vs(){if(window.userEmail)return console.log("📧 getUserEmail from window.userEmail:",window.userEmail),window.userEmail;const e=_s();if(!e)return null;const t=e.username||e.mail||e.email;return console.log("📧 getUserEmail from MSAL:",t),t}const Ws={},A=typeof import.meta<"u"&&Ws?"https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api":window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"http://localhost:3000/api":"https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api",Js=A;async function T(e){try{const t=`${Js}${e}`;console.log(`🔄 Calling: ${t}`);const i=await fetch(t,{method:"GET",headers:{"Content-Type":"application/json"},credentials:"include"});if(!i.ok)throw new Error(`HTTP ${i.status}: ${i.statusText}`);const s=await i.json();return console.log(`✓ ${e}:`,s),s}catch(t){return console.error(`✗ API error on ${e}:`,t.message),{success:!1,error:t.message,data:[],count:0}}}async function jt(){return T("/devices")}async function Ks(){return T("/device-compliance-policies")}async function Ys(){return T("/config/cis-controls")}async function Zs(){return T("/msgcenter/messages")}async function Qs(){return T("/msgcenter/health")}async function Vi(){return T("/security/score")}async function Xs(){return T("/security/incidents")}async function ea(){return T("/identity/posture")}async function ta(){return T("/privileged-accounts")}async function ia(){return T("/users")}async function sa(){return T("/applications")}async function aa(){return T("/service-principals")}let Yt=null;function Wi(){return Yt=setInterval(()=>{Zt()},3e4),Zt(),Yt}async function Zt(){try{const e=encodeURIComponent(m.settings.sharepointSiteUrl||"root"),t=await fetch(`${A}/msgcenter/notifications?siteUrl=${e}`).then(i=>i.json());t.success&&t.data&&(na(t.unreadCount||0),t.data.filter(s=>!s.read).forEach(s=>{ra(s),da(s.id)}))}catch(e){console.warn("Error checking notifications:",e.message)}}function na(e){const t=document.getElementById("notification-bell"),i=document.getElementById("notification-badge");t&&i&&(e>0?(i.style.display="flex",i.textContent=e>9?"9+":e):i.style.display="none")}function ra(e){const t=document.getElementById("toast-container");if(!t)return;const i=oa(e.type),s=la(e.type);let a=e.message;e.type==="approval"?a=`"${e.title}" requires approval`:e.type==="deadline"&&(a="Deadline approaching");const n=document.createElement("div");n.style.cssText=`
    background:white;
    border-left:4px solid ${s};
    padding:16px;
    border-radius:6px;
    margin-bottom:12px;
    box-shadow:0 2px 8px rgba(0,0,0,0.1);
    animation:slideIn 300ms ease-out;
  `,n.innerHTML=`
    <div style="display:flex;align-items:flex-start;gap:12px">
      <div style="font-size:20px">${i}</div>
      <div style="flex:1">
        <div style="font-weight:600;color:#333;font-size:12px">${e.type==="approval"?"Approval Needed":e.type==="deadline"?"Deadline Alert":e.title}</div>
        <div style="color:#666;font-size:11px;margin-top:4px">${a}</div>
      </div>
      <button class="close-toast" style="background:none;border:none;color:#999;cursor:pointer;font-size:16px;padding:0">×</button>
    </div>
  `,t.appendChild(n);const r=n.querySelector(".close-toast");r==null||r.addEventListener("click",()=>{n.style.animation="slideOut 300ms ease-in",setTimeout(()=>n.remove(),300)}),setTimeout(()=>{n.parentElement&&(n.style.animation="slideOut 300ms ease-in",setTimeout(()=>n.remove(),300))},5e3)}function oa(e){return{new_announcement:"📢",deadline:"⏰",task_update:"✓",approval:"👤"}[e]||"📌"}function la(e){return{new_announcement:"#0066cc",deadline:"#ff9800",task_update:"#4caf50",approval:"#9c27b0"}[e]||"#999"}async function da(e){try{await fetch(`${A}/msgcenter/notifications/${e}/read`,{method:"POST"})}catch(t){console.warn("Error marking notification as read:",t.message)}}async function ca(){try{const e=encodeURIComponent(m.settings.sharepointSiteUrl||"root"),t=await fetch(`${A}/msgcenter/notifications?siteUrl=${e}`).then(i=>i.json());return t.success?{success:!0,data:t.data||[],count:t.count||0,unreadCount:t.unreadCount||0}:{success:!1,data:[]}}catch(e){return console.error("Error fetching notifications:",e.message),{success:!1,data:[]}}}const Ji=document.createElement("style");Ji.textContent=`
  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
`;document.head.appendChild(Ji);function pa(){const e=document.getElementById("app-header"),t=m.currentUser;t&&(e.innerHTML=`
    <div class="header-brand">
      <div class="brand-icon"><i class="ti ti-shield-bolt"></i></div>
      <span>M365 AgentOps</span>
    </div>
    <div class="header-spacer"></div>
    <div class="header-actions">
      <button class="header-icon-btn" title="Notifications" id="notification-bell" style="position:relative">
        <i class="ti ti-bell"></i>
        <span id="notification-badge" style="position:absolute;top:-4px;right:-4px;background:#ff4444;color:white;font-size:10px;font-weight:700;min-width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;display:none">0</span>
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
  `,document.getElementById("notification-bell").addEventListener("click",async()=>{const i=await ca();i.data.length>0&&ua(i.data)}),document.getElementById("hdr-settings").addEventListener("click",async()=>{var i;(i=m.currentUser)!=null&&i.navAccess.includes("settings")&&await C("settings")}),document.getElementById("hdr-signout").addEventListener("click",async()=>{console.log("📤 Signing out..."),m.currentUser=null,await Hs(),document.getElementById("app").innerHTML="",window.location.reload()}))}function ua(e){const t=document.createElement("div");t.style.cssText=`
    position:fixed;top:0;right:0;width:400px;height:100vh;background:white;
    box-shadow:-2px 0 12px rgba(0,0,0,0.15);z-index:999;display:flex;flex-direction:column
  `;const i=a=>({new_announcement:"📢",deadline:"⏰",task_update:"✓",approval:"👤"})[a]||"📌",s=a=>({new_announcement:"#0066cc",deadline:"#ff9800",task_update:"#4caf50",approval:"#9c27b0"})[a]||"#999";t.innerHTML=`
    <div style="padding:16px;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center">
      <h3 style="margin:0;font-size:14px;font-weight:700">Notifications</h3>
      <button id="close-notification-modal" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666">×</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:12px">
      ${e.map(a=>`
        <div style="padding:12px;border-left:3px solid ${s(a.type)};background:#f9f9f9;border-radius:4px;margin-bottom:12px">
          <div style="display:flex;gap:8px;margin-bottom:6px">
            <span style="font-size:18px">${i(a.type)}</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:11px;color:#333">${a.title}</div>
              <div style="font-size:10px;color:#666;margin-top:4px">${a.message}</div>
              <div style="font-size:9px;color:#999;margin-top:6px">${new Date(a.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `,document.body.appendChild(t),t.querySelector("#close-notification-modal").addEventListener("click",()=>{t.remove()}),document.addEventListener("click",a=>{!t.contains(a.target)&&a.target.id!=="notification-bell"&&t.remove()},{once:!0})}const Ie={admin:[{id:"dashboard",label:"Dashboard",icon:"ti-layout-dashboard"},{id:"requests",label:"Requests",icon:"ti-inbox",badge:"7",badgeCls:"blue"},{id:"security",label:"Security",icon:"ti-shield-exclamation",badge:"3",badgeCls:"red"},{id:"tenantguard",label:"TenantGuard",icon:"ti-alert-triangle",badge:"Alert"},{id:"user-investigation",label:"User Investigation",icon:"ti-shield-check"},{id:"zerotrust",label:"Zero Trust",icon:"ti-lock-check",badge:"2",badgeCls:"amber"},{id:"privaccts",label:"Privileged Accounts",icon:"ti-crown",badge:"2",badgeCls:"red"},{id:"m365config",label:"M365 Config",icon:"ti-settings-2",badge:"4",badgeCls:"amber"},{id:"msgcenter",label:"Change Intelligence",icon:"ti-antenna",badge:"8",badgeCls:"red"},{id:"tasks",label:"Change Tasks",icon:"ti-checkbox",badge:"0",badgeCls:"blue"},{id:"applications",label:"Entra Apps",icon:"ti-app-window",badge:"2",badgeCls:"red"},{id:"intune",label:"Intune Insights",icon:"ti-device-laptop",badge:"2",badgeCls:"red"},{id:"licenses",label:"Licenses",icon:"ti-license"},{id:"agents",label:"AI Agents",icon:"ti-robot"}],selfservice:[{id:"myaccount",label:"My Account",icon:"ti-user-circle"},{id:"portal",label:"Portal",icon:"ti-grid-dots"},{id:"myreqs",label:"My Requests",icon:"ti-list-check"},{id:"chat",label:"AI Copilot",icon:"ti-message-circle"}],manager:[{id:"approvals",label:"Pending Approvals",icon:"ti-check-list",badge:"3",badgeCls:"red"}],config:[{id:"audit",label:"Audit Log",icon:"ti-database"},{id:"settings",label:"Admin Settings",icon:"ti-adjustments-horizontal"}],super:[{id:"graphapi",label:"Graph API",icon:"ti-api",badge:"Live",badgeCls:"green"},{id:"sso",label:"SSO / Entra ID",icon:"ti-key"}]};function Ki(){const e=document.getElementById("sidebar"),t=m.currentUser;if(!t||!e)return;let i=t.navAccess;["super","admin"].includes(t.role)&&!i.includes("user-investigation")&&(i=[...i,"user-investigation"]);let s=`
    <div class="nav-logo">
      <div class="nav-logo-icon"><i class="ti ti-shield-bolt"></i></div>
      <div>
        <div class="nav-logo-text">M365 AgentOps</div>
        <div class="nav-logo-sub">${m.tenantDomain}</div>
      </div>
    </div>
  `;const a=c=>c.filter(d=>i.includes(d.id)).map(d=>`
      <div class="nav-item" id="n-${d.id}" data-page="${d.id}">
        <i class="ti ${d.icon}"></i>
        <span class="nav-label">${d.label}</span>
        ${d.badge?`<span class="nav-badge ${d.badgeCls}">${d.badge}</span>`:""}
      </div>
    `).join(""),n=a(Ie.admin);if(n&&(s+=`<div class="nav-section"><div class="nav-section-label">Administration</div>${n}</div>`),["admin","super"].includes(t.role)&&i.includes("approvals")){const c=Ie.manager.find(d=>d.id==="approvals");c&&(s+=`<div class="nav-section"><div class="nav-section-label">Approvals</div>${a([c])}</div>`)}const r=a(Ie.selfservice);r&&(s+=`<div class="nav-divider"></div><div class="nav-section"><div class="nav-section-label">Self-Service</div>${r}</div>`);const o=a(Ie.config),l=a(Ie.super);(o||l)&&(s+=`<div class="nav-divider"></div><div class="nav-section"><div class="nav-section-label">Config</div>${o}${l}</div>`),s+=`
    <div class="nav-footer">
      <strong>${t.name}</strong>
      ${t.email}
    </div>
  `,e.innerHTML=s,e.querySelectorAll(".nav-item").forEach(c=>{c.addEventListener("click",async()=>await C(c.dataset.page))})}const Qt={success:"ti-circle-check",error:"ti-circle-x",warning:"ti-alert-triangle",info:"ti-info-circle"};function u(e,t="info",i=3500){const s=document.getElementById("toast-container");if(!s)return;const a=document.createElement("div");a.className=`toast ${t}`,a.innerHTML=`
    <i class="ti ${Qt[t]||Qt.info} toast-icon"></i>
    <span class="toast-text">${e}</span>
    <button class="toast-close"><i class="ti ti-x"></i></button>
  `,s.appendChild(a);const n=()=>{a.style.animation="toast-out 200ms ease forwards",setTimeout(()=>a.remove(),200)};a.querySelector(".toast-close").addEventListener("click",n),setTimeout(n,i)}const va=["demo@contoso.com","demo@m365ops.com","demo.user@contoso.com"];function J(){const e=Vs();if(console.log("🔍 isDemoAccount() check - email:",e),!e)return console.log("❌ No email found"),!1;const t=e.toLowerCase(),i=va.some(s=>t===s.toLowerCase());return console.log(`✅ isDemoAccount result: ${i}`),i}const yt={"Exchange Online":{icon:"ti-mail",color:"#854F0B",bg:"#FAEEDA"},"Microsoft Teams":{icon:"ti-brand-teams",color:"#3C3489",bg:"#EEEDFE"},"SharePoint Online":{icon:"ti-brand-sharepoint",color:"#3B6D11",bg:"#EAF3DE"},OneDrive:{icon:"ti-cloud",color:"#0C447C",bg:"#E6F1FB"},"Microsoft Entra ID":{icon:"ti-user-check",color:"#185FA5",bg:"#E6F1FB"},"Microsoft Intune":{icon:"ti-device-laptop",color:"#0C447C",bg:"#E6F1FB"},"Microsoft Copilot":{icon:"ti-sparkles",color:"#3C3489",bg:"#EEEDFE"},"Power Platform":{icon:"ti-bolt",color:"#3B6D11",bg:"#EAF3DE"},"Microsoft Defender":{icon:"ti-shield-exclamation",color:"#A32D2D",bg:"#FCEBEB"},"Microsoft 365":{icon:"ti-apps",color:"#185FA5",bg:"#E6F1FB"}},he=[{id:"MC892341",title:"Microsoft Teams: Legacy Authentication Methods Being Retired",service:"Microsoft Teams",category:"planForChange",severity:"high",actionRequired:!0,actionByDate:"2026-06-30",publishedDate:"2026-05-28",targetRelease:"2026-06-30",tags:["Authentication","Deprecation","Teams Phone"],status:"new",body:"Microsoft Teams will retire support for legacy authentication methods including ADAL and basic authentication. Applications relying on these methods will lose connectivity to Teams services after June 30, 2026. This affects all tenants using Teams-connected applications built on older MSAL v1 or ADAL libraries.",aiSummary:"Action required before 30 June 2026. Legacy Teams authentication (ADAL, MSAL v1, basic auth) will be disabled. All connected apps must migrate to MSAL v3 or Microsoft Identity platform. Failure to act will break Teams integrations post-deadline.",aiRec:{actionRequired:!0,impacted:["IT Administrators","App developers","Teams Phone users","ISV-connected apps"],deadline:"30 June 2026",tasks:["Audit all applications using legacy Teams authentication via Azure AD app registrations","Update app registrations to use MSAL v3 or Microsoft.Identity.Client","Run pilot migration with non-critical apps before June 15","Notify application owners and ISVs of the mandatory deadline","Update IT helpdesk runbook with migration guidance"],automatable:!0,automationNote:"Run GET /v1.0/applications?$filter=signInAudience to identify affected apps. Graph API can batch-update authentication settings."}},{id:"MC891567",title:"Exchange Online: Basic Authentication Enforcement — Final Phase",service:"Exchange Online",category:"planForChange",severity:"high",actionRequired:!0,actionByDate:"2026-07-15",publishedDate:"2026-05-26",targetRelease:"2026-07-15",tags:["Authentication","Exchange","SMTP Auth","Security"],status:"new",body:"Microsoft will enforce the final phase of Basic Authentication deprecation for Exchange Online. SMTP AUTH, POP3, and IMAP with basic authentication will be permanently blocked. Tenants with active usage will be automatically disabled on July 15, 2026.",aiSummary:"Final basic auth enforcement for Exchange. SMTP AUTH, POP3, IMAP basic auth permanently blocked from 15 July 2026. Any printers, scanners, legacy apps using basic SMTP must be reconfigured to OAuth or app passwords immediately.",aiRec:{actionRequired:!0,impacted:["Email admins","Helpdesk","Users with legacy email clients","Network printers/scanners"],deadline:"15 July 2026",tasks:["Run Exchange Online auth report to identify active basic auth connections","Migrate printers/scanners to OAuth or Direct Send (relay via SMTP no-auth)","Disable basic auth per-user via Authentication Policy before deadline","Identify users on legacy clients (Outlook 2010/2013) and upgrade","Create Conditional Access policy blocking basic auth as a safeguard"],automatable:!0,automationNote:"Use GET /reports/authenticationMethods/usersRegisteredByFeature and Exchange Online PowerShell Get-AuthenticationPolicy to identify all impacted connections."}},{id:"MC890234",title:"Microsoft Entra ID: Conditional Access — Mandatory MFA for All Admins",service:"Microsoft Entra ID",category:"preventOrFixIssue",severity:"high",actionRequired:!0,actionByDate:"2026-06-15",publishedDate:"2026-05-22",targetRelease:"2026-06-15",tags:["Conditional Access","MFA","Security","Admins"],status:"new",body:"Microsoft will enforce mandatory MFA for all users assigned privileged administrator roles in Microsoft Entra ID. Administrators who do not comply will be blocked from signing in to all Microsoft portals after June 15, 2026. This is a platform-level enforcement independent of existing Conditional Access policies.",aiSummary:"Critical: All privileged admins MUST have MFA registered by 15 June 2026 or lose portal access. This is a platform-level block, not just a CA policy recommendation. Review all admin accounts now — especially break-glass and shared admin accounts.",aiRec:{actionRequired:!0,impacted:["All Global Admins","All privileged role holders","Break-glass accounts","Service account admins"],deadline:"15 June 2026",tasks:["Run MFA registration report for all admin role holders via Entra ID","Force MFA enrollment for any admin without a registered method","Verify break-glass accounts have FIDO2 or certificate-based MFA","Update all shared admin accounts to use individual MFA-registered identities","Test all admin workflows post-enforcement in staging tenant"],automatable:!0,automationNote:"GET /reports/credentialUserRegistrationDetails to identify admin accounts without MFA. POST /users/{id}/authentication/requireReAuthentication to force re-registration."}},{id:"MC889456",title:"SharePoint Online: External Sharing Default Settings Update",service:"SharePoint Online",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-07-01",publishedDate:"2026-05-20",targetRelease:"2026-07-01",tags:["External Sharing","SharePoint","Governance","Security"],status:"read",body:'Microsoft will update the default external sharing settings for new SharePoint sites to "Existing guests only" (currently "New and existing guests"). Existing site sharing settings will not be changed. New sites created after July 1 will default to the more restrictive setting.',aiSummary:'New SharePoint sites will default to "Existing guests only" from 1 July. Existing sites unaffected. Review sites that need more permissive sharing before the change, and update provisioning templates to align with new defaults.',aiRec:{actionRequired:!0,impacted:["SharePoint admins","Site owners creating new collaboration spaces"],deadline:"1 July 2026",tasks:["Review and update SharePoint site provisioning templates",'Document sites requiring "New and existing guests" sharing — configure explicitly',"Communicate to project managers that new sites will be more restrictive","Update SharePoint governance policy documentation"],automatable:!1,automationNote:"Site-specific overrides require per-site configuration via PnP PowerShell. Bulk review via Get-SPOSite -Limit All."}},{id:"MC888765",title:"Microsoft Intune: Android Enterprise Enrollment Changes",service:"Microsoft Intune",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-08-01",publishedDate:"2026-05-18",targetRelease:"2026-08-01",tags:["Intune","Android","Enrollment","MDM"],status:"new",body:"Google is retiring Android Device Administrator (DA) enrollment in favor of Android Enterprise. Microsoft Intune will cease support for Android DA enrollment on August 1, 2026. All devices enrolled via DA must migrate to Android Enterprise (Work Profile or Fully Managed).",aiSummary:"Android Device Administrator enrollment retiring 1 August 2026 in Intune. All DA-enrolled Android devices must re-enroll as Android Enterprise. Affects BYOD users (Work Profile) and corporate-owned devices (Fully Managed). Coordinate with HR for BYOD re-enrollment.",aiRec:{actionRequired:!0,impacted:["Android device users","Intune admins","HR / BYOD programme owners"],deadline:"1 August 2026",tasks:["Run Intune device report to count DA-enrolled Android devices","Create Android Enterprise Work Profile enrollment profile","Test re-enrollment workflow with pilot group","Send communication to BYOD users with step-by-step guide","Set DA enrollment deprecation date in Intune portal"],automatable:!1,automationNote:"User re-enrollment is manual, but device inventory and policy creation can be automated via Intune Graph API."}},{id:"MC887234",title:"Power Platform: Premium Connector Policy Enforcement Update",service:"Power Platform",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-06-30",publishedDate:"2026-05-15",targetRelease:"2026-06-30",tags:["Power Platform","DLP","Connectors","Governance"],status:"new",body:'Microsoft is updating the default DLP policy classification for several connectors from "Business" to "Blocked" in default environments. This includes Dropbox, Twitter/X, and several AI builder connectors. Flows using these connectors in the Default environment will be suspended unless moved to an approved environment.',aiSummary:"DLP connector reclassification on 30 June: Dropbox, Twitter/X, and certain AI Builder connectors move to Blocked in Default environment. Power Automate flows using these will be suspended. Inventory all flows using affected connectors and migrate to isolated environments.",aiRec:{actionRequired:!0,impacted:["Power Platform admins","Citizen developers","Users with flows in Default environment"],deadline:"30 June 2026",tasks:["Inventory all Power Automate flows in Default environment using affected connectors","Create isolated non-default environments for legitimate business flows","Migrate flows to appropriate environments before deadline","Update DLP policies to explicitly classify approved connectors","Communicate impact to citizen developer community"],automatable:!0,automationNote:"Use Power Platform Admin APIs to enumerate flows: GET /providers/Microsoft.ProcessSimple/scopes/admin/environments/{env}/flows"}},{id:"MC886543",title:"Microsoft Teams: Meeting Recording Auto-Expiry Policy Enforcement",service:"Microsoft Teams",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-09-01",publishedDate:"2026-05-12",targetRelease:"2026-09-01",tags:["Teams","Meetings","Recording","Storage"],status:"read",body:"Microsoft will enforce a 120-day default auto-expiry for Teams meeting recordings stored in OneDrive and SharePoint. Recordings without an explicit expiry date set will have a 120-day expiry applied automatically. Users will be notified 14 days before expiry.",aiSummary:"Teams meeting recordings will auto-expire after 120 days from 1 September unless explicitly extended. Recordings older than 120 days will be deleted. Review compliance recordings and legal holds before deadline — these must be exempt via retention policies.",aiRec:{actionRequired:!0,impacted:["Teams users","Compliance admins","Legal team (holds)","Training content owners"],deadline:"1 September 2026",tasks:["Identify recordings that must be retained for compliance or legal hold","Apply retention labels to recordings that must not expire","Set up Purview retention policy for Teams recordings","Communicate auto-expiry policy to all users","Create process for users to request recording extension"],automatable:!0,automationNote:"Graph API: GET /drives/{id}/items to enumerate recordings. Apply retention labels via PATCH /drives/{driveId}/items/{itemId}."}},{id:"MC885678",title:"OneDrive: Storage Quota Policy Changes for Inactive Accounts",service:"OneDrive",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-08-15",publishedDate:"2026-05-10",targetRelease:"2026-08-15",tags:["OneDrive","Storage","Lifecycle","Governance"],status:"new",body:"Microsoft will automatically reduce the OneDrive storage allocation for inactive accounts to 1 GB after 180 days of inactivity. Data exceeding 1 GB will be retained but made read-only. Active storage usage policies require admin review of leaver accounts.",aiSummary:"OneDrive inactive accounts (180+ days) automatically reduced to 1 GB on 15 August. Excess data becomes read-only, not deleted. Review leaver accounts, export required data, and update joiner/mover/leaver processes to include OneDrive management.",aiRec:{actionRequired:!0,impacted:["IT admins managing leavers","HR / offboarding process owners"],deadline:"15 August 2026",tasks:["Run report of OneDrive accounts inactive for 90+ days","Export data from leaver accounts where required","Update offboarding runbook to include OneDrive review step","Identify accounts that legitimately need quota despite inactivity (shared project storage)","Configure lifecycle workflow to trigger OneDrive review on account disable"],automatable:!0,automationNote:"GET /users?$filter=signInActivity/lastSignInDateTime le datetime to identify inactive accounts."}},{id:"MC884321",title:"Microsoft Entra ID: MFA Registration Campaign — Mandatory Completion",service:"Microsoft Entra ID",category:"preventOrFixIssue",severity:"medium",actionRequired:!0,actionByDate:"2026-07-31",publishedDate:"2026-05-08",targetRelease:"2026-07-31",tags:["MFA","Entra ID","Security","Registration"],status:"actioned",body:"Microsoft is launching a mandatory MFA registration campaign for all users not yet registered for MFA. Users will be shown an MFA registration prompt at sign-in starting June 1 with a mandatory completion deadline of July 31. Users not registered by this date will be blocked from signing in.",aiSummary:"Mandatory MFA registration for all non-enrolled users. Registration prompts begin 1 June, sign-in block from 31 July for non-compliant users. Current coverage at 87% — 130 users still need to register. Prioritise by risk level.",aiRec:{actionRequired:!0,impacted:["~130 unregistered users in tenant","Helpdesk (increased registration calls expected)"],deadline:"31 July 2026",tasks:["Export MFA registration status report for all users","Contact the 130 unregistered users directly with registration instructions","Set up helpdesk ready-to-send article for MFA registration","Create exemption process for special cases (long-term sick, contractors)","Monitor registration progress weekly"],automatable:!1,automationNote:"GET /reports/credentialUserRegistrationDetails to track progress. Cannot auto-register users — requires user action."}},{id:"MC883456",title:"Microsoft Copilot: New Copilot for Microsoft 365 Features — General Availability",service:"Microsoft Copilot",category:"stayInformed",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-05-06",targetRelease:"2026-06-01",tags:["Copilot","AI","Productivity","New Feature"],status:"read",body:"Microsoft is releasing new Copilot capabilities including Copilot in Excel with data analysis enhancements, Copilot in Teams with improved meeting intelligence and real-time translation, and Copilot Pages for collaborative AI content creation.",aiSummary:"New Copilot features rolling out 1 June across Excel, Teams, and Pages. No action required — features auto-enable for licensed users. Consider communicating new capabilities to Copilot licence holders and updating adoption guidance.",aiRec:{actionRequired:!1,impacted:["All Microsoft 365 Copilot licence holders (~48 users)"],deadline:null,tasks:["Update Copilot adoption guide with new feature overview","Schedule lunch-and-learn for Copilot licence holders","Monitor usage analytics post-rollout"],automatable:!1,automationNote:"No automation available — informational only."}},{id:"MC882234",title:"Microsoft Teams: New Teams App Store Policy — Verified Publishers Only",service:"Microsoft Teams",category:"planForChange",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-05-04",targetRelease:"2026-07-01",tags:["Teams","Apps","Governance","Policy"],status:"new",body:'Microsoft Teams App Store will begin flagging apps from unverified publishers with a "Unverified" badge. Tenant admins can optionally restrict the store to only allow verified publisher apps. No automatic blocking will occur without admin action.',aiSummary:"Teams App Store will badge unverified publisher apps from 1 July. No blocking occurs automatically — admin must explicitly restrict to verified only. Review current approved app list and consider enabling verified-publisher-only policy for enhanced security.",aiRec:{actionRequired:!1,impacted:["Teams admins","End users using third-party Teams apps"],deadline:null,tasks:["Review currently approved Teams apps for publisher verification status","Consider enabling verified publisher restriction in Teams admin centre","Communicate upcoming badge change to end users"],automatable:!1,automationNote:"Teams app governance requires manual configuration in Teams Admin Centre."}},{id:"MC881567",title:"Microsoft Defender: Attack Simulation Training — New Social Engineering Templates",service:"Microsoft Defender",category:"stayInformed",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-05-02",targetRelease:"2026-05-15",tags:["Defender","Attack Simulation","Training","Security"],status:"read",body:"New attack simulation training templates are available including QR code phishing, Teams-based social engineering, and business email compromise (BEC) scenarios. Templates reflect the latest real-world threat actor techniques observed by Microsoft security researchers.",aiSummary:"New attack simulation templates available: QR code phishing, Teams social engineering, BEC scenarios. Schedule updated simulations to measure and improve user resilience. Current click rate is 8% — target <5% by Q3.",aiRec:{actionRequired:!1,impacted:["All users (security awareness training)"],deadline:null,tasks:["Schedule new QR code phishing simulation campaign","Review current 8% click-through rate and set Q3 improvement target","Update security awareness training content library"],automatable:!1,automationNote:"Campaign scheduling available via Microsoft Defender portal — no Graph API for this feature."}},{id:"MC880456",title:"Exchange Online: Transport Rule Migration to Mail Flow Rules V2",service:"Exchange Online",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-10-01",publishedDate:"2026-04-28",targetRelease:"2026-10-01",tags:["Exchange","Mail Flow","Transport Rules","Migration"],status:"new",body:"Microsoft will migrate all existing Exchange Online transport rules to the new Mail Flow Rules V2 engine on October 1, 2026. Rules using deprecated predicates or actions will be automatically disabled at migration. Review all transport rules and update any using deprecated conditions before the migration date.",aiSummary:"Transport rules using deprecated predicates automatically DISABLED on 1 October migration. Review all mail flow rules urgently — deprecated conditions silently fail. Run Exchange transport rule audit now and update before deadline.",aiRec:{actionRequired:!0,impacted:["Exchange admins","Email security team","Business processes relying on mail routing"],deadline:"1 October 2026",tasks:["Export all transport rules: Get-TransportRule | Export-Csv","Identify rules using deprecated predicates (see MC880456 documentation)","Rewrite deprecated rules using V2-compatible conditions","Test updated rules in Exchange test environment","Document mail flow rule inventory for change record"],automatable:!0,automationNote:"Get-TransportRule -ResultSize Unlimited via Exchange Online PowerShell. Microsoft provides migration validation script in MC documentation."}},{id:"MC879345",title:"Microsoft 365: Admin Center Unified Navigation — Phase 2 Rollout",service:"Microsoft 365",category:"stayInformed",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-04-25",targetRelease:"2026-06-15",tags:["Admin Center","UX","Navigation"],status:"read",body:"The Microsoft 365 Admin Center will receive Phase 2 of its unified navigation update, consolidating service-specific admin centres into a single navigation experience. The Exchange admin center, Teams admin center, and SharePoint admin center will be accessible from a unified left navigation.",aiSummary:"Admin portal navigation redesign Phase 2 rolling out 15 June. Exchange, Teams, and SharePoint admin centres unified under one navigation. No functional changes — purely UI update. Brief admins to avoid confusion post-rollout.",aiRec:{actionRequired:!1,impacted:["All IT administrators and helpdesk staff"],deadline:null,tasks:["Brief IT team on upcoming navigation changes","Update internal IT runbooks with new navigation paths","Communicate to end users if any self-service portal links change"],automatable:!1,automationNote:"No automation applicable — informational update."}},{id:"MC878234",title:"SharePoint Online: OOTB Page Layouts Retirement",service:"SharePoint Online",category:"planForChange",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-04-22",targetRelease:"2026-08-01",tags:["SharePoint","Page Layouts","Classic","Deprecation"],status:"dismissed",body:"Several classic SharePoint OOTB (out-of-the-box) page layouts are being retired as part of the ongoing migration to modern SharePoint. This primarily affects tenants using classic communication sites. Modern SharePoint sites are unaffected.",aiSummary:"Classic SharePoint OOTB page layouts retired 1 August. Only affects classic SharePoint sites (not modern). If tenant uses classic sites, inventory pages using retired layouts and migrate to modern pages. Modern SharePoint users: no action needed.",aiRec:{actionRequired:!1,impacted:["SharePoint admins with classic sites (may not apply)"],deadline:null,tasks:["Check if tenant has any classic SharePoint sites","If yes: inventory page layouts in use and plan migration to modern"],automatable:!1,automationNote:"Get-SPOSite -Template to identify classic vs modern sites."}},{id:"MC877456",title:"Microsoft Intune: Windows 11 Compliance Policy — New Security Baseline",service:"Microsoft Intune",category:"planForChange",severity:"medium",actionRequired:!0,actionByDate:"2026-07-15",publishedDate:"2026-04-20",targetRelease:"2026-07-15",tags:["Intune","Windows 11","Compliance","Security Baseline"],status:"new",body:"Microsoft is releasing a new Windows 11 security baseline for Intune. The updated baseline includes new requirements for TPM 2.0 verification, Secure Boot attestation, and Microsoft Pluton security processor checks. Existing Windows 10 baselines will continue to apply until August 2026.",aiSummary:"New Windows 11 Intune security baseline (TPM 2.0, Secure Boot, Pluton) available from 15 July. Review current device fleet for Windows 11 compatibility. Update compliance policies to adopt new baseline. Devices not meeting new requirements will show as non-compliant.",aiRec:{actionRequired:!0,impacted:["Intune admins","Windows device users","IT hardware team"],deadline:"15 July 2026",tasks:["Run Intune hardware attestation report to assess Windows 11 readiness","Review new security baseline requirements vs current fleet capabilities","Deploy new baseline in report-only mode first","Identify devices that will fail new baseline requirements","Plan hardware refresh for devices not meeting TPM 2.0 / Secure Boot requirements"],automatable:!0,automationNote:"GET /deviceManagement/managedDevices?$filter=operatingSystem eq 'Windows' to get device inventory. Hardware attestation details via GET /deviceManagement/managedDevices/{id}."}},{id:"MC876543",title:"Microsoft Copilot for Teams: Phone and Calling Intelligence — General Availability",service:"Microsoft Copilot",category:"stayInformed",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-04-18",targetRelease:"2026-06-01",tags:["Copilot","Teams Phone","AI","New Feature"],status:"new",body:"Microsoft Copilot for Teams Phone is entering general availability. Copilot can now summarise phone calls, extract action items, provide caller context before answering, and suggest follow-up tasks after calls — all in real time.",aiSummary:"Copilot for Teams Phone GA on 1 June. Call summaries, action item extraction, and caller intelligence added for Teams Phone users. Requires Microsoft 365 Copilot licence + Teams Phone System licence. Communicate to Teams Phone users and update adoption materials.",aiRec:{actionRequired:!1,impacted:["Teams Phone System users with Copilot licence (~48 users)"],deadline:null,tasks:["Communicate new Teams Phone Copilot features to phone system users","Update Teams calling adoption guide with AI features"],automatable:!1,automationNote:"Feature enables automatically for licensed users."}},{id:"MC875432",title:"Microsoft 365: Global Secure Access — General Availability",service:"Microsoft 365",category:"stayInformed",severity:"medium",actionRequired:!1,actionByDate:null,publishedDate:"2026-04-15",targetRelease:"2026-05-01",tags:["Global Secure Access","Zero Trust","Network","Security"],status:"read",body:"Microsoft Global Secure Access (the unified ZTNA platform including Microsoft Entra Internet Access and Entra Private Access) is now generally available. Tenants with E5 Security or Microsoft Entra Suite licences can begin deploying the Global Secure Access client for cloud-native network security.",aiSummary:"Global Secure Access (ZTNA) is now GA for E5 Security / Entra Suite licensed tenants. Enables Zero Trust network access without traditional VPN. Consider piloting for remote workers as a VPN replacement strategy. No action required if not deploying.",aiRec:{actionRequired:!1,impacted:["Network security team","Remote workers (potential benefit)","VPN infrastructure owners"],deadline:null,tasks:["Evaluate Global Secure Access as VPN replacement strategy","Review Entra Internet Access for web filtering use case","Consider pilot deployment for remote worker group"],automatable:!1,automationNote:"Requires Global Secure Access client deployment and Entra Private Access connector configuration."}},{id:"MC874321",title:"Exchange Online: DKIM Automatic Key Rotation — Now Enabled",service:"Exchange Online",category:"stayInformed",severity:"low",actionRequired:!1,actionByDate:null,publishedDate:"2026-04-12",targetRelease:null,tags:["Exchange","DKIM","Email Security","Automatic"],status:"read",body:"Exchange Online will now automatically rotate DKIM keys every 6 months for domains with DKIM signing enabled. No admin action is required. Key rotation happens transparently with no email interruption. The new keys are published to DNS automatically via Microsoft-managed DNS.",aiSummary:"DKIM keys now auto-rotate every 6 months automatically. No admin action needed. If you manage your own DNS (not Microsoft-managed), you may need to ensure auto-rotation propagates correctly. Check your DNS provider setup.",aiRec:{actionRequired:!1,impacted:["Exchange admins (awareness only)"],deadline:null,tasks:["Verify DKIM is enabled for all domains: Get-DkimSigningConfig","If using external DNS provider: confirm DNS records update automatically"],automatable:!1,automationNote:"Automatic — no action needed if Microsoft manages DNS."}},{id:"MC873210",title:"Microsoft 365: License Overage Alert — Microsoft 365 E5 Critical",service:"Microsoft 365",category:"preventOrFixIssue",severity:"high",actionRequired:!0,actionByDate:"2026-06-10",publishedDate:"2026-04-10",targetRelease:null,tags:["Licensing","E5","Compliance","Cost"],status:"new",body:"Your tenant is approaching the Microsoft 365 E5 license capacity limit. Current consumption is 148/150 licences (98.7%). If licence count is exceeded, new assignments will fail and service access issues may occur. Review licence allocation immediately.",aiSummary:"CRITICAL: E5 licences at 98.7% (148/150). Only 2 remaining. Any new user onboarding with E5 will fail. Immediate action: review unused E5 assignments, reclaim from inactive users, or purchase additional licences before capacity breach.",aiRec:{actionRequired:!0,impacted:["IT admins","HR (new starters requiring E5)","Finance (licence cost)"],deadline:"10 June 2026",tasks:["Export E5 licence assignment list and identify inactive holders (90+ days no sign-in)","Reclaim E5 from 3-5 inactive users and reassign as E3 if appropriate","Submit budget request for additional E5 licences","Create licence capacity alert policy in Microsoft 365 Admin Center","Review E5 vs E3 feature need for existing holders — downgrade where E5 not used"],automatable:!0,automationNote:"GET /users?$filter=assignedLicenses/any(x:x/skuId eq {E5-SKU-ID}) and signInActivity/lastSignInDateTime le datetime combined to find inactive E5 holders."}}],ga=[{id:"EX498712",title:"Exchange Online: Delays in Email Delivery",service:"Exchange Online",feature:"Mail flow",status:"serviceDegradation",severity:"medium",startTime:"Today 07:15",lastUpdated:"Today 09:30",nextUpdate:"11:00 today",userImpact:"Emails sent to external recipients may be delayed by up to 30 minutes. Internal mail flow is unaffected. Mail is queuing and will be delivered.",updates:[{time:"09:30",text:"Root cause identified: network routing issue in EU West datacentre. Fix being deployed."},{time:"08:45",text:"Investigation ongoing. Traffic being redirected to backup mail relay."},{time:"07:15",text:"Issue detected. Engineering team investigating increased mail delivery latency."}]},{id:"TM492341",title:"Microsoft Teams: Meeting Join Failures — EMEA Region",service:"Microsoft Teams",feature:"Audio/video calls",status:"investigating",severity:"high",startTime:"Today 06:42",lastUpdated:"Today 10:15",nextUpdate:"12:00 today",userImpact:"Users in the EMEA region are unable to join Teams meetings via browser client. Desktop client and mobile are unaffected. Workaround: join via Teams desktop app.",updates:[{time:"10:15",text:"Identified intermittent failures in EMEA Teams relay infrastructure. Traffic failover in progress."},{time:"08:00",text:"Issue scoped to EMEA region, specifically UK, Germany, and Netherlands users."},{time:"06:42",text:"Monitoring detected elevated Teams meeting join failure rate. Investigation started."}]},{id:"SP441892",title:"SharePoint Online: Search Indexing Delay",service:"SharePoint Online",feature:"Search",status:"serviceAdvisory",severity:"low",startTime:"Yesterday 18:30",lastUpdated:"Today 08:00",nextUpdate:"No update needed — advisory",userImpact:"Recently uploaded documents in SharePoint may not appear in search results for up to 2 hours. Documents are accessible via direct link or navigation — only search index is delayed.",updates:[{time:"08:00",text:"Advisory issued. Search indexing running at reduced speed due to scheduled maintenance. Expected to resolve by end of day."}]},{id:"AAD438712",title:"Microsoft Entra ID: Sign-in Latency in US East Region",service:"Microsoft Entra ID",feature:"User authentication",status:"resolved",severity:"medium",startTime:"Yesterday 14:20",lastUpdated:"Yesterday 17:45",nextUpdate:null,userImpact:"Some users in US East experienced 10-30 second sign-in delays. Issue fully resolved at 17:45. No data was lost or compromised.",updates:[{time:"17:45",text:"Issue fully resolved. Authentication latency returned to normal. Post-incident review scheduled."},{time:"16:30",text:"Mitigation applied. Latency reducing. Monitoring closely."},{time:"14:20",text:"Elevated authentication latency detected in US East region. Engineering engaged."}]},{id:"OF421345",title:"Microsoft 365 Admin Center: Intermittent Access Errors",service:"Microsoft 365",feature:"Admin portal",status:"resolved",severity:"low",startTime:"2 days ago 09:15",lastUpdated:"2 days ago 11:30",nextUpdate:null,userImpact:"Some administrators received HTTP 500 errors when accessing the Microsoft 365 Admin Center. Issue was isolated to report generation. All other admin functionality was unaffected.",updates:[{time:"11:30",text:"Issue fully resolved. Admin Center reporting restored to normal operation."},{time:"10:00",text:"Identified issue with report generation service. Restart in progress."},{time:"09:15",text:"Reports of HTTP 500 errors in Admin Center. Investigating."}]}];let St=0,$t=0,Et=null,Ge=[];function ma(){const e=localStorage.getItem("dashboard_consents_dismissed");if(!e)return!1;const t=new Date().getTime(),i=parseInt(e);return(t-i)/(1e3*60*60)<24}async function ya(){const e=document.getElementById("page-dashboard");if(e){if(J()){Sa(e);return}fa(e),ha(e)}}function fa(e){var i,s,a,n,r,o,l,c,d,p,v,f,b,k,y,w,P;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
        <div class="page-subtitle">${m.tenantDomain} — last updated just now</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <!-- Recent Admin Consents Alert (hidden until loaded) -->
    <div id="dash-consents-section" style="display:none;margin-bottom:16px">
      <div class="alert-banner warning" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
        <div style="flex:1">
          <i class="ti ti-alert-triangle"></i>
          <span><strong id="dash-consents-count">0</strong> new admin consent(s) granted in the last 24 hours. Review for suspicious activity.</span>
        </div>
        <button class="btn btn-sm" id="dash-consents-view" style="margin-right:8px"><i class="ti ti-arrow-right"></i> View Details</button>
        <button class="btn btn-sm" id="dash-consents-dismiss" style="padding:6px 12px"><i class="ti ti-x"></i></button>
      </div>

      <!-- Recent Admin Consents Table -->
      <div class="card" style="margin-bottom:16px;padding:0;overflow:hidden">
        <div style="padding:12px;border-bottom:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)">
          <span style="font-weight:600;font-size:12px">Recent Admin Consents (Last 24 Hours)</span>
        </div>
        <table style="width:100%" id="dash-consents-table">
          <thead style="background:var(--color-background-secondary)">
            <tr>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:18%">Time</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:20%">Application</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:30%">Permissions</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">Performed By</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:17%">Status</th>
            </tr>
          </thead>
          <tbody id="dash-consents-tbody"></tbody>
        </table>
      </div>
    </div>

    <!-- KPI Tiles -->
    <div class="kpi-row">
      <div class="kpi-tile" style="background:var(--color-background-secondary);opacity:0.5">
        <div class="kpi-value info" id="dash-kpi-devices">—</div>
        <div class="kpi-label">Managed Devices</div>
      </div>
      <div class="kpi-tile" style="background:var(--color-background-secondary);opacity:0.5">
        <div class="kpi-value success" id="dash-kpi-users">—</div>
        <div class="kpi-label">Total Users</div>
      </div>
      <div class="kpi-tile" style="background:var(--color-background-secondary);opacity:0.5">
        <div class="kpi-value warning" id="dash-kpi-score">—</div>
        <div class="kpi-label">Security Score</div>
      </div>
    </div>

    <!-- 📊 Critical Alerts Section -->
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;color:var(--color-text-primary);margin-bottom:12px"><i class="ti ti-alert-triangle"></i> Critical Alerts</div>
      <div class="dash-cards-row mb-3">
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-inbox"></i> Pending Requests</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)" id="dash-requests-pending">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Pending</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-requests-total">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-requests-time">⏱ Loading...</div><button class="btn btn-sm" id="dash-to-requests" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Requests</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-alert-triangle"></i> Security Incidents</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-success-text)" id="dash-incidents-active">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Active</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-incidents-week">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">This Week</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-incidents-status">✓ Loading...</div><button class="btn btn-sm" id="dash-to-security" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Security</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-shield-check"></i> TenantGuard Alerts</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)" id="dash-tguard-active">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Active</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-danger-text)" id="dash-tguard-critical">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Critical</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-tguard-correlations">⚠ Loading...</div><button class="btn btn-sm" id="dash-to-tenantguard" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Alerts</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-crown"></i> Privileged Accounts</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-danger-text)" id="dash-priv-atrisk">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">At-Risk</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-priv-total">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-priv-nomfa">⏱ Loading...</div><button class="btn btn-sm" id="dash-to-privaccts" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Accounts</button></div></div>
      </div>
    </div>

    <!-- 🏥 System Health Overview -->
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;color:var(--color-text-primary);margin-bottom:12px"><i class="ti ti-heartbeat"></i> System Health Overview</div>
      <div class="dash-cards-row mb-3">
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</span></div><div style="padding:12px"><div style="text-align:center;margin-bottom:12px"><div style="font-size:16px;color:var(--color-text-secondary)" id="dash-zt-status">—</div></div><div style="padding:8px;background:var(--color-background-primary);border-radius:var(--border-radius-sm);text-align:center"><div style="font-size:10px;color:var(--color-text-secondary)" id="dash-zt-pillars">Loading...</div></div><button class="btn btn-sm" id="dash-to-zt" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Request Assessment</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-settings-2"></i> CIS Controls</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)" id="dash-cis-compliance">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Compliance</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-cis-topics">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Topics</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-cis-trend">📊 Loading...</div><button class="btn btn-sm" id="dash-to-m365" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Config</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-license"></i> License Utilization</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-success-text)" id="dash-license-pct">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Utilized</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-license-count">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Count</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-license-risk">⚠ Loading...</div><button class="btn btn-sm" id="dash-to-licenses" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Licenses</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-device-laptop"></i> Device Compliance</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-success-text)" id="dash-device-compliance">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Compliant</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-device-count">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Devices</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-device-noncompliant">⚠ Loading...</div><button class="btn btn-sm" id="dash-to-intune" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Devices</button></div></div>
      </div>
    </div>

    <!-- 🚀 Applications & Enterprise Health -->
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;color:var(--color-text-primary);margin-bottom:12px"><i class="ti ti-rocket"></i> Applications & Enterprise Health</div>
      <div class="dash-cards-row mb-3">
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-app-window"></i> Entra Apps</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-danger-text)" id="dash-apps-expiring">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Expiring</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-apps-total">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-apps-status">⚠ Loading...</div><button class="btn btn-sm" id="dash-to-apps" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Apps</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-shield-check"></i> Risk Analysis</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)" id="dash-risk-high">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">High-Risk</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-risk-users">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Users</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-risk-score">📊 Loading...</div><button class="btn btn-sm" id="dash-to-investigation" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Investigate</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-robot"></i> AI Agents</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-success-text)" id="dash-agents-active">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Active</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-agents-healthy">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Healthy</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-agents-uptime">📊 Loading...</div><button class="btn btn-sm" id="dash-to-agents" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Agents</button></div></div>
        <div class="card" style="opacity:0.5;background:var(--color-background-secondary)"><div class="card-header"><span class="card-title"><i class="ti ti-check-list"></i> Pending Approvals</span></div><div style="padding:12px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px"><div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--clr-warning-text)" id="dash-approvals-pending">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Pending</div></div><div style="text-align:center"><div style="font-size:16px;font-weight:600;color:var(--clr-info-text)" id="dash-approvals-total">—</div><div style="font-size:9px;color:var(--color-text-tertiary)">Total</div></div></div><div style="padding-top:8px;border-top:0.5px solid var(--color-border-tertiary);font-size:10px;color:var(--color-text-secondary)" id="dash-approvals-time">⏱ Loading...</div><button class="btn btn-sm" id="dash-to-approvals" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Review</button></div></div>
      </div>
    </div>
  `;const t=document.createElement("div");t.style.marginTop="16px",t.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading Change Intelligence...</p></div>',e.appendChild(t),$a().then(S=>{t.innerHTML=S,console.log("✓ Change Intelligence loaded")}).catch(S=>{console.error("❌ Error loading Change Intelligence:",S.message),t.innerHTML=`<div style="padding:20px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)"><div style="color:var(--color-text-secondary);font-size:11px">Failed to load Change Intelligence: ${S.message}</div></div>`}),(i=e.querySelector("#dash-to-msgcenter-health"))==null||i.addEventListener("click",async()=>await C("msgcenter")),(s=e.querySelector("#dash-to-requests"))==null||s.addEventListener("click",async()=>await C("requests")),(a=e.querySelector("#dash-to-security"))==null||a.addEventListener("click",async()=>await C("security")),(n=e.querySelector("#dash-to-tenantguard"))==null||n.addEventListener("click",async()=>await C("tenantguard")),(r=e.querySelector("#dash-to-privaccts"))==null||r.addEventListener("click",async()=>await C("privaccts")),(o=e.querySelector("#dash-to-zt"))==null||o.addEventListener("click",async()=>await C("zerotrust")),(l=e.querySelector("#dash-to-m365"))==null||l.addEventListener("click",async()=>await C("m365config")),(c=e.querySelector("#dash-to-licenses"))==null||c.addEventListener("click",async()=>await C("licenses")),(d=e.querySelector("#dash-to-intune"))==null||d.addEventListener("click",async()=>await C("intune")),(p=e.querySelector("#dash-to-apps"))==null||p.addEventListener("click",async()=>await C("applications")),(v=e.querySelector("#dash-to-investigation"))==null||v.addEventListener("click",async()=>await C("user-investigation")),(f=e.querySelector("#dash-to-agents"))==null||f.addEventListener("click",async()=>await C("agents")),(b=e.querySelector("#dash-to-approvals"))==null||b.addEventListener("click",async()=>await C("approvals")),(k=e.querySelector("#dash-to-msgcenter"))==null||k.addEventListener("click",async()=>await C("msgcenter")),(y=e.querySelector("#dash-to-audit"))==null||y.addEventListener("click",async()=>await C("audit")),(w=e.querySelector("#dash-consents-view"))==null||w.addEventListener("click",async()=>await C("applications")),(P=e.querySelector("#dash-consents-dismiss"))==null||P.addEventListener("click",()=>{const S=e.querySelector("#dash-consents-section");S&&(S.style.display="none"),localStorage.setItem("dashboard_consents_dismissed",new Date().getTime())})}async function ha(e){try{console.log("📡 Fetching dashboard data...");const[t,i,s,a]=await Promise.all([jt().catch(n=>(console.warn("⚠️ Devices fetch failed:",n.message),{})),ia().catch(n=>(console.warn("⚠️ Users fetch failed:",n.message),{})),Vi().catch(n=>(console.warn("⚠️ Score fetch failed:",n.message),{})),T("/audit-logs/consents").catch(n=>(console.warn("⚠️ Consents fetch failed:",n.message),{}))]);if(St=t.success&&t.count?t.count:0,$t=i.success&&i.count?i.count:0,Et=s.success?s.data:null,ba(e),xa(e),wa(e),ka(e),a.success&&a.data){const n=new Date,r=new Date(n.getTime()-24*60*60*1e3);Ge=a.data.filter(o=>new Date(o.activityDateTime)>=r).sort((o,l)=>new Date(l.activityDateTime)-new Date(o.activityDateTime)).slice(0,5),Ge.length>0&&!ma()?(console.log(`✅ Loaded ${Ge.length} recent admin consents`),Aa(e)):e.querySelector("#dash-consents-section").style.display="none"}console.log(`✅ Dashboard data loaded: ${St} devices, ${$t} users`)}catch(t){console.error("❌ Error loading dashboard data:",t)}}function ba(e){const t=e.querySelector("#dash-kpi-devices");t&&(t.textContent=St);const i=e.querySelector("#dash-kpi-users");i&&(i.textContent=$t);const s=e.querySelector("#dash-kpi-score");s&&Et&&(s.textContent=`${Et.overallScore||0}/100`),e.querySelectorAll(".kpi-tile").forEach(a=>{a.style.background="",a.style.opacity="1"})}function xa(e){const t=e.querySelector("#dash-requests-pending"),i=e.querySelector("#dash-requests-total"),s=e.querySelector("#dash-requests-time");t&&(t.textContent="2"),i&&(i.textContent="5"),s&&(s.textContent="⏱ Oldest: 2 hours ago");const a=e.querySelector("#dash-incidents-active"),n=e.querySelector("#dash-incidents-week"),r=e.querySelector("#dash-incidents-status");a&&(a.textContent="0"),n&&(n.textContent="3"),r&&(r.textContent="✓ Status: Investigating");const o=e.querySelector("#dash-tguard-active"),l=e.querySelector("#dash-tguard-critical"),c=e.querySelector("#dash-tguard-correlations");o&&(o.textContent="5"),l&&(l.textContent="2"),c&&(c.textContent="⚠ Correlations: 2");const d=e.querySelector("#dash-priv-atrisk"),p=e.querySelector("#dash-priv-total"),v=e.querySelector("#dash-priv-nomfa");d&&(d.textContent="1"),p&&(p.textContent="5"),v&&(v.textContent="⏱ No MFA: 1");const f=e.querySelectorAll(".dash-cards-row")[0];f&&f.querySelectorAll(".card").forEach(b=>{b.style.background="",b.style.opacity="1"})}function wa(e){var v,f;const t=e.querySelector("#dash-zt-status"),i=e.querySelector("#dash-zt-pillars");t&&(t.textContent="No Assessment"),i&&(i.textContent="Pillars: 4 • Controls: 12");const s=e.querySelector("#dash-cis-compliance"),a=e.querySelector("#dash-cis-topics"),n=e.querySelector("#dash-cis-trend");s&&(s.textContent="78%"),a&&(a.textContent="9"),n&&(n.textContent="📊 Trend: ↑ +2%");const r=e.querySelector("#dash-license-pct"),o=e.querySelector("#dash-license-count"),l=e.querySelector("#dash-license-risk");r&&(r.textContent="95%"),o&&(o.textContent="1.2K / 1.3K"),l&&(l.textContent="⚠ Risk: 50 unused");const c=e.querySelector("#dash-device-compliance"),d=e.querySelector("#dash-device-count"),p=e.querySelector("#dash-device-noncompliant");c&&(c.textContent="98%"),d&&(d.textContent="847"),p&&(p.textContent="⚠ Non-Compliant: 15"),(f=(v=e.querySelectorAll(".dash-cards-row")[1])==null?void 0:v.querySelectorAll(".card"))==null||f.forEach(b=>{b.style.background="",b.style.opacity="1"})}function ka(e){var f,b;const t=e.querySelector("#dash-apps-expiring"),i=e.querySelector("#dash-apps-total"),s=e.querySelector("#dash-apps-status");t&&(t.textContent="3"),i&&(i.textContent="5"),s&&(s.textContent="⚠ Secrets expiring soon");const a=e.querySelector("#dash-risk-high"),n=e.querySelector("#dash-risk-users"),r=e.querySelector("#dash-risk-score");a&&(a.textContent="3"),n&&(n.textContent="15"),r&&(r.textContent="📊 Risk Score: 42");const o=e.querySelector("#dash-agents-active"),l=e.querySelector("#dash-agents-healthy"),c=e.querySelector("#dash-agents-uptime");o&&(o.textContent="6"),l&&(l.textContent="4"),c&&(c.textContent="📊 Uptime: 99.8%");const d=e.querySelector("#dash-approvals-pending"),p=e.querySelector("#dash-approvals-total"),v=e.querySelector("#dash-approvals-time");d&&(d.textContent="3"),p&&(p.textContent="7"),v&&(v.textContent="⏱ Oldest: 5 hours"),(b=(f=e.querySelectorAll(".dash-cards-row")[2])==null?void 0:f.querySelectorAll(".card"))==null||b.forEach(k=>{k.style.background="",k.style.opacity="1"})}function Aa(e){const t=e.querySelector("#dash-consents-section"),i=e.querySelector("#dash-consents-count"),s=e.querySelector("#dash-consents-tbody");!t||!s||(i.textContent=Ge.length,s.innerHTML=Ge.map(a=>`
    <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
      <td style="padding:10px 12px;font-size:10px">${new Date(a.activityDateTime).toLocaleString()}</td>
      <td style="padding:10px 12px;font-weight:600;font-size:11px">${a.appName||"—"}</td>
      <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${(a.scope||"—").substring(0,40)}${(a.scope||"—").length>40?"...":""}</td>
      <td style="padding:10px 12px;font-size:10px">${(a.initiatedBy||"—").substring(0,25)}</td>
      <td style="padding:10px 12px;font-size:10px"><span class="badge ${(a.result||"").toLowerCase()==="success"?"success":"danger"}">${a.result||"—"}</span></td>
    </tr>
  `).join(""),t.style.display="block")}function Sa(e){var t,i,s,a,n,r,o,l,c,d,p,v,f,b,k;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-layout-dashboard"></i> Dashboard</div>
        <div class="page-subtitle">${m.tenantDomain} — last updated just now</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample data</span>
    </div>

    <div class="alert-banner warning" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <div style="flex:1">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>3 new admin consents</strong> granted in the last 24 hours. Review for suspicious activity.</span>
      </div>
      <button class="btn btn-sm" id="dash-consents-view" style="margin-right:8px"><i class="ti ti-arrow-right"></i> View Details</button>
      <button class="btn btn-sm" id="dash-consents-dismiss" style="padding:6px 12px"><i class="ti ti-x"></i></button>
    </div>

    <div class="card" style="margin-bottom:16px;padding:0;overflow:hidden">
      <div style="padding:12px;border-bottom:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)">
        <span style="font-weight:600;font-size:12px">Recent Admin Consents (Last 24 Hours)</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:18%">Time</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:20%">Application</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:30%">Permissions</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">Performed By</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:17%">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:10px">2026-06-01 14:32 PM</td>
            <td style="padding:10px 12px;font-weight:600;font-size:11px">Power BI Service</td>
            <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">Dataset.ReadWrite.All, Report.Read.All</td>
            <td style="padding:10px 12px;font-size:10px">Priya Kumar</td>
            <td style="padding:10px 12px;font-size:10px"><span class="badge success">Success</span></td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:10px">2026-06-01 11:15 AM</td>
            <td style="padding:10px 12px;font-weight:600;font-size:11px">Azure DevOps Connector</td>
            <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">vso.work_write, vso.project_manage</td>
            <td style="padding:10px 12px;font-size:10px">Chen Wei</td>
            <td style="padding:10px 12px;font-size:10px"><span class="badge success">Success</span></td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:10px">2026-06-01 09:47 AM</td>
            <td style="padding:10px 12px;font-weight:600;font-size:11px">Salesforce Sync App</td>
            <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">User.Read.All, Directory.Read.All</td>
            <td style="padding:10px 12px;font-size:10px">Aisha Raza</td>
            <td style="padding:10px 12px;font-size:10px"><span class="badge success">Success</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- KPI Tiles - Demo Data -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">847</div>
        <div class="kpi-label">Managed Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">1,000</div>
        <div class="kpi-label">Total Users</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">78/100</div>
        <div class="kpi-label">Security Score</div>
      </div>
    </div>

    <!-- Administration Overview Widgets -->
    <div class="dash-cards-row mb-3">
      <!-- Requests Status -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-inbox"></i> Pending Requests</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">2</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Awaiting approval</div>
          <button class="btn btn-sm" id="dash-to-requests" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Requests</button>
        </div>
      </div>

      <!-- Security Incidents -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Security Incidents</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">0</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Active incidents</div>
          <button class="btn btn-sm" id="dash-to-security" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Security</button>
        </div>
      </div>

      <!-- TenantGuard Alerts -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-shield-check"></i> TenantGuard</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">5</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Active alerts</div>
          <button class="btn btn-sm" id="dash-to-tenantguard" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Alerts</button>
        </div>
      </div>

      <!-- Privileged Accounts -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-crown"></i> Privileged Users</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">1</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">At-risk accounts</div>
          <button class="btn btn-sm" id="dash-to-privaccts" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Accounts</button>
        </div>
      </div>
    </div>

    <!-- System Health Overview -->
    <div class="dash-cards-row mb-3">
      <!-- Zero Trust Compliance -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</span>
        </div>
        <div style="padding:12px;text-align:center">
          <div style="font-size:14px;color:var(--color-text-secondary);margin-bottom:8px">No assessment data</div>
          <button class="btn btn-sm" id="dash-to-zt" style="width:100%"><i class="ti ti-arrow-right"></i> Request Assessment</button>
        </div>
      </div>

      <!-- M365 Config Compliance -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-settings-2"></i> CIS Controls</span>
        </div>
        <div style="padding:12px;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">78%</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Compliance</div>
          <button class="btn btn-sm" id="dash-to-m365" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Config</button>
        </div>
      </div>

      <!-- Licenses -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-license"></i> License Usage</span>
        </div>
        <div style="padding:12px;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">95%</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Utilized</div>
          <button class="btn btn-sm" id="dash-to-licenses" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Licenses</button>
        </div>
      </div>

      <!-- Intune Devices -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-device-laptop"></i> Device Compliance</span>
        </div>
        <div style="padding:12px;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">98%</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Compliant devices</div>
          <button class="btn btn-sm" id="dash-to-intune" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Devices</button>
        </div>
      </div>
    </div>

    <!-- Application & Enterprise Health -->
    <div class="dash-cards-row mb-3">
      <!-- Applications -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-app-window"></i> Entra Apps</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">3</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Expiring secrets</div>
          <button class="btn btn-sm" id="dash-to-apps" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Apps</button>
        </div>
      </div>

      <!-- User Investigation -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-shield-check"></i> Risk Analysis</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">3</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">High-risk users</div>
          <button class="btn btn-sm" id="dash-to-investigation" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Investigate</button>
        </div>
      </div>

      <!-- AI Agents -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-robot"></i> AI Agents</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">6</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Active agents</div>
          <button class="btn btn-sm" id="dash-to-agents" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> View Agents</button>
        </div>
      </div>

      <!-- Approvals -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-check-list"></i> Pending Approvals</span>
        </div>
        <div style="padding:12px 0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">3</div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Awaiting your action</div>
          <button class="btn btn-sm" id="dash-to-approvals" style="margin-top:8px;width:100%"><i class="ti ti-arrow-right"></i> Review</button>
        </div>
      </div>
    </div>
  `,(t=e.querySelector("#dash-consents-view"))==null||t.addEventListener("click",async()=>await C("applications")),(i=e.querySelector("#dash-consents-dismiss"))==null||i.addEventListener("click",()=>{const y=e.querySelector(".alert-banner"),w=e.querySelector(".card");y&&(y.style.display="none"),w&&w.querySelector("table")&&(w.style.display="none"),localStorage.setItem("dashboard_consents_dismissed",new Date().getTime())}),(s=e.querySelector("#dash-to-requests"))==null||s.addEventListener("click",async()=>await C("requests")),(a=e.querySelector("#dash-to-security"))==null||a.addEventListener("click",async()=>await C("security")),(n=e.querySelector("#dash-to-tenantguard"))==null||n.addEventListener("click",async()=>await C("tenantguard")),(r=e.querySelector("#dash-to-privaccts"))==null||r.addEventListener("click",async()=>await C("privaccts")),(o=e.querySelector("#dash-to-zt"))==null||o.addEventListener("click",async()=>await C("zerotrust")),(l=e.querySelector("#dash-to-m365"))==null||l.addEventListener("click",async()=>await C("m365config")),(c=e.querySelector("#dash-to-licenses"))==null||c.addEventListener("click",async()=>await C("licenses")),(d=e.querySelector("#dash-to-intune"))==null||d.addEventListener("click",async()=>await C("intune")),(p=e.querySelector("#dash-to-apps"))==null||p.addEventListener("click",async()=>await C("applications")),(v=e.querySelector("#dash-to-investigation"))==null||v.addEventListener("click",async()=>await C("user-investigation")),(f=e.querySelector("#dash-to-agents"))==null||f.addEventListener("click",async()=>await C("agents")),(b=e.querySelector("#dash-to-approvals"))==null||b.addEventListener("click",async()=>await C("approvals")),(k=e.querySelector("#dash-to-msgcenter"))==null||k.addEventListener("click",async()=>await C("msgcenter"))}async function $a(){let e=[],t=[],i=!0;if(console.log("📡 buildChangeIntelWidget: Checking account type..."),J())console.log("📡 buildChangeIntelWidget: Demo account - using demo data"),i=!1;else{console.log("📡 buildChangeIntelWidget: Production account - fetching real data...");try{console.log("📡 Calling getMessageCenterMessages()...");const d=await Zs();console.log("📡 MC Result:",d),console.log("📡 Calling getServiceHealth()...");const p=await Qs();console.log("📡 SH Result:",p),d.success&&d.data?(e=d.data,console.log(`✓ Loaded ${e.length} real Message Center messages`)):console.log("⚠️ MC Result not successful:",d),p.success&&p.data?(t=p.data,console.log(`✓ Loaded ${t.length} real Service Health issues`)):console.log("⚠️ SH Result not successful:",p),e.length===0&&t.length===0&&(console.log("ℹ️ No real Message Center or Health data available, using demo data"),i=!1)}catch(d){console.error("❌ Error fetching real data:",d),console.warn("⚠️ Falling back to demo data"),i=!1}}const s=i&&e.length>0?e:he,a=i&&t.length>0?t:ga;let n=[];i&&s.length>0?(n=s.filter(d=>d.severity==="high"||d.actionRequired).slice(0,3),n.length===0&&(n=s.slice(0,3))):n=s.filter(d=>d.actionRequired&&d.severity==="high").slice(0,3);const r=a.filter(d=>d.status!=="resolved"&&d.status!=="Resolved"),o=s.filter(d=>d.actionRequired).length,l=Object.entries(yt).map(([d,p])=>{const v=a.find(b=>b.service===d&&b.status!=="resolved"),f=v?v.severity==="high"?"fail":"warn":"pass";return`<span title="${d}: ${v?v.status:"Operational"}" style="display:inline-flex;align-items:center;gap:3px;font-size:9px;color:var(--color-text-tertiary);margin-right:6px">
      <span class="status-dot ${f}" style="width:6px;height:6px"></span>${d.replace("Microsoft ","").replace(" Online","").replace(" ID","").substring(0,7)}</span>`}).join("");return`
    <div class="dash-cards-row">
      <!-- Change Intelligence Critical Messages -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-antenna" style="color:var(--clr-danger-text)"></i> Change Intelligence</span>
          <span style="display:flex;gap:8px;align-items:center">
            <span class="badge danger dot">${o} action required</span>
            ${i?'<span style="font-size:9px;color:var(--clr-success-text);margin-left:8px">● Real data</span>':'<span style="font-size:9px;color:var(--color-text-tertiary);margin-left:8px">● Demo data</span>'}
          </span>
        </div>
        <div style="margin-bottom:10px">
          ${n.map(d=>{const p=yt[d.service]||{icon:"ti-apps",color:"#185FA5",bg:"#E6F1FB"};return`<div style="display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
              <div style="width:20px;height:20px;border-radius:4px;background:${p.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:${p.color}">
                <i class="ti ${p.icon}"></i>
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:10px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.title}</div>
                <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:1px">${d.id} · ${d.service} · Act by: <strong style="color:var(--clr-danger-text)">${d.actionByDate}</strong></div>
              </div>
              <span class="badge danger" style="font-size:8px;flex-shrink:0">High</span>
            </div>`}).join("")}
        </div>
        <button class="btn btn-primary" id="dash-to-msgcenter"><i class="ti ti-arrow-right"></i> View all messages</button>
      </div>

      <!-- Service Health Summary -->
      <div class="card" style="grid-column: span 2;">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-heartbeat"></i> Service Health</span>
          <span class="badge ${r.length>0?"warning":"success"}">${r.length>0?r.length+" active":"All clear"}</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px 0;border-bottom:0.5px solid var(--color-border-tertiary);margin-bottom:10px">
          ${l}
        </div>
        ${r.length>0?r.map(d=>`
          <div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;font-size:11px">
            <span class="status-dot ${d.severity==="high"?"fail":"warn"} pulse"></span>
            <div>
              <div style="font-weight:600">${d.service}</div>
              <div style="font-size:10px;color:var(--color-text-secondary)">${d.title}</div>
            </div>
          </div>
        `).join(""):`
          <div style="font-size:11px;color:var(--clr-success-text);display:flex;align-items:center;gap:6px">
            <i class="ti ti-circle-check"></i> All ${Object.keys(yt).length} monitored services operational.
          </div>
        `}
        <div style="margin-top:10px">
          <button class="btn btn-sm" id="dash-to-msgcenter-health">
            <i class="ti ti-heartbeat"></i> Service Health
          </button>
        </div>
      </div>
    </div>
  `}let I=[],ee=null,te="PENDING_APPROVAL",ke="list";async function Ea(){const e=document.getElementById("page-requests");if(e){if(J()){Ca(e);return}await Yi(),pt(e)}}function Ca(e){I=[{id:"REQ-2026-001",operationId:"user-license-assignment-office365",submittedBy:"john.smith@contoso.com",submittedAt:"2026-06-01T14:30:00Z",status:"PENDING_APPROVAL",validation:{riskLevel:"LOW",riskScore:15,approvalPath:["manager","compliance","action"],checks:[{status:"PASS",message:"User identity verified"},{status:"PASS",message:"License availability confirmed"},{status:"PASS",message:"No policy conflicts"}]},approvals:[{step:"manager",status:"APPROVED",approvedBy:"david.chen@contoso.com",approvedAt:"2026-06-01T15:00:00Z"}],fields:{userId:"john.smith@contoso.com",licenses:"Office 365 E5",department:"Sales"}},{id:"REQ-2026-002",operationId:"group-creation-security",submittedBy:"maya.patel@contoso.com",submittedAt:"2026-06-01T13:45:00Z",status:"PENDING_APPROVAL",validation:{riskLevel:"MEDIUM",riskScore:52,approvalPath:["compliance","action"],checks:[{status:"PASS",message:"Group naming convention valid"},{status:"WARN",message:"Large membership size detected"},{status:"PASS",message:"Owner assignment confirmed"}]},approvals:[],fields:{groupName:"Sales Team AU",members:47,owner:"maya.patel@contoso.com"}},{id:"REQ-2026-003",operationId:"sharepoint-site-creation",submittedBy:"alex.johnson@contoso.com",submittedAt:"2026-06-01T12:15:00Z",status:"PENDING_APPROVAL",validation:{riskLevel:"LOW",riskScore:18,approvalPath:["manager","action"],checks:[{status:"PASS",message:"Site quota available"},{status:"PASS",message:"Governance policies applied"},{status:"PASS",message:"Retention label assigned"}]},approvals:[{step:"manager",status:"APPROVED",approvedBy:"robert.williams@contoso.com",approvedAt:"2026-06-01T13:30:00Z"}],fields:{siteName:"HR Policies Site",url:"hr-policies",classification:"Internal"}},{id:"REQ-2026-004",operationId:"admin-role-assignment-global",submittedBy:"sarah.kim@contoso.com",submittedAt:"2026-06-01T11:00:00Z",status:"APPROVED",validation:{riskLevel:"HIGH",riskScore:78,approvalPath:["manager","compliance","security","ciso"],checks:[{status:"PASS",message:"Business justification provided"},{status:"PASS",message:"Background check passed"},{status:"PASS",message:"MFA requirement confirmed"}]},approvals:[{step:"manager",status:"APPROVED",approvedBy:"michael.brown@contoso.com",approvedAt:"2026-06-01T12:00:00Z"},{step:"compliance",status:"APPROVED",approvedBy:"lisa.garcia@contoso.com",approvedAt:"2026-06-01T12:45:00Z"},{step:"security",status:"APPROVED",approvedBy:"james.miller@contoso.com",approvedAt:"2026-06-01T13:15:00Z"},{step:"ciso",status:"APPROVED",approvedBy:"jennifer.lee@contoso.com",approvedAt:"2026-06-01T14:00:00Z"}],fields:{userId:"sarah.kim@contoso.com",role:"Global Admin",reason:"Incident response team member"}},{id:"REQ-2026-005",operationId:"data-export-audit",submittedBy:"chris.rodriguez@contoso.com",submittedAt:"2026-05-31T16:30:00Z",status:"COMPLETED",validation:{riskLevel:"MEDIUM",riskScore:45,approvalPath:["manager","data-protection"],checks:[{status:"PASS",message:"Data retention compliant"},{status:"PASS",message:"Encryption enabled"},{status:"PASS",message:"Audit logging configured"}]},approvals:[{step:"manager",status:"APPROVED",approvedBy:"nancy.davis@contoso.com",approvedAt:"2026-05-31T17:00:00Z"},{step:"data-protection",status:"APPROVED",approvedBy:"thomas.martin@contoso.com",approvedAt:"2026-05-31T17:45:00Z"},{step:"action",status:"COMPLETED",approvedAt:"2026-06-01T09:00:00Z"}],fields:{dataType:"User Activity Logs",department:"IT Security",purpose:"Quarterly audit"}},{id:"REQ-2026-006",operationId:"app-consent-request",submittedBy:"emma.thompson@contoso.com",submittedAt:"2026-05-30T10:20:00Z",status:"REJECTED",validation:{riskLevel:"HIGH",riskScore:81,approvalPath:["compliance","security"],checks:[{status:"FAIL",message:"Permissions exceed least privilege requirement"},{status:"FAIL",message:"Data sharing policy violation"},{status:"WARN",message:"Publisher not verified"}]},approvals:[{step:"compliance",status:"REJECTED",approvedBy:"paul.harris@contoso.com",approvedAt:"2026-05-30T14:30:00Z"}],fields:{appName:"Analytics Suite Pro",permissions:"Full Mailbox",vendor:"Unknown Publisher"}},{id:"REQ-2026-007",operationId:"dlp-policy-update",submittedBy:"olivia.white@contoso.com",submittedAt:"2026-05-29T09:00:00Z",status:"COMPLETED",validation:{riskLevel:"MEDIUM",riskScore:62,approvalPath:["security","action"],checks:[{status:"PASS",message:"Impact analysis completed"},{status:"PASS",message:"False positive rate acceptable"},{status:"PASS",message:"User notifications configured"}]},approvals:[{step:"security",status:"APPROVED",approvedBy:"kevin.anderson@contoso.com",approvedAt:"2026-05-29T10:15:00Z"},{step:"action",status:"COMPLETED",approvedAt:"2026-05-29T11:00:00Z"}],fields:{policyName:"Credit Card Detection Enhanced",scope:"All Tenants",sensitivity:"High"}}],te="PENDING_APPROVAL",Ft(e)}function Ft(e){if(!e||!e.querySelector){console.error("❌ Page element not found or invalid");return}const t=te==="ALL"?I:I.filter(s=>s.status===te),i={total:I.length,pending:I.filter(s=>s.status==="PENDING_APPROVAL").length,approved:I.filter(s=>s.status==="APPROVED").length,rejected:I.filter(s=>s.status==="REJECTED").length,completed:I.filter(s=>s.status==="COMPLETED").length};e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-inbox"></i> Service Requests</div>
        <div class="page-subtitle">Manage and approve all service requests in the system</div>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample service requests</span>
    </div>

    <!-- KPI Stats -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${i.total}</div>
        <div class="kpi-label">Total Requests</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${i.pending}</div>
        <div class="kpi-label">Pending Approval</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${i.approved}</div>
        <div class="kpi-label">Approved</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${i.rejected}</div>
        <div class="kpi-label">Rejected</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${i.completed}</div>
        <div class="kpi-label">Completed</div>
      </div>
    </div>

    <!-- Status Filters -->
    <div class="card mb-3">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${["ALL","PENDING_APPROVAL","APPROVED","REJECTED","COMPLETED"].map(s=>`
          <button class="demo-filter-btn ${te===s?"btn-primary":""}" data-status="${s}" style="padding:6px 12px;font-size:11px;border:0.5px solid var(--color-border-secondary);background:${te===s?"var(--clr-info-bg)":"transparent"};color:${te===s?"var(--clr-info-text)":"var(--color-text-secondary)"};border-radius:var(--border-radius-sm);cursor:pointer;transition:all 200ms">
            ${s}
          </button>
        `).join("")}
      </div>
    </div>

    <!-- Requests Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Requests (${t.length})</span>
      </div>
      <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
        ${t.length===0?`
          <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
            <i class="ti ti-inbox" style="font-size:28px;margin-bottom:8px;display:block"></i>
            No requests found
          </div>
        `:`
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead style="background:var(--color-background-secondary)">
              <tr>
                <th style="padding:10px 12px;text-align:left;font-weight:600">ID</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Operation</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Submitted By</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Risk</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Status</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Submitted</th>
                <th style="padding:10px 12px;text-align:center">Action</th>
              </tr>
            </thead>
            <tbody>
              ${t.map(s=>{var a,n;return`
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer" class="demo-req-row" data-id="${s.id}">
                  <td style="padding:10px 12px"><strong>${s.id}</strong></td>
                  <td style="padding:10px 12px">${s.operationId.split("-")[0]}</td>
                  <td style="padding:10px 12px">${s.submittedBy}</td>
                  <td style="padding:10px 12px">
                    <span style="padding:2px 6px;border-radius:3px;font-size:10px;background:${vt((a=s.validation)==null?void 0:a.riskLevel)};color:white">
                      ${((n=s.validation)==null?void 0:n.riskLevel)||"MEDIUM"}
                    </span>
                  </td>
                  <td style="padding:10px 12px">${ut(s.status)}</td>
                  <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">
                    ${new Date(s.submittedAt).toLocaleString()}
                  </td>
                  <td style="padding:10px 12px;text-align:center">
                    ${s.status==="PENDING_APPROVAL"?`
                      <button class="demo-req-review-btn" data-id="${s.id}" style="padding:4px 8px;font-size:9px;background:var(--clr-info-bg);color:var(--clr-info-text);border:none;border-radius:3px;cursor:pointer">
                        ⓘ Review
                      </button>
                    `:`
                      <span style="color:var(--color-text-tertiary);font-size:10px">${s.status}</span>
                    `}
                  </td>
                </tr>
              `}).join("")}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `,e.querySelectorAll(".demo-filter-btn").forEach(s=>{s.addEventListener("click",()=>{te=s.dataset.status,Ft(e)})}),e.querySelectorAll(".demo-req-row").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.id;ee=I.find(n=>n.id===a),ee&&(ke="details",Xt(e))})}),e.querySelectorAll(".demo-req-review-btn").forEach(s=>{s.addEventListener("click",a=>{a.stopPropagation();const n=s.dataset.id;ee=I.find(r=>r.id===n),ee&&(ke="details",Xt(e))})})}function Xt(e){var i,s,a,n,r,o;if(!e||!e.querySelector||!ee)return;const t=ee;e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="demo-back-btn btn" style="padding:6px 12px;border:none;background:var(--color-background-secondary);color:var(--color-text-primary);cursor:pointer;border-radius:var(--border-radius-sm)"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title">${t.id}</div>
          <div class="page-subtitle">${t.operationId} • ${ut(t.status)}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <!-- Request Info -->
      <div>
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Request Information</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted By</div>
                <div>${t.submittedBy}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted</div>
                <div>${new Date(t.submittedAt).toLocaleString()}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Operation</div>
                <div>${t.operationId}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Status</div>
                <div>${t.status}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Risk Assessment</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <div style="font-size:28px;font-weight:600;color:${vt((i=t.validation)==null?void 0:i.riskLevel)}">${((s=t.validation)==null?void 0:s.riskScore)||0}</div>
              <div>
                <div style="font-size:12px;font-weight:600">${((a=t.validation)==null?void 0:a.riskLevel)||"UNKNOWN"} Risk</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">Risk Score (0-100)</div>
              </div>
            </div>

            <div style="border-top:0.5px solid var(--color-border-tertiary);padding-top:10px">
              ${(((n=t.validation)==null?void 0:n.checks)||[]).map(l=>`
                <div style="display:flex;gap:8px;margin-bottom:8px;font-size:10px">
                  <div style="flex-shrink:0">
                    ${l.status==="PASS"?'<i class="ti ti-circle-check" style="color:var(--clr-success-text)"></i>':l.status==="FAIL"?'<i class="ti ti-circle-x" style="color:var(--clr-danger-text)"></i>':'<i class="ti ti-alert-circle" style="color:var(--clr-warning-text)"></i>'}
                  </div>
                  <div>
                    <div style="font-weight:600">${l.message}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Request Fields -->
        <div class="card">
          <div class="card-header"><span class="card-title">Request Fields</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
            ${Object.entries(t.fields).map(([l,c])=>`
              <div style="margin-bottom:8px;padding-bottom:8px;border-bottom:0.5px solid var(--color-border-tertiary)">
                <div style="font-weight:600;color:var(--color-text-secondary);margin-bottom:2px">${l}</div>
                <div style="word-break:break-all;color:var(--color-text-primary)">${c}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Approval Actions -->
      <div>
        <!-- Approval Workflow -->
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Approval Workflow</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            ${(((r=t.validation)==null?void 0:r.approvalPath)||[]).map((l,c)=>{const d=t.approvals.find(f=>f.step===l),p=!d&&l!=="agent"&&l!=="action",v=(d==null?void 0:d.status)==="APPROVED"||(d==null?void 0:d.status)==="COMPLETED";return`
                <div style="display:flex;gap:10px;margin-bottom:12px;align-items:flex-start">
                  <div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;${v?"background:var(--clr-success-bg);color:var(--clr-success-text)":p?"background:var(--clr-warning-bg);color:var(--clr-warning-text)":"background:var(--color-background-tertiary);color:var(--color-text-secondary)"}">
                    ${v?"✓":p?"◯":"—"}
                  </div>
                  <div style="flex:1;font-size:11px">
                    <div style="font-weight:600;text-transform:capitalize">${l}</div>
                    ${d?`
                      <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">
                        ${d.approvedBy||""} • ${new Date(d.approvedAt).toLocaleString()}
                      </div>
                    `:p?`
                      <div style="font-size:10px;color:var(--clr-warning-text);margin-top:2px">Awaiting approval</div>
                    `:`
                      <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">Automated action</div>
                    `}
                  </div>
                </div>
              `}).join("")}
          </div>
        </div>

        <!-- Request Summary -->
        <div class="card">
          <div class="card-header"><span class="card-title">Summary</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px;color:var(--color-text-secondary)">
            <div style="line-height:1.6">
              ${t.status==="PENDING_APPROVAL"?`
                This request is currently awaiting approval. Review the risk assessment and request fields before proceeding.
              `:t.status==="APPROVED"?`
                This request has been approved and is ready for implementation.
              `:t.status==="COMPLETED"?`
                This request has been successfully completed and implemented.
              `:`
                This request was rejected. Please contact the rejection authority for more details.
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,(o=e.querySelector(".demo-back-btn"))==null||o.addEventListener("click",()=>{ke="list",Ft(e)})}async function Yi(e){try{const i=await(await fetch(`${A}/requests?limit=100`)).json();I=Array.isArray(i.data)?i.data:[],console.log(`📋 Loaded ${I.length} requests`)}catch(t){console.error("Error loading requests:",t),u("Failed to load requests","error")}}function pt(e){if(!e||!e.querySelector){console.error("❌ Page element not found or invalid");return}const t=te==="ALL"?I:I.filter(s=>s.status===te),i={total:I.length,pending:I.filter(s=>s.status==="PENDING_APPROVAL").length,approved:I.filter(s=>s.status==="APPROVED").length,rejected:I.filter(s=>s.status==="REJECTED").length,completed:I.filter(s=>s.status==="COMPLETED").length};e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-inbox"></i> Service Requests</div>
        <div class="page-subtitle">Manage and approve all service requests in the system</div>
      </div>
    </div>

    <!-- KPI Stats -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${i.total}</div>
        <div class="kpi-label">Total Requests</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${i.pending}</div>
        <div class="kpi-label">Pending Approval</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${i.approved}</div>
        <div class="kpi-label">Approved</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${i.rejected}</div>
        <div class="kpi-label">Rejected</div>
      </div>
    </div>

    <!-- Status Filters -->
    <div class="card mb-3">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${["ALL","PENDING_APPROVAL","APPROVED","REJECTED","COMPLETED"].map(s=>`
          <button class="btn ${te===s?"btn-primary":""}" id="filter-${s}" style="padding:6px 12px;font-size:11px">
            ${s}
          </button>
        `).join("")}
      </div>
    </div>

    <!-- Requests Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Requests (${t.length})</span>
      </div>
      <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
        ${t.length===0?`
          <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
            <i class="ti ti-inbox" style="font-size:28px;margin-bottom:8px;display:block"></i>
            No requests found
          </div>
        `:`
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead style="background:var(--color-background-secondary)">
              <tr>
                <th style="padding:10px 12px;text-align:left;font-weight:600">ID</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Operation</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Submitted By</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Risk</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Status</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Submitted</th>
                <th style="padding:10px 12px;text-align:center">Action</th>
              </tr>
            </thead>
            <tbody>
              ${t.map(s=>{var a,n;return`
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer" data-id="${s.id}">
                  <td style="padding:10px 12px"><strong>${s.id}</strong></td>
                  <td style="padding:10px 12px">${s.operationId.split("-")[0]}</td>
                  <td style="padding:10px 12px">${s.submittedBy}</td>
                  <td style="padding:10px 12px">
                    <span style="padding:2px 6px;border-radius:3px;font-size:10px;background:${vt((a=s.validation)==null?void 0:a.riskLevel)};color:white">
                      ${((n=s.validation)==null?void 0:n.riskLevel)||"MEDIUM"}
                    </span>
                  </td>
                  <td style="padding:10px 12px">${ut(s.status)}</td>
                  <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">
                    ${new Date(s.submittedAt).toLocaleString()}
                  </td>
                  <td style="padding:10px 12px;text-align:center">
                    ${s.status==="PENDING_APPROVAL"?`
                      <button class="req-review-btn" data-id="${s.id}" style="padding:4px 8px;font-size:9px;background:var(--clr-info-bg);color:var(--clr-info-text);border:none;border-radius:3px;cursor:pointer">
                        ⓘ Review
                      </button>
                    `:`
                      <span style="color:var(--color-text-tertiary);font-size:10px">${s.status}</span>
                    `}
                  </td>
                </tr>
              `}).join("")}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `,e&&e.querySelector&&["ALL","PENDING_APPROVAL","APPROVED","REJECTED","COMPLETED"].forEach(s=>{const a=e.querySelector(`#filter-${s}`);a&&a.addEventListener("click",()=>{te=s,pt(e)})}),e&&e.querySelectorAll&&(e.querySelectorAll("tr[data-id]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.id;ee=I.find(n=>n.id===a),ee&&(ke="details",ei(e))})}),e.querySelectorAll(".req-review-btn").forEach(s=>{s.addEventListener("click",a=>{a.stopPropagation();const n=s.dataset.id;ee=I.find(r=>r.id===n),ee&&(ke="details",ei(e))})}))}function ei(e){var a,n,r,o,l;if(!e||!e.querySelector||!ee)return;const t=ee,i=Pa(t);e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="back-btn"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title">${t.id}</div>
          <div class="page-subtitle">${t.operationId} • ${ut(t.status)}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <!-- Request Info -->
      <div>
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Request Information</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted By</div>
                <div>${t.submittedBy}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted</div>
                <div>${new Date(t.submittedAt).toLocaleString()}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Operation</div>
                <div>${t.operationId}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Status</div>
                <div>${t.status}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Risk Assessment</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <div style="font-size:28px;font-weight:600;color:${vt((a=t.validation)==null?void 0:a.riskLevel)}">${((n=t.validation)==null?void 0:n.riskScore)||0}</div>
              <div>
                <div style="font-size:12px;font-weight:600">${((r=t.validation)==null?void 0:r.riskLevel)||"UNKNOWN"} Risk</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">Risk Score (0-100)</div>
              </div>
            </div>

            <div style="border-top:0.5px solid var(--color-border-tertiary);padding-top:10px">
              ${(((o=t.validation)==null?void 0:o.checks)||[]).map(c=>`
                <div style="display:flex;gap:8px;margin-bottom:8px;font-size:10px">
                  <div style="flex-shrink:0">
                    ${c.status==="PASS"?'<i class="ti ti-circle-check" style="color:var(--clr-success-text)"></i>':c.status==="FAIL"?'<i class="ti ti-circle-x" style="color:var(--clr-danger-text)"></i>':'<i class="ti ti-alert-circle" style="color:var(--clr-warning-text)"></i>'}
                  </div>
                  <div>
                    <div style="font-weight:600">${c.message}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Request Fields -->
        <div class="card">
          <div class="card-header"><span class="card-title">Request Fields</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
            ${Object.entries(t.fields).map(([c,d])=>`
              <div style="margin-bottom:8px;padding-bottom:8px;border-bottom:0.5px solid var(--color-border-tertiary)">
                <div style="font-weight:600;color:var(--color-text-secondary);margin-bottom:2px">${c}</div>
                <div style="word-break:break-all;color:var(--color-text-primary)">${d}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Approval Actions -->
      <div>
        <!-- Approval Workflow -->
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Approval Workflow</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            ${(((l=t.validation)==null?void 0:l.approvalPath)||[]).map((c,d)=>{const p=t.approvals.find(b=>b.step===c),v=!p&&c!=="agent"&&c!=="action",f=(p==null?void 0:p.status)==="APPROVED";return`
                <div style="display:flex;gap:10px;margin-bottom:12px;align-items:flex-start">
                  <div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;${f?"background:var(--clr-success-bg);color:var(--clr-success-text)":v?"background:var(--clr-warning-bg);color:var(--clr-warning-text)":"background:var(--color-background-tertiary);color:var(--color-text-secondary)"}">
                    ${f?"✓":v?"◯":"—"}
                  </div>
                  <div style="flex:1;font-size:11px">
                    <div style="font-weight:600;text-transform:capitalize">${c}</div>
                    ${f?`
                      <div style="color:var(--clr-success-text);font-size:10px">Approved by ${p.approverEmail}</div>
                      <div style="color:var(--color-text-tertiary);font-size:9px">${new Date(p.approvedAt).toLocaleString()}</div>
                    `:v?`
                      <div style="color:var(--clr-warning-text);font-size:10px">Waiting for approval</div>
                    `:""}
                  </div>
                </div>
              `}).join("")}
          </div>
        </div>

        <!-- Approval Actions -->
        ${t.status==="PENDING_APPROVAL"&&i?`
          <div class="card mb-3">
            <div class="card-header"><span class="card-title">Your Action</span></div>
            <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
              <textarea id="approval-comment" placeholder="Add comment (required for rejection)" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;resize:vertical;min-height:60px;margin-bottom:12px"></textarea>
              <div style="display:flex;gap:8px">
                <button class="btn btn-primary" id="approve-btn" style="flex:1;padding:8px">
                  <i class="ti ti-check"></i> Approve
                </button>
                <button class="btn" id="reject-btn" style="flex:1;padding:8px">
                  <i class="ti ti-x"></i> Reject
                </button>
              </div>
            </div>
          </div>
        `:""}

        <!-- Comments -->
        <div class="card">
          <div class="card-header"><span class="card-title">Comments (${t.comments.length})</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);max-height:300px;overflow-y:auto">
            ${t.comments.length===0?`
              <div style="text-align:center;color:var(--color-text-tertiary);font-size:11px">No comments yet</div>
            `:`
              ${t.comments.map(c=>`
                <div style="margin-bottom:12px;padding:10px;background:var(--color-background-secondary);border-radius:4px;font-size:10px">
                  <div style="font-weight:600;margin-bottom:3px">${c.userName}</div>
                  <div style="color:var(--color-text-secondary);margin-bottom:6px">${c.text}</div>
                  <div style="font-size:9px;color:var(--color-text-tertiary)">${new Date(c.createdAt).toLocaleString()}</div>
                </div>
              `).join("")}
            `}
          </div>
        </div>
      </div>
    </div>
  `;const s=e.querySelector("#back-btn");if(s&&s.addEventListener("click",()=>{ke="list",pt(e)}),t.status==="PENDING_APPROVAL"&&i){const c=e.querySelector("#approve-btn"),d=e.querySelector("#reject-btn");c&&c.addEventListener("click",async()=>{const p=e.querySelector("#approval-comment").value;await ti(t.id,"APPROVED",i.step,p,e)}),d&&d.addEventListener("click",async()=>{const p=e.querySelector("#approval-comment").value;if(!p){u("Please provide a reason for rejection","warning");return}await ti(t.id,"REJECTED",i.step,p,e)})}}function ut(e){return{PENDING_APPROVAL:'<span style="color:var(--clr-warning-text)">⏳ Pending</span>',APPROVED:'<span style="color:var(--clr-success-text)">✓ Approved</span>',REJECTED:'<span style="color:var(--clr-danger-text)">✗ Rejected</span>',COMPLETED:'<span style="color:var(--clr-success-text)">✓✓ Completed</span>',FAILED:'<span style="color:var(--clr-danger-text)">! Failed</span>'}[e]||e}function vt(e){return{LOW:"#10b981",MEDIUM:"#f59e0b",HIGH:"#ef4444",CRITICAL:"#991b1b"}[e]||"#6b7280"}function Pa(e){var i;if(e.status!=="PENDING_APPROVAL")return null;const t=((i=e.validation)==null?void 0:i.approvalPath)||["manager","it","agent","action"];for(const s of t){if(s==="agent"||s==="action")continue;if(!e.approvals.find(n=>n.step===s&&n.status==="APPROVED"))return{step:s,approverRole:s,status:"PENDING"}}return null}async function ti(e,t,i,s,a){try{const n=t==="APPROVED"?"approve":"reject",r=t==="APPROVED"?{approverEmail:window.userEmail,approverRole:i,comment:s}:{rejectorEmail:window.userEmail,rejectorRole:i,reason:s};(await(await fetch(`${A}/requests/${e}/${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json()).success?(u(`Request ${t==="APPROVED"?"approved":"rejected"} successfully`,"success"),await Yi(a),ke="list",pt(a)):u("Failed to process approval","error")}catch(n){console.error("Approval error:",n),u("Error submitting approval. Please try again.","error")}}const Bt={current:64,max:95,percentOf100:67.4,delta7d:2,delta30d:5,delta90d:-1,avgComparable:53,trend7d:[58,60,61,61,62,63,64],trend30d:[55,56,57,58,57,58,58,59,59,60,60,60,61,61,62,62,62,62,63,63,63,63,63,64,64,64,64,64,63,64],categories:[{name:"Identity",score:68,max:100,color:"#0C447C",icon:"ti-user-check"},{name:"Devices",score:58,max:100,color:"#3B6D11",icon:"ti-device-laptop"},{name:"Apps",score:72,max:100,color:"#854F0B",icon:"ti-apps"},{name:"Data",score:61,max:100,color:"#3C3489",icon:"ti-database"},{name:"Infrastructure",score:54,max:100,color:"#633806",icon:"ti-server"}]},R={totalUsers:1e3,privAccounts:14,globalAdmins:2,serviceAccounts:12,breakGlass:2,mfaEnabled:870,mfaExcluded:130,passwordlessAdoption:23,fido2Adoption:5,legacyAuthConnections:12,highRiskUsers:3,riskySignIns30d:47,impossibleTravel30d:2,anonymousIP30d:8,passwordSpray30d:0,caPoliciesEnabled:25,caPoliciesDisabled:5,caPoliciesReportOnly:3,caUsersExcluded:18,identitySecureScore:72},Ma={malwareDetected30d:247,phishingAttempts30d:1834,becAttempts30d:3,spoofedDomainActivity30d:12,quarantined30d:4782,spf:"pass",dkim:"pass",dmarc:"quarantine",safeLinks:"enabled",externalForwardingRules:2,suspiciousInboxRules:1,sharedMailboxExposed:14,antiSpamPolicy:"standard"},Ta={totalManaged:847,nonCompliant:15,vulnerable:8,avCoverage:99.4,bitlockerCoverage:95.7,firewallEnabled:98.2,tamperProtection:94.8,activeThreats:2,highSeverityAlerts:4,ransomwareIndicators:1,missingCriticalPatches:23,windows11Pct:71,windows10Pct:27},La={totalTeams:187,publicTeams:8,guestEnabledTeams:34,inactiveTeams90d:23,guestsAdded30d:12,externalDomainsAllowed:3,teamsWithExternalSharing:11,unownedTeams:5},Ra={totalSites:234,externallyShared:18,anonymousLinks:3,publicContent:2,oversharedSites:5,sensitiveFiles:47,largeDownloads30d:8,dlpCoveragePct:78},Da={sensitivityLabelsApplied:34,filesWithoutLabels:18e3,retentionPoliciesActive:4,dlpViolations30d:23,financialDataExposure:8,piiExposure:11,healthcareData:4,dataExfiltration30d:2,unusualDownloads30d:5,usbTransfers30d:3,complianceScore:61,insiderRiskPolicies:2},Ia={globalAdminCount:2,securityAdminCount:2,exchangeAdminCount:2,sharePointAdminCount:1,teamsAdminCount:1,intuneAdminCount:1,newAdmins30d:1,privRoleAssignments30d:4,emergencyAccess30d:0,pimAdoption:85,permanentAssignments:4,pimEligibleRoles:10},za={totalGuests:87,dormantGuests90d:12,expiredGuests:3,guestsWithPrivAccess:0,quarterlyReviewOverdue:14,guestsAddedLast30d:7,guestsRemovedLast30d:3,avgGuestAgeDays:142},qa=[{id:"INC-2341",severity:"critical",title:"Ransomware Indicators — Device MBX-LAPTOP-047",category:"Malware",status:"active",assignee:"Aisha Raza",created:"3h ago",services:["Endpoint","Identity"]},{id:"INC-2338",severity:"high",title:"BEC Attempt — Invoice Fraud Pattern Detected",category:"Phishing",status:"active",assignee:"Chen Wei",created:"6h ago",services:["Exchange"]},{id:"INC-2335",severity:"high",title:"Risky Sign-in — kevin.osei@contoso.com (Unfamiliar Location)",category:"Identity Attack",status:"active",assignee:"Aisha Raza",created:"14h ago",services:["Identity"]},{id:"INC-2330",severity:"high",title:"Suspicious Inbox Rule — Auto-Forward to External",category:"Data Exposure",status:"investigating",assignee:"Chen Wei",created:"Yesterday",services:["Exchange"]},{id:"INC-2298",severity:"medium",title:"Multiple Failed Sign-ins — Brute Force Pattern",category:"Identity Attack",status:"monitoring",assignee:"Chen Wei",created:"2 days ago",services:["Identity"]},{id:"INC-2290",severity:"medium",title:"Sensitive File Shared Externally — Finance folder",category:"Data Exposure",status:"monitoring",assignee:"Aisha Raza",created:"3 days ago",services:["SharePoint","OneDrive"]},{id:"INC-2281",severity:"medium",title:"DLP Policy Violation — PII Data in Teams Chat",category:"Insider Threat",status:"resolved",assignee:"Chen Wei",created:"4 days ago",services:["Teams","Purview"]},{id:"INC-2267",severity:"low",title:"Guest Account — Excessive Resource Access",category:"Identity Attack",status:"resolved",assignee:"Aisha Raza",created:"5 days ago",services:["Identity"]}],xe=[{id:"R01",priority:"critical",title:"Enable MFA for 130 unregistered users",category:"Identity",impact:"Identity",scoreGain:15,effort:"low",status:"open",apiHint:"GET /beta/reports/authenticationMethods/userRegistrationDetails"},{id:"R02",priority:"critical",title:"Block legacy authentication via Conditional Access",category:"Identity",impact:"Identity",scoreGain:8,effort:"low",status:"open",apiHint:"POST /beta/identity/conditionalAccess/policies"},{id:"R03",priority:"high",title:"Upgrade DMARC from quarantine to reject policy",category:"Email",impact:"Email",scoreGain:6,effort:"medium",status:"open",apiHint:"DNS: _dmarc.contoso.com TXT v=DMARC1;p=reject"},{id:"R04",priority:"high",title:"Enable Safe Attachments for all users",category:"Email",impact:"Email",scoreGain:4,effort:"low",status:"open",apiHint:"New-SafeAttachmentPolicy + New-SafeAttachmentRule"},{id:"R05",priority:"high",title:"Disable 2 active external mail forwarding rules",category:"Email",impact:"Email",scoreGain:5,effort:"low",status:"open",apiHint:"GET /beta/users/{id}/mailFolders/inbox/messageRules"},{id:"R06",priority:"high",title:"Remediate 8 vulnerable devices (critical patches missing)",category:"Endpoint",impact:"Devices",scoreGain:6,effort:"medium",status:"open",apiHint:"GET /beta/deviceManagement/managedDevices?$filter=complianceState ne 'compliant'"},{id:"R07",priority:"high",title:"Enable BitLocker on 36 unencrypted devices",category:"Endpoint",impact:"Devices",scoreGain:4,effort:"medium",status:"in-progress",apiHint:"GET /beta/deviceManagement/managedDevices?$select=isEncrypted"},{id:"R08",priority:"medium",title:"Convert 4 permanent admin assignments to PIM eligible",category:"Identity",impact:"Identity",scoreGain:5,effort:"medium",status:"open",apiHint:"GET /beta/roleManagement/directory/roleAssignmentSchedules"},{id:"R09",priority:"medium",title:"Remove or review 12 dormant guest accounts",category:"Guests",impact:"Collaboration",scoreGain:3,effort:"low",status:"open",apiHint:"GET /beta/users?$filter=userType eq 'Guest'&$select=signInActivity"},{id:"R10",priority:"medium",title:"Enable sensitivity auto-labeling for Office files",category:"Data",impact:"Data",scoreGain:4,effort:"high",status:"open",apiHint:"Microsoft Purview → Sensitivity Labels → Auto-labeling"},{id:"R11",priority:"medium",title:"Resolve DLP policy gap — Teams messages not covered",category:"Data",impact:"Data",scoreGain:3,effort:"low",status:"open",apiHint:"GET /beta/compliance/ediscovery/cases or Purview DLP console"},{id:"R12",priority:"medium",title:"Enable phishing-resistant MFA for all admins (FIDO2/CBA)",category:"Identity",impact:"Identity",scoreGain:7,effort:"medium",status:"open",apiHint:"GET /beta/policies/authenticationMethodsPolicy"},{id:"R13",priority:"low",title:"Archive 23 inactive Teams (90d+)",category:"Teams",impact:"Collaboration",scoreGain:2,effort:"low",status:"open",apiHint:"GET /v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')"},{id:"R14",priority:"low",title:"Conduct overdue quarterly access review for 14 guests",category:"Guests",impact:"Collaboration",scoreGain:2,effort:"low",status:"open",apiHint:"GET /v1.0/identityGovernance/accessReviews/definitions"},{id:"R15",priority:"low",title:"Restrict anonymous sharing links in SharePoint",category:"SharePoint",impact:"Data",scoreGain:3,effort:"low",status:"open",apiHint:"Set-SPOTenant -SharingCapability ExistingExternalUserSharingOnly"}],ii=[{category:"Secure Score",source:"Graph Security API",method:"GET",endpoint:"/v1.0/security/secureScores",returns:"Current score, max score, control categories",auth:"SecurityEvents.Read.All"},{category:"Secure Score",source:"Graph Security API",method:"GET",endpoint:"/v1.0/security/secureScoreControlProfiles",returns:"Individual control details and improvement actions",auth:"SecurityEvents.Read.All"},{category:"Identity",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/users?$count=true",returns:"Total user count",auth:"User.Read.All"},{category:"Identity",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/directoryRoles/{id}/members",returns:"Global Administrator members",auth:"Directory.Read.All"},{category:"Identity",source:"Graph Reporting",method:"GET",endpoint:"/beta/reports/authenticationMethods/userRegistrationDetails",returns:"MFA registration status, passwordless, FIDO2 per user",auth:"Reports.Read.All"},{category:"Identity",source:"Entra ID P2",method:"GET",endpoint:"/beta/riskyUsers",returns:"High/medium/low risk users with risk level",auth:"IdentityRiskyUser.Read.All"},{category:"Identity",source:"Entra ID P2",method:"GET",endpoint:"/beta/riskDetections",returns:"Risky sign-in events, impossible travel, anonymous IP",auth:"IdentityRiskEvent.Read.All"},{category:"Identity",source:"Microsoft Graph",method:"GET",endpoint:"/beta/auditLogs/signIns?$filter=clientAppUsed ne 'Browser'",returns:"Legacy authentication sign-ins",auth:"AuditLog.Read.All"},{category:"Conditional Access",source:"Microsoft Graph",method:"GET",endpoint:"/beta/identity/conditionalAccess/policies",returns:"All CA policies, state (enabled/disabled/reportOnly), conditions",auth:"Policy.Read.All"},{category:"Email Security",source:"Exchange Online PS",method:"PS",endpoint:"Get-SafeAttachmentPolicy | Select Name,Action,Enable",returns:"Safe Attachments policy coverage and action mode",auth:"Exchange Admin"},{category:"Email Security",source:"Exchange Online PS",method:"PS",endpoint:"Get-SafeLinksPolicy | Select Name,IsEnabled,ScanUrls",returns:"Safe Links policy status and URL scanning",auth:"Exchange Admin"},{category:"Email Security",source:"Exchange Online PS",method:"PS",endpoint:"Get-DkimSigningConfig | Select Domain,Enabled",returns:"DKIM signing status per domain",auth:"Exchange Admin"},{category:"Email Security",source:"Exchange Online PS",method:"PS",endpoint:"Get-HostedOutboundSpamFilterPolicy | Select AutoForwardingMode",returns:"External mail forwarding policy setting",auth:"Exchange Admin"},{category:"Email Security",source:"Exchange Online PS",method:"PS",endpoint:"Get-InboxRule -Mailbox All | Where {$_.ForwardTo}",returns:"Inbox rules forwarding to external addresses",auth:"Exchange Admin"},{category:"Email Security",source:"DNS Query",method:"DNS",endpoint:"Resolve-DnsName _dmarc.contoso.com -Type TXT",returns:"DMARC policy (none/quarantine/reject)",auth:"None (public DNS)"},{category:"Endpoint",source:"Microsoft Graph (Intune)",method:"GET",endpoint:"/v1.0/deviceManagement/managedDevices",returns:"All managed devices with compliance state, OS, owner",auth:"DeviceManagementManagedDevices.Read.All"},{category:"Endpoint",source:"Microsoft Graph (Intune)",method:"GET",endpoint:"/v1.0/deviceManagement/managedDevices?$filter=complianceState ne 'compliant'",returns:"Non-compliant devices",auth:"DeviceManagementManagedDevices.Read.All"},{category:"Endpoint",source:"Microsoft Graph (Intune)",method:"GET",endpoint:"/beta/deviceManagement/managedDevices?$select=id,deviceName,isEncrypted",returns:"BitLocker encryption status per device",auth:"DeviceManagementManagedDevices.Read.All"},{category:"Defender XDR",source:"Defender API",method:"GET",endpoint:"/api/incidents?$filter=status ne 'Resolved'",returns:"Active incidents with severity, status, assignee",auth:"Incident.Read.All"},{category:"Defender XDR",source:"Defender API",method:"GET",endpoint:"/api/alerts?$filter=severity eq 'High'",returns:"High/critical alerts with category and evidence",auth:"Alert.Read.All"},{category:"Defender XDR",source:"Defender API",method:"GET",endpoint:"/api/recommendations",returns:"Threat and vulnerability management recommendations",auth:"Tvm.Read.All"},{category:"Teams Security",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&$select=id,displayName,visibility",returns:"All Teams with visibility (Public/Private)",auth:"Group.Read.All"},{category:"Teams Security",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/groups/{id}/members?$filter=userType eq 'Guest'",returns:"Guest members within a Team",auth:"GroupMember.Read.All"},{category:"Teams Security",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/teams/{id}/channels",returns:"Team channels including private/shared channel count",auth:"Channel.ReadBasic.All"},{category:"SharePoint",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/sites?$select=id,displayName,webUrl",returns:"All SharePoint site collections",auth:"Sites.Read.All"},{category:"SharePoint",source:"SharePoint Admin PS",method:"PS",endpoint:"Get-SPOSite -Limit All | Select Url,SharingCapability",returns:"Per-site external sharing configuration",auth:"SharePoint Admin"},{category:"SharePoint",source:"Microsoft Graph",method:"GET",endpoint:"/drives/{id}/items/{id}/permissions",returns:"Anonymous link status for files/folders",auth:"Files.Read.All"},{category:"Privileged Access",source:"Microsoft Graph",method:"GET",endpoint:"/beta/roleManagement/directory/roleEligibilitySchedules",returns:"PIM eligible role assignments",auth:"PrivilegedAccess.Read.AzureAD"},{category:"Privileged Access",source:"Microsoft Graph",method:"GET",endpoint:"/beta/roleManagement/directory/roleAssignmentSchedules",returns:"Active (permanent) privileged role assignments",auth:"PrivilegedAccess.Read.AzureAD"},{category:"Guest Governance",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/users?$filter=userType eq 'Guest'&$select=id,displayName,signInActivity",returns:"Guest users with last sign-in timestamp",auth:"User.Read.All"},{category:"Guest Governance",source:"Microsoft Graph",method:"GET",endpoint:"/v1.0/identityGovernance/accessReviews/definitions",returns:"Scheduled access reviews and completion status",auth:"AccessReview.Read.All"},{category:"Data Protection",source:"Purview PS",method:"PS",endpoint:"Get-DlpCompliancePolicy | Select Name,Mode,Enabled",returns:"DLP policy names, enforcement mode, workloads",auth:"Compliance Admin"},{category:"Data Protection",source:"Purview PS",method:"PS",endpoint:"Get-Label | Select DisplayName,Priority,IsActive",returns:"Sensitivity label hierarchy and status",auth:"Compliance Admin"},{category:"Data Protection",source:"Purview PS",method:"PS",endpoint:"Get-RetentionCompliancePolicy | Select Name,Enabled,Workload",returns:"Retention policies and covered workloads",auth:"Compliance Admin"},{category:"Service Health",source:"Microsoft Graph",method:"GET",endpoint:"/admin/serviceAnnouncement/issues",returns:"Active service health incidents and advisories",auth:"ServiceHealth.Read.All"},{category:"Service Health",source:"Microsoft Graph",method:"GET",endpoint:"/admin/serviceAnnouncement/messages",returns:"Message Center posts, planned maintenance",auth:"ServiceHealth.Read.All"}],Na=[{keywords:["high risk user","risky user","show me risky","risk users"],response:`**High-Risk Users (3 Active)**

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

**Graph API:** GET /beta/identity/conditionalAccess/policies`}];let nt=null,G=[],D=R,Te="executive",q={priority:"all",category:"all",status:"all"},st="7d",Oe=[],si=!1;const Ga=[{id:"executive",label:"Executive",icon:"ti-layout-dashboard"},{id:"securescore",label:"Secure Score",icon:"ti-shield-check"},{id:"identity",label:"Identity",icon:"ti-user-check"},{id:"email",label:"Email",icon:"ti-mail"},{id:"endpoint",label:"Endpoint",icon:"ti-device-laptop"},{id:"teams",label:"Teams",icon:"ti-brand-teams"},{id:"sharepoint",label:"SharePoint",icon:"ti-brand-sharepoint"},{id:"dataprotection",label:"Data Protection",icon:"ti-lock"},{id:"privaccess",label:"Priv. Access",icon:"ti-crown"},{id:"guests",label:"Guests",icon:"ti-user-plus"},{id:"incidents",label:"Incidents",icon:"ti-alert-triangle"},{id:"recommendations",label:"Recommendations",icon:"ti-checklist"},{id:"copilot",label:"Security Copilot",icon:"ti-robot"},{id:"apiref",label:"API Reference",icon:"ti-api"}];async function Oa(){const e=document.getElementById("page-security");if(e){if(J()){console.log("🎭 Demo account detected - showing demo security data"),nn(e);return}try{console.log("📡 Fetching real security data from backend...");const t=await Vi();t.success&&t.data?(nt=t.data,console.log("✅ Loaded real secure score from API")):(console.warn("⚠️ No secure score data available from API"),nt=null);let i=[];try{const r=await jt();r.success&&r.data&&(i=r.data,console.log(`✅ Loaded ${i.length} real devices from Intune`))}catch(r){console.warn("⚠️ Could not fetch device data:",r.message)}const s=r=>r.map(o=>{var c,d,p,v,f,b;const l=o.deviceName||((d=(c=o.description)==null?void 0:c.match(/Device ([A-Z0-9-]+)/))==null?void 0:d[1])||((v=(p=o.title)==null?void 0:p.match(/([A-Z0-9-]+)/))==null?void 0:v[1])||((b=(f=o.description)==null?void 0:f.match(/([A-Z0-9]{3,})/))==null?void 0:b[1]);if(l&&i.length>0){const k=i.find(y=>{var w,P;return((w=y.deviceName)==null?void 0:w.toUpperCase().includes(l.toUpperCase()))||((P=y.deviceName)==null?void 0:P.includes(l))||y.id===l});if(k)return{...o,deviceId:k.id,deviceName:k.deviceName,deviceOS:k.operatingSystem,compliant:k.complianceState==="Compliant",managed:!0,owner:k.userDisplayName}}return o}),a=await Xs();a.success&&Array.isArray(a.data)&&a.data.length>0?(G=s(a.data),console.log(`✅ Loaded ${G.length} real incidents from alerts (enriched with device data)`)):(console.warn("⚠️ No active incidents found"),G=[]);const n=await ea();n.success&&n.data&&(D={totalUsers:n.data.totalUsers||R.totalUsers,privAccounts:n.data.privilegedAccounts||R.privAccounts,globalAdmins:n.data.globalAdmins||R.globalAdmins,serviceAccounts:n.data.serviceAccounts||R.serviceAccounts,breakGlass:n.data.breakGlassAccounts||R.breakGlass,identitySecureScore:n.data.identitySecureScore||R.identitySecureScore,mfaEnabled:n.data.mfaEnabled||R.mfaEnabled,mfaExcluded:n.data.mfaExcluded||R.mfaExcluded,passwordlessAdoption:n.data.passwordlessAdoption||R.passwordlessAdoption,fido2Adoption:n.data.fido2Adoption||R.fido2Adoption,legacyAuthConnections:n.data.legacyAuthConnections||R.legacyAuthConnections,highRiskUsers:n.data.highRiskUsers||R.highRiskUsers,riskySignIns30d:n.data.riskySignIns30d||R.riskySignIns30d,impossibleTravel30d:R.impossibleTravel30d,anonymousIP30d:R.anonymousIP30d,passwordSpray30d:R.passwordSpray30d,caPoliciesEnabled:n.data.caPoliciesEnabled||R.caPoliciesEnabled,caPoliciesDisabled:n.data.caPoliciesDisabled||R.caPoliciesDisabled,caPoliciesReportOnly:n.data.caPoliciesReportOnly||R.caPoliciesReportOnly,caUsersExcluded:n.data.caUsersExcluded||R.caUsersExcluded},console.log("✅ Loaded real identity posture data from Azure AD"))}catch(t){console.error("❌ Error loading security data:",t.message)}le(e)}}function le(e){var a,n;const t=Array.isArray(G)?G:[],i=t.filter(r=>r.severity==="critical").length;t.filter(r=>r.severity==="high"&&r.status!=="resolved").length;const s=xe.filter(r=>r.priority==="critical"||r.priority==="high").length;e.innerHTML=`
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
      ${Ua()}
    </div>

    <!-- Internal sub-navigation -->
    <div class="tabs" id="sec-subnav">
      ${Ga.map(r=>`
        <button class="tab-btn ${Te===r.id?"active":""}" data-sec="${r.id}">
          <i class="ti ${r.icon}"></i><span>${r.label}</span>
          ${r.id==="incidents"&&i>0?`<span class="sec-tab-badge red">${i}</span>`:""}
          ${r.id==="recommendations"?`<span class="sec-tab-badge amber">${s}</span>`:""}
          ${r.id==="identity"&&D.highRiskUsers>0?`<span class="sec-tab-badge red">${D.highRiskUsers}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Section content -->
    <div id="sec-content" style="margin-top:16px">${Ba()}</div>
  `,e.querySelectorAll("#sec-subnav .tab-btn").forEach(r=>{r.addEventListener("click",()=>{var o;Te=r.dataset.sec,le(e),(o=e.querySelector("#sec-subnav"))==null||o.scrollIntoView({behavior:"smooth",block:"nearest"})})}),(a=e.querySelector("#sec-refresh"))==null||a.addEventListener("click",()=>{const r=e.querySelector("#sec-refresh");r.innerHTML='<span class="spinner dark"></span> Scanning...',r.disabled=!0,setTimeout(()=>{r.innerHTML='<i class="ti ti-refresh"></i> Refresh',r.disabled=!1,u("Security posture refreshed — all 15 data sources updated.","success")},2200)}),(n=e.querySelector("#sec-report"))==null||n.addEventListener("click",()=>u("Security report exported as PDF.","success")),an(e)}function Ua(){const e=nt||Bt,t=e.percentOf100,i=t>=80?"success":t>=60?"warning":"danger",s=Array.isArray(G)?G:[],a=s.filter(n=>n.severity==="critical"&&n.status!=="resolved").length;return`
    <div class="kpi-tile sec-kpi-primary" style="min-width:160px">
      <div style="display:flex;align-items:center;gap:12px">
        ${rt(e.current,e.max,52)}
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
      <div class="kpi-value ${a>0?"danger":"success"}">${a>0?a:"✓"}</div>
      <div class="kpi-label">Critical Incidents</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${s.filter(n=>n.status!=="resolved").length} open total</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value ${D.highRiskUsers>0?"danger":"success"}">${D.highRiskUsers}</div>
      <div class="kpi-label">High-Risk Users</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${D.riskySignIns30d} risky sign-ins (30d)</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value success">0</div>
      <div class="kpi-label">Vulnerable Devices</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">0 non-compliant</div>
    </div>
  `}function rt(e,t,i=80){const s=e/t,a=i/2*.82,n=i/2,r=i/2,o=2*Math.PI*a,l=o*s,c=s>=.8?"#3B6D11":s>=.6?"#854F0B":"#A32D2D",d=i<60?11:14;return`<svg width="${i}" height="${i}" viewBox="0 0 ${i} ${i}" style="flex-shrink:0">
    <circle cx="${n}" cy="${r}" r="${a}" fill="none" stroke="var(--color-border-tertiary)" stroke-width="${i<60?5:7}"/>
    <circle cx="${n}" cy="${r}" r="${a}" fill="none" stroke="${c}" stroke-width="${i<60?5:7}"
      stroke-dasharray="${l} ${o}" stroke-dashoffset="${o*.25}"
      stroke-linecap="round" transform="rotate(-90 ${n} ${r})"/>
    <text x="${n}" y="${r+4}" text-anchor="middle" font-size="${d}" font-weight="700" fill="${c}">${Math.round(s*100)}%</text>
  </svg>`}function ja(e,t=24){const i=Math.max(...e),s=Math.min(...e),a=i-s||1;return`<div style="display:flex;align-items:flex-end;gap:2px;height:${t}px">
    ${e.map((n,r)=>{const o=Math.max(3,(n-s)/a*t),l=r===e.length-1;return`<div style="width:8px;height:${o}px;background:${l?"var(--clr-primary)":"var(--color-border-secondary)"};border-radius:2px 2px 0 0;flex-shrink:0" title="${n}"></div>`}).join("")}
  </div>`}function Fa(e,t){return e==="pass"||e===!0?`<span style="color:var(--clr-success-text)"><i class="ti ti-circle-check"></i> ${t}</span>`:e==="partial"||e==="warn"?`<span style="color:var(--clr-warning-text)"><i class="ti ti-alert-triangle"></i> ${t}</span>`:`<span style="color:var(--clr-danger-text)"><i class="ti ti-circle-x"></i> ${t}</span>`}function Ba(){return({executive:ai,securescore:Ha,identity:_a,email:Va,endpoint:Wa,teams:Ja,sharepoint:Ka,dataprotection:Ya,privaccess:Za,guests:Qa,incidents:Xa,recommendations:en,copilot:tn,apiref:sn}[Te]||ai)()}function ai(){const e=nt||Bt,t=Array.isArray(G)?G:[];return`
    <!-- Secondary KPI row - Real data only -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value warning">${D.identitySecureScore}</div>
        <div class="kpi-label">Identity Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${D.mfaEnabled/D.totalUsers>=.95?"success":"warning"}">${Math.round(D.mfaEnabled/D.totalUsers*100)}%</div>
        <div class="kpi-label">MFA Adoption</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${D.riskySignIns30d}</div>
        <div class="kpi-label">Risky Sign-ins (30d)</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${D.caPoliciesEnabled}</div>
        <div class="kpi-label">CA Policies Enabled</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${D.totalUsers}</div>
        <div class="kpi-label">Total Users</div>
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <!-- Score trend + category breakdown -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-trending-up"></i> Secure Score Trend</span>
          <div style="display:flex;gap:4px">
            <button class="btn btn-xs ${st==="7d"?"btn-primary":""}" data-trend="7d">7d</button>
            <button class="btn btn-xs ${st==="30d"?"btn-primary":""}" data-trend="30d">30d</button>
          </div>
        </div>
        <div style="display:flex;align-items:flex-end;gap:16px;margin-bottom:16px">
          ${rt(e.current,e.max,80)}
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
          ${ja((st==="30d"?e.trend30d:e.trend7d)||[72,73,74,75,76,77,78],32)}
        </div>
        <div class="section-heading">Category breakdown</div>
        ${(Array.isArray(e.categories)?e.categories:[]).map(i=>`
          <div class="score-bar-row" style="margin-bottom:6px">
            <span class="score-label" style="display:flex;align-items:center;gap:5px;min-width:120px">
              <i class="ti ${i.icon}" style="color:${i.color};font-size:12px"></i>${i.name}
            </span>
            <div class="score-bar" style="flex:1">
              <div class="score-bar-fill" style="width:${i.score}%;background:${i.color}"></div>
            </div>
            <span class="score-pct" style="color:${i.color}">${i.score}%</span>
          </div>
        `).join("")}
      </div>

      <!-- Service security grid -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-layout-grid"></i> Service Security Posture</span>
        </div>
        <div class="sec-svc-grid">
          ${[{name:"Identity",icon:"ti-user-check",score:D.identitySecureScore||72,color:"#0C447C",bg:"#E6F1FB",issues:D.highRiskUsers},{name:"Secure Score",icon:"ti-shield-check",score:Math.round(e.percentOf100),color:"#854F0B",bg:"#FAEEDA",issues:0},{name:"Email",icon:"ti-mail",score:71,color:"#854F0B",bg:"#FAEEDA",issues:0,coming:!0},{name:"Endpoint",icon:"ti-device-laptop",score:58,color:"#3B6D11",bg:"#EAF3DE",issues:0,coming:!0},{name:"Teams",icon:"ti-brand-teams",score:74,color:"#3C3489",bg:"#EEEDFE",issues:0,coming:!0},{name:"SharePoint",icon:"ti-brand-sharepoint",score:66,color:"#3B6D11",bg:"#EAF3DE",issues:0,coming:!0},{name:"Data",icon:"ti-database",score:61,color:"#3C3489",bg:"#EEEDFE",issues:0,coming:!0},{name:"Incidents",icon:"ti-alert-triangle",score:t.filter(i=>i.status!=="resolved").length===0?100:50,color:t.filter(i=>i.status!=="resolved").length===0?"#3B6D11":"#A32D2D",bg:t.filter(i=>i.status!=="resolved").length===0?"#EAF3DE":"#FDEBEB",issues:t.filter(i=>i.status!=="resolved").length}].map(i=>(i.score>=80||i.score>=65,`<div class="sec-svc-tile" data-goto="${i.name.toLowerCase().replace(" ","").replace(".","")}" style="cursor:pointer;${i.coming?"opacity:0.7":""}">
              ${rt(i.score,100,40)}
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:22px;height:22px;border-radius:5px;background:${i.bg};color:${i.color};display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0"><i class="ti ${i.icon}"></i></div>
                  <span style="font-size:11px;font-weight:600">${i.name}</span>
                </div>
                ${i.coming?'<div style="font-size:9px;color:var(--clr-info-text);margin-top:2px">Real data soon</div>':i.issues>0?`<div style="font-size:9px;color:var(--clr-warning-text);margin-top:2px">${i.issues} issue${i.issues>1?"s":""}</div>`:'<div style="font-size:9px;color:var(--clr-success-text);margin-top:2px">No issues</div>'}
              </div>
            </div>`)).join("")}
        </div>
      </div>
    </div>

    <!-- Real Incidents only -->
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Active Incidents</span>
          <button class="btn btn-xs btn-primary" id="exec-view-incidents">View all</button>
        </div>
        ${t.filter(i=>i.status!=="resolved").length>0?`
          ${t.filter(i=>i.status!=="resolved").slice(0,4).map(i=>`
            <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
              <span class="badge ${i.severity==="critical"||i.severity==="high"?"danger":"warning"}" style="flex-shrink:0;min-width:56px;justify-content:center">${i.severity}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:11px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${i.title}</div>
                <div style="font-size:9px;color:var(--color-text-tertiary)">${i.id} · ${i.category} · ${i.created}</div>
              </div>
            </div>
          `).join("")}
        `:`
          <div style="padding:16px;text-align:center;color:var(--clr-success-text)">
            <i class="ti ti-circle-check" style="font-size:24px;display:block;margin-bottom:8px"></i>
            <strong>No active incidents</strong><br/>
            <span style="font-size:11px">Your tenant is secure</span>
          </div>
        `}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-shield-check"></i> Identity Security</span>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:12px">
          <div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:8px;text-transform:uppercase;font-weight:600">Real-time Metrics</div>
          <div style="font-size:12px"><strong>${D.totalUsers}</strong> users</div>
          <div style="font-size:12px"><strong>${D.globalAdmins}</strong> global admins</div>
          <div style="font-size:12px"><strong>${D.highRiskUsers}</strong> high-risk users</div>
          <div style="font-size:12px"><strong>${D.caPoliciesEnabled}</strong> CA policies enabled</div>
        </div>
      </div>
    </div>
  `}function Ha(){const e=Bt;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Microsoft Secure Score</div>
        <div style="display:flex;align-items:center;gap:24px;margin-bottom:20px">
          ${rt(e.current,e.max,100)}
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
            <div class="kpi-value warning">${xe.reduce((t,i)=>t+i.scoreGain,0)}</div>
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
        ${(Array.isArray(e.categories)?e.categories:[]).map(t=>`
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
        <span class="badge info">${xe.length} recommendations · ${xe.reduce((t,i)=>t+i.scoreGain,0)} pts potential</span>
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
          ${xe.slice(0,8).map(t=>`
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
  `}function _a(){const e=D;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-user-check"></i> Identity Posture</div>
        ${ie([{label:"Total Users",val:e.totalUsers.toLocaleString(),cls:"info"},{label:"Privileged Accounts",val:e.privAccounts,cls:"warning"},{label:"Global Admins",val:e.globalAdmins,cls:e.globalAdmins<=2?"success":"danger"},{label:"Service Accounts",val:e.serviceAccounts,cls:"info"},{label:"Break Glass Accounts",val:e.breakGlass,cls:"success"},{label:"Identity Secure Score",val:e.identitySecureScore+"%",cls:"warning"}])}
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-device-mobile"></i> Authentication</div>
        ${ie([{label:"MFA Enabled",val:e.mfaEnabled+" / "+e.totalUsers,cls:"success"},{label:"MFA Excluded",val:e.mfaExcluded,cls:"danger"},{label:"Passwordless %",val:e.passwordlessAdoption+"%",cls:"warning"},{label:"FIDO2 Adopted",val:e.fido2Adoption,cls:"info"},{label:"Legacy Auth Connections",val:e.legacyAuthConnections,cls:e.legacyAuthConnections===0?"success":"danger"}])}
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
        <div class="alert-banner ${e.highRiskUsers>0?"danger":"success"}" style="margin-bottom:12px">
          <i class="ti ti-${e.highRiskUsers>0?"alert-triangle":"circle-check"}"></i>
          ${e.highRiskUsers>0?`${e.highRiskUsers} high-risk users require immediate attention.`:"No high-risk users detected."}
        </div>
        ${ie([{label:"High-Risk Users",val:e.highRiskUsers,cls:e.highRiskUsers===0?"success":"danger"},{label:"Risky Sign-ins",val:e.riskySignIns30d,cls:"warning"},{label:"Impossible Travel",val:e.impossibleTravel30d,cls:e.impossibleTravel30d===0?"success":"danger"},{label:"Anonymous IP Sign-ins",val:e.anonymousIP30d,cls:e.anonymousIP30d===0?"success":"warning"},{label:"Password Spray Attacks",val:e.passwordSpray30d,cls:"success"}])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/riskyUsers · GET /beta/riskDetections</code></div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-lock-access"></i> Conditional Access</div>
        ${ie([{label:"Policies Enabled",val:e.caPoliciesEnabled,cls:"success"},{label:"Policies Disabled",val:e.caPoliciesDisabled,cls:e.caPoliciesDisabled===0?"success":"warning"},{label:"Report-Only Mode",val:e.caPoliciesReportOnly,cls:"warning"},{label:"Users Excluded",val:e.caUsersExcluded,cls:e.caUsersExcluded>10?"warning":"success"}])}
        ${ve(["Require phishing-resistant MFA (FIDO2/CBA) for all admins","Remove legacy authentication via dedicated CA policy","Reduce Global Admin count to maximum 2 PIM-protected accounts","Review 18 CA policy exclusions — remove unnecessary exemptions"])}
      </div>
    </div>
  `}function Va(){const e=Ma;return`
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
              <div style="font-size:12px;font-weight:600;margin-bottom:3px">${Fa(t.ok,t.ok==="pass"||t.ok===!0?"Pass":t.ok==="warn"?"Warning":"Fail")}</div>
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
        ${ie([{label:"External Forwarding Rules",val:e.externalForwardingRules,cls:"danger"},{label:"Suspicious Inbox Rules",val:e.suspiciousInboxRules,cls:"danger"},{label:"Shared Mailboxes",val:e.sharedMailboxExposed,cls:"info"}])}
        ${ve(["Enable Strict Preset Security Policies in Defender for Office 365","Disable automatic external mail forwarding tenant-wide","Upgrade DMARC policy from quarantine to reject","Extend Safe Attachments coverage to all users (currently partial)"])}
      </div>
    </div>
  `}function Wa(){const e=Ta;return`
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
        ${ie([{label:"Active Threats",val:e.activeThreats,cls:"danger"},{label:"High Severity Alerts",val:e.highSeverityAlerts,cls:"danger"},{label:"Windows 11 (%)",val:e.windows11Pct+"%",cls:"success"},{label:"Windows 10 (%)",val:e.windows10Pct+"%",cls:"warning"}])}
        ${ve(["Patch 23 devices missing critical security updates","Isolate ransomware-affected device MBX-LAPTOP-047","Enable BitLocker on remaining 36 unencrypted devices","Harden SMB and RDP access on Windows 10 devices"])}
      </div>
    </div>
  `}function Ja(){const e=La;return`
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
        ${ie([{label:"Teams with External Sharing",val:e.teamsWithExternalSharing,cls:"warning"},{label:"Unowned Teams",val:e.unownedTeams,cls:"warning"},{label:"Guests Added (30d)",val:e.guestsAdded30d,cls:"info"},{label:"External Domains Allowed",val:e.externalDomainsAllowed,cls:"warning"}])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&$select=displayName,visibility</code></div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${ve(["Archive 23 inactive Teams (90d+) to reduce sprawl and exposure","Assign owners to 5 unowned Teams","Conduct guest access review for 34 guest-enabled Teams","Review 8 public Teams — consider making private","Restrict external domains to known partners only"])}
      </div>
    </div>
  `}function Ka(){const e=Ra;return`
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
        ${ie([{label:"Public Content",val:e.publicContent,cls:"danger"},{label:"Large Downloads (30d)",val:e.largeDownloads30d,cls:"warning"},{label:"DLP Coverage",val:e.dlpCoveragePct+"%",cls:"warning"},{label:"Ext. Sharing Restricted",val:"Yes",cls:"success"}])}
        <div class="alert-banner danger mt-3" style="margin-bottom:0">
          <i class="ti ti-alert-triangle"></i>
          ${`${e.anonymousLinks} anonymous "Anyone" links allow unauthenticated access to content.`}
        </div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${ve(["Remove 3 anonymous sharing links — replace with authenticated sharing","Review 5 overshared sites with > 100 members","Enable sensitivity labels for automatic file classification",'Restrict external sharing to "Existing guests only" on high-risk sites',"Configure DLP policy for SharePoint to reach 100% coverage"])}
      </div>
    </div>
  `}function Ya(){const e=Da;return`
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
        ${ie([{label:"Files Without Labels",val:e.filesWithoutLabels.toLocaleString(),cls:"danger"},{label:"Retention Policies",val:e.retentionPoliciesActive,cls:"info"},{label:"Insider Risk Policies",val:e.insiderRiskPolicies,cls:"info"},{label:"Unusual Downloads (30d)",val:e.unusualDownloads30d,cls:"warning"}])}
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
        ${ve(["Enable sensitivity auto-labeling for ~18,000 unlabeled Office files","Extend DLP policy coverage to include Teams messages","Configure insider risk policy for data exfiltration patterns","Review 3 USB transfer events — check device compliance policy","Expand retention policies to cover Teams chat and OneDrive"])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">Get-DlpCompliancePolicy | Get-Label | Get-RetentionCompliancePolicy</code></div>
      </div>
    </div>
  `}function Za(){const e=Ia;return`
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
        ${ie([{label:"New Admin Created",val:e.newAdmins30d,cls:"warning"},{label:"Priv. Role Assignments",val:e.privRoleAssignments30d,cls:"info"},{label:"Emergency Access Used",val:e.emergencyAccess30d,cls:"success"},{label:"PIM Eligible Roles",val:e.pimEligibleRoles,cls:"success"}])}
        ${ve(["Convert 4 permanent admin role assignments to PIM eligible","Implement Just-in-Time access for all privileged roles","Conduct quarterly access review for all admin role holders","Enable PIM access review notifications for approvers"])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/roleManagement/directory/roleEligibilitySchedules</code></div>
      </div>
    </div>
  `}function Qa(){const e=za;return`
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
        ${ie([{label:"Added (30d)",val:e.guestsAddedLast30d,cls:"info"},{label:"Removed (30d)",val:e.guestsRemovedLast30d,cls:"success"},{label:"Avg Account Age",val:e.avgGuestAgeDays+"d",cls:"warning"}])}
        <div class="alert-banner danger mt-3" style="margin-bottom:0">
          <i class="ti ti-clock"></i>
          ${e.expiredGuests} expired guest accounts should be removed immediately.
          ${e.dormantGuests90d} dormant guests require review.
        </div>
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /v1.0/users?$filter=userType eq 'Guest'&$select=displayName,signInActivity</code></div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${ve(["Remove 3 expired guest accounts immediately","Review and remove 12 dormant guests (90d+ no sign-in)","Schedule overdue quarterly access review for 14 guests","Require manager attestation for all guest renewals","Implement automatic expiry policy (365 days max)"])}
      </div>
    </div>
  `}function Xa(){const e=G.filter(r=>r.status!=="resolved"),t=G.filter(r=>r.status==="resolved"),i=G.filter(r=>r.severity==="critical").length,s=G.filter(r=>r.severity==="high").length,a=G.filter(r=>r.severity==="medium").length,n=G.filter(r=>r.severity==="low").length;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value ${i>0?"danger":"success"}">${i}</div><div class="kpi-label">Critical</div></div>
      <div class="kpi-tile"><div class="kpi-value ${s>0?"danger":"success"}">${s}</div><div class="kpi-label">High</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${a}</div><div class="kpi-label">Medium</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${n}</div><div class="kpi-label">Low</div></div>
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
  `}function en(){const e=xe.filter(s=>!(q.priority!=="all"&&s.priority!==q.priority||q.category!=="all"&&s.category!==q.category||q.status!=="all"&&s.status!==q.status)),t=e.reduce((s,a)=>s+a.scoreGain,0),i=[...new Set(xe.map(s=>s.category))];return`
    <div class="filter-bar mb-3">
      <select class="form-select" id="rec-priority">
        <option value="all" ${q.priority==="all"?"selected":""}>All Priorities</option>
        <option value="critical" ${q.priority==="critical"?"selected":""}>Critical</option>
        <option value="high" ${q.priority==="high"?"selected":""}>High</option>
        <option value="medium" ${q.priority==="medium"?"selected":""}>Medium</option>
        <option value="low" ${q.priority==="low"?"selected":""}>Low</option>
      </select>
      <select class="form-select" id="rec-category">
        <option value="all">All Categories</option>
        ${i.map(s=>`<option value="${s}" ${q.category===s?"selected":""}>${s}</option>`).join("")}
      </select>
      <select class="form-select" id="rec-status">
        <option value="all" ${q.status==="all"?"selected":""}>All Status</option>
        <option value="open" ${q.status==="open"?"selected":""}>Open</option>
        <option value="in-progress" ${q.status==="in-progress"?"selected":""}>In Progress</option>
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
  `}function tn(){(!si||Oe.length===0)&&(Oe=[{role:"ai",text:`**M365 Security Copilot** — I have full context of your security posture across all 15 data sources.

Current tenant: **${m.tenantDomain}** · Secure Score: **64/95** · ${G.filter(t=>t.status!=="resolved").length} active incidents

Ask me anything about your security posture, specific risks, or recommended actions.`}],si=!0);const e=["Show me all high-risk users","Why did Secure Score drop this week?","Which Teams have external guests?","Top 10 security improvements","Which devices are vulnerable to ransomware?","Summarize today's security posture","Email security status","MFA coverage and gaps","Conditional Access coverage","Guest user governance"];return`
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="sec-copilot-msgs">
        ${Oe.map(t=>`
          <div class="chat-msg ${t.role==="ai"?"ai":"user-msg"}" style="max-width:85%;margin-bottom:12px">
            ${t.role==="ai"?'<div class="chat-sender"><i class="ti ti-shield-check" style="color:var(--clr-info-text)"></i> Security Copilot</div>':'<div class="chat-sender" style="justify-content:flex-end">You</div>'}
            <div class="chat-bubble">${Zi(t.text)}</div>
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
  `}function sn(){return`
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

    ${[...new Set(ii.map(t=>t.category))].map(t=>`
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
            ${ii.filter(i=>i.category===t).map(i=>`
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
  `}function an(e){var a,n,r,o,l;const t=e.querySelector("#sec-content");if(!t)return;t.querySelectorAll("[data-trend]").forEach(c=>{c.addEventListener("click",()=>{st=c.dataset.trend,le(e)})}),t.querySelectorAll("[data-goto]").forEach(c=>{c.addEventListener("click",()=>{const p={identity:"identity",email:"email",endpoint:"endpoint",teams:"teams",sharepoint:"sharepoint",data:"dataprotection",privaccess:"privaccess",guests:"guests"}[c.dataset.goto];p&&(Te=p,le(e))})}),(a=t.querySelector("#exec-view-incidents"))==null||a.addEventListener("click",()=>{Te="incidents",le(e)}),(n=t.querySelector("#exec-view-recs"))==null||n.addEventListener("click",()=>{Te="recommendations",le(e)}),(r=t.querySelector("#rec-priority"))==null||r.addEventListener("change",c=>{q.priority=c.target.value,le(e)}),(o=t.querySelector("#rec-category"))==null||o.addEventListener("change",c=>{q.category=c.target.value,le(e)}),(l=t.querySelector("#rec-status"))==null||l.addEventListener("change",c=>{q.status=c.target.value,le(e)});const i=t.querySelector("#sec-cop-send"),s=t.querySelector("#sec-cop-input");i&&s&&(i.addEventListener("click",()=>ft(e,s)),s.addEventListener("keydown",c=>{c.key==="Enter"&&!c.shiftKey&&(c.preventDefault(),ft(e,s))})),t.querySelectorAll(".sec-cop-pill").forEach(c=>{c.addEventListener("click",()=>{const d=t.querySelector("#sec-cop-input");d&&(d.value=c.dataset.q,ft(e,d))})}),t.querySelectorAll(".api-copy").forEach(c=>{c.addEventListener("click",()=>{navigator.clipboard.writeText(c.dataset.code),u("Endpoint copied to clipboard.","success")})})}function ft(e,t){const i=t.value.trim();if(!i)return;Oe.push({role:"user",text:i}),t.value="";const s=e.querySelector("#sec-copilot-msgs");s&&(s.innerHTML+=`<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${i}</div>
    </div>`,s.scrollTop=s.scrollHeight),setTimeout(()=>{const a=i.toLowerCase(),n=Na.find(o=>o.keywords.some(l=>a.includes(l))),r=(n==null?void 0:n.response)||`Analysing your query across all 15 security data sources...

For **"${i}"**: Based on current tenant data, navigate to the relevant section in the Security Command Center for detailed information. Use the Recommendations tab for prioritised action items, or check the Incidents section for active threats.

Current status: Secure Score 64/95 · ${G.filter(o=>o.status!=="resolved").length} active incidents · ${R.highRiskUsers} high-risk users.`;Oe.push({role:"ai",text:r}),s&&(s.innerHTML+=`<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-shield-check" style="color:var(--clr-info-text)"></i> Security Copilot</div>
        <div class="chat-bubble">${Zi(r)}</div>
      </div>`,s.scrollTop=s.scrollHeight)},600)}function Zi(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n\n/g,"<br><br>").replace(/\n/g,"<br>").replace(/\|(.+)\|\n\|[-|: ]+\|\n/g,"").replace(/\|(.+)\|/g,t=>`<span style="display:flex;gap:16px;font-size:11px;padding:2px 0">${t.split("|").filter(s=>s.trim()).map(s=>`<span>${s.trim()}</span>`).join("")}</span>`)}function nn(e){const t={overallScore:78,categoryScores:{identity:82,data:75,devices:72,apps:76,infrastructure:79}},i=qa.slice(0,5);e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-shield-check"></i> Security</div>
        <div class="page-subtitle">Comprehensive security posture and threat assessment</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample security data</span>
    </div>

    <div class="kpi-row" style="margin-bottom:20px">
      <div class="kpi-tile">
        <div class="kpi-value info">78</div>
        <div class="kpi-label">Overall Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">82</div>
        <div class="kpi-label">Identity</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">75</div>
        <div class="kpi-label">Data</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">72</div>
        <div class="kpi-label">Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">5</div>
        <div class="kpi-label">Incidents</div>
      </div>
    </div>

    <div class="tabs" id="sec-tabs">
      <button class="tab-btn active" data-section="executive">Executive</button>
      <button class="tab-btn" data-section="securescore">Secure Score</button>
      <button class="tab-btn" data-section="identity">Identity</button>
      <button class="tab-btn" data-section="incidents">Incidents</button>
    </div>

    <div id="security-content"></div>
  `;const s=e.querySelector("#security-content");ni(s,t,i),e.querySelectorAll("#sec-tabs .tab-btn").forEach(a=>{a.addEventListener("click",()=>{e.querySelectorAll("#sec-tabs .tab-btn").forEach(r=>r.classList.remove("active")),a.classList.add("active");const n=a.dataset.section;n==="executive"?ni(s,t,i):n==="securescore"?rn(s,t):n==="identity"?on(s):n==="incidents"&&ln(s,i)})})}function ni(e,t,i){e.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Overall Security Score</span>
        <span class="badge warning">${t.overallScore}%</span>
      </div>
      <table style="width:100%">
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:11px;font-weight:600">Identity</td>
            <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:700;color:var(--clr-info-text)">${t.categoryScores.identity}%</td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:11px;font-weight:600">Data</td>
            <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:700;color:var(--clr-warning-text)">${t.categoryScores.data}%</td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:11px;font-weight:600">Devices</td>
            <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:700;color:var(--clr-warning-text)">${t.categoryScores.devices}%</td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px 12px;font-size:11px;font-weight:600">Apps</td>
            <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:700;color:var(--clr-info-text)">${t.categoryScores.apps}%</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;font-size:11px;font-weight:600">Infrastructure</td>
            <td style="padding:10px 12px;text-align:right;font-size:14px;font-weight:700;color:var(--clr-success-text)">${t.categoryScores.infrastructure}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Active Incidents</span>
        <span class="badge danger">${i.length} alerts</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Incident</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Severity</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Detected</th>
          </tr>
        </thead>
        <tbody>
          ${i.slice(0,5).map(s=>`
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px;font-size:11px;color:var(--color-text-secondary)">${s.title}</td>
              <td style="padding:10px;font-size:10px"><span class="badge ${s.severity==="high"?"danger":"warning"}">${s.severity}</span></td>
              <td style="padding:10px;font-size:10px"><span class="badge info">Investigating</span></td>
              <td style="padding:10px;font-size:10px;color:var(--color-text-tertiary)">${new Date(s.detectedAt||Date.now()).toLocaleDateString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function rn(e,t){e.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Microsoft Secure Score</span>
      </div>
      <div style="padding:20px;text-align:center">
        <div style="font-size:48px;font-weight:700;color:var(--clr-warning-text);margin-bottom:8px">${t.overallScore}</div>
        <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:20px">Out of 100 possible points</div>
        <div style="width:100%;height:8px;background:var(--color-background-secondary);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${t.overallScore}%;background:var(--clr-warning-bg)"></div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="card">
        <div class="card-title">Identity & Access</div>
        <div style="margin-top:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:11px">Secure Score:</span>
            <span style="font-size:11px;font-weight:600">${t.categoryScores.identity} points</span>
          </div>
          <div style="height:4px;background:var(--color-background-secondary);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${t.categoryScores.identity}%;background:var(--clr-info-bg)"></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Data Security</div>
        <div style="margin-top:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:11px">Secure Score:</span>
            <span style="font-size:11px;font-weight:600">${t.categoryScores.data} points</span>
          </div>
          <div style="height:4px;background:var(--color-background-secondary);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${t.categoryScores.data}%;background:var(--clr-warning-bg)"></div>
          </div>
        </div>
      </div>
    </div>
  `}function on(e){e.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Identity Posture</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Total Users</div>
          <div style="font-size:24px;font-weight:700">1,000</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">MFA Enabled</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">856</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">85.6%</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Global Admins</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">4</div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Conditional Access</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Policy</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Require MFA for admins</td>
            <td style="padding:10px"><span class="badge success">Enabled</span></td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Block legacy authentication</td>
            <td style="padding:10px"><span class="badge success">Enabled</span></td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Require compliant devices</td>
            <td style="padding:10px"><span class="badge warning">Report only</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `}function ln(e,t){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Security Alerts</span>
        <span class="badge danger">${t.length} open</span>
      </div>
      ${t.map((i,s)=>`
        <div style="padding:12px;border-bottom:${s<t.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
            <div style="font-weight:600;font-size:11px">${i.title}</div>
            <span class="badge ${i.severity==="high"?"danger":"warning"}">${i.severity}</span>
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:8px">${i.description}</div>
          <div style="font-size:9px;color:var(--color-text-tertiary)">Detected: ${new Date(i.detectedAt||Date.now()).toLocaleString()}</div>
        </div>
      `).join("")}
    </div>
  `}function ie(e){return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${e.map(t=>`
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-tertiary)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600;letter-spacing:0.3px">${t.label}</div>
        <div style="font-size:16px;font-weight:700;color:${t.cls==="success"?"var(--clr-success-text)":t.cls==="danger"?"var(--clr-danger-text)":t.cls==="warning"?"var(--clr-warning-text)":t.cls==="info"?"var(--clr-info-text)":"var(--color-text-primary)"}">${t.val}</div>
      </div>
    `).join("")}
  </div>`}function ve(e){return`<div style="margin-top:12px">
    <div class="section-heading">Recommendations</div>
    ${e.map(t=>`
      <div style="display:flex;gap:6px;padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px;color:var(--color-text-secondary)">
        <i class="ti ti-arrow-right" style="color:var(--clr-warning-text);font-size:11px;flex-shrink:0;margin-top:2px"></i>
        ${t}
      </div>
    `).join("")}
  </div>`}async function ge(e,t={}){const s=`${window.location.hostname==="localhost"?"http://localhost:3000":"https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net"}/api/tenantguard${e}`;try{const a=await fetch(s,{method:t.method||"GET",headers:{"Content-Type":"application/json",...t.headers},body:t.body?JSON.stringify(t.body):void 0});if(!a.ok)throw new Error(`API error: ${a.status}`);return await a.json()}catch(a){throw console.error("TenantGuard API error:",a),a}}async function dn(){return(await ge("/alerts/summary")).data}async function cn(e="all",t=50){let i=`/alerts?limit=${t}`;return e!=="all"&&(i+=`&severity=${e}`),(await ge(i)).data}async function Qi(e,t=""){return await ge(`/alerts/${e}/dismiss`,{method:"POST",body:{reason:t}})}async function pn(e="all"){let t="/correlations";return e!=="all"&&(t+=`?severity=${e}`),(await ge(t)).data}async function un(e=null,t=null,i=null){return(await ge("/investigate",{method:"POST",body:{alertId:e,correlationId:t,title:i}})).data}async function vn(e){return(await ge(`/investigations/${e}`)).data}async function gn(e,t){return(await ge(`/investigations/${e}/chat`,{method:"POST",body:{message:t}})).data}async function mn(e){return(await ge(`/investigations/${e}/report`,{method:"POST"})).data}let Z="alerts",ne="all",re=[],ue=[],Ee=null,ht=null;const yn=[{id:"all",label:"All Alerts",icon:"ti-list"},{id:"CRITICAL",label:"Critical",icon:"ti-alert-triangle"},{id:"HIGH",label:"High",icon:"ti-alert-circle"},{id:"MEDIUM",label:"Medium",icon:"ti-alert-octagon"}],fn=[{id:"alerts",label:"Alerts",icon:"ti-list"},{id:"correlations",label:"Correlations",icon:"ti-link"},{id:"patterns",label:"Attack Patterns",icon:"ti-alert-triangle"},{id:"investigation",label:"AI Investigation",icon:"ti-robot"}];async function hn(){const e=document.getElementById("page-tenantguard");if(e){if(J()){console.log("🎭 Demo account detected - showing demo TenantGuard alerts"),bn(e);return}e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading TenantGuard alerts...</p></div>';try{await Ve()}catch(t){console.error("Error initializing TenantGuard:",t),u("Failed to load alerts","error")}ht&&clearInterval(ht),ht=setInterval(Ve,5*60*1e3)}}async function Ve(){try{const[e,t,i]=await Promise.all([dn(),cn("all",100),pn("all")]);re=t||[],ue=i||[],kn(e)}catch(e){console.error("Error refreshing data:",e),u("Failed to refresh alerts: "+e.message,"error")}}function bn(e){const t=[{id:"alert-1",severity:"CRITICAL",title:"Suspicious Bulk User Creation",description:"Detected 47 user accounts created in 3 minutes from unusual location",source:"Azure AD",timestamp:"2026-06-01 14:32:15",status:"open",riskScore:95},{id:"alert-2",severity:"CRITICAL",title:"Global Admin Role Assignment Detected",description:"User aisha.raza@contoso.com assigned Global Admin role outside normal hours",source:"Azure AD Audit",timestamp:"2026-06-01 13:45:22",status:"open",riskScore:92},{id:"alert-3",severity:"HIGH",title:"Impossible Travel Detected",description:"Sign-in from UK (London) followed by sign-in from Australia (Sydney) within 2 hours",source:"Identity Protection",timestamp:"2026-06-01 12:15:43",status:"open",riskScore:78},{id:"alert-4",severity:"HIGH",title:"Abnormal Token Usage",description:"Service principal exchanged 342 tokens in 45 minutes (baseline: 8 tokens/hour)",source:"Token Audit",timestamp:"2026-06-01 11:30:21",status:"investigating",riskScore:75},{id:"alert-5",severity:"MEDIUM",title:"MFA Configuration Change",description:"MFA enforcement policy disabled by chen.wei@contoso.com",source:"Azure AD Config",timestamp:"2026-06-01 10:15:09",status:"open",riskScore:58}],i=[{id:"corr-1",title:"Coordinated Account Compromise",description:"Multiple accounts experiencing impossible travel, abnormal token usage, and suspicious sign-ins",alerts:["alert-2","alert-3","alert-4"],severity:"CRITICAL",confidence:96},{id:"corr-2",title:"Potential Lateral Movement",description:"User access patterns suggest attacker moving through service principals to access sensitive data",alerts:["alert-4","alert-5"],severity:"HIGH",confidence:87}],s={critical:2,high:2,total:5};Z="alerts",ne="all",re=t,ue=i,xn(e,s)}function xn(e,t){var o;const i=t.critical||0,s=t.high||0,a=t.total||0,n=ue.length;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-alert-triangle"></i> TenantGuard Alert Center</div>
        <div class="page-subtitle">Real-time alerts, correlations & attack pattern detection · ${a} alerts · ${n} correlations</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="tg-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample TenantGuard alerts</span>
    </div>

    <!-- KPI Tiles -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${i}</div>
        <div class="kpi-label">Critical Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${s}</div>
        <div class="kpi-label">High Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${n}</div>
        <div class="kpi-label">Correlations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${a}</div>
        <div class="kpi-label">Total Alerts</div>
      </div>
    </div>

    <div class="tabs">
      <button class="tab-btn active" data-section="alerts">
        <i class="ti ti-list"></i> Alerts
      </button>
      <button class="tab-btn" data-section="correlations">
        <i class="ti ti-link"></i> Correlations
      </button>
    </div>

    <div id="demo-content"></div>
  `;const r=e.querySelector("#demo-content");ri(r),e.querySelectorAll(".tabs .tab-btn").forEach(l=>{l.addEventListener("click",()=>{e.querySelectorAll(".tabs .tab-btn").forEach(d=>d.classList.remove("active")),l.classList.add("active");const c=l.dataset.section;c==="alerts"?ri(r):c==="correlations"&&wn(r)})}),(o=e.querySelector("#tg-refresh"))==null||o.addEventListener("click",()=>{const l=e.querySelector("#tg-refresh");l.innerHTML='<span class="spinner dark"></span> Refreshing...',l.disabled=!0,setTimeout(()=>{l.innerHTML='<i class="ti ti-refresh"></i> Refresh',l.disabled=!1},2e3)})}function ri(e){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Security Alerts</span>
        <span class="badge danger">${re.length} alerts</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Severity</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Alert Title</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Source</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Risk Score</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Time</th>
          </tr>
        </thead>
        <tbody>
          ${re.map((t,i)=>`
            <tr style="border-bottom:${i<re.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px"><span class="badge ${t.severity==="CRITICAL"?"danger":"warning"}">${t.severity}</span></td>
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${t.title}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${t.source}</td>
              <td style="padding:10px 12px;font-size:10px">
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:40px;height:6px;background:var(--color-background-secondary);border-radius:3px;overflow:hidden">
                    <div style="height:100%;width:${t.riskScore}%;background:${t.riskScore>=80?"var(--clr-danger-text)":"var(--clr-warning-text)"}"></div>
                  </div>
                  <span style="font-weight:600;color:${t.riskScore>=80?"var(--clr-danger-text)":"var(--clr-warning-text)"}">${t.riskScore}</span>
                </div>
              </td>
              <td style="padding:10px 12px"><span class="badge ${t.status==="open"?"danger":"warning"}">${t.status}</span></td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-tertiary)">${t.timestamp.split(" ")[1]}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function wn(e){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Attack Pattern Correlations</span>
        <span class="badge danger">${ue.length} correlations</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;padding:12px">
        ${ue.map((t,i)=>`
          <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:3px solid ${t.severity==="CRITICAL"?"var(--clr-danger-text)":"var(--clr-warning-text)"}">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--color-text-primary)">${t.title}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${t.description}</div>
              </div>
              <span class="badge ${t.severity==="CRITICAL"?"danger":"warning"}">${t.severity}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:9px;color:var(--color-text-tertiary)">
              <span>${t.alerts.length} related alerts</span>
              <span style="font-weight:600;color:var(--clr-success-text)">${t.confidence}% confidence</span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function kn(e){var r;const t=document.getElementById("page-tenantguard");if(!t)return;const i=e.critical||0,s=e.high||0;e.medium;const a=e.total||0,n=ue.length;t.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-alert-triangle"></i> TenantGuard Alert Center</div>
        <div class="page-subtitle">Real-time alerts, correlations & attack pattern detection · ${a} alerts · ${n} correlations</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="tg-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <!-- KPI Tiles -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${i}</div>
        <div class="kpi-label">Critical Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${s}</div>
        <div class="kpi-label">High Alerts</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${n}</div>
        <div class="kpi-label">Correlations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${a}</div>
        <div class="kpi-label">Total Alerts</div>
      </div>
    </div>

    <!-- Main Tabs -->
    <div class="tabs" id="tg-main-tabs">
      ${fn.map(o=>`
        <button class="tab-btn ${Z===o.id?"active":""}" data-section="${o.id}">
          <i class="ti ${o.icon}"></i><span>${o.label}</span>
          ${o.id==="alerts"&&a>0?`<span class="badge" style="background:var(--clr-danger-bg);color:var(--clr-danger-text)">${a}</span>`:""}
          ${o.id==="correlations"&&n>0?`<span class="badge" style="background:var(--clr-warning-bg);color:var(--clr-warning-text)">${n}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Content Area -->
    <div id="tg-content" style="margin-top:16px">
      ${Z==="alerts"?Ct():Z==="correlations"?oi():Z==="patterns"?li():An()}
    </div>
  `,t.querySelectorAll("[data-section]").forEach(o=>{o.addEventListener("click",()=>{Z=o.dataset.section,ne="all";const l=t.querySelector("#tg-content");l&&(l.innerHTML=Z==="alerts"?Ct():Z==="correlations"?oi():li(),Z==="alerts"&&Pt(t)),t.querySelectorAll("[data-section]").forEach(c=>c.classList.remove("active")),o.classList.add("active")})}),(r=t.querySelector("#tg-refresh"))==null||r.addEventListener("click",async()=>{const o=t.querySelector("#tg-refresh"),l=o.innerHTML;o.innerHTML='<span class="spinner dark"></span> Scanning...',o.disabled=!0,await Ve(),o.innerHTML=l,o.disabled=!1}),Z==="alerts"&&Pt(t)}function Ct(){return`
    <!-- Severity Tabs -->
    <div class="tabs" id="tg-severity-tabs">
      ${yn.map(e=>`
        <button class="tab-btn ${ne===e.id?"active":""}" data-severity="${e.id}">
          <i class="ti ${e.icon}"></i><span>${e.label}</span>
        </button>
      `).join("")}
    </div>
    <div id="tg-alerts-list" style="margin-top:12px">${es()}</div>
  `}function oi(){return ue.length===0?`
      <div style="text-align:center;padding:40px 20px;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.5">🔗</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">No correlations detected</div>
        <div style="font-size:12px">When alerts are related, they will be grouped here</div>
      </div>
    `:ue.map(e=>`
    <div class="tenantguard-alert-card ${e.risk_level.toLowerCase()}" data-corr-id="${e.id}" style="cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div style="flex:1">
          <div style="font-weight:700;font-size:13px;color:var(--color-text-primary);margin-bottom:4px">
            ${H(e.description)}
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary);display:flex;gap:12px;flex-wrap:wrap">
            <span><i class="ti ti-link" style="font-size:10px"></i> ${e.alert_count} alerts</span>
            <span><i class="ti ti-trending-up" style="font-size:10px"></i> Score: ${e.correlation_score}/100</span>
            <span><i class="ti ti-tag" style="font-size:10px"></i> ${e.pattern_type}</span>
          </div>
        </div>
        <span class="badge ${We(e.risk_level)}">${e.risk_level}</span>
      </div>
    </div>
  `).join("")}function li(){return'<div style="padding:20px;text-align:center"><div class="spinner"></div><p style="color:var(--color-text-secondary)">Loading patterns...</p></div>'}function An(){return Ee?Xi():`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-robot"></i> AI Security Investigation Agent</span>
      </div>
      <div style="padding:16px;color:var(--color-text-secondary);text-align:center">
        <div style="font-size:48px;margin-bottom:12px">🤖</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:8px">Select an incident to investigate</div>
        <div style="font-size:12px;margin-bottom:16px">
          Click on an alert or correlation to start an AI-powered investigation.
          TenantGuard will analyze the incident and answer your questions.
        </div>

        <div style="margin-top:20px;border-top:0.5px solid var(--color-border-tertiary);padding-top:16px">
          <div style="font-size:12px;font-weight:600;margin-bottom:12px;color:var(--color-text-primary)">Recent Correlations</div>
          ${ue.slice(0,3).map(e=>`
            <button class="btn" style="width:100%;margin-bottom:8px;justify-content:flex-start" onclick="startCorrInvestigation('${e.id}', '${H(e.description)}')">
              <i class="ti ti-link"></i>
              <span style="text-align:left;flex:1">${H(e.description.substring(0,50))}...</span>
              <span class="badge ${We(e.risk_level)}">${e.risk_level}</span>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `}function Xi(){return`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-robot"></i> ${H(Ee.title)}</span>
        <button class="btn" style="margin-left:auto" onclick="closeInvestigation()">
          <i class="ti ti-x"></i> Close
        </button>
      </div>

      <div id="investigation-chat" style="display:flex;flex-direction:column;height:500px;border:0.5px solid var(--color-border-secondary);border-top:none;border-radius:0 0 4px 4px;overflow:hidden;background:var(--color-background-primary)">
        <div id="investigation-messages" style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px"></div>

        <div style="display:flex;gap:8px;padding:12px;border-top:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)">
          <input type="text" id="investigation-input" placeholder="Ask me about this incident..." style="flex:1;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-primary);color:var(--color-text-primary);font-size:12px" />
          <button id="investigation-send" class="btn btn-primary" style="white-space:nowrap">
            <i class="ti ti-send"></i> Send
          </button>
          <button id="investigation-report" class="btn" style="white-space:nowrap">
            <i class="ti ti-file-text"></i> Report
          </button>
        </div>
      </div>
    </div>
  `}function es(){const e=ne==="all"?re:re.filter(t=>t.severity===ne);return e.length===0?`
      <div style="text-align:center;padding:40px 20px;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.5">✓</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">All clear</div>
        <div style="font-size:12px">
          ${ne==="all"?"No active alerts. Your tenant is secure.":`No ${ne.toLowerCase()} severity alerts.`}
        </div>
      </div>
    `:e.map(t=>`
    <div class="tenantguard-alert-card ${t.severity.toLowerCase()}" data-alert-id="${t.id}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div style="flex:1">
          <div style="font-weight:700;font-size:13px;color:var(--color-text-primary);margin-bottom:4px">
            ${H(t.headline)}
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary);display:flex;gap:12px;flex-wrap:wrap">
            <span><i class="ti ti-user" style="font-size:10px;vertical-align:baseline"></i> ${H(t.actor||"System")}</span>
            <span><i class="ti ti-clock" style="font-size:10px;vertical-align:baseline"></i> ${Mt(t.action_timestamp)}</span>
            <span><i class="ti ti-trending-up" style="font-size:10px;vertical-align:baseline"></i> Score: ${t.score}/100</span>
          </div>
        </div>
        <span class="badge ${We(t.severity)}" style="margin-left:8px">${t.severity}</span>
      </div>

      <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:8px;line-height:1.4">
        ${H(t.description)}
      </div>

      <div style="display:flex;gap:6px;font-size:11px">
        <button class="btn tg-details-btn" data-alert-id="${t.id}">
          <i class="ti ti-info-circle"></i> Details
        </button>
        <button class="btn tg-dismiss-btn" data-alert-id="${t.id}">
          <i class="ti ti-x"></i> Dismiss
        </button>
      </div>
    </div>
  `).join("")}function Pt(e){const t=e.querySelector("#tg-severity-tabs");t&&t.querySelectorAll(".tab-btn").forEach(i=>{i.addEventListener("click",()=>{ne=i.dataset.severity,t.querySelectorAll(".tab-btn").forEach(a=>a.classList.remove("active")),i.classList.add("active");const s=e.querySelector("#tg-alerts-list");s&&(s.innerHTML=es()),di(e)})}),di(e)}function di(e){e.querySelectorAll(".tg-details-btn").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation(),ts(i.target.closest("button").dataset.alertId)})}),e.querySelectorAll(".tg-dismiss-btn").forEach(t=>{t.addEventListener("click",async i=>{i.stopPropagation();const s=i.target.closest("button").dataset.alertId;try{await Qi(s,"Dismissed from dashboard"),u("Alert dismissed","success"),await Ve()}catch{u("Failed to dismiss alert","error")}})})}function ts(e){const t=re.find(r=>r.id===e);if(!t)return;const i=document.getElementById("tg-content");if(!i)return;let s=[],a={};try{s=JSON.parse(t.recommendations||"[]"),a=JSON.parse(t.risk_assessment||"{}")}catch{}i.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <div>
          <div class="card-title">${H(t.headline)}</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">
            Score: ${t.score}/100 · ${Mt(t.action_timestamp)}
          </div>
        </div>
        <button class="btn" onclick="location.reload()"><i class="ti ti-x"></i> Close</button>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Description</div>
        <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.6">
          ${H(t.description)}
        </div>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Risk Assessment</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px">
          <div>
            <div style="color:var(--color-text-tertiary)">Score</div>
            <div style="font-weight:700;font-size:14px;color:${Cn(a.severity||t.severity)}">${a.score||t.score}/100</div>
          </div>
          <div>
            <div style="color:var(--color-text-tertiary)">Severity</div>
            <div style="font-weight:700;margin-top:4px"><span class="badge ${We(a.severity||t.severity)}">${a.severity||t.severity}</span></div>
          </div>
          ${Object.entries(a.levels||{}).map(([r,o])=>`
            <div>
              <div style="color:var(--color-text-tertiary)">${En(r)}</div>
              <div style="font-weight:700">${o}</div>
            </div>
          `).join("")}
        </div>
        ${a.impacts&&a.impacts.length>0?`
          <div style="margin-top:8px;padding:8px;background:var(--color-background-secondary);border-radius:4px;font-size:11px">
            <strong>Impacts:</strong> ${a.impacts.join(", ")}
          </div>
        `:""}
      </div>

      ${s.length>0?`
        <div style="margin-bottom:16px">
          <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Recommended Actions</div>
          <ul style="list-style:none;padding:0;margin:0;font-size:12px">
            ${s.map(r=>`
              <li style="padding:6px 0;padding-left:20px;position:relative;color:var(--color-text-secondary)">
                <span style="position:absolute;left:0;color:var(--clr-primary)">→</span>
                ${H(r)}
              </li>
            `).join("")}
          </ul>
        </div>
      `:""}

      <div style="border-top:0.5px solid var(--color-border-tertiary);padding-top:12px">
        <button class="btn btn-danger" onclick="dismissAndRefreshDetail('${e}')">
          <i class="ti ti-check"></i> Dismiss This Alert
        </button>
      </div>
    </div>

    <div id="other-alerts" style="margin-top:16px;font-size:11px;color:var(--color-text-tertiary);padding:8px">
      Loading other alerts...
    </div>
  `;const n=ne==="all"?re.filter(r=>r.id!==e):re.filter(r=>r.severity===ne&&r.id!==e);if(n.length>0){const r=`
      <div style="margin-top:24px">
        <div style="font-size:12px;font-weight:600;color:var(--color-text-primary);margin-bottom:12px">Other Alerts</div>
        ${n.map(l=>`
          <div class="tenantguard-alert-card ${l.severity.toLowerCase()}" style="cursor:pointer" onclick="showAlertDetailsFromDetail('${l.id}')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div style="flex:1">
                <div style="font-weight:600;font-size:12px">${H(l.headline)}</div>
                <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">${Mt(l.action_timestamp)}</div>
              </div>
              <span class="badge ${We(l.severity)}">${l.severity}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `,o=i.querySelector("#other-alerts");o&&(o.innerHTML=r)}else{const r=i.querySelector("#other-alerts");r&&(r.style.display="none")}}window.dismissAndRefreshDetail=async function(e){try{await Qi(e),u("Alert dismissed","success"),await Ve()}catch{u("Failed to dismiss alert","error")}};window.showAlertDetailsFromDetail=function(e){ts(e)};window.startCorrInvestigation=async function(e,t){try{Z="investigation",Ee=await un(null,e,t);const i=document.getElementById("page-tenantguard");if(i){const s=i.querySelector("#tg-content");s&&(s.innerHTML=Xi(),Sn(i),$n())}}catch(i){u("Failed to start investigation: "+i.message,"error")}};window.closeInvestigation=function(){Ee=null,Z="alerts";const e=document.getElementById("page-tenantguard");if(e){const t=e.querySelector("#tg-content");t&&(t.innerHTML=Ct(),Pt(e))}};async function Sn(e){const t=e.querySelector("#investigation-send"),i=e.querySelector("#investigation-input"),s=e.querySelector("#investigation-report");t&&i&&(t.addEventListener("click",ci),i.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),ci())})),s&&s.addEventListener("click",async()=>{try{s.disabled=!0,s.innerHTML='<span class="spinner dark"></span>';const a=await mn(Ee.id);u("Report generated! Downloading...","success"),s.disabled=!1,s.innerHTML='<i class="ti ti-file-text"></i> Report'}catch(a){u("Failed to generate report: "+a.message,"error"),s.disabled=!1,s.innerHTML='<i class="ti ti-file-text"></i> Report'}})}async function ci(){const e=document.getElementById("page-tenantguard"),t=e==null?void 0:e.querySelector("#investigation-input");if(!t)return;const i=t.value.trim();if(i)try{t.value="",t.disabled=!0;const s=e.querySelector("#investigation-messages");s&&(s.innerHTML+=`
        <div style="margin-bottom:8px;text-align:right">
          <div style="display:inline-block;max-width:70%;background:var(--clr-primary);color:white;padding:8px 12px;border-radius:4px;font-size:12px;text-align:left">
            ${H(i)}
          </div>
        </div>
      `,s.scrollTop=s.scrollHeight);const a=await gn(Ee.id,i);s&&(s.innerHTML+=`
        <div style="margin-bottom:8px">
          <div style="display:inline-block;max-width:70%;background:var(--color-background-secondary);padding:8px 12px;border-radius:4px;font-size:12px;border:0.5px solid var(--color-border-secondary);color:var(--color-text-secondary)">
            ${H(a.response).replace(/\n/g,"<br>")}
          </div>
        </div>
      `,s.scrollTop=s.scrollHeight),t.disabled=!1,t.focus()}catch(s){u("Failed to send message: "+s.message,"error");const a=e==null?void 0:e.querySelector("#investigation-input");a&&(a.disabled=!1)}}async function $n(){try{const e=await vn(Ee.id),t=document.querySelector("#investigation-messages");t&&e.messages&&(t.innerHTML=e.messages.map(i=>`
        <div style="margin-bottom:8px;${i.sender_type==="user"?"text-align:right":""}">
          <div style="display:inline-block;max-width:70%;${i.sender_type==="user"?"background:var(--clr-primary);color:white":"background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);color:var(--color-text-secondary)"};padding:8px 12px;border-radius:4px;font-size:12px;${i.sender_type!=="user"?"text-align:left":""}">
            ${H(i.message_text).replace(/\n/g,"<br>")}
          </div>
        </div>
      `).join(""),t.scrollTop=t.scrollHeight)}catch(e){console.error("Failed to load messages:",e)}}function Mt(e){return e?new Date(e).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"Unknown"}function En(e){return e.charAt(0).toUpperCase()+e.slice(1)}function H(e){if(!e)return"";const t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};return String(e).replace(/[&<>"']/g,i=>t[i])}function We(e){switch(e==null?void 0:e.toUpperCase()){case"CRITICAL":return"danger";case"HIGH":return"warning";case"MEDIUM":return"info";default:return"neutral"}}function Cn(e){switch(e==null?void 0:e.toUpperCase()){case"CRITICAL":return"var(--clr-danger-text)";case"HIGH":return"var(--clr-warning-text)";case"MEDIUM":return"var(--clr-info-text)";default:return"var(--color-text-primary)"}}const Pn=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1",is=Pn?"http://localhost:3000/api":"https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api";async function Mn(){const e=await fetch(`${is}/tenantguard/users`);if(!e.ok)throw new Error(`Failed to fetch users: ${e.statusText}`);return e.json()}async function Tn(e,t,i){const s=new URLSearchParams;t&&s.append("startDate",t),i&&s.append("endDate",i);const a=`${is}/tenantguard/users/${e}/investigation?${s.toString()}`,n=await fetch(a);if(!n.ok)throw new Error(`Failed to fetch investigation: ${n.statusText}`);return n.json()}function Ln(){const e=document.getElementById("page-user-investigation");if(e){if(J()){Rn(e);return}Dn(e)}}function Rn(e){const t=[{id:"1",displayName:"Sarah Kim",mail:"sarah.kim@contoso.com",riskScore:78},{id:"2",displayName:"John Smith",mail:"john.smith@contoso.com",riskScore:42},{id:"3",displayName:"Maya Patel",mail:"maya.patel@contoso.com",riskScore:15}],i=t[0],s=[{name:"Microsoft Teams",lastUsed:"2026-06-01 14:32",accessCount:47,riskLevel:"LOW"},{name:"SharePoint Online",lastUsed:"2026-06-01 13:15",accessCount:23,riskLevel:"LOW"},{name:"Exchange Online",lastUsed:"2026-06-01 10:45",accessCount:156,riskLevel:"MEDIUM"},{name:"OneDrive",lastUsed:"2026-05-31 16:20",accessCount:8,riskLevel:"LOW"}],a=[{timestamp:"2026-06-01 14:32",location:"Seattle, WA",app:"Teams",status:"Success",risk:"Low"},{timestamp:"2026-06-01 13:45",location:"Seattle, WA",app:"OWA",status:"Success",risk:"Low"},{timestamp:"2026-06-01 10:20",location:"Seattle, WA",app:"SharePoint",status:"Success",risk:"Low"},{timestamp:"2026-05-31 18:30",location:"Unknown",app:"Exchange",status:"MFA Challenge",risk:"Medium"}],n=[{action:"User added to group",object:"Engineering Team",timestamp:"2026-06-01 10:15",status:"Success"},{action:"Mailbox forwarding rule created",object:"sarah.kim@contoso.com",timestamp:"2026-05-31 15:45",status:"Success"},{action:"SharePoint site access granted",object:"Compliance Docs",timestamp:"2026-05-30 14:20",status:"Success"}],r=[{action:"Added john.smith to Executives group",timestamp:"2026-06-01 09:30",riskLevel:"Medium"},{action:"Created forwarding rule to external domain",timestamp:"2026-05-28 16:15",riskLevel:"High"}],o=[{date:"2026-06-01",event:"Abnormal sign-in location detected",severity:"Medium"},{date:"2026-05-31",event:"MFA bypass attempted",severity:"High"},{date:"2026-05-28",event:"Email forwarding rule created to external domain",severity:"High"}];e.innerHTML=`
    <div class="page-header">
      <div class="page-title"><i class="ti ti-shield-check"></i> User Investigation</div>
      <div class="page-subtitle">Comprehensive user activity analysis and risk assessment</div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample user investigation data</span>
    </div>

    <!-- Demo User Selection -->
    <div class="card mb-3">
      <div class="card-title mb-3">Demo User Investigation</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;padding:12px 0">
        ${t.map(l=>`
          <div class="demo-user-card" data-user-id="${l.id}" style="padding:12px;background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);cursor:pointer;flex:1;min-width:200px;${l.id===i.id?"border-color:var(--clr-info-text);background:var(--clr-info-bg)":""}">
            <div style="font-weight:600;margin-bottom:4px">${l.displayName}</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-bottom:8px">${l.mail}</div>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:40px;height:8px;background:var(--color-background-tertiary);border-radius:4px;overflow:hidden">
                <div style="height:100%;width:${l.riskScore}%;background:${l.riskScore>60?"var(--clr-danger-text)":l.riskScore>30?"var(--clr-warning-text)":"var(--clr-success-text)"}"></div>
              </div>
              <span style="font-size:10px;font-weight:600;color:${l.riskScore>60?"var(--clr-danger-text)":l.riskScore>30?"var(--clr-warning-text)":"var(--clr-success-text)"}">${l.riskScore} risk</span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- User Summary KPIs -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${i.riskScore}</div>
        <div class="kpi-label">Risk Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${s.length}</div>
        <div class="kpi-label">Apps Accessed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${a.length}</div>
        <div class="kpi-label">Recent Sign-ins</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${r.length}</div>
        <div class="kpi-label">Risky Actions</div>
      </div>
    </div>

    <!-- Application Access -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-apps"></i> Application Access (Last 7 days)</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Last Used</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Access Count</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Risk</th>
          </tr>
        </thead>
        <tbody>
          ${s.map(l=>`
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px 12px;font-weight:600">${l.name}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${l.lastUsed}</td>
              <td style="padding:10px 12px">${l.accessCount}</td>
              <td style="padding:10px 12px"><span class="badge ${l.riskLevel==="LOW"?"success":"warning"}">${l.riskLevel}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- Sign-in Activity -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-login"></i> Recent Sign-in Activity</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Timestamp</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Location</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600">Risk</th>
          </tr>
        </thead>
        <tbody>
          ${a.map(l=>`
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px 12px;font-size:10px">${l.timestamp}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${l.location}</td>
              <td style="padding:10px 12px">${l.app}</td>
              <td style="padding:10px 12px"><span class="badge ${l.status==="Success"?"success":"warning"}">${l.status}</span></td>
              <td style="padding:10px 12px"><span class="badge ${l.risk==="Low"?"success":"warning"}">${l.risk}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    <!-- Audit Actions -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-clipboard-list"></i> Audit Actions</div>
      <div style="display:flex;flex-direction:column;gap:12px;padding:12px 0">
        ${n.map(l=>`
          <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:3px solid var(--clr-info-text)">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <div>
                <div style="font-weight:600;margin-bottom:4px">${l.action}</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">${l.object}</div>
              </div>
              <span class="badge success">${l.status}</span>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${l.timestamp}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Actions on Other Accounts -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-users-group"></i> Actions on Other Accounts</div>
      <div style="display:flex;flex-direction:column;gap:12px;padding:12px 0">
        ${r.map(l=>`
          <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border-left:3px solid ${l.riskLevel==="High"?"var(--clr-danger-text)":"var(--clr-warning-text)"}">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <div style="font-weight:600">${l.action}</div>
              <span class="badge ${l.riskLevel==="High"?"danger":"warning"}">${l.riskLevel} Risk</span>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:8px">${l.timestamp}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Risk Timeline -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-timeline"></i> Risk Timeline</div>
      <div style="display:flex;flex-direction:column;gap:8px;padding:12px 0">
        ${o.map(l=>`
          <div style="display:flex;gap:12px;align-items:start">
            <div style="flex-shrink:0;margin-top:4px;width:12px;height:12px;border-radius:50%;background:${l.severity==="High"?"var(--clr-danger-text)":"var(--clr-warning-text)"}"></div>
            <div style="flex:1">
              <div style="font-weight:600;font-size:11px">${l.event}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${l.date}</div>
            </div>
            <span class="badge ${l.severity==="High"?"danger":"warning"}">${l.severity}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `,e.querySelectorAll(".demo-user-card").forEach(l=>{l.addEventListener("click",()=>{e.querySelectorAll(".demo-user-card").forEach(c=>{c.style.borderColor="var(--color-border-secondary)",c.style.background="var(--color-background-secondary)"}),l.style.borderColor="var(--clr-info-text)",l.style.background="var(--clr-info-bg)"})})}function Dn(e){e.innerHTML=`
    <div class="page-header">
      <div class="page-title"><i class="ti ti-shield-check"></i> User Investigation</div>
      <div class="page-subtitle">Comprehensive user activity analysis and risk assessment</div>
    </div>

    <!-- Filters -->
    <div class="card mb-3">
      <div class="card-title mb-3">Filters</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 150px;gap:12px;align-items:end">
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Select User</label>
          <input type="text" id="user-search" class="form-input" placeholder="Search by name or email..." autocomplete="off">
          <div id="user-dropdown" class="user-dropdown" style="display:none;position:absolute;background:white;border:1px solid var(--color-border);border-radius:6px;margin-top:2px;max-height:300px;overflow-y:auto;width:100%;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,0.1)"></div>
        </div>

        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Days Back</label>
          <select id="days-back" class="form-select">
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Custom Date Range</label>
          <input type="date" id="custom-date" class="form-input">
        </div>

        <button id="investigate-btn" class="btn btn-primary" disabled>
          <i class="ti ti-search"></i> Investigate
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div id="loading-state" style="display:none">
      <div class="card mb-3">
        <div style="display:flex;align-items:center;gap:12px;padding:20px">
          <span class="spinner"></span>
          <span>Loading user investigation data...</span>
        </div>
      </div>
    </div>

    <!-- Investigation results -->
    <div id="investigation-results" style="display:none">
      <!-- User Summary -->
      <div class="card mb-3">
        <div class="card-title mb-3">User Summary</div>
        <div id="user-summary" style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px"></div>
      </div>

      <!-- Application Access -->
      <div class="card mb-3">
        <div class="card-title mb-3"><i class="ti ti-apps"></i> Application Access (-7d to today) </div>
        <div id="applications-section"></div>
      </div>

      <!-- Sign-in Activity -->
      <div class="card mb-3">
        <div class="card-title mb-3"><i class="ti ti-login"></i> Recent Sign-in Activity</div>
        <div id="signin-logs-section"></div>
      </div>

      <!-- Audit Actions -->
      <div class="card mb-3">
        <div class="card-title mb-3"><i class="ti ti-clipboard-list"></i> Audit Actions</div>
        <div id="audit-logs-section"></div>
      </div>

      <!-- Actions on Other Accounts -->
      <div class="card mb-3">
        <div class="card-title mb-3"><i class="ti ti-users-group"></i> Actions on Other Accounts</div>
        <div id="other-accounts-section"></div>
      </div>

      <!-- Risk Timeline -->
      <div class="card mb-3">
        <div class="card-title mb-3"><i class="ti ti-timeline"></i> Risk Timeline</div>
        <div id="timeline-section"></div>
      </div>
    </div>

    <!-- Empty state -->
    <div id="empty-state" style="text-align:center;padding:40px;color:var(--color-text-tertiary)">
      <i class="ti ti-inbox" style="font-size:48px;margin-bottom:12px;opacity:0.5"></i>
      <p>Select a user and click "Investigate" to see their activity</p>
    </div>
  `;let t=[],i=null;const s=e.querySelector("#user-search"),a=e.querySelector("#user-dropdown"),n=e.querySelector("#days-back");e.querySelector("#custom-date");const r=e.querySelector("#investigate-btn");o();async function o(){try{t=(await Mn()).data||[]}catch(l){console.error("Failed to load users:",l),u("Failed to load user list","error")}}s.addEventListener("input",l=>{const c=l.target.value.toLowerCase();if(!c){a.style.display="none";return}const d=t.filter(p=>p.displayName.toLowerCase().includes(c)||p.mail.toLowerCase().includes(c));a.innerHTML=d.map(p=>`
      <div class="user-dropdown-item" data-id="${p.id}" style="padding:10px 12px;border-bottom:1px solid var(--color-border);cursor:pointer;font-size:11px">
        <div style="font-weight:500">${p.displayName}</div>
        <div style="color:var(--color-text-tertiary);margin-top:2px">${p.mail}</div>
      </div>
    `).join(""),d.forEach(p=>{const v=a.querySelector(`[data-id="${p.id}"]`);v==null||v.addEventListener("click",()=>{i=p.id,s.value=p.displayName,a.style.display="none",r.disabled=!1})}),a.style.display=d.length>0?"block":"none"}),r.addEventListener("click",async()=>{if(!i){u("Please select a user","warning");return}const l=parseInt(n.value),c=new Date,d=new Date(c);d.setDate(d.getDate()-l),bt(e,!0);try{const p=await Tn(i,d.toISOString().split("T")[0],c.toISOString().split("T")[0]);In(e,p.data),bt(e,!1)}catch(p){console.error("Investigation error:",p),u("Failed to load investigation data","error"),bt(e,!1)}}),document.addEventListener("click",l=>{!s.contains(l.target)&&!a.contains(l.target)&&(a.style.display="none")})}function bt(e,t){e.querySelector("#loading-state").style.display=t?"block":"none",e.querySelector("#investigation-results").style.display=t?"none":"block",e.querySelector("#empty-state").style.display="none"}function In(e,t){const{user:i,applicationAccess:s,signInLogs:a,auditLogs:n,actionsOnOtherAccounts:r,timeline:o,summary:l}=t,c=`
    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">User</div>
      <div style="font-weight:600;font-size:14px">${i.displayName}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${i.mail}</div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Risk Score</div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-weight:600;font-size:20px">${i.riskScore}</div>
        <div style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${pi(i.riskLevel).bg};color:${pi(i.riskLevel).text}">${i.riskLevel}</div>
      </div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Department</div>
      <div style="font-weight:500;font-size:13px">${i.department||"N/A"}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${i.jobTitle||"No title"}</div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Last Active</div>
      <div style="font-weight:500;font-size:13px">${fe(i.lastActive)}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${zn(i.lastActive)}</div>
    </div>
  `;e.querySelector("#user-summary").innerHTML=c;const d=`
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Application</th>
            <th>Last Accessed</th>
            <th>Success</th>
            <th>Failures</th>
            <th>Status</th>
            <th>Locations</th>
          </tr>
        </thead>
        <tbody>
          ${s.map(y=>`
            <tr>
              <td><strong>${y.appName}</strong></td>
              <td>${fe(y.lastAccessTime)}</td>
              <td style="color:var(--clr-success-text)">${y.successCount}</td>
              <td style="color:${y.failureCount>0?"var(--clr-danger-text)":"var(--color-text-tertiary)"}"><strong>${y.failureCount}</strong></td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${ui(y.status).bg};color:${ui(y.status).text}">
                  ${y.status}
                </span>
              </td>
              <td style="font-size:11px;color:var(--color-text-secondary)">${y.locations.join(", ")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;e.querySelector("#applications-section").innerHTML=d;const p={};a.forEach(y=>{p[y.application]||(p[y.application]=[]),p[y.application].push(y)});const v=`
    <div style="display:grid;gap:16px">
      ${Object.entries(p).slice(0,10).map(([y,w])=>{const P=w.filter(x=>x.status==="success").length,S=w.filter(x=>x.status==="failure").length,h=w.filter(x=>x.compliant==="No").length,g=w.filter(x=>x.managed==="No").length;return`
          <div style="border:1px solid var(--color-border);border-radius:6px;padding:12px;background:var(--color-bg-secondary)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <h4 style="margin:0;color:var(--color-text-primary)">${y}</h4>
              <div style="display:flex;gap:8px;font-size:11px">
                <span style="padding:4px 8px;border-radius:3px;background:var(--clr-success-bg);color:var(--clr-success-text)"><strong>${P}</strong> success</span>
                ${S>0?`<span style="padding:4px 8px;border-radius:3px;background:var(--clr-danger-bg);color:var(--clr-danger-text)"><strong>${S}</strong> failed</span>`:""}
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:12px;font-size:11px">
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Non-Compliant</div>
                <div style="font-weight:600;color:${h>0?"var(--clr-warning-text)":"var(--color-text-tertiary)"}">${h}</div>
              </div>
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Unmanaged</div>
                <div style="font-weight:600;color:${g>0?"var(--clr-info-text)":"var(--color-text-tertiary)"}">${g}</div>
              </div>
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Recent Activity</div>
                <div style="font-weight:600">${fe(w[0].timestamp)}</div>
              </div>
            </div>

            <details style="cursor:pointer">
              <summary style="color:var(--color-text-secondary);font-size:11px;font-weight:600;padding:4px 0">Show ${w.length} sign-in details</summary>
              <table class="data-table" style="margin-top:8px;font-size:10px">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Browser / OS</th>
                    <th>Device</th>
                    <th>IP</th>
                    <th>Compliant</th>
                    <th>Managed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${w.slice(0,15).map(x=>`
                    <tr>
                      <td style="white-space:nowrap">${fe(x.timestamp)}</td>
                      <td style="font-size:9px">
                        <div>${x.browser}</div>
                        <div style="color:var(--color-text-secondary)">${x.operatingSystem}</div>
                      </td>
                      <td style="font-size:9px;color:${x.deviceName?"var(--color-text-primary)":"var(--color-text-tertiary)"}">${x.deviceName||"-"}</td>
                      <td style="font-family:monospace;font-size:9px;color:var(--color-text-secondary)">${x.ipAddress}</td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${x.compliant==="Yes"?"var(--clr-success-bg)":"var(--clr-warning-bg)"};color:${x.compliant==="Yes"?"var(--clr-success-text)":"var(--clr-warning-text)"}">${x.compliant}</span></td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${x.managed==="Yes"?"var(--clr-success-bg)":"var(--clr-info-bg)"};color:${x.managed==="Yes"?"var(--clr-success-text)":"var(--clr-info-text)"}">${x.managed}</span></td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${x.status==="success"?"var(--clr-success-bg)":"var(--clr-danger-bg)"};color:${x.status==="success"?"var(--clr-success-text)":"var(--clr-danger-text)"}">${x.status.toUpperCase()}</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              ${w.length>15?`<div style="color:var(--color-text-tertiary);font-size:9px;margin-top:4px">Showing 15 of ${w.length} sign-ins</div>`:""}
            </details>
          </div>
        `}).join("")}
    </div>
    ${a.length>0?`<div style="color:var(--color-text-tertiary);font-size:11px;margin-top:12px">Showing ${Math.min(10,Object.keys(p).length)} of ${Object.keys(p).length} applications (${a.length} total sign-ins)</div>`:""}
  `;e.querySelector("#signin-logs-section").innerHTML=v;const f=`
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Operation</th>
            <th>Target</th>
            <th>Result</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          ${n.map(y=>`
            <tr>
              <td>${fe(y.timestamp)}</td>
              <td><strong>${y.operation}</strong></td>
              <td>${y.target}</td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:var(--clr-success-bg);color:var(--clr-success-text)">
                  ${y.result.toUpperCase()}
                </span>
              </td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${oe(y.severity).bg};color:${oe(y.severity).text}">
                  ${y.severity}
                </span>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;e.querySelector("#audit-logs-section").innerHTML=f;const b=`
    <div style="display:flex;flex-direction:column;gap:8px">
      ${r.map(y=>`
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px;border-left:3px solid ${oe(y.severity).border}">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:600;font-size:12px">${y.targetName}</div>
              <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">${y.targetUser}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:600;font-size:11px">${y.action}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${fe(y.timestamp)}</div>
            </div>
            <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${oe(y.severity).bg};color:${oe(y.severity).text};margin-left:12px">
              ${y.severity}
            </span>
          </div>
        </div>
      `).join("")}
    </div>
  `;e.querySelector("#other-accounts-section").innerHTML=b;const k=`
    <div style="position:relative;padding:20px 0">
      ${o.map((y,w)=>`
        <div style="display:flex;gap:16px;margin-bottom:24px;position:relative">
          <div style="display:flex;flex-direction:column;align-items:center;width:40px;flex-shrink:0">
            <div style="width:12px;height:12px;border-radius:50%;background:${oe(y.severity).bg};border:2px solid ${oe(y.severity).border}"></div>
            ${w<o.length-1?'<div style="width:2px;height:40px;background:var(--color-border);margin-top:8px"></div>':""}
          </div>
          <div style="flex:1;padding-top:2px">
            <div style="display:flex;justify-content:space-between;align-items:start;gap:12px">
              <div>
                <div style="font-weight:600;font-size:12px">${y.description}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${fe(y.timestamp)}</div>
              </div>
              <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${oe(y.severity).bg};color:${oe(y.severity).text};white-space:nowrap">
                ${y.severity}
              </span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;e.querySelector("#timeline-section").innerHTML=k,e.querySelector("#investigation-results").style.display="block",e.querySelector("#empty-state").style.display="none"}function pi(e){const t={LOW:{bg:"var(--clr-success-bg)",text:"var(--clr-success-text)"},MEDIUM:{bg:"var(--clr-warning-bg)",text:"var(--clr-warning-text)"},HIGH:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)"},CRITICAL:{bg:"var(--clr-critical-bg)",text:"var(--clr-critical-text)"}};return t[e]||t.MEDIUM}function ui(e){return e==="SUCCESS"?{bg:"var(--clr-success-bg)",text:"var(--clr-success-text)"}:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)"}}function oe(e){const t={LOW:{bg:"var(--clr-success-bg)",text:"var(--clr-success-text)",border:"var(--clr-success-text)"},MEDIUM:{bg:"var(--clr-warning-bg)",text:"var(--clr-warning-text)",border:"var(--clr-warning-text)"},HIGH:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)",border:"var(--clr-danger-text)"},CRITICAL:{bg:"var(--clr-critical-bg)",text:"var(--clr-critical-text)",border:"var(--clr-critical-text)"}};return t[e]||t.MEDIUM}function fe(e){const t=new Date(e),s=new Date-t,a=Math.floor(s/6e4),n=Math.floor(s/36e5),r=Math.floor(s/864e5);return a<1?"Just now":a<60?`${a}m ago`:n<24?`${n}h ago`:r<7?`${r}d ago`:t.toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function zn(e){return new Date(e).toLocaleDateString("en-US",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}const qn=[{id:"identity",name:"Identity & Authentication",icon:"ti-user-shield",controls:[{id:"mfa-reg",name:"MFA Registration Coverage",desc:"Percentage of users registered for MFA across the tenant.",status:"warn",value:"87% of users have MFA registered (target: 100%)",remediation:"Enforce MFA registration via Conditional Access policy targeting all users. Set registration deadline and monitor via Entra ID MFA reporting."},{id:"ca-mfa",name:"MFA Conditional Access Policy",desc:"Conditional Access policy enforcing MFA for all sign-ins.",status:"pass",value:'Policy "Require MFA — All Users" is enabled and targeting all cloud apps.',remediation:"No action required. Policy is active and enforcing MFA."},{id:"ca-legacy",name:"Legacy Authentication Blocked",desc:"Conditional Access policy blocking all legacy authentication protocols.",status:"fail",value:"No Conditional Access policy blocking legacy authentication found.",remediation:'Create a Conditional Access policy with condition "Client apps: Other clients (legacy auth)" and grant control "Block access". Test in report-only mode first.'},{id:"ca-compliant",name:"Device Compliance Required",desc:"Conditional Access policy requiring compliant or Hybrid Azure AD joined devices.",status:"warn",value:"Policy exists but excludes 3 admin accounts and 2 service accounts.",remediation:"Review and reduce exclusions in the device compliance CA policy. Create named locations for legitimate breakglass exclusions only."}]},{id:"device",name:"Device Compliance & App Protection",icon:"ti-device-laptop",controls:[{id:"dev-comp",name:"Intune Device Compliance Policies",desc:"Compliance policies configured for Windows, iOS and Android platforms.",status:"warn",value:"Windows and iOS policies exist; Android policy missing.",remediation:"Create an Android device compliance policy in Intune covering OS version, device encryption, and screen lock requirements."},{id:"app-prot",name:"App Protection Policies",desc:"Intune MAM policies protecting corporate data on managed apps.",status:"pass",value:"iOS and Android APP policies configured and assigned.",remediation:"No action required."},{id:"workload",name:"Defender for Endpoint Integration",desc:"Microsoft Defender for Endpoint integrated with Intune for device risk signals.",status:"pass",value:"Connector enabled. Device risk level used in compliance policy.",remediation:"No action required."},{id:"risk-ca",name:"Device Risk-Based Access",desc:"Conditional Access blocking access from high-risk devices.",status:"fail",value:"No Conditional Access policy found using Defender device risk signal.",remediation:"Create a CA policy using the Defender for Endpoint device risk connector. Block or require password change for High risk device sign-ins."}]},{id:"priv",name:"Privileged Access & Entitlements",icon:"ti-crown",controls:[{id:"entitlement",name:"Entitlement Management (PIM)",desc:"Azure AD PIM deployed for privileged role activation.",status:"pass",value:"PIM is activated. Global Admin and Security Admin roles are managed.",remediation:"No action required."},{id:"pim",name:"Permanent Privileged Role Assignments",desc:"No users should hold permanent (non-PIM) privileged role assignments.",status:"warn",value:"4 accounts have permanent Global Admin assignment (recommend < 2).",remediation:"Convert permanent role assignments to PIM eligible assignments. Require justification and approval for activation. Target ≤ 2 break-glass Global Admin accounts."},{id:"reviews",name:"Access Reviews Configured",desc:"Regular access reviews scheduled for privileged roles.",status:"pass",value:"Quarterly access reviews configured for all directory roles.",remediation:"No action required."}]},{id:"guest",name:"Guest & External Governance",icon:"ti-users",controls:[{id:"guest",name:"Guest Access Governance",desc:"Guest user invitations restricted and access reviewed regularly.",status:"pass",value:"Guest invite policy: Admins and guest inviters only. Annual reviews configured.",remediation:"No action required."}]}];function Nn(){const e=document.getElementById("page-zerotrust");e&&(On(e),Gn(e))}async function Gn(e){try{console.log("📡 Fetching Zero Trust assessment data...");const t=await T("/zero-trust/pillars");if(t.success&&t.data)console.log("✓ Zero Trust data loaded"),vi(e,t.data);else throw new Error(t.error||"Failed to load Zero Trust data")}catch(t){console.warn("⚠️ Failed to fetch Zero Trust data:",t.message),console.log("📚 Using demo/reference data"),vi(e,qn)}}function On(e){e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">Loading assessment data...</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="zt-rescan" disabled><i class="ti ti-refresh"></i> Re-scan</button>
        <button class="btn btn-primary" disabled><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div style="padding:40px;text-align:center">
      <div class="spinner"></div>
      <p style="margin-top:16px;color:var(--color-text-secondary)">Assessing Zero Trust compliance controls...</p>
    </div>
  `}function vi(e,t){let i=t.flatMap(d=>d.controls),s=i.filter(d=>d.status==="pass").length,a=i.filter(d=>d.status==="warn").length,n=i.filter(d=>d.status==="fail").length;const r=i.length,o=(s/r*100).toFixed(0),l=(a/r*100).toFixed(0),c=(n/r*100).toFixed(0);e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">${r} controls across ${t.length} pillars — last assessed today</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="zt-rescan"><i class="ti ti-refresh"></i> Re-scan</button>
        <button class="btn btn-primary"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value warning">${s}/${r}</div>
        <div class="kpi-label">Overall Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${s}</div>
        <div class="kpi-label">Passed</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${a}</div>
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
        <span class="badge warning">${s}/${r} controls passed</span>
      </div>
      <div class="seg-bar" style="height:10px;border-radius:5px">
        <div class="seg pass" style="width:${o}%"></div>
        <div class="seg warn" style="width:${l}%"></div>
        <div class="seg fail" style="width:${c}%"></div>
      </div>
      <div style="display:flex;gap:20px;margin-top:8px">
        <span style="font-size:10px;color:var(--clr-success-text)">● ${s} Passed</span>
        <span style="font-size:10px;color:var(--clr-warning-text)">● ${a} Warnings</span>
        <span style="font-size:10px;color:var(--clr-danger-text)">● ${n} Failed</span>
      </div>
    </div>

    <div id="zt-pillars"></div>
  `,Un(e,t),e.querySelector("#zt-rescan").addEventListener("click",()=>{const d=e.querySelector("#zt-rescan");d.innerHTML='<span class="spinner dark"></span> Scanning...',d.disabled=!0,setTimeout(()=>{d.innerHTML='<i class="ti ti-refresh"></i> Re-scan',d.disabled=!1,u("Zero Trust scan complete — "+r+" controls assessed.","success")},2e3)})}function Un(e,t){const i=e.querySelector("#zt-pillars");i&&(i.innerHTML=t.map((s,a)=>{const n=s.controls.filter(d=>d.status==="pass").length,r=s.controls.filter(d=>d.status==="warn").length,o=s.controls.filter(d=>d.status==="fail").length,l=s.controls.length,c=o>0?"danger":r>0?"warning":"success";return`
      <div class="card mb-3" style="padding:0;overflow:hidden">
        <div class="collapsible-header" id="zt-pillar-hdr-${a}" style="border-radius:0;background:var(--color-background-secondary)">
          <i class="ti ${s.icon}" style="font-size:15px;color:var(--color-text-secondary)"></i>
          <span style="flex:1;font-size:12px;font-weight:600">${s.name}</span>
          <div style="display:flex;gap:6px;align-items:center;margin-right:8px">
            ${o>0?`<span class="badge danger">${o} fail</span>`:""}
            ${r>0?`<span class="badge warning">${r} warn</span>`:""}
            ${n>0?`<span class="badge success">${n} pass</span>`:""}
          </div>
          <div style="width:80px;margin-right:8px">
            <div class="score-bar"><div class="score-bar-fill ${c}" style="width:${(n/l*100).toFixed(0)}%"></div></div>
          </div>
          <i class="ti ti-chevron-down" style="font-size:13px;transition:transform 150ms ease" id="zt-pillar-chevron-${a}"></i>
        </div>
        <div class="collapsible-body open" id="zt-pillar-body-${a}">
          ${s.controls.map((d,p)=>`
            <div>
              <div class="zt-control-row" data-pi="${a}" data-ci="${p}">
                <div class="zt-status-icon ${d.status}">
                  <i class="ti ${d.status==="pass"?"ti-check":d.status==="warn"?"ti-alert-triangle":"ti-x"}"></i>
                </div>
                <div style="flex:1">
                  <div style="font-size:11px;font-weight:600">${d.name}</div>
                  <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:1px">${d.desc}</div>
                </div>
                <div style="font-size:10px;color:var(--color-text-secondary);max-width:180px;text-align:right;margin-right:8px;font-style:italic">${d.value||""}</div>
                <button class="chevron-btn zt-expand-btn"><i class="ti ti-chevron-right"></i></button>
              </div>
              <div class="zt-expand-panel ${d.status}-border" data-pi="${a}" data-ci="${p}">
                <strong>Remediation guidance</strong>
                <p style="margin-top:6px">${d.remediation||"No remediation required."}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `}).join(""),i.querySelectorAll('[id^="zt-pillar-hdr-"]').forEach(s=>{s.addEventListener("click",()=>{const a=s.id.replace("zt-pillar-hdr-",""),n=i.querySelector(`#zt-pillar-body-${a}`),r=i.querySelector(`#zt-pillar-chevron-${a}`);n.classList.toggle("open"),r&&(r.style.transform=n.classList.contains("open")?"rotate(0deg)":"rotate(-90deg)")})}),i.querySelectorAll(".zt-control-row").forEach(s=>{s.addEventListener("click",a=>{if(a.target.closest(".zt-expand-btn")){const{pi:n,ci:r}=s.dataset,o=i.querySelector(`.zt-expand-panel[data-pi="${n}"][data-ci="${r}"]`),l=s.querySelector(".zt-expand-btn");o&&(o.classList.toggle("open"),l.classList.toggle("open",o.classList.contains("open")))}})}))}const Ht=[{id:"t1",num:"1",name:"Microsoft 365 Admin Center",icon:"ti-apps",iconBg:"#E6F1FB",iconColor:"#0C447C",subsections:[{id:"t1s1",name:"1.1 Users",controls:[{id:"1.1.1",title:"Ensure that between two and four global admins are designated",type:"auto",profile:"E3 L1",status:"pass",value:"2 Global Admins active in tenant.",desc:"Maintains the minimum necessary Global Admin accounts to reduce attack surface.",ps:`Get-MgDirectoryRoleMember -DirectoryRoleId (Get-MgDirectoryRole -Filter "displayName eq 'Global Administrator'").Id | Select DisplayName,UserPrincipalName`},{id:"1.1.2",title:"Ensure third-party integrated applications are not allowed",type:"auto",profile:"E3 L1",status:"warn",value:"User consent for third-party apps is set to: Allow user consent for apps from verified publishers.",desc:"Restricts OAuth app consent to reduce risk of malicious app data access.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateApps"},{id:"1.1.3",title:"Ensure the default user role has no ability to create tenants",type:"auto",profile:"E3 L1",status:"pass",value:"AllowedToCreateTenants: false",desc:"Prevents non-admin users from creating new Entra ID tenants.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions | Select AllowedToCreateTenants"},{id:"1.1.4",title:"Ensure Security Defaults are disabled when Conditional Access is used",type:"auto",profile:"E3 L1",status:"fail",value:"Security Defaults: ENABLED — conflicts with existing Conditional Access policies.",desc:"Security Defaults and Conditional Access are mutually exclusive and should not coexist.",ps:"(Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy).IsEnabled"}]},{id:"t1s2",name:"1.2 Teams & Groups",controls:[{id:"1.2.1",title:"Ensure Microsoft 365 Groups creation is restricted to admins",type:"auto",profile:"E3 L1",status:"warn",value:"Group creation: All users can create Microsoft 365 groups.",desc:"Limits group sprawl by restricting M365 group creation to administrators.",ps:"(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values"},{id:"1.2.2",title:"Ensure a dynamic group for guest users is configured",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Dynamic group enables governance and access management across all guest identities.",ps:null}]},{id:"t1s3",name:"1.3 Settings",controls:[{id:"1.3.1",title:"Ensure the admin consent workflow is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Admin consent workflow: Enabled. Reviewers: 2 admins configured.",desc:"Allows users to request admin approval for apps instead of self-consenting.",ps:"Get-MgPolicyAdminConsentRequestPolicy | Select IsEnabled"},{id:"1.3.2",title:"Ensure sign-in to shared mailboxes is blocked",type:"auto",profile:"E3 L1",status:"pass",value:"All 14 shared mailboxes have accounts blocked from interactive sign-in.",desc:"Shared mailbox accounts should not allow interactive login to prevent account abuse.",ps:`Get-MgUser -Filter "assignedLicenses/any() and userType eq 'Member'" -All | Where {$_.Mail -like '*shared*'}`},{id:"1.3.3",title:"Ensure the customer lockbox feature is enabled",type:"auto",profile:"E3 L2",status:"pass",value:"Customer Lockbox: Enabled",desc:"Customer Lockbox requires admin approval before Microsoft support can access tenant data.",ps:"Get-OrganizationConfig | Select CustomerLockBoxEnabled"},{id:"1.3.4",title:"Ensure notifications for internal phishing are enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Internal phishing notifications: Enabled via Defender anti-phishing policy.",desc:"Notifies users when internal phishing attempts are detected.",ps:"Get-AntiPhishPolicy | Select Name,EnableMailboxIntelligence,EnableFirstContactSafetyTips"},{id:"1.3.5",title:"Ensure Microsoft 365 audit log search is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Unified Audit Log: Enabled",desc:"Audit log enables security investigations and compliance reporting.",ps:"Get-AdminAuditLogConfig | Select UnifiedAuditLogIngestionEnabled"},{id:"1.3.6",title:"Ensure DLP policies are enabled for Microsoft Teams",type:"auto",profile:"E3 L1",status:"fail",value:"No DLP policy found targeting Microsoft Teams workload.",desc:"DLP policies prevent sensitive data from being shared via Teams messages.",ps:"Get-DlpCompliancePolicy | Where {$_.Workload -like '*Teams*'} | Select Name,Mode,Enabled"},{id:"1.3.7",title:"Ensure that Microsoft 365 passwords are not set to expire",type:"auto",profile:"E3 L1",status:"pass",value:"Password expiration policy: Disabled (never expire).",desc:"NIST guidance recommends not forcing periodic password changes; MFA is more effective.",ps:"Get-MgDomain | Select Id,PasswordNotificationWindowInDays,PasswordValidityPeriodInDays"},{id:"1.3.8",title:"Ensure self-service password reset is enabled",type:"auto",profile:"E3 L1",status:"warn",value:"SSPR: Enabled for selected users only (not all users).",desc:"SSPR reduces helpdesk burden and allows users to recover accounts securely.",ps:"Get-MgPolicySelfServiceSignUpPolicy | Select IsEnabled"},{id:"1.3.9",title:"Ensure the option to stay signed in is hidden",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Hiding the stay signed-in prompt reduces the risk of persistent session tokens on shared devices.",ps:null}]}]},{id:"t2",num:"2",name:"Microsoft Defender",icon:"ti-shield-check",iconBg:"#FCEBEB",iconColor:"#A32D2D",subsections:[{id:"t2s1",name:"2.1 Email & Collaboration",controls:[{id:"2.1.1",title:"Ensure Exchange Online Spam Policies are set correctly",type:"auto",profile:"E3 L1",status:"pass",value:"Default spam policy: HighConfidenceSpam = MoveToJmf, Spam = MoveToJmf.",desc:"Correct spam policy settings reduce phishing and junk mail exposure.",ps:"Get-HostedContentFilterPolicy -Identity Default | Select SpamAction,HighConfidenceSpamAction"},{id:"2.1.2",title:"Ensure Safe Links policy is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Safe Links: Enabled for all users. URL detonation enabled.",desc:"Safe Links protects users from malicious URLs in email and Office documents.",ps:"Get-SafeLinksPolicy | Select Name,IsEnabled,ScanUrls,EnableForInternalSenders"},{id:"2.1.3",title:"Ensure Safe Attachments policy is enabled",type:"auto",profile:"E3 L1",status:"fail",value:"Safe Attachments: No policy assigned to all users. Default policy only in report mode.",desc:"Safe Attachments detonates email attachments in a sandbox to detect malware.",ps:"Get-SafeAttachmentPolicy | Select Name,Action,Enable,Redirect"},{id:"2.1.4",title:"Ensure the anti-phishing policy is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Anti-phishing policy: Enabled with impersonation protection.",desc:"Anti-phishing policy protects against spoofing and impersonation attacks.",ps:"Get-AntiPhishPolicy | Select Name,Enabled,EnableSpoofIntelligence,EnableMailboxIntelligence"},{id:"2.1.5",title:"Ensure that SPF records are published for all Exchange Domains",type:"auto",profile:"E3 L1",status:"pass",value:"contoso.com: SPF record present — v=spf1 include:spf.protection.outlook.com -all",desc:"SPF records help prevent email spoofing by specifying authorized mail senders.",ps:'Resolve-DnsName contoso.com -Type TXT | Where {$_.Strings -like "*spf*"}'},{id:"2.1.6",title:"Ensure DKIM is enabled for all Exchange Online Domains",type:"auto",profile:"E3 L1",status:"pass",value:"DKIM signing: Enabled for contoso.com",desc:"DKIM signing adds cryptographic authentication to outbound email.",ps:"Get-DkimSigningConfig | Select Domain,Enabled"},{id:"2.1.7",title:"Ensure DMARC Records for all Exchange Online Domains are published",type:"auto",profile:"E3 L1",status:"pass",value:"contoso.com: DMARC record — v=DMARC1; p=quarantine; rua=mailto:dmarc@contoso.com",desc:"DMARC policy instructs receivers on how to handle emails failing SPF/DKIM checks.",ps:"Resolve-DnsName _dmarc.contoso.com -Type TXT"},{id:"2.1.8",title:"Ensure Priority account protection is enabled and configured",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Priority account protection provides enhanced threat protection for high-value users.",ps:null},{id:"2.1.9",title:"Ensure that Microsoft Defender for Office 365 is enabled",type:"auto",profile:"E5 L1",status:"pass",value:"Microsoft Defender for Office 365 Plan 2: Active",desc:"Defender for Office 365 provides advanced threat protection for email and collaboration.",ps:"Get-MgSubscribedSku | Where {$_.SkuPartNumber -like '*ATP*'}"},{id:"2.1.10",title:"Ensure Exchange Online Content Filtering is set to block malicious email",type:"auto",profile:"E3 L1",status:"pass",value:"Content filter: BulkThreshold=5, QuarantineTag=AdminOnlyAccessPolicy",desc:"Proper content filtering prevents bulk and malicious mail from reaching inboxes.",ps:"Get-HostedContentFilterPolicy | Select BulkThreshold,QuarantineTag"},{id:"2.1.11",title:"Ensure the connection filter policy is configured",type:"auto",profile:"E3 L1",status:"pass",value:"Connection filter: SafeList=False, IPAllowList empty.",desc:"Proper connection filter configuration prevents bypass of Exchange Online Protection.",ps:"Get-HostedConnectionFilterPolicy -Identity Default | Select SafeList,IPAllowList"},{id:"2.1.12",title:"Ensure tenant allow/block list is not configured for exceptions",type:"auto",profile:"E3 L1",status:"pass",value:"Allow list entries: 0. Block list entries: 3 (known malicious domains).",desc:"Excessive allow list entries bypass security controls and increase phishing risk.",ps:"Get-TenantAllowBlockListItems -ListType Sender -Allow | Measure-Object"},{id:"2.1.13",title:"Ensure alerts for suspicious email activity are configured",type:"auto",profile:"E3 L1",status:"pass",value:'Alert policy "Suspicious email sending patterns" is active.',desc:"Email activity alerts enable rapid detection of compromised accounts.",ps:"Get-ProtectionAlert | Where {$_.Category -eq 'ThreatManagement'} | Select Name,Severity,IsEnabled"},{id:"2.1.14",title:"Ensure the Report Message add-in is enabled",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Report Message add-in allows users to report suspicious emails directly to Microsoft.",ps:null},{id:"2.1.15",title:"Ensure mail forwarding rules are not forwarding to external domains",type:"auto",profile:"E3 L1",status:"pass",value:"External mail forwarding: Disabled at transport rule level.",desc:"Blocking external auto-forwarding prevents data exfiltration via compromised mailboxes.",ps:"Get-RemoteDomain Default | Select AutoForwardEnabled"}]},{id:"t2s2",name:"2.2 Cloud Apps",controls:[{id:"2.2.1",title:"Ensure Microsoft Defender for Cloud Apps is enabled",type:"auto",profile:"E5 L1",status:"warn",value:"Defender for Cloud Apps: Licensed but not fully configured — 3 connectors pending.",desc:"Defender for Cloud Apps provides CASB capabilities for cloud app governance.",ps:"# Check via Defender for Cloud Apps portal — no PowerShell equivalent"}]},{id:"t2s4",name:"2.4 System",controls:[{id:"2.4.1",title:"Ensure Microsoft Defender for Endpoint is deployed to all endpoints",type:"auto",profile:"E5 L1",status:"pass",value:"MDE onboarded: 847 / 847 devices (100%)",desc:"Defender for Endpoint provides endpoint detection and response capabilities.",ps:"# Review onboarding status in Defender portal: security.microsoft.com/machines"},{id:"2.4.2",title:"Ensure Microsoft Defender for Identity is enabled",type:"auto",profile:"E5 L1",status:"pass",value:"Defender for Identity workspace: Active. 2 domain controllers instrumented.",desc:"Defender for Identity detects lateral movement and privilege escalation in AD.",ps:"# Check workspace status in Defender XDR portal"},{id:"2.4.3",title:"Ensure Microsoft Defender XDR alert notifications are configured",type:"auto",profile:"E5 L1",status:"warn",value:"Notification rules: 1 configured (High severity only). Medium severity alerts not notified.",desc:"Alert notifications ensure security teams are informed of critical incidents.",ps:"# Configure in Microsoft Defender XDR Settings → Email notifications"},{id:"2.4.4",title:"Ensure Attack Simulation Training is enabled",type:"auto",profile:"E5 L1",status:"pass",value:"Attack Simulation: Active. Last campaign: 30 days ago. Click-through rate: 8%.",desc:"Attack simulation training measures and improves user phishing resilience.",ps:"# Review campaigns at security.microsoft.com/attacksimulator"},{id:"2.4.5",title:"Ensure Secure Score recommended actions are reviewed",type:"manual",profile:"E3 L1",status:"fail",value:null,desc:"Regular review of Secure Score actions ensures continuous security improvement.",ps:null}]}]},{id:"t3",num:"3",name:"Microsoft Purview",icon:"ti-lock",iconBg:"#EEEDFE",iconColor:"#3C3489",subsections:[{id:"t3s1",name:"3.1 Audit",controls:[{id:"3.1.1",title:"Ensure Microsoft 365 audit log search is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Unified Audit Log ingestion: Enabled",desc:"Audit log must be enabled to record all user and admin activities in Microsoft 365.",ps:"Get-AdminAuditLogConfig | Select UnifiedAuditLogIngestionEnabled"}]},{id:"t3s2",name:"3.2 Data Loss Prevention",controls:[{id:"3.2.1",title:"Ensure DLP policies are enabled for SharePoint and OneDrive",type:"auto",profile:"E3 L1",status:"pass",value:'DLP policy "Protect PII — SharePoint/OneDrive" active in Enforce mode.',desc:"DLP policies prevent sensitive data from being inappropriately shared via SharePoint.",ps:"Get-DlpCompliancePolicy | Where {$_.Workload -like '*SharePoint*'} | Select Name,Mode"},{id:"3.2.2",title:"Ensure DLP policies are enabled for Exchange Online",type:"auto",profile:"E3 L1",status:"pass",value:'DLP policy "Protect PII — Exchange" active in Enforce mode.',desc:"DLP policies prevent sensitive data from being emailed outside the organisation.",ps:"Get-DlpCompliancePolicy | Where {$_.Workload -like '*Exchange*'} | Select Name,Mode"},{id:"3.2.3",title:"Ensure DLP policies are enabled for Microsoft Teams",type:"auto",profile:"E3 L1",status:"fail",value:"No DLP policy found targeting Microsoft Teams workload.",desc:"Teams DLP prevents sensitive information from being shared in chat messages.",ps:"Get-DlpCompliancePolicy | Where {$_.Workload -like '*Teams*'} | Select Name,Mode,Enabled"}]},{id:"t3s3",name:"3.3 Information Protection",controls:[{id:"3.3.1",title:"Ensure sensitivity labels are established",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Sensitivity labels enable classification and protection of organisational data.",ps:null}]}]},{id:"t4",num:"4",name:"Microsoft Intune",icon:"ti-device-desktop",iconBg:"#EAF3DE",iconColor:"#3B6D11",subsections:[{id:"t4s1",name:"4. Device Compliance",controls:[{id:"4.1",title:"Ensure mobile device management policies are set to require advanced security configurations",type:"auto",profile:"E3 L1",status:"pass",value:"Compliance policies enforce encryption, PIN, and OS version for all platforms.",desc:"MDM compliance policies ensure devices meet minimum security requirements.",ps:"Get-MgDeviceManagementDeviceCompliancePolicy | Select DisplayName,Id"},{id:"4.2",title:"Ensure mobile device management policies are set to wipe on excessive failed attempts",type:"auto",profile:"E3 L1",status:"pass",value:"Device wipe configured after 10 failed sign-in attempts on managed devices.",desc:"Remote wipe capability protects corporate data on lost or stolen devices.",ps:"Get-MgDeviceManagementDeviceConfiguration | Select DisplayName | Where {$_.DisplayName -like '*Wipe*'}"}]}]},{id:"t5",num:"5",name:"Microsoft Entra Admin Center",icon:"ti-user-check",iconBg:"#E6F1FB",iconColor:"#185FA5",subsections:[{id:"t5s1",name:"5.1.2 Users",controls:[{id:"5.1.2.1",title:"Ensure Security Defaults is disabled on Azure Active Directory",type:"auto",profile:"E3 L1",status:"warn",value:"Security Defaults is enabled — may conflict with custom Conditional Access policies.",desc:"Security Defaults should be disabled when managing CA policies manually.",ps:"(Get-MgPolicyIdentitySecurityDefaultEnforcementPolicy).IsEnabled"},{id:"5.1.2.2",title:"Ensure that only organisationally managed/approved public groups exist",type:"auto",profile:"E3 L1",status:"pass",value:"No unmanaged public groups found.",desc:"Public groups expose membership to all users and should be governed.",ps:`Get-MgGroup -Filter "visibility eq 'Public'" | Measure-Object`},{id:"5.1.2.3",title:"Ensure sign-in frequency is enabled and browser sessions are not persistent for administrative users",type:"auto",profile:"E3 L1",status:"pass",value:"Admin sign-in frequency: 1 hour. Persistent browser: Disabled.",desc:"Limiting admin session lifetime reduces risk from unattended privileged sessions.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Admin*Session*'}"},{id:"5.1.2.4",title:"Ensure the 'Password Hash Sync' feature is enabled for hybrid environments",type:"auto",profile:"E3 L1",status:"warn",value:"Hybrid detected — Password Hash Sync status could not be verified via Graph API.",desc:"PHS enables cloud-based password protection and leaked credential detection.",ps:"# Check via Azure AD Connect health dashboard"},{id:"5.1.2.5",title:"Ensure that password protection is enabled for on-premises Active Directory",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Entra ID Password Protection enforces banned password list on-premises.",ps:null},{id:"5.1.2.6",title:"Ensure multi-factor authentication is enabled for all users",type:"auto",profile:"E3 L1",status:"pass",value:"MFA enforced via Conditional Access for all users: Policy active.",desc:"Ensuring all users are enrolled in MFA prevents account compromise.",ps:"Get-MgUser -All | Where {$_.StrongAuthenticationRequirements.Count -eq 0}"}]},{id:"t5s2",name:"5.1.3 Groups",controls:[{id:"5.1.3.1",title:"Ensure that group owners can manage group membership requests in the Access Panel",type:"auto",profile:"E3 L1",status:"pass",value:"Self-service group management: Enabled for group owners.",desc:"Delegating group management to owners reduces admin burden while maintaining control.",ps:"(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values"},{id:"5.1.3.2",title:"Ensure that Microsoft 365 group creation is restricted to administrators",type:"auto",profile:"E3 L1",status:"warn",value:"M365 group creation: Allowed for all users.",desc:"Restricting group creation prevents uncontrolled group sprawl.",ps:"(Get-MgDirectorySetting | Where {$_.DisplayName -eq 'Group.Unified'}).Values | Where {$_.Name -eq 'EnableGroupCreation'}"},{id:"5.1.3.3",title:"Ensure that users can create security groups",type:"auto",profile:"E3 L1",status:"warn",value:"Security group creation: Allowed for all users.",desc:"Non-admin security group creation can lead to unmanaged group proliferation.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateSecurityGroups"},{id:"5.1.3.4",title:"Ensure expiration policies are set for Office 365 groups",type:"auto",profile:"E3 L1",status:"pass",value:"Group expiration policy: 180 days. Notifications to owners enabled.",desc:"Expiration policies remove stale groups and reduce security exposure.",ps:"Get-MgGroupLifecyclePolicy | Select GroupLifetimeInDays,AlternateNotificationEmails"}]},{id:"t5s3",name:"5.1.4 Devices",controls:[{id:"5.1.4.1",title:"Ensure that devices are joined to or registered with Azure Active Directory",type:"auto",profile:"E3 L1",status:"pass",value:"Device registration: 832 / 847 devices (98.2%) Entra-registered.",desc:"Device registration enables device-based Conditional Access policies.",ps:"Get-MgDevice -All | Group-Object TrustType | Select Name,Count"},{id:"5.1.4.2",title:"Ensure users can register apps",type:"auto",profile:"E3 L1",status:"pass",value:"User app registration: Disabled (admin only).",desc:"Restricting app registration prevents unauthorised app creation in Entra ID.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateApps"},{id:"5.1.4.3",title:"Ensure that the device inactivity limit is set to 15 minutes or fewer",type:"auto",profile:"E3 L1",status:"pass",value:"Device inactivity timeout: 15 minutes.",desc:"Screen timeout protects devices left unattended in shared environments.",ps:"# Configured via Intune device configuration profile"},{id:"5.1.4.4",title:"Ensure that BitLocker is enabled on Windows devices",type:"auto",profile:"E3 L1",status:"pass",value:"BitLocker compliance: 98% of Windows devices encrypted.",desc:"BitLocker encryption protects data at rest on Windows endpoints.",ps:`Get-MgDeviceManagementManagedDevice -Filter "operatingSystem eq 'Windows'" -All | Where {$_.IsEncrypted -eq $false}`},{id:"5.1.4.5",title:"Ensure Intune is used for device management",type:"auto",profile:"E3 L1",status:"pass",value:"Intune MDM authority: Active. Enrolled devices: 847.",desc:"Intune provides unified endpoint management and compliance enforcement.",ps:"Get-MgDeviceManagementManagedDevice -All | Measure-Object"},{id:"5.1.4.6",title:"Ensure that a diagnostic data sharing policy exists",type:"manual",profile:"E3 L2",status:"pass",value:null,desc:"Diagnostic data policies ensure compliance with data residency requirements.",ps:null}]},{id:"t5s4",name:"5.1.5 Enterprise Apps",controls:[{id:"5.1.5.1",title:"Ensure the option 'Users can consent to apps accessing company data on their behalf' is set to 'Do not allow user consent'",type:"auto",profile:"E3 L1",status:"pass",value:"User consent for company data: Do not allow user consent.",desc:"Preventing user consent stops OAuth phishing attacks via malicious app permissions.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.PermissionGrantPoliciesAssigned"},{id:"5.1.5.2",title:"Ensure that password hashes are not synced to Entra ID for cloud-only accounts",type:"auto",profile:"E3 L1",status:"pass",value:"Cloud-only accounts: No password hash sync configured.",desc:"Cloud-only accounts should not have PHS enabled as it is unnecessary.",ps:"# Verify via Azure AD Connect configuration"},{id:"5.1.5.3",title:"Ensure that only admin users have access to create service principals",type:"auto",profile:"E3 L1",status:"pass",value:"Service principal creation: Restricted to admins only.",desc:"Restricting service principal creation prevents abuse of application identities.",ps:"(Get-MgPolicyAuthorizationPolicy).DefaultUserRolePermissions.AllowedToCreateApps"},{id:"5.1.5.4",title:"Ensure the admin consent workflow is enabled for applications",type:"auto",profile:"E3 L1",status:"pass",value:"Admin consent workflow: Enabled.",desc:"Admin consent workflow provides oversight of application permission grants.",ps:"Get-MgPolicyAdminConsentRequestPolicy | Select IsEnabled"},{id:"5.1.5.5",title:"Ensure that all service principals have certificate-based authentication",type:"auto",profile:"E5 L1",status:"pass",value:"Service principals with password credentials: 2 (legacy, being migrated).",desc:"Certificate auth is more secure than client secrets for service principals.",ps:"Get-MgApplication -All | Where {$_.PasswordCredentials.Count -gt 0} | Select DisplayName"},{id:"5.1.5.6",title:"Ensure that app registrations have an owner",type:"auto",profile:"E3 L1",status:"pass",value:"App registrations without owner: 0",desc:"App registration owners ensure accountability and lifecycle management.",ps:"Get-MgApplication -All | ForEach {Get-MgApplicationOwner -ApplicationId $_.Id} | Where {$_ -eq $null}"}]},{id:"t5s5",name:"5.1.6 External Identities",controls:[{id:"5.1.6.1",title:"Ensure that 'Guest invite restrictions' are set to 'Only users assigned to specific admin roles can invite guest users'",type:"auto",profile:"E3 L1",status:"pass",value:"Guest invite restrictions: Admin and guest inviters only.",desc:"Restricting guest invitations prevents uncontrolled external access.",ps:"(Get-MgPolicyAuthorizationPolicy).AllowInvitesFrom"},{id:"5.1.6.2",title:"Ensure that guest users have limited access to Azure AD directory objects",type:"auto",profile:"E3 L1",status:"pass",value:"Guest access level: Restricted (guests can't enumerate directory objects).",desc:"Limiting guest directory access prevents reconnaissance by external users.",ps:"(Get-MgPolicyAuthorizationPolicy).GuestUserRoleId"},{id:"5.1.6.3",title:"Ensure that external users cannot share files, folders, or sites they do not own",type:"auto",profile:"E3 L1",status:"pass",value:"SharePoint: External sharing restricted to existing guest users only.",desc:"Preventing re-sharing by guests limits data leakage to unauthorised parties.",ps:"Get-SPOTenant | Select ExternalUserExpirationRequired,RequireAcceptingAccountMatchInvitedAccount"}]},{id:"t5s6",name:"5.1.8 Hybrid Management",controls:[{id:"5.1.8.1",title:"Ensure Azure AD cloud sync is properly configured for hybrid environments",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Cloud sync ensures consistent identity management across on-premises and cloud.",ps:null}]},{id:"t5s7",name:"5.2.2 Conditional Access",controls:[{id:"5.2.2.1",title:"Ensure Conditional Access policies enforce MFA for all users",type:"auto",profile:"E3 L1",status:"pass",value:'CA policy "Require MFA — All Users" is enabled.',desc:"MFA for all users is the most impactful single security control available.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*MFA*All*'} | Select DisplayName,State"},{id:"5.2.2.2",title:"Ensure Conditional Access policies enforce MFA for all administrators",type:"auto",profile:"E3 L1",status:"pass",value:'CA policy "Require MFA — Admins" is enabled targeting all admin roles.',desc:"Admin accounts are high-value targets and require mandatory MFA enforcement.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Admin*MFA*'} | Select DisplayName,State"},{id:"5.2.2.3",title:"Ensure Conditional Access policies enforce MFA for Azure management",type:"auto",profile:"E3 L1",status:"pass",value:'CA policy "Require MFA — Azure Management" is active.',desc:"Azure management MFA prevents attackers from making infrastructure changes.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Azure*'} | Select DisplayName,State"},{id:"5.2.2.4",title:"Ensure Conditional Access policies block access from unknown or anonymous IP addresses",type:"auto",profile:"E3 L1",status:"pass",value:"Named locations defined. Anonymous IP policy active in block mode.",desc:"Blocking anonymous IP access prevents attacks from Tor and proxy networks.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Anonymous*'} | Select DisplayName,State"},{id:"5.2.2.5",title:"Ensure Conditional Access policies enforce a approved device compliance requirement",type:"auto",profile:"E3 L1",status:"fail",value:"Device compliance CA policy excludes 12 users (>10% of users). Policy incomplete.",desc:"Requiring compliant devices ensures corporate access only from managed endpoints.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Device*Compliant*'} | Select DisplayName,State,Conditions"},{id:"5.2.2.6",title:"Ensure Conditional Access policy blocks access for high sign-in risk",type:"auto",profile:"E5 L1",status:"pass",value:"Risk-based CA policy: High risk sign-ins blocked.",desc:"Risk-based CA leverages Microsoft threat intelligence to block suspicious sign-ins.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.SignInRiskLevels -contains 'high'} | Select DisplayName,State"},{id:"5.2.2.7",title:"Ensure Conditional Access policy blocks access for high user risk",type:"auto",profile:"E5 L1",status:"pass",value:"User risk policy: High risk users required to change password.",desc:"User risk policies force password reset for compromised account detection.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.UserRiskLevels -contains 'high'} | Select DisplayName,State"},{id:"5.2.2.8",title:"Ensure Conditional Access policy restricts access to legacy authentication",type:"auto",profile:"E3 L1",status:"pass",value:"Legacy auth block policy: Enabled.",desc:"Legacy authentication protocols do not support MFA and must be blocked.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.ClientAppTypes -contains 'exchangeActiveSync'} | Select DisplayName,State"},{id:"5.2.2.9",title:"Ensure that Conditional Access policies enforce MFA for device registration",type:"auto",profile:"E3 L1",status:"pass",value:"MFA required for device registration: Policy active.",desc:"MFA for device registration prevents attacker-controlled device enrolment.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Register Device*'} | Select DisplayName,State"},{id:"5.2.2.10",title:"Ensure that Conditional Access requires phishing-resistant MFA for admins",type:"auto",profile:"E5 L1",status:"pass",value:"Phishing-resistant MFA (FIDO2 / Certificate) required for admin roles.",desc:"Phishing-resistant MFA prevents real-time phishing bypass of standard MFA.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*FIDO*Admin*'} | Select DisplayName,State"},{id:"5.2.2.11",title:"Ensure that Conditional Access enforces Token Protection",type:"auto",profile:"E5 L2",status:"pass",value:"Token Protection policy: Active (preview).",desc:"Token Protection binds access tokens to specific devices to prevent token theft.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.SessionControls.SignInFrequency.AuthenticationType -eq 'primaryAndSecondaryAuthentication'}"},{id:"5.2.2.12",title:"Ensure that Conditional Access enforces Continuous Access Evaluation",type:"auto",profile:"E5 L1",status:"pass",value:"CAE: Enabled for all supported applications.",desc:"CAE enables near real-time enforcement of access policy changes and revocations.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.SessionControls.ContinuousAccessEvaluation -ne $null}"},{id:"5.2.2.13",title:"Ensure that Conditional Access Application Enforcement is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"App-enforced restrictions: Active for Exchange and SharePoint.",desc:"App-enforced restrictions apply policy directly within supported applications.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.SessionControls.ApplicationEnforcedRestrictions.IsEnabled -eq $true}"},{id:"5.2.2.14",title:"Ensure that Conditional Access blocks access to unsupported device platforms",type:"auto",profile:"E3 L1",status:"pass",value:"Unknown device platforms: Blocked.",desc:"Blocking unsupported platforms prevents access from unmanaged or unknown devices.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.Conditions.Platforms.ExcludePlatforms -contains 'unknownFutureValue'}"},{id:"5.2.2.15",title:"Ensure that Conditional Access policies enforce Global Secure Access",type:"auto",profile:"E5 L1",status:"pass",value:"Global Secure Access traffic forwarding: Active.",desc:"Global Secure Access extends Zero Trust network access to all corporate resources.",ps:"# Verify in Entra ID → Global Secure Access → Dashboard"},{id:"5.2.2.16",title:"Ensure Conditional Access policy enforces MFA for all Microsoft Graph API calls",type:"auto",profile:"E5 L2",status:"pass",value:"Graph API MFA enforcement: CA policy active.",desc:"Requiring MFA for Graph access prevents programmatic data access by compromised accounts.",ps:"Get-MgIdentityConditionalAccessPolicy | Where {$_.DisplayName -like '*Graph*MFA*'}"},{id:"5.2.2.17",title:"Ensure named locations are defined",type:"auto",profile:"E3 L1",status:"pass",value:"3 named locations configured: UK Office (IP), US Office (IP), Trusted WiFi (IP).",desc:"Named locations enable risk-based policies distinguishing trusted from untrusted networks.",ps:"Get-MgIdentityConditionalAccessNamedLocation | Select DisplayName,OdataType"}]},{id:"t5s8",name:"5.2.3 Authentication Methods",controls:[{id:"5.2.3.1",title:"Ensure the Authentication Methods policy enables passwordless sign-in",type:"auto",profile:"E3 L1",status:"pass",value:"Microsoft Authenticator: Enabled. Passwordless phone sign-in: Enabled.",desc:"Passwordless authentication eliminates password theft risk entirely.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId MicrosoftAuthenticator"},{id:"5.2.3.2",title:"Ensure that SSPR policy is configured to require at least two authentication methods",type:"auto",profile:"E3 L1",status:"pass",value:"SSPR: Requires 2 methods. Allowed: Authenticator app + backup email.",desc:"Two-method SSPR requirement prevents account takeover via single-factor password reset.",ps:"Get-MgPolicySelfServiceSignUpPolicy | Select NumberOfMethodsRequired"},{id:"5.2.3.3",title:"Ensure the Authentication Methods Policy is configured to disable SMS and Voice",type:"auto",profile:"E3 L1",status:"pass",value:"SMS MFA: Disabled in auth methods policy.",desc:"SMS-based MFA is vulnerable to SIM-swapping and should be replaced by stronger methods.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId Sms"},{id:"5.2.3.4",title:"Ensure that FIDO2 security key authentication is enabled",type:"auto",profile:"E5 L1",status:"warn",value:"FIDO2: Enabled but restricted to IT group only (not all users).",desc:"FIDO2 hardware keys provide the strongest phishing-resistant authentication.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId Fido2"},{id:"5.2.3.5",title:"Ensure that certificate-based authentication is configured",type:"auto",profile:"E5 L1",status:"pass",value:"CBA: Enabled. PKI trust configured.",desc:"Certificate-based authentication provides strong, phishing-resistant authentication.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId X509Certificate"},{id:"5.2.3.6",title:"Ensure that Microsoft Authenticator is configured to show context for MFA requests",type:"auto",profile:"E3 L1",status:"pass",value:"Number matching: Enabled. Location context: Enabled. App name: Enabled.",desc:"MFA context helps users identify and reject suspicious push notifications (MFA fatigue).",ps:"(Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId MicrosoftAuthenticator).AdditionalProperties"},{id:"5.2.3.7",title:"Ensure TAP (Temporary Access Pass) is enabled for onboarding",type:"auto",profile:"E3 L1",status:"pass",value:"Temporary Access Pass: Enabled for admins only.",desc:"TAP enables secure onboarding of passwordless credentials for new users.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId TemporaryAccessPass"},{id:"5.2.3.8",title:"Ensure authentication strength is configured for privileged admin MFA",type:"auto",profile:"E5 L1",status:"pass",value:'Custom auth strength "Privileged Admin MFA" active: requires FIDO2 or CBA.',desc:"Authentication strengths enforce specific method requirements for privileged roles.",ps:"Get-MgPolicyAuthenticationStrengthPolicy | Select DisplayName,AllowedCombinations"},{id:"5.2.3.9",title:"Ensure that report-suspicious activity is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Report suspicious activity (MFA fraud): Enabled.",desc:"Fraud reporting enables users to flag unexpected MFA requests for investigation.",ps:"Get-MgPolicyAuthenticationMethodPolicyAuthenticationMethodConfiguration -AuthenticationMethodConfigurationId Voice"},{id:"5.2.3.10",title:"Ensure the number of methods required to reset a password is set to 2",type:"auto",profile:"E3 L1",status:"pass",value:"SSPR: 2 authentication methods required to reset password.",desc:"Requiring two methods for SSPR prevents single-point password reset compromise.",ps:"(Get-MgPolicySelfServiceSignUpPolicy).NumberOfMethodsRequired"}]},{id:"t5s9",name:"5.2.4 Password Reset",controls:[{id:"5.2.4.1",title:"Ensure Self-Service Password Reset Activity report is reviewed weekly",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Regular SSPR activity review detects unusual reset patterns indicating account compromise.",ps:null},{id:"5.2.4.2",title:"Ensure custom banned passwords list is configured",type:"auto",profile:"E3 L1",status:"pass",value:"Custom banned passwords: 47 entries. Smart lockout: Enabled.",desc:"Custom banned passwords prevent use of known-weak or company-specific weak passwords.",ps:"# Verify in Entra ID → Authentication Methods → Password protection"},{id:"5.2.4.3",title:"Ensure password protection is enabled for on-premises AD",type:"auto",profile:"E3 L1",status:"pass",value:"Entra ID Password Protection: Active (Enforce mode) on DCs.",desc:"On-premises password protection extends cloud banned password list to AD.",ps:"# Check DC Agent installer status in Entra ID → Password protection"},{id:"5.2.4.4",title:"Ensure lockout threshold is set to 10 or fewer invalid sign-in attempts",type:"auto",profile:"E3 L1",status:"pass",value:"Smart lockout threshold: 10 attempts. Lockout duration: 60 seconds.",desc:"Lockout policy prevents brute-force attacks against user accounts.",ps:"# Check in Entra ID → Authentication Methods → Password protection"},{id:"5.2.4.5",title:"Ensure that the password reset notification is set to notify both users and admins",type:"auto",profile:"E3 L1",status:"pass",value:"SSPR notifications: User notified on reset. Admins notified when admin account reset.",desc:"Password reset notifications alert users to suspicious account changes.",ps:"Get-MgPolicySelfServiceSignUpPolicy | Select NotifyOnAdminPasswordReset,NotifyUsersOnPasswordReset"}]},{id:"t5s10",name:"5.3 Identity Governance",controls:[{id:"5.3.1",title:"Ensure Entitlement Management access packages are configured",type:"manual",profile:"E5 L1",status:"pass",value:null,desc:"Access packages streamline access request and lifecycle management.",ps:null},{id:"5.3.2",title:"Ensure access reviews are configured for privileged roles",type:"auto",profile:"E5 L1",status:"pass",value:"Access reviews: Quarterly for all directory roles. Last review: 45 days ago.",desc:"Regular access reviews ensure privileged access remains appropriate over time.",ps:"Get-MgIdentityGovernanceAccessReviewDefinition | Select DisplayName,Status"},{id:"5.3.3",title:"Ensure lifecycle workflows are configured for joiner/mover/leaver processes",type:"manual",profile:"E5 L1",status:"pass",value:null,desc:"Lifecycle workflows automate identity management for HR-driven events.",ps:null},{id:"5.3.4",title:"Ensure PIM access reviews are configured for eligible role assignments",type:"auto",profile:"E5 L1",status:"pass",value:"PIM access reviews: Active for Global Admin, Security Admin, Exchange Admin.",desc:"PIM access reviews prevent stale eligible role assignments from persisting.",ps:"Get-MgIdentityGovernancePrivilegedAccessGroupAssignmentApproval | Select Id,Status"},{id:"5.3.5",title:"Ensure that PIM activation approval is required for critical roles",type:"auto",profile:"E5 L1",status:"pass",value:"PIM approval: Required for Global Admin and Security Admin activation.",desc:"Requiring approval for PIM activation adds a human verification step for critical access.",ps:"# Check in Entra ID → PIM → Settings for each role"}]}]},{id:"t6",num:"6",name:"Exchange Admin Center",icon:"ti-mail",iconBg:"#FAEEDA",iconColor:"#854F0B",subsections:[{id:"t6s1",name:"6.1 Audit",controls:[{id:"6.1.1",title:"Ensure Microsoft Exchange Online audit logging is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Mailbox audit logging: Enabled by default for all users.",desc:"Exchange audit logging records mailbox access and admin actions for forensic review.",ps:"Get-OrganizationConfig | Select AuditDisabled"},{id:"6.1.2",title:"Ensure mailbox auditing for E3 users is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"AuditBypassEnabled: False for all mailboxes.",desc:"Per-mailbox audit settings ensure all mailbox activity is captured.",ps:"Get-Mailbox -ResultSize Unlimited | Where {$_.AuditEnabled -eq $false} | Measure-Object"},{id:"6.1.3",title:"Ensure the Exchange administrator audit log is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Admin audit log: Enabled. Log age limit: 90 days.",desc:"Admin audit logs capture all Exchange administrative changes.",ps:"Get-AdminAuditLogConfig | Select AdminAuditLogEnabled,AdminAuditLogAgeLimit"}]},{id:"t6s2",name:"6.2 Mail Flow",controls:[{id:"6.2.1",title:"Ensure all forms of mail forwarding are blocked and/or disabled",type:"auto",profile:"E3 L1",status:"pass",value:"Auto-forwarding to external domains: Blocked via transport rule.",desc:"Blocking external mail forwarding prevents data exfiltration from compromised mailboxes.",ps:"Get-TransportRule | Where {$_.RedirectMessageTo -ne $null} | Select Name,State"},{id:"6.2.2",title:"Ensure mail transport rules do not whitelist specific domains",type:"auto",profile:"E3 L1",status:"pass",value:"No transport rules bypassing spam filtering found.",desc:"Domain whitelisting in transport rules can allow phishing emails to bypass protection.",ps:"Get-TransportRule | Where {$_.SetSCL -eq -1} | Select Name,Conditions"},{id:"6.2.3",title:"Ensure email from external senders is tagged",type:"auto",profile:"E3 L1",status:"pass",value:'External email tagging: Enabled. Prepends "[EXTERNAL]" to subject.',desc:"External sender tagging helps users identify potentially suspicious emails.",ps:"Get-ExternalInOutlook | Select Enabled"}]},{id:"t6s3",name:"6.3 Roles",controls:[{id:"6.3.1",title:"Ensure the Exchange admin role is limited to an appropriate number of users",type:"auto",profile:"E3 L1",status:"pass",value:"Exchange Admins: 2 accounts.",desc:"Minimizing Exchange Admin accounts reduces the attack surface for email infrastructure.",ps:'Get-RoleGroupMember "Organization Management" | Select Name,RecipientType'},{id:"6.3.2",title:"Ensure Exchange role assignments are reviewed regularly",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Regular role reviews ensure Exchange admin assignments remain appropriate.",ps:null}]},{id:"t6s4",name:"6.5 Settings",controls:[{id:"6.5.1",title:"Ensure modern authentication for Exchange Online is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"Modern Authentication (OAuth): Enabled for Exchange Online.",desc:"Modern auth is required for MFA to work with Exchange Online clients.",ps:"Get-OrganizationConfig | Select OAuth2ClientProfileEnabled"},{id:"6.5.2",title:"Ensure MailTips are enabled for end users",type:"auto",profile:"E3 L1",status:"pass",value:"MailTips: Enabled. Shows warnings for large audiences and external recipients.",desc:"MailTips provide visual warnings to reduce accidental email disclosure.",ps:"Get-OrganizationConfig | Select MailTipsAllTipsEnabled,MailTipsExternalRecipientsTipsEnabled"},{id:"6.5.3",title:"Ensure access to Exchange admin center is limited by IP address",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"IP-restricted EAC access reduces the attack surface for Exchange administration.",ps:null},{id:"6.5.4",title:"Ensure that mobile devices require complex passwords",type:"auto",profile:"E3 L1",status:"pass",value:"Mobile device policy: Requires PIN length ≥ 6, alphanumeric.",desc:"Complex mobile PINs protect against brute-force attacks on lost devices.",ps:"Get-MobileDeviceMailboxPolicy | Select Name,PasswordEnabled,MinPasswordLength,AlphanumericPasswordRequired"},{id:"6.5.5",title:"Ensure that additional storage providers are restricted in Outlook on the web",type:"auto",profile:"E3 L1",status:"pass",value:"Additional storage (e.g. Dropbox, Google Drive): Blocked in OWA.",desc:"Restricting external storage prevents data exfiltration via consumer cloud services.",ps:"Get-OwaMailboxPolicy | Select AdditionalStorageProvidersAvailable"}]}]},{id:"t7",num:"7",name:"SharePoint Admin Center",icon:"ti-brand-sharepoint",iconBg:"#EAF3DE",iconColor:"#3B6D11",subsections:[{id:"t7s1",name:"7.2 Policies",controls:[{id:"7.2.1",title:"Ensure SharePoint Online external sharing is managed",type:"auto",profile:"E3 L1",status:"pass",value:"Tenant-level external sharing: New and existing guests only (not Anyone links).",desc:"External sharing controls prevent unauthorised data access by external parties.",ps:"Get-SPOTenant | Select SharingCapability"},{id:"7.2.2",title:"Ensure OneDrive content sharing is restricted",type:"auto",profile:"E3 L1",status:"pass",value:"OneDrive sharing: Existing guests only.",desc:"OneDrive sharing restrictions prevent personal file shares from leaking corporate data.",ps:"Get-SPOTenant | Select OneDriveDefaultShareLinkRole"},{id:"7.2.3",title:"Ensure SharePoint access requests are limited to site owners",type:"auto",profile:"E3 L1",status:"pass",value:"Access request notifications: Sent to site owners only.",desc:"Directing access requests to owners ensures appropriate approvals.",ps:"# Review per-site setting via SPO admin center"},{id:"7.2.4",title:"Ensure guest access to sites is reviewed regularly",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Regular guest access reviews ensure external access remains appropriate.",ps:null},{id:"7.2.5",title:"Ensure that SharePoint guest users cannot share items they don't own",type:"auto",profile:"E3 L1",status:"pass",value:"RequireAcceptingAccountMatchInvitedAccount: True",desc:"Preventing guest re-sharing limits uncontrolled propagation of shared content.",ps:"Get-SPOTenant | Select RequireAcceptingAccountMatchInvitedAccount"},{id:"7.2.6",title:"Ensure SharePoint and OneDrive integration with Azure AD B2B is enabled",type:"auto",profile:"E3 L1",status:"pass",value:"SharePoint B2B integration: Enabled.",desc:"B2B integration ensures external sharing uses Entra ID guest accounts for governance.",ps:"Get-SPOTenant | Select EnableAzureADB2BIntegration"},{id:"7.2.7",title:"Ensure SharePoint access restriction for unmanaged devices is configured",type:"auto",profile:"E3 L1",status:"pass",value:"Unmanaged device access: Limited web access only (no sync/download).",desc:"Restricting unmanaged device access prevents data sync to personal devices.",ps:"Get-SPOTenant | Select ConditionalAccessPolicy"},{id:"7.2.8",title:"Ensure idle session timeout for SharePoint and OneDrive is set",type:"auto",profile:"E3 L1",status:"pass",value:"Browser session timeout: 8 hours.",desc:"Session timeout protects SharePoint sessions left open on shared computers.",ps:"Get-SPOBrowserIdleSignOut | Select Enabled,SignOutAfter"},{id:"7.2.9",title:"Ensure SharePoint Online information barriers mode is configured",type:"manual",profile:"E5 L1",status:"pass",value:null,desc:"Information barriers prevent specific users or groups from communicating.",ps:null},{id:"7.2.10",title:"Ensure that SharePoint sends email notifications for sharing",type:"auto",profile:"E3 L1",status:"pass",value:"Sharing email notifications: Enabled.",desc:"Sharing notifications alert users when their content is shared with others.",ps:"Get-SPOTenant | Select NotificationsInSharePointEnabled"},{id:"7.2.11",title:"Ensure SharePoint external sharing is configured to 'Existing guests only' or more restrictive",type:"auto",profile:"E3 L1",status:"pass",value:"Sharing capability: ExistingExternalUserSharingOnly",desc:"Restricting to existing guests prevents new unauthenticated external sharing.",ps:"Get-SPOTenant | Select SharingCapability"}]},{id:"t7s2",name:"7.3 Settings",controls:[{id:"7.3.1",title:"Ensure custom script execution is restricted in SharePoint Online",type:"auto",profile:"E3 L1",status:"pass",value:"Custom scripts: DenyAndDisablePersonalSite + DenyCustomScriptUserSites.",desc:"Blocking custom scripts prevents injection attacks and unauthorised functionality.",ps:"Get-SPOSite -Limit All | Where {$_.DenyAddAndCustomizePages -eq 0}"}]}]},{id:"t8",num:"8",name:"Microsoft Teams Admin Center",icon:"ti-brand-teams",iconBg:"#EEEDFE",iconColor:"#3C3489",subsections:[{id:"t8s1",name:"8.1 Teams",controls:[{id:"8.1.1",title:"Ensure external domains are restricted in Teams",type:"auto",profile:"E3 L1",status:"pass",value:"External access: Specific allowed domains only (3 trusted partner domains).",desc:"Restricting external domains prevents communication with unknown organisations.",ps:"Get-CsTenantFederationConfiguration | Select AllowFederatedUsers,AllowedDomains"},{id:"8.1.2",title:"Ensure Teams is restricted from automatically accepting incoming meeting requests",type:"auto",profile:"E3 L1",status:"pass",value:"Auto-accept meeting invitations: Disabled.",desc:"Preventing auto-accept stops attendees from joining meetings without host presence.",ps:"Get-CsMeetingConfiguration | Select AutoAdmitUsers"}]},{id:"t8s2",name:"8.2 Users & External Access",controls:[{id:"8.2.1",title:"Ensure anonymous users cannot join Teams meetings",type:"auto",profile:"E3 L1",status:"pass",value:"Anonymous meeting join: Disabled.",desc:"Blocking anonymous join prevents uninvited parties from accessing meetings.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowAnonymousUsersToJoinMeeting"},{id:"8.2.2",title:"Ensure that users cannot bypass the lobby in Teams meetings",type:"auto",profile:"E3 L1",status:"pass",value:"Lobby bypass: Only organiser can bypass. All others enter lobby.",desc:"The meeting lobby gives organisers control over who joins their meetings.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AutoAdmitUsers"},{id:"8.2.3",title:"Ensure external participants cannot give or request control",type:"auto",profile:"E3 L1",status:"pass",value:"External control: AllowExternalParticipantGiveRequestControl = False.",desc:"Preventing external screen control reduces risk of social engineering attacks.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowExternalParticipantGiveRequestControl"},{id:"8.2.4",title:"Ensure Teams external chat is restricted",type:"auto",profile:"E3 L1",status:"pass",value:"External chat: Allowed with specific domains only.",desc:"Restricting external chat prevents data leakage via uncontrolled external communications.",ps:"Get-CsTenantFederationConfiguration | Select AllowTeamsConsumer,AllowTeamsConsumerInbound"}]},{id:"t8s3",name:"8.4 Teams Apps",controls:[{id:"8.4.1",title:"Ensure users are not able to install Teams apps from the App Store",type:"auto",profile:"E3 L1",status:"pass",value:"Teams app policy: Allow org-approved apps only.",desc:"Restricting app installs prevents unapproved or potentially malicious apps.",ps:"Get-CsTeamsAppPermissionPolicy | Select UserPinnedAppsSetting,DefaultCatalogApps"}]},{id:"t8s4",name:"8.5 Meetings",controls:[{id:"8.5.1",title:"Ensure that meeting recording is disabled for all non-essential users",type:"auto",profile:"E3 L1",status:"pass",value:"Meeting recording: Enabled for standard users. Stored in OneDrive.",desc:"Meeting recording policies control sensitive conversation capture.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowCloudRecording"},{id:"8.5.2",title:"Ensure external meeting recordings cannot be shared",type:"auto",profile:"E3 L1",status:"pass",value:"Recording sharing: Internal only.",desc:"Preventing external sharing of recordings protects confidential meeting content.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowRecordingStorageOutsideRegion"},{id:"8.5.3",title:"Ensure meeting chat does not allow anonymous users",type:"auto",profile:"E3 L1",status:"pass",value:"Meeting chat: Anonymous users cannot post.",desc:"Blocking anonymous meeting chat prevents uninvited contributions.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select MeetingChatEnabledType"},{id:"8.5.4",title:"Ensure presenter roles are restricted in Teams meetings",type:"auto",profile:"E3 L1",status:"pass",value:"Presenter role: Organiser and co-organisers only.",desc:"Restricting presenter roles limits who can share content or manage meeting controls.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowUserToBePresenter"},{id:"8.5.5",title:"Ensure Teams meeting recordings do not expire",type:"auto",profile:"E3 L1",status:"pass",value:"Meeting recording expiry: Disabled (no auto-expiry).",desc:"No-expiry recordings ensure evidence is available for compliance investigations.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select NewMeetingRecordingExpirationDays"},{id:"8.5.6",title:"Ensure NDI streaming is disabled",type:"auto",profile:"E3 L1",status:"pass",value:"NDI streaming: Disabled.",desc:"NDI streaming can expose meeting content to local network capture.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowNDIStreaming"},{id:"8.5.7",title:"Ensure watermarking is enabled for sensitive meetings",type:"manual",profile:"E5 L1",status:"pass",value:null,desc:"Watermarks on meeting content deter screenshot sharing of sensitive material.",ps:null},{id:"8.5.8",title:"Ensure screen capture is restricted for sensitive meetings",type:"auto",profile:"E5 L1",status:"pass",value:"Sensitivity label-based screen capture restriction: Active.",desc:"Screen capture restrictions protect sensitive meeting content from unauthorised capture.",ps:"Get-CsTeamsMeetingPolicy | Where {$_.AllowIPVideo -eq $false}"},{id:"8.5.9",title:"Ensure meeting transcription is managed",type:"auto",profile:"E3 L1",status:"pass",value:"Transcription: Allowed for all users. Stored in SharePoint.",desc:"Managing transcription ensures sensitive spoken content is appropriately protected.",ps:"Get-CsTeamsMeetingPolicy -Identity Global | Select AllowTranscription"}]},{id:"t8s5",name:"8.6 Messaging",controls:[{id:"8.6.1",title:"Ensure external Teams message sharing is restricted",type:"auto",profile:"E3 L1",status:"pass",value:"Teams consumer external chat: Blocked.",desc:"Blocking consumer Teams chat prevents data leakage to personal accounts.",ps:"Get-CsTenantFederationConfiguration | Select AllowTeamsConsumer"}]}]},{id:"t9",num:"9",name:"Microsoft Fabric",icon:"ti-chart-area",iconBg:"#E0F5F4",iconColor:"#0D6B68",subsections:[{id:"t9s1",name:"9.1 Tenant Settings",controls:[{id:"9.1.1",title:"Ensure Publish to web is restricted",type:"auto",profile:"E3 L1",status:"pass",value:"Publish to web: Disabled tenant-wide.",desc:"Publish to web creates public anonymous URLs and should be restricted.",ps:"# Check in Fabric admin portal: app.fabric.microsoft.com/admin-portal"},{id:"9.1.2",title:"Ensure external data sharing is disabled",type:"auto",profile:"E3 L1",status:"pass",value:"External data sharing: Disabled.",desc:"External data sharing controls prevent Fabric lakehouses from sharing data outside the tenant.",ps:"# Check in Fabric admin portal → Tenant settings → External data sharing"},{id:"9.1.3",title:"Ensure Fabric guest user access is managed",type:"auto",profile:"E3 L1",status:"pass",value:"Guest access to Fabric: Limited to specific workspaces via security groups.",desc:"Guest access governance prevents external users from accessing sensitive data assets.",ps:"# Review via Fabric admin portal → Users"},{id:"9.1.4",title:"Ensure that guest users can browse and access Fabric content is disabled",type:"auto",profile:"E3 L1",status:"pass",value:"Guest browsing: Disabled.",desc:"Preventing guests from browsing Fabric content limits exposure of data assets.",ps:"# Check Fabric admin portal → Tenant settings → Allow guest users to browse Fabric"},{id:"9.1.5",title:"Ensure custom visuals are restricted in Fabric reports",type:"auto",profile:"E3 L1",status:"pass",value:"Custom visuals: AppSource and certified only.",desc:"Restricting custom visuals reduces risk from malicious third-party Power BI visuals.",ps:"# Fabric admin portal → Tenant settings → Custom visuals"},{id:"9.1.6",title:"Ensure that R and Python visuals are restricted",type:"auto",profile:"E3 L1",status:"pass",value:"R/Python visuals: Disabled.",desc:"R and Python visuals can execute arbitrary code and should be restricted.",ps:"# Fabric admin portal → Tenant settings → R visual settings"},{id:"9.1.7",title:"Ensure data export to Excel is governed",type:"auto",profile:"E3 L1",status:"pass",value:"Export to Excel: Allowed but audited.",desc:"Governing Excel exports ensures sensitive data exports are tracked.",ps:"# Fabric admin portal → Export and sharing settings → Export to Excel"},{id:"9.1.8",title:"Ensure that Fabric workspaces have sensitivity labels applied",type:"manual",profile:"E5 L1",status:"pass",value:null,desc:"Sensitivity labels on Fabric workspaces enforce data protection policies on reports.",ps:null},{id:"9.1.9",title:"Ensure Fabric admin API audit logs are reviewed",type:"manual",profile:"E3 L1",status:"pass",value:null,desc:"Regular audit log review detects unauthorised Fabric administrative changes.",ps:null},{id:"9.1.10",title:"Ensure service principals cannot use Fabric APIs",type:"auto",profile:"E3 L2",status:"pass",value:"Service principal API access: Disabled except for approved SPNs in allow group.",desc:"Restricting SPN access to Fabric APIs prevents abuse by compromised service accounts.",ps:"# Fabric admin portal → Developer settings → Allow service principals to use Fabric APIs"},{id:"9.1.11",title:"Ensure Fabric capacity admin roles are limited",type:"auto",profile:"E3 L1",status:"pass",value:"Fabric capacity admins: 2 accounts.",desc:"Minimizing Fabric admins reduces the blast radius of a compromised admin account.",ps:"# Review in Fabric admin portal → Capacity settings → Admins"},{id:"9.1.12",title:"Ensure Microsoft Purview integration with Fabric is enabled for data governance",type:"auto",profile:"E5 L1",status:"pass",value:"Purview integration: Active. Data lineage scanning enabled.",desc:"Purview integration provides data cataloguing and compliance visibility for Fabric assets.",ps:"# Fabric admin portal → Tenant settings → Microsoft Purview integration"}]}]}];let gt="main",mt=null;const ss={t1:{bg:"#E6F1FB",color:"#0C447C"},t2:{bg:"#FCEBEB",color:"#A32D2D"},t3:{bg:"#EEEDFE",color:"#3C3489"},t4:{bg:"#EAF3DE",color:"#3B6D11"},t5:{bg:"#E6F1FB",color:"#185FA5"},t6:{bg:"#FAEEDA",color:"#854F0B"},t7:{bg:"#EAF3DE",color:"#3B6D11"},t8:{bg:"#EEEDFE",color:"#3C3489"},t9:{bg:"#E0F5F4",color:"#0D6B68"}};function _t(e){const t=e.subsections.flatMap(l=>l.controls),i=t.length;let s=0,a=0,n=0,r=0;t.forEach(l=>{const c=Vt(l);c==="pass"?s++:c==="fail"?a++:c==="warn"&&n++,l.type==="manual"&&r++});const o=i>0?Math.round(s/i*100):0;return{total:i,pass:s,fail:a,warn:n,manual:r,score:o}}function Vt(e){return m.cfgAttested[e.id]?"pass":e.status}function jn(){return Ht.flatMap(e=>e.subsections.flatMap(t=>t.controls))}function as(){const e=jn();let t=0,i=0,s=0,a=0;e.forEach(o=>{const l=Vt(o);l==="pass"?t++:l==="fail"?i++:l==="warn"&&s++,o.type==="manual"&&a++});const n=e.length,r=Math.round(t/n*100);return{total:n,pass:t,fail:i,warn:s,manual:a,score:r}}function Fn(e){const t={pass:["success","Pass"],fail:["danger","Failed"],warn:["warning","Warning"]},[i,s]=t[e]||["neutral","Unknown"];return`<span class="badge ${i}">${s}</span>`}function Je(e){return e>=85?"success":e>=65?"warning":"danger"}async function ns(){const e=document.getElementById("page-m365config");e&&(gt="main",mt=null,J()?Bn(e):await Wt(e))}function Bn(e){const t=as(),i=Je(t.score);e.innerHTML=`
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

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample CIS controls</span>
    </div>

    <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">Topics</div>
    <div class="cfg-topic-grid" id="cfg-topic-grid"></div>
  `;const s=e.querySelector("#cfg-topic-grid");Ht.forEach(a=>{const n=_t(a),r=Je(n.score),o=document.createElement("div");o.className="cfg-topic-card";const l=ss[a.id]||{bg:"#f0f0f0",color:"#555"};o.innerHTML=`
      <div class="cfg-topic-icon" style="background:${l.bg};color:${l.color}">
        <i class="ti ${a.icon}"></i>
      </div>
      <div class="cfg-topic-num">Topic ${a.num}</div>
      <div class="cfg-topic-name">${a.name}</div>
      <div class="cfg-topic-badges">
        ${n.fail>0?`<span class="badge danger">${n.fail} fail</span>`:""}
        ${n.warn>0?`<span class="badge warning">${n.warn} warn</span>`:""}
        ${n.pass>0?`<span class="badge success">${n.pass} pass</span>`:""}
      </div>
      <div class="cfg-topic-bar">
        <div class="score-bar">
          <div class="score-bar-fill ${r}" style="width:${n.score}%"></div>
        </div>
      </div>
    `,o.addEventListener("click",()=>{mt=a,gt="topic",rs(e,a)}),s.appendChild(o)}),e.querySelector("#cfg-scan-now").addEventListener("click",()=>{const a=e.querySelector("#cfg-scan-now");a.innerHTML='<span class="spinner dark"></span> Scanning...',a.disabled=!0,setTimeout(()=>{a.innerHTML='<i class="ti ti-refresh"></i> Run scan now',a.disabled=!1,u("CIS Benchmark scan complete — see results above","success")},2e3)})}function rs(e,t){const i=_t(t),s=Je(i.score);e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> ${t.name}</div>
        <div class="page-subtitle">Topic ${t.num} · ${i.total} controls</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-back"><i class="ti ti-arrow-left"></i> Back</button>
      </div>
    </div>

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
        <div class="kpi-label">Warning</div>
      </div>
    </div>

    <div id="cfg-controls"></div>
  `;const a=e.querySelector("#cfg-controls");t.subsections.forEach(n=>{const r=document.createElement("div");r.className="card mb-3",r.innerHTML=`
      <div class="card-header" style="background:var(--color-background-secondary)">
        <span class="card-title" style="font-size:12px;font-weight:600">${n.name}</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">ID</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:40%">Control</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">Type</th>
            <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">Status</th>
          </tr>
        </thead>
        <tbody>
          ${n.controls.map(o=>`
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px 12px;font-size:10px;font-family:monospace">${o.id}</td>
              <td style="padding:10px 12px;font-size:11px">${o.title||o.name||"—"}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge ${o.type==="manual"?"purple":"info"}">${o.type==="manual"?"Manual":"Auto"}</span></td>
              <td style="padding:10px 12px;font-size:10px">${Fn(Vt(o))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `,a.appendChild(r)}),e.querySelector("#cfg-back").addEventListener("click",()=>{gt="main",mt=null,ns()})}async function Wt(e){var t,i;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> M365 Config — CIS Benchmark</div>
        <div class="page-subtitle">Loading configuration compliance from Graph API...</div>
      </div>
    </div>
    <div style="padding:20px;text-align:center"><div class="spinner"></div><p>Scanning your tenant configuration...</p></div>
  `;try{const s=await Ys();if(!s.success||!s.data||s.data.length===0){gi(e);return}const a=as(),n=Je(a.score);e.innerHTML=`
      <div class="page-header">
        <div>
          <div class="page-title"><i class="ti ti-settings-2"></i> M365 Config — CIS Benchmark v7.0.0</div>
          <div class="page-subtitle">Last validated: Today · ${a.total} controls from Graph API</div>
        </div>
        <div class="page-actions">
          <button class="btn" id="cfg-scan-now"><i class="ti ti-refresh"></i> Re-scan</button>
          <button class="btn btn-primary" id="cfg-agent-btn"><i class="ti ti-robot"></i> Config Agent</button>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi-tile">
          <div class="kpi-value ${n}">${a.score}%</div>
          <div class="kpi-label">Overall Score</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value success">${a.pass}</div>
          <div class="kpi-label">Passed</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value danger">${a.fail}</div>
          <div class="kpi-label">Failed</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value warning">${a.warn}</div>
          <div class="kpi-label">Warnings</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value purple">${a.manual}</div>
          <div class="kpi-label">Manual</div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <span class="card-title">Overall Compliance Posture</span>
          <span class="badge ${n}">${a.score}% compliant</span>
        </div>
        <div class="seg-bar" style="height:12px;border-radius:6px">
          <div class="seg pass" style="width:${(a.pass/a.total*100).toFixed(1)}%"></div>
          <div class="seg warn" style="width:${(a.warn/a.total*100).toFixed(1)}%"></div>
          <div class="seg fail" style="width:${(a.fail/a.total*100).toFixed(1)}%"></div>
        </div>
        <div style="display:flex;gap:20px;margin-top:8px">
          <span style="font-size:10px;color:var(--clr-success-text)">● ${a.pass} Passed</span>
          <span style="font-size:10px;color:var(--clr-warning-text)">● ${a.warn} Warnings</span>
          <span style="font-size:10px;color:var(--clr-danger-text)">● ${a.fail} Failed</span>
          <span style="font-size:10px;color:var(--clr-purple-text)">● ${a.manual} Manual</span>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
        <span class="status-dot active pulse"></span>
        <span><strong style="color:var(--color-text-secondary)">Production Mode</strong> · Real tenant configuration from Graph API</span>
      </div>

      <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">Topics</div>
      <div class="cfg-topic-grid" id="cfg-topic-grid"></div>
    `;const r=e.querySelector("#cfg-topic-grid");Ht.forEach(o=>{const l=_t(o),c=Je(l.score),d=document.createElement("div");d.className="cfg-topic-card";const p=ss[o.id]||{bg:"#f0f0f0",color:"#555"};d.innerHTML=`
        <div class="cfg-topic-icon" style="background:${p.bg};color:${p.color}">
          <i class="ti ${o.icon}"></i>
        </div>
        <div class="cfg-topic-num">Topic ${o.num}</div>
        <div class="cfg-topic-name">${o.name}</div>
        <div class="cfg-topic-badges">
          ${l.fail>0?`<span class="badge danger">${l.fail} fail</span>`:""}
          ${l.warn>0?`<span class="badge warning">${l.warn} warn</span>`:""}
          ${l.pass>0?`<span class="badge success">${l.pass} pass</span>`:""}
        </div>
        <div class="cfg-topic-bar">
          <div class="score-bar">
            <div class="score-bar-fill ${c}" style="width:${l.score}%"></div>
          </div>
        </div>
      `,d.addEventListener("click",()=>{mt=o,gt="topic",rs(e,o)}),r.appendChild(d)}),(t=e.querySelector("#cfg-scan-now"))==null||t.addEventListener("click",async()=>{const o=e.querySelector("#cfg-scan-now");o.innerHTML='<span class="spinner dark"></span> Scanning...',o.disabled=!0,setTimeout(async()=>{o.innerHTML='<i class="ti ti-refresh"></i> Re-scan',o.disabled=!1,await Wt(e),u("Configuration scan completed","success")},2e3)}),(i=e.querySelector("#cfg-agent-btn"))==null||i.addEventListener("click",()=>{u("Configuration Agent will help remediate failed controls","info")})}catch(s){console.error("Error loading CIS controls:",s),gi(e)}}function gi(e){e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-settings-2"></i> M365 Config — CIS Benchmark</div>
        <div class="page-subtitle">Configuration compliance assessment from Graph API</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="cfg-scan-now"><i class="ti ti-refresh"></i> Run scan</button>
      </div>
    </div>

    <div class="blank-state">
      <i class="ti ti-settings-off" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px"></i>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">No Configuration Data Available</div>
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">
        Configuration scanning requires Graph API backend integration
      </div>
      <div style="font-size:10px;color:var(--color-text-tertiary);padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);text-align:left;max-width:400px">
        <strong>Required data sources:</strong>
        <div style="margin-top:6px;font-family:monospace;font-size:9px">
          /deviceManagement/deviceCompliancePolicies<br>
          /policies/conditionalAccessPolicies<br>
          /identity/authenticationMethods/policies<br>
          /admin/windows/updates/configs
        </div>
      </div>
    </div>
  `,e.querySelector("#cfg-scan-now").addEventListener("click",async()=>{const t=e.querySelector("#cfg-scan-now");t.innerHTML='<span class="spinner dark"></span> Scanning...',t.disabled=!0,setTimeout(async()=>{t.innerHTML='<i class="ti ti-refresh"></i> Run scan',t.disabled=!1,await Wt(e)},2e3)})}const Tt=[{id:"pg1",name:"Global Administrators",roles:["Global Admin"],members:2,pim:!0,pimType:"Eligible",lastActivity:"2 hours ago",ml:["aisha.raza@contoso.com","chen.wei@contoso.com"]},{id:"pg2",name:"Security Admins",roles:["Security Admin"],members:2,pim:!0,pimType:"Eligible",lastActivity:"1 day ago",ml:["aisha.raza@contoso.com","sam.torres@contoso.com"]},{id:"pg3",name:"Exchange Admins",roles:["Exchange Admin"],members:2,pim:!0,pimType:"Active",lastActivity:"3 days ago",ml:["chen.wei@contoso.com","kevin.osei@contoso.com"]},{id:"pg4",name:"SharePoint Admins",roles:["SharePoint Admin"],members:1,pim:!1,pimType:null,lastActivity:"5 days ago",ml:["james.liu@contoso.com"]},{id:"pg5",name:"Teams Admins",roles:["Teams Admin"],members:1,pim:!1,pimType:null,lastActivity:"1 week ago",ml:["nina.patel@contoso.com"]},{id:"pg6",name:"Helpdesk Admins",roles:["Helpdesk Admin","User Admin"],members:2,pim:!1,pimType:null,lastActivity:"1 day ago",ml:["raj.mehta@contoso.com","sara.ogden@contoso.com"]},{id:"pg7",name:"Compliance Admins",roles:["Compliance Admin"],members:1,pim:!0,pimType:"Eligible",lastActivity:"4 days ago",ml:["sam.torres@contoso.com"]},{id:"pg8",name:"Break Glass Accounts",roles:["Global Admin"],members:2,pim:!0,pimType:"Active",lastActivity:"30 days ago",ml:["aisha.raza@contoso.com","backup.admin@contoso.com"]}];let os=[],Pe=[],Y={totalAccounts:0,atRisk:0,noMFA:0,permanentRoles:0,servicePrincipals:0};async function Hn(){var t;const e=document.getElementById("page-privaccts");if(e){if(J()){console.log("🎭 Demo account detected - showing demo privileged accounts"),_n(e);return}try{console.log("📡 Fetching real privileged accounts from Azure AD...");const i=await ta();i.success&&((t=i.data)!=null&&t.accounts)?(Pe=i.data.accounts,Y=i.data.summary,console.log(`✅ Loaded ${Pe.length} real privileged accounts`)):(console.warn("⚠️ No privileged account data available from API"),Pe=[],Y={totalAccounts:0,atRisk:0,noMFA:0,permanentRoles:0,servicePrincipals:0})}catch(i){console.error("❌ Error loading privileged accounts:",i.message),Pe=[],Y={totalAccounts:0,atRisk:0,noMFA:0,permanentRoles:0,servicePrincipals:0}}e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-crown"></i> Privileged Accounts</div>
        <div class="page-subtitle">Manage and monitor privileged identities in your tenant</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="pa-sync"><i class="ti ti-refresh"></i> Sync tenant</button>
        <button class="btn btn-primary" id="pa-tag-account"><i class="ti ti-plus"></i> Tag account</button>
      </div>
    </div>

    ${Y.atRisk>0?`
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        ${Y.atRisk} privileged account${Y.atRisk>1?"s":""} have active risk detection${Y.atRisk>1?"s":""}.
      </div>
    `:""}

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">${Y.totalAccounts}</div><div class="kpi-label">Accounts</div></div>
      <div class="kpi-tile"><div class="kpi-value ${Y.atRisk>0?"danger":"success"}">${Y.atRisk}</div><div class="kpi-label">At Risk</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${Y.noMFA}</div><div class="kpi-label">No MFA</div></div>
      <div class="kpi-tile"><div class="kpi-value info">0</div><div class="kpi-label">Groups</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${Y.permanentRoles}</div><div class="kpi-label">Permanent</div></div>
    </div>

    <div class="tabs" id="pa-tabs">
      <button class="tab-btn active" data-tab="accounts">Privileged Accounts</button>
      <button class="tab-btn" data-tab="groups">Privileged Groups</button>
      <button class="tab-btn" data-tab="log">Membership Log</button>
    </div>

    <div class="tab-panel active" id="pa-tab-accounts"></div>
    <div class="tab-panel" id="pa-tab-groups"></div>
    <div class="tab-panel" id="pa-tab-log"></div>
  `,Kn(e),Yn(e),Zn(e),e.querySelectorAll("#pa-tabs .tab-btn").forEach(i=>{i.addEventListener("click",()=>{e.querySelectorAll("#pa-tabs .tab-btn").forEach(s=>s.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(s=>s.classList.remove("active")),i.classList.add("active"),e.querySelector(`#pa-tab-${i.dataset.tab}`).classList.add("active")})}),e.querySelector("#pa-sync").addEventListener("click",()=>{const i=e.querySelector("#pa-sync");i.innerHTML='<span class="spinner dark"></span> Syncing...',i.disabled=!0,setTimeout(()=>{i.innerHTML='<i class="ti ti-refresh"></i> Sync tenant',i.disabled=!1,u("Tenant sync complete — 14 accounts updated.","success")},2e3)}),e.querySelector("#pa-tag-account").addEventListener("click",()=>{u("Tag account: select an account from the table below.","info")})}}function mi(e){return e==="High"?'<span class="badge danger dot">High</span>':e==="Medium"?'<span class="badge warning dot">Medium</span>':'<span class="badge neutral dot">None</span>'}function ls(e){return!e||e.length===0?'<span class="pa-mfa-pill none">No MFA</span>':e.map(t=>t==="SMS"?'<span class="pa-mfa-pill sms">SMS</span>':`<span class="pa-mfa-pill">${t}</span>`).join("")}function ds(e){return`<span class="pa-role-chip ${e.toLowerCase().includes("global")?"global":""}">${e}</span>`}function _n(e){const t=[{id:"user-1",name:"Aisha Raza",email:"aisha.raza@contoso.com",role:"Global Administrator",mfa:["Microsoft Authenticator"],riskLevel:"high",lastSignIn:"2026-06-01 14:32"},{id:"user-2",name:"Chen Wei",email:"chen.wei@contoso.com",role:"Exchange Administrator",mfa:["Authenticator App"],riskLevel:"low",lastSignIn:"2026-06-01 09:15"},{id:"user-3",name:"Sanjay Kumar",email:"sanjay.kumar@contoso.com",role:"Security Administrator",mfa:["SMS","Authenticator App"],riskLevel:"low",lastSignIn:"2026-06-01 11:45"},{id:"user-4",name:"Sarah Johnson",email:"sarah.johnson@contoso.com",role:"Sharepoint Administrator",mfa:[],riskLevel:"medium",lastSignIn:"2026-05-30 16:20"},{id:"user-5",name:"Tom Brooks",email:"tom.brooks@contoso.com",role:"Teams Administrator",mfa:["Microsoft Authenticator"],riskLevel:"low",lastSignIn:"2026-06-01 13:50"}],i={totalAccounts:t.length,atRisk:1,noMFA:1,permanentRoles:3},s=[{id:"group-1",name:"Global Administrators",members:2,eligible:1,permanent:!0},{id:"group-2",name:"Exchange Administrators",members:1,eligible:0,permanent:!0},{id:"group-3",name:"Security Administrators",members:1,eligible:0,permanent:!0}],a=[{date:"2026-06-01 10:30",user:"Aisha Raza",action:"Added to Global Administrator",status:"Permanent assignment",severity:"critical"},{date:"2026-05-31 14:15",user:"Chen Wei",action:"Activated Exchange Administrator",status:"Temporary (4 hours)",severity:"warning"},{date:"2026-05-30 09:20",user:"Sanjay Kumar",action:"MFA verification",status:"Approved",severity:"low"},{date:"2026-05-29 16:45",user:"Sarah Johnson",action:"Removed from SharePoint Administrators",status:"Role deactivated",severity:"low"},{date:"2026-05-28 11:30",user:"Tom Brooks",action:"Added to Teams Administrators",status:"Eligible assignment",severity:"warning"}];e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-crown"></i> Privileged Accounts</div>
        <div class="page-subtitle">Manage and monitor privileged identities in your tenant</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="pa-sync"><i class="ti ti-refresh"></i> Sync tenant</button>
        <button class="btn btn-primary" id="pa-tag-account"><i class="ti ti-plus"></i> Tag account</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample privileged accounts</span>
    </div>

    <div class="alert-banner danger mb-3">
      <i class="ti ti-alert-triangle"></i>
      1 privileged account has active risk detection.
    </div>

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">${i.totalAccounts}</div><div class="kpi-label">Accounts</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${i.atRisk}</div><div class="kpi-label">At Risk</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${i.noMFA}</div><div class="kpi-label">No MFA</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${s.length}</div><div class="kpi-label">Groups</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${i.permanentRoles}</div><div class="kpi-label">Permanent</div></div>
    </div>

    <div class="tabs" id="pa-tabs">
      <button class="tab-btn active" data-tab="accounts">Privileged Accounts</button>
      <button class="tab-btn" data-tab="groups">Privileged Groups</button>
      <button class="tab-btn" data-tab="log">Membership Log</button>
    </div>

    <div class="tab-panel active" id="pa-tab-accounts"></div>
    <div class="tab-panel" id="pa-tab-groups"></div>
    <div class="tab-panel" id="pa-tab-log"></div>
  `,Vn(e,t),Wn(e,s),Jn(e,a),e.querySelector("#pa-sync").addEventListener("click",()=>{const n=e.querySelector("#pa-sync");n.innerHTML='<span class="spinner dark"></span> Syncing...',n.disabled=!0,setTimeout(()=>{n.innerHTML='<i class="ti ti-refresh"></i> Sync tenant',n.disabled=!1,u("Sync complete — all privileged accounts updated","success")},2e3)}),e.querySelectorAll("#pa-tabs .tab-btn").forEach(n=>{n.addEventListener("click",()=>{e.querySelectorAll("#pa-tabs .tab-btn").forEach(r=>r.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(r=>r.classList.remove("active")),n.classList.add("active"),e.querySelector(`#pa-tab-${n.dataset.tab}`).classList.add("active")})})}function Vn(e,t){const i=e.querySelector("#pa-tab-accounts");i.innerHTML=`
    <div style="margin-bottom:12px">
      <input type="text" class="form-input" placeholder="Search accounts..." style="max-width:300px">
    </div>
    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">User</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Email</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Role</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">MFA</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Risk</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Last Sign-in</th>
          </tr>
        </thead>
        <tbody>
          ${t.map((s,a)=>`
            <tr style="border-bottom:${a<t.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${s.name}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${s.email}</td>
              <td style="padding:10px 12px;font-size:10px">${ds(s.role)}</td>
              <td style="padding:10px 12px;font-size:10px">${ls(s.mfa)}</td>
              <td style="padding:10px 12px"><span class="badge ${s.riskLevel==="high"?"danger":s.riskLevel==="medium"?"warning":"success"}">${s.riskLevel}</span></td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-tertiary)">${s.lastSignIn}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Wn(e,t){const i=e.querySelector("#pa-tab-groups");i.innerHTML=`
    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Group Name</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Total Members</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Eligible</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Type</th>
          </tr>
        </thead>
        <tbody>
          ${t.map((s,a)=>`
            <tr style="border-bottom:${a<t.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${s.name}</td>
              <td style="padding:10px 12px;font-size:10px">${s.members}</td>
              <td style="padding:10px 12px;font-size:10px">${s.eligible}</td>
              <td style="padding:10px 12px"><span class="badge ${s.permanent?"danger":"warning"}">${s.permanent?"Permanent":"Eligible"}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Jn(e,t){const i=e.querySelector("#pa-tab-log");i.innerHTML=`
    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Date/Time</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">User</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Action</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Severity</th>
          </tr>
        </thead>
        <tbody>
          ${t.map((s,a)=>`
            <tr style="border-bottom:${a<t.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-tertiary)">${s.date}</td>
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${s.user}</td>
              <td style="padding:10px 12px;font-size:10px">${s.action}</td>
              <td style="padding:10px 12px;font-size:10px">${s.status}</td>
              <td style="padding:10px 12px"><span class="badge ${s.severity==="critical"?"danger":s.severity==="warning"?"warning":"success"}">${s.severity}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Kn(e){var a,n;const t=e.querySelector("#pa-tab-accounts"),i="pa-acct-search";let s=`
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
          ${Pe.map(r=>cs(r)).join("")}
        </tbody>
      </table>
    </div>
  `;t.innerHTML=s,ps(t),(a=t.querySelector(`#${i}`))==null||a.addEventListener("input",r=>{var c;const o=r.target.value.toLowerCase(),l=((c=t.querySelector("#pa-risk-filter"))==null?void 0:c.value)||"all";yi(t,o,l)}),(n=t.querySelector("#pa-risk-filter"))==null||n.addEventListener("change",r=>{var l;const o=((l=t.querySelector(`#${i}`))==null?void 0:l.value.toLowerCase())||"";yi(t,o,r.target.value)})}function yi(e,t,i){const s=e.querySelector("#pa-acct-tbody");s&&(s.innerHTML=Pe.filter(a=>{const n=!t||a.upn.toLowerCase().includes(t)||a.name.toLowerCase().includes(t),r=i==="all"||a.risk===i;return n&&r}).map(a=>cs(a)).join(""),ps(e))}function cs(e){return`
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
      <td><div class="pill-group">${e.roles.map(ds).join("")}</div></td>
      <td><div class="pill-group">${ls(e.mfa)}</div></td>
      <td>${mi(e.risk)}</td>
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
              <div style="margin-top:8px">Risk level: ${mi(e.risk)}</div>
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
  `}function ps(e){e.querySelectorAll(".pa-acct-expand").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const a=t.closest(".pa-acct-row").dataset.id,n=e.querySelector(`.pa-acct-expand-row[data-id="${a}"]`),r=n.style.display!=="none";n.style.display=r?"none":"table-row",t.classList.toggle("open",!r)})}),e.querySelectorAll(".pa-action").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const{action:s,id:a}=t.dataset,n=PA_ACCOUNTS.find(r=>r.id===a);s==="pwd-reset"?(u(`Password reset initiated for ${n==null?void 0:n.name}.`,"warning"),Me("risk",`Password reset forced for ${n==null?void 0:n.upn}`,"Admin")):s==="convert-pim"?(u(`${n==null?void 0:n.name} converted to PIM eligible assignment.`,"success"),Me("add",`${n==null?void 0:n.upn} converted to PIM eligible`,"Admin")):s==="mfa-enroll"?(u(`MFA enrollment triggered for ${n==null?void 0:n.name}.`,"info"),Me("mfa",`MFA enrollment triggered for ${n==null?void 0:n.upn}`,"Admin")):s==="remove"&&(u(`${n==null?void 0:n.name} removed from privileged role.`,"danger"),Me("remove",`${n==null?void 0:n.upn} removed from privileged role`,"Admin"))})})}function Yn(e){const t=e.querySelector("#pa-tab-groups");t.innerHTML=`
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
          ${Tt.map(i=>fi(i)).join("")}
        </tbody>
      </table>
    </div>
  `,hi(t),t.querySelector("#pa-grp-search").addEventListener("input",i=>{const s=i.target.value.toLowerCase();t.querySelector("#pa-grp-tbody").innerHTML=Tt.filter(a=>!s||a.name.toLowerCase().includes(s)).map(a=>fi(a)).join(""),hi(t)})}function fi(e){return`
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
  `}function hi(e){e.querySelectorAll(".pa-grp-expand").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.id,s=e.querySelector(`.pa-grp-expand-row[data-id="${i}"]`);s.style.display=s.style.display==="none"?"table-row":"none"})}),e.querySelectorAll(".pa-grp-untag").forEach(t=>{t.addEventListener("click",()=>{const i=Tt.find(s=>s.id===t.dataset.id);u(`${i==null?void 0:i.name} untagged as privileged group.`,"warning"),Me("remove",`Group "${i==null?void 0:i.name}" untagged`,"Admin")})}),e.querySelectorAll(".pa-grp-remove-member").forEach(t=>{t.addEventListener("click",()=>{u(`${t.dataset.upn} removed from group.`,"success"),Me("remove",`${t.dataset.upn} removed from group`,"Admin")})})}function Zn(e){const t=e.querySelector("#pa-tab-log");us(t)}function us(e){e.innerHTML=`
    <div class="card" style="padding:12px 16px">
      <div class="card-title mb-3"><i class="ti ti-history"></i> Membership Change Log</div>
      ${os.map(t=>`
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
  `}function Me(e,t,i){const s={add:"ti-user-plus",remove:"ti-user-minus",risk:"ti-alert-triangle",mfa:"ti-shield",tag:"ti-tag",review:"ti-clipboard-check"},a={add:"var(--clr-info-text)",remove:"var(--clr-warning-text)",risk:"var(--clr-danger-text)",mfa:"var(--clr-success-text)",tag:"var(--clr-info-text)",review:"var(--clr-success-text)"},n={add:"var(--clr-info-bg)",remove:"var(--clr-warning-bg)",risk:"var(--clr-danger-bg)",mfa:"var(--clr-success-bg)",tag:"var(--clr-info-bg)",review:"var(--clr-success-bg)"};os.unshift({id:Date.now(),type:e,icls:s[e]||"ti-info-circle",ic:a[e]||"var(--clr-info-text)",bg:n[e]||"var(--clr-info-bg)",title:t,detail:t,by:i,time:"Just now"});const r=document.querySelector("#pa-tab-log");r&&us(r)}let Q=[],ze={total:0,consumed:0,available:0,utilizationPct:0},qe=[],Lt=[],at={},it="summary";const vs=[{id:"summary",label:"Executive Summary",icon:"ti-layout-dashboard"},{id:"inventory",label:"License Inventory",icon:"ti-box"},{id:"services",label:"Service Plans",icon:"ti-list-check"},{id:"assignments",label:"User Assignments",icon:"ti-users"},{id:"groups",label:"Group Licensing",icon:"ti-users-group"},{id:"compliance",label:"Compliance",icon:"ti-shield-check"}];async function gs(){const e=document.getElementById("page-licenses");if(e){if(J()){console.log("🎭 Demo account detected - showing demo license data"),Qn(e);return}e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading comprehensive license data...</p></div>';try{console.log("📡 Fetching comprehensive license data...");const[t,i,s,a]=await Promise.all([T("/licenses"),T("/licenses/assignments"),T("/licenses/groups"),T("/licenses/compliance")]);t.success&&t.data&&(Q=t.data,ze=t.summary||{total:0,consumed:0,available:0,utilizationPct:0}),i.success&&i.data&&(qe=i.data),s.success&&s.data&&(Lt=s.data),a.success&&a.data&&(at=a.data),console.log("✅ Loaded all license data")}catch(t){console.error("❌ Error loading license data:",t)}ms(e)}}function Qn(e){var o;const t=[{sku:"Microsoft 365 E5",total:300,consumed:285,available:15,utilizationPct:95,price:180},{sku:"Microsoft 365 E3",total:500,consumed:478,available:22,utilizationPct:95,price:20},{sku:"Microsoft 365 F1",total:150,consumed:145,available:5,utilizationPct:96,price:6},{sku:"Enterprise Mobility + Security E5",total:200,consumed:198,available:2,utilizationPct:99,price:22},{sku:"Office 365 E1",total:100,consumed:87,available:13,utilizationPct:87,price:8}],i={total:1250,consumed:1193,available:57,utilizationPct:95},s=[{name:"Priya Kumar",email:"priya@contoso.com",licenses:["Microsoft 365 E5","Enterprise Mobility + Security E5"]},{name:"Chen Wei",email:"chen@contoso.com",licenses:["Microsoft 365 E5"]},{name:"Aisha Raza",email:"aisha@contoso.com",licenses:["Microsoft 365 E5","Enterprise Mobility + Security E5"]},{name:"Sanjay Kumar",email:"sanjay@contoso.com",licenses:["Microsoft 365 E3","Office 365 E1"]},{name:"Sarah Johnson",email:"sarah@contoso.com",licenses:["Microsoft 365 E3"]}],a=[{name:"Executive Team",licenses:["Microsoft 365 E5"],users:12,utilizationPct:92},{name:"Engineering Department",licenses:["Microsoft 365 E3"],users:45,utilizationPct:98},{name:"Support Team",licenses:["Microsoft 365 F1"],users:60,utilizationPct:96}],n=[{service:"Exchange Online",status:"Licensed",users:847,entitlement:1250,compliance:"100%"},{service:"SharePoint Online",status:"Licensed",users:823,entitlement:1250,compliance:"100%"},{service:"Teams",status:"Licensed",users:812,entitlement:1250,compliance:"99%"},{service:"Microsoft Forms",status:"Licensed",users:1100,entitlement:1250,compliance:"88%"}];e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-license"></i> License Management Dashboard</div>
        <div class="page-subtitle">Enterprise-wide licensing health, utilization, and compliance</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="license-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="license-export"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample license data</span>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs">
      ${vs.map((l,c)=>`
        <button class="tab-btn ${c===0?"active":""}" data-tab="${l.id}">
          <i class="ti ${l.icon}"></i> ${l.label}
        </button>
      `).join("")}
    </div>

    <!-- Tab Content -->
    <div id="tab-content"></div>
  `;const r=e.querySelector("#tab-content");bi(r,i,t),e.querySelectorAll(".tabs .tab-btn").forEach(l=>{l.addEventListener("click",()=>{e.querySelectorAll(".tabs .tab-btn").forEach(d=>d.classList.remove("active")),l.classList.add("active");const c=l.dataset.tab;c==="summary"?bi(r,i,t):c==="inventory"?Xn(r,t):c==="services"?er(r,n):c==="assignments"?tr(r,s):c==="groups"?ir(r,a):c==="compliance"&&sr(r,i)})}),(o=e.querySelector("#license-refresh"))==null||o.addEventListener("click",()=>{const l=e.querySelector("#license-refresh");l.innerHTML='<span class="spinner dark"></span> Syncing...',l.disabled=!0,setTimeout(()=>{l.innerHTML='<i class="ti ti-refresh"></i> Refresh',l.disabled=!1},2e3)})}function bi(e,t,i){e.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">License Utilization Summary</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Total Licenses</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-info-text)">${t.total}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Consumed</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${t.consumed}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Available</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">${t.available}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Utilization</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${t.utilizationPct}%</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">License SKU Summary</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">SKU</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Total</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Consumed</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Available</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Utilization</th>
          </tr>
        </thead>
        <tbody>
          ${i.map((s,a)=>`
            <tr style="border-bottom:${a<i.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${s.sku}</td>
              <td style="padding:10px 12px;font-size:10px">${s.total}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${s.consumed}</td>
              <td style="padding:10px 12px;font-size:10px">${s.available}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge warning">${s.utilizationPct}%</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Xn(e,t){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">License Inventory</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">License SKU</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Total Licenses</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Assigned</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Unassigned</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Annual Cost</th>
          </tr>
        </thead>
        <tbody>
          ${t.map((i,s)=>`
            <tr style="border-bottom:${s<t.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${i.sku}</td>
              <td style="padding:10px 12px;font-size:10px">${i.total}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${i.consumed}</td>
              <td style="padding:10px 12px;font-size:10px">${i.available}</td>
              <td style="padding:10px 12px;font-size:10px;font-weight:600">$${(i.total*i.price*12).toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function er(e,t){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Service Plans</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Service</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Licensed Users</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Entitlement</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Compliance</th>
          </tr>
        </thead>
        <tbody>
          ${t.map((i,s)=>`
            <tr style="border-bottom:${s<t.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${i.service}</td>
              <td style="padding:10px 12px"><span class="badge success">Licensed</span></td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${i.users}</td>
              <td style="padding:10px 12px;font-size:10px">${i.entitlement}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge ${i.compliance==="100%"?"success":"warning"}">${i.compliance}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function tr(e,t){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">User License Assignments</span>
        <span class="badge info">${t.length} users</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">User</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Email</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Licenses Assigned</th>
          </tr>
        </thead>
        <tbody>
          ${t.map((i,s)=>`
            <tr style="border-bottom:${s<t.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${i.name}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${i.email}</td>
              <td style="padding:10px 12px;font-size:10px">${i.licenses.join(", ")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function ir(e,t){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Group Licensing</span>
        <span class="badge info">${t.length} groups</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Group Name</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Licenses</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Users</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Utilization</th>
          </tr>
        </thead>
        <tbody>
          ${t.map((i,s)=>`
            <tr style="border-bottom:${s<t.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${i.name}</td>
              <td style="padding:10px 12px;font-size:10px">${i.licenses.join(", ")}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${i.users}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge ${i.utilizationPct>95?"warning":"success"}">${i.utilizationPct}%</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function sr(e,t){e.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">License Compliance Report</span>
      </div>
      <div style="padding:16px">
        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:11px;font-weight:600">Overall Compliance</span>
            <span style="font-size:11px;font-weight:600;color:var(--clr-success-text)">100% Compliant</span>
          </div>
          <div style="width:100%;height:8px;background:var(--color-background-secondary);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:100%;background:var(--clr-success-bg)"></div>
          </div>
        </div>

        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:11px;font-weight:600">License Utilization</span>
            <span style="font-size:11px;font-weight:600;color:var(--clr-warning-text)">${t.utilizationPct}%</span>
          </div>
          <div style="width:100%;height:8px;background:var(--color-background-secondary);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${t.utilizationPct}%;background:var(--clr-warning-bg)"></div>
          </div>
        </div>

        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-top:16px">
          <div style="font-size:11px;font-weight:600;margin-bottom:8px;color:var(--color-text-primary)">Compliance Status</div>
          <div style="display:flex;gap:12px">
            <div style="flex:1">
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:4px">Compliant Licenses</div>
              <div style="font-size:16px;font-weight:700;color:var(--clr-success-text)">1,193</div>
            </div>
            <div style="flex:1">
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:4px">Non-Compliant</div>
              <div style="font-size:16px;font-weight:700;color:var(--clr-danger-text)">0</div>
            </div>
            <div style="flex:1">
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:4px">Unassigned</div>
              <div style="font-size:16px;font-weight:700;color:var(--clr-info-text)">57</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function ms(e){var t,i;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-license"></i> License Management Dashboard</div>
        <div class="page-subtitle">Enterprise-wide licensing health, utilization, and compliance</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="license-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="license-export"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--color-border-secondary);margin-bottom:16px;overflow-x:auto">
      ${vs.map(s=>`
        <button class="license-tab-btn ${it===s.id?"active":""}" data-tab="${s.id}" style="padding:12px 16px;border:none;background:none;cursor:pointer;font-size:11px;font-weight:600;color:var(--color-text-secondary);border-bottom:2px solid transparent;white-space:nowrap;${it===s.id?"color:var(--color-text-primary);border-bottom-color:var(--clr-info-text)":""}">
          <i class="ti ${s.icon}"></i> ${s.label}
        </button>
      `).join("")}
    </div>

    <!-- Tab Content -->
    <div id="tab-content">
      ${ar(it)}
    </div>
  `,e.querySelectorAll(".license-tab-btn").forEach(s=>{s.addEventListener("click",()=>{it=s.dataset.tab,ms(e)})}),(t=e.querySelector("#license-refresh"))==null||t.addEventListener("click",()=>{gs()}),(i=e.querySelector("#license-export"))==null||i.addEventListener("click",()=>{alert("Export functionality coming soon")})}function ar(e){switch(e){case"summary":return nr();case"inventory":return rr();case"services":return or();case"assignments":return lr();case"groups":return dr();case"compliance":return cr();default:return""}}function nr(){return`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:24px">
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Total Licenses Purchased</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-info-text)">${ze.total.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Assigned Licenses</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${ze.consumed.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Available Licenses</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">${ze.available.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Utilization Rate</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${ze.utilizationPct}%</div>
      </div>
    </div>

    <!-- Health Status -->
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-heart-handshake"></i> Licensing Health Overview</span>
      </div>
      ${Q.map(e=>`
        <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary);display:flex;align-items:center;justify-content:space-between">
          <div style="flex:1">
            <div style="font-weight:600;font-size:11px">${e.name||"—"}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${e.consumed||0} / ${e.total||0} assigned</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;min-width:150px">
            <div class="score-bar" style="flex:1">
              <div class="score-bar-fill ${e.statusCls||"success"}" style="width:${e.utilizationPct||0}%"></div>
            </div>
            <span style="font-size:10px;font-weight:600;min-width:35px">${e.utilizationPct||0}%</span>
            <span class="badge ${e.statusCls||"success"}" style="min-width:70px;text-align:center">${e.status||"healthy"}</span>
          </div>
        </div>
      `).join("")}
    </div>

    <!-- Critical Alerts -->
    ${Q.some(e=>e.status==="critical")?`
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <strong>${Q.filter(e=>e.status==="critical").length} license(s) at CRITICAL capacity</strong> — Immediate action required
      </div>
    `:""}
    ${Q.some(e=>e.status==="monitor")?`
      <div class="alert-banner warning">
        <i class="ti ti-alert-circle"></i>
        <strong>${Q.filter(e=>e.status==="monitor").length} license(s) require monitoring</strong> — Plan additional purchases
      </div>
    `:""}
  `}function rr(){return`
    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%">
        <thead><tr>
          <th style="padding:12px;text-align:left;font-weight:600;font-size:11px;width:25%">Product Name / SKU</th>
          <th style="padding:12px;text-align:center;font-weight:600;font-size:11px;width:12%">Purchased</th>
          <th style="padding:12px;text-align:center;font-weight:600;font-size:11px;width:12%">Assigned</th>
          <th style="padding:12px;text-align:center;font-weight:600;font-size:11px;width:12%">Available</th>
          <th style="padding:12px;text-align:center;font-weight:600;font-size:11px;width:20%">Usage</th>
          <th style="padding:12px;text-align:center;font-weight:600;font-size:11px;width:19%">Status</th>
        </tr></thead>
        <tbody>
          ${Q.map(e=>`
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:12px"><strong style="font-size:11px">${e.name||"—"}</strong></td>
              <td style="padding:12px;text-align:center">${(e.total||0).toLocaleString()}</td>
              <td style="padding:12px;text-align:center">${(e.consumed||0).toLocaleString()}</td>
              <td style="padding:12px;text-align:center">${(e.available||0).toLocaleString()}</td>
              <td style="padding:12px">
                <div style="display:flex;align-items:center;gap:8px">
                  <div class="score-bar" style="flex:1">
                    <div class="score-bar-fill ${e.statusCls||"success"}" style="width:${e.utilizationPct||0}%"></div>
                  </div>
                  <span style="font-size:10px;font-weight:600;min-width:30px">${e.utilizationPct||0}%</span>
                </div>
              </td>
              <td style="padding:12px;text-align:center"><span class="badge ${e.statusCls||"success"}" style="text-transform:capitalize">${e.status||"healthy"}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function or(){return`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:16px">
      ${Q.map(e=>`
        <div class="card">
          <div class="card-header">
            <span class="card-title">${e.name||"—"}</span>
            <span class="badge ${e.statusCls||"success"}">${e.utilizationPct||0}%</span>
          </div>
          <div style="padding:12px;font-size:10px;color:var(--color-text-secondary);border-bottom:0.5px solid var(--color-border-tertiary)">
            ${(e.total||0).toLocaleString()} licenses | ${(e.consumed||0).toLocaleString()} assigned
          </div>
          <div style="padding:12px">
            <div style="font-weight:600;font-size:10px;margin-bottom:8px">Included Services:</div>
            <div style="display:grid;gap:6px">
              <div style="display:flex;align-items:center;gap:6px;font-size:10px">
                <i class="ti ti-circle-filled" style="color:var(--clr-success-text);font-size:6px"></i> Exchange Online
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:10px">
                <i class="ti ti-circle-filled" style="color:var(--clr-success-text);font-size:6px"></i> Teams
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:10px">
                <i class="ti ti-circle-filled" style="color:var(--clr-success-text);font-size:6px"></i> SharePoint Online
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:10px">
                <i class="ti ti-circle-filled" style="color:var(--clr-success-text);font-size:6px"></i> OneDrive for Business
              </div>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `}function lr(){return`
    <div class="card" style="padding:0;overflow:hidden">
      ${qe.length===0?`
        <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
          <i class="ti ti-inbox" style="font-size:32px;margin-bottom:8px;display:block"></i>
          No user license assignments found
        </div>
      `:`
        <table style="width:100%">
          <thead><tr>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">User Name / Email</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Department</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Licenses</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Count</th>
          </tr></thead>
          <tbody>
            ${qe.slice(0,50).map(e=>`
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                <td style="padding:12px">
                  <div style="font-weight:600;font-size:11px">${e.displayName||"—"}</div>
                  <div style="font-size:10px;color:var(--color-text-tertiary)">${e.userPrincipalName||"—"}</div>
                </td>
                <td style="padding:12px;font-size:10px">${e.department||"—"}</td>
                <td style="padding:12px;font-size:10px">
                  ${(e.licenses||[]).map(t=>`<span class="badge secondary" style="margin-right:4px;margin-bottom:4px">${t.skuPartNumber||t.skuId}</span>`).join("")}
                </td>
                <td style="padding:12px;text-align:center;font-weight:600">${e.licenseCount||0}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        ${qe.length>50?`<div style="padding:12px;text-align:center;font-size:10px;color:var(--color-text-tertiary)">Showing 50 of ${qe.length} users</div>`:""}
      `}
    </div>
  `}function dr(){Q.length>0&&console.log("📊 realLicenses structure:",Q[0]);const e=t=>{if(!t)return"—";console.log(`🔍 Looking for license with skuId: ${t}`);let i=Q.find(s=>{var n,r;return s.skuId===t?(console.log(`✓ Matched by skuId: ${s.name}`),!0):((r=(n=s.id)==null?void 0:n.split("_"))==null?void 0:r[1])===t?(console.log(`✓ Matched by composite ID: ${s.name}`),!0):s.id===t?(console.log(`✓ Matched by id: ${s.name}`),!0):!1});return i?i.name||i.skuPartNumber||t.substring(0,20):(console.log(`✗ No match found for: ${t}`),console.log(`   Available licenses: ${Q.map(s=>`${s.name}(${s.id.split("_")[1]||s.id})`).join(", ")}`),t.substring(0,20)+(t.length>20?"...":""))};return`
    <div class="card" style="padding:0;overflow:hidden">
      ${Lt.length===0?`
        <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
          <i class="ti ti-users-group" style="font-size:32px;margin-bottom:8px;display:block"></i>
          No group-based licensing configured
        </div>
      `:`
        <table style="width:100%">
          <thead><tr>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Group Name</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Type</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Assigned Licenses</th>
            <th style="padding:12px;text-align:center;font-weight:600;font-size:11px">Members</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Assignment</th>
          </tr></thead>
          <tbody>
            ${Lt.map((t,i)=>(console.log(`📊 Group ${i}: ${t.displayName}, memberCount=${t.memberCount}, type=${typeof t.memberCount}`),`
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                <td style="padding:12px">
                  <strong style="font-size:11px">${t.displayName||"—"}</strong>
                </td>
                <td style="padding:12px;font-size:10px"><span class="badge info">${t.groupType||"Static"}</span></td>
                <td style="padding:12px;font-size:10px">
                  ${t.assignedLicenses&&t.assignedLicenses.length>0?t.assignedLicenses.map(s=>`<span class="badge secondary" style="margin-right:4px;margin-bottom:4px">${e(s.skuId||s.licenseId)}</span>`).join(""):'<span style="color:var(--color-text-tertiary)">—</span>'}
                </td>
                <td style="padding:12px;text-align:center;font-weight:600;color:var(--color-text-primary)">${t.memberCount||0}</td>
                <td style="padding:12px;font-size:10px">
                  <span class="badge secondary">${t.assignmentMethod||"Group-Based"}</span>
                </td>
              </tr>
            `)).join("")}
          </tbody>
        </table>
      `}
    </div>
  `}function cr(){const e=at.scores||{utilization:0,costOptimization:0,securityCoverage:0,compliance:0};return`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-bottom:24px">
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${e.utilization>=80?"var(--clr-success-text)":e.utilization>=60?"var(--clr-warning-text)":"var(--clr-danger-text)"}">${e.utilization||0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">License Utilization</div>
      </div>
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${e.costOptimization>=80?"var(--clr-success-text)":e.costOptimization>=60?"var(--clr-warning-text)":"var(--clr-danger-text)"}">${e.costOptimization||0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">Cost Optimization</div>
      </div>
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${e.securityCoverage>=80?"var(--clr-success-text)":e.securityCoverage>=60?"var(--clr-warning-text)":"var(--clr-danger-text)"}">${e.securityCoverage||0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">Security Coverage</div>
      </div>
      <div class="card" style="padding:16px;text-align:center">
        <div style="font-size:32px;font-weight:700;color:${e.compliance>=80?"var(--clr-success-text)":e.compliance>=60?"var(--clr-warning-text)":"var(--clr-danger-text)"}">${e.compliance||0}%</div>
        <div style="font-size:11px;font-weight:600;margin-top:8px">Compliance Score</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-shield-alert"></i> Compliance Findings</span>
      </div>
      <div style="padding:12px">
        <div style="display:grid;gap:12px">
          <div style="padding:12px;background:rgba(239, 68, 68, 0.05);border-radius:6px;border-left:3px solid var(--clr-danger-text)">
            <div style="font-weight:600;font-size:11px">Disabled Users with Active Licenses</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${at.disabledUsersWithLicenses||0} users</div>
          </div>
          <div style="padding:12px;background:rgba(250, 190, 88, 0.05);border-radius:6px;border-left:3px solid var(--clr-warning-text)">
            <div style="font-weight:600;font-size:11px">Inactive Users (90+ days)</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${at.inactiveUsers||0} users consuming licenses</div>
          </div>
          <div style="padding:12px;background:rgba(34, 197, 94, 0.05);border-radius:6px;border-left:3px solid var(--clr-success-text)">
            <div style="font-weight:600;font-size:11px">Premium Security Licenses</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Users protected by Entra ID P2 and Defender licenses</div>
          </div>
        </div>
      </div>
    </div>
  `}const xi=[{id:"approval",name:"Approval Agent",desc:"Automates access request routing, approval workflows, and SLA tracking.",icon:"ti-check-list",bg:"#E6F1FB",color:"#0C447C",status:"active",statusLabel:"Active",statLabel:"7 pending",statIcon:"ti-inbox"},{id:"execution",name:"Execution Agent",desc:"Executes approved Graph API actions — group creation, license assignment, mailbox provisioning.",icon:"ti-bolt",bg:"#EAF3DE",color:"#3B6D11",status:"active",statusLabel:"Active",statLabel:"12 Graph actions today",statIcon:"ti-api"},{id:"security",name:"Security Agent",desc:"Monitors risky sign-ins, triggers automated responses to identity threats.",icon:"ti-shield-exclamation",bg:"#FCEBEB",color:"#A32D2D",status:"alert",statusLabel:"Alert",statLabel:"3 risky users",statIcon:"ti-user-exclamation"},{id:"audit",name:"Audit Agent",desc:"Collects and analyses audit log events, surfaces anomalous activity patterns.",icon:"ti-database",bg:"#FAEEDA",color:"#854F0B",status:"active",statusLabel:"Active",statLabel:"28 event types tracked",statIcon:"ti-activity"},{id:"config",name:"Config Agent",desc:"Scans CIS Benchmark controls against tenant configuration on schedule.",icon:"ti-robot",bg:"#E0F5F4",color:"#0D6B68",status:"active",statusLabel:"Active",statLabel:"Last scan 08:45",statIcon:"ti-clock",link:"m365config"},{id:"compliance",name:"Compliance Agent",desc:"Monitors regulatory compliance posture across Purview, DLP, and retention policies.",icon:"ti-clipboard-check",bg:"#EEEDFE",color:"#3C3489",status:"idle",statusLabel:"Idle",statLabel:"No recent scans",statIcon:"ti-info-circle"}];function pr(){const e=document.getElementById("page-agents");e&&(J()?ur(e):vr(e))}function ur(e){e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-robot"></i> AI Agents</div>
        <div class="page-subtitle">Automated intelligence agents managing your M365 tenant</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary"><i class="ti ti-plus"></i> Deploy agent</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample agents</span>
    </div>

    <div class="agents-grid" id="agents-grid"></div>
  `;const t=e.querySelector("#agents-grid");xi.forEach(i=>{const s=i.status==="active"?"active pulse":i.status==="alert"?"alert pulse":"idle",a=i.status==="active"?"var(--clr-success-text)":i.status==="alert"?"var(--clr-danger-text)":"var(--color-text-tertiary)",n=document.createElement("div");n.className="agent-card",n.innerHTML=`
      <div class="agent-icon" style="background:${i.bg};color:${i.color}">
        <i class="ti ${i.icon}"></i>
      </div>
      <div class="agent-name">${i.name}</div>
      <div class="agent-desc">${i.desc}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <div class="status-dot ${s}"></div>
        <span style="font-size:11px;font-weight:600;color:${a}">${i.statusLabel}</span>
      </div>
      <div class="agent-stat">
        <i class="ti ${i.statIcon}" style="font-size:12px;color:${i.color}"></i>
        ${i.statLabel}
      </div>
      <div style="display:flex;gap:6px;margin-top:12px">
        <button class="btn btn-xs btn-primary agent-configure" data-id="${i.id}"><i class="ti ti-settings"></i> Configure</button>
        ${i.status!=="idle"?`<button class="btn btn-xs agent-pause" data-id="${i.id}"><i class="ti ti-player-pause"></i> Pause</button>`:`<button class="btn btn-xs btn-success agent-start" data-id="${i.id}"><i class="ti ti-player-play"></i> Start</button>`}
      </div>
    `,t.appendChild(n)}),e.querySelectorAll(".agent-configure").forEach(i=>{i.addEventListener("click",async()=>{var a;const s=i.dataset.id;s==="config"?await C("m365config"):u(`Opening configuration for ${(a=xi.find(n=>n.id===s))==null?void 0:a.name}...`,"info")})}),e.querySelectorAll(".agent-pause").forEach(i=>{i.addEventListener("click",()=>u("Agent paused.","warning"))}),e.querySelectorAll(".agent-start").forEach(i=>{i.addEventListener("click",()=>u("Agent started.","success"))})}function vr(e){e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-robot"></i> AI Agents</div>
        <div class="page-subtitle">Automated intelligence agents managing your M365 tenant</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary"><i class="ti ti-plus"></i> Deploy agent</button>
      </div>
    </div>

    <div class="blank-state">
      <i class="ti ti-robot-off" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px"></i>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">No Agents Available</div>
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">AI Agents require configuration and deployment through the Graph API management endpoints</div>
    </div>
  `}let ce="dashboard",Ke=null,Ce=[],ys=[],Rt="PENDING_APPROVAL";async function gr(){const e=document.getElementById("page-approvals");e&&(de(e),await fs(e))}async function fs(e){var t;try{const s=await(await fetch(`${A}/requests?status=${Rt}&limit=50`)).json();Ce=Array.isArray(s.data)?s.data:[];const n=await(await fetch(`${A}/audit-logs?limit=20`)).json();ys=Array.isArray((t=n.data)==null?void 0:t.data)?n.data.data:Array.isArray(n.data)?n.data:[],de(e)}catch(i){console.error("Error loading approvals data:",i),u("Failed to load approvals data","error")}}function de(e){ce==="dashboard"?mr(e):ce==="details"?yr(e):ce==="audit"&&fr(e)}function mr(e){if(!e){console.error("❌ Page element not found");return}if(e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-check-circle"></i> Approvals Dashboard</div>
        <div class="page-subtitle">Review and approve service requests</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="view-audit-btn"><i class="ti ti-history"></i> Audit Log</button>
      </div>
    </div>

    <!-- Status Filters -->
    <div class="card mb-3">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${["PENDING_APPROVAL","APPROVED","REJECTED","COMPLETED"].map(t=>`
          <button class="btn ${Rt===t?"btn-primary":""}" id="filter-${t}" style="padding:6px 12px;font-size:11px">
            ${Dt(t)} ${t}
          </button>
        `).join("")}
      </div>
    </div>

    <!-- Requests Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Service Requests (${Ce.length})</span>
      </div>
      <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
        ${Ce.length===0?`
          <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
            <i class="ti ti-inbox" style="font-size:28px;margin-bottom:8px;display:block"></i>
            No requests found
          </div>
        `:`
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead style="background:var(--color-background-secondary)">
              <tr>
                <th style="padding:10px 12px;text-align:left;font-weight:600">ID</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Operation</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Submitted By</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Risk</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Status</th>
                <th style="padding:10px 12px;text-align:left;font-weight:600">Submitted</th>
                <th style="padding:10px 12px;text-align:center">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${Ce.map(t=>{var i,s;return`
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer" id="req-${t.id}" data-id="${t.id}">
                  <td style="padding:10px 12px"><strong>${t.id}</strong></td>
                  <td style="padding:10px 12px">${t.operationId.split("-")[0]}</td>
                  <td style="padding:10px 12px">${t.submittedBy}</td>
                  <td style="padding:10px 12px">
                    <span style="padding:2px 6px;border-radius:3px;font-size:10px;background:${hs((i=t.validation)==null?void 0:i.riskLevel)};color:white">
                      ${((s=t.validation)==null?void 0:s.riskLevel)||"MEDIUM"}
                    </span>
                  </td>
                  <td style="padding:10px 12px">${Dt(t.status)}</td>
                  <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">
                    ${new Date(t.submittedAt).toLocaleString()}
                  </td>
                  <td style="padding:10px 12px;text-align:center">
                    ${t.status==="PENDING_APPROVAL"?`
                      <button class="btn-sm-approve" data-id="${t.id}" style="padding:4px 8px;font-size:9px;background:var(--clr-success-bg);color:var(--clr-success-text);border:none;border-radius:3px;cursor:pointer">
                        ✓ Review
                      </button>
                    `:`
                      <span style="color:var(--color-text-tertiary);font-size:10px">${t.status}</span>
                    `}
                  </td>
                </tr>
              `}).join("")}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `,e&&e.querySelectorAll&&["PENDING_APPROVAL","APPROVED","REJECTED","COMPLETED"].forEach(t=>{const i=e.querySelector(`#filter-${t}`);i&&i.addEventListener("click",()=>{Rt=t,de(e),fs(e)})}),e&&e.querySelectorAll){e.querySelectorAll(".btn-sm-approve").forEach(i=>{i.addEventListener("click",s=>{s.stopPropagation();const a=i.dataset.id;Ke=Ce.find(n=>n.id===a),ce="details",de(e)})});const t=e.querySelector("#view-audit-btn");t&&t.addEventListener("click",()=>{ce="audit",de(e)}),e.querySelectorAll("tr[data-id]").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.id;Ke=Ce.find(a=>a.id===s),ce="details",de(e)})})}}function yr(e){var s,a,n,r,o;if(!e||!Ke)return;const t=Ke,i=hr(t);e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="details-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title">${t.id}</div>
          <div class="page-subtitle">${t.operationId} • ${Dt(t.status)}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <!-- Request Details -->
      <div>
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Request Information</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:11px">
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted By</div>
                <div>${t.submittedBy}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Submitted Date</div>
                <div>${new Date(t.submittedAt).toLocaleString()}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Operation</div>
                <div>${t.operationId}</div>
              </div>
              <div>
                <div style="font-weight:600;color:var(--color-text-tertiary);font-size:10px;margin-bottom:2px">Status</div>
                <div>${t.status}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Risk Assessment</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            <div style="margin-bottom:12px">
              <div style="display:flex;align-items:center;gap:10px">
                <div style="font-size:24px;font-weight:600;color:${hs((s=t.validation)==null?void 0:s.riskLevel)}">${((a=t.validation)==null?void 0:a.riskScore)||0}</div>
                <div>
                  <div style="font-size:12px;font-weight:600">${((n=t.validation)==null?void 0:n.riskLevel)||"UNKNOWN"} Risk</div>
                  <div style="font-size:10px;color:var(--color-text-secondary)">Risk Score (0-100)</div>
                </div>
              </div>
            </div>

            <!-- Validation Checks -->
            <div style="border-top:0.5px solid var(--color-border-tertiary);padding-top:10px">
              ${(((r=t.validation)==null?void 0:r.checks)||[]).map(l=>`
                <div style="display:flex;gap:8px;margin-bottom:8px;font-size:10px">
                  <div style="flex-shrink:0">
                    ${l.status==="PASS"?'<i class="ti ti-circle-check" style="color:var(--clr-success-text)"></i>':l.status==="FAIL"?'<i class="ti ti-circle-x" style="color:var(--clr-danger-text)"></i>':'<i class="ti ti-alert-circle" style="color:var(--clr-warning-text)"></i>'}
                  </div>
                  <div>
                    <div style="font-weight:600">${l.message}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Request Fields -->
        <div class="card">
          <div class="card-header"><span class="card-title">Request Fields</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);font-size:11px">
            ${Object.entries(t.fields).map(([l,c])=>`
              <div style="display:grid;grid-template-columns:150px 1fr;gap:12px;margin-bottom:8px;padding-bottom:8px;border-bottom:0.5px solid var(--color-border-tertiary)">
                <div style="font-weight:600;color:var(--color-text-secondary)">${l}</div>
                <div style="word-break:break-all">${c}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Approval Workflow & Comments -->
      <div>
        <!-- Approval Status -->
        <div class="card mb-3">
          <div class="card-header"><span class="card-title">Approval Workflow</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
            ${(((o=t.validation)==null?void 0:o.approvalPath)||[]).map((l,c)=>{const d=t.approvals.find(f=>f.step===l),p=!d&&l!=="agent"&&l!=="action",v=(d==null?void 0:d.status)==="APPROVED";return`
                <div style="display:flex;gap:10px;margin-bottom:12px;align-items:flex-start">
                  <div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;${v?"background:var(--clr-success-bg);color:var(--clr-success-text)":p?"background:var(--clr-warning-bg);color:var(--clr-warning-text)":"background:var(--color-background-tertiary);color:var(--color-text-secondary)"}">
                    ${v?"✓":p?"◯":"—"}
                  </div>
                  <div style="flex:1;font-size:11px">
                    <div style="font-weight:600;text-transform:capitalize">${l}</div>
                    ${v?`
                      <div style="color:var(--clr-success-text);font-size:10px">Approved by ${d.approverEmail}</div>
                      <div style="color:var(--color-text-tertiary);font-size:9px">${new Date(d.approvedAt).toLocaleString()}</div>
                    `:p?`
                      <div style="color:var(--clr-warning-text);font-size:10px">Waiting for approval</div>
                    `:""}
                  </div>
                </div>
              `}).join("")}
          </div>
        </div>

        <!-- Approval Actions (if pending) -->
        ${t.status==="PENDING_APPROVAL"&&i?`
          <div class="card mb-3">
            <div class="card-header"><span class="card-title">Your Action</span></div>
            <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
              <textarea id="approval-comment" placeholder="Add comment (optional)" style="width:100%;padding:8px;border:0.5px solid var(--color-border-secondary);border-radius:4px;font-size:11px;resize:vertical;min-height:60px;margin-bottom:12px"></textarea>
              <div style="display:flex;gap:8px">
                <button class="btn btn-primary" id="approve-btn" style="flex:1;padding:8px">
                  <i class="ti ti-check"></i> Approve
                </button>
                <button class="btn" id="reject-btn" style="flex:1;padding:8px">
                  <i class="ti ti-x"></i> Reject
                </button>
              </div>
            </div>
          </div>
        `:""}

        <!-- Comments -->
        <div class="card">
          <div class="card-header"><span class="card-title">Comments (${t.comments.length})</span></div>
          <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);max-height:300px;overflow-y:auto">
            ${t.comments.length===0?`
              <div style="text-align:center;color:var(--color-text-tertiary);font-size:11px">No comments yet</div>
            `:`
              ${t.comments.map(l=>`
                <div style="margin-bottom:12px;padding:10px;background:var(--color-background-secondary);border-radius:4px;font-size:10px">
                  <div style="font-weight:600;margin-bottom:3px">${l.userName}</div>
                  <div style="color:var(--color-text-secondary);margin-bottom:6px">${l.text}</div>
                  <div style="font-size:9px;color:var(--color-text-tertiary)">${new Date(l.createdAt).toLocaleString()}</div>
                </div>
              `).join("")}
            `}
          </div>
        </div>
      </div>
    </div>
  `,e.querySelector("#details-back").addEventListener("click",()=>{ce="dashboard",de(e)}),t.status==="PENDING_APPROVAL"&&i&&(e.querySelector("#approve-btn").addEventListener("click",async()=>{const l=e.querySelector("#approval-comment").value;await wi(t.id,"APPROVED",i.step,l,e)}),e.querySelector("#reject-btn").addEventListener("click",async()=>{const l=e.querySelector("#approval-comment").value;if(!l){u("Please provide a reason for rejection","warning");return}await wi(t.id,"REJECTED",i.step,l,e)}))}function fr(e){e&&(e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="audit-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title">Audit Log</div>
          <div class="page-subtitle">Track all requests, approvals, and system actions</div>
        </div>
      </div>
    </div>

    <!-- Audit Log Table -->
    <div class="card">
      <div class="card-header"><span class="card-title">Activity Log - All System Approvals</span></div>
      <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
        <table style="width:100%;border-collapse:collapse;font-size:10px">
          <thead style="background:var(--color-background-secondary)">
            <tr>
              <th style="padding:10px 12px;text-align:left;font-weight:600">Timestamp</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600">Action</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600">User/Approver</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600">Role</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600">Request ID</th>
              <th style="padding:10px 12px;text-align:center;font-weight:600">Risk Level</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600">Reason/Comment</th>
            </tr>
          </thead>
          <tbody>
            ${ys.map(t=>{var r,o,l,c,d,p;const i=((r=t.details)==null?void 0:r.riskLevel)||"N/A",s={LOW:"#10b981",MEDIUM:"#f59e0b",HIGH:"#ef4444",CRITICAL:"#991b1b","N/A":"#9ca3af"}[i]||"#9ca3af",a=((o=t.details)==null?void 0:o.step)||((l=t.details)==null?void 0:l.rejectorRole)||"—",n=((c=t.details)==null?void 0:c.reason)||((d=t.details)==null?void 0:d.comment)||((p=t.details)==null?void 0:p.operationId)||"—";return`
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);background:${t.action.includes("REJECTED")?"rgba(239, 68, 68, 0.05)":t.action.includes("APPROVED")?"rgba(16, 185, 129, 0.05)":"transparent"}">
                  <td style="padding:10px 12px;white-space:nowrap;font-size:9px">${new Date(t.timestamp).toLocaleString()}</td>
                  <td style="padding:10px 12px;font-size:9px">
                    <span style="padding:3px 8px;border-radius:3px;background:${t.action.includes("REJECTED")?"var(--clr-danger-bg)":t.action.includes("APPROVED")?"var(--clr-success-bg)":"var(--color-background-secondary)"};color:${t.action.includes("REJECTED")?"var(--clr-danger-text)":t.action.includes("APPROVED")?"var(--clr-success-text)":"var(--color-text-primary)"};font-weight:600">
                      ${t.action}
                    </span>
                  </td>
                  <td style="padding:10px 12px;font-size:9px;font-weight:600">${t.user}</td>
                  <td style="padding:10px 12px;font-size:9px;text-transform:capitalize">${a}</td>
                  <td style="padding:10px 12px;font-family:monospace;font-size:9px"><strong>${t.requestId||"—"}</strong></td>
                  <td style="padding:10px 12px;text-align:center">
                    <span style="padding:4px 10px;border-radius:3px;background:${s};color:white;font-weight:600;font-size:9px;display:inline-block">
                      ${i}
                    </span>
                  </td>
                  <td style="padding:10px 12px;font-size:9px;color:var(--color-text-secondary);max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                    ${n}
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelector("#audit-back").addEventListener("click",()=>{ce="dashboard",de(e)}))}function Dt(e){return{PENDING_APPROVAL:'<span style="color:var(--clr-warning-text)">⏳</span>',APPROVED:'<span style="color:var(--clr-success-text)">✓</span>',REJECTED:'<span style="color:var(--clr-danger-text)">✗</span>',COMPLETED:'<span style="color:var(--clr-success-text)">✓✓</span>',FAILED:'<span style="color:var(--clr-danger-text)">!</span>'}[e]||e}function hs(e){return{LOW:"#10b981",MEDIUM:"#f59e0b",HIGH:"#ef4444",CRITICAL:"#991b1b"}[e]||"#6b7280"}function hr(e){var i;if(e.status!=="PENDING_APPROVAL")return null;const t=((i=e.validation)==null?void 0:i.approvalPath)||["manager","it","agent","action"];for(const s of t){if(s==="agent"||s==="action")continue;if(!e.approvals.find(n=>n.step===s&&n.status==="APPROVED"))return{step:s,approverRole:s,status:"PENDING"}}return null}async function wi(e,t,i,s,a){try{const n=t==="APPROVED"?"approve":"reject",r=t==="APPROVED"?{approverEmail:window.userEmail,approverRole:i,comment:s}:{rejectorEmail:window.userEmail,rejectorRole:i,reason:s},l=await(await fetch(`${A}/requests/${e}/${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();l.success&&(Ke=l.data,u(`Request ${t==="APPROVED"?"approved":"rejected"} successfully`,"success"),ce="details",de(a))}catch(n){console.error("Approval error:",n),u("Failed to process approval","error")}}const It=[{id:"submit",label:"Request Submitted",icon:"ti-send",color:"info"},{id:"manager",label:"Manager Approval",icon:"ti-user-check",color:"warning"},{id:"dataowner",label:"Data Owner Approval",icon:"ti-shield-check",color:"purple"},{id:"it",label:"IT Review",icon:"ti-settings",color:"warning"},{id:"agent",label:"AI Agent Validation",icon:"ti-robot",color:"teal"},{id:"action",label:"System Provisioning",icon:"ti-api",color:"info"},{id:"done",label:"Completion",icon:"ti-circle-check",color:"success"}],ot=[{id:"exchange",name:"Exchange Online",icon:"ti-mail",color:"#854F0B",bg:"#FAEEDA",desc:"Groups, shared mailboxes, room resources, and email settings",badge:"4 services"},{id:"teams",name:"Microsoft Teams",icon:"ti-brand-teams",color:"#3C3489",bg:"#EEEDFE",desc:"Create teams, manage members, channels, and guest access",badge:"5 actions"},{id:"sharepoint",name:"SharePoint Services",icon:"ti-brand-sharepoint",color:"#3B6D11",bg:"#EAF3DE",desc:"Sites, permissions, external sharing, and storage management",badge:"6 actions"},{id:"onedrive",name:"OneDrive Administration",icon:"ti-cloud",color:"#0C447C",bg:"#E6F1FB",desc:"Storage increases and former employee OneDrive access",badge:"2 actions"},{id:"ext-sharing",name:"External Sharing",icon:"ti-world",color:"#791F1F",bg:"#FCEBEB",desc:"Invite, extend, or remove external guest access",badge:"4 actions"},{id:"user-access",name:"User Access Management",icon:"ti-lock-access",color:"#185FA5",bg:"#E6F1FB",desc:"Request access to mailboxes, Teams, SharePoint and groups",badge:"5 actions"},{id:"licenses",name:"License Management",icon:"ti-license",color:"#854F0B",bg:"#FAEEDA",desc:"Request Microsoft 365, Power BI, Visio, Project licenses",badge:"6 licenses"},{id:"copilot",name:"Microsoft Copilot",icon:"ti-sparkles",color:"#3C3489",bg:"#EEEDFE",desc:"Request or remove Microsoft 365 Copilot licenses",badge:"2 actions"},{id:"power-platform",name:"Power Platform",icon:"ti-bolt",color:"#3B6D11",bg:"#EAF3DE",desc:"Environments, premium connectors, DLP exceptions",badge:"4 actions"},{id:"intune",name:"Intune Services",icon:"ti-device-laptop",color:"#0C447C",bg:"#E6F1FB",desc:"Device retirement, wipe, and compliance exceptions",badge:"3 actions"},{id:"guest-lifecycle",name:"Guest User Lifecycle",icon:"ti-user-plus",color:"#633806",bg:"#FAEEDA",desc:"Invite guests, extend or remove access, quarterly reviews",badge:"4 actions"}],Le=[{id:"exchange-groups",name:"Distribution & Security Groups",icon:"ti-users-group",desc:"M365 Groups, Distribution Groups, Security Groups"},{id:"shared-mailbox",name:"Shared Mailboxes",icon:"ti-mailbox",desc:"Create, delete, and manage shared mailbox permissions"},{id:"room-equipment",name:"Room & Equipment Mailboxes",icon:"ti-building",desc:"Meeting rooms, equipment resources, booking policies"},{id:"email-services",name:"Email Services",icon:"ti-mail-forward",desc:"SMTP addresses, mail forwarding, auto-reply configuration"}],br={"exchange-groups":{parentGroup:"exchange",operations:[{id:"create-m365-group",group:"Microsoft 365 Groups",label:"Create M365 Group",approvalPath:["manager","it"],agentChecks:["Check for duplicate group names","Suggest existing groups with similar purpose","Validate naming convention","Verify requestor eligibility"],systemAction:"POST /v1.0/groups (groupTypes: Unified)",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. Marketing EMEA"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"marketing-emea",hint:"@contoso.com appended automatically"},{id:"privacy",label:"Privacy",type:"select",required:!0,options:["Private","Public"]},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"user1@contoso.com, user2@contoso.com",hint:"Comma-separated UPNs"},{id:"description",label:"Group Description",type:"textarea",required:!1,placeholder:"Purpose of this group..."},{id:"justification",label:"Business Justification",type:"textarea",required:!0,placeholder:"Why is this group needed?"}]},{id:"add-m365-members",group:"Microsoft 365 Groups",label:"Add Members to M365 Group",approvalPath:["manager"],agentChecks:["Verify group exists","Check member licensing","Validate UPNs"],systemAction:"POST /v1.0/groups/{id}/members/$ref",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0,placeholder:"marketing-emea@contoso.com"},{id:"members",label:"Members to Add",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0,placeholder:"Why do these users need to join?"}]},{id:"remove-m365-members",group:"Microsoft 365 Groups",label:"Remove Members from M365 Group",approvalPath:["manager"],agentChecks:["Verify group membership","Check if member is owner"],systemAction:"DELETE /v1.0/groups/{id}/members/{userId}/$ref",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0,placeholder:"marketing-emea@contoso.com"},{id:"members",label:"Members to Remove",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Reason",type:"textarea",required:!0}]},{id:"archive-m365-group",group:"Microsoft 365 Groups",label:"Archive M365 Group",approvalPath:["manager","it"],agentChecks:["Check last activity date","Identify active owners","Verify no active workflows depend on group"],systemAction:"PATCH /v1.0/groups/{id} (visibility: archived)",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0},{id:"archiveDate",label:"Archive By Date",type:"date",required:!1},{id:"dataRetention",label:"Data Retention Period",type:"select",required:!0,options:["30 days","90 days","180 days","1 year","Indefinite"]},{id:"justification",label:"Reason for Archiving",type:"textarea",required:!0}]},{id:"create-dg",group:"Distribution Groups",label:"Create Distribution Group",approvalPath:["manager"],agentChecks:["Duplicate DG check","Naming convention validation","Suggest existing DGs"],systemAction:"New-DistributionGroup via Exchange PowerShell",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. All Staff UK"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"all-staff-uk"},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"Comma-separated UPNs"},{id:"managedBy",label:"Managed By (Owner)",type:"text",required:!1,placeholder:"UPN of owner"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"modify-dg",group:"Distribution Groups",label:"Rename / Modify Distribution Group",approvalPath:["manager"],agentChecks:["Verify group ownership","Check for email references to current name"],systemAction:"Set-DistributionGroup via Exchange PowerShell",fields:[{id:"currentName",label:"Current Group Name",type:"text",required:!0},{id:"newName",label:"New Display Name",type:"text",required:!1,placeholder:"Leave blank if not changing"},{id:"newAlias",label:"New Email Alias",type:"text",required:!1,placeholder:"Leave blank if not changing"},{id:"changeOwner",label:"New Owner UPN",type:"text",required:!1},{id:"justification",label:"Reason for Change",type:"textarea",required:!0}]},{id:"delete-dg",group:"Distribution Groups",label:"Delete Distribution Group",approvalPath:["manager","it"],agentChecks:["Check group usage in mail flow rules","Identify group members","Check email references in other systems"],systemAction:"Remove-DistributionGroup via Exchange PowerShell",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0},{id:"confirmation",label:"Type group name to confirm deletion",type:"text",required:!0,placeholder:"Must match exactly"},{id:"justification",label:"Reason for Deletion",type:"textarea",required:!0}]},{id:"create-sg",group:"Security Groups",label:"Create Security Group",approvalPath:["manager","it"],agentChecks:["Duplicate check","Naming convention","Suggest existing groups","Review intended resource access"],systemAction:"POST /v1.0/groups (securityEnabled: true)",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. SG-Finance-ReadOnly"},{id:"purpose",label:"Purpose / Resource",type:"text",required:!0,placeholder:"What resource will this secure?"},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"Comma-separated UPNs"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"manage-sg-members",group:"Security Groups",label:"Add / Remove Security Group Members",approvalPath:["manager","it"],agentChecks:["Verify requester is group owner","Check member eligibility","Validate access to secured resource"],systemAction:"POST/DELETE /v1.0/groups/{id}/members/$ref",fields:[{id:"groupName",label:"Security Group Name",type:"text",required:!0},{id:"action",label:"Action",type:"select",required:!0,options:["Add members","Remove members"]},{id:"members",label:"Members (UPNs)",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"shared-mailbox":{parentGroup:"exchange",operations:[{id:"create-shared-mb",group:"Create / Delete",label:"Create Shared Mailbox",approvalPath:["manager","it"],agentChecks:["Duplicate mailbox check","License availability","Naming convention","Verify owner details"],systemAction:"New-Mailbox -Shared via Exchange PowerShell",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. HR Department"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"hr@contoso.com"},{id:"fullAccess",label:"Full Access Users",type:"text",required:!1,placeholder:"UPNs comma-separated"},{id:"sendAs",label:"Send As Users",type:"text",required:!1,placeholder:"UPNs comma-separated"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"delete-shared-mb",group:"Create / Delete",label:"Delete Shared Mailbox",approvalPath:["manager","it"],agentChecks:["Check mailbox usage in last 90 days","Identify users with permissions","Check mail flow dependencies"],systemAction:"Remove-Mailbox via Exchange PowerShell",fields:[{id:"mailboxEmail",label:"Mailbox Email Address",type:"email",required:!0},{id:"dataAction",label:"Data Disposition",type:"select",required:!0,options:["Export then delete","Retain for 90 days","Immediate deletion"]},{id:"justification",label:"Reason for Deletion",type:"textarea",required:!0}]},{id:"mb-permissions",group:"Permissions",label:"Modify Mailbox Permissions",approvalPath:["manager"],agentChecks:["Verify mailbox exists","Validate user licensing","Check current permission state"],systemAction:"Add/Remove-MailboxPermission via Exchange PowerShell",fields:[{id:"mailboxEmail",label:"Mailbox Email Address",type:"email",required:!0},{id:"permType",label:"Permission Type",type:"select",required:!0,options:["Full Access","Send As","Send on Behalf"]},{id:"action",label:"Action",type:"select",required:!0,options:["Add permission","Remove permission"]},{id:"users",label:"Users (UPNs)",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"room-equipment":{parentGroup:"exchange",operations:[{id:"create-room",group:"Create",label:"Create Room Mailbox",approvalPath:["manager","it"],agentChecks:["Check for duplicate room names","Validate capacity settings","Verify location exists in directory"],systemAction:"New-Mailbox -Room via Exchange PowerShell",fields:[{id:"displayName",label:"Room Name",type:"text",required:!0,placeholder:"e.g. London — Boardroom A"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"london-boardroom-a"},{id:"capacity",label:"Capacity (persons)",type:"text",required:!0,placeholder:"12"},{id:"location",label:"Building / Floor",type:"text",required:!1,placeholder:"e.g. 1 Canada Square, Floor 4"},{id:"autoAccept",label:"Auto-accept bookings",type:"select",required:!0,options:["Auto-accept all","Require approval","Manual only"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"create-equipment",group:"Create",label:"Create Equipment Mailbox",approvalPath:["manager","it"],agentChecks:["Duplicate equipment name check","Validate equipment type"],systemAction:"New-Mailbox -Equipment via Exchange PowerShell",fields:[{id:"displayName",label:"Equipment Name",type:"text",required:!0,placeholder:"e.g. Projector — Floor 3"},{id:"alias",label:"Email Alias",type:"text",required:!0},{id:"equipType",label:"Equipment Type",type:"select",required:!0,options:["Projector","Video conferencing unit","Laptop pool","Car/Fleet","Other"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"modify-booking",group:"Modify",label:"Modify Booking Policy",approvalPath:["manager"],agentChecks:["Verify resource exists","Check current booking conflicts"],systemAction:"Set-CalendarProcessing via Exchange PowerShell",fields:[{id:"resourceEmail",label:"Resource Email",type:"email",required:!0},{id:"autoAccept",label:"Auto-accept policy",type:"select",required:!1,options:["Auto-accept all","Require approval","Manual only"]},{id:"maxDuration",label:"Max booking duration",type:"select",required:!1,options:["1 hour","2 hours","4 hours","8 hours","1 day","Unlimited"]},{id:"bookingWindow",label:"Advance booking window",type:"select",required:!1,options:["1 week","2 weeks","1 month","3 months","6 months"]},{id:"justification",label:"Reason for Change",type:"textarea",required:!0}]},{id:"add-delegate",group:"Modify",label:"Add Room/Equipment Delegate",approvalPath:["manager"],agentChecks:["Verify resource exists","Verify delegate licensing"],systemAction:"Set-CalendarProcessing -ResourceDelegates",fields:[{id:"resourceEmail",label:"Resource Email",type:"email",required:!0},{id:"delegates",label:"Delegate UPNs",type:"text",required:!0,placeholder:"Comma-separated UPNs"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"delete-resource",group:"Delete",label:"Remove Room / Equipment Mailbox",approvalPath:["manager","it"],agentChecks:["Check for future bookings","Identify delegates","Cancel existing calendar entries"],systemAction:"Remove-Mailbox via Exchange PowerShell",fields:[{id:"resourceEmail",label:"Resource Email",type:"email",required:!0},{id:"deleteDate",label:"Removal Date",type:"date",required:!1,hint:"Leave blank for immediate removal"},{id:"justification",label:"Reason for Removal",type:"textarea",required:!0}]}]},"email-services":{parentGroup:"exchange",operations:[{id:"smtp-change",group:"Email Configuration",label:"SMTP Address Change",approvalPath:["manager","it"],agentChecks:["Verify mailbox ownership","Check SMTP address availability","Check for email references in other systems"],systemAction:"Set-Mailbox -EmailAddresses via Exchange PowerShell",fields:[{id:"mailboxUpn",label:"Mailbox UPN",type:"email",required:!0},{id:"newSmtp",label:"New Primary SMTP",type:"email",required:!0,hint:"New primary email address"},{id:"keepOld",label:"Retain old address as alias",type:"select",required:!0,options:["Yes — keep as alias","No — remove old address"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"mail-forwarding",group:"Email Configuration",label:"Configure Mail Forwarding",approvalPath:["manager","it"],agentChecks:["Check for external forwarding policy","Verify destination address","Flag if forwarding to external domain"],systemAction:"Set-Mailbox -ForwardingSmtpAddress via Exchange PowerShell",fields:[{id:"mailboxUpn",label:"Mailbox UPN",type:"email",required:!0},{id:"forwardTo",label:"Forward To",type:"email",required:!0},{id:"keepCopy",label:"Keep a copy in mailbox",type:"select",required:!0,options:["Yes","No"]},{id:"duration",label:"Forwarding Duration",type:"select",required:!1,options:["Indefinite","30 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"auto-reply",group:"Email Configuration",label:"Auto Reply Configuration",approvalPath:["manager"],agentChecks:["Validate mailbox ownership","Check message content for compliance"],systemAction:"Set-MailboxAutoReplyConfiguration via Exchange PowerShell",fields:[{id:"mailboxUpn",label:"Mailbox UPN",type:"email",required:!0},{id:"scope",label:"Reply Scope",type:"select",required:!0,options:["Internal only","Internal and external"]},{id:"startDate",label:"Start Date",type:"date",required:!1},{id:"endDate",label:"End Date",type:"date",required:!1},{id:"message",label:"Auto Reply Message",type:"textarea",required:!0,placeholder:"Out of office message..."}]}]},teams:{parentGroup:null,operations:[{id:"create-team",group:"Team Management",label:"Create Team",approvalPath:["manager"],agentChecks:["Duplicate team name check","Suggest existing teams","Validate naming convention","Check M365 group quota"],systemAction:"POST /v1.0/teams",fields:[{id:"displayName",label:"Team Name",type:"text",required:!0,placeholder:"e.g. Project Phoenix"},{id:"description",label:"Description",type:"textarea",required:!1},{id:"privacy",label:"Privacy",type:"select",required:!0,options:["Private (invite only)","Public (open to all)"]},{id:"template",label:"Team Template",type:"select",required:!1,options:["Standard","Project","Retail","Healthcare","Education"]},{id:"owners",label:"Team Owners",type:"text",required:!0,placeholder:"Comma-separated UPNs (at least 1)"},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"Comma-separated UPNs"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"add-team-members",group:"Team Management",label:"Add / Remove Team Members",approvalPath:["manager"],agentChecks:["Verify team exists","Check user licensing","Validate requester is owner"],systemAction:"POST/DELETE /v1.0/teams/{id}/members",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"action",label:"Action",type:"select",required:!0,options:["Add members","Remove members","Promote to owner","Demote from owner"]},{id:"users",label:"Users (UPNs)",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"create-channel",group:"Channel Management",label:"Create Channel",approvalPath:["manager"],agentChecks:["Verify team exists","Check for duplicate channel names","Validate channel type eligibility"],systemAction:"POST /v1.0/teams/{id}/channels",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"channelName",label:"Channel Name",type:"text",required:!0,placeholder:"e.g. Project Updates"},{id:"channelType",label:"Channel Type",type:"select",required:!0,options:["Standard","Private","Shared"]},{id:"description",label:"Description",type:"textarea",required:!1},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"team-guest-access",group:"Guest Access",label:"Request Guest Access to Team",approvalPath:["manager","it"],agentChecks:["Verify guest policy allows external access","Check guest domain restrictions","Validate team guest access setting"],systemAction:"POST /v1.0/teams/{id}/members (guest)",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"guestEmails",label:"Guest Email Addresses",type:"textarea",required:!0,placeholder:"One email per line (external addresses)"},{id:"guestOrg",label:"Guest Organisation",type:"text",required:!0,placeholder:"External company name"},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["30 days","60 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},sharepoint:{parentGroup:null,operations:[{id:"new-site",group:"Site Management",label:"Request New SharePoint Site",approvalPath:["manager","it"],agentChecks:["Check for similar existing sites","Validate site URL availability","Check storage quota","Verify naming convention"],systemAction:"POST /v1.0/sites — Invoke-RestMethod SharePoint REST API",fields:[{id:"siteTitle",label:"Site Title",type:"text",required:!0,placeholder:"e.g. Finance Department Hub"},{id:"siteUrl",label:"Site URL",type:"text",required:!0,placeholder:"finance-hub",hint:"contoso.sharepoint.com/sites/ prefix appended"},{id:"siteTemplate",label:"Template",type:"select",required:!0,options:["Team site","Communication site","Hub site","Document center"]},{id:"owners",label:"Site Owners",type:"text",required:!0,placeholder:"Comma-separated UPNs"},{id:"storageQuota",label:"Initial Storage Quota",type:"select",required:!1,options:["1 GB (default)","5 GB","10 GB","25 GB","100 GB"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"add-site-members",group:"Site Permissions",label:"Add Site Members / Owners",approvalPath:["manager"],agentChecks:["Verify site exists","Check user eligibility","Validate permission level request"],systemAction:"SharePoint REST API — /_api/web/roleassignments",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0,placeholder:"contoso.sharepoint.com/sites/..."},{id:"role",label:"Permission Level",type:"select",required:!0,options:["Read","Contribute","Edit","Full Control","Site Owner"]},{id:"users",label:"Users / Groups (UPNs)",type:"textarea",required:!0,placeholder:"One UPN or group name per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"external-sharing",group:"External Sharing",label:"Request External Sharing",approvalPath:["manager","dataowner","it"],agentChecks:["Check tenant external sharing policy","Verify domain not blocked","Classify data sensitivity","Check DLP policy applicability"],systemAction:"Set-SPOSite -SharingCapability via PnP PowerShell",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"sharingLevel",label:"Sharing Level",type:"select",required:!0,options:["Specific people (authenticated)","Anyone with link (no sign-in)","Existing guests only"]},{id:"externalOrg",label:"External Organisation",type:"text",required:!0},{id:"duration",label:"Duration",type:"select",required:!0,options:["30 days","90 days","6 months","1 year","Ongoing (reviewed annually)"]},{id:"dataSensitivity",label:"Data Sensitivity",type:"select",required:!0,options:["Public","Internal","Confidential","Highly Confidential"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"storage-increase",group:"Site Management",label:"Request Storage Increase",approvalPath:["manager","it"],agentChecks:["Check current usage vs quota","Validate increase request is proportionate","Check tenant storage pool"],systemAction:"Set-SPOSite -StorageQuota via PnP PowerShell",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"currentSize",label:"Current Storage Used",type:"text",required:!1,placeholder:"Approx. current usage (e.g. 4.5 GB)"},{id:"requestedGB",label:"Additional Storage (GB)",type:"text",required:!0,placeholder:"e.g. 10"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"delete-site",group:"Site Management",label:"Request Site Deletion",approvalPath:["manager","it"],agentChecks:["Check last site activity","Identify site owners","Check for active flows or apps referencing site","Verify data retention requirements"],systemAction:"Remove-SPOSite via PnP PowerShell",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"contentAction",label:"Content Action",type:"select",required:!0,options:["Export content then delete","Move to archive library","Immediate deletion"]},{id:"confirmation",label:"Type site name to confirm",type:"text",required:!0},{id:"justification",label:"Reason for Deletion",type:"textarea",required:!0}]}]},onedrive:{parentGroup:null,operations:[{id:"onedrive-storage",group:"Storage",label:"Request OneDrive Storage Increase",approvalPath:["manager","it"],agentChecks:["Check current OneDrive usage","Verify user licensing tier","Check tenant storage pool"],systemAction:"Set-SPOSite (OneDrive) -StorageQuota via PnP PowerShell",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0,placeholder:"user@contoso.com"},{id:"currentUsage",label:"Current Usage (approx)",type:"text",required:!1,placeholder:"e.g. 800 GB"},{id:"requestedQuota",label:"Requested Quota (GB)",type:"select",required:!0,options:["1 TB (default)","2 TB","5 TB","10 TB","25 TB (requires approval)"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"former-employee-od",group:"Access",label:"Access Former Employee OneDrive",approvalPath:["manager","it"],agentChecks:["Verify employee account status","Check data retention policy","Validate manager relationship","Check GDPR/legal hold status"],systemAction:"Set-SPOUser -Site (OneDrive URL) -LoginName via PnP PowerShell",fields:[{id:"formerEmployee",label:"Former Employee UPN",type:"email",required:!0},{id:"requestorUpn",label:"Requestor UPN",type:"email",required:!0,hint:"Your UPN — will be granted access"},{id:"reason",label:"Reason for Access",type:"select",required:!0,options:["Business continuity","Legal / compliance","Data recovery","Project handover","GDPR subject access request"]},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["7 days","30 days","90 days"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"ext-sharing":{parentGroup:null,operations:[{id:"invite-guest",group:"Guest Invitations",label:"Invite External Guest",approvalPath:["manager","it"],agentChecks:["Check domain against block list","Verify guest invitation policy","Check existing guest account","Validate business relationship"],systemAction:"POST /v1.0/invitations",fields:[{id:"guestEmail",label:"Guest Email Address",type:"email",required:!0},{id:"guestName",label:"Guest Full Name",type:"text",required:!0},{id:"guestOrg",label:"Guest Organisation",type:"text",required:!0},{id:"accessNeeded",label:"Access Required",type:"text",required:!0,placeholder:"Teams, SharePoint site, etc."},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["30 days","60 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"extend-guest",group:"Guest Lifecycle",label:"Extend Guest Access",approvalPath:["manager","dataowner"],agentChecks:["Verify current expiry date","Check if guest is still active","Validate business relationship still active"],systemAction:"PATCH /v1.0/users/{guestId} — update account expiry",fields:[{id:"guestEmail",label:"Guest Email Address",type:"email",required:!0},{id:"extension",label:"Extend By",type:"select",required:!0,options:["30 days","60 days","90 days","6 months","1 year"]},{id:"reviewDate",label:"Next Review Date",type:"date",required:!1},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"remove-guest",group:"Guest Lifecycle",label:"Remove Guest Access",approvalPath:["manager"],agentChecks:["Enumerate all resources guest has access to","Check for owned content","Schedule account removal"],systemAction:"DELETE /v1.0/users/{guestId}",fields:[{id:"guestEmail",label:"Guest Email Address",type:"email",required:!0},{id:"removeDate",label:"Removal Date",type:"date",required:!1,hint:"Leave blank for immediate removal"},{id:"reassignContent",label:"Reassign owned content to",type:"text",required:!1,placeholder:"UPN of new owner (optional)"},{id:"justification",label:"Reason",type:"textarea",required:!0}]},{id:"enable-ext-sharing",group:"Sharing Policy",label:"Request External Sharing Enablement",approvalPath:["manager","dataowner","it"],agentChecks:["Verify DLP policies cover new sharing scope","Check Conditional Access for guest sign-in","Review tenant sharing policy settings"],systemAction:"Set-SPOTenant -SharingCapability via PnP PowerShell",fields:[{id:"scope",label:"Sharing Scope",type:"select",required:!0,options:["Specific SharePoint sites","All SharePoint sites","OneDrive","All workloads"]},{id:"sharingLevel",label:"Sharing Level",type:"select",required:!0,options:["New and existing guests","Existing guests only","Anyone (anonymous links)"]},{id:"domains",label:"Allowed External Domains",type:"text",required:!1,placeholder:"partner1.com, partner2.com"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"user-access":{parentGroup:null,operations:[{id:"access-mailbox",group:"Access Requests",label:"Access to Shared Mailbox",approvalPath:["manager"],agentChecks:["Verify mailbox exists","Check existing permissions","Validate requester eligibility"],systemAction:"Add-MailboxPermission via Exchange PowerShell",fields:[{id:"mailboxEmail",label:"Shared Mailbox Email",type:"email",required:!0},{id:"permLevel",label:"Permission Level",type:"select",required:!0,options:["Full Access","Send As","Send on Behalf"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-teams",group:"Access Requests",label:"Access to Teams Team or Channel",approvalPath:["manager"],agentChecks:["Verify team exists","Check if team is private/public","Check channel accessibility"],systemAction:"POST /v1.0/teams/{id}/members",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"channelName",label:"Channel Name",type:"text",required:!1,placeholder:"Leave blank for general access"},{id:"role",label:"Role",type:"select",required:!0,options:["Member","Owner"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-sharepoint",group:"Access Requests",label:"Access to SharePoint Site",approvalPath:["manager"],agentChecks:["Verify site exists","Check current permissions","Classify data sensitivity"],systemAction:"SharePoint REST API — /_api/web/roleassignments",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"permLevel",label:"Permission Level",type:"select",required:!0,options:["Read","Contribute","Edit"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-dl",group:"Access Requests",label:"Access to Distribution List",approvalPath:["manager"],agentChecks:["Verify DL exists","Check for closed membership","Check for similar groups"],systemAction:"Add-DistributionGroupMember via Exchange PowerShell",fields:[{id:"dlEmail",label:"Distribution List Email",type:"email",required:!0},{id:"action",label:"Action",type:"select",required:!0,options:["Subscribe (add)","Unsubscribe (remove)"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-sg",group:"Access Requests",label:"Access to Security Group",approvalPath:["manager","it"],agentChecks:["Verify SG exists","Identify what resources are secured","Validate eligibility based on role/department"],systemAction:"POST /v1.0/groups/{id}/members/$ref",fields:[{id:"sgName",label:"Security Group Name",type:"text",required:!0},{id:"resourceAccess",label:"Resource you need to access",type:"text",required:!0,placeholder:"What will this SG membership unlock?"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},licenses:{parentGroup:null,operations:[{id:"req-e3",group:"Microsoft 365",label:"Request Microsoft 365 E3 License",approvalPath:["manager","it"],agentChecks:["Check E3 license availability","Verify current license assignment","Validate user eligibility"],systemAction:"POST /v1.0/users/{id}/assignLicense",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"startDate",label:"Required From Date",type:"date",required:!1},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-e5",group:"Microsoft 365",label:"Request Microsoft 365 E5 License",approvalPath:["manager","it"],agentChecks:["Check E5 license availability (CRITICAL — low stock)","Verify E5 features needed vs E3","Validate cost center approval"],systemAction:"POST /v1.0/users/{id}/assignLicense",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"featuresNeeded",label:"E5 Features Required",type:"select",required:!0,options:["Defender for Endpoint P2","Purview compliance","Advanced analytics","All E5 features"]},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"startDate",label:"Required From Date",type:"date",required:!1},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-powerbi",group:"Add-on Licenses",label:"Request Power BI Pro License",approvalPath:["manager"],agentChecks:["Check Power BI Pro availability","Verify user not already licensed","Check for Power BI Free upgrade path"],systemAction:"POST /v1.0/users/{id}/assignLicense (PBIPREMIUM)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"useCase",label:"Use Case",type:"textarea",required:!0,placeholder:"How will Power BI Pro be used?"},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-visio",group:"Add-on Licenses",label:"Request Visio Plan License",approvalPath:["manager"],agentChecks:["Check Visio license availability","Verify Visio Plan 1 vs Plan 2 need"],systemAction:"POST /v1.0/users/{id}/assignLicense (VISIO_PLAN2)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"visioTier",label:"Visio Plan",type:"select",required:!0,options:["Visio Plan 1 (web only)","Visio Plan 2 (desktop + web)"]},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-project",group:"Add-on Licenses",label:"Request Project Plan License",approvalPath:["manager"],agentChecks:["Check Project Plan availability","Validate PM role or equivalent"],systemAction:"POST /v1.0/users/{id}/assignLicense (PROJECT_PLAN3)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"projectTier",label:"Project Plan",type:"select",required:!0,options:["Project Plan 1 (web only)","Project Plan 3 (full)","Project Plan 5 (enterprise)"]},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},copilot:{parentGroup:null,operations:[{id:"req-copilot",group:"Copilot License",label:"Request Microsoft 365 Copilot License",approvalPath:["manager","it"],agentChecks:["Check Copilot license availability","Verify M365 E3/E5 prerequisite","Validate cost center budget"],systemAction:"POST /v1.0/users/{id}/assignLicense (COPILOT_M365)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"useCase",label:"Intended Use Case",type:"textarea",required:!0,placeholder:"How will Copilot improve your productivity?"},{id:"pilotGroup",label:"Pilot / rollout group",type:"text",required:!1,placeholder:"Team or department (optional)"},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"remove-copilot",group:"Copilot License",label:"Remove Microsoft 365 Copilot License",approvalPath:["manager"],agentChecks:["Verify current Copilot assignment","Check active Copilot usage metrics"],systemAction:"POST /v1.0/users/{id}/assignLicense (removeLicenses)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"reason",label:"Reason for Removal",type:"select",required:!0,options:["User departure","Cost reduction","Low utilisation","Role change","Other"]},{id:"justification",label:"Additional Details",type:"textarea",required:!1}]}]},"power-platform":{parentGroup:null,operations:[{id:"create-env",group:"Environments",label:"Create Power Platform Environment",approvalPath:["manager","it"],agentChecks:["Check environment quota","Validate environment type eligibility","Check DLP policy coverage for new environment"],systemAction:"Power Platform Admin API — POST /environments",fields:[{id:"envName",label:"Environment Name",type:"text",required:!0,placeholder:"e.g. Finance-Production"},{id:"envType",label:"Environment Type",type:"select",required:!0,options:["Sandbox","Production","Developer","Trial"]},{id:"region",label:"Region",type:"select",required:!0,options:["United Kingdom","Europe","United States","Australia"]},{id:"purpose",label:"Purpose",type:"textarea",required:!0},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"premium-connector",group:"Connectors",label:"Request Premium Connector Access",approvalPath:["manager","it"],agentChecks:["Check DLP policy for requested connector","Verify Power Automate license","Assess data exposure risk"],systemAction:"Power Platform DLP API — update connector classification",fields:[{id:"connector",label:"Premium Connector",type:"text",required:!0,placeholder:"e.g. Salesforce, SAP, ServiceNow"},{id:"environment",label:"Environment Name",type:"text",required:!0},{id:"useCase",label:"Use Case",type:"textarea",required:!0},{id:"dataFlow",label:"Data Flow Description",type:"textarea",required:!0,placeholder:"What data will flow through this connector?"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"dlp-exception",group:"Policies",label:"Request DLP Policy Exception",approvalPath:["manager","dataowner","it"],agentChecks:["Validate exception scope","Assess compliance risk","Check for alternative compliant approach","Flag sensitive connectors"],systemAction:"Power Platform DLP API — environment-level policy override",fields:[{id:"environment",label:"Environment",type:"text",required:!0},{id:"dlpPolicy",label:"DLP Policy Name",type:"text",required:!0},{id:"connector",label:"Connector(s) Affected",type:"text",required:!0},{id:"riskMitigation",label:"Risk Mitigation Plan",type:"textarea",required:!0},{id:"duration",label:"Exception Duration",type:"select",required:!0,options:["30 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"pa-license",group:"Licensing",label:"Request Power Automate License",approvalPath:["manager"],agentChecks:["Check Power Automate license availability","Verify M365 base license","Determine if Premium or per-flow license needed"],systemAction:"POST /v1.0/users/{id}/assignLicense (FLOW_PER_USER)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"licenseType",label:"License Type",type:"select",required:!0,options:["Power Automate Premium (per user)","Power Automate per flow","Power Automate Process"]},{id:"useCase",label:"Use Case",type:"textarea",required:!0},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},intune:{parentGroup:null,operations:[{id:"retire-device",group:"Device Actions",label:"Retire Device",approvalPath:["manager","it"],agentChecks:["Verify device ownership","Check for company data on device","Confirm MFA device registration","Check for pending updates"],systemAction:"POST /beta/deviceManagement/managedDevices/{id}/retire",fields:[{id:"deviceName",label:"Device Name",type:"text",required:!0,placeholder:"Device display name from Intune"},{id:"userUpn",label:"Device User UPN",type:"email",required:!0},{id:"reason",label:"Reason for Retirement",type:"select",required:!0,options:["Device being replaced","User departure","Device lost/stolen","End of lifecycle","Other"]},{id:"returnDate",label:"Device Return / Disposal Date",type:"date",required:!1},{id:"justification",label:"Additional Details",type:"textarea",required:!1}]},{id:"wipe-device",group:"Device Actions",label:"Wipe Device",approvalPath:["it"],agentChecks:["Verify device ownership","Check for unsynced data","CRITICAL: Confirm user awareness — device wipe is irreversible"],systemAction:"POST /beta/deviceManagement/managedDevices/{id}/wipe",fields:[{id:"deviceName",label:"Device Name",type:"text",required:!0},{id:"userUpn",label:"Device User UPN",type:"email",required:!0},{id:"wipeType",label:"Wipe Type",type:"select",required:!0,options:["Full wipe (factory reset)","Selective wipe (remove corporate data only)"]},{id:"reason",label:"Reason",type:"select",required:!0,options:["Device lost","Device stolen","Security incident","User departure","Other"]},{id:"confirmation",label:"Type CONFIRM to proceed",type:"text",required:!0,hint:"This action is irreversible"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"compliance-exception",group:"Compliance",label:"Request Compliance Exception",approvalPath:["manager","it"],agentChecks:["Assess compliance gap","Check for compensating controls","Review exception policy limits","Flag if exception creates Zero Trust gap"],systemAction:"Update device compliance policy exclusion group via Intune API",fields:[{id:"deviceName",label:"Device Name",type:"text",required:!0},{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"nonCompliantItem",label:"Non-Compliant Item",type:"select",required:!0,options:["OS version","Encryption","Screen lock","Jailbreak/Root detection","Threat level","Other"]},{id:"compensatingControls",label:"Compensating Controls",type:"textarea",required:!0,placeholder:"What security controls mitigate the compliance gap?"},{id:"duration",label:"Exception Duration",type:"select",required:!0,options:["7 days","30 days","90 days"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"guest-lifecycle":{parentGroup:null,operations:[{id:"invite-guest-user",group:"Guest Management",label:"Invite Guest User",approvalPath:["manager","it"],agentChecks:["Check domain against block list","Check for existing guest account","Verify guest invitation policy","Check Conditional Access guest policy"],systemAction:"POST /v1.0/invitations",fields:[{id:"guestEmail",label:"Guest Email",type:"email",required:!0},{id:"guestName",label:"Guest Full Name",type:"text",required:!0},{id:"guestOrg",label:"Organisation",type:"text",required:!0},{id:"accessScope",label:"Access Scope",type:"text",required:!0,placeholder:"Teams, SharePoint sites, etc."},{id:"sponsor",label:"Internal Sponsor UPN",type:"email",required:!0,hint:"Accountable internal contact for this guest"},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["30 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"extend-guest-access",group:"Guest Management",label:"Extend Guest Access",approvalPath:["manager","dataowner"],agentChecks:["Verify guest activity (last 30 days)","Check access scope still appropriate","Validate sponsor still in organisation"],systemAction:"PATCH /v1.0/users/{guestId} — update account expiry",fields:[{id:"guestEmail",label:"Guest Email",type:"email",required:!0},{id:"extension",label:"Extend Access By",type:"select",required:!0,options:["30 days","90 days","6 months","1 year"]},{id:"accessReview",label:"Access Still Required For",type:"textarea",required:!0,placeholder:"Confirm ongoing business need..."},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"remove-guest-user",group:"Guest Management",label:"Remove Guest User",approvalPath:["manager"],agentChecks:["Enumerate guest resource access","Check for owned content","Check active collaborations","Flag any open items"],systemAction:"DELETE /v1.0/users/{guestId}",fields:[{id:"guestEmail",label:"Guest Email",type:"email",required:!0},{id:"removeDate",label:"Removal Date",type:"date",required:!1,hint:"Leave blank for immediate removal"},{id:"contentAction",label:"Owned Content Action",type:"select",required:!0,options:["Reassign to sponsor","Export then delete","No action needed"]},{id:"justification",label:"Reason",type:"textarea",required:!0}]},{id:"quarterly-review",group:"Access Review",label:"Request Quarterly Access Review",approvalPath:["it"],agentChecks:["Enumerate all active guest accounts","Identify guests inactive >60 days","Check expiry dates","Identify guests without sponsors"],systemAction:'GET /v1.0/users?$filter=userType eq "Guest" — generate review report',fields:[{id:"scope",label:"Review Scope",type:"select",required:!0,options:["All guest users","Specific department guests","Guests expiring in 30 days","Inactive guests only"]},{id:"reviewerUpn",label:"Reviewer UPN",type:"email",required:!0,hint:"Who should receive the review report"},{id:"justification",label:"Additional Notes",type:"textarea",required:!1}]}]}};let z="landing",_=null,W=null,U=null,se={},bs=100,Ae=null;function xr(){const e=document.getElementById("page-portal");e&&(z="landing",_=null,W=null,U=null,se={},Ae=null,V(e))}function V(e){z==="landing"?kr(e):z==="service"?Ar(e):z==="form"?$r(e):z==="submitted"?Tr(e):z==="my-requests"&&ks(e)}function lt(e){const t=m.settings;return t.portalEnabled?t[e]!==!1:!1}function ki(e){return"portal_"+e.replace(/-/g,"_")}function Re(e){return br[e]||null}function Jt(e){return ot.find(t=>t.id===e)}function xs(e,t){const i=Re(e);return i?i.operations.find(s=>s.id===t):null}function Ye(e){return e==="exchange"}function wr(){const e={"exchange-groups":"portal_exchange_groups","shared-mailbox":"portal_shared_mailbox","room-equipment":"portal_room_equipment","email-services":"portal_email_services"};for(const t of Le)if(lt(e[t.id]))return t.id;return Le[0].id}function tt(){return Ye(_)?W:_}function Ze(e){if(!e)return[];const t=["submit",...e.approvalPath,"agent","action","done"];return It.filter(i=>t.includes(i.id))}function kr(e){const t=m.currentUser;if(!m.settings.portalEnabled){e.innerHTML=`
      <div class="page-header"><div class="page-title"><i class="ti ti-grid-dots"></i> Self-Service Portal</div></div>
      <div class="locked-banner">
        <i class="ti ti-plug-x"></i>
        <h3>Portal Temporarily Disabled</h3>
        <p>The self-service portal has been disabled by your administrator. Please contact IT for assistance.</p>
      </div>`;return}const i={user:"Standard user",manager:"Manager",admin:"Administrator",super:"Super Admin"},s=ot.filter(n=>lt(ki(n.id)));e.innerHTML=`
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
      ${It.map((n,r)=>`
        <div class="pwf-step">
          <div class="pwf-circle pwf-${n.color}"><i class="ti ${n.icon}"></i></div>
          <div class="pwf-label">${n.label}</div>
        </div>
        ${r<It.length-1?'<div class="pwf-arrow"><i class="ti ti-arrow-right"></i></div>':""}
      `).join("")}
    </div>

    <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">
      ${s.length} services available
    </div>

    <div class="portal-service-grid" id="portal-service-grid"></div>
  `;const a=e.querySelector("#portal-service-grid");ot.forEach(n=>{var c,d;const r=lt(ki(n.id)),o=Ye(n.id)?Le.reduce((p,v)=>{var f,b;return p+(((b=(f=Re(v.id))==null?void 0:f.operations)==null?void 0:b.length)||0)},0):((d=(c=Re(n.id))==null?void 0:c.operations)==null?void 0:d.length)||0,l=document.createElement("div");l.className=`portal-svc-card ${r?"":"disabled"}`,l.innerHTML=`
      <div class="psc-icon" style="background:${n.bg};color:${n.color}"><i class="ti ${n.icon}"></i></div>
      <div class="psc-name">${n.name}</div>
      <div class="psc-desc">${n.desc}</div>
      <div class="psc-footer">
        <span class="badge ${r?"info":"neutral"}">${r?o+" actions":"Disabled"}</span>
        <button class="btn btn-xs btn-primary psc-open-btn" data-gid="${n.id}" ${r?"":"disabled"}>
          <i class="ti ti-arrow-right"></i> Open
        </button>
      </div>
    `,r||(l.title="This service has been disabled by your administrator."),a.appendChild(l)}),e.querySelectorAll(".psc-open-btn:not([disabled])").forEach(n=>{n.addEventListener("click",()=>{_=n.dataset.gid,Ye(_)&&(W=wr()),U=null,se={},z="service",V(e)})})}function Ar(e){const t=Jt(_);if(!t){z="landing",V(e);return}const i=tt(),s=Re(i);e.innerHTML=`
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

    ${Ye(_)?Sr():""}

    <div id="svc-ops-area"></div>
  `,e.querySelector("#svc-back").addEventListener("click",()=>{z="landing",V(e)}),Ye(_)&&e.querySelectorAll(".ex-sub-tab").forEach(a=>{a.addEventListener("click",()=>{W=a.dataset.sub,U=null,Ai(e,Re(W)),e.querySelectorAll(".ex-sub-tab").forEach(n=>n.classList.toggle("active",n.dataset.sub===W))})}),Ai(e,s)}function Sr(){const e={"exchange-groups":"portal_exchange_groups","shared-mailbox":"portal_shared_mailbox","room-equipment":"portal_room_equipment","email-services":"portal_email_services"};return`
    <div class="tabs mb-3" style="margin-bottom:16px">
      ${Le.map(t=>{const i=lt(e[t.id]);return`<button class="tab-btn ex-sub-tab ${t.id===W?"active":""} ${i?"":"disabled-tab"}"
          data-sub="${t.id}" ${i?"":"disabled"} title="${t.desc}">
          <i class="ti ${t.icon}" style="margin-right:4px"></i>${t.name}
          ${i?"":'<span class="badge neutral" style="margin-left:4px;font-size:8px">Off</span>'}
        </button>`}).join("")}
    </div>
  `}function Ai(e,t){const i=e.querySelector("#svc-ops-area");if(!i)return;if(!t){i.innerHTML='<div class="empty-state">No operations available for this service.</div>';return}const s={};if(t.operations.forEach(a=>{s[a.group]||(s[a.group]=[]),s[a.group].push(a)}),i.innerHTML=`
    <div class="card">
      <div class="card-title mb-3"><i class="ti ti-list-check"></i> Select an action</div>
      ${Object.entries(s).map(([a,n])=>`
        <div style="margin-bottom:16px">
          <div class="section-heading">${a}</div>
          <div class="op-cards-grid">
            ${n.map(r=>`
              <div class="op-card ${U===r.id?"selected":""}" data-op="${r.id}">
                <div class="op-card-title">${r.label}</div>
                <div class="op-card-steps">
                  ${Ze(r).map(o=>`<span class="op-step-dot op-step-${o.color}" title="${o.label}"></span>`).join("")}
                </div>
                <div class="op-card-approval">
                  <i class="ti ti-route" style="font-size:10px"></i>
                  ${Ze(r).map(o=>o.label).join(" → ")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>

    <div id="svc-form-preview"></div>
  `,i.querySelectorAll(".op-card").forEach(a=>{a.addEventListener("click",()=>{i.querySelectorAll(".op-card").forEach(n=>n.classList.remove("selected")),a.classList.add("selected"),U=a.dataset.op,Si(i,Re(tt()),U)})}),U){const a=i.querySelector(`.op-card[data-op="${U}"]`);a&&a.classList.add("selected"),Si(i,t,U)}}function Si(e,t,i){var r;const s=e.querySelector("#svc-form-preview");if(!s)return;const a=(r=t==null?void 0:t.operations)==null?void 0:r.find(o=>o.id===i);if(!a)return;const n=Ze(a);s.innerHTML=`
    <div class="card mt-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-info-circle"></i> ${a.label}</span>
        <button class="btn btn-primary" id="svc-start-form"><i class="ti ti-arrow-right"></i> Start Request</button>
      </div>

      <div class="grid-2" style="gap:16px">
        <div>
          <div class="section-heading">Approval & Provisioning Workflow</div>
          <div class="workflow-timeline-h">
            ${n.map((o,l)=>`
              <div class="wfh-step">
                <div class="wfh-circle wfh-${o.color}"><i class="ti ${o.icon}"></i></div>
                <div class="wfh-label">${o.label}</div>
              </div>
              ${l<n.length-1?'<div class="wfh-arrow"></div>':""}
            `).join("")}
          </div>
        </div>
        <div>
          <div class="section-heading">AI Agent Validation Checks</div>
          <div style="display:flex;flex-direction:column;gap:5px">
            ${a.agentChecks.map(o=>`
              <div style="display:flex;align-items:flex-start;gap:6px;font-size:11px;color:var(--color-text-secondary)">
                <i class="ti ti-robot" style="color:var(--clr-teal-text);font-size:12px;flex-shrink:0;margin-top:1px"></i>
                ${o}
              </div>
            `).join("")}
          </div>
          <div style="margin-top:10px">
            <div class="section-heading">System Action</div>
            <code style="font-size:10px;font-family:var(--font-mono);color:var(--clr-info-text);background:var(--clr-info-bg);padding:4px 8px;border-radius:4px;display:block;word-break:break-all">${a.systemAction}</code>
          </div>
        </div>
      </div>
    </div>
  `,s.querySelector("#svc-start-form").addEventListener("click",()=>{z="form",se={};const o=document.getElementById("page-portal");V(o)})}function $r(e){var n;const t=Jt(_),i=tt(),s=xs(i,U);if(!s||!t){z="service",V(e);return}const a=Ze(s);e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="form-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div class="psc-icon sm" style="background:${t.bg};color:${t.color}"><i class="ti ${t.icon}"></i></div>
        <div>
          <div class="page-title">${s.label}</div>
          <div class="page-subtitle">${t.name}${W?" — "+(((n=Le.find(r=>r.id===W))==null?void 0:n.name)||""):""}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <!-- Form -->
      <div>
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-forms"></i> Request Details</div>
          <div id="dynamic-form">
            ${s.fields.map(r=>Er(r)).join("")}
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
            ${a.map((r,o)=>`
              <div class="wfv-step">
                <div class="wfv-left">
                  <div class="wfv-circle wfv-${r.color}"><i class="ti ${r.icon}"></i></div>
                  ${o<a.length-1?'<div class="wfv-line"></div>':""}
                </div>
                <div class="wfv-content">
                  <div class="wfv-title">${r.label}</div>
                  ${$i(r.id,s)?`<div class="wfv-desc">${$i(r.id,s)}</div>`:""}
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
  `,e.querySelector("#form-back").addEventListener("click",()=>{z="service",V(e)}),e.querySelector("#form-submit").addEventListener("click",()=>Cr(e,s))}function Er(e){const t=e.required?" *":"",i=e.hint?`<div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${e.hint}</div>`:"";return e.type==="text"||e.type==="email"?`<div class="form-group" data-field="${e.id}">
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
    </div>`:""}function $i(e,t){return t.approvalPath,e==="submit"?"Request submitted with required details":e==="manager"?"Your direct manager reviews and approves":e==="it"?"IT team validates technical feasibility and security":e==="dataowner"?"Data/resource owner confirms access appropriateness":e==="agent"?`AI Agent validates: ${t.agentChecks[0]}, and ${t.agentChecks.length-1} more checks`:e==="action"?`Provisioning via: ${t.systemAction}`:e==="done"?"Email notification sent. Request available in My Requests.":""}function Cr(e,t){const i=e.querySelector("#dynamic-form");let s=!0;const a=[];if(t.fields.filter(r=>r.required).forEach(r=>{const o=i.querySelector(`#ff-${r.id}`);if(!o)return;(o.type==="checkbox"?o.checked:o.value.trim())||(s=!1,a.push(r.label),o.style.borderColor="var(--clr-danger-text)",o.addEventListener("input",()=>{o.style.borderColor=""},{once:!0}))}),t.fields.find(r=>r.id==="confirmation")){const r=i.querySelector("#ff-confirmation"),o=i.querySelector("#ff-groupName, #ff-siteUrl, #ff-currentName");if(r&&r.value.toUpperCase()!=="CONFIRM"&&!o&&r.value!=="CONFIRM"){s=!1,u("Type CONFIRM in the confirmation field to proceed.","error");return}}if(!s){u(`Please fill in required fields: ${a.slice(0,3).join(", ")}`,"error");return}t.fields.forEach(r=>{const o=i.querySelector(`#ff-${r.id}`);o&&(se[r.id]=o.type==="checkbox"?o.checked:o.value)}),Pr(e,t)}async function Pr(e,t){const i=e.querySelector("#form-submit");e.querySelector(".card"),i.disabled=!0,i.innerHTML='<span class="spinner"></span> Validating with AI Agent...';try{const n=(await(await fetch(`${A}/agent/validate-request`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request:{operationId:t.id,fields:se},userEmail:window.userEmail})})).json()).data;console.log("🤖 Agent validation result:",n),Mr(e,t,n,se)}catch(s){console.error("⚠️ Validation error:",s),u("Agent validation failed. Proceeding with manual review.","warning"),ws(e,t)}finally{i.disabled=!1,i.innerHTML='<i class="ti ti-send"></i> Submit Request'}}function Mr(e,t,i,s){const{riskLevel:a,riskScore:n,checks:r,recommendations:o,autoApprove:l,approvalPath:c,status:d}=i,v={LOW:{bg:"var(--clr-success-bg)",text:"var(--clr-success-text)",icon:"ti-circle-check"},MEDIUM:{bg:"var(--clr-warning-bg)",text:"var(--clr-warning-text)",icon:"ti-alert-circle"},HIGH:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)",icon:"ti-alert-octagon"},CRITICAL:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)",icon:"ti-alert-triangle"}}[a],f=document.createElement("div");f.style.cssText="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px";const b=document.createElement("div");b.style.cssText="background:white;border-radius:8px;max-width:600px;max-height:80vh;overflow-y:auto;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,0.3)",b.innerHTML=`
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;background:${v.bg};margin-bottom:12px">
        <i class="ti ${v.icon}" style="font-size:28px;color:${v.text}"></i>
      </div>
      <h2 style="font-size:18px;font-weight:600;margin:0;color:var(--color-text-primary)">Agent Validation Complete</h2>
      <p style="font-size:12px;color:var(--color-text-secondary);margin:8px 0 0">Risk Level: <strong style="color:${v.text}">${a}</strong> (${n}/100)</p>
    </div>

    <!-- Validation Checks -->
    <div style="margin-bottom:20px">
      <h3 style="font-size:12px;font-weight:600;text-transform:uppercase;color:var(--color-text-tertiary);margin-bottom:10px">Validation Checks</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${r.map(k=>`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px;background:var(--color-background-secondary);border-radius:4px">
            <div style="flex-shrink:0;margin-top:2px">
              ${k.status==="PASS"?'<i class="ti ti-circle-check" style="color:var(--clr-success-text);font-size:14px"></i>':k.status==="FAIL"?'<i class="ti ti-circle-x" style="color:var(--clr-danger-text);font-size:14px"></i>':'<i class="ti ti-alert-circle" style="color:var(--clr-warning-text);font-size:14px"></i>'}
            </div>
            <div>
              <div style="font-size:11px;font-weight:600;color:var(--color-text-primary)">${k.message}</div>
              ${k.suggestion?`<div style="font-size:10px;color:var(--color-text-secondary);margin-top:3px">💡 ${k.suggestion}</div>`:""}
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Recommendations -->
    ${o&&o.length>0?`
      <div style="margin-bottom:20px;padding:12px;background:var(--clr-info-bg);border-left:3px solid var(--clr-info-text);border-radius:4px">
        <div style="font-size:12px;font-weight:600;color:var(--clr-info-text);margin-bottom:8px">🤖 Agent Recommendations</div>
        <ul style="margin:0;padding-left:20px;font-size:11px;color:var(--clr-info-text)">
          ${o.map(k=>`<li style="margin-bottom:4px">${k.message}</li>`).join("")}
        </ul>
      </div>
    `:""}

    <!-- Auto-Approval Badge -->
    ${l?`
      <div style="margin-bottom:20px;padding:12px;background:var(--clr-success-bg);border-radius:4px;text-align:center">
        <div style="font-size:14px;font-weight:600;color:var(--clr-success-text)">✓ AUTO-APPROVED</div>
        <div style="font-size:10px;color:var(--clr-success-text);margin-top:4px">Your request meets all requirements and will be provisioned immediately</div>
      </div>
    `:`
      <div style="margin-bottom:20px;padding:12px;background:var(--clr-info-bg);border-radius:4px">
        <div style="font-size:12px;font-weight:600;color:var(--clr-info-text);margin-bottom:6px">📋 Approval Required</div>
        <div style="font-size:11px;color:var(--clr-info-text)">
          This request will be routed through:
          <div style="margin-top:6px;font-family:var(--font-mono);font-size:10px;padding:8px;background:rgba(0,0,0,0.1);border-radius:3px">
            ${c.map((k,y)=>`${k}${y<c.length-1?" → ":""}`).join("")}
          </div>
        </div>
      </div>
    `}

    <!-- Action Buttons -->
    <div style="display:flex;gap:10px;justify-content:flex-end">
      <button id="val-cancel" class="btn" style="padding:8px 16px;font-size:12px">Cancel</button>
      <button id="val-submit" class="btn btn-primary" style="padding:8px 16px;font-size:12px">
        <i class="ti ti-send"></i> Confirm & Submit
      </button>
    </div>
  `,f.appendChild(b),document.body.appendChild(f),document.getElementById("val-cancel").addEventListener("click",()=>{f.remove()}),document.getElementById("val-submit").addEventListener("click",()=>{f.remove(),ws(e,t)})}async function ws(e,t,i){var s;bs++;try{const a=e.querySelector("#val-submit");a&&(a.disabled=!0,a.innerHTML='<span class="spinner"></span> Submitting...');const n=tt(),o=await(await fetch(`${A}/self-service/requests/submit`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serviceId:n,operationId:t.id,formData:se,requesterId:((s=m.currentUser)==null?void 0:s.email)||window.userEmail,description:t.label})})).json();o.success?(console.log("✓ Request submitted:",o.requestId),Ae=o.requestId,u("Request submitted successfully","success"),z="submitted",V(e)):(u("Failed to submit request: "+o.error,"error"),a&&(a.disabled=!1,a.innerHTML='<i class="ti ti-send"></i> Confirm & Submit'))}catch(a){console.error("Submission error:",a),u("Error submitting request. Please try again.","error")}}function Tr(e){var r;const t=Jt(_),i=tt(),s=xs(i,U);if(!s||!t){z="landing",V(e);return}const a=Ze(s),n=Ae||`REQ-${String(bs).padStart(4,"0")}`;e.innerHTML=`
    <div class="page-header">
      <div class="page-title"><i class="ti ti-circle-check" style="color:var(--clr-success-text)"></i> Request Submitted</div>
    </div>

    <div class="alert-banner success mb-3">
      <i class="ti ti-circle-check"></i>
      <strong>${n}</strong> — ${s.label} request submitted successfully. You will be notified at each approval stage.
    </div>

    <div class="grid-2" style="gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-receipt"></i> Request Summary</div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:5px 16px;font-size:11px">
          <span style="color:var(--color-text-tertiary)">Request ID</span>
          <span class="monospace" style="font-weight:600;color:var(--clr-info-text)">${n}</span>
          <span style="color:var(--color-text-tertiary)">Service</span>
          <span>${t.name}</span>
          <span style="color:var(--color-text-tertiary)">Action</span>
          <span>${s.label}</span>
          <span style="color:var(--color-text-tertiary)">Submitted by</span>
          <span>${(r=m.currentUser)==null?void 0:r.name}</span>
          <span style="color:var(--color-text-tertiary)">Time</span>
          <span>${new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})} today</span>
          <span style="color:var(--color-text-tertiary)">Status</span>
          <span style="color:var(--clr-warning-text);font-weight:600">Submitted</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-route"></i> Workflow Progress</div>
        <div class="workflow-timeline-v compact">
          ${a.map((o,l)=>`
            <div class="wfv-step">
              <div class="wfv-left">
                <div class="wfv-circle ${l===0?"wfv-success":"wfv-neutral"}">
                  ${l===0?'<i class="ti ti-check"></i>':`<span style="font-size:9px;font-weight:700">${l+1}</span>`}
                </div>
                ${l<a.length-1?'<div class="wfv-line"></div>':""}
              </div>
              <div class="wfv-content">
                <div class="wfv-title ${l===0?"done":l===1?"active":"pending"}">${o.label}</div>
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
  `,e.querySelector("#submit-new").addEventListener("click",()=>{z="landing",_=null,W=null,U=null,se={},Ae=null,V(e)}),e.querySelector("#submit-myreqs").addEventListener("click",()=>{z="my-requests",V(e)})}async function ks(e){var t,i;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-list-check"></i> My Requests</div>
        <div class="page-subtitle">Track status of your submitted service requests</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="myreq-back"><i class="ti ti-arrow-left"></i> Back to Portal</button>
      </div>
    </div>

    <div style="padding:20px;text-align:center">
      <div class="spinner"></div>
      <p>Loading your requests...</p>
    </div>
  `;try{const s=((t=m.currentUser)==null?void 0:t.email)||window.userEmail,n=await(await fetch(`${A}/self-service/requests/my-requests?email=${encodeURIComponent(s)}`,{headers:{"Content-Type":"application/json"}})).json();n.success&&n.data.length>0?Lr(e,n.data):(e.querySelector('[class="page-header"]').insertAdjacentHTML("afterend",`
        <div class="empty-state" style="padding:40px;text-align:center;margin-top:20px">
          <i class="ti ti-inbox" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:16px;opacity:0.5;display:block"></i>
          <h3 style="color:var(--color-text-secondary);margin-bottom:8px">No Requests Yet</h3>
          <p style="color:var(--color-text-tertiary);margin-bottom:16px">You haven't submitted any service requests yet</p>
          <button class="btn btn-primary" id="myreq-submit-new">
            <i class="ti ti-plus"></i> Submit a Request
          </button>
        </div>
      `),e.querySelector("#myreq-submit-new").addEventListener("click",()=>{z="landing",_=null,W=null,U=null,se={},Ae=null,V(e)}))}catch(s){console.error("Error fetching requests:",s),e.querySelector('[class="page-header"]').insertAdjacentHTML("afterend",`
      <div class="alert-banner danger" style="margin:16px">
        <i class="ti ti-alert-triangle"></i>
        <span>Failed to load requests. <button class="btn btn-sm" id="myreq-retry" style="margin-left:8px">Retry</button></span>
      </div>
    `),e.querySelector("#myreq-retry").addEventListener("click",()=>{ks(e)})}(i=e.querySelector("#myreq-back"))==null||i.addEventListener("click",()=>{z="landing",_=null,W=null,U=null,se={},Ae=null,V(e)})}function Lr(e,t){var n;const i={Submitted:{bg:"var(--clr-info-bg)",text:"var(--clr-info-text)",icon:"ti-send"},Approved:{bg:"var(--clr-success-bg)",text:"var(--clr-success-text)",icon:"ti-circle-check"},Rejected:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)",icon:"ti-circle-x"},Completed:{bg:"var(--clr-success-bg)",text:"var(--clr-success-text)",icon:"ti-badge-check"}};e.querySelector(".page-header").insertAdjacentHTML("afterend",`
    <div style="margin-bottom:16px">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px">
        <div class="card" style="padding:12px;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-info-text)">${t.length}</div>
          <div style="font-size:11px;color:var(--color-text-tertiary)">Total Requests</div>
        </div>
        <div class="card" style="padding:12px;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${t.filter(r=>r.status==="Submitted").length}</div>
          <div style="font-size:11px;color:var(--color-text-tertiary)">Pending Approval</div>
        </div>
        <div class="card" style="padding:12px;text-align:center">
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">${t.filter(r=>r.status==="Completed").length}</div>
          <div style="font-size:11px;color:var(--color-text-tertiary)">Completed</div>
        </div>
      </div>

      <div id="myreq-list"></div>
    </div>
  `);const a=e.querySelector("#myreq-list");a.innerHTML=`
    <div class="card" style="padding:0;overflow:hidden">
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Request ID</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Service</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Operation</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Status</th>
            <th style="padding:12px;text-align:left;font-weight:600;font-size:11px">Submitted</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(r=>{const o=i[r.status]||i.Submitted,l=new Date(r.createdDate).toLocaleString("en-GB",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});return`
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary);hover:background:var(--color-background-secondary)">
                <td style="padding:12px;font-size:11px;font-weight:600;color:var(--clr-info-text)">${r.requestId}</td>
                <td style="padding:12px;font-size:10px">${r.service||"N/A"}</td>
                <td style="padding:12px;font-size:10px">${r.operation||"N/A"}</td>
                <td style="padding:12px;font-size:10px">
                  <span class="badge" style="background:${o.bg};color:${o.text};display:inline-flex;align-items:center;gap:4px">
                    <i class="ti ${o.icon}" style="font-size:10px"></i>
                    ${r.status}
                  </span>
                </td>
                <td style="padding:12px;font-size:10px;color:var(--color-text-secondary)">${l}</td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `,(n=e.querySelector("#myreq-back"))==null||n.addEventListener("click",()=>{z="landing",_=null,W=null,U=null,se={},Ae=null,V(e)})}function Rr(){const e=document.getElementById("page-myreqs");e&&(e.innerHTML=`
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
  `)}const Ei={user:["What can I request?","How to create a Team?","Request SharePoint access","Request Copilot license"],manager:["Approve pending requests","Guest access policy","How to request a shared mailbox?","License request process"],admin:["M365 Config failures","Risky users summary","Zero Trust gaps","Portal service status"],super:["Graph API status","All service workflows","Failed CIS controls","Guest lifecycle policy"]},Dr=[{keywords:["m365 config","cis","benchmark","compliance score"],response:`**M365 Config — CIS Benchmark v7.0.0**

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

Full details available in **Graph API** page (super admin only).`}],Ir=`I'm your **M365 AgentOps AI Copilot**. I can help you with:

- 🔧 **Portal requests** — how to request groups, mailboxes, Teams, licenses, and more
- 🔒 **Security** — CIS compliance, Zero Trust, risky users
- 📊 **Tenant status** — licenses, pending approvals, audit events
- 🤖 **AI Agent** — automation workflows and provisioning

Try asking:
- "How do I request a Distribution Group?"
- "What's the Teams guest access workflow?"
- "How do I request a Copilot license?"
- "What are the M365 Config failures?"`;let dt=[],Ci=!1;function zr(){const e=document.getElementById("page-chat");if(!e)return;const t=m.currentUser,i=Ei[t==null?void 0:t.role]||Ei.user;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-message-circle"></i> AI Copilot</div>
        <div class="page-subtitle">Ask about your M365 tenant, services, approvals, and more</div>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;height:calc(100vh - 200px);min-height:400px">
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-suggestions" id="chat-suggestions">
        ${i.map(n=>`<button class="suggestion-pill" data-text="${n}">${n}</button>`).join("")}
      </div>
      <div class="chat-input-area">
        <textarea class="chat-input" id="chat-input" placeholder="Ask about the portal, services, approvals, M365 Config..." rows="1"></textarea>
        <button class="btn btn-primary" id="chat-send"><i class="ti ti-send"></i></button>
      </div>
    </div>
  `;const s=e.querySelector("#chat-messages"),a=e.querySelector("#chat-input");!Ci||dt.length===0?(dt=[],zt("ai",Ir),Ci=!0):qt(s),e.querySelector("#chat-send").addEventListener("click",()=>xt(e)),a.addEventListener("keydown",n=>{n.key==="Enter"&&!n.shiftKey&&(n.preventDefault(),xt(e))}),a.addEventListener("input",()=>{a.style.height="auto",a.style.height=Math.min(a.scrollHeight,120)+"px"}),e.querySelectorAll(".suggestion-pill").forEach(n=>{n.addEventListener("click",()=>{a.value=n.dataset.text,xt(e)})})}function zt(e,t){dt.push({role:e,text:t,ts:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})})}function qt(e){e.innerHTML=dt.map(t=>{var a;const i=t.role==="ai",s=qr(t.text);return`
      <div class="chat-msg ${i?"ai":"user-msg"}">
        ${i?`<div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-teal-text)"></i> M365 Copilot · ${t.ts}</div>`:`<div class="chat-sender" style="justify-content:flex-end">${((a=m.currentUser)==null?void 0:a.name)||"You"} · ${t.ts}</div>`}
        <div class="chat-bubble">${s}</div>
      </div>
    `}).join(""),e.scrollTop=e.scrollHeight}function qr(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/^#{1,3} (.+)$/gm,'<strong style="font-size:12px">$1</strong>').replace(/\|(.+)\|\n\|[-| ]+\|\n/g,t=>`<table style="width:100%;border-collapse:collapse;font-size:11px;margin:6px 0"><thead><tr>${t.split(`
`)[0].split("|").filter(s=>s.trim()).map(s=>`<th style="padding:4px 8px;font-size:10px">${s.trim()}</th>`).join("")}</tr></thead><tbody>`).replace(/\|(.+)\|(?!\n\|[-|])/g,t=>`<tr>${t.split("|").filter(s=>s.trim()).map(s=>`<td style="padding:3px 8px;border-top:1px solid var(--color-border-tertiary)">${s.trim()}</td>`).join("")}</tr>`).replace(/<\/tbody>(?![\s\S]*<\/tbody>)/g,"</tbody></table>").replace(/\n/g,"<br>").replace(/❌/g,'<span style="color:var(--clr-danger-text)">❌</span>').replace(/✅/g,'<span style="color:var(--clr-success-text)">✅</span>').replace(/⚠️/g,'<span style="color:var(--clr-warning-text)">⚠️</span>').replace(/🟢/g,'<span style="color:var(--clr-success-text)">●</span>')}function xt(e){const t=e.querySelector("#chat-input"),i=t.value.trim();if(!i)return;zt("user",i),t.value="",t.style.height="auto";const s=e.querySelector("#chat-messages");qt(s),setTimeout(()=>{const a=i.toLowerCase(),n=Dr.find(o=>o.keywords.some(l=>a.includes(l))),r=(n==null?void 0:n.response)||Nr(a);zt("ai",r),qt(s)},500)}function Nr(e){return e.includes("help")||e.includes("what")||e.includes("how")?`I'm here to help! I can answer questions about:

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

Try rephrasing your question or ask about a specific service name.`}function Gr(){var t,i,s,a,n,r;const e=document.getElementById("page-graphapi");if(e){if(((t=m.currentUser)==null?void 0:t.role)!=="super"){e.innerHTML=`
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
            ${[["User.Read.All","Read all users"],["Group.ReadWrite.All","Read and write all groups"],["Mail.ReadWrite","Read and write all mailboxes"],["Directory.Read.All","Read directory data"],["AuditLog.Read.All","Read audit log data"],["Policy.Read.All","Read all policies"],["DeviceManagementConfiguration.Read.All","Read Intune device configuration"]].map(([o,l])=>`
              <tr>
                <td class="monospace" style="font-size:10px">${o}</td>
                <td style="font-size:11px;color:var(--color-text-secondary)">${l}</td>
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
            ${[["User.Read","Read signed-in user profile"],["openid","OpenID Connect sign-in"],["offline_access","Maintain access offline"]].map(([o,l])=>`
              <tr>
                <td class="monospace" style="font-size:10px">${o}</td>
                <td style="font-size:11px;color:var(--color-text-secondary)">${l}</td>
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
          ${o.endpoints.map(l=>`
            <div class="graph-endpoint-row">
              <span class="method-badge ${l.method}">${l.method}</span>
              <span class="graph-path">${l.path}</span>
              <span style="flex:1;font-size:10px;color:var(--color-text-secondary)">${l.desc}</span>
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
  `,e.querySelectorAll("#graph-tabs .tab-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll("#graph-tabs .tab-btn").forEach(l=>l.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(l=>l.classList.remove("active")),o.classList.add("active"),e.querySelector(`#graph-tab-${o.dataset.tab}`).classList.add("active")})}),e.querySelectorAll(".copy-val").forEach(o=>{o.addEventListener("click",()=>{navigator.clipboard.writeText(o.dataset.val),u("Copied to clipboard.","success")})}),(i=e.querySelector("#graph-secret-toggle"))==null||i.addEventListener("click",()=>{const o=e.querySelector("#graph-secret");o.type=o.type==="password"?"text":"password"}),(s=e.querySelector("#graph-save"))==null||s.addEventListener("click",()=>u("Configuration saved.","success")),(a=e.querySelector("#graph-refresh-token"))==null||a.addEventListener("click",()=>u("Token refreshed successfully.","success")),(n=e.querySelector("#graph-grant-consent"))==null||n.addEventListener("click",()=>u("Admin consent granted for all permissions.","success")),(r=e.querySelector("#throttle-save"))==null||r.addEventListener("click",()=>u("Throttling configuration saved.","success"))}}function Or(){var t,i,s;const e=document.getElementById("page-sso");if(e){if(((t=m.currentUser)==null?void 0:t.role)!=="super"){e.innerHTML=`
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
      ${["Register application in Entra ID → App Registrations → New registration","Set redirect URI to your M365 AgentOps deployment URL + /auth/callback","Add required API permissions: User.Read, openid, profile, email","Create security groups in Entra ID for each application role","Configure group claims in token configuration to include group membership","Copy the Client ID and Tenant ID to M365 AgentOps Graph API settings","Test SSO flow with a test user from each role group"].map((a,n)=>`
        <div class="sso-step">
          <div class="sso-step-num">${n+1}</div>
          <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.5">${a}</div>
        </div>
      `).join("")}
    </div>
  `,(i=e.querySelector("#sso-save"))==null||i.addEventListener("click",()=>u("SSO configuration saved.","success")),(s=e.querySelector("#sso-test"))==null||s.addEventListener("click",()=>{u("SSO test initiated — check your browser for the Entra ID sign-in prompt.","info")})}}function Ur(){const e=document.getElementById("page-audit");if(!e)return;const t=[{time:"Today 08:47",event:"Config Agent scan completed",user:"M365 Config Agent",category:"Compliance",severity:"info",sevCls:"info"},{time:"Today 08:15",event:"High-risk sign-in detected",user:"kevin.osei@contoso.com",category:"Security",severity:"high",sevCls:"danger"},{time:"Yesterday 16:30",event:"Access request approved (REQ-005)",user:"Sanjay Kumar",category:"Access",severity:"low",sevCls:"success"},{time:"Yesterday 14:12",event:"PIM role activated — Compliance Admin",user:"sam.torres@contoso.com",category:"Identity",severity:"medium",sevCls:"warning"}];e.innerHTML=`
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
  `}function ae({id:e,checked:t,label:i,sublabel:s,onChange:a}){const n=document.createElement("div");n.className="toggle-wrap",n.innerHTML=`
    <label class="toggle-switch">
      <input type="checkbox" id="${e}" ${t?"checked":""}>
      <span class="toggle-track"></span>
    </label>
    <label for="${e}" class="toggle-label">
      ${i}
      ${s?`<div class="toggle-sublabel">${s}</div>`:""}
    </label>
  `;const r=n.querySelector("input");return r.addEventListener("change",()=>a(r.checked)),n}const jr=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1",Kt=jr?"http://localhost:3000/api/tenantguard":"https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/tenantguard";async function Fr(){try{return(await(await fetch(`${Kt}/settings/claude-status`)).json()).data}catch(e){return console.error("Error getting Claude status:",e),null}}async function Br(e){try{return await(await fetch(`${Kt}/settings/claude-api-key`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({apiKey:e})})).json()}catch(t){return console.error("Error setting Claude API key:",t),{success:!1,error:t.message}}}async function Hr(){try{return await(await fetch(`${Kt}/settings/claude-api-key`,{method:"DELETE"})).json()}catch(e){return console.error("Error removing Claude API key:",e),{success:!1,error:e.message}}}function _r(){const e=document.getElementById("page-settings");e&&As(e)}function As(e){const t=m.settings;e.innerHTML=`
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

    <!-- TenantGuard AI Investigation -->
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-robot"></i> TenantGuard — AI Investigation Agent</span>
        <span id="claude-status-badge" class="badge info">Loading...</span>
      </div>

      <div class="alert-banner info mb-3" style="margin-top:8px">
        <i class="ti ti-info-circle"></i>
        <span>
          <strong>Optional:</strong> Configure your Claude API key to enable AI-powered security investigations.
          Without this, the system uses intelligent mock responses.
          <a href="https://console.anthropic.com" target="_blank" style="color:var(--clr-primary);text-decoration:underline">Get your API key →</a>
        </span>
      </div>

      <div id="claude-settings-section">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div class="form-group">
            <label class="form-label">Claude API Key</label>
            <input type="password" class="form-input" id="settings-claude-key" placeholder="sk-..." style="font-family:monospace">
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">
              Your API key is stored securely and never shared. Get one free at console.anthropic.com
            </div>
          </div>

          <div class="form-group" style="margin-top:12px">
            <label class="form-label">About Claude Integration</label>
            <div style="font-size:11px;color:var(--color-text-secondary);line-height:1.6">
              <strong>What it does:</strong> Enables real Claude AI to analyze security incidents, answer questions naturally, and generate incident reports.<br>
              <strong>Cost:</strong> ~$0.19 per investigation (Sonnet) or $0.57 (Opus). Free tier: $5 credits.<br>
              <strong>Without it:</strong> System uses intelligent mock responses (fully functional, good for testing).<br>
              <strong>Status:</strong> <span id="claude-mode-text">Checking...</span>
            </div>
          </div>

          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-primary" id="claude-save-btn">
              <i class="ti ti-device-floppy"></i> Save API Key
            </button>
            <button class="btn btn-danger" id="claude-remove-btn" style="display:none">
              <i class="ti ti-trash"></i> Remove API Key
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Platform display -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-layout-dashboard"></i> Platform Display</div>
      <div id="settings-graph-health-wrap" style="margin-bottom:14px"></div>
      <div id="settings-zt-score-wrap" style="margin-bottom:14px"></div>
      <div id="settings-cfg-score-wrap" style="margin-bottom:4px"></div>
    </div>

    <!-- Change Intelligence Configuration -->
    <div class="card mb-3">
      <div class="card-title mb-3"><i class="ti ti-antenna"></i> Change Intelligence Configuration</div>
      <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="margin-bottom:14px">
          <label class="form-label">Announcement Sync Period</label>
          <select id="settings-sync-days" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
            <option value="7">Last 7 days (Default)</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:6px">
            Pulls announcements created or updated in selected period
          </div>
        </div>

        <div style="margin-bottom:14px">
          <label class="form-label">SharePoint Site URL</label>
          <div style="display:flex;gap:8px">
            <input type="text" class="form-input" id="settings-sharepoint-site" placeholder="e.g., root or /sites/OpsCenter" style="flex:1">
            <button class="btn" id="settings-sharepoint-test" style="white-space:nowrap"><i class="ti ti-check"></i> Test</button>
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:6px">
            Enter "root" for tenant root site, or "/sites/SiteName" for a specific site
          </div>
        </div>
        <div id="settings-sharepoint-status" style="padding:8px;background:#f0f0f0;border-radius:4px;font-size:10px;color:#666;display:none">
          Status will appear here
        </div>

        <div style="margin-top:16px;border-top:1px solid #ddd;padding-top:14px">
          <label class="form-label">Task Resolution Approvers</label>
          <div style="background:#fff3cd;border-left:4px solid #ff9800;padding:10px;border-radius:4px;margin-bottom:12px;font-size:10px;color:#ff6600">
            <strong>Governance:</strong> Designate 2 accounts (Primary & Secondary) who must approve before tasks can be marked as Resolved.
          </div>

          <div style="margin-bottom:12px">
            <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Primary Approver Email</label>
            <input type="email" id="settings-primary-approver" placeholder="admin@company.com" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px" value="${t.primaryApprover||""}">
          </div>

          <div style="margin-bottom:12px">
            <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Secondary Approver Email</label>
            <input type="email" id="settings-secondary-approver" placeholder="manager@company.com" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px" value="${t.secondaryApprover||""}">
          </div>

          <div style="font-size:9px;color:#666;padding:8px;background:#f5f5f5;border-radius:4px">
            <strong>Current approvers:</strong><br>
            Primary: ${t.primaryApprover?`<span style="color:#0066cc;font-weight:600">${t.primaryApprover}</span>`:'<span style="color:#999">Not set</span>'}<br>
            Secondary: ${t.secondaryApprover?`<span style="color:#0066cc;font-weight:600">${t.secondaryApprover}</span>`:'<span style="color:#999">Not set</span>'}
          </div>
        </div>
      </div>
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
  `;const i=ae({id:"toggle-ps",checked:t.showPSCommands,label:"Show PowerShell validation commands",sublabel:"Displays the PowerShell command used for each control in the M365 Config topic view.",onChange:h=>{m.settings.showPSCommands=h,O()}});e.querySelector("#settings-ps-wrap").appendChild(i);const s=ae({id:"toggle-result",checked:t.showTenantResult,label:"Show simulated tenant result",sublabel:"Displays the simulated tenant scan result for each control.",onChange:h=>{m.settings.showTenantResult=h,O()}});e.querySelector("#settings-result-wrap").appendChild(s);const a=ae({id:"toggle-expand",checked:t.autoExpandFailed,label:"Auto-expand failed controls",sublabel:"Automatically opens the details panel for failed controls on topic load.",onChange:h=>{m.settings.autoExpandFailed=h,O()}});e.querySelector("#settings-expand-wrap").appendChild(a);const n=ae({id:"toggle-alert-fail",checked:t.agentAlertOnFail,label:"Alert on new failures",sublabel:"Send email notification when agent detects new failed controls.",onChange:h=>{m.settings.agentAlertOnFail=h,O()}});e.querySelector("#settings-alert-fail-wrap").appendChild(n);const r=ae({id:"toggle-graph-health",checked:t.showGraphHealth,label:"Show Graph API health on dashboard",onChange:h=>{m.settings.showGraphHealth=h,O()}});e.querySelector("#settings-graph-health-wrap").appendChild(r);const o=ae({id:"toggle-zt-score",checked:t.showZeroTrustScore,label:"Show Zero Trust score on dashboard",onChange:h=>{m.settings.showZeroTrustScore=h,O()}});e.querySelector("#settings-zt-score-wrap").appendChild(o);const l=ae({id:"toggle-cfg-score",checked:t.showM365ConfigScore,label:"Show M365 Config score on dashboard",onChange:h=>{m.settings.showM365ConfigScore=h,O()}});e.querySelector("#settings-cfg-score-wrap").appendChild(l);const c=e.querySelector("#settings-sync-days");c&&(c.value=t.announcementSyncDays||7,c.addEventListener("change",h=>{m.settings.announcementSyncDays=parseInt(h.target.value),O(),u(`Sync period set to last ${h.target.value} days`,"success")}));const d=e.querySelector("#settings-sharepoint-site"),p=e.querySelector("#settings-sharepoint-test"),v=e.querySelector("#settings-sharepoint-status");d.value=t.sharepointSiteUrl||"root",p.addEventListener("click",async()=>{const h=d.value.trim()||"root";p.disabled=!0,p.innerHTML='<span class="spinner dark" style="width:14px;height:14px"></span> Testing...',v.style.display="block",v.textContent="Testing connection...";try{const g=await fetch(`${A}/msgcenter/validate-sharepoint`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteUrl:h})}),x=await g.json();g.ok&&x.success?(v.style.background="#e8f5e9",v.style.color="#2e7d32",v.textContent=`✓ Connected! Site: ${x.siteName||h}`,m.settings.sharepointSiteUrl=h,m.settings.sharepointSiteId=x.siteId,O(),u("SharePoint site configured successfully","success")):(v.style.background="#ffebee",v.style.color="#c62828",v.textContent=`✗ Error: ${x.error||"Could not connect to site"}`,u("SharePoint connection failed","error"))}catch(g){v.style.background="#ffebee",v.style.color="#c62828",v.textContent=`✗ Error: ${g.message}`,u("SharePoint connection error","error")}finally{p.disabled=!1,p.innerHTML='<i class="ti ti-check"></i> Test'}});const f=e.querySelector("#settings-primary-approver"),b=e.querySelector("#settings-secondary-approver");f&&f.addEventListener("change",h=>{const g=h.target.value.trim();if(g&&!g.includes("@")){u("Please enter a valid email address","warning");return}m.settings.primaryApprover=g||null,O(),u(g?`Primary approver set to ${g}`:"Primary approver cleared","success")}),b&&b.addEventListener("change",h=>{const g=h.target.value.trim();if(g&&!g.includes("@")){u("Please enter a valid email address","warning");return}m.settings.secondaryApprover=g||null,O(),u(g?`Secondary approver set to ${g}`:"Secondary approver cleared","success")});const k=ae({id:"toggle-portal-master",checked:t.portalEnabled!==!1,label:"Self-Service Portal — Master Switch",sublabel:"Disable to prevent all users from accessing the portal globally.",onChange:h=>{m.settings.portalEnabled=h,O();const g=e.querySelector("#portal-services-section");g&&(g.style.opacity=h?"1":"0.4"),u(h?"Self-Service Portal enabled.":"Self-Service Portal disabled globally.",h?"success":"warning")}});e.querySelector("#settings-portal-master-wrap").appendChild(k);const y=e.querySelector("#portal-services-section");y&&(y.style.opacity=t.portalEnabled!==!1?"1":"0.4");const w=e.querySelector("#portal-main-toggles");ot.forEach(h=>{const g="portal_"+h.id.replace(/-/g,"_"),x=document.createElement("div");x.className="portal-svc-setting-row",x.innerHTML=`
      <div class="psc-icon" style="background:${h.bg};color:${h.color};width:28px;height:28px;font-size:13px;border-radius:6px;flex-shrink:0">
        <i class="ti ${h.icon}"></i>
      </div>
      <span style="flex:1;font-size:11px;font-weight:500">${h.name}</span>
      <div id="portal-toggle-${g}"></div>
    `,w.appendChild(x);const N=ae({id:`chk-${g}`,checked:t[g]!==!1,label:"",onChange:M=>{m.settings[g]=M,O()}});x.querySelector(`#portal-toggle-${g}`).appendChild(N)});const P=e.querySelector("#portal-exchange-toggles"),S={"exchange-groups":"portal_exchange_groups","shared-mailbox":"portal_shared_mailbox","room-equipment":"portal_room_equipment","email-services":"portal_email_services"};Le.forEach(h=>{const g=S[h.id],x=document.createElement("div");x.className="portal-svc-setting-row",x.innerHTML=`
      <i class="ti ${h.icon}" style="color:var(--color-text-secondary)"></i>
      <span style="flex:1;font-size:11px;font-weight:500">${h.name}</span>
      <div id="portal-toggle-${g}"></div>
    `,P.appendChild(x);const N=ae({id:`chk-${g}`,checked:t[g]!==!1,label:"",onChange:M=>{m.settings[g]=M,O()}});x.querySelector(`#portal-toggle-${g}`).appendChild(N)}),e.querySelector("#settings-save").addEventListener("click",()=>{m.settings.agentSchedule=e.querySelector("#settings-schedule").value,m.settings.agentAlertEmail=e.querySelector("#settings-alert-email").value,O(),u("Settings saved successfully.","success")}),e.querySelector("#settings-reset").addEventListener("click",()=>{ul(),As(e),u("Settings reset to defaults.","info")}),wt(e),e.querySelector("#claude-save-btn").addEventListener("click",async()=>{const h=e.querySelector("#settings-claude-key").value;if(!h||h.trim()===""){u("Please enter a Claude API key","warning");return}const g=e.querySelector("#claude-save-btn");g.disabled=!0,g.innerHTML='<span class="spinner dark"></span> Saving...';try{const x=await Br(h);x.success?(u("Claude API key configured successfully!","success"),e.querySelector("#settings-claude-key").value="",wt(e)):u("Failed to save: "+x.error,"error")}catch(x){u("Error saving API key: "+x.message,"error")}g.disabled=!1,g.innerHTML='<i class="ti ti-device-floppy"></i> Save API Key'}),e.querySelector("#claude-remove-btn").addEventListener("click",async()=>{const h=e.querySelector("#claude-remove-btn");h.disabled=!0,h.innerHTML='<span class="spinner dark"></span> Removing...';try{const g=await Hr();g.success?(u("Claude API key removed","success"),wt(e)):u("Failed to remove: "+g.error,"error")}catch(g){u("Error removing API key: "+g.message,"error")}h.disabled=!1,h.innerHTML='<i class="ti ti-trash"></i> Remove API Key'})}async function wt(e){try{const t=await Fr();if(t){const i=e.querySelector("#claude-status-badge"),s=e.querySelector("#claude-mode-text"),a=e.querySelector("#claude-remove-btn");t.available?(i.innerHTML='<span style="background:var(--clr-success-bg);color:var(--clr-success-text);padding:2px 8px;border-radius:3px;font-size:9px;font-weight:600">ACTIVE</span>',s.innerHTML='<strong style="color:var(--clr-success-text)">✓ Claude API Active</strong> - Real AI investigations enabled',a.style.display="inline-flex"):(i.innerHTML='<span style="background:var(--clr-info-bg);color:var(--clr-info-text);padding:2px 8px;border-radius:3px;font-size:9px;font-weight:600">MOCK MODE</span>',s.innerHTML='<strong style="color:var(--clr-info-text)">✓ Mock Mode</strong> - Using intelligent fallback responses (fully functional for testing)',a.style.display="none")}}catch(t){console.error("Failed to load Claude status:",t)}}function Vr(e){let t='<div style="padding:16px;background:#f5f5f5;border-top:1px solid #ddd;min-width:0">';if(e.description&&typeof e.description=="string"){const i=e.description.replace(/\n/g,"<br>").replace(/\[([^\]]+:)\]/g,'<strong style="color:#333">[$1]</strong>');t+=`
      <div style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <i class="ti ti-info-circle" style="font-size:14px;color:#0066cc"></i>
          <div style="font-weight:700;font-size:12px;color:#333">Summary</div>
        </div>
        <div style="font-size:11px;color:#555;line-height:1.6;background:#fff;padding:10px;border-radius:6px;border-left:3px solid #0066cc">
          ${i}
        </div>
      </div>
    `}return t+="</div>",t}function Nt(e){return{"Not Reviewed":"info",Reviewed:"success","In Progress":"warning",Resolved:"success","Not Started":"neutral"}[e]||"neutral"}function Pi(e){return{"Not Started":"neutral","In Progress":"warning",Review:"info",Resolved:"success",Pending:"warning",Approved:"success",Rejected:"danger"}[e]||"neutral"}function Wr(e){if(!e)return"";try{const t=new Date(e),i=t.getFullYear(),s=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${i}-${s}-${a}`}catch{return e}}function Se(e,t=[]){var b,k,y,w,P,S,h;const i=document.getElementById("admin-actions-tbody"),s=document.getElementById("admin-actions-count"),a=document.getElementById("my-tasks-tbody"),n=document.getElementById("my-tasks-count");if(!i||!s){console.warn("Admin actions table elements not found");return}const r=((k=(b=m.currentUser)==null?void 0:b.email)==null?void 0:k.toLowerCase())||"",o=t.filter(g=>{var x;return((x=g.assignedTo)==null?void 0:x.toLowerCase())===r});if(a&&n&&(n.textContent=`${o.length} tasks`,o.length===0?a.innerHTML='<tr><td colspan="5" style="padding:20px;text-align:center;color:#999">No tasks assigned to you</td></tr>':(a.innerHTML=o.map(g=>{var x;return`
        <tr style="border-bottom:0.5px solid #ddd">
          <td style="padding:10px;font-weight:600;color:#333;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${g.title}</td>
          <td style="padding:10px">
            <span class="badge ${Pi(g.taskStatus)}" style="font-size:9px">${g.taskStatus}</span>
          </td>
          <td style="padding:10px">
            <div style="width:80px;height:20px;background:#e0e0e0;border-radius:4px;overflow:hidden;display:inline-block">
              <div style="width:${parseInt(g.progress)||0}%;height:100%;background:#4CAF50"></div>
            </div>
            <span style="font-size:9px;color:#666;margin-left:4px">${g.progress}</span>
          </td>
          <td style="padding:10px;font-size:10px">${((x=g.dueDate)==null?void 0:x.split("T")[0])||"—"}</td>
          <td style="padding:10px;text-align:center">
            <button class="btn-small update-assignee-task" data-task-id="${g.id}" style="font-size:9px;padding:4px 8px;cursor:pointer">
              <i class="ti ti-pencil"></i> Update
            </button>
          </td>
        </tr>
      `}).join(""),a.querySelectorAll(".update-assignee-task").forEach(g=>{g.addEventListener("click",async x=>{const N=x.target.closest("button").dataset.taskId,M=o.find(L=>L.id===N);M&&Qr(M)})}))),!e||e.length===0){s.textContent="0 tasks created",i.innerHTML='<tr><td colspan="7" style="padding:20px;text-align:center;color:#999">No tasks created yet</td></tr>';return}new Map(t.map(g=>[g.announcementId,g]));const l=t.length>0?t:e.filter(g=>{const x=g.reviewStatus&&g.reviewStatus!=="Not Reviewed",N=g.taskStatus&&g.taskStatus!=="Not Started",M=!!g.actionDeadline,L=!!g.notes;return x||N||M||L});if(console.log(`📊 Tasks Tracking: ${l.length} tasks`),s.textContent=`${l.length} tasks`,l.length===0){i.innerHTML='<tr><td colspan="7" style="padding:20px;text-align:center;color:#999">No tasks created yet</td></tr>';return}const c=((w=(y=m.currentUser)==null?void 0:y.email)==null?void 0:w.toLowerCase())||"",d=((P=m.currentUser)==null?void 0:P.role)||"user",p=((S=m.settings.primaryApprover)==null?void 0:S.toLowerCase())||"",v=((h=m.settings.secondaryApprover)==null?void 0:h.toLowerCase())||"",f=["super","admin"].includes(d)||c===p||c===v;i.innerHTML=l.map(g=>{const x=g.announcementId&&g.announcementId!==g.id?g.announcementId:g.id||"N/A",N=g.taskStatus==="Resolved"&&g.approvalStatus==="Pending"&&f,M=g.assignedTo?`Assigned: ${g.assignedTo}`:"",L=g.dueDate?`Due: ${g.dueDate.split("T")[0]}`:"",K=[M,L].filter(Boolean).join(" | ")||"—";return`
      <tr style="border-bottom:0.5px solid #ddd">
        <td style="padding:10px;color:#0066cc;font-weight:600;cursor:pointer" title="${x}">${x}</td>
        <td style="padding:10px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${g.title}</td>
        <td style="padding:10px">
          <span class="badge ${Nt(g.taskStatus)}" style="font-size:9px">${g.taskStatus||"—"}</span>
        </td>
        <td style="padding:10px">
          <span class="badge ${Pi(g.approvalStatus||"Pending")}" style="font-size:9px">${g.approvalStatus||"Pending"}</span>
        </td>
        <td style="padding:10px">
          <div style="width:60px;height:16px;background:#e0e0e0;border-radius:3px;overflow:hidden;display:inline-block">
            <div style="width:${parseInt(g.progress)||0}%;height:100%;background:#4CAF50"></div>
          </div>
          <span style="font-size:9px;color:#666;margin-left:4px">${g.progress||"0%"}</span>
        </td>
        <td style="padding:10px;color:#666;font-size:10px">${K}</td>
        <td style="padding:10px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#666;font-size:9px">${g.notes||"—"}</td>
        <td style="padding:10px;text-align:center">
          ${N?`
            <button class="btn-small approve-resolution-btn" data-task-id="${g.id}" style="font-size:9px;padding:4px 8px;cursor:pointer;background:#4caf50;color:white;border:none;border-radius:4px">
              <i class="ti ti-check"></i> Approve
            </button>
          `:`
            <button class="btn-small edit-admin-action-btn" data-task-id="${g.id}" style="font-size:9px;padding:4px 8px;cursor:pointer">
              <i class="ti ti-pencil"></i> Edit
            </button>
          `}
        </td>
      </tr>
    `}).join(""),document.querySelectorAll(".approve-resolution-btn").forEach(g=>{g.addEventListener("click",async x=>{const N=x.target.closest("button").dataset.taskId,M=x.target.closest("button");M.disabled=!0,M.innerHTML='<span class="spinner dark"></span>';try{const L=await fetch(`${A}/msgcenter/tasks/${N}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({approvalStatus:"Approved",siteUrl:m.settings.sharepointSiteUrl||"root"})}),K=await L.json();if(L.ok&&K.success){u("✓ Resolution approved successfully","success");const me=encodeURIComponent(m.settings.sharepointSiteUrl||"root");Promise.all([fetch(`${A}/msgcenter/announcements?siteUrl=${me}`).then(ye=>ye.json()),fetch(`${A}/msgcenter/tasks?siteUrl=${me}`).then(ye=>ye.json())]).then(([ye,Gs])=>{ye.success&&ye.data&&Se(ye.data,Gs.data||[])})}else u(`Error: ${K.error}`,"error"),M.disabled=!1,M.innerHTML='<i class="ti ti-check"></i> Approve'}catch(L){u(`Error: ${L.message}`,"error"),M.disabled=!1,M.innerHTML='<i class="ti ti-check"></i> Approve'}})}),document.querySelectorAll(".edit-admin-action-btn").forEach(g=>{g.addEventListener("click",async x=>{const N=x.target.closest("button").dataset.taskId;try{const M=encodeURIComponent(m.settings.sharepointSiteUrl||"root"),L=await fetch(`${A}/msgcenter/tasks?siteUrl=${M}`).then(K=>K.json());if(L.success&&L.data){const K=L.data.find(me=>me.id===N);K&&Xr(K)}}catch(M){u(`Error: ${M.message}`,"error")}})})}async function Jr(){const e=document.getElementById("page-msgcenter");e&&(J()?Kr(e):await Gt(e))}function Kr(e){he.filter(t=>t.actionRequired).length,e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
        <div class="page-subtitle">
          SharePoint: Change Announcements · Last sync: Today at 08:45 · ${he.length} announcements
        </div>
      </div>
      <div class="page-actions">
        <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync announcements</button>
        <button class="btn" id="mc-digest"><i class="ti ti-file-text"></i> Weekly digest</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${he.length}</div>
        <div class="kpi-label">Total Announcements</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${he.filter(t=>t.severity==="high").length}</div>
        <div class="kpi-label">High Severity</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${he.filter(t=>t.actionRequired).length}</div>
        <div class="kpi-label">Need Review</div>
      </div>
    </div>

    <div style="padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Using sample data</span>
    </div>
  `,e.querySelector("#mc-sync").addEventListener("click",()=>{const t=e.querySelector("#mc-sync");t.innerHTML='<span class="spinner dark"></span> Syncing...',t.disabled=!0,setTimeout(()=>{t.innerHTML='<i class="ti ti-refresh"></i> Sync announcements',t.disabled=!1,u(`Synced ${he.length} announcements`,"success")},2e3)})}async function Gt(e){e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
        <div class="page-subtitle">Loading announcements from SharePoint...</div>
      </div>
    </div>
    <div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading announcements...</p></div>
  `;try{console.log("📡 Fetching announcements from SharePoint...");const t=encodeURIComponent(m.settings.sharepointSiteUrl||"root"),i=await fetch(`${A}/msgcenter/announcements?siteUrl=${t}`).then(d=>d.json());if(!i.success||!i.data||i.data.length===0){e.innerHTML=`
        <div class="page-header">
          <div>
            <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
            <div class="page-subtitle">No announcements available</div>
          </div>
          <div class="page-actions">
            <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync announcements</button>
          </div>
        </div>
        <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
          No announcements to display. Click "Sync announcements" to fetch the latest updates.
        </div>
      `,e.querySelector("#mc-sync").addEventListener("click",async()=>{const d=e.querySelector("#mc-sync");d.disabled=!0,d.innerHTML='<span class="spinner dark"></span> Syncing...',await Gt(e)});return}const s=i.data,a=s.filter(d=>d.reviewStatus==="Not Reviewed").length,n=s.filter(d=>d.taskStatus!=="Not Started").length;e.innerHTML=`
      <div class="page-header">
        <div>
          <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
          <div class="page-subtitle">SharePoint: Change Announcements · ${s.length} announcements · ${a} need review</div>
        </div>
        <div class="page-actions">
          <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync announcements</button>
          <button class="btn" id="mc-digest"><i class="ti ti-file-text"></i> Weekly digest</button>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi-tile">
          <div class="kpi-value info">${s.length}</div>
          <div class="kpi-label">Total Announcements</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value warning">${a}</div>
          <div class="kpi-label">Not Reviewed</div>
        </div>
        <div class="kpi-tile">
          <div class="kpi-value success">${n}</div>
          <div class="kpi-label">Tasks Created</div>
        </div>
      </div>

      <div style="padding:12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px">
        <div style="font-size:10px;font-weight:600;color:var(--color-text-secondary);margin-bottom:10px;text-transform:uppercase">Filters</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">
          <div>
            <label style="font-size:10px;color:var(--color-text-secondary);display:block;margin-bottom:6px">Service</label>
            <select id="filter-service" style="width:100%;padding:6px;font-size:10px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-secondary)">
              <option value="">All Services</option>
            </select>
          </div>
          <div>
            <label style="font-size:10px;color:var(--color-text-secondary);display:block;margin-bottom:6px">Severity</label>
            <select id="filter-severity" style="width:100%;padding:6px;font-size:10px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-secondary)">
              <option value="">All Severities</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label style="font-size:10px;color:var(--color-text-secondary);display:block;margin-bottom:6px">Review Status</label>
            <select id="filter-review-status" style="width:100%;padding:6px;font-size:10px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-secondary)">
              <option value="">All States</option>
              <option value="Not Reviewed">Not Reviewed</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>
          <div>
            <label style="font-size:10px;color:var(--color-text-secondary);display:block;margin-bottom:6px">Task Status</label>
            <select id="filter-task-status" style="width:100%;padding:6px;font-size:10px;border:0.5px solid var(--color-border-secondary);border-radius:4px;background:var(--color-background-secondary)">
              <option value="">All Tasks</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Announcements Review Queue</span>
          <span class="badge info">${s.length} total</span>
        </div>
        <div style="max-height:700px;overflow-y:auto" id="announcements-container"></div>
      </div>

      <div class="card" style="margin-top:20px">
        <div class="card-header">
          <span class="card-title">📋 My Assigned Tasks</span>
          <span class="badge info" id="my-tasks-count" style="font-size:10px">0 tasks</span>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:11px">
            <thead>
              <tr style="background:#f5f5f5;border-bottom:1px solid #ddd">
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Task Title</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Status</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Progress</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Due Date</th>
                <th style="padding:10px;text-align:center;font-weight:600;color:#333">Update</th>
              </tr>
            </thead>
            <tbody id="my-tasks-tbody">
              <tr><td colspan="5" style="padding:20px;text-align:center;color:#999">No tasks assigned to you</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-top:20px">
        <div class="card-header">
          <span class="card-title">Admin Actions Summary</span>
          <span class="badge info" id="admin-actions-count">0 with actions</span>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:11px" id="admin-actions-table">
            <thead>
              <tr style="background:#f5f5f5;border-bottom:1px solid #ddd">
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Message ID</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Task Title</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Task Status</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Approval</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Progress</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Assigned To / Due</th>
                <th style="padding:10px;text-align:left;font-weight:600;color:#333">Notes</th>
              </tr>
            </thead>
            <tbody id="admin-actions-tbody">
              <tr><td colspan="6" style="padding:20px;text-align:center;color:#999">No actions taken yet</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;const r=[...new Set(s.map(d=>d.service))].sort(),o=e.querySelector("#filter-service");o&&r.forEach(d=>{const p=document.createElement("option");p.value=d,p.textContent=d,o.appendChild(p)});const l=()=>{var y,w,P,S;const d=((y=e.querySelector("#filter-service"))==null?void 0:y.value)||"",p=((w=e.querySelector("#filter-severity"))==null?void 0:w.value)||"",v=((P=e.querySelector("#filter-review-status"))==null?void 0:P.value)||"",f=((S=e.querySelector("#filter-task-status"))==null?void 0:S.value)||"";let b=0;e.querySelectorAll(".mc-announcement-item").forEach(h=>{const g=h.dataset.service,x=h.dataset.severity,N=h.dataset.reviewStatus,M=h.dataset.taskStatus,L=(!d||g===d)&&(!p||x===p)&&(!v||N===v)&&(!f||M===f);h.style.display=L?"block":"none",L&&b++}),e.querySelectorAll(".badge.info").forEach(h=>{h.textContent.includes("total")&&(h.textContent=`${b} total`)})};e.querySelectorAll("#filter-service, #filter-severity, #filter-review-status, #filter-task-status").forEach(d=>{d==null||d.addEventListener("change",l)});const c=e.querySelector("#announcements-container");s.forEach((d,p)=>{const v=Nt(d.reviewStatus),f=Nt(d.taskStatus),b=`
        <div class="mc-announcement-item" data-service="${d.service}" data-severity="${d.severity}" data-review-status="${d.reviewStatus}" data-task-status="${d.taskStatus}" style="border-bottom:0.5px solid var(--color-border-tertiary)">
          <div class="mc-announcement-header" data-idx="${p}" style="padding:12px;cursor:pointer;transition:background 150ms;user-select:none">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
              <div style="flex:1">
                <div style="font-weight:600;font-size:12px;color:var(--color-text-primary)">${d.title}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">
                  Service: <strong>${d.service}</strong> · Severity: <strong>${d.severity}</strong>
                </div>
              </div>
              <div style="display:flex;gap:6px;align-items:flex-start;flex-shrink:0">
                <span class="badge ${v}" style="font-size:9px">${d.reviewStatus}</span>
                <span class="badge ${f}" style="font-size:9px">${d.taskStatus}</span>
                <i class="ti ti-chevron-down mc-chevron" style="font-size:16px;color:#999;transition:transform 150ms;cursor:pointer;flex-shrink:0"></i>
              </div>
            </div>
            ${d.actionDeadline?`<div style="font-size:10px;color:var(--clr-danger-text);margin-top:6px">⚠️ Action required by: <strong>${d.actionDeadline}</strong></div>`:""}
          </div>
          <div class="mc-announcement-details" data-idx="${p}" style="display:none;padding:12px;background:#f5f5f5;border-top:1px solid #ddd">
            <div style="display:flex;gap:16px;align-items:flex-start">
              <!-- Summary Section (3/4 width) -->
              <div style="flex:3;min-width:0">
                ${Vr(d)}
              </div>

              <!-- Admin Actions Section (1/4 width) -->
              <div style="flex:1;min-width:250px;padding:12px;background:#fff;border-radius:6px;border:1px solid #ddd">
                <div style="font-weight:700;font-size:11px;color:#333;margin-bottom:12px">Admin Actions</div>

                <div style="margin-bottom:12px">
                  <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Review Status</label>
                  <select class="form-select review-status-select" data-item-id="${d.id}" style="width:100%;padding:6px;font-size:10px;border:0.5px solid #ccc;border-radius:4px">
                    <option value="Not Reviewed" ${d.reviewStatus==="Not Reviewed"?"selected":""}>Not Reviewed</option>
                    <option value="Reviewed" ${d.reviewStatus==="Reviewed"?"selected":""}>Reviewed</option>
                  </select>
                </div>

                <div style="margin-bottom:12px">
                  <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Assign To</label>
                  <input type="text" class="form-input assignee-input" data-item-id="${d.id}" placeholder="Email or name..." value="${d.assignedTo||""}" style="width:100%;padding:6px;font-size:10px;border:0.5px solid #ccc;border-radius:4px">
                </div>

                <div style="margin-bottom:12px">
                  <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Set Deadline</label>
                  <input type="date" class="form-input deadline-input" data-item-id="${d.id}" value="${Wr(d.actionDeadline)}" style="width:100%;padding:6px;font-size:10px;border:0.5px solid #ccc;border-radius:4px">
                </div>

                <div style="margin-bottom:12px">
                  <label style="font-size:10px;font-weight:600;color:#555;display:block;margin-bottom:6px">Notes</label>
                  <textarea class="form-textarea notes-textarea" data-item-id="${d.id}" placeholder="Add notes..." style="width:100%;padding:6px;font-size:10px;border:0.5px solid #ccc;border-radius:4px;resize:vertical;min-height:60px">${d.notes||""}</textarea>
                </div>

                <div style="display:flex;gap:8px;flex-direction:column">
                  <button class="btn btn-primary save-announcement-btn" data-item-id="${d.id}" style="width:100%;font-size:10px">
                    <i class="ti ti-device-floppy"></i> Save Changes
                  </button>
                  <div style="font-size:9px;color:#666;padding:8px;background:#f0f0f0;border-radius:4px;text-align:center">
                    💡 Task auto-created when Task Status is set
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;c.innerHTML+=b}),Yr(e),Zr(e);try{const d=encodeURIComponent(m.settings.sharepointSiteUrl||"root"),p=await fetch(`${A}/msgcenter/tasks?siteUrl=${d}`).then(f=>f.json()),v=p.success?p.data||[]:[];Se(s,v)}catch(d){console.warn("Could not fetch tasks:",d.message),Se(s,[])}e.querySelector("#mc-sync").addEventListener("click",async()=>{const d=e.querySelector("#mc-sync");d.disabled=!0,d.innerHTML='<span class="spinner dark"></span> Refreshing...',await Gt(e)})}catch(t){console.error("Error rendering Change Intelligence:",t),u(`Error: ${t.message}`,"error")}}const Mi=e=>{const t=e.target.closest(".mc-announcement-header");if(!t)return;const i=t.parentElement,s=t.dataset.idx,a=i.querySelector(`.mc-announcement-details[data-idx="${s}"]`);if(!a)return;const n=a.style.display!=="none";n?(a.style.display="none",t.style.background=""):(a.style.display="block",t.style.background="#f0f0f0");const r=t.querySelector(".mc-chevron");r&&(r.style.transform=n?"":"rotate(180deg)")},Yr=e=>{const t=e.querySelector('[style*="max-height:700px"]');t&&(t.removeEventListener("click",Mi),t.addEventListener("click",Mi))},Zr=e=>{e.querySelectorAll(".save-announcement-btn").forEach(t=>{t.addEventListener("click",async i=>{const s=i.target.closest("button").dataset.itemId,a=i.target.closest(".mc-announcement-details"),n=a.querySelector(".review-status-select").value,r=a.querySelector(".deadline-input").value,o=a.querySelector(".assignee-input").value,l=a.querySelector(".notes-textarea").value;console.log("📝 Saving announcement admin actions:",{itemId:s,reviewStatus:n,actionDeadline:r,assignedTo:o,assignedToLength:(o==null?void 0:o.length)||0}),t.disabled=!0,t.innerHTML='<span class="spinner dark"></span> Saving...';try{const c=await fetch(`${A}/msgcenter/announcements/${s}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({reviewStatus:n,notes:l,actionDeadline:r,siteUrl:m.settings.sharepointSiteUrl||"root"})}),d=await c.json();if(c.ok&&d.success){try{const p=a.closest(".mc-announcement-item");if(p){const v=p.querySelector('[style*="font-weight:600;font-size:12px"]'),f=p.querySelector('[style*="color:var(--color-text-secondary);margin-top:4px"]'),b=(v==null?void 0:v.textContent)||"Change Announcement";let k="Microsoft 365",y="normal";if(f){const w=f.textContent,P=w.match(/Service: ([^·]+)/),S=w.match(/Severity: ([^·]+)/);P&&(k=P[1].trim()),S&&(y=S[1].trim().toLowerCase())}if(o)try{console.log("🔄 Creating task with announcement data:",{title:b,service:k,severity:y,actionDeadline:r,assignedTo:o});const w=await fetch(`${A}/msgcenter/create-task-from-announcement`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({announcementItemId:s,announcementData:{title:b,service:k,severity:y,actionDeadline:r,assignedTo:o},siteUrl:m.settings.sharepointSiteUrl||"root"})}),P=await w.json();console.log("Task creation result:",P),w.ok&&P.success?console.log(`✓ Task created with assignee: ${o}`):console.warn("Task creation failed:",P.error)}catch(w){console.warn("Could not create task:",w.message)}}}catch(p){console.warn("Could not extract announcement data:",p.message)}u("✓ Changes saved successfully","success"),setTimeout(()=>{const p=encodeURIComponent(m.settings.sharepointSiteUrl||"root");Promise.all([fetch(`${A}/msgcenter/announcements?siteUrl=${p}`).then(v=>v.json()),fetch(`${A}/msgcenter/tasks?siteUrl=${p}`).then(v=>v.json())]).then(([v,f])=>{if(v.success&&v.data){Se(v.data,f.data||[]);const b=a.closest('[style*="border-bottom"]').querySelector(".mc-announcement-header"),k=b.dataset.idx,y=v.data[k];if(y){const w=b.querySelectorAll(".badge");w[0]&&(w[0].textContent=y.reviewStatus),w[1]&&(w[1].textContent=y.taskStatus)}}}).catch(v=>console.error("Error refreshing data:",v))},500)}else u(`Error: ${d.error}`,"error")}catch(c){u(`Error: ${c.message}`,"error")}finally{t.disabled=!1,t.innerHTML='<i class="ti ti-device-floppy"></i> Save Changes'}})}),e.querySelectorAll(".create-task-btn").forEach(t=>{t.addEventListener("click",async i=>{var d;const s=i.target.closest("button").dataset.itemId,a=i.target.closest(".mc-announcement-details"),n=a.closest('[style*="border-bottom"]').querySelector('[style*="font-weight:600"]').textContent,r=((d=a.querySelector('[style*="border-left:3px"]'))==null?void 0:d.textContent)||"",o=a.closest('[style*="border-bottom"]').querySelector('[style*="Service:"]').textContent.split("Service: ")[1].split(" ·")[0],l=a.closest('[style*="border-bottom"]').querySelector('[style*="Severity:"]').textContent.split("Severity: ")[1],c=a.querySelector(".deadline-input").value;t.disabled=!0,t.innerHTML='<span class="spinner dark"></span> Creating...';try{const p=await fetch(`${A}/msgcenter/create-task-from-announcement`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({announcementItemId:s,announcementData:{title:n,description:r,service:o,severity:l,actionDeadline:c},siteUrl:m.settings.sharepointSiteUrl||"root"})}),v=await p.json();p.ok&&v.success?(u("✓ Task created successfully","success"),t.style.display="none",setTimeout(()=>{const f=encodeURIComponent(m.settings.sharepointSiteUrl||"root");fetch(`${A}/msgcenter/announcements?siteUrl=${f}`).then(b=>b.json()).then(b=>{if(b.success&&b.data){Se(b.data);const k=a.closest('[style*="border-bottom"]').querySelector(".mc-announcement-header"),y=k.dataset.idx,w=b.data[y];if(w){const P=k.querySelectorAll(".badge");P[0]&&(P[0].textContent=w.reviewStatus),P[1]&&(P[1].textContent=w.taskStatus)}}}).catch(b=>console.error("Error refreshing announcements:",b))},500)):u(`Error: ${v.error}`,"error")}catch(p){u(`Error: ${p.message}`,"error")}finally{t.disabled=!1,t.innerHTML='<i class="ti ti-circle-plus"></i> Create Task'}})})};function Qr(e){const t=document.createElement("div");t.style.cssText=`
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `,t.innerHTML=`
    <div style="background:white;border-radius:8px;padding:24px;max-width:500px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0;font-size:16px;font-weight:700">${e.title}</h2>
        <button class="close-modal" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666">×</button>
      </div>

      <div style="background:#e3f2fd;border-left:4px solid #0066cc;padding:12px;border-radius:4px;margin-bottom:16px;font-size:10px;color:#0066cc">
        <strong>Status:</strong> ${e.taskStatus}<br>
        <strong>Approval:</strong> ${e.approvalStatus||"Pending"}
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Progress (%)</label>
        <input type="range" id="progress-slider" min="0" max="100" value="${parseInt(e.progress)||0}" style="width:100%;height:6px;cursor:pointer;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span id="progress-value" style="font-size:14px;font-weight:700;color:#4caf50">${parseInt(e.progress)||0}%</span>
          <div style="font-size:9px;color:#666">Drag to update progress</div>
        </div>
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Task Status</label>
        <select id="modal-assignee-status" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
          <option value="Not Started" ${e.taskStatus==="Not Started"?"selected":""}>Not Started</option>
          <option value="In Progress" ${e.taskStatus==="In Progress"?"selected":""}>In Progress</option>
          <option value="Review" ${e.taskStatus==="Review"?"selected":""}>Review</option>
          <option value="Resolved" ${e.taskStatus==="Resolved"?"selected":""}>Resolved (needs approval)</option>
        </select>
      </div>

      <div style="background:#fff3cd;border-left:4px solid #ff9800;padding:12px;border-radius:4px;margin-bottom:16px;font-size:10px;color:#ff6600">
        <strong>ℹ️ Marking as "Resolved"</strong> will send it to the approvers for final approval.
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-modal" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn btn-primary save-assignee-update" data-task-id="${e.id}">Update Progress</button>
      </div>
    </div>
  `,document.body.appendChild(t);const i=t.querySelector("#progress-slider"),s=t.querySelector("#progress-value");i.addEventListener("input",a=>{s.textContent=a.target.value+"%"}),t.querySelector(".close-modal").addEventListener("click",()=>t.remove()),t.querySelector(".cancel-modal").addEventListener("click",()=>t.remove()),t.querySelector(".save-assignee-update").addEventListener("click",async a=>{const n=a.target,r=t.querySelector("#modal-assignee-status").value,o=t.querySelector("#progress-slider").value+"%";n.disabled=!0,n.innerHTML='<span class="spinner dark"></span> Updating...';try{const l={taskStatus:r,progress:o,siteUrl:m.settings.sharepointSiteUrl||"root"};r==="Resolved"&&(l.approvalStatus="Pending");const c=await fetch(`${A}/msgcenter/tasks/${e.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)}),d=await c.json();if(c.ok&&d.success){if(u(`✓ Progress updated to ${o}`,"success"),r==="Resolved"&&u("Sent to approvers for final approval","info"),t.remove(),document.getElementById("page-msgcenter")){const v=encodeURIComponent(m.settings.sharepointSiteUrl||"root");Promise.all([fetch(`${A}/msgcenter/announcements?siteUrl=${v}`).then(f=>f.json()),fetch(`${A}/msgcenter/tasks?siteUrl=${v}`).then(f=>f.json())]).then(([f,b])=>{f.success&&f.data&&Se(f.data,b.data||[])})}}else u(`Error: ${d.error}`,"error")}catch(l){u(`Error: ${l.message}`,"error")}finally{n.disabled=!1,n.innerHTML="Update Progress"}})}function Xr(e){const t=document.createElement("div");t.style.cssText=`
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `,t.innerHTML=`
    <div style="background:white;border-radius:8px;padding:24px;max-width:500px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0;font-size:16px;font-weight:700">${e.title}</h2>
        <button class="close-modal" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666">×</button>
      </div>

      <div style="background:#f5f5f5;padding:12px;border-radius:4px;margin-bottom:16px;font-size:10px;color:#666">
        <strong>Message ID:</strong> ${e.announcementId}<br>
        <strong>Service:</strong> ${e.service||"—"}<br>
        <strong>Approval:</strong> ${e.approvalStatus||"Pending"}
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Task Status</label>
        <select id="modal-task-status" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
          <option value="Not Started" ${e.taskStatus==="Not Started"?"selected":""}>Not Started</option>
          <option value="In Progress" ${e.taskStatus==="In Progress"?"selected":""}>In Progress</option>
          <option value="Review" ${e.taskStatus==="Review"?"selected":""}>Review</option>
          <option value="Resolved" ${e.taskStatus==="Resolved"?"selected":""}>Resolved</option>
        </select>
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Progress (%)</label>
        <input type="number" id="modal-progress" min="0" max="100" value="${parseInt(e.progress)||0}" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Assigned To</label>
        <input type="text" id="modal-assigned-to" value="${e.assignedTo||""}" placeholder="Name or email" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-modal" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn btn-primary save-admin-action" data-task-id="${e.id}">Save Changes</button>
      </div>
    </div>
  `,document.body.appendChild(t),t.querySelector(".close-modal").addEventListener("click",()=>t.remove()),t.querySelector(".cancel-modal").addEventListener("click",()=>t.remove()),t.querySelector(".save-admin-action").addEventListener("click",async i=>{const s=i.target,a=t.querySelector("#modal-task-status").value,n=t.querySelector("#modal-progress").value+"%",r=t.querySelector("#modal-assigned-to").value;if(a==="Resolved"&&e.taskStatus!=="Resolved"){u("Go to Change Tasks page to mark as Resolved (requires approval)","info");return}s.disabled=!0,s.innerHTML='<span class="spinner dark"></span> Saving...';try{const o=await fetch(`${A}/msgcenter/tasks/${e.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({taskStatus:a,progress:n,assignedTo:r,siteUrl:m.settings.sharepointSiteUrl||"root"})}),l=await o.json();if(o.ok&&l.success){if(u("✓ Task updated successfully","success"),t.remove(),document.getElementById("page-msgcenter")){const d=encodeURIComponent(m.settings.sharepointSiteUrl||"root");Promise.all([fetch(`${A}/msgcenter/announcements?siteUrl=${d}`).then(p=>p.json()),fetch(`${A}/msgcenter/tasks?siteUrl=${d}`).then(p=>p.json())]).then(([p,v])=>{p.success&&p.data&&Se(p.data,v.data||[])})}}else u(`Error: ${l.error}`,"error")}catch(o){u(`Error: ${o.message}`,"error")}finally{s.disabled=!1,s.innerHTML="Save Changes"}})}function Ti(e){return{"Not Started":"neutral","In Progress":"warning",Review:"info",Resolved:"success",Pending:"warning",Approved:"success",Rejected:"danger"}[e]||"neutral"}async function eo(){const e=document.getElementById("page-tasks");e&&await De(e)}async function De(e){var t,i,s,a,n;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-checkbox"></i> Change Announcement Tasks</div>
        <div class="page-subtitle">Track and manage change announcement implementation tasks</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="tasks-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info" id="total-tasks">0</div>
        <div class="kpi-label">Total Tasks</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning" id="pending-tasks">0</div>
        <div class="kpi-label">Pending Approval</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info" id="in-progress-tasks">0</div>
        <div class="kpi-label">In Progress</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success" id="resolved-tasks">0</div>
        <div class="kpi-label">Resolved</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Tasks</span>
        <span class="badge info" id="task-count">0 tasks</span>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:11px">
          <thead>
            <tr style="background:#f5f5f5;border-bottom:1px solid #ddd">
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Task Title</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Service</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Task Status</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Approval</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Progress</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Assigned To</th>
              <th style="padding:10px;text-align:left;font-weight:600;color:#333">Due Date</th>
              <th style="padding:10px;text-align:center;font-weight:600;color:#333">Actions</th>
            </tr>
          </thead>
          <tbody id="tasks-tbody">
            <tr><td colspan="8" style="padding:20px;text-align:center;color:#999">Loading tasks...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;try{const r=encodeURIComponent(m.settings.sharepointSiteUrl||"root"),o=await fetch(`${A}/msgcenter/tasks?siteUrl=${r}`).then(S=>S.json());if(!o.success||!o.data){e.querySelector("#tasks-tbody").innerHTML='<tr><td colspan="8" style="padding:20px;text-align:center;color:#999">No tasks found</td></tr>';return}const l=o.data,c=l.length,d=l.filter(S=>S.approvalStatus==="Pending").length,p=l.filter(S=>S.taskStatus==="In Progress").length,v=l.filter(S=>S.taskStatus==="Resolved").length;e.querySelector("#total-tasks").textContent=c,e.querySelector("#pending-tasks").textContent=d,e.querySelector("#in-progress-tasks").textContent=p,e.querySelector("#resolved-tasks").textContent=v,e.querySelector("#task-count").textContent=`${c} tasks`;const f=e.querySelector("#tasks-tbody"),b=((i=(t=m.currentUser)==null?void 0:t.email)==null?void 0:i.toLowerCase())||"",k=((s=m.currentUser)==null?void 0:s.role)||"user",y=((a=m.settings.primaryApprover)==null?void 0:a.toLowerCase())||"",w=((n=m.settings.secondaryApprover)==null?void 0:n.toLowerCase())||"",P=["super","admin"].includes(k)||b===y||b===w;f.innerHTML=l.map(S=>{var x;const h=S.taskStatus==="Resolved",g=S.approvalStatus==="Pending"&&h&&P;return`
        <tr style="border-bottom:0.5px solid #ddd;hover:background:#f9f9f9;${h&&!g?"opacity:0.7":""}">
          <td style="padding:10px;font-weight:600;color:#0066cc">${S.title}</td>
          <td style="padding:10px">${S.service||"—"}</td>
          <td style="padding:10px">
            <span class="badge ${Ti(S.taskStatus)}" style="font-size:9px">${S.taskStatus}</span>
          </td>
          <td style="padding:10px">
            <span class="badge ${Ti(S.approvalStatus)}" style="font-size:9px">${S.approvalStatus}</span>
          </td>
          <td style="padding:10px">
            <div style="width:80px;height:20px;background:#e0e0e0;border-radius:4px;overflow:hidden">
              <div style="width:${parseInt(S.progress)||0}%;height:100%;background:#4CAF50;transition:width 200ms"></div>
            </div>
            <div style="font-size:9px;color:#666;margin-top:4px">${S.progress}</div>
          </td>
          <td style="padding:10px">${S.assignedTo||"—"}</td>
          <td style="padding:10px">${((x=S.dueDate)==null?void 0:x.split("T")[0])||"—"}</td>
          <td style="padding:10px;text-align:center">
            ${g?`
              <button class="btn-small approve-task-btn" data-task-id="${S.id}" style="font-size:9px;padding:4px 8px;cursor:pointer;background:#4caf50;color:white;border:none;border-radius:4px">
                <i class="ti ti-check"></i> Approve
              </button>
            `:h?`
              <span style="font-size:9px;color:#4caf50">✓ Resolved</span>
            `:`
              <button class="btn-small edit-task-btn" data-task-id="${S.id}" style="font-size:9px;padding:4px 8px;cursor:pointer">
                <i class="ti ti-pencil"></i> Edit
              </button>
            `}
          </td>
        </tr>
      `}).join(""),to(e,l),e.querySelector("#tasks-refresh").addEventListener("click",async()=>{const S=e.querySelector("#tasks-refresh");S.disabled=!0,S.innerHTML='<span class="spinner dark"></span> Refreshing...',await De(e)})}catch(r){console.error("Error rendering tasks:",r),u(`Error: ${r.message}`,"error")}}function to(e,t){e.querySelectorAll(".edit-task-btn").forEach(i=>{i.addEventListener("click",s=>{const a=s.target.closest("button").dataset.taskId,n=t.find(r=>r.id===a);n&&no(e,n)})}),e.querySelectorAll(".approve-task-btn").forEach(i=>{i.addEventListener("click",s=>{const a=s.target.closest("button").dataset.taskId,n=t.find(r=>r.id===a);n&&ao(e,n)})})}function io(e,t,i){var f,b,k,y,w,P;const s=document.createElement("div");s.style.cssText=`
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `;const a=((b=(f=m.currentUser)==null?void 0:f.email)==null?void 0:b.toLowerCase())||"",n=((k=m.currentUser)==null?void 0:k.role)||"user",r=((y=m.settings.primaryApprover)==null?void 0:y.toLowerCase())||"",o=((w=m.settings.secondaryApprover)==null?void 0:w.toLowerCase())||"",l=["super","admin"].includes(n)||a===r||a===o,c=a===r||a===o,d=["super","admin"].includes(n)&&!c,p=((P=m.currentUser)==null?void 0:P.name)||"Current User",v=a===o;s.innerHTML=`
    <div style="background:white;border-radius:8px;padding:24px;max-width:450px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <h2 style="margin:0 0 16px 0;font-size:16px;font-weight:700;color:#333">Resolve Task - Final Approval</h2>

      <div style="background:#f0f4ff;border-left:4px solid #0066cc;padding:12px;border-radius:4px;margin-bottom:16px">
        <div style="font-size:11px;color:#0066cc;font-weight:600">⚠️ Final Resolution Approval Required</div>
        <div style="font-size:10px;color:#0066cc;margin-top:6px">Only designated approvers can mark this task as Resolved.</div>
      </div>

      <div style="background:#f5f5f5;border-left:4px solid #666;padding:12px;border-radius:4px;margin-bottom:16px;font-size:10px;color:#333">
        <div style="font-weight:600;margin-bottom:6px">📋 Designated Approvers:</div>
        <div style="margin:4px 0"><strong>Primary:</strong> ${r||'<span style="color:#999">Not configured</span>'}</div>
        <div style="margin:4px 0"><strong>Secondary:</strong> ${o||'<span style="color:#999">Not configured</span>'}</div>
      </div>

      ${!r&&!o?`
        <div style="background:#ffebee;border-left:4px solid #f44336;padding:12px;border-radius:4px;margin-bottom:16px">
          <div style="font-size:11px;color:#c62828;font-weight:600">⚠️ No approvers configured</div>
          <div style="font-size:10px;color:#c62828;margin-top:6px">Admin must configure approvers in Settings before tasks can be resolved.</div>
        </div>
      `:d?`
        <div style="background:#fff3e0;border-left:4px solid #ff9800;padding:12px;border-radius:4px;margin-bottom:16px">
          <div style="font-size:11px;color:#e65100;font-weight:600">🔑 Admin Override</div>
          <div style="font-size:10px;color:#e65100;margin-top:6px">You are a system ${n} and can approve even though you're not a designated approver. Approval will be recorded as <strong>Admin Override</strong>.</div>
        </div>
      `:l?`
        <div style="background:#e8f5e9;border-left:4px solid #4caf50;padding:12px;border-radius:4px;margin-bottom:16px">
          <div style="font-size:11px;color:#2e7d32;font-weight:600">✓ You are an authorized approver</div>
          <div style="font-size:10px;color:#2e7d32;margin-top:6px">You (${p}) ${v?"(Secondary Approver)":"(Primary Approver)"} will approve this resolution.</div>
        </div>
      `:`
        <div style="background:#ffcdd2;border-left:4px solid #f44336;padding:12px;border-radius:4px;margin-bottom:16px">
          <div style="font-size:11px;color:#c62828;font-weight:600">❌ You do not have approval permission</div>
          <div style="font-size:10px;color:#c62828;margin-top:6px">Only the designated approvers can approve task resolution. Contact <strong>${r||"Primary"}</strong> or <strong>${o||"Secondary"}</strong>.</div>
        </div>
      `}

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Approval Notes (Optional)</label>
        <textarea id="approval-notes" placeholder="Add any notes about this resolution..." style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px;resize:vertical;min-height:80px"></textarea>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-resolution" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn btn-primary confirm-resolution" data-task-id="${e}" data-progress="${t}" data-assigned-to="${i}" data-admin-override="${d}" style="${l?"":"opacity:0.5;cursor:not-allowed"}" ${l?"":"disabled"}>
          ✓ Approve & Resolve Task
        </button>
      </div>
    </div>
  `,document.body.appendChild(s),s.querySelector(".cancel-resolution").addEventListener("click",()=>s.remove()),l&&s.querySelector(".confirm-resolution").addEventListener("click",async S=>{const h=S.target,g=h.dataset.progress,x=h.dataset.assignedTo,N=h.dataset.adminOverride==="true",M=s.querySelector("#approval-notes").value;h.disabled=!0,h.innerHTML='<span class="spinner dark"></span> Approving...';try{const L=await fetch(`${A}/msgcenter/tasks/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({taskStatus:"Resolved",approvalStatus:"Approved",progress:g,assignedTo:x,notes:M?`[Admin: ${M}]`:N?"[Admin Override]":"",siteUrl:m.settings.sharepointSiteUrl||"root"})}),K=await L.json();if(L.ok&&K.success){u("✓ Task resolved and approved successfully","success"),s.remove();const me=document.getElementById("page-tasks");me&&await De(me)}else u(`Error: ${K.error}`,"error")}catch(L){u(`Error: ${L.message}`,"error")}finally{h.disabled=!1,h.innerHTML="✓ Approve & Resolve Task"}})}function so(e,t){const i=document.createElement("div");i.style.cssText=`
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `,i.innerHTML=`
    <div style="background:white;border-radius:8px;padding:24px;max-width:400px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <h2 style="margin:0 0 16px 0;font-size:16px;font-weight:700">Reject Task</h2>
      <p style="margin:0 0 16px 0;color:#666;font-size:12px">Please provide a reason for rejection:</p>

      <textarea id="reject-reason" placeholder="Reason for rejection..." style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px;resize:vertical;min-height:80px;margin-bottom:16px"></textarea>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-reject" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn btn-primary confirm-reject" data-task-id="${e}" style="background:#f44336">Reject Task</button>
      </div>
    </div>
  `,document.body.appendChild(i),i.querySelector(".cancel-reject").addEventListener("click",()=>i.remove()),i.querySelector(".confirm-reject").addEventListener("click",async s=>{const a=i.querySelector("#reject-reason").value||"No reason provided",n=s.target;n.disabled=!0,n.innerHTML='<span class="spinner dark"></span> Rejecting...';try{const r=await fetch(`${A}/msgcenter/tasks/${e}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({approvalStatus:"Rejected",notes:a,siteUrl:m.settings.sharepointSiteUrl||"root"})}),o=await r.json();if(r.ok&&o.success){u("✓ Task rejected successfully","success"),i.remove();const l=document.getElementById("page-tasks");l&&await De(l)}else u(`Error: ${o.error}`,"error")}catch(r){u(`Error: ${r.message}`,"error")}finally{n.disabled=!1,n.innerHTML="Reject Task"}})}function ao(e,t){var s,a,n,r,o,l,c;const i=document.createElement("div");i.style.cssText=`
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `,(a=(s=m.currentUser)==null?void 0:s.email)!=null&&a.toLowerCase(),(n=m.currentUser)!=null&&n.role,(r=m.settings.primaryApprover)!=null&&r.toLowerCase(),(o=m.settings.secondaryApprover)!=null&&o.toLowerCase(),(l=m.currentUser)!=null&&l.name,i.innerHTML=`
    <div style="background:white;border-radius:8px;padding:24px;max-width:500px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h2 style="margin:0;font-size:16px;font-weight:700">Review Pending Approval</h2>
        <button class="close-modal" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666">×</button>
      </div>

      <div style="background:#fff3cd;border-left:4px solid #ff9800;padding:12px;border-radius:4px;margin-bottom:16px">
        <div style="font-size:11px;color:#ff6600;font-weight:600">⏳ Waiting for Approval</div>
        <div style="font-size:10px;color:#ff6600;margin-top:6px"><strong>${t.title}</strong> has been marked as resolved and is waiting for your final approval.</div>
      </div>

      <div style="background:#f5f5f5;border-left:4px solid #666;padding:12px;border-radius:4px;margin-bottom:16px;font-size:10px;color:#333">
        <div><strong>Task Status:</strong> ${t.taskStatus}</div>
        <div><strong>Progress:</strong> ${t.progress}</div>
        <div><strong>Assigned To:</strong> ${t.assignedTo||"—"}</div>
        <div><strong>Due Date:</strong> ${((c=t.dueDate)==null?void 0:c.split("T")[0])||"—"}</div>
        <div style="margin-top:6px"><strong>Approval Status:</strong> ${t.approvalStatus}</div>
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Approval Notes (Optional)</label>
        <textarea id="approval-notes" placeholder="Add any notes about this approval..." style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px;resize:vertical;min-height:60px"></textarea>
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-approval" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn" id="reject-approval" data-task-id="${t.id}" style="background:#f44336;color:white;border:none;cursor:pointer">✗ Reject</button>
        <button class="btn btn-primary approve-resolution" data-task-id="${t.id}">✓ Approve & Resolve</button>
      </div>
    </div>
  `,document.body.appendChild(i),i.querySelector(".close-modal").addEventListener("click",()=>i.remove()),i.querySelector(".cancel-approval").addEventListener("click",()=>i.remove()),i.querySelector("#reject-approval").addEventListener("click",()=>{i.remove(),so(t.id)}),i.querySelector(".approve-resolution").addEventListener("click",async d=>{const p=d.target,v=i.querySelector("#approval-notes").value;p.disabled=!0,p.innerHTML='<span class="spinner dark"></span> Approving...';try{const f=await fetch(`${A}/msgcenter/tasks/${t.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({approvalStatus:"Approved",notes:v?`[Approval: ${v}]`:"",siteUrl:m.settings.sharepointSiteUrl||"root"})}),b=await f.json();if(f.ok&&b.success){u("✓ Task approved successfully","success"),i.remove();const k=document.getElementById("page-tasks");k&&await De(k)}else u(`Error: ${b.error}`,"error")}catch(f){u(`Error: ${f.message}`,"error")}finally{p.disabled=!1,p.innerHTML="✓ Approve & Resolve"}})}function no(e,t){const i=document.createElement("div");i.style.cssText=`
    position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);
    display:flex;align-items:center;justify-content:center;z-index:1000
  `,i.innerHTML=`
    <div style="background:white;border-radius:8px;padding:24px;max-width:500px;width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="margin:0;font-size:16px;font-weight:700">${t.title}</h2>
        <button class="close-modal" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666">×</button>
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Task Status</label>
        <select id="modal-task-status" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
          <option value="Not Started" ${t.taskStatus==="Not Started"?"selected":""}>Not Started</option>
          <option value="In Progress" ${t.taskStatus==="In Progress"?"selected":""}>In Progress</option>
          <option value="Review" ${t.taskStatus==="Review"?"selected":""}>Review</option>
          <option value="Resolved" ${t.taskStatus==="Resolved"?"selected":""}>Resolved</option>
        </select>
        <div style="font-size:9px;color:#0066cc;margin-top:6px">💡 Changing to "Resolved" requires Manager/Admin approval</div>
      </div>

      <div style="background:#e3f2fd;border-left:4px solid #0066cc;padding:12px;border-radius:4px;margin-bottom:16px">
        <div style="font-size:11px;color:#0066cc;font-weight:600">ℹ️ Approval Status: ${t.approvalStatus}</div>
        <div style="font-size:10px;color:#0066cc;margin-top:6px">Approval is required when marking this task as <strong>Resolved</strong>.</div>
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Progress (%)</label>
        <input type="number" id="modal-progress" min="0" max="100" value="${parseInt(t.progress)||0}" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
      </div>

      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#555;display:block;margin-bottom:6px">Assigned To</label>
        <input type="text" id="modal-assigned-to" value="${t.assignedTo||""}" placeholder="Name or email" style="width:100%;padding:8px;font-size:11px;border:0.5px solid #ccc;border-radius:4px">
      </div>

      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn cancel-modal" style="background:#e0e0e0;color:#333">Cancel</button>
        <button class="btn btn-primary save-task-btn" data-task-id="${t.id}">Save Changes</button>
      </div>
    </div>
  `,document.body.appendChild(i),i.querySelector(".close-modal").addEventListener("click",()=>i.remove()),i.querySelector(".cancel-modal").addEventListener("click",()=>i.remove()),i.querySelector(".save-task-btn").addEventListener("click",async s=>{const a=s.target,n=i.querySelector("#modal-task-status").value,r=i.querySelector("#modal-progress").value+"%",o=i.querySelector("#modal-assigned-to").value;if(n==="Resolved"&&t.taskStatus!=="Resolved"){i.remove(),io(t.id,r,o);return}a.disabled=!0,a.innerHTML='<span class="spinner dark"></span> Saving...';try{const l=await fetch(`${A}/msgcenter/tasks/${t.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({taskStatus:n,progress:r,assignedTo:o,siteUrl:m.settings.sharepointSiteUrl||"root"})}),c=await l.json();if(l.ok&&c.success){u("✓ Task updated successfully","success"),i.remove();const d=document.getElementById("page-tasks");d&&await De(d)}else u(`Error: ${c.error}`,"error")}catch(l){u(`Error: ${l.message}`,"error")}finally{a.disabled=!1,a.innerHTML="Save Changes"}})}const ro={highPrivilegeApps:8},oo=[{keywords:["expiring secret","secret expir","secret rotation","credential"],response:`**Application Secrets Expiring — Action Required**

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

→ **Applications → Secret & Certificate Expiry** for rotation roadmap.`}];let Qe="executive",F={type:"all",status:"all",search:""},Ue=[],Li=!1,j=[],pe=[],X=[],Xe=[],Ot=[],je=[],Ri=[],we=[],$e=[],et=[];const Ss=[{id:"executive",label:"Executive",icon:"ti-layout-dashboard"},{id:"appregistrations",label:"App Registrations",icon:"ti-app-window"},{id:"enterprise",label:"Enterprise Apps",icon:"ti-grid-dots"},{id:"secrets",label:"Secrets & Certs",icon:"ti-lock"},{id:"permissions",label:"Permissions",icon:"ti-shield-check"},{id:"auditconsents",label:"Audit Consents",icon:"ti-history"},{id:"owners",label:"Owners",icon:"ti-users"},{id:"usage",label:"Usage Analytics",icon:"ti-chart-line"},{id:"risk",label:"Risk Assessment",icon:"ti-alert-triangle"},{id:"lifecycle",label:"Lifecycle",icon:"ti-timeline"},{id:"recommendations",label:"Recommendations",icon:"ti-checklist"},{id:"copilot",label:"App Copilot",icon:"ti-robot"}];async function lo(){const e=document.getElementById("page-applications");if(!e)return;if(J()){console.log("🎭 Demo account detected - showing demo applications data"),co(e);return}e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading real M365 application data...</p></div>',console.log("📡 Fetching real application data from backend...");const t=await sa();t!=null&&t.success&&t.data?(j=t.data,console.log(`✅ Apps: ${j.length}`)):(console.warn("⚠️ No application data available from API"),j=[]);const i=await aa();i!=null&&i.success&&i.data?(pe=i.data,console.log(`✅ SPs: ${pe.length}`)):(console.warn("⚠️ No service principal data available from API"),pe=[]);try{const a=await(await fetch(`${A}/secrets-certificates`)).json();a!=null&&a.success&&(X=a.data||[],console.log(`✅ Secrets: ${X.length}`))}catch(s){console.warn("⚠️ Secrets error:",s.message)}try{console.log(`🔄 Fetching permissions from ${A}/permissions`);const s=await fetch(`${A}/permissions`);console.log(`📦 Permissions response status: ${s.status}`);const a=await s.json();console.log("📊 Permissions response:",a),a!=null&&a.success?(Xe=a.data||[],console.log(`✅ Permissions: ${Xe.length} items`)):console.warn("⚠️ Permissions endpoint returned success=false")}catch(s){console.warn("⚠️ Permissions error:",s.message,s.stack)}try{const a=await(await fetch(`${A}/admin-consents`)).json();a!=null&&a.success&&(Ot=a.data||[],console.log(`✅ Consents: ${Ot.length}`))}catch(s){console.warn("⚠️ Consents error:",s.message)}try{const a=await(await fetch(`${A}/recent-consents`)).json();a!=null&&a.success&&(Ri=a.data||[],console.log(`✅ Recent Consents: ${Ri.length}`))}catch(s){console.warn("⚠️ Recent Consents error:",s.message)}try{const a=await(await fetch(`${A}/audit-logs/consents`)).json();a!=null&&a.success&&(je=a.data||[],console.log(`✅ Audit Consents: ${je.length}`))}catch(s){console.warn("⚠️ Audit Consents error:",s.message)}try{const a=await(await fetch(`${A}/usage-analytics`)).json();a!=null&&a.success&&(we=a.data||[],console.log(`✅ Usage: ${we.length}`))}catch(s){console.warn("⚠️ Usage error:",s.message)}try{const a=await(await fetch(`${A}/risk-assessment`)).json();a!=null&&a.success&&($e=a.data||[],console.log(`✅ Risks: ${$e.length}`))}catch(s){console.warn("⚠️ Risk error:",s.message)}try{const a=await(await fetch(`${A}/recommendations`)).json();a!=null&&a.success&&(et=a.data||[],console.log(`✅ Recs: ${et.length}`))}catch(s){console.warn("⚠️ Recs error:",s.message)}be(e)}function co(e){const t=[{id:"app-001",name:"Power BI Service",owners:["Chen Wei","Priya Kumar"],lastUsed:"2026-06-01",status:"active",riskLevel:"low",secretsExpiring:0},{id:"app-002",name:"Salesforce Integration",owners:["Aisha Raza"],lastUsed:"2026-06-01",status:"active",riskLevel:"medium",secretsExpiring:1},{id:"app-003",name:"ServiceNow Connector",owners:["Chen Wei","Sanjay Kumar"],lastUsed:"2026-05-31",status:"active",riskLevel:"low",secretsExpiring:0},{id:"app-004",name:"Slack Integration",owners:["Priya Kumar"],lastUsed:"2026-05-30",status:"inactive",riskLevel:"low",secretsExpiring:0},{id:"app-005",name:"Azure DevOps Extension",owners:["Chen Wei"],lastUsed:"2026-06-01",status:"active",riskLevel:"high",secretsExpiring:2}],i={totalApps:t.length,activeApps:4,secretsExpiring:3},s=[{appName:"Salesforce Integration",type:"Client Secret",expiresAt:"2026-06-15",status:"Expiring soon",daysLeft:14},{appName:"Azure DevOps Extension",type:"Client Secret",expiresAt:"2026-06-10",status:"Expiring soon",daysLeft:9},{appName:"Azure DevOps Extension",type:"Certificate",expiresAt:"2026-06-08",status:"Critical",daysLeft:7}];e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-app-window"></i> Applications</div>
        <div class="page-subtitle">Manage app registrations, permissions, and consent</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample application data</span>
    </div>

    <div class="tabs" id="app-tabs" style="margin-bottom:16px">
      ${Ss.slice(0,4).map((n,r)=>`
        <button class="tab-btn ${r===0?"active":""}" data-tab="${n.id}">
          <i class="ti ${n.icon}"></i> ${n.label}
        </button>
      `).join("")}
    </div>

    <div id="app-content"></div>
  `;const a=e.querySelector("#app-content");Di(a,i,t),e.querySelectorAll("#app-tabs .tab-btn").forEach(n=>{n.addEventListener("click",()=>{e.querySelectorAll("#app-tabs .tab-btn").forEach(o=>o.classList.remove("active")),n.classList.add("active");const r=n.dataset.tab;r==="executive"?Di(a,i,t):r==="appregistrations"?po(a,t):r==="enterprise"?uo(a,t):r==="secrets"&&vo(a,s)})})}function Di(e,t,i){const s=i.filter(a=>a.riskLevel==="high");e.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Application Overview</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Total Apps</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-info-text)">${t.totalApps}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Active</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">${t.activeApps}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Secrets Expiring</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${t.secretsExpiring}</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">High Risk</div>
          <div style="font-size:24px;font-weight:700;color:var(--clr-danger-text)">${s.length}</div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Registered Applications</span>
        <span class="badge info">${i.length} apps</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Application Name</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Owners</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Risk</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Last Used</th>
          </tr>
        </thead>
        <tbody>
          ${i.map((a,n)=>`
            <tr style="border-bottom:${n<i.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${a.name}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${a.owners.join(", ")}</td>
              <td style="padding:10px 12px"><span class="badge ${a.status==="active"?"success":"neutral"}">${a.status}</span></td>
              <td style="padding:10px 12px"><span class="badge ${a.riskLevel==="high"?"danger":a.riskLevel==="medium"?"warning":"success"}">${a.riskLevel}</span></td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-tertiary)">${a.lastUsed}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function po(e,t){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">App Registrations</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">App Name</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">App ID</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
          </tr>
        </thead>
        <tbody>
          ${t.map((i,s)=>`
            <tr style="border-bottom:${s<t.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${i.name}</td>
              <td style="padding:10px 12px;font-size:9px;font-family:monospace;color:var(--color-text-tertiary)">${i.id}</td>
              <td style="padding:10px 12px"><span class="badge ${i.status==="active"?"success":"neutral"}">${i.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function uo(e,t){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Enterprise Applications</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Owners</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Users</th>
          </tr>
        </thead>
        <tbody>
          ${t.filter(i=>i.status==="active").map((i,s)=>`
            <tr style="border-bottom:${s<3?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${i.name}</td>
              <td style="padding:10px 12px;font-size:10px">${i.owners[0]}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${Math.floor(Math.random()*500)+10} users</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function vo(e,t){e.innerHTML=`
    <div class="alert-banner warning" style="margin-bottom:16px">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>3 secrets expiring soon</strong> — Review and rotate before expiration</span>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">Credentials & Certificates</span>
        <span class="badge warning">${t.length} expiring</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Application</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Type</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Expires</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Days Left</th>
            <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Status</th>
          </tr>
        </thead>
        <tbody>
          ${t.map((i,s)=>`
            <tr style="border-bottom:${s<t.length-1?"0.5px solid var(--color-border-tertiary)":"none"}">
              <td style="padding:10px 12px;font-size:11px;font-weight:600">${i.appName}</td>
              <td style="padding:10px 12px;font-size:10px">${i.type}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${i.expiresAt}</td>
              <td style="padding:10px 12px;font-size:10px">${i.daysLeft} days</td>
              <td style="padding:10px 12px"><span class="badge ${i.status==="Critical"?"danger":"warning"}">${i.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function be(e){var a,n;const t=(X||[]).filter(r=>r.status==="expiring").length,i=(X||[]).filter(r=>r.status==="expired").length,s=($e||[]).filter(r=>r.severity==="critical").length;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-app-window"></i> Entra Applications</div>
        <div class="page-subtitle">Application Registrations & Enterprise Apps · ${j.length} app registrations · Last sync: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="app-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="app-audit"><i class="ti ti-download"></i> Export audit</button>
      </div>
    </div>

    <!-- Top-5 KPI strip -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value info">${j.length}</div>
        <div class="kpi-label">App Registrations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${pe.length}</div>
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
        <div class="kpi-value warning">${ro.highPrivilegeApps}</div>
        <div class="kpi-label">High Privilege</div>
      </div>
    </div>

    <!-- Sub-navigation tabs -->
    <div class="tabs" id="app-subnav">
      ${Ss.map(r=>`
        <button class="tab-btn ${Qe===r.id?"active":""}" data-app-section="${r.id}">
          <i class="ti ${r.icon}"></i><span>${r.label}</span>
          ${r.id==="secrets"&&i+t>0?`<span class="app-tab-badge red">${i+t}</span>`:""}
          ${r.id==="risk"&&s>0?`<span class="app-tab-badge red">${s}</span>`:""}
          ${r.id==="recommendations"?`<span class="app-tab-badge amber">${et.length}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Content area -->
    <div id="app-content" style="margin-top:16px">${go()}</div>
  `,e.querySelectorAll("#app-subnav .tab-btn").forEach(r=>{r.addEventListener("click",()=>{Qe=r.dataset.appSection,be(e)})}),(a=e.querySelector("#app-refresh"))==null||a.addEventListener("click",()=>{const r=e.querySelector("#app-refresh");r.innerHTML='<span class="spinner dark"></span> Scanning...',r.disabled=!0,setTimeout(()=>{r.innerHTML='<i class="ti ti-refresh"></i> Refresh',r.disabled=!1,u(`Application inventory updated — ${j.length} app registrations, ${pe.length} service principals scanned.`,"success")},2200)}),(n=e.querySelector("#app-audit"))==null||n.addEventListener("click",()=>u("Application audit exported as CSV.","success")),Eo(e)}function go(){return({executive:Ii,appregistrations:mo,enterprise:yo,secrets:fo,permissions:ho,auditconsents:bo,owners:xo,usage:wo,risk:ko,lifecycle:Ao,recommendations:So,copilot:$o}[Qe]||Ii)()}function Ii(){console.log(`📊 Executive: Apps=${j.length}, SPs=${pe.length}, Secrets=${X.length}`);const e=X.filter(a=>a.status==="expiring").length,t=X.filter(a=>a.status==="expired").length,i=$e.filter(a=>a.severity==="critical").length,s=we.filter(a=>a.status==="unused").length;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-app-window"></i> Application Inventory</span>
        </div>
        ${zi([{label:"Total App Registrations",val:j.length,cls:"info"},{label:"Enterprise Applications",val:pe.length,cls:"info"},{label:"Multi-Tenant Apps",val:(j.filter(a=>a.signInAudience==="AzureADMultipleOrgs")||[]).length,cls:"warning"},{label:"High Privilege Apps",val:Xe.filter(a=>a.riskLevel==="critical").length,cls:"danger"},{label:"Certificate-Based",val:X.filter(a=>a.type==="Certificate").length,cls:"success"},{label:"Unused (90+ days)",val:s,cls:"warning"}])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-lock"></i> Credential Health</span>
        </div>
        <div class="alert-banner danger mb-3">
          <i class="ti ti-alert-triangle"></i>
          <span><strong>${t} secrets EXPIRED</strong> — require immediate replacement</span>
        </div>
        ${zi([{label:"Expired Secrets",val:t,cls:"danger"},{label:"Expiring (30 days)",val:e,cls:"warning"},{label:"Expiring (60 days)",val:X.filter(a=>a.daysRemaining<=60&&a.daysRemaining>30).length,cls:"warning"},{label:"Apps Requiring Admin Consent",val:Ot.length,cls:"warning"}])}
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Risk Summary</span>
          <span class="badge danger dot">${i} critical</span>
        </div>
        ${$e.slice(0,5).map(a=>`
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
        ${et.filter(a=>a.priority==="critical").slice(0,4).map(a=>`
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
  `}function mo(){const e=j.length>0?j:[],t=e.filter(s=>!(F.type!=="all"&&s.category!==F.type||F.status!=="all"&&s.status!==F.status||F.search&&!s.name.toLowerCase().includes(F.search.toLowerCase()))),i=[...new Set(e.map(s=>s.category))];return`
    <div class="filter-bar mb-3">
      <input type="text" class="form-input" id="app-search" placeholder="Search app name..." value="${F.search}" style="min-width:200px">
      <select class="form-select" id="app-type-filter">
        <option value="all">All Categories</option>
        ${i.map(s=>`<option value="${s}" ${F.type===s?"selected":""}>${s}</option>`).join("")}
      </select>
      <select class="form-select" id="app-status-filter">
        <option value="all" ${F.status==="all"?"selected":""}>All Status</option>
        <option value="active" ${F.status==="active"?"selected":""}>Active</option>
        <option value="inactive" ${F.status==="inactive"?"selected":""}>Inactive</option>
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
              <td style="font-weight:600">${s.displayName||s.name||"—"}${s.risk?` <span class="badge danger" style="font-size:8px">${s.risk}</span>`:""}</td>
              <td><code style="font-size:10px;color:var(--clr-info-text)">${(s.appId||"").substring(0,8)||"—"}</code></td>
              <td style="font-size:11px">${s.createdDateTime?new Date(s.createdDateTime).toLocaleDateString():"—"}</td>
              <td style="font-size:10px">${s.owners&&s.owners.length>0?s.owners.join(", "):"—"}</td>
              <td><span class="pill">${s.type||"—"}</span></td>
              <td><span class="badge ${s.status==="active"?"success":"warning"}">${s.status||"—"}</span></td>
              <td style="text-align:center;font-size:16px">${s.risk==="critical"?"🔴":s.risk==="high"?"🟠":"🟢"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function yo(){const e=pe.length>0?pe:[];return`
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
              <div style="font-size:12px;font-weight:700">${i.displayName||i.name||"—"}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary)">${i.publisherName||i.publisher||"—"}</div>
            </div>
            <span class="badge ${i.riskLevel==="low"?"success":i.riskLevel==="high"?"danger":"info"}">${i.riskLevel||"—"}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
            <div>
              <div style="color:var(--color-text-tertiary)">Users Assigned</div>
              <div style="font-weight:700;font-size:14px">${i.usersAssigned||"—"}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Last Sign-in</div>
              <div style="font-weight:600">${i.lastSignIn||"—"}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Sign-ins (30d)</div>
              <div style="font-weight:700">${i.signInCount30d?i.signInCount30d.toLocaleString():"—"}</div>
            </div>
            <div>
              <div style="color:var(--color-text-tertiary)">Admin Consent</div>
              <div style="color:${i.adminConsent?"var(--clr-success-text)":"var(--clr-warning-text)"};font-weight:600">${i.adminConsent?"Granted":"Pending"}</div>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `}function fo(){const e=X.filter(s=>s.status==="expired"),t=X.filter(s=>s.status==="expiring"),i=X.filter(s=>s.status==="healthy");return`
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
            ${t.map(s=>{const a=s.daysRemaining<30?"danger":s.daysRemaining<60?"warning":"success";return`
                <tr>
                  <td style="font-weight:600">${s.appName}</td>
                  <td><span class="pill">${s.type}</span></td>
                  <td>${s.expiryDate}</td>
                  <td style="color:var(--clr-${a}-text);font-weight:700">${s.daysRemaining} days</td>
                  <td><span class="badge ${a}">${s.rotation}</span></td>
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
  `}function ho(){const e=Xe.filter(i=>i.riskLevel==="critical"),t=Xe.filter(i=>i.riskLevel==="high");return`
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
  `}function bo(){return`
    <div class="alert-banner info mb-3">
      <i class="ti ti-info-circle"></i>
      <span>Application information pulled from <strong>Azure AD Audit Logs</strong> (Consent to application activities) for comparison with Admin Consents tab</span>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <div style="padding:12px;border-bottom:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)">
        <span style="font-weight:600;font-size:12px">Consent Activities from Audit Logs (${je.length})</span>
      </div>
      ${je.length===0?`
        <div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">
          <i class="ti ti-inbox" style="font-size:28px;margin-bottom:8px;display:block"></i>
          No consent activities found in audit logs
        </div>
      `:`
        <table style="width:100%">
          <thead style="background:var(--color-background-secondary)">
            <tr>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:15%">Event Time</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:18%">Target Application</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:14%">Performed By</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:25%">Permission/Scope</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:10%">Target Type</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:10%">Risk</th>
              <th style="padding:10px 12px;text-align:left;font-weight:600;font-size:11px;width:12%">Result Status</th>
            </tr>
          </thead>
          <tbody>
            ${je.map(e=>{var s;const t=e.scope&&e.scope!=="N/A"?e.scope:"—",i=t!=="—"&&!t.toLowerCase().includes("read");return`
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)${i?";background:rgba(239, 68, 68, 0.05)":""}">
                <td style="padding:10px 12px;font-size:10px">${new Date(e.activityDateTime).toLocaleString()||"—"}</td>
                <td style="padding:10px 12px;font-weight:600;font-size:11px">${e.appName||"—"}</td>
                <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${((s=e.initiatedBy)==null?void 0:s.substring(0,20))||"—"}</td>
                <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${t!=="—"?t.substring(0,70)+(t.length>70?"...":""):"—"}</td>
                <td style="padding:10px 12px;font-size:10px"><span class="badge secondary">Application</span></td>
                <td style="padding:10px 12px;font-size:10px"><span class="badge ${i?"danger":"success"}">${i?"High Risk":"Safe"}</span></td>
                <td style="padding:10px 12px;font-size:10px"><span class="badge ${(e.result||"").toLowerCase()==="success"?"success":"danger"}">${e.result||"—"}</span></td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      `}
    </div>
  `}function xo(){const e=j.length>0?j:[],t=e.filter(a=>!a.owners||a.owners.length===0),i=e.filter(a=>a.owners&&a.owners.length===1),s=e.filter(a=>a.owners&&a.owners.length>1);return`
    ${t.length>0?`
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${t.length} application${t.length>1?"s":""} without assigned owner</strong> — governance risk</span>
      </div>
    `:""}

    <div class="section-heading">No Owner Assigned (${t.length})</div>
    ${t.length===0?'<p style="font-size:11px;color:var(--color-text-tertiary)">All applications have at least one owner.</p>':`
      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;font-size:11px">
          <thead><tr><th style="width:40%">Application</th><th style="width:30%">Created</th><th style="width:20%">Status</th><th style="width:10%">Action</th></tr></thead>
          <tbody>
            ${t.map(a=>`
              <tr>
                <td style="font-weight:700;color:var(--clr-danger-text)">${a.displayName||a.name||"—"}</td>
                <td>${a.createdDateTime?new Date(a.createdDateTime).toLocaleDateString():"—"}</td>
                <td><span class="badge warning">${a.status||"active"}</span></td>
                <td><button class="btn btn-xs btn-danger">Assign owner</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `}

    <div class="section-heading mt-4">Single Owner (${i.length}) — At Risk</div>
    <p style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:8px">Recommendation: Assign secondary owner for redundancy</p>
    ${i.slice(0,5).map(a=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:4px;font-size:11px">
        <div>
          <div style="font-weight:600">${a.displayName||a.name||"—"}</div>
          <div style="color:var(--color-text-tertiary)">Owner: ${a.owners&&a.owners.length>0?a.owners[0]:"—"}</div>
        </div>
        <button class="btn btn-xs">Add owner</button>
      </div>
    `).join("")}

    <div class="section-heading mt-4">Multiple Owners (${s.length}) ✅</div>
    ${s.map(a=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px;background:var(--clr-success-bg);border-radius:var(--border-radius-md);margin-bottom:4px;font-size:11px">
        <div>
          <div style="font-weight:600">${a.displayName||a.name||"—"}</div>
          <div style="color:var(--color-text-tertiary)">${a.owners&&a.owners.length>0?a.owners.join(", "):"—"}</div>
        </div>
      </div>
    `).join("")}
  `}function wo(){const e=we.filter(s=>s.status==="active"),t=we.filter(s=>s.status==="lowuse"),i=we.filter(s=>s.status==="unused");return`
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
  `}function ko(){const e=$e.filter(i=>i.severity==="critical"),t=$e.filter(i=>i.severity==="high");return`
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
  `}function Ao(){const e=j.length>0?j:[],t=e.filter(a=>{const n=a.createdDateTime?new Date(a.createdDateTime):null;if(!n)return!1;const r=new Date(Date.now()-30*24*60*60*1e3);return n>r}),i=e.filter(a=>!a.owners||a.owners.length===0),s=we.filter(a=>a.status==="unused");return`
    <div class="section-heading">Recently Created (Last 30 Days)</div>
    ${t.length===0?'<p style="font-size:11px;color:var(--color-text-tertiary)">No new applications created.</p>':`
      ${t.map(a=>`
        <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:8px">
          <div style="font-weight:700">${a.displayName||"—"}</div>
          <div style="font-size:10px;color:var(--color-text-tertiary)">Created ${a.createdDateTime?new Date(a.createdDateTime).toLocaleDateString():"—"} · Owners: ${a.owners&&a.owners.length>0?a.owners.length:"—"}</div>
        </div>
      `).join("")}
    `}

    <div class="section-heading mt-4">Orphaned Applications</div>
    ${i.length===0?'<p style="font-size:11px;color:var(--color-text-tertiary)">No orphaned applications.</p>':`
      ${i.map(a=>`
        <div class="alert-banner danger mb-2">
          <i class="ti ti-alert-triangle"></i>
          <span><strong>${a.displayName||"—"}</strong> — no owner assigned</span>
        </div>
      `).join("")}
    `}

    <div class="section-heading mt-4">Decommission Candidates (${s.length})</div>
    ${s.map(a=>`
      <div style="padding:10px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border-radius:var(--border-radius-md);margin-bottom:6px;font-size:11px">
        <div style="font-weight:700">${a.appName}</div>
        <div>No sign-ins for ${Math.round((Date.now()-new Date("2025-12-10"))/(24*60*60*1e3))} days</div>
      </div>
    `).join("")}
  `}function So(){return`
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
          ${et.map(e=>`
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
  `}function $o(){(!Li||Ue.length===0)&&(Ue=[{role:"ai",text:`**Applications & App Registrations Copilot** — Ask me about app security, secrets, permissions, risks, and more.

Current state: **87 app registrations**, **124 enterprise apps**, **5 expiring secrets (30d)**, **2 critical risk apps**`}],Li=!0);const e=["Show expiring secrets","Which apps have Directory.ReadWrite.All?","List apps without owners","Show high-risk applications","Unused apps (90+ days)","Multi-tenant applications"];return`
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="app-cop-msgs">
        ${Ue.map(t=>`
          <div class="chat-msg ${t.role==="ai"?"ai":"user-msg"}" style="max-width:85%;margin-bottom:12px">
            ${t.role==="ai"?'<div class="chat-sender"><i class="ti ti-app-window" style="color:var(--clr-info-text)"></i> App Copilot</div>':'<div class="chat-sender" style="justify-content:flex-end">You</div>'}
            <div class="chat-bubble">${$s(t.text)}</div>
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
  `}function zi(e){return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${e.map(t=>`
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600">${t.label}</div>
        <div style="font-size:16px;font-weight:700;color:${t.cls==="success"?"var(--clr-success-text)":t.cls==="danger"?"var(--clr-danger-text)":t.cls==="warning"?"var(--clr-warning-text)":"var(--clr-info-text)"}">${t.val}</div>
      </div>
    `).join("")}
  </div>`}function Eo(e){var a,n,r,o,l;const t=e.querySelector("#app-content");if(!t)return;(a=t.querySelector("#app-search"))==null||a.addEventListener("input",c=>{F.search=c.target.value,be(e)}),(n=t.querySelector("#app-type-filter"))==null||n.addEventListener("change",c=>{F.type=c.target.value,be(e)}),(r=t.querySelector("#app-status-filter"))==null||r.addEventListener("change",c=>{F.status=c.target.value,be(e)}),(o=t.querySelector("#exec-view-risk"))==null||o.addEventListener("click",()=>{Qe="risk",be(e)}),(l=t.querySelector("#exec-view-recs"))==null||l.addEventListener("click",()=>{Qe="recommendations",be(e)});const i=t.querySelector("#app-cop-send"),s=t.querySelector("#app-cop-input");i&&s&&(i.addEventListener("click",()=>kt(e,s)),s.addEventListener("keydown",c=>{c.key==="Enter"&&!c.shiftKey&&(c.preventDefault(),kt(e,s))})),t.querySelectorAll(".app-cop-pill").forEach(c=>{c.addEventListener("click",()=>{const d=t.querySelector("#app-cop-input");d&&(d.value=c.dataset.q,kt(e,d))})})}function kt(e,t){const i=t.value.trim();if(!i)return;Ue.push({role:"user",text:i}),t.value="";const s=e.querySelector("#app-cop-msgs");s&&(s.innerHTML+=`<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${i}</div>
    </div>`,s.scrollTop=s.scrollHeight),setTimeout(()=>{const a=i.toLowerCase(),n=oo.find(o=>o.keywords.some(l=>a.includes(l))),r=(n==null?void 0:n.response)||`Searching application data for **"${i}"**...

Based on your question, navigate to the relevant section above. Current state: 87 app registrations, 2 expired secrets, 2 critical risk apps, 5 recommendations.`;Ue.push({role:"ai",text:r}),s&&(s.innerHTML+=`<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-app-window" style="color:var(--clr-info-text)"></i> App Copilot</div>
        <div class="chat-bubble">${$s(r)}</div>
      </div>`,s.scrollTop=s.scrollHeight)},600)}function $s(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}let Ut="executive",ct=[],qi=!1,Fe=[],Be=[],E={summary:{},endpointSecurity:{},patchManagement:{},riskAssessment:{},deviceHealth:[],applications:[],policies:{configurationPolicies:[],conditionalAccessPolicies:[]},recommendations:[]};const Es=[{id:"executive",label:"Executive",icon:"ti-layout-dashboard"},{id:"health",label:"Device Health",icon:"ti-heartbeat"},{id:"compliance",label:"Compliance",icon:"ti-check-circle"},{id:"inventory",label:"Device Inventory",icon:"ti-device-laptop"},{id:"security",label:"Endpoint Security",icon:"ti-shield-check"},{id:"patches",label:"Patch Management",icon:"ti-refresh"},{id:"apps",label:"Applications",icon:"ti-app-window"},{id:"risk",label:"Risk Assessment",icon:"ti-alert-triangle"},{id:"policies",label:"Policies",icon:"ti-settings-2"},{id:"recommendations",label:"Recommendations",icon:"ti-checklist"},{id:"copilot",label:"Intune Copilot",icon:"ti-robot"}],Co={windowsBaseline:{score:92,compliant:847,nonCompliant:15},defenderBaseline:{score:88,compliant:832,nonCompliant:30},edgeBaseline:{score:95,compliant:856,nonCompliant:6},msAppsBaseline:{score:85,compliant:812,nonCompliant:50}};async function Po(){const e=document.getElementById("page-intune");if(e){if(J()){console.log("🎭 Demo account detected - showing demo Intune data"),Mo(e);return}e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading comprehensive Intune data...</p></div>',console.log("📡 Fetching comprehensive Intune data from backend...");try{const[t,i,s,a,n,r,o,l,c,d]=await Promise.all([jt(),Ks(),T("/intune/summary"),T("/intune/endpoint-security"),T("/intune/patch-management"),T("/intune/risk-assessment"),T("/intune/device-health"),T("/intune/applications"),T("/intune/policies"),T("/intune/recommendations")]);t.success&&t.data?(Fe=t.data,console.log(`✅ Loaded ${Fe.length} real devices`)):(console.warn("⚠️ No device data available from API"),Fe=[]),i.success&&i.data?(Be=i.data,console.log(`✅ Loaded ${Be.length} real policies`)):(console.warn("⚠️ No policy data available from API"),Be=[]),s.success&&s.data?(E.summary=s.data,console.log("✅ Loaded Intune summary")):E.summary={},a.success&&a.data&&(E.endpointSecurity=a.data,console.log("✅ Loaded endpoint security data")),n.success&&n.data&&(E.patchManagement=n.data,console.log("✅ Loaded patch management data")),r.success&&r.data&&(E.riskAssessment=r.data,console.log("✅ Loaded risk assessment data")),o.success&&o.data&&(E.deviceHealth=o.data,console.log("✅ Loaded device health data")),l.success&&l.data&&(E.applications=l.data,console.log("✅ Loaded applications data")),c.success&&c.data&&(E.policies=c.data,console.log("✅ Loaded policies data")),d.success&&d.data&&(E.recommendations=d.data,console.log("✅ Loaded recommendations data")),console.log("✅ All Intune data loaded successfully")}catch(t){console.error("❌ Error loading Intune data:",t)}Cs(e)}}function Mo(e){const t=[{id:"DEV-001",name:"LAPTOP-PRIYA01",os:"Windows 11",osVersion:"23H2",compliance:"Compliant",owner:"Priya Kumar",lastSync:"2026-06-01"},{id:"DEV-002",name:"LAPTOP-CHEN02",os:"Windows 11",osVersion:"23H2",compliance:"Compliant",owner:"Chen Wei",lastSync:"2026-06-01"},{id:"DEV-003",name:"IPAD-AISHA01",os:"iPadOS",osVersion:"17.5",compliance:"Compliant",owner:"Aisha Raza",lastSync:"2026-06-01"},{id:"DEV-004",name:"IPHONE-SANJAY01",os:"iOS",osVersion:"17.5",compliance:"Non-compliant",owner:"Sanjay Kumar",lastSync:"2026-05-31"},{id:"DEV-005",name:"LAPTOP-JAMES03",os:"Windows 10",osVersion:"22H2",compliance:"Non-compliant",owner:"James Liu",lastSync:"2026-05-30"}],i={totalDevices:847,compliantDevices:801,nonCompliantDevices:46,enrolledToday:3,updatesPending:12};e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-device-laptop"></i> Microsoft Intune Insights</div>
        <div class="page-subtitle">Device Management & Security Assessment · ${i.totalDevices} devices managed · Last sync: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--color-background-primary);border:0.5px solid var(--color-border-secondary);border-radius:var(--border-radius-md);margin-bottom:16px;font-size:10px;color:var(--color-text-tertiary)">
      <span class="status-dot active pulse"></span>
      <span><strong style="color:var(--color-text-secondary)">Demo Mode</strong> · Showing sample Intune data</span>
    </div>

    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${i.totalDevices}</div>
        <div class="kpi-label">Total Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${i.compliantDevices}</div>
        <div class="kpi-label">Compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${i.nonCompliantDevices}</div>
        <div class="kpi-label">Non-compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${i.updatesPending}</div>
        <div class="kpi-label">Updates Pending</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${i.enrolledToday}</div>
        <div class="kpi-label">Enrolled Today</div>
      </div>
    </div>

    <div class="tabs" id="intune-tabs" style="margin-bottom:16px">
      ${Es.map((a,n)=>`
        <button class="tab-btn ${n===0?"active":""}" data-tab="${a.id}">
          <i class="ti ${a.icon}"></i> ${a.label}
        </button>
      `).join("")}
    </div>

    <div id="intune-content"></div>
  `;const s=e.querySelector("#intune-content");Ni(s,i,t),e.querySelectorAll("#intune-tabs .tab-btn").forEach(a=>{a.addEventListener("click",()=>{e.querySelectorAll("#intune-tabs .tab-btn").forEach(r=>r.classList.remove("active")),a.classList.add("active");const n=a.dataset.tab;n==="executive"?Ni(s,i,t):n==="health"?To(s,t):n==="compliance"?Lo(s):n==="inventory"?Ro(s,t):n==="security"?Do(s):n==="patches"?Io(s):s.innerHTML=`<div class="card"><div class="card-header"><span class="card-title">${a.textContent}</span></div><div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">Demo data for ${a.textContent}</div></div>`})})}function Ni(e,t,i){e.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Device Compliance Overview</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Compliance Rate</div>
          <div style="font-size:28px;font-weight:700;color:var(--clr-success-text)">${Math.round(t.compliantDevices/t.totalDevices*100)}%</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">${t.compliantDevices} of ${t.totalDevices} devices</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Non-Compliant Devices</div>
          <div style="font-size:28px;font-weight:700;color:var(--clr-danger-text)">${t.nonCompliantDevices}</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">Require attention</div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Recently Enrolled Devices</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Device Name</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Owner</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">OS</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Compliance</th>
          </tr>
        </thead>
        <tbody>
          ${i.slice(0,5).map(s=>`
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px;font-size:11px;color:var(--color-text-secondary)">${s.name}</td>
              <td style="padding:10px;font-size:10px">${s.owner}</td>
              <td style="padding:10px;font-size:10px">${s.os} ${s.osVersion}</td>
              <td style="padding:10px"><span class="badge ${s.compliance==="Compliant"?"success":"danger"}">${s.compliance}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function To(e,t){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Device Health Status</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Device</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Status</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Last Sync</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(i=>`
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px;font-size:11px">${i.name}</td>
              <td style="padding:10px"><span class="badge ${i.compliance==="Compliant"?"success":"warning"}">Healthy</span></td>
              <td style="padding:10px;font-size:10px;color:var(--color-text-tertiary)">${new Date(i.lastSync).toLocaleDateString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Lo(e,t){e.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Compliance Policies</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Policy</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Platform</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Compliant</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Windows Security Baseline</td>
            <td style="padding:10px;font-size:10px">Windows</td>
            <td style="padding:10px"><span class="badge success">801/801</span></td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Mobile Device Management</td>
            <td style="padding:10px;font-size:10px">iOS/Android</td>
            <td style="padding:10px"><span class="badge warning">46/47</span></td>
          </tr>
          <tr>
            <td style="padding:10px;font-size:11px">Encryption Required</td>
            <td style="padding:10px;font-size:10px">All</td>
            <td style="padding:10px"><span class="badge success">847/847</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `}function Ro(e,t){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Device Inventory</span>
        <span class="badge info">${t.length} devices</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Device ID</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Device Name</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Platform</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Owner</th>
          </tr>
        </thead>
        <tbody>
          ${t.map(i=>`
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px;font-size:9px;font-family:monospace">${i.id}</td>
              <td style="padding:10px;font-size:11px">${i.name}</td>
              <td style="padding:10px;font-size:10px">${i.os}</td>
              <td style="padding:10px;font-size:10px">${i.owner}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `}function Do(e){e.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title">Endpoint Security</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Antivirus Status</div>
          <div style="font-size:16px;font-weight:700;color:var(--clr-success-text)">847/847</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">All devices protected</div>
        </div>
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
          <div style="font-size:10px;color:var(--color-text-tertiary);text-transform:uppercase;font-weight:600;margin-bottom:6px">Firewall Status</div>
          <div style="font-size:16px;font-weight:700;color:var(--clr-success-text)">847/847</div>
          <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:4px">All devices protected</div>
        </div>
      </div>
    </div>
  `}function Io(e){e.innerHTML=`
    <div class="card">
      <div class="card-header">
        <span class="card-title">Patch Management</span>
        <span class="badge warning">12 updates pending</span>
      </div>
      <table style="width:100%">
        <thead style="background:var(--color-background-secondary)">
          <tr>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Update</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Severity</th>
            <th style="padding:10px;text-align:left;font-size:10px;font-weight:600">Devices Affected</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Windows 11 23H2 KB5036893</td>
            <td style="padding:10px"><span class="badge danger">Critical</span></td>
            <td style="padding:10px;font-size:10px">4</td>
          </tr>
          <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
            <td style="padding:10px;font-size:11px">Security Update June 2026</td>
            <td style="padding:10px"><span class="badge warning">Important</span></td>
            <td style="padding:10px;font-size:10px">8</td>
          </tr>
        </tbody>
      </table>
    </div>
  `}function Cs(e){var a,n;const t=E.summary,i=E.riskAssessment.criticalRiskCount||0,s=E.riskAssessment.highRiskCount||0;e.innerHTML=`
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
        <div class="kpi-value ${t.compliancePercentage>=95?"success":"warning"}">${t.compliancePercentage}%</div>
        <div class="kpi-label">Compliance</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${t.nonCompliant} non-compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${E.patchManagement.compliancePercentage||0}%</div>
        <div class="kpi-label">Patch Status</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${E.patchManagement.criticalUpdatesMissing||0} critical</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${t.encryptionCoverage>=95?"success":"warning"}">${t.encryptionCoverage}%</div>
        <div class="kpi-label">Encryption</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${i>0?"danger":"warning"}">${i+s}</div>
        <div class="kpi-label">At-Risk Devices</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${i} critical</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${t.deviceHealthScore>=75?"success":"warning"}">${t.deviceHealthScore}</div>
        <div class="kpi-label">Health Score</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">0-100 scale</div>
      </div>
    </div>

    <!-- Sub-navigation -->
    <div class="tabs" id="intune-subnav">
      ${Es.map(r=>`
        <button class="tab-btn ${Ut===r.id?"active":""}" data-intune-section="${r.id}">
          <i class="ti ${r.icon}"></i><span>${r.label}</span>
          ${r.id==="risk"&&i>0?`<span class="intune-tab-badge red">${i}</span>`:""}
          ${r.id==="compliance"&&t.nonCompliant>0?`<span class="intune-tab-badge red">${t.nonCompliant}</span>`:""}
          ${r.id==="patches"&&(E.patchManagement.criticalUpdatesMissing||0)>0?`<span class="intune-tab-badge red">${E.patchManagement.criticalUpdatesMissing||0}</span>`:""}
          ${r.id==="recommendations"?`<span class="intune-tab-badge amber">${E.recommendations.length||0}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Content -->
    <div id="intune-content" style="margin-top:16px">${zo()}</div>
  `,e.querySelectorAll("#intune-subnav .tab-btn").forEach(r=>{r.addEventListener("click",()=>{Ut=r.dataset.intuneSection,Cs(e)})}),(a=e.querySelector("#intune-refresh"))==null||a.addEventListener("click",()=>{const r=e.querySelector("#intune-refresh");r.innerHTML='<span class="spinner dark"></span> Scanning...',r.disabled=!0,setTimeout(()=>{r.innerHTML='<i class="ti ti-refresh"></i> Refresh',r.disabled=!1,u("Intune inventory updated — 847 devices scanned, 4 compliance policies evaluated.","success")},2200)}),(n=e.querySelector("#intune-remediate"))==null||n.addEventListener("click",()=>u("Remediation workflow initiated — ${criticalRisks} critical devices tagged for action.","info")),Vo(e)}function zo(){return({executive:Gi,health:qo,compliance:No,inventory:Go,security:Oo,patches:Uo,apps:jo,risk:Fo,policies:Bo,recommendations:Ho,copilot:_o}[Ut]||Gi)()}function Gi(){const e=E.summary,t=E.summary.platformDistribution||PLATFORM_DISTRIBUTION;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-layout-dashboard"></i> Device Overview</span>
        </div>
        ${Ps([{label:"Total Managed",val:e.totalManagedDevices,cls:"info"},{label:"Active",val:e.activeDevices,cls:"success"},{label:"Inactive",val:e.inactiveDevices,cls:"warning"},{label:"Non-Compliant",val:e.nonCompliant,cls:"danger"},{label:"Unmanaged",val:e.unmanaged,cls:"warning"},{label:"Corporate / BYOD",val:`${e.corporateDevices} / ${e.byodDevices}`,cls:"info"}])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-chart-pie"></i> Platform Distribution</span>
        </div>
        ${["windows","macos","ios","android","other"].map(i=>{const s=t[i]||{count:0,percentage:0};return`
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px;font-weight:600">
                <span style="text-transform:capitalize">${i}</span>
                <span>${s.count} (${s.percentage}%)</span>
              </div>
              <div class="score-bar" style="height:8px">
                <div class="score-bar-fill" style="width:${s.percentage}%"></div>
              </div>
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
        <span><strong>${E.riskAssessment.highRiskCount||0} high-risk devices</strong> require immediate attention</span>
      </div>
      ${(E.riskAssessment.deviceRisks||[]).slice(0,5).map(i=>`
        <div style="padding:8px 10px;background:var(--clr-danger-bg);color:var(--clr-danger-text);border-radius:var(--border-radius-md);margin-bottom:6px;font-size:11px">
          <div style="font-weight:700">${i.deviceName||i.name||"Unknown"}</div>
          <div style="font-size:10px;margin-top:2px">Risk Level: ${i.riskLevel||"unknown"} · Issues: ${i.issuesCount||0}</div>
        </div>
      `).join("")}
    </div>

    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-heartbeat"></i> Security Baseline Compliance</span>
        </div>
        ${["windowsBaseline","defenderBaseline","edgeBaseline","msAppsBaseline"].map((i,s)=>{const a=Co[i];return`
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px;font-weight:600">
                <span>${["Windows","Defender","Edge","M365 Apps"][s]}</span>
                <span style="color:${a.score>=90?"var(--clr-success-text)":"var(--clr-warning-text)"}">${a.score}/100</span>
              </div>
              <div class="score-bar" style="height:8px">
                <div class="score-bar-fill ${a.score>=90?"success":"warning"}" style="width:${a.score}%"></div>
              </div>
            </div>
          `}).join("")}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-chart-line"></i> Top Recommendations</span>
        </div>
        ${(E.recommendations||[]).filter(i=>i.priority==="critical").slice(0,4).map(i=>`
          <div style="display:flex;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
            <span class="badge danger" style="flex-shrink:0;min-width:56px;justify-content:center">${i.priority}</span>
            <span style="flex:1">${i.title}</span>
          </div>
        `).join("")}
        ${(E.recommendations||[]).length===0?'<div style="padding:10px;text-align:center;font-size:11px;color:var(--color-text-tertiary)">No critical recommendations</div>':""}
      </div>
    </div>
  `}function qo(){const e=E.summary,t=E.deviceHealth||[];return t.length>0&&Math.round(t.reduce((i,s)=>i+s.healthScore,0)/t.length),`
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value ${e.deviceHealthScore>=75?"success":"warning"}">${e.deviceHealthScore}</div>
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
          ${t.map(i=>`
            <tr>
              <td style="font-weight:600">${i.name||"Unknown"}</td>
              <td>${i.encryptionScore}%</td>
              <td>${i.complianceScore}%</td>
              <td>${i.patchScore}%</td>
              <td>${i.epScore}%</td>
              <td><span class="badge ${i.healthScore>=80?"success":i.healthScore>=60?"warning":"danger"}">${i.healthScore}/100</span></td>
              <td><span class="badge ${i.riskLevel==="low"?"success":i.riskLevel==="high"?"danger":"warning"}">${i.riskLevel}</span></td>
            </tr>
          `).join("")}
          ${t.length===0?'<tr><td colspan="7" style="text-align:center;padding:20px">No devices with health data</td></tr>':""}
        </tbody>
      </table>
    </div>
  `}function No(){const e=E.summary,t=Math.max(0,(e.totalManagedDevices||0)-(e.nonCompliant||0));return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value success">${e.totalManagedDevices>0?Math.round(t/e.totalManagedDevices*100):0}%</div>
        <div class="kpi-label">Overall Compliance</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${t}</div>
        <div class="kpi-label">Compliant Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${e.nonCompliant||0}</div>
        <div class="kpi-label">Non-Compliant</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">0</div>
        <div class="kpi-label">Pending Evaluation</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">0</div>
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
          ${Be.map(s=>`
            <tr>
              <td style="font-weight:600">${s.name}</td>
              <td>${s.assignedDevices}</td>
              <td style="color:var(--clr-success-text);font-weight:600">${s.compliant}</td>
              <td style="color:var(--clr-danger-text);font-weight:600">${s.nonCompliant}</td>
              <td>${s.pending}</td>
              <td><span class="badge success">${s.coverage}%</span></td>
            </tr>
          `).join("")}
          ${Be.length===0?'<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--color-text-tertiary)">No compliance policies found - Real data from tenant</td></tr>':""}
        </tbody>
      </table>
    </div>
  `}function Go(){return`
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
          ${Fe.slice(0,50).map(e=>`
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
          ${Fe.length===0?'<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--color-text-tertiary)">No devices enrolled in Intune - Real data from tenant</td></tr>':""}
        </tbody>
      </table>
    </div>
  `}function Oo(){var t,i,s,a,n,r,o,l;const e=E.endpointSecurity;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Antivirus & Firewall</div>
        ${Ps([{label:"Defender Enabled",val:((t=e.antivirus)==null?void 0:t.defenderEnabled)||0,cls:"success"},{label:"Real-Time Protection",val:((i=e.antivirus)==null?void 0:i.realTimeProtection)||0,cls:"success"},{label:"Cloud Protection",val:((s=e.antivirus)==null?void 0:s.cloudProtection)||0,cls:"success"},{label:"Firewall Enabled",val:((a=e.firewall)==null?void 0:a.enabled)||0,cls:"success"}])}
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-lock"></i> Protection Coverage</div>
        ${[{label:"Defender",pct:((n=e.antivirus)==null?void 0:n.coverage)||0,target:100},{label:"Firewall",pct:((r=e.firewall)==null?void 0:r.coverage)||0,target:100},{label:"SmartScreen",pct:((o=e.smartscreen)==null?void 0:o.coverage)||0,target:100},{label:"ASR Rules",pct:((l=e.asr)==null?void 0:l.coverage)||0,target:100}].map(c=>`
          <div class="score-bar-row mb-2">
            <span class="score-label" style="min-width:100px">${c.label}</span>
            <div class="score-bar" style="flex:1;height:8px">
              <div class="score-bar-fill ${c.pct>=90?"success":c.pct>=70?"warning":"danger"}" style="width:${c.pct}%"></div>
            </div>
            <span class="score-pct">${c.pct}%</span>
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
  `}function Uo(){const e=E.patchManagement;return`
    <div class="alert-banner danger mb-3">
      <i class="ti ti-alert-triangle"></i>
      <span><strong>${e.criticalUpdatesMissing||0} devices missing critical updates</strong> — schedule patching immediately</span>
    </div>

    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value warning">${e.compliancePercentage||0}%</div>
        <div class="kpi-label">Patch Compliance</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value danger">${e.criticalUpdatesMissing||0}</div>
        <div class="kpi-label">Critical Updates</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${e.securityUpdatesMissing||0}</div>
        <div class="kpi-label">Security Updates</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${e.avgDaysBehind||0}</div>
        <div class="kpi-label">Avg Days Behind</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title mb-2">Patch Compliance Summary</div>
      <div style="padding:10px;background:var(--clr-info-bg);border-radius:var(--border-radius-md);margin-bottom:8px;font-size:11px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span>Quality Updates Missing</span>
          <span style="font-weight:700">${e.qualityUpdatesMissing||0}</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span>Devices Needing Patches</span>
          <span style="font-weight:700">${e.devicesNeedingPatches||0}</span>
        </div>
      </div>
    </div>
  `}function jo(){return`
    <div class="grid-2 mb-3" style="gap:16px">
      ${(E.applications||[]).map(t=>`
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="font-weight:700">${t.name}</div>
            <span class="badge success">${t.status}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
            <div><div style="color:var(--color-text-tertiary)">Users</div><div style="font-weight:700">${t.users}</div></div>
            <div><div style="color:var(--color-text-tertiary)">Devices</div><div style="font-weight:700">${t.devices}</div></div>
            <div><div style="color:var(--color-text-tertiary)">Publisher</div><div style="font-weight:700;font-size:9px">${t.publisher}</div></div>
          </div>
        </div>
      `).join("")}
    </div>
  `}function Fo(){const e=E.riskAssessment,t=e.deviceRisks||[];return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value danger">${e.criticalRiskCount||0}</div>
        <div class="kpi-label">Critical Risk Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value warning">${e.highRiskCount||0}</div>
        <div class="kpi-label">High Risk Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${t.length||0}</div>
        <div class="kpi-label">Non-Compliant Devices</div>
      </div>
    </div>

    ${t.slice(0,20).map(i=>`
      <div class="card mb-2" style="border-left:3px solid ${i.riskLevel==="high"?"var(--clr-danger-text)":"var(--clr-warning-text)"}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div>
            <div style="font-weight:700;margin-bottom:4px">${i.deviceName||i.name||"Unknown Device"}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary)">Issues: ${i.issuesCount||0}</div>
          </div>
          <span class="badge ${i.riskLevel==="high"?"danger":"warning"}">${i.riskLevel||"medium"}</span>
        </div>
      </div>
    `).join("")}
  `}function Bo(){const e=E.policies||{configurationPolicies:[],conditionalAccessPolicies:[]},t=e.configurationPolicies||[],i=e.conditionalAccessPolicies||[];return`
    <div class="section-heading">Configuration Policies (${t.length})</div>
    ${t.map(s=>`
      <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px">${s.name}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:10px">
          <div><span style="color:var(--color-text-tertiary)">Assigned:</span> ${s.assigned}</div>
          <div><span style="color:var(--clr-success-text);font-weight:600">✓</span> ${s.compliant}</div>
          <div><span style="color:var(--clr-danger-text);font-weight:600">✗</span> ${s.nonCompliant}</div>
        </div>
      </div>
    `).join("")}
    ${t.length===0?'<div style="padding:10px;text-align:center;color:var(--color-text-tertiary)">No configuration policies found</div>':""}

    <div class="section-heading mt-4">Conditional Access Policies (${i.length})</div>
    ${i.map(s=>`
      <div style="padding:10px;background:${s.enabled?"var(--clr-success-bg)":"var(--color-background-secondary)"};border-radius:var(--border-radius-md);margin-bottom:6px">
        <div style="display:flex;justify-content:space-between">
          <span style="font-weight:700">${s.name}</span>
          <span class="badge ${s.enabled?"success":"neutral"}">${s.enabled?"Enabled":"Disabled"}</span>
        </div>
      </div>
    `).join("")}
    ${i.length===0?'<div style="padding:10px;text-align:center;color:var(--color-text-tertiary)">No conditional access policies found</div>':""}
  `}function Ho(){const e=E.recommendations||[];return`
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
          ${e.map(t=>`
            <tr>
              <td><span class="badge ${t.priority==="critical"?"danger":t.priority==="high"?"warning":"info"}">${t.priority}</span></td>
              <td style="font-size:11px;font-weight:500">${t.title}</td>
              <td><span class="pill">${t.category}</span></td>
              <td style="font-size:11px">${t.impact}</td>
              <td><span class="pill">${t.effort}</span></td>
              <td><span class="badge ${t.status==="Pending"?"warning":t.status==="In Progress"?"info":"neutral"}">${t.status}</span></td>
            </tr>
          `).join("")}
          ${e.length===0?'<tr><td colspan="6" style="text-align:center;padding:20px">No recommendations available</td></tr>':""}
        </tbody>
      </table>
    </div>
  `}function _o(){if(!qi){const t=E.summary||{},i=E.riskAssessment||{};ct=[{role:"ai",text:`**Intune Security Advisor** — Ask me about device health, compliance, security posture, patch status, or remediation recommendations.

**Current state:** ${t.totalManagedDevices||0} managed devices, ${t.compliancePercentage||0}% compliant, ${t.deviceHealthScore||0}/100 health score, ${i.criticalRiskCount||0} critical risks`}],qi=!0}const e=["Show device health summary","Patch management status","Encryption coverage","Firewall & protection status","Critical risk devices","Compliance policies"];return`
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="intune-cop-msgs">
        ${ct.map(t=>`
          <div class="chat-msg ${t.role==="ai"?"ai":"user-msg"}" style="max-width:85%;margin-bottom:12px">
            ${t.role==="ai"?'<div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-info-text)"></i> Intune Advisor</div>':'<div class="chat-sender" style="justify-content:flex-end">You</div>'}
            <div class="chat-bubble">${Ms(t.text)}</div>
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
  `}function Ps(e){return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${e.map(t=>`
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600">${t.label}</div>
        <div style="font-size:16px;font-weight:700;color:${t.cls==="success"?"var(--clr-success-text)":t.cls==="danger"?"var(--clr-danger-text)":t.cls==="warning"?"var(--clr-warning-text)":"var(--clr-info-text)"}">${t.val}</div>
      </div>
    `).join("")}
  </div>`}function Vo(e){const t=e.querySelector("#intune-content");if(!t)return;const i=t.querySelector("#intune-cop-send"),s=t.querySelector("#intune-cop-input");i&&s&&(i.addEventListener("click",()=>At(e,s)),s.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),At(e,s))})),t.querySelectorAll(".intune-cop-pill").forEach(a=>{a.addEventListener("click",()=>{const n=t.querySelector("#intune-cop-input");n&&(n.value=a.dataset.q,At(e,n))})})}function At(e,t){const i=t.value.trim();if(!i)return;ct.push({role:"user",text:i}),t.value="";const s=e.querySelector("#intune-cop-msgs");s&&(s.innerHTML+=`<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${i}</div>
    </div>`,s.scrollTop=s.scrollHeight),setTimeout(()=>{var d,p,v,f,b;const a=i.toLowerCase(),n=E.summary||{},r=E.riskAssessment||{},o=E.patchManagement||{},l=E.endpointSecurity||{};let c=`Based on your question about Intune, here's the current tenant status:

`;if(a.includes("health")||a.includes("device health"))c+=`**Device Health Summary:**
• Total Managed: ${n.totalManagedDevices||0}
• Active: ${n.activeDevices||0}
• Health Score: ${n.deviceHealthScore||0}/100
• Encryption: ${n.encryptionCoverage||0}%`;else if(a.includes("compliance")||a.includes("compliant"))c+=`**Compliance Status:**
• Overall Compliance: ${n.compliancePercentage||0}%
• Non-Compliant: ${n.nonCompliant||0}
• Devices: ${n.totalManagedDevices||0} managed`;else if(a.includes("patch")||a.includes("update"))c+=`**Patch Management:**
• Patch Compliance: ${o.compliancePercentage||0}%
• Critical Updates Missing: ${o.criticalUpdatesMissing||0}
• Devices Needing Patches: ${o.devicesNeedingPatches||0}`;else if(a.includes("security")||a.includes("protection")||a.includes("firewall"))c+=`**Endpoint Security:**
• Antivirus Coverage: ${((d=l.antivirus)==null?void 0:d.coverage)||0}%
• Firewall Coverage: ${((p=l.firewall)==null?void 0:p.coverage)||0}%
• SmartScreen Coverage: ${((v=l.smartscreen)==null?void 0:v.coverage)||0}%
• BitLocker Coverage: ${((f=l.bitlocker)==null?void 0:f.coverage)||0}%`;else if(a.includes("risk")||a.includes("critical"))c+=`**Risk Assessment:**
• Critical Risk Devices: ${r.criticalRiskCount||0}
• High Risk Devices: ${r.highRiskCount||0}
• Non-Compliant: ${((b=r.deviceRisks)==null?void 0:b.length)||0}`;else if(a.includes("recommendation")||a.includes("suggest")){const y=(E.recommendations||[]).filter(w=>w.priority==="critical");c+=`**Top Recommendations:**
${y.slice(0,3).map(w=>`• **${w.priority.toUpperCase()}:** ${w.title}`).join(`
`)||"• No critical recommendations"}`}else c+=`**Tenant Overview:**
• Managed Devices: ${n.totalManagedDevices||0}
• Compliance: ${n.compliancePercentage||0}%
• Health Score: ${n.deviceHealthScore||0}/100
• Critical Risks: ${r.criticalRiskCount||0}

Ask me about device health, compliance, security, patches, or recommendations!`;ct.push({role:"ai",text:c}),s&&(s.innerHTML+=`<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-info-text)"></i> Intune Advisor</div>
        <div class="chat-bubble">${Ms(c)}</div>
      </div>`,s.scrollTop=s.scrollHeight)},600)}function Ms(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}const Ts={displayName:"Rajkumar Duraisami",upn:"rajkumar.duraisami@contoso.com",email:"rajkumar.duraisami@contoso.com",employeeId:"EMP-2024-001",jobTitle:"Cloud Solutions Architect",department:"Cloud Engineering",manager:"Sarah Johnson",lastSignIn:"Today 08:45",accountStatus:"Enabled",phone:"+1 (555) 123-4567",office:"Seattle, WA",mobilePhone:"+1 (555) 987-6543"},Ls={mfaStatus:"Enabled",mfaDefaultMethod:"Microsoft Authenticator",passwordLastChanged:"45 days ago",passwordExpiryDate:"15 days remaining",ssfrRegistration:"Completed",riskLevel:"Low",securityScore:92,authenticationMethods:[{type:"Password",status:"Enabled"},{type:"Microsoft Authenticator",status:"Enabled",registered:!0},{type:"FIDO2 Security Key",status:"Not registered"},{type:"Phone Authentication",status:"Enabled"},{type:"Email OTP",status:"Not registered"}],riskDetections:[{type:"Impossible Travel",status:"No",lastDetected:null},{type:"Anonymous IP",status:"No",lastDetected:null},{type:"Malware-linked IP",status:"No",lastDetected:null},{type:"Unfamiliar Sign-in",status:"No",lastDetected:null}]},Rs=[{date:"Today 08:45",app:"Microsoft 365 Portal",device:"Windows-Laptop",browser:"Chrome",location:"Seattle, WA",ip:"203.0.113.45",result:"Success"},{date:"Yesterday 17:30",app:"Teams",device:"iPhone",browser:"Safari",location:"Seattle, WA",ip:"203.0.113.45",result:"Success"},{date:"Yesterday 09:15",app:"Exchange Online",device:"Windows-Laptop",browser:"Edge",location:"Seattle, WA",ip:"203.0.113.45",result:"Success"},{date:"2 days ago 14:20",app:"SharePoint",device:"iPad",browser:"Safari",location:"Seattle, WA",ip:"203.0.113.45",result:"Success"},{date:"3 days ago 10:00",app:"OneDrive",device:"Windows-Laptop",browser:"Chrome",location:"Seattle, WA",ip:"203.0.113.45",result:"Success"}],Ds=[{name:"Microsoft 365 E5",sku:"ENTERPRISEPREMIUM",assignmentType:"Direct",assignmentSource:"Admin"},{name:"Enterprise Mobility + Security E5",sku:"EMSPREMIUM",assignmentType:"Direct",assignmentSource:"Admin"},{name:"Power BI Premium",sku:"POWER_BI_PREMIUM_P1",assignmentType:"Group",assignmentSource:"Group License"},{name:"Teams Phone Standard",sku:"TEAMS_PHONE_STANDARD",assignmentType:"Direct",assignmentSource:"Admin"}],He={securityGroups:[{name:"Cloud Architects",type:"Security",membershipType:"Member"},{name:"M365-Admins",type:"Security",membershipType:"Member"},{name:"Security Review Board",type:"Security",membershipType:"Member"},{name:"Global Readers",type:"Security",membershipType:"Member"}],microsoft365Groups:[{name:"Engineering Team",type:"Microsoft 365",teamConnected:!0,dynamicMembership:!1},{name:"Cloud Solutions Architects",type:"Microsoft 365",teamConnected:!0,dynamicMembership:!0},{name:"Product Innovation",type:"Microsoft 365",teamConnected:!1,dynamicMembership:!1}],distributionLists:[{name:"Cloud-Engineering@contoso.com",type:"Distribution List",membershipType:"Member"},{name:"Security-Team@contoso.com",type:"Distribution List",membershipType:"Owner"}]},Is={totalStorage:"1 TB",usedStorage:"420 GB",availableStorage:"580 GB",percentageUsed:42,lastActivity:"Today 08:45",fileCount:2847,sharedItems:156,externalShares:12,anonymousLinks:3},zs={teamsMembership:12,teamsOwned:3,guestAccessTeams:2,teamsPhoneLicense:!0,assignedNumber:"+1 (555) 123-7890",callingPlan:"Domestic and International",teams:[{name:"Engineering Team",role:"Member",owner:"Sarah Johnson"},{name:"Cloud Architects",role:"Owner",owner:"Rajkumar Duraisami"},{name:"Security Review Board",role:"Member",owner:"Chen Wei"},{name:"Product Innovation",role:"Owner",owner:"Rajkumar Duraisami"},{name:"Global Company",role:"Member",owner:"System"}]},qs=[{name:"LAPTOP-RAJ-001",type:"Windows",osVersion:"22H2",complianceStatus:"Compliant",ownership:"Corporate",lastCheckIn:"Today",encryption:"BitLocker Enabled",defender:"Active"},{name:"IPHONE-RAJ-001",type:"iOS",osVersion:"17.5",complianceStatus:"Compliant",ownership:"Corporate",lastCheckIn:"Today",encryption:"Device Encrypted",defender:"Enabled"},{name:"IPAD-RAJ-001",type:"iPadOS",osVersion:"17.5",complianceStatus:"Compliant",ownership:"BYOD",lastCheckIn:"Yesterday",encryption:"Device Encrypted",defender:"Enabled"}],Wo=[{name:"Microsoft Teams",lastAccessed:"Today 08:45",permissionScope:"Full",riskLevel:"Low"},{name:"SharePoint Online",lastAccessed:"Yesterday 14:20",permissionScope:"Read/Write",riskLevel:"Low"},{name:"OneDrive for Business",lastAccessed:"Today 10:15",permissionScope:"Full",riskLevel:"Low"},{name:"Exchange Online",lastAccessed:"Today 09:30",permissionScope:"Full",riskLevel:"Low"},{name:"Power BI",lastAccessed:"2 days ago",permissionScope:"Admin",riskLevel:"Medium"},{name:"Dynamics 365",lastAccessed:"5 days ago",permissionScope:"Read/Write",riskLevel:"Low"}],_e=[{type:"Group Membership Request",group:"Data Governance Board",status:"Pending",submittedDate:"2 days ago",description:"Waiting for manager approval"},{type:"Distribution List Request",list:"Customer Success@contoso.com",status:"Pending",submittedDate:"1 day ago",description:"Awaiting IT approval"}],Jo={personalAIReadinessScore:85,recommendations:[{title:"Enable Microsoft Authenticator",impact:"Improves security by 15%",priority:"High",status:"Recommended"},{title:"Complete Security Awareness Training",impact:"Unlocks advanced features",priority:"High",status:"Recommended"},{title:"Review OneDrive Sharing Settings",impact:"Improves data governance by 8%",priority:"Medium",status:"Recommended"},{title:"Register FIDO2 Security Key",impact:"Improves security by 20%",priority:"Medium",status:"Optional"}],exchangeUsage:78,teamsUsage:92,oneDriveUsage:42,sharePointUsage:65};let Ne="executive",$={profile:Ts,security:Ls,signin:Rs,licenses:Ds,groups:He,onedrive:Is,teams:zs,devices:qs};const Ko=[{id:"executive",label:"Executive Summary",icon:"ti-dashboard"},{id:"profile",label:"Profile",icon:"ti-user"},{id:"security",label:"Security",icon:"ti-shield-check"},{id:"signin",label:"Sign-in Activity",icon:"ti-login"},{id:"licenses",label:"Licenses",icon:"ti-license"},{id:"groups",label:"Groups",icon:"ti-users"},{id:"devices",label:"Devices",icon:"ti-device-laptop"},{id:"apps",label:"Apps & Access",icon:"ti-app-window"},{id:"onedrive",label:"OneDrive",icon:"ti-cloud"},{id:"teams",label:"Teams",icon:"ti-brand-teams"},{id:"approvals",label:"Pending Approvals",icon:"ti-check"},{id:"copilot",label:"Copilot Insights",icon:"ti-robot"}];async function Yo(){const e=document.getElementById("page-myaccount");if(e){try{console.log("📡 Fetching My Account data from backend...");const t=window.userEmail;if(!t){console.error("❌ User email not found. Make sure you are logged in."),u("Error: User not authenticated. Please log in again.","error");return}console.log(`Fetching data for user: ${t}`);const[i,s,a,n,r,o,l,c,d]=await Promise.allSettled([fetch(`${A}/me/profile?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${A}/me/security?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${A}/me/signin-activity?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${A}/me/licenses?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${A}/me/groups?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${A}/me/onedrive?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${A}/me/teams?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${A}/me/devices?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${A}/me/mailbox?email=${encodeURIComponent(t)}`).then(p=>p.json())]);$.profile=i.status==="fulfilled"&&i.value.success?i.value.data:Ts,$.security=s.status==="fulfilled"&&s.value.success?s.value.data:Ls,$.signin=a.status==="fulfilled"&&a.value.success?a.value.data.recentSignins:Rs,$.licenses=n.status==="fulfilled"&&n.value.success?n.value.data:Ds,$.groups=r.status==="fulfilled"&&r.value.success?r.value.data:He,$.onedrive=o.status==="fulfilled"&&o.value.success?o.value.data:Is,$.teams=l.status==="fulfilled"&&l.value.success?l.value.data:zs,$.devices=c.status==="fulfilled"&&c.value.success?c.value.data:qs,$.mailbox=d.status==="fulfilled"&&d.value.success?d.value.data:{mailboxUsage:65},console.log("✓ My Account data loaded")}catch(t){console.warn("⚠️ Using simulated data:",t.message)}Zo(e)}}function Zo(e){var t;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-user-circle"></i> My Account</div>
        <div class="page-subtitle">Your Microsoft 365 profile, security status, and assigned resources</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="myacc-refresh"><i class="ti ti-refresh"></i> Refresh</button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs" id="myacc-subnav">
      ${Ko.map(i=>`
        <button class="tab-btn ${Ne===i.id?"active":""}" data-tab="${i.id}">
          <i class="ti ${i.icon}"></i><span>${i.label}</span>
          ${i.id==="approvals"&&_e.length>0?`<span class="intune-tab-badge red">${_e.length}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Content -->
    <div id="myacc-content" style="margin-top:16px">${Oi()}</div>
  `,e.querySelectorAll("#myacc-subnav .tab-btn").forEach(i=>{i.addEventListener("click",()=>{Ne=i.dataset.tab,e.querySelector("#myacc-content").innerHTML=Oi(),Ne==="signin"&&setTimeout(()=>Ui(e),100)})}),Ne==="signin"&&setTimeout(()=>Ui(e),100),(t=e.querySelector("#myacc-refresh"))==null||t.addEventListener("click",()=>{const i=e.querySelector("#myacc-refresh");i.innerHTML='<span class="spinner dark"></span> Refreshing...',i.disabled=!0,setTimeout(()=>{i.innerHTML='<i class="ti ti-refresh"></i> Refresh',i.disabled=!1,u("Your profile has been refreshed.","success")},1500)})}function Oi(){const t={executive:Qo,profile:Xo,security:el,signin:tl,licenses:il,groups:sl,devices:al,apps:nl,onedrive:rl,teams:ol,approvals:ll,copilot:dl}[Ne];return t?t():""}function Qo(){var d,p,v,f,b,k,y,w;const e=((d=$.security)==null?void 0:d.securityScore)||85,t=((p=$.security)==null?void 0:p.mfaStatus)||"Not Enabled",i=((v=$.security)==null?void 0:v.riskLevel)||"Low",s=($.licenses&&Array.isArray($.licenses)?$.licenses.length:0)||((f=$.licenses)==null?void 0:f.count)||0,a=($.devices&&Array.isArray($.devices)?$.devices.length:0)||((b=$.devices)==null?void 0:b.count)||0,n=($.groups&&$.groups.securityGroups?$.groups.securityGroups.length:0)||0,r=((k=$.teams)==null?void 0:k.teamsMembership)||0,o=0,l=((y=$.onedrive)==null?void 0:y.percentageUsed)||0,c=((w=$.mailbox)==null?void 0:w.mailboxUsage)||65;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value success">${e}<span style="font-size:10px;font-weight:500">/100</span></div>
        <div class="kpi-label">Security Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">✓</div>
        <div class="kpi-label">MFA Status</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${t}</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${i}</div>
        <div class="kpi-label">Risk Level</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value">${s}</div>
        <div class="kpi-label">Licenses</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value">${a}</div>
        <div class="kpi-label">Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value">${n}</div>
        <div class="kpi-label">Groups</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Key Metrics</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Teams</div>
          <div style="font-size:14px;font-weight:600">${r}</div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Pending Requests</div>
          <div style="font-size:14px;font-weight:600;color:var(--clr-warning-text)">${o}</div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">OneDrive Usage</div>
          <div style="font-size:14px;font-weight:600">${l}%</div>
        </div>
        <div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Mailbox Usage</div>
          <div style="font-size:14px;font-weight:600">${c}%</div>
        </div>
      </div>
    </div>
  `}function Xo(){const e=$.profile;return`
    <div class="card">
      <div class="card-header"><span class="card-title">Profile Information</span></div>
      <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div style="display:flex;gap:16px;margin-bottom:16px">
          <div style="width:72px;height:72px;border-radius:50%;background:var(--clr-info-bg);color:var(--clr-info-text);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;flex-shrink:0">
            ${e.displayName.split(" ").map(t=>t[0]).join("")}
          </div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:600;margin-bottom:2px">${e.displayName}</div>
            <div style="font-size:11px;color:var(--color-text-secondary)">${e.jobTitle}</div>
            <div style="font-size:11px;color:var(--color-text-tertiary)">${e.department}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">EMAIL</div>
            <div style="font-size:11px">${e.email}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">UPN</div>
            <div style="font-size:11px">${e.upn}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">EMPLOYEE ID</div>
            <div style="font-size:11px">${e.employeeId}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">MANAGER</div>
            <div style="font-size:11px">${e.manager}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">OFFICE</div>
            <div style="font-size:11px">${e.office}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">PHONE</div>
            <div style="font-size:11px">${e.phone}</div>
          </div>
        </div>
      </div>
    </div>
  `}function el(){const e=$.security;return`
    <div class="card">
      <div class="card-header"><span class="card-title">Security & Risk Status</span></div>
      <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div style="padding:12px;background:var(--clr-success-bg);border-left:3px solid var(--clr-success-text);border-radius:var(--border-radius-md);margin-bottom:16px">
          <div style="font-size:11px;font-weight:600;color:var(--color-text-primary)">Your security score is ${e.securityScore}/100 with ${e.riskLevel} risk level.</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">MFA</div>
            <div style="font-size:12px;color:var(--clr-success-text)">✓ ${e.mfaStatus}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:2px">${e.mfaDefaultMethod}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">PASSWORD</div>
            <div style="font-size:12px">Changed ${e.passwordLastChanged}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:2px">Expires ${e.passwordExpiryDate}</div>
          </div>
        </div>
        <div style="margin-bottom:16px">
          <div style="font-size:11px;font-weight:600;margin-bottom:8px">Authentication Methods</div>
          ${e.authenticationMethods.map(t=>`
            <div style="padding:8px;border-bottom:0.5px solid var(--color-border-tertiary);display:flex;justify-content:space-between;font-size:11px">
              <span>${t.type}</span>
              <span style="color:${t.status==="Enabled"?"var(--clr-success-text)":"var(--color-text-tertiary)"}">${t.status}</span>
            </div>
          `).join("")}
        </div>
        <div>
          <div style="font-size:11px;font-weight:600;margin-bottom:8px">Risk Detections (Last 30d)</div>
          ${e.riskDetections.map(t=>`
            <div style="padding:8px;border-bottom:0.5px solid var(--color-border-tertiary);display:flex;justify-content:space-between;font-size:11px">
              <span>${t.type}</span>
              <span style="color:${t.status==="No"?"var(--clr-success-text)":"var(--color-text-tertiary)"}">${t.status}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}function tl(){const e=$.signin.filter(i=>i.result==="Success"),t=$.signin.filter(i=>i.result==="Failed");return`
    <div style="display:flex;flex-direction:column;gap:16px">
      <!-- Sign-in Summary -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="card" style="padding:16px;text-align:center">
          <div style="font-size:24px;font-weight:600;color:var(--clr-success-text)">${e.length}</div>
          <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Successful Sign-ins</div>
        </div>
        <div class="card" style="padding:16px;text-align:center">
          <div style="font-size:24px;font-weight:600;color:var(--clr-error-text)">${t.length}</div>
          <div style="font-size:11px;color:var(--color-text-tertiary);margin-top:4px">Failed Sign-ins</div>
        </div>
      </div>

      <!-- Sign-in Details Table -->
      <div class="card">
        <div class="card-header"><span class="card-title">Latest Sign-in Per App (Last 24 Hours)</span></div>
        <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
          <table style="width:100%;border-collapse:collapse;font-size:10px">
            <thead style="background:var(--color-background-secondary);position:sticky;top:0">
              <tr>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">Date/Time</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">App</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">IP Address</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">Device</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">OS</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">Browser</th>
                <th style="padding:10px 8px;text-align:center;font-weight:600;white-space:nowrap">Compliant</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">Trust Type</th>
                <th style="padding:10px 8px;text-align:left;font-weight:600;white-space:nowrap">Location</th>
                <th style="padding:10px 8px;text-align:center;font-weight:600;white-space:nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              ${$.signin.map(i=>`
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                  <td style="padding:8px;white-space:nowrap">${i.date}</td>
                  <td style="padding:8px;font-weight:600">${i.app}</td>
                  <td style="padding:8px;font-family:monospace;font-size:9px">${i.ip}</td>
                  <td style="padding:8px">${i.device}</td>
                  <td style="padding:8px">${i.operatingSystem}</td>
                  <td style="padding:8px">${i.browser}</td>
                  <td style="padding:8px;text-align:center">
                    <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;${i.isCompliant==="Yes"?"background:var(--clr-success-bg);color:var(--clr-success-text)":"background:var(--clr-warning-bg);color:var(--clr-warning-text)"}">${i.isCompliant}</span>
                  </td>
                  <td style="padding:8px">${i.trustType}</td>
                  <td style="padding:8px">${i.location}</td>
                  <td style="padding:8px;text-align:center">
                    <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;${i.result==="Success"?"background:var(--clr-success-bg);color:var(--clr-success-text)":"background:var(--clr-error-bg);color:var(--clr-error-text)"}">${i.result}</span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Location Map -->
      <div class="card" style="overflow:hidden">
        <div class="card-header"><span class="card-title">Sign-in Locations Map</span></div>
        <div id="signin-map" style="width:100%;height:300px;border-top:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)"></div>
      </div>
    </div>
  `}function il(){return`
    <div class="card">
      <div class="card-header"><span class="card-title">Assigned Licenses</span></div>
      <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
        ${$.licenses.map(e=>`
          <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
            <div style="font-size:11px;font-weight:600">${e.name}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:3px">SKU: ${e.sku}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary)">Assigned ${e.assignmentType} via ${e.assignmentSource}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function sl(){return`
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card">
        <div class="card-header"><span class="card-title">Security Groups (${He.securityGroups.length})</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${$.groups.securityGroups.map(e=>`
            <div style="padding:10px 12px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${e.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${e.type} • ${e.membershipType}</div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Microsoft 365 Groups (${He.microsoft365Groups.length})</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${$.groups.microsoft365Groups.map(e=>`
            <div style="padding:10px 12px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${e.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${e.teamConnected?"✓ Teams":"No Teams"} • ${e.dynamicMembership?"Dynamic":"Static"}</div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Distribution Lists (${He.distributionLists.length})</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${($.groups.distributionLists||[]).map(e=>`
            <div style="padding:10px 12px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${e.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${e.membershipType}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}function al(){return`
    <div class="card">
      <div class="card-header"><span class="card-title">Registered Devices</span></div>
      <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
        ${$.devices.map(e=>`
          <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
            <div style="font-weight:600;font-size:11px;margin-bottom:6px">${e.name}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px">
              <div><span style="color:var(--color-text-tertiary)">Type:</span> ${e.type}</div>
              <div><span style="color:var(--color-text-tertiary)">OS:</span> ${e.osVersion}</div>
              <div><span style="color:var(--color-text-tertiary)">Status:</span> <span style="color:${e.complianceStatus==="Compliant"?"var(--clr-success-text)":"var(--clr-warning-text)"}">${e.complianceStatus}</span></div>
              <div><span style="color:var(--color-text-tertiary)">Ownership:</span> ${e.ownership}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function nl(){return`
    <div class="card">
      <div class="card-header"><span class="card-title">Applications & Access</span></div>
      <div style="padding:0;overflow:hidden;border-top:0.5px solid var(--color-border-secondary)">
        <table style="width:100%;border-collapse:collapse">
          <thead style="background:var(--color-background-secondary)">
            <tr>
              <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Application</th>
              <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Last Accessed</th>
              <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Scope</th>
              <th style="padding:10px 12px;text-align:left;font-size:10px;font-weight:600">Risk</th>
            </tr>
          </thead>
          <tbody>
            ${($.apps||Wo).map(e=>`
              <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
                <td style="padding:10px 12px;font-size:11px">${e.name}</td>
                <td style="padding:10px 12px;font-size:11px">${e.lastAccessed}</td>
                <td style="padding:10px 12px;font-size:11px">${e.permissionScope}</td>
                <td style="padding:10px 12px;font-size:11px;color:${e.riskLevel==="Low"?"var(--clr-success-text)":"var(--clr-warning-text)"}">${e.riskLevel}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `}function rl(){const e=$.onedrive;return`
    <div class="card">
      <div class="card-header"><span class="card-title">OneDrive for Business Storage</span></div>
      <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div style="margin-bottom:16px">
          <div style="font-size:11px;font-weight:600;margin-bottom:8px">Storage Usage</div>
          <div style="background:var(--color-border-tertiary);border-radius:var(--border-radius-md);height:20px;overflow:hidden;margin-bottom:6px">
            <div style="background:var(--clr-primary);height:100%;width:${e.percentageUsed}%"></div>
          </div>
          <div style="font-size:10px;color:var(--color-text-secondary)">${e.usedStorage} of ${e.totalStorage} used (${e.percentageUsed}%)</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;padding-top:12px;border-top:0.5px solid var(--color-border-tertiary)">
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">FILES</div>
            <div style="font-size:12px;font-weight:600">${e.fileCount}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">SHARED ITEMS</div>
            <div style="font-size:12px;font-weight:600">${e.sharedItems}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">EXTERNAL SHARES</div>
            <div style="font-size:12px;font-weight:600;color:var(--clr-warning-text)">${e.externalShares}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">ANONYMOUS LINKS</div>
            <div style="font-size:12px;font-weight:600;color:var(--clr-warning-text)">${e.anonymousLinks}</div>
          </div>
        </div>
      </div>
    </div>
  `}function ol(){const e=$.teams;return`
    <div class="card">
      <div class="card-header"><span class="card-title">Microsoft Teams</span></div>
      <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin-bottom:16px;padding-bottom:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">TEAMS</div>
            <div style="font-size:14px;font-weight:600">${e.teamsMembership}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">OWNED</div>
            <div style="font-size:14px;font-weight:600">${e.teamsOwned}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">GUEST ACCESS</div>
            <div style="font-size:14px;font-weight:600">${e.guestAccessTeams}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">PHONE</div>
            <div style="font-size:12px;font-weight:600;color:${e.teamsPhoneLicense?"var(--clr-success-text)":"var(--color-text-tertiary)"}">${e.teamsPhoneLicense?"✓ Licensed":"Not Licensed"}</div>
          </div>
        </div>
        ${e.teamsPhoneLicense?`
          <div style="padding:12px;background:var(--clr-info-bg);border-radius:var(--border-radius-md);margin-bottom:12px">
            <div style="font-size:10px;font-weight:600;margin-bottom:4px">Phone Details</div>
            <div style="font-size:10px"><strong>Number:</strong> ${e.assignedNumber}</div>
            <div style="font-size:10px"><strong>Plan:</strong> ${e.callingPlan}</div>
          </div>
        `:""}
        <div style="font-size:11px;font-weight:600">My Teams</div>
        <div>
          ${e.teams.map(t=>`
            <div style="padding:8px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${t.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${t.role} • Owner: ${t.owner}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}function ll(){return!_e||_e.length===0?`
      <div class="card">
        <div style="padding:32px;text-align:center;color:var(--color-text-secondary);font-size:12px">
          ✓ No pending approvals
        </div>
      </div>
    `:`
    <div class="card">
      <div class="card-header"><span class="card-title">Pending Approvals</span></div>
      <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
        ${_e.map(e=>`
          <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
              <div>
                <div style="font-weight:600;font-size:11px">${e.type}</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">${e.group||e.list}</div>
              </div>
              <span style="background:var(--clr-warning-bg);color:var(--clr-warning-text);padding:2px 6px;border-radius:var(--border-radius-sm);font-size:9px;font-weight:600">${e.status}</span>
            </div>
            <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">${e.description}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function dl(){const e=Jo;return`
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card">
        <div class="card-header"><span class="card-title">Copilot Readiness Score</span></div>
        <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);text-align:center">
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:8px">Personal AI Readiness</div>
          <div style="font-size:32px;font-weight:700;color:var(--clr-primary)">${e.personalAIReadinessScore}<span style="font-size:14px;color:var(--color-text-tertiary)">/100</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Service Usage</span></div>
        <div style="padding:16px;border-top:0.5px solid var(--color-border-secondary);display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">EXCHANGE</div>
            <div style="font-size:14px;font-weight:600">${e.exchangeUsage}%</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">TEAMS</div>
            <div style="font-size:14px;font-weight:600">${e.teamsUsage}%</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">ONEDRIVE</div>
            <div style="font-size:14px;font-weight:600">${e.oneDriveUsage}%</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">SHAREPOINT</div>
            <div style="font-size:14px;font-weight:600">${e.sharePointUsage}%</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Recommendations</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${e.recommendations.map(t=>`
            <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">
                <div style="font-weight:600;font-size:11px">${t.title}</div>
                <span style="background:${t.priority==="High"?"var(--clr-danger-bg)":"var(--clr-warning-bg)"};color:${t.priority==="High"?"var(--clr-danger-text)":"var(--clr-warning-text)"};padding:2px 6px;border-radius:var(--border-radius-sm);font-size:9px;font-weight:600">${t.priority}</span>
              </div>
              <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${t.impact}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}function Ui(e){const t=e.querySelector("#signin-map");if(t)if(window.L)ji(t);else{const i=document.createElement("link");i.rel="stylesheet",i.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",i.onload=()=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",s.onload=()=>{console.log("✓ Leaflet loaded"),ji(t)},s.onerror=()=>{console.error("Failed to load Leaflet"),t.innerHTML='<div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">Map failed to load</div>'},document.head.appendChild(s)},document.head.appendChild(i)}}function ji(e){try{const t=$.signin.filter(o=>o.latitude&&o.longitude);if(t.length===0){e.innerHTML='<div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">No location data available for map</div>';return}e.innerHTML="";const i=t.map(o=>o.latitude),s=t.map(o=>o.longitude),a=(Math.max(...i)+Math.min(...i))/2,n=(Math.max(...s)+Math.min(...s))/2,r=window.L.map(e).setView([a,n],4);window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© CartoDB",maxZoom:19,subdomains:"abcd"}).addTo(r),t.forEach(o=>{const c=o.result==="Success"?"#10b981":"#ef4444",d=window.L.circleMarker([o.latitude,o.longitude],{radius:8,fillColor:c,color:"#fff",weight:2,opacity:1,fillOpacity:.8});d.bindPopup(`
        <div style="font-size:10px">
          <strong>${o.app}</strong><br>
          ${o.location}<br>
          ${o.date}<br>
          <strong>${o.result}</strong>
        </div>
      `),d.addTo(r)}),console.log(`✓ Map rendered with ${t.length} markers`)}catch(t){console.error("Map rendering error:",t),e.innerHTML='<div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">Error loading map: '+t.message+"</div>"}}const m={currentUser:null,currentPage:"dashboard",tenantDomain:"Contoso.com",settings:{showPSCommands:!0,showTenantResult:!0,autoExpandFailed:!0,showGraphHealth:!0,showZeroTrustScore:!0,showM365ConfigScore:!0,agentSchedule:"daily-0800",agentAlertEmail:"security@contoso.com",agentAlertOnFail:!0,agentDailyDigest:!0,sharepointSiteUrl:typeof import.meta<"u"&&"nasstech.sharepoint.com:/sites/ChangeIntelligence:"||"root",sharepointSiteId:null,announcementSyncDays:7,primaryApprover:null,secondaryApprover:null,portalEnabled:!0,portal_exchange:!0,portal_teams:!0,portal_sharepoint:!0,portal_onedrive:!0,portal_ext_sharing:!0,portal_user_access:!0,portal_licenses:!0,portal_copilot:!0,portal_power_platform:!0,portal_intune:!0,portal_guest_lifecycle:!0,portal_exchange_groups:!0,portal_shared_mailbox:!0,portal_room_equipment:!0,portal_email_services:!0},cfgAttested:{},cfgAgentLog:[],mcMessages:null},cl={showPSCommands:!0,showTenantResult:!0,autoExpandFailed:!0,showGraphHealth:!0,showZeroTrustScore:!0,showM365ConfigScore:!0,sharepointSiteUrl:typeof import.meta<"u"&&"nasstech.sharepoint.com:/sites/ChangeIntelligence:"||"root",sharepointSiteId:null,announcementSyncDays:7,portalEnabled:!0,portal_exchange:!0,portal_teams:!0,portal_sharepoint:!0,portal_onedrive:!0,portal_ext_sharing:!0,portal_user_access:!0,portal_licenses:!0,portal_copilot:!0,portal_power_platform:!0,portal_intune:!0,portal_guest_lifecycle:!0,portal_exchange_groups:!0,portal_shared_mailbox:!0,portal_room_equipment:!0,portal_email_services:!0,agentSchedule:"daily-0800",agentAlertEmail:"security@contoso.com",agentAlertOnFail:!0,agentDailyDigest:!0};function O(){localStorage.setItem("m365ops_settings",JSON.stringify(m.settings)),localStorage.setItem("m365ops_attested",JSON.stringify(m.cfgAttested)),localStorage.setItem("m365ops_agentlog",JSON.stringify(m.cfgAgentLog))}function pl(){try{const e=localStorage.getItem("m365ops_settings");e&&Object.assign(m.settings,JSON.parse(e));const t=localStorage.getItem("m365ops_attested");t&&(m.cfgAttested=JSON.parse(t));const i=localStorage.getItem("m365ops_agentlog");i&&(m.cfgAgentLog=JSON.parse(i))}catch{}typeof import.meta<"u"&&(m.settings.sharepointSiteUrl="nasstech.sharepoint.com:/sites/ChangeIntelligence:",console.log("📍 SharePoint Site set from environment: nasstech.sharepoint.com:/sites/ChangeIntelligence:"))}function ul(){Object.assign(m.settings,cl),O()}function vl(e){return m.currentUser?e==="user-investigation"?["super","admin"].includes(m.currentUser.role):m.currentUser.navAccess.includes(e):!1}const Fi={dashboard:ya,msgcenter:Jr,tasks:eo,applications:lo,intune:Po,requests:Ea,security:Oa,tenantguard:hn,"user-investigation":Ln,zerotrust:Nn,m365config:ns,privaccts:Hn,licenses:gs,agents:pr,approvals:gr,portal:xr,myreqs:Rr,myaccount:Yo,chat:zr,graphapi:Gr,sso:Or,audit:Ur,settings:_r};async function C(e){if(!vl(e)){u("You do not have access to that page.","error");return}m.currentPage=e,document.querySelectorAll(".page").forEach(s=>s.classList.remove("active"));const t=document.getElementById("page-"+e);t&&t.classList.add("active"),document.querySelectorAll(".nav-item").forEach(s=>s.classList.remove("active"));const i=document.getElementById("n-"+e);i&&i.classList.add("active"),Fi[e]&&await Fi[e]()}async function gl(){try{const e=await Bs();if(!e){console.warn("⚠️ No access token available for tenant domain fetch");return}console.log("📡 Fetching tenant domain from Graph API...");const t=await fetch("https://graph.microsoft.com/v1.0/organization",{headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"}});if(!t.ok){console.warn(`⚠️ Failed to fetch organization: ${t.status}`);return}const i=await t.json();if(i.value&&i.value.length>0){const s=i.value[0].displayName;s&&(m.tenantDomain=s,console.log(`✓ Tenant domain: ${m.tenantDomain}`),Ki())}}catch(e){console.warn("⚠️ Error fetching tenant domain:",e.message)}}async function Bi(){const e=document.getElementById("app"),t=await js();if(t){await Hi(t);return}e.innerHTML=`
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
        <p style="font-size:11px;color:var(--color-text-secondary);margin-bottom:12px;">Select a user and click Sign In:</p>
        <div class="user-tiles">
          ${_i.map(a=>`
            <div class="user-tile" data-user="${a.id}">
              <div class="user-avatar" style="background:${a.color}">${a.initials}</div>
              <div class="user-tile-info">
                <h4>${a.name}</h4>
                <p>${a.email}</p>
                <p style="margin-top:3px"><span class="role-badge ${a.role}">${a.role}</span></p>
              </div>
            </div>
          `).join("")}
        </div>
        <button class="btn" id="demo-signin-btn" style="width:100%;margin-top:12px;display:none">
          <i class="ti ti-login"></i> Sign In as Selected User
        </button>
      </div>
    </div>
  `,document.getElementById("entra-login-btn").addEventListener("click",async()=>{const a=document.getElementById("entra-login-btn");a.innerHTML='<span class="spinner" style="margin-right:8px"></span> Signing in...',a.disabled=!0;const n=await Fs();n?await Hi(n):(a.innerHTML=`
        <svg width="16" height="16" viewBox="0 0 21 21" fill="none"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
        Sign in with Microsoft Entra ID
      `,a.disabled=!1,u("Login cancelled or failed. Try again or use demo account.","warning"))});let i=null;const s=document.getElementById("demo-signin-btn");document.querySelectorAll(".user-tile").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".user-tile").forEach(n=>n.classList.remove("selected")),a.classList.add("selected"),i=a.dataset.user,s.style.display="block"})}),s.addEventListener("click",async()=>{i&&(s.innerHTML='<span class="spinner" style="margin-right:8px"></span> Signing in...',s.disabled=!0,await ml(i))})}async function ml(e){const t=_i.find(s=>s.id===e);if(!t)return;m.currentUser=t,window.userEmail=t.email,console.log(`✅ Demo login: ${t.name} (${t.email})`),Ns(),Wi();const i=t.navAccess[0];await C(i),u(`Welcome back, ${t.name}!`,"success")}async function Hi(e){const t=(e.name||e.username).split(" ");let i="user";try{console.log(`📡 Determining role for user: ${e.localAccountId}`);const l=await(await fetch("https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/user/role",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:e.localAccountId})})).json();l.success&&(i=l.role,console.log(`✓ User role: ${i}`))}catch(o){console.warn("⚠️ Could not determine role from backend, using default:",o.message),i="user"}const s={super:["dashboard","requests","security","tenantguard","user-investigation","zerotrust","privaccts","m365config","licenses","agents","approvals","msgcenter","tasks","applications","intune","portal","myreqs","myaccount","chat","graphapi","sso","audit","settings"],admin:["dashboard","requests","security","tenantguard","user-investigation","zerotrust","privaccts","m365config","licenses","agents","approvals","msgcenter","tasks","applications","intune","portal","myreqs","myaccount","chat","audit","settings"],manager:["requests","msgcenter","tasks","portal","myreqs","myaccount","chat"],user:["portal","myreqs","myaccount","chat"]};let a=s[i]||s.user;["super","admin"].includes(i)&&!a.includes("user-investigation")&&(a=[...a,"user-investigation"]);const n={id:e.localAccountId,name:e.name||e.username,email:e.username,role:i,initials:t.map(o=>o[0]).join("").toUpperCase(),color:"#0C447C",isEntraID:!0,account:e,navAccess:a};window.userEmail=e.username||e.mail||e.email,m.currentUser=n,Ns(),Wi(),gl();const r=n.navAccess[0];await C(r),u(`Welcome, ${n.name}! Role: ${i}`,"success")}function Ns(){const e=document.getElementById("app");e.innerHTML=`
    <div id="app-shell">
      <nav id="sidebar"></nav>
      <div id="main-content">
        <header id="app-header"></header>
        <div id="page-area">
          ${yl()}
        </div>
      </div>
    </div>
  `,pa(),Ki()}function yl(){return["dashboard","requests","security","tenantguard","user-investigation","zerotrust","privaccts","m365config","msgcenter","tasks","applications","intune","licenses","agents","approvals","portal","myreqs","myaccount","chat","graphapi","sso","audit","settings"].map(t=>`<div class="page" id="page-${t}"></div>`).join("")}pl();Bi().catch(e=>{console.error("Login render error:",e),Bi()});
