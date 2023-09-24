function whenDOMReady() {
	"/privacy/" == location.pathname && meuicat.addScript("echarts", "https://cdn.meuicat.com/gh/UAParser.js/ua-parser.min.js")

	meuicat.comments();
    meuicat.changeTimeInEssay();
    meuicat.reflashEssayWaterFall();
	meuicat.tagsBarActive();
	meuicat.wowanimation();

    if (location.pathname == '/photos/') meuicat.photos();
	if (location.pathname == '/project/') meuicat.todolist();
	if (location.pathname == '/' || location.pathname.startsWith('/page/')) meuicat.homeplatform();
	if (location.pathname.startsWith('/blog/')) meuicat.postplatform(), meuicat.postai();

	window.onload = () => {
		if (location.pathname == '/privacy/') meuicat.getIpInfo();
	};
}

whenDOMReady() // 打开网站先执行一次
document.addEventListener("pjax:complete", whenDOMReady) // pjax加载完成（切换页面）后再执行一次

meuicat.logInfo();



var icat = {
    submitInfo: function() {
        var submitBox = document.querySelector('.submit-box');
        var followElement = document.querySelector('#follow');

        if (submitBox) {
            submitBox.classList.toggle('display');
        }

        if (followElement) {
            followElement.classList.toggle('display');
        }
    }, // 订阅显示
    socialInfo: function() {
        var socialBox = document.querySelector('.card-info-social-icons');
        var socialElement = document.querySelector('.social-btn');

        if (socialBox) {
            socialBox.classList.toggle('show');
        }

        if (socialElement) {
            socialElement.classList.toggle('show');
        }
    }, // social显示
    switchCommentBarrage: function() {
        document.querySelector(".comment-barrage")&&($(".comment-barrage").is(":visible")?($(".comment-barrage").hide(),$(".menu-commentBarrage-text").text("显示热评"),document.querySelector("#consoleCommentBarrage").classList.remove("on"),localStorage.setItem("commentBarrageSwitch","false")):$(".comment-barrage").is(":hidden")&&($(".comment-barrage").show(),$(".menu-commentBarrage-text").text("关闭热评"),document.querySelector("#consoleCommentBarrage").classList.add("on"),localStorage.removeItem("commentBarrageSwitch"))),
        rm.hideRightMenu()
    },
    scrollTo: function(e) {
        const t = document.getElementById(e);
        if (t) {
            const e = t.getBoundingClientRect().top + window.pageYOffset - 80,
            o = window.pageYOffset,
            n = e - o;
            let a = null;
            window.requestAnimationFrame((function e(t) {
            a || (a = t);
            const i = t - a,
            l = (c = Math.min(i / 0, 1)) < .5 ? 2 * c * c: (4 - 2 * c) * c - 1;
            var c;
            window.scrollTo(0, o + n * l),
            i < 600 && window.requestAnimationFrame(e)
            }))
        }
    } // 热评弹窗跳转
}



function setMask() { //设置遮罩层
	if (document.getElementsByClassName("rmMask")[0] != undefined) {
		return document.getElementsByClassName("rmMask")[0];
	}
	mask = document.createElement('div');
	mask.className = "rmMask";
	mask.style.width = window.innerWidth + 'px';
	mask.style.height = window.innerHeight + 'px';
	mask.style.background = '#fff';
	mask.style.opacity = '.0';
	mask.style.position = 'fixed';
	mask.style.top = '0';
	mask.style.left = '0';
	mask.style.zIndex = 998;
	document.body.appendChild(mask);
	document.getElementById("rightMenu")
		.style.zIndex = 19198;
	return mask;
}

function insertAtCursor(myField, myValue) {

	//IE 浏览器
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
		sel.select();
	}

	//FireFox、Chrome等
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;

		// 保存滚动条
		var restoreTop = myField.scrollTop;
		myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);

		if (restoreTop > 0) {
			myField.scrollTop = restoreTop;
		}

		myField.focus();
		myField.selectionStart = startPos + myValue.length;
		myField.selectionEnd = startPos + myValue.length;
	} else {
		myField.value += myValue;
		myField.focus();
	}
}
let Right_click = {};
Right_click.showRightMenu = function(isTrue, x = 0, y = 0) {
	let $rightMenu = $('#rightMenu');
	$rightMenu.css('top', x + 'px')
		.css('left', y + 'px');

	if (isTrue) {
		$rightMenu.show();
	} else {
		$rightMenu.hide();
	}
}
Right_click.switchDarkMode = function() {
	const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
	if (nowMode === 'light') {
		activateDarkMode()
		saveToLocal.set('theme', 'dark', 2)
		GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
	} else {
		activateLightMode()
		saveToLocal.set('theme', 'light', 2)
		GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
	}
	typeof utterancesTheme === 'function' && utterancesTheme()
	typeof FB === 'object' && window.loadFBComment()
	window.DISQUS && document.getElementById('disqus_thread')
		.children.length && setTimeout(() => window.disqusReset(), 200)
};
// 日夜模式切换
Right_click.copyWordsLink = function() {
	let url = window.location.href
	let txa = document.createElement("textarea");
	txa.value = url;
	document.body.appendChild(txa)
	txa.select();
	document.execCommand("Copy");
	document.body.removeChild(txa);
	Snackbar.show({
		text: '链接复制成功！快去分享吧！',
		pos: 'bottom-center',
		showAction: false
	});
}
// 复制链接
Right_click.switchReadMode = function() {
	const $body = document.body
	$body.classList.add('read-mode')
	const newEle = document.createElement('button')
	newEle.type = 'button'
	newEle.className = 'fas fa-sign-out-alt exit-readmode'
	$body.appendChild(newEle)

	function clickFn() {
		$body.classList.remove('read-mode')
		newEle.remove()
		newEle.removeEventListener('click', clickFn)
	}

	newEle.addEventListener('click', clickFn)
}
// 阅读模式

