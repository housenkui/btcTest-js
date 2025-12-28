const express = require('express');
const path = require('path');
const bitcoin = require('bitcoin-sdk-js');
const bip39 = require('bip39');
const { BIP32Factory } = require('bip32');
const ecc = require('tiny-secp256k1');

const bip32 = BIP32Factory(ecc);
const app = express();
const PORT = 3000;

// 允许解析 JSON 请求体
app.use(express.json());
app.use(express.static(__dirname));

/**
 * 辅助函数：根据公钥生成所有类型的地址
 */
async function getAddresses(pubKey) {
    const legacyAddress = await bitcoin.address.generateAddress(pubKey, 'legacy');
    const segwitAddress = await bitcoin.address.generateAddress(pubKey, 'segwit');
    
    const schnorrPubkey = pubKey.slice(2);
    const tapTweak = await bitcoin.tapscript.getTapTweak(schnorrPubkey);
    const tapTweakedPubkey = await bitcoin.tapscript.getTapTweakedPubkey(schnorrPubkey, tapTweak);
    const taprootAddress = await bitcoin.address.generateAddress(tapTweakedPubkey.tweakedPubKey, 'taproot');

    return {
        legacy: legacyAddress,
        segwit: segwitAddress,
        taproot: taprootAddress
    };
}

/**
 * 1. 随机生成钱包接口
 */
app.get('/api/generate-wallet', async (req, res) => {
    try {
        const mnemonic = bip39.generateMnemonic();
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = bip32.fromSeed(seed);
        const path = "m/44'/0'/0'/0/0";
        const child = root.derivePath(path);
        
        const privKey = child.privateKey.toString('hex');
        const pubKey = child.publicKey.toString('hex');
        const addresses = await getAddresses(pubKey);

        res.json({
            status: 'success',
            data: { mnemonic, path, privateKey: privKey, publicKey: pubKey, addresses }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * 2. 导入助记词生成钱包接口
 */
app.post('/api/import-mnemonic', async (req, res) => {
    const { mnemonic, path = "m/44'/0'/0'/0/0" } = req.body;
    if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
        return res.status(400).json({ status: 'error', message: '无效的助记词' });
    }

    try {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = bip32.fromSeed(seed);
        const child = root.derivePath(path);
        
        const privKey = child.privateKey.toString('hex');
        const pubKey = child.publicKey.toString('hex');
        const addresses = await getAddresses(pubKey);

        res.json({
            status: 'success',
            data: { mnemonic, path, privateKey: privKey, publicKey: pubKey, addresses }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * 3. 导入私钥生成钱包接口
 */
app.post('/api/import-privkey', async (req, res) => {
    const { privateKey } = req.body;
    if (!privateKey) {
        return res.status(400).json({ status: 'error', message: '请提供私钥' });
    }

    try {
        // 尝试通过 tiny-secp256k1 从私钥推导公钥
        const privBuffer = Buffer.from(privateKey, 'hex');
        const pubBuffer = ecc.pointFromScalar(privBuffer, true); // true 为压缩公钥
        if (!pubBuffer) throw new Error('无效的私钥');

        const pubKey = Buffer.from(pubBuffer).toString('hex');
        const addresses = await getAddresses(pubKey);

        res.json({
            status: 'success',
            data: { privateKey, publicKey: pubKey, addresses }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Bitcoin Node 服务已启动！`);
    console.log(`🔗 演示页面: http://localhost:${PORT}`);
    console.log(`📡 API 接口: http://localhost:${PORT}/api/generate-wallet\n`);
});

