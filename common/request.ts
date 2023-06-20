// request from content to background 

import browser from 'webextension-polyfill';
export const request = async (data: any): Promise<any> => {
    // this.send({ type: MessageType.Req, data: payload, reqId });
    browser.runtime.sendMessage({...data,from:'content'})
    return new Promise((resolve, reject) => {
        const listener = (msg: any) => {
            console.log("🚀 ~ file: request.ts:11 ~ listener ~ msg:", msg)
            
            resolve(msg.data)
            browser.runtime.onMessage.addListener(listener)
        };

        browser.runtime.onMessage.addListener(listener)
    });
}