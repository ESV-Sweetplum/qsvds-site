export function ratingFormula(ratings: number[]) {
    return ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length;
}
