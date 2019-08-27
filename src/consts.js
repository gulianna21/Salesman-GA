"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEM_N = 15;
exports.SET_N = 30;
exports.WEIGHT_MAX = 86;
exports.WEIGHT_REQUERID = 0.7;
exports.COST_REQUERID = 118; // Условия выхода
function random(from = 0, to = 0) {
    return (Math.floor(Math.random() * to) + from);
}
exports.random = random;
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.getRndInteger = getRndInteger;
function showNumber(num, fixed = 2, pointer = 2) {
    const a = new Intl.NumberFormat('Ru-ru', { minimumIntegerDigits: fixed, minimumFractionDigits: pointer });
    return a.format(num);
}
exports.showNumber = showNumber;
