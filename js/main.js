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
var $searchButton = $modalContent.querySelector('.search-button');
var $modalSearchAndResultContainer = $modalContent.querySelector(
  '.modal-search-and-result'
);
var $modalSearchContainer = $modalContent.querySelector(
  '.modal-search-container'
);
var $modalSearchResultContainer = $modalSearchContainer.nextElementSibling;
var $upcomingWorkoutsContent = document.querySelector(
  '.upcoming-workouts-content'
);

var $infoModal = document.querySelector('.info-modal');
var $descriptionTitle = $infoModal.querySelector('.description-title');
var $descriptionText = $infoModal.querySelector('.description-text');
var searchString = null;
var dateInput = null;
var dateButton = null;
var addButton = null;
var userYearMonthDay = null;
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
$searchButton.addEventListener('click', searchForExercise);
$modalContent.addEventListener('click', handleModalContentClicks);
$infoModal.addEventListener('click', handleInfoModalEvents);
$newExercisesContainer.addEventListener(
  'click',
  handleNewExerciseContainerClicks
);
$upcomingWorkoutsContent.addEventListener('click', handleUpcomingWorkoutClicks);
window.addEventListener('resize', handleChangesToWindow);
// #endregion

modifyData();
if (window.innerWidth < 768) {
  loadDataFromLocalMobile();
} else {
  loadDataFromLocalDesktop();
}

function handleChangesToWindow(event) {
  if (event.target.innerWidth > 768) {
    removeData();
    loadDataFromLocalDesktop();
  }
  if (event.target.innerWidth < 768) {
    removeData();
    loadDataFromLocalMobile();
  }
}

function modifyData() {
  var newData = Object.assign({}, data);
  newData.exercises = [];
  data.exercises.forEach((exercise, ind) => {
    exercise.whenDo = giveDateDifferenceInDays(exercise.date);
    if (exercise.whenDo.time >= 0) {
      newData.exercises.push(exercise);
    }
  });
  data.exercises = newData.exercises;
}

function loadDataFromLocalMobile() {
  data.organizedExercises.forEach(e => {
    $upcomingWorkoutsContent.appendChild(
      createElementForDaySeparator(e[0].whenDo.when)
    );
    e.forEach(item => {
      $upcomingWorkoutsContent.appendChild(
        createElementForMobileUpcomingWorkouts(
          item.imgURL,
          item.title,
          item.tag1,
          item.tag2,
          item.id
        )
      );
    });
  });
}

function organizeExercisesByDay() {
  var organizedExercises = [];

  data.exercises.forEach(e => {
    if (!organizedExercises[e.whenDo.time]) {
      organizedExercises[e.whenDo.time] = [e];
    } else {
      organizedExercises[e.whenDo.time].push(e);
    }
  });

  data.organizedExercises = organizedExercises;
}

function loadDataFromLocalDesktop() {
  if (data.organizedExercises.length) {
    $upcomingWorkoutsContent.appendChild(
      createElementForDaySeparatorDesktop(
        data.organizedExercises[0][0].whenDo.when
      )
    );
    data.organizedExercises[0].forEach(item => {
      $upcomingWorkoutsContent.appendChild(
        createSearchElement(item.title, item.tag1, item.tag2, item.imgURL)
      );
    });
  }
}

function createElementForDaySeparatorDesktop(text) {
  return createElements(
    'div',
    { class: 'row desktop-day-separator space-between' },
    [
      createElements('img', {
        class: 'separator-polygon',
        src: 'images/polygon_left.png',
        alt: 'polygon left'
      }),
      createElements('h1', { textContent: text }),
      createElements('img', {
        class: 'separator-polygon',
        src: 'images/polygon-right.png',
        alt: 'polygon right'
      })
    ]
  );
}

function handleUpcomingWorkoutClicks(event) {
  if (event.target.matches('.info-icon')) {
    showInfoModalDesktop(event);
  }
}

function showInfoModalDesktop(event) {
  var id = event.target.closest('li').dataset.id;
  var exercise = getExerciseObjectGivenId(id);
  $descriptionTitle.textContent = exercise.title;
  $descriptionText.textContent = exercise.description;
  $infoModal.classList.remove('hidden');
}

function getExerciseObjectGivenId(id) {
  for (var i = 0; i < data.exercises.length; i++) {
    if (data.exercises[i].id === parseInt(id)) {
      return data.exercises[i];
    }
  }
}

