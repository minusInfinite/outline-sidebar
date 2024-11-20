var X=Object.defineProperty;var f=(e,t)=>{for(var n in t)X(e,n,{get:t[n],enumerable:!0})};var m=e=>{throw new Error("Not initialized yet")},A=typeof window>"u"&&typeof globalThis.WebSocketPair>"u";typeof Deno>"u"&&(self.Deno={args:[],build:{arch:"x86_64"},env:{get(){}}});var w=new Map,T=0;A&&(globalThis.syscall=async(e,...t)=>await new Promise((n,o)=>{T++,w.set(T,{resolve:n,reject:o}),m({type:"sys",id:T,name:e,args:t})}));function E(e,t,n){A&&(m=n,self.addEventListener("message",o=>{(async()=>{let i=o.data;switch(i.type){case"inv":{let a=e[i.name];if(!a)throw new Error(`Function not loaded: ${i.name}`);try{let s=await Promise.resolve(a(...i.args||[]));m({type:"invr",id:i.id,result:s})}catch(s){console.error("An exception was thrown as a result of invoking function",i.name,"error:",s.message),m({type:"invr",id:i.id,error:s.message})}}break;case"sysr":{let a=i.id,s=w.get(a);if(!s)throw Error("Invalid request id");w.delete(a),i.error?s.reject(new Error(i.error)):s.resolve(i.result)}break}})().catch(console.error)}),m({type:"manifest",manifest:t}))}function j(e){let t=atob(e),n=t.length,o=new Uint8Array(n);for(let i=0;i<n;i++)o[i]=t.charCodeAt(i);return o}function F(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let t="",n=e.byteLength;for(let o=0;o<n;o++)t+=String.fromCharCode(e[o]);return btoa(t)}async function q(e,t){if(typeof e!="string"){let n=new Uint8Array(await e.arrayBuffer()),o=n.length>0?F(n):void 0;t={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:o},e=e.url}return syscall("sandboxFetch.fetch",e,t)}globalThis.nativeFetch=globalThis.fetch;function Y(){globalThis.fetch=async function(e,t){let n=t&&t.body?F(new Uint8Array(await new Response(t.body).arrayBuffer())):void 0,o=await q(e,t&&{method:t.method,headers:t.headers,base64Body:n});return new Response(o.base64Body?j(o.base64Body):null,{status:o.status,headers:o.headers})}}A&&Y();var l={};f(l,{confirm:()=>ve,copyToClipboard:()=>Le,deleteLine:()=>Re,dispatch:()=>xe,downloadFile:()=>ce,filterBox:()=>ue,flashNotification:()=>de,fold:()=>Ae,foldAll:()=>ke,getCurrentPage:()=>$,getCursor:()=>V,getSelection:()=>_,getText:()=>Q,getUiOption:()=>Te,goHistory:()=>ae,hidePanel:()=>fe,insertAtCursor:()=>he,insertAtPos:()=>me,moveCursor:()=>ye,moveCursorToLine:()=>Pe,navigate:()=>J,newWindow:()=>se,openCommandPalette:()=>te,openPageNavigator:()=>ee,openSearchPanel:()=>Oe,openUrl:()=>ie,prompt:()=>be,redo:()=>Fe,reloadConfigAndCommands:()=>oe,reloadPage:()=>re,reloadUI:()=>ne,replaceRange:()=>ge,save:()=>G,setSelection:()=>z,setText:()=>Z,setUiOption:()=>we,showPanel:()=>pe,toggleFold:()=>Ce,undo:()=>Ee,unfold:()=>Se,unfoldAll:()=>Me,uploadFile:()=>le,vimEx:()=>Ie});typeof self>"u"&&(self={syscall:()=>{throw new Error("Not implemented here")}});function r(e,...t){return globalThis.syscall(e,...t)}function $(){return r("editor.getCurrentPage")}function Q(){return r("editor.getText")}function Z(e,t=!1){return r("editor.setText",e,t)}function V(){return r("editor.getCursor")}function _(){return r("editor.getSelection")}function z(e,t){return r("editor.setSelection",e,t)}function G(){return r("editor.save")}function J(e,t=!1,n=!1){return r("editor.navigate",e,t,n)}function ee(e="page"){return r("editor.openPageNavigator",e)}function te(){return r("editor.openCommandPalette")}function re(){return r("editor.reloadPage")}function ne(){return r("editor.reloadUI")}function oe(){return r("editor.reloadConfigAndCommands")}function ie(e,t=!1){return r("editor.openUrl",e,t)}function se(){return r("editor.newWindow")}function ae(e){return r("editor.goHistory",e)}function ce(e,t){return r("editor.downloadFile",e,t)}function le(e,t){return r("editor.uploadFile",e,t)}function de(e,t="info"){return r("editor.flashNotification",e,t)}function ue(e,t,n="",o=""){return r("editor.filterBox",e,t,n,o)}function pe(e,t,n,o=""){return r("editor.showPanel",e,t,n,o)}function fe(e){return r("editor.hidePanel",e)}function me(e,t){return r("editor.insertAtPos",e,t)}function ge(e,t,n){return r("editor.replaceRange",e,t,n)}function ye(e,t=!1){return r("editor.moveCursor",e,t)}function Pe(e,t=1,n=!1){return r("editor.moveCursorToLine",e,t,n)}function he(e){return r("editor.insertAtCursor",e)}function xe(e){return r("editor.dispatch",e)}function be(e,t=""){return r("editor.prompt",e,t)}function ve(e){return r("editor.confirm",e)}function Te(e){return r("editor.getUiOption",e)}function we(e,t){return r("editor.setUiOption",e,t)}function Ae(){return r("editor.fold")}function Se(){return r("editor.unfold")}function Ce(){return r("editor.toggleFold")}function ke(){return r("editor.foldAll")}function Me(){return r("editor.unfoldAll")}function Ee(){return r("editor.undo")}function Fe(){return r("editor.redo")}function Oe(){return r("editor.openSearchPanel")}function Le(e){return r("editor.copyToClipboard",e)}function Re(){return r("editor.deleteLine")}function Ie(e){return r("editor.vimEx",e)}var P={};f(P,{parseMarkdown:()=>Be,renderParseTree:()=>Ue});function Be(e){return r("markdown.parseMarkdown",e)}function Ue(e){return r("markdown.renderParseTree",e)}var h={};f(h,{applyAttributeExtractors:()=>je,getEnv:()=>Qe,getMode:()=>Ze,getSpaceConfig:()=>qe,getVersion:()=>Ve,invokeCommand:()=>De,invokeFunction:()=>Ne,invokeSpaceFunction:()=>Xe,listCommands:()=>He,listSyscalls:()=>Ke,reloadConfig:()=>$e,reloadPlugs:()=>Ye});function Ne(e,...t){return r("system.invokeFunction",e,...t)}function De(e,t){return r("system.invokeCommand",e,t)}function He(){return r("system.listCommands")}function Ke(){return r("system.listSyscalls")}function Xe(e,...t){return r("system.invokeSpaceFunction",e,...t)}function je(e,t,n){return r("system.applyAttributeExtractors",e,t,n)}async function qe(e,t){return await r("system.getSpaceConfig",e)??t}function Ye(){return r("system.reloadPlugs")}function $e(){return r("system.reloadConfig")}function Qe(){return r("system.getEnv")}function Ze(){return r("system.getMode")}function Ve(){return r("system.getVersion")}var g={};f(g,{del:()=>Ge,get:()=>ze,set:()=>_e});function _e(e,t){return r("clientStore.set",e,t)}function ze(e){return r("clientStore.get",e)}function Ge(e){return r("clientStore.delete",e)}var x={};f(x,{readAsset:()=>it});function ot(e){let t=atob(e),n=t.length,o=new Uint8Array(n);for(let i=0;i<n;i++)o[i]=t.charCodeAt(i);return o}function O(e){let t=e.split(",",2)[1];return ot(t)}async function it(e,t,n="utf8"){let o=await r("asset.readAsset",e,t);switch(n){case"utf8":return new TextDecoder().decode(O(o));case"dataurl":return o}}function S(e,t){if(t(e))return[e];let n=[];if(e.children)for(let o of e.children)n=[...n,...S(o,t)];return n}function y(e,t){return S(e,n=>n.type===t)[0]}function L(e,t){S(e,t)}function b(e){if(!e)return"";let t=[];if(e.text!==void 0)return e.text;for(let n of e.children)t.push(b(n));return t.join("")}function C(e){if(e.type?.endsWith("Mark")||e.type?.endsWith("Delimiter"))return"";let t=n=>n.map(C).join("");switch(e.type){case"Document":case"Emphasis":case"Highlight":case"Strikethrough":case"InlineCode":case"StrongEmphasis":case"Superscript":case"Subscript":case"Paragraph":case"ATXHeading1":case"ATXHeading2":case"ATXHeading3":case"ATXHeading4":case"ATXHeading5":case"ATXHeading6":case"Blockquote":case"BulletList":case"OrderedList":case"ListItem":case"Table":case"TableHeader":case"TableCell":case"TableRow":case"Task":case"HTMLTag":return t(e.children);case"FencedCode":case"CodeBlock":return e.children=e.children.filter(n=>n.type),t(e.children);case"Link":{let n=e.children.slice(1,-4);return t(n)}case"Image":{let n=y(e,"WikiLinkAlias")||e.children[1],o=n&&n.type!=="LinkMark"?b(n):"<Image>",i=/\d*[^\|\s]*?[xX]\d*[^\|\s]*/.exec(o);return i&&(o=o.replace(i[0],"").replace("|","")),o}case"WikiLink":{let n=y(e,"WikiLinkAlias"),o;return n?o=n.children[0].text:o=y(e,"WikiLinkPage").children[0].text.split("/").pop(),o}case"NakedURL":return e.children[0].text;case"CommandLink":{let n=y(e,"CommandLinkAlias"),o;return n?o=n.children[0].text:o=e.children[1].children[0].text,o}case"TaskState":return e.children[1].text;case"Escape":return e.children[0].text.slice(1);case"CodeText":case"Entity":return e.children[0].text;case"TemplateDirective":case"DeadlineDate":return b(e);case"CodeInfo":case"CommentBlock":case"FrontMatter":case"Hashtag":case"HardBreak":case"HorizontalRule":case"NamedAnchor":case"Attribute":return"";case void 0:return e.text;default:return console.log("Unknown tree type: ",e.type),""}}var R="outline-sidebar",I="enableOutlineSidebar";async function B(){return!!await g.get(I)}async function U(e){return await g.set(I,e)}async function k(){await l.hidePanel("rhs"),await U(!1)}async function W(){await B()?await k():await v()}async function N(){try{if(await h.getEnv()==="server")return;if(await B())return await v()}catch(e){console.error(`${R}: showOSBIfEnabled failed`,e)}}async function v(){let e={},[t]=await Promise.all([x.readAsset(R,"assets/outline-sidebar.js")]),n=await l.getCurrentPage(),o=await l.getText(),i=await P.parseMarkdown(o),a=[];if(L(i,c=>c.type?.startsWith("ATXHeading")?(a.push({name:c.children.slice(1).map(C).join("").trim(),pos:c.from,level:+c.type[c.type.length-1]}),!0):!1),a.length===0)return null;let s="",d=0;a.map((c,M,K)=>{let u=c.level;if(M===0)s+="<ul>";else if(u>d)for(let p=0;p<u-d;++p)s+="<ul>";else if(u<d)for(let p=0;p<d-u;++p)s+="</ul>";s+=`
            <li><span class="p wiki-link osb-clickable" data-osbpos="${c.pos}">${c.name}</span><li>`,M===K.length-1&&(s+="</ul>"),d=u}),await l.showPanel("rhs",.5,`
        <link rel="stylesheet" href="/.client/main.css" />
        <div id="outline-sidebar-root">
            ${s}
        </div>
        `,`
        ${t}
        `),await U(!0)}var D={showOutlineSidebar:v,hideOutlineSidebar:k,showOSBIfEnabled:N,toggle:W},H={name:"outline-sidebar",assets:{"assets/outline-sidebar.js":{data:"data:application/javascript;base64,ew0KICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIltkYXRhLW9zYi1wb3NdIikuZm9yRWFjaCgoZWwpID0+IHsNCiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCBhc3luYyAoZSkgPT4gew0KICAgICAgICAgICAgYXdhaXQgc3lzY2FsbCgiZWRpdG9yLm1vdmVDdXJzb3IiLCBlbC5kYXRhc2V0Lm9zYnBvc3QpDQogICAgICAgIH0pDQogICAgfSkNCn0=",mtime:1732111771537}},functions:{showOutlineSidebar:{path:"./outline-sidebar.ts:showOutlineSidebar"},hideOutlineSidebar:{path:"./outline-sidebar.ts:hideOutlineSidebar"},showOSBIfEnabled:{path:"./outline-sidebar.ts:showOSBIfEnabled",evnets:["editor:init","editor:pageLoaded","editor:pageSaved"]},toggle:{path:"./outline-sidebar.ts:toggleOutlineSidebar",command:{name:"Outline Sidebar: Toggle",key:"Ctrl-alt-o",mac:"Cmd-alt-o"}}}},_t={manifest:H,functionMapping:D};E(D,H,self.postMessage);export{_t as plug};
