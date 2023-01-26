import { useState } from 'react';
import { checkWord } from './dictionary';

export const useWordle = (solution: string) => {
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState<any[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const FLIP_ANIMATION_DURATION = 500;
    const DANCE_ANIMATION_DURATION = 500;

    const WORD_LENGTH = 5;

    function addWordleListener() {
        window.addEventListener('click', handleMouseClick, true);
        window.addEventListener('keydown', handleKeyDown, true);
    }

    function removeWordleListener() {
        window.removeEventListener('click', handleMouseClick, true);
        window.removeEventListener('keydown', handleKeyDown, true);
    }

    function handleMouseClick(event: MouseEvent) {
        const target = event.target as HTMLElement;

        if (target === null) return;

        if (target.matches('[data-key]')) {
            const key = target.dataset.key;

            if (key) pressKey(key);
            return;
        }

        if (target.matches('[data-enter]')) {
            submitGuess();
            return;
        }

        if (target.matches('[data-delete]')) {
            deleteGuessLetter();
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        const key = event.key;

        if (key === 'Enter') {
            submitGuess();
            return;
        }

        if (key === 'Backspace' || key === 'Delete') {
            deleteGuessLetter();
            return;
        }

        if (/^[A-Za-z]$/.test(key)) {
            pressKey(key);
            return;
        }
    }

    function pressKey(key: string) {
        const activeTiles = getActiveTiles() as NodeListOf<Element>;
        if (activeTiles?.length === WORD_LENGTH) return;

        // const guessGrid = document.querySelector('[data-guess-grid]');
        // const nextRow = guessGrid?.querySelector('[data-row-complete="false"]');
        // const nextTile = nextRow?.querySelector(':not([data-letter])');
        // nextTile?.setAttribute('data-letter', key.toLowerCase());
        // nextTile!.textContent = key;
        // nextTile?.setAttribute('data-state', 'active');

        setCurrentGuess((previous) => {
            return previous + key.toLowerCase();
        });
    }

    function getActiveTiles(type: string = '', bool: boolean = false) {
        const guessGrid = document.querySelector('[data-guess-grid]');

        if (type === 'row') {
            if (bool)
                return guessGrid?.querySelectorAll(
                    '[data-row-complete="true"]'
                );
            return guessGrid?.querySelector('[data-row-complete="false"]');
        }

        const activeTiles = guessGrid?.querySelectorAll(
            '[data-state="active"]'
        );

        return activeTiles;
    }

    function formatGuess(activeTiles: NodeListOf<Element>) {
        removeWordleListener();
        let solutionArray = solution.split('');

        let formattedGuess = currentGuess.split('').map((l) => {
            return { key: l, state: '' };
        });

        // const currentRow = getActiveTiles('row') as Element;
        // currentRow?.setAttribute('data-row-complete', 'true');

        // let currentGuessArray = currentGuess.split('');

        let arrayActiveTiles = Array.from(activeTiles);

        // const guess = arrayActiveTiles.reduce((acc: string, tile: Element) => {
        //     return acc + tile.getAttribute('data-letter')?.toLowerCase();
        // }, '');

        arrayActiveTiles.forEach((...params) => {
            flipTile(...params, solutionArray, formattedGuess);
        });
    }

    function submitGuess() {
        const activeTiles = getActiveTiles() as NodeListOf<Element>;

        if (activeTiles!.length < WORD_LENGTH) {
            shakeTiles(activeTiles!);
            showAlert('Your guess is too short!');
            return;
        }

        if (!checkWord(currentGuess)) {
            shakeTiles(activeTiles!);
            showAlert('That is not in the word list!');
            return;
        }
        // do not allow duplicate words
        if (history.includes(currentGuess)) {
            shakeTiles(activeTiles!);
            showAlert('You already guessed that word!');
            return;
        }

        formatGuess(activeTiles!);
    }

    function deleteGuessLetter() {
        // const activeTiles = getActiveTiles();
        // const lastTile = activeTiles![activeTiles!.length - 1];
        // if (lastTile === undefined) return;
        // lastTile.removeAttribute('data-letter');
        // lastTile.removeAttribute('data-state');
        // lastTile.textContent = '';

        setCurrentGuess(currentGuess.slice(0, -1));
    }

    function showAlert(message: string, duration: any = 1000) {
        const alertContainer = document.querySelector('[data-alert-container]');
        const alertMessage = document.createElement('div');
        alertMessage.classList.add('alert');
        alertMessage.textContent = message;
        alertContainer!.prepend(alertMessage);
        if (duration === null) return;

        setTimeout(() => {
            alertMessage.classList.add('hide');
            alertMessage.addEventListener(
                'transitionend',
                () => {
                    alertMessage.remove();
                },
                { once: true }
            );
        }, duration);
    }

    function shakeTiles(tiles: NodeListOf<Element>) {
        tiles.forEach((tile, i) => {
            tile.classList.add('shake');

            tile.addEventListener(
                'animationend',
                () => {
                    tile.classList.remove('shake');
                },
                { once: true }
            );
        });
    }

    function flipTile(
        tile: Element,
        index: number,
        array: Element[],
        // guess: string,
        solution: Array<string>,
        formattedGuess: Array<{ key: string; state: string }>
    ) {
        const key = currentGuess[index];
        const keyboard = document.querySelector('[data-keyboard]');
        const keyboardKey = keyboard?.querySelector(
            `[data-key="${key.toUpperCase()}"]`
        );

        setTimeout(() => {
            tile.classList.add('flip');
        }, (index * FLIP_ANIMATION_DURATION) / 2);

        tile.addEventListener(
            'transitionend',
            () => {
                tile.classList.remove('flip');

                if (currentGuess[index] === solution[index]) {
                    tile.setAttribute('data-state', 'correct');
                    formattedGuess[index].state = 'correct';
                    keyboardKey?.classList.add('correct');
                    solution[index] = 'null';
                } else if (solution.includes(currentGuess[index])) {
                    tile.setAttribute('data-state', 'wrong-location');
                    formattedGuess[index].state = 'wrong-location';
                    keyboardKey?.classList.add('wrong-location');
                } else {
                    tile.setAttribute('data-state', 'wrong');
                    formattedGuess[index].state = 'wrong';
                    keyboardKey?.classList.add('wrong');
                }

                if (index === array.length - 1) {
                    tile.addEventListener(
                        'transitionend',
                        () => {
                            addWordleListener();
                            checkWinLose(currentGuess, array, formattedGuess);
                        },
                        { once: true }
                    );
                }
            },
            { once: true }
        );
    }

    function checkWinLose(
        guess: string,
        array: Element[],
        formattedGuess: Array<{ key: string; state: string }>
    ) {
        if (guess === solution) {
            danceTiles(array);
            removeWordleListener();
            showAlert('You win!', 5000);
            return;
        }

        const allRow = getActiveTiles('row', true) as NodeListOf<Element>;
        if (allRow?.length === 5) {
            removeWordleListener();
            showAlert(
                `You lose! The answer is ${solution.toUpperCase()}`,
                null
            );
            return;
        }
        setHistory([...history, guess]);
        setCurrentGuess('');
        setGuesses((prev) => {
            return [...prev, formattedGuess];
        });
    }

    function danceTiles(tiles: Element[]) {
        tiles.forEach((tile, i) => {
            setTimeout(() => {
                tile.classList.add('dance');

                tile.addEventListener(
                    'animationend',
                    () => {
                        tile.classList.remove('dance');
                    },
                    { once: true }
                );
            }, (i * DANCE_ANIMATION_DURATION) / 5);
        });
    }

    return {
        addWordleListener,
        removeWordleListener,
        guesses,
        currentGuess,
    };
};
