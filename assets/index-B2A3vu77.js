(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const v of r)if(v.type==="childList")for(const $ of v.addedNodes)$.tagName==="LINK"&&$.rel==="modulepreload"&&o($)}).observe(document,{childList:!0,subtree:!0});function e(r){const v={};return r.integrity&&(v.integrity=r.integrity),r.referrerPolicy&&(v.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?v.credentials="include":r.crossOrigin==="anonymous"?v.credentials="omit":v.credentials="same-origin",v}function o(r){if(r.ep)return;r.ep=!0;const v=e(r);fetch(r.href,v)}})();const P={PROFILE:"tcv2_profile",PRODUCTS:"tcv2_products",CONSUMPTIONS:"tcv2_consumptions",SETTINGS:"tcv2_settings"};function re(){return Date.now().toString(36)+Math.random().toString(36).substr(2,9)}function U(t,s=null){try{const e=localStorage.getItem(t);return e?JSON.parse(e):s}catch{return s}}function F(t,s){localStorage.setItem(t,JSON.stringify(s))}function pe(){return new Date().toISOString().split("T")[0]}const A={};function X(t,s){return A[t]||(A[t]=[]),A[t].push(s),()=>{A[t]=A[t].filter(e=>e!==s)}}function I(t,s){A[t]&&A[t].forEach(e=>e(s))}function W(){return U(P.PROFILE,null)}function le(t){const s={...t,updatedAt:new Date().toISOString()};return F(P.PROFILE,s),I("profile:updated",s),s}function ce(){return W()!==null}function V(){return U(P.PRODUCTS,[])}function N(t){return V().find(s=>s.id===t)||null}function ee(t){const s=V(),e={id:re(),name:t.name||"",description:t.description||"",caloriesPer100g:parseFloat(t.caloriesPer100g)||0,photo:t.photo||null,createdAt:new Date().toISOString()};return s.unshift(e),F(P.PRODUCTS,s),I("products:updated",s),e}function me(t,s){const e=V(),o=e.findIndex(r=>r.id===t);return o===-1?null:(e[o]={...e[o],...s,updatedAt:new Date().toISOString()},F(P.PRODUCTS,e),I("products:updated",e),e[o])}function ve(t){const s=V().filter(e=>e.id!==t);F(P.PRODUCTS,s),I("products:updated",s)}function O(t=null){const s=U(P.CONSUMPTIONS,[]);return t?s.filter(e=>e.date===t):s}function ge(t){const s=O(),e={id:re(),productId:t.productId||null,productNameBackup:t.productNameBackup||"",productPhotoBackup:t.productPhotoBackup||null,caloriesPer100gBackup:t.caloriesPer100gBackup||0,grams:parseFloat(t.grams)||0,calories:parseFloat(t.calories)||0,meal:t.meal||"collation",notes:t.notes||"",date:t.date||pe(),createdAt:new Date().toISOString()};return s.unshift(e),F(P.CONSUMPTIONS,s),I("consumptions:updated",s),e}function be(t){const s=O().filter(e=>e.id!==t);F(P.CONSUMPTIONS,s),I("consumptions:updated",s)}function fe(t,s){return O().filter(o=>o.date>=t&&o.date<=s)}function Z(){return U(P.SETTINGS,{theme:"light",notifications:!1})}function he(t){const s={...Z(),...t};return F(P.SETTINGS,s),I("settings:updated",s),s}function J(){return Z().theme||"light"}function ye(t){he({theme:t}),document.documentElement.setAttribute("data-theme",t)}function we(t){const s=W(),e=O(t),o=e.reduce((k,b)=>k+b.calories,0),r=(s==null?void 0:s.dailyTarget)||0,v={"petit-dejeuner":[],dejeuner:[],diner:[],collation:[]};e.forEach(k=>{const b=k.meal||"collation";v[b]?v[b].push(k):v.collation.push(k)});const $={"petit-dejeuner":"🌅 Petit-déjeuner",dejeuner:"☀️ Déjeuner",diner:"🌙 Dîner",collation:"🍪 Collation"};let w=`📊 Mon Suivi Calories – ${t}
`;w+=`━━━━━━━━━━━━━━━━━━━━
`,w+=`🎯 Objectif : ${Math.round(r)} kcal
`,w+=`📈 Consommé : ${Math.round(o)} kcal
`,w+=`${o<=r?"✅":"⚠️"} ${o<=r?"Objectif respecté !":"Objectif dépassé !"}

`;for(const[k,b]of Object.entries(v))b.length!==0&&(w+=`${$[k]}
`,b.forEach(E=>{w+=`  • ${E.productNameBackup} – ${E.grams}g – ${Math.round(E.calories)} kcal
`}),w+=`
`);return w}function xe(){Object.values(P).forEach(t=>localStorage.removeItem(t)),I("data:cleared")}function Se(t,s,e,o){const r=10*e+6.25*o-5*t;return s==="homme"?r+5:r-161}function $e(t,s="sedentary"){return t*({sedentary:1.2,light:1.375,moderate:1.55,active:1.725,"very-active":1.9}[s]||1.2)}function Q(t){const{age:s,sex:e,weight:o,height:r,goalWeight:v,duration:$,activityLevel:w}=t,k=Se(s,e,o,r||170),b=$e(k,w||"sedentary"),E=o-v,u=$*30;let p=0;E>0&&u>0&&(p=E*7700/u);let l=b-p;return l<1200&&(l=1200),l>b+1e3&&(l=b+1e3),{bmr:Math.round(k),tdee:Math.round(b),dailyDeficit:Math.round(p),dailyTarget:Math.round(l)}}function te(t,s){return t*s/100}function ae(t){return t*.23900573614}let _=null;function ke(){return _||(_=document.createElement("div"),_.className="toast-container",document.body.appendChild(_)),_}function L(t,s="info",e=3e3){const o={success:"✅",error:"❌",warning:"⚠️",info:"ℹ️"},r=document.createElement("div");r.className="toast",r.innerHTML=`
    <span class="toast-icon">${o[s]||o.info}</span>
    <span class="toast-message">${t}</span>
  `,ke().appendChild(r),setTimeout(()=>{r.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>r.remove(),300)},e)}const G=[{id:"welcome",title:"Bienvenue ! 🌸",subtitle:"Configurons votre profil pour calculer votre objectif calorique quotidien."},{id:"basics",title:"Informations de base",subtitle:"Ces données nous aident à calculer votre métabolisme."},{id:"goals",title:"Votre objectif",subtitle:"Définissez votre poids cible et la durée souhaitée."},{id:"summary",title:"Votre plan",subtitle:"Voici votre objectif calorique calculé."}];function Ee(t){let s=0,e={age:"",sex:"femme",weight:"",height:"170",goalWeight:"",duration:"3",activityLevel:"sedentary"};function o(){const l=G[s];t.innerHTML=`
      <div class="onboarding">
        <div class="onboarding-header">
          <div class="onboarding-progress">
            ${G.map((d,c)=>`
              <div class="onboarding-dot ${c<=s?"active":""}"></div>
            `).join("")}
          </div>
          <h2 class="onboarding-title anim-fade-in">${l.title}</h2>
          <p class="onboarding-subtitle anim-fade-in">${l.subtitle}</p>
        </div>
        <div class="onboarding-body anim-slide-up">
          ${r()}
        </div>
        <div class="onboarding-footer">
          ${s>0?'<button class="btn btn-ghost" id="btn-prev">← Retour</button>':"<div></div>"}
          ${s<G.length-1?'<button class="btn btn-primary" id="btn-next">Suivant →</button>':'<button class="btn btn-primary btn-lg" id="btn-finish">🚀 Commencer !</button>'}
        </div>
      </div>
    `,E()}function r(){switch(s){case 0:return v();case 1:return $();case 2:return w();case 3:return k();default:return""}}function v(){return`
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
            <button class="select-option ${e.sex==="femme"?"active":""}" data-sex="femme">👩 Femme</button>
            <button class="select-option ${e.sex==="homme"?"active":""}" data-sex="homme">👨 Homme</button>
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label" for="onb-age">Âge</label>
          <input class="input-field" type="number" id="onb-age" placeholder="Ex : 30" 
                 value="${e.age}" min="15" max="100" inputmode="numeric" />
        </div>
        
        <div class="flex gap-md">
          <div class="input-group" style="flex:1">
            <label class="input-label" for="onb-height">Taille (cm)</label>
            <input class="input-field" type="number" id="onb-height" placeholder="170" 
                   value="${e.height}" min="100" max="250" inputmode="numeric" />
          </div>
          <div class="input-group" style="flex:1">
            <label class="input-label" for="onb-weight">Poids actuel (kg)</label>
            <input class="input-field" type="number" id="onb-weight" placeholder="70" 
                   value="${e.weight}" min="30" max="300" step="0.1" inputmode="decimal" />
          </div>
        </div>
        
        <div class="input-group">
          <label class="input-label">Niveau d'activité</label>
          <div class="activity-levels">
            ${l.map(d=>`
              <button class="activity-option ${e.activityLevel===d.value?"active":""}" data-activity="${d.value}">
                <strong>${d.label}</strong>
                <small>${d.desc}</small>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `}function w(){return`
      <div class="onboarding-form">
        <div class="input-group">
          <label class="input-label" for="onb-goal">Objectif de poids (kg)</label>
          <input class="input-field" type="number" id="onb-goal" placeholder="Ex : 65" 
                 value="${e.goalWeight}" min="30" max="300" step="0.1" inputmode="decimal" />
          <span class="input-hint">Le poids que vous aimeriez atteindre</span>
        </div>
        
        <div class="input-group">
          <label class="input-label" for="onb-duration">Durée (mois)</label>
          <input class="input-field" type="number" id="onb-duration" placeholder="Ex : 3" 
                 value="${e.duration}" min="1" max="24" inputmode="numeric" />
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
    `}function k(){const l=Q({age:parseInt(e.age)||30,sex:e.sex,weight:parseFloat(e.weight)||70,height:parseInt(e.height)||170,goalWeight:parseFloat(e.goalWeight)||65,duration:parseInt(e.duration)||3,activityLevel:e.activityLevel}),d=(parseFloat(e.weight)||70)-(parseFloat(e.goalWeight)||65),c=d>0;return`
      <div class="onboarding-summary">
        <div class="summary-target-card card-glass-heavy">
          <div class="summary-target-icon">${c?"📉":"📈"}</div>
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
              <span class="text-secondary" style="font-size:var(--font-sm);">${c?"Déficit":"Surplus"} quotidien</span>
              <strong>${Math.abs(l.dailyDeficit)} kcal</strong>
            </div>
          </div>
          <div class="card-glass">
            <div class="flex-between">
              <span class="text-secondary" style="font-size:var(--font-sm);">${c?"Perte":"Gain"} visé${c?"e":""}</span>
              <strong>${Math.abs(d).toFixed(1)} kg en ${e.duration} mois</strong>
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
    `}function b(){const l={"onb-age":"age","onb-height":"height","onb-weight":"weight","onb-goal":"goalWeight","onb-duration":"duration"};for(const[d,c]of Object.entries(l)){const n=t.querySelector(`#${d}`);n&&(e[c]=n.value)}}function E(){t.querySelectorAll("[data-sex]").forEach(a=>{a.addEventListener("click",()=>{b(),e.sex=a.dataset.sex,o()})}),t.querySelectorAll("[data-activity]").forEach(a=>{a.addEventListener("click",()=>{b(),e.activityLevel=a.dataset.activity,o()})});const l={"onb-age":"age","onb-height":"height","onb-weight":"weight","onb-goal":"goalWeight","onb-duration":"duration"};for(const[a,i]of Object.entries(l)){const g=t.querySelector(`#${a}`);g&&g.addEventListener("input",()=>{e[i]=g.value})}const d=t.querySelector("#btn-next"),c=t.querySelector("#btn-prev"),n=t.querySelector("#btn-finish");d&&d.addEventListener("click",()=>{b(),u()&&(s++,o())}),c&&c.addEventListener("click",()=>{b(),s--,o()}),n&&n.addEventListener("click",()=>{b(),p()})}function u(){switch(s){case 1:return!e.age||parseInt(e.age)<15?(L("Veuillez entrer un âge valide (15+)","warning"),!1):!e.weight||parseFloat(e.weight)<30?(L("Veuillez entrer un poids valide","warning"),!1):!0;case 2:return!e.goalWeight||parseFloat(e.goalWeight)<30?(L("Veuillez entrer un objectif de poids valide","warning"),!1):!e.duration||parseInt(e.duration)<1?(L("Veuillez entrer une durée valide (minimum 1 mois)","warning"),!1):!0;default:return!0}}function p(){const l=Q({age:parseInt(e.age),sex:e.sex,weight:parseFloat(e.weight),height:parseInt(e.height)||170,goalWeight:parseFloat(e.goalWeight),duration:parseInt(e.duration),activityLevel:e.activityLevel});le({...e,age:parseInt(e.age),weight:parseFloat(e.weight),height:parseInt(e.height)||170,goalWeight:parseFloat(e.goalWeight),duration:parseInt(e.duration),bmr:l.bmr,tdee:l.tdee,dailyDeficit:l.dailyDeficit,dailyTarget:l.dailyTarget}),L("Profil créé avec succès ! 🎉","success")}return o(),()=>{}}const se={"petit-dejeuner":{icon:"🌅",label:"Petit-déjeuner"},dejeuner:{icon:"☀️",label:"Déjeuner"},diner:{icon:"🌙",label:"Dîner"},collation:{icon:"🍪",label:"Collation"}};function ne(t){const s=W(),e=new Date().toISOString().split("T")[0];let o=e;const r=[];function v(){const u=O(o),p=u.reduce((x,y)=>x+(y.calories||0),0),l=(s==null?void 0:s.dailyTarget)||2e3,d=Math.min(p/l*100,100),c=p>l,n=l-p,a={};for(const x of Object.keys(se))a[x]=u.filter(y=>y.meal===x);const i=new Date(o+"T12:00:00"),g=o===e,h=g?"Aujourd'hui":i.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"}),m=2*Math.PI*54,f=m-d/100*m;t.innerHTML=`
      <div class="dashboard">
        <!-- Header -->
        <div class="view-header">
          <div>
            <h1 style="font-size:var(--font-2xl);">Mon Suivi</h1>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">${h}</p>
          </div>
          <div class="flex gap-sm">
            <button class="btn btn-icon btn-secondary" id="btn-date-prev" aria-label="Jour précédent">←</button>
            ${g?"":'<button class="btn btn-sm btn-ghost" id="btn-date-today">Auj.</button>'}
            <button class="btn btn-icon btn-secondary" id="btn-date-next" aria-label="Jour suivant" ${g?'disabled style="opacity:0.4"':""}>→</button>
          </div>
        </div>
        
        <!-- Calorie Ring -->
        <div class="dashboard-ring-section ${c?"over-target-glow":""}" style="text-align:center;padding:var(--space-md);">
          <div class="progress-ring-container">
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle class="progress-ring-bg" cx="60" cy="60" r="54" />
              <circle class="progress-ring-fill ${c?"over-target":""}" cx="60" cy="60" r="54" 
                      stroke-dasharray="${m}" 
                      stroke-dashoffset="${f}" />
            </svg>
            <div class="progress-ring-text">
              <span class="progress-ring-value" style="${c?"color:var(--danger)":""}">${Math.round(p)}</span>
              <span class="progress-ring-label">/ ${l} kcal</span>
            </div>
          </div>
          
          <div class="flex-center gap-lg" style="margin-top:var(--space-md);">
            <div style="text-align:center;">
              <div style="font-size:var(--font-2xl);font-weight:var(--fw-bold);color:${c?"var(--danger)":n>0?"var(--success)":"var(--text-primary)"};">
                ${c?"+":""}${Math.abs(Math.round(n))}
              </div>
              <small>${c?"kcal en trop":"kcal restantes"}</small>
            </div>
          </div>
          
          ${c?`
            <div class="warning-banner" style="margin-top:var(--space-md);">
              <span class="warning-banner-icon">⚠️</span>
              <span class="warning-banner-text">Vous avez dépassé votre objectif de ${Math.round(p-l)} kcal</span>
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
          ${Object.entries(se).map(([x,y])=>{const S=a[x]||[],q=S.reduce((D,T)=>D+(T.calories||0),0);return`
              <div class="meal-group card-glass" style="margin-bottom:var(--space-sm);">
                <div class="meal-group-header" data-meal-toggle="${x}">
                  <span class="meal-group-title">${y.icon} ${y.label}</span>
                  <span class="meal-group-cal">${S.length>0?Math.round(q)+" kcal":""}</span>
                </div>
                <div class="meal-group-items" id="meal-items-${x}">
                  ${S.length===0?`
                    <div style="text-align:center;padding:var(--space-sm);color:var(--text-tertiary);font-size:var(--font-sm);">
                      Appuyez sur + pour ajouter
                    </div>
                  `:S.map(D=>$(D)).join("")}
                </div>
                <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:var(--space-xs);" data-add-meal="${x}">
                  + Ajouter
                </button>
              </div>
            `}).join("")}
        </div>
      </div>
    `,w()}function $(u){const p=u.productId?N(u.productId):null,l=(p==null?void 0:p.photo)||u.productPhotoBackup,d=(p==null?void 0:p.name)||u.productNameBackup||"Produit inconnu";return`
      <div class="consumption-item" data-consumption-id="${u.id}">
        ${l?`<img class="consumption-item-photo" src="${l}" alt="${d}" loading="lazy" />`:'<div class="consumption-item-photo flex-center" style="font-size:16px;">🍽️</div>'}
        <div class="consumption-item-info">
          <div class="consumption-item-name">${d}</div>
          <div class="consumption-item-detail">${u.grams}g${u.notes?" · "+u.notes:""}</div>
        </div>
        <div class="consumption-item-cal">${Math.round(u.calories)}</div>
        <div class="consumption-item-actions">
          <button class="btn btn-ghost btn-sm" data-edit-consumption="${u.id}" aria-label="Modifier">✏️</button>
          <button class="btn btn-ghost btn-sm" data-delete-consumption="${u.id}" aria-label="Supprimer">🗑️</button>
        </div>
      </div>
    `}function w(){var u,p,l,d,c;(u=t.querySelector("#btn-date-prev"))==null||u.addEventListener("click",()=>{const n=new Date(o+"T12:00:00");n.setDate(n.getDate()-1),o=n.toISOString().split("T")[0],v()}),(p=t.querySelector("#btn-date-next"))==null||p.addEventListener("click",()=>{const n=new Date(o+"T12:00:00");n.setDate(n.getDate()+1);const a=n.toISOString().split("T")[0];a<=e&&(o=a,v())}),(l=t.querySelector("#btn-date-today"))==null||l.addEventListener("click",()=>{o=e,v()}),(d=t.querySelector("#btn-add-food"))==null||d.addEventListener("click",()=>{R("products",["select"])}),t.querySelectorAll("[data-add-meal]").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.addMeal;R("products",["select",a])})}),(c=t.querySelector("#btn-export"))==null||c.addEventListener("click",()=>{const n=we(o);if(navigator.clipboard)navigator.clipboard.writeText(n).then(()=>{L("Résumé copié dans le presse-papiers ! 📋","success")});else{const a=document.createElement("textarea");a.value=n,document.body.appendChild(a),a.select(),document.execCommand("copy"),document.body.removeChild(a),L("Résumé copié ! 📋","success")}}),t.querySelectorAll("[data-edit-consumption]").forEach(n=>{n.addEventListener("click",a=>{a.stopPropagation();const i=n.dataset.editConsumption;k(i)})}),t.querySelectorAll("[data-delete-consumption]").forEach(n=>{n.addEventListener("click",a=>{a.stopPropagation();const i=n.dataset.deleteConsumption;confirm("Supprimer ce repas ?")&&(be(i),L("Repas supprimé","info"),v())})})}function k(u){const{getConsumption:p}=b(),l=p(u);if(!l)return;const d=l.productId?N(l.productId):null,c=l.productId&&!d,n=(d==null?void 0:d.name)||l.productNameBackup||"Produit inconnu",a=(d==null?void 0:d.caloriesPer100g)||l.caloriesPer100gBackup||0,i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-edit">✕</button>
        <h3 class="modal-title">Modifier la consommation</h3>
        
        ${c?`
          <div class="warning-banner mb-md">
            <span class="warning-banner-icon">⚠️</span>
            <span class="warning-banner-text">Produit supprimé – vous ne pouvez modifier que la quantité et les calories.</span>
          </div>
        `:""}
        
        <div class="card-glass mb-md">
          <strong>${n}</strong>
          ${c?"":`<p style="font-size:var(--font-sm);color:var(--text-tertiary);">${a} kcal / 100 g</p>`}
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="edit-grams">Quantité (grammes)</label>
          <input class="input-field" type="number" id="edit-grams" value="${l.grams}" min="1" inputmode="numeric" />
        </div>
        
        ${c?`
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
    `,document.body.appendChild(i);const g=i.querySelector("#edit-grams"),h=i.querySelector("#edit-cal-preview");g&&h&&!c&&g.addEventListener("input",()=>{const f=parseFloat(g.value)||0;h.textContent=Math.round(a*f/100)+" kcal"});const m=()=>i.remove();i.querySelector("#modal-close-edit").addEventListener("click",m),i.addEventListener("click",f=>{f.target===i&&m()}),i.querySelector("#btn-save-edit").addEventListener("click",()=>{parseFloat(g.value),i.querySelector("#edit-notes").value,c&&parseFloat(i.querySelector("#edit-calories").value),L("Consommation modifiée ✅","success"),m(),v()})}function b(){return{getConsumption:u=>O().find(p=>p.id===u),updateConsumption:(u,p)=>{},getProduct:N}}const E=X("consumptions:updated",()=>v());return r.push(E),v(),()=>{r.forEach(u=>u())}}const Le="modulepreload",De=function(t){return"/trackercal/"+t},oe={},de=function(s,e,o){let r=Promise.resolve();if(e&&e.length>0){let $=function(b){return Promise.all(b.map(E=>Promise.resolve(E).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const w=document.querySelector("meta[property=csp-nonce]"),k=(w==null?void 0:w.nonce)||(w==null?void 0:w.getAttribute("nonce"));r=$(e.map(b=>{if(b=De(b),b in oe)return;oe[b]=!0;const E=b.endsWith(".css"),u=E?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${b}"]${u}`))return;const p=document.createElement("link");if(p.rel=E?"stylesheet":Le,E||(p.as="script"),p.crossOrigin="",p.href=b,k&&p.setAttribute("nonce",k),document.head.appendChild(p),E)return new Promise((l,d)=>{p.addEventListener("load",l),p.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${b}`)))})}))}function v($){const w=new Event("vite:preloadError",{cancelable:!0});if(w.payload=$,window.dispatchEvent(w),!w.defaultPrevented)throw $}return r.then($=>{for(const w of $||[])w.status==="rejected"&&v(w.reason);return s().catch(v)})};async function Pe(t){try{const s=await fetch(`https://world.openfoodfacts.org/api/v2/product/${t}`,{headers:{"User-Agent":"MonSuiviCalories/1.0"}});if(!s.ok)return null;const e=await s.json();if(e.status!==1||!e.product)return null;const o=e.product;let r=0;const v=o.nutriments||{};return v["energy-kcal_100g"]?r=parseFloat(v["energy-kcal_100g"]):v["energy-kcal"]?r=parseFloat(v["energy-kcal"]):v.energy_100g?r=Math.round(ae(parseFloat(v.energy_100g))):v.energy&&(r=Math.round(ae(parseFloat(v.energy)))),{name:o.product_name||o.product_name_fr||"Produit inconnu",image:o.image_front_url||o.image_front_small_url||null,caloriesPer100g:Math.round(r),brand:o.brands||"",barcode:t}}catch(s){return console.error("Erreur API Open Food Facts:",s),null}}function qe(t,s=[]){const e=s[0]==="select",o=s[1]||null;let r="";const v=[];function $(){const n=V(),a=r?n.filter(i=>i.name.toLowerCase().includes(r.toLowerCase())):n;t.innerHTML=`
      <div class="products-view">
        <div class="view-header">
          <div>
            <h1 style="font-size:var(--font-2xl);">${e?"Choisir un aliment":"Mes Produits"}</h1>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">${n.length} produit${n.length!==1?"s":""}</p>
          </div>
          ${e?'<button class="btn btn-ghost" id="btn-back-dash">✕</button>':""}
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
          ${a.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">🍎</div>
              <div class="empty-state-title">${r?"Aucun résultat":"Aucun produit"}</div>
              <div class="empty-state-desc">
                ${r?"Essayez un autre terme de recherche ou ajoutez un nouveau produit.":"Ajoutez votre premier aliment en appuyant sur le bouton ci-dessus."}
              </div>
            </div>
          `:a.map(i=>w(i)).join("")}
        </div>
      </div>
    `,k()}function w(n){return`
      <div class="product-card" data-product-id="${n.id}">
        ${n.photo?`<img class="product-card-photo" src="${n.photo}" alt="${n.name}" loading="lazy" />`:'<div class="product-card-photo">🍽️</div>'}
        <div class="product-card-info">
          <div class="product-card-name">${n.name}</div>
          ${n.description?`<div class="product-card-desc">${n.description}</div>`:""}
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div class="product-card-cal">${n.caloriesPer100g} kcal</div>
          <small style="color:var(--text-tertiary);">/ 100 g</small>
        </div>
        ${e?"":`
          <div class="product-card-actions" style="flex-direction:column;">
            <button class="btn btn-ghost btn-sm" data-edit-product="${n.id}" style="padding:4px 6px;">✏️</button>
            <button class="btn btn-ghost btn-sm" data-delete-product="${n.id}" style="padding:4px 6px;">🗑️</button>
          </div>
        `}
      </div>
    `}function k(){var a,i,g;const n=t.querySelector("#product-search");n&&n.addEventListener("input",h=>{r=h.target.value,$();const m=t.querySelector("#product-search");m&&(m.focus(),m.setSelectionRange(r.length,r.length))}),(a=t.querySelector("#btn-back-dash"))==null||a.addEventListener("click",()=>{R("dashboard")}),(i=t.querySelector("#btn-add-product"))==null||i.addEventListener("click",()=>{b()}),(g=t.querySelector("#btn-scan-barcode"))==null||g.addEventListener("click",()=>{u()}),t.querySelectorAll(".product-card").forEach(h=>{h.addEventListener("click",m=>{if(m.target.closest("[data-edit-product]")||m.target.closest("[data-delete-product]"))return;const f=h.dataset.productId;e&&E(f)})}),t.querySelectorAll("[data-edit-product]").forEach(h=>{h.addEventListener("click",m=>{m.stopPropagation(),b(h.dataset.editProduct)})}),t.querySelectorAll("[data-delete-product]").forEach(h=>{h.addEventListener("click",m=>{m.stopPropagation(),confirm("Supprimer ce produit ? Les consommations associées seront conservées.")&&(ve(h.dataset.deleteProduct),L("Produit supprimé","info"),$())})})}function b(n=null){const a=n?N(n):null,i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-product">✕</button>
        <h3 class="modal-title">${a?"Modifier le produit":"Nouveau produit"}</h3>
        
        <div class="photo-upload mb-md" id="photo-upload-area">
          ${a!=null&&a.photo?`<img src="${a.photo}" alt="Photo" />`:""}
          <span class="photo-upload-icon" ${a!=null&&a.photo?'style="display:none"':""}>📷</span>
          <span class="photo-upload-text" ${a!=null&&a.photo?'style="display:none"':""}>Ajouter une photo</span>
          <input type="file" accept="image/*" capture="environment" id="photo-input" 
                 style="position:absolute;inset:0;opacity:0;cursor:pointer;" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="prod-name">Nom *</label>
          <input class="input-field" type="text" id="prod-name" placeholder="Ex : Pomme, Riz complet..." 
                 value="${(a==null?void 0:a.name)||""}" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="prod-desc">Description (optionnel)</label>
          <input class="input-field" type="text" id="prod-desc" placeholder="Ex : Bio, marque..." 
                 value="${(a==null?void 0:a.description)||""}" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label" for="prod-cal">Calories par 100 g *</label>
          <input class="input-field" type="number" id="prod-cal" placeholder="Ex : 52" 
                 value="${(a==null?void 0:a.caloriesPer100g)||""}" min="0" inputmode="numeric" />
        </div>
        
        <button class="btn btn-primary btn-block" id="btn-save-product">
          ${a?"💾 Enregistrer":"✅ Ajouter au catalogue"}
        </button>
      </div>
    `,document.body.appendChild(i);let g=(a==null?void 0:a.photo)||null;const h=i.querySelector("#photo-input"),m=i.querySelector("#photo-upload-area");h.addEventListener("change",x=>{const y=x.target.files[0];if(!y)return;const S=new FileReader;S.onload=q=>{const D=new Image;D.onload=()=>{const T=document.createElement("canvas"),z=400;let M=D.width,C=D.height;M>C?M>z&&(C*=z/M,M=z):C>z&&(M*=z/C,C=z),T.width=M,T.height=C,T.getContext("2d").drawImage(D,0,0,M,C),g=T.toDataURL("image/jpeg",.7);let B=m.querySelector("img");B||(B=document.createElement("img"),m.appendChild(B)),B.src=g,B.alt="Photo",m.querySelector(".photo-upload-icon").style.display="none",m.querySelector(".photo-upload-text").style.display="none"},D.src=q.target.result},S.readAsDataURL(y)});const f=()=>i.remove();i.querySelector("#modal-close-product").addEventListener("click",f),i.addEventListener("click",x=>{x.target===i&&f()}),i.querySelector("#btn-save-product").addEventListener("click",()=>{const x=i.querySelector("#prod-name").value.trim(),y=i.querySelector("#prod-desc").value.trim(),S=parseFloat(i.querySelector("#prod-cal").value);if(!x){L("Veuillez entrer un nom","warning");return}if(isNaN(S)||S<0){L("Veuillez entrer des calories valides","warning");return}a?(me(n,{name:x,description:y,caloriesPer100g:S,photo:g}),L("Produit modifié ✅","success")):(ee({name:x,description:y,caloriesPer100g:S,photo:g}),L("Produit ajouté au catalogue ! 🎉","success")),f(),$()})}function E(n){const a=N(n);if(!a)return;const i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-consumption">✕</button>
        <h3 class="modal-title">Ajouter une consommation</h3>
        
        <div class="card-glass mb-md flex gap-md" style="align-items:center;">
          ${a.photo?`<img src="${a.photo}" alt="${a.name}" style="width:48px;height:48px;border-radius:var(--radius-md);object-fit:cover;" />`:'<div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;font-size:20px;">🍽️</div>'}
          <div style="flex:1;">
            <strong>${a.name}</strong>
            <p style="font-size:var(--font-sm);color:var(--text-tertiary);">${a.caloriesPer100g} kcal / 100 g</p>
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
            <button class="select-option ${(o||"collation")==="petit-dejeuner"?"active":""}" data-meal="petit-dejeuner" style="flex:1 1 45%;">🌅 Petit-déj.</button>
            <button class="select-option ${(o||"collation")==="dejeuner"?"active":""}" data-meal="dejeuner" style="flex:1 1 45%;">☀️ Déjeuner</button>
            <button class="select-option ${(o||"collation")==="diner"?"active":""}" data-meal="diner" style="flex:1 1 45%;">🌙 Dîner</button>
            <button class="select-option ${!o||o==="collation"?"active":""}" data-meal="collation" style="flex:1 1 45%;">🍪 Collation</button>
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
    `,document.body.appendChild(i);let g=o||"collation";const h=i.querySelector("#cons-grams"),m=i.querySelector("#cal-preview");function f(){const y=parseFloat(h.value)||0,S=te(a.caloriesPer100g,y);m.textContent=Math.round(S)}h.addEventListener("input",f),i.querySelectorAll("[data-quick-gram]").forEach(y=>{y.addEventListener("click",()=>{h.value=y.dataset.quickGram,i.querySelectorAll(".btn-quick-gram").forEach(S=>S.classList.remove("active")),y.classList.add("active"),f()})}),i.querySelectorAll("[data-meal]").forEach(y=>{y.addEventListener("click",()=>{g=y.dataset.meal,i.querySelectorAll("[data-meal]").forEach(S=>S.classList.remove("active")),y.classList.add("active")})});const x=()=>i.remove();i.querySelector("#modal-close-consumption").addEventListener("click",x),i.addEventListener("click",y=>{y.target===i&&x()}),i.querySelector("#btn-confirm-consumption").addEventListener("click",()=>{const y=parseFloat(h.value)||0;if(y<=0){L("Veuillez entrer une quantité valide","warning");return}const S=te(a.caloriesPer100g,y),q=i.querySelector("#cons-notes").value.trim();ge({productId:a.id,productNameBackup:a.name,productPhotoBackup:a.photo,caloriesPer100gBackup:a.caloriesPer100g,grams:y,calories:S,meal:g,notes:q}),L(`${a.name} – ${Math.round(S)} kcal ajouté ! ✅`,"success"),x(),R("dashboard")})}async function u(){let n;try{n=(await de(()=>import("./index-C7szoz8K.js"),[])).Html5Qrcode}catch{L("Scanner non disponible","error"),p();return}const a=document.createElement("div");a.className="modal-overlay",a.style.alignItems="center",a.innerHTML=`
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
    `,document.body.appendChild(a);const i=new n("scanner-container");let g=!1,h=!1;const m=async()=>{if(!h){if(h=!0,g){try{await i.stop()}catch{}g=!1}a.remove()}};a.querySelector("#modal-close-scanner").addEventListener("click",()=>m()),a.addEventListener("click",f=>{f.target===a&&m()}),a.querySelector("#btn-manual-barcode").addEventListener("click",async()=>{await m(),p()});try{await i.start({facingMode:"environment"},{fps:10,qrbox:{width:250,height:100},aspectRatio:1},async f=>{if(!(!g||h)){g=!1;try{await i.stop()}catch{}a.remove(),await l(f)}}),g=!0}catch(f){console.error("Scanner error:",f),await m(),L("Impossible d'accéder à la caméra","error"),p()}}function p(){const n=document.createElement("div");n.className="modal-overlay",n.innerHTML=`
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
    `,document.body.appendChild(n);const a=()=>n.remove();n.querySelector("#modal-close-manual").addEventListener("click",a),n.addEventListener("click",i=>{i.target===n&&a()}),n.querySelector("#btn-search-barcode").addEventListener("click",async()=>{const i=n.querySelector("#manual-barcode").value.trim();if(!i){L("Veuillez entrer un code-barres","warning");return}a(),await l(i)})}async function l(n){L("Recherche en cours...","info",2e3);const a=await Pe(n);if(!a){L("Produit non trouvé dans la base Open Food Facts","error");return}d(a)}function d(n){const a=document.createElement("div");a.className="modal-overlay",a.innerHTML=`
      <div class="modal-content">
        <div class="modal-handle"></div>
        <button class="modal-close" id="modal-close-result">✕</button>
        <h3 class="modal-title">Produit trouvé ! 🎉</h3>
        
        ${n.image?`<img src="${n.image}" alt="${n.name}" 
               style="width:100%;max-height:200px;object-fit:contain;border-radius:var(--radius-md);margin-bottom:var(--space-md);background:var(--bg-secondary);" />`:""}
        
        <div class="card-glass mb-md">
          <h4>${n.name}</h4>
          ${n.brand?`<p style="font-size:var(--font-sm);color:var(--text-tertiary);">${n.brand}</p>`:""}
          <div style="margin-top:var(--space-sm);">
            <span class="badge badge-accent" style="font-size:var(--font-md);">${n.caloriesPer100g} kcal / 100 g</span>
          </div>
        </div>
        
        <button class="btn btn-primary btn-block btn-lg" id="btn-add-barcode-product">
          ✅ Ajouter au catalogue
        </button>
      </div>
    `,document.body.appendChild(a);const i=()=>a.remove();a.querySelector("#modal-close-result").addEventListener("click",i),a.addEventListener("click",g=>{g.target===a&&i()}),a.querySelector("#btn-add-barcode-product").addEventListener("click",()=>{ee({name:n.name,description:n.brand||"",caloriesPer100g:n.caloriesPer100g,photo:n.image||null}),L("Produit ajouté au catalogue ! 🎉","success"),i(),$()})}const c=X("products:updated",()=>$());return v.push(c),$(),()=>{v.forEach(n=>n())}}function Me(t){const s=W(),e=(s==null?void 0:s.dailyTarget)||2e3;let o="jour",r=null;function v(){t.innerHTML=`
      <div class="history-view">
        <div class="view-header">
          <h1 style="font-size:var(--font-2xl);">Historique</h1>
        </div>
        
        <!-- Filter Tabs -->
        <div style="padding:0 var(--space-md);margin-bottom:var(--space-md);">
          <div class="filter-tabs">
            <button class="filter-tab ${o==="jour"?"active":""}" data-filter="jour">Jour</button>
            <button class="filter-tab ${o==="semaine"?"active":""}" data-filter="semaine">Semaine</button>
            <button class="filter-tab ${o==="mois"?"active":""}" data-filter="mois">Mois</button>
          </div>
        </div>
        
        <!-- Chart -->
        <div class="card-glass" style="margin:0 var(--space-md) var(--space-md);padding:var(--space-md);">
          <canvas id="calorie-chart" height="200"></canvas>
        </div>
        
        <!-- Daily Breakdown -->
        <div id="history-details" style="padding:0 var(--space-md);"></div>
      </div>
    `,$(),b(),E()}function $(){t.querySelectorAll("[data-filter]").forEach(u=>{u.addEventListener("click",()=>{o=u.dataset.filter,v()})})}function w(){const u=new Date;u.setHours(12,0,0,0);let p,l;switch(o){case"jour":{p=new Date(u),p.setDate(p.getDate()-6),l=new Date(u);break}case"semaine":{p=new Date(u),p.setDate(p.getDate()-27),l=new Date(u);break}case"mois":{p=new Date(u),p.setMonth(p.getMonth()-5),p.setDate(1),l=new Date(u);break}}return{start:p.toISOString().split("T")[0],end:l.toISOString().split("T")[0]}}function k(){const{start:u,end:p}=w(),l=fe(u,p),d={};if(l.forEach(c=>{d[c.date]||(d[c.date]=0),d[c.date]+=c.calories||0}),o==="jour"){const c=[],n=[],a=new Date;a.setHours(12,0,0,0);for(let i=6;i>=0;i--){const g=new Date(a);g.setDate(g.getDate()-i);const h=g.toISOString().split("T")[0],m=g.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric"});c.push(m),n.push(Math.round(d[h]||0))}return{labels:c,values:n}}if(o==="semaine"){const c=[],n=[],a=new Date;a.setHours(12,0,0,0);for(let i=3;i>=0;i--){const g=new Date(a);g.setDate(g.getDate()-i*7);const h=new Date(g);h.setDate(h.getDate()-6);let m=0,f=0;for(let S=0;S<=6;S++){const q=new Date(h);q.setDate(q.getDate()+S);const D=q.toISOString().split("T")[0];d[D]&&(m+=d[D],f++)}const x=f>0?Math.round(m/f):0,y=h.toLocaleDateString("fr-FR",{day:"numeric",month:"short"});c.push(`Sem. ${y}`),n.push(x)}return{labels:c,values:n}}if(o==="mois"){const c=[],n=[],a=new Date;for(let i=5;i>=0;i--){const g=new Date(a.getFullYear(),a.getMonth()-i,1),h=new Date(a.getFullYear(),a.getMonth()-i+1,0);let m=0,f=0;for(let y=1;y<=h.getDate();y++){const S=`${g.getFullYear()}-${String(g.getMonth()+1).padStart(2,"0")}-${String(y).padStart(2,"0")}`;d[S]&&(m+=d[S],f++)}const x=f>0?Math.round(m/f):0;c.push(g.toLocaleDateString("fr-FR",{month:"short"})),n.push(x)}return{labels:c,values:n}}return{labels:[],values:[]}}async function b(){const u=t.querySelector("#calorie-chart");if(!u)return;const{labels:p,values:l}=k();let d;try{const m=await de(()=>import("./chart-45xamTTr.js"),[]);d=m.Chart;const{CategoryScale:f,LinearScale:x,BarElement:y,LineElement:S,PointElement:q,Title:D,Tooltip:T,Legend:z,BarController:M,LineController:C}=m;d.register(f,x,y,S,q,D,T,z,M,C)}catch(m){console.error("Chart.js not available:",m),u.parentElement.innerHTML='<p style="text-align:center;color:var(--text-tertiary);padding:var(--space-lg);">Graphique non disponible</p>';return}r&&r.destroy();const c=u.getContext("2d");l.map(m=>m>e);const n=getComputedStyle(document.documentElement),a=n.getPropertyValue("--text-secondary").trim()||"#6B4D5A",i=n.getPropertyValue("--accent").trim()||"#E91E8C",g="#F44336",h=n.getPropertyValue("--divider").trim()||"rgba(0,0,0,0.06)";r=new d(c,{type:o==="jour"?"bar":"line",data:{labels:p,datasets:[{label:o==="jour"?"Calories":"Moy. calories",data:l,backgroundColor:l.map(m=>m>e?"rgba(244, 67, 54, 0.6)":"rgba(233, 30, 140, 0.5)"),borderColor:l.map(m=>m>e?g:i),borderWidth:2,borderRadius:o==="jour"?8:0,tension:.4,fill:o!=="jour",pointBackgroundColor:i,pointRadius:o!=="jour"?4:0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",bodyColor:"#fff",cornerRadius:8,padding:12,callbacks:{label:m=>`${m.raw} kcal`}}},scales:{x:{grid:{display:!1},ticks:{color:a,font:{size:11}}},y:{grid:{color:h},ticks:{color:a,font:{size:11}},beginAtZero:!0}},annotation:{annotations:{targetLine:{type:"line",yMin:e,yMax:e,borderColor:"rgba(255, 152, 0, 0.5)",borderWidth:2,borderDash:[5,5]}}}}})}function E(){const u=t.querySelector("#history-details");if(!u)return;const p=new Date;p.setHours(12,0,0,0);const l=o==="jour"||o==="semaine"?7:30;let d="";for(let c=0;c<l;c++){const n=new Date(p);n.setDate(n.getDate()-c);const a=n.toISOString().split("T")[0],i=O(a),g=i.reduce((f,x)=>f+(x.calories||0),0);if(i.length===0)continue;const h=g>e,m=c===0?"Aujourd'hui":c===1?"Hier":n.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});d+=`
        <div class="card-glass mb-sm history-day-card" data-day="${a}">
          <div class="flex-between" style="cursor:pointer;" data-toggle-day="${a}">
            <div>
              <strong style="font-size:var(--font-sm);">${m}</strong>
            </div>
            <div style="text-align:right;">
              <span class="badge ${h?"badge-danger":"badge-success"}" style="font-size:var(--font-sm);">
                ${Math.round(g)} / ${e} kcal
              </span>
            </div>
          </div>
          <div class="history-day-items" id="day-items-${a}" style="display:none;margin-top:var(--space-sm);">
            ${i.map(f=>{const x=f.productId?N(f.productId):null;return`
                <div class="consumption-item" style="padding:var(--space-xs) 0;">
                  <div class="consumption-item-info">
                    <div class="consumption-item-name" style="font-size:var(--font-xs);">${(x==null?void 0:x.name)||f.productNameBackup||"Produit inconnu"}</div>
                    <div class="consumption-item-detail">${f.grams}g</div>
                  </div>
                  <div style="font-size:var(--font-sm);font-weight:var(--fw-semibold);">${Math.round(f.calories)} kcal</div>
                </div>
              `}).join("")}
          </div>
        </div>
      `}d||(d=`
        <div class="empty-state">
          <div class="empty-state-icon">📊</div>
          <div class="empty-state-title">Aucune donnée</div>
          <div class="empty-state-desc">Commencez à enregistrer vos repas pour voir votre historique.</div>
        </div>
      `),u.innerHTML=d,u.querySelectorAll("[data-toggle-day]").forEach(c=>{c.addEventListener("click",()=>{const n=c.dataset.toggleDay,a=u.querySelector(`#day-items-${n}`);a&&(a.style.display=a.style.display==="none"?"block":"none")})})}return v(),()=>{r&&(r.destroy(),r=null)}}function Ce(t){const s=W();Z();let e=!1,o=s?{...s}:{};function r(){const k=J();t.innerHTML=`
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
                ${e?"✕ Annuler":"✏️ Modifier"}
              </button>
            </div>
            
            ${e?$():v()}
          </div>
          
          <!-- Calorie Info -->
          ${s?`
            <div class="card-glass mb-md">
              <h3 style="font-size:var(--font-lg);margin-bottom:var(--space-sm);">🎯 Objectif calorique</h3>
              <div class="flex-between mb-sm">
                <span class="text-secondary" style="font-size:var(--font-sm);">Métabolisme de base</span>
                <strong>${s.bmr||"–"} kcal</strong>
              </div>
              <div class="flex-between mb-sm">
                <span class="text-secondary" style="font-size:var(--font-sm);">Dépense totale (TDEE)</span>
                <strong>${s.tdee||"–"} kcal</strong>
              </div>
              <div class="flex-between mb-sm">
                <span class="text-secondary" style="font-size:var(--font-sm);">Déficit quotidien</span>
                <strong>${s.dailyDeficit||"–"} kcal</strong>
              </div>
              <div class="divider"></div>
              <div class="flex-between">
                <span style="font-weight:var(--fw-semibold);">Objectif quotidien</span>
                <span class="badge badge-accent" style="font-size:var(--font-md);">${s.dailyTarget||"–"} kcal</span>
              </div>
              
              <div style="margin-top:var(--space-md);padding:var(--space-sm);background:var(--accent-light);border-radius:var(--radius-md);">
                <p style="font-size:var(--font-xs);color:var(--text-secondary);">
                  💡 <strong>Comment est calculé votre objectif ?</strong><br/>
                  Formule de Mifflin-St Jeor pour le métabolisme de base, 
                  multiplié par votre niveau d'activité (TDEE). 
                  Ensuite, un déficit est calculé pour atteindre votre objectif en ${s.duration||"?"} mois 
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
              <button class="toggle-switch ${k==="dark"?"active":""}" id="btn-toggle-theme" aria-label="Mode sombre"></button>
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
    `,w()}function v(){if(!s)return'<p class="text-secondary">Aucun profil configuré</p>';const k=s.sex==="homme"?"👨 Homme":"👩 Femme",b={sedentary:"Sédentaire",light:"Léger",moderate:"Modéré",active:"Actif","very-active":"Très actif"};return`
      <div class="profile-summary">
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Sexe</span>
          <strong>${k}</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Âge</span>
          <strong>${s.age} ans</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Taille</span>
          <strong>${s.height} cm</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Poids actuel</span>
          <strong>${s.weight} kg</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Objectif</span>
          <strong>${s.goalWeight} kg</strong>
        </div>
        <div class="flex-between mb-sm">
          <span class="text-secondary" style="font-size:var(--font-sm);">Durée</span>
          <strong>${s.duration} mois</strong>
        </div>
        <div class="flex-between">
          <span class="text-secondary" style="font-size:var(--font-sm);">Activité</span>
          <strong>${b[s.activityLevel]||"Sédentaire"}</strong>
        </div>
      </div>
    `}function $(){const k=[{value:"sedentary",label:"Sédentaire"},{value:"light",label:"Léger"},{value:"moderate",label:"Modéré"},{value:"active",label:"Actif"}];return`
      <div class="edit-form">
        <div class="input-group mb-sm">
          <label class="input-label">Sexe</label>
          <div class="select-group">
            <button class="select-option ${o.sex==="femme"?"active":""}" data-edit-sex="femme">👩 Femme</button>
            <button class="select-option ${o.sex==="homme"?"active":""}" data-edit-sex="homme">👨 Homme</button>
          </div>
        </div>
        
        <div class="flex gap-sm mb-sm">
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-age">Âge</label>
            <input class="input-field" type="number" id="edit-age" value="${o.age}" inputmode="numeric" />
          </div>
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-height">Taille (cm)</label>
            <input class="input-field" type="number" id="edit-height" value="${o.height}" inputmode="numeric" />
          </div>
        </div>
        
        <div class="flex gap-sm mb-sm">
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-weight">Poids (kg)</label>
            <input class="input-field" type="number" id="edit-weight" value="${o.weight}" step="0.1" inputmode="decimal" />
          </div>
          <div class="input-group" style="flex:1">
            <label class="input-label" for="edit-goal">Objectif (kg)</label>
            <input class="input-field" type="number" id="edit-goal" value="${o.goalWeight}" step="0.1" inputmode="decimal" />
          </div>
        </div>
        
        <div class="input-group mb-sm">
          <label class="input-label" for="edit-duration">Durée (mois)</label>
          <input class="input-field" type="number" id="edit-duration" value="${o.duration}" inputmode="numeric" />
        </div>
        
        <div class="input-group mb-md">
          <label class="input-label">Activité</label>
          <div class="select-group" style="flex-wrap:wrap;">
            ${k.map(b=>`
              <button class="select-option ${o.activityLevel===b.value?"active":""}" data-edit-activity="${b.value}" style="flex:1 1 45%;">${b.label}</button>
            `).join("")}
          </div>
        </div>
        
        <button class="btn btn-primary btn-block" id="btn-save-profile">💾 Enregistrer</button>
      </div>
    `}function w(){var b,E,u,p,l;(b=t.querySelector("#btn-toggle-edit"))==null||b.addEventListener("click",()=>{e=!e,e&&s&&(o={...s}),r()}),t.querySelectorAll("[data-edit-sex]").forEach(d=>{d.addEventListener("click",()=>{o.sex=d.dataset.editSex,r()})}),t.querySelectorAll("[data-edit-activity]").forEach(d=>{d.addEventListener("click",()=>{o.activityLevel=d.dataset.editActivity,r()})});const k={"edit-age":"age","edit-height":"height","edit-weight":"weight","edit-goal":"goalWeight","edit-duration":"duration"};for(const[d,c]of Object.entries(k))(E=t.querySelector(`#${d}`))==null||E.addEventListener("input",n=>{o[c]=n.target.value});(u=t.querySelector("#btn-save-profile"))==null||u.addEventListener("click",()=>{const d={...o,age:parseInt(o.age),weight:parseFloat(o.weight),height:parseInt(o.height)||170,goalWeight:parseFloat(o.goalWeight),duration:parseInt(o.duration)},c=Q(d);le({...d,bmr:c.bmr,tdee:c.tdee,dailyDeficit:c.dailyDeficit,dailyTarget:c.dailyTarget}),e=!1,L("Profil mis à jour ! Objectif recalculé.","success"),r()}),(p=t.querySelector("#btn-toggle-theme"))==null||p.addEventListener("click",()=>{const c=J()==="light"?"dark":"light";ye(c),r()}),(l=t.querySelector("#btn-clear-data"))==null||l.addEventListener("click",()=>{confirm("Êtes-vous sûr(e) de vouloir supprimer toutes les données ? Cette action est irréversible.")&&(xe(),L("Toutes les données ont été supprimées","info"),window.location.hash="",window.location.reload())})}return r(),()=>{}}const K=document.getElementById("app");let ue=null,j=null;const je=[{id:"dashboard",icon:"🏠",label:"Accueil"},{id:"products",icon:"🍎",label:"Produits"},{id:"history",icon:"📊",label:"Historique"},{id:"settings",icon:"⚙️",label:"Réglages"}];function Te(){const t=J();document.documentElement.setAttribute("data-theme",t),window.addEventListener("hashchange",ie),ce()?ie():Y("onboarding"),X("profile:updated",()=>{ue==="onboarding"&&R("dashboard")})}function ie(){if(!ce()){Y("onboarding");return}const t=window.location.hash.slice(1)||"dashboard",[s,...e]=t.split("/");Y(s,e)}function R(t,s=[]){const e=s.length?`${t}/${s.join("/")}`:t;window.location.hash=e}function Y(t,s=[]){j&&(j(),j=null),ue=t;const e=document.createElement("div");switch(e.className="view-container view-enter",e.id="view-container",K.innerHTML="",K.appendChild(e),t){case"onboarding":j=Ee(e);break;case"dashboard":j=ne(e),H("dashboard");break;case"products":j=qe(e,s),H("products");break;case"history":j=Me(e),H("history");break;case"settings":j=Ce(e),H("settings");break;default:j=ne(e),H("dashboard")}}function H(t){const s=document.querySelector(".nav-bar");s&&s.remove();const e=document.createElement("nav");e.className="nav-bar",e.innerHTML=je.map(o=>`
    <button class="nav-item ${o.id===t?"active":""}" data-view="${o.id}" aria-label="${o.label}">
      <span class="nav-item-icon">${o.icon}</span>
      <span>${o.label}</span>
    </button>
  `).join(""),e.addEventListener("click",o=>{const r=o.target.closest(".nav-item");if(!r)return;const v=r.dataset.view;R(v)}),K.appendChild(e)}Te();
