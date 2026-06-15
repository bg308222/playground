# Certbot 安裝 + 最簡使用指令

> 對象：用 Let's Encrypt + DNS-01（手動加 TXT）拿憑證的情境。
> 環境假設：Ubuntu 24.04 / WSL2，網域 DNS 託管在 GoDaddy（無官方 plugin → 走手動）。

---

## 1. 安裝 certbot

### 方法 A — apt（最簡單，本專案採用）

```bash
sudo apt update
sudo apt install -y certbot
certbot --version          # 確認，例如 certbot 2.9.0
```

### 方法 B — snap（官方最推薦，版本最新）

```bash
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
certbot --version
```

> 兩者擇一即可。WSL2 上 snap 偶有問題，apt 最穩。

---

## 2. 最簡簽發指令（DNS-01 手動）

### 觀念：哪些參數一定要給

- 「**選擇題**」certbot 會互動問你（網域、email、同意條款、EFF 訂閱）→ 可省略。
- 「**有預設值的設定**」certbot 不問、直接套預設 → 想改就**必須**寫：
  - `--preferred-challenges dns`（不寫預設走 http-01）
  - `--staging`（不寫預設打正式環境）

### 測試環境（先用這個練，不消耗正式額度）

```bash
sudo certbot certonly --manual --preferred-challenges dns --staging
```

certbot 會接著問你網域、email…，並在中途**暫停**印出要加的 TXT。

### 正式環境（流程跑順後，拿掉 --staging）

```bash
sudo certbot certonly \
  --manual \
  --preferred-challenges dns \
  -d pct.works \
  --agree-tos \
  -m jason.tai@innovue.ltd \
  --no-eff-email
```

### 一次簽多個網域 / wildcard

```bash
# 多網域（同一張憑證）
sudo certbot certonly --manual --preferred-challenges dns \
  -d pct.works -d www.pct.works

# wildcard（只能走 DNS-01）；wildcard 不含裸網域，要兩個都要就一起簽
sudo certbot certonly --manual --preferred-challenges dns \
  -d "*.pct.works" -d "pct.works"
```

---

## 3. 簽完之後

憑證檔位置：

```
/etc/letsencrypt/live/<網域>/
├── fullchain.pem   # 憑證鏈（web server 用這個）
├── privkey.pem     # 私鑰
├── cert.pem
└── chain.pem
```

常用檢查指令：

```bash
sudo certbot certificates                              # 列出所有憑證 + 到期日
sudo openssl x509 -in /etc/letsencrypt/live/pct.works/fullchain.pem \
  -noout -subject -issuer -dates -ext subjectAltName   # 看主旨/簽發者/期限/SAN
```

---

## 4. 續簽

Let's Encrypt 憑證有效期 **90 天**。

```bash
sudo certbot renew --dry-run     # 測試續簽流程
sudo certbot renew               # 實際續簽（會自動跳過還沒到期的）
```

> ⚠️ **`--manual` 簽的憑證不會自動續簽**。到期前要再跑一次原本的簽發指令、重新加 TXT。
> 想自動續簽，需改用 `--manual-auth-hook` 腳本（透過 DNS 商 API 自動寫 TXT），
> 或改用支援的 DNS plugin。GoDaddy API 受限，自動化較麻煩。

---

## 參考連結

- certbot 官方手冊：https://eff-certbot.readthedocs.io/en/stable/using.html
- certbot 安裝頁：https://certbot.eff.org/instructions
- Let's Encrypt rate limits：https://letsencrypt.org/docs/rate-limits/
