let ai_timeoutId,lastSayHello="",scrollSelfInfoContentYear="",CACHE_EXPIRATION_TIME=432e5,percentFlag=!1,ai_first_time=!0,ai_request=!1;const postai={aibox:'<div class="dialogue-box">\n            <div class="mssage-title">\n                <div class="title-text">MeuiCat Ai</div>\n                <div class="dialogue-info">\n\t\t\t\t\t<i class="iconfont icat-full-screen" onclick="postai.screen()"></i>\n\t\t\t\t\t<i class="iconfont icat-mini-screen" onclick="postai.screen()"></i>\n                    <i class="iconfont icat-close" onclick="postai.no()"></i>\n                </div>\n            </div>\n            <div id="mssage-box"></div>\n            <div class="message-input">\n                <textarea id="text-input" type="text" placeholder="请输入聊天内容" maxlength="2000"></textarea>\n                <div class="launch-icon">\n                    <i class="iconfont icat-more"></i>\n                </div>\n                <div class="send-icon">\n                    <i class="iconfont icat-send"></i>\n                </div>\n            </div>\n            <div class="message-powered">Powered By LinkAi</div>\n        </div>',register(){document.querySelector("#dialogue").addEventListener("click",(function(t){if(t.target.classList.contains("icat-copy-paste")){var e=t.target.closest(".text-your").querySelector(".message-text").innerText,n=document.createElement("textarea");n.value=e,document.body.appendChild(n),n.select(),document.execCommand("copy"),document.body.removeChild(n),btf.snackbarShow("复制成功！内容为Ai生成，仅供参考。")}})),document.querySelector(".launch-icon").addEventListener("click",(function(){const t=document.querySelector(".message-input");t&&t.classList.toggle("show")})),document.querySelector(".send-icon").addEventListener("click",(function(){ai_request||postai.send()})),document.querySelector("#text-input").addEventListener("input",(function(){clearTimeout(ai_timeoutId),ai_timeoutId=setTimeout((function(){postai.textarea_content()}),300)})),document.getElementById("text-input").addEventListener("keydown",(function(t){if(13===t.keyCode&&!t.shiftKey){if(ai_request)return t.preventDefault();t.preventDefault(),postai.send()}}))},init(){const t=document.querySelector("#dialogue"),e=document.querySelector("#Fun-menu");if(t){if("flex"===window.getComputedStyle(t).display)return;return t.style.display="flex",void e.classList.toggle("show")}let n=document.createElement("div"),o=document.querySelector("body");if(n.id="dialogue",o.appendChild(n),n.innerHTML=postai.aibox,n.style.display="flex",e.classList.toggle("show"),postai.register(),ai_first_time){const t=postai.displayMessage("message-bot");postai.updateMessage(t,"你好，我是 Link，你可以问我任何问题，我会尽力回答。")}},no(){const t=document.querySelector("#dialogue");document.querySelector("#dialogue.hidden")&&t.classList.remove("hidden"),t.style.display="none",document.querySelector("#Fun-menu").classList.toggle("show")},screen(){document.querySelector("#dialogue").classList.toggle("hidden")},textarea_content(){const t=document.querySelector(".message-input");t.querySelector("textarea").value.length>0?t.classList.add("visible"):t.classList.remove("visible")},async send(){const t=document.getElementById("text-input"),e=t.value.trim();if(!e)return;ai_request=!0,document.querySelector(".message-input").classList.remove("visible"),postai.displayMessage("message-me",e),t.value="";const n=postai.displayMessage("message-bot");try{const t=await fetch("https://api.link-ai.tech/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer Link_pAW0OTc5rN8GltHGi8qPvKBVtjeOjKyq3du3HLRXqD","Content-Type":"application/json"},body:JSON.stringify({app_code:"pNEwqBRR",messages:[{role:"user",content:e}],model:"gpt-3.5-turbo"})});if(t.ok){const e=await t.json();postai.updateMessage(n,e.choices[0].message.content)}else postai.updateMessage(n,"无法连接到服务器，请检查服务 API 是否正常。")}catch(t){postai.updateMessage(n,t)}},displayMessage(t,e){const n=document.createElement("div"),o=document.getElementById("mssage-box");return n.classList.add(t),n.innerHTML="message-me"===t?`\n\t\t\t\t<div class="text-your">\n\t\t\t\t\t<div class="message-text">${e}</div>\n\t\t\t\t</div>\n\t\t\t`:'\n\t\t\t\t<div class="img-icon">\n\t\t\t\t\t<div class="rings">\n\t\t\t\t\t\t<span></span>\n\t\t\t\t\t\t<span></span>\n\t\t\t\t\t\t<span></span>\n\t\t\t\t\t\t<span></span>\n\t\t\t\t\t\t<span></span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="text-your">\n\t\t\t\t\t<div class="bot-loader">\n\t\t\t\t\t\t<div class="jimu-primary-loading"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t',o.appendChild(n),o.scrollTop=o.scrollHeight,n},updateMessage(t,e){t.querySelector(".bot-loader").remove();let n=t.querySelector(".message-text");n||(n=document.createElement("div"),n.classList.add("message-text"),t.querySelector(".text-your").appendChild(n)),postai.typeWriterEffect(n,e)},typeWriterEffect(t,e){const n='<span class="blinking-cursor"></span>';t.innerHTML=n;let o=0;!function a(){if(o<e.length)t.innerHTML=e.slice(0,o+1)+n,o++,setTimeout(a,50);else{if(t.innerHTML=e,ai_request=!1,postai.textarea_content(),ai_first_time)return ai_first_time=!1;const n=t.closest(".text-your");n&&(n.innerHTML+='\n\t\t\t\t\t\t<div class="mssage-info">\n\t\t\t\t\t\t\t<span class="tips">以上内容为 AI 生成，不代表开发者立场，请勿删除或修改本标记</span>\n\t\t\t\t\t\t\t<i class="iconfont icat-copy-paste"></i>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t')}}()}},CACHE_POST_COVER="post_cover",meuicat={toPage:function(){var t=document.querySelectorAll(".page-number"),e=parseInt(t[t.length-1].innerHTML),n=document.getElementById("toPageText"),o=parseInt(n.value);if(!isNaN(o)&&o>0&&"0"!==(""+o)[0]&&o<=e){var a=1==o?"/":"/page/"+o+"/#content-inner";document.getElementById("toPageButton").href=a}},listenToPageInputPress(){var t=document.getElementById("toPageText"),e=document.getElementById("toPageButton");t&&(t.addEventListener("keydown",(t=>{13===t.keyCode&&(meuicat.toPage(),pjax.loadUrl(e.href))})),t.addEventListener("input",(function(){""===t.value||"0"===t.value?e.classList.remove("haveValue"):e.classList.add("haveValue");var n=document.querySelectorAll(".page-number"),o=+n[n.length-1].innerHTML;+document.getElementById("toPageText").value>o&&(t.value=o)})))},photos:function(t){let e="https://memos.meuicat.com";fetch(t?`${e}/api/v1/memo?creatorId=1&tag=${t}`:`${e}/api/v1/memo?creatorId=1&tag=2023`).then((t=>t.json())).then((t=>{let n="",o=[];t.forEach((t=>{let n=t.content.match(/\!\[.*?\]\(.*?\)/g);n&&(o=o.concat(n)),t.resourceList.length&&t.resourceList.forEach((t=>{t.externalLink?o.push(`![](${t.externalLink})`):o.push(`![](${e}/o/r/${t.id}/${t.publicId}/${t.filename})`)}))})),o&&o.forEach((t=>{let e,o,a=t.replace(/!\[.*?\]\((.*?)\)/g,"$1"),i=t.replace(/!\[(.*?)\]\(.*?\)/g,"$1");-1!=i.indexOf(" ")?(e=i.split(" ")[0],o=i.split(" ")[1]):o=i,n+=`<div class="gallery-photo"><a href="${a}" data-fancybox="gallery" class="fancybox" data-thumb="${a}"><img class="no-lazyload photo-img" loading='lazy' decoding="async" src="${a}"></a>`,o&&(n+=`<span class="photo-title">${o}</span>`),e&&(n+=`<span class="photo-time">${e}</span>`),n+="</div>"})),document.querySelector(".gallery-photos.page").innerHTML=n,imgStatus.watch(".photo-img",(()=>{waterfall(".gallery-photos"),meuicat.percent()})),window.Lately&&Lately.init({target:".photo-time"})})).catch();var n=document.querySelectorAll(".status-bar-item");n[1].classList.add("selected"),Array.from(n).forEach((function(t){t.onclick=function(e){var n=document.querySelectorAll(".status-bar-item.selected");return Array.from(n).forEach((function(t){t.classList.remove("selected")})),t.classList.add("selected"),e.stopPropagation(),e.preventDefault(),!1}}))},waterfall:function(){document.getElementById("waterfall")&&setTimeout((()=>{waterfall("#waterfall")}),500)},timeDiff:(t,e)=>{const n=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate())-n;return Math.floor(o/864e5)},changeTime:function(){const t=Array.from(document.getElementsByTagName("time")),e=new Date;t.forEach((t=>{const n=t.getAttribute("datetime"),o=new Date(n),a=meuicat.timeDiff(o,e);let i;i=0===a?"最近":1===a?"昨天":2===a?"前天":a<=7?`${a}天前`:o.getFullYear()!==e.getFullYear()?`${o.getFullYear()}/${o.getMonth()+1}/${o.getDate()}`:`${o.getMonth()+1}/${o.getDate()}`,t.textContent=i}))},reflashWaterFall:function(){document.querySelector("#waterfall")&&setTimeout((function(){meuicat.waterfall(),document.getElementById("waterfall").classList.add("show")}),300)},commentText:function(t){const e=["#wl-edit",".el-textarea__inner"];for(let n=0;n<e.length;n++){let o=document.querySelector(e[n]);null!=o&&(o.dispatchEvent(new Event("input",{bubble:!0,cancelable:!0})),o.value="> "+t.replace(/\n/g,"\n> ")+"\n\n",o.focus(),o.setSelectionRange(-1,-1))}const n=document.querySelector("#comment-tips");n&&(n.classList.add("show"),setTimeout((function(){n.classList.remove("show")}),3e3))},initEssay:function(){if(document.querySelector("#essay-mini")){new Swiper(".swiper-container",{direction:"vertical",loop:!0,autoplay:{delay:3e3,pauseOnMouseEnter:!0}})}},tagsBarActive:function(){var t=decodeURIComponent(window.location.pathname).match(/\/(tags|categories)\/.*?\//),e=document.querySelector("#category-bar");if(t&&e){var n=t[0].split("/")[2];document.getElementById(n).classList.add("select")}},statusbar:function(t){const e=document.getElementById(t);if(e){const n="category-bar-items"===t?"category-bar-button":"status-bar-button",o=document.getElementById(n),a=e.scrollWidth-e.clientWidth;e.scrollLeft+e.clientWidth>=a-8?e.scrollTo({left:0,behavior:"smooth"}):e.scrollBy({left:e.clientWidth,behavior:"smooth"}),e.addEventListener("scroll",(function(){o.style.transform=e.scrollLeft+e.clientWidth>=a-8?"rotate(180deg)":""}),{once:!0})}},logInfo:function(){console.log(`Welcome to:\n%cMeuiCat V3.8.0:%c https://meuicat.com/update/%c\nThis site has been running stably for %c${Math.round(((new Date).getTime()-new Date("2021/10/15 01:32:00").getTime())/864e5)} %c days`,"border:1px #888 solid;border-right:0;border-radius:5px 0 0 5px;padding: 5px 10px;color:white;background:#0084FF;margin:10px 0","border:1px #888 solid;border-left:0;border-radius:0 5px 5px 0;padding: 5px 10px;","","color:#0084FF","")},Weixin:function(){/MicroMessenger/i.test(navigator.userAgent)?window.location.href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzkxNzEyNjYxMw==#wechat_redirect":window.open("/wechatOA/")},wowbox:function(t,e){if(!e)return t.classList.add("wow"),t.classList.add("animate__fadeIn"),t.setAttribute("data-wow-duration",""),t.setAttribute("data-wow-delay",""),t.setAttribute("data-wow-offset",""),void t.setAttribute("data-wow-iteration","");t.classList.add("wow"),t.classList.add("animate__fadeIn"),t.setAttribute("data-wow-duration","1s"),t.setAttribute("data-wow-delay","200ms"),t.setAttribute("data-wow-offset","100"),t.setAttribute("data-wow-iteration","1")},wowanimation:function(){let t=document.querySelector(".essay-mini"),e=document.querySelector(".random-list"),n=document.querySelectorAll(".recent-post-item"),o=document.querySelectorAll(".card-widget");if(t&&meuicat.wowbox(t),e&&meuicat.wowbox(e),n)for(var a=0;a<n.length;a++)meuicat.wowbox(n[a]);if(o)for(a=0;a<o.length;a++)meuicat.wowbox(o[a],!1);wow=new WOW({boxClass:"wow",animateClass:"animation-slide-in",offset:0,mobile:!0,live:!0}),wow.init()},homeplatform:function(){fetch("https://cdn.meuicat.com/gh/yife/platform.json").then((t=>t.json())).then((t=>{document.querySelectorAll("#icat-platform").forEach((e=>{const n=e.parentNode.querySelector(".article-title").getAttribute("href");if(t[n]){let o="";for(const e in t[n]){let a="";switch(e){case"wechat":a="wechat",platformtitle="微信公众号";break;case"jianshu":a="jianshu",platformtitle="简书";break;case"zhihu":a="zhihu",platformtitle="知乎";break;case"juejin":a="juejin",platformtitle="稀土掘金";break;case"yixiaofeng":a="yixiaofeng",platformtitle="开发者博客"}o+=`<a class="${a}" title="该文章已在${platformtitle}中同步更新" href="${t[n][e]}" target="_blank"><i class="iconfont icat-${a}"></i></a>`}e.innerHTML=`<span>本文同步至：</span><div class="platform-box">${o}</div>`}else e.innerHTML='<span title="该文章在博客首发" onclick="pjax.loadUrl(\'/subscribe/\')">博客独享</span>'}))}))},postplatform:function(){fetch("https://cdn.meuicat.com/gh/yife/platform.json").then((t=>t.json())).then((t=>{document.querySelectorAll("#icat-meta-platform").forEach((e=>{const n=window.location.pathname;if(t[n]){let o=[];for(const e in t[n]){let a="",i="",s="";switch(e){case"wechat":a="wechat",i="微信公众号",s="亦小封";break;case"jianshu":a="jianshu",i="简书",s="亦小封";break;case"zhihu":a="zhihu",i="知乎",s="亦封";break;case"juejin":a="juejin",i="稀土掘金",s="亦封";break;case"yixiaofeng":a="yixiaofeng",i="开发者博客",s="亦小封"}o.push(`<a class="${a}" title="ID：${s}" href="${t[n][e]}" target="_blank"><i class="iconfont icat-${a}"></i>${i}</a>`)}if(o.length>0){const t=2===o.length?"&nbsp;、":"，",n=o.join(t);e.innerHTML=`本文将与${n}进行同步更新`}else e.innerHTML='<span title="查看更多更新和订阅细则" onclick="pjax.loadUrl(\'/subscribe/\')">本文由博客首发、独享</span>'}else e.innerHTML='<span title="查看更多更新和订阅细则" onclick="pjax.loadUrl(\'/subscribe/\')">本文由博客首发、独享</span>'}))}))},addScript(t,e,n){if(document.getElementById(t))return n?n():void 0;let o=document.createElement("script");o.src=e,o.id=t,n&&(o.onload=n),document.head.appendChild(o)},getIpInfo:function(){fetch("https://api.qjqq.cn/api/Local").then((t=>t.json())).then((t=>{var e=t.ip,n=t.data.country,o=t.data.prov,a=t.data.city,i=t.data.district,s=t.data.radius,c=Math.floor(s),r=t.data.isp;document.getElementById("userAgentIp").innerHTML=e,document.getElementById("userAgentCountry").innerHTML=n,document.getElementById("userAgentProv").innerHTML=o,document.getElementById("userAgentCity").innerHTML=a,document.getElementById("userAgentDistrict").innerHTML=i,document.getElementById("userAgentRadius").innerHTML=c+"公里",document.getElementById("userAgentISP").innerHTML=r;var l=(new UAParser).getResult();document.getElementById("userAgentOS").innerHTML=l.os.name+" "+l.os.version,document.getElementById("userAgentBrowser").innerHTML=l.browser.name+" "+l.browser.version}))},postai:function(){const t=window.location.pathname;fetch("https://cdn.meuicat.com/gh/yife/abstract.json").then((t=>t.json())).then((e=>{if(t in e){const n=document.createElement("div");n.id="post-ai",n.innerHTML='\n\t\t\t\t<div class="ai-title">\n\t\t\t\t  <a class="ai-title-left" href="/blog/42#Ai文章摘要" title="查看部署" data-pjax-state="">\n\t\t\t\t\t<i class="iconfont icat-Ai-Summary"></i>\n\t\t\t\t\t<div class="ai-title-text">文章摘要</div>\n\t\t\t\t  </a>\n\t\t\t\t  <div class="ai-tag">iCatGPT</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="ai-explanation" style="display: block;">\n\t\t\t\t  加载中...<span class="blinking-cursor"></span>\n\t\t\t\t</div>\n\t\t\t  ';const o=document.querySelector("#post #article-container");o.insertBefore(n,o.firstChild);const a=document.querySelector(".ai-explanation"),i=e[t],s=i.length;let c=0,r=document.querySelector(".blinking-cursor");const l=Math.floor(3*Math.random())+1;setTimeout((()=>{a.innerHTML="",a.appendChild(r);const t=setInterval((()=>{r.parentNode.removeChild(r),a.innerHTML+=i[c],a.appendChild(r),c++,c===s&&(clearInterval(t),r.parentNode.removeChild(r))}),90)}),1e3*l)}})).catch((t=>console.error(t)))},all_tags:function(){document.querySelectorAll("#aside-content .card-tag-cloud").forEach((function(t){t.classList.add("all-tags")}));var t=document.getElementById("more-tags-btn");t&&t.parentNode.removeChild(t)},TagsRandom:function(t){return Math.floor(Math.random()*t)},Tagscolor:function(){const t=document.querySelectorAll("#aside-content .card-tag-cloud a"),e=[];for(;e.length<5;){const n=meuicat.TagsRandom(t.length);e.includes(n)||(e.push(n),t[n].style.color="var(--icat-blue)")}},Introduction:function(){const t=["🤖️ 数码科技爱好者","🔍 分享与热心帮助","🏠 智能家居小能手","🔨 设计开发一条龙","📷 人文摄影的坚定者","🏃 脚踏实地行动派","📚 热爱阅读的书虫迷","🎵 薛之谦八年热爱粉","🏋️‍♀️ 坚韧不拔的健身达人","🍜 走哪吃哪的美食迷","🎮 Minecraft骨灰级玩家","👨‍🍳 一位爱做饭的程序猿"],e=document.getElementById("Introduction");let n=t[Math.floor(Math.random()*t.length)];for(;n===lastSayHello;)n=t[Math.floor(Math.random()*t.length)];e.textContent=n,lastSayHello=n},runtimen:function(){let t=new Date("2021/10/15 00:00:00").getTime(),e=(new Date).getTime(),n=(Math.round((e-t)/1e3)/7884e4).toFixed(2),o=document.getElementById("run-time");o&&(o.innerHTML=`已稳定运行 ${n} 坤年 🏀`),setTimeout(meuicat.runtime,1e3)},fiftyonela:function(){fetch("https://v6-widget.51.la/v6/K05NsEfoZbXF1Nxt/quote.js").then((t=>t.text())).then((t=>{let e=["今日人数","今日访问","昨日人数","昨日访问","本月访问"],n=t.match(/(<\/span><span>).*?(\/span><\/p>)/g);n=n.map((t=>t.replace(/(<\/span><span>)/g,"").replace(/(<\/span><\/p>)/g,"")));let o=document.getElementById("statistic"),a=n[0],i=document.querySelector(".T-box");i&&(i.innerHTML="最近活跃："+a+"&ensp;|&ensp;"+i.innerHTML);for(let t=0;t<n.length;t++){if(!o)return;0!=t&&t!=n.length-1&&(o.innerHTML+='<div><span class="tips">'+e[t-1]+"</span><span id="+e[t-1]+">"+n[t]+"</span></div>")}}))},owoBig:function(){let t=document.getElementById("owo-big");t&&t.parentNode.removeChild(t);let e=1,n="",o=document.createElement("div"),a=document.querySelector("body");o.id="owo-big",a.appendChild(o),new MutationObserver((t=>{for(let i=0;i<t.length;i++){let s=t[i].addedNodes,c="";2==s.length&&"OwO-body"==s[1].className&&(c=s[1],document.body.clientWidth<=768&&c.addEventListener("contextmenu",(t=>t.preventDefault())),c.onmouseover=t=>{e&&"IMG"==t.target.tagName&&(e=0,n=setTimeout((()=>{let e=3*t.target.clientHeight,n=3*t.target.clientWidth,i=t.x-t.offsetX-(n-t.target.clientWidth)/2,s=t.y-t.offsetY;i+n>a.clientWidth&&(i-=i+n-a.clientWidth+10),i<0&&(i=10),o.style.cssText=`display:flex; height:${e}px; width:${n}px; left:${i}px; top:${s}px;`,o.innerHTML=`<img src="${t.target.src}">`}),300))},c.onmouseout=()=>{o.style.display="none",e=1,clearTimeout(n)})}})).observe(document.getElementById("post-comment"),{subtree:!0,childList:!0})},copyToClipboard:function(t){const e=document.createElement("textarea");e.value=t,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e)},ArticleContent:function(){const t=document.querySelector("#article-container");if(!t)return"未能成功获取到内容，请稍后重试！";const e=t.cloneNode(!0),n=e.querySelectorAll(".aplayer, .toggle, .gallery, .highlight"),o=e.querySelector("#post-ai");n.forEach((t=>t.remove())),o&&o.remove();const a=e.innerText.trim().replace(/\n+/g,"\n\n");return console.log("本篇文章内容为：\n\n"+a),meuicat.copyToClipboard(a),"已复制本篇内容~"},swiper(){var t=new Swiper("#RollBox",{passiveListeners:!0,loop:!0,autoplay:{disableOnInteraction:!0,delay:5e3},mousewheel:!0,pagination:{el:".swiper-pagination",clickable:!0}}),e=document.getElementById("Sticky-Posts");null!==e&&(e.onmouseenter=()=>{t.autoplay.stop()},e.onmouseleave=()=>{t.autoplay.start()})},getRandomElementsFromArray:function(t,e){const n=t.length,o=new Set;for(;o.size<e;){const e=Math.floor(Math.random()*n);o.add(t[e])}return Array.from(o)},renderingPosts:function(t){const e=meuicat.getRandomElementsFromArray(t,4).map((t=>`\n\t\t<div class="post_item">\n\t\t\t<a class="post_box" title="${t.title}" href="javascript:void(0)" rel="external nofollow noreferrer" onclick="pjax.loadUrl('${t.link}')">\n\t\t\t\t<div class="post-info">\n\t\t\t\t\t<p class="post-title">\n\t\t\t\t\t\t${t.title}\n\t\t\t\t\t</p>\n\t\t\t\t\t<div class="info-box">\n\t\t\t\t\t\t<span>${t.time}</span>\n\t\t\t\t\t\t<span style="margin: 0 6px">|</span>\n\t\t\t\t\t\t<span>${t.categories}</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<p class="post_description">\n\t\t\t\t\t${t.description}\n\t\t\t\t</p>\n\t\t\t</a>\n\t\t</div>`)).join("");document.querySelector(".banner-random>.random-list").innerHTML=e},RandomPosts:function(){var t=sessionStorage.getItem("postsInfo"),e=sessionStorage.getItem("postsInfoTimestamp");t&&e&&Date.now()-e<CACHE_EXPIRATION_TIME?meuicat.renderingPosts(JSON.parse(t)):fetch("/articles-random.json").then((t=>t.json())).then((t=>{sessionStorage.setItem("postsInfo",JSON.stringify(t)),sessionStorage.setItem("postsInfoTimestamp",Date.now()),meuicat.renderingPosts(t)}))},RandomBar:function(t){const e=document.querySelector(".random-list");"prev"===t?e.scrollLeft-=210:"next"===t&&(e.scrollLeft+=210)},MemorialDayDate:function(){var t=new Date,e=("0"+(t.getMonth()+1)).slice(-2),n=("0"+t.getDate()).slice(-2);return["0707","0909","0918","1109","1213"].includes(e+n)},MemorialDay:function(){if(meuicat.MemorialDayDate()){var t=document.documentElement;t.style.filter="grayscale(100%)",t.style.webkitFilter="grayscale(100%)",t.style.MozFilter="grayscale(100%)",t.style.msFilter="grayscale(100%)",t.style.OFilter="grayscale(100%)"}},post_cover:function(){document.documentElement.style.setProperty("--icat-post-bg","var(--icat-blue)");const t=document.querySelector(".icat-post-cover img");if(!t)return void console.error("未找到封面图像src");const e=t.getAttribute("src"),n=JSON.parse(localStorage.getItem("post_cover"))||{};!n[e]||n[e].expiration<Date.now()?meuicat.im2color(e):(document.documentElement.style.setProperty("--icat-post-bg",n[e].color),t.style.setProperty("opacity",".9","important"))},im2color:function(t){const e="https://img2color.meuicat.com/api?img="+encodeURIComponent(t);fetch(e).then((t=>t.json())).then((e=>{const n=e.RGB;document.documentElement.style.setProperty("--icat-post-bg",n);const o=Date.now()+CACHE_EXPIRATION_TIME,a=JSON.parse(localStorage.getItem("post_cover"))||{};a[t]={color:n,expiration:o},localStorage.setItem("post_cover",JSON.stringify(a));const i=document.querySelector(".icat-post-cover img");i&&i.style.setProperty("opacity",".9","important")})).catch((t=>{console.error("获取颜色时出错：",t)}))},percent:function(){percentFlag||(window.requestAnimationFrame((()=>{let t=document.documentElement.scrollTop||window.pageYOffset,e=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight)-document.documentElement.clientHeight,n=Math.round(t/e*100),o=document.querySelector(".scroll-percent"),a=document.querySelector("#page-header"),i=document.querySelector("#rightside"),s=window.scrollY+document.documentElement.clientHeight;"undefined"===n&&(i.style.cssText="opacity: ''; transform: ''"),(document.getElementById("post-comment")||document.getElementById("footer")).offsetTop<s||n>95?document.querySelector("#go-up").classList.remove("show-percent"):(document.querySelector("#go-up").classList.add("show-percent"),n>=0&&(a.classList.add("nav-fixed"),i.style.cssText="opacity: 0.8; transform: translateX(-58px)",o.innerHTML=n+""),0===n&&(a.classList.remove("nav-fixed","nav-visible"),i.style.cssText="opacity: ''; transform: ''")),percentFlag=!1})),percentFlag=!0)},scrollTo:function(t){const e=document.getElementById(t);if(e){const t=e.getBoundingClientRect().top+window.pageYOffset-80,n=window.pageYOffset,o=t-n;let a=null;window.requestAnimationFrame((function t(e){a||(a=e);const i=e-a,s=(c=Math.min(i/0,1))<.5?2*c*c:(4-2*c)*c-1;var c;window.scrollTo(0,n+o*s),i<600&&window.requestAnimationFrame(t)}))}},toggleInfo:function(t,e){var n=document.querySelector(t),o=document.querySelector(e);n&&n.classList.toggle("show"),o&&o.classList.toggle("show")},toggleinit:function(){$(".rss-plan-mail").on("click",(function(){meuicat.toggleInfo(".submit-box","#follow")})),$(".social-btn").on("click",(function(){meuicat.toggleInfo(".card-info-social-icons",".social-btn")})),$(".banner-btn").on("click",(function(){meuicat.toggleInfo(".banner-bg",".banner-btn")}))},pwa_init(){window.location.href.includes("http://localhost")||"serviceWorker"in navigator&&(navigator.serviceWorker.register("/service-worker.js").then((t=>{t.waiting?meuicat.notifyUserReady():t.installing?meuicat.trackInstalling(t.installing):t.addEventListener("updatefound",(()=>{meuicat.trackInstalling(t.installing)}))})).catch((t=>{console.error("Service Worker registration failed:",t)})),navigator.serviceWorker.addEventListener("controllerchange",(()=>{meuicat.notifyUserReady(!0)})))},trackInstalling(t){t.addEventListener("statechange",(()=>{"installed"===t.state&&navigator.serviceWorker.controller&&meuicat.notifyUserReady(!0)}))},notifyUserReady(t){btf.snackbarShow("PWA 已就绪！",!1,3e3),t&&location.reload(!0)}};let article;const comment={fetchData(t,n,o){fetch("https://twikoo.meuicat.com/",{method:"POST",body:JSON.stringify({event:"GET_RECENT_COMMENTS",accessToken:"091e76c30b8bb8bc672808816ceb87e2",includeReply:!0,...t}),headers:{"Content-Type":"application/json"}}).then((t=>t.json())).then((t=>{let a="",i=t.data;if("total"!==n){if(o)switch(n){case"visitor":i=i.filter((t=>t.mailMd5===o));break;case"v-shield":i=i.filter((t=>t.mailMd5!==o));break;case"a-shield":i=i.filter((t=>t.url!==o))}i.forEach((t=>{const o=new Date(t.created),i=`${o.getFullYear().toString().slice(-2)}-${o.getMonth()+1}-${o.getDate()} ${o.getHours()}:${o.getMinutes()}:${o.getSeconds()}`;a+=`<div class="comment-card">\n                <div class="comment-info">\n                    <img src="${t.avatar}" class="nolazyload">\n                    <div class="comment-information">\n                        <span class="${["亦封","亦小封"].includes(t.nick)?"comment-author":""} comment-user" data-mailMd5="${t.mailMd5}">${t.nick}</span>\n                        <span class="comment-time">${i}</span>\n                    </div>\n                </div>\n                <div class="comment-content">${t.commentText.replaceAll("<","&lt;").replaceAll(">","&gt;")}</div>\n                <div class="comment-more">\n                    <div class="comment-title">\n                        <span class="comment-link" title="查看此文章" onclick="pjax.loadUrl('${t.url}')">\n                            <i class="iconfont icat-read"></i>\n                            ${article[t.url]}\n                        </span>\n                        <a onclick="pjax.loadUrl('${t.url}#${t.id}')">查看评论</a>\n                    </div>\n                    <div class="comment-tool">`;let s='<a href="javascript:void(0)" rel="external nofollow noreferrer" onclick="comment.article(event)" title="显示此文章所有评论">查看更多</a>',c='<a href="javascript:void(0)" rel="external nofollow noreferrer" onclick="comment.article(event, true)" title="不显示此文章的评论">屏蔽文章</a>',r='<a href="javascript:void(0)" rel="external nofollow noreferrer" onclick="comment.visitor(event, true)" title="不显示该访客的评论">屏蔽Ta</a>',l='<a href="javascript:void(0)" rel="external nofollow noreferrer" onclick="comment.visitor(event)" title="显示该访客的所有评论">查看Ta更多评论</a>';switch(e='<a href="javascript:void(0)" rel="external nofollow noreferrer" onclick="comment.data()" title="查看本站最新评论">返回评论</a>',n){case"article":a+=e+r+l;break;case"visitor":a+=e+s+c;break;case"v-shield":case"a-shield":a+=s+c+r+l+e;break;default:n||(a+=s+c+r+l)}a+="</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>"})),document.getElementById("comments-page").innerHTML=a}else{document.querySelectorAll(".length-num.comment-total, .N_comments").forEach((t=>{t.classList.contains("N_comments")?t.innerText=i.length+"条评论":t.innerText=i.length}))}}))},visitor(t,e){const n=t.target.closest(".comment-card").querySelector(".comment-user").getAttribute("data-mailMd5");e?this.fetchData({pageSize:-1},"v-shield",n):this.fetchData({pageSize:-1},"visitor",n)},article(t,e){const n=t.target.closest(".comment-card").querySelector(".comment-link").getAttribute("onclick").match(/'(\/.*?)'/)[1];e?this.fetchData({pageSize:-1},"a-shield",n):this.fetchData({urls:[n]},"article")},data(){article||fetch("/article.json").then((t=>t.json())).then((t=>{article=t})),this.fetchData({pageSize:100})}};