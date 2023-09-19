"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescriptionType = exports.PriceType = exports.EntryAmount = exports.TransactionMovement = exports.CodeAFIP = exports.CurrentAccount = exports.StockMovement = exports.Movements = void 0;
var Movements;
(function (Movements) {
    Movements[Movements["Inflows"] = 'Entrada'] = "Inflows";
    Movements[Movements["Outflows"] = 'Salida'] = "Outflows";
})(Movements || (exports.Movements = Movements = {}));
var StockMovement;
(function (StockMovement) {
    StockMovement[StockMovement["Inflows"] = 'Entrada'] = "Inflows";
    StockMovement[StockMovement["Outflows"] = 'Salida'] = "Outflows";
    StockMovement[StockMovement["Inventory"] = 'Inventario'] = "Inventory";
    StockMovement[StockMovement["Transfer"] = 'Transferencia'] = "Transfer";
})(StockMovement || (exports.StockMovement = StockMovement = {}));
var CurrentAccount;
(function (CurrentAccount) {
    CurrentAccount[CurrentAccount["Yes"] = 'Si'] = "Yes";
    CurrentAccount[CurrentAccount["No"] = 'No'] = "No";
    CurrentAccount[CurrentAccount["Charge"] = 'Cobra'] = "Charge";
})(CurrentAccount || (exports.CurrentAccount = CurrentAccount = {}));
class CodeAFIP {
}
exports.CodeAFIP = CodeAFIP;
var TransactionMovement;
(function (TransactionMovement) {
    TransactionMovement[TransactionMovement["Sale"] = 'Venta'] = "Sale";
    TransactionMovement[TransactionMovement["Purchase"] = 'Compra'] = "Purchase";
    TransactionMovement[TransactionMovement["Stock"] = 'Stock'] = "Stock";
    TransactionMovement[TransactionMovement["Money"] = 'Fondos'] = "Money";
})(TransactionMovement || (exports.TransactionMovement = TransactionMovement = {}));
var EntryAmount;
(function (EntryAmount) {
    EntryAmount[EntryAmount["CostWithoutVAT"] = 'Costo sin IVA'] = "CostWithoutVAT";
    EntryAmount[EntryAmount["CostWithVAT"] = 'Costo con IVA'] = "CostWithVAT";
    EntryAmount[EntryAmount["SaleWithoutVAT"] = 'Venta sin IVA'] = "SaleWithoutVAT";
    EntryAmount[EntryAmount["SaleWithVAT"] = 'Venta con IVA'] = "SaleWithVAT";
})(EntryAmount || (exports.EntryAmount = EntryAmount = {}));
var PriceType;
(function (PriceType) {
    PriceType[PriceType["Base"] = 'Precio Base'] = "Base";
    PriceType[PriceType["Final"] = 'Precio Final'] = "Final";
    PriceType[PriceType["SinTax"] = 'Precio Sin Impuestos'] = "SinTax";
})(PriceType || (exports.PriceType = PriceType = {}));
var DescriptionType;
(function (DescriptionType) {
    DescriptionType[DescriptionType["Code"] = 'Código'] = "Code";
    DescriptionType[DescriptionType["Description"] = 'Descripción'] = "Description";
    DescriptionType[DescriptionType["PosDescription"] = 'Descripción Corta'] = "PosDescription";
})(DescriptionType || (exports.DescriptionType = DescriptionType = {}));
//# sourceMappingURL=transaction-types.js.map