Right_click.copySelect = function() {
	document.execCommand('Copy', false, null);
	//这里可以写点东西提示一下 已复制
	Snackbar.show({
		text: '复制成功！快去分享吧！',
		pos: 'bottom-center',
		showAction: false
	});
}
//复制选中文字

Right_click.translate = function() {
	document.getElementById("translateLink")
		.click();
}
// 繁简转换
Right_click.searchinThisPage = () => {
	document.body.removeChild(mask);
	document.getElementsByClassName("local-search-box--input")[0].value = window.getSelection()
		.toString()
	document.getElementsByClassName("search")[0].click()
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("input", false, false);
	document.getElementsByClassName("local-search-box--input")[0].dispatchEvent(evt);
}
document.body.addEventListener('touchmove', function(e) {

}, {
	passive: false
});

function popupMenu() {
	//window.oncontextmenu=function(){return false;}
	window.oncontextmenu = function(event) {
		if (event.ctrlKey || document.body.clientWidth < 900) return true;
		$('.rightMenu-group.hide')
			.hide();
		if (document.getSelection()
			.toString()) {
			$('#menu-text')
				.show();
		}
		if (document.getElementById('post')) {
			$('#menu-post')
				.show();
		} else {
			if (document.getElementById('page')) {
				$('#menu-post')
					.show();
			}
		}
		var el = window.document.body;
		el = event.target;
		var a = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
		if (a.test(window.getSelection()
			.toString()) && el.tagName != "A") {
			$('#menu-too')
				.show()
		}
		if (el.tagName == 'A') {
			$('#menu-to')
				.show()
			Right_click.open = function() {
				if (el.href.indexOf("http://") == -1 && el.href.indexOf("https://") == -1 || el.href.indexOf("yisous.xyz") != -1) {
					pjax.loadUrl(el.href)
				} else {
					location.href = el.href
				}
			}
			Right_click.openWithNewTab = function() {
				window.open(el.href);
				// window.location.reload();
			}
			Right_click.copyLink = function() {
				let url = el.href
				let txa = document.createElement("textarea");
				txa.value = url;
				document.body.appendChild(txa)
				txa.select();
				document.execCommand("Copy");
				document.body.removeChild(txa);
			}
		}
		if (el.tagName == 'IMG') {
			$('#menu-img')
				.show()
			Right_click.openWithNewTab = function() {
				window.open(el.src);
				// window.location.reload();
			}
			Right_click.click = function() {
				el.click()
			}
			Right_click.copyLink = function() {
				let url = el.src
				let txa = document.createElement("textarea");
				txa.value = url;
				document.body.appendChild(txa)
				txa.select();
				document.execCommand("Copy");
				document.body.removeChild(txa);
			}
			Right_click.saveAs = function() {
				var a = document.createElement('a');
				var url = el.src;
				var filename = url.split("/")[-1];
				a.href = url;
				a.download = filename;
				a.click();
				window.URL.revokeObjectURL(url);
			}
		} else if (el.tagName == "TEXTAREA" || el.tagName == "INPUT") {
			$('#menu-paste')
				.show();
			// Right_click.paste=function(){
			//     input.addEventListener('paste', async event => {
			//         event.preventDefault();
			//         const text = await navigator.clipboard.readText();
			//         el.value+=text;
			//       });
			// }
			Right_click.paste = function() {
				navigator.permissions
					.query({
						name: 'clipboard-read'
					})
					.then(result => {
						if (result.state == 'granted' || result.state == 'prompt') {
							//读取剪贴板
							navigator.clipboard.readText()
								.then(text => {
									console.log(text)
									insertAtCursor(el, text)
								})
						} else {
							Snackbar.show({
								text: '请允许读取剪贴板！',
								pos: 'top-center',
								showAction: false,
							})
						}
					})
			}
		}
		let pageX = event.clientX + 10;
		let pageY = event.clientY;
		let rmWidth = $('#rightMenu')
			.width();
		let rmHeight = $('#rightMenu')
			.height();
		if (pageX + rmWidth > window.innerWidth) {
			pageX -= rmWidth + 10;
		}
		if (pageY + rmHeight > window.innerHeight) {
			pageY -= pageY + rmHeight - window.innerHeight;
		}
		mask = setMask();
		window.onscroll = () => {
			Right_click.showRightMenu(false);
			window.onscroll = () => {}
			document.body.removeChild(mask);
		}
		$(".rightMenu-item")
			.click(() => {
				document.body.removeChild(mask);
			})
		$(window)
			.resize(() => {
				Right_click.showRightMenu(false);
				document.body.removeChild(mask);
			})
		mask.onclick = () => {
			document.body.removeChild(mask);
		}
		Right_click.showRightMenu(true, pageY, pageX);
		return false;
	};

	window.addEventListener('click', function() {
		Right_click.showRightMenu(false);
	});
}
if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
	popupMenu()
}
const box = document.documentElement

function addLongtabListener(target, callback) {
	let timer = 0 // 初始化timer

	target.ontouchstart = () => {
		timer = 0 // 重置timer
		timer = setTimeout(() => {
			callback();
			timer = 0
		}, 380) // 超时器能成功执行，说明是长按
	}

	target.ontouchmove = () => {
		clearTimeout(timer) // 如果来到这里，说明是滑动
		timer = 0
	}

	target.ontouchend = () => { // 到这里如果timer有值，说明此触摸时间不足380ms，是点击
		if (timer) {
			clearTimeout(timer)
		}
	}
}

addLongtabListener(box, popupMenu)

// 右键菜单JS