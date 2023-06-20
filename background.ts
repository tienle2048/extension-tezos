export { }

import browser from 'webextension-polyfill';
import { processRequest } from '~common/process';


var contentTabId;



function onError(error: any) {
    console.log(`Error: ${error}`);
}

let isAcceptConnect = true;

browser.runtime.onMessage.addListener(async (msg: any, sender: any, sendResponse: any) => {
    console.log("🚀 ~ file: background.ts:18 ~ browser.runtime.onMessage.addListener ~ msg:", msg)
    if (msg.from == "content") {  //get content scripts tab id
        contentTabId = sender.tab.id;
        
        if (isAcceptConnect) {
            const data = await processRequest(msg)
            browser.tabs.sendMessage(contentTabId, {  //send it to content script
                from: "background",
                data: data
            });
        }
        else {
            function onCreated(tab: any) {
                setTimeout(() => {
                    browser.runtime.sendMessage({ from: "background", ...msg })
                }, 1000)

            }
            browser.tabs.create({
                url: browser.runtime.getURL('popup.html')
            }).then(onCreated, onError)
        }
    }
    if (msg.from == "popup" && contentTabId) {  //got message from popup
        console.log("🚀 ~ file: background.ts:30 ~ browser.runtime.onMessage.addListener ~ msg:", msg)
        isAcceptConnect = msg.isAccept
        browser.tabs.sendMessage(contentTabId, {  //send it to content script
            from: "background",
            data: msg.data
        });
    }
});