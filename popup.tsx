import { useEffect, useState } from "react"
import { processRequest } from "~common/process";
import browser from 'webextension-polyfill';

function IndexPopup() {
  const [data, setData] = useState({})

  browser.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      setData(request)
    }
  );

  const okla = async () => {
    const msg = await processRequest(data)
    console.log("🚀 ~ file: popup.tsx:16 ~ okla ~ msg:", msg)
    browser.runtime.sendMessage({
      from: 'popup',
      data: msg,
      isAccept: true
    });
    setTimeout(() => {
      window.close()
    }, 1000);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h1>{JSON.stringify(data)}</h1>
      <button onClick={okla}>
        okla
      </button>
    </div>
  )
}

export default IndexPopup
