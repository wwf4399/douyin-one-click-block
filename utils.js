/**
 * 模拟鼠标悬停
 * @param {HTMLElement} element - 目标元素
 */
	function simulateHover(element) {
		if (!element) return;

		// 创建鼠标移入事件
		const mouseOverEvent = new MouseEvent('mouseover', {
			bubbles: true,
			cancelable: true,
			view: window
		});

		const mouseEnterEvent = new MouseEvent('mouseenter', {
			bubbles: true,
			cancelable: true,
			view: window
		});

		// 按顺序分发事件
		element.dispatchEvent(mouseOverEvent);
		element.dispatchEvent(mouseEnterEvent);
	}
//片段元素是否在视口内
	function isElementInViewport(el) {
		const rect = el.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}
/**
 * 带有可选超时限制的定时器
 * @param {Function} callback - 要执行的函数
 * @param {number} interval - 每次循环的间隔 (ms)
 * @param {number|null} maxDuration - 最大运行时间 (ms)，传入 Infinity 或 null 表示不限时
 */
	function setLimitedInterval(callback, interval, maxDuration = Infinity) {
		const startTime = Date.now();
		const timer = setInterval(() => {
			//只有当 maxDuration 为有限数值且已超时，才清除定时器
			if(Number.isFinite(maxDuration)){
				if(Date.now() - startTime >= maxDuration){
					clearInterval(timer);//已达到设定的最大运行时间，定时器停止。
					return;
				}
			}
			callback();
		}, interval);
		return timer;
	}