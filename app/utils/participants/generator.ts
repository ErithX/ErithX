export function getFakeParticipantCount(seedString: string | number): string {
  // Simple hash function for seed to keep number consistent per contest
  let hash = 0;
  const str = String(seedString);
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Seeded random between 0 and 1
  const x = Math.sin(hash++) * 10000;
  const random = x - Math.floor(x);

  let num;
  if (random < 0.8) {
    // 80% chance: 70 to 8000
    num = Math.floor(70 + (random / 0.8) * (8000 - 70));
  } else {
    // 20% chance: 8000 to 20000
    const adjustedRandom = (random - 0.8) / 0.2;
    num = Math.floor(8000 + adjustedRandom * (20000 - 8000));
  }

  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
