export const ITEM_N = 15;
export const SET_N = 30;
export const WEIGHT_MAX = 86;
export const WEIGHT_REQUERID = 0.7;
export const COST_REQUERID = 118; // Условия выхода

export function random(from = 0, to = 0){
    return (Math.floor(Math.random() * to) + from);
}

export function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export function showNumber(num: number, fixed: number = 2, pointer = 2) {
    const a = new Intl.NumberFormat('Ru-ru', {minimumIntegerDigits: fixed, minimumFractionDigits: pointer});
    return a.format(num);
}