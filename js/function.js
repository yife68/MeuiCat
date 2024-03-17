let lastSayHello = "",
	scrollSelfInfoContentYear = "",
	CACHE_EXPIRATION_TIME = 12 * 60 * 60 * 1000,
	percentFlag = false;

const CACHE_POST_COVER = 'post_cover';
var resizeTimer = null,
	meuicat = {
	comments: function() {
		fetch('/article.json')
		.then(res => res.json())
		.then(articleData => {
			const urls = Object.keys(articleData);
		
			fetch('https://twikoo.meuicat.com/', {
			method: "POST",
			body: JSON.stringify({ event: "GET_RECENT_COMMENTS", accessToken: "091e76c30b8bb8bc672808816ceb87e2", includeReply: true, pageSize: -1 }),
			headers: { 'Content-Type': 'application/json' }
			})
			.then(res => res.json())
			.then(({ data }) => {
				const totalComments = data.length;
				const commentElements = document.querySelectorAll('.length-num.icat-pc-comment, .length-num.icat-pe-comment, .N_comments');
				commentElements.forEach(element => {
					if (element.classList.contains('N_comments')) {
						element.innerText = totalComments + '条评论';
					} else {
						element.innerText = totalComments;
					}
				});
				console.log('本站Twikoo总评论数:', totalComments);
			});
		});
	}, // 总评论数量
    toPage: function() {
        console.log("执行跳转");
        var e = document.querySelectorAll(".page-number")
            , t = parseInt(e[e.length - 1].innerHTML)
            , n = document.getElementById("toPageText")
            , a = parseInt(n.value);
        if (!isNaN(a) && a > 0 && "0" !== ("" + a)[0] && a <= t) {
            var s = 1 == a ? "/" : "/page/" + a + "/#content-inner";
            document.getElementById("toPageButton").href = s
        }
    },
    listenToPageInputPress() {
        var e = document.getElementById("toPageText")
            , t = document.getElementById("toPageButton");
        e && (e.addEventListener("keydown", (e=>{
            13 === e.keyCode && (meuicat.toPage(),
            pjax.loadUrl(t.href))
        }
        )),
        e.addEventListener("input", (function() {
            "" === e.value || "0" === e.value ? t.classList.remove("haveValue") : t.classList.add("haveValue");
            var n = document.querySelectorAll(".page-number")
                , a = +n[n.length - 1].innerHTML;
            +document.getElementById("toPageText").value > a && (e.value = a)
        }
        )))
    }, // 自定页数跳转
    photos: function (tag) {
        let url = 'https://memos.meuicat.com' // 修改api
        let apiUrl = tag ? `${url}/api/v1/memo?creatorId=1&tag=${tag}` : `${url}/api/v1/memo?creatorId=1&tag=2023`;
      
        fetch(apiUrl).then(res => res.json()).then(data => {
            let html = '',
                imgs = []
            data.forEach(item => {
                let ls = item.content.match(/\!\[.*?\]\(.*?\)/g)
                if (ls) imgs = imgs.concat(ls)
                if (item.resourceList.length) {
                    item.resourceList.forEach(t => {
                        if (t.externalLink) imgs.push(`![](${t.externalLink})`)
                        else imgs.push(`![](${url}/o/r/${t.id}/${t.publicId}/${t.filename})`)
                    })
                }
            })
    
            if (imgs) imgs.forEach(item => {
                let img = item.replace(/!\[.*?\]\((.*?)\)/g, '$1'),
                    time, title, tat = item.replace(/!\[(.*?)\]\(.*?\)/g, '$1')
                if (tat.indexOf(' ') != -1) {
                    time = tat.split(' ')[0]
                    title = tat.split(' ')[1]
                } else title = tat
    
                html += `<div class="gallery-photo"><a href="${img}" data-fancybox="gallery" class="fancybox" data-thumb="${img}"><img class="no-lazyload photo-img" loading='lazy' decoding="async" src="${img}"></a>`
                title ? html += `<span class="photo-title">${title}</span>` : ''
                time ? html += `<span class="photo-time">${time}</span>` : ''
                html += `</div>`
            })
    
            document.querySelector('.gallery-photos.page').innerHTML = html
            imgStatus.watch('.photo-img', () => { waterfall('.gallery-photos'), meuicat.percent(); })
            window.Lately && Lately.init({ target: '.photo-time' })
        }).catch()

		var statusBarItemItems = document.querySelectorAll('.status-bar-item');
		let firstElement = statusBarItemItems[1];
		firstElement.classList.add('selected');
	
		Array.from(statusBarItemItems).forEach(function (element) {
			element.onclick = function (event) {
				var selectedElements = document.querySelectorAll('.status-bar-item.selected');
				Array.from(selectedElements).forEach(function (selectedElement) {
					selectedElement.classList.remove('selected');
				});
				element.classList.add('selected');
	
				event.stopPropagation();
				event.preventDefault();
				return false;
			};
        });
    }, // 相册页处理逻辑
	timeDiff: (timeObj, today) => {
		const timeObjUTC = Date.UTC(timeObj.getFullYear(), timeObj.getMonth(), timeObj.getDate());
		const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
	
		const timeDiff = todayUTC - timeObjUTC;
		return Math.floor(timeDiff / (1000 * 3600 * 24));
	},	
	changeTime: function() {
		const timeElements = Array.from(document.getElementsByTagName("time"));
		const currentDate = new Date();
	
		timeElements.forEach(timeElement => {
			const datetime = timeElement.getAttribute("datetime");
			const timeObj = new Date(datetime);
			const daysDiff = meuicat.timeDiff(timeObj, currentDate);
	
			let timeString;
			if (daysDiff === 0) {
				timeString = `最近`;
			} else if (daysDiff === 1) {
				timeString = `昨天`;
			} else if (daysDiff === 2) {
				timeString = `前天`;
			} else if (daysDiff <= 7) {
				timeString = `${daysDiff}天前`;
			} else {
				if (timeObj.getFullYear() !== currentDate.getFullYear()) {
					timeString = `${timeObj.getFullYear()}/${timeObj.getMonth() + 1}/${timeObj.getDate()}`;
				} else {
					timeString = `${timeObj.getMonth() + 1}/${timeObj.getDate()}`;
				}
			}
			timeElement.textContent = timeString;
		});
	},
	reflashWaterFall: function() {
		document.querySelector("#waterfall") &&
			setTimeout(function() {
				waterfall("#waterfall");
				document.getElementById("waterfall")
					.classList.add("show");
			}, 500);
	}, // 加载显示 - 即刻短文
	commentText: function (txt) {
		const inputs = ["#wl-edit", ".el-textarea__inner"];
		for (let i = 0; i < inputs.length; i++) {
			let el = document.querySelector(inputs[i]);
			if (el != null) {
				el.dispatchEvent(new Event('input', { bubble: true, cancelable: true }));
				el.value = '> ' + txt.replace(/\n/g, '\n> ') + '\n\n';
				el.focus();
				el.setSelectionRange(-1, -1);
			}
		}
		
		const commentTips = document.querySelector("#comment-tips");
		if (commentTips) {
			commentTips.classList.add("show");
			setTimeout(function() {
				commentTips.classList.remove("show");
			}, 3000);
		}
	}, // 引用评论跳转 - 即刻短文
	initEssay: function () {
		if (document.querySelector('#essay-mini')) {
            let swiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                loop: true,
                autoplay: {
                    delay: 3000,
                    pauseOnMouseEnter: true
                },
            });
        }
    }, // Swiper轮播 - 即刻mini
    tagsBarActive: function() {
        var urlinfo = decodeURIComponent(window.location.pathname);
        var pattern = /\/(tags|categories)\/.*?\//;
        var match = urlinfo.match(pattern);
        var categoryBar = document.querySelector('#category-bar');
    
        if (match && categoryBar) {
            var nowTag = match[0].split("/")[2];
            document.getElementById(nowTag)
                .classList.add("select");
        }
    }, //分类标签条
    statusbar: function(elementId) {
        const container = document.getElementById(elementId);
      
        if (container) {
          const buttonId = (elementId === "category-bar-items") ? "category-bar-button" : "status-bar-button";
          const button = document.getElementById(buttonId);
          const maxScroll = container.scrollWidth - container.clientWidth;
      
          if (container.scrollLeft + container.clientWidth >= maxScroll - 8) {
            container.scrollTo({
              left: 0,
              behavior: "smooth"
            });
          } else {
            container.scrollBy({
              left: container.clientWidth,
              behavior: "smooth"
            });
          }
      
          container.addEventListener("scroll", function() {
            button.style.transform = (container.scrollLeft + container.clientWidth >= maxScroll - 8) ? "rotate(180deg)" : "";
          }, { once: true });
        }
    }, // bar翻动
	logInfo: function() {
		console.log(`Welcome to:\n%cMeuiCat V3.3.1:%c https://meuicat.com/update/%c\nThis site has been running stably for %c${Math.round(((new Date).getTime()-new Date("2021/10/15 01:32:00").getTime())/864e5)} %c days`, "border:1px #888 solid;border-right:0;border-radius:5px 0 0 5px;padding: 5px 10px;color:white;background:#0084FF;margin:10px 0", "border:1px #888 solid;border-left:0;border-radius:0 5px 5px 0;padding: 5px 10px;", "", "color:#0084FF", "")
	}, // 控制台信息
	Weixin: function() {
		const isWeixin = /MicroMessenger/i.test(navigator.userAgent); // 判断是否为微信内置浏览器
	
		if (isWeixin) {
			window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzkxNzEyNjYxMw==#wechat_redirect';
		} else {
			window.open('/wechatOA/');
		}
	}, // 公众号跳转
	wowanimation: function() {
		wow = new WOW({ boxClass: "wow", animateClass: "animation-slide-in", offset: 0, mobile: !0, live: !0 }), wow.init();
	}, // wow pjax及动画属性
	homeplatform: function() {
		fetch('https://cdn.meuicat.com/gh/yife/platform.json')
			.then(response => response.json())
			.then(data => {
				const platformBoxes = document.querySelectorAll('#icat-platform');
				platformBoxes.forEach(box => {
					const link = box.parentNode.querySelector('.article-title')
						.getAttribute('href');
					if (data[link]) {
						let platforms = '';
						for (const key in data[link]) {
							let platformClass = '';
							switch (key) {
								case 'wechat':
									platformClass = 'wechat';
									platformtitle = '微信公众号';
									break;
								case 'jianshu':
									platformClass = 'jianshu';
									platformtitle = '简书';
									break;
								case 'zhihu':
									platformClass = 'zhihu';
									platformtitle = '知乎';
									break;
								case 'juejin':
									platformClass = 'juejin';
									platformtitle = '稀土掘金';
									break;
								case 'yixiaofeng':
									platformClass = 'yixiaofeng';
									platformtitle = '开发者博客';
									break;
								default:
									break;
							}
							platforms += `<a class="${platformClass}" title="该文章已在${platformtitle}中同步更新" href="${data[link][key]}" target="_blank"><i class="iconfont icat-${platformClass}"></i></a>`;
						}
						box.innerHTML = `<span>本文同步至：</span><div class="platform-box">${platforms}</div>`;
					} else {
						box.innerHTML = '<span title="该文章在博客首发" onclick="pjax.loadUrl(\'/subscribe/\')">博客独享</span>';
					}
				});
			});
	},
	postplatform: function() {
		fetch('https://cdn.meuicat.com/gh/yife/platform.json')
			.then(response => response.json())
			.then(data => {
				const platformBoxes = document.querySelectorAll('#icat-meta-platform');
				platformBoxes.forEach(box => {
					const link = window.location.pathname;
					if (data[link]) {
						let platforms = [];
						for (const key in data[link]) {
							let platformClass = '';
							let platformtitle = '';
							let platformid = '';
							switch (key) {
								case 'wechat':
									platformClass = 'wechat';
									platformtitle = '微信公众号';
									platformid = '亦小封';
									break;
								case 'jianshu':
									platformClass = 'jianshu';
									platformtitle = '简书';
									platformid = '亦小封';
									break;
								case 'zhihu':
									platformClass = 'zhihu';
									platformtitle = '知乎';
									platformid = '亦封';
									break;
								case 'juejin':
									platformClass = 'juejin';
									platformtitle = '稀土掘金';
									platformid = '亦封';
									break;
								case 'yixiaofeng':
									platformClass = 'yixiaofeng';
									platformtitle = '开发者博客';
									platformid = '亦小封';
									break;
								default:
									break;
							}
							platforms.push(`<a class="${platformClass}" title="ID：${platformid}" href="${data[link][key]}" target="_blank"><i class="iconfont icat-${platformClass}"></i>${platformtitle}</a>`);
						}
						if (platforms.length > 0) {
							const separator = platforms.length === 2 ? '&nbsp;、' : '，';
							const platformList = platforms.join(separator);
							box.innerHTML = `本文将与${platformList}进行同步更新`;
						} else {
							box.innerHTML = '<span title="查看更多更新和订阅细则" onclick="pjax.loadUrl(\'/subscribe/\')">本文由博客首发、独享</span>';
						}
					} else {
						box.innerHTML = '<span title="查看更多更新和订阅细则" onclick="pjax.loadUrl(\'/subscribe/\')">本文由博客首发、独享</span>';
					}
				});
			});
	}, // 多平台标识
	addScript(e, t, n) {
		if (document.getElementById(e)) return n ? n() : void 0;
		let a = document.createElement("script");
		a.src = t, a.id = e, n && (a.onload = n), document.head.appendChild(a)
	}, // script加载
	getIpInfo: function () {
		var fetchUrl = "https://api.qjqq.cn/api/Local"
		fetch(fetchUrl)
			.then(res => res.json())
			.then(json => {
				var ip = json.ip;
				var country = json.data.country;
				var prov = json.data.prov;
				var city = json.data.city;
				var district = json.data.district;
				var precise_radius = json.data.radius;
				var radius = Math.floor(precise_radius);
				var isp = json.data.isp;
				document.getElementById("userAgentIp")
					.innerHTML = ip;
				document.getElementById("userAgentCountry")
					.innerHTML = country;
				document.getElementById("userAgentProv")
					.innerHTML = prov;
				document.getElementById("userAgentCity")
					.innerHTML = city;
				document.getElementById("userAgentDistrict")
					.innerHTML = district;
				document.getElementById("userAgentRadius")
					.innerHTML = radius + '公里';
				document.getElementById("userAgentISP")
					.innerHTML = isp;

				// 使用ua-parser-js解析User-Agent
				var parser = new UAParser();
				var result = parser.getResult();
				document.getElementById("userAgentOS")
					.innerHTML = result.os.name + " " + result.os.version;
				document.getElementById("userAgentBrowser")
					.innerHTML = result.browser.name + " " + result.browser.version;
			})
	}, // 获取ip信息
	postai: function () {
		// 获取当前页面链接
		const currentUrl = window.location.pathname;
	  
		// 获取文章摘要JSON数据
		fetch('https://cdn.meuicat.com/gh/yife/abstract.json')
		  .then(response => response.json())
		  .then(data => {
			// 如果当前页面链接在JSON数据中存在
			if (currentUrl in data) {
			  // 创建文章摘要元素
			  const postAi = document.createElement('div');
			  postAi.id = 'post-ai';
			  postAi.innerHTML = `
				<div class="ai-title">
				  <a class="ai-title-left" href="/blog/42#Ai文章摘要" title="查看部署" data-pjax-state="">
					<i class="iconfont icat-Ai-Summary"></i>
					<div class="ai-title-text">文章摘要</div>
				  </a>
				  <div class="ai-tag">iCatGPT</div>
				</div>
				<div class="ai-explanation" style="display: block;">
				  加载中...<span class="blinking-cursor"></span>
				</div>
			  `;
			  // 将文章摘要元素插入到#post #article-container的最上方
			  const articleContainer = document.querySelector('#post #article-container');
			  articleContainer.insertBefore(postAi, articleContainer.firstChild);
			  // 将JSON数据中对应的内容放入文章摘要元素中
			  const aiExplanation = document.querySelector('.ai-explanation');
			  const content = data[currentUrl];
			  const contentLength = content.length;
			  let i = 0;
			  let cursor = document.querySelector('.blinking-cursor');
			  // 随机等待1-3秒后开始打字机效果
			  const waitTime = Math.floor(Math.random() * 3) + 1;
			  setTimeout(() => {
				// 清空aiExplanation的内容
				aiExplanation.innerHTML = '';
				// 添加光标元素
				aiExplanation.appendChild(cursor);
				const typing = setInterval(() => {
				  // 移动光标元素到新添加的字符后面
				  cursor.parentNode.removeChild(cursor);
				  aiExplanation.innerHTML += content[i];
				  aiExplanation.appendChild(cursor);
				  i++;
				  if (i === contentLength) {
					clearInterval(typing);
					// 移除光标元素
					cursor.parentNode.removeChild(cursor);
				  }
				}, 90);
			  }, waitTime * 1000);
			}
		  })
		  .catch(error => console.error(error));
	}, // 文章Ai摘要
	all_tags: function () {
		document.querySelectorAll("#aside-content .card-tag-cloud")
			.forEach((function(e) {
				e.classList.add("all-tags")
			}));
		var e = document.getElementById("more-tags-btn");
		e && e.parentNode.removeChild(e)
	}, // 侧边栏标签展开
	TagsRandom: function (max) {
		return Math.floor(Math.random() * max);
	},
	Tagscolor: function () {
		const tagLinks = document.querySelectorAll('#aside-content .card-tag-cloud a');
	
		const selectedLinks = [];
		while (selectedLinks.length < 5) {
			const randomIndex = meuicat.TagsRandom(tagLinks.length);
			if (!selectedLinks.includes(randomIndex)) {
				selectedLinks.push(randomIndex);
				tagLinks[randomIndex].style.color = 'var(--icat-blue)';
			}
		}
	}, // 随机标签颜色
	Introduction: function() {
		const e = [
				"🤖️ 数码科技爱好者",
				"🔍 分享与热心帮助",
				"🏠 智能家居小能手",
				"🔨 设计开发一条龙",
				"📷 人文摄影的坚定者",
				"🏃 脚踏实地行动派",
				"📚 热爱阅读的书虫迷",
				"🎵 薛之谦八年热爱粉",
				"🏋️‍♀️ 坚韧不拔的健身达人",
				"🍜 走哪吃哪的美食迷",
				"🎮 Minecraft骨灰级玩家",
				"👨‍🍳 一位爱做饭的程序猿",
			],
			t = document.getElementById("Introduction");
		let o = e[Math.floor(Math.random() * e.length)];
		for (; o === lastSayHello;) o = e[Math.floor(Math.random() * e.length)];
		(t.textContent = o), (lastSayHello = o);
	}, // about 个人介绍词
	runtimen: function() {
		let t = new Date("2021/10/15 00:00:00")
			.getTime(),
			n = new Date()
			.getTime(),
			a = Math.round((n - t) / 1e3),
			l = (a / 7884e4)
			.toFixed(2);
		let c = document.getElementById("run-time");
		c && (c.innerHTML = `已稳定运行 ${l} 坤年 🏀`),
			setTimeout(meuicat.runtime, 1e3);
	}, // about 运行时间
	fiftyonela: function() {
		fetch('https://v6-widget.51.la/v6/K05NsEfoZbXF1Nxt/quote.js')
			.then(res => res.text())
			.then((data) => {
				let title = ['今日人数', '今日访问', '昨日人数', '昨日访问', '本月访问']
				let num = data.match(/(<\/span><span>).*?(\/span><\/p>)/g)
	
				num = num.map((el) => {
					let val = el.replace(/(<\/span><span>)/g, '')
					let str = val.replace(/(<\/span><\/p>)/g, '')
					return str
				})
	
				let statisticEl = document.getElementById('statistic')
				let activeVisitors = num[0]
	
				// 添加最近活跃访客的内容
				let TBoxEl = document.querySelector('.T-box')
				if (TBoxEl) {
					TBoxEl.innerHTML = '最近活跃：' + activeVisitors + '&ensp;|&ensp;' + TBoxEl.innerHTML
				}
	
				// 自定义不显示哪个或者显示哪个，如下不显示总访问量
				for (let i = 0; i < num.length; i++) {
					if (!statisticEl) return
					if (i == 0 || i == num.length - 1) continue;
					statisticEl.innerHTML += '<div><span class="tips">' + title[i - 1] + '</span><span id=' + title[i - 1] + '>' + num[i] + '</span></div>'
				}
			});
	}, // about 51la统计显示
	owoBig: function() {
		let flag = 1,
			owo_time = '',
			m = 3;
		let div = document.createElement('div'),
			body = document.querySelector('body');
		div.id = 'owo-big';
		body.appendChild(div)

		// 构造observer
		let observer = new MutationObserver(mutations => {

			for (let i = 0; i < mutations.length; i++) {
				let dom = mutations[i].addedNodes,
					owo_body = '';
				if (dom.length == 2 && dom[1].className == 'OwO-body') owo_body = dom[1];
				// 如果需要在评论内容中启用此功能请解除下面的注释
				// else if (dom.length == 1 && dom[0].className == 'tk-comment') owo_body = dom[0];
				else continue;
				
				// 禁用右键（手机端长按会出现右键菜单，为了体验给禁用掉）
				if (document.body.clientWidth <= 768) owo_body.addEventListener('contextmenu', e => e.preventDefault());
				owo_body.onmouseover = (e) => {
						if (flag && e.target.tagName == 'IMG') {
							flag = 0;
							// 移入300毫秒后显示盒子
							owo_time = setTimeout(() => {
								let height = e.target.clientHeight * m,
									width = e.target.clientWidth * m,
									left = (e.x - e.offsetX) - (width - e.target.clientWidth) / 2,
									top = e.y - e.offsetY;

								if ((left + width) > body.clientWidth) left -= ((left + width) - body.clientWidth + 10);
								if (left < 0) left = 10;
								div.style.cssText = `display:flex; height:${height}px; width:${width}px; left:${left}px; top:${top}px;`;
								div.innerHTML = `<img src="${e.target.src}">`
							}, 300);
						}
					};
				owo_body.onmouseout = () => { div.style.display = 'none', flag = 1, clearTimeout(owo_time); }
			}
		})
		observer.observe(document.getElementById('post-comment'), { subtree: true, childList: true }) // 监听的 元素 和 配置项
	}, // Twikoo表情预览放大
	copyToClipboard: function(text) {
		const tempTextArea = document.createElement("textarea");
		tempTextArea.value = text;
	
		document.body.appendChild(tempTextArea);
		tempTextArea.select();
		document.execCommand("copy");
		document.body.removeChild(tempTextArea);
	},
	ArticleContent: function() {
		const articleElement = document.querySelector('#article-container');
		if (!articleElement) {
			return "未能成功获取到内容，请稍后重试！";
		}
		const articleContent = articleElement.cloneNode(true);
		const aplayerElements = articleContent.querySelectorAll('.aplayer, .toggle, .gallery, .highlight');
		const postAiElement = articleContent.querySelector('#post-ai');
		aplayerElements.forEach(element => element.remove());
		if (postAiElement) {
			postAiElement.remove();
		}
		const articleContents = articleContent.innerText.trim()
			.replace(/\n+/g, '\n\n');
		console.log(`本篇文章内容为：\n\n` + articleContents);
		meuicat.copyToClipboard(articleContents);
		return "已复制本篇内容~";
	}, // 文章内容提取
	swiper() {
		var e = new Swiper("#RollBox", {
				passiveListeners: !0,
				loop: !0,
				autoplay: {
					disableOnInteraction: !0,
					delay: 5e3
				},
				mousewheel: !0,
				pagination: {
					el: ".swiper-pagination",
					clickable: !0
				},
			}),
			t = document.getElementById("Sticky-Posts");
		null !== t &&
			((t.onmouseenter = () => {
					e.autoplay.stop();
				}),
				(t.onmouseleave = () => {
					e.autoplay.start();
				}));
	}, // 主页banner轮播
	getRandomElementsFromArray: function(arr, num) {
		const totalElements = arr.length;
		const selectedElements = new Set();
		while (selectedElements.size < num) {
			const randomIndex = Math.floor(Math.random() * totalElements);
			selectedElements.add(arr[randomIndex]);
		}
		return Array.from(selectedElements);
	},
	renderingPosts: function(data) {
		const randomElements = meuicat.getRandomElementsFromArray(data, 4);
		const postsHtml = randomElements.map((i) => `
		<div class="post_item">
			<a class="post_box" title="${i.title}" href="javascript:void(0)" rel="external nofollow noreferrer" onclick="pjax.loadUrl('${i.link}')">
				<div class="post-info">
					<p class="post-title">
						${i.title}
					</p>
					<div class="info-box">
						<span>${i.time}</span>
						<span style="margin: 0 6px">|</span>
						<span>${i.categories}</span>
					</div>
				</div>
				<p class="post_description">
					${i.description}
				</p>
			</a>
		</div>`)
			.join('');
		document.querySelector(".banner-random>.random-list")
			.innerHTML = postsHtml
	},
	RandomPosts: function() {
		var cachedData = sessionStorage.getItem("postsInfo");
		var cachedTimestamp = sessionStorage.getItem("postsInfoTimestamp");

		if (cachedData && cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_EXPIRATION_TIME)) {
			meuicat.renderingPosts(JSON.parse(cachedData));
		} else {
			fetch("/articles-random.json")
				.then(res => res.json())
				.then(data => {
					sessionStorage.setItem("postsInfo", JSON.stringify(data));
					sessionStorage.setItem("postsInfoTimestamp", Date.now());

					meuicat.renderingPosts(data);
				});
		}
	}, // 主页banner随机推荐
	RandomBar: function(text) {
		const randomList = document.querySelector('.random-list');
		const slideAmount = 210;
	
		if (text === 'prev') {
			randomList.scrollLeft -= slideAmount;
		} else if (text === 'next') {
			randomList.scrollLeft += slideAmount;
		}
	}, // 主页推荐banner滑块
	MemorialDayDate: function() {
		var publicSacrificeDays = ["0707", "0909", "0918", "1109", "1213"];
		var currentDate = new Date();
		var month = ("0" + (currentDate.getMonth() + 1))
			.slice(-2);
		var day = ("0" + currentDate.getDate())
			.slice(-2);
		var currentDateStr = month + day;
	
		return publicSacrificeDays.includes(currentDateStr);
	},// 0707七七事变 0909毛主席忌辰 0918九一八事变 1109娣外公忌辰 1213南京公祭
	MemorialDay: function() {
		if (meuicat.MemorialDayDate()) {
			var element = document.documentElement;
			element.style.filter = "grayscale(100%)";
			element.style.webkitFilter = "grayscale(100%)";
			element.style.MozFilter = "grayscale(100%)";
			element.style.msFilter = "grayscale(100%)";
			element.style.OFilter = "grayscale(100%)";
		}
	}, // 公祭日网站变灰
	post_cover: function() {
		document.documentElement.style.setProperty('--icat-post-bg', 'var(--icat-blue)');
		const imgElement = document.querySelector('.icat-post-cover img');
	
		if (!imgElement) {
		  console.error('未找到封面图像src');
		  return;
		}
	
		const src = imgElement.getAttribute('src');
		const cacheGroup = JSON.parse(localStorage.getItem(CACHE_POST_COVER)) || {};
	
		if (!cacheGroup[src] || cacheGroup[src].expiration < Date.now()) {
		  meuicat.im2color(src);
		} else {
		  document.documentElement.style.setProperty('--icat-post-bg', cacheGroup[src].color);
		  imgElement.style.setProperty('opacity', '.9', 'important');
		}
	},
	im2color: function(src) {
		const apiUrl = 'https://img2color.meuicat.com/api?img=' + encodeURIComponent(src);
	
		fetch(apiUrl)
		  .then(response => response.json())
		  .then(data => {
			const color = data.RGB;
			document.documentElement.style.setProperty('--icat-post-bg', color);
	
			// 更新缓存组
			const expirationTime = Date.now() + CACHE_EXPIRATION_TIME;
			const cacheGroup = JSON.parse(localStorage.getItem(CACHE_POST_COVER)) || {};
			cacheGroup[src] = { color, expiration: expirationTime };
			localStorage.setItem(CACHE_POST_COVER, JSON.stringify(cacheGroup));
	
			const imgElement = document.querySelector('.icat-post-cover img');
			if (imgElement) {
				imgElement.style.setProperty('opacity', '.9', 'important');
			}
		  })
		  .catch(error => {
			console.error('获取颜色时出错：', error);
		  });
	}, // 封面主色获取
	percent: function() {
		if (!percentFlag) {
			window.requestAnimationFrame(() => {
				let scrollTop = document.documentElement.scrollTop || window.pageYOffset;
				let totalHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - document.documentElement.clientHeight;
				let scrollPercent = Math.round(scrollTop / totalHeight * 100);
				let percentElement = document.querySelector(".scroll-percent");
				let header = document.querySelector("#page-header");
				let rightside = document.querySelector("#rightside");
				let viewportBottom = window.scrollY + document.documentElement.clientHeight;
	
				if (scrollPercent === 'undefined') {
					rightside.style.cssText = "opacity: ''; transform: ''"
				}
				if ((document.getElementById("post-comment") || document.getElementById("footer")).offsetTop < viewportBottom || scrollPercent > 95) {
					document.querySelector("#go-up").classList.remove("show-percent");
				} else {
					document.querySelector("#go-up").classList.add("show-percent");
					if (scrollPercent >= 0) {
						header.classList.add("nav-fixed")
						rightside.style.cssText = 'opacity: 0.8; transform: translateX(-58px)'
						percentElement.innerHTML = scrollPercent + "";
					}
					if (scrollPercent === 0) {
						header.classList.remove('nav-fixed', 'nav-visible')
						rightside.style.cssText = "opacity: ''; transform: ''"
					}
				}
				percentFlag = false;
			});
			percentFlag = true;
		}
	}, // 滚动事件
}