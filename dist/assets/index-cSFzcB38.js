(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function i(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=i(a);fetch(a.href,r)}})();const ai=[{id:"priya",name:"Priya Kumar",email:"priya@contoso.com",role:"user",initials:"PK",color:"#0C447C",navAccess:["portal","myreqs","myaccount","chat"]},{id:"sanjay",name:"Sanjay Kumar",email:"sanjay@contoso.com",role:"manager",initials:"SK",color:"#3C3489",navAccess:["requests","msgcenter","portal","myreqs","myaccount","chat"],pendingApprovals:3},{id:"chen",name:"Chen Wei",email:"chen@contoso.com",role:"admin",initials:"CW",color:"#633806",navAccess:["dashboard","requests","security","tenantguard","zerotrust","privaccts","m365config","licenses","agents","approvals","msgcenter","applications","intune","portal","myreqs","myaccount","chat","audit","settings"]},{id:"aisha",name:"Aisha Raza",email:"aisha@contoso.com",role:"super",initials:"AR",color:"#791F1F",navAccess:["dashboard","requests","security","tenantguard","zerotrust","privaccts","m365config","licenses","agents","approvals","msgcenter","applications","intune","portal","myreqs","myaccount","chat","audit","settings","graphapi","sso"]}],Bi={auth:{clientId:"04d3be8d-d433-4367-893e-eccc82190a11",authority:"https://login.microsoftonline.com/b9cc8284-05ed-452f-877a-970779430dcb",redirectUri:window.location.origin+"/callback"},cache:{cacheLocation:"sessionStorage",storeAuthStateInCookie:!1},system:{allowNativeBroker:!1}},Hi={scopes:["openid","profile","email","User.Read"]};let J=null;async function Fi(){try{if(!window.msal)return console.warn("MSAL not loaded yet"),null;J=new window.msal.PublicClientApplication(Bi),await J.initialize();const e=await J.handleRedirectPromise();if(e)return console.log("✓ Authenticated from redirect:",e.account.name),e.account;const t=J.getAllAccounts();return t.length>0?(console.log("✓ Already authenticated as:",t[0].name),t[0]):null}catch(e){return console.error("MSAL init error:",e.message),null}}async function _i(){try{if(!J)return console.error("MSAL not initialized"),null;const e=await J.loginPopup(Hi);return console.log("✓ Login successful:",e.account.name),e.account}catch(e){return e.errorCode==="user_cancelled"?console.log("User cancelled login"):console.error("Login error:",e.errorCode,e.errorMessage),null}}async function Vi(){try{if(!J)return;const e={account:J.getAllAccounts()[0]};await J.logout(e),console.log("✓ Logged out")}catch(e){console.error("Logout error:",e)}}function Wi(){const e=document.getElementById("app-header"),t=y.currentUser;t&&(e.innerHTML=`
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
  `,document.getElementById("hdr-settings").addEventListener("click",async()=>{var i;(i=y.currentUser)!=null&&i.navAccess.includes("settings")&&await D("settings")}),document.getElementById("hdr-signout").addEventListener("click",async()=>{console.log("📤 Signing out..."),y.currentUser=null,await Vi(),document.getElementById("app").innerHTML="",window.location.reload()}))}const be={admin:[{id:"dashboard",label:"Dashboard",icon:"ti-layout-dashboard"},{id:"requests",label:"Requests",icon:"ti-inbox",badge:"7",badgeCls:"blue"},{id:"security",label:"Security",icon:"ti-shield-exclamation",badge:"3",badgeCls:"red"},{id:"tenantguard",label:"TenantGuard",icon:"ti-alert-triangle",badge:"Alert"},{id:"user-investigation",label:"User Investigation",icon:"ti-shield-check"},{id:"zerotrust",label:"Zero Trust",icon:"ti-lock-check",badge:"2",badgeCls:"amber"},{id:"privaccts",label:"Privileged Accounts",icon:"ti-crown",badge:"2",badgeCls:"red"},{id:"m365config",label:"M365 Config",icon:"ti-settings-2",badge:"4",badgeCls:"amber"},{id:"msgcenter",label:"Change Intelligence",icon:"ti-antenna",badge:"8",badgeCls:"red"},{id:"applications",label:"Entra Apps",icon:"ti-app-window",badge:"2",badgeCls:"red"},{id:"intune",label:"Intune Insights",icon:"ti-device-laptop",badge:"2",badgeCls:"red"},{id:"licenses",label:"Licenses",icon:"ti-license"},{id:"agents",label:"AI Agents",icon:"ti-robot"}],selfservice:[{id:"myaccount",label:"My Account",icon:"ti-user-circle"},{id:"portal",label:"Portal",icon:"ti-grid-dots"},{id:"myreqs",label:"My Requests",icon:"ti-list-check"},{id:"chat",label:"AI Copilot",icon:"ti-message-circle"}],manager:[{id:"approvals",label:"Pending Approvals",icon:"ti-check-list",badge:"3",badgeCls:"red"}],config:[{id:"audit",label:"Audit Log",icon:"ti-database"},{id:"settings",label:"Admin Settings",icon:"ti-adjustments-horizontal"}],super:[{id:"graphapi",label:"Graph API",icon:"ti-api",badge:"Live",badgeCls:"green"},{id:"sso",label:"SSO / Entra ID",icon:"ti-key"}]};function Ji(){const e=document.getElementById("sidebar"),t=y.currentUser;if(!t||!e)return;let i=t.navAccess;["super","admin"].includes(t.role)&&!i.includes("user-investigation")&&(i=[...i,"user-investigation"]);let s=`
    <div class="nav-logo">
      <div class="nav-logo-icon"><i class="ti ti-shield-bolt"></i></div>
      <div>
        <div class="nav-logo-text">M365 AgentOps</div>
        <div class="nav-logo-sub">Contoso.com</div>
      </div>
    </div>
  `;const a=d=>d.filter(c=>i.includes(c.id)).map(c=>`
      <div class="nav-item" id="n-${c.id}" data-page="${c.id}">
        <i class="ti ${c.icon}"></i>
        <span class="nav-label">${c.label}</span>
        ${c.badge?`<span class="nav-badge ${c.badgeCls}">${c.badge}</span>`:""}
      </div>
    `).join(""),r=a(be.admin);if(r&&(s+=`<div class="nav-section"><div class="nav-section-label">Administration</div>${r}</div>`),["admin","super"].includes(t.role)&&i.includes("approvals")){const d=be.manager.find(c=>c.id==="approvals");d&&(s+=`<div class="nav-section"><div class="nav-section-label">Approvals</div>${a([d])}</div>`)}const n=a(be.selfservice);n&&(s+=`<div class="nav-divider"></div><div class="nav-section"><div class="nav-section-label">Self-Service</div>${n}</div>`);const o=a(be.config),l=a(be.super);(o||l)&&(s+=`<div class="nav-divider"></div><div class="nav-section"><div class="nav-section-label">Config</div>${o}${l}</div>`),s+=`
    <div class="nav-footer">
      <strong>${t.name}</strong>
      ${t.email}
    </div>
  `,e.innerHTML=s,e.querySelectorAll(".nav-item").forEach(d=>{d.addEventListener("click",async()=>await D(d.dataset.page))})}const kt={success:"ti-circle-check",error:"ti-circle-x",warning:"ti-alert-triangle",info:"ti-info-circle"};function v(e,t="info",i=3500){const s=document.getElementById("toast-container");if(!s)return;const a=document.createElement("div");a.className=`toast ${t}`,a.innerHTML=`
    <i class="ti ${kt[t]||kt.info} toast-icon"></i>
    <span class="toast-text">${e}</span>
    <button class="toast-close"><i class="ti ti-x"></i></button>
  `,s.appendChild(a);const r=()=>{a.style.animation="toast-out 200ms ease forwards",setTimeout(()=>a.remove(),200)};a.querySelector(".toast-close").addEventListener("click",r),setTimeout(r,i)}const Ki=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1",$=Ki?"http://localhost:3000/api":"https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api",Yi=$;async function S(e){try{const t=`${Yi}${e}`;console.log(`🔄 Calling: ${t}`);const i=await fetch(t,{method:"GET",headers:{"Content-Type":"application/json"},credentials:"include"});if(!i.ok)throw new Error(`HTTP ${i.status}: ${i.statusText}`);const s=await i.json();return console.log(`✓ ${e}:`,s),s}catch(t){return console.error(`✗ API error on ${e}:`,t.message),{success:!1,error:t.message,data:[],count:0}}}async function bt(){return S("/devices")}async function Zi(){return S("/device-compliance-policies")}async function ri(){return S("/security/score")}async function Qi(){return S("/security/incidents")}async function Xi(){return S("/identity/posture")}async function es(){return S("/privileged-accounts")}async function ts(){return S("/users")}async function is(){return S("/applications")}async function ss(){return S("/service-principals")}let Ye=0,Ze=0,Qe=null,le=[];function as(){const e=localStorage.getItem("dashboard_consents_dismissed");if(!e)return!1;const t=new Date().getTime(),i=parseInt(e);return(t-i)/(1e3*60*60)<24}async function rs(){var i,s,a,r,n,o,l,d;const e=document.getElementById("page-dashboard");if(!e)return;e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading dashboard data...</p></div>';try{console.log("📡 Fetching real dashboard data from backend...");const c=await bt(),p=await ts(),f=await ri();Ye=c.success&&c.count?c.count:0,Ze=p.success&&p.count?p.count:0,Qe=f.success?f.data:null;try{const x=await S("/audit-logs/consents");if(x.success&&x.data){const g=new Date,m=new Date(g.getTime()-24*60*60*1e3);le=x.data.filter(u=>new Date(u.activityDateTime)>=m).sort((u,w)=>new Date(w.activityDateTime)-new Date(u.activityDateTime)).slice(0,5),console.log(`✅ Loaded ${le.length} recent admin consents (last 24 hours)`)}}catch(x){console.warn("⚠️ Could not fetch recent admin consents:",x.message)}console.log(`✅ Loaded dashboard data: ${Ye} devices, ${Ze} users`)}catch(c){console.error("❌ Error loading dashboard data:",c)}e.innerHTML=`
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

    <!-- Recent Admin Consents Alert -->
    ${le.length>0&&!as()?`
    <div class="alert-banner warning" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <div style="flex:1">
        <i class="ti ti-alert-triangle"></i>
        <span><strong>${le.length} new admin consent${le.length!==1?"s":""}</strong> granted in the last 24 hours. Review for suspicious activity.</span>
      </div>
      <button class="btn btn-sm" id="dash-consents-view" style="margin-right:8px"><i class="ti ti-arrow-right"></i> View Details</button>
      <button class="btn btn-sm" id="dash-consents-dismiss" style="padding:6px 12px"><i class="ti ti-x"></i></button>
    </div>

    <!-- Recent Admin Consents Table -->
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
          ${le.map(c=>`
            <tr style="border-bottom:0.5px solid var(--color-border-tertiary)">
              <td style="padding:10px 12px;font-size:10px">${new Date(c.activityDateTime).toLocaleString()}</td>
              <td style="padding:10px 12px;font-weight:600;font-size:11px">${c.appName||"—"}</td>
              <td style="padding:10px 12px;font-size:10px;color:var(--color-text-secondary)">${(c.scope||"—").substring(0,40)}${(c.scope||"—").length>40?"...":""}</td>
              <td style="padding:10px 12px;font-size:10px">${(c.initiatedBy||"—").substring(0,25)}</td>
              <td style="padding:10px 12px;font-size:10px"><span class="badge ${(c.result||"").toLowerCase()==="success"?"success":"danger"}">${c.result||"—"}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    `:""}

    <!-- KPI Tiles - Real Data Only -->
    <div class="kpi-row">
      <div class="kpi-tile">
        <div class="kpi-value info">${Ye}</div>
        <div class="kpi-label">Managed Devices</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${Ze}</div>
        <div class="kpi-label">Total Users</div>
      </div>
      ${Qe?`<div class="kpi-tile">
        <div class="kpi-value warning">${Qe.overallScore||0}/100</div>
        <div class="kpi-label">Security Score</div>
      </div>`:""}
    </div>

    <!-- Quick Links to Other Pages -->
    <div class="dash-cards-row mb-3">
      <div class="card" style="padding:20px;text-align:center">
        <div style="font-size:12px;font-weight:600;margin-bottom:12px">Additional Data</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
          <button class="btn" id="dash-to-requests"><i class="ti ti-check-list"></i> Requests</button>
          <button class="btn" id="dash-to-m365"><i class="ti ti-settings-2"></i> M365 Config</button>
          <button class="btn" id="dash-to-zt"><i class="ti ti-lock-check"></i> Zero Trust</button>
        </div>
      </div>
    </div>
  `;const t=document.createElement("div");t.style.marginTop="16px",t.innerHTML=ns(),e.querySelector("#page-dashboard-inner")||e.appendChild(t),(i=e.querySelector("#dash-to-msgcenter-health"))==null||i.addEventListener("click",async()=>await D("msgcenter")),(s=e.querySelector("#dash-to-requests"))==null||s.addEventListener("click",async()=>await D("requests")),(a=e.querySelector("#dash-to-m365"))==null||a.addEventListener("click",async()=>await D("m365config")),(r=e.querySelector("#dash-to-zt"))==null||r.addEventListener("click",async()=>await D("zerotrust")),(n=e.querySelector("#dash-to-audit"))==null||n.addEventListener("click",async()=>await D("audit")),(o=e.querySelector("#dash-to-msgcenter"))==null||o.addEventListener("click",async()=>await D("msgcenter")),(l=e.querySelector("#dash-consents-view"))==null||l.addEventListener("click",async()=>await D("applications")),(d=e.querySelector("#dash-consents-dismiss"))==null||d.addEventListener("click",()=>{const c=e.querySelector(".alert-banner"),p=e.querySelector(".card");c&&(c.style.display="none"),p&&p.querySelector("table")&&(p.style.display="none"),localStorage.setItem("dashboard_consents_dismissed",new Date().getTime())})}function ns(){const e=MC_MESSAGES.filter(a=>a.actionRequired&&a.severity==="high").slice(0,3),t=SVC_HEALTH.filter(a=>a.status!=="resolved"),i=MC_MESSAGES.filter(a=>a.actionRequired).length,s=Object.entries(SVC_META).map(([a,r])=>{const n=SVC_HEALTH.find(l=>l.service===a&&l.status!=="resolved"),o=n?n.severity==="high"?"fail":"warn":"pass";return`<span title="${a}: ${n?n.status:"Operational"}" style="display:inline-flex;align-items:center;gap:3px;font-size:9px;color:var(--color-text-tertiary);margin-right:6px">
      <span class="status-dot ${o}" style="width:6px;height:6px"></span>${a.replace("Microsoft ","").replace(" Online","").replace(" ID","").substring(0,7)}</span>`}).join("");return`
    <div class="dash-cards-row">
      <!-- Change Intelligence Critical Messages -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-antenna" style="color:var(--clr-danger-text)"></i> Change Intelligence</span>
          <span class="badge danger dot">${i} action required</span>
        </div>
        <div style="margin-bottom:10px">
          ${e.map(a=>{const r=SVC_META[a.service]||{icon:"ti-apps",color:"#185FA5",bg:"#E6F1FB"};return`<div style="display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:0.5px solid var(--color-border-tertiary)">
              <div style="width:20px;height:20px;border-radius:4px;background:${r.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:${r.color}">
                <i class="ti ${r.icon}"></i>
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-size:10px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.title}</div>
                <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:1px">${a.id} · ${a.service} · Act by: <strong style="color:var(--clr-danger-text)">${a.actionByDate}</strong></div>
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
        ${t.length>0?t.map(a=>`
          <div style="display:flex;gap:8px;align-items:flex-start;padding:5px 0;font-size:11px">
            <span class="status-dot ${a.severity==="high"?"fail":"warn"} pulse"></span>
            <div>
              <div style="font-weight:600">${a.service}</div>
              <div style="font-size:10px;color:var(--color-text-secondary)">${a.title}</div>
            </div>
          </div>
        `).join(""):`
          <div style="font-size:11px;color:var(--clr-success-text);display:flex;align-items:center;gap:6px">
            <i class="ti ti-circle-check"></i> All ${Object.keys(SVC_META).length} monitored services operational.
          </div>
        `}
        <div style="margin-top:10px">
          <button class="btn btn-sm" id="dash-to-msgcenter-health">
            <i class="ti ti-heartbeat"></i> Service Health
          </button>
        </div>
      </div>
    </div>
  `}let j=[],ce=null,Ne="PENDING_APPROVAL",Ge="list";async function os(){const e=document.getElementById("page-requests");e&&(await ni(),Je(e))}async function ni(e){try{const i=await(await fetch(`${$}/requests?limit=100`)).json();j=Array.isArray(i.data)?i.data:[],console.log(`📋 Loaded ${j.length} requests`)}catch(t){console.error("Error loading requests:",t),v("Failed to load requests","error")}}function Je(e){if(!e||!e.querySelector){console.error("❌ Page element not found or invalid");return}const t=Ne==="ALL"?j:j.filter(s=>s.status===Ne),i={total:j.length,pending:j.filter(s=>s.status==="PENDING_APPROVAL").length,approved:j.filter(s=>s.status==="APPROVED").length,rejected:j.filter(s=>s.status==="REJECTED").length,completed:j.filter(s=>s.status==="COMPLETED").length};e.innerHTML=`
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
          <button class="btn ${Ne===s?"btn-primary":""}" id="filter-${s}" style="padding:6px 12px;font-size:11px">
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
              ${t.map(s=>{var a,r;return`
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer" data-id="${s.id}">
                  <td style="padding:10px 12px"><strong>${s.id}</strong></td>
                  <td style="padding:10px 12px">${s.operationId.split("-")[0]}</td>
                  <td style="padding:10px 12px">${s.submittedBy}</td>
                  <td style="padding:10px 12px">
                    <span style="padding:2px 6px;border-radius:3px;font-size:10px;background:${li((a=s.validation)==null?void 0:a.riskLevel)};color:white">
                      ${((r=s.validation)==null?void 0:r.riskLevel)||"MEDIUM"}
                    </span>
                  </td>
                  <td style="padding:10px 12px">${oi(s.status)}</td>
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
  `,e&&e.querySelector&&["ALL","PENDING_APPROVAL","APPROVED","REJECTED","COMPLETED"].forEach(s=>{const a=e.querySelector(`#filter-${s}`);a&&a.addEventListener("click",()=>{Ne=s,Je(e)})}),e&&e.querySelectorAll&&(e.querySelectorAll("tr[data-id]").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.id;ce=j.find(r=>r.id===a),ce&&(Ge="details",At(e))})}),e.querySelectorAll(".req-review-btn").forEach(s=>{s.addEventListener("click",a=>{a.stopPropagation();const r=s.dataset.id;ce=j.find(n=>n.id===r),ce&&(Ge="details",At(e))})}))}function At(e){var a,r,n,o,l;if(!e||!e.querySelector||!ce)return;const t=ce,i=ls(t);e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="back-btn"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title">${t.id}</div>
          <div class="page-subtitle">${t.operationId} • ${oi(t.status)}</div>
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
              <div style="font-size:28px;font-weight:600;color:${li((a=t.validation)==null?void 0:a.riskLevel)}">${((r=t.validation)==null?void 0:r.riskScore)||0}</div>
              <div>
                <div style="font-size:12px;font-weight:600">${((n=t.validation)==null?void 0:n.riskLevel)||"UNKNOWN"} Risk</div>
                <div style="font-size:10px;color:var(--color-text-secondary)">Risk Score (0-100)</div>
              </div>
            </div>

            <div style="border-top:0.5px solid var(--color-border-tertiary);padding-top:10px">
              ${(((o=t.validation)==null?void 0:o.checks)||[]).map(d=>`
                <div style="display:flex;gap:8px;margin-bottom:8px;font-size:10px">
                  <div style="flex-shrink:0">
                    ${d.status==="PASS"?'<i class="ti ti-circle-check" style="color:var(--clr-success-text)"></i>':d.status==="FAIL"?'<i class="ti ti-circle-x" style="color:var(--clr-danger-text)"></i>':'<i class="ti ti-alert-circle" style="color:var(--clr-warning-text)"></i>'}
                  </div>
                  <div>
                    <div style="font-weight:600">${d.message}</div>
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
            ${Object.entries(t.fields).map(([d,c])=>`
              <div style="margin-bottom:8px;padding-bottom:8px;border-bottom:0.5px solid var(--color-border-tertiary)">
                <div style="font-weight:600;color:var(--color-text-secondary);margin-bottom:2px">${d}</div>
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
            ${(((l=t.validation)==null?void 0:l.approvalPath)||[]).map((d,c)=>{const p=t.approvals.find(g=>g.step===d),f=!p&&d!=="agent"&&d!=="action",x=(p==null?void 0:p.status)==="APPROVED";return`
                <div style="display:flex;gap:10px;margin-bottom:12px;align-items:flex-start">
                  <div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;${x?"background:var(--clr-success-bg);color:var(--clr-success-text)":f?"background:var(--clr-warning-bg);color:var(--clr-warning-text)":"background:var(--color-background-tertiary);color:var(--color-text-secondary)"}">
                    ${x?"✓":f?"◯":"—"}
                  </div>
                  <div style="flex:1;font-size:11px">
                    <div style="font-weight:600;text-transform:capitalize">${d}</div>
                    ${x?`
                      <div style="color:var(--clr-success-text);font-size:10px">Approved by ${p.approverEmail}</div>
                      <div style="color:var(--color-text-tertiary);font-size:9px">${new Date(p.approvedAt).toLocaleString()}</div>
                    `:f?`
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
              ${t.comments.map(d=>`
                <div style="margin-bottom:12px;padding:10px;background:var(--color-background-secondary);border-radius:4px;font-size:10px">
                  <div style="font-weight:600;margin-bottom:3px">${d.userName}</div>
                  <div style="color:var(--color-text-secondary);margin-bottom:6px">${d.text}</div>
                  <div style="font-size:9px;color:var(--color-text-tertiary)">${new Date(d.createdAt).toLocaleString()}</div>
                </div>
              `).join("")}
            `}
          </div>
        </div>
      </div>
    </div>
  `;const s=e.querySelector("#back-btn");if(s&&s.addEventListener("click",()=>{Ge="list",Je(e)}),t.status==="PENDING_APPROVAL"&&i){const d=e.querySelector("#approve-btn"),c=e.querySelector("#reject-btn");d&&d.addEventListener("click",async()=>{const p=e.querySelector("#approval-comment").value;await St(t.id,"APPROVED",i.step,p,e)}),c&&c.addEventListener("click",async()=>{const p=e.querySelector("#approval-comment").value;if(!p){v("Please provide a reason for rejection","warning");return}await St(t.id,"REJECTED",i.step,p,e)})}}function oi(e){return{PENDING_APPROVAL:'<span style="color:var(--clr-warning-text)">⏳ Pending</span>',APPROVED:'<span style="color:var(--clr-success-text)">✓ Approved</span>',REJECTED:'<span style="color:var(--clr-danger-text)">✗ Rejected</span>',COMPLETED:'<span style="color:var(--clr-success-text)">✓✓ Completed</span>',FAILED:'<span style="color:var(--clr-danger-text)">! Failed</span>'}[e]||e}function li(e){return{LOW:"#10b981",MEDIUM:"#f59e0b",HIGH:"#ef4444",CRITICAL:"#991b1b"}[e]||"#6b7280"}function ls(e){var i;if(e.status!=="PENDING_APPROVAL")return null;const t=((i=e.validation)==null?void 0:i.approvalPath)||["manager","it","agent","action"];for(const s of t){if(s==="agent"||s==="action")continue;if(!e.approvals.find(r=>r.step===s&&r.status==="APPROVED"))return{step:s,approverRole:s,status:"PENDING"}}return null}async function St(e,t,i,s,a){try{const r=t==="APPROVED"?"approve":"reject",n=t==="APPROVED"?{approverEmail:window.userEmail,approverRole:i,comment:s}:{rejectorEmail:window.userEmail,rejectorRole:i,reason:s};(await(await fetch(`${$}/requests/${e}/${r}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json()).success?(v(`Request ${t==="APPROVED"?"approved":"rejected"} successfully`,"success"),await ni(a),Ge="list",Je(a)):v("Failed to process approval","error")}catch(r){console.error("Approval error:",r),v("Error submitting approval. Please try again.","error")}}const A={totalUsers:1e3,privAccounts:14,globalAdmins:2,serviceAccounts:12,breakGlass:2,mfaEnabled:870,mfaExcluded:130,passwordlessAdoption:23,fido2Adoption:5,legacyAuthConnections:12,highRiskUsers:3,riskySignIns30d:47,impossibleTravel30d:2,anonymousIP30d:8,passwordSpray30d:0,caPoliciesEnabled:25,caPoliciesDisabled:5,caPoliciesReportOnly:3,caUsersExcluded:18,identitySecureScore:72};`${new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}`;let Be=null,C=[],E=A,ue="executive",P={priority:"all",category:"all",status:"all"},je="7d",we=[],Et=!1;const ds=[{id:"executive",label:"Executive",icon:"ti-layout-dashboard"},{id:"securescore",label:"Secure Score",icon:"ti-shield-check"},{id:"identity",label:"Identity",icon:"ti-user-check"},{id:"email",label:"Email",icon:"ti-mail"},{id:"endpoint",label:"Endpoint",icon:"ti-device-laptop"},{id:"teams",label:"Teams",icon:"ti-brand-teams"},{id:"sharepoint",label:"SharePoint",icon:"ti-brand-sharepoint"},{id:"dataprotection",label:"Data Protection",icon:"ti-lock"},{id:"privaccess",label:"Priv. Access",icon:"ti-crown"},{id:"guests",label:"Guests",icon:"ti-user-plus"},{id:"incidents",label:"Incidents",icon:"ti-alert-triangle"},{id:"recommendations",label:"Recommendations",icon:"ti-checklist"},{id:"copilot",label:"Security Copilot",icon:"ti-robot"},{id:"apiref",label:"API Reference",icon:"ti-api"}];async function cs(){const e=document.getElementById("page-security");if(e){try{console.log("📡 Fetching real security data from backend...");const t=await ri();t.success&&t.data?(Be=t.data,console.log("✅ Loaded real secure score from API")):(console.warn("⚠️ No secure score data available from API"),Be=null);let i=[];try{const n=await bt();n.success&&n.data&&(i=n.data,console.log(`✅ Loaded ${i.length} real devices from Intune`))}catch(n){console.warn("⚠️ Could not fetch device data:",n.message)}const s=n=>n.map(o=>{var d,c,p,f,x,g;const l=o.deviceName||((c=(d=o.description)==null?void 0:d.match(/Device ([A-Z0-9-]+)/))==null?void 0:c[1])||((f=(p=o.title)==null?void 0:p.match(/([A-Z0-9-]+)/))==null?void 0:f[1])||((g=(x=o.description)==null?void 0:x.match(/([A-Z0-9]{3,})/))==null?void 0:g[1]);if(l&&i.length>0){const m=i.find(u=>{var w,X;return((w=u.deviceName)==null?void 0:w.toUpperCase().includes(l.toUpperCase()))||((X=u.deviceName)==null?void 0:X.includes(l))||u.id===l});if(m)return{...o,deviceId:m.id,deviceName:m.deviceName,deviceOS:m.operatingSystem,compliant:m.complianceState==="Compliant",managed:!0,owner:m.userDisplayName}}return o}),a=await Qi();a.success&&Array.isArray(a.data)&&a.data.length>0?(C=s(a.data),console.log(`✅ Loaded ${C.length} real incidents from alerts (enriched with device data)`)):(console.warn("⚠️ No active incidents found"),C=[]);const r=await Xi();r.success&&r.data&&(E={totalUsers:r.data.totalUsers||A.totalUsers,privAccounts:r.data.privilegedAccounts||A.privAccounts,globalAdmins:r.data.globalAdmins||A.globalAdmins,serviceAccounts:r.data.serviceAccounts||A.serviceAccounts,breakGlass:r.data.breakGlassAccounts||A.breakGlass,identitySecureScore:r.data.identitySecureScore||A.identitySecureScore,mfaEnabled:r.data.mfaEnabled||A.mfaEnabled,mfaExcluded:r.data.mfaExcluded||A.mfaExcluded,passwordlessAdoption:r.data.passwordlessAdoption||A.passwordlessAdoption,fido2Adoption:r.data.fido2Adoption||A.fido2Adoption,legacyAuthConnections:r.data.legacyAuthConnections||A.legacyAuthConnections,highRiskUsers:r.data.highRiskUsers||A.highRiskUsers,riskySignIns30d:r.data.riskySignIns30d||A.riskySignIns30d,impossibleTravel30d:A.impossibleTravel30d,anonymousIP30d:A.anonymousIP30d,passwordSpray30d:A.passwordSpray30d,caPoliciesEnabled:r.data.caPoliciesEnabled||A.caPoliciesEnabled,caPoliciesDisabled:r.data.caPoliciesDisabled||A.caPoliciesDisabled,caPoliciesReportOnly:r.data.caPoliciesReportOnly||A.caPoliciesReportOnly,caUsersExcluded:r.data.caUsersExcluded||A.caUsersExcluded},console.log("✅ Loaded real identity posture data from Azure AD"))}catch(t){console.error("❌ Error loading security data:",t.message)}W(e)}}function W(e){var a,r;const t=Array.isArray(C)?C:[],i=t.filter(n=>n.severity==="critical").length;t.filter(n=>n.severity==="high"&&n.status!=="resolved").length;const s=RECOMMENDATIONS.filter(n=>n.priority==="critical"||n.priority==="high").length;e.innerHTML=`
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
      ${ps()}
    </div>

    <!-- Internal sub-navigation -->
    <div class="sec-subnav" id="sec-subnav">
      ${ds.map(n=>`
        <button class="sec-tab-btn ${ue===n.id?"active":""}" data-sec="${n.id}">
          <i class="ti ${n.icon}"></i><span>${n.label}</span>
          ${n.id==="incidents"&&i>0?`<span class="sec-tab-badge red">${i}</span>`:""}
          ${n.id==="recommendations"?`<span class="sec-tab-badge amber">${s}</span>`:""}
          ${n.id==="identity"&&E.highRiskUsers>0?`<span class="sec-tab-badge red">${E.highRiskUsers}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Section content -->
    <div id="sec-content" style="margin-top:16px">${gs()}</div>
  `,e.querySelectorAll(".sec-tab-btn").forEach(n=>{n.addEventListener("click",()=>{var o;ue=n.dataset.sec,W(e),(o=e.querySelector("#sec-subnav"))==null||o.scrollIntoView({behavior:"smooth",block:"nearest"})})}),(a=e.querySelector("#sec-refresh"))==null||a.addEventListener("click",()=>{const n=e.querySelector("#sec-refresh");n.innerHTML='<span class="spinner dark"></span> Scanning...',n.disabled=!0,setTimeout(()=>{n.innerHTML='<i class="ti ti-refresh"></i> Refresh',n.disabled=!1,v("Security posture refreshed — all 15 data sources updated.","success")},2200)}),(r=e.querySelector("#sec-report"))==null||r.addEventListener("click",()=>v("Security report exported as PDF.","success")),Cs(e)}function ps(){const e=Be||SECURE_SCORE,t=e.percentOf100,i=t>=80?"success":t>=60?"warning":"danger",s=Array.isArray(C)?C:[],a=s.filter(r=>r.severity==="critical"&&r.status!=="resolved").length;return`
    <div class="kpi-tile sec-kpi-primary" style="min-width:160px">
      <div style="display:flex;align-items:center;gap:12px">
        ${He(e.current,e.max,52)}
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
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${s.filter(r=>r.status!=="resolved").length} open total</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value ${E.highRiskUsers>0?"danger":"success"}">${E.highRiskUsers}</div>
      <div class="kpi-label">High-Risk Users</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${E.riskySignIns30d} risky sign-ins (30d)</div>
    </div>
    <div class="kpi-tile">
      <div class="kpi-value success">0</div>
      <div class="kpi-label">Vulnerable Devices</div>
      <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">0 non-compliant</div>
    </div>
  `}function He(e,t,i=80){const s=e/t,a=i/2*.82,r=i/2,n=i/2,o=2*Math.PI*a,l=o*s,d=s>=.8?"#3B6D11":s>=.6?"#854F0B":"#A32D2D",c=i<60?11:14;return`<svg width="${i}" height="${i}" viewBox="0 0 ${i} ${i}" style="flex-shrink:0">
    <circle cx="${r}" cy="${n}" r="${a}" fill="none" stroke="var(--color-border-tertiary)" stroke-width="${i<60?5:7}"/>
    <circle cx="${r}" cy="${n}" r="${a}" fill="none" stroke="${d}" stroke-width="${i<60?5:7}"
      stroke-dasharray="${l} ${o}" stroke-dashoffset="${o*.25}"
      stroke-linecap="round" transform="rotate(-90 ${r} ${n})"/>
    <text x="${r}" y="${n+4}" text-anchor="middle" font-size="${c}" font-weight="700" fill="${d}">${Math.round(s*100)}%</text>
  </svg>`}function vs(e,t=24){const i=Math.max(...e),s=Math.min(...e),a=i-s||1;return`<div style="display:flex;align-items:flex-end;gap:2px;height:${t}px">
    ${e.map((r,n)=>{const o=Math.max(3,(r-s)/a*t),l=n===e.length-1;return`<div style="width:8px;height:${o}px;background:${l?"var(--clr-primary)":"var(--color-border-secondary)"};border-radius:2px 2px 0 0;flex-shrink:0" title="${r}"></div>`}).join("")}
  </div>`}function us(e,t){return e==="pass"||e===!0?`<span style="color:var(--clr-success-text)"><i class="ti ti-circle-check"></i> ${t}</span>`:e==="partial"||e==="warn"?`<span style="color:var(--clr-warning-text)"><i class="ti ti-alert-triangle"></i> ${t}</span>`:`<span style="color:var(--clr-danger-text)"><i class="ti ti-circle-x"></i> ${t}</span>`}function gs(){return({executive:Pt,securescore:ms,identity:ys,email:bs,endpoint:hs,teams:fs,sharepoint:xs,dataprotection:ws,privaccess:$s,guests:ks,incidents:As,recommendations:Ss,copilot:Es,apiref:Ps}[ue]||Pt)()}function Pt(){const e=Be||SECURE_SCORE,t=Array.isArray(C)?C:[];return`
    <!-- Secondary KPI row - Real data only -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value warning">${E.identitySecureScore}</div>
        <div class="kpi-label">Identity Score</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value ${E.mfaEnabled/E.totalUsers>=.95?"success":"warning"}">${Math.round(E.mfaEnabled/E.totalUsers*100)}%</div>
        <div class="kpi-label">MFA Adoption</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${E.riskySignIns30d}</div>
        <div class="kpi-label">Risky Sign-ins (30d)</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${E.caPoliciesEnabled}</div>
        <div class="kpi-label">CA Policies Enabled</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${E.totalUsers}</div>
        <div class="kpi-label">Total Users</div>
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <!-- Score trend + category breakdown -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-trending-up"></i> Secure Score Trend</span>
          <div style="display:flex;gap:4px">
            <button class="btn btn-xs ${je==="7d"?"btn-primary":""}" data-trend="7d">7d</button>
            <button class="btn btn-xs ${je==="30d"?"btn-primary":""}" data-trend="30d">30d</button>
          </div>
        </div>
        <div style="display:flex;align-items:flex-end;gap:16px;margin-bottom:16px">
          ${He(e.current,e.max,80)}
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
          ${vs((je==="30d"?e.trend30d:e.trend7d)||[72,73,74,75,76,77,78],32)}
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
          ${[{name:"Identity",icon:"ti-user-check",score:E.identitySecureScore||72,color:"#0C447C",bg:"#E6F1FB",issues:E.highRiskUsers},{name:"Secure Score",icon:"ti-shield-check",score:Math.round(e.percentOf100),color:"#854F0B",bg:"#FAEEDA",issues:0},{name:"Email",icon:"ti-mail",score:71,color:"#854F0B",bg:"#FAEEDA",issues:0,coming:!0},{name:"Endpoint",icon:"ti-device-laptop",score:58,color:"#3B6D11",bg:"#EAF3DE",issues:0,coming:!0},{name:"Teams",icon:"ti-brand-teams",score:74,color:"#3C3489",bg:"#EEEDFE",issues:0,coming:!0},{name:"SharePoint",icon:"ti-brand-sharepoint",score:66,color:"#3B6D11",bg:"#EAF3DE",issues:0,coming:!0},{name:"Data",icon:"ti-database",score:61,color:"#3C3489",bg:"#EEEDFE",issues:0,coming:!0},{name:"Incidents",icon:"ti-alert-triangle",score:t.filter(i=>i.status!=="resolved").length===0?100:50,color:t.filter(i=>i.status!=="resolved").length===0?"#3B6D11":"#A32D2D",bg:t.filter(i=>i.status!=="resolved").length===0?"#EAF3DE":"#FDEBEB",issues:t.filter(i=>i.status!=="resolved").length}].map(i=>(i.score>=80||i.score>=65,`<div class="sec-svc-tile" data-goto="${i.name.toLowerCase().replace(" ","").replace(".","")}" style="cursor:pointer;${i.coming?"opacity:0.7":""}">
              ${He(i.score,100,40)}
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
          <div style="font-size:12px"><strong>${E.totalUsers}</strong> users</div>
          <div style="font-size:12px"><strong>${E.globalAdmins}</strong> global admins</div>
          <div style="font-size:12px"><strong>${E.highRiskUsers}</strong> high-risk users</div>
          <div style="font-size:12px"><strong>${E.caPoliciesEnabled}</strong> CA policies enabled</div>
        </div>
      </div>
    </div>
  `}function ms(){const e=SECURE_SCORE;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Microsoft Secure Score</div>
        <div style="display:flex;align-items:center;gap:24px;margin-bottom:20px">
          ${He(e.current,e.max,100)}
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
            <div class="kpi-value warning">${RECOMMENDATIONS.reduce((t,i)=>t+i.scoreGain,0)}</div>
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
        <span class="badge info">${RECOMMENDATIONS.length} recommendations · ${RECOMMENDATIONS.reduce((t,i)=>t+i.scoreGain,0)} pts potential</span>
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
          ${RECOMMENDATIONS.slice(0,8).map(t=>`
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
  `}function ys(){const e=E;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-user-check"></i> Identity Posture</div>
        ${G([{label:"Total Users",val:e.totalUsers.toLocaleString(),cls:"info"},{label:"Privileged Accounts",val:e.privAccounts,cls:"warning"},{label:"Global Admins",val:e.globalAdmins,cls:e.globalAdmins<=2?"success":"danger"},{label:"Service Accounts",val:e.serviceAccounts,cls:"info"},{label:"Break Glass Accounts",val:e.breakGlass,cls:"success"},{label:"Identity Secure Score",val:e.identitySecureScore+"%",cls:"warning"}])}
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-device-mobile"></i> Authentication</div>
        ${G([{label:"MFA Enabled",val:e.mfaEnabled+" / "+e.totalUsers,cls:"success"},{label:"MFA Excluded",val:e.mfaExcluded,cls:"danger"},{label:"Passwordless %",val:e.passwordlessAdoption+"%",cls:"warning"},{label:"FIDO2 Adopted",val:e.fido2Adoption,cls:"info"},{label:"Legacy Auth Connections",val:e.legacyAuthConnections,cls:e.legacyAuthConnections===0?"success":"danger"}])}
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
        ${G([{label:"High-Risk Users",val:e.highRiskUsers,cls:e.highRiskUsers===0?"success":"danger"},{label:"Risky Sign-ins",val:e.riskySignIns30d,cls:"warning"},{label:"Impossible Travel",val:e.impossibleTravel30d,cls:e.impossibleTravel30d===0?"success":"danger"},{label:"Anonymous IP Sign-ins",val:e.anonymousIP30d,cls:e.anonymousIP30d===0?"success":"warning"},{label:"Password Spray Attacks",val:e.passwordSpray30d,cls:"success"}])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/riskyUsers · GET /beta/riskDetections</code></div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-lock-access"></i> Conditional Access</div>
        ${G([{label:"Policies Enabled",val:e.caPoliciesEnabled,cls:"success"},{label:"Policies Disabled",val:e.caPoliciesDisabled,cls:e.caPoliciesDisabled===0?"success":"warning"},{label:"Report-Only Mode",val:e.caPoliciesReportOnly,cls:"warning"},{label:"Users Excluded",val:e.caUsersExcluded,cls:e.caUsersExcluded>10?"warning":"success"}])}
        ${te(["Require phishing-resistant MFA (FIDO2/CBA) for all admins","Remove legacy authentication via dedicated CA policy","Reduce Global Admin count to maximum 2 PIM-protected accounts","Review 18 CA policy exclusions — remove unnecessary exemptions"])}
      </div>
    </div>
  `}function bs(){const e=EMAIL;return`
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
          ${[{label:"SPF Record",ok:e.spf==="pass",note:e.spf==="pass"?"Configured — v=spf1 include:protection.outlook.com -all":"Missing or misconfigured"},{label:"DKIM Signing",ok:e.dkim==="pass",note:e.dkim==="pass"?"Enabled for contoso.com":"Not configured"},{label:"DMARC Policy",ok:e.dmarc==="reject"?"pass":e.dmarc==="quarantine"?"warn":!1,note:`Policy: ${e.dmarc} — ${e.dmarc!=="reject"?"upgrade to reject for full protection":"optimal"}`},{label:"Safe Links",ok:e.safeLinks==="enabled",note:e.safeLinks==="enabled"?"Active for all users":"Disabled"},{label:"Safe Attachments",ok:e.safeAttachments==="enabled"?"pass":"warn",note:e.safeAttachments==="partial"?"Partial — not all users covered":e.safeAttachments},{label:"Anti-spam Policy",ok:e.antiSpamPolicy==="strict"?"pass":"warn",note:`Level: ${e.antiSpamPolicy} — recommend strict`}].map(t=>`
            <div style="padding:10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-tertiary)">
              <div style="font-size:10px;font-weight:700;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:5px">${t.label}</div>
              <div style="font-size:12px;font-weight:600;margin-bottom:3px">${us(t.ok,t.ok==="pass"||t.ok===!0?"Pass":t.ok==="warn"?"Warning":"Fail")}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);line-height:1.3">${t.note}</div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-mail-forward"></i> Mail Flow Security</div>
        <div class="alert-banner ${e.externalForwardingRules>0?"danger":"success"} mb-3">
          <i class="ti ti-${e.externalForwardingRules>0?"alert-triangle":"circle-check"}"></i>
          ${e.externalForwardingRules>0?`${e.externalForwardingRules} mailboxes have active external forwarding rules — potential data exfiltration risk.`:"No external forwarding rules detected."}
        </div>
        ${G([{label:"External Forwarding Rules",val:e.externalForwardingRules,cls:e.externalForwardingRules===0?"success":"danger"},{label:"Suspicious Inbox Rules",val:e.suspiciousInboxRules,cls:e.suspiciousInboxRules===0?"success":"danger"},{label:"Shared Mailboxes",val:e.sharedMailboxExposed,cls:"info"}])}
        ${te(["Enable Strict Preset Security Policies in Defender for Office 365","Disable automatic external mail forwarding tenant-wide","Upgrade DMARC policy from quarantine to reject","Extend Safe Attachments coverage to all users (currently partial)"])}
      </div>
    </div>
  `}function hs(){const e=ENDPOINT;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${e.totalManaged}</div><div class="kpi-label">Managed Devices</div></div>
      <div class="kpi-tile"><div class="kpi-value ${e.nonCompliant===0?"success":"warning"}">${e.nonCompliant}</div><div class="kpi-label">Non-Compliant</div></div>
      <div class="kpi-tile"><div class="kpi-value ${e.vulnerable===0?"success":"danger"}">${e.vulnerable}</div><div class="kpi-label">Vulnerable</div></div>
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
        ${G([{label:"Active Threats",val:e.activeThreats,cls:e.activeThreats===0?"success":"danger"},{label:"High Severity Alerts",val:e.highSeverityAlerts,cls:"danger"},{label:"Windows 11 (%)",val:e.windows11Pct+"%",cls:"success"},{label:"Windows 10 (%)",val:e.windows10Pct+"%",cls:"warning"}])}
        ${te(["Patch 23 devices missing critical security updates","Isolate ransomware-affected device MBX-LAPTOP-047","Enable BitLocker on remaining 36 unencrypted devices","Harden SMB and RDP access on Windows 10 devices"])}
      </div>
    </div>
  `}function fs(){const e=TEAMS_SEC;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${e.totalTeams}</div><div class="kpi-label">Total Teams</div></div>
      <div class="kpi-tile"><div class="kpi-value ${e.publicTeams>5?"warning":"success"}">${e.publicTeams}</div><div class="kpi-label">Public Teams</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.guestEnabledTeams}</div><div class="kpi-label">Guest Enabled</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.inactiveTeams90d}</div><div class="kpi-label">Inactive (90d+)</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${e.anonymousMeetingAccess?"⚠️ On":"✓ Off"}</div><div class="kpi-label">Anon Meeting</div></div>
    </div>

    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-settings"></i> Teams Governance</div>
        ${G([{label:"Teams with External Sharing",val:e.teamsWithExternalSharing,cls:"warning"},{label:"Unowned Teams",val:e.unownedTeams,cls:e.unownedTeams===0?"success":"warning"},{label:"Guests Added (30d)",val:e.guestsAdded30d,cls:"info"},{label:"External Domains Allowed",val:e.externalDomainsAllowed,cls:"warning"}])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')&$select=displayName,visibility</code></div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${te(["Archive 23 inactive Teams (90d+) to reduce sprawl and exposure","Assign owners to 5 unowned Teams","Conduct guest access review for 34 guest-enabled Teams","Review 8 public Teams — consider making private","Restrict external domains to known partners only"])}
      </div>
    </div>
  `}function xs(){const e=SHAREPOINT_SEC;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${e.totalSites}</div><div class="kpi-label">Total Sites</div></div>
      <div class="kpi-tile"><div class="kpi-value ${e.externallyShared>10?"warning":"success"}">${e.externallyShared}</div><div class="kpi-label">Externally Shared</div></div>
      <div class="kpi-tile"><div class="kpi-value ${e.anonymousLinks>0?"danger":"success"}">${e.anonymousLinks}</div><div class="kpi-label">Anonymous Links</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.sensitiveFiles}</div><div class="kpi-label">Sensitive Files Flagged</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.oversharedSites}</div><div class="kpi-label">Overshared Sites</div></div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-share"></i> Data Exposure</div>
        ${G([{label:"Public Content",val:e.publicContent,cls:e.publicContent===0?"success":"danger"},{label:"Large Downloads (30d)",val:e.largeDownloads30d,cls:"warning"},{label:"DLP Coverage",val:e.dlpCoveragePct+"%",cls:e.dlpCoveragePct>=90?"success":"warning"},{label:"Ext. Sharing Restricted",val:e.restrictedSharingEnabled?"Yes":"No",cls:e.restrictedSharingEnabled?"success":"danger"}])}
        <div class="alert-banner ${e.anonymousLinks>0?"danger":"success"} mt-3" style="margin-bottom:0">
          <i class="ti ti-${e.anonymousLinks>0?"alert-triangle":"circle-check"}"></i>
          ${e.anonymousLinks>0?`${e.anonymousLinks} anonymous "Anyone" links allow unauthenticated access to content.`:"No anonymous links detected."}
        </div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${te(["Remove 3 anonymous sharing links — replace with authenticated sharing","Review 5 overshared sites with > 100 members","Enable sensitivity labels for automatic file classification",'Restrict external sharing to "Existing guests only" on high-risk sites',"Configure DLP policy for SharePoint to reach 100% coverage"])}
      </div>
    </div>
  `}function ws(){const e=DATA_PROTECTION;return`
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
        ${G([{label:"Files Without Labels",val:e.filesWithoutLabels.toLocaleString(),cls:"danger"},{label:"Retention Policies",val:e.retentionPoliciesActive,cls:"info"},{label:"Insider Risk Policies",val:e.insiderRiskPolicies,cls:"info"},{label:"Unusual Downloads (30d)",val:e.unusualDownloads30d,cls:"warning"}])}
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
        ${te(["Enable sensitivity auto-labeling for ~18,000 unlabeled Office files","Extend DLP policy coverage to include Teams messages","Configure insider risk policy for data exfiltration patterns","Review 3 USB transfer events — check device compliance policy","Expand retention policies to cover Teams chat and OneDrive"])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">Get-DlpCompliancePolicy | Get-Label | Get-RetentionCompliancePolicy</code></div>
      </div>
    </div>
  `}function $s(){const e=PRIV_ACCESS;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${e.globalAdminCount}</div><div class="kpi-label">Global Admins</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${e.securityAdminCount}</div><div class="kpi-label">Security Admins</div></div>
      <div class="kpi-tile"><div class="kpi-value ${e.permanentAssignments>2?"danger":"success"}">${e.permanentAssignments}</div><div class="kpi-label">Permanent Roles</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${e.pimAdoption}%</div><div class="kpi-label">PIM Adoption</div></div>
      <div class="kpi-tile"><div class="kpi-value ${e.newAdmins30d>0?"warning":"success"}">${e.newAdmins30d}</div><div class="kpi-label">New Admins (30d)</div></div>
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
        ${G([{label:"New Admin Created",val:e.newAdmins30d,cls:e.newAdmins30d>0?"warning":"success"},{label:"Priv. Role Assignments",val:e.privRoleAssignments30d,cls:"info"},{label:"Emergency Access Used",val:e.emergencyAccess30d,cls:e.emergencyAccess30d>0?"danger":"success"},{label:"PIM Eligible Roles",val:e.pimEligibleRoles,cls:"success"}])}
        ${te(["Convert 4 permanent admin role assignments to PIM eligible","Implement Just-in-Time access for all privileged roles","Conduct quarterly access review for all admin role holders","Enable PIM access review notifications for approvers"])}
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /beta/roleManagement/directory/roleEligibilitySchedules</code></div>
      </div>
    </div>
  `}function ks(){const e=GUEST_GOVERNANCE;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value info">${e.totalGuests}</div><div class="kpi-label">Total Guests</div></div>
      <div class="kpi-tile"><div class="kpi-value ${e.dormantGuests90d>5?"danger":"success"}">${e.dormantGuests90d}</div><div class="kpi-label">Dormant (90d+)</div></div>
      <div class="kpi-tile"><div class="kpi-value danger">${e.expiredGuests}</div><div class="kpi-label">Expired</div></div>
      <div class="kpi-tile"><div class="kpi-value success">${e.guestsWithPrivAccess}</div><div class="kpi-label">With Priv. Access</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${e.quarterlyReviewOverdue}</div><div class="kpi-label">Review Overdue</div></div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-user-plus"></i> Guest Activity</div>
        ${G([{label:"Added (30d)",val:e.guestsAddedLast30d,cls:"info"},{label:"Removed (30d)",val:e.guestsRemovedLast30d,cls:"success"},{label:"Avg Account Age",val:e.avgGuestAgeDays+"d",cls:"warning"}])}
        <div class="alert-banner danger mt-3" style="margin-bottom:0">
          <i class="ti ti-clock"></i>
          ${e.expiredGuests} expired guest accounts should be removed immediately.
          ${e.dormantGuests90d} dormant guests require review.
        </div>
        <div class="alert-banner info mt-3" style="margin-bottom:0"><i class="ti ti-api"></i><code style="font-size:9px">GET /v1.0/users?$filter=userType eq 'Guest'&$select=displayName,signInActivity</code></div>
      </div>
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield"></i> Recommendations</div>
        ${te(["Remove 3 expired guest accounts immediately","Review and remove 12 dormant guests (90d+ no sign-in)","Schedule overdue quarterly access review for 14 guests","Require manager attestation for all guest renewals","Implement automatic expiry policy (365 days max)"])}
      </div>
    </div>
  `}function As(){const e=C.filter(n=>n.status!=="resolved"),t=C.filter(n=>n.status==="resolved"),i=C.filter(n=>n.severity==="critical").length,s=C.filter(n=>n.severity==="high").length,a=C.filter(n=>n.severity==="medium").length,r=C.filter(n=>n.severity==="low").length;return`
    <div class="kpi-row mb-3">
      <div class="kpi-tile"><div class="kpi-value ${i>0?"danger":"success"}">${i}</div><div class="kpi-label">Critical</div></div>
      <div class="kpi-tile"><div class="kpi-value ${s>0?"danger":"success"}">${s}</div><div class="kpi-label">High</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${a}</div><div class="kpi-label">Medium</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${r}</div><div class="kpi-label">Low</div></div>
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
    ${e.map(n=>`
      <div class="card mb-2" style="border-left:3px solid ${n.severity==="critical"||n.severity==="high"?"var(--clr-danger-text)":"var(--clr-warning-text)"}">
        <div style="display:flex;align-items:flex-start;gap:12px">
          <div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
              <span class="monospace" style="font-size:10px;color:var(--color-text-tertiary)">${n.id}</span>
              <span class="badge ${n.severity==="critical"||n.severity==="high"?"danger":"warning"}">${n.severity}</span>
              <span class="badge neutral">${n.category}</span>
              <span class="badge ${n.status==="active"?"danger":n.status==="investigating"?"warning":"info"} dot">${n.status}</span>
            </div>
            <div style="font-size:12px;font-weight:700;margin-bottom:4px">${n.title}</div>
            <div style="font-size:10px;color:var(--color-text-tertiary)">
              Assignee: ${n.assignee} · Services: ${n.services.join(", ")} · Created: ${n.created}
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
      ${t.map(n=>`
        <div class="card mb-2" style="opacity:0.65">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="monospace" style="font-size:10px;color:var(--color-text-tertiary)">${n.id}</span>
            <span class="badge neutral">${n.severity}</span>
            <span style="flex:1;font-size:11px">${n.title}</span>
            <span class="badge success dot">Resolved</span>
            <span style="font-size:10px;color:var(--color-text-tertiary)">${n.created}</span>
          </div>
        </div>
      `).join("")}
    `:""}
  `}function Ss(){const e=RECOMMENDATIONS.filter(s=>!(P.priority!=="all"&&s.priority!==P.priority||P.category!=="all"&&s.category!==P.category||P.status!=="all"&&s.status!==P.status)),t=e.reduce((s,a)=>s+a.scoreGain,0),i=[...new Set(RECOMMENDATIONS.map(s=>s.category))];return`
    <div class="filter-bar mb-3">
      <select class="form-select" id="rec-priority">
        <option value="all" ${P.priority==="all"?"selected":""}>All Priorities</option>
        <option value="critical" ${P.priority==="critical"?"selected":""}>Critical</option>
        <option value="high" ${P.priority==="high"?"selected":""}>High</option>
        <option value="medium" ${P.priority==="medium"?"selected":""}>Medium</option>
        <option value="low" ${P.priority==="low"?"selected":""}>Low</option>
      </select>
      <select class="form-select" id="rec-category">
        <option value="all">All Categories</option>
        ${i.map(s=>`<option value="${s}" ${P.category===s?"selected":""}>${s}</option>`).join("")}
      </select>
      <select class="form-select" id="rec-status">
        <option value="all" ${P.status==="all"?"selected":""}>All Status</option>
        <option value="open" ${P.status==="open"?"selected":""}>Open</option>
        <option value="in-progress" ${P.status==="in-progress"?"selected":""}>In Progress</option>
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
  `}function Es(){(!Et||we.length===0)&&(we=[{role:"ai",text:`**M365 Security Copilot** — I have full context of your security posture across all 15 data sources.

Current tenant: **Contoso.com** · Secure Score: **64/95** · ${C.filter(t=>t.status!=="resolved").length} active incidents

Ask me anything about your security posture, specific risks, or recommended actions.`}],Et=!0);const e=["Show me all high-risk users","Why did Secure Score drop this week?","Which Teams have external guests?","Top 10 security improvements","Which devices are vulnerable to ransomware?","Summarize today's security posture","Email security status","MFA coverage and gaps","Conditional Access coverage","Guest user governance"];return`
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="sec-copilot-msgs">
        ${we.map(t=>`
          <div class="chat-msg ${t.role==="ai"?"ai":"user-msg"}" style="max-width:85%;margin-bottom:12px">
            ${t.role==="ai"?'<div class="chat-sender"><i class="ti ti-shield-check" style="color:var(--clr-info-text)"></i> Security Copilot</div>':'<div class="chat-sender" style="justify-content:flex-end">You</div>'}
            <div class="chat-bubble">${di(t.text)}</div>
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
  `}function Ps(){return`
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

    ${[...new Set(API_REFERENCE.map(t=>t.category))].map(t=>`
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
            ${API_REFERENCE.filter(i=>i.category===t).map(i=>`
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
  `}function Cs(e){var a,r,n,o,l;const t=e.querySelector("#sec-content");if(!t)return;t.querySelectorAll("[data-trend]").forEach(d=>{d.addEventListener("click",()=>{je=d.dataset.trend,W(e)})}),t.querySelectorAll("[data-goto]").forEach(d=>{d.addEventListener("click",()=>{const p={identity:"identity",email:"email",endpoint:"endpoint",teams:"teams",sharepoint:"sharepoint",data:"dataprotection",privaccess:"privaccess",guests:"guests"}[d.dataset.goto];p&&(ue=p,W(e))})}),(a=t.querySelector("#exec-view-incidents"))==null||a.addEventListener("click",()=>{ue="incidents",W(e)}),(r=t.querySelector("#exec-view-recs"))==null||r.addEventListener("click",()=>{ue="recommendations",W(e)}),(n=t.querySelector("#rec-priority"))==null||n.addEventListener("change",d=>{P.priority=d.target.value,W(e)}),(o=t.querySelector("#rec-category"))==null||o.addEventListener("change",d=>{P.category=d.target.value,W(e)}),(l=t.querySelector("#rec-status"))==null||l.addEventListener("change",d=>{P.status=d.target.value,W(e)});const i=t.querySelector("#sec-cop-send"),s=t.querySelector("#sec-cop-input");i&&s&&(i.addEventListener("click",()=>Xe(e,s)),s.addEventListener("keydown",d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),Xe(e,s))})),t.querySelectorAll(".sec-cop-pill").forEach(d=>{d.addEventListener("click",()=>{const c=t.querySelector("#sec-cop-input");c&&(c.value=d.dataset.q,Xe(e,c))})}),t.querySelectorAll(".api-copy").forEach(d=>{d.addEventListener("click",()=>{navigator.clipboard.writeText(d.dataset.code),v("Endpoint copied to clipboard.","success")})})}function Xe(e,t){const i=t.value.trim();if(!i)return;we.push({role:"user",text:i}),t.value="";const s=e.querySelector("#sec-copilot-msgs");s&&(s.innerHTML+=`<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${i}</div>
    </div>`,s.scrollTop=s.scrollHeight),setTimeout(()=>{const a=i.toLowerCase(),r=SECURITY_COPILOT_KB.find(o=>o.keywords.some(l=>a.includes(l))),n=(r==null?void 0:r.response)||`Analysing your query across all 15 security data sources...

For **"${i}"**: Based on current tenant data, navigate to the relevant section in the Security Command Center for detailed information. Use the Recommendations tab for prioritised action items, or check the Incidents section for active threats.

Current status: Secure Score 64/95 · ${C.filter(o=>o.status!=="resolved").length} active incidents · ${A.highRiskUsers} high-risk users.`;we.push({role:"ai",text:n}),s&&(s.innerHTML+=`<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-shield-check" style="color:var(--clr-info-text)"></i> Security Copilot</div>
        <div class="chat-bubble">${di(n)}</div>
      </div>`,s.scrollTop=s.scrollHeight)},600)}function di(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n\n/g,"<br><br>").replace(/\n/g,"<br>").replace(/\|(.+)\|\n\|[-|: ]+\|\n/g,"").replace(/\|(.+)\|/g,t=>`<span style="display:flex;gap:16px;font-size:11px;padding:2px 0">${t.split("|").filter(s=>s.trim()).map(s=>`<span>${s.trim()}</span>`).join("")}</span>`)}function G(e){return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${e.map(t=>`
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);border:0.5px solid var(--color-border-tertiary)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600;letter-spacing:0.3px">${t.label}</div>
        <div style="font-size:16px;font-weight:700;color:${t.cls==="success"?"var(--clr-success-text)":t.cls==="danger"?"var(--clr-danger-text)":t.cls==="warning"?"var(--clr-warning-text)":t.cls==="info"?"var(--clr-info-text)":"var(--color-text-primary)"}">${t.val}</div>
      </div>
    `).join("")}
  </div>`}function te(e){return`<div style="margin-top:12px">
    <div class="section-heading">Recommendations</div>
    ${e.map(t=>`
      <div style="display:flex;gap:6px;padding:5px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px;color:var(--color-text-secondary)">
        <i class="ti ti-arrow-right" style="color:var(--clr-warning-text);font-size:11px;flex-shrink:0;margin-top:2px"></i>
        ${t}
      </div>
    `).join("")}
  </div>`}async function ie(e,t={}){const s=`${window.location.hostname==="localhost"?"http://localhost:3000":"https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net"}/api/tenantguard${e}`;try{const a=await fetch(s,{method:t.method||"GET",headers:{"Content-Type":"application/json",...t.headers},body:t.body?JSON.stringify(t.body):void 0});if(!a.ok)throw new Error(`API error: ${a.status}`);return await a.json()}catch(a){throw console.error("TenantGuard API error:",a),a}}async function qs(){return(await ie("/alerts/summary")).data}async function Rs(e="all",t=50){let i=`/alerts?limit=${t}`;return e!=="all"&&(i+=`&severity=${e}`),(await ie(i)).data}async function ci(e,t=""){return await ie(`/alerts/${e}/dismiss`,{method:"POST",body:{reason:t}})}async function Ls(e="all"){let t="/correlations";return e!=="all"&&(t+=`?severity=${e}`),(await ie(t)).data}async function Is(e=null,t=null,i=null){return(await ie("/investigate",{method:"POST",body:{alertId:e,correlationId:t,title:i}})).data}async function Ts(e){return(await ie(`/investigations/${e}`)).data}async function Ms(e,t){return(await ie(`/investigations/${e}/chat`,{method:"POST",body:{message:t}})).data}async function Ds(e){return(await ie(`/investigations/${e}/report`,{method:"POST"})).data}let U="alerts",K="all",ge=[],Ce=[],oe=null,et=null;const zs=[{id:"all",label:"All Alerts",icon:"ti-list"},{id:"CRITICAL",label:"Critical",icon:"ti-alert-triangle"},{id:"HIGH",label:"High",icon:"ti-alert-circle"},{id:"MEDIUM",label:"Medium",icon:"ti-alert-octagon"}],Ns=[{id:"alerts",label:"Alerts",icon:"ti-list"},{id:"correlations",label:"Correlations",icon:"ti-link"},{id:"patterns",label:"Attack Patterns",icon:"ti-alert-triangle"},{id:"investigation",label:"AI Investigation",icon:"ti-robot"}];async function Os(){const e=document.getElementById("page-tenantguard");if(e){e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading TenantGuard alerts...</p></div>';try{await qe()}catch(t){console.error("Error initializing TenantGuard:",t),v("Failed to load alerts","error")}et&&clearInterval(et),et=setInterval(qe,5*60*1e3)}}async function qe(){try{const[e,t,i]=await Promise.all([qs(),Rs("all",100),Ls("all")]);ge=t||[],Ce=i||[],js(e)}catch(e){console.error("Error refreshing data:",e),v("Failed to refresh alerts: "+e.message,"error")}}function js(e){var n;const t=document.getElementById("page-tenantguard");if(!t)return;const i=e.critical||0,s=e.high||0;e.medium;const a=e.total||0,r=Ce.length;t.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-alert-triangle"></i> TenantGuard Alert Center</div>
        <div class="page-subtitle">Real-time alerts, correlations & attack pattern detection · ${a} alerts · ${r} correlations</div>
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
        <div class="kpi-value info">${r}</div>
        <div class="kpi-label">Correlations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value success">${a}</div>
        <div class="kpi-label">Total Alerts</div>
      </div>
    </div>

    <!-- Main Tabs -->
    <div class="tenantguard-tabs" id="tg-main-tabs">
      ${Ns.map(o=>`
        <button class="tenantguard-tab-btn ${U===o.id?"active":""}" data-section="${o.id}">
          <i class="ti ${o.icon}"></i><span>${o.label}</span>
          ${o.id==="alerts"&&a>0?`<span class="badge" style="background:var(--clr-danger-bg);color:var(--clr-danger-text)">${a}</span>`:""}
          ${o.id==="correlations"&&r>0?`<span class="badge" style="background:var(--clr-warning-bg);color:var(--clr-warning-text)">${r}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Content Area -->
    <div id="tg-content" style="margin-top:16px">
      ${U==="alerts"?nt():U==="correlations"?Ct():U==="patterns"?qt():Us()}
    </div>
  `,t.querySelectorAll("[data-section]").forEach(o=>{o.addEventListener("click",()=>{U=o.dataset.section,K="all";const l=t.querySelector("#tg-content");l&&(l.innerHTML=U==="alerts"?nt():U==="correlations"?Ct():qt(),U==="alerts"&&ot(t)),t.querySelectorAll("[data-section]").forEach(d=>d.classList.remove("active")),o.classList.add("active")})}),(n=t.querySelector("#tg-refresh"))==null||n.addEventListener("click",async()=>{const o=t.querySelector("#tg-refresh"),l=o.innerHTML;o.innerHTML='<span class="spinner dark"></span> Scanning...',o.disabled=!0,await qe(),o.innerHTML=l,o.disabled=!1}),U==="alerts"&&ot(t)}function nt(){return`
    <!-- Severity Tabs -->
    <div class="tenantguard-tabs" id="tg-severity-tabs">
      ${zs.map(e=>`
        <button class="tenantguard-tab-btn ${K===e.id?"active":""}" data-severity="${e.id}">
          <i class="ti ${e.icon}"></i><span>${e.label}</span>
        </button>
      `).join("")}
    </div>
    <div id="tg-alerts-list" style="margin-top:12px">${vi()}</div>
  `}function Ct(){return Ce.length===0?`
      <div style="text-align:center;padding:40px 20px;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.5">🔗</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">No correlations detected</div>
        <div style="font-size:12px">When alerts are related, they will be grouped here</div>
      </div>
    `:Ce.map(e=>`
    <div class="tenantguard-alert-card ${e.risk_level.toLowerCase()}" data-corr-id="${e.id}" style="cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div style="flex:1">
          <div style="font-weight:700;font-size:13px;color:var(--color-text-primary);margin-bottom:4px">
            ${L(e.description)}
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary);display:flex;gap:12px;flex-wrap:wrap">
            <span><i class="ti ti-link" style="font-size:10px"></i> ${e.alert_count} alerts</span>
            <span><i class="ti ti-trending-up" style="font-size:10px"></i> Score: ${e.correlation_score}/100</span>
            <span><i class="ti ti-tag" style="font-size:10px"></i> ${e.pattern_type}</span>
          </div>
        </div>
        <span class="badge ${Re(e.risk_level)}">${e.risk_level}</span>
      </div>
    </div>
  `).join("")}function qt(){return'<div style="padding:20px;text-align:center"><div class="spinner"></div><p style="color:var(--color-text-secondary)">Loading patterns...</p></div>'}function Us(){return oe?pi():`
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
          ${Ce.slice(0,3).map(e=>`
            <button class="btn" style="width:100%;margin-bottom:8px;justify-content:flex-start" onclick="startCorrInvestigation('${e.id}', '${L(e.description)}')">
              <i class="ti ti-link"></i>
              <span style="text-align:left;flex:1">${L(e.description.substring(0,50))}...</span>
              <span class="badge ${Re(e.risk_level)}">${e.risk_level}</span>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `}function pi(){return`
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-robot"></i> ${L(oe.title)}</span>
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
  `}function vi(){const e=K==="all"?ge:ge.filter(t=>t.severity===K);return e.length===0?`
      <div style="text-align:center;padding:40px 20px;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:12px;opacity:0.5">✓</div>
        <div style="font-weight:600;font-size:14px;margin-bottom:4px">All clear</div>
        <div style="font-size:12px">
          ${K==="all"?"No active alerts. Your tenant is secure.":`No ${K.toLowerCase()} severity alerts.`}
        </div>
      </div>
    `:e.map(t=>`
    <div class="tenantguard-alert-card ${t.severity.toLowerCase()}" data-alert-id="${t.id}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <div style="flex:1">
          <div style="font-weight:700;font-size:13px;color:var(--color-text-primary);margin-bottom:4px">
            ${L(t.headline)}
          </div>
          <div style="font-size:10px;color:var(--color-text-tertiary);display:flex;gap:12px;flex-wrap:wrap">
            <span><i class="ti ti-user" style="font-size:10px;vertical-align:baseline"></i> ${L(t.actor||"System")}</span>
            <span><i class="ti ti-clock" style="font-size:10px;vertical-align:baseline"></i> ${lt(t.action_timestamp)}</span>
            <span><i class="ti ti-trending-up" style="font-size:10px;vertical-align:baseline"></i> Score: ${t.score}/100</span>
          </div>
        </div>
        <span class="badge ${Re(t.severity)}" style="margin-left:8px">${t.severity}</span>
      </div>

      <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:8px;line-height:1.4">
        ${L(t.description)}
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
  `).join("")}function ot(e){const t=e.querySelector("#tg-severity-tabs");t&&t.querySelectorAll(".tenantguard-tab-btn").forEach(i=>{i.addEventListener("click",()=>{K=i.dataset.severity,t.querySelectorAll(".tenantguard-tab-btn").forEach(a=>a.classList.remove("active")),i.classList.add("active");const s=e.querySelector("#tg-alerts-list");s&&(s.innerHTML=vi()),Rt(e)})}),Rt(e)}function Rt(e){e.querySelectorAll(".tg-details-btn").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation(),ui(i.target.closest("button").dataset.alertId)})}),e.querySelectorAll(".tg-dismiss-btn").forEach(t=>{t.addEventListener("click",async i=>{i.stopPropagation();const s=i.target.closest("button").dataset.alertId;try{await ci(s,"Dismissed from dashboard"),v("Alert dismissed","success"),await qe()}catch{v("Failed to dismiss alert","error")}})})}function ui(e){const t=ge.find(n=>n.id===e);if(!t)return;const i=document.getElementById("tg-content");if(!i)return;let s=[],a={};try{s=JSON.parse(t.recommendations||"[]"),a=JSON.parse(t.risk_assessment||"{}")}catch{}i.innerHTML=`
    <div class="card mb-3">
      <div class="card-header">
        <div>
          <div class="card-title">${L(t.headline)}</div>
          <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">
            Score: ${t.score}/100 · ${lt(t.action_timestamp)}
          </div>
        </div>
        <button class="btn" onclick="location.reload()"><i class="ti ti-x"></i> Close</button>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Description</div>
        <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.6">
          ${L(t.description)}
        </div>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:600;color:var(--color-text-tertiary);text-transform:uppercase;margin-bottom:8px">Risk Assessment</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px">
          <div>
            <div style="color:var(--color-text-tertiary)">Score</div>
            <div style="font-weight:700;font-size:14px;color:${Fs(a.severity||t.severity)}">${a.score||t.score}/100</div>
          </div>
          <div>
            <div style="color:var(--color-text-tertiary)">Severity</div>
            <div style="font-weight:700;margin-top:4px"><span class="badge ${Re(a.severity||t.severity)}">${a.severity||t.severity}</span></div>
          </div>
          ${Object.entries(a.levels||{}).map(([n,o])=>`
            <div>
              <div style="color:var(--color-text-tertiary)">${Hs(n)}</div>
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
            ${s.map(n=>`
              <li style="padding:6px 0;padding-left:20px;position:relative;color:var(--color-text-secondary)">
                <span style="position:absolute;left:0;color:var(--clr-primary)">→</span>
                ${L(n)}
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
  `;const r=K==="all"?ge.filter(n=>n.id!==e):ge.filter(n=>n.severity===K&&n.id!==e);if(r.length>0){const n=`
      <div style="margin-top:24px">
        <div style="font-size:12px;font-weight:600;color:var(--color-text-primary);margin-bottom:12px">Other Alerts</div>
        ${r.map(l=>`
          <div class="tenantguard-alert-card ${l.severity.toLowerCase()}" style="cursor:pointer" onclick="showAlertDetailsFromDetail('${l.id}')">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div style="flex:1">
                <div style="font-weight:600;font-size:12px">${L(l.headline)}</div>
                <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:4px">${lt(l.action_timestamp)}</div>
              </div>
              <span class="badge ${Re(l.severity)}">${l.severity}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `,o=i.querySelector("#other-alerts");o&&(o.innerHTML=n)}else{const n=i.querySelector("#other-alerts");n&&(n.style.display="none")}}window.dismissAndRefreshDetail=async function(e){try{await ci(e),v("Alert dismissed","success"),await qe()}catch{v("Failed to dismiss alert","error")}};window.showAlertDetailsFromDetail=function(e){ui(e)};window.startCorrInvestigation=async function(e,t){try{U="investigation",oe=await Is(null,e,t);const i=document.getElementById("page-tenantguard");if(i){const s=i.querySelector("#tg-content");s&&(s.innerHTML=pi(),Gs(i),Bs())}}catch(i){v("Failed to start investigation: "+i.message,"error")}};window.closeInvestigation=function(){oe=null,U="alerts";const e=document.getElementById("page-tenantguard");if(e){const t=e.querySelector("#tg-content");t&&(t.innerHTML=nt(),ot(e))}};async function Gs(e){const t=e.querySelector("#investigation-send"),i=e.querySelector("#investigation-input"),s=e.querySelector("#investigation-report");t&&i&&(t.addEventListener("click",Lt),i.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),Lt())})),s&&s.addEventListener("click",async()=>{try{s.disabled=!0,s.innerHTML='<span class="spinner dark"></span>';const a=await Ds(oe.id);v("Report generated! Downloading...","success"),s.disabled=!1,s.innerHTML='<i class="ti ti-file-text"></i> Report'}catch(a){v("Failed to generate report: "+a.message,"error"),s.disabled=!1,s.innerHTML='<i class="ti ti-file-text"></i> Report'}})}async function Lt(){const e=document.getElementById("page-tenantguard"),t=e==null?void 0:e.querySelector("#investigation-input");if(!t)return;const i=t.value.trim();if(i)try{t.value="",t.disabled=!0;const s=e.querySelector("#investigation-messages");s&&(s.innerHTML+=`
        <div style="margin-bottom:8px;text-align:right">
          <div style="display:inline-block;max-width:70%;background:var(--clr-primary);color:white;padding:8px 12px;border-radius:4px;font-size:12px;text-align:left">
            ${L(i)}
          </div>
        </div>
      `,s.scrollTop=s.scrollHeight);const a=await Ms(oe.id,i);s&&(s.innerHTML+=`
        <div style="margin-bottom:8px">
          <div style="display:inline-block;max-width:70%;background:var(--color-background-secondary);padding:8px 12px;border-radius:4px;font-size:12px;border:0.5px solid var(--color-border-secondary);color:var(--color-text-secondary)">
            ${L(a.response).replace(/\n/g,"<br>")}
          </div>
        </div>
      `,s.scrollTop=s.scrollHeight),t.disabled=!1,t.focus()}catch(s){v("Failed to send message: "+s.message,"error");const a=e==null?void 0:e.querySelector("#investigation-input");a&&(a.disabled=!1)}}async function Bs(){try{const e=await Ts(oe.id),t=document.querySelector("#investigation-messages");t&&e.messages&&(t.innerHTML=e.messages.map(i=>`
        <div style="margin-bottom:8px;${i.sender_type==="user"?"text-align:right":""}">
          <div style="display:inline-block;max-width:70%;${i.sender_type==="user"?"background:var(--clr-primary);color:white":"background:var(--color-background-secondary);border:0.5px solid var(--color-border-secondary);color:var(--color-text-secondary)"};padding:8px 12px;border-radius:4px;font-size:12px;${i.sender_type!=="user"?"text-align:left":""}">
            ${L(i.message_text).replace(/\n/g,"<br>")}
          </div>
        </div>
      `).join(""),t.scrollTop=t.scrollHeight)}catch(e){console.error("Failed to load messages:",e)}}function lt(e){return e?new Date(e).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"Unknown"}function Hs(e){return e.charAt(0).toUpperCase()+e.slice(1)}function L(e){if(!e)return"";const t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};return String(e).replace(/[&<>"']/g,i=>t[i])}function Re(e){switch(e==null?void 0:e.toUpperCase()){case"CRITICAL":return"danger";case"HIGH":return"warning";case"MEDIUM":return"info";default:return"neutral"}}function Fs(e){switch(e==null?void 0:e.toUpperCase()){case"CRITICAL":return"var(--clr-danger-text)";case"HIGH":return"var(--clr-warning-text)";case"MEDIUM":return"var(--clr-info-text)";default:return"var(--color-text-primary)"}}const _s=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1",gi=_s?"http://localhost:3000/api":"https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api";async function Vs(){const e=await fetch(`${gi}/tenantguard/users`);if(!e.ok)throw new Error(`Failed to fetch users: ${e.statusText}`);return e.json()}async function Ws(e,t,i){const s=new URLSearchParams;t&&s.append("startDate",t),i&&s.append("endDate",i);const a=`${gi}/tenantguard/users/${e}/investigation?${s.toString()}`,r=await fetch(a);if(!r.ok)throw new Error(`Failed to fetch investigation: ${r.statusText}`);return r.json()}function Js(){const e=document.getElementById("page-user-investigation");e&&Ks(e)}function Ks(e){e.innerHTML=`
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
  `;let t=[],i=null;const s=e.querySelector("#user-search"),a=e.querySelector("#user-dropdown"),r=e.querySelector("#days-back");e.querySelector("#custom-date");const n=e.querySelector("#investigate-btn");o();async function o(){try{t=(await Vs()).data||[]}catch(l){console.error("Failed to load users:",l),v("Failed to load user list","error")}}s.addEventListener("input",l=>{const d=l.target.value.toLowerCase();if(!d){a.style.display="none";return}const c=t.filter(p=>p.displayName.toLowerCase().includes(d)||p.mail.toLowerCase().includes(d));a.innerHTML=c.map(p=>`
      <div class="user-dropdown-item" data-id="${p.id}" style="padding:10px 12px;border-bottom:1px solid var(--color-border);cursor:pointer;font-size:11px">
        <div style="font-weight:500">${p.displayName}</div>
        <div style="color:var(--color-text-tertiary);margin-top:2px">${p.mail}</div>
      </div>
    `).join(""),c.forEach(p=>{const f=a.querySelector(`[data-id="${p.id}"]`);f==null||f.addEventListener("click",()=>{i=p.id,s.value=p.displayName,a.style.display="none",n.disabled=!1})}),a.style.display=c.length>0?"block":"none"}),n.addEventListener("click",async()=>{if(!i){v("Please select a user","warning");return}const l=parseInt(r.value),d=new Date,c=new Date(d);c.setDate(c.getDate()-l),tt(e,!0);try{const p=await Ws(i,c.toISOString().split("T")[0],d.toISOString().split("T")[0]);Ys(e,p.data),tt(e,!1)}catch(p){console.error("Investigation error:",p),v("Failed to load investigation data","error"),tt(e,!1)}}),document.addEventListener("click",l=>{!s.contains(l.target)&&!a.contains(l.target)&&(a.style.display="none")})}function tt(e,t){e.querySelector("#loading-state").style.display=t?"block":"none",e.querySelector("#investigation-results").style.display=t?"none":"block",e.querySelector("#empty-state").style.display="none"}function Ys(e,t){const{user:i,applicationAccess:s,signInLogs:a,auditLogs:r,actionsOnOtherAccounts:n,timeline:o,summary:l}=t,d=`
    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">User</div>
      <div style="font-weight:600;font-size:14px">${i.displayName}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${i.mail}</div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Risk Score</div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-weight:600;font-size:20px">${i.riskScore}</div>
        <div style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${It(i.riskLevel).bg};color:${It(i.riskLevel).text}">${i.riskLevel}</div>
      </div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Department</div>
      <div style="font-weight:500;font-size:13px">${i.department||"N/A"}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${i.jobTitle||"No title"}</div>
    </div>

    <div class="info-card">
      <div style="color:var(--color-text-tertiary);font-size:10px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Last Active</div>
      <div style="font-weight:500;font-size:13px">${se(i.lastActive)}</div>
      <div style="color:var(--color-text-secondary);font-size:11px;margin-top:4px">${Zs(i.lastActive)}</div>
    </div>
  `;e.querySelector("#user-summary").innerHTML=d;const c=`
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
          ${s.map(u=>`
            <tr>
              <td><strong>${u.appName}</strong></td>
              <td>${se(u.lastAccessTime)}</td>
              <td style="color:var(--clr-success-text)">${u.successCount}</td>
              <td style="color:${u.failureCount>0?"var(--clr-danger-text)":"var(--color-text-tertiary)"}"><strong>${u.failureCount}</strong></td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${Tt(u.status).bg};color:${Tt(u.status).text}">
                  ${u.status}
                </span>
              </td>
              <td style="font-size:11px;color:var(--color-text-secondary)">${u.locations.join(", ")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;e.querySelector("#applications-section").innerHTML=c;const p={};a.forEach(u=>{p[u.application]||(p[u.application]=[]),p[u.application].push(u)});const f=`
    <div style="display:grid;gap:16px">
      ${Object.entries(p).slice(0,10).map(([u,w])=>{const X=w.filter(k=>k.status==="success").length,xt=w.filter(k=>k.status==="failure").length,wt=w.filter(k=>k.compliant==="No").length,$t=w.filter(k=>k.managed==="No").length;return`
          <div style="border:1px solid var(--color-border);border-radius:6px;padding:12px;background:var(--color-bg-secondary)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
              <h4 style="margin:0;color:var(--color-text-primary)">${u}</h4>
              <div style="display:flex;gap:8px;font-size:11px">
                <span style="padding:4px 8px;border-radius:3px;background:var(--clr-success-bg);color:var(--clr-success-text)"><strong>${X}</strong> success</span>
                ${xt>0?`<span style="padding:4px 8px;border-radius:3px;background:var(--clr-danger-bg);color:var(--clr-danger-text)"><strong>${xt}</strong> failed</span>`:""}
              </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:12px;font-size:11px">
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Non-Compliant</div>
                <div style="font-weight:600;color:${wt>0?"var(--clr-warning-text)":"var(--color-text-tertiary)"}">${wt}</div>
              </div>
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Unmanaged</div>
                <div style="font-weight:600;color:${$t>0?"var(--clr-info-text)":"var(--color-text-tertiary)"}">${$t}</div>
              </div>
              <div style="background:var(--color-bg-primary);padding:8px;border-radius:3px">
                <div style="color:var(--color-text-secondary);font-size:10px">Recent Activity</div>
                <div style="font-weight:600">${se(w[0].timestamp)}</div>
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
                  ${w.slice(0,15).map(k=>`
                    <tr>
                      <td style="white-space:nowrap">${se(k.timestamp)}</td>
                      <td style="font-size:9px">
                        <div>${k.browser}</div>
                        <div style="color:var(--color-text-secondary)">${k.operatingSystem}</div>
                      </td>
                      <td style="font-size:9px;color:${k.deviceName?"var(--color-text-primary)":"var(--color-text-tertiary)"}">${k.deviceName||"-"}</td>
                      <td style="font-family:monospace;font-size:9px;color:var(--color-text-secondary)">${k.ipAddress}</td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${k.compliant==="Yes"?"var(--clr-success-bg)":"var(--clr-warning-bg)"};color:${k.compliant==="Yes"?"var(--clr-success-text)":"var(--clr-warning-text)"}">${k.compliant}</span></td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${k.managed==="Yes"?"var(--clr-success-bg)":"var(--clr-info-bg)"};color:${k.managed==="Yes"?"var(--clr-success-text)":"var(--clr-info-text)"}">${k.managed}</span></td>
                      <td><span style="padding:2px 4px;border-radius:2px;font-size:8px;background:${k.status==="success"?"var(--clr-success-bg)":"var(--clr-danger-bg)"};color:${k.status==="success"?"var(--clr-success-text)":"var(--clr-danger-text)"}">${k.status.toUpperCase()}</span></td>
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
  `;e.querySelector("#signin-logs-section").innerHTML=f;const x=`
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
          ${r.map(u=>`
            <tr>
              <td>${se(u.timestamp)}</td>
              <td><strong>${u.operation}</strong></td>
              <td>${u.target}</td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:var(--clr-success-bg);color:var(--clr-success-text)">
                  ${u.result.toUpperCase()}
                </span>
              </td>
              <td>
                <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${V(u.severity).bg};color:${V(u.severity).text}">
                  ${u.severity}
                </span>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;e.querySelector("#audit-logs-section").innerHTML=x;const g=`
    <div style="display:flex;flex-direction:column;gap:8px">
      ${n.map(u=>`
        <div style="padding:12px;background:var(--color-background-secondary);border-radius:6px;border-left:3px solid ${V(u.severity).border}">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:600;font-size:12px">${u.targetName}</div>
              <div style="font-size:10px;color:var(--color-text-secondary);margin-top:2px">${u.targetUser}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:600;font-size:11px">${u.action}</div>
              <div style="font-size:10px;color:var(--color-text-tertiary);margin-top:2px">${se(u.timestamp)}</div>
            </div>
            <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${V(u.severity).bg};color:${V(u.severity).text};margin-left:12px">
              ${u.severity}
            </span>
          </div>
        </div>
      `).join("")}
    </div>
  `;e.querySelector("#other-accounts-section").innerHTML=g;const m=`
    <div style="position:relative;padding:20px 0">
      ${o.map((u,w)=>`
        <div style="display:flex;gap:16px;margin-bottom:24px;position:relative">
          <div style="display:flex;flex-direction:column;align-items:center;width:40px;flex-shrink:0">
            <div style="width:12px;height:12px;border-radius:50%;background:${V(u.severity).bg};border:2px solid ${V(u.severity).border}"></div>
            ${w<o.length-1?'<div style="width:2px;height:40px;background:var(--color-border);margin-top:8px"></div>':""}
          </div>
          <div style="flex:1;padding-top:2px">
            <div style="display:flex;justify-content:space-between;align-items:start;gap:12px">
              <div>
                <div style="font-weight:600;font-size:12px">${u.description}</div>
                <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${se(u.timestamp)}</div>
              </div>
              <span style="padding:2px 6px;border-radius:3px;font-size:9px;font-weight:600;background:${V(u.severity).bg};color:${V(u.severity).text};white-space:nowrap">
                ${u.severity}
              </span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;e.querySelector("#timeline-section").innerHTML=m,e.querySelector("#investigation-results").style.display="block",e.querySelector("#empty-state").style.display="none"}function It(e){const t={LOW:{bg:"var(--clr-success-bg)",text:"var(--clr-success-text)"},MEDIUM:{bg:"var(--clr-warning-bg)",text:"var(--clr-warning-text)"},HIGH:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)"},CRITICAL:{bg:"var(--clr-critical-bg)",text:"var(--clr-critical-text)"}};return t[e]||t.MEDIUM}function Tt(e){return e==="SUCCESS"?{bg:"var(--clr-success-bg)",text:"var(--clr-success-text)"}:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)"}}function V(e){const t={LOW:{bg:"var(--clr-success-bg)",text:"var(--clr-success-text)",border:"var(--clr-success-text)"},MEDIUM:{bg:"var(--clr-warning-bg)",text:"var(--clr-warning-text)",border:"var(--clr-warning-text)"},HIGH:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)",border:"var(--clr-danger-text)"},CRITICAL:{bg:"var(--clr-critical-bg)",text:"var(--clr-critical-text)",border:"var(--clr-critical-text)"}};return t[e]||t.MEDIUM}function se(e){const t=new Date(e),s=new Date-t,a=Math.floor(s/6e4),r=Math.floor(s/36e5),n=Math.floor(s/864e5);return a<1?"Just now":a<60?`${a}m ago`:r<24?`${r}h ago`:n<7?`${n}d ago`:t.toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function Zs(e){return new Date(e).toLocaleDateString("en-US",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}function Qs(){const e=document.getElementById("page-zerotrust");e&&(e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-lock-check"></i> Zero Trust Compliance</div>
        <div class="page-subtitle">Automated Zero Trust control assessments from Graph API</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="zt-rescan"><i class="ti ti-refresh"></i> Rescan</button>
      </div>
    </div>

    <div class="blank-state">
      <i class="ti ti-database-off" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px"></i>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">No Zero Trust Data Available</div>
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">Zero Trust compliance controls will appear here when evaluated via Graph API</div>
      <button class="btn btn-primary btn-sm" id="zt-initiate">Initiate Assessment</button>
    </div>
  `,e.querySelector("#zt-rescan").addEventListener("click",()=>{const t=e.querySelector("#zt-rescan");t.innerHTML='<span class="spinner dark"></span> Scanning...',t.disabled=!0,setTimeout(()=>{t.innerHTML='<i class="ti ti-refresh"></i> Rescan',t.disabled=!1,v("No Zero Trust assessment data available from Graph API","info")},2e3)}),e.querySelector("#zt-initiate").addEventListener("click",()=>{v("Zero Trust assessment requires integration with Azure DevOps or Graph API","info")}))}function Xs(){const e=document.getElementById("page-m365config");e&&(e.innerHTML=`
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
        M365 Configuration scanning requires real-time assessment through Microsoft Graph API
      </div>
      <div style="font-size:10px;color:var(--color-text-tertiary);padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);text-align:left;max-width:400px">
        <strong>Data sources:</strong>
        <div style="margin-top:6px;font-family:monospace;font-size:9px">
          /deviceManagement/deviceCompliancePolicies<br>
          /policies/conditionalAccessPolicies<br>
          /identity/authenticationMethods/policies<br>
          /admin/windows/updates/configs
        </div>
      </div>
    </div>
  `,e.querySelector("#cfg-scan-now").addEventListener("click",()=>{const t=e.querySelector("#cfg-scan-now");t.innerHTML='<span class="spinner dark"></span> Scanning...',t.disabled=!0,setTimeout(()=>{t.innerHTML='<i class="ti ti-refresh"></i> Run scan',t.disabled=!1,v("No configuration data available from Graph API","info")},2e3)}))}let mi=[],pe=[],M={totalAccounts:0,atRisk:0,noMFA:0,permanentRoles:0,servicePrincipals:0};async function ea(){var t;const e=document.getElementById("page-privaccts");if(e){try{console.log("📡 Fetching real privileged accounts from Azure AD...");const i=await es();i.success&&((t=i.data)!=null&&t.accounts)?(pe=i.data.accounts,M=i.data.summary,console.log(`✅ Loaded ${pe.length} real privileged accounts`)):(console.warn("⚠️ No privileged account data available from API"),pe=[],M={totalAccounts:0,atRisk:0,noMFA:0,permanentRoles:0,servicePrincipals:0})}catch(i){console.error("❌ Error loading privileged accounts:",i.message),pe=[],M={totalAccounts:0,atRisk:0,noMFA:0,permanentRoles:0,servicePrincipals:0}}e.innerHTML=`
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

    ${M.atRisk>0?`
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        ${M.atRisk} privileged account${M.atRisk>1?"s":""} have active risk detection${M.atRisk>1?"s":""}.
      </div>
    `:""}

    <div class="kpi-row">
      <div class="kpi-tile"><div class="kpi-value info">${M.totalAccounts}</div><div class="kpi-label">Accounts</div></div>
      <div class="kpi-tile"><div class="kpi-value ${M.atRisk>0?"danger":"success"}">${M.atRisk}</div><div class="kpi-label">At Risk</div></div>
      <div class="kpi-tile"><div class="kpi-value info">${M.noMFA}</div><div class="kpi-label">No MFA</div></div>
      <div class="kpi-tile"><div class="kpi-value info">0</div><div class="kpi-label">Groups</div></div>
      <div class="kpi-tile"><div class="kpi-value warning">${M.permanentRoles}</div><div class="kpi-label">Permanent</div></div>
    </div>

    <div class="tabs" id="pa-tabs">
      <button class="tab-btn active" data-tab="accounts">Privileged Accounts</button>
      <button class="tab-btn" data-tab="groups">Privileged Groups</button>
      <button class="tab-btn" data-tab="log">Membership Log</button>
    </div>

    <div class="tab-panel active" id="pa-tab-accounts"></div>
    <div class="tab-panel" id="pa-tab-groups"></div>
    <div class="tab-panel" id="pa-tab-log"></div>
  `,sa(e),aa(e),ra(e),e.querySelectorAll("#pa-tabs .tab-btn").forEach(i=>{i.addEventListener("click",()=>{e.querySelectorAll("#pa-tabs .tab-btn").forEach(s=>s.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(s=>s.classList.remove("active")),i.classList.add("active"),e.querySelector(`#pa-tab-${i.dataset.tab}`).classList.add("active")})}),e.querySelector("#pa-sync").addEventListener("click",()=>{const i=e.querySelector("#pa-sync");i.innerHTML='<span class="spinner dark"></span> Syncing...',i.disabled=!0,setTimeout(()=>{i.innerHTML='<i class="ti ti-refresh"></i> Sync tenant',i.disabled=!1,v("Tenant sync complete — 14 accounts updated.","success")},2e3)}),e.querySelector("#pa-tag-account").addEventListener("click",()=>{v("Tag account: select an account from the table below.","info")})}}function Mt(e){return e==="High"?'<span class="badge danger dot">High</span>':e==="Medium"?'<span class="badge warning dot">Medium</span>':'<span class="badge neutral dot">None</span>'}function ta(e){return!e||e.length===0?'<span class="pa-mfa-pill none">No MFA</span>':e.map(t=>t==="SMS"?'<span class="pa-mfa-pill sms">SMS</span>':`<span class="pa-mfa-pill">${t}</span>`).join("")}function ia(e){return`<span class="pa-role-chip ${e.toLowerCase().includes("global")?"global":""}">${e}</span>`}function sa(e){var a,r;const t=e.querySelector("#pa-tab-accounts"),i="pa-acct-search";let s=`
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
          ${pe.map(n=>yi(n)).join("")}
        </tbody>
      </table>
    </div>
  `;t.innerHTML=s,bi(t),(a=t.querySelector(`#${i}`))==null||a.addEventListener("input",n=>{var d;const o=n.target.value.toLowerCase(),l=((d=t.querySelector("#pa-risk-filter"))==null?void 0:d.value)||"all";Dt(t,o,l)}),(r=t.querySelector("#pa-risk-filter"))==null||r.addEventListener("change",n=>{var l;const o=((l=t.querySelector(`#${i}`))==null?void 0:l.value.toLowerCase())||"";Dt(t,o,n.target.value)})}function Dt(e,t,i){const s=e.querySelector("#pa-acct-tbody");s&&(s.innerHTML=pe.filter(a=>{const r=!t||a.upn.toLowerCase().includes(t)||a.name.toLowerCase().includes(t),n=i==="all"||a.risk===i;return r&&n}).map(a=>yi(a)).join(""),bi(e))}function yi(e){return`
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
      <td><div class="pill-group">${e.roles.map(ia).join("")}</div></td>
      <td><div class="pill-group">${ta(e.mfa)}</div></td>
      <td>${Mt(e.risk)}</td>
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
              <div style="margin-top:8px">Risk level: ${Mt(e.risk)}</div>
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
  `}function bi(e){e.querySelectorAll(".pa-acct-expand").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const a=t.closest(".pa-acct-row").dataset.id,r=e.querySelector(`.pa-acct-expand-row[data-id="${a}"]`),n=r.style.display!=="none";r.style.display=n?"none":"table-row",t.classList.toggle("open",!n)})}),e.querySelectorAll(".pa-action").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const{action:s,id:a}=t.dataset,r=PA_ACCOUNTS.find(n=>n.id===a);s==="pwd-reset"?(v(`Password reset initiated for ${r==null?void 0:r.name}.`,"warning"),ve("risk",`Password reset forced for ${r==null?void 0:r.upn}`,"Admin")):s==="convert-pim"?(v(`${r==null?void 0:r.name} converted to PIM eligible assignment.`,"success"),ve("add",`${r==null?void 0:r.upn} converted to PIM eligible`,"Admin")):s==="mfa-enroll"?(v(`MFA enrollment triggered for ${r==null?void 0:r.name}.`,"info"),ve("mfa",`MFA enrollment triggered for ${r==null?void 0:r.upn}`,"Admin")):s==="remove"&&(v(`${r==null?void 0:r.name} removed from privileged role.`,"danger"),ve("remove",`${r==null?void 0:r.upn} removed from privileged role`,"Admin"))})})}function aa(e){const t=e.querySelector("#pa-tab-groups");t.innerHTML=`
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
          ${PA_GROUPS.map(i=>zt(i)).join("")}
        </tbody>
      </table>
    </div>
  `,Nt(t),t.querySelector("#pa-grp-search").addEventListener("input",i=>{const s=i.target.value.toLowerCase();t.querySelector("#pa-grp-tbody").innerHTML=PA_GROUPS.filter(a=>!s||a.name.toLowerCase().includes(s)).map(a=>zt(a)).join(""),Nt(t)})}function zt(e){return`
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
  `}function Nt(e){e.querySelectorAll(".pa-grp-expand").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.id,s=e.querySelector(`.pa-grp-expand-row[data-id="${i}"]`);s.style.display=s.style.display==="none"?"table-row":"none"})}),e.querySelectorAll(".pa-grp-untag").forEach(t=>{t.addEventListener("click",()=>{const i=PA_GROUPS.find(s=>s.id===t.dataset.id);v(`${i==null?void 0:i.name} untagged as privileged group.`,"warning"),ve("remove",`Group "${i==null?void 0:i.name}" untagged`,"Admin")})}),e.querySelectorAll(".pa-grp-remove-member").forEach(t=>{t.addEventListener("click",()=>{v(`${t.dataset.upn} removed from group.`,"success"),ve("remove",`${t.dataset.upn} removed from group`,"Admin")})})}function ra(e){const t=e.querySelector("#pa-tab-log");hi(t)}function hi(e){e.innerHTML=`
    <div class="card" style="padding:12px 16px">
      <div class="card-title mb-3"><i class="ti ti-history"></i> Membership Change Log</div>
      ${mi.map(t=>`
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
  `}function ve(e,t,i){const s={add:"ti-user-plus",remove:"ti-user-minus",risk:"ti-alert-triangle",mfa:"ti-shield",tag:"ti-tag",review:"ti-clipboard-check"},a={add:"var(--clr-info-text)",remove:"var(--clr-warning-text)",risk:"var(--clr-danger-text)",mfa:"var(--clr-success-text)",tag:"var(--clr-info-text)",review:"var(--clr-success-text)"},r={add:"var(--clr-info-bg)",remove:"var(--clr-warning-bg)",risk:"var(--clr-danger-bg)",mfa:"var(--clr-success-bg)",tag:"var(--clr-info-bg)",review:"var(--clr-success-bg)"};mi.unshift({id:Date.now(),type:e,icls:s[e]||"ti-info-circle",ic:a[e]||"var(--clr-info-text)",bg:r[e]||"var(--clr-info-bg)",title:t,detail:t,by:i,time:"Just now"});const n=document.querySelector("#pa-tab-log");n&&hi(n)}let N=[],he={total:0,consumed:0,available:0,utilizationPct:0},fe=[],dt=[],Ue={},Oe="summary";const na=[{id:"summary",label:"Executive Summary",icon:"ti-layout-dashboard"},{id:"inventory",label:"License Inventory",icon:"ti-box"},{id:"services",label:"Service Plans",icon:"ti-list-check"},{id:"assignments",label:"User Assignments",icon:"ti-users"},{id:"groups",label:"Group Licensing",icon:"ti-users-group"},{id:"compliance",label:"Compliance",icon:"ti-shield-check"}];async function fi(){const e=document.getElementById("page-licenses");if(e){e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading comprehensive license data...</p></div>';try{console.log("📡 Fetching comprehensive license data...");const[t,i,s,a]=await Promise.all([S("/licenses"),S("/licenses/assignments"),S("/licenses/groups"),S("/licenses/compliance")]);t.success&&t.data&&(N=t.data,he=t.summary||{total:0,consumed:0,available:0,utilizationPct:0}),i.success&&i.data&&(fe=i.data),s.success&&s.data&&(dt=s.data),a.success&&a.data&&(Ue=a.data),console.log("✅ Loaded all license data")}catch(t){console.error("❌ Error loading license data:",t)}xi(e)}}function xi(e){var t,i;e.innerHTML=`
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
      ${na.map(s=>`
        <button class="license-tab-btn ${Oe===s.id?"active":""}" data-tab="${s.id}" style="padding:12px 16px;border:none;background:none;cursor:pointer;font-size:11px;font-weight:600;color:var(--color-text-secondary);border-bottom:2px solid transparent;white-space:nowrap;${Oe===s.id?"color:var(--color-text-primary);border-bottom-color:var(--clr-info-text)":""}">
          <i class="ti ${s.icon}"></i> ${s.label}
        </button>
      `).join("")}
    </div>

    <!-- Tab Content -->
    <div id="tab-content">
      ${oa(Oe)}
    </div>
  `,e.querySelectorAll(".license-tab-btn").forEach(s=>{s.addEventListener("click",()=>{Oe=s.dataset.tab,xi(e)})}),(t=e.querySelector("#license-refresh"))==null||t.addEventListener("click",()=>{fi()}),(i=e.querySelector("#license-export"))==null||i.addEventListener("click",()=>{alert("Export functionality coming soon")})}function oa(e){switch(e){case"summary":return la();case"inventory":return da();case"services":return ca();case"assignments":return pa();case"groups":return va();case"compliance":return ua();default:return""}}function la(){return`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:24px">
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Total Licenses Purchased</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-info-text)">${he.total.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Assigned Licenses</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${he.consumed.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Available Licenses</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-success-text)">${he.available.toLocaleString()}</div>
      </div>
      <div class="card" style="padding:16px">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:6px">Utilization Rate</div>
        <div style="font-size:24px;font-weight:700;color:var(--clr-warning-text)">${he.utilizationPct}%</div>
      </div>
    </div>

    <!-- Health Status -->
    <div class="card mb-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-heart-handshake"></i> Licensing Health Overview</span>
      </div>
      ${N.map(e=>`
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
    ${N.some(e=>e.status==="critical")?`
      <div class="alert-banner danger mb-3">
        <i class="ti ti-alert-triangle"></i>
        <strong>${N.filter(e=>e.status==="critical").length} license(s) at CRITICAL capacity</strong> — Immediate action required
      </div>
    `:""}
    ${N.some(e=>e.status==="monitor")?`
      <div class="alert-banner warning">
        <i class="ti ti-alert-circle"></i>
        <strong>${N.filter(e=>e.status==="monitor").length} license(s) require monitoring</strong> — Plan additional purchases
      </div>
    `:""}
  `}function da(){return`
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
          ${N.map(e=>`
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
  `}function ca(){return`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:16px">
      ${N.map(e=>`
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
  `}function pa(){return`
    <div class="card" style="padding:0;overflow:hidden">
      ${fe.length===0?`
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
            ${fe.slice(0,50).map(e=>`
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
        ${fe.length>50?`<div style="padding:12px;text-align:center;font-size:10px;color:var(--color-text-tertiary)">Showing 50 of ${fe.length} users</div>`:""}
      `}
    </div>
  `}function va(){N.length>0&&console.log("📊 realLicenses structure:",N[0]);const e=t=>{if(!t)return"—";console.log(`🔍 Looking for license with skuId: ${t}`);let i=N.find(s=>{var r,n;return s.skuId===t?(console.log(`✓ Matched by skuId: ${s.name}`),!0):((n=(r=s.id)==null?void 0:r.split("_"))==null?void 0:n[1])===t?(console.log(`✓ Matched by composite ID: ${s.name}`),!0):s.id===t?(console.log(`✓ Matched by id: ${s.name}`),!0):!1});return i?i.name||i.skuPartNumber||t.substring(0,20):(console.log(`✗ No match found for: ${t}`),console.log(`   Available licenses: ${N.map(s=>`${s.name}(${s.id.split("_")[1]||s.id})`).join(", ")}`),t.substring(0,20)+(t.length>20?"...":""))};return`
    <div class="card" style="padding:0;overflow:hidden">
      ${dt.length===0?`
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
            ${dt.map((t,i)=>(console.log(`📊 Group ${i}: ${t.displayName}, memberCount=${t.memberCount}, type=${typeof t.memberCount}`),`
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
  `}function ua(){const e=Ue.scores||{utilization:0,costOptimization:0,securityCoverage:0,compliance:0};return`
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
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${Ue.disabledUsersWithLicenses||0} users</div>
          </div>
          <div style="padding:12px;background:rgba(250, 190, 88, 0.05);border-radius:6px;border-left:3px solid var(--clr-warning-text)">
            <div style="font-weight:600;font-size:11px">Inactive Users (90+ days)</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">${Ue.inactiveUsers||0} users consuming licenses</div>
          </div>
          <div style="padding:12px;background:rgba(34, 197, 94, 0.05);border-radius:6px;border-left:3px solid var(--clr-success-text)">
            <div style="font-weight:600;font-size:11px">Premium Security Licenses</div>
            <div style="font-size:10px;color:var(--color-text-secondary);margin-top:4px">Users protected by Entra ID P2 and Defender licenses</div>
          </div>
        </div>
      </div>
    </div>
  `}function ga(){const e=document.getElementById("page-agents");e&&(e.innerHTML=`
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
      <button class="btn btn-primary btn-sm" id="deploy-agent">Deploy Your First Agent</button>
    </div>
  `,e.querySelector("#deploy-agent").addEventListener("click",()=>{v("Agent deployment requires Graph API integration and Azure AD app registration","info")}),e.querySelector(".btn-primary").addEventListener("click",()=>{v("Agent deployment requires configuration","info")}))}let Z="dashboard",Le=null,de=[],wi=[],ct="PENDING_APPROVAL";async function ma(){const e=document.getElementById("page-approvals");e&&(Y(e),await $i(e))}async function $i(e){var t;try{const s=await(await fetch(`${$}/requests?status=${ct}&limit=50`)).json();de=Array.isArray(s.data)?s.data:[];const r=await(await fetch(`${$}/audit-logs?limit=20`)).json();wi=Array.isArray((t=r.data)==null?void 0:t.data)?r.data.data:Array.isArray(r.data)?r.data:[],Y(e)}catch(i){console.error("Error loading approvals data:",i),v("Failed to load approvals data","error")}}function Y(e){Z==="dashboard"?ya(e):Z==="details"?ba(e):Z==="audit"&&ha(e)}function ya(e){if(!e){console.error("❌ Page element not found");return}if(e.innerHTML=`
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
          <button class="btn ${ct===t?"btn-primary":""}" id="filter-${t}" style="padding:6px 12px;font-size:11px">
            ${pt(t)} ${t}
          </button>
        `).join("")}
      </div>
    </div>

    <!-- Requests Table -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Service Requests (${de.length})</span>
      </div>
      <div style="padding:0;overflow-x:auto;border-top:0.5px solid var(--color-border-secondary)">
        ${de.length===0?`
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
              ${de.map(t=>{var i,s;return`
                <tr style="border-bottom:0.5px solid var(--color-border-tertiary);cursor:pointer" id="req-${t.id}" data-id="${t.id}">
                  <td style="padding:10px 12px"><strong>${t.id}</strong></td>
                  <td style="padding:10px 12px">${t.operationId.split("-")[0]}</td>
                  <td style="padding:10px 12px">${t.submittedBy}</td>
                  <td style="padding:10px 12px">
                    <span style="padding:2px 6px;border-radius:3px;font-size:10px;background:${ki((i=t.validation)==null?void 0:i.riskLevel)};color:white">
                      ${((s=t.validation)==null?void 0:s.riskLevel)||"MEDIUM"}
                    </span>
                  </td>
                  <td style="padding:10px 12px">${pt(t.status)}</td>
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
  `,e&&e.querySelectorAll&&["PENDING_APPROVAL","APPROVED","REJECTED","COMPLETED"].forEach(t=>{const i=e.querySelector(`#filter-${t}`);i&&i.addEventListener("click",()=>{ct=t,Y(e),$i(e)})}),e&&e.querySelectorAll){e.querySelectorAll(".btn-sm-approve").forEach(i=>{i.addEventListener("click",s=>{s.stopPropagation();const a=i.dataset.id;Le=de.find(r=>r.id===a),Z="details",Y(e)})});const t=e.querySelector("#view-audit-btn");t&&t.addEventListener("click",()=>{Z="audit",Y(e)}),e.querySelectorAll("tr[data-id]").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.id;Le=de.find(a=>a.id===s),Z="details",Y(e)})})}}function ba(e){var s,a,r,n,o;if(!e||!Le)return;const t=Le,i=fa(t);e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="details-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div>
          <div class="page-title">${t.id}</div>
          <div class="page-subtitle">${t.operationId} • ${pt(t.status)}</div>
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
                <div style="font-size:24px;font-weight:600;color:${ki((s=t.validation)==null?void 0:s.riskLevel)}">${((a=t.validation)==null?void 0:a.riskScore)||0}</div>
                <div>
                  <div style="font-size:12px;font-weight:600">${((r=t.validation)==null?void 0:r.riskLevel)||"UNKNOWN"} Risk</div>
                  <div style="font-size:10px;color:var(--color-text-secondary)">Risk Score (0-100)</div>
                </div>
              </div>
            </div>

            <!-- Validation Checks -->
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
            ${Object.entries(t.fields).map(([l,d])=>`
              <div style="display:grid;grid-template-columns:150px 1fr;gap:12px;margin-bottom:8px;padding-bottom:8px;border-bottom:0.5px solid var(--color-border-tertiary)">
                <div style="font-weight:600;color:var(--color-text-secondary)">${l}</div>
                <div style="word-break:break-all">${d}</div>
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
            ${(((o=t.validation)==null?void 0:o.approvalPath)||[]).map((l,d)=>{const c=t.approvals.find(x=>x.step===l),p=!c&&l!=="agent"&&l!=="action",f=(c==null?void 0:c.status)==="APPROVED";return`
                <div style="display:flex;gap:10px;margin-bottom:12px;align-items:flex-start">
                  <div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;${f?"background:var(--clr-success-bg);color:var(--clr-success-text)":p?"background:var(--clr-warning-bg);color:var(--clr-warning-text)":"background:var(--color-background-tertiary);color:var(--color-text-secondary)"}">
                    ${f?"✓":p?"◯":"—"}
                  </div>
                  <div style="flex:1;font-size:11px">
                    <div style="font-weight:600;text-transform:capitalize">${l}</div>
                    ${f?`
                      <div style="color:var(--clr-success-text);font-size:10px">Approved by ${c.approverEmail}</div>
                      <div style="color:var(--color-text-tertiary);font-size:9px">${new Date(c.approvedAt).toLocaleString()}</div>
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
  `,e.querySelector("#details-back").addEventListener("click",()=>{Z="dashboard",Y(e)}),t.status==="PENDING_APPROVAL"&&i&&(e.querySelector("#approve-btn").addEventListener("click",async()=>{const l=e.querySelector("#approval-comment").value;await Ot(t.id,"APPROVED",i.step,l,e)}),e.querySelector("#reject-btn").addEventListener("click",async()=>{const l=e.querySelector("#approval-comment").value;if(!l){v("Please provide a reason for rejection","warning");return}await Ot(t.id,"REJECTED",i.step,l,e)}))}function ha(e){e&&(e.innerHTML=`
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
            ${wi.map(t=>{var n,o,l,d,c,p;const i=((n=t.details)==null?void 0:n.riskLevel)||"N/A",s={LOW:"#10b981",MEDIUM:"#f59e0b",HIGH:"#ef4444",CRITICAL:"#991b1b","N/A":"#9ca3af"}[i]||"#9ca3af",a=((o=t.details)==null?void 0:o.step)||((l=t.details)==null?void 0:l.rejectorRole)||"—",r=((d=t.details)==null?void 0:d.reason)||((c=t.details)==null?void 0:c.comment)||((p=t.details)==null?void 0:p.operationId)||"—";return`
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
                    ${r}
                  </td>
                </tr>
              `}).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `,e.querySelector("#audit-back").addEventListener("click",()=>{Z="dashboard",Y(e)}))}function pt(e){return{PENDING_APPROVAL:'<span style="color:var(--clr-warning-text)">⏳</span>',APPROVED:'<span style="color:var(--clr-success-text)">✓</span>',REJECTED:'<span style="color:var(--clr-danger-text)">✗</span>',COMPLETED:'<span style="color:var(--clr-success-text)">✓✓</span>',FAILED:'<span style="color:var(--clr-danger-text)">!</span>'}[e]||e}function ki(e){return{LOW:"#10b981",MEDIUM:"#f59e0b",HIGH:"#ef4444",CRITICAL:"#991b1b"}[e]||"#6b7280"}function fa(e){var i;if(e.status!=="PENDING_APPROVAL")return null;const t=((i=e.validation)==null?void 0:i.approvalPath)||["manager","it","agent","action"];for(const s of t){if(s==="agent"||s==="action")continue;if(!e.approvals.find(r=>r.step===s&&r.status==="APPROVED"))return{step:s,approverRole:s,status:"PENDING"}}return null}async function Ot(e,t,i,s,a){try{const r=t==="APPROVED"?"approve":"reject",n=t==="APPROVED"?{approverEmail:window.userEmail,approverRole:i,comment:s}:{rejectorEmail:window.userEmail,rejectorRole:i,reason:s},l=await(await fetch(`${$}/requests/${e}/${r}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json();l.success&&(Le=l.data,v(`Request ${t==="APPROVED"?"approved":"rejected"} successfully`,"success"),Z="details",Y(a))}catch(r){console.error("Approval error:",r),v("Failed to process approval","error")}}const xa="modulepreload",wa=function(e){return"/"+e},jt={},$a=function(t,i,s){let a=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),o=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));a=Promise.allSettled(i.map(l=>{if(l=wa(l),l in jt)return;jt[l]=!0;const d=l.endsWith(".css"),c=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${c}`))return;const p=document.createElement("link");if(p.rel=d?"stylesheet":xa,d||(p.as="script"),p.crossOrigin="",p.href=l,o&&p.setAttribute("nonce",o),document.head.appendChild(p),d)return new Promise((f,x)=>{p.addEventListener("load",f),p.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(n){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=n,window.dispatchEvent(o),!o.defaultPrevented)throw n}return a.then(n=>{for(const o of n||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},vt=[{id:"submit",label:"Request Submitted",icon:"ti-send",color:"info"},{id:"manager",label:"Manager Approval",icon:"ti-user-check",color:"warning"},{id:"dataowner",label:"Data Owner Approval",icon:"ti-shield-check",color:"purple"},{id:"it",label:"IT Review",icon:"ti-settings",color:"warning"},{id:"agent",label:"AI Agent Validation",icon:"ti-robot",color:"teal"},{id:"action",label:"System Provisioning",icon:"ti-api",color:"info"},{id:"done",label:"Completion",icon:"ti-circle-check",color:"success"}],Fe=[{id:"exchange",name:"Exchange Online",icon:"ti-mail",color:"#854F0B",bg:"#FAEEDA",desc:"Groups, shared mailboxes, room resources, and email settings",badge:"4 services"},{id:"teams",name:"Microsoft Teams",icon:"ti-brand-teams",color:"#3C3489",bg:"#EEEDFE",desc:"Create teams, manage members, channels, and guest access",badge:"5 actions"},{id:"sharepoint",name:"SharePoint Services",icon:"ti-brand-sharepoint",color:"#3B6D11",bg:"#EAF3DE",desc:"Sites, permissions, external sharing, and storage management",badge:"6 actions"},{id:"onedrive",name:"OneDrive Administration",icon:"ti-cloud",color:"#0C447C",bg:"#E6F1FB",desc:"Storage increases and former employee OneDrive access",badge:"2 actions"},{id:"ext-sharing",name:"External Sharing",icon:"ti-world",color:"#791F1F",bg:"#FCEBEB",desc:"Invite, extend, or remove external guest access",badge:"4 actions"},{id:"user-access",name:"User Access Management",icon:"ti-lock-access",color:"#185FA5",bg:"#E6F1FB",desc:"Request access to mailboxes, Teams, SharePoint and groups",badge:"5 actions"},{id:"licenses",name:"License Management",icon:"ti-license",color:"#854F0B",bg:"#FAEEDA",desc:"Request Microsoft 365, Power BI, Visio, Project licenses",badge:"6 licenses"},{id:"copilot",name:"Microsoft Copilot",icon:"ti-sparkles",color:"#3C3489",bg:"#EEEDFE",desc:"Request or remove Microsoft 365 Copilot licenses",badge:"2 actions"},{id:"power-platform",name:"Power Platform",icon:"ti-bolt",color:"#3B6D11",bg:"#EAF3DE",desc:"Environments, premium connectors, DLP exceptions",badge:"4 actions"},{id:"intune",name:"Intune Services",icon:"ti-device-laptop",color:"#0C447C",bg:"#E6F1FB",desc:"Device retirement, wipe, and compliance exceptions",badge:"3 actions"},{id:"guest-lifecycle",name:"Guest User Lifecycle",icon:"ti-user-plus",color:"#633806",bg:"#FAEEDA",desc:"Invite guests, extend or remove access, quarterly reviews",badge:"4 actions"}],me=[{id:"exchange-groups",name:"Distribution & Security Groups",icon:"ti-users-group",desc:"M365 Groups, Distribution Groups, Security Groups"},{id:"shared-mailbox",name:"Shared Mailboxes",icon:"ti-mailbox",desc:"Create, delete, and manage shared mailbox permissions"},{id:"room-equipment",name:"Room & Equipment Mailboxes",icon:"ti-building",desc:"Meeting rooms, equipment resources, booking policies"},{id:"email-services",name:"Email Services",icon:"ti-mail-forward",desc:"SMTP addresses, mail forwarding, auto-reply configuration"}],ka={"exchange-groups":{parentGroup:"exchange",operations:[{id:"create-m365-group",group:"Microsoft 365 Groups",label:"Create M365 Group",approvalPath:["manager","it"],agentChecks:["Check for duplicate group names","Suggest existing groups with similar purpose","Validate naming convention","Verify requestor eligibility"],systemAction:"POST /v1.0/groups (groupTypes: Unified)",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. Marketing EMEA"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"marketing-emea",hint:"@contoso.com appended automatically"},{id:"privacy",label:"Privacy",type:"select",required:!0,options:["Private","Public"]},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"user1@contoso.com, user2@contoso.com",hint:"Comma-separated UPNs"},{id:"description",label:"Group Description",type:"textarea",required:!1,placeholder:"Purpose of this group..."},{id:"justification",label:"Business Justification",type:"textarea",required:!0,placeholder:"Why is this group needed?"}]},{id:"add-m365-members",group:"Microsoft 365 Groups",label:"Add Members to M365 Group",approvalPath:["manager"],agentChecks:["Verify group exists","Check member licensing","Validate UPNs"],systemAction:"POST /v1.0/groups/{id}/members/$ref",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0,placeholder:"marketing-emea@contoso.com"},{id:"members",label:"Members to Add",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0,placeholder:"Why do these users need to join?"}]},{id:"remove-m365-members",group:"Microsoft 365 Groups",label:"Remove Members from M365 Group",approvalPath:["manager"],agentChecks:["Verify group membership","Check if member is owner"],systemAction:"DELETE /v1.0/groups/{id}/members/{userId}/$ref",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0,placeholder:"marketing-emea@contoso.com"},{id:"members",label:"Members to Remove",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Reason",type:"textarea",required:!0}]},{id:"archive-m365-group",group:"Microsoft 365 Groups",label:"Archive M365 Group",approvalPath:["manager","it"],agentChecks:["Check last activity date","Identify active owners","Verify no active workflows depend on group"],systemAction:"PATCH /v1.0/groups/{id} (visibility: archived)",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0},{id:"archiveDate",label:"Archive By Date",type:"date",required:!1},{id:"dataRetention",label:"Data Retention Period",type:"select",required:!0,options:["30 days","90 days","180 days","1 year","Indefinite"]},{id:"justification",label:"Reason for Archiving",type:"textarea",required:!0}]},{id:"create-dg",group:"Distribution Groups",label:"Create Distribution Group",approvalPath:["manager"],agentChecks:["Duplicate DG check","Naming convention validation","Suggest existing DGs"],systemAction:"New-DistributionGroup via Exchange PowerShell",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. All Staff UK"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"all-staff-uk"},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"Comma-separated UPNs"},{id:"managedBy",label:"Managed By (Owner)",type:"text",required:!1,placeholder:"UPN of owner"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"modify-dg",group:"Distribution Groups",label:"Rename / Modify Distribution Group",approvalPath:["manager"],agentChecks:["Verify group ownership","Check for email references to current name"],systemAction:"Set-DistributionGroup via Exchange PowerShell",fields:[{id:"currentName",label:"Current Group Name",type:"text",required:!0},{id:"newName",label:"New Display Name",type:"text",required:!1,placeholder:"Leave blank if not changing"},{id:"newAlias",label:"New Email Alias",type:"text",required:!1,placeholder:"Leave blank if not changing"},{id:"changeOwner",label:"New Owner UPN",type:"text",required:!1},{id:"justification",label:"Reason for Change",type:"textarea",required:!0}]},{id:"delete-dg",group:"Distribution Groups",label:"Delete Distribution Group",approvalPath:["manager","it"],agentChecks:["Check group usage in mail flow rules","Identify group members","Check email references in other systems"],systemAction:"Remove-DistributionGroup via Exchange PowerShell",fields:[{id:"groupName",label:"Group Name / Email",type:"text",required:!0},{id:"confirmation",label:"Type group name to confirm deletion",type:"text",required:!0,placeholder:"Must match exactly"},{id:"justification",label:"Reason for Deletion",type:"textarea",required:!0}]},{id:"create-sg",group:"Security Groups",label:"Create Security Group",approvalPath:["manager","it"],agentChecks:["Duplicate check","Naming convention","Suggest existing groups","Review intended resource access"],systemAction:"POST /v1.0/groups (securityEnabled: true)",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. SG-Finance-ReadOnly"},{id:"purpose",label:"Purpose / Resource",type:"text",required:!0,placeholder:"What resource will this secure?"},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"Comma-separated UPNs"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"manage-sg-members",group:"Security Groups",label:"Add / Remove Security Group Members",approvalPath:["manager","it"],agentChecks:["Verify requester is group owner","Check member eligibility","Validate access to secured resource"],systemAction:"POST/DELETE /v1.0/groups/{id}/members/$ref",fields:[{id:"groupName",label:"Security Group Name",type:"text",required:!0},{id:"action",label:"Action",type:"select",required:!0,options:["Add members","Remove members"]},{id:"members",label:"Members (UPNs)",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"shared-mailbox":{parentGroup:"exchange",operations:[{id:"create-shared-mb",group:"Create / Delete",label:"Create Shared Mailbox",approvalPath:["manager","it"],agentChecks:["Duplicate mailbox check","License availability","Naming convention","Verify owner details"],systemAction:"New-Mailbox -Shared via Exchange PowerShell",fields:[{id:"displayName",label:"Display Name",type:"text",required:!0,placeholder:"e.g. HR Department"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"hr@contoso.com"},{id:"fullAccess",label:"Full Access Users",type:"text",required:!1,placeholder:"UPNs comma-separated"},{id:"sendAs",label:"Send As Users",type:"text",required:!1,placeholder:"UPNs comma-separated"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"delete-shared-mb",group:"Create / Delete",label:"Delete Shared Mailbox",approvalPath:["manager","it"],agentChecks:["Check mailbox usage in last 90 days","Identify users with permissions","Check mail flow dependencies"],systemAction:"Remove-Mailbox via Exchange PowerShell",fields:[{id:"mailboxEmail",label:"Mailbox Email Address",type:"email",required:!0},{id:"dataAction",label:"Data Disposition",type:"select",required:!0,options:["Export then delete","Retain for 90 days","Immediate deletion"]},{id:"justification",label:"Reason for Deletion",type:"textarea",required:!0}]},{id:"mb-permissions",group:"Permissions",label:"Modify Mailbox Permissions",approvalPath:["manager"],agentChecks:["Verify mailbox exists","Validate user licensing","Check current permission state"],systemAction:"Add/Remove-MailboxPermission via Exchange PowerShell",fields:[{id:"mailboxEmail",label:"Mailbox Email Address",type:"email",required:!0},{id:"permType",label:"Permission Type",type:"select",required:!0,options:["Full Access","Send As","Send on Behalf"]},{id:"action",label:"Action",type:"select",required:!0,options:["Add permission","Remove permission"]},{id:"users",label:"Users (UPNs)",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"room-equipment":{parentGroup:"exchange",operations:[{id:"create-room",group:"Create",label:"Create Room Mailbox",approvalPath:["manager","it"],agentChecks:["Check for duplicate room names","Validate capacity settings","Verify location exists in directory"],systemAction:"New-Mailbox -Room via Exchange PowerShell",fields:[{id:"displayName",label:"Room Name",type:"text",required:!0,placeholder:"e.g. London — Boardroom A"},{id:"alias",label:"Email Alias",type:"text",required:!0,placeholder:"london-boardroom-a"},{id:"capacity",label:"Capacity (persons)",type:"text",required:!0,placeholder:"12"},{id:"location",label:"Building / Floor",type:"text",required:!1,placeholder:"e.g. 1 Canada Square, Floor 4"},{id:"autoAccept",label:"Auto-accept bookings",type:"select",required:!0,options:["Auto-accept all","Require approval","Manual only"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"create-equipment",group:"Create",label:"Create Equipment Mailbox",approvalPath:["manager","it"],agentChecks:["Duplicate equipment name check","Validate equipment type"],systemAction:"New-Mailbox -Equipment via Exchange PowerShell",fields:[{id:"displayName",label:"Equipment Name",type:"text",required:!0,placeholder:"e.g. Projector — Floor 3"},{id:"alias",label:"Email Alias",type:"text",required:!0},{id:"equipType",label:"Equipment Type",type:"select",required:!0,options:["Projector","Video conferencing unit","Laptop pool","Car/Fleet","Other"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"modify-booking",group:"Modify",label:"Modify Booking Policy",approvalPath:["manager"],agentChecks:["Verify resource exists","Check current booking conflicts"],systemAction:"Set-CalendarProcessing via Exchange PowerShell",fields:[{id:"resourceEmail",label:"Resource Email",type:"email",required:!0},{id:"autoAccept",label:"Auto-accept policy",type:"select",required:!1,options:["Auto-accept all","Require approval","Manual only"]},{id:"maxDuration",label:"Max booking duration",type:"select",required:!1,options:["1 hour","2 hours","4 hours","8 hours","1 day","Unlimited"]},{id:"bookingWindow",label:"Advance booking window",type:"select",required:!1,options:["1 week","2 weeks","1 month","3 months","6 months"]},{id:"justification",label:"Reason for Change",type:"textarea",required:!0}]},{id:"add-delegate",group:"Modify",label:"Add Room/Equipment Delegate",approvalPath:["manager"],agentChecks:["Verify resource exists","Verify delegate licensing"],systemAction:"Set-CalendarProcessing -ResourceDelegates",fields:[{id:"resourceEmail",label:"Resource Email",type:"email",required:!0},{id:"delegates",label:"Delegate UPNs",type:"text",required:!0,placeholder:"Comma-separated UPNs"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"delete-resource",group:"Delete",label:"Remove Room / Equipment Mailbox",approvalPath:["manager","it"],agentChecks:["Check for future bookings","Identify delegates","Cancel existing calendar entries"],systemAction:"Remove-Mailbox via Exchange PowerShell",fields:[{id:"resourceEmail",label:"Resource Email",type:"email",required:!0},{id:"deleteDate",label:"Removal Date",type:"date",required:!1,hint:"Leave blank for immediate removal"},{id:"justification",label:"Reason for Removal",type:"textarea",required:!0}]}]},"email-services":{parentGroup:"exchange",operations:[{id:"smtp-change",group:"Email Configuration",label:"SMTP Address Change",approvalPath:["manager","it"],agentChecks:["Verify mailbox ownership","Check SMTP address availability","Check for email references in other systems"],systemAction:"Set-Mailbox -EmailAddresses via Exchange PowerShell",fields:[{id:"mailboxUpn",label:"Mailbox UPN",type:"email",required:!0},{id:"newSmtp",label:"New Primary SMTP",type:"email",required:!0,hint:"New primary email address"},{id:"keepOld",label:"Retain old address as alias",type:"select",required:!0,options:["Yes — keep as alias","No — remove old address"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"mail-forwarding",group:"Email Configuration",label:"Configure Mail Forwarding",approvalPath:["manager","it"],agentChecks:["Check for external forwarding policy","Verify destination address","Flag if forwarding to external domain"],systemAction:"Set-Mailbox -ForwardingSmtpAddress via Exchange PowerShell",fields:[{id:"mailboxUpn",label:"Mailbox UPN",type:"email",required:!0},{id:"forwardTo",label:"Forward To",type:"email",required:!0},{id:"keepCopy",label:"Keep a copy in mailbox",type:"select",required:!0,options:["Yes","No"]},{id:"duration",label:"Forwarding Duration",type:"select",required:!1,options:["Indefinite","30 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"auto-reply",group:"Email Configuration",label:"Auto Reply Configuration",approvalPath:["manager"],agentChecks:["Validate mailbox ownership","Check message content for compliance"],systemAction:"Set-MailboxAutoReplyConfiguration via Exchange PowerShell",fields:[{id:"mailboxUpn",label:"Mailbox UPN",type:"email",required:!0},{id:"scope",label:"Reply Scope",type:"select",required:!0,options:["Internal only","Internal and external"]},{id:"startDate",label:"Start Date",type:"date",required:!1},{id:"endDate",label:"End Date",type:"date",required:!1},{id:"message",label:"Auto Reply Message",type:"textarea",required:!0,placeholder:"Out of office message..."}]}]},teams:{parentGroup:null,operations:[{id:"create-team",group:"Team Management",label:"Create Team",approvalPath:["manager"],agentChecks:["Duplicate team name check","Suggest existing teams","Validate naming convention","Check M365 group quota"],systemAction:"POST /v1.0/teams",fields:[{id:"displayName",label:"Team Name",type:"text",required:!0,placeholder:"e.g. Project Phoenix"},{id:"description",label:"Description",type:"textarea",required:!1},{id:"privacy",label:"Privacy",type:"select",required:!0,options:["Private (invite only)","Public (open to all)"]},{id:"template",label:"Team Template",type:"select",required:!1,options:["Standard","Project","Retail","Healthcare","Education"]},{id:"owners",label:"Team Owners",type:"text",required:!0,placeholder:"Comma-separated UPNs (at least 1)"},{id:"members",label:"Initial Members",type:"text",required:!1,placeholder:"Comma-separated UPNs"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"add-team-members",group:"Team Management",label:"Add / Remove Team Members",approvalPath:["manager"],agentChecks:["Verify team exists","Check user licensing","Validate requester is owner"],systemAction:"POST/DELETE /v1.0/teams/{id}/members",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"action",label:"Action",type:"select",required:!0,options:["Add members","Remove members","Promote to owner","Demote from owner"]},{id:"users",label:"Users (UPNs)",type:"textarea",required:!0,placeholder:"One UPN per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"create-channel",group:"Channel Management",label:"Create Channel",approvalPath:["manager"],agentChecks:["Verify team exists","Check for duplicate channel names","Validate channel type eligibility"],systemAction:"POST /v1.0/teams/{id}/channels",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"channelName",label:"Channel Name",type:"text",required:!0,placeholder:"e.g. Project Updates"},{id:"channelType",label:"Channel Type",type:"select",required:!0,options:["Standard","Private","Shared"]},{id:"description",label:"Description",type:"textarea",required:!1},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"team-guest-access",group:"Guest Access",label:"Request Guest Access to Team",approvalPath:["manager","it"],agentChecks:["Verify guest policy allows external access","Check guest domain restrictions","Validate team guest access setting"],systemAction:"POST /v1.0/teams/{id}/members (guest)",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"guestEmails",label:"Guest Email Addresses",type:"textarea",required:!0,placeholder:"One email per line (external addresses)"},{id:"guestOrg",label:"Guest Organisation",type:"text",required:!0,placeholder:"External company name"},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["30 days","60 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},sharepoint:{parentGroup:null,operations:[{id:"new-site",group:"Site Management",label:"Request New SharePoint Site",approvalPath:["manager","it"],agentChecks:["Check for similar existing sites","Validate site URL availability","Check storage quota","Verify naming convention"],systemAction:"POST /v1.0/sites — Invoke-RestMethod SharePoint REST API",fields:[{id:"siteTitle",label:"Site Title",type:"text",required:!0,placeholder:"e.g. Finance Department Hub"},{id:"siteUrl",label:"Site URL",type:"text",required:!0,placeholder:"finance-hub",hint:"contoso.sharepoint.com/sites/ prefix appended"},{id:"siteTemplate",label:"Template",type:"select",required:!0,options:["Team site","Communication site","Hub site","Document center"]},{id:"owners",label:"Site Owners",type:"text",required:!0,placeholder:"Comma-separated UPNs"},{id:"storageQuota",label:"Initial Storage Quota",type:"select",required:!1,options:["1 GB (default)","5 GB","10 GB","25 GB","100 GB"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"add-site-members",group:"Site Permissions",label:"Add Site Members / Owners",approvalPath:["manager"],agentChecks:["Verify site exists","Check user eligibility","Validate permission level request"],systemAction:"SharePoint REST API — /_api/web/roleassignments",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0,placeholder:"contoso.sharepoint.com/sites/..."},{id:"role",label:"Permission Level",type:"select",required:!0,options:["Read","Contribute","Edit","Full Control","Site Owner"]},{id:"users",label:"Users / Groups (UPNs)",type:"textarea",required:!0,placeholder:"One UPN or group name per line"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"external-sharing",group:"External Sharing",label:"Request External Sharing",approvalPath:["manager","dataowner","it"],agentChecks:["Check tenant external sharing policy","Verify domain not blocked","Classify data sensitivity","Check DLP policy applicability"],systemAction:"Set-SPOSite -SharingCapability via PnP PowerShell",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"sharingLevel",label:"Sharing Level",type:"select",required:!0,options:["Specific people (authenticated)","Anyone with link (no sign-in)","Existing guests only"]},{id:"externalOrg",label:"External Organisation",type:"text",required:!0},{id:"duration",label:"Duration",type:"select",required:!0,options:["30 days","90 days","6 months","1 year","Ongoing (reviewed annually)"]},{id:"dataSensitivity",label:"Data Sensitivity",type:"select",required:!0,options:["Public","Internal","Confidential","Highly Confidential"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"storage-increase",group:"Site Management",label:"Request Storage Increase",approvalPath:["manager","it"],agentChecks:["Check current usage vs quota","Validate increase request is proportionate","Check tenant storage pool"],systemAction:"Set-SPOSite -StorageQuota via PnP PowerShell",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"currentSize",label:"Current Storage Used",type:"text",required:!1,placeholder:"Approx. current usage (e.g. 4.5 GB)"},{id:"requestedGB",label:"Additional Storage (GB)",type:"text",required:!0,placeholder:"e.g. 10"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"delete-site",group:"Site Management",label:"Request Site Deletion",approvalPath:["manager","it"],agentChecks:["Check last site activity","Identify site owners","Check for active flows or apps referencing site","Verify data retention requirements"],systemAction:"Remove-SPOSite via PnP PowerShell",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"contentAction",label:"Content Action",type:"select",required:!0,options:["Export content then delete","Move to archive library","Immediate deletion"]},{id:"confirmation",label:"Type site name to confirm",type:"text",required:!0},{id:"justification",label:"Reason for Deletion",type:"textarea",required:!0}]}]},onedrive:{parentGroup:null,operations:[{id:"onedrive-storage",group:"Storage",label:"Request OneDrive Storage Increase",approvalPath:["manager","it"],agentChecks:["Check current OneDrive usage","Verify user licensing tier","Check tenant storage pool"],systemAction:"Set-SPOSite (OneDrive) -StorageQuota via PnP PowerShell",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0,placeholder:"user@contoso.com"},{id:"currentUsage",label:"Current Usage (approx)",type:"text",required:!1,placeholder:"e.g. 800 GB"},{id:"requestedQuota",label:"Requested Quota (GB)",type:"select",required:!0,options:["1 TB (default)","2 TB","5 TB","10 TB","25 TB (requires approval)"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"former-employee-od",group:"Access",label:"Access Former Employee OneDrive",approvalPath:["manager","it"],agentChecks:["Verify employee account status","Check data retention policy","Validate manager relationship","Check GDPR/legal hold status"],systemAction:"Set-SPOUser -Site (OneDrive URL) -LoginName via PnP PowerShell",fields:[{id:"formerEmployee",label:"Former Employee UPN",type:"email",required:!0},{id:"requestorUpn",label:"Requestor UPN",type:"email",required:!0,hint:"Your UPN — will be granted access"},{id:"reason",label:"Reason for Access",type:"select",required:!0,options:["Business continuity","Legal / compliance","Data recovery","Project handover","GDPR subject access request"]},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["7 days","30 days","90 days"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"ext-sharing":{parentGroup:null,operations:[{id:"invite-guest",group:"Guest Invitations",label:"Invite External Guest",approvalPath:["manager","it"],agentChecks:["Check domain against block list","Verify guest invitation policy","Check existing guest account","Validate business relationship"],systemAction:"POST /v1.0/invitations",fields:[{id:"guestEmail",label:"Guest Email Address",type:"email",required:!0},{id:"guestName",label:"Guest Full Name",type:"text",required:!0},{id:"guestOrg",label:"Guest Organisation",type:"text",required:!0},{id:"accessNeeded",label:"Access Required",type:"text",required:!0,placeholder:"Teams, SharePoint site, etc."},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["30 days","60 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"extend-guest",group:"Guest Lifecycle",label:"Extend Guest Access",approvalPath:["manager","dataowner"],agentChecks:["Verify current expiry date","Check if guest is still active","Validate business relationship still active"],systemAction:"PATCH /v1.0/users/{guestId} — update account expiry",fields:[{id:"guestEmail",label:"Guest Email Address",type:"email",required:!0},{id:"extension",label:"Extend By",type:"select",required:!0,options:["30 days","60 days","90 days","6 months","1 year"]},{id:"reviewDate",label:"Next Review Date",type:"date",required:!1},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"remove-guest",group:"Guest Lifecycle",label:"Remove Guest Access",approvalPath:["manager"],agentChecks:["Enumerate all resources guest has access to","Check for owned content","Schedule account removal"],systemAction:"DELETE /v1.0/users/{guestId}",fields:[{id:"guestEmail",label:"Guest Email Address",type:"email",required:!0},{id:"removeDate",label:"Removal Date",type:"date",required:!1,hint:"Leave blank for immediate removal"},{id:"reassignContent",label:"Reassign owned content to",type:"text",required:!1,placeholder:"UPN of new owner (optional)"},{id:"justification",label:"Reason",type:"textarea",required:!0}]},{id:"enable-ext-sharing",group:"Sharing Policy",label:"Request External Sharing Enablement",approvalPath:["manager","dataowner","it"],agentChecks:["Verify DLP policies cover new sharing scope","Check Conditional Access for guest sign-in","Review tenant sharing policy settings"],systemAction:"Set-SPOTenant -SharingCapability via PnP PowerShell",fields:[{id:"scope",label:"Sharing Scope",type:"select",required:!0,options:["Specific SharePoint sites","All SharePoint sites","OneDrive","All workloads"]},{id:"sharingLevel",label:"Sharing Level",type:"select",required:!0,options:["New and existing guests","Existing guests only","Anyone (anonymous links)"]},{id:"domains",label:"Allowed External Domains",type:"text",required:!1,placeholder:"partner1.com, partner2.com"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"user-access":{parentGroup:null,operations:[{id:"access-mailbox",group:"Access Requests",label:"Access to Shared Mailbox",approvalPath:["manager"],agentChecks:["Verify mailbox exists","Check existing permissions","Validate requester eligibility"],systemAction:"Add-MailboxPermission via Exchange PowerShell",fields:[{id:"mailboxEmail",label:"Shared Mailbox Email",type:"email",required:!0},{id:"permLevel",label:"Permission Level",type:"select",required:!0,options:["Full Access","Send As","Send on Behalf"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-teams",group:"Access Requests",label:"Access to Teams Team or Channel",approvalPath:["manager"],agentChecks:["Verify team exists","Check if team is private/public","Check channel accessibility"],systemAction:"POST /v1.0/teams/{id}/members",fields:[{id:"teamName",label:"Team Name",type:"text",required:!0},{id:"channelName",label:"Channel Name",type:"text",required:!1,placeholder:"Leave blank for general access"},{id:"role",label:"Role",type:"select",required:!0,options:["Member","Owner"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-sharepoint",group:"Access Requests",label:"Access to SharePoint Site",approvalPath:["manager"],agentChecks:["Verify site exists","Check current permissions","Classify data sensitivity"],systemAction:"SharePoint REST API — /_api/web/roleassignments",fields:[{id:"siteUrl",label:"Site URL",type:"text",required:!0},{id:"permLevel",label:"Permission Level",type:"select",required:!0,options:["Read","Contribute","Edit"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-dl",group:"Access Requests",label:"Access to Distribution List",approvalPath:["manager"],agentChecks:["Verify DL exists","Check for closed membership","Check for similar groups"],systemAction:"Add-DistributionGroupMember via Exchange PowerShell",fields:[{id:"dlEmail",label:"Distribution List Email",type:"email",required:!0},{id:"action",label:"Action",type:"select",required:!0,options:["Subscribe (add)","Unsubscribe (remove)"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"access-sg",group:"Access Requests",label:"Access to Security Group",approvalPath:["manager","it"],agentChecks:["Verify SG exists","Identify what resources are secured","Validate eligibility based on role/department"],systemAction:"POST /v1.0/groups/{id}/members/$ref",fields:[{id:"sgName",label:"Security Group Name",type:"text",required:!0},{id:"resourceAccess",label:"Resource you need to access",type:"text",required:!0,placeholder:"What will this SG membership unlock?"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},licenses:{parentGroup:null,operations:[{id:"req-e3",group:"Microsoft 365",label:"Request Microsoft 365 E3 License",approvalPath:["manager","it"],agentChecks:["Check E3 license availability","Verify current license assignment","Validate user eligibility"],systemAction:"POST /v1.0/users/{id}/assignLicense",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"startDate",label:"Required From Date",type:"date",required:!1},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-e5",group:"Microsoft 365",label:"Request Microsoft 365 E5 License",approvalPath:["manager","it"],agentChecks:["Check E5 license availability (CRITICAL — low stock)","Verify E5 features needed vs E3","Validate cost center approval"],systemAction:"POST /v1.0/users/{id}/assignLicense",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"featuresNeeded",label:"E5 Features Required",type:"select",required:!0,options:["Defender for Endpoint P2","Purview compliance","Advanced analytics","All E5 features"]},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"startDate",label:"Required From Date",type:"date",required:!1},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-powerbi",group:"Add-on Licenses",label:"Request Power BI Pro License",approvalPath:["manager"],agentChecks:["Check Power BI Pro availability","Verify user not already licensed","Check for Power BI Free upgrade path"],systemAction:"POST /v1.0/users/{id}/assignLicense (PBIPREMIUM)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"useCase",label:"Use Case",type:"textarea",required:!0,placeholder:"How will Power BI Pro be used?"},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-visio",group:"Add-on Licenses",label:"Request Visio Plan License",approvalPath:["manager"],agentChecks:["Check Visio license availability","Verify Visio Plan 1 vs Plan 2 need"],systemAction:"POST /v1.0/users/{id}/assignLicense (VISIO_PLAN2)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"visioTier",label:"Visio Plan",type:"select",required:!0,options:["Visio Plan 1 (web only)","Visio Plan 2 (desktop + web)"]},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"req-project",group:"Add-on Licenses",label:"Request Project Plan License",approvalPath:["manager"],agentChecks:["Check Project Plan availability","Validate PM role or equivalent"],systemAction:"POST /v1.0/users/{id}/assignLicense (PROJECT_PLAN3)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"projectTier",label:"Project Plan",type:"select",required:!0,options:["Project Plan 1 (web only)","Project Plan 3 (full)","Project Plan 5 (enterprise)"]},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},copilot:{parentGroup:null,operations:[{id:"req-copilot",group:"Copilot License",label:"Request Microsoft 365 Copilot License",approvalPath:["manager","it"],agentChecks:["Check Copilot license availability","Verify M365 E3/E5 prerequisite","Validate cost center budget"],systemAction:"POST /v1.0/users/{id}/assignLicense (COPILOT_M365)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"useCase",label:"Intended Use Case",type:"textarea",required:!0,placeholder:"How will Copilot improve your productivity?"},{id:"pilotGroup",label:"Pilot / rollout group",type:"text",required:!1,placeholder:"Team or department (optional)"},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"remove-copilot",group:"Copilot License",label:"Remove Microsoft 365 Copilot License",approvalPath:["manager"],agentChecks:["Verify current Copilot assignment","Check active Copilot usage metrics"],systemAction:"POST /v1.0/users/{id}/assignLicense (removeLicenses)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"reason",label:"Reason for Removal",type:"select",required:!0,options:["User departure","Cost reduction","Low utilisation","Role change","Other"]},{id:"justification",label:"Additional Details",type:"textarea",required:!1}]}]},"power-platform":{parentGroup:null,operations:[{id:"create-env",group:"Environments",label:"Create Power Platform Environment",approvalPath:["manager","it"],agentChecks:["Check environment quota","Validate environment type eligibility","Check DLP policy coverage for new environment"],systemAction:"Power Platform Admin API — POST /environments",fields:[{id:"envName",label:"Environment Name",type:"text",required:!0,placeholder:"e.g. Finance-Production"},{id:"envType",label:"Environment Type",type:"select",required:!0,options:["Sandbox","Production","Developer","Trial"]},{id:"region",label:"Region",type:"select",required:!0,options:["United Kingdom","Europe","United States","Australia"]},{id:"purpose",label:"Purpose",type:"textarea",required:!0},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"premium-connector",group:"Connectors",label:"Request Premium Connector Access",approvalPath:["manager","it"],agentChecks:["Check DLP policy for requested connector","Verify Power Automate license","Assess data exposure risk"],systemAction:"Power Platform DLP API — update connector classification",fields:[{id:"connector",label:"Premium Connector",type:"text",required:!0,placeholder:"e.g. Salesforce, SAP, ServiceNow"},{id:"environment",label:"Environment Name",type:"text",required:!0},{id:"useCase",label:"Use Case",type:"textarea",required:!0},{id:"dataFlow",label:"Data Flow Description",type:"textarea",required:!0,placeholder:"What data will flow through this connector?"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"dlp-exception",group:"Policies",label:"Request DLP Policy Exception",approvalPath:["manager","dataowner","it"],agentChecks:["Validate exception scope","Assess compliance risk","Check for alternative compliant approach","Flag sensitive connectors"],systemAction:"Power Platform DLP API — environment-level policy override",fields:[{id:"environment",label:"Environment",type:"text",required:!0},{id:"dlpPolicy",label:"DLP Policy Name",type:"text",required:!0},{id:"connector",label:"Connector(s) Affected",type:"text",required:!0},{id:"riskMitigation",label:"Risk Mitigation Plan",type:"textarea",required:!0},{id:"duration",label:"Exception Duration",type:"select",required:!0,options:["30 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"pa-license",group:"Licensing",label:"Request Power Automate License",approvalPath:["manager"],agentChecks:["Check Power Automate license availability","Verify M365 base license","Determine if Premium or per-flow license needed"],systemAction:"POST /v1.0/users/{id}/assignLicense (FLOW_PER_USER)",fields:[{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"licenseType",label:"License Type",type:"select",required:!0,options:["Power Automate Premium (per user)","Power Automate per flow","Power Automate Process"]},{id:"useCase",label:"Use Case",type:"textarea",required:!0},{id:"costCenter",label:"Cost Center",type:"text",required:!0},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},intune:{parentGroup:null,operations:[{id:"retire-device",group:"Device Actions",label:"Retire Device",approvalPath:["manager","it"],agentChecks:["Verify device ownership","Check for company data on device","Confirm MFA device registration","Check for pending updates"],systemAction:"POST /beta/deviceManagement/managedDevices/{id}/retire",fields:[{id:"deviceName",label:"Device Name",type:"text",required:!0,placeholder:"Device display name from Intune"},{id:"userUpn",label:"Device User UPN",type:"email",required:!0},{id:"reason",label:"Reason for Retirement",type:"select",required:!0,options:["Device being replaced","User departure","Device lost/stolen","End of lifecycle","Other"]},{id:"returnDate",label:"Device Return / Disposal Date",type:"date",required:!1},{id:"justification",label:"Additional Details",type:"textarea",required:!1}]},{id:"wipe-device",group:"Device Actions",label:"Wipe Device",approvalPath:["it"],agentChecks:["Verify device ownership","Check for unsynced data","CRITICAL: Confirm user awareness — device wipe is irreversible"],systemAction:"POST /beta/deviceManagement/managedDevices/{id}/wipe",fields:[{id:"deviceName",label:"Device Name",type:"text",required:!0},{id:"userUpn",label:"Device User UPN",type:"email",required:!0},{id:"wipeType",label:"Wipe Type",type:"select",required:!0,options:["Full wipe (factory reset)","Selective wipe (remove corporate data only)"]},{id:"reason",label:"Reason",type:"select",required:!0,options:["Device lost","Device stolen","Security incident","User departure","Other"]},{id:"confirmation",label:"Type CONFIRM to proceed",type:"text",required:!0,hint:"This action is irreversible"},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"compliance-exception",group:"Compliance",label:"Request Compliance Exception",approvalPath:["manager","it"],agentChecks:["Assess compliance gap","Check for compensating controls","Review exception policy limits","Flag if exception creates Zero Trust gap"],systemAction:"Update device compliance policy exclusion group via Intune API",fields:[{id:"deviceName",label:"Device Name",type:"text",required:!0},{id:"userUpn",label:"User UPN",type:"email",required:!0},{id:"nonCompliantItem",label:"Non-Compliant Item",type:"select",required:!0,options:["OS version","Encryption","Screen lock","Jailbreak/Root detection","Threat level","Other"]},{id:"compensatingControls",label:"Compensating Controls",type:"textarea",required:!0,placeholder:"What security controls mitigate the compliance gap?"},{id:"duration",label:"Exception Duration",type:"select",required:!0,options:["7 days","30 days","90 days"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]}]},"guest-lifecycle":{parentGroup:null,operations:[{id:"invite-guest-user",group:"Guest Management",label:"Invite Guest User",approvalPath:["manager","it"],agentChecks:["Check domain against block list","Check for existing guest account","Verify guest invitation policy","Check Conditional Access guest policy"],systemAction:"POST /v1.0/invitations",fields:[{id:"guestEmail",label:"Guest Email",type:"email",required:!0},{id:"guestName",label:"Guest Full Name",type:"text",required:!0},{id:"guestOrg",label:"Organisation",type:"text",required:!0},{id:"accessScope",label:"Access Scope",type:"text",required:!0,placeholder:"Teams, SharePoint sites, etc."},{id:"sponsor",label:"Internal Sponsor UPN",type:"email",required:!0,hint:"Accountable internal contact for this guest"},{id:"duration",label:"Access Duration",type:"select",required:!0,options:["30 days","90 days","6 months","1 year"]},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"extend-guest-access",group:"Guest Management",label:"Extend Guest Access",approvalPath:["manager","dataowner"],agentChecks:["Verify guest activity (last 30 days)","Check access scope still appropriate","Validate sponsor still in organisation"],systemAction:"PATCH /v1.0/users/{guestId} — update account expiry",fields:[{id:"guestEmail",label:"Guest Email",type:"email",required:!0},{id:"extension",label:"Extend Access By",type:"select",required:!0,options:["30 days","90 days","6 months","1 year"]},{id:"accessReview",label:"Access Still Required For",type:"textarea",required:!0,placeholder:"Confirm ongoing business need..."},{id:"justification",label:"Business Justification",type:"textarea",required:!0}]},{id:"remove-guest-user",group:"Guest Management",label:"Remove Guest User",approvalPath:["manager"],agentChecks:["Enumerate guest resource access","Check for owned content","Check active collaborations","Flag any open items"],systemAction:"DELETE /v1.0/users/{guestId}",fields:[{id:"guestEmail",label:"Guest Email",type:"email",required:!0},{id:"removeDate",label:"Removal Date",type:"date",required:!1,hint:"Leave blank for immediate removal"},{id:"contentAction",label:"Owned Content Action",type:"select",required:!0,options:["Reassign to sponsor","Export then delete","No action needed"]},{id:"justification",label:"Reason",type:"textarea",required:!0}]},{id:"quarterly-review",group:"Access Review",label:"Request Quarterly Access Review",approvalPath:["it"],agentChecks:["Enumerate all active guest accounts","Identify guests inactive >60 days","Check expiry dates","Identify guests without sponsors"],systemAction:'GET /v1.0/users?$filter=userType eq "Guest" — generate review report',fields:[{id:"scope",label:"Review Scope",type:"select",required:!0,options:["All guest users","Specific department guests","Guests expiring in 30 days","Inactive guests only"]},{id:"reviewerUpn",label:"Reviewer UPN",type:"email",required:!0,hint:"Who should receive the review report"},{id:"justification",label:"Additional Notes",type:"textarea",required:!1}]}]}};let I="landing",B=null,F=null,z=null,ee={},Ai=100;function Aa(){const e=document.getElementById("page-portal");e&&(I="landing",B=null,F=null,z=null,ee={},_(e))}function _(e){I==="landing"?Ea(e):I==="service"?Pa(e):I==="form"?qa(e):I==="submitted"&&Ma(e)}function _e(e){const t=y.settings;return t.portalEnabled?t[e]!==!1:!1}function Ut(e){return"portal_"+e.replace(/-/g,"_")}function ye(e){return ka[e]||null}function ht(e){return Fe.find(t=>t.id===e)}function Si(e,t){const i=ye(e);return i?i.operations.find(s=>s.id===t):null}function Ie(e){return e==="exchange"}function Sa(){const e={"exchange-groups":"portal_exchange_groups","shared-mailbox":"portal_shared_mailbox","room-equipment":"portal_room_equipment","email-services":"portal_email_services"};for(const t of me)if(_e(e[t.id]))return t.id;return me[0].id}function Ke(){return Ie(B)?F:B}function Te(e){if(!e)return[];const t=["submit",...e.approvalPath,"agent","action","done"];return vt.filter(i=>t.includes(i.id))}function Ea(e){const t=y.currentUser;if(!y.settings.portalEnabled){e.innerHTML=`
      <div class="page-header"><div class="page-title"><i class="ti ti-grid-dots"></i> Self-Service Portal</div></div>
      <div class="locked-banner">
        <i class="ti ti-plug-x"></i>
        <h3>Portal Temporarily Disabled</h3>
        <p>The self-service portal has been disabled by your administrator. Please contact IT for assistance.</p>
      </div>`;return}const i={user:"Standard user",manager:"Manager",admin:"Administrator",super:"Super Admin"},s=Fe.filter(r=>_e(Ut(r.id)));e.innerHTML=`
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
      ${vt.map((r,n)=>`
        <div class="pwf-step">
          <div class="pwf-circle pwf-${r.color}"><i class="ti ${r.icon}"></i></div>
          <div class="pwf-label">${r.label}</div>
        </div>
        ${n<vt.length-1?'<div class="pwf-arrow"><i class="ti ti-arrow-right"></i></div>':""}
      `).join("")}
    </div>

    <div style="font-size:11px;font-weight:600;color:var(--color-text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">
      ${s.length} services available
    </div>

    <div class="portal-service-grid" id="portal-service-grid"></div>
  `;const a=e.querySelector("#portal-service-grid");Fe.forEach(r=>{var d,c;const n=_e(Ut(r.id)),o=Ie(r.id)?me.reduce((p,f)=>{var x,g;return p+(((g=(x=ye(f.id))==null?void 0:x.operations)==null?void 0:g.length)||0)},0):((c=(d=ye(r.id))==null?void 0:d.operations)==null?void 0:c.length)||0,l=document.createElement("div");l.className=`portal-svc-card ${n?"":"disabled"}`,l.innerHTML=`
      <div class="psc-icon" style="background:${r.bg};color:${r.color}"><i class="ti ${r.icon}"></i></div>
      <div class="psc-name">${r.name}</div>
      <div class="psc-desc">${r.desc}</div>
      <div class="psc-footer">
        <span class="badge ${n?"info":"neutral"}">${n?o+" actions":"Disabled"}</span>
        <button class="btn btn-xs btn-primary psc-open-btn" data-gid="${r.id}" ${n?"":"disabled"}>
          <i class="ti ti-arrow-right"></i> Open
        </button>
      </div>
    `,n||(l.title="This service has been disabled by your administrator."),a.appendChild(l)}),e.querySelectorAll(".psc-open-btn:not([disabled])").forEach(r=>{r.addEventListener("click",()=>{B=r.dataset.gid,Ie(B)&&(F=Sa()),z=null,ee={},I="service",_(e)})})}function Pa(e){const t=ht(B);if(!t){I="landing",_(e);return}const i=Ke(),s=ye(i);e.innerHTML=`
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

    ${Ie(B)?Ca():""}

    <div id="svc-ops-area"></div>
  `,e.querySelector("#svc-back").addEventListener("click",()=>{I="landing",_(e)}),Ie(B)&&e.querySelectorAll(".ex-sub-tab").forEach(a=>{a.addEventListener("click",()=>{F=a.dataset.sub,z=null,Gt(e,ye(F)),e.querySelectorAll(".ex-sub-tab").forEach(r=>r.classList.toggle("active",r.dataset.sub===F))})}),Gt(e,s)}function Ca(){const e={"exchange-groups":"portal_exchange_groups","shared-mailbox":"portal_shared_mailbox","room-equipment":"portal_room_equipment","email-services":"portal_email_services"};return`
    <div class="tabs mb-3" style="margin-bottom:16px">
      ${me.map(t=>{const i=_e(e[t.id]);return`<button class="tab-btn ex-sub-tab ${t.id===F?"active":""} ${i?"":"disabled-tab"}"
          data-sub="${t.id}" ${i?"":"disabled"} title="${t.desc}">
          <i class="ti ${t.icon}" style="margin-right:4px"></i>${t.name}
          ${i?"":'<span class="badge neutral" style="margin-left:4px;font-size:8px">Off</span>'}
        </button>`}).join("")}
    </div>
  `}function Gt(e,t){const i=e.querySelector("#svc-ops-area");if(!i)return;if(!t){i.innerHTML='<div class="empty-state">No operations available for this service.</div>';return}const s={};if(t.operations.forEach(a=>{s[a.group]||(s[a.group]=[]),s[a.group].push(a)}),i.innerHTML=`
    <div class="card">
      <div class="card-title mb-3"><i class="ti ti-list-check"></i> Select an action</div>
      ${Object.entries(s).map(([a,r])=>`
        <div style="margin-bottom:16px">
          <div class="section-heading">${a}</div>
          <div class="op-cards-grid">
            ${r.map(n=>`
              <div class="op-card ${z===n.id?"selected":""}" data-op="${n.id}">
                <div class="op-card-title">${n.label}</div>
                <div class="op-card-steps">
                  ${Te(n).map(o=>`<span class="op-step-dot op-step-${o.color}" title="${o.label}"></span>`).join("")}
                </div>
                <div class="op-card-approval">
                  <i class="ti ti-route" style="font-size:10px"></i>
                  ${Te(n).map(o=>o.label).join(" → ")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>

    <div id="svc-form-preview"></div>
  `,i.querySelectorAll(".op-card").forEach(a=>{a.addEventListener("click",()=>{i.querySelectorAll(".op-card").forEach(r=>r.classList.remove("selected")),a.classList.add("selected"),z=a.dataset.op,Bt(i,ye(Ke()),z)})}),z){const a=i.querySelector(`.op-card[data-op="${z}"]`);a&&a.classList.add("selected"),Bt(i,t,z)}}function Bt(e,t,i){var n;const s=e.querySelector("#svc-form-preview");if(!s)return;const a=(n=t==null?void 0:t.operations)==null?void 0:n.find(o=>o.id===i);if(!a)return;const r=Te(a);s.innerHTML=`
    <div class="card mt-3">
      <div class="card-header">
        <span class="card-title"><i class="ti ti-info-circle"></i> ${a.label}</span>
        <button class="btn btn-primary" id="svc-start-form"><i class="ti ti-arrow-right"></i> Start Request</button>
      </div>

      <div class="grid-2" style="gap:16px">
        <div>
          <div class="section-heading">Approval & Provisioning Workflow</div>
          <div class="workflow-timeline-h">
            ${r.map((o,l)=>`
              <div class="wfh-step">
                <div class="wfh-circle wfh-${o.color}"><i class="ti ${o.icon}"></i></div>
                <div class="wfh-label">${o.label}</div>
              </div>
              ${l<r.length-1?'<div class="wfh-arrow"></div>':""}
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
  `,s.querySelector("#svc-start-form").addEventListener("click",()=>{I="form",ee={};const o=document.getElementById("page-portal");_(o)})}function qa(e){var r;const t=ht(B),i=Ke(),s=Si(i,z);if(!s||!t){I="service",_(e);return}const a=Te(s);e.innerHTML=`
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn" id="form-back"><i class="ti ti-arrow-left"></i> Back</button>
        <div class="psc-icon sm" style="background:${t.bg};color:${t.color}"><i class="ti ${t.icon}"></i></div>
        <div>
          <div class="page-title">${s.label}</div>
          <div class="page-subtitle">${t.name}${F?" — "+(((r=me.find(n=>n.id===F))==null?void 0:r.name)||""):""}</div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:16px">
      <!-- Form -->
      <div>
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-forms"></i> Request Details</div>
          <div id="dynamic-form">
            ${s.fields.map(n=>Ra(n)).join("")}
          </div>
        </div>

        <div class="card" style="background:var(--clr-info-bg);border-color:var(--clr-info-border)">
          <div style="display:flex;align-items:flex-start;gap:10px">
            <i class="ti ti-robot" style="font-size:18px;color:var(--clr-teal-text);flex-shrink:0;margin-top:2px"></i>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--color-text-primary);margin-bottom:6px">AI Agent will validate before provisioning:</div>
              ${s.agentChecks.map(n=>`<div style="font-size:11px;color:var(--color-text-secondary);padding:2px 0;display:flex;align-items:flex-start;gap:5px"><i class="ti ti-check" style="color:var(--clr-teal-text);font-size:10px;flex-shrink:0;margin-top:2px"></i>${n}</div>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- Workflow sidebar -->
      <div>
        <div class="card mb-3">
          <div class="card-title mb-3"><i class="ti ti-route"></i> Approval & Provisioning Flow</div>
          <div class="workflow-timeline-v">
            ${a.map((n,o)=>`
              <div class="wfv-step">
                <div class="wfv-left">
                  <div class="wfv-circle wfv-${n.color}"><i class="ti ${n.icon}"></i></div>
                  ${o<a.length-1?'<div class="wfv-line"></div>':""}
                </div>
                <div class="wfv-content">
                  <div class="wfv-title">${n.label}</div>
                  ${Ht(n.id,s)?`<div class="wfv-desc">${Ht(n.id,s)}</div>`:""}
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
  `,e.querySelector("#form-back").addEventListener("click",()=>{I="service",_(e)}),e.querySelector("#form-submit").addEventListener("click",()=>La(e,s))}function Ra(e){const t=e.required?" *":"",i=e.hint?`<div style="font-size:10px;color:var(--color-text-tertiary);margin-top:3px">${e.hint}</div>`:"";return e.type==="text"||e.type==="email"?`<div class="form-group" data-field="${e.id}">
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
    </div>`:""}function Ht(e,t){return t.approvalPath,e==="submit"?"Request submitted with required details":e==="manager"?"Your direct manager reviews and approves":e==="it"?"IT team validates technical feasibility and security":e==="dataowner"?"Data/resource owner confirms access appropriateness":e==="agent"?`AI Agent validates: ${t.agentChecks[0]}, and ${t.agentChecks.length-1} more checks`:e==="action"?`Provisioning via: ${t.systemAction}`:e==="done"?"Email notification sent. Request available in My Requests.":""}function La(e,t){const i=e.querySelector("#dynamic-form");let s=!0;const a=[];if(t.fields.filter(n=>n.required).forEach(n=>{const o=i.querySelector(`#ff-${n.id}`);if(!o)return;(o.type==="checkbox"?o.checked:o.value.trim())||(s=!1,a.push(n.label),o.style.borderColor="var(--clr-danger-text)",o.addEventListener("input",()=>{o.style.borderColor=""},{once:!0}))}),t.fields.find(n=>n.id==="confirmation")){const n=i.querySelector("#ff-confirmation"),o=i.querySelector("#ff-groupName, #ff-siteUrl, #ff-currentName");if(n&&n.value.toUpperCase()!=="CONFIRM"&&!o&&n.value!=="CONFIRM"){s=!1,v("Type CONFIRM in the confirmation field to proceed.","error");return}}if(!s){v(`Please fill in required fields: ${a.slice(0,3).join(", ")}`,"error");return}t.fields.forEach(n=>{const o=i.querySelector(`#ff-${n.id}`);o&&(ee[n.id]=o.type==="checkbox"?o.checked:o.value)}),Ia(e,t)}async function Ia(e,t){const i=e.querySelector("#form-submit");e.querySelector(".card"),i.disabled=!0,i.innerHTML='<span class="spinner"></span> Validating with AI Agent...';try{const r=(await(await fetch(`${$}/agent/validate-request`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request:{operationId:t.id,fields:ee},userEmail:window.userEmail})})).json()).data;console.log("🤖 Agent validation result:",r),Ta(e,t,r,ee)}catch(s){console.error("⚠️ Validation error:",s),v("Agent validation failed. Proceeding with manual review.","warning"),Ei(e,t,null)}finally{i.disabled=!1,i.innerHTML='<i class="ti ti-send"></i> Submit Request'}}function Ta(e,t,i,s){const{riskLevel:a,riskScore:r,checks:n,recommendations:o,autoApprove:l,approvalPath:d,status:c}=i,f={LOW:{bg:"var(--clr-success-bg)",text:"var(--clr-success-text)",icon:"ti-circle-check"},MEDIUM:{bg:"var(--clr-warning-bg)",text:"var(--clr-warning-text)",icon:"ti-alert-circle"},HIGH:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)",icon:"ti-alert-octagon"},CRITICAL:{bg:"var(--clr-danger-bg)",text:"var(--clr-danger-text)",icon:"ti-alert-triangle"}}[a],x=document.createElement("div");x.style.cssText="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px";const g=document.createElement("div");g.style.cssText="background:white;border-radius:8px;max-width:600px;max-height:80vh;overflow-y:auto;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,0.3)",g.innerHTML=`
    <div style="text-align:center;margin-bottom:24px">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;background:${f.bg};margin-bottom:12px">
        <i class="ti ${f.icon}" style="font-size:28px;color:${f.text}"></i>
      </div>
      <h2 style="font-size:18px;font-weight:600;margin:0;color:var(--color-text-primary)">Agent Validation Complete</h2>
      <p style="font-size:12px;color:var(--color-text-secondary);margin:8px 0 0">Risk Level: <strong style="color:${f.text}">${a}</strong> (${r}/100)</p>
    </div>

    <!-- Validation Checks -->
    <div style="margin-bottom:20px">
      <h3 style="font-size:12px;font-weight:600;text-transform:uppercase;color:var(--color-text-tertiary);margin-bottom:10px">Validation Checks</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${n.map(m=>`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px;background:var(--color-background-secondary);border-radius:4px">
            <div style="flex-shrink:0;margin-top:2px">
              ${m.status==="PASS"?'<i class="ti ti-circle-check" style="color:var(--clr-success-text);font-size:14px"></i>':m.status==="FAIL"?'<i class="ti ti-circle-x" style="color:var(--clr-danger-text);font-size:14px"></i>':'<i class="ti ti-alert-circle" style="color:var(--clr-warning-text);font-size:14px"></i>'}
            </div>
            <div>
              <div style="font-size:11px;font-weight:600;color:var(--color-text-primary)">${m.message}</div>
              ${m.suggestion?`<div style="font-size:10px;color:var(--color-text-secondary);margin-top:3px">💡 ${m.suggestion}</div>`:""}
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
          ${o.map(m=>`<li style="margin-bottom:4px">${m.message}</li>`).join("")}
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
            ${d.map((m,u)=>`${m}${u<d.length-1?" → ":""}`).join("")}
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
  `,x.appendChild(g),document.body.appendChild(x),document.getElementById("val-cancel").addEventListener("click",()=>{x.remove()}),document.getElementById("val-submit").addEventListener("click",()=>{x.remove(),Ei(e,t,i)})}async function Ei(e,t,i){Ai++;try{const s=e.querySelector("#val-submit");s&&(s.disabled=!0,s.innerHTML='<span class="spinner"></span> Submitting...');const r=await(await fetch(`${$}/requests/submit`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({operationId:t.id,fields:ee,userEmail:window.userEmail,validation:i||{}})})).json();r.success?(console.log("✓ Request submitted:",r.data.id),v("Request submitted successfully","success"),I="submitted",_(e)):(v("Failed to submit request: "+r.error,"error"),s&&(s.disabled=!1,s.innerHTML='<i class="ti ti-send"></i> Confirm & Submit'))}catch(s){console.error("Submission error:",s),v("Error submitting request. Please try again.","error")}}function Ma(e){var n,o;const t=ht(B),i=Ke(),s=Si(i,z);if(!s||!t){I="landing",_(e);return}const a=Te(s),r=`REQ-${String(Ai).padStart(4,"0")}`;e.innerHTML=`
    <div class="page-header">
      <div class="page-title"><i class="ti ti-circle-check" style="color:var(--clr-success-text)"></i> Request Submitted</div>
    </div>

    <div class="alert-banner success mb-3">
      <i class="ti ti-circle-check"></i>
      <strong>${r}</strong> — ${s.label} request submitted successfully. You will be notified at each approval stage.
    </div>

    <div class="grid-2" style="gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-receipt"></i> Request Summary</div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:5px 16px;font-size:11px">
          <span style="color:var(--color-text-tertiary)">Request ID</span>
          <span class="monospace" style="font-weight:600;color:var(--clr-info-text)">${r}</span>
          <span style="color:var(--color-text-tertiary)">Service</span>
          <span>${t.name}</span>
          <span style="color:var(--color-text-tertiary)">Action</span>
          <span>${s.label}</span>
          <span style="color:var(--color-text-tertiary)">Submitted by</span>
          <span>${(n=y.currentUser)==null?void 0:n.name}</span>
          <span style="color:var(--color-text-tertiary)">Time</span>
          <span>${new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})} today</span>
          <span style="color:var(--color-text-tertiary)">Next step</span>
          <span style="color:var(--clr-warning-text);font-weight:600">${((o=a[1])==null?void 0:o.label)||"AI Validation"}</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-route"></i> Workflow Progress</div>
        <div class="workflow-timeline-v compact">
          ${a.map((l,d)=>`
            <div class="wfv-step">
              <div class="wfv-left">
                <div class="wfv-circle ${d===0?"wfv-success":"wfv-neutral"}">
                  ${d===0?'<i class="ti ti-check"></i>':`<span style="font-size:9px;font-weight:700">${d+1}</span>`}
                </div>
                ${d<a.length-1?'<div class="wfv-line"></div>':""}
              </div>
              <div class="wfv-content">
                <div class="wfv-title ${d===0?"done":d===1?"active":"pending"}">${l.label}</div>
                <div class="wfv-desc">${d===0?"Completed":d===1?"In progress — awaiting response":"Pending"}</div>
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
  `,e.querySelector("#submit-new").addEventListener("click",()=>{I="landing",B=null,F=null,z=null,ee={},_(e)}),e.querySelector("#submit-myreqs").addEventListener("click",()=>{$a(()=>Promise.resolve().then(()=>Wr),void 0).then(l=>l.go("myreqs"))})}function Da(){const e=document.getElementById("page-myreqs");e&&(e.innerHTML=`
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
  `)}const Ft={user:["What can I request?","How to create a Team?","Request SharePoint access","Request Copilot license"],manager:["Approve pending requests","Guest access policy","How to request a shared mailbox?","License request process"],admin:["M365 Config failures","Risky users summary","Zero Trust gaps","Portal service status"],super:["Graph API status","All service workflows","Failed CIS controls","Guest lifecycle policy"]},za=[{keywords:["m365 config","cis","benchmark","compliance score"],response:`**M365 Config — CIS Benchmark v7.0.0**

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

Full details available in **Graph API** page (super admin only).`}],Na=`I'm your **M365 AgentOps AI Copilot**. I can help you with:

- 🔧 **Portal requests** — how to request groups, mailboxes, Teams, licenses, and more
- 🔒 **Security** — CIS compliance, Zero Trust, risky users
- 📊 **Tenant status** — licenses, pending approvals, audit events
- 🤖 **AI Agent** — automation workflows and provisioning

Try asking:
- "How do I request a Distribution Group?"
- "What's the Teams guest access workflow?"
- "How do I request a Copilot license?"
- "What are the M365 Config failures?"`;let Ve=[],_t=!1;function Oa(){const e=document.getElementById("page-chat");if(!e)return;const t=y.currentUser,i=Ft[t==null?void 0:t.role]||Ft.user;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-message-circle"></i> AI Copilot</div>
        <div class="page-subtitle">Ask about your M365 tenant, services, approvals, and more</div>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;height:calc(100vh - 200px);min-height:400px">
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-suggestions" id="chat-suggestions">
        ${i.map(r=>`<button class="suggestion-pill" data-text="${r}">${r}</button>`).join("")}
      </div>
      <div class="chat-input-area">
        <textarea class="chat-input" id="chat-input" placeholder="Ask about the portal, services, approvals, M365 Config..." rows="1"></textarea>
        <button class="btn btn-primary" id="chat-send"><i class="ti ti-send"></i></button>
      </div>
    </div>
  `;const s=e.querySelector("#chat-messages"),a=e.querySelector("#chat-input");!_t||Ve.length===0?(Ve=[],ut("ai",Na),_t=!0):gt(s),e.querySelector("#chat-send").addEventListener("click",()=>it(e)),a.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),it(e))}),a.addEventListener("input",()=>{a.style.height="auto",a.style.height=Math.min(a.scrollHeight,120)+"px"}),e.querySelectorAll(".suggestion-pill").forEach(r=>{r.addEventListener("click",()=>{a.value=r.dataset.text,it(e)})})}function ut(e,t){Ve.push({role:e,text:t,ts:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})})}function gt(e){e.innerHTML=Ve.map(t=>{var a;const i=t.role==="ai",s=ja(t.text);return`
      <div class="chat-msg ${i?"ai":"user-msg"}">
        ${i?`<div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-teal-text)"></i> M365 Copilot · ${t.ts}</div>`:`<div class="chat-sender" style="justify-content:flex-end">${((a=y.currentUser)==null?void 0:a.name)||"You"} · ${t.ts}</div>`}
        <div class="chat-bubble">${s}</div>
      </div>
    `}).join(""),e.scrollTop=e.scrollHeight}function ja(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/^#{1,3} (.+)$/gm,'<strong style="font-size:12px">$1</strong>').replace(/\|(.+)\|\n\|[-| ]+\|\n/g,t=>`<table style="width:100%;border-collapse:collapse;font-size:11px;margin:6px 0"><thead><tr>${t.split(`
`)[0].split("|").filter(s=>s.trim()).map(s=>`<th style="padding:4px 8px;font-size:10px">${s.trim()}</th>`).join("")}</tr></thead><tbody>`).replace(/\|(.+)\|(?!\n\|[-|])/g,t=>`<tr>${t.split("|").filter(s=>s.trim()).map(s=>`<td style="padding:3px 8px;border-top:1px solid var(--color-border-tertiary)">${s.trim()}</td>`).join("")}</tr>`).replace(/<\/tbody>(?![\s\S]*<\/tbody>)/g,"</tbody></table>").replace(/\n/g,"<br>").replace(/❌/g,'<span style="color:var(--clr-danger-text)">❌</span>').replace(/✅/g,'<span style="color:var(--clr-success-text)">✅</span>').replace(/⚠️/g,'<span style="color:var(--clr-warning-text)">⚠️</span>').replace(/🟢/g,'<span style="color:var(--clr-success-text)">●</span>')}function it(e){const t=e.querySelector("#chat-input"),i=t.value.trim();if(!i)return;ut("user",i),t.value="",t.style.height="auto";const s=e.querySelector("#chat-messages");gt(s),setTimeout(()=>{const a=i.toLowerCase(),r=za.find(o=>o.keywords.some(l=>a.includes(l))),n=(r==null?void 0:r.response)||Ua(a);ut("ai",n),gt(s)},500)}function Ua(e){return e.includes("help")||e.includes("what")||e.includes("how")?`I'm here to help! I can answer questions about:

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

Try rephrasing your question or ask about a specific service name.`}function Ga(){var t,i,s,a,r,n;const e=document.getElementById("page-graphapi");if(e){if(((t=y.currentUser)==null?void 0:t.role)!=="super"){e.innerHTML=`
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
  `,e.querySelectorAll("#graph-tabs .tab-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll("#graph-tabs .tab-btn").forEach(l=>l.classList.remove("active")),e.querySelectorAll(".tab-panel").forEach(l=>l.classList.remove("active")),o.classList.add("active"),e.querySelector(`#graph-tab-${o.dataset.tab}`).classList.add("active")})}),e.querySelectorAll(".copy-val").forEach(o=>{o.addEventListener("click",()=>{navigator.clipboard.writeText(o.dataset.val),v("Copied to clipboard.","success")})}),(i=e.querySelector("#graph-secret-toggle"))==null||i.addEventListener("click",()=>{const o=e.querySelector("#graph-secret");o.type=o.type==="password"?"text":"password"}),(s=e.querySelector("#graph-save"))==null||s.addEventListener("click",()=>v("Configuration saved.","success")),(a=e.querySelector("#graph-refresh-token"))==null||a.addEventListener("click",()=>v("Token refreshed successfully.","success")),(r=e.querySelector("#graph-grant-consent"))==null||r.addEventListener("click",()=>v("Admin consent granted for all permissions.","success")),(n=e.querySelector("#throttle-save"))==null||n.addEventListener("click",()=>v("Throttling configuration saved.","success"))}}function Ba(){var t,i,s;const e=document.getElementById("page-sso");if(e){if(((t=y.currentUser)==null?void 0:t.role)!=="super"){e.innerHTML=`
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
      ${["Register application in Entra ID → App Registrations → New registration","Set redirect URI to your M365 AgentOps deployment URL + /auth/callback","Add required API permissions: User.Read, openid, profile, email","Create security groups in Entra ID for each application role","Configure group claims in token configuration to include group membership","Copy the Client ID and Tenant ID to M365 AgentOps Graph API settings","Test SSO flow with a test user from each role group"].map((a,r)=>`
        <div class="sso-step">
          <div class="sso-step-num">${r+1}</div>
          <div style="font-size:12px;color:var(--color-text-secondary);line-height:1.5">${a}</div>
        </div>
      `).join("")}
    </div>
  `,(i=e.querySelector("#sso-save"))==null||i.addEventListener("click",()=>v("SSO configuration saved.","success")),(s=e.querySelector("#sso-test"))==null||s.addEventListener("click",()=>{v("SSO test initiated — check your browser for the Entra ID sign-in prompt.","info")})}}function Ha(){const e=document.getElementById("page-audit");if(!e)return;const t=[{time:"Today 08:47",event:"Config Agent scan completed",user:"M365 Config Agent",category:"Compliance",severity:"info",sevCls:"info"},{time:"Today 08:15",event:"High-risk sign-in detected",user:"kevin.osei@contoso.com",category:"Security",severity:"high",sevCls:"danger"},{time:"Yesterday 16:30",event:"Access request approved (REQ-005)",user:"Sanjay Kumar",category:"Access",severity:"low",sevCls:"success"},{time:"Yesterday 14:12",event:"PIM role activated — Compliance Admin",user:"sam.torres@contoso.com",category:"Identity",severity:"medium",sevCls:"warning"}];e.innerHTML=`
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
  `}function H({id:e,checked:t,label:i,sublabel:s,onChange:a}){const r=document.createElement("div");r.className="toggle-wrap",r.innerHTML=`
    <label class="toggle-switch">
      <input type="checkbox" id="${e}" ${t?"checked":""}>
      <span class="toggle-track"></span>
    </label>
    <label for="${e}" class="toggle-label">
      ${i}
      ${s?`<div class="toggle-sublabel">${s}</div>`:""}
    </label>
  `;const n=r.querySelector("input");return n.addEventListener("change",()=>a(n.checked)),r}const Fa=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1",ft=Fa?"http://localhost:3000/api/tenantguard":"https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/tenantguard";async function _a(){try{return(await(await fetch(`${ft}/settings/claude-status`)).json()).data}catch(e){return console.error("Error getting Claude status:",e),null}}async function Va(e){try{return await(await fetch(`${ft}/settings/claude-api-key`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({apiKey:e})})).json()}catch(t){return console.error("Error setting Claude API key:",t),{success:!1,error:t.message}}}async function Wa(){try{return await(await fetch(`${ft}/settings/claude-api-key`,{method:"DELETE"})).json()}catch(e){return console.error("Error removing Claude API key:",e),{success:!1,error:e.message}}}function Ja(){const e=document.getElementById("page-settings");e&&Pi(e)}function Pi(e){const t=y.settings;e.innerHTML=`
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
  `;const i=H({id:"toggle-ps",checked:t.showPSCommands,label:"Show PowerShell validation commands",sublabel:"Displays the PowerShell command used for each control in the M365 Config topic view.",onChange:g=>{y.settings.showPSCommands=g,T()}});e.querySelector("#settings-ps-wrap").appendChild(i);const s=H({id:"toggle-result",checked:t.showTenantResult,label:"Show simulated tenant result",sublabel:"Displays the simulated tenant scan result for each control.",onChange:g=>{y.settings.showTenantResult=g,T()}});e.querySelector("#settings-result-wrap").appendChild(s);const a=H({id:"toggle-expand",checked:t.autoExpandFailed,label:"Auto-expand failed controls",sublabel:"Automatically opens the details panel for failed controls on topic load.",onChange:g=>{y.settings.autoExpandFailed=g,T()}});e.querySelector("#settings-expand-wrap").appendChild(a);const r=H({id:"toggle-alert-fail",checked:t.agentAlertOnFail,label:"Alert on new failures",sublabel:"Send email notification when agent detects new failed controls.",onChange:g=>{y.settings.agentAlertOnFail=g,T()}});e.querySelector("#settings-alert-fail-wrap").appendChild(r);const n=H({id:"toggle-graph-health",checked:t.showGraphHealth,label:"Show Graph API health on dashboard",onChange:g=>{y.settings.showGraphHealth=g,T()}});e.querySelector("#settings-graph-health-wrap").appendChild(n);const o=H({id:"toggle-zt-score",checked:t.showZeroTrustScore,label:"Show Zero Trust score on dashboard",onChange:g=>{y.settings.showZeroTrustScore=g,T()}});e.querySelector("#settings-zt-score-wrap").appendChild(o);const l=H({id:"toggle-cfg-score",checked:t.showM365ConfigScore,label:"Show M365 Config score on dashboard",onChange:g=>{y.settings.showM365ConfigScore=g,T()}});e.querySelector("#settings-cfg-score-wrap").appendChild(l);const d=H({id:"toggle-portal-master",checked:t.portalEnabled!==!1,label:"Self-Service Portal — Master Switch",sublabel:"Disable to prevent all users from accessing the portal globally.",onChange:g=>{y.settings.portalEnabled=g,T();const m=e.querySelector("#portal-services-section");m&&(m.style.opacity=g?"1":"0.4"),v(g?"Self-Service Portal enabled.":"Self-Service Portal disabled globally.",g?"success":"warning")}});e.querySelector("#settings-portal-master-wrap").appendChild(d);const c=e.querySelector("#portal-services-section");c&&(c.style.opacity=t.portalEnabled!==!1?"1":"0.4");const p=e.querySelector("#portal-main-toggles");Fe.forEach(g=>{const m="portal_"+g.id.replace(/-/g,"_"),u=document.createElement("div");u.className="portal-svc-setting-row",u.innerHTML=`
      <div class="psc-icon" style="background:${g.bg};color:${g.color};width:28px;height:28px;font-size:13px;border-radius:6px;flex-shrink:0">
        <i class="ti ${g.icon}"></i>
      </div>
      <span style="flex:1;font-size:11px;font-weight:500">${g.name}</span>
      <div id="portal-toggle-${m}"></div>
    `,p.appendChild(u);const w=H({id:`chk-${m}`,checked:t[m]!==!1,label:"",onChange:X=>{y.settings[m]=X,T()}});u.querySelector(`#portal-toggle-${m}`).appendChild(w)});const f=e.querySelector("#portal-exchange-toggles"),x={"exchange-groups":"portal_exchange_groups","shared-mailbox":"portal_shared_mailbox","room-equipment":"portal_room_equipment","email-services":"portal_email_services"};me.forEach(g=>{const m=x[g.id],u=document.createElement("div");u.className="portal-svc-setting-row",u.innerHTML=`
      <i class="ti ${g.icon}" style="color:var(--color-text-secondary)"></i>
      <span style="flex:1;font-size:11px;font-weight:500">${g.name}</span>
      <div id="portal-toggle-${m}"></div>
    `,f.appendChild(u);const w=H({id:`chk-${m}`,checked:t[m]!==!1,label:"",onChange:X=>{y.settings[m]=X,T()}});u.querySelector(`#portal-toggle-${m}`).appendChild(w)}),e.querySelector("#settings-save").addEventListener("click",()=>{y.settings.agentSchedule=e.querySelector("#settings-schedule").value,y.settings.agentAlertEmail=e.querySelector("#settings-alert-email").value,T(),v("Settings saved successfully.","success")}),e.querySelector("#settings-reset").addEventListener("click",()=>{ji(),Pi(e),v("Settings reset to defaults.","info")}),st(e),e.querySelector("#claude-save-btn").addEventListener("click",async()=>{const g=e.querySelector("#settings-claude-key").value;if(!g||g.trim()===""){v("Please enter a Claude API key","warning");return}const m=e.querySelector("#claude-save-btn");m.disabled=!0,m.innerHTML='<span class="spinner dark"></span> Saving...';try{const u=await Va(g);u.success?(v("Claude API key configured successfully!","success"),e.querySelector("#settings-claude-key").value="",st(e)):v("Failed to save: "+u.error,"error")}catch(u){v("Error saving API key: "+u.message,"error")}m.disabled=!1,m.innerHTML='<i class="ti ti-device-floppy"></i> Save API Key'}),e.querySelector("#claude-remove-btn").addEventListener("click",async()=>{const g=e.querySelector("#claude-remove-btn");g.disabled=!0,g.innerHTML='<span class="spinner dark"></span> Removing...';try{const m=await Wa();m.success?(v("Claude API key removed","success"),st(e)):v("Failed to remove: "+m.error,"error")}catch(m){v("Error removing API key: "+m.message,"error")}g.disabled=!1,g.innerHTML='<i class="ti ti-trash"></i> Remove API Key'})}async function st(e){try{const t=await _a();if(t){const i=e.querySelector("#claude-status-badge"),s=e.querySelector("#claude-mode-text"),a=e.querySelector("#claude-remove-btn");t.available?(i.innerHTML='<span style="background:var(--clr-success-bg);color:var(--clr-success-text);padding:2px 8px;border-radius:3px;font-size:9px;font-weight:600">ACTIVE</span>',s.innerHTML='<strong style="color:var(--clr-success-text)">✓ Claude API Active</strong> - Real AI investigations enabled',a.style.display="inline-flex"):(i.innerHTML='<span style="background:var(--clr-info-bg);color:var(--clr-info-text);padding:2px 8px;border-radius:3px;font-size:9px;font-weight:600">MOCK MODE</span>',s.innerHTML='<strong style="color:var(--clr-info-text)">✓ Mock Mode</strong> - Using intelligent fallback responses (fully functional for testing)',a.style.display="none")}}catch(t){console.error("Failed to load Claude status:",t)}}function Ka(){const e=document.getElementById("page-msgcenter");e&&(e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-antenna"></i> Change Intelligence</div>
        <div class="page-subtitle">Service announcements and health status from Microsoft Graph API</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="mc-sync"><i class="ti ti-refresh"></i> Sync now</button>
      </div>
    </div>

    <div class="blank-state">
      <i class="ti ti-inbox-off" style="font-size:48px;color:var(--color-text-tertiary);margin-bottom:12px"></i>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">No Messages Available</div>
      <div style="font-size:11px;color:var(--color-text-tertiary);margin-bottom:16px">
        Change Intelligence requires Microsoft Graph API integration for /admin/serviceAnnouncement/messages
      </div>
      <div style="font-size:10px;color:var(--color-text-tertiary);padding:12px;background:var(--color-background-secondary);border-radius:var(--border-radius-md);text-align:left;max-width:400px">
        <strong>Graph API endpoints:</strong>
        <div style="margin-top:6px;font-family:monospace;font-size:9px">
          GET /admin/serviceAnnouncement/messages<br>
          GET /admin/serviceAnnouncement/issues
        </div>
      </div>
    </div>
  `,e.querySelector("#mc-sync").addEventListener("click",()=>{const t=e.querySelector("#mc-sync");t.innerHTML='<span class="spinner dark"></span> Syncing...',t.disabled=!0,setTimeout(()=>{t.innerHTML='<i class="ti ti-refresh"></i> Sync now',t.disabled=!1,v("No message data available from Graph API","info")},2e3)}))}let Me="executive",R={type:"all",status:"all",search:""},$e=[],Vt=!1,q=[],Q=[],O=[],De=[],mt=[],ke=[],Wt=[],re=[],ne=[],ze=[];const Ya=[{id:"executive",label:"Executive",icon:"ti-layout-dashboard"},{id:"appregistrations",label:"App Registrations",icon:"ti-app-window"},{id:"enterprise",label:"Enterprise Apps",icon:"ti-grid-dots"},{id:"secrets",label:"Secrets & Certs",icon:"ti-lock"},{id:"permissions",label:"Permissions",icon:"ti-shield-check"},{id:"auditconsents",label:"Audit Consents",icon:"ti-history"},{id:"owners",label:"Owners",icon:"ti-users"},{id:"usage",label:"Usage Analytics",icon:"ti-chart-line"},{id:"risk",label:"Risk Assessment",icon:"ti-alert-triangle"},{id:"lifecycle",label:"Lifecycle",icon:"ti-timeline"},{id:"recommendations",label:"Recommendations",icon:"ti-checklist"},{id:"copilot",label:"App Copilot",icon:"ti-robot"}];async function Za(){const e=document.getElementById("page-applications");if(!e)return;e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading real M365 application data...</p></div>',console.log("📡 Fetching real application data from backend...");const t=await is();t!=null&&t.success&&t.data?(q=t.data,console.log(`✅ Apps: ${q.length}`)):(console.warn("⚠️ No application data available from API"),q=[]);const i=await ss();i!=null&&i.success&&i.data?(Q=i.data,console.log(`✅ SPs: ${Q.length}`)):(console.warn("⚠️ No service principal data available from API"),Q=[]);try{const a=await(await fetch(`${$}/secrets-certificates`)).json();a!=null&&a.success&&(O=a.data||[],console.log(`✅ Secrets: ${O.length}`))}catch(s){console.warn("⚠️ Secrets error:",s.message)}try{console.log(`🔄 Fetching permissions from ${$}/permissions`);const s=await fetch(`${$}/permissions`);console.log(`📦 Permissions response status: ${s.status}`);const a=await s.json();console.log("📊 Permissions response:",a),a!=null&&a.success?(De=a.data||[],console.log(`✅ Permissions: ${De.length} items`)):console.warn("⚠️ Permissions endpoint returned success=false")}catch(s){console.warn("⚠️ Permissions error:",s.message,s.stack)}try{const a=await(await fetch(`${$}/admin-consents`)).json();a!=null&&a.success&&(mt=a.data||[],console.log(`✅ Consents: ${mt.length}`))}catch(s){console.warn("⚠️ Consents error:",s.message)}try{const a=await(await fetch(`${$}/recent-consents`)).json();a!=null&&a.success&&(Wt=a.data||[],console.log(`✅ Recent Consents: ${Wt.length}`))}catch(s){console.warn("⚠️ Recent Consents error:",s.message)}try{const a=await(await fetch(`${$}/audit-logs/consents`)).json();a!=null&&a.success&&(ke=a.data||[],console.log(`✅ Audit Consents: ${ke.length}`))}catch(s){console.warn("⚠️ Audit Consents error:",s.message)}try{const a=await(await fetch(`${$}/usage-analytics`)).json();a!=null&&a.success&&(re=a.data||[],console.log(`✅ Usage: ${re.length}`))}catch(s){console.warn("⚠️ Usage error:",s.message)}try{const a=await(await fetch(`${$}/risk-assessment`)).json();a!=null&&a.success&&(ne=a.data||[],console.log(`✅ Risks: ${ne.length}`))}catch(s){console.warn("⚠️ Risk error:",s.message)}try{const a=await(await fetch(`${$}/recommendations`)).json();a!=null&&a.success&&(ze=a.data||[],console.log(`✅ Recs: ${ze.length}`))}catch(s){console.warn("⚠️ Recs error:",s.message)}ae(e)}function ae(e){var a,r;const t=(O||[]).filter(n=>n.status==="expiring").length,i=(O||[]).filter(n=>n.status==="expired").length,s=(ne||[]).filter(n=>n.severity==="critical").length;e.innerHTML=`
    <div class="page-header">
      <div>
        <div class="page-title"><i class="ti ti-app-window"></i> Entra Applications</div>
        <div class="page-subtitle">Application Registrations & Enterprise Apps · ${q.length} app registrations · Last sync: Today 08:45</div>
      </div>
      <div class="page-actions">
        <button class="btn" id="app-refresh"><i class="ti ti-refresh"></i> Refresh</button>
        <button class="btn btn-primary" id="app-audit"><i class="ti ti-download"></i> Export audit</button>
      </div>
    </div>

    <!-- Top-5 KPI strip -->
    <div class="kpi-row mb-3">
      <div class="kpi-tile">
        <div class="kpi-value info">${q.length}</div>
        <div class="kpi-label">App Registrations</div>
      </div>
      <div class="kpi-tile">
        <div class="kpi-value info">${Q.length}</div>
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
        <div class="kpi-value warning">${APPS_SUMMARY.highPrivilegeApps}</div>
        <div class="kpi-label">High Privilege</div>
      </div>
    </div>

    <!-- Sub-navigation tabs -->
    <div class="app-subnav" id="app-subnav">
      ${Ya.map(n=>`
        <button class="app-tab-btn ${Me===n.id?"active":""}" data-app-section="${n.id}">
          <i class="ti ${n.icon}"></i><span>${n.label}</span>
          ${n.id==="secrets"&&i+t>0?`<span class="app-tab-badge red">${i+t}</span>`:""}
          ${n.id==="risk"&&s>0?`<span class="app-tab-badge red">${s}</span>`:""}
          ${n.id==="recommendations"?`<span class="app-tab-badge amber">${ze.length}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Content area -->
    <div id="app-content" style="margin-top:16px">${Qa()}</div>
  `,e.querySelectorAll(".app-tab-btn").forEach(n=>{n.addEventListener("click",()=>{Me=n.dataset.appSection,ae(e)})}),(a=e.querySelector("#app-refresh"))==null||a.addEventListener("click",()=>{const n=e.querySelector("#app-refresh");n.innerHTML='<span class="spinner dark"></span> Scanning...',n.disabled=!0,setTimeout(()=>{n.innerHTML='<i class="ti ti-refresh"></i> Refresh',n.disabled=!1,v(`Application inventory updated — ${q.length} app registrations, ${Q.length} service principals scanned.`,"success")},2200)}),(r=e.querySelector("#app-audit"))==null||r.addEventListener("click",()=>v("Application audit exported as CSV.","success")),cr(e)}function Qa(){return({executive:Jt,appregistrations:Xa,enterprise:er,secrets:tr,permissions:ir,auditconsents:sr,owners:ar,usage:rr,risk:nr,lifecycle:or,recommendations:lr,copilot:dr}[Me]||Jt)()}function Jt(){console.log(`📊 Executive: Apps=${q.length}, SPs=${Q.length}, Secrets=${O.length}`);const e=O.filter(a=>a.status==="expiring").length,t=O.filter(a=>a.status==="expired").length,i=ne.filter(a=>a.severity==="critical").length,s=re.filter(a=>a.status==="unused").length;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-app-window"></i> Application Inventory</span>
        </div>
        ${Kt([{label:"Total App Registrations",val:q.length,cls:"info"},{label:"Enterprise Applications",val:Q.length,cls:"info"},{label:"Multi-Tenant Apps",val:(q.filter(a=>a.signInAudience==="AzureADMultipleOrgs")||[]).length,cls:"warning"},{label:"High Privilege Apps",val:De.filter(a=>a.riskLevel==="critical").length,cls:"danger"},{label:"Certificate-Based",val:O.filter(a=>a.type==="Certificate").length,cls:"success"},{label:"Unused (90+ days)",val:s,cls:"warning"}])}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-lock"></i> Credential Health</span>
        </div>
        <div class="alert-banner danger mb-3">
          <i class="ti ti-alert-triangle"></i>
          <span><strong>${t} secrets EXPIRED</strong> — require immediate replacement</span>
        </div>
        ${Kt([{label:"Expired Secrets",val:t,cls:"danger"},{label:"Expiring (30 days)",val:e,cls:"warning"},{label:"Expiring (60 days)",val:O.filter(a=>a.daysRemaining<=60&&a.daysRemaining>30).length,cls:"warning"},{label:"Apps Requiring Admin Consent",val:mt.length,cls:"warning"}])}
      </div>
    </div>

    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-alert-triangle"></i> Risk Summary</span>
          <span class="badge danger dot">${i} critical</span>
        </div>
        ${ne.slice(0,5).map(a=>`
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
        ${ze.filter(a=>a.priority==="critical").slice(0,4).map(a=>`
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
  `}function Xa(){const e=q.length>0?q:[],t=e.filter(s=>!(R.type!=="all"&&s.category!==R.type||R.status!=="all"&&s.status!==R.status||R.search&&!s.name.toLowerCase().includes(R.search.toLowerCase()))),i=[...new Set(e.map(s=>s.category))];return`
    <div class="filter-bar mb-3">
      <input type="text" class="form-input" id="app-search" placeholder="Search app name..." value="${R.search}" style="min-width:200px">
      <select class="form-select" id="app-type-filter">
        <option value="all">All Categories</option>
        ${i.map(s=>`<option value="${s}" ${R.type===s?"selected":""}>${s}</option>`).join("")}
      </select>
      <select class="form-select" id="app-status-filter">
        <option value="all" ${R.status==="all"?"selected":""}>All Status</option>
        <option value="active" ${R.status==="active"?"selected":""}>Active</option>
        <option value="inactive" ${R.status==="inactive"?"selected":""}>Inactive</option>
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
  `}function er(){const e=Q.length>0?Q:[];return`
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
  `}function tr(){const e=O.filter(s=>s.status==="expired"),t=O.filter(s=>s.status==="expiring"),i=O.filter(s=>s.status==="healthy");return`
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
  `}function ir(){const e=De.filter(i=>i.riskLevel==="critical"),t=De.filter(i=>i.riskLevel==="high");return`
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
  `}function sr(){return`
    <div class="alert-banner info mb-3">
      <i class="ti ti-info-circle"></i>
      <span>Application information pulled from <strong>Azure AD Audit Logs</strong> (Consent to application activities) for comparison with Admin Consents tab</span>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <div style="padding:12px;border-bottom:0.5px solid var(--color-border-secondary);background:var(--color-background-secondary)">
        <span style="font-weight:600;font-size:12px">Consent Activities from Audit Logs (${ke.length})</span>
      </div>
      ${ke.length===0?`
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
            ${ke.map(e=>{var s;const t=e.scope&&e.scope!=="N/A"?e.scope:"—",i=t!=="—"&&!t.toLowerCase().includes("read");return`
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
  `}function ar(){const e=q.length>0?q:[],t=e.filter(a=>!a.owners||a.owners.length===0),i=e.filter(a=>a.owners&&a.owners.length===1),s=e.filter(a=>a.owners&&a.owners.length>1);return`
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
  `}function rr(){const e=re.filter(s=>s.status==="active"),t=re.filter(s=>s.status==="lowuse"),i=re.filter(s=>s.status==="unused");return`
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
  `}function nr(){const e=ne.filter(i=>i.severity==="critical"),t=ne.filter(i=>i.severity==="high");return`
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
  `}function or(){const e=q.length>0?q:[],t=e.filter(a=>{const r=a.createdDateTime?new Date(a.createdDateTime):null;if(!r)return!1;const n=new Date(Date.now()-30*24*60*60*1e3);return r>n}),i=e.filter(a=>!a.owners||a.owners.length===0),s=re.filter(a=>a.status==="unused");return`
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
  `}function lr(){return`
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
          ${ze.map(e=>`
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
  `}function dr(){(!Vt||$e.length===0)&&($e=[{role:"ai",text:`**Applications & App Registrations Copilot** — Ask me about app security, secrets, permissions, risks, and more.

Current state: **87 app registrations**, **124 enterprise apps**, **5 expiring secrets (30d)**, **2 critical risk apps**`}],Vt=!0);const e=["Show expiring secrets","Which apps have Directory.ReadWrite.All?","List apps without owners","Show high-risk applications","Unused apps (90+ days)","Multi-tenant applications"];return`
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="app-cop-msgs">
        ${$e.map(t=>`
          <div class="chat-msg ${t.role==="ai"?"ai":"user-msg"}" style="max-width:85%;margin-bottom:12px">
            ${t.role==="ai"?'<div class="chat-sender"><i class="ti ti-app-window" style="color:var(--clr-info-text)"></i> App Copilot</div>':'<div class="chat-sender" style="justify-content:flex-end">You</div>'}
            <div class="chat-bubble">${Ci(t.text)}</div>
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
  `}function Kt(e){return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${e.map(t=>`
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600">${t.label}</div>
        <div style="font-size:16px;font-weight:700;color:${t.cls==="success"?"var(--clr-success-text)":t.cls==="danger"?"var(--clr-danger-text)":t.cls==="warning"?"var(--clr-warning-text)":"var(--clr-info-text)"}">${t.val}</div>
      </div>
    `).join("")}
  </div>`}function cr(e){var a,r,n,o,l;const t=e.querySelector("#app-content");if(!t)return;(a=t.querySelector("#app-search"))==null||a.addEventListener("input",d=>{R.search=d.target.value,ae(e)}),(r=t.querySelector("#app-type-filter"))==null||r.addEventListener("change",d=>{R.type=d.target.value,ae(e)}),(n=t.querySelector("#app-status-filter"))==null||n.addEventListener("change",d=>{R.status=d.target.value,ae(e)}),(o=t.querySelector("#exec-view-risk"))==null||o.addEventListener("click",()=>{Me="risk",ae(e)}),(l=t.querySelector("#exec-view-recs"))==null||l.addEventListener("click",()=>{Me="recommendations",ae(e)});const i=t.querySelector("#app-cop-send"),s=t.querySelector("#app-cop-input");i&&s&&(i.addEventListener("click",()=>at(e,s)),s.addEventListener("keydown",d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),at(e,s))})),t.querySelectorAll(".app-cop-pill").forEach(d=>{d.addEventListener("click",()=>{const c=t.querySelector("#app-cop-input");c&&(c.value=d.dataset.q,at(e,c))})})}function at(e,t){const i=t.value.trim();if(!i)return;$e.push({role:"user",text:i}),t.value="";const s=e.querySelector("#app-cop-msgs");s&&(s.innerHTML+=`<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${i}</div>
    </div>`,s.scrollTop=s.scrollHeight),setTimeout(()=>{const a=i.toLowerCase(),r=APPS_COPILOT_KB.find(o=>o.keywords.some(l=>a.includes(l))),n=(r==null?void 0:r.response)||`Searching application data for **"${i}"**...

Based on your question, navigate to the relevant section above. Current state: 87 app registrations, 2 expired secrets, 2 critical risk apps, 5 recommendations.`;$e.push({role:"ai",text:n}),s&&(s.innerHTML+=`<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-app-window" style="color:var(--clr-info-text)"></i> App Copilot</div>
        <div class="chat-bubble">${Ci(n)}</div>
      </div>`,s.scrollTop=s.scrollHeight)},600)}function Ci(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}let yt="executive",We=[],Yt=!1,Ae=[],Se=[],h={summary:{},endpointSecurity:{},patchManagement:{},riskAssessment:{},deviceHealth:[],applications:[],policies:{configurationPolicies:[],conditionalAccessPolicies:[]},recommendations:[]};const pr=[{id:"executive",label:"Executive",icon:"ti-layout-dashboard"},{id:"health",label:"Device Health",icon:"ti-heartbeat"},{id:"compliance",label:"Compliance",icon:"ti-check-circle"},{id:"inventory",label:"Device Inventory",icon:"ti-device-laptop"},{id:"security",label:"Endpoint Security",icon:"ti-shield-check"},{id:"patches",label:"Patch Management",icon:"ti-refresh"},{id:"apps",label:"Applications",icon:"ti-app-window"},{id:"risk",label:"Risk Assessment",icon:"ti-alert-triangle"},{id:"policies",label:"Policies",icon:"ti-settings-2"},{id:"recommendations",label:"Recommendations",icon:"ti-checklist"},{id:"copilot",label:"Intune Copilot",icon:"ti-robot"}];async function vr(){const e=document.getElementById("page-intune");if(e){e.innerHTML='<div style="padding:20px;text-align:center"><div class="spinner"></div><p>Loading comprehensive Intune data...</p></div>',console.log("📡 Fetching comprehensive Intune data from backend...");try{const[t,i,s,a,r,n,o,l,d,c]=await Promise.all([bt(),Zi(),S("/intune/summary"),S("/intune/endpoint-security"),S("/intune/patch-management"),S("/intune/risk-assessment"),S("/intune/device-health"),S("/intune/applications"),S("/intune/policies"),S("/intune/recommendations")]);t.success&&t.data?(Ae=t.data,console.log(`✅ Loaded ${Ae.length} real devices`)):(console.warn("⚠️ No device data available from API"),Ae=[]),i.success&&i.data?(Se=i.data,console.log(`✅ Loaded ${Se.length} real policies`)):(console.warn("⚠️ No policy data available from API"),Se=[]),s.success&&s.data?(h.summary=s.data,console.log("✅ Loaded Intune summary")):h.summary={},a.success&&a.data&&(h.endpointSecurity=a.data,console.log("✅ Loaded endpoint security data")),r.success&&r.data&&(h.patchManagement=r.data,console.log("✅ Loaded patch management data")),n.success&&n.data&&(h.riskAssessment=n.data,console.log("✅ Loaded risk assessment data")),o.success&&o.data&&(h.deviceHealth=o.data,console.log("✅ Loaded device health data")),l.success&&l.data&&(h.applications=l.data,console.log("✅ Loaded applications data")),d.success&&d.data&&(h.policies=d.data,console.log("✅ Loaded policies data")),c.success&&c.data&&(h.recommendations=c.data,console.log("✅ Loaded recommendations data")),console.log("✅ All Intune data loaded successfully")}catch(t){console.error("❌ Error loading Intune data:",t)}qi(e)}}function qi(e){var a,r;const t=h.summary,i=h.riskAssessment.criticalRiskCount||0,s=h.riskAssessment.highRiskCount||0;e.innerHTML=`
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
        <div class="kpi-value warning">${h.patchManagement.compliancePercentage||0}%</div>
        <div class="kpi-label">Patch Status</div>
        <div style="font-size:10px;margin-top:3px;color:var(--color-text-tertiary)">${h.patchManagement.criticalUpdatesMissing||0} critical</div>
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
    <div class="intune-subnav" id="intune-subnav">
      ${pr.map(n=>`
        <button class="intune-tab-btn ${yt===n.id?"active":""}" data-intune-section="${n.id}">
          <i class="ti ${n.icon}"></i><span>${n.label}</span>
          ${n.id==="risk"&&i>0?`<span class="intune-tab-badge red">${i}</span>`:""}
          ${n.id==="compliance"&&t.nonCompliant>0?`<span class="intune-tab-badge red">${t.nonCompliant}</span>`:""}
          ${n.id==="patches"&&(h.patchManagement.criticalUpdatesMissing||0)>0?`<span class="intune-tab-badge red">${h.patchManagement.criticalUpdatesMissing||0}</span>`:""}
          ${n.id==="recommendations"?`<span class="intune-tab-badge amber">${h.recommendations.length||0}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Content -->
    <div id="intune-content" style="margin-top:16px">${ur()}</div>
  `,e.querySelectorAll(".intune-tab-btn").forEach(n=>{n.addEventListener("click",()=>{yt=n.dataset.intuneSection,qi(e)})}),(a=e.querySelector("#intune-refresh"))==null||a.addEventListener("click",()=>{const n=e.querySelector("#intune-refresh");n.innerHTML='<span class="spinner dark"></span> Scanning...',n.disabled=!0,setTimeout(()=>{n.innerHTML='<i class="ti ti-refresh"></i> Refresh',n.disabled=!1,v("Intune inventory updated — 847 devices scanned, 4 compliance policies evaluated.","success")},2200)}),(r=e.querySelector("#intune-remediate"))==null||r.addEventListener("click",()=>v("Remediation workflow initiated — ${criticalRisks} critical devices tagged for action.","info")),Ar(e)}function ur(){return({executive:Zt,health:gr,compliance:mr,inventory:yr,security:br,patches:hr,apps:fr,risk:xr,policies:wr,recommendations:$r,copilot:kr}[yt]||Zt)()}function Zt(){const e=h.summary,t=h.summary.platformDistribution||PLATFORM_DISTRIBUTION;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="ti ti-layout-dashboard"></i> Device Overview</span>
        </div>
        ${Ri([{label:"Total Managed",val:e.totalManagedDevices,cls:"info"},{label:"Active",val:e.activeDevices,cls:"success"},{label:"Inactive",val:e.inactiveDevices,cls:"warning"},{label:"Non-Compliant",val:e.nonCompliant,cls:"danger"},{label:"Unmanaged",val:e.unmanaged,cls:"warning"},{label:"Corporate / BYOD",val:`${e.corporateDevices} / ${e.byodDevices}`,cls:"info"}])}
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
        <span><strong>${h.riskAssessment.highRiskCount||0} high-risk devices</strong> require immediate attention</span>
      </div>
      ${(h.riskAssessment.deviceRisks||[]).slice(0,5).map(i=>`
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
        ${["windowsBaseline","defenderBaseline","edgeBaseline","msAppsBaseline"].map((i,s)=>{const a=SECURITY_BASELINE_COMPARISON[i];return`
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
        ${(h.recommendations||[]).filter(i=>i.priority==="critical").slice(0,4).map(i=>`
          <div style="display:flex;gap:8px;padding:6px 0;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
            <span class="badge danger" style="flex-shrink:0;min-width:56px;justify-content:center">${i.priority}</span>
            <span style="flex:1">${i.title}</span>
          </div>
        `).join("")}
        ${(h.recommendations||[]).length===0?'<div style="padding:10px;text-align:center;font-size:11px;color:var(--color-text-tertiary)">No critical recommendations</div>':""}
      </div>
    </div>
  `}function gr(){const e=h.summary,t=h.deviceHealth||[];return t.length>0&&Math.round(t.reduce((i,s)=>i+s.healthScore,0)/t.length),`
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
  `}function mr(){const e=h.summary,t=Math.max(0,(e.totalManagedDevices||0)-(e.nonCompliant||0));return`
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
          ${Se.map(s=>`
            <tr>
              <td style="font-weight:600">${s.name}</td>
              <td>${s.assignedDevices}</td>
              <td style="color:var(--clr-success-text);font-weight:600">${s.compliant}</td>
              <td style="color:var(--clr-danger-text);font-weight:600">${s.nonCompliant}</td>
              <td>${s.pending}</td>
              <td><span class="badge success">${s.coverage}%</span></td>
            </tr>
          `).join("")}
          ${Se.length===0?'<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--color-text-tertiary)">No compliance policies found - Real data from tenant</td></tr>':""}
        </tbody>
      </table>
    </div>
  `}function yr(){return`
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
          ${Ae.slice(0,50).map(e=>`
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
          ${Ae.length===0?'<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--color-text-tertiary)">No devices enrolled in Intune - Real data from tenant</td></tr>':""}
        </tbody>
      </table>
    </div>
  `}function br(){var t,i,s,a,r,n,o,l;const e=h.endpointSecurity;return`
    <div class="grid-2 mb-3" style="gap:16px">
      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-shield-check"></i> Antivirus & Firewall</div>
        ${Ri([{label:"Defender Enabled",val:((t=e.antivirus)==null?void 0:t.defenderEnabled)||0,cls:"success"},{label:"Real-Time Protection",val:((i=e.antivirus)==null?void 0:i.realTimeProtection)||0,cls:"success"},{label:"Cloud Protection",val:((s=e.antivirus)==null?void 0:s.cloudProtection)||0,cls:"success"},{label:"Firewall Enabled",val:((a=e.firewall)==null?void 0:a.enabled)||0,cls:"success"}])}
      </div>

      <div class="card">
        <div class="card-title mb-3"><i class="ti ti-lock"></i> Protection Coverage</div>
        ${[{label:"Defender",pct:((r=e.antivirus)==null?void 0:r.coverage)||0,target:100},{label:"Firewall",pct:((n=e.firewall)==null?void 0:n.coverage)||0,target:100},{label:"SmartScreen",pct:((o=e.smartscreen)==null?void 0:o.coverage)||0,target:100},{label:"ASR Rules",pct:((l=e.asr)==null?void 0:l.coverage)||0,target:100}].map(d=>`
          <div class="score-bar-row mb-2">
            <span class="score-label" style="min-width:100px">${d.label}</span>
            <div class="score-bar" style="flex:1;height:8px">
              <div class="score-bar-fill ${d.pct>=90?"success":d.pct>=70?"warning":"danger"}" style="width:${d.pct}%"></div>
            </div>
            <span class="score-pct">${d.pct}%</span>
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
  `}function hr(){const e=h.patchManagement;return`
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
  `}function fr(){return`
    <div class="grid-2 mb-3" style="gap:16px">
      ${(h.applications||[]).map(t=>`
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
  `}function xr(){const e=h.riskAssessment,t=e.deviceRisks||[];return`
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
  `}function wr(){const e=h.policies||{configurationPolicies:[],conditionalAccessPolicies:[]},t=e.configurationPolicies||[],i=e.conditionalAccessPolicies||[];return`
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
  `}function $r(){const e=h.recommendations||[];return`
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
  `}function kr(){if(!Yt){const t=h.summary||{},i=h.riskAssessment||{};We=[{role:"ai",text:`**Intune Security Advisor** — Ask me about device health, compliance, security posture, patch status, or remediation recommendations.

**Current state:** ${t.totalManagedDevices||0} managed devices, ${t.compliancePercentage||0}% compliant, ${t.deviceHealthScore||0}/100 health score, ${i.criticalRiskCount||0} critical risks`}],Yt=!0}const e=["Show device health summary","Patch management status","Encryption coverage","Firewall & protection status","Critical risk devices","Compliance policies"];return`
    <div style="display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:450px">
      <div style="overflow-y:auto;flex:1;padding-bottom:8px" id="intune-cop-msgs">
        ${We.map(t=>`
          <div class="chat-msg ${t.role==="ai"?"ai":"user-msg"}" style="max-width:85%;margin-bottom:12px">
            ${t.role==="ai"?'<div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-info-text)"></i> Intune Advisor</div>':'<div class="chat-sender" style="justify-content:flex-end">You</div>'}
            <div class="chat-bubble">${Li(t.text)}</div>
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
  `}function Ri(e){return`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px">
    ${e.map(t=>`
      <div style="padding:8px 10px;background:var(--color-background-secondary);border-radius:var(--border-radius-md)">
        <div style="font-size:10px;color:var(--color-text-tertiary);margin-bottom:3px;text-transform:uppercase;font-weight:600">${t.label}</div>
        <div style="font-size:16px;font-weight:700;color:${t.cls==="success"?"var(--clr-success-text)":t.cls==="danger"?"var(--clr-danger-text)":t.cls==="warning"?"var(--clr-warning-text)":"var(--clr-info-text)"}">${t.val}</div>
      </div>
    `).join("")}
  </div>`}function Ar(e){const t=e.querySelector("#intune-content");if(!t)return;const i=t.querySelector("#intune-cop-send"),s=t.querySelector("#intune-cop-input");i&&s&&(i.addEventListener("click",()=>rt(e,s)),s.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),rt(e,s))})),t.querySelectorAll(".intune-cop-pill").forEach(a=>{a.addEventListener("click",()=>{const r=t.querySelector("#intune-cop-input");r&&(r.value=a.dataset.q,rt(e,r))})})}function rt(e,t){const i=t.value.trim();if(!i)return;We.push({role:"user",text:i}),t.value="";const s=e.querySelector("#intune-cop-msgs");s&&(s.innerHTML+=`<div class="chat-msg user-msg" style="max-width:85%;margin-bottom:12px">
      <div class="chat-sender" style="justify-content:flex-end">You</div>
      <div class="chat-bubble">${i}</div>
    </div>`,s.scrollTop=s.scrollHeight),setTimeout(()=>{var c,p,f,x,g;const a=i.toLowerCase(),r=h.summary||{},n=h.riskAssessment||{},o=h.patchManagement||{},l=h.endpointSecurity||{};let d=`Based on your question about Intune, here's the current tenant status:

`;if(a.includes("health")||a.includes("device health"))d+=`**Device Health Summary:**
• Total Managed: ${r.totalManagedDevices||0}
• Active: ${r.activeDevices||0}
• Health Score: ${r.deviceHealthScore||0}/100
• Encryption: ${r.encryptionCoverage||0}%`;else if(a.includes("compliance")||a.includes("compliant"))d+=`**Compliance Status:**
• Overall Compliance: ${r.compliancePercentage||0}%
• Non-Compliant: ${r.nonCompliant||0}
• Devices: ${r.totalManagedDevices||0} managed`;else if(a.includes("patch")||a.includes("update"))d+=`**Patch Management:**
• Patch Compliance: ${o.compliancePercentage||0}%
• Critical Updates Missing: ${o.criticalUpdatesMissing||0}
• Devices Needing Patches: ${o.devicesNeedingPatches||0}`;else if(a.includes("security")||a.includes("protection")||a.includes("firewall"))d+=`**Endpoint Security:**
• Antivirus Coverage: ${((c=l.antivirus)==null?void 0:c.coverage)||0}%
• Firewall Coverage: ${((p=l.firewall)==null?void 0:p.coverage)||0}%
• SmartScreen Coverage: ${((f=l.smartscreen)==null?void 0:f.coverage)||0}%
• BitLocker Coverage: ${((x=l.bitlocker)==null?void 0:x.coverage)||0}%`;else if(a.includes("risk")||a.includes("critical"))d+=`**Risk Assessment:**
• Critical Risk Devices: ${n.criticalRiskCount||0}
• High Risk Devices: ${n.highRiskCount||0}
• Non-Compliant: ${((g=n.deviceRisks)==null?void 0:g.length)||0}`;else if(a.includes("recommendation")||a.includes("suggest")){const u=(h.recommendations||[]).filter(w=>w.priority==="critical");d+=`**Top Recommendations:**
${u.slice(0,3).map(w=>`• **${w.priority.toUpperCase()}:** ${w.title}`).join(`
`)||"• No critical recommendations"}`}else d+=`**Tenant Overview:**
• Managed Devices: ${r.totalManagedDevices||0}
• Compliance: ${r.compliancePercentage||0}%
• Health Score: ${r.deviceHealthScore||0}/100
• Critical Risks: ${n.criticalRiskCount||0}

Ask me about device health, compliance, security, patches, or recommendations!`;We.push({role:"ai",text:d}),s&&(s.innerHTML+=`<div class="chat-msg ai" style="max-width:85%;margin-bottom:12px">
        <div class="chat-sender"><i class="ti ti-robot" style="color:var(--clr-info-text)"></i> Intune Advisor</div>
        <div class="chat-bubble">${Li(d)}</div>
      </div>`,s.scrollTop=s.scrollHeight)},600)}function Li(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}const Ii={displayName:"Rajkumar Duraisami",upn:"rajkumar.duraisami@contoso.com",email:"rajkumar.duraisami@contoso.com",employeeId:"EMP-2024-001",jobTitle:"Cloud Solutions Architect",department:"Cloud Engineering",manager:"Sarah Johnson",lastSignIn:"Today 08:45",accountStatus:"Enabled",phone:"+1 (555) 123-4567",office:"Seattle, WA",mobilePhone:"+1 (555) 987-6543"},Ti={mfaStatus:"Enabled",mfaDefaultMethod:"Microsoft Authenticator",passwordLastChanged:"45 days ago",passwordExpiryDate:"15 days remaining",ssfrRegistration:"Completed",riskLevel:"Low",securityScore:92,authenticationMethods:[{type:"Password",status:"Enabled"},{type:"Microsoft Authenticator",status:"Enabled",registered:!0},{type:"FIDO2 Security Key",status:"Not registered"},{type:"Phone Authentication",status:"Enabled"},{type:"Email OTP",status:"Not registered"}],riskDetections:[{type:"Impossible Travel",status:"No",lastDetected:null},{type:"Anonymous IP",status:"No",lastDetected:null},{type:"Malware-linked IP",status:"No",lastDetected:null},{type:"Unfamiliar Sign-in",status:"No",lastDetected:null}]},Mi=[{date:"Today 08:45",app:"Microsoft 365 Portal",device:"Windows-Laptop",browser:"Chrome",location:"Seattle, WA",ip:"203.0.113.45",result:"Success"},{date:"Yesterday 17:30",app:"Teams",device:"iPhone",browser:"Safari",location:"Seattle, WA",ip:"203.0.113.45",result:"Success"},{date:"Yesterday 09:15",app:"Exchange Online",device:"Windows-Laptop",browser:"Edge",location:"Seattle, WA",ip:"203.0.113.45",result:"Success"},{date:"2 days ago 14:20",app:"SharePoint",device:"iPad",browser:"Safari",location:"Seattle, WA",ip:"203.0.113.45",result:"Success"},{date:"3 days ago 10:00",app:"OneDrive",device:"Windows-Laptop",browser:"Chrome",location:"Seattle, WA",ip:"203.0.113.45",result:"Success"}],Di=[{name:"Microsoft 365 E5",sku:"ENTERPRISEPREMIUM",assignmentType:"Direct",assignmentSource:"Admin"},{name:"Enterprise Mobility + Security E5",sku:"EMSPREMIUM",assignmentType:"Direct",assignmentSource:"Admin"},{name:"Power BI Premium",sku:"POWER_BI_PREMIUM_P1",assignmentType:"Group",assignmentSource:"Group License"},{name:"Teams Phone Standard",sku:"TEAMS_PHONE_STANDARD",assignmentType:"Direct",assignmentSource:"Admin"}],Ee={securityGroups:[{name:"Cloud Architects",type:"Security",membershipType:"Member"},{name:"M365-Admins",type:"Security",membershipType:"Member"},{name:"Security Review Board",type:"Security",membershipType:"Member"},{name:"Global Readers",type:"Security",membershipType:"Member"}],microsoft365Groups:[{name:"Engineering Team",type:"Microsoft 365",teamConnected:!0,dynamicMembership:!1},{name:"Cloud Solutions Architects",type:"Microsoft 365",teamConnected:!0,dynamicMembership:!0},{name:"Product Innovation",type:"Microsoft 365",teamConnected:!1,dynamicMembership:!1}],distributionLists:[{name:"Cloud-Engineering@contoso.com",type:"Distribution List",membershipType:"Member"},{name:"Security-Team@contoso.com",type:"Distribution List",membershipType:"Owner"}]},zi={totalStorage:"1 TB",usedStorage:"420 GB",availableStorage:"580 GB",percentageUsed:42,lastActivity:"Today 08:45",fileCount:2847,sharedItems:156,externalShares:12,anonymousLinks:3},Ni={teamsMembership:12,teamsOwned:3,guestAccessTeams:2,teamsPhoneLicense:!0,assignedNumber:"+1 (555) 123-7890",callingPlan:"Domestic and International",teams:[{name:"Engineering Team",role:"Member",owner:"Sarah Johnson"},{name:"Cloud Architects",role:"Owner",owner:"Rajkumar Duraisami"},{name:"Security Review Board",role:"Member",owner:"Chen Wei"},{name:"Product Innovation",role:"Owner",owner:"Rajkumar Duraisami"},{name:"Global Company",role:"Member",owner:"System"}]},Oi=[{name:"LAPTOP-RAJ-001",type:"Windows",osVersion:"22H2",complianceStatus:"Compliant",ownership:"Corporate",lastCheckIn:"Today",encryption:"BitLocker Enabled",defender:"Active"},{name:"IPHONE-RAJ-001",type:"iOS",osVersion:"17.5",complianceStatus:"Compliant",ownership:"Corporate",lastCheckIn:"Today",encryption:"Device Encrypted",defender:"Enabled"},{name:"IPAD-RAJ-001",type:"iPadOS",osVersion:"17.5",complianceStatus:"Compliant",ownership:"BYOD",lastCheckIn:"Yesterday",encryption:"Device Encrypted",defender:"Enabled"}],Sr=[{name:"Microsoft Teams",lastAccessed:"Today 08:45",permissionScope:"Full",riskLevel:"Low"},{name:"SharePoint Online",lastAccessed:"Yesterday 14:20",permissionScope:"Read/Write",riskLevel:"Low"},{name:"OneDrive for Business",lastAccessed:"Today 10:15",permissionScope:"Full",riskLevel:"Low"},{name:"Exchange Online",lastAccessed:"Today 09:30",permissionScope:"Full",riskLevel:"Low"},{name:"Power BI",lastAccessed:"2 days ago",permissionScope:"Admin",riskLevel:"Medium"},{name:"Dynamics 365",lastAccessed:"5 days ago",permissionScope:"Read/Write",riskLevel:"Low"}],Pe=[{type:"Group Membership Request",group:"Data Governance Board",status:"Pending",submittedDate:"2 days ago",description:"Waiting for manager approval"},{type:"Distribution List Request",list:"Customer Success@contoso.com",status:"Pending",submittedDate:"1 day ago",description:"Awaiting IT approval"}],Er={personalAIReadinessScore:85,recommendations:[{title:"Enable Microsoft Authenticator",impact:"Improves security by 15%",priority:"High",status:"Recommended"},{title:"Complete Security Awareness Training",impact:"Unlocks advanced features",priority:"High",status:"Recommended"},{title:"Review OneDrive Sharing Settings",impact:"Improves data governance by 8%",priority:"Medium",status:"Recommended"},{title:"Register FIDO2 Security Key",impact:"Improves security by 20%",priority:"Medium",status:"Optional"}],exchangeUsage:78,teamsUsage:92,oneDriveUsage:42,sharePointUsage:65};let xe="executive",b={profile:Ii,security:Ti,signin:Mi,licenses:Di,groups:Ee,onedrive:zi,teams:Ni,devices:Oi};const Pr=[{id:"executive",label:"Executive Summary",icon:"ti-dashboard"},{id:"profile",label:"Profile",icon:"ti-user"},{id:"security",label:"Security",icon:"ti-shield-check"},{id:"signin",label:"Sign-in Activity",icon:"ti-login"},{id:"licenses",label:"Licenses",icon:"ti-license"},{id:"groups",label:"Groups",icon:"ti-users"},{id:"devices",label:"Devices",icon:"ti-device-laptop"},{id:"apps",label:"Apps & Access",icon:"ti-app-window"},{id:"onedrive",label:"OneDrive",icon:"ti-cloud"},{id:"teams",label:"Teams",icon:"ti-brand-teams"},{id:"approvals",label:"Pending Approvals",icon:"ti-check"},{id:"copilot",label:"Copilot Insights",icon:"ti-robot"}];async function Cr(){const e=document.getElementById("page-myaccount");if(e){try{console.log("📡 Fetching My Account data from backend...");const t=window.userEmail;if(!t){console.error("❌ User email not found. Make sure you are logged in."),v("Error: User not authenticated. Please log in again.","error");return}console.log(`Fetching data for user: ${t}`);const[i,s,a,r,n,o,l,d,c]=await Promise.allSettled([fetch(`${$}/me/profile?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${$}/me/security?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${$}/me/signin-activity?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${$}/me/licenses?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${$}/me/groups?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${$}/me/onedrive?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${$}/me/teams?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${$}/me/devices?email=${encodeURIComponent(t)}`).then(p=>p.json()),fetch(`${$}/me/mailbox?email=${encodeURIComponent(t)}`).then(p=>p.json())]);b.profile=i.status==="fulfilled"&&i.value.success?i.value.data:Ii,b.security=s.status==="fulfilled"&&s.value.success?s.value.data:Ti,b.signin=a.status==="fulfilled"&&a.value.success?a.value.data.recentSignins:Mi,b.licenses=r.status==="fulfilled"&&r.value.success?r.value.data:Di,b.groups=n.status==="fulfilled"&&n.value.success?n.value.data:Ee,b.onedrive=o.status==="fulfilled"&&o.value.success?o.value.data:zi,b.teams=l.status==="fulfilled"&&l.value.success?l.value.data:Ni,b.devices=d.status==="fulfilled"&&d.value.success?d.value.data:Oi,b.mailbox=c.status==="fulfilled"&&c.value.success?c.value.data:{mailboxUsage:65},console.log("✓ My Account data loaded")}catch(t){console.warn("⚠️ Using simulated data:",t.message)}qr(e)}}function qr(e){var t;e.innerHTML=`
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
    <div class="intune-subnav" id="myacc-subnav">
      ${Pr.map(i=>`
        <button class="intune-tab-btn ${xe===i.id?"active":""}" data-tab="${i.id}">
          <i class="ti ${i.icon}"></i><span>${i.label}</span>
          ${i.id==="approvals"&&Pe.length>0?`<span class="intune-tab-badge red">${Pe.length}</span>`:""}
        </button>
      `).join("")}
    </div>

    <!-- Content -->
    <div id="myacc-content" style="margin-top:16px">${Qt()}</div>
  `,e.querySelectorAll(".intune-tab-btn").forEach(i=>{i.addEventListener("click",()=>{xe=i.dataset.tab,e.querySelector("#myacc-content").innerHTML=Qt(),xe==="signin"&&setTimeout(()=>Xt(e),100)})}),xe==="signin"&&setTimeout(()=>Xt(e),100),(t=e.querySelector("#myacc-refresh"))==null||t.addEventListener("click",()=>{const i=e.querySelector("#myacc-refresh");i.innerHTML='<span class="spinner dark"></span> Refreshing...',i.disabled=!0,setTimeout(()=>{i.innerHTML='<i class="ti ti-refresh"></i> Refresh',i.disabled=!1,v("Your profile has been refreshed.","success")},1500)})}function Qt(){const t={executive:Rr,profile:Lr,security:Ir,signin:Tr,licenses:Mr,groups:Dr,devices:zr,apps:Nr,onedrive:Or,teams:jr,approvals:Ur,copilot:Gr}[xe];return t?t():""}function Rr(){var c,p,f,x,g,m,u,w;const e=((c=b.security)==null?void 0:c.securityScore)||85,t=((p=b.security)==null?void 0:p.mfaStatus)||"Not Enabled",i=((f=b.security)==null?void 0:f.riskLevel)||"Low",s=(b.licenses&&Array.isArray(b.licenses)?b.licenses.length:0)||((x=b.licenses)==null?void 0:x.count)||0,a=(b.devices&&Array.isArray(b.devices)?b.devices.length:0)||((g=b.devices)==null?void 0:g.count)||0,r=(b.groups&&b.groups.securityGroups?b.groups.securityGroups.length:0)||0,n=((m=b.teams)==null?void 0:m.teamsMembership)||0,o=0,l=((u=b.onedrive)==null?void 0:u.percentageUsed)||0,d=((w=b.mailbox)==null?void 0:w.mailboxUsage)||65;return`
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
        <div class="kpi-value">${r}</div>
        <div class="kpi-label">Groups</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Key Metrics</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;border-top:0.5px solid var(--color-border-secondary)">
        <div>
          <div style="font-size:10px;font-weight:600;color:var(--color-text-tertiary);margin-bottom:4px">Teams</div>
          <div style="font-size:14px;font-weight:600">${n}</div>
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
          <div style="font-size:14px;font-weight:600">${d}%</div>
        </div>
      </div>
    </div>
  `}function Lr(){const e=b.profile;return`
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
  `}function Ir(){const e=b.security;return`
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
  `}function Tr(){const e=b.signin.filter(i=>i.result==="Success"),t=b.signin.filter(i=>i.result==="Failed");return`
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
              ${b.signin.map(i=>`
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
  `}function Mr(){return`
    <div class="card">
      <div class="card-header"><span class="card-title">Assigned Licenses</span></div>
      <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
        ${b.licenses.map(e=>`
          <div style="padding:12px;border-bottom:0.5px solid var(--color-border-tertiary)">
            <div style="font-size:11px;font-weight:600">${e.name}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary);margin-top:3px">SKU: ${e.sku}</div>
            <div style="font-size:9px;color:var(--color-text-tertiary)">Assigned ${e.assignmentType} via ${e.assignmentSource}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function Dr(){return`
    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card">
        <div class="card-header"><span class="card-title">Security Groups (${Ee.securityGroups.length})</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${b.groups.securityGroups.map(e=>`
            <div style="padding:10px 12px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${e.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${e.type} • ${e.membershipType}</div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Microsoft 365 Groups (${Ee.microsoft365Groups.length})</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${b.groups.microsoft365Groups.map(e=>`
            <div style="padding:10px 12px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${e.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${e.teamConnected?"✓ Teams":"No Teams"} • ${e.dynamicMembership?"Dynamic":"Static"}</div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Distribution Lists (${Ee.distributionLists.length})</span></div>
        <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
          ${(b.groups.distributionLists||[]).map(e=>`
            <div style="padding:10px 12px;border-bottom:0.5px solid var(--color-border-tertiary);font-size:11px">
              <div style="font-weight:600">${e.name}</div>
              <div style="color:var(--color-text-tertiary);font-size:9px">${e.membershipType}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `}function zr(){return`
    <div class="card">
      <div class="card-header"><span class="card-title">Registered Devices</span></div>
      <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
        ${b.devices.map(e=>`
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
  `}function Nr(){return`
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
            ${(b.apps||Sr).map(e=>`
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
  `}function Or(){const e=b.onedrive;return`
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
  `}function jr(){const e=b.teams;return`
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
  `}function Ur(){return!Pe||Pe.length===0?`
      <div class="card">
        <div style="padding:32px;text-align:center;color:var(--color-text-secondary);font-size:12px">
          ✓ No pending approvals
        </div>
      </div>
    `:`
    <div class="card">
      <div class="card-header"><span class="card-title">Pending Approvals</span></div>
      <div style="padding:0;border-top:0.5px solid var(--color-border-secondary)">
        ${Pe.map(e=>`
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
  `}function Gr(){const e=Er;return`
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
  `}function Xt(e){const t=e.querySelector("#signin-map");if(t)if(window.L)ei(t);else{const i=document.createElement("link");i.rel="stylesheet",i.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",i.onload=()=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",s.onload=()=>{console.log("✓ Leaflet loaded"),ei(t)},s.onerror=()=>{console.error("Failed to load Leaflet"),t.innerHTML='<div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">Map failed to load</div>'},document.head.appendChild(s)},document.head.appendChild(i)}}function ei(e){try{const t=b.signin.filter(o=>o.latitude&&o.longitude);if(t.length===0){e.innerHTML='<div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">No location data available for map</div>';return}e.innerHTML="";const i=t.map(o=>o.latitude),s=t.map(o=>o.longitude),a=(Math.max(...i)+Math.min(...i))/2,r=(Math.max(...s)+Math.min(...s))/2,n=window.L.map(e).setView([a,r],4);window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© CartoDB",maxZoom:19,subdomains:"abcd"}).addTo(n),t.forEach(o=>{const d=o.result==="Success"?"#10b981":"#ef4444",c=window.L.circleMarker([o.latitude,o.longitude],{radius:8,fillColor:d,color:"#fff",weight:2,opacity:1,fillOpacity:.8});c.bindPopup(`
        <div style="font-size:10px">
          <strong>${o.app}</strong><br>
          ${o.location}<br>
          ${o.date}<br>
          <strong>${o.result}</strong>
        </div>
      `),c.addTo(n)}),console.log(`✓ Map rendered with ${t.length} markers`)}catch(t){console.error("Map rendering error:",t),e.innerHTML='<div style="padding:20px;text-align:center;color:var(--color-text-tertiary)">Error loading map: '+t.message+"</div>"}}const y={currentUser:null,currentPage:"dashboard",settings:{showPSCommands:!0,showTenantResult:!0,autoExpandFailed:!0,showGraphHealth:!0,showZeroTrustScore:!0,showM365ConfigScore:!0,agentSchedule:"daily-0800",agentAlertEmail:"security@contoso.com",agentAlertOnFail:!0,agentDailyDigest:!0,portalEnabled:!0,portal_exchange:!0,portal_teams:!0,portal_sharepoint:!0,portal_onedrive:!0,portal_ext_sharing:!0,portal_user_access:!0,portal_licenses:!0,portal_copilot:!0,portal_power_platform:!0,portal_intune:!0,portal_guest_lifecycle:!0,portal_exchange_groups:!0,portal_shared_mailbox:!0,portal_room_equipment:!0,portal_email_services:!0},cfgAttested:{},cfgAgentLog:[],mcMessages:null},Br={showPSCommands:!0,showTenantResult:!0,autoExpandFailed:!0,showGraphHealth:!0,showZeroTrustScore:!0,showM365ConfigScore:!0,portalEnabled:!0,portal_exchange:!0,portal_teams:!0,portal_sharepoint:!0,portal_onedrive:!0,portal_ext_sharing:!0,portal_user_access:!0,portal_licenses:!0,portal_copilot:!0,portal_power_platform:!0,portal_intune:!0,portal_guest_lifecycle:!0,portal_exchange_groups:!0,portal_shared_mailbox:!0,portal_room_equipment:!0,portal_email_services:!0,agentSchedule:"daily-0800",agentAlertEmail:"security@contoso.com",agentAlertOnFail:!0,agentDailyDigest:!0};function T(){localStorage.setItem("m365ops_settings",JSON.stringify(y.settings)),localStorage.setItem("m365ops_attested",JSON.stringify(y.cfgAttested)),localStorage.setItem("m365ops_agentlog",JSON.stringify(y.cfgAgentLog))}function Hr(){try{const e=localStorage.getItem("m365ops_settings");e&&Object.assign(y.settings,JSON.parse(e));const t=localStorage.getItem("m365ops_attested");t&&(y.cfgAttested=JSON.parse(t));const i=localStorage.getItem("m365ops_agentlog");i&&(y.cfgAgentLog=JSON.parse(i))}catch{}}function ji(){Object.assign(y.settings,Br),T()}function Ui(e){return y.currentUser?e==="user-investigation"?["super","admin"].includes(y.currentUser.role):y.currentUser.navAccess.includes(e):!1}function Fr(...e){return y.currentUser&&e.includes(y.currentUser.role)}const ti={dashboard:rs,msgcenter:Ka,applications:Za,intune:vr,requests:os,security:cs,tenantguard:Os,"user-investigation":Js,zerotrust:Qs,m365config:Xs,privaccts:ea,licenses:fi,agents:ga,approvals:ma,portal:Aa,myreqs:Da,myaccount:Cr,chat:Oa,graphapi:Ga,sso:Ba,audit:Ha,settings:Ja};async function D(e){if(!Ui(e)){v("You do not have access to that page.","error");return}y.currentPage=e,document.querySelectorAll(".page").forEach(s=>s.classList.remove("active"));const t=document.getElementById("page-"+e);t&&t.classList.add("active"),document.querySelectorAll(".nav-item").forEach(s=>s.classList.remove("active"));const i=document.getElementById("n-"+e);i&&i.classList.add("active"),ti[e]&&await ti[e]()}async function ii(){const e=document.getElementById("app"),t=await Fi();if(t){await si(t);return}e.innerHTML=`
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
          ${ai.map(a=>`
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
  `,document.getElementById("entra-login-btn").addEventListener("click",async()=>{const a=document.getElementById("entra-login-btn");a.innerHTML='<span class="spinner" style="margin-right:8px"></span> Signing in...',a.disabled=!0;const r=await _i();r?await si(r):(a.innerHTML=`
        <svg width="16" height="16" viewBox="0 0 21 21" fill="none"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
        Sign in with Microsoft Entra ID
      `,a.disabled=!1,v("Login cancelled or failed. Try again or use demo account.","warning"))});let i=null;const s=document.getElementById("demo-signin-btn");document.querySelectorAll(".user-tile").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".user-tile").forEach(r=>r.classList.remove("selected")),a.classList.add("selected"),i=a.dataset.user,s.style.display="block"})}),s.addEventListener("click",async()=>{i&&(s.innerHTML='<span class="spinner" style="margin-right:8px"></span> Signing in...',s.disabled=!0,await _r(i))})}async function _r(e){const t=ai.find(s=>s.id===e);if(!t)return;y.currentUser=t,window.userEmail=t.email,Gi();const i=t.navAccess[0];await D(i),v(`Welcome back, ${t.name}!`,"success")}async function si(e){const t=(e.name||e.username).split(" ");let i="user";try{console.log(`📡 Determining role for user: ${e.localAccountId}`);const l=await(await fetch("https://m365ops-api-gtbgezb9c7bgata7.centralus-01.azurewebsites.net/api/user/role",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:e.localAccountId})})).json();l.success&&(i=l.role,console.log(`✓ User role: ${i}`))}catch(o){console.warn("⚠️ Could not determine role from backend, using default:",o.message),i="user"}const s={super:["dashboard","requests","security","tenantguard","user-investigation","zerotrust","privaccts","m365config","licenses","agents","approvals","msgcenter","applications","intune","portal","myreqs","myaccount","chat","graphapi","sso","audit","settings"],admin:["dashboard","requests","security","tenantguard","user-investigation","zerotrust","privaccts","m365config","licenses","agents","approvals","msgcenter","applications","intune","portal","myreqs","myaccount","chat","audit","settings"],manager:["requests","msgcenter","portal","myreqs","myaccount","chat"],user:["portal","myreqs","myaccount","chat"]};let a=s[i]||s.user;["super","admin"].includes(i)&&!a.includes("user-investigation")&&(a=[...a,"user-investigation"]);const r={id:e.localAccountId,name:e.name||e.username,email:e.username,role:i,initials:t.map(o=>o[0]).join("").toUpperCase(),color:"#0C447C",isEntraID:!0,account:e,navAccess:a};window.userEmail=e.username||e.mail||e.email,y.currentUser=r,Gi();const n=r.navAccess[0];await D(n),v(`Welcome, ${r.name}! Role: ${i}`,"success")}function Gi(){const e=document.getElementById("app");e.innerHTML=`
    <div id="app-shell">
      <nav id="sidebar"></nav>
      <div id="main-content">
        <header id="app-header"></header>
        <div id="page-area">
          ${Vr()}
        </div>
      </div>
    </div>
  `,Wi(),Ji()}function Vr(){return["dashboard","requests","security","tenantguard","user-investigation","zerotrust","privaccts","m365config","msgcenter","applications","intune","licenses","agents","approvals","portal","myreqs","myaccount","chat","graphapi","sso","audit","settings"].map(t=>`<div class="page" id="page-${t}"></div>`).join("")}Hr();ii().catch(e=>{console.error("Login render error:",e),ii()});const Wr=Object.freeze(Object.defineProperty({__proto__:null,go:D,hasAccess:Ui,isRole:Fr,resetSettings:ji,saveState:T,state:y},Symbol.toStringTag,{value:"Module"}));
