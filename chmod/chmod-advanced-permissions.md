# Linux chmod 進階權限教學

## 簡介

除了基本的讀取 (r)、寫入 (w)、執行 (x) 權限之外，Linux 檔案系統還提供了三種特殊權限位元：
- **SetUID (SUID)**：以檔案擁有者身分執行
- **SetGID (SGID)**：以群組身分執行或繼承群組
- **Sticky Bit**：限制刪除權限

這些進階權限提供了更精細的存取控制，在系統管理和安全性方面扮演重要角色。

## 特殊權限位元概述

### 權限位元結構
```
特殊權限位元 | 擁有者權限 | 群組權限 | 其他人權限
    4 2 1   |   4 2 1   |  4 2 1  |   4 2 1
    s s t   |   r w x   |  r w x  |   r w x
```

### 特殊權限位元值
- **4**: SetUID (SUID)
- **2**: SetGID (SGID)
- **1**: Sticky Bit

## SetUID (SUID)

### 概念說明
SetUID 權限允許使用者以檔案擁有者的身分執行程式，而不是以自己的身分執行。

### 視覺識別
- 在 `ls -l` 輸出中，擁有者執行權限位置顯示為 `s` 或 `S`
- `s`：同時具有執行權限和 SUID
- `S`：只有 SUID，沒有執行權限（無效設定）

### 設定方式
```bash
# 數字方式
chmod 4755 filename    # 設定 SUID + 755 權限
chmod u+s filename     # 符號方式新增 SUID

# 移除 SUID
chmod u-s filename
```

### 實際範例
```bash
# 檢視系統中的 SUID 程式
find /usr/bin -perm -4000 -type f 2>/dev/null

# 常見的 SUID 程式
ls -l /usr/bin/passwd   # -rwsr-xr-x (允許一般使用者修改密碼)
ls -l /usr/bin/sudo     # -rwsr-xr-x (允許提升權限)
```

### 使用場景
1. **密碼修改**：`passwd` 指令需要修改 `/etc/shadow`
2. **網路工具**：`ping` 需要建立 raw socket
3. **系統工具**：某些系統管理工具需要 root 權限

## SetGID (SGID)

### 對檔案的影響
程式執行時以檔案所屬群組的身分執行，而非使用者的主要群組。

### 對目錄的影響
在設定了 SGID 的目錄中建立的新檔案，會自動繼承該目錄的群組。

### 視覺識別
- 群組執行權限位置顯示為 `s` 或 `S`
- `s`：同時具有執行權限和 SGID
- `S`：只有 SGID，沒有執行權限

### 設定方式
```bash
# 數字方式
chmod 2755 filename    # 設定 SGID + 755 權限
chmod g+s filename     # 符號方式新增 SGID

# 對目錄設定 SGID
chmod g+s /shared/project
```

### 實際範例
```bash
# 建立共享專案目錄
mkdir /shared/project
chgrp developers /shared/project
chmod 2775 /shared/project

# 驗證效果
ls -ld /shared/project  # drwxrwsr-x developers

# 在該目錄建立檔案
touch /shared/project/newfile
ls -l /shared/project/newfile  # 群組會是 developers
```

## Sticky Bit

### 概念說明
Sticky Bit 主要用於目錄，限制只有檔案擁有者、目錄擁有者或 root 才能刪除或重新命名目錄中的檔案。

### 視覺識別
- 其他人執行權限位置顯示為 `t` 或 `T`
- `t`：同時具有執行權限和 Sticky Bit
- `T`：只有 Sticky Bit，沒有執行權限

### 設定方式
```bash
# 數字方式
chmod 1755 dirname     # 設定 Sticky Bit + 755 權限
chmod o+t dirname      # 符號方式新增 Sticky Bit
```

### 實際範例
```bash
# 檢視 /tmp 目錄
ls -ld /tmp            # drwxrwxrwt (典型的 Sticky Bit 應用)

# 建立測試目錄
mkdir /shared/temp
chmod 1777 /shared/temp
ls -ld /shared/temp    # drwxrwxrwt
```

### 使用場景
1. **臨時目錄**：`/tmp` 目錄允許所有人寫入，但只能刪除自己的檔案
2. **共享目錄**：多使用者環境中的共享工作空間

## 數字表示法

### 四位數字權限
```
特殊權限 | 擁有者 | 群組 | 其他人
   4     |   7   |  5  |   5    = 4755
   2     |   7   |  7  |   5    = 2775
   1     |   7   |  7  |   7    = 1777
   7     |   5   |  5  |   5    = 7555 (全部特殊權限)
```

### 常用組合
```bash
4755  # SUID + rwxr-xr-x
2755  # SGID + rwxr-xr-x
1755  # Sticky + rwxr-xr-x
6755  # SUID + SGID + rwxr-xr-x
7755  # 全部特殊權限 + rwxr-xr-x
```

## 符號表示法

### 設定特殊權限
```bash
# SetUID
chmod u+s filename
chmod u-s filename

# SetGID
chmod g+s filename
chmod g-s filename

# Sticky Bit
chmod o+t dirname
chmod o-t dirname

# 組合設定
chmod ug+s,o+t filename  # 同時設定 SUID、SGID 和 Sticky Bit
```

### 檢查權限
```bash
# 使用 stat 指令檢視詳細權限
stat -c "%a %n" filename  # 顯示八進位權限

# 使用 find 尋找特殊權限檔案
find /path -perm -4000  # 尋找 SUID 檔案
find /path -perm -2000  # 尋找 SGID 檔案
find /path -perm -1000  # 尋找 Sticky Bit 檔案
```

## 練習題

### 練習 1：基礎設定
1. 建立一個目錄 `/practice/shared`
2. 設定該目錄的權限為 2775 (SGID + rwxrwxr-x)
3. 在目錄中建立一個檔案，觀察其群組歸屬

### 練習 2：Sticky Bit 應用
1. 建立目錄 `/practice/temp`
2. 設定權限為 1777 (Sticky Bit + rwxrwxrwx)
3. 以不同使用者身分在目錄中建立檔案
4. 測試是否只能刪除自己的檔案

### 練習 3：權限組合
1. 建立一個檔案並設定權限為 6755 (SUID + SGID + rwxr-xr-x)
2. 使用 `stat` 指令檢視詳細權限資訊
3. 使用符號方式移除 SUID 權限

### 練習 4：安全性檢查
1. 尋找系統中所有的 SUID 檔案
2. 尋找系統中所有的 SGID 檔案
3. 檢查 `/tmp` 目錄的權限設定

### 解答提示
```bash
# 練習 1
mkdir -p /practice/shared
chmod 2775 /practice/shared
touch /practice/shared/testfile
ls -l /practice/shared/testfile

# 練習 2
mkdir -p /practice/temp
chmod 1777 /practice/temp
# 需要切換使用者測試

# 練習 3
touch testfile
chmod 6755 testfile
stat testfile
chmod u-s testfile

# 練習 4
find /usr -perm -4000 -type f 2>/dev/null
find /usr -perm -2000 -type f 2>/dev/null
ls -ld /tmp
```