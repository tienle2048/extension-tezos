This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!

CONNECT

dapp -- extension  
    ping 
    {
        payload:"ping",
        target:'toExtension'
    }
                                                                                            pong
                                                                                            {
                                                                                                payload:"pong",
                                                                                                sender:{
                                                                                                    iconUrl:'dadwdawda',
                                                                                                    id:'adadada',
                                                                                                    name:'dadwwdwdwd'
                                                                                                },
                                                                                                target:'toPage'
                                                                                            }

------------------------------------------------------------------------------------------------------------------------------------------------------|

    ping {
        target:'toExtension',
        payload:'dadwdw', (encode base58)
                                            {
                                                id: 'dawdwd',
                                                type: 'postmessage-pairing-request',
                                                name: 'adwdawd',
                                                version: '3',
                                                publicKey: 'awdwdw' (key Dapp)
                                            }
        targetId:'dadwwdwdwd'
    }
    
                                                                                                    pong {
                                                                                                        message:{
                                                                                                            payload: (encode with key Dapp)  {
                                                                                                                "version":"3",
                                                                                                                "id":"1d4ce07c-900f-5014-7ee1-e619267c0977",
                                                                                                                "senderId":"HuYVAdvFo2wp",
                                                                                                                "type":"postmessage-pairing-response",
                                                                                                                "name":"Temple - Tezos Wallet",
                                                                                                                "icon":"https://templewallet.com/logo.png",
                                                                                                                "appUrl":"chrome-extension://jgcpgeapboagkkdkanaceddmodbcgikm/fullpage.html",
                                                                                                                "publicKey":"dadwdw" (key Extension)
                                                                                                            },
                                                                                                            target: 'toPage'
                                                                                                        },
                                                                                                        sender:{
                                                                                                            id:'dadwd'
                                                                                                        }
                                                                                                    }


------------------------------------------------------------------------------------------------------------------------------------------------------|



    {
        encryptedPayload:(base58 encode ->encode with key dapp ),{
            id: 'baa0165b-a9e7-929e-3178-6e330125e74e',
            version: '2',
            senderId: '2afoPCVyTa5ku',
            appMetadata: { 
                senderId: '2afoPCVyTa5ku',
                name: 'Taquito React template' 
            },
            type: 'permission_request',
            network: {
                type: 'ghostnet', 
                rpcUrl: 'https://ghostnet.ecadinfra.com'
            },
            scopes: [ 'operation_request', 'sign' ]
        }
        target:'toExtension',
        targetId;'adadw'
    }


                                                                                                        pong{
                                                                                                            message:{
                                                                                                                encryptedPayload:'dadw' (base58 encode ->encode with key extension){
                                                                                                                    version: '2',
                                                                                                                    senderId: 'HuYVAdvFo2wp',
                                                                                                                    id: 'baa0165b-a9e7-929e-3178-6e330125e74e',
                                                                                                                    type: 'acknowledge'
                                                                                                                },
                                                                                                                target:"toPage",
                                                                                                            }
                                                                                                            sender:{
                                                                                                                id:'awdwdwd'
                                                                                                            }
                                                                                                        }

------------------------------------------------------------------------------------------------------------------------------------------------------|

 ping{
    message:{
        encryptedPayload:'dadw' (base58 encode ->encode with key dapp){
            version: '2',
            senderId: 'HuYVAdvFo2wp',
            id: 'baa0165b-a9e7-929e-3178-6e330125e74e',
            type: 'acknowledge'
        },
        target:"toPage",
    }
    sender:{
        id:'awdwdwd'
    }
}

    
                                                                                                    pong
                                                                                                {
                                                                                                    message:{
                                                                                                        encryptedPayload:"adwdwdwdw", (base58 encode ->encode with key extension){
                                                                                                            {
                                                                                                                version: '2',
                                                                                                                id: 'baa0165b-a9e7-929e-3178-6e330125e74e',
                                                                                                                senderId: 'HuYVAdvFo2wp',
                                                                                                                type: 'permission_response',
                                                                                                                publicKey: 'edpkusdW8L2xMnTjLaNQ7UPucRvKfajpSWvPNnXJNo7KveVi9KDij1',
                                                                                                                network: { type: 'ghostnet', rpcUrl: 'https://ghostnet.ecadinfra.com' },
                                                                                                                scopes: [ 'operation_request', 'sign' ]
                                                                                                            }
                                                                                                        }
                                                                                                        target:'toPage'
                                                                                                    },
                                                                                                    sender:{
                                                                                                        id:'adwdwdwd'
                                                                                                    }
                                                                                                }

------------------------------------------------------------------------------------------------------------------------------------------------------|


SEND TRANSACTION


{
        encryptedPayload:(base58 encode ->encode with key dapp ),{
            "id":"693847b1-1090-dce9-f101-6ce9049ee5dc",
            "version":"2",
            "senderId":"2afoPCVyTa5ku",
            "type":"operation_request",
            "network":{
                "type":"ghostnet",
                "rpcUrl":"https://ghostnet.ecadinfra.com"
            },
            "operationDetails":[
                {
                    "kind":"transaction",
                    "amount":"0",
                    "destination":"KT1QMGSLynvwwSfGbaiJ8gzWHibTCweCGcu8", (address contract )
                    "parameters":{
                        "entrypoint":"increment",   (methods)
                        "value":{
                            "int":"1"
                        }
                    }
                }],
            "sourceAddress":"tz1MfxjW57SjB9oauuoa3wB1bCaejELgkY8Z"
        }
        target:'toExtension',
        targetId;'adadw'
    }



                                                                                                {
                                                                                                    message:{
                                                                                                        encryptedPayload:"adwdwdwdw", (base58 encode ->encode with key extension){
                                                                                                            version: '2',
                                                                                                            id: '693847b1-1090-dce9-f101-6ce9049ee5dc',
                                                                                                            senderId: 'HuYVAdvFo2wp',
                                                                                                            type: 'operation_response',
                                                                                                            transactionHash: 'oodv16AWhPrNAJehiKgcPg5VaYYtAgMxokAQRhr9QXDP1oRjkMf'
                                                                                                            }
                                                                                                        target:'toPage'
                                                                                                    },
                                                                                                    sender:{
                                                                                                        id:'adwdwdwd'
                                                                                                    }
                                                                                                }