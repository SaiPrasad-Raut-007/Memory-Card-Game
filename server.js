import { WebSocketServer } from "ws";
const PORT = 3000;

const wss = new WebSocketServer({ port: PORT });

const CARDS = [
  "💖", "🍎", "⚪", "🌲", "🐦", "🟠", "🤢", "👾", "💖", "🍎", "⚪", "🌲", "🐦", "🟠", "🤢", "👾",
]

let currentPlayer = "A";
let selectedCards = [];
let scores = {
  A: 0,
  B: 0
}
let shuffled_cards_info = [];

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array
}

function turnCard(player, x, y) {
  if (selectedCards.length >= 2) {
    return;
  }

  if (selectedCards.length === 1 && selectedCards[0].x === x && selectedCards[0].y === y) {
    return;
  }

  const index = (y * 4) + x;
  const selected_card = shuffled_cards_info[index];
  selectedCards.push({ card: selected_card, x: x, y: y });

  const turnCardMsg = JSON.stringify({
    type: "TURN_CARD",
    x: x,
    y: y,
    card_info: selected_card
  })

  players.A.send(turnCardMsg);
  players.B.send(turnCardMsg);

  if (selectedCards.length === 2) {
    const [card1, card2] = selectedCards;

    setTimeout(() => {
      if (card1.card === card2.card) {
        scores[currentPlayer] += 1;

        const matchMsg = JSON.stringify({
          type: "MATCH_FOUND",
          card1, card2, scores
        })

        players.A.send(matchMsg);
        players.B.send(matchMsg);

        if (scores.A + scores.B === 8 && scores.A !== scores.B) {
          const winnerMsg = JSON.stringify({
            type: "WINNER",
            winner: (scores.A > scores.B) ? "A" : "B"
          })

          players.A.send(winnerMsg);
          players.B.send(winnerMsg);
        } else if (scores.A + scores.B === 8) {
          const drawMsg = JSON.stringify({
            type: "DRAW"
          })

          players.A.send(drawMsg);
          players.B.send(drawMsg);
        }
      } else {
        switchPlayer();
        const noMatchMsg = JSON.stringify({
          type: "NO_MATCH",
          card1, card2, nextTurn: currentPlayer
        })

        players.A.send(noMatchMsg);
        players.B.send(noMatchMsg);

      }

      selectedCards = [];
    }, 1500);
  }
}

function switchPlayer() {
  if (currentPlayer === "A") {
    currentPlayer = "B"
  } else {
    currentPlayer = "A"
  }
}

let players = {
  A: null,
  B: null
}

wss.on("connection", (ws) => {
  console.log("Connected Successfully")

  if (players.A === null) {
    players.A = ws;
    ws.player_id = "A";
    console.log("Player A is logged in")
  } else if (players.B === null) {
    players.B = ws;
    ws.player_id = "B";
    console.log("Player B is logged in")
  } else {
    ws.send("The room is full.")
    ws.close();
    return;
  }

  if (players.A && players.B) {
    let shuffled_cards = shuffle(CARDS);
    const startMessage = JSON.stringify({
      type: "GAME_START",
      board: shuffled_cards
    });

    shuffled_cards_info = shuffled_cards;

    players.A.send(startMessage);
    players.B.send(startMessage);
  }

  ws.on("message", (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData.action === "TURN_CARD" && ws.player_id === currentPlayer) {
      turnCard(ws.player_id, parsedData.x, parsedData.y);
    }
  })
})
