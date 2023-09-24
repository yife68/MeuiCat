var meuicat = {
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
                const commentElements = document.querySelectorAll('.length-num.icat-pc-comment, .length-num.icat-pe-comment');
                commentElements.forEach(element => {
                element.innerText = totalComments;
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
            imgStatus.watch('.photo-img', () => { waterfall('.gallery-photos') })
            window.Lately && Lately.init({ target: '.photo-time' })
        }).catch()

        var statusBarItemItems = document.querySelectorAll('.status-bar-item');
        Array.from(statusBarItemItems).forEach(function(element) {
          element.onclick = function(event) {
            var selectedElements = document.querySelectorAll('.status-bar-item.selected');
            Array.from(selectedElements).forEach(function(selectedElement) {
              selectedElement.classList.remove('selected');
            });
            element.classList.add('selected');
            
            event.stopPropagation();
            event.preventDefault();
            return false;
          };
        });
    }, // 相册页处理逻辑
	diffDate: function(d, more = false) {
		const dateNow = new Date();
		const datePost = new Date(d);
		const dateDiff = dateNow.getTime() - datePost.getTime();
		const minute = 1000 * 60;
		const hour = minute * 60;
		const day = hour * 24;
		const month = day * 30;

		let result;

		const suffix = GLOBAL_CONFIG.date_suffix || {};
		const daySuffix = suffix.day || '天前';
		const hourSuffix = suffix.hour || '小时前';
		const minSuffix = suffix.hour || '分钟前';

		if (more) {
			const monthCount = dateDiff / month;
			const dayCount = dateDiff / day;
			const hourCount = dateDiff / hour;
			const minuteCount = dateDiff / minute;

			if (monthCount >= 1) {
				result = datePost.toLocaleDateString()
					.replace(/\//g, "-");
			} else if (dayCount >= 1) {
				result = parseInt(dayCount) + " " + daySuffix;
			} else if (hourCount >= 1) {
				result = parseInt(hourCount) + " " + hourSuffix;
			} else if (minuteCount >= 1) {
				result = parseInt(minuteCount) + " " + minSuffix;
			} else {
				result = suffix.just;
			}
		} else {
			result = parseInt(dateDiff / day);
		}
		return result;
	}, // 时间戳处理逻辑 - 即刻短文
	changeTimeInEssay: function() {
		document.querySelector("#icat-bber") &&
			document.querySelectorAll("#icat-bber time")
			.forEach(function(e) {
				var t = e,
					datetime = t.getAttribute("datetime");
				(t.innerText = meuicat.diffDate(datetime, true)), (t.style.display = "inline");
			});
	}, // 时间戳 - 即刻短文
	reflashEssayWaterFall: function() {
		document.querySelector("#waterfall") &&
			setTimeout(function() {
				waterfall("#waterfall");
				document.getElementById("waterfall")
					.classList.add("show");
			}, 500);
	}, // 加载显示 - 即刻短文
	commentText: function(e) {
		if (e == "undefined" || e == "null") e = "好棒！";
		var n = document.getElementsByClassName("el-textarea__inner")[0],
			t = document.createEvent("HTMLEvents");
		if (!n) return;
		t.initEvent("input", !0, !0);
		var o = replaceAll(e, "\n", "\n> ");
		(n.value = "> " + o + "\n\n"), n.dispatchEvent(t);
		var i = document.querySelector("#post-comment")
			.offsetTop;
		window.scrollTo(0, i - 80),
			n.focus(),
			n.setSelectionRange(-1, -1),
			document.getElementById("comment-tips") && document.getElementById("comment-tips")
			.classList.add("show");
	}, // 引用评论跳转 - 即刻短文
    todolist: function () {
        fetch('https://memos.meuicat.com/api/v1/memo?creatorId=1&tag=清单').then(res => res.json()).then(data => {
            // 获取并处理数据
            data.forEach(item => {
                // 处理数据
                let content = item.content,
                    title = content.match(/\[(.*?)\]/g)[0].replace(/\[(.*?)\]/, '$1');
                // 去掉多余内容，替换清单内容
                content = content.replace(/#.*\s/g, '').replace(/(-\s\[\s\]\s)(.*)/g, `<li><i style="margin-right: 5px;" class="fa-regular fa-circle"></i>$2</li>`).replace(/(-\s\[x\]\s)(.*)/g, `<li class="achieve"><i style="margin-right: 5px;" class="fa-regular fa-circle-check"></i>$2</li>`);
                // 渲染数据
                let div = document.createElement('div');
                div.className = 'list_item';
                div.innerHTML = `<h3>${title}</h3><ul>${content}</ul>`;
                document.getElementById('todolist').appendChild(div);
            });
            waterfall('#todolist');
        }).catch()
    }, // 清单页处理逻辑
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
		console.log(`Welcome to:\n%cMeuiCat V3.0.0:%c https://meuicat.com%c\nThis site has been running stably for %c${Math.round(((new Date).getTime()-new Date("2021/10/15 01:32:00").getTime())/864e5)} %c days`, "border:1px #888 solid;border-right:0;border-radius:5px 0 0 5px;padding: 5px 10px;color:white;background:#0084FF;margin:10px 0", "border:1px #888 solid;border-left:0;border-radius:0 5px 5px 0;padding: 5px 10px;", "", "color:#0084FF", "")
	}, // 控制台信息
	Weixin: function() {
		const isWeixin = /MicroMessenger/i.test(navigator.userAgent); // 判断是否为微信内置浏览器
	
		if (isWeixin) {
			window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzkxNzEyNjYxMw==#wechat_redirect';
		} else {
			window.location.href = '/wechatOA/';
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
	} // 文章Ai摘要
}
meuicat.listenToPageInputPress();



if (isPublicSacrificeDay()) {
    var element = document.documentElement;
    element.style.filter = "grayscale(100%)";
    element.style.webkitFilter = "grayscale(100%)";
    element.style.MozFilter = "grayscale(100%)";
    element.style.msFilter = "grayscale(100%)";
    element.style.OFilter = "grayscale(100%)";
    }
function isPublicSacrificeDay() {
    var publicSacrificeDays = ["0707", "0909", "0918", "1109", "1213"];
    var currentDate = new Date();
    var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    var day = ("0" + currentDate.getDate()).slice(-2);
    var currentDateStr = month + day;

    return publicSacrificeDays.includes(currentDateStr);
} // 自动网站变灰
  
// 0707 - 七七事变
// 0909 - 毛主席忌辰
// 0918 - 九一八事变
// 1109 - 娣外公忌辰
// 1213 - 南京公祭日

var percentFlag = false; // 节流阀
function essayScroll() {
    let a = document.documentElement.scrollTop || window.pageYOffset; // 卷去高度
    const waterfallResult = a % document.documentElement.clientHeight; // 卷去一个视口
    waterfallResult <= 99 || (waterfallResult = 99);

    if (
        !percentFlag &&
        waterfallResult + 100 >= document.documentElement.clientHeight &&
        document.querySelector("#waterfall")
    ) {
        // console.info(waterfallResult, document.documentElement.clientHeight);
        setTimeout(() => {
        waterfall("#waterfall");
        }, 500);
    } else {
        setTimeout(() => {
            document.querySelector("#waterfall") && waterfall("#waterfall");
        }, 500);
    }

    const r = window.scrollY + document.documentElement.clientHeight;
    let p = document.getElementById("post-comment") || document.getElementById("footer");
    (p.offsetTop + p.offsetHeight / 2 < r || 90 < waterfallResult) && (percentFlag = true);
}
function replaceAll(e, n, t) {
    return e.split(n).join(t);
}

// 即刻短文处理逻辑



function waterfall(a) {
	function b(a, b) {
		var c = window.getComputedStyle(b);
		return parseFloat(c["margin" + a]) || 0;
	}

	function c(a) {
		return a + "px";
	}

	function d(a) {
		return parseFloat(a.style.top);
	}

	function e(a) {
		return parseFloat(a.style.left);
	}

	function f(a) {
		return a.clientWidth;
	}

	function g(a) {
		return a.clientHeight;
	}

	function h(a) {
		return d(a) + g(a) + b("Bottom", a);
	}

	function i(a) {
		return e(a) + f(a) + b("Right", a);
	}

	function j(a) {
		a = a.sort(function(a, b) {
			return h(a) === h(b) ? e(b) - e(a) : h(b) - h(a);
		});
	}

	function k(b) {
		f(a) != t && (b.target.removeEventListener(b.type, arguments.callee), waterfall(a));
	}
	"string" == typeof a && (a = document.querySelector(a));
	var l = [].map.call(a.children, function(a) {
		return (a.style.position = "absolute"), a;
	});
	a.style.position = "relative";
	var m = [];
	l.length && ((l[0].style.top = "0px"), (l[0].style.left = c(b("Left", l[0]))), m.push(l[0]));
	for (var n = 1; n < l.length; n++) {
		var o = l[n - 1],
			p = l[n],
			q = i(o) + f(p) <= f(a);
		if (!q) break;
		(p.style.top = o.style.top), (p.style.left = c(i(o) + b("Left", p))), m.push(p);
	}
	for (; n < l.length; n++) {
		j(m);
		var p = l[n],
			r = m.pop();
		(p.style.top = c(h(r) + b("Top", p))), (p.style.left = c(e(r))), m.push(p);
	}
	j(m);
	var s = m[0];
	a.style.height = c(h(s) + b("Bottom", s));
	var t = f(a);
	window.addEventListener ? window.addEventListener("resize", k) : (document.body.onresize = k);
}

// 瀑布流



! function() {
    this.loaded = 0, this.failed = 0, this.total = 0, this.watch = function(a, b) {
        var c = document.querySelectorAll(a);
        if (!c.length) return console.log("[imgStatus]: There aren't any images associated with this selector (" + a + ")!");
        this.total = c.length;
        for (var d = 0; d < this.total; d++) isCached(c[d].src) ? this._setLoaded(b) : c[d].addEventListener ? (c[d].addEventListener("load", this._setLoaded.bind(this, b)), c[d].addEventListener("error", this._setFailed.bind(this, b))) : (c[d].attachEvent("onload", this._setLoaded.bind(this, b)), c[d].attachEvent("onerror", this._setFailed.bind(this, b)))
    }, this.isCached = function(a) {
        var b = new Image;
        return b.src = a, b.complete
    }, this._setFailed = function(a, b) {
        ++this.failed, "function" == typeof a && a(this)
    }, this._setLoaded = function(a, b) {
        ++this.loaded, "function" == typeof a && a(this)
    }, this.isDone = function() {
        return this.loaded + this.failed === this.total ? !0 : !1
    }, "object" == typeof window && (window.imgStatus = this)
}();

// imgStatus.min.js

! function() {
    window.Lately = new function() {
        var t = this;
        this.lang = {
            second: "秒",
            minute: "分钟",
            hour: "小时",
            day: "天",
            month: "个月",
            year: "年",
            ago: "前",
            error: "NaN"
        };
        var e = function(e) {
            e = new Date(n(e));
            var r = new function() {
                    this.second = (Date.now() - e.getTime()) / 1e3, this.minute = this.second / 60, this.hour = this.minute / 60, this.day = this.hour / 24, this.month = this.day / 30, this.year = this.month / 12
                }, i = Object.keys(r).reverse().find(function(t) {
                    return r[t] >= 1
                });
            return (i ? function(t, e) {
                return Math.floor(t) + e
            }(r[i], t.lang[i]) : t.lang.error) + t.lang.ago
        }, n = function(t) {
                return t = new Date(t && ("number" == typeof t ? t : t.replace(/-/g, "/").replace("T", " "))), !isNaN(t.getTime()) && t.getTime()
            };
        return {
            init: function() {
                var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, i = r.target,
                    a = void 0 === i ? "time" : i,
                    o = r.lang;
                o && (t.lang = o);
                var u = !0,
                    h = !1,
                    l = void 0;
                try {
                    for (var s, c = document.querySelectorAll(a)[Symbol.iterator](); !(u = (s = c.next()).done); u = !0) {
                        var f = s.value,
                            g = n(f.dateTime) || n(f.title) || n(f.innerHTML) || 0;
                        if (!g) return;
                        f.title = new Date(g).toLocaleString(), f.innerHTML = e(g)
                    }
                } catch (t) {
                    h = !0, l = t
                } finally {
                    try {
                        !u && c.
                        return &&c.
                        return ()
                    } finally {
                        if (h) throw l
                    }
                }
            },
            format: e
        }
    }
}();

/*
 * Lately.min.js 2.5.2
 * MIT License - http://www.opensource.org/licenses/mit-license.php
 * https://tokinx.github.io/lately/
 */

// Memos动态相册



(function() {
	var a, b, c, d, e, f = function(a, b) {
			return function() {
				return a.apply(b, arguments)
			}
		},
		g = [].indexOf || function(a) {
			for (var b = 0, c = this.length; c > b; b++)
				if (b in this && this[b] === a) return b;
			return -1
		};
	b = function() {
		function a() {}
		return a.prototype.extend = function(a, b) {
			var c, d;
			for (c in b) d = b[c], null == a[c] && (a[c] = d);
			return a
		}, a.prototype.isMobile = function(a) {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)
		}, a.prototype.createEvent = function(a, b, c, d) {
			var e;
			return null == b && (b = !1), null == c && (c = !1), null == d && (d = null), null != document.createEvent ? (e = document.createEvent("CustomEvent"), e.initCustomEvent(a, b, c, d)) : null != document.createEventObject ? (e = document.createEventObject(), e.eventType = a) : e.eventName = a, e
		}, a.prototype.emitEvent = function(a, b) {
			return null != a.dispatchEvent ? a.dispatchEvent(b) : b in (null != a) ? a[b]() : "on" + b in (null != a) ? a["on" + b]() : void 0
		}, a.prototype.addEvent = function(a, b, c) {
			return null != a.addEventListener ? a.addEventListener(b, c, !1) : null != a.attachEvent ? a.attachEvent("on" + b, c) : a[b] = c
		}, a.prototype.removeEvent = function(a, b, c) {
			return null != a.removeEventListener ? a.removeEventListener(b, c, !1) : null != a.detachEvent ? a.detachEvent("on" + b, c) : delete a[b]
		}, a.prototype.innerHeight = function() {
			return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight
		}, a
	}(), c = this.WeakMap || this.MozWeakMap || (c = function() {
		function a() {
			this.keys = [], this.values = []
		}
		return a.prototype.get = function(a) {
			var b, c, d, e, f;
			for (f = this.keys, b = d = 0, e = f.length; e > d; b = ++d)
				if (c = f[b], c === a) return this.values[b]
		}, a.prototype.set = function(a, b) {
			var c, d, e, f, g;
			for (g = this.keys, c = e = 0, f = g.length; f > e; c = ++e)
				if (d = g[c], d === a) return void(this.values[c] = b);
			return this.keys.push(a), this.values.push(b)
		}, a
	}()), a = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (a = function() {
		function a() {
			"undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser."), "undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")
		}
		return a.notSupported = !0, a.prototype.observe = function() {}, a
	}()), d = this.getComputedStyle || function(a) {
		return this.getPropertyValue = function(b) {
			var c;
			return "float" === b && (b = "styleFloat"), e.test(b) && b.replace(e, function(a, b) {
				return b.toUpperCase()
			}), (null != (c = a.currentStyle) ? c[b] : void 0) || null
		}, this
	}, e = /(\-([a-z]){1})/g, this.WOW = function() {
		function e(a) {
			null == a && (a = {}), this.scrollCallback = f(this.scrollCallback, this), this.scrollHandler = f(this.scrollHandler, this), this.resetAnimation = f(this.resetAnimation, this), this.start = f(this.start, this), this.scrolled = !0, this.config = this.util()
				.extend(a, this.defaults), this.animationNameCache = new c, this.wowEvent = this.util()
				.createEvent(this.config.boxClass)
		}
		return e.prototype.defaults = {
			boxClass: "wow",
			animateClass: "animated",
			offset: 0,
			mobile: !0,
			live: !0,
			callback: null
		}, e.prototype.init = function() {
			var a;
			return this.element = window.document.documentElement, "interactive" === (a = document.readyState) || "complete" === a ? this.start() : this.util()
				.addEvent(document, "DOMContentLoaded", this.start), this.finished = []
		}, e.prototype.start = function() {
			var b, c, d, e;
			if (this.stopped = !1, this.boxes = function() {
				var a, c, d, e;
				for (d = this.element.querySelectorAll("." + this.config.boxClass), e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(b);
				return e
			}.call(this), this.all = function() {
				var a, c, d, e;
				for (d = this.boxes, e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(b);
				return e
			}.call(this), this.boxes.length)
				if (this.disabled()) this.resetStyle();
				else
					for (e = this.boxes, c = 0, d = e.length; d > c; c++) b = e[c], this.applyStyle(b, !0);
			return this.disabled() || (this.util()
					.addEvent(window, "scroll", this.scrollHandler), this.util()
					.addEvent(window, "resize", this.scrollHandler), this.interval = setInterval(this.scrollCallback, 50)), this.config.live ? new a(function(a) {
					return function(b) {
						var c, d, e, f, g;
						for (g = [], c = 0, d = b.length; d > c; c++) f = b[c], g.push(function() {
							var a, b, c, d;
							for (c = f.addedNodes || [], d = [], a = 0, b = c.length; b > a; a++) e = c[a], d.push(this.doSync(e));
							return d
						}.call(a));
						return g
					}
				}(this))
				.observe(document.body, {
					childList: !0,
					subtree: !0
				}) : void 0
		}, e.prototype.stop = function() {
			return this.stopped = !0, this.util()
				.removeEvent(window, "scroll", this.scrollHandler), this.util()
				.removeEvent(window, "resize", this.scrollHandler), null != this.interval ? clearInterval(this.interval) : void 0
		}, e.prototype.sync = function() {
			return a.notSupported ? this.doSync(this.element) : void 0
		}, e.prototype.doSync = function(a) {
			var b, c, d, e, f;
			if (null == a && (a = this.element), 1 === a.nodeType) {
				for (a = a.parentNode || a, e = a.querySelectorAll("." + this.config.boxClass), f = [], c = 0, d = e.length; d > c; c++) b = e[c], g.call(this.all, b) < 0 ? (this.boxes.push(b), this.all.push(b), this.stopped || this.disabled() ? this.resetStyle() : this.applyStyle(b, !0), f.push(this.scrolled = !0)) : f.push(void 0);
				return f
			}
		}, e.prototype.show = function(a) {
			return this.applyStyle(a), a.className = a.className + " " + this.config.animateClass, null != this.config.callback && this.config.callback(a), this.util()
				.emitEvent(a, this.wowEvent), this.util()
				.addEvent(a, "animationend", this.resetAnimation), this.util()
				.addEvent(a, "oanimationend", this.resetAnimation), this.util()
				.addEvent(a, "webkitAnimationEnd", this.resetAnimation), this.util()
				.addEvent(a, "MSAnimationEnd", this.resetAnimation), a
		}, e.prototype.applyStyle = function(a, b) {
			var c, d, e;
			return d = a.getAttribute("data-wow-duration"), c = a.getAttribute("data-wow-delay"), e = a.getAttribute("data-wow-iteration"), this.animate(function(f) {
				return function() {
					return f.customStyle(a, b, d, c, e)
				}
			}(this))
		}, e.prototype.animate = function() {
			return "requestAnimationFrame" in window ? function(a) {
				return window.requestAnimationFrame(a)
			} : function(a) {
				return a()
			}
		}(), e.prototype.resetStyle = function() {
			var a, b, c, d, e;
			for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b], e.push(a.style.visibility = "visible");
			return e
		}, e.prototype.resetAnimation = function(a) {
			var b;
			return a.type.toLowerCase()
				.indexOf("animationend") >= 0 ? (b = a.target || a.srcElement, b.className = b.className.replace(this.config.animateClass, "")
					.trim()) : void 0
		}, e.prototype.customStyle = function(a, b, c, d, e) {
			return b && this.cacheAnimationName(a), a.style.visibility = b ? "hidden" : "visible", c && this.vendorSet(a.style, {
				animationDuration: c
			}), d && this.vendorSet(a.style, {
				animationDelay: d
			}), e && this.vendorSet(a.style, {
				animationIterationCount: e
			}), this.vendorSet(a.style, {
				animationName: b ? "none" : this.cachedAnimationName(a)
			}), a
		}, e.prototype.vendors = ["moz", "webkit"], e.prototype.vendorSet = function(a, b) {
			var c, d, e, f;
			d = [];
			for (c in b) e = b[c], a["" + c] = e, d.push(function() {
				var b, d, g, h;
				for (g = this.vendors, h = [], b = 0, d = g.length; d > b; b++) f = g[b], h.push(a["" + f + c.charAt(0)
					.toUpperCase() + c.substr(1)] = e);
				return h
			}.call(this));
			return d
		}, e.prototype.vendorCSS = function(a, b) {
			var c, e, f, g, h, i;
			for (h = d(a), g = h.getPropertyCSSValue(b), f = this.vendors, c = 0, e = f.length; e > c; c++) i = f[c], g = g || h.getPropertyCSSValue("-" + i + "-" + b);
			return g
		}, e.prototype.animationName = function(a) {
			var b;
			try {
				b = this.vendorCSS(a, "animation-name")
					.cssText
			} catch (c) {
				b = d(a)
					.getPropertyValue("animation-name")
			}
			return "none" === b ? "" : b
		}, e.prototype.cacheAnimationName = function(a) {
			return this.animationNameCache.set(a, this.animationName(a))
		}, e.prototype.cachedAnimationName = function(a) {
			return this.animationNameCache.get(a)
		}, e.prototype.scrollHandler = function() {
			return this.scrolled = !0
		}, e.prototype.scrollCallback = function() {
			var a;
			return !this.scrolled || (this.scrolled = !1, this.boxes = function() {
				var b, c, d, e;
				for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b], a && (this.isVisible(a) ? this.show(a) : e.push(a));
				return e
			}.call(this), this.boxes.length || this.config.live) ? void 0 : this.stop()
		}, e.prototype.offsetTop = function(a) {
			for (var b; void 0 === a.offsetTop;) a = a.parentNode;
			for (b = a.offsetTop; a = a.offsetParent;) b += a.offsetTop;
			return b
		}, e.prototype.isVisible = function(a) {
			var b, c, d, e, f;
			return c = a.getAttribute("data-wow-offset") || this.config.offset, f = window.pageYOffset, e = f + Math.min(this.element.clientHeight, this.util()
				.innerHeight()) - c, d = this.offsetTop(a), b = d + a.clientHeight, e >= d && b >= f
		}, e.prototype.util = function() {
			return null != this._util ? this._util : this._util = new b
		}, e.prototype.disabled = function() {
			return !this.config.mobile && this.util()
				.isMobile(navigator.userAgent)
		}, e
	}()
})
.call(this);

/*! WOW - v1.1.2 - 2015-04-07
 * Copyright (c) 2015 Matthieu Aussaguel; Licensed MIT
 */