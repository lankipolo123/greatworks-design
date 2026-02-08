var Ct=Object.defineProperty;var St=(o,e,t)=>e in o?Ct(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var l=(o,e,t)=>St(o,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=globalThis,Be=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Oe=Symbol(),Ve=new WeakMap;let tt=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==Oe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Be&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=Ve.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Ve.set(t,e))}return e}toString(){return this.cssText}};const Et=o=>new tt(typeof o=="string"?o:o+"",void 0,Oe),h=(o,...e)=>{const t=o.length===1?o[0]:e.reduce((i,s,r)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+o[r+1],o[0]);return new tt(t,o,Oe)},Pt=(o,e)=>{if(Be)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const i=document.createElement("style"),s=j.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,o.appendChild(i)}},Fe=Be?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return Et(t)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:At,defineProperty:Dt,getOwnPropertyDescriptor:Tt,getOwnPropertyNames:zt,getOwnPropertySymbols:_t,getPrototypeOf:Ut}=Object,C=globalThis,He=C.trustedTypes,Lt=He?He.emptyScript:"",H=C.reactiveElementPolyfillSupport,L=(o,e)=>o,W={toAttribute(o,e){switch(e){case Boolean:o=o?Lt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},it=(o,e)=>!At(o,e),qe={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:it};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);let T=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=qe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Dt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:r}=Tt(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:s,set(n){const c=s==null?void 0:s.call(this);r==null||r.call(this,n),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??qe}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;const e=Ut(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){const t=this.properties,i=[...zt(t),..._t(t)];for(const s of i)this.createProperty(s,t[s])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const s of i)t.unshift(Fe(s))}else e!==void 0&&t.push(Fe(e));return t}static _$Eu(e,t){const i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Pt(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostConnected)==null?void 0:i.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var i;return(i=t.hostDisconnected)==null?void 0:i.call(t)})}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){var r;const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){const n=(((r=i.converter)==null?void 0:r.toAttribute)!==void 0?i.converter:W).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){var r,n;const i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const c=i.getPropertyOptions(s),p=typeof c.converter=="function"?{fromAttribute:c.converter}:((r=c.converter)==null?void 0:r.fromAttribute)!==void 0?c.converter:W;this._$Em=s;const m=p.fromAttribute(t,c.type);this[s]=m??((n=this._$Ej)==null?void 0:n.get(s))??m,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){var n;if(e!==void 0){const c=this.constructor;if(s===!1&&(r=this[e]),i??(i=c.getPropertyOptions(e)),!((i.hasChanged??it)(r,t)||i.useDefault&&i.reflect&&r===((n=this._$Ej)==null?void 0:n.get(e))&&!this.hasAttribute(c._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,n]of s){const{wrapped:c}=n,p=this[r];c!==!0||this._$AL.has(r)||p===void 0||this.C(r,void 0,n,p)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(s=>{var r;return(r=s.hostUpdate)==null?void 0:r.call(s)}),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[L("elementProperties")]=new Map,T[L("finalized")]=new Map,H==null||H({ReactiveElement:T}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const R=globalThis,Ze=o=>o,N=R.trustedTypes,Ye=N?N.createPolicy("lit-html",{createHTML:o=>o}):void 0,ot="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,st="?"+$,Rt=`<${st}>`,D=document,M=()=>D.createComment(""),I=o=>o===null||typeof o!="object"&&typeof o!="function",je=Array.isArray,Mt=o=>je(o)||typeof(o==null?void 0:o[Symbol.iterator])=="function",q=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,We=/-->/g,Ge=/>/g,E=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Je=/'/g,Ke=/"/g,at=/^(?:script|style|textarea|title)$/i,It=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),a=It(1),z=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),Xe=new WeakMap,P=D.createTreeWalker(D,129);function rt(o,e){if(!je(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ye!==void 0?Ye.createHTML(e):e}const Bt=(o,e)=>{const t=o.length-1,i=[];let s,r=e===2?"<svg>":e===3?"<math>":"",n=U;for(let c=0;c<t;c++){const p=o[c];let m,f,g=-1,v=0;for(;v<p.length&&(n.lastIndex=v,f=n.exec(p),f!==null);)v=n.lastIndex,n===U?f[1]==="!--"?n=We:f[1]!==void 0?n=Ge:f[2]!==void 0?(at.test(f[2])&&(s=RegExp("</"+f[2],"g")),n=E):f[3]!==void 0&&(n=E):n===E?f[0]===">"?(n=s??U,g=-1):f[1]===void 0?g=-2:(g=n.lastIndex-f[2].length,m=f[1],n=f[3]===void 0?E:f[3]==='"'?Ke:Je):n===Ke||n===Je?n=E:n===We||n===Ge?n=U:(n=E,s=void 0);const y=n===E&&o[c+1].startsWith("/>")?" ":"";r+=n===U?p+Rt:g>=0?(i.push(m),p.slice(0,g)+ot+p.slice(g)+$+y):p+$+(g===-2?c:y)}return[rt(o,r+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class B{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,n=0;const c=e.length-1,p=this.parts,[m,f]=Bt(e,t);if(this.el=B.createElement(m,i),P.currentNode=this.el.content,t===2||t===3){const g=this.el.content.firstChild;g.replaceWith(...g.childNodes)}for(;(s=P.nextNode())!==null&&p.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(const g of s.getAttributeNames())if(g.endsWith(ot)){const v=f[n++],y=s.getAttribute(g).split($),w=/([.?@])?(.*)/.exec(v);p.push({type:1,index:r,name:w[2],strings:y,ctor:w[1]==="."?jt:w[1]==="?"?Nt:w[1]==="@"?Vt:F}),s.removeAttribute(g)}else g.startsWith($)&&(p.push({type:6,index:r}),s.removeAttribute(g));if(at.test(s.tagName)){const g=s.textContent.split($),v=g.length-1;if(v>0){s.textContent=N?N.emptyScript:"";for(let y=0;y<v;y++)s.append(g[y],M()),P.nextNode(),p.push({type:2,index:++r});s.append(g[v],M())}}}else if(s.nodeType===8)if(s.data===st)p.push({type:2,index:r});else{let g=-1;for(;(g=s.data.indexOf($,g+1))!==-1;)p.push({type:7,index:r}),g+=$.length-1}r++}}static createElement(e,t){const i=D.createElement("template");return i.innerHTML=e,i}}function _(o,e,t=o,i){var n,c;if(e===z)return e;let s=i!==void 0?(n=t._$Co)==null?void 0:n[i]:t._$Cl;const r=I(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==r&&((c=s==null?void 0:s._$AO)==null||c.call(s,!1),r===void 0?s=void 0:(s=new r(o),s._$AT(o,t,i)),i!==void 0?(t._$Co??(t._$Co=[]))[i]=s:t._$Cl=s),s!==void 0&&(e=_(o,s._$AS(o,e.values),s,i)),e}class Ot{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=((e==null?void 0:e.creationScope)??D).importNode(t,!0);P.currentNode=s;let r=P.nextNode(),n=0,c=0,p=i[0];for(;p!==void 0;){if(n===p.index){let m;p.type===2?m=new O(r,r.nextSibling,this,e):p.type===1?m=new p.ctor(r,p.name,p.strings,this,e):p.type===6&&(m=new Ft(r,this,e)),this._$AV.push(m),p=i[++c]}n!==(p==null?void 0:p.index)&&(r=P.nextNode(),n++)}return P.currentNode=D,s}p(e){let t=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class O{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=_(this,e,t),I(e)?e===x||e==null||e===""?(this._$AH!==x&&this._$AR(),this._$AH=x):e!==this._$AH&&e!==z&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Mt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==x&&I(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){var r;const{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=B.createElement(rt(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)==null?void 0:r._$AD)===s)this._$AH.p(t);else{const n=new Ot(s,this),c=n.u(this.options);n.p(t),this.T(c),this._$AH=n}}_$AC(e){let t=Xe.get(e.strings);return t===void 0&&Xe.set(e.strings,t=new B(e)),t}k(e){je(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new O(this.O(M()),this.O(M()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,t);e!==this._$AB;){const s=Ze(e).nextSibling;Ze(e).remove(),e=s}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class F{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=x,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=x}_$AI(e,t=this,i,s){const r=this.strings;let n=!1;if(r===void 0)e=_(this,e,t,0),n=!I(e)||e!==this._$AH&&e!==z,n&&(this._$AH=e);else{const c=e;let p,m;for(e=r[0],p=0;p<r.length-1;p++)m=_(this,c[i+p],t,p),m===z&&(m=this._$AH[p]),n||(n=!I(m)||m!==this._$AH[p]),m===x?e=x:e!==x&&(e+=(m??"")+r[p+1]),this._$AH[p]=m}n&&!s&&this.j(e)}j(e){e===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class jt extends F{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===x?void 0:e}}class Nt extends F{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==x)}}class Vt extends F{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=_(this,e,t,0)??x)===z)return;const i=this._$AH,s=e===x&&i!==x||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==x&&(i===x||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Ft{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){_(this,e)}}const Z=R.litHtmlPolyfillSupport;Z==null||Z(B,O),(R.litHtmlVersions??(R.litHtmlVersions=[])).push("3.3.2");const Ht=(o,e,t)=>{const i=(t==null?void 0:t.renderBefore)??e;let s=i._$litPart$;if(s===void 0){const r=(t==null?void 0:t.renderBefore)??null;i._$litPart$=s=new O(e.insertBefore(M(),r),r,void 0,t??{})}return s._$AI(o),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const A=globalThis;class d extends T{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ht(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return z}}var et;d._$litElement$=!0,d.finalized=!0,(et=A.litElementHydrateSupport)==null||et.call(A,{LitElement:d});const Y=A.litElementPolyfillSupport;Y==null||Y({LitElement:d});(A.litElementVersions??(A.litElementVersions=[])).push("4.2.2");class G extends d{constructor(){super(),this.sidebarCollapsed=!1}toggleSidebar(){this.sidebarCollapsed=!this.sidebarCollapsed,this.sidebarCollapsed?this.setAttribute("collapsed",""):this.removeAttribute("collapsed"),this.dispatchEvent(new CustomEvent("sidebar-toggle",{detail:{collapsed:this.sidebarCollapsed},bubbles:!0,composed:!0}))}render(){return a`
      <slot name="sidebar"></slot>
      <slot name="header"></slot>
      <slot name="content"></slot>
      
      <button class="toggle-btn" @click=${this.toggleSidebar}>
        <img src="/assets/collapsible.svg" alt="Toggle sidebar" />
      </button>
    `}}l(G,"properties",{sidebarCollapsed:{type:Boolean}}),l(G,"styles",h`
    :host {
      display: grid;
      grid-template-areas:
        "sidebar header"
        "sidebar content";
      grid-template-columns: var(--sidebar-width) 1fr;
      grid-template-rows: auto 1fr;
      height: 100vh;
      width: 100vw;
      margin: 0;
      padding: 0;
      gap: 0;
      position: relative;
      transition: grid-template-columns 0.3s ease;
    }

    :host([collapsed]) {
      grid-template-columns: 60px 1fr;
    }

    ::slotted([slot="sidebar"]) {
      grid-area: sidebar;
      margin: 0;
      padding: 0;
      overflow: visible;
    }

    ::slotted([slot="header"]) {
      grid-area: header;
      margin: 0;
      padding: 0;
    }

    ::slotted([slot="content"]) {
      grid-area: content;
      overflow-y: auto;
      margin: 0;
      padding: 0;
    }

    .toggle-btn {
      position: absolute;
      top: 70px;
      left: var(--sidebar-width);
      transform: translateX(-50%);
      background: white;
      border: 0.5px solid rgba(45, 43, 43, 0.27);
      border-radius: 50%;
      cursor: pointer;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 0;
    }

    .toggle-btn:hover {
      background: #f5f5f5;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    :host([collapsed]) .toggle-btn {
      left: 60px;
    }

    .toggle-btn img {
      width: 25px;
      height: 25px;
      transition: transform 0.3s ease;
      display: block;
    }

    :host([collapsed]) .toggle-btn img {
      transform: rotate(180deg);
    }
  `);customElements.define("dashboard-layout",G);class J extends d{constructor(){super(),this.text="",this.visible=!1,this.x=0,this.y=0}render(){return a`
      <div 
        class="tooltip ${this.visible?"visible":""}"
        style="left: ${this.x}px; top: ${this.y}px;">
        ${this.text}
      </div>
    `}}l(J,"properties",{text:{type:String},visible:{type:Boolean},x:{type:Number},y:{type:Number}}),l(J,"styles",h`
    :host {
      position: fixed;
      left: 0;
      top: 0;
      pointer-events: none;
      z-index: 9999;
    }

    .tooltip {
      position: absolute;
      background: #0e0d0d;
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transform: translate(0, -50%);
    }

    .tooltip::before {
      content: '';
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-right-color: #2d2b2b;
    }

    .tooltip.visible {
      opacity: 1;
    }
  `);customElements.define("global-tooltip",J);const k=class k{static getInstance(){return k.instance||(k.instance=document.createElement("global-tooltip"),document.body.appendChild(k.instance)),k.instance}static show(e,t){const i=k.getInstance(),s=t.getBoundingClientRect();i.text=e,i.x=s.right+10,i.y=s.top+s.height/2,i.visible=!0}static hide(){const e=k.getInstance();e.visible=!1}};l(k,"instance",null);let V=k;const u={dashboard:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M3 13h8V3H3v10zM13 21h8v-6h-8v6zM13 3v6h8V3h-8zM3 21h8v-4H3v4z"/></svg>`,calendar:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,booking:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 10h-6l-2-3-2 3H3v11h18V10z"/><path d="M12 21V13"/></svg>`,ticket:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M4 4h16v16H4V4z"/><path d="M4 10h16"/></svg>`,user:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="7" r="4"/><path d="M5.5 21c0-3 5-5 6.5-5s6.5 2 6.5 5"/></svg>`,logs:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,payments:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M12 1v22M4 7h16v10H4V7z"/></svg>`,settings:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a7.94 7.94 0 0 0 .6-3 7.94 7.94 0 0 0-.6-3l2.1-1.5-2-3.5-2.5 1.2a8.05 8.05 0 0 0-3-1.7V2h-4v2.5a8.05 8.05 0 0 0-3 1.7L5.9 4l-2 3.5 2.1 1.5a7.94 7.94 0 0 0-.6 3c0 1 .2 2 .6 3L3.9 17l2 3.5 2.5-1.2a8.05 8.05 0 0 0 3 1.7V22h4v-2.5a8.05 8.05 0 0 0 3-1.7L18.1 20l2-3.5-2.7-1.5z"/></svg>`,logout:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M16 17l5-5-5-5M21 12H9M12 19v2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7v2"/></svg>`,users:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,userSingle:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,ticketInbox:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M3 7l9-4 9 4"/><line x1="9" y1="7" x2="9" y2="18"/></svg>`,clock:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,chartLine:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,chartBar:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,chartPie:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,trendingUp:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,trendingDown:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`,activity:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,lockClosed:a`<svg viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" width="20" height="20"> <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,lockOpen:a`<svg viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" width="20" height="20"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 5-5 5 5 0 0 1 5 5v1"/></svg>`,export:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,plus:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,add:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,fileCsv:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>`,filePdf:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12h4v4h-4z"/></svg>`,fileExcel:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="12" x2="15" y2="18"/><line x1="15" y1="12" x2="9" y2="18"/></svg>`,file:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`},qt=h`

:host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .dialog-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .dialog-container.small { width: 400px; }
    .dialog-container.medium { width: 500px; }
    .dialog-container.large { width: 700px; }

    /* Close button */
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f5f5f5;
      color: #333;
    }

    /* DEFAULT STYLE - Logout/Confirm */
    .dialog-header {
      padding: 20px 24px 16px;
      border-bottom: 1px solid #2d2b2b45;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .dialog-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #8d1409;
      margin: 0;
    }

    .dialog-title .highlight {
      color: #8d1409;
    }

    .dialog-description {
      font-size: 0.95rem;
      color: #666;
      margin: 4px 0 0 0;
      font-weight: 500;
    }

    .dialog-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
      color: #666;
    }

    .dialog-footer {
      padding: 16px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid #2d2b2b45;
    }

    /* COMPACT STYLE - Forms */
    :host([style-mode="compact"]) .dialog-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    :host([style-mode="compact"]) .dialog-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    :host([style-mode="compact"]) .dialog-title .highlight {
      color: #1a1a1a;
    }

    :host([style-mode="compact"]) .dialog-description {
      font-size: 0.875rem;
      color: #888;
      margin: 2px 0 0 0;
      font-weight: 400;
    }

    :host([style-mode="compact"]) .dialog-body {
      padding: 16px 20px;
    }

    :host([style-mode="compact"]) .dialog-footer {
      padding: 12px 20px;
      border-top: 1px solid #e0e0e0;
    }

    /* CLEAN STYLE - Export/Minimal */
    :host([style-mode="clean"]) .dialog-header {
      border-bottom: none;
      padding: 24px 24px 16px;
    }

    :host([style-mode="clean"]) .dialog-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
    }

    :host([style-mode="clean"]) .dialog-title .highlight {
      color: #1a1a1a;
    }

    :host([style-mode="clean"]) .dialog-footer {
      border-top: none;
    }

    :host([hide-footer]) .dialog-footer {
      display: none;
    }

    .dialog-button {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .cancel-button {
      background: white;
      color: #333;
      border: 1px solid #e0e0e0;
    }

    .cancel-button:hover {
      background: #f5f5f5;
    }

    .confirm-button {
      background: #8d1409;
      color: white;
    }

    .confirm-button:hover {
      opacity: 0.9;
    }

    .confirm-button.primary {
      background: #007bff;
    }

    .confirm-button.danger {
      background: #8d1409;
    }

    .confirm-button.success {
      background: #28a745;
    }

    /* Export mode */
    .export-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .export-option {
      display: flex;
      align-items: center;
      padding: 12px;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .export-option:hover {
      background: #f5f5f5;
      border-color: #da0d0dd7;
      transform: translateX(4px);
    }

    .export-option-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 8px;
      margin-right: 16px;
      color: #da0d0dd7;
    }

    .export-option-content {
      flex: 1;
    }

    .export-option-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
    }

    .export-option-desc {
      font-size: 0.85rem;
      color: #666;
      margin: 0;
    }

    /* Upload mode */
    .upload-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 8px;
    }

    .upload-option-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 20px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      background: #ffffff;
    }

    .upload-option-card:hover {
      border-color: #0faaded7;
      background: #a1eaea;
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 170, 255, 0.1);
    }

    .upload-option-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 50%;
      margin-bottom: 12px;
      color: #03bcffd7;
    }

    .upload-option-icon svg {
      width: 32px;
      height: 32px;
    }

    .upload-option-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }

    .upload-option-desc {
      font-size: 0.85rem;
      color: #666;
      text-align: center;
    }

    .upload-input {
      display: none;
    }

    .camera-view {
      width: 100%;
      max-width: 100%;
      border-radius: 8px;
      background: #000;
    }

    .camera-controls {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
    }

    .camera-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .camera-btn.capture {
      background: #da0d0dd7;
      color: white;
    }

    .camera-btn.capture:hover {
      background: #b80a0a;
    }

    .camera-btn.cancel {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #e0e0e0;
    }

    .camera-btn.cancel:hover {
      background: #e0e0e0;
    }

    .preview-container {
      text-align: center;
    }

    .preview-image {
      max-width: 100%;
      max-height: 300px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .preview-name {
      font-size: 0.9rem;
      color: #666;
      margin-top: 12px;
    }

    .change-photo-btn {
      margin-top: 12px;
      padding: 8px 16px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .change-photo-btn:hover {
      background: #f5f5f5;
      border-color: #da0d0dd7;
    }

    .date-range-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .date-range-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }

    .date-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .date-input-group {
      display: flex;
      flex-direction: column;
    }

    .date-input-group label {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 2px;
    }

    .date-input-group input {
      padding: 6px 9px;
      border: 1.5px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .date-input-group input:focus {
      outline: none;
      border-color: #da0d0dd7;
    }

    /* Ticket View Mode */
    .ticket-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 16px;
    }

    .ticket-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #666;
      flex-shrink: 0;
      overflow: hidden;
    }

    .ticket-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .ticket-user-info {
      flex: 1;
    }

    .ticket-user-name {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
    }

    .ticket-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: #888;
      flex-wrap: wrap;
    }

    .ticket-meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .ticket-meta-separator {
      color: #ccc;
    }

    .ticket-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 8px;
    }

    .ticket-tag {
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #f0f0f0;
      color: #666;
    }

    .ticket-tag.technical {
      background: #e3f2fd;
      color: #1976d2;
    }

    .ticket-tag.billing {
      background: #fff3e0;
      color: #f57c00;
    }

    .ticket-tag.general {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .ticket-tag.urgent {
      background: #ffebee;
      color: #c62828;
    }

    .ticket-more-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: #666;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .ticket-more-btn:hover {
      background: #f5f5f5;
    }

    .ticket-content {
      color: #333;
    }

    .ticket-greeting {
      font-size: 0.95rem;
      color: #333;
      margin-bottom: 12px;
    }

    .ticket-message {
      font-size: 0.95rem;
      line-height: 1.6;
      color: #555;
      margin-bottom: 16px;
      white-space: pre-wrap;
    }

    .ticket-signature {
      font-size: 0.95rem;
      color: #666;
      margin-top: 16px;
    }

    .ticket-signature-name {
      margin-top: 2px;
      color: #333;
    }

    .ticket-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 24px;
    }

    .ticket-action-btn {
      padding: 10px 32px;
      border: none;
      border-radius: 24px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ticket-action-btn.accept {
      background: #16a34a;
      color: white;
    }

    .ticket-action-btn.accept:hover {
      background: #15803d;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(22, 163, 74, 0.3);
    }

    .ticket-action-btn.decline {
      background: #dc2626;
      color: white;
    }

    .ticket-action-btn.decline:hover {
      background: #b91c1c;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
    }

    .ticket-action-btn.respond {
      background: #2563eb;
      color: white;
    }

    .ticket-action-btn.respond:hover {
      background: #1d4ed8;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
    }

    .ticket-action-btn.close {
      background: #6b7280;
      color: white;
    }

    .ticket-action-btn.close:hover {
      background: #4b5563;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(107, 114, 128, 0.3);
    }

    /* Generic Details View Mode */
    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    .details-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .details-item.full {
      grid-column: 1 / -1;
    }

    .details-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .details-value {
      font-size: 0.95rem;
      color: #333;
      font-weight: 500;
    }

    .details-value.large {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .details-divider {
      height: 1px;
      background: #e0e0e0;
      margin: 16px 0;
      grid-column: 1 / -1;
    }

    .details-section-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      grid-column: 1 / -1;
    }

    .details-status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
      width: fit-content;
    }

    .details-status-badge.pending {
      background: #fff3cd;
      color: #856404;
    }

    .details-status-badge.ongoing,
    .details-status-badge.confirmed {
      background: #cfe2ff;
      color: #084298;
    }

    .details-status-badge.completed,
    .details-status-badge.success {
      background: #d1e7dd;
      color: #0f5132;
    }

    .details-status-badge.cancelled,
    .details-status-badge.failed {
      background: #f8d7da;
      color: #842029;
    }

    .details-status-badge.active {
      background: #d1e7dd;
      color: #0f5132;
    }

    .details-status-badge.inactive,
    .details-status-badge.archived {
      background: #e2e3e5;
      color: #41464b;
    }
  `;class K extends d{constructor(){super(),this.isOpen=!1,this.title="",this.description="",this.cancelText="Cancel",this.confirmText="Confirm",this.confirmColor="danger",this.size="medium",this.closeOnOverlay=!1,this.mode="default",this.styleMode="default",this.hideFooter=!1,this.selectedFile=null,this.previewUrl="",this.cameraActive=!1,this.uploadMethod="",this.videoStream=null,this.ticketData=null,this.detailsData=null}updated(e){e.has("isOpen")&&(this.isOpen?(this.setAttribute("open",""),document.body.style.overflow="hidden"):(this.removeAttribute("open"),document.body.style.overflow="",this.selectedFile=null,this.previewUrl="",this.cameraActive=!1,this.uploadMethod="",this.stopCamera())),e.has("hideFooter")&&(this.hideFooter?this.setAttribute("hide-footer",""):this.removeAttribute("hide-footer")),e.has("styleMode")&&this.setAttribute("style-mode",this.styleMode)}close(){this.stopCamera(),this.isOpen=!1,this.dispatchEvent(new CustomEvent("dialog-close",{bubbles:!0,composed:!0}))}handleOverlayClick(e){e.target===e.currentTarget&&this.closeOnOverlay&&this.close()}handleCancel(){this.dispatchEvent(new CustomEvent("dialog-cancel",{bubbles:!0,composed:!0})),this.close()}handleConfirm(){this.mode==="upload"&&this.selectedFile?this.dispatchEvent(new CustomEvent("file-upload",{detail:{file:this.selectedFile},bubbles:!0,composed:!0})):this.dispatchEvent(new CustomEvent("dialog-confirm",{bubbles:!0,composed:!0})),this.close()}handleTicketAction(e){this.dispatchEvent(new CustomEvent("ticket-action",{detail:{action:e,ticket:this.ticketData},bubbles:!0,composed:!0})),this.close()}handleExportOption(e){var s,r;const t=((s=this.shadowRoot.getElementById("export-from-date"))==null?void 0:s.value)||null,i=((r=this.shadowRoot.getElementById("export-to-date"))==null?void 0:r.value)||null;this.dispatchEvent(new CustomEvent("export-select",{detail:{format:e,fromDate:t,toDate:i},bubbles:!0,composed:!0})),this.close()}handleFileSelect(e){var i;const t=(i=e.target.files)==null?void 0:i[0];t&&t.type.startsWith("image/")&&(this.selectedFile=t,this.previewUrl=URL.createObjectURL(t),this.uploadMethod="file",this.requestUpdate())}async startCamera(){try{this.uploadMethod="camera",this.cameraActive=!0,this.requestUpdate(),await this.updateComplete;const e=this.shadowRoot.getElementById("camera-video");e&&(this.videoStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:!1}),e.srcObject=this.videoStream)}catch(e){console.error("Error accessing camera:",e),alert("Unable to access camera. Please check permissions."),this.cameraActive=!1,this.uploadMethod=""}}stopCamera(){this.videoStream&&(this.videoStream.getTracks().forEach(e=>e.stop()),this.videoStream=null)}capturePhoto(){const e=this.shadowRoot.getElementById("camera-video"),t=document.createElement("canvas");t.width=e.videoWidth,t.height=e.videoHeight,t.getContext("2d").drawImage(e,0,0),t.toBlob(s=>{this.selectedFile=new File([s],"camera-capture.jpg",{type:"image/jpeg"}),this.previewUrl=URL.createObjectURL(s),this.stopCamera(),this.cameraActive=!1,this.requestUpdate()},"image/jpeg",.95)}cancelCamera(){this.stopCamera(),this.cameraActive=!1,this.uploadMethod="",this.requestUpdate()}backToOptions(){this.selectedFile=null,this.previewUrl="",this.uploadMethod="",this.requestUpdate()}handleDragOver(e){e.preventDefault(),e.stopPropagation();const t=this.shadowRoot.querySelector(".upload-container");t==null||t.classList.add("drag-over")}handleDragLeave(e){e.preventDefault(),e.stopPropagation();const t=this.shadowRoot.querySelector(".upload-container");t==null||t.classList.remove("drag-over")}handleDrop(e){var s,r;e.preventDefault(),e.stopPropagation();const t=this.shadowRoot.querySelector(".upload-container");t==null||t.classList.remove("drag-over");const i=(r=(s=e.dataTransfer)==null?void 0:s.files)==null?void 0:r[0];i&&i.type.startsWith("image/")&&(this.selectedFile=i,this.previewUrl=URL.createObjectURL(i),this.requestUpdate())}openFileDialog(){const e=this.shadowRoot.getElementById("file-input");e==null||e.click()}getInitials(e){return e?e.split(" ").map(t=>t[0]).join("").toUpperCase().slice(0,2):"?"}formatDate(e){if(!e)return"";const t=new Date(e),s=new Date-t,r=Math.floor(s/(1e3*60*60*24));return r===0?"today":r===1?"1 day ago":r<7?`${r} days ago`:t.toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}formatValue(e){return e==null?"N/A":typeof e=="boolean"?e?"Yes":"No":typeof e=="object"&&e instanceof Date?e.toLocaleString():e.toString()}renderDetailsView(){if(!this.detailsData)return a`<p>No data available</p>`;const e=Object.entries(this.detailsData);return a`
      <div class="details-grid">
        ${e.map(([t,i])=>t==="message"||t==="description"||t==="notes"?a`
              <div class="details-item full">
                <div class="details-label">${this.formatLabel(t)}</div>
                <div class="details-value">${this.formatValue(i)}</div>
              </div>
            `:t==="status"?a`
              <div class="details-item">
                <div class="details-label">${this.formatLabel(t)}</div>
                <div class="details-status-badge ${i==null?void 0:i.toLowerCase()}">${this.formatValue(i)}</div>
              </div>
            `:t.includes("At")||t.includes("Date")||t==="date"||t==="createdAt"||t==="updatedAt"?a`
              <div class="details-item">
                <div class="details-label">${this.formatLabel(t)}</div>
                <div class="details-value">${this.formatDate(i)||this.formatValue(i)}</div>
              </div>
            `:a`
            <div class="details-item">
              <div class="details-label">${this.formatLabel(t)}</div>
              <div class="details-value">${this.formatValue(i)}</div>
            </div>
          `)}
      </div>
    `}formatLabel(e){return e.replace(/([A-Z])/g," $1").replace(/_/g," ").replace(/^./,t=>t.toUpperCase()).trim()}renderTicketView(){if(!this.ticketData)return a`<p>No ticket data available</p>`;const{id:e,userId:t,userName:i,userAvatar:s,subject:r,message:n,category:c,location:p,createdAt:m,status:f}=this.ticketData;return a`
      <div class="ticket-header">
        <div class="ticket-avatar">
          ${s?a`<img src="${s}" alt="${i}" />`:this.getInitials(i)}
        </div>
        <div class="ticket-user-info">
          <div class="ticket-user-name">${i||t}</div>
          <div class="ticket-meta">
            <span class="ticket-meta-item">${this.formatDate(m)}</span>
            ${p?a`
              <span class="ticket-meta-separator">•</span>
              <span class="ticket-meta-item">${p}</span>
            `:""}
          </div>
          ${c?a`
            <div class="ticket-tags">
              <span class="ticket-tag ${c.toLowerCase()}">${c}</span>
            </div>
          `:""}
        </div>
        <button class="ticket-more-btn" @click=${g=>g.stopPropagation()}>⋮</button>
      </div>

      <div class="ticket-content">
        <div class="ticket-greeting">Dear GreatWorks Team,</div>
        <div class="ticket-message">${n}</div>
        <div class="ticket-signature">
          <div>Regards,</div>
          <div class="ticket-signature-name">${i||t}</div>
        </div>
      </div>

      ${f==="pending"?a`
        <div class="ticket-actions">
          <button 
            class="ticket-action-btn accept" 
            @click=${()=>this.handleTicketAction("accept")}
          >
            Accept
          </button>
          <button 
            class="ticket-action-btn decline" 
            @click=${()=>this.handleTicketAction("decline")}
          >
            Decline
          </button>
        </div>
      `:f==="ongoing"?a`
        <div class="ticket-actions">
          <button 
            class="ticket-action-btn respond" 
            @click=${()=>this.handleTicketAction("respond")}
          >
            Respond
          </button>
          <button 
            class="ticket-action-btn close" 
            @click=${()=>this.handleTicketAction("close")}
          >
            Close Ticket
          </button>
        </div>
      `:""}
    `}renderUploadMode(){var e;return this.previewUrl?a`
        <div class="preview-container">
          <img src="${this.previewUrl}" alt="Preview" class="preview-image" />
          <div class="preview-name">${((e=this.selectedFile)==null?void 0:e.name)||"Captured Photo"}</div>
          <button class="change-photo-btn" @click=${this.backToOptions}>
            Choose Different Photo
          </button>
        </div>
      `:this.cameraActive?a`
        <div>
          <video 
            id="camera-video" 
            class="camera-view" 
            autoplay 
            playsinline
          ></video>
          <div class="camera-controls">
            <button class="camera-btn capture" @click=${this.capturePhoto}>
              📸 Capture
            </button>
            <button class="camera-btn cancel" @click=${this.cancelCamera}>
              Cancel
            </button>
          </div>
        </div>
      `:a`
      <div class="upload-options">
        <div class="upload-option-card" @click=${this.startCamera}>
          <div class="upload-option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <div class="upload-option-title">Take Photo</div>
          <div class="upload-option-desc">Use your camera</div>
        </div>

        <div class="upload-option-card" @click=${this.openFileDialog}>
          <div class="upload-option-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div class="upload-option-title">Upload File</div>
          <div class="upload-option-desc">Choose from device</div>
        </div>
      </div>

      <input
        type="file"
        id="file-input"
        class="upload-input"
        accept="image/*"
        @change=${this.handleFileSelect}
      />
    `}renderExportMode(){return a`
      <div class="export-options">
        <div class="export-option" @click=${()=>this.handleExportOption("csv")}>
          <div class="export-option-icon">${u.fileCsv}</div>
          <div class="export-option-content">
            <div class="export-option-title">Export as CSV</div>
            <div class="export-option-desc">Comma-separated values for Excel</div>
          </div>
        </div>

        <div class="export-option" @click=${()=>this.handleExportOption("pdf")}>
          <div class="export-option-icon">${u.filePdf}</div>
          <div class="export-option-content">
            <div class="export-option-title">Export as PDF</div>
            <div class="export-option-desc">Portable document format</div>
          </div>
        </div>

        <div class="export-option" @click=${()=>this.handleExportOption("excel")}>
          <div class="export-option-icon">${u.fileExcel}</div>
          <div class="export-option-content">
            <div class="export-option-title">Export as Excel</div>
            <div class="export-option-desc">Microsoft Excel spreadsheet</div>
          </div>
        </div>
      </div>

      <div class="date-range-section">
        <div class="date-range-title">Date Range (Optional)</div>
        <div class="date-inputs">
          <div class="date-input-group">
            <label>From</label>
            <input type="date" id="export-from-date" />
          </div>
          <div class="date-input-group">
            <label>To</label>
            <input type="date" id="export-to-date" />
          </div>
        </div>
      </div>
    `}renderTitle(){return this.styleMode==="compact"||this.styleMode==="clean"?a`<h2 class="dialog-title">${this.title}</h2>`:a`
      <h2 class="dialog-title">
        ${this.title.split(" ").map((e,t)=>t===this.title.split(" ").length-1?a`<span class="highlight">${e}</span>`:a`${e} `)}
      </h2>
    `}render(){return this.isOpen?a`
      <div class="dialog-overlay" @click="${this.handleOverlayClick}">
        <div class="dialog-container ${this.size}">
          <div class="dialog-header">
            <div>
              ${this.renderTitle()}
              ${this.description?a`
                <p class="dialog-description">${this.description}</p>
              `:""}
            </div>
            ${this.styleMode==="compact"||this.mode==="upload"||this.mode==="ticket"||this.mode==="details"?a`
              <button class="close-btn" @click=${this.close}>×</button>
            `:""}
          </div>

          <div class="dialog-body">
            ${this.mode==="export"?this.renderExportMode():this.mode==="upload"?this.renderUploadMode():this.mode==="ticket"?this.renderTicketView():this.mode==="details"?this.renderDetailsView():a`<slot></slot>`}
          </div>

          ${!this.hideFooter&&this.mode!=="ticket"&&this.mode!=="details"?a`
            <div class="dialog-footer">
              <button class="dialog-button cancel-button" @click="${this.handleCancel}">
                ${this.cancelText}
              </button>
              <button 
                class="dialog-button confirm-button ${this.confirmColor}" 
                @click="${this.handleConfirm}"
                ?disabled=${this.mode==="upload"&&!this.selectedFile}
              >
                ${this.confirmText}
              </button>
            </div>
          `:""}
        </div>
      </div>
    `:a``}}l(K,"properties",{isOpen:{type:Boolean},title:{type:String},description:{type:String},cancelText:{type:String},confirmText:{type:String},confirmColor:{type:String},size:{type:String},closeOnOverlay:{type:Boolean},mode:{type:String},hideFooter:{type:Boolean},styleMode:{type:String},selectedFile:{type:Object},previewUrl:{type:String},cameraActive:{type:Boolean},uploadMethod:{type:String},ticketData:{type:Object},detailsData:{type:Object}}),l(K,"styles",qt);customElements.define("app-dialog",K);class X extends d{constructor(){super(),this.activePage="dashboard",this.collapsed=!1,this.showLogoutDialog=!1}connectedCallback(){super.connectedCallback(),window.addEventListener("sidebar-toggle",e=>{this.collapsed=e.detail.collapsed,this.collapsed?this.setAttribute("collapsed",""):this.removeAttribute("collapsed")})}get menuItems(){return[{id:"dashboard",label:"Dashboard",icon:u.dashboard},{id:"reservation",label:"Reservation",icon:u.calendar},{id:"booking",label:"Booking",icon:u.booking},{id:"ticket",label:"Ticket",icon:u.ticket},{id:"user",label:"User",icon:u.user},{id:"logs",label:"Logs",icon:u.logs},{id:"payments",label:"Payments",icon:u.payments},{id:"settings",label:"Settings",icon:u.settings}]}handleNavClick(e){this.activePage=e,this.dispatchEvent(new CustomEvent("page-change",{detail:{page:e},bubbles:!0,composed:!0}))}handleLogout(){this.showLogoutDialog=!0}handleLogoutConfirm(){this.showLogoutDialog=!1,this.dispatchEvent(new CustomEvent("logout",{bubbles:!0,composed:!0}))}handleLogoutCancel(){this.showLogoutDialog=!1}_handleMouseEnter(e){this.collapsed&&V.show(e.currentTarget.dataset.label,e.currentTarget)}_handleMouseLeave(){V.hide()}render(){return a`
      <div class="logo">
        <img
          src=${this.collapsed?"/assets/logoCollapse.svg":"/assets/logoExtended.svg"}
          alt="CoWork Logo"
        />
      </div>

      <nav>
        ${this.menuItems.map(e=>a`
          <div
            class="nav-item ${this.activePage===e.id?"active":""}"
            data-label="${e.label}"
            @click=${()=>this.handleNavClick(e.id)}
            @mouseenter=${this._handleMouseEnter}
            @mouseleave=${this._handleMouseLeave}
          >
            <span class="nav-icon">${e.icon}</span>
            <span class="nav-item-text">${e.label}</span>
          </div>
        `)}
      </nav>

      <div
        class="logout"
        data-label="Logout"
        @click=${this.handleLogout}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <span class="nav-icon">${u.logout}</span>
        <span class="logout-text">Logout</span>
      </div>

            <app-dialog
        .isOpen=${this.showLogoutDialog}
        title="Confirm Logout"
        cancelText="Cancel"
        confirmText="Sign out"
        confirmColor="danger"
         styleMode="clean"
        size="small"
        .closeOnOverlay=${!1}
        @dialog-confirm=${this.handleLogoutConfirm}
        @dialog-cancel=${this.handleLogoutCancel}
      >
      Are you sure you want to log out?
      </app-dialog>
    `}}l(X,"properties",{activePage:{type:String},collapsed:{type:Boolean},showLogoutDialog:{type:Boolean}}),l(X,"styles",h`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #ffffff;
      border-right: 1.25px solid #2d2b2b45;
      transition: all 0.3s ease;
    }

    :host([collapsed]) .nav-item-text,
    :host([collapsed]) .logout-text {
      display: none;
    }

    :host([collapsed]) .nav-item,
    :host([collapsed]) .logout {
      justify-content: center;
      padding: 0.875rem 0.5rem;
    }

    :host([collapsed]) .nav-icon {
      margin-right: 0;
    }

    .logo {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1.25px solid #2d2b2b45;
      flex-shrink: 0;
    }

    .logo img {
      max-height: 45px;
      max-width: 100%;
      transition: all 0.3s ease;
    }

    nav {
      flex: 1;
      padding: 0.5rem 0;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.875rem 1rem;
      color: #4e4d4d;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.85rem;
      font-weight: 600;
      position: relative;
    }

    .nav-item:hover {
      color: #ff0707d7;
    }

    .nav-item.active {
      color: #8d1409;
    }

    .nav-icon {
      margin-right: 0.75rem;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: margin 0.3s ease;
      flex-shrink: 0;
    }

    .logout {
      padding: 0.875rem 1rem;
      display: flex;
      align-items: center;
      color: #ff3b30;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.2s;
      margin-top: auto;
      position: relative;
    }

    .logout:hover {
      color: #8d1409;
    }

    .logout .nav-icon {
      margin-right: 0.75rem;
    }

    .logout-message {
      font-size: 0.9rem;
      color: #666;
      line-height: 1.5;
    }
  `);customElements.define("app-sidebar",X);const Zt=h`
