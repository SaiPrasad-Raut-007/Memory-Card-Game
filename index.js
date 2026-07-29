const gameBoard = document.getElementById("game-container");
const BOARD_SIZE = 4;

const CARDS = [
  "💖", "🍎", "⚪", "🌲", "🐦", "🟠", "🤢", "👾", "💖", "🍎", "⚪", "🌲", "🐦", "🟠", "🤢", "👾",
]

function createBoard() {
  const board = document.getElementById("game-container");
  shuffle(CARDS);
  let i = 0;
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const cardElement = document.createElement("div");

      cardElement.dataset.x = x;
      cardElement.dataset.y = y;

      cardElement.className = "card";
      cardElement.id = `card-${x}-${y}`;

      cardElement.dataset.card_info = CARDS[i];
      cardElement.textContent = "";
      i += 1;

      board.appendChild(cardElement)
    }
  }

  console.log("Board is created");
}

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

let selected_cards = [];

function turnCard(x, y) {
  const cardElement = document.getElementById(`card-${x}-${y}`);

  cardElement.textContent = cardElement.dataset.card_info;
  let selected_card = cardElement.dataset.card_info;

  if (selected_cards.length <= 2) {
    selected_cards.push(selected_card);
  }

  if (checkCards(selected_cards) && selected_cards.length > 1) {
    console.log("Found a match")

    const allCards = document.querySelectorAll('[data-card_info]');
    const matching = Array.from(allCards).filter(card => card.dataset.card_info === selected_cards[0]);

    matching.forEach((card) => {
      card.style.visibility = "hidden";
    })
    console.log(matching);
  }

  setTimeout(() => {
    const index = selected_cards.indexOf(selected_card);
    if (index > -1) {
      selected_cards.splice(index, 1);
    }
    cardElement.textContent = "";
  }, 1500)
}

function checkCards(cards) {
  let typesCardsAtHand = [...new Set(cards)];
  if (typesCardsAtHand.length === 1) {
    return true;
  }

  return false;
}

function handleClick(event) {
    if (event.target.tagName !== "DIV" || !event.target.dataset.x || !event.target.dataset.y) return;

    const x = Number(event.target.dataset.x);
    const y = Number(event.target.dataset.y);

    turnCard(x, y);
}

document.addEventListener("click", (event) => handleClick(event))

createBoard();
