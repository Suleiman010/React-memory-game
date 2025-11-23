export const WinMessage = ({ moves, score }) => {
	return (
		<div className="win-message">
			<h2>Congratulations!</h2>
			<p>
				You completed the game in {moves} your score is {score}
			</p>
		</div>
	);
};
