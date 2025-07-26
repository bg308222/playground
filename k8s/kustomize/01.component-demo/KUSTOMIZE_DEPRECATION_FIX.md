# Kustomize 棄用欄位修復摘要

## 問題描述
在執行 `just build` 時，出現了多個 Kustomize 棄用警告：
- `patchesJson6902` 已被棄用，應使用 `patches` 替代
- `patchesStrategicMerge` 已被棄用，應使用 `patches` 替代

## 受影響的檔案
以下三個組件的 kustomization.yaml 檔案包含棄用欄位：
1. `components/external_db/kustomization.yaml`
2. `components/ldap/kustomization.yaml`
3. `components/recaptcha/kustomization.yaml`

## 修復內容

### 1. external_db 組件
**修復前：**
```yaml
patchesStrategicMerge:
  - configmap.yaml

patchesJson6902:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: example
  path: deployment.yaml
```

**修復後：**
```yaml
patches:
- path: configmap.yaml
  target:
    kind: ConfigMap
    name: conf
- path: deployment.yaml
  target:
    group: apps
    version: v1
    kind: Deployment
    name: example
```

### 2. ldap 組件
**修復前：**
```yaml
patchesStrategicMerge:
  - configmap.yaml

patchesJson6902:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: example
  path: deployment.yaml
```

**修復後：**
```yaml
patches:
- path: configmap.yaml
  target:
    kind: ConfigMap
    name: conf
- path: deployment.yaml
  target:
    group: apps
    version: v1
    kind: Deployment
    name: example
```

### 3. recaptcha 組件
**修復前：**
```yaml
patchesJson6902:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: example
  path: deployment.yaml
```

**修復後：**
```yaml
patches:
- path: deployment.yaml
  target:
    group: apps
    version: v1
    kind: Deployment
    name: example
```

## 語法轉換規則

### patchesStrategicMerge → patches
- 舊語法：直接列出 patch 檔案路徑
- 新語法：使用 `patches` 陣列，每個項目包含 `path` 和 `target`

### patchesJson6902 → patches
- 舊語法：包含 `target` 和 `path` 的物件
- 新語法：統一使用 `patches` 陣列格式

## 驗證結果
修復完成後，執行 `just build` 指令：
- ✅ 建置成功完成
- ✅ 沒有任何棄用警告
- ✅ 所有環境（community、dev、enterprise）都正常建置

## 建議
1. 定期檢查 Kustomize 版本更新和棄用通知
2. 使用 `kustomize edit fix` 指令可以自動修復某些棄用問題
3. 在 CI/CD 流程中加入棄用警告檢查

## 修復日期
2025-07-26

## 修復者
Roo (AI Assistant)