function giveDateDifferenceInDays(date) {
  var today = new Date().toLocaleDateString().split('/');
  today = [today[2], today[0], today[1]]
    .map(x => {
      if (x.length < 2) {
        x = '0' + x[0];
      }
      return x;
    })
    .join('-');
  date = date.join('-');
  today += 'T00:00:00';
  date += 'T00:00:00';
  today = Math.trunc(Date.parse(today) / 86400000);
  date = Math.trunc(Date.parse(date) / 86400000);

  if (date - today === 0) {
    return { when: 'TODAY', time: 0 };
  } else if (date - today === 1) {
    return { when: 'TOMORROW', time: 1 };
  } else {
    return { when: `IN ${date - today} DAYS`, time: date - today };
  }
}

function handleNewExerciseContainerClicks(event) {
  if (event.target.matches('.info-button')) {
    showInfoModal(event);
  }
  if (event.target.matches("img[src='images/plus.png']")) {
    tryToAddWorkoutDesktop(event);
  }
}

function tryToAddWorkoutDesktop(event) {
  var $date = $nav2.querySelector('.nav-2-date');
  userYearMonthDay = $date.value.split('-');
  var validDate = checkDateIsValid(userYearMonthDay);
  var li = event.target.closest('li');

  if (!validDate) {
    $date.classList.add('red-border');
    $date.classList.remove('green-border');
  } else if (validDate) {
    $date.classList.remove('red-border');
    $date.classList.add('green-border');
    if (li.classList.contains('green-border')) {
      li.classList.remove('green-border');
    } else {
      li.classList.add('green-border');
    }
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
    dateInput.click();
    dateInput.showPicker();
    dateInput.addEventListener('change', function change(e) {
      userYearMonthDay = e.target.value.split('-');
      var date = checkDateIsValid(userYearMonthDay);
      if (date) {
        validDate();
      } else {
        invalidDate();
      }
      dateButton.textContent = userYearMonthDay
        .filter((item, ind) => ind > 0)
        .join('/');
      dateInput.removeEventListener('change', change);
    });
  }
}

function invalidDate() {
  dateValid = false;
  checkIfUserCanNoLongerAddExercise();
}

function validDate() {
  dateValid = true;
  checkIfUserCanAddExercise();
}

