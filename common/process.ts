import { parameter } from './../../taquito/packages/taquito-michelson-encoder/data/sample1';
import browser, { Runtime } from 'webextension-polyfill';
import { MessageType, TempleMessageType } from '~types';
import * as Actions from './action';
import * as Beacon from './beacon';

import { Storage } from "@plasmohq/storage"
import { Sotez, extractKeys, b58cencode, b58cdecode, prefix } from 'sotez'
import { TZKT_API_BASE_URLS } from '~constants';
const storage = new Storage()

const decryptMess = async (msg: any) => {
    try {
        if (msg.payload) return {
            payload: Beacon.decodeMessage(msg.payload),
            target: msg.target,
            targetId: msg.targetId
        }
        if (msg.encryptedPayload) {
            const senderPublicKey = await storage.get('publicKeyDapp');
            const payloadBase58 = await Beacon.decryptMessage(msg.encryptedPayload, senderPublicKey)
            return {
                encryptedPayload: Beacon.decodeMessage(payloadBase58),
                target: msg.target,
                targetId: msg.targetId
            }
        }
        else return msg
    }
    catch (err) {
        return
    }
}


export const processRequest = async (req: any, port?: Runtime.Port): Promise<any> => {
    const message = await decryptMess(req)
    console.log("🚀 ~ file: process.ts:37 ~ processRequest ~ message:", message)
    if (message.payload) return await processHandShake(message)
    if (message?.encryptedPayload.type === "permission_request") return await processConnect(message)
    //if (message?.encryptedPayload.type === "acknowledge") return await processAcknowledge(message, req)
    if (message?.encryptedPayload.type === "operation_request") return await processTransaction(message)

    return message
}

const processHandShake = async (req: any) => {
    const keyPair = await Beacon.getOrCreateKeyPair();

    const messagePayload = {
        version: req.payload.version,
        id: req.payload.id,
        senderId: await Beacon.getSenderId(),
        type: MessageType.HandshakeResponse,
        name: 'Temple - Tezos Wallet',
        icon: 'https://templewallet.com/logo.png',
        appUrl: chrome.runtime.getURL('popup.html'),
        publicKey: Beacon.toHex(keyPair.publicKey)
    }


    await storage.set('publicKeyDapp', req.payload.publicKey)

    const payload = await Beacon.sealCryptobox(
        JSON.stringify(messagePayload),
        Beacon.fromHex(req.payload.publicKey)
    )

    return {
        message: {
            payload: payload,
            target: 'toPage'
        },
        sender: {
            id: req.targetId
        }
    }
}

const processConnect = async (req: any) => {

    const messagePayload = {
        version: req.encryptedPayload.version,
        id: req.encryptedPayload.id,
        senderId: await Beacon.getSenderId(),
        type: MessageType.PermissionResponse,
        publicKey: 'edpkvZj9reBeoDc3kazxA5cs6AEYjAWoiFagzsW75srPWW89jKxLn3',
        network: req.encryptedPayload.network,
        scopes: req.encryptedPayload.scopes
    }

    const encodeMessage = Beacon.encodeMessage(messagePayload)
    const recipientPublicKey = await storage.get('publicKeyDapp');
    const okla = {
        message: {
            encryptedPayload: await Beacon.encryptMessage(encodeMessage, recipientPublicKey),
            target: 'toPage'
        },
        sender: {
            id: req.targetId
        }
    }

    const dataAcknowledge = await processAcknowledge(req)

    return {
        acknowledge: dataAcknowledge,
        encodeMessage: okla
    }
}

const processAcknowledge = async (req: any) => {
    const payloadAcknowledge = {
        version: req.encryptedPayload.version,
        id: req.encryptedPayload.id,
        senderId: await Beacon.getSenderId(),
        type: MessageType.Acknowledge,
    }
    const recipientPublicKey = await storage.get('publicKeyDapp');
    const encodeAcknowledge = Beacon.encodeMessage(payloadAcknowledge)
    const dataAcknowledge = {
        encryptedPayload: await Beacon.encryptMessage(encodeAcknowledge, recipientPublicKey),
        target: 'toPage',
        targetId: req.targetId
    }
    return dataAcknowledge
}

const processTransaction = async (message: any) => {
    const { network, operationDetails, sourceAddress } = message.encryptedPayload

    const rpcUrl =TZKT_API_BASE_URLS[network.type]
    console.warn("🚀 ~ file: process.ts:133 ~ processTransaction ~ rpcUrl:", rpcUrl)

    const provider = new Sotez(rpcUrl)
    provider.importKey(
        "edskRtQfigHbg2Gv3fWQwPZUNduyzmH4vhXa885atwqg79gbsUWgmNvkQ1Do9BPKoELybt7eaf7UjdYFo7PR18M2kmsXtFyMRu"
    )
    let hash = ""

    const transactionParam = operationDetails.map((item: any) => {
        return {
            ...item,
            fee: 7538,
            gas_limit: 70972,
            storage_limit: 300
        }
    })
    console.log("🚀 ~ file: process.ts:146 ~ transactionParam ~ transactionParam:", transactionParam)


    try {
        //const fullOp = await provider.prepareOperation({ operation: transactionParam });
        //console.log("🚀 ~ file: process.ts:154 ~ processTransaction ~ fullOp:", fullOp)
        const res = await provider.sendOperation({ operation: transactionParam });
        hash = res.hash
        console.log('dadwwwdwdwdwdwd', hash) 
    }
    catch(err){
        console.warn(err)
    }

    const messagePayload = {
        version: message.encryptedPayload.version,
        id: message.encryptedPayload.id,
        senderId: await Beacon.getSenderId(),
        type: MessageType.OperationResponse,
        transactionHash: hash
    }

    const encodeMessage = Beacon.encodeMessage(messagePayload)
    const recipientPublicKey = await storage.get('publicKeyDapp');
    const data = {
        message: {
            encryptedPayload: await Beacon.encryptMessage(encodeMessage, recipientPublicKey),
            target: 'toPage'
        },
        sender: {
            id: message.targetId
        }
    }


    const dataAcknowledge = await processAcknowledge(message)

    return {
        acknowledge: dataAcknowledge,
        encodeMessage: data
    }
}
