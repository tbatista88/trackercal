(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const g of r)if(g.type==="childList")for(const $ of g.addedNodes)$.tagName==="LINK"&&$.rel==="modulepreload"&&i($)}).observe(document,{childList:!0,subtree:!0});function a(r){const g={};return r.integrity&&(g.integrity=r.integrity),r.referrerPolicy&&(g.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?g.credentials="include":r.crossOrigin==="anonymous"?g.credentials="omit":g.credentials="same-origin",g}function i(r){if(r.ep)return;r.ep=!0;const g=a(r);fetch(r.href,g)}})();const D={PROFILE:"tcv2_profile",PRODUCTS:"tcv2_products",CONSUMPTIONS:"tcv2_consumptions",SETTINGS:"tcv2_settings",BACKUP_REMINDER:"tcv2_backup_reminder"};function le(){return Date.now().toString(36)+Math.random().toString(36).substr(2,9)}function z(e,n=null){try{const a=localStorage.getItem(e);return a?JSON.parse(a):n}catch{return n}}function M(e,n){localStorage.setItem(e,JSON.stringify(n))}function me(){return new Date().toISOString().split("T")[0]}const F={};function X(e,n){return F[e]||(F[e]=[]),F[e].push(n),()=>{F[e]=F[e].filter(a=>a!==n)}}function q(e,n){F[e]&&F[e].forEach(a=>a(n))}function _(){return z(D.PROFILE,null)}function ce(e){const n={...e,updatedAt:new Date().toISOString()};return M(D.PROFILE,n),q("profile:updated",n),n}function de(){return _()!==null}function H(){return z(D.PRODUCTS,[])}function N(e){return H().find(n=>n.id===e)||null}function te(e){const n=H(),a={id:le(),name:e.name||"",description:e.description||"",caloriesPer100g:parseFloat(e.caloriesPer100g)||0,photo:e.photo||null,createdAt:new Date().toISOString()};return n.unshift(a),M(D.PRODUCTS,n),q("products:updated",n),a}function ve(e,n){const a=H(),i=a.findIndex(r=>r.id===e);return i===-1?null:(a[i]={...a[i],...n,updatedAt:new Date().toISOString()},M(D.PRODUCTS,a),q("products:updated",a),a[i])}function ge(e){const n=H().filter(a=>a.id!==e);M(D.PRODUCTS,n),q("products:updated",n)}function R(e=null){const n=z(D.CONSUMPTIONS,[]);return e?n.filter(a=>a.date===e):n}function be(e){const n=R(),a={id:le(),productId:e.productId||null,productNameBackup:e.productNameBackup||"",productPhotoBackup:e.productPhotoBackup||null,caloriesPer100gBackup:e.caloriesPer100gBackup||0,grams:parseFloat(e.grams)||0,calories:parseFloat(e.calories)||0,meal:e.meal||"collation",notes:e.notes||"",date:e.date||me(),createdAt:new Date().toISOString()};return n.unshift(a),M(D.CONSUMPTIONS,n),q("consumptions:updated",n),a}function fe(e){const n=R().filter(a=>a.id!==e);M(D.CONSUMPTIONS,n),q("consumptions:updated",n)}function he(e,n){return R().filter(i=>i.date>=e&&i.date<=n)}function Z(){return z(D.SETTINGS,{theme:"light",notifications:!1})}function ye(e){const n={...Z(),...e};return M(D.SETTINGS,n),q("settings:updated",n),n}function G(){return Z().theme||"light"}function Se(e){ye({theme:e}),document.documentElement.setAttribute("data-theme",e)}function we(e){const n=_(),a=R(e),i=a.reduce((E,f)=>E+f.calories,0),r=(n==null?void 0:n.dailyTarget)||0,g={"petit-dejeuner":[],dejeuner:[],diner:[],collation:[]};a.forEach(E=>{const f=E.meal||"collation";g[f]?g[f].push(E):g.collation.push(E)});const $={"petit-dejeuner":"🌅 Petit-déjeuner",dejeuner:"☀️ Déjeuner",diner:"🌙 Dîner",collation:"🍪 Collation"};let S=`📊 Mon Suivi Calories – ${e}
`;S+=`━━━━━━━━━━━━━━━━━━━━
`,S+=`🎯 Objectif : ${Math.round(r)} kcal
`,S+=`📈 Consommé : ${Math.round(i)} kcal
`,S+=`${i<=r?"✅":"⚠️"} ${i<=r?"Objectif respecté !":"Objectif dépassé !"}

`;for(const[E,f]of Object.entries(g))f.length!==0&&(S+=`${$[E]}
`,f.forEach(L=>{S+=`  • ${L.productNameBackup} – ${L.grams}g – ${Math.round(L.calories)} kcal
`}),S+=`
`);return S}function xe(){return{version:"1.0",exportedAt:new Date().toISOString(),profile:z(D.PROFILE,null),products:z(D.PRODUCTS,[]),consumptions:z(D.CONSUMPTIONS,[]),settings:z(D.SETTINGS,{theme:"light",notifications:!1})}}function $e(e){if(!e||!e.version)throw new Error("Invalid backup file format");e.profile&&(M(D.PROFILE,e.profile),q("profile:updated",e.profile)),e.products&&Array.isArray(e.products)&&(M(D.PRODUCTS,e.products),q("products:updated",e.products)),e.consumptions&&Array.isArray(e.consumptions)&&(M(D.CONSUMPTIONS,e.consumptions),q("consumptions:updated",e.consumptions)),e.settings&&(M(D.SETTINGS,e.settings),q("settings:updated",e.settings),e.settings.theme&&document.documentElement.setAttribute("data-theme",e.settings.theme)),q("data:imported")}function Ee(){Object.values(D).forEach(e=>localStorage.removeItem(e)),q("data:cleared")}const ke=2;function ee(){return z(D.BACKUP_REMINDER,{lastReminderDate:null,lastBackupDate:null,hasShownFirstReminder:!1})}function Le(e){const n={...ee(),...e};return M(D.BACKUP_REMINDER,n),n}function De(){const e=ee(),n=new Date;if(n.toISOString().split("T")[0],!e.hasShownFirstReminder)return!!(_()||R().length>0||H().length>0);if(!e.lastReminderDate)return!0;const a=new Date(e.lastReminderDate);return Math.floor((n-a)/(1e3*60*60*24))>=ke}function Pe(){ee(),Le({lastReminderDate:new Date().toISOString().split("T")[0],hasShownFirstReminder:!0})}let V=null;function qe(){return V||(V=document.createElement("div"),V.className="toast-container",document.body.appendChild(V)),V}function k(e,n="info",a=3e3){const i={success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"},r=document.createElement("div");r.className="toast",r.innerHTML=`
    <span class="toast-icon">${i[n]||i.info}</span>
    <span class="toast-message">${e}</span>
  `,qe().appendChild(r),setTimeout(()=>{r.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>r.remove(),300)},a)}function Me(e,n,a,i){const r=10*a+6.25*i-5*e;return n==="homme"?r+5:r-161}function Ce(e,n="sedentary"){return e*({sedentary:1.2,light:1.375,moderate:1.55,active:1.725,"very-active":1.9}[n]||1.2)}function Q(e){const{age:n,sex:a,weight:i,height:r,goalWeight:g,duration:$,activityLevel:S}=e,E=Me(n,a,i,r||170),f=Ce(E,S||"sedentary"),L=i-g,c=$*30;let d=0;L>0&&c>0&&(d=L*7700/c);let l=f-d;return l<1200&&(l=1200),l>f+1e3&&(l=f+1e3),{bmr:Math.round(E),tdee:Math.round(f),dailyDeficit:Math.round(d),dailyTarget:Math.round(l)}}function ae(e,n){return e*n/100}function ne(e){return e*.23900573614}const J=[{id:"welcome",title:"Bienvenue ! 🌸",subtitle:"Configurons votre profil pour calculer votre objectif calorique quotidien."},{id:"basics",title:"Informations de base",subtitle:"Ces données nous aident à calculer votre métabolisme."},{id:"goals",title:"Votre objectif",subtitle:"Définissez votre poids cible et la durée souhaitée."},{id:"summary",title:"Votre plan",subtitle:"Voici votre objectif calorique calculé."}];function Te(e){let n=0,a={age:"",sex:"femme",weight:"",height:"170",goalWeight:"",duration:"3",activityLevel:"sedentary"};function i(){const l=J[n];e.innerHTML=`
      <div class="onboarding">
        <div class="onboarding-header">
          <div class="onboarding-progress">
            ${J.map((v,u)=>`
              <div class="onboarding-dot ${u<=n?"active":""}"></div>
            `).join("")}
          </div>
          <h2 class="onboarding-title anim-fade-in">${l.title}</h2>
          <p class="onboarding-subtitle anim-fade-in">${l.subtitle}</p>
        </div>
        <div class="onboarding-body anim-slide-up">
          ${r()}
        </div>
        <div class="onboarding-footer">
          ${n>0?'<button class="btn btn-ghost" id="btn-prev">← Retour</button>':"<div></div>"}
          ${n<J.length-1?'<button class="btn btn-primary" id="btn-next">Suivant →</button>':'<button class="btn btn-primary btn-lg" id="btn-finish">🚀 Commencer !</button>'}
        </div>
      </div>
    `,L()}function r(){switch(n){case 0:return g();case 1:return $();case 2:return S();case 3:return E();default:return""}}function g(){return`
      <div class="onboarding-welcome">
        <div class="onboarding-icon anim-float">🌸</div>
        <div class="card-glass" style="margin-top:var(--space-lg);">
          <h3 style="margin-bottom:var(--space-sm);">Mon Suivi Calories</h3>
          <p style="font-size:var(--font-sm);">
            Suivez vos calories quotidiennes de manière simple et intuitive. 
            Toutes vos données restent sur votre appareil.
          </p>
        </div>
        <div class="card-glass" style="margin-top:var(--space-md);">
          <div class="flex gap-md" style="align-items:flex-start;">
            <span style="font-size:24px;">🔒</span>
            <div>
              <strong>100% privé</strong>
              <p style="font-size:var(--font-xs);">Aucun serveur, aucun compte. Vos données restent sur cet appareil.</p>
            </div>
          </div>
        </div>
      </div>
    `}function $(){const l=[{value:"sedentary",label:"Sédentaire",desc:"Bureau, peu d'exercice"},{value:"light",label:"Léger",desc:"Exercice 1-3j/semaine"},{value:"moderate",label:"Modéré",desc:"Exercice 3-5j/semaine"},{value:"active",label:"Actif",desc:"Exercice 6-7j/semaine"}];return`
      <div class="onboarding-form">
        <div class="input-group">
          <label class="input-label">Sexe</label>
          <div class="select-group">
            <button class="select-option ${a.sex==="femme"?"active":""}" data-sex="femme">👩 Femme</button>
            <button class="select-option ${a.sex==="homme"?"active":""}" data-sex="homme">👨 Homme</button>
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label" for="onb-age">Âge</label>
          <input class="input-field" type="number" id="onb-age" placeholder="Ex : 30" 
                 value="${a.age}" min="15" max="100" inputmode="numeric" />
        </div>
        
        <div class="flex gap-md">
          <div class="input-group" style="flex:1">
            <label class="input-label" for="onb-height">Taille (cm)</label>
            <input class="input-field" type="number" id="onb-height" placeholder="170" 
                   value="${a.height}" min="100" max="250" inputmode="numeric" />
          </div>
          <div class="input-group" style="flex:1">
            <label class="input-label" for="onb-weight">Poids actuel (kg)</label>
            <input class="input-field" type="number" id="onb-weight" placeholder="70" 
                   value="${a.weight}" min="30" max="300" step="0.1" inputmode="decimal" />
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">Niveau d'activité</label>
          <div class="activity-levels">
            ${l.map(v=>`
              <button class="activity-option ${a.activityLevel===v.value?"active":""}" data-activity="${v.value}">
                <strong>${v.label}</strong>
                <small>${v.desc}</small>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `}function S(){return`
      <div class="onboarding-form">
        <div class="input-group">
          <label class="input-label" for="onb-goal">Objectif de poids (kg)</label>
          <input class="input-field" type="number" id="onb-goal" placeholder="Ex : 65" 
                 value="${a.goalWeight}" min="30" max="300" step="0.1" inputmode="decimal" />
          <span class="input-hint">Le poids que vous aimeriez atteindre</span>
        </div>
        
        <div class="input-group">
          <label class="input-label" for="onb-duration">Durée (mois)</label>
          <input class="input-field" type="number" id="onb-duration" placeholder="Ex : 3" 
                 value="${a.duration}" min="1" max="24" inputmode="numeric" />
          <span class="input-hint">En combien de mois souhaitez-vous atteindre votre objectif ?</span>
        </div>
        
        <div class="card-glass" style="margin-top:var(--space-md);">
          <div class="flex gap-sm" style="align-items:flex-start">
            <span>💡</span>
            <div>
              <p style="font-size:var(--font-sm);">
                <strong>Conseil :</strong> une perte de 0,5 à 1 kg par semaine est recommandée 
                pour un résultat durable et sain.
              </p>
            </div>
          </div>
        </div>
      </div>
    `}function E(){const l=Q({age:parseInt(a.age)||30,sex:a.sex,weight:parseFloat(a.weight)||70,height:parseInt(a.height)||170,goalWeight:parseFloat(a.goalWeight)||65,duration:parseInt(a.duration)||3,activityLevel:a.activityLevel}),v=(parseFloat(a.weight)||70)-(parseFloat(a.goalWeight)||65),u=v>0;return`
      <div class="onboarding-summary">
        <div class="summary-target-card card-glass-heavy">
          <div class="summary-target-icon">${u?"📉":"📈"}</div>
          <div class="summary-target-value">${l.dailyTarget}</div>
          <div class="summary-target-unit">kcal / jour</div>
          <div class="summary-target-label">Votre objectif calorique quotidien</div>
        </div>
        
        <div class="summary-details">
          <div class="card-glass">
            <div class="flex-between">
              <span class="text-secondary" style="font-size:var(--font-sm);">Métabolisme de base (BMR)</span>
              <strong>${l.bmr} kcal</strong>
            </div>
          </div>
          <div class="card-glass">
            <div class="flex-between">
              <span class="text-secondary" style="font-size:var(--font-sm);">Dépense totale (TDEE)</span>
              <strong>${l.tdee} kcal</strong>
            </div>
          </div>
          <div class="card-glass">
            <div class="flex-between">
              <span class="text-secondary" style="font-size:var(--font-sm);">${u?"Déficit":"Surplus"} quotidien</span>
              <strong>${Math.abs(l.dailyDeficit)} kcal</strong>
            </div>
          </div>
          <div class="card-glass">
            <div class="flex-between">
              <span class="text-secondary" style="font-size:var(--font-sm);">${u?"Perte":"Gain"} visé${u?"e":""}</span>
              <strong>${Math.abs(v).toFixed(1)} kg en ${a.duration} mois</strong>
            </div>
          </div>
        </div>
        
        <div class="card-glass" style="margin-top:var(--space-sm);">
          <div class="flex gap-sm" style="align-items:flex-start">
            <span>ℹ️</span>
            <p style="font-size:var(--font-xs);color:var(--text-tertiary);">
              Ce calcul utilise la formule de Mifflin-St Jeor. 
              1 kg de graisse ≈ 7 700 kcal. Le déficit est réparti sur la durée choisie. 
              Minimum sécuritaire : 1 200 kcal/jour.
            </p>
          </div>
        </div>
      </div>
    `}function f(){const l={"onb-age":"age","onb-height":"height","onb-weight":"weight","onb-goal":"goalWeight","onb-duration":"duration"};for(const[v,u]of Object.entries(l)){const s=e.querySelector(`#${v}`);s&&(a[u]=s.value)}}function L(){e.querySelectorAll("[data-sex]").forEach(t=>{t.addEventListener("click",()=>{f(),a.sex=t.dataset.sex,i()})}),e.querySelectorAll("[data-activity]").forEach(t=>{t.addEventListener("click",()=>{f(),a.activityLevel=t.dataset.activity,i()})});const l={"onb-age":"age","onb-height":"height","onb-weight":"weight","onb-goal":"goalWeight","onb-duration":"duration"};for(const[t,o]of Object.entries(l)){const m=e.querySelector(`#${t}`);m&&m.addEventListener("input",()=>{a[o]=m.value})}const v=e.querySelector("#btn-next"),u=e.querySelector("#btn-prev"),s=e.querySelector("#btn-finish");v&&v.addEventListener("click",()=>{f(),c()&&(n++,i())}),u&&u.addEventListener("click",()=>{f(),n--,i()}),s&&s.addEventListener("click",()=>{f(),d()})}function c(){switch(n){case 1:return!a.age||parseInt(a.age)<15?(k("Veuillez entrer un âge valide (15+)","warning"),!1):!a.weight||parseFloat(a.weight)<30?(k("Veuillez entrer un poids valide","warning"),!1):!0;case 2:return!a.goalWeight||parseFloat(a.goalWeight)<30?(k("Veuillez entrer un objectif de poids valide","warning"),!1):!a.duration||parseInt(a.duration)<1?(k("Veuillez entrer une durée valide (minimum 1 mois)","warning"),!1):!0;default:return!0}}function d(){const l=Q({age:parseInt(a.age),sex:a.sex,weight:parseFloat(a.weight),height:parseInt(a.height)||170,goalWeight:parseFloat(a.goalWeight),duration:parseInt(a.duration),activityLevel:a.activityLevel});ce({...a,age:parseInt(a.age),weight:parseFloat(a.weight),height:parseInt(a.height)||170,goalWeight:parseFloat(a.goalWeight),duration:parseInt(a.duration),bmr:l.bmr,tdee:l.tdee,dailyDeficit:l.dailyDeficit,dailyTarget:l.dailyTarget}),k("Profil créé avec succès ! 🎉","success")}return i(),()=>{}}const se={"petit-dejeuner":{icon:"🌅",label:"Petit-déjeuner"},dejeuner:{icon:"☀️",label:"Déjeuner"},diner:{icon:"🌙",label:"Dîner"},collation:{icon:"🍪",label:"Collation"}};function oe(e){const n=_(),a=new Date().toISOString().split("T")[0];let i=a;const r=[];function g(){const c=R(i),d=c.reduce((w,y)=>w+(y.calories||0),0),l=(n==null?void 0:n.dailyTarget)||2e3,v=Math.min(d/l*100,100),u=d>l,s=l-d,t={};for(const w of Object.keys(se))t[w]=c.filter(y=>y.meal===w);const o=new Date(i+"T12:00:00"),m=i===a,b=m?"Aujourd'hui":o.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"}),p=2*Math.PI*54,h=p-v/100*p;e.innerHTML=`
      <div class="dashboard">
        <!-- Header -->
        <div class="view-header">
          <div>
            <h1 style="font-size:var(--font-2xl);">Mon Suivi</h1>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">${b}</p>
          </div>
          <div class="flex gap-sm">
            <button class="btn btn-icon btn-secondary" id="btn-date-prev" aria-label="Jour précédent">←</button>
            ${m?"":'<button class="btn btn-sm btn-ghost" id="btn-date-today">Auj.</button>'}
            <button class="btn btn-icon btn-secondary" id="btn-date-next" aria-label="Jour suivant" ${m?'disabled style="opacity:0.4"':""}>→</button>
          </div>
        </div>
        
        <!-- Calorie Ring -->
        <div class="dashboard-ring-section ${u?"over-target-glow":""}" style="text-align:center;padding:var(--space-md);">
          <div class="progress-ring-container">
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle class="progress-ring-bg" cx="60" cy="60" r="54" />
              <circle class="progress-ring-fill ${u?"over-target":""}" cx="60" cy="60" r="54" 
                      stroke-dasharray="${p}" 
                      stroke-dashoffset="${h}" />
            </svg>
            <div class="progress-ring-text">
              <span class="progress-ring-value" style="${u?"color:var(--danger)":""}">${Math.round(d)}</span>
              <span class="progress-ring-label">/ ${l} kcal</span>
            </div>
          </div>
          
          <div class="flex-center gap-lg" style="margin-top:var(--space-md);">
            <div style="text-align:center;">
              <div style="font-size:var(--font-2xl);font-weight:var(--fw-bold);color:${u?"var(--danger)":s>0?"var(--success)":"var(--text-primary)"};">
                ${u?"+":""}${Math.abs(Math.round(s))}
              </div>
              <small>${u?"kcal en trop":"kcal restantes"}</small>
            </div>
          </div>
          
          ${u?`
            <div class="warning-banner" style="margin-top:var(--space-md);">
              <span class="warning-banner-icon">⚠️</span>
              <span class="warning-banner-text">Vous avez dépassé votre objectif de ${Math.round(d-l)} kcal</span>
            </div>
          `:""}
        </div>
        
        <!-- Quick Actions -->
        <div class="flex gap-sm" style="padding:0 var(--space-md);margin-bottom:var(--space-md);">
          <button class="btn btn-primary btn-sm" id="btn-add-food" style="flex:1;">
            ➕ Ajouter un aliment
          </button>
          <button class="btn btn-secondary btn-sm btn-icon" id="btn-export" title="Exporter" aria-label="Exporter">
            📋
          </button>
        </div>
        
        <!-- Meal Groups -->
        <div class="dashboard-meals" style="padding:0 var(--space-md);">
          ${Object.entries(se).map(([w,y])=>{const x=t[w]||[],C=x.reduce((P,A)=>P+(A.calories||0),0);return`
              <div class="meal-group card-glass" style="margin-bottom:var(--space-sm);">
                <div class="meal-group-header" data-meal-toggle="${w}">
                  <span class="meal-group-title">${y.icon} ${y.label}</span>
                  <span class="meal-group-cal">${x.length>0?Math.round(C)+" kcal":""}</span>
                </div>
                <div class="meal-group-items" id="meal-items-${w}">
                  ${x.length===0?`
                    <div style="text-align:center;padding:var(--space-sm);color:var(--text-tertiary);font-size:var(--font-sm);">
                      Appuyez sur + pour ajouter
                    </div>
                  `:x.map(P=>$(P)).join("")}
                </div>
                <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:var(--space-xs);" data-add-meal="${w}">
                  + Ajouter
                </button>
              </div>
            `}).join("")}
        </div>
      </div>
    `,S()}function $(c){const d=c.productId?N(c.productId):null,l=(d==null?void 0:d.photo)||c.productPhotoBackup,v=(d==null?void 0:d.name)||c.productNameBackup||"Produit inconnu";return`
      <div class="consumption-item" data-consumption-id="${c.id}">
        ${l?`<img class="consumption-item-photo" src="${l}" alt="${v}" loading="lazy" />`:'<div class="consumption-item-photo flex-center" style="font-size:16px;">🍽️</div>'}
        <div class="consumption-item-info">
          <div class="consumption-item-name">${v}</div>
          <div class="consumption-item-detail">${c.grams}g${c.notes?" · "+c.notes:""}</div>
        </div>
        <div class="consumption-item-cal">${Math.round(c.calories)}</div>
        <div class="consumption-item-actions">
          <button class="btn btn-ghost btn-sm" data-edit-consumption="${c.id}" aria-label="Modifier">✏️</button>
          <button class="btn btn-ghost btn-sm" data-delete-consumption="${c.id}" aria-label="Supprimer">🗑️</button>
        </div>
      </div>
    `}function S(){var c,d,l,v,u;(c=e.querySelector("#btn-date-prev"))==null||c.addEventListener("click",()=>{const s=new Date(i+"T12:00:00");s.setDate(s.getDate()-1),i=s.toISOString().split("T")[0],g()}),(d=e.querySelector("#btn-date-next"))==null||d.addEventListener("click",()=>{const s=new Date(i+"T12:00:00");s.setDate(s.getDate()+1);const t=s.toISOString().split("T")[0];t<=a&&(i=t,g())}),(l=e.querySelector("#btn-date-today"))==null||l.addEventListener("click",()=>{i=a,g()}),(v=e.querySelector("#btn-add-food"))==null||v.addEventListener("click",()=>{B("products",["select"])}),e.querySelectorAll("[data-add-meal]").forEach(s=>{s.addEventListener("click",()=>{const t=s.dataset.addMeal;B("products",["select",t])})}),(u=e.querySelector("#btn-export"))==null||u.addEventListener("click",()=>{const s=we(i);if(navigator.clipboard)navigator.clipboard.writeText(s).then(()=>{k("Résumé copié dans le presse-papiers ! 📋","success")});else{const t=document.createElement("textarea");t.value=s,document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t),k("Résumé copié ! 📋","success")}}),e.querySelectorAll("[data-edit-consumption]").forEach(s=>{s.addEventListener("click",t=>{t.stopPropagation();const o=s.dataset.editConsumption;E(o)})}),e.querySelectorAll("[data-delete-consumption]").forEach(s=>{s.addEventListener("click",t=>{t.stopPropagation();const o=s.dataset.deleteConsumption;confirm("Supprimer ce repas ?")&&(fe(o),k("Repas supprimé","info"),g())})})}function E(c){const{getConsumption:d}=f(),l=d(c);if(!l)return;const v=l.productId?N(l.productId):null,u=l.productId&&!v,s=(v==null?void 0:v.name)||l.productNameBackup||"Produit inconnu",t=(v==null?void 0:v.caloriesPer100g)||l.caloriesPer100gBackup||0,o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-edit">✕</button>
        <h3 class="modal-title">Modifier la consommation</h3>
        
        ${u?`
          <div class="warning-banner mb-md">
            <span class="warning-banner-icon">⚠️</span>
            <span class="warning-banner-text">Produit supprimé – vous ne pouvez modifier que la quantité et les calories.</span>
          </div>
        `:""}
        
        <div class="card-glass mb-md">
          <strong>${s}</strong>
          ${u?"":`<p style="font-size:var(--font-sm);color:var(--text-tertiary);">${t} kcal / 100 g</p>`}
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="edit-grams">Quantité (grammes)</label>
          <input class="input-field" type="number" id="edit-grams" value="${l.grams}" min="1" inputmode="numeric" />
        </div>
        
        ${u?`
          <div class="input-group mb-md">
            <label class="input-label" for="edit-calories">Calories</label>
            <input class="input-field" type="number" id="edit-calories" value="${Math.round(l.calories)}" min="0" inputmode="numeric" />
          </div>
        `:`
          <div class="card-glass mb-md">
            <div class="flex-between">
              <span>Calories calculées</span>
              <strong id="edit-cal-preview">${Math.round(l.calories)} kcal</strong>
            </div>
          </div>
        `}
        
        <div class="input-group mb-md">
          <label class="input-label" for="edit-notes">Notes (optionnel)</label>
          <input class="input-field" type="text" id="edit-notes" value="${l.notes||""}" placeholder="Ajouter une note..." />
        </div>
        
        <button class="btn btn-primary btn-block" id="btn-save-edit">💾 Enregistrer</button>
      </div>
    `,document.body.appendChild(o);const m=o.querySelector("#edit-grams"),b=o.querySelector("#edit-cal-preview");m&&b&&!u&&m.addEventListener("input",()=>{const h=parseFloat(m.value)||0;b.textContent=Math.round(t*h/100)+" kcal"});const p=()=>o.remove();o.querySelector("#modal-close-edit").addEventListener("click",p),o.addEventListener("click",h=>{h.target===o&&p()}),o.querySelector("#btn-save-edit").addEventListener("click",()=>{parseFloat(m.value),o.querySelector("#edit-notes").value,u&&parseFloat(o.querySelector("#edit-calories").value),k("Consommation modifiée ✅","success"),p(),g()})}function f(){return{getConsumption:c=>R().find(d=>d.id===c),updateConsumption:(c,d)=>{},getProduct:N}}const L=X("consumptions:updated",()=>g());return r.push(L),g(),()=>{r.forEach(c=>c())}}const je="modulepreload",Ie=function(e){return"/trackercal/"+e},ie={},ue=function(n,a,i){let r=Promise.resolve();if(a&&a.length>0){let $=function(f){return Promise.all(f.map(L=>Promise.resolve(L).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const S=document.querySelector("meta[property=csp-nonce]"),E=(S==null?void 0:S.nonce)||(S==null?void 0:S.getAttribute("nonce"));r=$(a.map(f=>{if(f=Ie(f),f in ie)return;ie[f]=!0;const L=f.endsWith(".css"),c=L?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${f}"]${c}`))return;const d=document.createElement("link");if(d.rel=L?"stylesheet":je,L||(d.as="script"),d.crossOrigin="",d.href=f,E&&d.setAttribute("nonce",E),document.head.appendChild(d),L)return new Promise((l,v)=>{d.addEventListener("load",l),d.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${f}`)))})}))}function g($){const S=new Event("vite:preloadError",{cancelable:!0});if(S.payload=$,window.dispatchEvent(S),!S.defaultPrevented)throw $}return r.then($=>{for(const S of $||[])S.status==="rejected"&&g(S.reason);return n().catch(g)})};async function ze(e){try{const n=await fetch(`https://world.openfoodfacts.org/api/v2/product/${e}`,{headers:{"User-Agent":"MonSuiviCalories/1.0"}});if(!n.ok)return null;const a=await n.json();if(a.status!==1||!a.product)return null;const i=a.product;let r=0;const g=i.nutriments||{};return g["energy-kcal_100g"]?r=parseFloat(g["energy-kcal_100g"]):g["energy-kcal"]?r=parseFloat(g["energy-kcal"]):g.energy_100g?r=Math.round(ne(parseFloat(g.energy_100g))):g.energy&&(r=Math.round(ne(parseFloat(g.energy)))),{name:i.product_name||i.product_name_fr||"Produit inconnu",image:i.image_front_url||i.image_front_small_url||null,caloriesPer100g:Math.round(r),brand:i.brands||"",barcode:e}}catch(n){return console.error("Erreur API Open Food Facts:",n),null}}function Ae(e,n=[]){const a=n[0]==="select",i=n[1]||null;let r="";const g=[];function $(){const s=H(),t=r?s.filter(o=>o.name.toLowerCase().includes(r.toLowerCase())):s;e.innerHTML=`
      <div class="products-view">
        <div class="view-header">
          <div>
            <h1 style="font-size:var(--font-2xl);">${a?"Choisir un aliment":"Mes Produits"}</h1>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">${s.length} produit${s.length!==1?"s":""}</p>
          </div>
          ${a?'<button class="btn btn-ghost" id="btn-back-dash">✕</button>':""}
        </div>
        
        <!-- Search -->
        <div style="padding:0 var(--space-md);margin-bottom:var(--space-md);">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input class="input-field" type="text" id="product-search" 
                   placeholder="Rechercher un aliment..." 
                   value="${r}" autocomplete="off" />
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-sm" style="padding:0 var(--space-md);margin-bottom:var(--space-md);">
          <button class="btn btn-primary btn-sm" id="btn-add-product" style="flex:1;">
            ➕ Nouveau produit
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-scan-barcode" style="flex:1;">
            📱 Scanner
          </button>
        </div>
        
        <!-- Product List -->
        <div class="products-list" style="padding:0 var(--space-md);">
          ${t.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">🍎</div>
              <div class="empty-state-title">${r?"Aucun résultat":"Aucun produit"}</div>
              <div class="empty-state-desc">
                ${r?"Essayez un autre terme de recherche ou ajoutez un nouveau produit.":"Ajoutez votre premier aliment en appuyant sur le bouton ci-dessus."}
              </div>
            </div>
          `:t.map(o=>S(o)).join("")}
        </div>
      </div>
    `,E()}function S(s){return`
      <div class="product-card" data-product-id="${s.id}">
        ${s.photo?`<img class="product-card-photo" src="${s.photo}" alt="${s.name}" loading="lazy" />`:'<div class="product-card-photo">🍽️</div>'}
        <div class="product-card-info">
          <div class="product-card-name">${s.name}</div>
          ${s.description?`<div class="product-card-desc">${s.description}</div>`:""}
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div class="product-card-cal">${s.caloriesPer100g} kcal</div>
          <small style="color:var(--text-tertiary);">/ 100 g</small>
        </div>
        ${a?"":`
          <div class="product-card-actions" style="flex-direction:column;">
            <button class="btn btn-ghost btn-sm" data-edit-product="${s.id}" style="padding:4px 6px;">✏️</button>
            <button class="btn btn-ghost btn-sm" data-delete-product="${s.id}" style="padding:4px 6px;">🗑️</button>
          </div>
        `}
      </div>
    `}function E(){var t,o,m;const s=e.querySelector("#product-search");s&&s.addEventListener("input",b=>{r=b.target.value,$();const p=e.querySelector("#product-search");p&&(p.focus(),p.setSelectionRange(r.length,r.length))}),(t=e.querySelector("#btn-back-dash"))==null||t.addEventListener("click",()=>{B("dashboard")}),(o=e.querySelector("#btn-add-product"))==null||o.addEventListener("click",()=>{f()}),(m=e.querySelector("#btn-scan-barcode"))==null||m.addEventListener("click",()=>{c()}),e.querySelectorAll(".product-card").forEach(b=>{b.addEventListener("click",p=>{if(p.target.closest("[data-edit-product]")||p.target.closest("[data-delete-product]"))return;const h=b.dataset.productId;a&&L(h)})}),e.querySelectorAll("[data-edit-product]").forEach(b=>{b.addEventListener("click",p=>{p.stopPropagation(),f(b.dataset.editProduct)})}),e.querySelectorAll("[data-delete-product]").forEach(b=>{b.addEventListener("click",p=>{p.stopPropagation(),confirm("Supprimer ce produit ? Les consommations associées seront conservées.")&&(ge(b.dataset.deleteProduct),k("Produit supprimé","info"),$())})})}function f(s=null){const t=s?N(s):null,o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-product">✕</button>
        <h3 class="modal-title">${t?"Modifier le produit":"Nouveau produit"}</h3>
        
        <div class="photo-upload mb-md" id="photo-upload-area">
          ${t!=null&&t.photo?`<img src="${t.photo}" alt="Photo" />`:""}
          <span class="photo-upload-icon" ${t!=null&&t.photo?'style="display:none"':""}>📷</span>
          <span class="photo-upload-text" ${t!=null&&t.photo?'style="display:none"':""}>Ajouter une photo</span>
          <input type="file" accept="image/*" capture="environment" id="photo-input" 
                 style="position:absolute;inset:0;opacity:0;cursor:pointer;" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="prod-name">Nom *</label>
          <input class="input-field" type="text" id="prod-name" placeholder="Ex : Pomme, Riz complet..." 
                 value="${(t==null?void 0:t.name)||""}" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="prod-desc">Description (optionnel)</label>
          <input class="input-field" type="text" id="prod-desc" placeholder="Ex : Bio, marque..." 
                 value="${(t==null?void 0:t.description)||""}" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="prod-cal">Calories par 100 g *</label>
          <input class="input-field" type="number" id="prod-cal" placeholder="Ex : 52" 
                 value="${(t==null?void 0:t.caloriesPer100g)||""}" min="0" inputmode="numeric" />
        </div>
        
        <button class="btn btn-primary btn-block" id="btn-save-product">
          ${t?"💾 Enregistrer":"✅ Ajouter au catalogue"}
        </button>
      </div>
    `,document.body.appendChild(o);let m=(t==null?void 0:t.photo)||null;const b=o.querySelector("#photo-input"),p=o.querySelector("#photo-upload-area");b.addEventListener("change",w=>{const y=w.target.files[0];if(!y)return;const x=new FileReader;x.onload=C=>{const P=new Image;P.onload=()=>{const A=document.createElement("canvas"),O=400;let T=P.width,j=P.height;T>j?T>O&&(j*=O/T,T=O):j>O&&(T*=O/j,j=O),A.width=T,A.height=j,A.getContext("2d").drawImage(P,0,0,T,j),m=A.toDataURL("image/jpeg",.7);let U=p.querySelector("img");U||(U=document.createElement("img"),p.appendChild(U)),U.src=m,U.alt="Photo",p.querySelector(".photo-upload-icon").style.display="none",p.querySelector(".photo-upload-text").style.display="none"},P.src=C.target.result},x.readAsDataURL(y)});const h=()=>o.remove();o.querySelector("#modal-close-product").addEventListener("click",h),o.addEventListener("click",w=>{w.target===o&&h()}),o.querySelector("#btn-save-product").addEventListener("click",()=>{const w=o.querySelector("#prod-name").value.trim(),y=o.querySelector("#prod-desc").value.trim(),x=parseFloat(o.querySelector("#prod-cal").value);if(!w){k("Veuillez entrer un nom","warning");return}if(isNaN(x)||x<0){k("Veuillez entrer des calories valides","warning");return}t?(ve(s,{name:w,description:y,caloriesPer100g:x,photo:m}),k("Produit modifié ✅","success")):(te({name:w,description:y,caloriesPer100g:x,photo:m}),k("Produit ajouté au catalogue ! 🎉","success")),h(),$()})}function L(s){const t=N(s);if(!t)return;const o=document.createElement("div");o.className="modal-overlay",o.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-consumption">✕</button>
        <h3 class="modal-title">Ajouter une consommation</h3>
        
        <div class="card-glass mb-md flex gap-md" style="align-items:center;">
          ${t.photo?`<img src="${t.photo}" alt="${t.name}" style="width:48px;height:48px;border-radius:var(--radius-md);object-fit:cover;" />`:'<div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;font-size:20px;">🍽️</div>'}
          <div style="flex:1;">
            <strong>${t.name}</strong>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">${t.caloriesPer100g} kcal / 100 g</p>
          </div>
        </div>
        
        <!-- Quick grams -->
        <div class="mb-md">
          <label class="input-label mb-sm">Quantité rapide</label>
          <div class="flex gap-sm" style="flex-wrap:wrap;">
            <button class="btn-quick-gram" data-quick-gram="25">25g</button>
            <button class="btn-quick-gram" data-quick-gram="50">50g</button>
            <button class="btn-quick-gram" data-quick-gram="100">100g</button>
            <button class="btn-quick-gram" data-quick-gram="150">150g</button>
            <button class="btn-quick-gram" data-quick-gram="200">200g</button>
            <button class="btn-quick-gram" data-quick-gram="250">250g</button>
          </div>
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="cons-grams">Quantité en grammes</label>
          <input class="input-field" type="number" id="cons-grams" placeholder="Ex : 150" min="1" inputmode="numeric" />
        </div>
        
        <div class="card-glass-heavy mb-md" style="text-align:center;padding:var(--space-lg);">
          <div style="font-size:var(--font-3xl);font-weight:var(--fw-bold);color:var(--accent);" id="cal-preview">0</div>
          <div style="font-size:var(--font-sm);color:var(--text-tertiary);">calories</div>
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label">Repas</label>
          <div class="select-group" style="flex-wrap:wrap;">
            <button class="select-option ${(i||"collation")==="petit-dejeuner"?"active":""}" data-meal="petit-dejeuner" style="flex:1 1 45%;">🌅 Petit-déj.</button>
            <button class="select-option ${(i||"collation")==="dejeuner"?"active":""}" data-meal="dejeuner" style="flex:1 1 45%;">☀️ Déjeuner</button>
            <button class="select-option ${(i||"collation")==="diner"?"active":""}" data-meal="diner" style="flex:1 1 45%;">🌙 Dîner</button>
            <button class="select-option ${!i||i==="collation"?"active":""}" data-meal="collation" style="flex:1 1 45%;">🍪 Collation</button>
          </div>
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="cons-notes">Notes (optionnel)</label>
          <input class="input-field" type="text" id="cons-notes" placeholder="Ex : avec sauce..." />
        </div>
        
        <button class="btn btn-primary btn-block btn-lg" id="btn-confirm-consumption">
          ✅ Enregistrer
        </button>
      </div>
    `,document.body.appendChild(o);let m=i||"collation";const b=o.querySelector("#cons-grams"),p=o.querySelector("#cal-preview");function h(){const y=parseFloat(b.value)||0,x=ae(t.caloriesPer100g,y);p.textContent=Math.round(x)}b.addEventListener("input",h),o.querySelectorAll("[data-quick-gram]").forEach(y=>{y.addEventListener("click",()=>{b.value=y.dataset.quickGram,o.querySelectorAll(".btn-quick-gram").forEach(x=>x.classList.remove("active")),y.classList.add("active"),h()})}),o.querySelectorAll("[data-meal]").forEach(y=>{y.addEventListener("click",()=>{m=y.dataset.meal,o.querySelectorAll("[data-meal]").forEach(x=>x.classList.remove("active")),y.classList.add("active")})});const w=()=>o.remove();o.querySelector("#modal-close-consumption").addEventListener("click",w),o.addEventListener("click",y=>{y.target===o&&w()}),o.querySelector("#btn-confirm-consumption").addEventListener("click",()=>{const y=parseFloat(b.value)||0;if(y<=0){k("Veuillez entrer une quantité valide","warning");return}const x=ae(t.caloriesPer100g,y),C=o.querySelector("#cons-notes").value.trim();be({productId:t.id,productNameBackup:t.name,productPhotoBackup:t.photo,caloriesPer100gBackup:t.caloriesPer100g,grams:y,calories:x,meal:m,notes:C}),k(`${t.name} – ${Math.round(x)} kcal ajouté ! ✅`,"success"),w(),B("dashboard")})}async function c(){let s;try{s=(await ue(()=>import("./index-C7szoz8K.js"),[])).Html5Qrcode}catch{k("Scanner non disponible","error"),d();return}const t=document.createElement("div");t.className="modal-overlay",t.style.alignItems="center",t.innerHTML=`
      <div class="modal-content" style="border-radius:var(--radius-xl);max-height:95vh;">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-scanner">✕</button>
        <h3 class="modal-title">📱 Scanner le code-barres</h3>
        <div id="scanner-container" style="width:100%;border-radius:var(--radius-md);overflow:hidden;margin-bottom:var(--space-md);"></div>
        <p style="text-align:center;font-size:var(--font-sm);color:var(--text-tertiary);margin-bottom:var(--space-md);">
          Placez le code-barres devant la caméra
        </p>
        <button class="btn btn-secondary btn-block btn-sm" id="btn-manual-barcode">
          ⌨️ Entrer le code manuellement
        </button>
      </div>
    `,document.body.appendChild(t);const o=new s("scanner-container");let m=!1,b=!1;const p=async()=>{if(!b){if(b=!0,m){try{await o.stop()}catch{}m=!1}t.remove()}};t.querySelector("#modal-close-scanner").addEventListener("click",()=>p()),t.addEventListener("click",h=>{h.target===t&&p()}),t.querySelector("#btn-manual-barcode").addEventListener("click",async()=>{await p(),d()});try{await o.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:100},aspectRatio:1},async h=>{if(!(!m||b)){m=!1;try{await o.stop()}catch{}t.remove(),await l(h)}}),m=!0}catch(h){console.error("Scanner error:",h),await p(),k("Impossible d'accéder à la caméra","error"),d()}}function d(){const s=document.createElement("div");s.className="modal-overlay",s.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-manual">✕</button>
        <h3 class="modal-title">⌨️ Entrer le code-barres</h3>
        <div class="input-group mb-md">
          <label class="input-label" for="manual-barcode">Code-barres</label>
          <input class="input-field" type="text" id="manual-barcode" placeholder="Ex : 3017620422003" inputmode="numeric" />
        </div>
        <button class="btn btn-primary btn-block" id="btn-search-barcode">🔍 Rechercher</button>
      </div>
    `,document.body.appendChild(s);const t=()=>s.remove();s.querySelector("#modal-close-manual").addEventListener("click",t),s.addEventListener("click",o=>{o.target===s&&t()}),s.querySelector("#btn-search-barcode").addEventListener("click",async()=>{const o=s.querySelector("#manual-barcode").value.trim();if(!o){k("Veuillez entrer un code-barres","warning");return}t(),await l(o)})}async function l(s){k("Recherche en cours...","info",2e3);const t=await ze(s);if(!t){k("Produit non trouvé dans la base Open Food Facts","error");return}v(t)}function v(s){const t=document.createElement("div");t.className="modal-overlay",t.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-result">✕</button>
        <h3 class="modal-title">Produit trouvé ! 🎉</h3>
        
        ${s.image?`<img src="${s.image}" alt="${s.name}" 
               style="width:100%;max-height:200px;object-fit:contain;border-radius:var(--radius-md);margin-bottom:var(--space-md);background:var(--bg-secondary);" />`:""}
        
        <div class="card-glass mb-md">
          <h4>${s.name}</h4>
          ${s.brand?`<p style="font-size:var(--font-sm);color:var(--text-tertiary);">${s.brand}</p>`:""}
          <div style="margin-top:var(--space-sm);">
            <span class="badge badge-accent" style="font-size:var(--font-md);">${s.caloriesPer100g} kcal / 100 g</span>
          </div>
        </div>
        
        <button class="btn btn-primary btn-block btn-lg" id="btn-add-barcode-product">
          ✅ Ajouter au catalogue
        </button>
      </div>
    `,document.body.appendChild(t);const o=()=>t.remove();t.querySelector("#modal-close-result").addEventListener("click",o),t.addEventListener("click",m=>{m.target===t&&o()}),t.querySelector("#btn-add-barcode-product").addEventListener("click",()=>{te({name:s.name,description:s.brand||"",caloriesPer100g:s.caloriesPer100g,photo:s.image||null}),k("Produit ajouté au catalogue ! 🎉","success"),o(),$()})}const u=X("products:updated",()=>$());return g.push(u),$(),()=>{g.forEach(s=>s())}}function Oe(e){const n=_(),a=(n==null?void 0:n.dailyTarget)||2e3;let i="jour",r=null;function g(){e.innerHTML=`
      <div class="history-view">
        <div class="view-header">
          <h1 style="font-size:var(--font-2xl);">Historique</h1>
        </div>
        
        <!-- Filter Tabs -->
        <div style="padding:0 var(--space-md);margin-bottom:var(--space-md);">
          <div class="filter-tabs">
            <button class="filter-tab ${i==="jour"?"active":""}" data-filter="jour">Jour</button>
            <button class="filter-tab ${i==="semaine"?"active":""}" data-filter="semaine">Semaine</button>
            <button class="filter-tab ${i==="mois"?"active":""}" data-filter="mois">Mois</button>
          </div>
        </div>
        
        <!-- Chart -->
        <div class="card-glass" style="margin:0 var(--space-md) var(--space-md);padding:var(--space-md);">
          <canvas id="calorie-chart" height="200"></canvas>
        </div>
        
        <!-- Daily Breakdown -->
        <div id="history-details" style="padding:0 var(--space-md);"></div>
      </div>
    `,$(),f(),L()}function $(){e.querySelectorAll("[data-filter]").forEach(c=>{c.addEventListener("click",()=>{i=c.dataset.filter,g()})})}function S(){const c=new Date;c.setHours(12,0,0,0);let d,l;switch(i){case"jour":{d=new Date(c),d.setDate(d.getDate()-6),l=new Date(c);break}case"semaine":{d=new Date(c),d.setDate(d.getDate()-27),l=new Date(c);break}case"mois":{d=new Date(c),d.setMonth(d.getMonth()-5),d.setDate(1),l=new Date(c);break}}return{start:d.toISOString().split("T")[0],end:l.toISOString().split("T")[0]}}function E(){const{start:c,end:d}=S(),l=he(c,d),v={};if(l.forEach(u=>{v[u.date]||(v[u.date]=0),v[u.date]+=u.calories||0}),i==="jour"){const u=[],s=[],t=new Date;t.setHours(12,0,0,0);for(let o=6;o>=0;o--){const m=new Date(t);m.setDate(m.getDate()-o);const b=m.toISOString().split("T")[0],p=m.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric"});u.push(p),s.push(Math.round(v[b]||0))}return{labels:u,values:s}}if(i==="semaine"){const u=[],s=[],t=new Date;t.setHours(12,0,0,0);for(let o=3;o>=0;o--){const m=new Date(t);m.setDate(m.getDate()-o*7);const b=new Date(m);b.setDate(b.getDate()-6);let p=0,h=0;for(let x=0;x<=6;x++){const C=new Date(b);C.setDate(C.getDate()+x);const P=C.toISOString().split("T")[0];v[P]&&(p+=v[P],h++)}const w=h>0?Math.round(p/h):0,y=b.toLocaleDateString("fr-FR",{day:"numeric",month:"short"});u.push(`Sem. ${y}`),s.push(w)}return{labels:u,values:s}}if(i==="mois"){const u=[],s=[],t=new Date;for(let o=5;o>=0;o--){const m=new Date(t.getFullYear(),t.getMonth()-o,1),b=new Date(t.getFullYear(),t.getMonth()-o+1,0);let p=0,h=0;for(let y=1;y<=b.getDate();y++){const x=`${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,"0")}-${String(y).padStart(2,"0")}`;v[x]&&(p+=v[x],h++)}const w=h>0?Math.round(p/h):0;u.push(m.toLocaleDateString("fr-FR",{month:"short"})),s.push(w)}return{labels:u,values:s}}return{labels:[],values:[]}}async function f(){const c=e.querySelector("#calorie-chart");if(!c)return;const{labels:d,values:l}=E();let v;try{const p=await ue(()=>import("./chart-45xamTTr.js"),[]);v=p.Chart;const{CategoryScale:h,LinearScale:w,BarElement:y,LineElement:x,PointElement:C,Title:P,Tooltip:A,Legend:O,BarController:T,LineController:j}=p;v.register(h,w,y,x,C,P,A,O,T,j)}catch(p){console.error("Chart.js not available:",p),c.parentElement.innerHTML='<p style="text-align:center;color:var(--text-tertiary);padding:var(--space-lg);">Graphique non disponible</p>';return}r&&r.destroy();const u=c.getContext("2d");l.map(p=>p>a);const s=getComputedStyle(document.documentElement),t=s.getPropertyValue("--text-secondary").trim()||"#6B4D5A",o=s.getPropertyValue("--accent").trim()||"#E91E8C",m="#F44336",b=s.getPropertyValue("--divider").trim()||"rgba(0,0,0,0.06)";r=new v(u,{type:i==="jour"?"bar":"line",data:{labels:d,datasets:[{label:i==="jour"?"Calories":"Moy. calories",data:l,backgroundColor:l.map(p=>p>a?"rgba(244, 67, 54, 0.6)":"rgba(233, 30, 140, 0.5)"),borderColor:l.map(p=>p>a?m:o),borderWidth:2,borderRadius:i==="jour"?8:0,tension:.4,fill:i!=="jour",pointBackgroundColor:o,pointRadius:i!=="jour"?4:0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",bodyColor:"#fff",cornerRadius:8,padding:12,callbacks:{label:p=>`${p.raw} kcal`}}},scales:{x:{grid:{display:!1},ticks:{color:t,font:{size:11}}},y:{grid:{color:b},ticks:{color:t,font:{size:11}},beginAtZero:!0}},annotation:{annotations:{targetLine:{type:"line",yMin:a,yMax:a,borderColor:"rgba(255, 152, 0, 0.5)",borderWidth:2,borderDash:[5,5]}}}}})}function L(){const c=e.querySelector("#history-details");if(!c)return;const d=new Date;d.setHours(12,0,0,0);const l=i==="jour"||i==="semaine"?7:30;let v="";for(let u=0;u<l;u++){const s=new Date(d);s.setDate(s.getDate()-u);const t=s.toISOString().split("T")[0],o=R(t),m=o.reduce((h,w)=>h+(w.calories||0),0);if(o.length===0)continue;const b=m>a,p=u===0?"Aujourd'hui":u===1?"Hier":s.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});v+=`
        <div class="card-glass mb-sm history-day-card" data-day="${t}">
          <div class="flex-between" style="cursor:pointer;" data-toggle-day="${t}">
            <div>
              <strong style="font-size:var(--font-sm);">${p}</strong>
            </div>
            <div style="text-align:right;">
              <span class="badge ${b?"badge-danger":"badge-success"}" style="font-size:var(--font-sm);">
                ${Math.round(m)} / ${a} kcal
              </span>
            </div>
          </div>
          <div class="history-day-items" id="day-items-${t}" style="display:none;margin-top:var(--space-sm);">
            ${o.map(h=>{const w=h.productId?N(h.productId):null;return`
                <div class="consumption-item" style="padding:var(--space-xs) 0;">
                  <div class="consumption-item-info">
                    <div class="consumption-item-name" style="font-size:var(--font-xs);">${(w==null?void 0:w.name)||h.productNameBackup||"Produit inconnu"}</div>
                    <div class="consumption-item-detail">${h.grams}g</div>
                  </div>
                  <div style="font-size:var(--font-sm);font-weight:var(--fw-semibold);">${Math.round(h.calories)} kcal</div>
                </div>
              `}).join("")}
          </div>
        </div>
      `}v||(v=`
        <div class="empty-state">
          <div class="empty-state-icon">📊</div>
          <div class="empty-state-title">Aucune donnée</div>
          <div class="empty-state-desc">Commencez à enregistrer vos repas pour voir votre historique.</div>
        </div>
      `),c.innerHTML=v,c.querySelectorAll("[data-toggle-day]").forEach(u=>{u.addEventListener("click",()=>{const s=u.dataset.toggleDay,t=c.querySelector(`#day-items-${s}`);t&&(t.style.display=t.style.display==="none"?"block":"none")})})}return g(),()=>{r&&(r.destroy(),r=null)}}function Re(e){const n=_();Z();let a=!1,i=n?{...n}:{};function r(){const E=G();e.innerHTML=`
      <div class="settings-view">
        <div class="view-header">
          <h1 style="font-size:var(--font-2xl);">Réglages</h1>
        </div>
        
        <div style="padding:0 var(--space-md);">
          
          <!-- Profile Section -->
          <div class="card-glass mb-md">
            <div class="flex-between mb-md">
              <h3 style="font-size:var(--font-lg);">👤 Mon profil</h3>
              <button class="btn btn-ghost btn-sm" id="btn-toggle-edit">
                ${a?"✕ Annuler":"✏️ Modifier"}
              </button>
            </div>
            
            ${a?$():g()}
          </div>
          
          <!-- Calorie Info -->
          ${n?`
            <div class="card-glass mb-md">
              <h3 style="font-size:var(--font-lg);margin-bottom:var(--space-sm);">🎯 Objectif calorique</h3>
              <div class="flex-between mb-sm">
                <span class="text-secondary" style="font-size:var(--font-sm);">Métabolisme de base</span>
                <strong>${n.bmr||"–"} kcal</strong>
              </div>
              <div class="flex-between mb-sm">
                <span class="text-secondary" style="font-size:var(--font-sm);">Dépense totale (TDEE)</span>
                <strong>${n.tdee||"–"} kcal</strong>
              </div>
              <div class="flex-between mb-sm">
                <span class="text-secondary" style="font-size:var(--font-sm);">Déficit quotidien</span>
                <strong>${n.dailyDeficit||"–"} kcal</strong>
              </div>
              <div class="divider"></div>
              <div class="flex-between">
                <span style="font-weight:var(--fw-semibold);">Objectif quotidien</span>
                <span class="badge badge-accent" style="font-size:var(--font-md);">${n.dailyTarget||"–"} kcal</span>
              </div>
              
              <div style="margin-top:var(--space-md);padding:var(--space-sm);background:var(--accent-light);border-radius:var(--radius-md);">
                <p style="font-size:var(--font-xs);color:var(--text-secondary);">
                  💡 <strong>Comment est calculé votre objectif ?</strong><br/>
                  Formule de Mifflin-St Jeor pour le métabolisme de base, 
                  multiplié par votre niveau d'activité (TDEE). 
                  Ensuite, un déficit est calculé pour atteindre votre objectif en ${n.duration||"?"} mois 
                  (1 kg ≈ 7 700 kcal). Minimum : 1 200 kcal/jour.
                </p>
              </div>
            </div>
          `:""}
          
          <!-- Theme -->
          <div class="card-glass mb-md">
            <h3 style="font-size:var(--font-lg);margin-bottom:var(--space-sm);">🎨 Apparence</h3>
            <div class="toggle-container">
              <div>
                <strong>Mode sombre</strong>
                <p style="font-size:var(--font-xs);color:var(--text-tertiary);">Basculer entre le thème clair et sombre</p>
              </div>
              <button class="toggle-switch ${E==="dark"?"active":""}" id="btn-toggle-theme" aria-label="Mode sombre"></button>
            </div>
          </div>
          
          <!-- Data Management -->
          <div class="card-glass mb-md">
            <h3 style="font-size:var(--font-lg);margin-bottom:var(--space-sm);">💾 Données</h3>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);margin-bottom:var(--space-md);">
              Toutes vos données sont stockées localement sur cet appareil.
            </p>
            <button class="btn btn-danger btn-block btn-sm" id="btn-clear-data">
              🗑️ Supprimer toutes les données
            </button>
          </div>
          
          <!-- Backup -->
          <div class="card-glass mb-md">
            <h3 style="font-size:var(--font-lg);margin-bottom:var(--space-sm);">📦 Sauvegarde</h3>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);margin-bottom:var(--space-md);">
              Exportez vos données pour ne pas les perdre. Importez une sauvegarde existante.
            </p>
            <div class="flex gap-sm">
              <button class="btn btn-primary btn-sm" style="flex:1" id="btn-export-data">
                📤 Exporter
              </button>
              <button class="btn btn-secondary btn-sm" style="flex:1" id="btn-import-data">
                📥 Importer
              </button>
            </div>
            <input type="file" id="file-import" accept=".json" style="display:none;" />
          </div>
          
          <!-- About -->
          <div class="card-glass mb-lg">
            <h3 style="font-size:var(--font-lg);margin-bottom:var(--space-sm);">ℹ️ À propos</h3>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">
              <strong>Mon Suivi Calories</strong> v1.0<br/>
              Application PWA de suivi calorique.<br/>
              Données 100% locales, aucun serveur externe.
            </p>
          </div>
          
        </div>
      </div>
    `,S()}function g(){if(!n)return'<p class="text-secondary">Aucun profil configuré</p>';const E=n.sex==="homme"?"👨 Homme":"👩 Femme",f={sedentary:"Sédentaire",light:"Léger",moderate:"Modéré",active:"Actif","very-active":"Très actif"};return`
      <div class="profile-summary">
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Sexe</span>
          <strong>${E}</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Âge</span>
          <strong>${n.age} ans</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Taille</span>
          <strong>${n.height} cm</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Poids actuel</span>
          <strong>${n.weight} kg</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Objectif</span>
          <strong>${n.goalWeight} kg</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Durée</span>
          <strong>${n.duration} mois</strong>
        </div>
        <div class="flex-between">
          <span class="text-secondary" style="font-size:var(--font-sm);">Activité</span>
          <strong>${f[n.activityLevel]||"Sédentaire"}</strong>
        </div>
      </div>
    `}function $(){const E=[{value:"sedentary",label:"Sédentaire"},{value:"light",label:"Léger"},{value:"moderate",label:"Modéré"},{value:"active",label:"Actif"}];return`
      <div class="edit-form">
        <div class="input-group mb-sm">
          <label class="input-label">Sexe</label>
          <div class="select-group">
            <button class="select-option ${i.sex==="femme"?"active":""}" data-edit-sex="femme">👩 Femme</button>
            <button class="select-option ${i.sex==="homme"?"active":""}" data-edit-sex="homme">👨 Homme</button>
          </div>
        </div>
        
        <div class="flex gap-sm mb-sm">
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-age">Âge</label>
            <input class="input-field" type="number" id="edit-age" value="${i.age}" inputmode="numeric" />
          </div>
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-height">Taille (cm)</label>
            <input class="input-field" type="number" id="edit-height" value="${i.height}" inputmode="numeric" />
          </div>
        </div>
        
        <div class="flex gap-sm mb-sm">
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-weight">Poids (kg)</label>
            <input class="input-field" type="number" id="edit-weight" value="${i.weight}" step="0.1" inputmode="decimal" />
          </div>
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-goal">Objectif (kg)</label>
            <input class="input-field" type="number" id="edit-goal" value="${i.goalWeight}" step="0.1" inputmode="decimal" />
          </div>
        </div>
        
        <div class="input-group mb-sm">
          <label class="input-label" for="edit-duration">Durée (mois)</label>
          <input class="input-field" type="number" id="edit-duration" value="${i.duration}" inputmode="numeric" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label">Activité</label>
          <div class="select-group" style="flex-wrap:wrap;">
            ${E.map(f=>`
              <button class="select-option ${i.activityLevel===f.value?"active":""}" data-edit-activity="${f.value}" style="flex:1 1 45%;">${f.label}</button>
            `).join("")}
          </div>
        </div>
        
        <button class="btn btn-primary btn-block" id="btn-save-profile">💾 Enregistrer</button>
      </div>
    `}function S(){var f,L,c,d,l,v,u,s;(f=e.querySelector("#btn-toggle-edit"))==null||f.addEventListener("click",()=>{a=!a,a&&n&&(i={...n}),r()}),e.querySelectorAll("[data-edit-sex]").forEach(t=>{t.addEventListener("click",()=>{i.sex=t.dataset.editSex,r()})}),e.querySelectorAll("[data-edit-activity]").forEach(t=>{t.addEventListener("click",()=>{i.activityLevel=t.dataset.editActivity,r()})});const E={"edit-age":"age","edit-height":"height","edit-weight":"weight","edit-goal":"goalWeight","edit-duration":"duration"};for(const[t,o]of Object.entries(E))(L=e.querySelector(`#${t}`))==null||L.addEventListener("input",m=>{i[o]=m.target.value});(c=e.querySelector("#btn-save-profile"))==null||c.addEventListener("click",()=>{const t={...i,age:parseInt(i.age),weight:parseFloat(i.weight),height:parseInt(i.height)||170,goalWeight:parseFloat(i.goalWeight),duration:parseInt(i.duration)},o=Q(t);ce({...t,bmr:o.bmr,tdee:o.tdee,dailyDeficit:o.dailyDeficit,dailyTarget:o.dailyTarget}),a=!1,k("Profil mis à jour ! Objectif recalculé.","success"),r()}),(d=e.querySelector("#btn-toggle-theme"))==null||d.addEventListener("click",()=>{const o=G()==="light"?"dark":"light";Se(o),r()}),(l=e.querySelector("#btn-clear-data"))==null||l.addEventListener("click",()=>{confirm("Êtes-vous sûr(e) de vouloir supprimer toutes les données ? Cette action est irréversible.")&&(Ee(),k("Toutes les données ont été supprimées","info"),window.location.hash="",window.location.reload())}),(v=e.querySelector("#btn-export-data"))==null||v.addEventListener("click",()=>{try{const t=xe(),o=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),m=URL.createObjectURL(o),b=document.createElement("a"),p=new Date().toISOString().split("T")[0];b.href=m,b.download=`trackercal-backup-${p}.json`,document.body.appendChild(b),b.click(),document.body.removeChild(b),URL.revokeObjectURL(m),k("Sauvegarde créée avec succès !","success")}catch{k("Erreur lors de l'exportation","error")}}),(u=e.querySelector("#btn-import-data"))==null||u.addEventListener("click",()=>{var t;(t=e.querySelector("#file-import"))==null||t.click()}),(s=e.querySelector("#file-import"))==null||s.addEventListener("change",async t=>{var m;const o=(m=t.target.files)==null?void 0:m[0];if(o){try{const b=await o.text(),p=JSON.parse(b);if(!p.version)throw new Error("Format invalide");confirm("Cette action remplacera toutes vos données actuelles. Voulez-vous continuer ?")&&($e(p),k("Données importées avec succès !","success"),setTimeout(()=>window.location.reload(),1500))}catch{k("Erreur : fichier invalide","error")}t.target.value=""}})}return r(),()=>{}}const K=document.getElementById("app");let pe=null,I=null;const Fe=[{id:"dashboard",icon:"🏠",label:"Accueil"},{id:"products",icon:"🍎",label:"Produits"},{id:"history",icon:"📊",label:"Historique"},{id:"settings",icon:"⚙️",label:"Réglages"}];function Ne(){if(!De())return;Pe();const e=`
🔄 <b>Rappel de Sauvegarde</b>

Vos données sont stockées uniquement dans ce navigateur. 
En cas de suppression des données ou de changement d'appareil, vous pourriez tout perdre !

<b>Comment sauvegarder :</b>
1. Allez dans <b>Réglages</b> (⚙️)
2. Cliquez sur <b>Exporter les Données</b>
3. Sauvegardez le fichier JSON en lieu sûr

<b>Fréquence recommandée :</b> Une fois par semaine
    `.trim();setTimeout(()=>{k(e,"warning",8e3)},1500)}function Be(){const e=G();document.documentElement.setAttribute("data-theme",e),Ne(),window.addEventListener("hashchange",re),de()?re():Y("onboarding"),X("profile:updated",()=>{pe==="onboarding"&&B("dashboard")})}function re(){if(!de()){Y("onboarding");return}const e=window.location.hash.slice(1)||"dashboard",[n,...a]=e.split("/");Y(n,a)}function B(e,n=[]){const a=n.length?`${e}/${n.join("/")}`:e;window.location.hash=a}function Y(e,n=[]){I&&(I(),I=null),pe=e;const a=document.createElement("div");switch(a.className="view-container view-enter",a.id="view-container",K.innerHTML="",K.appendChild(a),e){case"onboarding":I=Te(a);break;case"dashboard":I=oe(a),W("dashboard");break;case"products":I=Ae(a,n),W("products");break;case"history":I=Oe(a),W("history");break;case"settings":I=Re(a),W("settings");break;default:I=oe(a),W("dashboard")}}function W(e){const n=document.querySelector(".nav-bar");n&&n.remove();const a=document.createElement("nav");a.className="nav-bar",a.innerHTML=Fe.map(i=>`
    <button class="nav-item ${i.id===e?"active":""}" data-view="${i.id}" aria-label="${i.label}">
      <span class="nav-item-icon">${i.icon}</span>
      <span>${i.label}</span>
    </button>
  `).join(""),a.addEventListener("click",i=>{const r=i.target.closest(".nav-item");if(!r)return;const g=r.dataset.view;B(g)}),K.appendChild(a)}Be();
