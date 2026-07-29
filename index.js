const ws = new WebSocket("ws://localhost:3000");

const gameBoard = document.getElementById("game-container");
const BOARD_SIZE = 4;

function createBoard(shuffled_cards) {
  const board = document.getElementById("game-container");
  let i = 0;
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const cardElement = document.createElement("div");

      cardElement.dataset.x = x;
      cardElement.dataset.y = y;

      cardElement.className = "card";
      cardElement.id = `card-${x}-${y}`;

      cardElement.dataset.card_info = shuffled_cards[i];
      cardElement.textContent = "";
      i += 1;

      board.appendChild(cardElement)
    }
  }

  console.log("Board is created");
}

function handleClick(event) {
    if (event.target.tagName !== "DIV" || !event.target.dataset.x || !event.target.dataset.y) return;

    const x = Number(event.target.dataset.x);
    const y = Number(event.target.dataset.y);

  ws.send(JSON.stringify({ action: "TURN_CARD", x: x, y: y }));
}

document.addEventListener("click", (event) => handleClick(event))

ws.onmessage = (event) => {
  const parseData = JSON.parse(event.data);

  if (parseData.type === "GAME_START") {
    console.log("Server has sent the shuffled cards");
    createBoard(parseData.board);
    document.getElementById("player-playing").textContent = `Player ${parseData.startingTurn}'s Turn`;
  }

  else if (parseData.type === "TURN_CARD") {
    const cardElement = document.getElementById(`card-${parseData.x}-${parseData.y}`);
    cardElement.textContent = parseData.card_info;
  }

  else if (parseData.type === "MATCH_FOUND") {
    console.log("Match found!");
    document.getElementById(`card-${parseData.card1.x}-${parseData.card1.y}`).style.visibility = "hidden";
    document.getElementById(`card-${parseData.card2.x}-${parseData.card2.y}`).style.visibility = "hidden";

    document.getElementById("player-scores").textContent = `Player A: ${parseData.scores.A}, Player B: ${parseData.scores.B}`;
  }

  else if (parseData.type === "NO_MATCH") {
    console.log("No match. Switching turns.");
    document.getElementById(`card-${parseData.card1.x}-${parseData.card1.y}`).textContent = "";
    document.getElementById(`card-${parseData.card2.x}-${parseData.card2.y}`).textContent = "";

    document.getElementById("player-playing").textContent = `Player ${parseData.nextTurn}'s Turn`;
  }

  else if (parseData.type === "WINNER") {
    document.getElementById("winner-declare").textContent = `The winner is Player ${parseData.winner}`;
  }

  else if (parseData.type === "DRAW") {
    document.getElementById("winner-declare").textContent = `Draw`;
  }
};
