/**
 * Generates a display ID in the format AA123456
 * - 2 uppercase letters followed by 6 digits
 * - Example: AB123456, XY987654
 */
export function generateDisplayId(): string {
  // Generate 2 random uppercase letters
  const letters = Array.from({ length: 2 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');

  // Generate 6 random digits
  const numbers = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');

  return `${letters}${numbers}`;
}

/**
 * Generates a unique display ID by checking against existing IDs
 */
export async function generateUniqueDisplayId(
  prisma: any,
  maxAttempts: number = 10
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const displayId = generateDisplayId();

    // Check if this ID already exists
    const existing = await prisma.load.findUnique({
      where: { displayId },
    });

    if (!existing) {
      return displayId;
    }
  }

  // If we couldn't find a unique ID after maxAttempts, throw an error
  throw new Error('Could not generate unique display ID');
}
