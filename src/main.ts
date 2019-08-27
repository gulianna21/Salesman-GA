import {Item} from './item';
import {getRndInteger, ITEM_N, SET_N, showNumber} from './consts';
import {MySet} from './set';

export class Main {
    age = 1;
    items: Item[] = new Array(ITEM_N);
    sets: MySet[] = [];

    constructor(private output?: (str: string) => void) {
    }

    outputText(...str: string[]) {
        if (!!this.output) {
            for (const s of str) {
                this.output(s);
            }
        }
        {
            console.log(...str);
        }
    }

    initSets() {
        for (let i = 0; i < SET_N; i++) {
            this.sets.push(new MySet(this.items, true));
        }
        //this.sets.sort((a, b) => b.sumCost - a.sumCost);
    }

    showItems() {
        this.outputText('Список городов:\n');
        for (let i = 0; i < this.items.length; i++) {
            this.outputText(this.items[i].toString(showNumber(i + 1, 2, 0)) + "\n");
        }
    }

    showSets(sets?: MySet[]) {
        const set = !!sets ? [...sets] : [...this.sets];
        set.sort((a, b) => a.distanceSum - b.distanceSum);
        for (let i = 0; i < set.length; i++) {
            this.outputText(set[i].show() + "\n");
        }
    }

    getBest(sets: MySet[]) {
        let min = 0;
        let minIndex = -1;
        for (let i = 0; i < sets.length; i++) {//WEIGHT_MAX = 86 // *0.8
            if (sets[i].distanceSum < min || i === 0) {
                min = sets[i].distanceSum;
                minIndex = i;
            }
        }
        return sets[minIndex];
    }

    choosePar() {
        const par = [];
        par[0] = this.sets[getRndInteger(0, SET_N)];
        do {
            par[1] = this.sets[getRndInteger(0, SET_N)];
        } while (par[0] === par[1]);
        return par;
    }


    chooseBestPar() {
        let select: MySet[] = [...this.sets];
        let S: MySet[] = [];
        do {
            const best = this.getBest(select);
            S.push(best);
            select.splice(select.indexOf(best), 1);
        } while (S.length < 2);
        return S;
    }

    doubleCross(s1: MySet, s2: MySet) {
        let res = new MySet(this.items);
        const length = s1.genotype.length;

        let [start, end] = this.generateStartEnd(length);


        let copyParent = getRndInteger(0, 2) === 0 ? s1 : s2;
        for (let i = start; i < end; i++) {
            res.genotype[i] = copyParent.genotype[i];
        }

        copyParent = copyParent === s1 ? s2 : s1;
        for (let x = end, i = 0; (x - end) < length - (end - start); i++) {
            const city = copyParent.genotype[(i + x) % length];
            if (res.genotype.includes(city)) {
                continue;
            }
            res.genotype[x++ % length] = city;
        }

        res.refresh();
        return res;
    }

    chunkSelcetedCross(s1: MySet, s2: MySet) {
        let res = new MySet(this.items);
        const length = s1.genotype.length;

        let [start, end] = this.generateStartEnd(length);

        let copyParent = getRndInteger(0, 2) === 0 ? s1 : s2;
        for (let i = start; i < end; i++) {
            res.genotype[i] = copyParent.genotype[i];
        }

        copyParent = copyParent === s1 ? s2 : s1;

        for (let i = end; (i - end) < length - (end - start); i++) {
            let city = copyParent.genotype[(i) % length];
            while (res.genotype.includes(city)) {
                const index = res.genotype.indexOf(city);
                city = copyParent.genotype[index];
            }

            res.genotype[i % length] = city;
        }

        res.refresh();
        return res;
    }

    generateStartEnd(lenght: number) {
        const rand = [getRndInteger(0, lenght), getRndInteger(0, lenght)];
        let start = Math.min(...rand);
        let end = Math.max(...rand);
        if (start === end) {
            end += 2;
        }
        if(end > lenght){
            start -=2;
            end -=2;
        }
        return [start, end];
    }

    inversionMutation(set: MySet) {// На интервале
        const newSet = set.copy();
        let [start, end] = this.generateStartEnd(set.genotype.length);
        newSet.genotype = [...set.genotype.slice(0, start), ...set.genotype.slice(start, end).reverse(), ...set.genotype.slice(end)];
        newSet.refresh();
        return newSet;
    }

    pointerMutation(set: MySet) {
        const bitIndex = getRndInteger(1, ITEM_N - 1);
        const randomPos = getRndInteger(0, 2);
        const newSet = set.copy();
        let modif = 1;
        if (randomPos === 0) {
            modif = -1;
        }
        [newSet.genotype[bitIndex], newSet.genotype[bitIndex + modif]] = [newSet.genotype[bitIndex + modif], newSet.genotype[bitIndex]];

        newSet.refresh();
        return newSet;
    }

    selectionRandom(childs: MySet[], m: number) {
        let res: MySet[] = new Array(m);
        let count = 0;
        let copyChild = [...childs];
        do {
            let rand = getRndInteger(0, copyChild.length);
            res[count++] = copyChild[rand];
            copyChild.splice(rand, 1);
        } while (count !== m);
        return res;
    }

    selectProportion(childs: MySet[], nextC: number) {
        let sumDist = 0;
        let midlCost;
        let C: MySet[] = [...childs];
        let S: MySet[] = [];
        for (const i of childs) {
            sumDist += i.distanceSum;
        }
        midlCost = sumDist / childs.length;
        do {
            let rand: number;
            rand = getRndInteger(0, sumDist);
            for (let i = 0; i < C.length; i++) {
                if (rand - C[i].distanceSum / midlCost < 0) {
                    S.push(C[i]);
                    C.splice(i, 1);
                    break;
                }
            }
        } while (S.length < nextC);
        return S;
    }

    bitturnir(childs: MySet[], nextChild: number, countChild = 4) {
        let C: Array<MySet> = [...childs];
        let S: Array<MySet> = [];
        let count = 0;
        do {
            let select: MySet[] = [];
            for (let i = 0; i < countChild; i++) {
                let rand = getRndInteger(0, C.length);
                select.push(C[rand]);
                C.splice(rand, 1);
            }
            const best = this.getBest(select);
            const index = select.indexOf(best);
            S[count] = select[index];
            select.splice(index, 1);
            C = [...C, ...select];
            count++;
        } while (count < nextChild);
        return S;
    }

    newPopulation(newP: MySet[]) {
        for (let i = 0; i < this.sets.length; i++) {
            this.sets[i] = newP[i];
        }
        this.age++;
    }

    end(lowEdge: number, best: MySet) {
        return best.distanceSum < lowEdge;
    }


}