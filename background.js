chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'open_url') {
		chrome.tabs.create({
			url: message.url,
			active: false // 设置为 false 则在后台打开，不跳转到新标签页
		});
	} else if (message.action === 'close_tab') {
		// sender.tab.id 是发送消息的那个标签页的 ID
		chrome.tabs.remove(sender.tab.id);
	}
});