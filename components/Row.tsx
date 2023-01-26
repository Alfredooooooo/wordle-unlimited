import uuid from 'react-uuid';

const Row = ({ singleGuess, currentGuess }: any) => {
    const tileCurrentGuess = [];

    const getRandomKey = () => {
        return uuid();
    };

    if (currentGuess) {
        for (let i = 0; i < 5 - currentGuess.length; i++) {
            tileCurrentGuess.push(
                <div className="tile" key={getRandomKey()}></div>
            );
        }
    }

    if (singleGuess) {
        return (
            <div className="row" data-row-complete="true">
                {singleGuess.map((guessObject: any, i: number) => {
                    return (
                        <div
                            key={getRandomKey()}
                            className="tile"
                            data-state={`${guessObject.state}`}
                        >
                            {guessObject.key}
                        </div>
                    );
                })}
            </div>
        );
    }

    if (currentGuess) {
        return (
            <div className="row" data-row-complete="false">
                {currentGuess.split('').map((guess: string, i: number) => {
                    return (
                        <div
                            key={getRandomKey()}
                            className="tile"
                            data-state="active"
                        >
                            {guess}
                        </div>
                    );
                })}
                {tileCurrentGuess}
            </div>
        );
    }
    return (
        <div className="row" data-row-complete="false">
            <div className="tile"></div>
            <div className="tile"></div>
            <div className="tile"></div>
            <div className="tile"></div>
            <div className="tile"></div>
        </div>
    );
};

export default Row;
