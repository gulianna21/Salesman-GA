import {Item} from './item';
import {getRndInteger, showNumber} from './consts';

export class MySet {
    genotype: Array<number> = [];
    distanceSum: number = 0;

    constructor(private items: Item[], _random = false) {
        if (!_random) return;
        this.distanceSum = 0;
        let number_list = [];
        for (let i = 0; i < items.length; i++) {
            number_list.push(i);
        }

        for (let i = 0; i < items.length; i++) {
            let index = (getRndInteger(0, number_list.length));
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

    public show() {
        let str = '';
        for (let i = 0; i < this.genotype.length; i++) {
            str += showNumber(this.genotype [i]+1, 2, 0)+ " ";
        }
        return ("Расстояние = " + showNumber(this.distanceSum, 3, 2) + ' ' + str);
    }

    public refresh() {
        this.distanceSum = 0;
        for (let i = 1; i < this.items.length; i++) {
            const city = this.genotype[i];
            const city1 = this.genotype[i-1];
            this.distanceSum += this.items[city1].distance[city];
        }
        this.distanceSum += this.items[this.genotype[this.items.length-1]].distance[this.genotype[0]];
    }

}