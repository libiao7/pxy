let tb
function SetPxy() {
    let config = {
        mode: 'fixed_servers',
        rules: {
            singleProxy: {
                scheme: 'socks5',
                host: '127.0.0.1',
                port: 10808
            },
            bypassList: ["foobar.com"]
        }
    };
    chrome.proxy.settings.set(
        { value: config, scope: 'regular' },
        setIconF
    );
}
function setIconF() {
    chrome.proxy.settings.get(
        { 'incognito': false },
        function (config) {
            if (tb && tb.pendingUrl) {
                // chrome.tabs.create({ 'url': tb.pendingUrl })
                setTimeout(function () {
                    if (tb && tb.pendingUrl)
                        chrome.tabs.reload()
                }, 200)
            }
            if (config.levelOfControl === 'controlled_by_this_extension') {
                if (config.value.mode === 'fixed_servers')
                    chrome.browserAction.setIcon({ path: 'purple.png' })
                else if (config.value.mode === 'direct')
                    chrome.browserAction.setIcon({ path: 'gray.png' })
            }
        }
    )
}
chrome.runtime.onInstalled.addListener(function () {
    SetPxy()
})
chrome.browserAction.onClicked.addListener((tab) => {
    console.log(tab)
    tb = tab
    chrome.proxy.settings.get(
        { 'incognito': false },
        function (config) {
            if (config.levelOfControl === 'controlled_by_this_extension') {
                if (config.value.mode === 'fixed_servers')
                    chrome.proxy.settings.set(
                        { value: { mode: 'direct' }, scope: 'regular' },
                        setIconF
                    )
                else if (config.value.mode === 'direct')
                    SetPxy()
            }
        }
    )
})

