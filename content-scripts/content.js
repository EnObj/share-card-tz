console.log('i am chameleon.');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.hiddenDom) {
        handleHiddenDom(request.hiddenDom, request.host)
    }
    if (request.style) {
        handleStyle(request.style, request.host)
    }
});

// 直接渲染
chrome.runtime.sendMessage({
    action: 'switchAll',
});

function handleHiddenDom(hiddenDom, host) {
    if (location.host.endsWith(host)) {
        console.log(host, hiddenDom);
        const styleId = 'chameleon-' + hiddenDom.name
        // 移除
        if (!hiddenDom.checked) {
            return $('#' + styleId).remove();
        }
        // 或添加
        const style = `<style id="${styleId}">
            ${hiddenDom.selector}{
                display: none
            }
        </style>`
        $('head').append(style)
    }
}

function handleStyle(style, host) {
    if (location.host.endsWith(host)) {
        console.log(host, style);
        const styleId = 'chameleon-' + style.name
        // 移除
        if (!style.checked) {
            return $('#' + styleId).remove();
        }
        // 或添加
        const styleContent = style.doms.map(dom => {
            return `${dom.selector}{
                ${dom.css}
            }`
        }).join('\n')
        const styleTag = `<style id="${styleId}">
                ${styleContent}
        </style>`
        $('head').append(styleTag)
    }
}