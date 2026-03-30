"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueDisplayId = generateUniqueDisplayId;
async function generateUniqueDisplayId(prisma) {
    const latestLoad = await prisma.load.findFirst({
        where: {
            displayId: {
                startsWith: 'AA',
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            displayId: true,
        },
    });
    let nextNumber = 1;
    if (latestLoad && latestLoad.displayId) {
        const lastNumber = parseInt(latestLoad.displayId.substring(2), 10);
        nextNumber = lastNumber + 1;
    }
    const formattedNumber = nextNumber.toString().padStart(7, '0');
    return `AA${formattedNumber}`;
}
//# sourceMappingURL=generate-display-id.js.map