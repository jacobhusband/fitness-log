// #region variable initialization
var $workoutModal = document.querySelector('.workout-modal');
var $plusIcon = document.querySelector('.plus-icon-container');
var $nav2 = document.querySelector('.nav-2');
var $emptyContent = document.querySelector('.no-content');
var $newExercisesContainer = document.querySelector('.new-exercises-container');
var $upcomingWorkoutsContainer = document.querySelector(
  '.upcoming-workouts-container'
);
var $nav1SearchContainer = document.querySelector('.nav-1-search-container');
var $modalContent = document.querySelector('.workout-modal-content');
var $modalSearchAndResultContainer = $modalContent.querySelector(
  '.modal-search-and-result'
);
var $modalSearchContainer = $modalContent.querySelector(
  '.modal-search-container'
);
var $modalSearchResultContainer = $modalSearchContainer.nextElementSibling;

var $infoModal = document.querySelector('.info-modal');
var $descriptionTitle = $infoModal.querySelector('.description-title');
var $descriptionText = $infoModal.querySelector('.description-text');
var searchString = null;
var dateInput = null;
var dateButton = null;
var addButton = null;
var searched = false;
var dateValid = false;
var searchResultSelectionCount = 0;
var tempSelection = {};
var tempSearchResults = [];
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
var imageCount = 0;
// #endregion
// #region event listeners
$plusIcon.addEventListener('click', showWorkoutModal);
$nav2.addEventListener('click', changeViews);
$nav1SearchContainer.lastElementChild.addEventListener(
  'keydown',
  searchForExercise
);
$nav1SearchContainer.firstElementChild.addEventListener(
  'click',
  searchForExercise
);
$modalSearchContainer.firstElementChild.addEventListener(
  'keydown',
  searchForExercise
);
$modalContent.addEventListener('click', handleModalContentClicks);
$infoModal.addEventListener('click', handleInfoModalEvents);
$newExercisesContainer.addEventListener(
  'click',
  handleNewExerciseContainerClicks
);
// #endregion

function handleNewExerciseContainerClicks(event) {
  if (event.target.matches('.info-button')) {
    showInfoModal(event);
  }
}

function handleInfoModalEvents(event) {
  if (
    event.target.matches('.modal-layout') ||
    event.target.matches('.modal-x-icon') ||
    event.target.matches('.info-modal')
  ) {
    $infoModal.classList.add('hidden');
  }
}

function handleModalContentClicks(event) {
  var date = null;
  var year = null;
  var month = null;
  var day = null;
  var userYearMonthDay = null;

  if (event.target.matches('.info-icon')) {
    showInfoModal(event);
  }
  if (
    event.target.matches('.date-button') ||
    event.target.matches('.date-polygon')
  ) {
    if (!dateInput) {
      dateInput = $workoutModal.querySelector('input[type="date"]');
      dateButton = $workoutModal.querySelector('.date-button');
      addButton = $workoutModal.querySelector('.add-button');
    }
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    dateInput.click();
    dateInput.showPicker();
    dateInput.addEventListener('change', function change(e) {
      userYearMonthDay = e.target.value.split('-');
      if (parseInt(userYearMonthDay[0]) >= year) {
        if (parseInt(userYearMonthDay[1]) >= month) {
          if (parseInt(userYearMonthDay[2]) >= day) {
            validDate();
          } else {
            invalidDate();
          }
        } else {
          invalidDate();
        }
      } else {
        invalidDate();
      }
      dateButton.textContent = userYearMonthDay
        .filter((item, ind) => ind > 0)
        .join('/');
      dateInput.removeEventListener('change', change);
    });
  }

  function invalidDate() {
    dateValid = false;
    checkIfUserCanNoLongerAddExercise();
  }

  function validDate() {
    dateValid = true;
    checkIfUserCanAddExercise();
  }
}

function hideModal(event) {
  if (
    event.target.matches('.modal-layout') ||
    event.target.matches('.workout-modal')
  ) {
    $workoutModal.classList.add('hidden');

    window.removeEventListener('click', hideModal);
  }
}

function showInfoModal(event) {
  var index = event.target.closest('.modal-search-result').dataset.id;
  $descriptionText.textContent = tempSearchResults[index].description
    .split('<p>')
    .join('')
    .split('</p>')
    .join('');
  $descriptionTitle.textContent = tempSearchResults[index].name.toUpperCase();
  $infoModal.classList.remove('hidden');
}

