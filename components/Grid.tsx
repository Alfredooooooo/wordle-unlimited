import Row from './Row';
import uuid from 'react-uuid';

const Grid = ({ guesses, currentGuess }: any) => {
    const currentFutureRow = [];

    const getRandomKey = () => {
        return uuid();
    };

    for (let i = 0; i < 6 - guesses.length; i++) {
        if (currentGuess !== '' && i === 0) {
            currentFutureRow.push(
                <Row currentGuess={currentGuess} key={getRandomKey()} />
            );
        } else {
            currentFutureRow.push(<Row key={getRandomKey()} />);
        }
    }

    return (
        <div data-guess-grid className="guess-grid">
            {guesses.map((arr: any, i: number) => {
                return <Row singleGuess={arr} key={getRandomKey()} />;
            })}
            {currentFutureRow}
        </div>
    );
};

export default Grid;
