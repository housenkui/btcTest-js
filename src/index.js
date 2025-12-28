import * as bitcoin from 'bitcoin-sdk-js';
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { Buffer } from 'buffer';

const bip32 = BIP32Factory(ecc);

// 确保全局 Buffer 可用
window.Buffer = Buffer;

// 将所有库暴露到全局 window 对象
window.btc = {
    ...bitcoin,
    bip39: bip39,
    bip32: bip32
};

console.log('Bitcoin SDK loaded with BIP39/BIP32 support');

