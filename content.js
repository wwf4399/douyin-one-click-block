//往页面的顶部导航中注入“拉黑博主”元素
	setLimitedInterval(() => {
		if(document.querySelector('header pace-island > div > .block-container') === null){
			const container = document.querySelector('header pace-island > div');
			const htmlString = `
				<div class="block-container"><div class="iconfont">&#xe627;</div><div class="text">拉黑博主</div></div>
				<style>
					@font-face {
						font-family: 'iconfont';
						src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAANkAAsAAAAABxwAAAMWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACCcAqCGIIkATYCJAMICwYABCAFhGcHLxtfBsgusG3Yk0aWQgQZuy6n789GHM6EeHh+3dO58+Zr/lLJQt5sJqEUhrQbwbpuyjPvfm2YNpNhdiaav+yf+G6YN8iiiXSh8Ig0sUrj0chENen0n7tAC1zewEsXyada34IFWqCXpDVIUFqkufjJ/38/9a98IhfAVxlUjQ9s3voB12GV4jvzgfkW2UVcEYvcR6AwnE717LmeCGg/vIPkQa9aqDJI4uPwgQQFGlWlvCE+1IUqdGourqqQncteM64En4/fkmgkU0lQ0vK9Vhbc6od7pO2SSF/M4xXx3TNUkDB4ZepY3WxcqiYKDlajqDLW6ink54JvlaXHXPcfjyCqUGwL0INnnhOLsk81KwO5c2/dBrjY67xUWhbFiJYr59/JMdULzEeBjcub5w06/to2L97Bq/997OxcO3bEy3Q9PLn5pNN+57Xsuvn8amA13QxstyLeo5R10ondWff391fMqx9ZhqPhsAuqx0SGX92eltHp0puE5ks3ohW1R6OGng+mj0hvfrg59PfVcaPfuXcOK0ov5XSV2t2Qm5/jk/U9C/lZyETEAQFbSTtbvWzT9tUyZesXXh4/Uvdbx6aM05agd8Lo3114iUP7SWP17X6mwuudJrW65DJHTeqWeVoB087QAgOA0qU/6dhP+I0Hkac+mvy/3szB139/Cuyly8HM1M/SGLxy0WYgMrddZHkVS41mtqm7C36BPZQGWdt57yttf2vRUNf+Bs013RNI6noScspAqGgaCVV1U6AwiHV2U3tFNSJvoK89DkIbFci08hSSNu4IOeUNKjr5hKo2/qGwNlou19Q3mFkYUQSxkF6BKaaQ54iEBHhDKLGQpXCZL4ZwOcV7oJAnyEfsKI/wECPKiwkRIRzkcCEHbfJuKJstwCIupBFDeElCiio+n6u6CY8p5IAZhlAIhAXRVkApjII8zkOT7PeFIAkLsigYSIgFsbIUjx8S4hEACHZhHlR2JauULUoQIQgOxMFcOAeyqXokawULoGJ1pzSEQfAke/iLVPgYxUGFvPnFuUdbBQUkywK3SSqHdyRRCgAAAA==') format('woff2');
					}
					.iconfont{
						font-family: "iconfont" !important;
						font-size: 16px;
						font-style: normal;
						-webkit-font-smoothing: antialiased;
						-moz-osx-font-smoothing: grayscale;
					}
					.block-container{
						color: rgba(255,255,255,0.6);
						font-size: 10px;
						text-align: center;
						cursor: pointer;
					}
					.block-container:hover{
						color: rgba(255,255,255,1);
					}
					.block-container .iconfont{
						margin-top: 1px;
					}
					.block-container .text{
						line-height: 20px;
					}
				</style>
			`;
			container.insertAdjacentHTML('afterBegin', htmlString);
			//用户点击“拉黑”按钮
				container.querySelector('.block-container').onclick = () => {
					const allLinks = document.querySelectorAll('a[href*="/user/"]');
					const userLinks = Array.from(allLinks).map(a => {
						const href = a.getAttribute('href');
						const match = href.match(/MS4wLjABAAAA[A-Za-z0-9_-]+/);
						return ( match && isElementInViewport(a) ) ? match[0] : false;
					}).find(item => item !== false);
					const url = `https://www.douyin.com/user/${userLinks}?lahei=true`;
					chrome.runtime.sendMessage({
						action: 'open_url',
						url: url
					});
				}
		}
	}, 1000);
//监听当跳转到博主主页后。url中是否出现“lahei”的参数
	const intervalId_1 = setLimitedInterval(() => {
		//获取url信息
			const urlParams = new URLSearchParams(window.location.search);
		//如果存在拉黑的url参数
			if(urlParams.has('lahei') === false){return clearInterval(intervalId_1);}
		//找到“分享主页”右边的3个小点
			const tooltipDom = document.querySelector('#tooltip button.semi-button');
		if(tooltipDom){
			simulateHover(tooltipDom);//触发鼠标悬停。不过弹窗一闪而过，所以需要下面的代码进行循环
			const intervalId_2 = setLimitedInterval(() => {
				//找到按钮
					const menuItems = document.querySelectorAll('body > .semi-portal li.semi-dropdown-item');
					const blockBtn = Array.from(menuItems).find(item => ['拉黑', '解除拉黑'].includes(item.innerText.trim()));
					if(blockBtn){
						//结束循环
							clearInterval(intervalId_1);
							clearInterval(intervalId_2);
						const blockBtnText = blockBtn.innerText.trim();
						if(blockBtnText === '拉黑'){
							blockBtn.click();
							setTimeout(() => {
								Array.from(document.querySelectorAll('button.semi-button.semi-button-primary span')).find(item => item.innerText.trim() === '确认拉黑').click();
							}, 500);
						}else if(blockBtnText === '解除拉黑'){
							chrome.runtime.sendMessage({ action: 'close_tab' });
						}
					}
			}, 10, 2000);//每10毫秒循环一次，2秒后自动停止
		}
	}, 1000, 50000);//每秒执行一次，50秒后自动停止