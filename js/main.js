const searchForm = document.querySelector('form.search');
const searchUl = document.querySelector('ul.search');
const buttonsUl = document.querySelector('.buttons');
const searchModal = document.querySelector('.modal');
const calendarForm = document.querySelector('form.calendar');
const addButton = document.querySelector('button.add');

const muscleObj = {
  biceps: 1,
  shoulders: 2,
  'serratus anterior': 3,
  chest: 4,
  triceps: 5,
  abs: 6,
  calves: 7,
  glutes: 8,
  traps: 9,
  quads: 10,
  hamstrings: 11,
  lats: '12,3',
  legs: '10,11,8,7',
  arms: '1,5,2',
  obliques: 14,
  soleus: 15
};

const muscleObjReverse = {
  1: 'Biceps',
  2: 'Shoulders',
  3: 'Serratus Anterior',
  4: 'Chest',
  5: 'Triceps',
  6: 'Abs',
  7: 'Calves',
  8: 'Glutes',
  9: 'Traps',
  10: 'Quads',
  11: 'Hamstrings',
  12: 'Lats',
  13: 'Brachialis',
  14: 'Obliques',
  15: 'Soleus'
};

const months = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12
};

const selectedWorkouts = {};
const workoutInfo = {};
let selectedDate = null;
let nextFetch = null;

searchForm.addEventListener('submit', getWorkouts);
calendarForm.addEventListener('submit', saveWorkouts);
searchUl.addEventListener('click', selectWorkout);
buttonsUl.addEventListener('click', modifySearchItems);

function saveWorkouts(event) {
  event.preventDefault();
  if (event.submitter.className === 'cancel') {
    searchModal.classList.add('hidden');
    selectedDate = null;
    return;
  }
  if (!selectedDate) return;
  if (event.submitter.className === 'submit') {
    for (const key in selectedWorkouts) selectedWorkouts[key] = workoutInfo[key];
    const month = (selectedDate[1].toString().length === 1)
      ? '0' + selectedDate[1].toString()
      : selectedDate[1].toString();
    const day = (selectedDate[0].toString().length === 1)
      ? '0' + selectedDate[0].toString()
      : selectedDate[0].toString();
    const date = Number(`${selectedDate[2]}${month}${day}`);
    selectedWorkouts.date = selectedDate;
    if (data.exercises[date]) data.exercises[date] = Object.assign({}, data.exercises[date], selectedWorkouts);
    if (!data.exercises[date]) data.exercises[date] = selectedWorkouts;
    searchModal.classList.add('hidden');
    selectedDate = null;
  }
}

function modifySearchItems(event) {
  if (event.target.matches('.add')) {
    addWorkouts();
  } else if (event.target.matches('.more')) {
    getWorkouts(null, nextFetch);
  }
}

function addWorkouts() {
  searchModal.classList.remove('hidden');

  /* eslint-disable-next-line */
  let myCalendar = new VanillaCalendar({
    selector: '#myCalendar',
    pastDates: false,
    availableWeekDays: [
      { day: 'monday' },
      { day: 'tuesday' },
      { day: 'wednesday' },
      { day: 'thursday' },
      { day: 'friday' },
      { day: 'saturday' },
      { day: 'sunday' }
    ],
    onSelect: (data, elem) => {
      const date = data.date.split(' ');
      selectedDate = [Number(date[2]), months[date[1]], Number(date[3])];
    }
  });
}

function selectWorkout(event) {
  const li = event.target.closest('li');
  const id = li.dataset.id;
  if (selectedWorkouts[id]) {
    delete selectedWorkouts[id];
    li.style.border = '1px solid #0e0e0e';
    if (!Object.keys(selectedWorkouts).length) addButton.classList.add('hidden');
  } else {
    selectedWorkouts[id] = li;
    li.style.border = '1px solid green';
    addButton.classList.remove('hidden');
  }
}

