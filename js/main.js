const searchForm = document.querySelector('form.search');

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

// var muscleObjReverse = {
//   1: 'Biceps',
//   2: 'Shoulders',
//   3: 'Serratus Anterior',
//   4: 'Chest',
//   5: 'Triceps',
//   6: 'Abs',
//   7: 'Calves',
//   8: 'Glutes',
//   9: 'Traps',
//   10: 'Quads',
//   11: 'Hamstrings',
//   12: 'Lats',
//   13: 'Brachialis',
//   14: 'Obliques',
//   15: 'Soleus'
// };

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
      buildElements(newData);
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
      results.push(result);
    }
  });
  return results;
}

function buildElements(data) {
  data.forEach(obj => {
    const muscles = (obj.muscles.length === 1)
      ? [obj.muscles[0], obj.muscles_secondary[0]]
      : [obj.muscles[0], obj.muscles[1]];
    buildElement({
      id: obj.id,
      description: obj.description,
      name: obj.name,
      muscles
    });
  });
}

function buildElement(data) {

}
