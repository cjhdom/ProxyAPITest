insert into weight select NULL as weightNO, proxyServer.proxyServerNO, proxyServer.proxyServerName, proxyServer.proxyServerIDC, feServer.serverNO, feServer.serverName, feServer.serverIDC, service.serviceNO, service.serviceName, '0' as weight from proxyServer, feServer, service

update weight set weight = 1 where proxyServerIDC = serverIDC
