"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxType = exports.TaxClassification = exports.TaxBase = void 0;
var TaxBase;
(function (TaxBase) {
    TaxBase[TaxBase["None"] = ''] = "None";
    TaxBase[TaxBase["Neto"] = 'Gravado'] = "Neto";
})(TaxBase || (exports.TaxBase = TaxBase = {}));
var TaxClassification;
(function (TaxClassification) {
    TaxClassification[TaxClassification["None"] = ''] = "None";
    TaxClassification[TaxClassification["Tax"] = 'Impuesto'] = "Tax";
    TaxClassification[TaxClassification["Withholding"] = 'Retención'] = "Withholding";
    TaxClassification[TaxClassification["Perception"] = 'Percepción'] = "Perception";
})(TaxClassification || (exports.TaxClassification = TaxClassification = {}));
var TaxType;
(function (TaxType) {
    TaxType[TaxType["None"] = ''] = "None";
    TaxType[TaxType["National"] = 'Nacional'] = "National";
    TaxType[TaxType["State"] = 'Provincial'] = "State";
    TaxType[TaxType["City"] = 'Municipal'] = "City";
})(TaxType || (exports.TaxType = TaxType = {}));
//# sourceMappingURL=taxes.js.map