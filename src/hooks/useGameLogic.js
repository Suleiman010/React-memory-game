import { useEffect, useState } from "react";

export const useGameLogic = (cardValues) => {
	const [cards, setCards] = useState([]);
	const [flippedCards, setFlippedCards] = useState([]);
	const [matchedCards, setMatchCards] = useState([]);
	const [score, setScore] = useState(0);
	const [moves, setMoves] = useState(0);

	const shuffleArray = (array) => {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	const initializeGame = () => {
		// skip the shuffling method
		const shuffled = shuffleArray(cardValues);
		const shuffledCards = shuffled.map((value, index) => ({
			id: index,
			value,
			isFlipped: false,
			isMatched: false,
		}));
		setMoves(0);
		setScore(0);
		setMatchCards([]);
		setFlippedCards([]);
		setCards(shuffledCards);
	};

	useEffect(() => {
		initializeGame();
	}, []);

	const handleCardClick = (card) => {
		// if the card is already flipped or if it is already mathced stop
		if (card.isMatched || card.isFlipped || flippedCards.length > 1) {
			return;
		}

		// flipe the card and then update the cards by mutating the entire array of cards again
		const newCards = cards.map((c) => {
			if (c.id === card.id) {
				return { ...c, isFlipped: true };
			} else {
				return c;
			}
		});

		setCards(newCards);

		// save flipped cards id
		const newFlippedCards = [...flippedCards, card.id];
		setFlippedCards(newFlippedCards);

		// if the cards length is 1 that means you have two cards flipped
		if (flippedCards.length === 1) {
			const firstCard = cards[flippedCards[0]];

			// Correct
			// check if the first card vlaue == to the current card value
			if (firstCard.value === card.value) {
				setTimeout(() => {
					setMatchCards((prev) => [...prev, firstCard.id, card.id]);

					setCards((prev) =>
						prev.map((c) => {
							if (c.id === card.id || c.id === firstCard.id) {
								return { ...c, isMatched: true };
							} else {
								return c;
							}
						})
					);

					setFlippedCards([]);
					setScore((prev) => prev + 1);
				}, 500);
			} else {
				// if not matched
				setTimeout(() => {
					// take the latest version of the cards array
					const flippedBackCard = newCards.map((c) => {
						if (newFlippedCards.includes(c.id) || c.id === card.id) {
							return { ...c, isFlipped: false };
						} else {
							return c;
						}
					});

					// mutate the cards back to the flipped state and clear the flipped function
					setCards(flippedBackCard);
					setFlippedCards([]);
				}, 500);
			}
		}
		setMoves((prev) => prev + 1);
	};

	const handleReset = () => {
		initializeGame();
	};
	const winState = matchedCards.length === cards.length;

	return {
		cards,
		score,
		moves,
		winState,
		initializeGame,
		handleReset,
		handleCardClick,
	};
};
