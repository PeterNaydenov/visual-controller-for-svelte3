!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e="undefined"!=typeof globalThis?globalThis:e||self).visualControllerForSvelte=n()}(this,(function(){"use strict";function e(e){let o,r=!1;return e?(o=function(e){let o=e.map((e=>n())),r=o.map((e=>e.promise));return o.promises=r,o.onComplete=t(Promise.all(r)),o}(e),r=!0):o=n(),o.timeout=function(e,n){let o;return o=e?Promise.all(n.promises):n.promise,function(e,r){let i,s=new Promise(((n,t)=>{i=setTimeout((()=>{n(r),Promise.resolve(o)}),e)}));return o.then((()=>clearTimeout(i))),n.onComplete=t(Promise.race([o,s])),n}}(r,o),o}function n(){let e,n;const o=new Promise(((t,o)=>{e=t,n=o}));return{promise:o,done:e,cancel:n,onComplete:t(o)}}function t(e){return function(n){e.then((e=>n(e)))}}e.sequence=function(n,...t){const o=e(),r=[],i=function*(e){for(const n of e)yield n}(n);return function e(n,...t){n.done?o.done(r):n.value(...t).then((n=>{r.push(n),e(i.next(),...t,n)}))}(i.next(),...t),o},e.all=function(n,...t){const o=e(),r=[],i=n.map(((e,n)=>"function"==typeof e?e(...t).then((e=>r[n]=e)):e.then((e=>r[n]=e))));return Promise.all(i).then((()=>o.done(r))),o};return class{constructor(e={}){const n={};return{publish:this.publish(e,n),destroy:this.destroy(n),getApp:this.getApp(n),has:e=>!!n[e]}}publish(n,t){return function(o,r,i){const s=this.has(i),u=e();if(!o)return console.error("Error: Component is undefined"),u.done(!1),u.promise;s&&this.destroy(i);let l=document.getElementById(i),p=!1;if(!l)return console.error(`Can't find node with id: "${i}"`),u.done(!1),u.promise;""!==l.innerHTML.trim()&&(l.innerHTML="");let c=new o({target:l,props:{dependencies:n,setupUpdates:e=>p=e,...r}});return t[i]=c,t[i].updates=p||{},u.done(t[i].updates),u.promise}}destroy(e){return function(n){if(e[n]){return(0,e[n].$destroy)(),delete e[n],!0}return!1}}getApp(e){return function(n){const t=e[n];return t?t.updates:(console.error(`App with id: "${n}" was not found.`),!1)}}}}));
