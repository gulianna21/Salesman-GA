import {Main} from './main';
import {Item} from './item';
import {MySet} from './set';
import {getRndInteger, ITEM_N, SET_N, showNumber, WEIGHT_MAX, WEIGHT_REQUERID} from './consts';

let start = document.getElementById('start');
if (start) {
    start.addEventListener('click', () => {

        const cross = document.getElementsByName('cross') as NodeListOf<HTMLInputElement>;
        const mutation = document.getElementsByName('mutation') as NodeListOf<HTMLInputElement>;
        const selection = document.getElementsByName('selection') as NodeListOf<HTMLInputElement>;
        const choose = document.getElementsByName('choose') as NodeListOf<HTMLInputElement>;
        const output = document.getElementById('output') as HTMLTextAreaElement;
        const input = document.getElementById('input') as HTMLTextAreaElement;
        run(getValueRadioButton(cross), getValueRadioButton(mutation), getValueRadioButton(selection), getValueRadioButton(choose), output, input.value);
    })
}
let calc = document.getElementById('calc');
if (calc) {
    calc.addEventListener('click', () => {
        const input = document.getElementById('input') as HTMLTextAreaElement;
        const path = document.getElementById('path') as HTMLInputElement;
        const result = document.getElementById('result') as HTMLDivElement;
        calculate(input.value, path.value, result)
    });
}

function getValueRadioButton(radios: NodeListOf<HTMLInputElement>) {
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            return (radios[i].value);
        }
    }
    return '';
}

function calculate(input: string, path: string, result: HTMLDivElement) {
    const rows = input.split('\n');
    let items = [];
    for (let i = 0; i < rows.length; i++) {
        items[i] = new Item(rows[i].split(' ').map(v => +v));
    }
    const genotype = path.split(' ').filter(a => a.trim().length > 0).map(i => +i);
    let distanceSum = 0;
    result.innerHTML = '';
    for (let i = 1; i <= genotype.length; i++) {
        const city = genotype[i % genotype.length];
        const city1 = genotype[(i - 1) % genotype.length];
        result.innerHTML += (`<div>distance: ${showNumber(distanceSum, 3, 2)}, city №1: ${showNumber(city1, 2,0)}, city №2: ${showNumber(city, 2, 0)}, distance: ${items[city1 - 1].distance[city - 1]}</div>`);
        distanceSum += items[city1 - 1].distance[city - 1];
    }
    result.innerHTML += `<div>result distance: ${showNumber(distanceSum, 3, 2)}</div>`;

}

export function run(cross: string, mutation: string, selection: string, choose: string, output: HTMLTextAreaElement, input: string) {
    output.value = '';
    let main = new Main((str) => {
        output.value += str;
    });
    main.outputText('INITIAL VALUE:\n');

    const rows = input.split('\n');
    for (let i = 0; i < rows.length; i++) {
        main.items[i] = new Item(rows[i].split(' ').map(v => +v));
    }

    main.showItems();
    main.initSets();
    main.outputText('\n');
    main.outputText('Стартовая популяция:\n');
    main.showSets();

    main.outputText('\n');

    do {
        main.outputText('Поколение: ' + main.age + '\n');
        main.outputText('\n');

        main.outputText('Лучший в поколении:');
        let best = main.getBest(main.sets);
        main.outputText(best.show() + '\n\n');
        let par;
        if (choose === '1') {
            main.outputText('Выбор случайных родителей:\n');
            par = main.choosePar();
        } else {
            main.outputText('Выбор лучших родителей\n');
            par = main.chooseBestPar();
        }

        main.outputText('Первый родитель:', par[0].show() + '\n');
        main.outputText('Второй родитель:', par[1].show() + '\n');

        let generate = [...main.sets];
        let mutants = 0;
        for (let i = 0; i < main.sets.length; i++) {
            if (cross === '1')
                generate.push(main.doubleCross(par[0], par[1]));
            else {
                generate.push(main.chunkSelcetedCross(par[0], par[1]));
            }
            const index = generate.length - 1;
            main.outputText('\n');
            main.outputText('child    ' + showNumber(i + 1 + mutants, 2, 0) + ':' + generate[index].show() + '\n');

            if (getRndInteger(0, 100) < 30) {
                if (mutation === '1') {
                    generate.push(main.pointerMutation(generate[index]));
                } else {
                    generate.push(main.inversionMutation(generate[index]));
                }
                main.outputText('mutation ' + showNumber(i + 1 + ++mutants, 2, 0) + ':' + generate[index + 1].show() + '\n');
            }
        }
        main.outputText('\n Get population from:\n');
        main.showSets(generate);

        if (selection === '1') {
            main.newPopulation(main.bitturnir(generate, SET_N));
        } else {
            main.newPopulation(main.selectionRandom(generate, SET_N));
        }
        main.outputText('Новая популяция:\n');
        main.showSets();
    } while (main.age < 20);
    main.outputText('\n\nРЕЗУЛЬТАТ:\n');
    main.showSets();
    main.outputText('\nЛучший:');
    const best = main.getBest(main.sets);
    main.outputText(best.show() + '\n');
    /*
     do {
         for (let i = 0; i < main.sets.length * 2; i++) {

         // child.sort((a, b) => b.sumCost - a.sumCost);
         main.outputText('\n Get population from:\n');
         main.showSets(child);
         if (selection === '1') {
             main.newPopulation(main.bitturnir(child, SET_N));
         } else {
             main.newPopulation(main.selectionRandom(child, SET_N));
         }

         // main.sets.sort((a, b) => b.sumCost - a.sumCost);
         main.outputText('Новая популяция:\n');
         main.showSets();

     } while (!main.end(WEIGHT_MAX, main.getBest()) && main.age < 30);
     main.outputText('\n\nРЕЗУЛЬТАТ:\n');
     main.showSets();
     main.outputText('\nЛучший:');
     const best = main.getBest();
     main.outputText(best.show() + '\n');*/

}