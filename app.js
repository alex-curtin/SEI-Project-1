const search = document.querySelector('#search');
const notes = document.querySelector('#note');
const types = document.querySelector('#type');
const chartDisplay = document.querySelector('#chartDisplay');
const leftAside = document.querySelector('#leftAside');
const BASE_URL = "https://api.uberchord.com/v1/chords/";
leftAside.classList.add('invisible');
chartDisplay.classList.add('invisible');
let startingFret;

//add options to dropdown menus
//.replace('b', '&#9837') changes 'b' to the flat symbol
const scale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
scale.forEach((note) => {
  notes.innerHTML += `<option id=${note}>${note.replace('b', '&#9837')}</option>`
});


//add options to type dropdown
//name: is how type is displayed on the dropdown
//query: is how type is appended to the API search URL
const typeList = [
  { name: 'maj', query: '' },
  { name: 'min', query: '_m' },
  { name: '5', query: '_5' },
  { name: '7', query: '_7' },
  { name: 'maj7', query: '_maj7' },
  { name: 'min7', query: '_m7' },
  { name: '6', query: '_6' },
  { name: 'sus2', query: '_sus2' },
  { name: 'sus4', query: '_sus4' },
  { name: 'add9', query: '_add9' },
  { name: 'dim', query: '_dim' },
  { name: 'dim7', query: '_dim7' },
];
typeList.forEach((chordType) => {
  types.innerHTML += `<option id=${chordType.query}>${chordType.name}</option>`
});

//Creates marker that notes starting fret, for non-open chords.
const createStartingFret = (startingFret) => {
  const fretLocation = document.createElement('div');
  fretLocation.classList.add('fretLocation');
  fretLocation.innerHTML = `FRET ${startingFret}`;
  chartDisplay.append(fretLocation);
};

//create chord chart - 5 rows (frets), 6 columns (strings)
//each column has an id of 'string + number'
//each space is assigned an id of q{num}
const createChart = (chordStrings) => {
  const startingFret = findStartingFret(chordStrings);
  const fretboardFull = [];
  const chart = document.createElement('div');
  chart.classList.add('chart');
  const stringsArray = [];
  let k = 0;
  for (let i = 1; i <= 6; i += 1) {
    const string = document.createElement('div');
    const stringImg = document.createElement('div');
    stringImg.classList.add('stringImg');
    string.classList.add('string');
    string.id = `string${i}`;
    for (let j = 0; j < 5; j += 1) {
      const fret = document.createElement('div');
      fret.innerHTML = `${i + j + k}`;
      if (startingFret === 0 && j === 0) {
        fret.classList.add('locOpen');
      } else {
        fret.classList.add('loc');
      }
      fret.id = `q${i + j + k}`;
      string.append(fret);
      fretboardFull.push(fret);
    }
    k += 4;
    string.append(stringImg);
    chart.append(string);
    stringsArray.push(string);
  }
  if (startingFret > 0) {
    createStartingFret(startingFret);
  }
  chartDisplay.append(chart);
};

//adding fingering notation to chord chart
//takes an array that represents locations on the fretboard
//and adds a marker ('finger' or 'openString') on each
const formation = (fretPositions, startingFret) => {
  fretPositions.forEach((fretPosition) => {
    const fret = document.querySelector(`#${fretPosition}`);
    const fing = document.createElement('div');
    const num = fretPosition.split('').splice(1, 2).join('');
    const int = parseInt(num, 10);
    if ((int + 4) % 5 === 0 && startingFret === 0) {
      fing.classList.add('openString');
    } else {
      fing.classList.add('finger');
    }
    fret.append(fing);
  });
};

//add a marker ('x') on strings that are muted
const muteString = (pressString) => {
  const mute = document.createElement('div');
  mute.innerHTML = '<span>X</span>';
  mute.classList.add('mute');
  const muteLocation = pressString.firstChild;
  muteLocation.append(mute);
};

//handle chords that start above fret 0 but have open
//notes in them.
const dealWithCrazyChord = (pressString) => {
  const fret = pressString.firstChild;
  const fing = document.createElement('div');
  fing.classList.add('openString');
  fret.append(fing);
};

//Takes API's string position info and turns it into an
//array that can be interpreted by formation() function
const createFretPositions = (stringPositions) => {
  const startingFret = findStartingFret(stringPositions);
  const fretPositions = [];
  stringPositions.forEach((stringPosition, i) => {
    if (stringPosition !== 'X') {
      const pressString = document.querySelector(`#string${i + 1}`);
      const posInt = parseInt(stringPosition, 10);
      const posFinal = posInt - startingFret;
      if (posFinal < 0) {
        dealWithCrazyChord(pressString);
      } else {
        const location = pressString.children[posFinal];
        fretPositions.push(location.id);
      }
    } else {
      const pressString = document.querySelector(`#string${i + 1}`);
      muteString(pressString);
    }
  });
  formation(fretPositions, startingFret)
};

//Determines what fret position the chord chart should start at.
//Pull any X's out of chordStrings array, convert strings to ints,
//return highest int, if highest int is > 4, starting fret is
//highest int - 4
const findStartingFret = (chordStrings) => {
  const onlyNums = chordStrings.filter(chordString => chordString !== 'X');
  const onlyInts = onlyNums.map(num => parseInt(num, 10));
  const highestInt = Math.max(...onlyInts);
  let startingFretTemp = 0;
  if (highestInt > 4) {
    startingFretTemp = highestInt - 3;
  }
  return startingFretTemp;
};


//Convert data to useable chord info
const convertData = (chord) => {
  chartDisplay.innerHTML = '';
  const chordName = chord.chordName.split(',').join('').replace('b', '&#9837 ');
  const chordTones = chord.tones.split(',').join(' - ');
  const chordStrings = chord.strings.split(' ');
  const el = document.createElement('div');
  el.innerHTML = `
  <h2>${chordName}</h2>
  <p>(${chordTones.replace(/b/g, '&#9837')})</p>`;
  chartDisplay.append(el);
  createChart(chordStrings);
  createFretPositions(chordStrings);
};

//Click event that gets data for selected chord
search.addEventListener('click', async () => {
  const noteSearch = notes[notes.selectedIndex].id;
  const typeSearch = types[types.selectedIndex].id;
  const response = await axios.get(`${BASE_URL}${noteSearch}${typeSearch}`);
  const chord = response.data[0];
  console.log(chord);
  convertData(chord);
  chartDisplay.classList.remove('invisible');
  leftAside.classList.remove('invisible');
});