function getWorkouts(event, url) {
  let newData;

  if (event) {
    event.preventDefault();
    while (searchUl.lastElementChild) searchUl.lastElementChild.remove();
    buttonsUl.classList.remove('hidden');
    const input = event.target.elements.search.value;
    url = `https://wger.de/api/v2/exercise/?language=2&limit=5&muscles=${muscleObj[input]}`;
  }

  fetch('https://lfz-cors.herokuapp.com/?url=' + encodeURIComponent(url), {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(result => result.json())
    .then(data => {
      nextFetch = data.next;
      newData = cleanData(data);
      buildUl(newData);
      getImages(newData);
    })
    .catch(err => console.error(err));
}

function getImages(results) {
  let waitTime = 0;
  results.forEach((obj, index) => {
    if (!data.storedImages[obj.id]) {
      const url = `https://imsea.herokuapp.com/api/1?q=person_doing_${obj.name}_gym_workout`;

      fetch('https://lfz-cors.herokuapp.com/?url=' + encodeURIComponent(url), {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(result => result.json())
        .then(images => {
          data.storedImages[obj.id] = images.results[0];
          swapSpinner(images.results[0], obj.id);
        })
        .catch(() => {
          setTimeout(() => {
            getBackupImages(obj);
          }, waitTime);
          waitTime += 500;
        });
    } else {
      swapSpinner(data.storedImages[obj.id], obj.id);
    }
  });
}

function getBackupImages(obj) {
  fetch(`https://bing-image-search1.p.rapidapi.com/images/search?q=person_doing_${obj.name}_gym_workout`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '7554e57ef3msh1833d2c439a50a2p14b399jsnab00643335db',
      'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com'
    }
  }).then(result => result.json())
    .then(images => {
      if (!images.value) {
        swapSpinner('images/image-not-found.webp', obj.id);
        return;
      }
      const newImages = images.value.map(obj => obj.contentUrl);
      data.storedImages[obj.id] = newImages[0];
      swapSpinner(newImages[0], obj.id);
    })
    .catch(err => {
      swapSpinner('images/image-not-found.webp', obj.id);
      console.error(err);
    });
}

function cleanData(data) {
  const results = [];
  const flag = {};
  data.results.forEach(result => {
    if (!flag[result.id]) {
      flag[result.id] = true;
      result.description = result.description.replace(/<\/?(?:p|ol|li|ul|em|strong)[^>]*>/g, '').split('-').join('').replaceAll('\n', '. ').replaceAll('..', '.');
      results.push(result);
    }
  });
  return results;
}

function buildUl(data) {
  data.forEach(obj => {
    const muscles = (obj.muscles.length === 1)
      ? [obj.muscles[0], obj.muscles_secondary[0]]
      : [obj.muscles[0], obj.muscles[1]];
    const muscleArr = muscles.filter(x => x !== undefined);
    const desc = (obj.description === '' || obj.description.length < 10)
      ? 'No description received...'
      : obj.description;
    const content = {
      id: obj.id,
      description: desc,
      name: obj.name,
      muscles: muscleArr
    };
    workoutInfo[content.id] = content;
    searchUl.appendChild(buildLi(content));
  });
}

function buildLi(data) {
  const { id, name, description, muscles } = data;

  const muscleText = (muscles.length === 2)
    ? `(${muscleObjReverse[muscles[0]]}/${muscleObjReverse[muscles[1]]})`
    : (muscles.length === 1)
        ? `(${muscleObjReverse[muscles[0]]})`
        : null;

  const spinner = createSpinner(id);

  return buildElement('li', { class: 'search-item row', 'dataset-id': id }, [
    buildElement('div', { class: 'col' }, [
      spinner
    ]),
    buildElement('div', { class: 'col' }, [
      buildElement('div', { class: 'row' }, [
        buildElement('h3', { textContent: name.toUpperCase() }),
        buildElement('span', { textContent: muscleText })
      ]),
      buildElement('div', { class: 'row' }, [
        buildElement('span', { textContent: 'sets x reps' })
      ]),
      buildElement('div', { class: 'row' }, [
        buildElement('p', { textContent: description })
      ])
    ])
  ]);
}

function buildElement(tag, attr, children) {
  const el = document.createElement(tag);
  for (var key in attr) {
    if (key === 'textContent') {
      el.textContent = attr[key];
    } else if (key === 'dataset-id') {
      el.dataset.id = attr[key];
    } else if (key === 'dataset-view') {
      el.dataset.view = attr[key];
    } else if (key === 'dataset-date') {
      el.dataset.date = attr[key];
    } else {
      el.setAttribute(key, attr[key]);
    }
  }
  if (children) {
    children.forEach(child => {
      if (child) {
        el.appendChild(child);
      }
    });
  }
  return el;
}

function createSpinner(id) {
  return buildElement('div', { class: 'lds-ring', 'dataset-id': id }, [
    buildElement('div', {}),
    buildElement('div', {}),
    buildElement('div', {}),
    buildElement('div', {})
  ]);
}

function swapSpinner(img, id) {
  const image = (img) || '/images/image-not-found.webp';
  const spinner = searchUl.querySelector(`.lds-ring[data-id="${id}"]`);
  const papa = spinner?.parentElement;
  if (papa) {
    spinner.remove();
    papa.appendChild(buildElement('img', { src: image }));
  }
}
