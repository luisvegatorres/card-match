// Union type for valid card values (the three matching pairs)
enum CardValue {
  A = "A",
  B = "B",
  C = "C"
}

// Data structure representing a single card on the game board
interface CardData {
  id: number;
  value: CardValue;
  isFlipped: boolean;
  isMatched: boolean;
}

// DOM element references
const board = document.querySelector<HTMLDivElement>("#board")!;
const attemptsEl = document.querySelector<HTMLSpanElement>("#attempts")!;
const messageEl = document.querySelector<HTMLParagraphElement>("#message")!;
const restartBtn = document.querySelector<HTMLButtonElement>("#restartBtn")!;

if (!board || !attemptsEl || !messageEl || !restartBtn) {
  throw new Error("Missing required DOM elements.");
}

// Game state variables
let cards: CardData[] = [];
let selectedCards: CardData[] = [];
let attemptsLeft = 3;
let matchedPairs = 0;
let isChecking = false;

// Array of card values - pairs of A, B, and C that will be shuffled
const cardValues: CardValue[] = [CardValue.A, CardValue.A, CardValue.B, CardValue.B, CardValue.C, CardValue.C];

// Fisher-Yates shuffle algorithm - randomizes array order
function shuffle<T>(array: T[]): T[] {
  const copied = [...array];

  for (let i = copied.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[randomIndex]] = [copied[randomIndex], copied[i]];
  }

  return copied;
}

// Initialize a new game with reset state and shuffled cards
function createGame(): void {
  attemptsLeft = 3;
  matchedPairs = 0;
  selectedCards = [];
  isChecking = false;

  const shuffled = shuffle(cardValues);

  cards = shuffled.map((value, index) => ({
    id: index,
    value,
    isFlipped: false,
    isMatched: false,
  }));

  updateStatus("Find all 3 pairs in 3 attempts.");
  renderBoard();
}

// Update the game status display with current attempts and message
function updateStatus(message: string): void {
  attemptsEl.textContent = String(attemptsLeft);
  messageEl.textContent = message;
}

// Render all cards on the board, displaying values if flipped/matched or "?" if hidden
function renderBoard(): void {
  board.innerHTML = "";

  cards.forEach((card) => {
    const button = document.createElement("button");
    button.className = "card";
    button.dataset.id = String(card.id);
    button.disabled = card.isMatched || isChecking;

    if (card.isFlipped || card.isMatched) {
      button.classList.add("card--flipped");
      button.textContent = card.value;
    } else {
      button.textContent = "?";
    }

    if (card.isMatched) {
      button.classList.add("card--matched");
    }

    button.addEventListener("click", () => handleCardClick(card.id));
    board.appendChild(button);
  });
}

// Handle card click - flip the card and check for matches when 2 cards are selected
function handleCardClick(cardId: number): void {
  if (isChecking) return;

  const card = cards.find((item) => item.id === cardId);
  if (!card) return;

  if (card.isFlipped || card.isMatched) return;
  if (selectedCards.length === 2) return;

  card.isFlipped = true;
  selectedCards.push(card);
  renderBoard();

  if (selectedCards.length === 2) {
    checkMatch();
  }
}

// Compare the two selected cards and handle match/mismatch logic
function checkMatch(): void {
  isChecking = true;

  const [firstCard, secondCard] = selectedCards;

  if (firstCard.value === secondCard.value) {
    firstCard.isMatched = true;
    secondCard.isMatched = true;
    matchedPairs++;
    selectedCards = [];
    isChecking = false;

    if (matchedPairs === 3) {
      updateStatus("You won! All pairs matched.");
    } else {
      updateStatus("Match found!");
    }

    renderBoard();
    return;
  }

  attemptsLeft--;
  updateStatus("No match. Try again.");

  setTimeout(() => {
    firstCard.isFlipped = false;
    secondCard.isFlipped = false;
    selectedCards = [];
    isChecking = false;

    if (attemptsLeft <= 0) {
      revealAllCards();
      updateStatus("Game over. You ran out of attempts.");
    }

    renderBoard();
  }, 900);
}

// Reveal all remaining cards when the game ends
function revealAllCards(): void {
  cards.forEach((card) => {
    card.isFlipped = true;
  });
}

// Event listener for restart button to reset the game
restartBtn.addEventListener("click", () => {
  createGame();
});

// Initialize the game on page load
createGame();