function checkDateIsValid(userYearMonthDay) {
  var date = null;
  var year = null;
  var month = null;
  var day = null;

  date = new Date();
  year = date.getFullYear();
  month = date.getMonth() + 1;
  day = date.getDate();

  var userYear = parseInt(userYearMonthDay[0]);
  var userMonth = parseInt(userYearMonthDay[1]);
  var userDay = parseInt(userYearMonthDay[2]);

  if (userYear > year) {
    return true;
  } else if (userYear === year && userMonth > month) {
    return true;
  } else if (userYear === year && userMonth === month && userDay >= day) {
    return true;
  } else {
    return false;
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

function createSearchElement(title, tag1, tag2, img = 'images/loading.png') {
  var buttonVersusImage = null;
  var tagContainer = null;

  if (window.innerWidth < 768 || data.view === 'upcoming-workouts') {
    buttonVersusImage = createElements('img', {
      src: 'images/info.png',
      class: 'info-icon'
    });
    tagContainer = createElements(
      'div',
      { class: 'muscle-tag-container row' },
      [
        createElements('p', { textContent: tag1 }),
        createElements('p', { textContent: tag2 })
      ]
    );
  } else {
    buttonVersusImage = createElements('button', {
      textContent: 'INFO',
      class: 'info-button'
    });
    tagContainer = createElements(
      'div',
      { class: 'muscle-tag-container row' },
      [
        createElements('p', { textContent: tag1 }),
        createElements('p', { textContent: tag2 }),
        createElements(
          'div',
          {
            class:
              'plus-icon-container pointer-cursor bright-hover ml-auto additional-workout'
          },
          [createElements('img', { src: 'images/plus.png', alt: 'plus icon' })]
        )
      ]
    );
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
          tagContainer
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
    } else if (key === 'dataset-id') {
      el.dataset.id = attributes[key];
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
      el = createSearchElement(title, tag1, tag2);
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
  var tempData = null;
  var tagContainer = null;

  for (var key in tempSelection) {
    tempSelection[key].classList.remove('green-border');
    tagContainer = tempSelection[key].querySelector('.muscle-tag-container');

    tempData = {
      id: data.nextExerciseId,
      imgURL: tempSelection[key].querySelector('img').getAttribute('src'),
      title: tempSelection[key].querySelector('h3').textContent,
      tag1: tagContainer.children[0].textContent,
      tag2: tagContainer.children[1].textContent,
      date: userYearMonthDay,
      description: tempSearchResults[tempSelection[key].dataset.id].description
        .split('<p>')
        .join('')
        .split('</p>')
        .join('')
    };

    data.exercises.push(tempData);
    data.nextExerciseId++;
  }
  removeData();
  modifyData();
  organizeExercisesByDay();
  if (window.innerWidth < 768) {
    loadDataFromLocalMobile();
    $workoutModal.classList.add('hidden');
  } else {
    loadDataFromLocalDesktop();
  }
}

function removeData() {
  var content = $upcomingWorkoutsContent.lastElementChild;
  while (content) {
    $upcomingWorkoutsContent.removeChild(content);
    content = $upcomingWorkoutsContent.lastElementChild;
  }
}

function createElementForDaySeparator(text) {
  return createElements('div', { class: 'day-separator' }, [
    createElements('h3', { textContent: text })
  ]);
}

function createElementForMobileUpcomingWorkouts(
  imgURL,
  title,
  tag1,
  tag2,
  id = false
) {
  return createElements(
    'li',
    { class: 'upcoming-workout-entry row', 'dataset-id': id },
    [
      createElements('div', { class: 'image-container col' }, [
        createElements('img', { src: imgURL, alt: 'exercise image' })
      ]),
      createElements('div', { class: 'row flex-col space-between w-100' }, [
        createElements('div', { class: 'row title-and-buttons pos-rel' }, [
          createElements('h3', { textContent: title }),
          createElements('img', {
            src: 'images/info.png',
            alt: 'info',
            class: 'info-icon'
          })
        ]),
        createElements('div', { class: 'muscle-tag-container row' }, [
          createElements('p', { textContent: tag1 }),
          createElements('p', { textContent: tag2 })
        ])
      ])
    ]
  );
}

function changeViews(event) {
  if (event.target.dataset.text === 'new-exercises') {
    changeView(event);
    newExercisesViewChanges();
  }
  if (event.target.dataset.text === 'upcoming-workouts') {
    changeView(event);
    $plusIcon.classList.remove('hidden');
    $newExercisesContainer.classList.add('hidden');
    $upcomingWorkoutsContainer.classList.remove('hidden');
    $nav1SearchContainer.classList.add('hidden');
    $nav2.querySelector('.date-to-workout').classList.add('hidden');
    saveChosenExercises();
    modifyNoContent();
  }
  if (event.target.matches('.nav-2-date')) {
    event.target.showPicker();
  }
}

function modifyNoContent() {
  if (data.exercises.length === 0) {
    $upcomingWorkoutsContainer
      .querySelector('.no-content')
      .classList.remove('hidden');
  }
  if (data.exercises.length > 0) {
    $upcomingWorkoutsContainer
      .querySelector('.no-content')
      .classList.add('hidden');
  }
}

function clearTempData() {
  tempSearchResults = null;
  tempSelection = {};
  var el = $newExercisesContainer.lastElementChild;
  while (el) {
    $newExercisesContainer.removeChild(el);
    el = $newExercisesContainer.lastElementChild;
  }
  $nav2.querySelector('.nav-2-date').value = '';
}

function saveChosenExercises() {
  var searchResults = $newExercisesContainer.children;

  for (var i = 0; i < searchResults.length; i++) {
    if (searchResults[i].classList.contains('green-border')) {
      tempSelection[searchResults[i].dataset.id] = searchResults[i];
    }
  }

  addExercises(null);
  clearTempData();
}

function newExercisesViewChanges() {
  $emptyContent.classList.add('hidden');
  $plusIcon.classList.add('hidden');
  $newExercisesContainer.classList.remove('hidden');
  $upcomingWorkoutsContainer.classList.add('hidden');
  $nav1SearchContainer.classList.remove('hidden');
  $nav1SearchContainer.lastElementChild.focus();
  $nav2
    .querySelector('[data-text="upcoming-workouts"]')
    .classList.remove('dark-bg');
  $nav2.querySelector('.date-to-workout').classList.remove('hidden');
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
