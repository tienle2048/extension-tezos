
export { }
import { groupEnd } from 'console';
/**
 * Inject script, to provide access to window shared with FCL
 */
//"u7VtQTsJigoWAmx5qasW3f99gVcP3g3xndZEcmfXaZo9U5zq1hbjaNHxM6SFy6xPB5KQ7bEPvdRJxjn9ZMk3dhh7czehw2WZnMkVwAcjJwv4PftziFAU35Q2pqGih19AgUKvqznD3NnXvT9h7kDArjKKrEYfAvR257DKgM4sQm9Fi97VLVfckCjtSo7bfKq7KnNwBGoskms36iSzhPPavctYsti3mVrD1i4yXRzjHkn5Wmwbx2izX64uN6B7ZjmxpbzV5BpyvpANGct91x9LLfCq9AJv2WwW"
import browser from 'webextension-polyfill';
import { request } from '~common/request';


enum BeaconMessageTarget {
    Page = 'toPage',
    Extension = 'toExtension'
}

enum LegacyPageMessageType {
    Request = 'THANOS_PAGE_REQUEST',
    Response = 'THANOS_PAGE_RESPONSE',
    ErrorResponse = 'THANOS_PAGE_ERROR_RESPONSE'
}

interface LegacyPageMessage {
    type: LegacyPageMessageType;
    payload: any;
    reqId?: string | number;
}

type BeaconMessage =
    | {
        target: BeaconMessageTarget;
        payload: any;
    }
    | {
        target: BeaconMessageTarget;
        encryptedPayload: any;
    };
type BeaconPageMessage = BeaconMessage | { message: BeaconMessage; sender: { id: string } };

const SENDER = {
    id: browser.runtime.id,
    name: 'C98 - wallet',
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/10903.png'
};

function templeRequest(evt: MessageEvent, isLegacyRequest: boolean) {
    console.log("templeRequest")
}

const beaconRequest = (event: any) => {
    const { origin, data } = event;
    console.group()
    console.log(data)
    if (data.payload === 'ping') {
        const message = {
            target: "toPage",
            payload: "pong"
        }
        const msg = { ...message, sender: SENDER }
        send(msg, origin)
        return
    }

    request(data).then((data: any) => {
        if (data.acknowledge) {
            send(data.acknowledge, origin)
            setTimeout(() => {
                send(data.encodeMessage, origin)
            }, 500)

        }
        else {
            send(data, origin)
        }

    })




}
window.addEventListener("message", async (evt) => {
    console.group()
    console.log(evt, 'dadwd')
    if (evt.source !== window) return;
    console.log('odkawd')
    const legacyRequest = evt.data?.type === "THANOS_PAGE_REQUEST";
    const isTempleRequest = evt.data?.type === "TEMPLE_PAGE_REQUEST" || legacyRequest;
    const isBeaconRequest =
        evt.data?.target === "toExtension" && (evt.data?.targetId === SENDER.id || !evt.data?.targetId);

    console.log(legacyRequest, isTempleRequest, isBeaconRequest);
    if (isTempleRequest) {
        templeRequest(evt, legacyRequest);
    } else if (isBeaconRequest) {
        beaconRequest(evt);
    } else {
        return;
    }
}, false);

function send(msg: any, targetOrigin: string) {
    console.warn(msg)
    console.groupEnd()
    window.postMessage(msg, targetOrigin);
}