:host {
      display: inline-block;
      cursor: pointer;
    }

    .avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      user-select: none;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .avatar-initials {
      font-weight: 600;
      text-transform: uppercase;
      line-height: 1;
    }

    .avatar-placeholder {
      background-color: #e0e0e0;
      color: #666;
      font-size: 14px;
    }

    .avatar-icon {
      font-size: calc(var(--avatar-size) * 0.5);
      color: #666;
    }
      `;class Q extends d{constructor(){super(),this.src="",this.name="",this.gender="",this.size="40",this.backgroundColor="#e0e0e0",this.textColor="#666"}_getDefaultAvatar(){return this.gender==="male"?"https://i.imgur.com/uherCAZ.png":this.gender==="female"?"https://i.imgur.com/WqV8GTy.png":"https://i.imgur.com/kXp4fIF.png"}_handleClick(){this.dispatchEvent(new CustomEvent("avatar-click",{detail:{name:this.name,src:this.src},bubbles:!0,composed:!0}))}_handleImageError(){this.src=""}render(){const e=`${this.size}px`,t=`${Math.floor(parseInt(this.size)*.4)}px`;let i=this.src;return(!i||i.trim()==="")&&(i=this._getDefaultAvatar()),a`
      <div 
        class="avatar"
        style="
          width: ${e};
          height: ${e};
          background-color: ${i?"transparent":this.backgroundColor};
          color: ${this.textColor};
          font-size: ${t};
          --avatar-size: ${this.size}px;
        "
        @click=${this._handleClick}
      >
        ${i?a`
          <img
            src="${i}"
            alt="${this.name||"User avatar"}"
            @error=${this._handleImageError}
          />
        `:a`
          <span class="avatar-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
          </span>
        `}
      </div>
    `}}l(Q,"properties",{src:{type:String},name:{type:String},gender:{type:String},size:{type:String},backgroundColor:{type:String},textColor:{type:String}}),l(Q,"styles",Zt);customElements.define("user-avatar",Q);class Yt{constructor(){this.callbacks=new Set,this.interval=null,this.isRunning=!1}subscribe(e){return this.callbacks.add(e),this.isRunning||this.start(),e(this.getCurrentTime()),()=>{this.callbacks.delete(e),this.callbacks.size===0&&this.stop()}}start(){this.isRunning||(this.isRunning=!0,this.interval=setInterval(()=>{const e=this.getCurrentTime();this.callbacks.forEach(t=>t(e))},1e3))}stop(){this.interval&&(clearInterval(this.interval),this.interval=null),this.isRunning=!1}getCurrentTime(){const e=new Date;return{time:e.toLocaleTimeString("en-US",{hour12:!0,hour:"2-digit",minute:"2-digit",seconds:"2-digit"}),date:e.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),timestamp:e.getTime()}}destroy(){this.stop(),this.callbacks.clear()}}const Wt=new Yt;class ee extends d{constructor(){super(),this.title="No Title",this.userName="No data yet",this.userRole="No data yet",this.userAvatar="",this.userGender="",this.currentTime="",this.currentDate=""}connectedCallback(){super.connectedCallback(),this.startClock(),this.loadUser()}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribeClock&&this.unsubscribeClock()}startClock(){this.unsubscribeClock=Wt.subscribe(e=>{this.currentTime=e.time,this.currentDate=new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})})}loadUser(){try{const e=Object.keys(localStorage).find(n=>n.startsWith("firebase:authUser"));if(!e)return;const t=JSON.parse(localStorage.getItem(e)),i=t==null?void 0:t.uid;if(!i)return;const s=sessionStorage.getItem(`admin_data_${i}`);if(!s)return;const r=JSON.parse(s);this.userName=r.displayName||`${r.firstName??""} ${r.lastName??""}`.trim()||"No data yet",this.userRole=r.role||"",this.userAvatar=r.photoURL||r.profilePicture||"",this.userGender=r.gender||""}catch{this.userName="No data yet",this.userRole="",this.userAvatar="",this.userGender=""}}render(){return a`
      <div class="header-container">
        <h1>${this.title}</h1>
        <div class="right-side">
          <div class="date-container">
            <svg class="calendar-icon" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>${this.currentDate}</span>
          </div>

          <span class="divider">/</span>

          <div class="time-container">
            <svg class="clock-icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <span>${this.currentTime}</span>
          </div>

          <span class="divider">/</span>

          <div class="user">
            <user-avatar
              .src=${this.userAvatar}
              .name=${this.userName}
              .gender=${this.userGender}
              size="48"
            ></user-avatar>
            <div class="user-details">
              <span class="user-name">${this.userName}</span>
              <span class="user-role">${this.userRole}</span>
            </div>
          </div>
        </div>
      </div>
    `}}l(ee,"properties",{title:{type:String},userName:{type:String},userRole:{type:String},userAvatar:{type:String},userGender:{type:String},currentTime:{type:String},currentDate:{type:String}}),l(ee,"styles",h`
    :host {
      display: block;
      width: 100%;
      background: white;
      border-bottom: 1.25px solid rgba(45, 43, 43, 0.27);
    }

    .header-container {
      height: 80px; /* exact old header height */
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      overflow: hidden;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
      color: #8d1409;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      line-height: 1;
    }

    /* RIGHT SIDE EXACT DESIGN */
    .right-side {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 12px;
    }

    .date-container,
    .time-container {
      display: flex;
      align-items: center;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
    }

    .calendar-icon,
    .clock-icon {
      width: 12px;
      height: 12px;
      margin-right: 4px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
    }

    .divider {
      font-size: 18px;
      font-weight: 400;
      color: #9ca3af;
      margin: 0 12px;
    }

    .user {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #ff0707d7;
    }

    .user-role {
      font-size: 11px;
      font-weight: 600;
      color: rgb(255, 175, 14)d7;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `);customElements.define("page-header",ee);class nt extends d{render(){return a`
      <slot name="one"></slot>
      <slot name="two"></slot>
      <slot name="three"></slot>
      <slot name="four"></slot>
      <slot name="main"></slot>
      <slot name="table"></slot>
    `}}l(nt,"styles",h`
    :host {
      display: grid;
      grid-template-columns: 0.9fr 0.9fr 2.2fr;
      grid-template-rows: 1fr 1.15fr auto;
      gap: 1rem;
      width: 100%;
      height: 90%;
    }

    ::slotted([slot="one"]) {
      grid-column: 1;
      grid-row: 1;
    }

    ::slotted([slot="two"]) {
      grid-column: 2;
      grid-row: 1;
    }

    ::slotted([slot="three"]) {
      grid-column: 1;
      grid-row: 2;
    }

    ::slotted([slot="four"]) {
      grid-column: 2;
      grid-row: 2;
    }

    ::slotted([slot="main"]) {
      grid-column: 3;
      grid-row: 1 / 3;
    }

    ::slotted([slot="table"]) {
      grid-column: 1 / -1;
      grid-row: 3;
    }
  `);customElements.define("dashboard-page-layout",nt);class te extends d{constructor(){super(),this.mode=1}render(){return a`
      <div class="card mode-${this.mode}">
        <slot></slot>
      </div>
    `}}l(te,"properties",{mode:{type:Number}}),l(te,"styles",h`
    :host {
      display: block;
      width: 100%;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-sizing: border-box;
    }

    .card.mode-1 {
      display: flex;
      height: 100%;
  
    }

    .card.mode-2 {
      border: none;
      display: block;
      height: 100%;
    }

    .card.mode-3 {
      border: 1.25px solid #2d2b2b45;
      padding: 1.5rem;
      display: flex;
    }

    .card.mode-4{
      border: 1.25px solid #2d2b2b45;
      display: block;
    }
  `);customElements.define("content-card",te);class ie extends d{constructor(){super(),this.title="",this.value="0",this.icon=null,this.textColor=""}render(){return a`
      <div
        class="card"
        style="--value-color: ${this.textColor||"#1a1a1a"}"
      >
        <div class="card-header">
          <div class="title">${this.title}</div>
          ${this.icon?a`<div class="icon">${this.icon}</div>`:null}
        </div>

        <div class="value">${this.value}</div>
      </div>
    `}}l(ie,"properties",{title:{type:String},value:{type:String},icon:{type:Object},textColor:{type:String}}),l(ie,"styles",h`
    :host {
      display: block;
      width: 100%;
    }

    .card {
      background: white;
      border-radius: 8px;
      padding: 0.75rem;
      border: 1.25px solid #2d2b2b45;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      box-sizing: border-box;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      font-size: 0.8rem;
      color: #080808;
      font-weight: 500;
    }

    .icon {
      color: #080808;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--value-color, #1a1a1a);
    }
  `);customElements.define("stat-card",ie);class oe extends d{constructor(){super(),this.type="chart",this.title="Chart/Table",this.icon=u.chartLine}render(){return a`
      <div class="chart-container">
        <div class="chart-header">
          <div class="chart-title-wrapper">
            ${this.icon?a`<div class="chart-icon">${this.icon}</div>`:""}
            <div class="chart-title">${this.title}</div>
          </div>
          <slot name="controls"></slot>
        </div>
        <div class="chart-content">
          <slot>
            <div class="placeholder">
              Chart or table content goes here
            </div>
          </slot>
        </div>
      </div>
    `}}l(oe,"properties",{type:{type:String},title:{type:String},icon:{type:Object}}),l(oe,"styles",h`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .chart-container {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      border: 1.25px solid #2d2b2b45;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chart-title-wrapper {
      display: flex;
      align-items: center;
      gap: 0.2rem;
    }

    .chart-icon {
      color: #ebeb09;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-icon svg {
      width: 20px;
      height: 20px;
    }

    .chart-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .chart-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 0.9rem;
      min-height: 0;
    }

    .placeholder {
      text-align: center;
    }
  `);customElements.define("dashboard-chart",oe);class se extends d{constructor(){super(),this.items=[],this.itemId="",this.isOpen=!1,this.triggerIcon="more_vert",this.position="right",this.size="medium",this.disabled=!1}connectedCallback(){super.connectedCallback(),this._boundCloseMenu=this._closeMenu.bind(this),document.addEventListener("click",this._boundCloseMenu)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._boundCloseMenu)}updated(e){e.has("isOpen")&&this.isOpen&&requestAnimationFrame(()=>this.positionMenu())}positionMenu(){const e=this.shadowRoot.querySelector(".menu-trigger"),t=this.shadowRoot.querySelector(".menu-dropdown");if(!e||!t)return;const i=e.getBoundingClientRect();t.style.top=`${i.bottom+4}px`,t.style.left=`${i.right-t.offsetWidth}px`,requestAnimationFrame(()=>{const s=t.getBoundingClientRect();s.bottom>window.innerHeight-10&&(t.style.top=`${i.top-t.offsetHeight-4}px`),s.left<10&&(t.style.left=`${i.left}px`),s.right>window.innerWidth-10&&(t.style.left=`${window.innerWidth-t.offsetWidth-10}px`)})}_closeMenu(e){this.contains(e.target)||(this.isOpen=!1)}_toggleMenu(e){e.stopPropagation(),!this.disabled&&(this.isOpen=!this.isOpen)}_handleItemClick(e,t){t.stopPropagation(),!e.disabled&&(this.isOpen=!1,this.dispatchEvent(new CustomEvent("menu-action",{detail:{action:e.action||e.key,item:e,itemId:this.itemId},bubbles:!0,composed:!0})))}render(){return a`
      <div class="action-menu">
        <button 
          class="menu-trigger ${this.size} ${this.triggerIcon==="more_vert"?"dots":""}"
          @click=${this._toggleMenu}
          ?disabled=${this.disabled}
          title="Actions"
        >
          ${this.triggerIcon}
        </button>

        <div class="menu-dropdown ${this.position} ${this.isOpen?"open":""}">
          ${this.items.map(e=>a`
            <button
              class="menu-item ${e.type||""}"
              @click=${t=>this._handleItemClick(e,t)}
              ?disabled=${e.disabled}
              title=${e.tooltip||""}
              style="position: relative;"
            >
              ${e.icon?a`<span class="menu-item-icon">${e.icon}</span>`:""}
              ${e.label}
              ${e.badge?a`<span style="position:absolute;top:8px;right:8px;min-width:16px;height:16px;padding:0 4px;background:#ff4444;color:white;border-radius:50%;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;">${e.badge}</span>`:""}
            </button>
          `)}
        </div>
      </div>
    `}}l(se,"styles",h`
    
