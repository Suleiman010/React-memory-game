import { useGameLogic } from "./hooks/useGameLogic";

import { GameHeader } from "./components/GameHeader";
import { Card } from "./components/Card";
import { WinMessage } from "./components/WinMessage";

const cardValues = [
	"🍎",
	"🍌",
	"🍇",
	"🍊",
	"🍓",
	"🥝",
	"🍑",
	"🍒",
	"🍎",
	"🍌",
	"🍇",
	"🍊",
	"🍓",
	"🥝",
	"🍑",
	"🍒",
];

function App() {
	const { cards, handleCardClick, score, moves, winState, handleReset } =
		useGameLogic(cardValues);
	return (
		<div className="app">
			<GameHeader score={score} moves={moves} onReset={handleReset} />

			{winState && <WinMessage score={score} moves={moves} />}
			<div className="cards-grid">
				{cards.map((card) => (
					<Card card={card} onClick={handleCardClick} key={card.id} />
				))}
			</div>
		</div>
	);
}

export default App;