function pushWorkoutElement(el) {
  if (window.innerWidth < 768) {
    // mobile
    $modalSearchResultContainer.appendChild(el);
  } else {
    // desktop
    $newExercisesContainer.appendChild(el);
  }
}

function createWorkoutElement(title, tag1, tag2, img = 'images/loading.png') {
  var buttonVersusImage = null;

  if (window.innerWidth < 768) {
    buttonVersusImage = createElements('img', {
      src: 'images/info.png',
      class: 'info-icon'
    });
  } else {
    buttonVersusImage = createElements('button', {
      textContent: 'INFO',
      class: 'info-button'
    });
  }
  return createElements(
    'li',
    {
      class: 'modal-search-result margin-auto row'
    },
    [
      createElements('div', { class: 'col modal-img-alignment' }, [
        createElements('img', { src: img, alt: 'exercise' })
      ]),
      createElements(
        'div',
        {
          class:
            'row flex-col space-between modal-result-content text-align-left'
        },
        [
          createElements(
            'div',
            { class: 'row space-between title-and-buttons' },
            [createElements('h3', { textContent: title }), buttonVersusImage]
          ),
          createElements('div', { class: 'muscle-tag-container row' }, [
            createElements('p', { textContent: tag1 }),
            createElements('p', { textContent: tag2 })
          ])
        ]
      )
    ]
  );
}

function createElements(tag, attributes, children = false) {
  var el = document.createElement(tag);
  for (var key in attributes) {
    if (key === 'textContent') {
      el.textContent = attributes[key];
    } else {
      el.setAttribute(key, attributes[key]);
    }
  }
  if (children) {
    children.forEach(child => {
      el.appendChild(child);
    });
  }
  return el;
}

function getExercises() {
  var xhr = new XMLHttpRequest();

  var targetUrl = encodeURIComponent(
    `https://wger.de/api/v2/exercise/?language=2&limit=5&muscles=${
      muscleObj[searchString.toLowerCase()]
    }`
  );

  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.responseType = 'json';

  xhr.setRequestHeader(
    'Authorizaton',
    'Token 06533782073ec64f0c174e13f52373d8f19c0ae5'
  );
  xhr.setRequestHeader('Accept', 'application/json');

  xhr.addEventListener('load', function () {
    var results = xhr.response.results;
    var title = null;
    var tag1 = null;
    var tag2 = null;
    var el;

    tempSearchResults = results;

    for (var i = 0; i < results.length; i++) {
      title = results[i].name.toUpperCase();
      tag1 = muscleObjReverse[results[i].muscles[0]];
      tag2 = muscleObjReverse[results[i].muscles_secondary[0]];
      if (!tag2) {
        tag2 = muscleObjReverse[results[i].muscles[1]];
      }
      el = createWorkoutElement(title, tag1, tag2);
      el.dataset.id = i;
      pushWorkoutElement(el);
      getImages(results[i].name, el);
    }
  });

  xhr.send();
}

function getImages(exercise, el) {
  var xhr = new XMLHttpRequest();
  var workoutQuery = exercise.split(' ').join('_');
  var resultingImgURL = null;

  var targetUrl = encodeURIComponent(
    `https://imsea.herokuapp.com/api/1?q=person_doing_${workoutQuery}_exercise`
  );

  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    if (xhr.status !== 200) {
      return;
    }
    imageCount++;
    if (imageCount % 5 === 0) {
      document.documentElement.classList.remove('wait-cursor');
    }
    resultingImgURL = xhr.response.results[0];
    setImgOfEl(resultingImgURL, el);
  });

  xhr.send();
}

function removeSearchResults() {
  var lastChild = null;
  var parentContainer = null;
  if (window.innerWidth < 768) {
    // mobile
    parentContainer = $modalSearchResultContainer;
  } else {
    // desktop
    parentContainer = $newExercisesContainer;
  }
  lastChild = parentContainer.lastElementChild;
  while (lastChild) {
    parentContainer.removeChild(lastChild);
    lastChild = parentContainer.lastElementChild;
  }
}

