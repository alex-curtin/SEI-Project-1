const search = document.querySelector('#search');
const notes = document.querySelector('#note');
const types = document.querySelector('#type');
const chartDisplay = document.querySelector('#chartDisplay');

const BASE_URL = "https://api.uberchord.com/v1/chords/";

//adding options to dropdown menus
//.replace('b', '&#9837') changes 'b' to the flat symbol
const scale = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
scale.forEach((note) => {
  notes.innerHTML += `<option id=${note}>${note.replace('b', '&#9837')}</option>`
});
let fretboardUnfiltered = [];

const typeList = [
  { name: 'maj', query: '' },
  { name: 'min', query: '_m' },
  { name: '7', query: '_7' },
  { name: 'maj7', query: '_maj7' },
  { name: 'min7', query: '_m7' }
];
typeList.forEach((chordType) => {
  types.innerHTML += `<option id=${chordType.query}>${chordType.name}</option>`
});

//This assigns a note to each fret. Right now it only works if
//the fretboard image is starting at fret 0.
//Will need to be tweaked for other fret starting positions.
//Temporarily displaying note names on fretboard for reference.
//Fix this function or incorporate into createChart()
const assignNotes = () => {
  const fretboardFiltered = [];
  fretboardUnfiltered.forEach((note, i) => {

    if (i > 20) {
      note.classList.add(`${scale[i - 21]}`);
      fretboardFiltered.push(note);
      const noteDisplay = document.createElement('p');
      noteDisplay.innerHTML = `${scale[i - 21]}`;
      note.append(noteDisplay);
    }
    else if (i === 20) {
      note.classList.add(`${scale[i - 9]}`);
      fretboardFiltered.push(note);
      const noteDisplay = document.createElement('p');
      noteDisplay.innerHTML = `${scale[i - 9]}`;
      note.append(noteDisplay);
    }
    else if (i >= 8) {
      note.classList.add(`${scale[i - 8]}`);
      fretboardFiltered.push(note);
      const noteDisplay = document.createElement('p');
      noteDisplay.innerHTML = `${scale[i - 8]}`;
      note.append(noteDisplay);
    }
    if (i < 8) {
      note.classList.add(`${scale[i + 4]}`);
      fretboardFiltered.push(note);
      const noteDisplay = document.createElement('p');
      noteDisplay.innerHTML = `${scale[i + 4]}`;
      note.append(noteDisplay);
    }
  })
  // console.log(fretboardFiltered);
}


//created chord chart - 5 rows (frets), 6 columns (strings)
//each space is assigned an id of l{num}
const createChart = () => {
  const chart = document.createElement('div');
  chart.classList.add('chart');
  let k = 0;
  //creating 6 strings each with 5 frets inside
  //each string is a div with 5 divs inside representing
  //fret locations. The k variable is used to assign each
  //location a unique numerical id
  for (let i = 1; i <= 6; i += 1) {
    const string = document.createElement('div');
    // string.innerHTML = `${i}`;
    string.classList.add('string');
    string.id = `string${i}`;
    for (let j = 0; j < 5; j += 1) {
      const fret = document.createElement('div');
      fret.innerHTML = `${i + j + k}`;
      fret.classList.add('loc');
      fret.id = `q${i + j + k}`;
      string.append(fret);
      fretboardUnfiltered.push(fret);
    }
    k += 4;
    chart.append(string);
  }

  chartDisplay.append(chart);
  // console.log(fretboardUnfiltered);
  assignNotes(fretboardUnfiltered);
}
createChart();


//hard-code test: adding fingering notation to chord chart
const formationTest = () => {
  // const fretPositions = [4, 8, 29];
  fretPositions.forEach((fretPosition) => {
    console.log(fretPosition)
    const fret = document.querySelector(`#q${fretPosition}`);
    console.log(fret);
    const fing = document.createElement('div');
    fing.classList.add('finger');
    fret.append(fing);
  })
}
// formationTest();

//hard code test to construct fingering
const createFretPositions = (fingerPositions, stringPositions) => {
  const fretPositions = [];
  stringPositions.forEach((stringPosition, i) => {
    if (stringPosition !== 'X') {
      const pressString = document.querySelector(`#string${i + 1}`);
      const posInt = parseInt(stringPosition, 10)
      console.log(posInt);
      const location = pressString.children[posInt];
      console.log(location);
    }
  })
}
createFretPositions(["X", "2", "3", "1", "X", "X"], ["0", "2", "2", "1", "0", "0"])

//Rendering data to chord chart
const render = (chord) => {
  const chordName = chord.chordName.split(',').join('').replace('b', '&#9837');
  const chordTones = chord.tones.split(',').join(' - ');
  const chordFingering = chord.fingering.split(' ');
  const chordStrings = chord.strings.split(' ');
  console.log(chordFingering);
  console.log(chordStrings);
  const el = document.createElement('div');
  el.innerHTML = `
  <h2>${chordName}</h2>
  <p>(${chordTones.replace(/b/g, '&#9837')})</p>`
  chartDisplay.append(el);
  createChart();
}

//Click event that gets data for selected chord
search.addEventListener('click', async () => {
  const noteSearch = notes[notes.selectedIndex].id;
  console.log(noteSearch);
  const typeSearch = types[types.selectedIndex].id;
  console.log(typeSearch);
  const response = await axios.get(`${BASE_URL}${noteSearch}${typeSearch}`)
  console.log(response);
  const chord = response.data[0];
  console.log(chord);
  render(chord);
})
