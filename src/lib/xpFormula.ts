import { Category } from "@prisma/client";

export function xpFormula(
    mapRating: number,
    category: Category,
    accuracy: number,
    rate: number
) {
    if (rate < 0.99) return 0;

    const thresholds = [0, 70, 80, 85, 90, 93, 95, 97, 98, 99, 100];
    const bias = [0, 0.1, 0.5, 0.6, 0.7, 0.77, 0.82, 0.9, 0.95, 1, 1];

    let bottom = 0;

    thresholds.forEach(t => {
        if (t < accuracy) bottom = t;
    });

    const tRange = [bottom, thresholds[thresholds.indexOf(bottom) + 1]];
    const bRange = tRange.map(t => bias[thresholds.indexOf(t)]);

    const ratingCoefficient = lerp(
        accuracy,
        tRange[0],
        tRange[1],
        bRange[0],
        bRange[1]
    );

    return ratingCoefficient * mapRating;
}

function lerp(v: number, s1: number, e1: number, s2: number, e2: number) {
    const p = (v - s1) / (e1 - s1);
    return (e2 - s2) * p + s2;
}
