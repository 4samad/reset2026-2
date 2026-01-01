import { CheckInStatus } from '@/types';

const adjectives = [
  'quiet', 'steady', 'calm', 'gentle', 'curious', 'brave', 'peaceful',
  'bright', 'soft', 'warm', 'cool', 'wise', 'kind', 'strong', 'free',
  'blue', 'silver', 'golden', 'jade', 'amber', 'crystal'
];

const nouns = [
  'river', 'mountain', 'ocean', 'forest', 'panda', 'eagle', 'dolphin',
  'tiger', 'wolf', 'bear', 'hawk', 'owl', 'deer', 'fox', 'lion',
  'cloud', 'moon', 'star', 'sun', 'wind', 'rain', 'stone', 'tree',
  'lotus', 'bamboo', 'willow', 'pine', 'oak', 'maple', 'pineapple'
];

export function generateRandomUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}-${noun}`;
}

export function generateUsernameSuggestions(count: number = 3): string[] {
  const suggestions = new Set<string>();
  while (suggestions.size < count) {
    suggestions.add(generateRandomUsername());
  }
  return Array.from(suggestions);
}

export function getSupportiveMessage(status: CheckInStatus, consecutiveDays?: number): string {
  const messages = {
    relapsed: [
      "You showed up again. That matters.",
      "Relapse doesn't erase effort.",
      "Coming back is the hardest part.",
      "Recovery isn't linear. You're still here.",
      "Each return builds strength."
    ],
    struggled: [
      "You held on when it was hard.",
      "Resistance builds over time.",
      "Choosing to struggle means choosing to grow.",
      "You didn't give in. That counts.",
      "Small victories add up."
    ],
    strong: [
      "Stability builds slowly.",
      "You're building something real.",
      "Consistency matters more than perfection.",
      "This is what progress looks like.",
      "You're moving forward."
    ]
  };

  const messageList = messages[status];
  return messageList[Math.floor(Math.random() * messageList.length)];
}

export function formatDate(date: Date): string {
  // Use local timezone instead of UTC
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
