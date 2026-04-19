// Union type for valid card values (the three matching pairs)
type CardValue = "A" | "B" | "C";

// Data structure representing a single card on the game board
interface CardData {
  id: number;
  value: CardValue;
  isFlipped: boolean;
  isMatched: boolean;
}

// DOM element references
const board = document.querySelector<HTMLDivElement>("#board");
const attemptsEl = document.querySelector<HTMLSpanElement>("#attempts");
const messageEl = document.querySelector<HTMLParagraphElement>("#message");
const restartBtn = document.querySelector<HTMLButtonElement>("#restartBtn");

if (!board || !attemptsEl || !messageEl || !restartBtn) {
  throw new Error("Missing required DOM elements.");
}

// Game state variables
let cards: CardData[] = [];
let selectedCards: CardData[] = [];
let attemptsLeft = 3;
let matchedPairs = 0;
let isChecking = false; // Prevents card interactions while checking for a match

// Array of card values - pairs of A, B, and C that will be shuffled
const cardValues: CardValue[] = ["A", "A", "B", "B", "C", "C"];

// Fisher-Yates shuffle algorithm - randomizes array order
function shuffle<T>(array: T[]): T[] {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[randomIndex]] = [copied[randomIndex], copied[i]];
  }

  return copied;
}