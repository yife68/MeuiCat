if(!self.define){let e,t={};const o=(o,i)=>(o=new URL(o+".js",i).href,t[o]||new Promise((t=>{if("document"in self){const e=document.createElement("script");e.src=o,e.onload=t,document.head.appendChild(e)}else e=o,importScripts(o),t()})).then((()=>{let e=t[o];if(!e)throw new Error(`Module ${o} didn’t register its module`);return e})));self.define=(i,r)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(t[n])return;let s={};const u=e=>o(e,n),l={module:{uri:n},exports:s,require:u};t[n]=Promise.all(i.map((e=>l[e]||u(e)))).then((e=>(r(...e),s)))}}define(["./workbox-24d5432a"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"ca90c51a36b38f8244b2958d5537d0a9"},{url:"/",revision:"index-20240317112252759"},{url:"about/",revision:"about-20240317112252759"}],{})}));
//# sourceMappingURL=service-worker.js.map
