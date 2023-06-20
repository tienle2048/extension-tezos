import * as Beacon from './beacon'
import browser, { Runtime } from 'webextension-polyfill';
import { TempleDAppMessageType } from '~types';

const STORAGE_KEY = 'dapp_sessions';
const BEACON_ID = `temple_wallet_${browser.runtime.id}`;

export async function getAllDApps() {
    const dAppsSessions: any = (await browser.storage.local.get([STORAGE_KEY]))[STORAGE_KEY] || {};
    return dAppsSessions;
}
function setDApps(newDApps: any) {
    return browser.storage.local.set({ [STORAGE_KEY]: newDApps });
}

export async function removeDApp(origin: string) {
    const { [origin]: permissionsToRemove, ...restDApps } = await getAllDApps();
    await setDApps(restDApps);
    await Beacon.removeDAppPublicKey(origin);
    return restDApps;
}

export function sign(port: Runtime.Port, id: string, sourcePkh: string, bytes: string, watermark?: string) {
    return
}

export async function getBeaconMessage(origin: string, msg: string, encrypted = false) {
    let recipientPubKey: string | null = null;
    let payload = null;

    if (encrypted) {
        try {
            recipientPubKey = await Beacon.getDAppPublicKey(origin);
            console.log("🚀 ~ file: actions.ts:421 ~ getBeaconMessage ~ recipientPubKey:", recipientPubKey)

            if (!recipientPubKey) throw new Error('<stub>');

            try {
                console.log("🚀 ~ file: actions.ts:427 ~ getBeaconMessage ~ msg:", msg)
                msg = await Beacon.decryptMessage(msg, recipientPubKey);
                console.log("🚀 ~ file: actions.ts:427 ~ getBeaconMessage ~ msg:", msg)
            } catch (err: any) {
                await Beacon.removeDAppPublicKey(origin);
                throw err;
            }
        } catch {
            payload = {
                payload: Beacon.encodeMessage<Beacon.Response>({
                    version: '2',
                    senderId: await Beacon.getSenderId(),
                    id: 'stub',
                    type: Beacon.MessageType.Disconnect
                })
            };
        }
    }

    let req: Beacon.Request | null;
    try {
        req = Beacon.decodeMessage<Beacon.Request>(msg);
    } catch {
        req = null;
    }

    return {
        recipientPubKey,
        req,
        payload
    };
}

export async function processBeacon(
    origin: string,
    msg: string,
    encrypted = false
): Promise<any> {
    const { req, recipientPubKey, payload } = await getBeaconMessage(origin, msg, encrypted);
    console.log("🚀 ~ file: actions.ts:466 ~ req:", req)
    if (payload) {
        return payload;
    }
    if (!req) {
        return;
    }

    // Process Disconnect
    if (req.type === Beacon.MessageType.Disconnect) {
        await removeDApp(origin);
        return;
    }

    const resBase = {
        version: req.version,
        id: req.id,
        ...(req.beaconId ? { beaconId: BEACON_ID } : { senderId: await Beacon.getSenderId() })
    };

    // Process handshake
    if (req.type === Beacon.MessageType.HandshakeRequest) {
        await Beacon.saveDAppPublicKey(origin, req.publicKey);
        const keyPair = await Beacon.getOrCreateKeyPair();

        const oklaPayload = {
            ...resBase,
            ...Beacon.PAIRING_RESPONSE_BASE,
            publicKey: Beacon.toHex(keyPair.publicKey)
        }
        console.log("🚀 ~ file: actions.ts:499 ~ oklaPayload:", oklaPayload)
        const okla = await Beacon.sealCryptobox(
            JSON.stringify(oklaPayload),
            Beacon.fromHex(req.publicKey)
        )
        console.log("🚀 ~ file: actions.ts:498 ~ okla:", okla)
        return {
            payload: okla
        };
    }

    const res = await getBeaconResponse(req, resBase, origin);
    // const res = null;

    const resMsg = Beacon.encodeMessage<Beacon.Response>(res);
    if (encrypted && recipientPubKey) {
        return {
            payload: await Beacon.encryptMessage(resMsg, recipientPubKey),
            encrypted: true
        };
    }
    return { payload: resMsg };
}

const getBeaconResponse = async (req: Beacon.Request, resBase: any, origin: string): Promise<Beacon.Response> => {
    return 
};
