"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
class Item {
    constructor(distance) {
        this.distance = distance;
    }
    toString(s) {
        let ret = ("Имя " + s + " | ");
        for (let i = 0; i < this.distance.length; i++) {
            ret += `[${i + 1},  ${consts_1.showNumber(this.distance[i], 2)}] `;
        }
        return ret;
    }
}
exports.Item = Item;
