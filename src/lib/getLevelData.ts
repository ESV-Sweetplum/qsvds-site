export default function getLevelData(xp: number): LevelDataResponse {
    let remainingXP = xp;
    let level = 0;

    let xpToNextLevel = 0;
    while (level < 50) {
        xpToNextLevel = getXPToNextLevel(level);
        if (remainingXP < xpToNextLevel) break;

        remainingXP -= xpToNextLevel;
        level++;
    }

    return {
        level,
        remainingXP: +remainingXP.toFixed(2),
        xpToNextLevel: +xpToNextLevel.toFixed(2),
    };
}

interface LevelDataResponse {
    level: number;
    remainingXP: number;
    xpToNextLevel: number;
}

function getXPToNextLevel(level: number) {
    const tenthRootOf3 = 1.11612317;
    let xpToNextLevel = 10 * level + 50;
    if (level < 10) xpToNextLevel = 50 * Math.pow(tenthRootOf3, level);

    return xpToNextLevel;
}
