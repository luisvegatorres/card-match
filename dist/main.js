"use strict";
// Union type for valid card values (the three matching pairs)
var CardValue;
(function (CardValue) {
    CardValue["A"] = "A";
    CardValue["B"] = "B";
    CardValue["C"] = "C";
})(CardValue || (CardValue = {}));
// DOM element references
const board = document.querySelector("#board");
const attemptsEl = document.querySelector("#attempts");
const messageEl = document.querySelector("#message");
const restartBtn = document.querySelector("#restartBtn");
if (!board || !attemptsEl || !messageEl || !restartBtn) {
    throw new Error("Missing required DOM elements.");
}
// Game state variables
let cards = [];
let selectedCards = [];
let attemptsLeft = 3;
let matchedPairs = 0;
let isChecking = false;
// Array of card values - pairs of A, B, and C that will be shuffled
const cardValues = [CardValue.A, CardValue.A, CardValue.B, CardValue.B, CardValue.C, CardValue.C];
// Fisher-Yates shuffle algorithm - randomizes array order
function shuffle(array) {
    const copied = [...array];
    for (let i = copied.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [copied[i], copied[randomIndex]] = [copied[randomIndex], copied[i]];
    }
    return copied;
}
// Initialize a new game with reset state and shuffled cards
function createGame() {
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
function updateStatus(message) {
    attemptsEl.textContent = String(attemptsLeft);
    messageEl.textContent = message;
}
// Render all cards on the board, displaying values if flipped/matched or "?" if hidden
function renderBoard() {
    board.innerHTML = "";
    cards.forEach((card) => {
        const button = document.createElement("button");
        button.className = "card";
        button.dataset.id = String(card.id);
        button.disabled = card.isMatched || isChecking;
        if (card.isFlipped || card.isMatched) {
            button.classList.add("card--flipped");
            button.textContent = card.value;
        }
        else {
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
function handleCardClick(cardId) {
    if (isChecking)
        return;
    const card = cards.find((item) => item.id === cardId);
    if (!card)
        return;
    if (card.isFlipped || card.isMatched)
        return;
    if (selectedCards.length === 2)
        return;
    card.isFlipped = true;
    selectedCards.push(card);
    renderBoard();
    if (selectedCards.length === 2) {
        checkMatch();
    }
}
// Compare the two selected cards and handle match/mismatch logic
function checkMatch() {
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
        }
        else {
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
function revealAllCards() {
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
