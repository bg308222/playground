# Vue

## 踩雷篇
### Common
1. v-model 只在自己就是資料源頭時使用

### Store
1. 應將 store 視為和 localStorage 一樣的存在, 會提供 get, set 的方法, 但不該直接被終端使用者調用
2. 就像終端使用者不會直接去調用 localStorage, 而會包一層 composable, store 也該總是包一層 composable
3. 沒必要就不要用 store, 用 store 至少會遇到以下幾個幾個狀況, 都了解的人才該寫 store
    * store 只會進入一次, 如果初使化失敗, 只有重整或是手動 call reload function 才可以, 不會想每個終端使用者都要去 call
    * store 出來的值解構就會失去 reactivity, 必須要加上 storeToRef, 也不會想每個終端使用者都要去 call
    * 基於以上理由, store 應在包一層 composable, 代勞手動 call reload function 的部份, 必且處理完 storeToRef
4. 必須用 store 的狀況
    * 同一個頁面上, 至少有兩處會用到同一個資料, 且資料改變時每處都要跟著改
    * 資料很大需要 cache