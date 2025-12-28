# Bitcoin JS 基础库 (btc.js) 功能框架

这是一个基于 Webpack 打包的比特币 JavaScript 基础库，旨在为开发者提供简洁、高效且符合最新标准的比特币功能接口。该库整合了 BIP39 (助记词)、BIP32 (分层确定性钱包) 以及支持 Segwit 和 Taproot 的地址处理能力。

---

## 🛠 功能架构

### 1. 钱包模块 (Wallet Module)
*   **助记词管理 (BIP39)**
    *   `generateMnemonic()`: 随机生成 12/24 位助记词。
    *   `validateMnemonic(mnemonic)`: 校验助记词合法性。
    *   `mnemonicToSeed(mnemonic)`: 将助记词转换为二进制种子。
*   **分层确定性钱包 (BIP32/BIP44)**
    *   `fromSeed(seed)`: 从种子创建根密钥对。
    *   `derivePath(path)`: 根据路径（如 `m/44'/0'/0'/0/0`）派生子密钥。
    *   `fromPrivateKey(privKey)`: 从原始私钥导入钱包。

### 2. 地址模块 (Address Module)
支持比特币主流的三种地址格式：
*   **Legacy (P2PKH)**: 以 `1` 开头的传统地址。
*   **Segwit (P2WPKH)**: 以 `bc1q` 开头的隔离见证地址，手续费更低。
*   **Taproot (P2TR)**: 以 `bc1p` 开头的最新协议地址，支持复杂脚本和更强隐私。

### 3. 加密与脚本模块 (Crypto & Script)
*   **ECDSA/Schnorr 签名**: 支持传统的椭圆曲线签名及 Taproot 所需的 Schnorr 签名。
*   **Taproot Tweak**: 处理 Taproot 地址派生所需的公钥微调逻辑。
*   **数据编码**: 支持 Hex, Base58Check, Bech32 等编码转换。

---

## 🚀 开发者快速上手

### 1. 安装与构建
```bash
npm install
npm run build
```

### 2. 基础使用 (前端)
在 HTML 中引入 `dist/btc.js` 后，通过全局对象 `btc` 调用：

```javascript
// 生成随机钱包
const mnemonic = btc.bip39.generateMnemonic();
const seed = await btc.bip39.mnemonicToSeed(mnemonic);
const root = btc.bip32.fromSeed(seed);
const child = root.derivePath("m/44'/0'/0'/0/0");

// 获取不同类型的地址
const pubKey = child.publicKey.toString('hex');
const address = await btc.address.generateAddress(pubKey, 'segwit');
console.log('Segwit Address:', address);
```

### 3. 后端集成 (Node.js)
```javascript
const btc = require('./server.js'); // 或者直接引用封装后的核心逻辑
// ... 详见 server.js 接口实现
```

---

## 📅 路线图 (Roadmap)

### 第一阶段：核心能力（已完成）
- [x] BIP39 助记词生成与校验。
- [x] BIP32/BIP44 路径派生。
- [x] Legacy, Segwit, Taproot 地址生成。
- [x] 私钥导入与公钥推导。

### 第二阶段：交易能力（规划中）
- [ ] **PSBT (BIP174)**: 部分签名的比特币交易支持。
- [ ] **UTXO 管理**: 自动选择和过滤未花费输出。
- [ ] **手续费计算**: 智能估计交易费。
- [ ] **广播交易**: 集成主流 Block Explorer 的 API。

### 第三阶段：高级功能（远期）
- [ ] **多重签名 (Multisig)**: 支持 P2WSH 和 Tapscript 多签。
- [ ] **闪电网络 (Lightning)**: 基础的通道管理与支付原型。
- [ ] **硬件钱包集成**: Ledger/Trezor 桥接。

---

## 📄 开源协议
MIT License

