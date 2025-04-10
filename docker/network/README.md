1. 同一個 network 中, 每個 compose 的 <service> 都會被加進 DNS 中 => 單用 <service> 訪問可能都會得到不同的 IP
2. 同一個 network 中, 每個 compose 的 <container_name>.<network_name> 都會被加進 DNS 中, Ex: s1-app1.test-main-network-1