.action-menu {
  position: relative;
  display: inline-block;
}

.menu-trigger {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff0707d7;
}

.menu-trigger:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.menu-trigger.small { font-size: 18px; padding: 2px; }
.menu-trigger.medium { font-size: 20px; padding: 4px; }
.menu-trigger.large { font-size: 24px; padding: 6px; }

.menu-trigger.dots { transform: rotate(90deg); }

.menu-dropdown {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,.1);
  z-index: 9999;
  min-width: 180px;

  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all .15s ease-out;
}

.menu-dropdown.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
}

.menu-item:hover:not(:disabled) {
  background: #f3f4f6;
  color: #111827;
}

.menu-item:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.menu-item-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Types */
.menu-item.danger:hover { background:#fef2f2; color:#dc2626; }
.menu-item.success:hover { background:#f0fdf4; color:#16a34a; }
.menu-item.warning:hover { background:#fffbeb; color:#d97706; }
.menu-item.info:hover { background:#eff6ff; color:#2563eb; }
.menu-item.primary:hover { background:#eff6ff; color:#2563eb; }

`),l(se,"properties",{items:{type:Array},itemId:{type:String},isOpen:{type:Boolean},triggerIcon:{type:String},position:{type:String},size:{type:String},disabled:{type:Boolean}});customElements.define("action-menu",se);class ae extends d{constructor(){super(),this.data=[],this.conf=[],this.loading=!1,this.mode=1,this.openMenuId=null}normalizeConfig(e){if(Array.isArray(e))return e;if(e!=null&&e.columns){const t=e.columns.map(i=>({property:i.key,header:i.label||i.key,html:i.render||null}));return Array.isArray(e.actions)&&t.push({property:"actions",header:"Actions",html:(i,s)=>this.renderActions(s,e.actions)}),t}return[]}renderActions(e,t=[]){const i=t.map(s=>({action:s.key,label:s.label,icon:s.icon||"more_vert",type:s.danger?"danger":"primary"}));return a`
      <action-menu
        .items=${i}
        .itemId=${e.id}
        .isOpen=${this.openMenuId===e.id}
        @menu-action=${s=>{this.closeAllMenus(),this.handleAction(s.detail.action,e)}}
        @click=${s=>this.toggleMenu(e.id,s)}
      ></action-menu>
    `}handleAction(e,t){this.openMenuId=null,this.dispatchEvent(new CustomEvent("table-action",{detail:{action:e,item:t},bubbles:!0,composed:!0}))}toggleMenu(e,t){t.stopPropagation(),this.openMenuId=this.openMenuId===e?null:e}closeAllMenus(){this.openMenuId=null}updated(e){e.has("mode")&&(this.classList.remove("mode-1","mode-2","mode-3"),this.classList.add(`mode-${this.mode}`))}connectedCallback(){super.connectedCallback(),this._clickHandler=()=>this.closeAllMenus(),document.addEventListener("click",this._clickHandler)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._clickHandler)}renderCell(e,t){return e.html?e.html(t[e.property],t,i=>this.handleAction(i,t),this):t[e.property]??"—"}render(){var t;const e=this.normalizeConfig(this.conf);return this.loading?a`
        <div class="table-container">
          <div class="loading">Loading...</div>
        </div>
      `:e.length?(t=this.data)!=null&&t.length?a`
      <div class="table-container">
        <table>

          <thead>
            <tr>
              ${e.map(i=>a`<th>${i.header}</th>`)}
            </tr>
          </thead>

          <tbody>
            ${this.data.map(i=>a`
              <tr>
                ${e.map(s=>a`
                  <td class=${s.property==="actions"?"action-cell":""}>
                    ${this.renderCell(s,i)}
                  </td>
                `)}
              </tr>
            `)}
          </tbody>

        </table>
      </div>
    `:a`
        <div class="table-container">
          <div class="no-data">No data available</div>
        </div>
      `:a`
        <div class="table-container">
          <div class="no-data">Invalid table configuration</div>
        </div>
      `}}l(ae,"properties",{data:{type:Array},conf:{type:Object},loading:{type:Boolean},mode:{type:Number},openMenuId:{type:String}}),l(ae,"styles",h`

.table-container { 
    background: white;
    border-radius: 8px;
    overflow: visible;
}

.table-header { display: none; }

table { 
    width: 100%; 
    border-collapse: collapse; 
}

thead { 
    background: white; 
}


thead tr:first-child th:last-child {
    border-top-right-radius: 8px;
}

th { 
    padding: 2px; 
    text-align: left; 
    font-weight: bold; 
    font-size: 11px; 
    color: #0f0f0f; 
    text-transform: uppercase; 
    letter-spacing: 0.05em; 
}

td { 
    padding: 3px 5px; 
    font-size: 12px; 
    color: #374151; 
    vertical-align: middle;
}

.action-cell {
  text-align: middle;
  vertical-align: middle;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Modes */
:host(.mode-1) .table-container {
    box-shadow: none;
    border: none;
}
:host(.mode-1) table th { border: none; }
:host(.mode-1) table td { border: none; }

:host(.mode-2) table th { 
    border: none;
    border-bottom: 1.2px solid #adadadff;
}
:host(.mode-2) table td { 
    border: none;
    border-bottom: 1.2px solid #adadadff;
}
:host(.mode-2) table tbody tr:last-child td {
    border-bottom: none !important;
}

:host(.mode-3) table th { 
    border: none;
    border-bottom: 1.2px solid #adadadff;
}
:host(.mode-3) table td { 
    border: none;
    border-bottom: 1.2px solid #adadadff;
}
:host(.mode-3) table tbody tr:last-child td {
    border-bottom: none !important;
}

.no-data, .loading { 
    text-align: center; 
    padding: 28px; 
    color: #9ca3af; 
    font-size: 12px;
}

`);customElements.define("data-table",ae);class re extends d{constructor(){super(),this.title="",this.icon=null,this.viewMoreText="View more"}handleViewMore(){this.dispatchEvent(new CustomEvent("view-more",{bubbles:!0,composed:!0}))}render(){return a`
      <div class="table-wrapper">
        <div class="table-header">
          <div class="table-title-wrapper">
            ${this.icon?a`<div class="table-icon">${this.icon}</div>`:""}
            <div class="table-title">${this.title}</div>
          </div>
        </div>
        
        <div class="table-content">
          <slot></slot>
        </div>

        <div class="table-footer">
          <a class="view-more" @click=${this.handleViewMore}>
            ${this.viewMoreText} →
          </a>
        </div>
      </div>
    `}}l(re,"properties",{title:{type:String},icon:{type:Object},viewMoreText:{type:String}}),l(re,"styles",h`
    :host {
      display: block;
      width: 100%;
    }

    .table-wrapper {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      border: 1.25px solid #2d2b2b45;
      display: flex;
      flex-direction: column;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
    }

    .table-title-wrapper {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .table-icon {
      color: #e40b0bd7;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .table-icon svg {
      width: 20px;
      height: 20px;
    }

    .table-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #e40b0bd7;
    }

    .table-content {
      margin-bottom: 1rem;
    }

    .table-footer {
      display: flex;
      justify-content: center;
    }

    .view-more {
      font-size: 0.85rem;
      color: #ff0707d7;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
      cursor: pointer;
    }

    .view-more:hover {
      color: #8d1409;
      text-decoration: underline;
    }
  `);customElements.define("dashboard-table-wrapper",re);const lt=[{id:"TCK-1001",userId:"USR-001",subject:"Login issue",status:"open",priority:"high",createdAt:"2026-01-30T08:12:00Z"},{id:"TCK-1002",userId:"USR-002",subject:"Payment not reflected",status:"pending",priority:"medium",createdAt:"2026-01-29T14:45:00Z"},{id:"TCK-1003",userId:"USR-003",subject:"Reservation cancellation request",status:"closed",priority:"low",createdAt:"2026-01-28T10:20:00Z"},{id:"TCK-1001",userId:"USR-001",subject:"Login issue",status:"open",priority:"high",createdAt:"2026-01-30T08:12:00Z"},{id:"TCK-1002",userId:"USR-002",subject:"Payment not reflected",status:"pending",priority:"medium",createdAt:"2026-01-29T14:45:00Z"},{id:"TCK-1003",userId:"USR-003",subject:"Reservation cancellation request",status:"closed",priority:"low",createdAt:"2026-01-28T10:20:00Z"},{id:"TCK-1001",userId:"USR-001",subject:"Login issue",status:"open",priority:"high",createdAt:"2026-01-30T08:12:00Z"},{id:"TCK-1002",userId:"USR-002",subject:"Payment not reflected",status:"pending",priority:"medium",createdAt:"2026-01-29T14:45:00Z"},{id:"TCK-1003",userId:"USR-003",subject:"Reservation cancellation request",status:"closed",priority:"low",createdAt:"2026-01-28T10:20:00Z"},{id:"TCK-1003",userId:"USR-003",subject:"Reservation cancellation request",status:"closed",priority:"low",createdAt:"2026-01-28T10:20:00Z"},{id:"TCK-1001",userId:"USR-001",subject:"Login issue",status:"open",priority:"high",createdAt:"2026-01-30T08:12:00Z"},{id:"TCK-1002",userId:"USR-002",subject:"Payment not reflected",status:"pending",priority:"medium",createdAt:"2026-01-29T14:45:00Z"},{id:"TCK-1003",userId:"USR-003",subject:"Reservation cancellation request",status:"closed",priority:"low",createdAt:"2026-01-28T10:20:00Z"}],dt=[{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-002",name:"Maria Santos",email:"maria@example.com",role:"customer",status:"active",createdAt:"2025-12-20T11:30:00Z"},{id:"USR-003",name:"Admin User",email:"admin@example.com",role:"admin",status:"active",createdAt:"2025-11-01T07:15:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"},{id:"USR-001",name:"Juan Dela Cruz",email:"juan@example.com",role:"customer",status:"active",createdAt:"2025-12-15T09:00:00Z"}],Ne=[{id:"RSV-5001",userId:"USR-001",date:"2026-02-05",time:"18:00",guests:2,status:"confirmed"},{id:"RSV-5002",userId:"USR-002",date:"2026-02-05",time:"19:30",guests:3,status:"confirmed"},{id:"RSV-5003",userId:"USR-003",date:"2026-02-06",time:"12:30",guests:4,status:"pending"},{id:"RSV-5004",userId:"USR-004",date:"2026-02-07",time:"20:00",guests:1,status:"cancelled"},{id:"RSV-5005",userId:"USR-005",date:"2026-02-08",time:"14:00",guests:2,status:"confirmed"},{id:"RSV-5006",userId:"USR-006",date:"2026-02-10",time:"16:30",guests:5,status:"confirmed"},{id:"RSV-5007",userId:"USR-007",date:"2026-02-12",time:"11:00",guests:2,status:"pending"},{id:"RSV-5008",userId:"USR-008",date:"2026-02-15",time:"18:30",guests:3,status:"confirmed"},{id:"RSV-5009",userId:"USR-009",date:"2026-02-18",time:"20:00",guests:1,status:"cancelled"},{id:"RSV-5010",userId:"USR-010",date:"2026-02-20",time:"13:00",guests:4,status:"confirmed"}];class Gt{static getMonthlyUsers(e){const t=new Date,i=t.getMonth(),s=t.getFullYear();return e.filter(r=>{const n=new Date(r.createdAt);return n.getMonth()===i&&n.getFullYear()===s}).length}static getTotalUsers(e){return e.length}static getTotalTickets(e){return e.length}static getPendingTickets(e){return e.filter(t=>t.status==="pending").length}static getActiveBookedUsers(e){return new Set(e.filter(i=>i.status==="confirmed").map(i=>i.userId)).size}static getMonthlyBookings(e){const t=new Date,i=t.getMonth(),s=t.getFullYear();return e.filter(r=>{const n=new Date(r.date);return n.getMonth()===i&&n.getFullYear()===s}).length}static getAllStats(e){const{users:t=[],tickets:i=[],reservations:s=[]}=e;return{monthlyUsers:this.getMonthlyUsers(t),totalUsers:this.getTotalUsers(t),totalTickets:this.getTotalTickets(i),pendingTickets:this.getPendingTickets(i),activeBookedUsers:this.getActiveBookedUsers(s),monthlyBookings:this.getMonthlyBookings(s)}}}class ne extends d{constructor(){super(),this.tickets=[...lt],this.users=[...dt],this.reservations=[...Ne],this.recentTickets=[],this.stats={monthlyUsers:0,users:0,totalTickets:0,pendingTickets:0},this.updateDashboard()}updateDashboard(){this.computeStats(),this.computeRecentTickets()}computeStats(){this.stats=Gt.getAllStats({users:this.users,tickets:this.tickets,reservations:this.reservations})}computeRecentTickets(){this.recentTickets=[...this.tickets].sort((e,t)=>new Date(t.createdAt)-new Date(e.createdAt)).slice(0,5)}handleTableAction(e){const{action:t,item:i}=e.detail;t==="ticketView"&&this.dispatchEvent(new CustomEvent("page-change",{detail:{page:"ticket",ticketId:i.id},bubbles:!0,composed:!0})),console.log("Table action:",t,i)}handleViewMoreTickets(){this.dispatchEvent(new CustomEvent("page-change",{detail:{page:"ticket"},bubbles:!0,composed:!0}))}render(){return a`
      <content-card mode="1">
        <dashboard-page-layout>

          <stat-card
            slot="one"
            title="Monthly Users"
            textColor="#811a0a"
            .value=${this.stats.monthlyUsers}
            .icon=${u.users}
          ></stat-card>

          <stat-card
            slot="two"
            title="Total Users"
            textColor="#580460"
            .value=${this.stats.totalUsers}
            .icon=${u.userSingle}
          ></stat-card>

          <stat-card
            slot="three"
            title="Total Tickets"
            textColor="#67ab07" 
            .value=${this.stats.totalTickets}
            .icon=${u.ticketInbox}
          ></stat-card>

          <stat-card
            slot="four"
            title="Pending Tickets"
            textColor="#ffac05" 
            .value=${this.stats.pendingTickets}
            .icon=${u.clock}
          ></stat-card>

          <dashboard-chart
            slot="main"
            title="Analytics Overview"
            .icon=${u.activity}
          ></dashboard-chart>

          <dashboard-table-wrapper
            slot="table"
            title="Recent Tickets"
            .icon=${u.ticket}
            viewMoreText="View more on Tickets"
            @view-more=${this.handleViewMoreTickets}
          >
            <data-table
              .data=${this.recentTickets}
              .conf=${dasboardTicketConfig}
              mode="3"
              @table-action=${this.handleTableAction}
            ></data-table>
          </dashboard-table-wrapper>

        </dashboard-page-layout>
      </content-card>
    `}}l(ne,"properties",{tickets:{type:Array},users:{type:Array},reservations:{type:Array},recentTickets:{type:Array},stats:{type:Object}}),l(ne,"styles",h`
    :host {
      display: block;
      padding: 1rem;
      height: 100%;
      box-sizing: border-box;
    }

    content-card {
      height: 100%;
      width: 100%;
    }
  `);customElements.define("admin-dashboard",ne);class le extends d{constructor(){super(),this.variant="primary",this.size="medium",this.label=""}render(){return a`
      <span class="badge ${this.variant} ${this.size}">
        <slot>${this.label}</slot>
      </span>
    `}}l(le,"properties",{variant:{type:String},size:{type:String},label:{type:String}}),l(le,"styles",h`
    :host {
      display: inline-block;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 500;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    /* Sizes */
    .badge.small {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .badge.medium {
      font-size: 0.85rem;
      padding: 4px 12px;
      border-radius: 12px;
    }

    .badge.large {
      font-size: 0.95rem;
      padding: 6px 16px;
      border-radius: 14px;
    }

    /* Status Variants */
    .badge.pending {
      background: #fff3cd;
      color: #856404;
    }

    .badge.ongoing,
    .badge.confirmed,
    .badge.processing {
      background: #cfe2ff;
      color: #084298;
    }

    .badge.completed,
    .badge.success,
    .badge.active {
      background: #d1e7dd;
      color: #0f5132;
    }

    .badge.cancelled,
    .badge.failed,
    .badge.rejected {
      background: #f8d7da;
      color: #842029;
    }

    .badge.inactive,
    .badge.archived,
    .badge.disabled {
      background: #e2e3e5;
      color: #41464b;
    }

    .badge.warning {
      background: #fff3cd;
      color: #997404;
    }

    .badge.info {
      background: #d1ecf1;
      color: #0c5460;
    }

    /* Category Variants */
    .badge.technical {
      background: #e3f2fd;
      color: #1976d2;
    }

    .badge.billing {
      background: #fff3e0;
      color: #f57c00;
    }

    .badge.general {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .badge.urgent {
      background: #ffebee;
      color: #c62828;
    }

    /* Priority Variants */
    .badge.low {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .badge.medium {
      background: #fff9c4;
      color: #f9a825;
    }

    .badge.high {
      background: #ffe0b2;
      color: #e65100;
    }

    .badge.critical {
      background: #ffcdd2;
      color: #c62828;
    }

    /* Solid Variants */
    .badge.primary {
      background: #007bff;
      color: white;
    }

    .badge.secondary {
      background: #6c757d;
      color: white;
    }

    .badge.danger {
      background: #dc3545;
      color: white;
    }

    /* Outline Variants */
    .badge.outline {
      background: transparent;
      border: 1.5px solid currentColor;
    }

    .badge.outline.primary {
      color: #007bff;
      border-color: #007bff;
    }

    .badge.outline.success {
      color: #28a745;
      border-color: #28a745;
    }

    .badge.outline.danger {
      color: #dc3545;
      border-color: #dc3545;
    }

    .badge.outline.warning {
      color: #ffc107;
      border-color: #ffc107;
    }

    .badge.outline.info {
      color: #17a2b8;
      border-color: #17a2b8;
    }

    /* Dot Indicator */
    .badge.with-dot::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      margin-right: 6px;
    }
  `);customElements.define("badge-component",le);const Jt={columns:[{key:"id",label:"ID"},{key:"userId",label:"User ID"},{key:"guests",label:"# of Guest"},{key:"status",label:"Status",render:o=>{const e=(o==null?void 0:o.toLowerCase())==="confirmed"||(o==null?void 0:o.toLowerCase())==="ongoing"?"confirmed":(o==null?void 0:o.toLowerCase())==="completed"?"completed":(o==null?void 0:o.toLowerCase())==="pending"||(o==null?void 0:o.toLowerCase())==="upcoming"?"pending":(o==null?void 0:o.toLowerCase())==="cancelled"?"cancelled":"primary";return a`
                    <badge-component variant="${e}" size="small">
                        ${o}
                    </badge-component>
                `}},{key:"date",label:"Date",render:o=>new Date(o).toLocaleString()},{key:"time",label:"Time"}],actions:[{key:"view",label:"View",icon:"visibility"}]};function S(o,e){return!o||e<=0?0:Math.ceil(o/e)}function Kt(o,e,t=3){if(e<=t+2)return Array.from({length:e},(c,p)=>p+1);const i=[],s=Math.floor(t/2);let r=Math.max(2,o-s),n=Math.min(e-1,o+s);o<=s+1&&(r=2,n=t+1),o>=e-s&&(r=e-t,n=e-1),i.push(1),r>2&&i.push("...");for(let c=r;c<=n;c++)i.push(c);return n<e-1&&i.push("..."),i.push(e),i}const Xt=h`
  :host {
    display: inline-block;
    color: #000000;
    font-size: 14px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .info-text {
    margin: 0;
    line-height: 1.5;
  }

  /* Mode 1 - Default style with border and background */
  :host(.mode-1) .pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 6px 8px;
    background: white;
    border-radius: 24px;
    border: 1.2px solid #2d2b2b45;
    width: fit-content;
    margin: 0 auto;
  }

  :host(.mode-1) .pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 38px;
    height: 38px;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: #666464;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
  }

  :host(.mode-1) .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :host(.mode-1) .pagination-btn.active {
    background: #070707;
    color: white;
    font-weight: 600;
  }

  :host(.mode-1) .search-box {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
    background: #f9fafb;
    border-radius: 12px;
    padding: 3px 8px;
  }

  :host(.mode-1) .search-input {
    border: none;
    background: transparent;
    width: 60px;
    outline: none;
    font-size: 14px;
    color: #374151;
    text-align: center;
  }

  :host(.mode-1) .search-btn {
    border: none;
    background: #f40c0c;
    color: white;
    border-radius: 8px;
    padding: 4px 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }

  /* Mode 2 - Simple text-based style */
  :host(.mode-2) .pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 4px;
    background: transparent;
    width: fit-content;
    margin: 0 auto;
  }

  :host(.mode-2) .pagination-btn {
    border: none;
    background: transparent;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 8px;
    transition: color 0.2s ease;
  }

  :host(.mode-2) .pagination-btn:hover:not(:disabled) {
    color: #000000;
    text-decoration: underline;
  }

  :host(.mode-2) .pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :host(.mode-2) .pagination-btn.active {
    color: #000000;
    font-weight: 700;
  }

  .dots {
    color: #090909;
    font-size: 15px;
    padding: 0 6px;
  }

  .icon {
    font-family: 'Material Symbols Outlined';
    font-size: 18px;
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    line-height: 1;
  }
`;class de extends d{constructor(){super(),this.currentPage=1,this.totalPages=1,this.disabled=!1,this.mode=1,this._searchValue=""}updated(e){e.has("mode")&&(this.classList.remove("mode-1","mode-2"),this.classList.add(`mode-${this.mode}`))}connectedCallback(){super.connectedCallback(),this.classList.add(`mode-${this.mode}`)}_emitPageChange(e){this.disabled||e===this.currentPage||e==="..."||e<1||e>this.totalPages||this.dispatchEvent(new CustomEvent("pagination-change",{detail:{page:e},bubbles:!0,composed:!0}))}_handlePrevious(){this._emitPageChange(this.currentPage-1)}_handleNext(){this._emitPageChange(this.currentPage+1)}_handleSearchInput(e){this._searchValue=e.target.value}_handleSearchSubmit(){const e=Number(this._searchValue);Number.isNaN(e)||(this._emitPageChange(e),this._searchValue="")}render(){if(this.totalPages<=1)return a``;const e=Kt(this.currentPage,this.totalPages,3);return a`
      <div class="pagination-container">
        <button
          class="pagination-btn"
          ?disabled=${this.disabled||this.currentPage===1}
          @click=${this._handlePrevious}
        >
          ${this.mode===1?"←":"Previous"}
        </button>

        ${e.map(t=>t==="..."?a`<span class="dots">…</span>`:a`
                <button
                  class="pagination-btn ${t===this.currentPage?"active":""}"
                  ?disabled=${this.disabled}
                  @click=${()=>this._emitPageChange(t)}
                >
                  ${t}
                </button>
              `)}

        <button
          class="pagination-btn"
          ?disabled=${this.disabled||this.currentPage===this.totalPages}
          @click=${this._handleNext}
        >
          ${this.mode===1?"→":"Next"}
        </button>

        ${this.mode===1?a`
          <div class="search-box">
            <input
              class="search-input"
              type="number"
              min="1"
              max=${this.totalPages}
              placeholder="Page"
              .value=${this._searchValue}
              @input=${this._handleSearchInput}
            />
            <button
              class="search-btn"
              title="Go to page"
              @click=${this._handleSearchSubmit}
            >
              <svg class="search-icon" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        `:""}
      </div>
    `}}l(de,"properties",{currentPage:{type:Number},totalPages:{type:Number},disabled:{type:Boolean},mode:{type:Number},_searchValue:{type:String,state:!0}}),l(de,"styles",[Xt,h`
      .search-icon {
        width: 16px;
        height: 16px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `]);customElements.define("pagination-component",de);class ce extends d{constructor(){super(),this.tabs=[],this.activeTab="",this.variant="default"}updated(e){e.has("variant")&&(this.variant?this.setAttribute("variant",this.variant):this.removeAttribute("variant"))}handleTabClick(e){this.activeTab=e,this.dispatchEvent(new CustomEvent("tab-change",{detail:{tab:e},bubbles:!0,composed:!0}))}render(){return a`
      <div class="tabs-container">
        ${this.tabs.map(e=>a`
          <button
            class="tab ${this.activeTab===e.id?"active":""}"
            @click=${()=>this.handleTabClick(e.id)}
          >
            ${e.label}
          </button>
        `)}
      </div>
      <div class="tab-content">
        <slot></slot>
      </div>
    `}}l(ce,"properties",{tabs:{type:Array},activeTab:{type:String},variant:{type:String}}),l(ce,"styles",h`
    :host {
      display: block;
      width: 100%;
    }

    .tabs-container {
      display: flex;
      gap: 1.5rem;
    }

    .tab {
      padding: 0 0 0.75rem 0;
      font-size: 0.875rem;
      font-weight: 400;
      color: #5a5858;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
        margin-top: 0.5rem;
    }

    .tab:hover {
      color: #374151;
    }

    .tab.active {
      color: #111827;
      font-weight: 500;
      border-bottom: 2px solid #111827;
    }

    /* Variant: Primary */
    :host([variant="primary"]) .tab.active {
      color: #ff0707d7;
      border-bottom-color: #ff0707d7;
    }

    /* Content slot */
    .tab-content {
      display: block;
    }
  `);customElements.define("tabs-component",ce);class he extends d{constructor(){super(),this.placeholder="Search...",this.value="",this.disabled=!1,this.showFilter=!0}_handleInput(e){this.value=e.target.value,this.dispatchEvent(new CustomEvent("search-input",{detail:{value:this.value},bubbles:!0,composed:!0}))}_handleKeyDown(e){e.key==="Enter"&&this._handleSearch()}_handleSearch(){this.dispatchEvent(new CustomEvent("search",{detail:{value:this.value},bubbles:!0,composed:!0}))}_handleFilter(){this.dispatchEvent(new CustomEvent("filter-click",{bubbles:!0,composed:!0}))}render(){return a`
      <div class="search-container">
        ${this.showFilter?a`
          <button
            class="filter-button"
            @click=${this._handleFilter}
            title="Filter"
          >
            tune
          </button>
        `:""}

        <input
          class="search-input"
          type="text"
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          @input=${this._handleInput}
          @keydown=${this._handleKeyDown}
        />

        <button
          class="search-button"
          @click=${this._handleSearch}
          title="Search"
          ?disabled=${this.disabled}
        >
          search
        </button>
      </div>
    `}}l(he,"properties",{placeholder:{type:String},value:{type:String},disabled:{type:Boolean},showFilter:{type:Boolean}}),l(he,"styles",h`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }

    .search-container {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #ffffff;
      border: 1px solid #adadad;
      border-radius: 6px;
      padding: 2px 4px;
      box-sizing: border-box;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 12px;
      color: #111827;
      background: transparent;
      padding: 4px 6px;
    }

    .search-input::placeholder {
      color: #9ca3af;
    }

    .search-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    button {
      font-family: 'Material Symbols Outlined', sans-serif;
      font-variation-settings: 
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 18;

      background: none;
      border: none;
      cursor: pointer;
      padding: 3px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: background 0.15s ease, color 0.15s ease;
      font-size: 18px;
    }

    button:hover:not(:disabled) {
      background: #f3f4f6;
      color: #111827;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .filter-button {
      color: #2563eb;
    }

    .search-button {
      color: #16a34a;
    }
  `);customElements.define("search-bar",he);const Qt=h`   :host {
      display: inline-block;
    }

    button {
      font-family: inherit;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-weight: 500;
      transition: background-color 0.2s ease, transform 0.1s ease;
      box-sizing: border-box;
      white-space: nowrap;
    }

    button:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* ===== TYPES ===== */

    .primary {
      background: #da0d0dd7;
      color: #ffffff;
    }
    .primary:hover:not(:disabled) {
      background: rgb(212, 36, 6)
    }

    .secondary {
      background: #da0d0dd7;
      color: #ffffff;
      border: 1.25px solid #000000;
    }
    .secondary:hover:not(:disabled) {
      background: #131313;
      color:#da0d0dd7;
    }
      

    .tertiary {
      background: #2c2b2b;
      color: #ea0606;
    }
    .tertiary:hover:not(:disabled) {
      background: #000000;
      color: #ffffff;
    }

    .quaternary {
      background: #101010;
      color: #ffffff;
    }
    .quaternary:hover:not(:disabled) {
       color: #ffffff;
      background: #101010;
    }

    .danger {
      background: #dc3545;
      color: #ffffff;
    }
    .danger:hover:not(:disabled) {
      background: #a71d2a;
    }

    .warning {
      background: #ffffff;
      color: #dc3545;
      border: 1px solid #dc3545;
    }
    .warning:hover:not(:disabled) {
      background: #fff5f5;
    }

    /* ===== SIZES ===== */

    .small {
      font-size: 12px;
      padding: 4px 8px;
    }

    .medium {
      font-size: 13px;
      padding: 6px 12px;
    }

    .large {
      font-size: 15px;
      padding: 8px 16px;
    }
  `;class pe extends d{constructor(){super(),this.type="primary",this.size="medium",this.disabled=!1}render(){return a`
      <button
        class="${this.type} ${this.size}"
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `}}l(pe,"properties",{type:{type:String},size:{type:String},disabled:{type:Boolean}}),l(pe,"styles",Qt);customElements.define("app-button",pe);class ue extends d{constructor(){super(),this.type="text",this.required=!1,this.disabled=!1,this.value="",this.error="",this.variant="default"}updated(e){e.has("variant")&&this.setAttribute("variant",this.variant)}handleInput(e){this.value=e.target.value,this.dispatchEvent(new CustomEvent("input-change",{detail:{name:this.name,value:this.value},bubbles:!0,composed:!0}))}render(){return a`
      <div class="form-group">
        ${this.label?a`<label for="${this.name}">${this.label}</label>`:""}
        <input
          type="${this.type}"
          id="${this.name}"
          name="${this.name}"
          placeholder="${this.placeholder||""}"
          .value="${this.value}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          class="${this.error?"error":""}"
          @input="${this.handleInput}"
        >
        ${this.error?a`<span class="error-message">${this.error}</span>`:""}
      </div>
    `}}l(ue,"properties",{label:{type:String},type:{type:String},name:{type:String},placeholder:{type:String},required:{type:Boolean},disabled:{type:Boolean},value:{type:String},error:{type:String},variant:{type:String}}),l(ue,"styles",h`
    :host {
      display: block;
      margin-bottom: 1.5rem;
    }

    :host([variant="compact"]) {
      margin-bottom: 0;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-size: 0.9rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1.25px solid #2d2b2b45;
      border-radius: 8px;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #ff0707d7;
    }

    input:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    input.error {
      border-color: #c00;
    }

    .error-message {
      color: #c00;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }
  `);customElements.define("input-field",ue);class ct extends d{render(){return a`
      <form id="book-form">
        <div class="form-grid">
          <input-field
            label="Full Name"
            type="text"
            name="userName"
            placeholder="Enter name"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <input-field
            label="Email"
            type="email"
            name="email"
            placeholder="Enter email"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <input-field
            label="Phone"
            type="tel"
            name="phone"
            placeholder="Enter phone"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <input-field
            label="Date"
            type="date"
            name="date"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <input-field
            label="Time"
            type="time"
            name="time"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <input-field
            label="Duration (hrs)"
            type="number"
            name="duration"
            value="1"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <div class="form-group">
            <label>Room Type *</label>
            <select name="roomType" required>
              <option value="">Select type</option>
            </select>
          </div>

          <input-field
            label="Guests"
            type="number"
            name="guests"
            value="1"
            variant="compact">
          </input-field>

      
        </div>

        <div class="form-actions">
          <slot name="actions"></slot>
        </div>
      </form>
    `}}l(ct,"styles",h`
    :host {
      display: block;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full {
      grid-column: 1 / -1;
    }

    label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 3px;
    }

    select,
    textarea {
      padding: 5px 8px;
      border: 1.5px solid #2d2b2b45;
      border-radius: 4px;
      font-size: 0.8rem;
      font-family: inherit;
    }

    select:focus,
    textarea:focus {
      outline: none;
      border-color: #ff0707d7;
    }

    textarea {
      resize: vertical;
      min-height: 50px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
    }
  `);customElements.define("book-someone-form",ct);class ge extends d{constructor(){super(),this.mode="1"}render(){return a`<slot></slot>`}}l(ge,"properties",{mode:{type:String}}),l(ge,"styles",h`
    :host {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      justify-content: space-between;
    }
  `);customElements.define("header-controls",ge);class ht extends d{render(){return a`<slot></slot>`}}l(ht,"styles",h`
    :host {
      flex: 1;
    }
  `);customElements.define("tabs-wrapper",ht);class pt extends d{render(){return a`<slot></slot>`}}l(pt,"styles",h`
    :host {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  `);customElements.define("search-wrapper",pt);class me extends d{constructor(){super(),this.width="default"}updated(e){e.has("width")&&(this.width==="small"?this.setAttribute("width","small"):this.width==="large"?this.setAttribute("width","large"):this.removeAttribute("width"))}render(){return a`<slot></slot>`}}l(me,"properties",{width:{type:String}}),l(me,"styles",h`
    :host {
      width: 300px;
    }

    :host([width="small"]) {
      width: 200px;
    }

    :host([width="large"]) {
      width: 400px;
    }
  `);customElements.define("search-bar-wrapper",me);class ut extends d{render(){return a`<slot></slot>`}}l(ut,"styles",h`
    :host {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
      width: 100%;
    }
  `);customElements.define("pagination-wrapper",ut);class fe extends d{constructor(){super(),this.toasts=[],this.position="top-center",this.toastId=0}getIcon(e){const t={success:a`
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `,error:a`
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            `,warning:a`
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            `,info:a`
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            `};return t[e]||t.info}show(e,t="info",i=4e3){const s=++this.toastId,r={id:s,message:e,type:t,duration:i,removing:!1};return this.toasts=[...this.toasts,r],setTimeout(()=>this.remove(s),i),s}success(e,t=4e3){return this.show(e,"success",t)}error(e,t=5e3){return this.show(e,"error",t)}warning(e,t=4e3){return this.show(e,"warning",t)}info(e,t=4e3){return this.show(e,"info",t)}remove(e){const t=this.toasts.findIndex(i=>i.id===e);t!==-1&&(this.toasts[t].removing=!0,this.requestUpdate(),setTimeout(()=>{this.toasts=this.toasts.filter(i=>i.id!==e)},300))}removeAll(){this.toasts.forEach(e=>e.removing=!0),this.requestUpdate(),setTimeout(()=>this.toasts=[],300)}render(){return a`
      ${this.toasts.map(e=>a`
        <div class="toast ${e.type} ${e.removing?"removing":""}">
          <span class="toast-icon">${this.getIcon(e.type)}</span>
          <span class="toast-message">${e.message}</span>
          <button class="toast-close" @click="${()=>this.remove(e.id)}">×</button>
        </div>
      `)}
    `}}l(fe,"properties",{toasts:{type:Array},position:{type:String}}),l(fe,"styles",h`
    :host {
      position: fixed;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
      width: auto;
      max-width: 320px;
    }
    :host([position="top-right"]) { top: 16px; right: 16px; align-items: flex-end; }
    :host([position="top-center"]) { top: 16px; left: 50%; transform: translateX(-50%); align-items: center; }
    :host([position="bottom-center"]) { bottom: 16px; left: 50%; transform: translateX(-50%); align-items: center; }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 1px solid #e0e0e0;
      pointer-events: auto;
      opacity: 1;
      transition: transform 0.3s ease, opacity 0.3s ease;
      min-width: 280px;
    }

    .toast.removing { 
      opacity: 0; 
      transform: translateY(-20px); 
    }

    .toast-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-icon svg {
      width: 20px;
      height: 20px;
    }

    .toast.success .toast-icon { color: #28a745; }
    .toast.error .toast-icon { color: #dc3545; }
    .toast.warning .toast-icon { color: #ffc107; }
    .toast.info .toast-icon { color: #17a2b8; }

    .toast-message { 
      flex: 1;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .toast.success .toast-message { color: #28a745; }
    .toast.error .toast-message { color: #dc3545; }
    .toast.warning .toast-message { color: #d39e00; }
    .toast.info .toast-message { color: #17a2b8; }

    .toast-close {
      background: none;
      border: none;
      color: #ff0000;
      font-size: 1.25rem;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .toast-close:hover {
      background: #f0f0f0;
      color: #b00202;
    }
  `);customElements.define("toast-component",fe);class ei{constructor(){this.component=null,this.defaultPosition="top-center"}ensureComponent(e=this.defaultPosition){return(!this.component||this.component.position!==e)&&(this.component&&this.component.remove(),this.component=document.createElement("toast-component"),this.component.position=e,this.component.setAttribute("position",e),document.body.appendChild(this.component)),this.component}setPosition(e){this.defaultPosition=e,this.component&&(this.component.position=e,this.component.setAttribute("position",e))}show(e,t="info",i=4e3,s=this.defaultPosition){return this.ensureComponent(s).show(e,t,i)}success(e,t=4e3,i=this.defaultPosition){return this.ensureComponent(i).success(e,t)}error(e,t=5e3,i=this.defaultPosition){return this.ensureComponent(i).error(e,t)}warning(e,t=4e3,i=this.defaultPosition){return this.ensureComponent(i).warning(e,t)}info(e,t=4e3,i=this.defaultPosition){return this.ensureComponent(i).info(e,t)}remove(e){var t;return(t=this.component)==null?void 0:t.remove(e)}removeAll(){var e;return(e=this.component)==null?void 0:e.removeAll()}}const b=new ei;class be extends d{constructor(){super(),this.reservation=Ne,this.currentPage=1,this.itemsPerPage=10,this.activeTab="all",this.searchValue="",this.showAddDialog=!1,this.showExportDialog=!1,this.showDetailsDialog=!1,this.selectedReservation=null,this.reservationLoading=!1,this.tabs=[{id:"all",label:"All"},{id:"upcoming",label:"Upcoming"},{id:"ongoing",label:"Ongoing"},{id:"completed",label:"Archived/Complete"}],this.updatePagination(),this.handlePageChange=this.handlePageChange.bind(this),this.handleTableAction=this.handleTableAction.bind(this)}get filteredReservations(){let e=this.reservation;if(this.activeTab==="upcoming"?e=e.filter(t=>t.status==="upcoming"||t.status==="pending"):this.activeTab==="ongoing"?e=e.filter(t=>t.status==="confirmed"||t.status==="ongoing"):this.activeTab==="completed"&&(e=e.filter(t=>t.status==="completed"||t.status==="cancelled")),this.searchValue){const t=this.searchValue.toLowerCase();e=e.filter(i=>{var s,r,n,c;return((s=i.id)==null?void 0:s.toLowerCase().includes(t))||((r=i.userId)==null?void 0:r.toLowerCase().includes(t))||((n=i.date)==null?void 0:n.toLowerCase().includes(t))||((c=i.status)==null?void 0:c.toLowerCase().includes(t))})}return e}get paginatedReservation(){const e=(this.currentPage-1)*this.itemsPerPage;return this.filteredReservations.slice(e,e+this.itemsPerPage)}updatePagination(){this.totalPages=S(this.filteredReservations.length,this.itemsPerPage)}handleTabChange(e){this.activeTab=e.detail.tab,this.currentPage=1,this.updatePagination()}handleSearch(e){this.searchValue=e.detail.value,this.currentPage=1,this.updatePagination()}handleSearchInput(e){this.searchValue=e.detail.value,this.currentPage=1,this.updatePagination()}handlePageChange(e){this.currentPage=e.detail.page}handleTableAction(e){const{action:t,item:i}=e.detail;t==="view"&&(this.selectedReservation=i,this.showDetailsDialog=!0)}handleAddReservation(){this.showAddDialog=!0}handleExport(){this.showExportDialog=!0}handleExportSelect(e){console.log("Export reservations as:",e.detail.format),this.showExportDialog=!1}handleDialogClose(){this.showAddDialog=!1,this.showExportDialog=!1,this.showDetailsDialog=!1,this.selectedReservation=null}handleAddReservationSubmit(e){e.preventDefault(),this.reservationLoading=!0;const t=new FormData(e.target),i={userName:t.get("userName"),email:t.get("email"),phone:t.get("phone"),date:t.get("date"),time:t.get("time"),duration:t.get("duration"),roomType:t.get("roomType"),guests:t.get("guests"),notes:t.get("notes")};console.log("Create reservation data:",i),setTimeout(()=>{this.reservationLoading=!1,b.success("Reservation created successfully!"),this.showAddDialog=!1},1e3)}handleCancelDialog(){this.showAddDialog=!1}render(){return a`
      <content-card mode="4">
        <header-controls>
          <tabs-wrapper>
            <tabs-component
              .tabs=${this.tabs}
              .activeTab=${this.activeTab}
              variant="primary"
              @tab-change=${this.handleTabChange}>
            </tabs-component>
          </tabs-wrapper>
          
          <search-wrapper>
            <app-button
              type="tertiary"
              size="small"
              @click=${this.handleAddReservation}>
              ${u.plus} Reservation
            </app-button>
            <app-button
              type="secondary"
              size="small"
              @click=${this.handleExport}>
              ${u.export} Export
            </app-button>
            <search-bar-wrapper>
              <search-bar
                placeholder="Search reservations..."
                .value=${this.searchValue}
                .showFilter=${!1}
                @search=${this.handleSearch}
                @search-input=${this.handleSearchInput}>
              </search-bar>
            </search-bar-wrapper>
          </search-wrapper>
        </header-controls>

        <data-table
          .data=${this.paginatedReservation}
          .conf=${Jt}
          mode="1"
          @table-action=${this.handleTableAction}>
        </data-table>

        <pagination-wrapper>
          <pagination-component
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            @pagination-change=${this.handlePageChange}>
          </pagination-component>
        </pagination-wrapper>
      </content-card>

      <app-dialog
        .isOpen=${this.showAddDialog}
        title="Add Reservation"
        description="Fill in the reservation details"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${!1}
        .hideFooter=${!0}
        @dialog-close=${this.handleDialogClose}>
        <book-someone-form>
          <app-button 
            slot="actions" 
            type="warning" 
            size="medium" 
            @click=${this.handleCancelDialog} 
            ?disabled=${this.reservationLoading}>
            Cancel
          </app-button>
          <app-button 
            slot="actions" 
            type="primary" 
            size="medium" 
            @click=${e=>{const t=this.shadowRoot.querySelector("book-someone-form").shadowRoot.getElementById("book-form");t.checkValidity()?(this.handleAddReservationSubmit(new Event("submit",{cancelable:!0,target:t})),e.preventDefault()):t.reportValidity()}} 
            ?disabled=${this.reservationLoading}>
            ${this.reservationLoading?"Creating...":"Create Reservation"}
          </app-button>
        </book-someone-form>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Reservations"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${!1}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showDetailsDialog}
        title="Reservation Details"
        mode="details"
        size="medium"
        styleMode="compact"
        .hideFooter=${!0}
        .closeOnOverlay=${!0}
        .detailsData=${this.selectedReservation}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>
    `}}l(be,"properties",{reservation:{type:Array},currentPage:{type:Number},itemsPerPage:{type:Number},totalPages:{type:Number},activeTab:{type:String},searchValue:{type:String},showAddDialog:{type:Boolean},showExportDialog:{type:Boolean},showDetailsDialog:{type:Boolean},selectedReservation:{type:Object},reservationLoading:{type:Boolean}}),l(be,"styles",h`
    :host {
      display: block;
      padding: 1rem;
      height: 100%;
      box-sizing: border-box;
    }

    .content-card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      border: 1.25px solid #2d2b2b45;
    }
  `);customElements.define("admin-reservation",be);class xe extends d{constructor(){super(),this.options=[],this.value="",this.placeholder="Select...",this.disabled=!1,this.size="medium",this.variant="default",this.fullWidth=!1,this.label=""}updated(e){e.has("fullWidth")&&(this.fullWidth?this.setAttribute("full-width",""):this.removeAttribute("full-width"))}handleChange(e){this.value=e.target.value,this.dispatchEvent(new CustomEvent("change",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return a`
      <div class="dropdown-container">
        ${this.label?a`
          <label class="dropdown-label">${this.label}</label>
        `:""}
        
        <select
          class="${this.size} ${this.variant}"
          .value=${this.value}
          ?disabled=${this.disabled}
          @change=${this.handleChange}
        >
          ${this.placeholder&&!this.value?a`
            <option value="" disabled selected>${this.placeholder}</option>
          `:""}
          
          ${this.options.map(e=>a`
            <option value="${e.value}" ?selected=${e.value===this.value}>
              ${e.label}
            </option>
          `)}
        </select>
      </div>
    `}}l(xe,"properties",{options:{type:Array},value:{type:String},placeholder:{type:String},disabled:{type:Boolean},size:{type:String},variant:{type:String},fullWidth:{type:Boolean},label:{type:String}}),l(xe,"styles",h`
    :host {
      display: inline-block;
    }

    :host([full-width]) {
      display: block;
      width: 100%;
    }

    .dropdown-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }

    .dropdown-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #010101;
    }

    select {
      font-family: inherit;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      appearance: none;
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 12px;
      padding-right: 32px;
    }


    /* ===== SIZES ===== */
    .small {
      font-size: 0.75rem;
      padding: 0.4rem 0.6rem;
      min-width: 100px;
    }

    .medium {
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      min-width: 120px;
    }

    .large {
      font-size: 1rem;
      padding: 0.625rem 1rem;
      min-width: 150px;
    }

    /* ===== VARIANTS ===== */
    .default {
      background-color: #ff0000;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      border-color: #d0d0d0;
      color: #333;
    }

    .default:hover:not(:disabled) {
      border-color: #999;
      background-color: #f9f9f9;
    }

    .default:focus {
      border-color: #666;
    }

    .dark {
      background-color: #010101fb;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      color: #ffffff;
    }


    .dark:focus {
      border-color: #ffffff;
    }

    .light {
      background-color: #11d5cb;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      color: #ffffff;
    }

    .primary {
      background-color: #ff0707d7;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      border-color: #e60606;
      color: #ffffff;
    }

    .primary:hover:not(:disabled) {
      background-color: #e69d0a;
      border-color: #d08c00;
    }

    .primary:focus {
      border-color: #ffae0b;
    }

    /* Full width */
    :host([full-width]) select {
      width: 100%;
    }
  `);customElements.define("app-dropdown",xe);class ve extends d{constructor(){super();const e=new Date;this.month=e.getMonth(),this.year=e.getFullYear(),this.reservations=[],this.selectedDate=null,this.branches=[],this.selectedBranch="all"}updated(e){if(e.has("selectedDate")&&this.selectedDate){const[t,i]=this.selectedDate.split("-").map(Number);t&&i&&(t!==this.year||i-1!==this.month)&&(this.year=t,this.month=i-1)}}prevMonth(){this.month--,this.month<0&&(this.month=11,this.year--)}nextMonth(){this.month++,this.month>11&&(this.month=0,this.year++)}handleDayClick(e,t){this.dispatchEvent(new CustomEvent("day-click",{detail:{date:e,bookings:t},bubbles:!0,composed:!0}))}handleBranchChange(e){this.dispatchEvent(new CustomEvent("branch-change",{detail:{branch:e.detail.value},bubbles:!0,composed:!0}))}render(){const e=new Date(this.year,this.month,1).getDay(),t=new Date(this.year,this.month+1,0).getDate(),i=new Date().toISOString().slice(0,10);let s=[];for(let n=0;n<e;n++)s.push(a`<div class="day empty-day"></div>`);for(let n=1;n<=t;n++){const c=`${this.year}-${String(this.month+1).padStart(2,"0")}-${String(n).padStart(2,"0")}`,p=this.reservations.filter(w=>w.date===c),m=4,f=p.slice(0,m),g=p.length-m,v=c===i,y=c===this.selectedDate;s.push(a`
        <div 
          class="day ${v?"today":""} ${y?"selected":""}" 
          @click=${()=>this.handleDayClick(c,p)}
        >
          <div class="day-number">${n}</div>
          ${p.length>0?a`
            <div class="avatars-container">
              ${f.map(w=>a`
                <div class="avatar-wrapper">
                  <user-avatar
                    .src=${w.avatar||""}
                    .name=${w.userId}
                    .gender=${w.gender||""}
                    size="22"
                  ></user-avatar>
                </div>
              `)}
              ${g>0?a`
                <div class="more-count">+${g}</div>
              `:""}
            </div>
          `:""}
        </div>
      `)}const r=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];return a`
      <div class="calendar-container">
        <div class="header">
          <div class="header-left">
            <div class="month-year">
              ${new Date(this.year,this.month).toLocaleString("default",{month:"long"})} ${this.year}
            </div>
            <div class="nav-buttons">
              <button @click=${this.prevMonth} aria-label="Previous month">‹</button>
              <button @click=${this.nextMonth} aria-label="Next month">›</button>
            </div>
          </div>

          <div class="header-right">
            <app-dropdown
              variant="light"
              size="small"
              .options=${this.branches}
              .value=${this.selectedBranch}
              @change=${this.handleBranchChange}
            ></app-dropdown>
            <slot name="today-btn"></slot>
            <slot name="controls"></slot>
          </div>
        </div>
        <div class="calendar">
          ${r.map(n=>a`<div class="weekday">${n}</div>`)}
          ${s}
        </div>
      </div>
    `}}l(ve,"properties",{month:{type:Number},year:{type:Number},reservations:{type:Array},selectedDate:{type:String},branches:{type:Array},selectedBranch:{type:String}}),l(ve,"styles",h`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .calendar-container {
      width: 100%;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      padding: 0 0.15rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .month-year {
      font-weight: 600;
      font-size: 1.1rem;
      color: #1a1a1a;
      letter-spacing: -0.02em;
    }

    .nav-buttons {
      display: flex;
      gap: 0.4rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    button {
      cursor: pointer;
      background: #ffffff;
      border-color: red;
      border-radius: 6px;
      width: 36px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 500;
    }

    button:hover {
      border-color: black;
      background: #e70707;
      color: white;
      transform: translateY(-1px);
    }

    button:active {
      transform: translateY(0);
    }

    .calendar {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 5px;
      background: #df0707;
      padding: 0.4rem;
      border-radius: 8px;
    }

    .weekday {
      text-align: center;
      font-weight: 600;
      padding: 0.4rem 0.2rem;
      background: transparent;
      color: #ffffff;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .day {
      min-height: 70px;
      background: white;
      border-radius: 6px;
      padding: 0.4rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      transition: all 0.2s ease;
      border: 2px solid transparent;
      position: relative;
      overflow: visible;
    }

    .day:hover {
      border-color: #e70707;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(231, 7, 7, 0.1);
      z-index: 1;
    }

    .day.selected {
      border-color: #e70707;
      background: #fff5f5;
      box-shadow: 0 2px 8px rgba(231, 7, 7, 0.15);
    }

    .day.selected:hover {
      background: #fff0f0;
    }

    .day-number {
      font-weight: 600;
      font-size: 0.9rem;
      color: #1a1a1a;
      margin-bottom: 0.4rem;
    }

    .today .day-number {
      background: #262222;
      color: white;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 0.8rem;
    }

    .selected .day-number {
      color: #e70707;
      font-weight: 700;
    }

    .today.selected .day-number {
      background: #e70707;
      color: white;
    }

    .avatars-container {
      display: flex;
      align-items: center;
      margin-top: auto;
    }

    .avatar-wrapper {
      position: relative;
      border-radius: 50%;
      overflow: hidden;
    }

    .avatar-wrapper:not(:first-child) {
      margin-left: -10px;
    }

    .more-count {
      background: linear-gradient(135deg, #e70707 0%, #ff4444 100%);
      color: white;
      font-weight: 600;
      font-size: 0.6rem;
      min-width: 22px;
      height: 22px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.35rem;
      box-shadow: 0 2px 4px rgba(231, 7, 7, 0.3);
      margin-left: 0.2rem;
    }

    .empty-day {
      opacity: 0.4;
    }

    @media (max-width: 768px) {
      .calendar {
        gap: 4px;
        padding: 0.35rem;
      }

      .day {
        min-height: 55px;
        padding: 0.35rem;
      }

      .month-year {
        font-size: 1rem;
      }

      button {
        width: 30px;
        height: 28px;
      }

      .avatar-wrapper:not(:first-child) {
        margin-left: -8px;
      }
    }
  `);customElements.define("booking-calendar",ve);class ye extends d{constructor(){super(),this.booking={}}_formatTime(e){const[t,i]=e.split(":"),s=parseInt(t),r=s>=12?"PM":"AM";return`${s%12||12}:${i} ${r}`}_handleClick(){this.dispatchEvent(new CustomEvent("card-click",{detail:{booking:this.booking},bubbles:!0,composed:!0}))}render(){const{userId:e,time:t,guests:i,status:s,id:r,avatar:n,gender:c}=this.booking;return a`
      <div class="card status-${s}" @click=${this._handleClick}>
        <div class="card-header">
          <user-avatar
            .src=${n||""}
            .name=${e}
            .gender=${c||""}
            size="24"
          ></user-avatar>
          <div class="info">
            <div class="name">${e}</div>
            <div class="time">🕐 ${this._formatTime(t)}</div>
          </div>
          <div class="guests">
            <span class="icon">${u.users}</span>
            <span>${i}</span>
          </div>
        </div>
        <div class="meta">
          <span>${r}</span>
          <span>•</span>
          <span class="status ${s}">${s}</span>
        </div>
      </div>
    `}}l(ye,"properties",{booking:{type:Object}}),l(ye,"styles",h`
    :host {
      display: block;
    }

    .card {
      background: white;
      border-radius: 4px;
      padding: 0.35rem 0.45rem;
      border: solid 1.5px #2d2b2b45;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .card:hover {
      transform: translateX(2px);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .info {
      flex: 1;
      min-width: 0;
    }

    .name {
      font-weight: 600;
      font-size: 0.7rem;
      color: #1a1a1a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0.1rem;
    }

    .time {
      font-size: 0.65rem;
      color: #666;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.15rem;
    }

    .guests {
      background: #0f0f0f;
      color: #fdfcfc;
      padding: 0.2rem 0.35rem;
      border-radius: 3px;
      font-size: 0.65rem;
      font-weight: 600;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 0.15rem;
    }

    .guests .icon svg {
      width: 14px;
      height: 14px;
      vertical-align: middle;
    }

    .meta {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.6rem;
      color: #060606;
      padding-top: 0.3rem;
      margin-top: 0.3rem;
      border-top: 1px solid #f0f0f0;
    }

    .status {
      padding: 0.1rem 0.3rem;
      border-radius: 2px;
      font-size: 0.55rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status.confirmed {
      background: #d4edda;
      color: #155724;
    }

    .status.pending {
      background: #fff3cd;
      color: #856404;
    }

    .status.cancelled {
      background: #f8d7da;
      color: #721c24;
    }
  `);customElements.define("booking-card",ye);class we extends d{constructor(){super(),this.selectedDate=null,this.bookings=[],this.selectedRoomType="all"}_formatDate(e){return new Date(e).toLocaleDateString("default",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}_sortBookingsByTime(e){return[...e].sort((t,i)=>{const s=t.time||"00:00",r=i.time||"00:00";return s.localeCompare(r)})}_handleRoomTypeChange(e){this.dispatchEvent(new CustomEvent("room-type-change",{detail:{roomType:e.detail.value},bubbles:!0,composed:!0}))}_handleCardClick(e){this.dispatchEvent(new CustomEvent("booking-select",{detail:e.detail,bubbles:!0,composed:!0}))}render(){if(!this.selectedDate||this.bookings.length===0)return a`
        <div class="sidebar-container">
          <div class="header">
            <div class="header-top">
              <div class="title">Booking Details</div>
            </div>
          </div>
          <div class="empty-state">
            <div>Select a date to view bookings</div>
          </div>
        </div>
      `;const e=this._sortBookingsByTime(this.bookings);return a`
      <div class="sidebar-container">
        <div class="header">
          <div class="header-top">
            <div class="title">Booking Details</div>
            <app-dropdown
              variant="dark"
              size="small"
              .options=${[{value:"all",label:"All Rooms"}]}
              .value=${this.selectedRoomType}
              @change=${this._handleRoomTypeChange}
            ></app-dropdown>
          </div>
          <div class="date">${this._formatDate(this.selectedDate)}</div>
        </div>

        <div class="bookings-list">
          ${e.map(t=>a`
            <booking-card
              .booking=${t}
              @card-click=${this._handleCardClick}>
            </booking-card>
          `)}
        </div>

        <div class="pagination-wrapper">
          <slot name="pagination"></slot>
        </div>
      </div>
    `}}l(we,"properties",{selectedDate:{type:String},bookings:{type:Array},selectedRoomType:{type:String}}),l(we,"styles",h`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      width: 100%;
    }

    .header {
      flex-shrink: 0;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1.5px solid #2d2b2b45;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .title {
      font-size: 1rem;
      font-weight: 600;
      color: #ffb300;
    }

    .date {
      font-size: 0.8rem;
      color: #171717;
      font-weight: 500;
    }

    .empty-state {
      color: #080808;
      font-size: 0.875rem;
      text-align: center;
      padding: 3rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow-y: auto;
      overflow-x: hidden;
      flex: 1 1 auto;
      min-height: 0;
      padding-right: 0.5rem;
    }

    .bookings-list::-webkit-scrollbar {
      width: 6px;
    }

    .bookings-list::-webkit-scrollbar-track {
      background: #161616;
      border-radius: 3px;
    }

    .bookings-list::-webkit-scrollbar-thumb {
      background: #020202;
      border-radius: 3px;
    }

    .bookings-list::-webkit-scrollbar-thumb:hover {
      background: #000000;
    }

    .pagination-wrapper {
      flex-shrink: 0;
      margin-top: 1rem;
      padding-top: 0.75rem;
    }
  `);customElements.define("booking-sidebar",we);class gt extends d{_handleClick(){this.dispatchEvent(new CustomEvent("today-click",{bubbles:!0,composed:!0}))}render(){return a`
      <button 
        class="today-btn" 
        @click=${this._handleClick}
        title="Go to today">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <circle cx="12" cy="16" r="2" fill="currentColor"></circle>
        </svg>
      </button>
    `}}l(gt,"styles",h`
    :host {
      display: inline-block;
    }

    .today-btn {
      background: white;
      color: #000000a4;
      border: none;
      border-radius: 6px;
      padding: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    }

    .today-btn:hover {
      color: #000000;
      transform: translateY(-1px);
    }

    .today-btn svg {
      width: 18px;
      height: 18px;
    }
  `);customElements.define("today-button",gt);class ke extends d{constructor(){super(),this.options=[],this.expanded=!1}toggleExpanded(){this.expanded=!this.expanded}closeMenu(){this.expanded=!1}handleOptionClick(e){this.dispatchEvent(new CustomEvent("fab-option-click",{detail:{action:e.action,label:e.label},bubbles:!0,composed:!0})),this.closeMenu()}render(){return a`
      <div class="overlay ${this.expanded?"visible":""}"></div>
      
      <button 
        class="close-btn ${this.expanded?"visible":""}" 
        @click=${this.closeMenu}>
        ×
      </button>

      <div class="fab-options ${this.expanded?"visible":""}">
        ${this.options.map(e=>a`
          <button 
            class="fab-option" 
            @click=${()=>this.handleOptionClick(e)}>
            <div class="fab-option-icon">${e.icon}</div>
            <span class="fab-option-label">${e.label}</span>
          </button>
        `)}
      </div>

      <button 
        class="fab-main ${this.expanded?"expanded":""}" 
        @click=${this.toggleExpanded}>
        +
      </button>
    `}}l(ke,"properties",{options:{type:Array},expanded:{type:Boolean}}),l(ke,"styles",h`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 9997;
    }

    .overlay.visible {
      opacity: 1;
      pointer-events: all;
    }

    .close-btn {
      position: fixed;
      top: 2rem;
      right: 2rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: white;
      color: #ff0404;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 300;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 10001;
    }

    .close-btn.visible {
      opacity: 1;
      pointer-events: all;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #c40505;
    }

    .fab-options {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 10000;
    }

    .fab-options.visible {
      opacity: 1;
      pointer-events: all;
    }

    .fab-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: white;
      border: none;
      border-radius: 12px;
      padding: 1.25rem 2rem;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      white-space: nowrap;
      min-width: 250px;
    }

    .fab-option:hover {
      background: #0380fd;
    }

    .fab-option:hover .fab-option-icon,
    .fab-option:hover .fab-option-label {
      color: white;
    }

    .fab-option-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #424242;
    }

    .fab-option-label {
      font-size: 16px;
      font-weight: 500;
      color: #424242;
    }

    .fab-main {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgb(4, 4, 4);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 300;
      z-index: 10002;
    }

    .fab-main:hover {
      background: rgb(5, 5, 5);
    }

    .fab-main.expanded {
      transform: rotate(45deg);
      background: rgb(212, 36, 6);
    }

    @media (max-width: 768px) {
      .fab-main {
        bottom: 1.5rem;
        right: 1.5rem;
        width: 48px;
        height: 48px;
        font-size: 24px;
      }

      .close-btn {
        top: 1.5rem;
        right: 1.5rem;
        width: 48px;
        height: 48px;
        font-size: 28px;
      }

      .fab-option {
        min-width: 200px;
        padding: 1rem 1.5rem;
      }

      .fab-option-label {
        font-size: 14px;
      }
    }
  `);customElements.define("floating-action-button",ke);class mt extends d{render(){return a`
      <form id="room-form">
        <div class="form-grid">
          <input-field
            label="Room Name"
            type="text"
            name="roomName"
            placeholder="Enter name"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <div class="form-group">
            <label>Room Type *</label>
            <select name="roomType" required>
              <option value="">Select type</option>
            </select>
          </div>

          <input-field
            label="Capacity"
            type="number"
            name="capacity"
            placeholder="Enter capacity"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <input-field
            label="Price/Hour ($)"
            type="number"
            name="pricePerHour"
            placeholder="0.00"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <input-field
            label="Floor"
            type="text"
            name="floor"
            placeholder="Floor"
            variant="compact">
          </input-field>

          <input-field
            label="Location"
            type="text"
            name="location"
            placeholder="Location"
            variant="compact">
          </input-field>

          <div class="form-group full">
            <label>Room Image</label>
            <div class="image-upload">
              <input 
                type="file" 
                id="room-image" 
                name="roomImage"
                accept="image/*"
              />
              <label for="room-image" class="upload-label">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <div class="upload-text">Upload</div>
              </label>
              <slot name="image-preview"></slot>
            </div>
          </div>

          <div class="form-group full">
            <label>Description</label>
            <textarea name="description"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <slot name="actions"></slot>
        </div>
      </form>
    `}}l(mt,"styles",h`
    :host {
      display: block;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full {
      grid-column: 1 / -1;
    }

    label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 3px;
    }

    select,
    textarea {
      padding: 5px 8px;
      border: 1.5px solid #2d2b2b45;
      border-radius: 4px;
      font-size: 0.8rem;
      font-family: inherit;
    }

    select:focus,
    textarea:focus {
      outline: none;
      border-color: #ff0707d7;
    }

    textarea {
      resize: vertical;
      min-height: 50px;
    }

    .image-upload {
      border: 1.5px dashed #e0e0e0;
      border-radius: 4px;
      padding: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .image-upload:hover {
      border-color: #da0d0dd7;
      background: #fff5f5;
    }

    .image-upload input {
      display: none;
    }

    .upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      cursor: pointer;
    }

    .upload-icon {
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .upload-icon svg {
      width: 24px;
      height: 24px;
    }

    .upload-text {
      font-size: 0.7rem;
      color: #666;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
    }
  `);customElements.define("create-room-form",mt);class ft extends d{render(){return a`<slot></slot>`}}l(ft,"styles",h`
    :host {
      flex: 1;
      transition: all 0.3s ease;
      margin-right: 0.8rem;
    }

    @media (max-width: 1024px) {
      :host {
        flex: 0 0 auto;
      }
    }
  `);customElements.define("calendar-section",ft);class bt extends d{render(){return a`<slot></slot>`}}l(bt,"styles",h`
    :host {
      flex: 0 0 calc(30% - 1.5rem);
      border-left: 1px solid #2d2b2b45;
      padding: 0 1rem 0 1rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 8rem);
      transition: all 0.3s ease;
    }

    :host(.closed) {
      flex: 0 0 0;
      padding: 0;
      border-left: none;
      opacity: 0;
      pointer-events: none;
    }

    @media (max-width: 1024px) {
      :host {
        border-left: none;
        border-top: 1px solid #e5e5e5;
        padding: 1.5rem 0 0 0;
        flex: 1;
        min-height: 300px;
        max-height: none;
      }

      :host(.closed) {
        display: none;
      }
    }
  `);customElements.define("sidebar-section",bt);const Qe={booking:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 10h-6l-2-3-2 3H3v11h18V10z"/><path d="M12 21V13"/></svg>`,room:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`,user:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="7" r="4"/><path d="M5.5 21c0-3 5-5 6.5-5s6.5 2 6.5 5"/></svg>`,reservation:a`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`},ti=[{label:"Book Someone",action:"book-someone",icon:Qe.booking},{label:"Create New Room",action:"create-room",icon:Qe.room}];class ii{constructor(){this.toastCounts={},this.resetDelay=5e3,this.maxNormalToasts=3,this.spamThreshold=4}handleToast(e,t,i){this.toastCounts[e]||(this.toastCounts[e]={count:0,timeout:null});const s=this.toastCounts[e];return s.timeout&&clearTimeout(s.timeout),s.count++,s.timeout=setTimeout(()=>{this.toastCounts[e]={count:0,timeout:null}},this.resetDelay),s.count>this.spamThreshold?!1:s.count===this.spamThreshold?(i(),!0):s.count<=this.maxNormalToasts?(t(),!0):!1}getCount(e){var t;return((t=this.toastCounts[e])==null?void 0:t.count)||0}reset(e){var t;(t=this.toastCounts[e])!=null&&t.timeout&&clearTimeout(this.toastCounts[e].timeout),delete this.toastCounts[e]}resetAll(){Object.keys(this.toastCounts).forEach(e=>{var t;(t=this.toastCounts[e])!=null&&t.timeout&&clearTimeout(this.toastCounts[e].timeout)}),this.toastCounts={}}}const oi=new ii;class $e extends d{constructor(){super(),this.reservations=Ne.filter(s=>s.status==="confirmed");const e=localStorage.getItem("booking-selected-date"),t=localStorage.getItem("booking-selected-bookings");this.selectedDate=e||null,this.selectedBookings=t?JSON.parse(t):[];const i=localStorage.getItem("booking-sidebar-open");this.sidebarOpen=i==="true",this.selectedRoomType="all",this.currentPage=1,this.itemsPerPage=5,this.totalPages=S(this.selectedBookings.length,this.itemsPerPage),this.branches=[{value:"all",label:"All Branches"},{value:"branch1",label:"Branch 1"}],this.selectedBranch="all",this.showBookDialog=!1,this.showRoomDialog=!1,this.showExportDialog=!1,this.roomImagePreview=null,this.bookLoading=!1,this.roomLoading=!1}get paginatedBookings(){const e=(this.currentPage-1)*this.itemsPerPage;return this.selectedBookings.slice(e,e+this.itemsPerPage)}get filteredBookings(){return this.selectedRoomType==="all"?this.selectedBookings:this.selectedBookings.filter(e=>e.roomType===this.selectedRoomType)}toggleSidebar(){this.sidebarOpen=!this.sidebarOpen,localStorage.setItem("booking-sidebar-open",this.sidebarOpen.toString())}handleBranchChange(e){this.selectedBranch=e.detail.branch}handleDayClick(e){const{date:t,bookings:i}=e.detail;this.selectedDate=t,this.selectedBookings=i,this.currentPage=1,this.totalPages=S(i.length,this.itemsPerPage),localStorage.setItem("booking-selected-date",t),localStorage.setItem("booking-selected-bookings",JSON.stringify(i)),i.length===0?oi.handleToast(t,()=>b.info("No date is booked here"),()=>b.warning("Please don't spam! Wait a moment before clicking again.",6e3)):this.sidebarOpen||(this.sidebarOpen=!0,localStorage.setItem("booking-sidebar-open","true"))}handleBookingSelect(e){const{booking:t}=e.detail,i=`Booking Details:
━━━━━━━━━━━━━━━━
ID: ${t.id}
User: ${t.userId}
Date: ${t.date}
Time: ${t.time}
Guests: ${t.guests}
Status: ${t.status}${t.space?`
Space: ${t.space}`:""}${t.notes?`
Notes: ${t.notes}`:""}`;alert(i)}handleRoomTypeChange(e){this.selectedRoomType=e.detail.roomType,this.currentPage=1;const t=this.filteredBookings;this.totalPages=S(t.length,this.itemsPerPage)}handlePageChange(e){this.currentPage=e.detail.page}handleTodayClick(){const e=this.shadowRoot.querySelector("booking-calendar");if(e){const t=new Date;e.month=t.getMonth(),e.year=t.getFullYear()}}handleFabAction(e){const{action:t,label:i}=e.detail;t==="book-someone"?(this.showBookDialog=!0,b.success("Opening booking form...")):t==="create-room"&&(this.showRoomDialog=!0,b.success("Opening room creation form..."))}handleExportSelect(e){const{format:t,fromDate:i,toDate:s}=e.detail;console.log("Export bookings:",{format:t,fromDate:i,toDate:s}),b.success(`Exporting as ${t.toUpperCase()}...`),this.showExportDialog=!1}handleRoomImageUpload(e){const t=e.target.files[0];if(t){const i=new FileReader;i.onload=s=>{this.roomImagePreview=s.target.result},i.readAsDataURL(t)}}handleBookSomeoneSubmit(e){e.preventDefault(),this.bookLoading=!0;const t=new FormData(e.target),i={userName:t.get("userName"),email:t.get("email"),phone:t.get("phone"),date:t.get("date"),time:t.get("time"),duration:t.get("duration"),roomType:t.get("roomType"),guests:t.get("guests"),notes:t.get("notes")};console.log("Book someone data:",i),setTimeout(()=>{this.bookLoading=!1,b.success("Booking created successfully!"),this.showBookDialog=!1},1e3)}handleCreateRoomSubmit(e){e.preventDefault(),this.roomLoading=!0;const t=new FormData(e.target),i=t.getAll("amenities"),s={roomName:t.get("roomName"),roomType:t.get("roomType"),capacity:t.get("capacity"),pricePerHour:t.get("pricePerHour"),floor:t.get("floor"),location:t.get("location"),amenities:i,description:t.get("description"),image:this.roomImagePreview};console.log("Create room data:",s),setTimeout(()=>{this.roomLoading=!1,b.success("Room created successfully!"),this.showRoomDialog=!1,this.roomImagePreview=null},1e3)}handleCancelDialog(){this.showBookDialog=!1,this.showRoomDialog=!1,this.roomImagePreview=null}handleDialogClose(){this.showBookDialog=!1,this.showRoomDialog=!1,this.showExportDialog=!1,this.roomImagePreview=null}render(){return a`
      <content-card mode="3">
        <calendar-section>
          <booking-calendar 
            .reservations=${this.reservations}
            .selectedDate=${this.selectedDate}
            .branches=${this.branches}
            .selectedBranch=${this.selectedBranch}
            @day-click=${this.handleDayClick}
            @branch-change=${this.handleBranchChange}>
            
            <today-button 
              slot="today-btn"
              @today-click=${this.handleTodayClick}>
            </today-button>
            <button 
              slot="controls" 
              class="toggle-btn" 
              @click=${this.toggleSidebar}>
              ${this.sidebarOpen?"X":"Details"}
            </button>
          </booking-calendar>
        </calendar-section>
        
        <sidebar-section class="${this.sidebarOpen?"":"closed"}">
          <booking-sidebar
            .selectedDate=${this.selectedDate}
            .bookings=${this.paginatedBookings}
            .selectedRoomType=${this.selectedRoomType}
            @booking-select=${this.handleBookingSelect}
            @room-type-change=${this.handleRoomTypeChange}>
            <pagination-component
              slot="pagination"
              .currentPage=${this.currentPage}
              .totalPages=${this.totalPages}
              mode="2"
              @pagination-change=${this.handlePageChange}
            ></pagination-component>
          </booking-sidebar>
        </sidebar-section>
      </content-card>

      <floating-action-button
        .options=${ti}
        @fab-option-click=${this.handleFabAction}>
      </floating-action-button>

      <app-dialog
        .isOpen=${this.showBookDialog}
        title="Book Someone"
        description="Fill in the booking details"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${!1}
        .hideFooter=${!0}
        @dialog-close=${this.handleDialogClose}>
        <book-someone-form>
          <app-button slot="actions" type="warning" size="medium" @click=${this.handleCancelDialog} ?disabled=${this.bookLoading}>
            Cancel
          </app-button>
          <app-button slot="actions" type="primary" size="medium" @click=${e=>{const t=this.shadowRoot.querySelector("book-someone-form").shadowRoot.getElementById("book-form");t.checkValidity()?(this.handleBookSomeoneSubmit(new Event("submit",{cancelable:!0,target:t})),e.preventDefault()):t.reportValidity()}} ?disabled=${this.bookLoading}>
            ${this.bookLoading?"Creating...":"Create Booking"}
          </app-button>
        </book-someone-form>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showRoomDialog}
        title="Create New Room"
        description="Enter room details and upload image"
        size="large"
        styleMode="compact"
        .closeOnOverlay=${!1}
        .hideFooter=${!0}
        @dialog-close=${this.handleDialogClose}>
        <create-room-form @change=${e=>{e.target.name==="roomImage"&&this.handleRoomImageUpload(e)}}>
          ${this.roomImagePreview?a`<img slot="image-preview" src="${this.roomImagePreview}" style="margin-top: 12px; max-width: 100%; max-height: 200px; border-radius: 8px; object-fit: cover;" alt="Room preview" />`:""}
          <app-button slot="actions" type="warning" size="medium" @click=${this.handleCancelDialog} ?disabled=${this.roomLoading}>
            Cancel
          </app-button>
          <app-button slot="actions" type="primary" size="medium" @click=${e=>{const t=this.shadowRoot.querySelector("create-room-form").shadowRoot.getElementById("room-form");t.checkValidity()?(this.handleCreateRoomSubmit(new Event("submit",{cancelable:!0,target:t})),e.preventDefault()):t.reportValidity()}} ?disabled=${this.roomLoading}>
            ${this.roomLoading?"Creating...":"Create Room"}
          </app-button>
        </create-room-form>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Bookings"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${!1}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>
    `}}l($e,"properties",{reservations:{type:Array},selectedDate:{type:String},selectedBookings:{type:Array},sidebarOpen:{type:Boolean},selectedRoomType:{type:String},currentPage:{type:Number},itemsPerPage:{type:Number},totalPages:{type:Number},branches:{type:Array},selectedBranch:{type:String},showBookDialog:{type:Boolean},showRoomDialog:{type:Boolean},showExportDialog:{type:Boolean},roomImagePreview:{type:String},bookLoading:{type:Boolean},roomLoading:{type:Boolean}}),l($e,"styles",h`
    :host {
      display: block;
      padding: 1rem;
      box-sizing: border-box;
      background: #ffffff;
      position: relative;
    }

    content-card {
      gap: 1.5rem;
    }

    .toggle-btn {
      background: #302d30;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .toggle-btn:hover {
      text-decoration: underline;
      background: #383438;
      color: #ffffff;
      transform: translateY(-1px);
    }

    floating-action-button {
      display: contents;
    }

    @media (max-width: 1024px) {
      content-card {
        flex-direction: column;
      }
    }
  `);customElements.define("admin-booking",$e);const si={columns:[{key:"id",label:"ID"},{key:"userId",label:"User ID"},{key:"subject",label:"Concern"},{key:"status",label:"Status",render:o=>{const e=(o==null?void 0:o.toLowerCase())==="pending"?"pending":(o==null?void 0:o.toLowerCase())==="ongoing"?"ongoing":(o==null?void 0:o.toLowerCase())==="completed"||(o==null?void 0:o.toLowerCase())==="closed"?"completed":(o==null?void 0:o.toLowerCase())==="cancelled"?"cancelled":"primary";return a`
                    <badge-component variant="${e}" size="small">
                        ${o}
                    </badge-component>
                `}},{key:"priority",label:"Priority",render:o=>{const e=(o==null?void 0:o.toLowerCase())==="low"?"low":(o==null?void 0:o.toLowerCase())==="medium"?"medium":(o==null?void 0:o.toLowerCase())==="high"?"high":(o==null?void 0:o.toLowerCase())==="critical"||(o==null?void 0:o.toLowerCase())==="urgent"?"critical":"medium";return a`
                    <badge-component variant="${e}" size="small">
                        ${o}
                    </badge-component>
                `}},{key:"createdAt",label:"Date"}],actions:[{key:"view",label:"View",icon:"visibility"}]};class Ce extends d{constructor(){super(),this.tickets=lt,this.currentPage=1,this.itemsPerPage=10,this.activeTab="all",this.searchValue="",this.showExportDialog=!1,this.showTicketDialog=!1,this.selectedTicket=null,this.tabs=[{id:"all",label:"All"},{id:"pending",label:"Pending"},{id:"ongoing",label:"Ongoing"},{id:"completed",label:"Archived/Complete"}],this.updatePagination(),this.handlePageChange=this.handlePageChange.bind(this)}get filteredTickets(){let e=this.tickets;if(this.activeTab!=="all"&&(this.activeTab==="completed"?e=e.filter(t=>t.status==="completed"||t.status==="closed"):e=e.filter(t=>t.status===this.activeTab)),this.searchValue){const t=this.searchValue.toLowerCase();e=e.filter(i=>{var s,r,n,c;return((s=i.id)==null?void 0:s.toLowerCase().includes(t))||((r=i.userId)==null?void 0:r.toLowerCase().includes(t))||((n=i.subject)==null?void 0:n.toLowerCase().includes(t))||((c=i.status)==null?void 0:c.toLowerCase().includes(t))})}return e}get paginatedTickets(){const e=(this.currentPage-1)*this.itemsPerPage;return this.filteredTickets.slice(e,e+this.itemsPerPage)}updatePagination(){this.totalPages=S(this.filteredTickets.length,this.itemsPerPage)}handleTabChange(e){this.activeTab=e.detail.tab,this.currentPage=1,this.updatePagination()}handleSearch(e){this.searchValue=e.detail.value,this.currentPage=1,this.updatePagination()}handleSearchInput(e){this.searchValue=e.detail.value,this.currentPage=1,this.updatePagination()}handleTableAction(e){const{action:t,item:i}=e.detail;t==="view"&&(this.selectedTicket=i,this.showTicketDialog=!0)}handlePageChange(e){this.currentPage=e.detail.page}handleExport(){this.showExportDialog=!0}handleExportSelect(e){console.log("Export tickets as:",e.detail.format),this.showExportDialog=!1}handleTicketAction(e){const{action:t,ticket:i}=e.detail;if(console.log(`Ticket ${t}:`,i),t==="accept"){const s=this.tickets.findIndex(r=>r.id===i.id);s!==-1&&(this.tickets[s].status="ongoing",this.requestUpdate())}else if(t==="close"){const s=this.tickets.findIndex(r=>r.id===i.id);s!==-1&&(this.tickets[s].status="completed",this.requestUpdate())}this.showTicketDialog=!1}handleDialogClose(){this.showExportDialog=!1,this.showTicketDialog=!1,this.selectedTicket=null}render(){var e;return a`
      <content-card mode="4">
        <header-controls>
          <tabs-wrapper>
            <tabs-component
              .tabs=${this.tabs}
              .activeTab=${this.activeTab}
              variant="primary"
              @tab-change=${this.handleTabChange}>
            </tabs-component>
          </tabs-wrapper>
          
          <search-wrapper>
            <app-button
              type="secondary"
              size="small"
              @click=${this.handleExport}>
              ${u.export} Export
            </app-button>
            <search-bar-wrapper>
              <search-bar
                placeholder="Search tickets..."
                .value=${this.searchValue}
                .showFilter=${!1}
                @search=${this.handleSearch}
                @search-input=${this.handleSearchInput}>
              </search-bar>
            </search-bar-wrapper>
          </search-wrapper>
        </header-controls>

        <data-table
          .data=${this.paginatedTickets}
          .conf=${si}
          mode="1"
          @table-action=${this.handleTableAction}>
        </data-table>

        <pagination-wrapper>
          <pagination-component
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            @pagination-change=${this.handlePageChange}>
          </pagination-component>
        </pagination-wrapper>
      </content-card>

      <!-- Export Dialog -->
      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Tickets"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${!1}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

      <!-- Ticket View Dialog -->
      <app-dialog
        .isOpen=${this.showTicketDialog}
        .title=${((e=this.selectedTicket)==null?void 0:e.subject)||"Ticket Details"}
        mode="ticket"
        size="medium"
        styleMode="compact"
        .hideFooter=${!0}
        .closeOnOverlay=${!0}
        .ticketData=${this.selectedTicket}
        @ticket-action=${this.handleTicketAction}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>
    `}}l(Ce,"properties",{tickets:{type:Array},currentPage:{type:Number},itemsPerPage:{type:Number},totalPages:{type:Number},activeTab:{type:String},searchValue:{type:String},showExportDialog:{type:Boolean},showTicketDialog:{type:Boolean},selectedTicket:{type:Object}}),l(Ce,"styles",h`
    :host {
      display: block;
      padding: 1rem;
      height: 100%;
      box-sizing: border-box;
    }

    .content-card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      border: 1.25px solid rgba(45, 43, 43, 0.27);
    }
  `);customElements.define("admin-ticket",Ce);const ai={columns:[{key:"id",label:"User-ID"},{key:"name",label:"Name"},{key:"email",label:"Email"},{key:"role",label:"Role",render:o=>{const e=(o==null?void 0:o.toLowerCase())==="admin"?"primary":(o==null?void 0:o.toLowerCase())==="manager"?"info":(o==null?void 0:o.toLowerCase())==="user"?"secondary":"primary";return a`
                    <badge-component variant="${e}" size="small">
                        ${o}
                    </badge-component>
                `}},{key:"status",label:"Status",render:o=>{const e=(o==null?void 0:o.toLowerCase())==="active"?"active":(o==null?void 0:o.toLowerCase())==="inactive"?"inactive":(o==null?void 0:o.toLowerCase())==="archived"?"archived":(o==null?void 0:o.toLowerCase())==="pending"?"pending":"primary";return a`
                    <badge-component variant="${e}" size="small">
                        ${o}
                    </badge-component>
                `}},{key:"createdAt",label:"Joined",render:o=>new Date(o).toLocaleString()}],actions:[{key:"view",label:"View",icon:"visibility"}]};class xt extends d{render(){return a`
      <form id="user-form">
        <div class="form-grid">
          <input-field
            label="First Name"
            type="text"
            name="firstName"
            placeholder="First Name"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <input-field
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Last Name"
            variant="compact"
            ?required=${!0}>
          </input-field>

          <div class="form-row">
            <div class="form-group">
              <label>Location</label>
              <select name="location" required>
                <option value="">Location - (select location)</option>
                <option value="branch1">Branch 1</option>
                <option value="branch2">Branch 2</option>
                <option value="branch3">Branch 3</option>
              </select>
            </div>

            <div class="form-group">
              <label>Role</label>
              <select name="role" required>
                <option value="">Role - (select role)</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <slot name="actions"></slot>
        </div>
      </form>
    `}}l(xt,"styles",h`
    :host {
      display: block;
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 0.875rem;
      font-weight: 400;
      color: #666;
    }

    select {
      padding: 10px 12px;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      background: white;
      color: #666;
      cursor: pointer;
      transition: all 0.2s;
    }

    select:focus {
      outline: none;
      border-color: #8d1409;
    }

    select:hover {
      border-color: #bbb;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
  `);customElements.define("add-user-form",xt);class Se extends d{constructor(){super(),this.users=dt,this.currentPage=1,this.itemsPerPage=10,this.activeTab="all",this.searchValue="",this.showAddDialog=!1,this.showExportDialog=!1,this.showDetailsDialog=!1,this.selectedUser=null,this.userLoading=!1,this.tabs=[{id:"all",label:"All Users"},{id:"admin",label:"Admin"},{id:"archived",label:"Archived"}],this.updatePagination(),this.handlePageChange=this.handlePageChange.bind(this)}get filteredUsers(){let e=this.users;if(this.activeTab==="admin"?e=e.filter(t=>t.role==="admin"):this.activeTab==="archived"&&(e=e.filter(t=>t.status==="archived"||t.status==="inactive")),this.searchValue){const t=this.searchValue.toLowerCase();e=e.filter(i=>{var s,r,n,c;return((s=i.id)==null?void 0:s.toLowerCase().includes(t))||((r=i.name)==null?void 0:r.toLowerCase().includes(t))||((n=i.email)==null?void 0:n.toLowerCase().includes(t))||((c=i.role)==null?void 0:c.toLowerCase().includes(t))})}return e}get paginatedUsers(){const e=(this.currentPage-1)*this.itemsPerPage;return this.filteredUsers.slice(e,e+this.itemsPerPage)}updatePagination(){this.totalPages=S(this.filteredUsers.length,this.itemsPerPage)}handleTabChange(e){this.activeTab=e.detail.tab,this.currentPage=1,this.updatePagination()}handleSearch(e){this.searchValue=e.detail.value,this.currentPage=1,this.updatePagination()}handleSearchInput(e){this.searchValue=e.detail.value,this.currentPage=1,this.updatePagination()}handleTableAction(e){const{action:t,item:i}=e.detail;t==="view"&&(this.selectedUser=i,this.showDetailsDialog=!0)}handlePageChange(e){this.currentPage=e.detail.page}handleAddUser(){this.showAddDialog=!0}handleExport(){this.showExportDialog=!0}handleExportSelect(e){console.log("Export users as:",e.detail.format),this.showExportDialog=!1}handleDialogClose(){this.showAddDialog=!1,this.showExportDialog=!1,this.showDetailsDialog=!1,this.selectedUser=null}handleAddUserSubmit(e){e.preventDefault(),this.userLoading=!0;const t=new FormData(e.target),i={firstName:t.get("firstName"),lastName:t.get("lastName"),location:t.get("location"),role:t.get("role")};console.log("Create user data:",i),setTimeout(()=>{this.userLoading=!1,b.success("User created successfully!"),this.showAddDialog=!1},1e3)}handleCancelDialog(){this.showAddDialog=!1}render(){return a`
      <content-card mode="4">
        <header-controls>
          <tabs-wrapper>
            <tabs-component
              .tabs=${this.tabs}
              .activeTab=${this.activeTab}
              variant="primary"
              @tab-change=${this.handleTabChange}>
            </tabs-component>
          </tabs-wrapper>
          
          <search-wrapper>
            <app-button
              type="tertiary"
              size="small"
              @click=${this.handleAddUser}>
              ${u.plus} New User
            </app-button>
            <app-button
              type="secondary"
              size="small"
              @click=${this.handleExport}>
              ${u.export} Export
            </app-button>
            <search-bar-wrapper width="small">
              <search-bar
                placeholder="Search users..."
                .value=${this.searchValue}
                .showFilter=${!1}
                @search=${this.handleSearch}
                @search-input=${this.handleSearchInput}>
              </search-bar>
            </search-bar-wrapper>
          </search-wrapper>
        </header-controls>

        <data-table
          .data=${this.paginatedUsers}
          .conf=${ai}
          mode="1"
          @table-action=${this.handleTableAction}>
        </data-table>

        <pagination-wrapper>
          <pagination-component
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            @pagination-change=${this.handlePageChange}>
          </pagination-component>
        </pagination-wrapper>
      </content-card>

      <app-dialog
        .isOpen=${this.showAddDialog}
        title="Add Users"
        description="Enter description here"
        size="medium"
        styleMode="compact"
        .closeOnOverlay=${!1}
        .hideFooter=${!0}
        @dialog-close=${this.handleDialogClose}>
        <add-user-form>
          <app-button 
            slot="actions" 
            type="secondary" 
            size="medium" 
            @click=${this.handleCancelDialog} 
            ?disabled=${this.userLoading}>
            Cancel
          </app-button>
          <app-button 
            slot="actions" 
            type="primary" 
            size="medium" 
            @click=${e=>{const t=this.shadowRoot.querySelector("add-user-form").shadowRoot.getElementById("user-form");t.checkValidity()?(this.handleAddUserSubmit(new Event("submit",{cancelable:!0,target:t})),e.preventDefault()):t.reportValidity()}} 
            ?disabled=${this.userLoading}>
            ${this.userLoading?"Saving...":"Save changes"}
          </app-button>
        </add-user-form>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Users"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${!1}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showDetailsDialog}
        title="User Details"
        mode="details"
        size="medium"
        styleMode="compact"
        .hideFooter=${!0}
        .closeOnOverlay=${!0}
        .detailsData=${this.selectedUser}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>
    `}}l(Se,"properties",{users:{type:Array},currentPage:{type:Number},itemsPerPage:{type:Number},totalPages:{type:Number},activeTab:{type:String},searchValue:{type:String},showAddDialog:{type:Boolean},showExportDialog:{type:Boolean},showDetailsDialog:{type:Boolean},selectedUser:{type:Object},userLoading:{type:Boolean}}),l(Se,"styles",h`
    :host {
      display: block;
      padding: 1rem;
      height: 100%;
      box-sizing: border-box;
    }

    content-card {
      display: block;
    }
  `);customElements.define("admin-user",Se);const ri={columns:[{key:"id",label:"User"},{key:"action",label:"Action"},{key:"module",label:"Module",render:o=>a`
                <badge-component variant="primary" size="small">
                    ${o}
                </badge-component>
            `},{key:"date",label:"Date",render:o=>new Date(o).toLocaleString()}],actions:[{key:"view",label:"View",icon:"visibility"}]},ni=[{id:"log_1001",user:"Juan Dela Cruz",action:"Created Ticket",module:"Tickets",ip:"192.168.1.10",date:"2026-01-30T08:15:00Z"},{id:"log_1002",user:"Maria Santos",action:"Updated User Role",module:"Users",ip:"192.168.1.15",date:"2026-01-30T08:45:00Z"},{id:"log_1003",user:"Admin System",action:"Auto Closed Expired Reservation",module:"Reservations",ip:"SYSTEM",date:"2026-01-30T09:10:00Z"},{id:"log_1004",user:"Carlo Reyes",action:"Deleted Ticket Attachment",module:"Tickets",ip:"192.168.1.22",date:"2026-01-30T09:32:00Z"},{id:"log_1005",user:"Angela Cruz",action:"Reset User Password",module:"Users",ip:"192.168.1.35",date:"2026-01-30T10:05:00Z"},{id:"log_1006",user:"Reservation Bot",action:"Sent Reservation Reminder Email",module:"Reservations",ip:"SYSTEM",date:"2026-01-30T10:30:00Z"},{id:"log_1007",user:"Miguel Tan",action:"Accepted Ticket",module:"Tickets",ip:"192.168.1.44",date:"2026-01-30T11:00:00Z"},{id:"log_1008",user:"System Security",action:"Blocked Suspicious Login Attempt",module:"Security",ip:"203.177.91.55",date:"2026-01-30T11:25:00Z"},{id:"log_1009",user:"Lisa Mendoza",action:"Updated Reservation Date",module:"Reservations",ip:"192.168.1.50",date:"2026-01-30T12:05:00Z"},{id:"log_1010",user:"Admin System",action:"Database Backup Completed",module:"System",ip:"SYSTEM",date:"2026-01-30T12:30:00Z"},{id:"log_1010",user:"Admin System",action:"Database Backup Completed",module:"System",ip:"SYSTEM",date:"2026-01-30T12:30:00Z"},{id:"log_1010",user:"Admin System",action:"Database Backup Completed",module:"System",ip:"SYSTEM",date:"2026-01-30T12:30:00Z"},{id:"log_1010",user:"Admin System",action:"Database Backup Completed",module:"System",ip:"SYSTEM",date:"2026-01-30T12:30:00Z"},{id:"log_1010",user:"Admin System",action:"Database Backup Completed",module:"System",ip:"SYSTEM",date:"2026-01-30T12:30:00Z"}];class Ee extends d{constructor(){super(),this.logs=ni,this.currentPage=1,this.itemsPerPage=10,this.searchValue="",this.showExportDialog=!1,this.showDetailsDialog=!1,this.selectedLog=null,this.updatePagination(),this.handlePageChange=this.handlePageChange.bind(this)}get filteredLogs(){let e=this.logs;if(this.searchValue){const t=this.searchValue.toLowerCase();e=e.filter(i=>{var s,r,n,c;return((s=i.id)==null?void 0:s.toLowerCase().includes(t))||((r=i.action)==null?void 0:r.toLowerCase().includes(t))||((n=i.module)==null?void 0:n.toLowerCase().includes(t))||((c=i.userId)==null?void 0:c.toLowerCase().includes(t))})}return e}get paginatedLogs(){const e=(this.currentPage-1)*this.itemsPerPage;return this.filteredLogs.slice(e,e+this.itemsPerPage)}updatePagination(){this.totalPages=S(this.filteredLogs.length,this.itemsPerPage)}handleSearch(e){this.searchValue=e.detail.value,this.currentPage=1,this.updatePagination()}handleSearchInput(e){this.searchValue=e.detail.value,this.currentPage=1,this.updatePagination()}handleTableAction(e){const{action:t,item:i}=e.detail;t==="view"&&(this.selectedLog=i,this.showDetailsDialog=!0)}handlePageChange(e){this.currentPage=e.detail.page}handleExport(){this.showExportDialog=!0}handleExportSelect(e){console.log("Export logs as:",e.detail.format),this.showExportDialog=!1}handleDialogClose(){this.showExportDialog=!1,this.showDetailsDialog=!1,this.selectedLog=null}render(){return a`
      <content-card mode="4">
        <header-controls mode="2">
          <search-bar-wrapper>
            <search-bar
              placeholder="Search logs..."
              .value=${this.searchValue}
              .showFilter=${!1}
              @search=${this.handleSearch}
              @search-input=${this.handleSearchInput}>
            </search-bar>
          </search-bar-wrapper>
          <app-button
            type="primary"
            size="small"
            @click=${this.handleExport}>
            ${u.export} Export
          </app-button>
        </header-controls>

        <data-table
          .data=${this.paginatedLogs}
          .conf=${ri}
          mode="1"
          @table-action=${this.handleTableAction}>
        </data-table>

        <pagination-wrapper>
          <pagination-component
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            @pagination-change=${this.handlePageChange}>
          </pagination-component>
        </pagination-wrapper>
      </content-card>

      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Logs"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${!1}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showDetailsDialog}
        title="Log Details"
        mode="details"
        size="medium"
        styleMode="compact"
        .hideFooter=${!0}
        .closeOnOverlay=${!0}
        .detailsData=${this.selectedLog}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>
    `}}l(Ee,"properties",{logs:{type:Array},currentPage:{type:Number},itemsPerPage:{type:Number},totalPages:{type:Number},searchValue:{type:String},showExportDialog:{type:Boolean},showDetailsDialog:{type:Boolean},selectedLog:{type:Object}}),l(Ee,"styles",h`
    :host {
      display: block;
      padding: 1rem;
      height: 100%;
      box-sizing: border-box;
    }

    .content-card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      border: 1.25px solid rgba(45, 43, 43, 0.27);
    }
  `);customElements.define("admin-logs",Ee);const li={columns:[{key:"id",label:"PAY-ID"},{key:"userId",label:"UserID"},{key:"amount",label:"Price"},{key:"currency",label:"Currency"},{key:"method",label:"Method",render:o=>a`
                <badge-component variant="info" size="small">
                    ${o}
                </badge-component>
            `},{key:"status",label:"Status",render:o=>{const e=(o==null?void 0:o.toLowerCase())==="completed"||(o==null?void 0:o.toLowerCase())==="paid"||(o==null?void 0:o.toLowerCase())==="success"?"success":(o==null?void 0:o.toLowerCase())==="pending"?"pending":(o==null?void 0:o.toLowerCase())==="failed"?"failed":(o==null?void 0:o.toLowerCase())==="cancelled"?"cancelled":"primary";return a`
                    <badge-component variant="${e}" size="small">
                        ${o}
                    </badge-component>
                `}},{key:"createdAt",label:"Date",render:o=>new Date(o).toLocaleString()}],actions:[{key:"view",label:"View",icon:"visibility"}]},di=[{id:"PAY-9001",userId:"USR-001",amount:1500,currency:"PHP",method:"GCash",status:"completed",createdAt:"2026-01-30T09:10:00Z"},{id:"PAY-9002",userId:"USR-002",amount:3200,currency:"PHP",method:"Credit Card",status:"pending",createdAt:"2026-01-30T10:05:00Z"},{id:"PAY-9003",userId:"USR-003",amount:800,currency:"PHP",method:"Cash",status:"completed",createdAt:"2026-01-29T16:40:00Z"},{id:"PAY-9003",userId:"USR-003",amount:800,currency:"PHP",method:"Cash",status:"completed",createdAt:"2026-01-29T16:40:00Z"},{id:"PAY-9003",userId:"USR-003",amount:800,currency:"PHP",method:"Cash",status:"completed",createdAt:"2026-01-29T16:40:00Z"},{id:"PAY-9003",userId:"USR-003",amount:800,currency:"PHP",method:"Cash",status:"completed",createdAt:"2026-01-29T16:40:00Z"},{id:"PAY-9003",userId:"USR-003",amount:800,currency:"PHP",method:"Cash",status:"completed",createdAt:"2026-01-29T16:40:00Z"},{id:"PAY-9003",userId:"USR-003",amount:800,currency:"PHP",method:"Cash",status:"completed",createdAt:"2026-01-29T16:40:00Z"},{id:"PAY-9003",userId:"USR-003",amount:800,currency:"PHP",method:"Cash",status:"completed",createdAt:"2026-01-29T16:40:00Z"},{id:"PAY-9003",userId:"USR-003",amount:800,currency:"PHP",method:"Cash",status:"completed",createdAt:"2026-01-29T16:40:00Z"},{id:"PAY-9003",userId:"USR-003",amount:800,currency:"PHP",method:"Cash",status:"completed",createdAt:"2026-01-29T16:40:00Z"},{id:"PAY-9003",userId:"USR-003",amount:800,currency:"PHP",method:"Cash",status:"completed",createdAt:"2026-01-29T16:40:00Z"}];class Pe extends d{constructor(){super(),this.payments=di,this.currentPage=1,this.itemsPerPage=10,this.searchValue="",this.showExportDialog=!1,this.showDetailsDialog=!1,this.selectedPayment=null,this.updatePagination(),this.handlePageChange=this.handlePageChange.bind(this)}get filteredPayments(){let e=this.payments;if(this.searchValue){const t=this.searchValue.toLowerCase();e=e.filter(i=>{var s,r,n,c;return((s=i.id)==null?void 0:s.toLowerCase().includes(t))||((r=i.userId)==null?void 0:r.toLowerCase().includes(t))||((n=i.amount)==null?void 0:n.toString().includes(t))||((c=i.status)==null?void 0:c.toLowerCase().includes(t))})}return e}get paginatedPayments(){const e=(this.currentPage-1)*this.itemsPerPage;return this.filteredPayments.slice(e,e+this.itemsPerPage)}updatePagination(){this.totalPages=S(this.filteredPayments.length,this.itemsPerPage)}handleSearch(e){this.searchValue=e.detail.value,this.currentPage=1,this.updatePagination()}handleSearchInput(e){this.searchValue=e.detail.value,this.currentPage=1,this.updatePagination()}handlePageChange(e){this.currentPage=e.detail.page}handleTableAction(e){const{action:t,item:i}=e.detail;t==="view"&&(this.selectedPayment=i,this.showDetailsDialog=!0)}handleExport(){this.showExportDialog=!0}handleExportSelect(e){console.log("Export payments as:",e.detail.format),this.showExportDialog=!1}handleDialogClose(){this.showExportDialog=!1,this.showDetailsDialog=!1,this.selectedPayment=null}render(){return a`
      <content-card mode="4">
        <header-controls mode="2">
          <search-bar-wrapper>
            <search-bar
              placeholder="Search payments..."
              .value=${this.searchValue}
              .showFilter=${!1}
              @search=${this.handleSearch}
              @search-input=${this.handleSearchInput}>
            </search-bar>
          </search-bar-wrapper>
          <app-button
            type="primary"
            size="small"
            @click=${this.handleExport}>
            ${u.export} Export
          </app-button>
        </header-controls>

        <data-table
          .data=${this.paginatedPayments}
          .conf=${li}
          mode="1"
          @table-action=${this.handleTableAction}>
        </data-table>

        <pagination-wrapper>
          <pagination-component
            .currentPage=${this.currentPage}
            .totalPages=${this.totalPages}
            @pagination-change=${this.handlePageChange}>
          </pagination-component>
        </pagination-wrapper>
      </content-card>

      <app-dialog
        .isOpen=${this.showExportDialog}
        title="Export Payments"
        description="Select export format and date range"
        mode="export"
        size="medium"
        styleMode="clean"
        .closeOnOverlay=${!1}
        @export-select=${this.handleExportSelect}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>

      <app-dialog
        .isOpen=${this.showDetailsDialog}
        title="Payment Details"
        mode="details"
        size="medium"
        styleMode="compact"
        .hideFooter=${!0}
        .closeOnOverlay=${!0}
        .detailsData=${this.selectedPayment}
        @dialog-close=${this.handleDialogClose}>
      </app-dialog>
    `}}l(Pe,"properties",{payments:{type:Array},currentPage:{type:Number},itemsPerPage:{type:Number},totalPages:{type:Number},searchValue:{type:String},showExportDialog:{type:Boolean},showDetailsDialog:{type:Boolean},selectedPayment:{type:Object}}),l(Pe,"styles",h`
    :host {
      display: block;
      padding: 1rem;
      height: 100%;
      box-sizing: border-box;
    }

    .content-card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      border: 1.25px solid rgba(45, 43, 43, 0.27);
    }
  `);customElements.define("admin-payments",Pe);class vt extends d{firstUpdated(){const e=this.querySelector('[slot="one"]'),t=this.querySelector('[slot="two"]'),i=this.querySelector('[slot="three"]');e&&!t&&!i&&this.setAttribute("single","")}render(){return a`
      <div class="layout-container">
        <slot name="one"></slot>
        <slot name="three"></slot>
        <slot name="two"></slot>
      </div>
    `}}l(vt,"styles",h`
    :host {
      display: block;
      width: 100%;
    }

    .layout-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto 1fr;
      gap: 16px;
      width: 100%;
      min-height: 400px;
    }

    /* Slot positioning */
    ::slotted([slot="one"]) {
      grid-column: 1;
      grid-row: 1;
    }

    ::slotted([slot="three"]) {
      grid-column: 1;
      grid-row: 2;
    }

    ::slotted([slot="two"]) {
      grid-column: 2;
      grid-row: 1 / span 2;
    }

    ::slotted(*) {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    /* Fallback layout for single slot */
    :host([single]) .layout-container {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }

    :host([single]) ::slotted([slot="one"]) {
      grid-column: 1;
      grid-row: 1;
    }

    @media (max-width: 1024px) {
      .layout-container {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
      }

      ::slotted([slot="one"]) {
        grid-column: 1;
        grid-row: 1;
      }

      ::slotted([slot="three"]) {
        grid-column: 1;
        grid-row: 2;
      }

      ::slotted([slot="two"]) {
        grid-column: 1;
        grid-row: 3;
      }
    }
  `);customElements.define("settings-layout",vt);class Ae extends d{constructor(){super(),this.displayName="Admin User",this.role="admin",this.email="admin@email.com",this.status="active",this.joinedDate="—",this.lastLoginDate="—",this.photoURL="",this.gender="",this.isUploading=!1,this.showUploadDialog=!1}changeAvatar(){this.showUploadDialog=!0}handleFileUpload(e){const t=e.detail.file;this.dispatchEvent(new CustomEvent("profile-photo-upload",{detail:{file:t},bubbles:!0,composed:!0})),this.showUploadDialog=!1}handleDialogClose(){this.showUploadDialog=!1}render(){return a`
      <app-dialog
        .isOpen=${this.showUploadDialog}
        title="Change Profile Photo"
        description="Upload a new profile picture"
        mode="upload"
        styleMode="compact"
        size="medium"
        confirmText="Upload"
        confirmColor="primary"
        @file-upload=${this.handleFileUpload}
        @dialog-close=${this.handleDialogClose}
        @dialog-cancel=${this.handleDialogClose}
      ></app-dialog>

      <div class="profile-card">
        ${this.isUploading?a`
          <div class="loading-overlay">
            <div class="spinner"></div>
          </div>
        `:""}

        <div class="left-bar"></div>

        <div class="content">
          <div class="avatar-container">
            <user-avatar
              size="80"
              .name=${this.displayName}
              .gender=${this.gender}
              .src=${this.photoURL}
            ></user-avatar>

            <div class="camera-icon ${this.isUploading?"uploading":""}" 
                 @click=${this.changeAvatar}>
              add_photo_alternate
            </div>
          </div>

          <div class="info">
            <div class="name">${this.displayName}</div>
            <div class="role">${this.role}</div>
            <div class="joined-date">Joined: ${this.joinedDate}</div>
            <div class="status">Last login: ${this.lastLoginDate}</div>
          </div>
        </div>

        <div class="badge">${this.status}</div>
      </div>
    `}}l(Ae,"properties",{displayName:{type:String},role:{type:String},email:{type:String},status:{type:String},joinedDate:{type:String},lastLoginDate:{type:String},photoURL:{type:String},gender:{type:String},isUploading:{type:Boolean},showUploadDialog:{type:Boolean}}),l(Ae,"styles",h`
  :host {
      display: block;
      width: 100%;
      font-family: Arial, sans-serif;
    }

    .profile-card {
      display: flex;
      position: relative;
      background: #fff;
      border-radius: 12px;
      border: 1.2px solid #2d2b2b45;
      min-height: 100px;
      overflow: hidden;
    }

    .left-bar {
      width: 32px;
      background-color:#d6150b;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
      align-self: stretch;
      flex-shrink: 0;
    }

    .content {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      padding: 16px;
    }

    .avatar-container {
      position: relative;
      width: 80px;
      height: 80px;
      flex-shrink: 0;
    }

    user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }

    .camera-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px solid #000;
      font-family: 'Material Symbols Outlined';
      font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      color: black;
      font-size: 18px;
      transition: all 0.2s ease;
    }

    .camera-icon:hover {
      background: #ff3b30;
      color: white;
      transform: scale(1.1);
    }

    .camera-icon.uploading {
      background: rgba(0, 123, 255, 0.8);
      color: white;
      pointer-events: none;
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .name {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .role,
    .joined-date {
      font-size: 0.9rem;
      color: gray;
    }

    .status {
      font-size: 0.75rem;
      color: #28a745;
    }

    .badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background-color: #2fa600;
      color: white;
      font-size: 0.75rem;
      padding: 2px 6px;
      border-radius: 4px;
      z-index: 1;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      z-index: 10;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #ff3b30;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  
  `);customElements.define("profile-header",Ae);class De extends d{constructor(){super(),this.editing=!1,this.isLoading=!1}toggleEdit(){this.editing=!this.editing}handleSubmit(e){e.preventDefault(),this.isLoading=!0;const t=Object.fromEntries(new FormData(e.target).entries());this.dispatchEvent(new CustomEvent("personal-info-update",{detail:t,bubbles:!0,composed:!0})),this.isLoading=!1,this.editing=!1}render(){return a`
      <div class="form-card">
        <div class="form-header">
          Personal Information
          <span @click=${this.toggleEdit}>✎</span>
        </div>

        <form @submit=${this.handleSubmit}>
          <input name="firstName" placeholder="First Name" ?disabled=${!this.editing} />
          <input name="lastName" placeholder="Last Name" ?disabled=${!this.editing} />
          <input name="email" placeholder="Email" disabled />
          <input name="contact" placeholder="Contact" ?disabled=${!this.editing} />
          <textarea class="address" name="address" placeholder="Address" ?disabled=${!this.editing}></textarea>

          ${this.editing?a`
            <app-button type="primary">Save</app-button>
          `:""}
        </form>
      </div>
    `}}l(De,"properties",{editing:{type:Boolean},isLoading:{type:Boolean}}),l(De,"styles",h`
    :host { display: block; }
    .form-card {
      background: #fff;
      border-radius: 10px;
      border: 1px solid #ccc;
      overflow: hidden;
      position: relative;
    }
    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: #d6150b;
      color: white;
      font-weight: bold;
    }
    form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      padding: 20px;
    }
    .address { grid-column: 1 / -1; }
    input, select, textarea {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  `);customElements.define("personal-info-form",De);class yt extends d{handleSubmit(e){e.preventDefault();const i=new FormData(e.target).get("newEmail");this.dispatchEvent(new CustomEvent("change-email",{detail:{newEmail:i},bubbles:!0,composed:!0})),e.target.reset()}render(){return a`
      <div class="section">
        <h3 class="section-title">Change Email</h3>

        <form @submit=${this.handleSubmit}>
          <input 
            type="email" 
            name="newEmail" 
            placeholder="New email address"
            required 
          />
          
          <app-button type="secondary" size="small">
            Update Email
          </app-button>
        </form>
      </div>
    `}}l(yt,"styles",h`
    :host {
      display: block;
      width: 100%;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      font-weight: bold;
      font-size: 0.95rem;
      margin: 0;
      color: #1a1a1a;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    input {
      padding: 8px 10px;
      border-radius: 5px;
      border: 1px solid #d0d0d0;
      font-size: 0.85rem;
      font-family: inherit;
      background: #ffffff;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #666;
    }

    input::placeholder {
      color: #999;
    }

    app-button {
      width: 100%;
    }
  `);customElements.define("change-email-card",yt);class wt extends d{handleSubmit(e){e.preventDefault();const t=new FormData(e.target);this.dispatchEvent(new CustomEvent("change-password",{detail:{currentPassword:t.get("currentPassword"),newPassword:t.get("newPassword")},bubbles:!0,composed:!0})),e.target.reset()}render(){return a`
      <div class="section">
        <h3 class="section-title">Change Password</h3>

        <form @submit=${this.handleSubmit}>
          <input 
            type="password" 
            name="currentPassword" 
            placeholder="Current password" 
            required 
          />
          <input 
            type="password" 
            name="newPassword" 
            placeholder="New password" 
            required 
          />
          
          <app-button type="primary" size="small">
            Change Password
          </app-button>
        </form>
      </div>
    `}}l(wt,"styles",h`
    :host {
      display: block;
      width: 100%;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      font-weight: bold;
      font-size: 0.95rem;
      margin: 0;
      color: #1a1a1a;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    input {
      padding: 8px 10px;
      border-radius: 5px;
      border: 1px solid #d0d0d0;
      font-size: 0.85rem;
      font-family: inherit;
      background: #ffffff;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #666;
    }

    input::placeholder {
      color: #999;
    }

    app-button {
      width: 100%;
    }
  `);customElements.define("change-password-card",wt);class kt extends d{disableAccount(){console.log("Termination card: deactivate clicked"),this.dispatchEvent(new CustomEvent("deactivate-account",{bubbles:!0,composed:!0}))}deleteAccount(){console.log("Termination card: delete clicked"),this.dispatchEvent(new CustomEvent("delete-account",{bubbles:!0,composed:!0}))}render(){return a`
      <div class="section">
        <div class="section-title">Account Termination</div>

        <div class="actions">
          <div class="action disable" @click=${this.disableAccount}>
            Deactivate Account
          </div>
          <div class="action delete" @click=${this.deleteAccount}>
            Delete Account
          </div>
        </div>

        <div class="notice">
          You can temporarily deactivate your account or permanently delete it. Deleting is irreversible.
        </div>
      </div>
    `}}l(kt,"styles",h`
  :host {
      display: block;
      width: 100%;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .section-title {
      font-weight: bold;
      font-size: 0.95rem;
      margin: 0;
      padding-bottom: 8px;
      color: #000000ff;
      text-align: center;
    }

    .actions {
      display: flex;
      justify-content: center;
      align-items: stretch;
      border-radius: 1px;
      overflow: hidden;
      width: fit-content;
      margin: 0 auto;
    }

    .action {
      text-align: center;
      padding: 6px 12px;
      font-size: 0.9rem;
      cursor: pointer;
      user-select: none;
      box-sizing: border-box;
      transition: text-decoration 0.2s;
    }

    .action:hover {
      text-decoration: underline;
    }

    .action + .action {
      border-left: 1.2px solid #ddd;
    }

    .disable {
      color: #ff6606ff;
      font-weight: bold;
    }

    .delete {
      color: #c62828;
      font-weight: bold;
    }

    .notice {
      font-size: 0.8rem;
      color: #474545ff;
      text-align: center;
      margin-top: 12px;
    }
  `);customElements.define("termination-card",kt);class Te extends d{constructor(){super(),this.isUnlocked=!0,this.userEmail="",this.authProvider="email",this.sessionTimeout=null}connectedCallback(){super.connectedCallback(),console.log("ManageAccountCard connected")}disconnectedCallback(){super.disconnectedCallback(),this.sessionTimeout&&clearTimeout(this.sessionTimeout)}handleUnlockAccount(){this.isUnlocked=!0,b.success("Account management unlocked"),this.sessionTimeout&&clearTimeout(this.sessionTimeout),this.sessionTimeout=setTimeout(()=>{this.handleLockAccount(),b.warning("Account management auto-locked for security")},6e5)}handleLockAccount(){this.isUnlocked=!1,this.sessionTimeout&&(clearTimeout(this.sessionTimeout),this.sessionTimeout=null),b.info("Account management locked")}handleChangeEmail(e){this.isUnlocked&&this.dispatchEvent(new CustomEvent("change-email",{detail:e.detail,bubbles:!0,composed:!0}))}handleChangePassword(e){this.isUnlocked&&this.dispatchEvent(new CustomEvent("change-password",{detail:e.detail,bubbles:!0,composed:!0}))}handleDeactivateAccount(e){this.isUnlocked&&this.dispatchEvent(new CustomEvent("deactivate-account",{bubbles:!0,composed:!0}))}handleDeleteAccount(e){this.isUnlocked&&this.dispatchEvent(new CustomEvent("delete-account",{bubbles:!0,composed:!0}))}render(){return a`
      <div class="account-card">
        <div class="card-title">
          Manage Your Account
          <span 
            class="lock-icon"
            @click="${this.isUnlocked?this.handleLockAccount:this.handleUnlockAccount}" 
            title="${this.isUnlocked?"Lock account management":"Unlock account management"}"
          >
            ${this.isUnlocked?u.lockOpen:u.lockClosed}
          </span>
        </div>

        <div class="content-wrapper ${this.isUnlocked?"unlocked":"locked"}">
          ${this.isUnlocked?a`
            <div class="section">
              <change-email-card @change-email="${this.handleChangeEmail}"></change-email-card>
            </div>

            <div class="section">
              <change-password-card @change-password="${this.handleChangePassword}"></change-password-card>
            </div>

            <div class="section">
              <termination-card 
                @deactivate-account="${this.handleDeactivateAccount}" 
                @delete-account="${this.handleDeleteAccount}">
              </termination-card>
            </div>
          `:a`
            <div class="locked-state">
              <div class="locked-description">
                Account management is locked for security. Click unlock to access sensitive settings.
              </div>
              <app-button type="danger" size="small" @click="${this.handleUnlockAccount}">
                ${u.lockOpen} Unlock Account Management
              </app-button>
              <div class="security-notice">
              ${u.clock} Session will auto-lock after 10 minutes of activity
                </div>
            </div>
          `}
        </div>
      </div>
    `}}l(Te,"properties",{isUnlocked:{type:Boolean},userEmail:{type:String},authProvider:{type:String}}),l(Te,"styles",h`
    :host { 
      display: block; 
      width: 100%; 
      height: 100%; 
    }
    
    .account-card { 
      background: #fff; 
      border-radius: 8px; 
      border: 1px solid #ccc;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-size: 0.8rem;
    }
    
    .card-title { 
      display: flex; 
      justify-content: space-between;
      align-items: center;
      font-weight: bold; 
      font-size: 0.85rem;
      color: #ff1500e9; 
      padding: 10px 12px;
      border-bottom: 1px solid #ccc; 
    }
    
    .lock-icon {
      cursor: pointer;
      font-size: 1rem;
      transition: transform 0.2s;
      display: flex;
      align-items: center;
    }
    
    .lock-icon:hover {
      transform: scale(1.1);
    }

    .lock-icon svg {
      width: 18px;
      height: 18px;
      vertical-align: middle;
    }
    
    .content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .content-wrapper.unlocked {
      overflow-y: auto;
    }

    .content-wrapper.locked {
      overflow: hidden;
    }
    
    .section { 
      padding: 12px 10px;
      border-bottom: 1px solid #ccc; 
    }
    
    .section:last-of-type { 
      border-bottom: none; 
    }
    
    .locked-state { 
      text-align: center; 
      padding: 20px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    
    .locked-description { 
      color: #666; 
      font-size: 0.8rem;
      margin-bottom: 10px;
      line-height: 1.4; 
    }
    
    .security-notice { 
      background: #f8f9fa; 
      border: 1px solid #e9ecef; 
      border-radius: 6px; 
      padding: 8px;
      margin-top: 10px;
      font-size: 0.7rem;
      color: #495057; 
    }
  `);customElements.define("manage-account-card",Te);class $t extends d{constructor(){super(),this.userInfo={}}handlePersonalInfoUpdate(e){b.success("Profile updated successfully!"),console.log("Updated personal info:",e.detail)}handleProfilePhotoUpload(e){const t=e.detail.file;console.log("Profile photo upload:",t),b.info("Uploading profile photo..."),setTimeout(()=>{b.success("Profile photo updated successfully!")},1500)}handleChangeEmail(e){b.success(`Email change requested: ${e.detail.newEmail}`),console.log("Change email event:",e.detail)}handleChangePassword(e){b.success("Password change requested"),console.log("Change password event:",e.detail)}handleAccountTermination(e){b.warning("Account termination action triggered"),console.log("Account termination event:",e.type)}render(){return a`
      <settings-layout>
        <profile-header 
          slot="one"
          @profile-photo-upload=${this.handleProfilePhotoUpload}
        ></profile-header>

        <personal-info-form
          slot="three"
          .userInfo="${this.userInfo}"
          @personal-info-update="${this.handlePersonalInfoUpdate}">
        </personal-info-form>

        <manage-account-card
          slot="two"
          userEmail="admin@example.com"
          @change-email="${this.handleChangeEmail}"
          @change-password="${this.handleChangePassword}"
          @deactivate-account="${this.handleAccountTermination}"
          @delete-account="${this.handleAccountTermination}">
        </manage-account-card>
      </settings-layout>
    `}}l($t,"styles",h`
    :host {
      display: block;
      padding: 1rem;
      min-height: 100vh;
      box-sizing: border-box;
      background-color: #fffefe;
      font-family: Arial, sans-serif;
    }
  `);customElements.define("app-settings",$t);class ze extends d{constructor(){super(),this.currentPage="dashboard"}renderPage(){switch(this.currentPage){case"dashboard":return a`<admin-dashboard></admin-dashboard>`;case"reservation":return a`<admin-reservation></admin-reservation>`;case"booking":return a`<admin-booking></admin-booking>`;case"ticket":return a`<admin-ticket></admin-ticket>`;case"user":return a`<admin-user></admin-user>`;case"logs":return a`<admin-logs></admin-logs>`;case"payments":return a`<admin-payments></admin-payments>`;case"settings":return a`<app-settings></app-settings>`;default:return a`<admin-dashboard></admin-dashboard>`}}render(){return a`${this.renderPage()}`}}l(ze,"properties",{currentPage:{type:String}}),l(ze,"styles",h`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background: #fffffffe;
    }
  `);customElements.define("app-content",ze);class _e extends d{constructor(){super(),this.mode="login"}updated(e){e.has("mode")&&this.setAttribute("mode",this.mode)}render(){return a`
      <div class="card">
        <slot></slot>
      </div>
    `}}l(_e,"properties",{mode:{type:String}}),l(_e,"styles",h`
    :host {
      display: block;
      width: 100%;
    }

    :host([mode="login"]) {
      max-width: 320px;
    }

    :host([mode="register"]) {
      max-width: 390px;
    }

    .card {
      background: white;
      border-radius: 8px;
      border: 3px solid #6b0606;
    }

    :host([mode="login"]) .card {
      padding: 1rem 1.5rem;
    }

    :host([mode="register"]) .card {
      padding: 1rem 1rem;
    }

    ::slotted(*) {
      margin: 0;
    }
  `);customElements.define("authentication-card",_e);class Ue extends d{constructor(){super(),this.mode="login"}updated(e){e.has("mode")&&this.setAttribute("mode",this.mode)}render(){return this.mode==="register"?a`
        <div class="auth-wrapper">
          <div class="auth-container">
            <div class="logo">
              <img src="/assets/logoExtended.svg" alt="CoWork Logo">
            </div>
            <div class="auth-form-section">
              <slot name="form"></slot>
            </div>
          </div>
        </div>
        <div class="footer">
          <slot name="footer">
            <p>&copy; 2024 CoWork. All rights reserved.</p>
          </slot>
        </div>
      `:a`
      <div class="auth-wrapper">
        <div class="auth-container">
          <div class="logo">
            <img src="/assets/logoExtended.svg" alt="CoWork Logo">
          </div>
          <div class="auth-form-section">
            <slot name="form"></slot>
          </div>
        </div>
      </div>
      <div class="footer">
        <slot name="footer">
          <p>&copy; 2024 CoWork. All rights reserved.</p>
        </slot>
      </div>
    `}}l(Ue,"properties",{mode:{type:String}}),l(Ue,"styles",h`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .auth-wrapper {
      flex: 1;
      background: url('/assets/greatworks.avif');
      background-color: #f5f5f5;
      position: relative;
    }

    .auth-wrapper::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.85);
      z-index: 0;
    }

    .auth-container {
      display: flex;
      flex: 1;
      position: relative;
      z-index: 1;
    }

    .logo {
      position: absolute;
      top: 2rem;
      left: 3rem;
      z-index: 2;
    }

    .logo img {
      max-width: 200px;
      height: auto;
    }

    .auth-form-section {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 2rem;
      width: 100%;
    }

    .footer {
      background: #1a1a1a;
      color: white;
      padding: 1.5rem 2rem;
      text-align: center;
      font-size: 0.9rem;
    }

    /* Login mode: card on right, red line on right */
    :host([mode="login"]) .auth-form-section {
      justify-content: flex-end;
      padding-right: 5rem;
      border-right: 45px solid #da0d0dd7;
    padding-top: 11.5rem;
    }

    /* Register mode: card on left, red line on left, logo above card */
    :host([mode="register"]) .auth-form-section {
      justify-content: flex-start;
      padding-left: 5rem;
      padding-top: 8rem;
      border-left: 45px solid #da0d0dd7;
    }

    :host([mode="register"]) .logo {
      position: absolute;
      top: 2rem;
      left: 3rem;
    }

    @media (max-width: 1024px) {
      .auth-form-section {
        justify-content: center !important;
        padding: 2rem !important;
      }

      .logo {
        position: static !important;
        margin: 2rem auto !important;
        text-align: center;
      }
    }
  `);customElements.define("auth-layout",Ue);class Le extends d{constructor(){super(),this.loading=!1,this.error=""}handleSubmit(e){e.preventDefault(),window.location.hash="dashboard"}render(){return a`
      <auth-layout mode="login">
        <authentication-card slot="form" mode="login">
          <h2>Sign in</h2>
          <p class="subtitle">Please enter your Login ID</p>

          ${this.error?a`
            <div class="error-message">${this.error}</div>
          `:""}

          <form @submit=${this.handleSubmit}>
            <input-field
              type="email"
              name="email"
              placeholder="Please enter your Login ID"
              ?required=${!0}
              ?disabled=${this.loading}
            ></input-field>

            <input-field
              type="password"
              name="password"
              placeholder="Please enter your password"
              ?required=${!0}
              ?disabled=${this.loading}
            ></input-field>

            <button 
              type="submit" 
              class="login-btn"
              ?disabled=${this.loading}
            >
              ${this.loading?"Signing in...":"Continue"}
            </button>
          </form>

          <div class="forgot-password">
            <a href="#forgot-password">Forgot your password?</a>
          </div>

          <div class="register-link">
            Don't have an account? <a href="#register">Apply Now</a>
          </div>
        </authentication-card>
      </auth-layout>
    `}}l(Le,"properties",{loading:{type:Boolean},error:{type:String}}),l(Le,"styles",h`
    :host {
      display: block;
    }

    h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      color: #1a1a1a;
    }

    .subtitle {
      color: #666;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
    }

    .error-message {
      background: #fee;
      color: #c00;
      padding: 0.6rem;
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    .login-btn {
      width: 100%;
      padding: 0.75rem;
      background: #da0d0dd7;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 0.5rem;
    }

    .login-btn:hover {
      background: rgb(212, 36, 6);
    }

    .login-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .forgot-password {
      text-align: center;
      margin-top: 1rem;
    }

    .forgot-password a {
      color: #8d1409;
      text-decoration: none;
      font-size: 0.85rem;
    }

    .forgot-password a:hover {
      text-decoration: underline;
    }

    .register-link {
      text-align: center;
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 0.85rem;
    }

    .register-link a {
      color: #da0d0dd7;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `);customElements.define("login-page",Le);class Re extends d{constructor(){super(),this.loading=!1,this.error=""}handleSubmit(e){e.preventDefault(),window.location.hash="dashboard"}render(){return a`
      <auth-layout mode="register">
        <authentication-card slot="form" mode="register">
          <h2>Create Account</h2>
          <p class="subtitle">Sign up to get started</p>

          ${this.error?a`
            <div class="error-message">${this.error}</div>
          `:""}

          <form @submit=${this.handleSubmit}>
            <input-field
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              ?required=${!0}
              ?disabled=${this.loading}
            ></input-field>

            <input-field
              type="email"
              name="email"
              placeholder="Enter your email"
              ?required=${!0}
              ?disabled=${this.loading}
            ></input-field>

            <input-field
              type="password"
              name="password"
              placeholder="Create a password"
              ?required=${!0}
              ?disabled=${this.loading}
            ></input-field>

            <input-field
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              ?required=${!0}
              ?disabled=${this.loading}
            ></input-field>

            <button 
              type="submit" 
              class="register-btn"
              ?disabled=${this.loading}
            >
              ${this.loading?"Creating Account...":"Create Account"}
            </button>
          </form>

          <div class="login-link">
            Already have an account? <a href="#login">Sign in</a>
          </div>
        </authentication-card>
      </auth-layout>
    `}}l(Re,"properties",{loading:{type:Boolean},error:{type:String}}),l(Re,"styles",h`
    :host {
      display: block;
    }

    h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      color: #1a1a1a;
    }

    .subtitle {
      color: #666;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
    }

    .error-message {
      background: #fee;
      color: #c00;
      padding: 0.6rem;
      border-radius: 6px;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    .register-btn {
      width: 100%;
      padding: 0.75rem;
      background: #da0d0dd7;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 0.5rem;
    }

    .register-btn:hover {
      background: rgb(212, 36, 6);
    }

    .register-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .login-link {
      text-align: center;
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 0.85rem;
    }

    .login-link a {
      color: #da0d0dd7;
      text-decoration: none;
      font-weight: 600;
    }

    .login-link a:hover {
      text-decoration: underline;
    }
  `);customElements.define("register-page",Re);class Me extends d{constructor(){super(),this.loading=!1,this.success=!1,this.error=""}handleSubmit(e){e.preventDefault();const i=new FormData(e.target).get("email");this.loading=!0,this.error="",this.success=!1,setTimeout(()=>{i?(this.success=!0,this.loading=!1):(this.error="Please enter a valid email",this.loading=!1)},1e3)}render(){return a`
      <auth-layout mode="center">
        <div slot="form" class="forgot-card">
          <div class="logo">
            <img src="/src/assets/logoExtended.svg" alt="CoWork Logo">
          </div>

          <h2>Forgot Password?</h2>
          <p class="subtitle">Enter your email to reset your password</p>

          ${this.success?a`
            <div class="success-message">
              Password reset link has been sent to your email!
            </div>
          `:""}

          ${this.error?a`
            <div class="error-message">${this.error}</div>
          `:""}

          <form @submit=${this.handleSubmit}>
            <input-field
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              ?required=${!0}
              ?disabled=${this.loading}
            ></input-field>

            <button 
              type="submit" 
              class="submit-btn"
              ?disabled=${this.loading}
            >
              ${this.loading?"Sending...":"Send Reset Link"}
            </button>
          </form>

          <div class="back-link">
            <a href="#login">Back to Login</a>
          </div>
        </div>
      </auth-layout>
    `}}l(Me,"properties",{loading:{type:Boolean},success:{type:Boolean},error:{type:String}}),l(Me,"styles",h`
    :host {
      display: block;
    }

    .forgot-card {
      background: white;
      border-radius: 12px;
      padding: 2.5rem;
      border: 3px solid #6b0606;
      width: 100%;
      max-width: 400px;
    }

    .logo {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo img {
      max-width: 180px;
      height: auto;
    }

    h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      color: #1a1a1a;
      text-align: center;
    }

    .subtitle {
      text-align: center;
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    .success-message {
      background: #e8f5e9;
      color: #2e7d32;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .error-message {
      background: #fee;
      color: #c00;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .submit-btn {
      width: 100%;
      padding: 0.875rem;
      background: #da0d0dd7;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .submit-btn:hover {
      background: rgb(212, 36, 6);
    }

    .submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .back-link {
      text-align: center;
      margin-top: 1rem;
    }

    .back-link a {
      color: #8d1409;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link a:hover {
      text-decoration: underline;
    }
  `);customElements.define("forgot-password-page",Me);class Ie extends d{constructor(){super(),this.currentPage=window.location.hash.slice(1)||"login",window.addEventListener("hashchange",()=>{this.currentPage=window.location.hash.slice(1)||"login"})}connectedCallback(){super.connectedCallback(),this.addEventListener("page-change",this.handlePageChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("page-change",this.handlePageChange)}handlePageChange(e){this.currentPage=e.detail.page,window.location.hash=e.detail.page}handleLogout(){window.location.hash="login",this.currentPage="login"}getPageTitle(){return{dashboard:"DASHBOARD",reservation:"RESERVATIONS",booking:"BOOKING",ticket:"TICKETS",user:"USERS",logs:"ACTIVITY LOGS",payments:"PAYMENTS",settings:"SETTINGS"}[this.currentPage]||"DASHBOARD"}renderAuthPage(){switch(this.currentPage){case"register":return a`<register-page></register-page>`;case"forgot-password":return a`<forgot-password-page></forgot-password-page>`;case"login":default:return a`<login-page></login-page>`}}render(){return["login","register","forgot-password"].includes(this.currentPage)?this.renderAuthPage():a`
      <dashboard-layout>
        <app-sidebar 
          slot="sidebar"
          activePage=${this.currentPage}
          @logout=${this.handleLogout}
        ></app-sidebar>
        
        <page-header 
          slot="header"
          title="${this.getPageTitle()}"
        ></page-header>
        
        <app-content 
          slot="content"
          currentPage=${this.currentPage}
        ></app-content>
      </dashboard-layout>
    `}}l(Ie,"properties",{currentPage:{type:String}}),l(Ie,"styles",h`
    :host {
      display: block;
    }
  `);customElements.define("app-root",Ie);
