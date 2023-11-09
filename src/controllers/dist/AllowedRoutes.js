"use strict";
exports.__esModule = true;
exports.SetAlowedRoutes = void 0;
/**
 * SetAlowedRoutes
 * @param allowed String das rotas permitidas
 * @param protocol protocolo usado
 * @returns array de rotas permitidas
 */
function SetAlowedRoutes(allowed, protocol, port) {
    var allowedOrigins = [];
    var protocols = [];
    switch (protocol) {
        case 'http':
            protocols.push('http');
            break;
        case 'https':
            protocols.push('https');
            break;
        case 'http/https':
            protocols.push('http');
            protocols.push('https');
            break;
        default:
            break;
    }
    allowed.forEach(function (route) {
        protocols.forEach(function (protocol) {
            if (!route.startsWith('http://') && !route.startsWith('https://')) {
                allowedOrigins.push(protocol + "://" + route + ":" + port);
                allowedOrigins.push(protocol + "://" + route);
            }
            else {
                allowedOrigins.push(route);
            }
        });
    });
    return allowedOrigins;
}
exports.SetAlowedRoutes = SetAlowedRoutes;
