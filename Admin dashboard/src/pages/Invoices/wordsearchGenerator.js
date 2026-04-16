export const generateWordSearch = (words, rows = 8, cols = 8) => {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(""));

  const directions = [
    { dr: 0, dc: 1 }, // →
    { dr: 1, dc: 0 }, // ↓
    { dr: 1, dc: 1 }, // ↘
  ];

  const placedWords = [];

  const canPlace = (word, r, c, dr, dc) => {
    for (let i = 0; i < word.length; i++) {
      const nr = r + dr * i;
      const nc = c + dc * i;

      if (
        nr < 0 ||
        nr >= rows ||
        nc < 0 ||
        nc >= cols ||
        (grid[nr][nc] !== "" && grid[nr][nc] !== word[i])
      ) {
        return false;
      }
    }
    return true;
  };

  const placeWord = word => {
    let placed = false;

    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const { dr, dc } =
        directions[Math.floor(Math.random() * directions.length)];

      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      if (canPlace(word, r, c, dr, dc)) {
        for (let i = 0; i < word.length; i++) {
          grid[r + dr * i][c + dc * i] = word[i];
        }

        placedWords.push({
          word: word.split(""),
          marker: [
            c,
            r,
            c + dc * (word.length - 1),
            r + dr * (word.length - 1),
          ],
        });

        placed = true;
      }
    }

    if (!placed) {
      console.warn("Could not place word:", word);
    }
  };

  // Place all words
  words.forEach(w => placeWord(w.toUpperCase()));

  // Fill empty cells
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return {
    table: grid,
    words: placedWords,
  };
};
