const gameBoard = document.getElementById("game-container");
const BOARD_SIZE = 4;

const CARDS = [
  "💖", "🍎", "⚪", "🌲", "🐦", "🟠", "🤢", "👾", "💖", "🍎", "⚪", "🌲", "🐦", "🟠", "🤢", "👾",
]

let alt = 0;
// Even for plater A and odd for player B
let player_clicked = 0;
let player_a_score = 0;
let player_b_score = 0;

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
  player_clicked += 1;
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

    updateScore();
    matching.forEach((card) => {
      card.style.visibility = "hidden";
    })
    console.log(matching);
  } else if (selected_cards.length >= 2) {
    console.log("Did not find a match, moving on to the next player");
    switchPlayer();

  }

  setTimeout(() => {
    const index = selected_cards.indexOf(selected_card);
    if (index > -1) {
      selected_cards.splice(index, 1);
    }
    cardElement.textContent = "";
    player_clicked -= 1;
  }, 1500)
}

function checkCards(cards) {
  let typesCardsAtHand = [...new Set(cards)];
  if (typesCardsAtHand.length === 1) {
    return true;
  }

  return false;
}

function switchPlayer() {
  let playing_info = document.getElementById("player-playing");
  alt += 1;

  if (alt % 2 === 0) {
    playing_info.textContent = "Player A's Turn";
  } else {
    playing_info.textContent = "Player B's Turn";
  }
}

function updateScore() {
  const score_board = document.getElementById("player-scores");
  if (alt % 2 === 0) {
    player_a_score += 1;
  } else {
    player_b_score += 1;
  }

  score_board.textContent = `Player A: ${player_a_score}, Player B: ${player_b_score}`;
}

function handleClick(event) {
    if (event.target.tagName !== "DIV" || !event.target.dataset.x || !event.target.dataset.y) return;

    const x = Number(event.target.dataset.x);
  const y = Number(event.target.dataset.y);

  if (player_clicked <= 2) {
    turnCard(x, y);
  }
}

let player_timer = setInterval(() => {
  switchPlayer();
}, 5000)


document.addEventListener("click", (event) => handleClick(event))

createBoard();
