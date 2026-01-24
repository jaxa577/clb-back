/**
 * Generates a sequential display ID in the format AA0000001
 * - 2 uppercase letters "AA" followed by 7 sequential digits
 * - Example: AA0000001, AA0000002, AA0000003
 */
export async function generateUniqueDisplayId(
  prisma: any
): Promise<string> {
  // Find the latest load with a displayId starting with "AA"
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
    // Extract the number part from the last ID (e.g., "AA0000001" -> "0000001")
    const lastNumber = parseInt(latestLoad.displayId.substring(2), 10);
    nextNumber = lastNumber + 1;
  }

  // Format the number with leading zeros to make it 7 digits
  const formattedNumber = nextNumber.toString().padStart(7, '0');

  return `AA${formattedNumber}`;
}
