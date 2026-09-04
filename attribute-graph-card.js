/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var a;const l=window,h=l.trustedTypes,c=h?h.emptyScript:"",d=l.reactiveElementPolyfillSupport,u={toAttribute(t,e){switch(e){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},p=(t,e)=>e!==t&&(e==e||t==t),_={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:p},f="finalized";let v=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||_}static finalize(){if(this.hasOwnProperty(f))return!1;this[f]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var i;const s=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{e?i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(e=>{const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=_){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:u).toAttribute(e,i.type);this._$El=t,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:u;this._$El=n,this[n]=r.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||p)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;v[f]=!0,v.elementProperties=new Map,v.elementStyles=[],v.shadowRootOptions={mode:"open"},null==d||d({ReactiveElement:v}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const m=window,$=m.trustedTypes,y=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,b="$lit$",x=`lit$${(Math.random()+"").slice(9)}$`,w="?"+x,A=`<${w}>`,E=document,S=()=>E.createComment(""),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,k=Array.isArray,T="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,N=/>/g,R=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,M=/"/g,O=/^(?:script|style|textarea|title)$/i,z=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),L=z(1),D=z(2),B=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),F=new WeakMap,I=E.createTreeWalker(E,129,null,!1);function V(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==y?y.createHTML(e):e}const q=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":"",o=P;for(let e=0;e<i;e++){const i=t[e];let a,l,h=-1,c=0;for(;c<i.length&&(o.lastIndex=c,l=o.exec(i),null!==l);)c=o.lastIndex,o===P?"!--"===l[1]?o=U:void 0!==l[1]?o=N:void 0!==l[2]?(O.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=R):void 0!==l[3]&&(o=R):o===R?">"===l[0]?(o=null!=n?n:P,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?R:'"'===l[3]?M:H):o===M||o===H?o=R:o===U||o===N?o=P:(o=R,n=void 0);const d=o===R&&t[e+1].startsWith("/>")?" ":"";r+=o===P?i+A:h>=0?(s.push(a),i.slice(0,h)+b+i.slice(h)+x+d):i+x+(-2===h?(s.push(void 0),e):d)}return[V(t,r+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class W{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[l,h]=q(t,e);if(this.el=W.createElement(l,i),I.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=I.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(b)||e.startsWith(x)){const i=h[r++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+b).split(x),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?J:"?"===e[1]?Q:"@"===e[1]?tt:Y})}else a.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(O.test(s.tagName)){const t=s.textContent.split(x),e=t.length-1;if(e>0){s.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],S()),I.nextNode(),a.push({type:2,index:++n});s.append(t[e],S())}}}else if(8===s.nodeType)if(s.data===w)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(x,t+1));)a.push({type:7,index:n}),t+=x.length-1}n++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,s){var n,r,o,a;if(e===B)return e;let l=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const h=C(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==h&&(null===(r=null==l?void 0:l._$AO)||void 0===r||r.call(l,!1),void 0===h?l=void 0:(l=new h(t),l._$AT(t,i,s)),void 0!==s?(null!==(o=(a=i)._$Co)&&void 0!==o?o:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=X(t,l._$AS(t,e.values),l,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:E).importNode(i,!0);I.currentNode=n;let r=I.nextNode(),o=0,a=0,l=s[0];for(;void 0!==l;){if(o===l.index){let e;2===l.type?e=new K(r,r.nextSibling,this,t):1===l.type?e=new l.ctor(r,l.name,l.strings,this,t):6===l.type&&(e=new et(r,this,t)),this._$AV.push(e),l=s[++a]}o!==(null==l?void 0:l.index)&&(r=I.nextNode(),o++)}return I.currentNode=E,n}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class K{constructor(t,e,i,s){var n;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),C(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>k(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==j&&C(this._$AH)?this._$AA.nextSibling.data=t:this.$(E.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=W.createElement(V(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.v(i);else{const t=new G(n,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new W(t)),e}T(t){k(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new K(this.k(S()),this.k(S()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Y{constructor(t,e,i,s,n){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=X(this,t,e,0),r=!C(t)||t!==this._$AH&&t!==B,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=X(this,s[i+o],e,o),a===B&&(a=this._$AH[o]),r||(r=!C(a)||a!==this._$AH[o]),a===j?t=j:t!==j&&(t+=(null!=a?a:"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class J extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}const Z=$?$.emptyScript:"";class Q extends Y{constructor(){super(...arguments),this.type=4}j(t){t&&t!==j?this.element.setAttribute(this.name,Z):this.element.removeAttribute(this.name)}}class tt extends Y{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=X(this,t,e,0))&&void 0!==i?i:j)===B)return;const s=this._$AH,n=t===j&&s!==j||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==j&&(s===j||n);n&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class et{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const it=m.litHtmlPolyfillSupport;null==it||it(W,K),(null!==(g=m.litHtmlVersions)&&void 0!==g?g:m.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var st,nt;class rt extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,n;const r=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let o=r._$litPart$;if(void 0===o){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;r._$litPart$=o=new K(e.insertBefore(S(),t),t,void 0,null!=i?i:{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return B}}rt.finalized=!0,rt._$litElement$=!0,null===(st=globalThis.litElementHydrateSupport)||void 0===st||st.call(globalThis,{LitElement:rt});const ot=globalThis.litElementPolyfillSupport;null==ot||ot({LitElement:rt}),(null!==(nt=globalThis.litElementVersions)&&void 0!==nt?nt:globalThis.litElementVersions=[]).push("3.3.3");const at=["#03a9f4","#ff9800","#4caf50","#e91e63","#9c27b0","#795548","#607d8b","#cddc39","#00bcd4","#f44336"],lt={brightness:{factor:100/255,offset:0,unit:"%",decimals:0},color_temp_kelvin:{factor:1,offset:0,unit:"K",decimals:0},battery_level:{factor:1,offset:0,unit:"%",decimals:0},humidity:{factor:1,offset:0,unit:"%",decimals:0},current_temperature:{factor:1,offset:0,unit:"°",decimals:1}},ht=(t,e,i={},s={})=>{const n=new CustomEvent(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed,detail:i});return t.dispatchEvent(n),n};function ct(t,e){let i;if(i=e.attribute?t.attributes?t.attributes[e.attribute]:void 0:t.state,null==i)return;if("boolean"==typeof i)return i?1:0;if("string"==typeof i){if("on"===i||"home"===i||"open"===i||"unlocked"===i)return 1;if("off"===i||"not_home"===i||"closed"===i||"locked"===i)return 0;if("unknown"===i||"unavailable"===i||""===i)return}const s=Number(i);return Number.isNaN(s)?void 0:s}function dt(t,e){return t*e.factor+e.offset}function ut(t,e){return null==t||Number.isNaN(t)?"":null==e?Math.round(100*t)/100+"":t.toFixed(e)}function pt(t,e){if(t.name)return t.name;const i=e&&e.states[t.entity],s=i&&i.attributes.friendly_name||t.entity;return t.attribute?`${s} · ${t.attribute}`:s}customElements.define("attribute-graph-card-editor",class extends rt{static get properties(){return{hass:{},_config:{state:!0},_expanded:{state:!0}}}constructor(){super(),this._expanded=-1}setConfig(t){this._config={entities:[],...t}}_entityAttributes(t){return this.hass&&t&&this.hass.states[t]?Object.keys(this.hass.states[t].attributes).filter(e=>"object"!=typeof this.hass.states[t].attributes[e]):[]}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=e.getAttribute("data-key");if(!i)return;let s=e.value;"checkbox"===e.type&&(s=e.checked),"number"===e.type&&(s=""===s?void 0:Number(s));const n={...this._config,[i]:s};this._config=n,ht(this,"config-changed",{config:n})}_entityChanged(t,e){const i=[...this._config.entities];i[t]={...i[t],entity:e.target.value},this._updateEntities(i)}_seriesFieldChanged(t,e,i){const s=[...this._config.entities];let n=i.target.value;"checkbox"===i.target.type&&(n=i.target.checked),["min","max"].includes(e)&&(n=""===n?void 0:Number(n));const r={...s[t]};void 0===n||""===n?delete r[e]:r[e]=n,s[t]=r,this._updateEntities(s)}_addEntity(){const t=[...this._config.entities,{entity:""}];this._expanded=t.length-1,this._updateEntities(t)}_removeEntity(t){const e=[...this._config.entities];e.splice(t,1),this._updateEntities(e)}_moveEntity(t,e){const i=[...this._config.entities],s=t+e;s<0||s>=i.length||([i[t],i[s]]=[i[s],i[t]],this._updateEntities(i))}_renderSelect(t,e,i,s){return L`
      <label class="select-field">
        <span class="select-label">${t}</span>
        <select .value=${e} @change=${i}>
          ${s.map(([t,e])=>L`<option value=${t}>${e}</option>`)}
        </select>
      </label>
    `}_toggleExpanded(t){this._expanded=this._expanded===t?-1:t}_updateEntities(t){const e={...this._config,entities:t};this._config=e,ht(this,"config-changed",{config:e})}render(){return this.hass&&this._config?L`
      <div class="card-config">
        <div class="row">
          <ha-textfield
            label="Title (optional)"
            data-key="title"
            .value=${this._config.title||""}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row two-col">
          <ha-textfield
            label="Hours to show"
            type="number"
            min="1"
            data-key="hours_to_show"
            .value=${this._config.hours_to_show??24}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            label="Refresh interval (s, 0 = off)"
            type="number"
            min="0"
            data-key="refresh_interval"
            .value=${this._config.refresh_interval??60}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>
        <div class="row two-col">
          <ha-textfield
            label="Chart height (px)"
            type="number"
            min="80"
            data-key="chart_height"
            .value=${this._config.chart_height??200}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-formfield label="Show legend">
            <ha-switch
              data-key="show_legend"
              .checked=${!1!==this._config.show_legend}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>

        <h3>Entities / attributes</h3>
        <div class="entities">
          ${(this._config.entities||[]).map((t,e)=>this._renderEntityRow(t,e))}
        </div>
        <ha-button @click=${this._addEntity}>+ Add entity</ha-button>
      </div>
    `:L``}_renderEntityRow(t,e){const i=this._entityAttributes(t.entity),s=this._expanded===e;return L`
      <div class="entity-row">
        <div class="entity-row-header" @click=${()=>this._toggleExpanded(e)}>
          <span class="handle">${e+1}.</span>
          <span class="summary">
            ${t.entity||"(choose entity)"}${t.attribute?` · ${t.attribute}`:""}
          </span>
          <span class="actions">
            <ha-icon-button @click=${t=>{t.stopPropagation(),this._moveEntity(e,-1)}}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${t=>{t.stopPropagation(),this._moveEntity(e,1)}}>
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </ha-icon-button>
            <ha-icon-button @click=${t=>{t.stopPropagation(),this._removeEntity(e)}}>
              <ha-icon icon="mdi:delete"></ha-icon>
            </ha-icon-button>
          </span>
        </div>
        ${s?L`
              <div class="entity-row-body">
                <ha-entity-picker
                  .hass=${this.hass}
                  .value=${t.entity||""}
                  @value-changed=${t=>this._entityChanged(e,{target:{value:t.detail.value}})}
                ></ha-entity-picker>

                <div class="row two-col">
                  ${this._renderSelect("Attribute (empty = main state)",t.attribute||"",t=>this._seriesFieldChanged(e,"attribute",t),[["","(state)"],...i.map(t=>[t,t])])}
                  <ha-textfield
                    label="Name (optional)"
                    .value=${t.name||""}
                    @input=${t=>this._seriesFieldChanged(e,"name",t)}
                  ></ha-textfield>
                </div>

                <div class="row two-col">
                  <ha-textfield
                    label="Color (optional, e.g. #ff9800)"
                    .value=${t.color||""}
                    @input=${t=>this._seriesFieldChanged(e,"color",t)}
                  ></ha-textfield>
                  <ha-textfield
                    label="Unit override (optional)"
                    .value=${t.unit||""}
                    @input=${t=>this._seriesFieldChanged(e,"unit",t)}
                  ></ha-textfield>
                </div>

                <div class="row two-col">
                  ${this._renderSelect("Y axis",t.y_axis||"primary",t=>this._seriesFieldChanged(e,"y_axis",t),[["primary","Primary (left)"],["secondary","Secondary (right)"]])}
                  ${this._renderSelect("Line style",t.line_type||"linear",t=>this._seriesFieldChanged(e,"line_type",t),[["linear","Linear"],["step","Step"]])}
                </div>

                <ha-formfield
                  label="Show raw value (disable automatic scaling, e.g. keep brightness as 0-255)"
                >
                  <ha-switch
                    .checked=${Boolean(t.raw)}
                    @change=${t=>this._seriesFieldChanged(e,"raw",t)}
                  ></ha-switch>
                </ha-formfield>
              </div>
            `:""}
      </div>
    `}static get styles(){return r`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .row {
        display: flex;
        gap: 12px;
      }
      .row > * {
        flex: 1;
      }
      h3 {
        margin: 8px 0 0;
        font-size: 14px;
        color: var(--secondary-text-color);
      }
      .entities {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .entity-row {
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        border-radius: 8px;
        overflow: hidden;
      }
      .entity-row-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        cursor: pointer;
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      }
      .handle {
        color: var(--secondary-text-color);
        font-size: 12px;
      }
      .summary {
        flex: 1;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .actions {
        display: flex;
      }
      .entity-row-body {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px;
      }
      ha-textfield {
        width: 100%;
      }
      .select-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        font-family: inherit;
      }
      .select-label {
        font-size: 12px;
        color: var(--secondary-text-color);
      }
      .select-field select {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 8px;
        border-radius: 4px;
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.5));
        background: var(--card-background-color, var(--primary-background-color, #fff));
        color: var(--primary-text-color);
        font: inherit;
        font-size: 16px;
      }
    `}}),console.info("%c ATTRIBUTE-GRAPH-CARD %c v1.0.0b2 ","color: #fff; background: #039be5; font-weight: 700; border-radius: 3px 0 0 3px;","color: #039be5; background: #fff; font-weight: 700; border-radius: 0 3px 3px 0;");const _t=42;function ft(t,e){if(!t.length)return;let i=0,s=t.length-1;if(e<=t[0].t)return t[0];if(e>=t[s].t)return t[s];for(;i<s;){const n=i+s>>1;t[n].t<e?i=n+1:s=n}const n=t[i],r=t[Math.max(0,i-1)];return Math.abs(n.t-e)<Math.abs(e-r.t)?n:r}customElements.define("attribute-graph-card",class extends rt{constructor(){super(),this._series=[],this._width=600,this._onPointerMove=this._onPointerMove.bind(this),this._onPointerLeave=this._onPointerLeave.bind(this)}static getConfigElement(){return document.createElement("attribute-graph-card-editor")}static getStubConfig(t){const e=t&&Object.keys(t.states).find(t=>t.startsWith("light."));return{type:"custom:attribute-graph-card",title:"Attribute Graph",hours_to_show:24,entities:[{entity:e||"light.living_room",attribute:"brightness",name:"Brightness"}]}}setConfig(t){if(!t)throw new Error("Invalid configuration");const e=t.entities||t.entity?t.entities||[t.entity]:[];if(!Array.isArray(e)||0===e.length)throw new Error("attribute-graph-card: you must define at least one entry in 'entities'");const i=e.map((t,e)=>{const i="string"==typeof t?{entity:t}:{...t};if(!i.entity)throw new Error(`attribute-graph-card: entities[${e}] is missing 'entity'`);return i});this._config={hours_to_show:24,refresh_interval:60,show_legend:!0,chart_height:200,...t,entities:i},this._series=[],this._error=void 0,this._scheduleFetch(0)}set hass(t){const e=this._hass;if(this._hass=t,!this._config)return;let i=!e;for(const s of this._config.entities){const n=e&&e.states[s.entity],r=t.states[s.entity];if(Boolean(n)!==Boolean(r)){i=!0;break}if(n&&r&&n.last_updated!==r.last_updated){i=!0;break}}i&&this._scheduleFetch(),this.requestUpdate()}get hass(){return this._hass}connectedCallback(){super.connectedCallback();const t=this._config&&this._config.refresh_interval;t&&(this._refreshTimer=window.setInterval(()=>this._fetchHistory(),1e3*t)),this._resizeObserver&&this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._refreshTimer&&(window.clearInterval(this._refreshTimer),this._refreshTimer=void 0),this._fetchDebounce&&(window.clearTimeout(this._fetchDebounce),this._fetchDebounce=void 0),this._resizeObserver&&this._resizeObserver.disconnect()}firstUpdated(){this._resizeObserver=new ResizeObserver(()=>this._onResize()),this._resizeObserver.observe(this),this._onResize()}_onResize(){const t=this.getBoundingClientRect(),e=Math.max(Math.round(t.width),100);e!==this._width&&(this._width=e,this.requestUpdate())}_scheduleFetch(t=400){this._fetchDebounce&&window.clearTimeout(this._fetchDebounce),this._fetchDebounce=window.setTimeout(()=>this._fetchHistory(),t)}async _fetchHistory(){if(!this._hass||!this._config)return;const t=[...new Set(this._config.entities.map(t=>t.entity))];if(0===t.length)return;const e=this._config.hours_to_show||24,i=new Date,s=new Date(i.getTime()-60*e*60*1e3),n=new URLSearchParams({filter_entity_id:t.join(","),significant_changes_only:"0",end_time:i.toISOString()});let r;try{r=await this._hass.callApi("GET",`history/period/${s.toISOString()}?${n.toString()}`)}catch(t){return this._error=`Could not load history: ${t&&t.message?t.message:t}`,void this.requestUpdate()}this._error=void 0;const o={};(r||[]).forEach(t=>{t&&t.length&&(o[t[0].entity_id]=t)}),this._rangeStart=s,this._rangeEnd=i,this._series=this._config.entities.map(t=>{const e=o[t.entity]||[],s=function(t){if(t.raw)return{factor:1,offset:0,unit:t.unit||"",decimals:t.decimals};if(t.scale)return{factor:t.scale.factor??1,offset:t.scale.offset??0,unit:t.unit??t.scale.unit??"",decimals:t.decimals??t.scale.decimals};const e=t.attribute?lt[t.attribute]:void 0;return e?{factor:e.factor,offset:e.offset,unit:t.unit??e.unit,decimals:t.decimals??e.decimals}:{factor:1,offset:0,unit:t.unit||"",decimals:t.decimals}}(t),n=[];for(const i of e){const e=ct(i,t);if(void 0===e)continue;const r=new Date(i.last_changed).getTime();n.push({t:r,v:dt(e,s)})}const r=this._hass.states[t.entity];let a;if(r){const e=ct(r,t);void 0!==e&&(a=dt(e,s))}if(void 0===a&&n.length&&(a=n[n.length-1].v),void 0!==a){const t=i.getTime();(!n.length||n[n.length-1].t<t)&&n.push({t:t,v:a})}return{config:t,scale:s,points:n}}),this.requestUpdate()}getCardSize(){return Math.ceil((this._config?.chart_height||200)/50)+(!1!==this._config?.show_legend?1:0)+(this._config?.title?1:0)}_hasSecondaryAxis(){return(this._config.entities||[]).some(t=>"secondary"===t.y_axis)}_axisDomain(t){const e=this._config.y_axis&&this._config.y_axis[t]||{};let i=1/0,s=-1/0;for(const e of this._series){if(("secondary"===e.config.y_axis?"secondary":"primary")===t)for(const t of e.points)t.v<i&&(i=t.v),t.v>s&&(s=t.v)}i===1/0&&(i=0,s=1),void 0!==e.min&&(i=e.min),void 0!==e.max&&(s=e.max),i===s&&(i-=1,s+=1);const n=void 0!==e.min&&void 0!==e.max?0:.08*(s-i);return[i-n,s+n]}_onPointerMove(t){if(!this._rangeStart||!this._series.length)return;const e=t.currentTarget.getBoundingClientRect();if(!e.width)return;const i=this._width,s=this._hasSecondaryAxis()?42:14,n=((t.clientX-e.left)/e.width*i-_t)/(i-_t-s),r=Math.min(1,Math.max(0,n)),o=this._rangeStart.getTime()+r*(this._rangeEnd.getTime()-this._rangeStart.getTime());this._hoverX=_t+r*(i-_t-s),this._hoverPoints=this._series.map(t=>({series:t,point:ft(t.points,o)})),this._hoverTime=o,this._hoverClientY=t.clientY-e.top,this.requestUpdate()}_onPointerLeave(){this._hoverX=void 0,this._hoverPoints=void 0,this.requestUpdate()}_formatTimeTick(t){const e=new Date(t);return(this._config.hours_to_show||24)>30?e.toLocaleDateString(void 0,{month:"short",day:"numeric"}):e.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"})}render(){if(!this._config)return L``;const t=this._config.chart_height||200;return L`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${this._error?L`<div class="error">${this._error}</div>`:this._renderChart(this._width,t)}
          ${!1!==this._config.show_legend&&this._series.length?this._renderLegend():""}
        </div>
      </ha-card>
    `}_renderChart(t,e){if(!this._rangeStart)return L`<div class="loading">Loading…</div>`;const i=this._hasSecondaryAxis(),s=i?42:14,n=Math.max(t-_t-s,10),r=Math.max(e-12-24,10),o={primary:this._axisDomain("primary"),secondary:i?this._axisDomain("secondary"):void 0},a=t=>_t+(t-this._rangeStart.getTime())/(this._rangeEnd.getTime()-this._rangeStart.getTime()||1)*n,l=(t,e)=>{const[i,s]=o[e]||o.primary;return 12+(1-(t-i)/(s-i||1))*r},h=Array.from({length:5},(t,e)=>e/4);return L`
      <div class="chart-wrap">
        <svg
          viewBox="0 0 ${t} ${e}"
          width="100%"
          height="${e}"
          @pointermove=${this._onPointerMove}
          @pointerleave=${this._onPointerLeave}
        >
          ${D`
            <g class="grid">
              ${h.map(t=>{const e=12+t*r,[i,s]=o.primary;return D`
                  <line x1="${_t}" y1="${e}" x2="${_t+n}" y2="${e}" class="grid-line" />
                  <text x="${36}" y="${e}" class="axis-label axis-label-primary">${ut(s-t*(s-i),0)}</text>
                  ${o.secondary?(()=>{const[i,s]=o.secondary;return D`<text x="${_t+n+6}" y="${e}" class="axis-label axis-label-secondary">${ut(s-t*(s-i),0)}</text>`})():""}
                `})}
            </g>
            <g class="x-axis">
              ${[0,.25,.5,.75,1].map(t=>{const i=this._rangeStart.getTime()+t*(this._rangeEnd.getTime()-this._rangeStart.getTime());return D`<text x="${_t+t*n}" y="${e-6}" class="axis-label x-label">${this._formatTimeTick(i)}</text>`})}
            </g>
            <g class="series">
              ${this._series.map((t,e)=>this._renderSeries(t,e,a,l))}
            </g>
            ${void 0!==this._hoverX?D`<line x1="${this._hoverX}" y1="${12}" x2="${this._hoverX}" y2="${12+r}" class="crosshair" />`:""}
          `}
        </svg>
        ${this._hoverPoints?this._renderTooltip():""}
      </div>
    `}_renderSeries(t,e,i,s){const n=t.config.color||at[e%at.length],r="secondary"===t.config.y_axis?"secondary":"primary",o="step"===t.config.line_type;if(!t.points.length)return D``;let a="";return t.points.forEach((e,n)=>{const l=i(e.t),h=s(e.v,r);if(0===n)a+=`M ${l.toFixed(1)} ${h.toFixed(1)}`;else if(o){const e=s(t.points[n-1].v,r);a+=` L ${l.toFixed(1)} ${e.toFixed(1)} L ${l.toFixed(1)} ${h.toFixed(1)}`}else a+=` L ${l.toFixed(1)} ${h.toFixed(1)}`}),D`<path d="${a}" fill="none" stroke="${n}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />`}_renderTooltip(){if(!this._hoverPoints||!this._hoverPoints.length)return"";const t=new Date(this._hoverTime).toLocaleString();return L`
      <div class="tooltip">
        <div class="tooltip-time">${t}</div>
        ${this._hoverPoints.map(({series:t,point:e},i)=>{if(!e)return"";const s=t.config.color||at[i%at.length],n=ut(e.v,t.scale.decimals)+(t.scale.unit?` ${t.scale.unit}`:"");return L`
            <div class="tooltip-row">
              <span class="marker" style="background:${s}"></span>
              <span class="tooltip-name">${pt(t.config,this._hass)}</span>
              <span class="tooltip-value">${n}</span>
            </div>
          `})}
      </div>
    `}_renderLegend(){return L`
      <div class="legend">
        ${this._series.map((t,e)=>{const i=t.config.color||at[e%at.length],s=t.points.length?t.points[t.points.length-1]:void 0,n=s?ut(s.v,t.scale.decimals)+(t.scale.unit?` ${t.scale.unit}`:""):"–";return L`
            <div class="legend-item">
              <span class="marker" style="background:${i}"></span>
              <span class="legend-name">${pt(t.config,this._hass)}</span>
              <span class="legend-value">${n}</span>
            </div>
          `})}
      </div>
    `}static get styles(){return r`
      :host {
        display: block;
        font-family: var(
          --ha-font-family-body,
          var(--paper-font-body1_-_font-family, "Roboto", "Noto Sans", sans-serif)
        );
        color: var(--primary-text-color);
      }
      .card-content {
        padding: 0 16px 16px;
      }
      .loading,
      .error {
        padding: 16px 0;
        color: var(--secondary-text-color);
      }
      .error {
        color: var(--error-color, #db4437);
      }
      .chart-wrap {
        position: relative;
        width: 100%;
      }
      svg {
        display: block;
        overflow: visible;
        touch-action: pan-y;
      }
      .grid-line {
        stroke: var(--divider-color, rgba(127, 127, 127, 0.2));
        stroke-width: 1;
        shape-rendering: crispEdges;
      }
      .axis-label {
        fill: var(--secondary-text-color);
        font-size: 10px;
        font-family: var(
          --ha-font-family-body,
          var(--paper-font-body1_-_font-family, "Roboto", "Noto Sans", sans-serif)
        );
        dominant-baseline: middle;
      }
      .axis-label-primary {
        text-anchor: end;
      }
      .axis-label-secondary {
        text-anchor: start;
      }
      .x-label {
        text-anchor: middle;
        dominant-baseline: auto;
      }
      .crosshair {
        stroke: var(--secondary-text-color);
        stroke-width: 1;
        stroke-dasharray: 3 3;
        pointer-events: none;
      }
      .legend {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 16px;
        margin-top: 12px;
        font-size: 13px;
        color: var(--primary-text-color);
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .legend-value {
        color: var(--secondary-text-color);
      }
      .marker {
        width: 12px;
        height: 3px;
        border-radius: 1.5px;
        flex: none;
      }
      .tooltip {
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 12px;
        box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0, 0, 0, 0.2));
        pointer-events: none;
        max-width: 220px;
      }
      .tooltip-time {
        font-weight: 500;
        margin-bottom: 4px;
        color: var(--primary-text-color);
      }
      .tooltip-row {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--primary-text-color);
      }
      .tooltip-name {
        flex: 1;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"attribute-graph-card",name:"Attribute Graph Card",description:"Graph any entity attribute (brightness, lux, …) over time, styled like the native history card.",preview:!0,documentationURL:"https://github.com/jan-tdy/ha-attribute-graph"});