function setImgOfEl(url, el) {
  var searchEntries = null;
  if (window.innerWidth < 768) {
    // mobile
    searchEntries = $modalSearchResultContainer.children;
  } else {
    // desktop
    searchEntries = $newExercisesContainer.children;
  }
  for (var i = 0; i < searchEntries.length; i++) {
    if (searchEntries[i] === el) {
      searchEntries[i].firstElementChild.firstElementChild.src = url;
      break;
    }
  }
}

function searchForExercise(event) {
  if (event.key === 'Enter' || event.target.matches('.search-button')) {
    if (searched) {
      $modalSearchAndResultContainer.removeEventListener(
        'click',
        listenForSearchResultClicks
      );
    }
    searched = true;
    removeSearchResults();
    searchString = event.target.value;
    event.target.value = '';
    getExercises();
    document.documentElement.classList.add('wait-cursor');
    $modalSearchAndResultContainer.addEventListener(
      'click',
      listenForSearchResultClicks
    );
  }
}

function listenForSearchResultClicks() {
  var li;
  if (!event.target.matches('input#workout-search')) {
    li = event.target.closest('li');
    if (li.classList.contains('green-border')) {
      searchResultSelectionCount--;
      li.classList.remove('green-border');
      li.classList.add('normal-border');
      delete tempSelection[li.dataset.id];
    } else {
      searchResultSelectionCount++;
      li.classList.add('green-border');
      li.classList.remove('normal-border');
      tempSelection[li.dataset.id] = li;
    }
    checkIfUserCanAddExercise();
    checkIfUserCanNoLongerAddExercise();
  }
}

function checkIfUserCanAddExercise() {
  if (searchResultSelectionCount > 0 && dateValid && addButton) {
    addButton.classList.remove('low-brightness');
    addButton.removeAttribute('disabled');
    addButton.addEventListener('click', addExercises);
  }
}

function checkIfUserCanNoLongerAddExercise() {
  if (addButton && (searchResultSelectionCount === 0 || !dateValid)) {
    addButton.classList.add('low-brightness');
    addButton.setAttribute('disabled', 'true');
    addButton.removeEventListener('click', addExercises);
  }
}

function addExercises(event) {
  for (var key in tempSelection) {
    tempSelection[key].classList.remove('green-border');
    tempSelection[key].dataset.id = data.nextExerciseId;
    data.exercises.push(tempSelection[key]);
    data.nextExerciseId++;
  }
  $workoutModal.classList.add('hidden');
  populateUpcomingWorkouts();
}

function populateUpcomingWorkouts() {}

function changeViews(event) {
  if (event.target.dataset.text === 'new-exercises') {
    changeView(event);
    newExercisesViewChanges();
  }
  if (event.target.dataset.text === 'upcoming-workouts') {
    changeView(event);
    $emptyContent.classList.remove('hidden');
    $plusIcon.classList.remove('hidden');
    $newExercisesContainer.classList.add('hidden');
    $upcomingWorkoutsContainer.classList.remove('hidden');
    $nav1SearchContainer.classList.add('hidden');
  }
}

function newExercisesViewChanges() {
  $emptyContent.classList.add('hidden');
  $plusIcon.classList.add('hidden');
  $newExercisesContainer.classList.remove('hidden');
  $upcomingWorkoutsContainer.classList.add('hidden');
  $nav1SearchContainer.classList.remove('hidden');
  $nav1SearchContainer.lastElementChild.focus();
}

function changeView(event) {
  removeCurrentNavView();
  data.view = event.target.dataset.text;
  addCurrentNavView(event);
}

function showWorkoutModal(event) {
  if (window.innerWidth < 768) {
    $workoutModal.classList.remove('hidden');
    window.addEventListener('click', hideModal);
  } else {
    removeCurrentNavView();
    data.view = 'new-exercises';
    addCurrentNavView();
    newExercisesViewChanges();
  }
}

function removeCurrentNavView() {
  var navItem = $nav2.querySelector(`[data-text="${data.view}"`);
  navItem.classList.remove('dark-bg');
  navItem.classList.add('bright-hover');
}

function addCurrentNavView(event = false) {
  var navItem = null;
  if (event) {
    event.target.classList.remove('bright-hover');
    event.target.classList.add('dark-bg');
  } else {
    navItem = $nav2.querySelector(`[data-text="${data.view}"`);
    navItem.classList.remove('bright-hover');
    navItem.classList.add('dark-bg');
  }
}
