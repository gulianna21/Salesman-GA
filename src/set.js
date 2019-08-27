"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
class MySet {
    constructor(items, _random = false) {
        this.items = items;
        this.genotype = [];
        this.distanceSum = 0;
        if (!_random)
            return;
        this.distanceSum = 0;
        let number_list = [];
        for (let i = 0; i < items.length; i++) {
            number_list.push(i);
        }
        for (let i = 0; i < items.length; i++) {
            let index = (consts_1.getRndInteger(0, number_list.length));
            this.genotype[i] = (number_list.splice(index, 1)[0]);
        }
        this.refresh();
    }
    copy() {
        const newSet = new MySet([...this.items]);
        newSet.genotype = [...this.genotype];
        newSet.distanceSum = this.distanceSum;
        return newSet;
    }
    show() {
        let str = '';
        for (let i = 0; i < this.genotype.length; i++) {
            str += consts_1.showNumber(this.genotype[i] + 1, 2, 0) + " ";
        }
        return ("Расстояние = " + consts_1.showNumber(this.distanceSum, 3, 2) + ' ' + str);
    }
    refresh() {
        this.distanceSum = 0;
        for (let i = 1; i < this.items.length; i++) {
            const city = this.genotype[i];
            const city1 = this.genotype[i - 1];
            this.distanceSum += this.items[city1].distance[city];
        }
        this.distanceSum += this.items[this.genotype[this.items.length - 1]].distance[this.genotype[0]];
    }
}
exports.MySet = MySet;
