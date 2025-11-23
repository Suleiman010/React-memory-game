// Import testing utilities
import { renderHook, act } from "@testing-library/react";
// act ensures state updates are applied before we assert anything

import { useGameLogic } from "./useGameLogic";
import { test, vi } from "vitest";

// Import the custom hook we want to test

// Define a small, predictable set of card values for testing
const cardValues = ["🍎", "🍌", "🍎", "🍌"];
// Using a small array helps us test matches and flips easily

// ---------- TEST 1: Hook initialization ----------
test("initializes hook correctly", () => {
	// renderHook runs our hook and returns an object with `result.current`
	const { result } = renderHook(() => useGameLogic(cardValues));

	// Check that the hook correctly sets up the initial state

	// The cards array length should match the number of card values
	expect(result.current.cards.length).toBe(cardValues.length);

	// Score starts at 0
	expect(result.current.score).toBe(0);

	// Moves start at 0
	expect(result.current.moves).toBe(0);

	// No cards are matched yet, so winState should be false
	expect(result.current.winState).toBe(false);
});

// ---------- TEST 2: Flipping a card ----------
test("flips a card when clicked", () => {
	const { result } = renderHook(() => useGameLogic(cardValues));

	// Get the first card from the cards array
	const firstCard = result.current.cards[0];

	// Wrap any state-changing actions inside `act()`
	// This ensures React processes state updates synchronously for testing
	act(() => {
		result.current.handleCardClick(firstCard);
	});

	// After clicking, the first card should be flipped
	expect(result.current.cards[0].isFlipped).toBe(true);

	// Moves should increment by 1 after a card click
	expect(result.current.moves).toBe(1);
});

test("when there is a match", async () => {
	const { result } = renderHook(() => useGameLogic(cardValues));

	// 1. DYNAMICALLY FIND MATCHES (Fixing the Shuffle Problem)
	// Instead of hardcoding index 0 and 2, find two cards with the same value
	const firstCard = result.current.cards.find((c) => c.value === "🍎");
	const secondCard = result.current.cards.find(
		(c) => c.value === "🍎" && c.id !== firstCard.id
	);

	vi.useFakeTimers();

	// 2. SEPARATE ACT CALLS (Fixing the Batching Problem)
	// Click the first card
	act(() => {
		result.current.handleCardClick(firstCard);
	});

	// Click the second card
	// We use a separate act to ensure the state updates from the first click are processed
	act(() => {
		result.current.handleCardClick(secondCard);
	});

	// Run timers to handle the setTimeout inside the hook
	await act(async () => {
		vi.runAllTimers();
	});

	// 3. RE-FETCH STATE
	// We must look up the cards in the *current* result, not the old variables
	const updatedCard1 = result.current.cards.find((c) => c.id === firstCard.id);
	const updatedCard2 = result.current.cards.find((c) => c.id === secondCard.id);

	expect(updatedCard1.isMatched).toBe(true);
	expect(updatedCard2.isMatched).toBe(true);
	expect(result.current.score).toBe(1);

	// Note: Moves might be 1 or 2 depending on exactly when the state updated,
	// but usually it should be 2 here.
	expect(result.current.moves).toBe(2);

	vi.useRealTimers();
});

test("when 2 cards are clicked prevent clicking the third card", async () => {
	const { result } = renderHook(() => useGameLogic(cardValues));

	// 1. DYNAMICALLY FIND CARDS
	// Find two matching cards (Apples)
	const firstCard = result.current.cards.find((c) => c.value === "🍎");
	const secondCard = result.current.cards.find(
		(c) => c.value === "🍎" && c.id !== firstCard.id
	);
	// Find a third card (Banana) that is distinct from the first two
	const thirdCard = result.current.cards.find(
		(c) => c.id !== firstCard.id && c.id !== secondCard.id
	);

	vi.useFakeTimers();

	// 2. CLICK FIRST TWO CARDS
	act(() => {
		result.current.handleCardClick(firstCard);
	});

	act(() => {
		result.current.handleCardClick(secondCard);
	});

	// --- CRITICAL MOMENT ---
	// At this point, 2 cards are flipped, and the "match" timeout (500ms) is pending.
	// The logic `if (flippedCards.length > 1)` should now block interactions.

	// 3. ATTEMPT TO CLICK THIRD CARD
	act(() => {
		result.current.handleCardClick(thirdCard);
	});

	// 4. ASSERTIONS
	// We need to check the state *now*, before running timers.
	const updatedThirdCard = result.current.cards.find(
		(c) => c.id === thirdCard.id
	);

	// The third card should remain un-flipped
	expect(updatedThirdCard.isFlipped).toBe(false);

	// The moves count should still be 2 (the 3rd click was ignored)
	expect(result.current.moves).toBe(2);

	// 5. CLEANUP
	// Now we let the timers finish so the test ends cleanly
	await act(async () => {
		vi.runAllTimers();
	});

	vi.useRealTimers();
});
