"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionState = void 0;
var TransactionState;
(function (TransactionState) {
    TransactionState[TransactionState["Open"] = 'Abierto'] = "Open";
    TransactionState[TransactionState["Outstanding"] = 'Pendiente de pago'] = "Outstanding";
    TransactionState[TransactionState["PaymentConfirmed"] = 'Pago Confirmado'] = "PaymentConfirmed";
    TransactionState[TransactionState["PaymentDeclined"] = 'Pago Rechazado'] = "PaymentDeclined";
    TransactionState[TransactionState["Canceled"] = 'Anulado'] = "Canceled";
    TransactionState[TransactionState["Packing"] = 'Armando'] = "Packing";
    TransactionState[TransactionState["Closed"] = 'Cerrado'] = "Closed";
    TransactionState[TransactionState["Delivered"] = 'Entregado'] = "Delivered";
    TransactionState[TransactionState["Sent"] = 'Enviado'] = "Sent";
    TransactionState[TransactionState["Preparing"] = 'Preparando'] = "Preparing";
    TransactionState[TransactionState["Pending"] = 'Pendiente'] = "Pending";
})(TransactionState || (exports.TransactionState = TransactionState = {}));
//# sourceMappingURL=transaction.js.map