import './polyfills'
import { BeaconErrorType, BeaconEvent, NetworkType, SigningType } from '@ecadlabs/beacon-dapp'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { packDataBytes } from '@taquito/michel-codec'
import { TezosToolkit } from '@taquito/taquito'

// Tezos X Previewnet (Michelson interface)
const NETWORK = NetworkType.TEZOSX_PREVIEWNET
const RPC_URL = 'https://michelson.previewnet.tezosx.nomadic-labs.com'
const BURN_ADDRESS = 'tz1burnburnburnburnburnburnburjAYjjX'

const wallet = new BeaconWallet({
  name: 'Taquito example dapp',
  network: { type: NETWORK, rpcUrl: RPC_URL },
})

const Tezos = new TezosToolkit(RPC_URL)
Tezos.setWalletProvider(wallet)

const status = document.querySelector<HTMLElement>('#status')!
const connectButton = document.querySelector<HTMLButtonElement>('#connect')!
const sendButton = document.querySelector<HTMLButtonElement>('#send')!
const signButton = document.querySelector<HTMLButtonElement>('#sign')!
const disconnectButton = document.querySelector<HTMLButtonElement>('#disconnect')!

function render(address?: string) {
  status.textContent = address ? `Connected: ${address}` : 'Not connected'
  connectButton.hidden = !!address
  sendButton.hidden = !address
  signButton.hidden = !address
  disconnectButton.hidden = !address
}

wallet.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, (account) => {
  render(account?.address)
})

connectButton.onclick = async () => {
  await wallet.requestPermissions()
}

sendButton.onclick = async () => {
  status.textContent = 'Waiting for the wallet...'
  try {
    const operation = await Tezos.wallet.transfer({ to: BURN_ADDRESS, amount: 1, mutez: true }).send()
    status.textContent = `Injected: ${operation.opHash}`
  } catch (error) {
    status.textContent = describeError(error)
  }
}

signButton.onclick = async () => {
  status.textContent = 'Waiting for the wallet...'
  try {
    const message = 'Tezos Signed Message: Hello world!'
    const { bytes } = packDataBytes({ string: message })
    const { signature } = await wallet.client.requestSignPayload({
      signingType: SigningType.MICHELINE,
      payload: bytes,
      sourceAddress: await wallet.getPKH(),
    })
    status.textContent = `Signed "${message}": ${signature}`
  } catch (error) {
    status.textContent = describeError(error)
  }
}

function describeError(error: unknown): string {
  const { errorType, message } = (error ?? {}) as { errorType?: string; message?: string }
  if (errorType === BeaconErrorType.ABORTED_ERROR) return 'Rejected in the wallet'
  if (errorType) return `Failed: ${errorType}`
  if (message) return `Failed: ${message}`
  return `Failed: ${String(error)}`
}

disconnectButton.onclick = async () => {
  await wallet.clearActiveAccount()
}
