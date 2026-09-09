// Beacon and Taquito expect Node's Buffer to exist in the browser. Vite does not
// polyfill it, so provide it here. This file must be imported before anything else.
import { Buffer } from 'buffer'

globalThis.Buffer = Buffer
