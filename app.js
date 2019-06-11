const search = document.querySelector('#search');
const notes = document.querySelector('#note');
const types = document.querySelector('#type');
const chartDisplay = document.querySelector('#chartDisplay');
const leftAside = document.querySelector('#leftAside');
const BASE_URL = "https://api.uberchord.com/v1/chords/";
leftAside.classList.add('invisible');
let startingFret;

//adding options to dropdown menus
//.replace('b', '&#9837') changes 'b' to the flat symbol
const scale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
scale.forEach((note) => {
  notes.innerHTML += `<option id=${note}>${note.replace('b', '&#9837')}</option>`
});

//adding options to type dropdown
//name: is how type is displayed on the dropdown
//query: is how type is appended to the API search URL
//TODO: use API to get list of all possible types and
//      create a function that will make this list 
//      automatically. Might be tricky because API's
//      search's are not standardized.
const typeList = [
  { name: 'maj', query: '' },
  { name: 'min', query: '_m' },
  { name: '7', query: '_7' },
  { name: 'maj7', query: '_maj7' },
  { name: 'min7', query: '_m7' },
  { name: '5', query: '_5' },
  { name: 'dim7', query: '_dim7' },
  { name: 'add9', query: '_add9' }
];
typeList.forEach((chordType) => {
  types.innerHTML += `<option id=${chordType.query}>${chordType.name}</option>`
});

//A function to assign a note to each location on the fretboard
const assignNotes = (fretboardUnfiltered, stringsArray) => {
  const fretboardFiltered = [];
  stringsArray.forEach((string, i) => {
  })
}

const createFretLocation = (startingFret) => {
  const fretLocation = document.createElement('div');
  fretLocation.classList.add('fretLocation');
  fretLocation.innerHTML = `FRET ${startingFret}`;
  chartDisplay.append(fretLocation);
}


//creates chord chart - 5 rows (frets), 6 columns (strings)
//each column has an id of 'string + number'
//each space is assigned an id of q{num}
const createChart = (chordStrings) => {
  const startingFret = findStartingFret(chordStrings);
  console.log(startingFret);
  let fretboardUnfiltered = [];
  const chart = document.createElement('div');
  chart.classList.add('chart');
  const stringsArray = [];
  let k = 0;
  //creating 6 strings each with 5 frets inside
  //each string is a div with 5 divs inside representing
  //fret locations. The k variable is used to assign each
  //location a unique numerical id
  for (let i = 1; i <= 6; i += 1) {
    const string = document.createElement('div');
    const stringImg = document.createElement('div');
    stringImg.classList.add('stringImg');
    // string.innerHTML = `${i}`;
    string.classList.add('string');
    string.id = `string${i}`;
    for (let j = 0; j < 5; j += 1) {
      const fret = document.createElement('div');
      fret.innerHTML = `${i + j + k}`;
      // this if statement assigns the class 'locOpen' to the 
      // first row if chart is starting at fret 0.
      console.log(startingFret);
      if (startingFret === 0 && j === 0) {
        fret.classList.add('locOpen');
      } else {
        fret.classList.add('loc');
      }
      fret.id = `q${i + j + k}`;
      string.append(fret);
      fretboardUnfiltered.push(fret);
    }
    k += 4;
    string.append(stringImg);
    chart.append(string);
    stringsArray.push(string);
  }
  if (startingFret > 0) {
    createFretLocation(startingFret);
  }
  chartDisplay.append(chart);
  assignNotes(fretboardUnfiltered, stringsArray);
}


//adding fingering notation to chord chart
//takes an array that represents locations on the fretboard
//and adds a marker ('<div id='finger'>) on each
const formation = (fretPositions, startingFret) => {
  // const fretPositions = ['q4', 'q8', 'q29'];

  fretPositions.forEach((fretPosition) => {
    const fret = document.querySelector(`#${fretPosition}`);
    const fing = document.createElement('div');
    const num = fretPosition.split('').splice(1, 2).join('');
    const int = parseInt(num, 10);
    if ((int + 4) % 5 === 0 && startingFret === 0) {
      fing.classList.add('openString')
    } else {
      fing.classList.add('finger');
    }
    fret.append(fing);
  })
}
// formation();

const muteString = (pressString) => {
  const mute = document.createElement('div');
  mute.innerHTML = 'X';
  mute.classList.add('mute');
  const muteLocation = pressString.firstChild;
  console.log(muteLocation);
  muteLocation.append(mute);
}

//Takes API's string position info and turns it into an
//array that can be interpreted by formation function
//fingerPostion is not currently being utilized but may be incorporated
//later
const createFretPositions = (fingerPositions, stringPositions) => {
  const startingFret = findStartingFret(stringPositions);
  const fretPositions = [];
  stringPositions.forEach((stringPosition, i) => {
    if (stringPosition !== 'X') {
      const pressString = document.querySelector(`#string${i + 1}`);
      const posInt = (parseInt(stringPosition, 10) - startingFret);
      const location = pressString.children[posInt];
      fretPositions.push(location.id);
    } else {
      const pressString = document.querySelector(`#string${i + 1}`);
      muteString(pressString);
    }
  })
  formation(fretPositions, startingFret)
}
// createFretPositions(["X", "2", "3", "1", "X", "X"], ["0", "2", "2", "1", "0", "0"])

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
    startingFretTemp = highestInt - 4;
  };
  return startingFretTemp;
}


//Rendering data to useable chord info
const render = (chord) => {
  chartDisplay.innerHTML = '';
  const chordName = chord.chordName.split(',').join('').replace('b', '&#9837');
  const chordTones = chord.tones.split(',').join(' - ');
  const chordFingering = chord.fingering.split(' ');
  const chordStrings = chord.strings.split(' ');
  const el = document.createElement('div');
  el.innerHTML = `
  <h2>${chordName}</h2>
  <p>(${chordTones.replace(/b/g, '&#9837')})</p>`
  chartDisplay.append(el);
  createChart(chordStrings);
  createFretPositions(chordFingering, chordStrings);
}

//Click event that gets data for selected chord
search.addEventListener('click', async () => {
  const noteSearch = notes[notes.selectedIndex].id;
  const typeSearch = types[types.selectedIndex].id;
  const response = await axios.get(`${BASE_URL}${noteSearch}${typeSearch}`)
  const chord = response.data[0];
  console.log(chord);
  render(chord);
  leftAside.classList.remove('invisible');
})
