var ge=Object.defineProperty;var $e=(o,e,t)=>e in o?ge(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var m=(o,e,t)=>$e(o,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const N=globalThis,F=N.ShadowRoot&&(N.ShadyCSS===void 0||N.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol(),Y=new WeakMap;let le=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==K)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(F&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=Y.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Y.set(t,e))}return e}toString(){return this.cssText}};const fe=o=>new le(typeof o=="string"?o:o+"",void 0,K),Z=(o,...e)=>{const t=o.length===1?o[0]:e.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new le(t,o,K)},me=(o,e)=>{if(F)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),i=N.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,o.appendChild(s)}},G=F?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return fe(t)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:_e,defineProperty:be,getOwnPropertyDescriptor:ye,getOwnPropertyNames:ve,getOwnPropertySymbols:Ae,getPrototypeOf:Ee}=Object,f=globalThis,Q=f.trustedTypes,Se=Q?Q.emptyScript:"",z=f.reactiveElementPolyfillSupport,C=(o,e)=>o,j={toAttribute(o,e){switch(e){case Boolean:o=o?Se:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},he=(o,e)=>!_e(o,e),X={attribute:!0,type:String,converter:j,reflect:!1,useDefault:!1,hasChanged:he};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),f.litPropertyMetadata??(f.litPropertyMetadata=new WeakMap);let E=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=X){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&be(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:r}=ye(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:i,set(n){const l=i==null?void 0:i.call(this);r==null||r.call(this,n),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??X}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;const e=Ee(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){const t=this.properties,s=[...ve(t),...Ae(t)];for(const i of s)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const i of s)t.unshift(G(i))}else e!==void 0&&t.push(G(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return me(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var r;const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){const n=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:j).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){var r,n;const s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const l=s.getPropertyOptions(i),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((r=l.converter)==null?void 0:r.fromAttribute)!==void 0?l.converter:j;this._$Em=i;const c=a.fromAttribute(t,l.type);this[i]=c??((n=this._$Ej)==null?void 0:n.get(i))??c,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){var n;if(e!==void 0){const l=this.constructor;if(i===!1&&(r=this[e]),s??(s=l.getPropertyOptions(e)),!((s.hasChanged??he)(r,t)||s.useDefault&&s.reflect&&r===((n=this._$Ej)==null?void 0:n.get(e))&&!this.hasAttribute(l._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,n??t??this[e]),r!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,n]of i){const{wrapped:l}=n,a=this[r];l!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,n,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[C("elementProperties")]=new Map,E[C("finalized")]=new Map,z==null||z({ReactiveElement:E}),(f.reactiveElementVersions??(f.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const x=globalThis,ee=o=>o,H=x.trustedTypes,te=H?H.createPolicy("lit-html",{createHTML:o=>o}):void 0,ce="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,de="?"+$,we=`<${de}>`,A=document,k=()=>A.createComment(""),O=o=>o===null||typeof o!="object"&&typeof o!="function",J=Array.isArray,Pe=o=>J(o)||typeof(o==null?void 0:o[Symbol.iterator])=="function",B=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,se=/-->/g,ie=/>/g,_=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),oe=/'/g,re=/"/g,pe=/^(?:script|style|textarea|title)$/i,Ce=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),T=Ce(1),S=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),ne=new WeakMap,b=A.createTreeWalker(A,129);function ue(o,e){if(!J(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return te!==void 0?te.createHTML(e):e}const xe=(o,e)=>{const t=o.length-1,s=[];let i,r=e===2?"<svg>":e===3?"<math>":"",n=P;for(let l=0;l<t;l++){const a=o[l];let c,p,h=-1,u=0;for(;u<a.length&&(n.lastIndex=u,p=n.exec(a),p!==null);)u=n.lastIndex,n===P?p[1]==="!--"?n=se:p[1]!==void 0?n=ie:p[2]!==void 0?(pe.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=_):p[3]!==void 0&&(n=_):n===_?p[0]===">"?(n=i??P,h=-1):p[1]===void 0?h=-2:(h=n.lastIndex-p[2].length,c=p[1],n=p[3]===void 0?_:p[3]==='"'?re:oe):n===re||n===oe?n=_:n===se||n===ie?n=P:(n=_,i=void 0);const g=n===_&&o[l+1].startsWith("/>")?" ":"";r+=n===P?a+we:h>=0?(s.push(c),a.slice(0,h)+ce+a.slice(h)+$+g):a+$+(h===-2?l:g)}return[ue(o,r+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class M{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,n=0;const l=e.length-1,a=this.parts,[c,p]=xe(e,t);if(this.el=M.createElement(c,s),b.currentNode=this.el.content,t===2||t===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=b.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(ce)){const u=p[n++],g=i.getAttribute(h).split($),R=/([.?@])?(.*)/.exec(u);a.push({type:1,index:r,name:R[2],strings:g,ctor:R[1]==="."?Oe:R[1]==="?"?Me:R[1]==="@"?Ue:L}),i.removeAttribute(h)}else h.startsWith($)&&(a.push({type:6,index:r}),i.removeAttribute(h));if(pe.test(i.tagName)){const h=i.textContent.split($),u=h.length-1;if(u>0){i.textContent=H?H.emptyScript:"";for(let g=0;g<u;g++)i.append(h[g],k()),b.nextNode(),a.push({type:2,index:++r});i.append(h[u],k())}}}else if(i.nodeType===8)if(i.data===de)a.push({type:2,index:r});else{let h=-1;for(;(h=i.data.indexOf($,h+1))!==-1;)a.push({type:7,index:r}),h+=$.length-1}r++}}static createElement(e,t){const s=A.createElement("template");return s.innerHTML=e,s}}function w(o,e,t=o,s){var n,l;if(e===S)return e;let i=s!==void 0?(n=t._$Co)==null?void 0:n[s]:t._$Cl;const r=O(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==r&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=i:t._$Cl=i),i!==void 0&&(e=w(o,i._$AS(o,e.values),i,s)),e}class ke{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=((e==null?void 0:e.creationScope)??A).importNode(t,!0);b.currentNode=i;let r=b.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new U(r,r.nextSibling,this,e):a.type===1?c=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(c=new Re(r,this,e)),this._$AV.push(c),a=s[++l]}n!==(a==null?void 0:a.index)&&(r=b.nextNode(),n++)}return b.currentNode=A,i}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class U{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=w(this,e,t),O(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==S&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Pe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){var r;const{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=M.createElement(ue(s.h,s.h[0]),this.options)),s);if(((r=this._$AH)==null?void 0:r._$AD)===i)this._$AH.p(t);else{const n=new ke(i,this),l=n.u(this.options);n.p(t),this.T(l),this._$AH=n}}_$AC(e){let t=ne.get(e.strings);return t===void 0&&ne.set(e.strings,t=new M(e)),t}k(e){J(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const r of e)i===t.length?t.push(s=new U(this.O(k()),this.O(k()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){const i=ee(e).nextSibling;ee(e).remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class L{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,t=this,s,i){const r=this.strings;let n=!1;if(r===void 0)e=w(this,e,t,0),n=!O(e)||e!==this._$AH&&e!==S,n&&(this._$AH=e);else{const l=e;let a,c;for(e=r[0],a=0;a<r.length-1;a++)c=w(this,l[s+a],t,a),c===S&&(c=this._$AH[a]),n||(n=!O(c)||c!==this._$AH[a]),c===d?e=d:e!==d&&(e+=(c??"")+r[a+1]),this._$AH[a]=c}n&&!i&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Oe extends L{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}}class Me extends L{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}}class Ue extends L{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=w(this,e,t,0)??d)===S)return;const s=this._$AH,i=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==d&&(s===d||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Re{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){w(this,e)}}const D=x.litHtmlPolyfillSupport;D==null||D(M,U),(x.litHtmlVersions??(x.litHtmlVersions=[])).push("3.3.2");const Ne=(o,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let i=s._$litPart$;if(i===void 0){const r=(t==null?void 0:t.renderBefore)??null;s._$litPart$=i=new U(e.insertBefore(k(),r),r,void 0,t??{})}return i._$AI(o),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const y=globalThis;class v extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ne(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return S}}var ae;v._$litElement$=!0,v.finalized=!0,(ae=y.litElementHydrateSupport)==null||ae.call(y,{LitElement:v});const I=y.litElementPolyfillSupport;I==null||I({LitElement:v});(y.litElementVersions??(y.litElementVersions=[])).push("4.2.2");class V extends v{constructor(){super(),this.role="customer",this.activePage="browse"}get menuItems(){return this.role==="admin"?[{id:"dashboard",label:"Dashboard",icon:"📊"},{id:"bookings",label:"All Bookings",icon:"📅"},{id:"rooms",label:"Manage Rooms",icon:"🏢"},{id:"room-types",label:"Room Types",icon:"📋"},{id:"payments",label:"Payments",icon:"💳"}]:[{id:"browse",label:"Browse Rooms",icon:"🔍"},{id:"book",label:"Book a Room",icon:"➕"},{id:"my-bookings",label:"My Bookings",icon:"📅"},{id:"payments",label:"My Payments",icon:"💳"}]}handleNavClick(e){this.activePage=e,this.dispatchEvent(new CustomEvent("page-change",{detail:{page:e},bubbles:!0,composed:!0}))}handleLogout(){this.dispatchEvent(new CustomEvent("logout",{bubbles:!0,composed:!0}))}render(){return T`
      <div class="logo">
        <h1>CoWork</h1>
        <p>${this.role==="admin"?"Admin Portal":"Book Your Space"}</p>
      </div>

      <nav>
        ${this.menuItems.map(e=>T`
          <div 
            class="nav-item ${this.activePage===e.id?"active":""}"
            @click=${()=>this.handleNavClick(e.id)}
          >
            <span class="nav-icon">${e.icon}</span>
            <span>${e.label}</span>
          </div>
        `)}
      </nav>

      <div class="logout">
        <button class="logout-btn" @click=${this.handleLogout}>
          🚪 Logout
        </button>
      </div>
    `}}m(V,"properties",{role:{type:String},activePage:{type:String}}),m(V,"styles",Z`
    :host {
      display: block;
      width: 250px;
      height: 100vh;
      background: #1a1a2e;
      color: white;
      position: fixed;
      left: 0;
      top: 0;
    }

    .logo {
      padding: 2rem;
      text-align: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      color: #00d4ff;
    }

    .logo p {
      margin: 0.5rem 0 0 0;
      font-size: 0.875rem;
      color: rgba(255,255,255,0.6);
    }

    nav {
      padding: 1rem 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.05);
      color: white;
    }

    .nav-item.active {
      background: rgba(0,212,255,0.1);
      color: #00d4ff;
      border-left-color: #00d4ff;
    }

    .nav-icon {
      margin-right: 1rem;
      font-size: 1.25rem;
    }

    .logout {
      position: absolute;
      bottom: 2rem;
      left: 0;
      right: 0;
      padding: 0 1.5rem;
    }

    .logout-btn {
      width: 100%;
      padding: 0.75rem;
      background: rgba(255,59,48,0.1);
      border: 1px solid rgba(255,59,48,0.3);
      color: #ff3b30;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: rgba(255,59,48,0.2);
    }
  `);customElements.define("app-sidebar",V);class W extends v{constructor(){super(),this.currentPage="browse"}getPageContent(){const e={browse:{title:"Browse Rooms",subtitle:"Find the perfect space",icon:"🔍"},book:{title:"Book a Room",subtitle:"Select date and time",icon:"➕"},"my-bookings":{title:"My Bookings",subtitle:"View your reservations",icon:"📅"},dashboard:{title:"Dashboard",subtitle:"Overview",icon:"📊"},bookings:{title:"All Bookings",subtitle:"Manage bookings",icon:"📅"},rooms:{title:"Manage Rooms",subtitle:"Add or edit rooms",icon:"🏢"},"room-types":{title:"Room Types",subtitle:"Manage categories",icon:"📋"},payments:{title:"Payments",subtitle:"View payments",icon:"💳"}};return e[this.currentPage]||e.browse}render(){const e=this.getPageContent();return T`
      <div class="page-header">
        <h2>${e.title}</h2>
        <p>${e.subtitle}</p>
      </div>
      <div class="page-content">
        <div class="placeholder">
          <div class="placeholder-icon">${e.icon}</div>
          <p>${e.title} content goes here</p>
        </div>
      </div>
    `}}m(W,"properties",{currentPage:{type:String}}),m(W,"styles",Z`
    :host {
      display: block;
      margin-left: 250px;
      padding: 2rem;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h2 {
      margin: 0;
      font-size: 2rem;
      color: #1a1a2e;
    }

    .page-header p {
      margin: 0.5rem 0 0 0;
      color: #666;
    }

    .page-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .placeholder {
      text-align: center;
      padding: 4rem 2rem;
      color: #999;
    }

    .placeholder-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
  `);customElements.define("app-content",W);class q extends v{constructor(){super(),this.currentPage="browse",this.userRole="customer"}handlePageChange(e){this.currentPage=e.detail.page}handleLogout(){alert("Logout clicked")}render(){return T`
      <app-sidebar 
        role=${this.userRole}
        activePage=${this.currentPage}
        @page-change=${this.handlePageChange}
        @logout=${this.handleLogout}
      ></app-sidebar>
      
      <app-content 
        currentPage=${this.currentPage}
      ></app-content>
    `}}m(q,"properties",{currentPage:{type:String},userRole:{type:String}}),m(q,"styles",Z`
    :host {
      display: block;
    }
  `);customElements.define("app-root",q);
