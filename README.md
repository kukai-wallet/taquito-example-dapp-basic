# Taquito example dapp (basic)

The smallest possible dapp that connects to [Kukai](https://kukai.app) on
[Tezos X Previewnet](https://previewnet.tezosx.nomadic-labs.com/) using
[Taquito](https://taquito.io) and Beacon. No framework, one TypeScript file.

It can connect, send 1 mutez to the burn address, and disconnect.

## Run it

```bash
npm install
npm run dev
```

Open the printed URL, click **Connect**, pick **Kukai** in Beacon's wallet
chooser, then **Use Browser**. Kukai Previewnet opens in a new tab and asks you
to approve the connection.

Get previewnet tez from the [faucet](https://faucet.previewnet.tezosx.nomadic-labs.com).

## What to copy

Everything that matters is in [`src/main.ts`](src/main.ts):

- **Network.** Taquito 25 ships ecadlabs' Beacon fork, which already has
  `NetworkType.TEZOSX_PREVIEWNET`. Pass it as the wallet's `network` together
  with the previewnet RPC URL. Kukai checks that this type matches the network
  it is built for.
- **Events.** Use `wallet.client.subscribeToEvent` to react to connects and
  disconnects. Do not pass `eventHandlers` in the wallet options for this; that
  replaces Beacon's own handler and its UI stops updating.
- **Buffer.** Beacon and Taquito expect Node's `Buffer` in the browser. Vite does
  not provide it, so [`src/polyfills.ts`](src/polyfills.ts) installs it first.

## Build

```bash
npm run build
```

The output in `dist/` is static and can be hosted anywhere.
