const searchForm = document.querySelector('form.search');
const searchUl = document.querySelector('ul.search');

var muscleObj = {
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

var muscleObjReverse = {
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

const tempStorage = {};

searchForm.addEventListener('submit', getWorkouts);

function getWorkouts(event) {
  event.preventDefault();

  const input = event.target.elements.search.value;
  const url = `https://wger.de/api/v2/exercise/?language=2&limit=5&muscles=${muscleObj[input]}`;
  let newData;

  fetch('https://lfz-cors.herokuapp.com/?url=' + encodeURIComponent(url), {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(result => result.json())
    .then(data => {
      newData = cleanData(data);
      buildUl(newData);
      getImages(newData);
    })
    .catch(err => console.error(err));
}

function getImages(results) {
  results.forEach((obj, index) => {
    const url = `https://imsea.herokuapp.com/api/1?q=person_doing_${obj.name}_exercise`;

    fetch('https://lfz-cors.herokuapp.com/?url=' + encodeURIComponent(url), {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result => result.json())
      .then(images => {
        obj.images = images.results;
        tempStorage[obj.id] = obj;
      })
      .catch(err => console.error(err));
  });
}

function cleanData(data) {
  const results = [];
  const flag = {};
  data.results.forEach(result => {
    if (!flag[result.id]) {
      flag[result.id] = true;
      result.description = result.description.replace(/<\/?p[^>]*>/g, '\n');
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
    searchUl.appendChild(buildLi({
      id: obj.id,
      description: desc,
      name: obj.name,
      muscles: muscleArr
    }));
  });
}

function buildLi(data) {
  const { id, name, description, muscles } = data;

  const muscleText = (muscles.length === 2)
    ? `(${muscleObjReverse[muscles[0]]}/${muscleObjReverse[muscles[1]]})`
    : (muscles.length === 1)
        ? `(${muscleObjReverse[muscles[0]]})`
        : null;

  return buildElement('li', { class: 'search-item row', 'dataset-id': id }, [
    buildElement('div', { class: 'col' }, [
      buildElement('img', { src: 'images/image-not-found.webp' })
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
