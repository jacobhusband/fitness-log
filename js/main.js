var $header = document.querySelector('header');
var $main = document.querySelector('main');
var $nav1 = $header.querySelector('.nav-1');
var $nav2 = $header.querySelector('.nav-2');
var $upWorkCont = $main.querySelector('.upcoming-workouts-container');
var $newExerCont = $main.querySelector('.new-exercises-container');
var $workModal = $main.querySelector('.workout-modal');
var $infoModal = $main.querySelector('.info-modal');
var userMessage = $main.querySelector('.user-message');
var $n1SearchCont = $nav1.querySelector('.nav-1-search-container');
var $pIconDesk = $nav1.querySelector('.plus-icon-container-desktop');
var $pIconMob = $nav1.querySelector('.plus-icon-container-mobile');
var $upWorkContDesk = $upWorkCont.querySelector('.up-work-cont-desk');
var $upWorkContMob = $upWorkCont.querySelector('.up-work-cont-mob');
var $noCont = $upWorkCont.querySelector('.no-content');
var $modalContent = $workModal.querySelector('.work-mod-cont');
var $descTitle = $infoModal.querySelector('.description-title');
var $descText = $infoModal.querySelector('.description-text');
var $addExerModForm = $modalContent.querySelector('.add-exercise-modal-form');
var $modSearchCont = $modalContent.querySelector('.modal-search-and-result');
var $modResCont =
  $modSearchCont.lastElementChild.querySelector('.mod-search-cont');

var tempSelection = {};
var tempSearchResults = [];
var selCount = 0;
var imageCount = 0;
var dateValid = false;

var searchString = null;
var dateInput = null;
var dateButton = null;
var addButton = null;
var userYearMonthDay = null;

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

$pIconDesk.addEventListener('click', showworkModalDesktop);
$pIconMob.addEventListener('click', showworkModalMobile);
$nav2.addEventListener('click', changeViews);
$n1SearchCont.addEventListener('submit', searchForExerciseDesktop);
$addExerModForm.addEventListener('submit', searchForExerciseMobile);
$modalContent.addEventListener('click', handleModalContentClicks);
$infoModal.addEventListener('click', handleInfoModalEvents);
$newExerCont.addEventListener('click', handleNewExerciseContainerClicks);
$upWorkContMob.addEventListener('click', handleUpcomingWorkoutClicks);
$upWorkContDesk.addEventListener('click', handleUpcomingWorkoutClicks);

modifyData();
loadDataFromLocalMobile();
loadDataFromLocalDesktop();

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
    $upWorkContMob.appendChild(createElementForDaySeparator(e[0].whenDo.when));
    e.forEach(item => {
      $upWorkContMob.appendChild(
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

  var startLength = data.organizedExercises.length;

  data.exercises.forEach(e => {
    if (!organizedExercises[e.whenDo.time]) {
      organizedExercises[e.whenDo.time] = [e];
    } else {
      organizedExercises[e.whenDo.time].push(e);
    }
  });

  data.organizedExercises = [];

  for (var i = 0; i < organizedExercises.length; i++) {
    if (organizedExercises[i]) {
      data.organizedExercises.push(organizedExercises[i]);
    }
  }

  var endLength = data.organizedExercises.length;

  if (endLength < startLength) {
    data.desktopCurrentDayView = 0;
  }
}

function loadDataFromLocalDesktop() {
  if (data.organizedExercises.length) {
    $upWorkContDesk.appendChild(
      createElementForDaySeparatorDesktop(
        data.organizedExercises[data.desktopCurrentDayView][0].whenDo.when
      )
    );
    data.organizedExercises[data.desktopCurrentDayView].forEach(item => {
      $upWorkContDesk.appendChild(
        createUpcomingWorkoutElementDesktop(
          item.title,
          item.tag1,
          item.tag2,
          item.imgURL,
          item.id
        )
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
        class: 'separator-polygon ',
        src: 'images/polygon-left.png',
        alt: 'polygon left'
      }),
      createElements('h1', { textContent: text }),
      createElements('img', {
        class: 'separator-polygon ',
        src: 'images/polygon-right.png',
        alt: 'polygon right'
      })
    ]
  );
}

function reloadPage() {
  removeData();
  modifyData();
  organizeExercisesByDay();
  loadDataFromLocalDesktop();
  loadDataFromLocalMobile();
}

function handleUpcomingWorkoutClicks(event) {
  if (
    event.target.matches('.info-icon') ||
    event.target.matches('.info-button')
  ) {
    showUpcomingWorkoutInfoModal(event);
  }
  if (
    event.target.matches('.exit-button') ||
    event.target.matches('.exit-icon')
  ) {
    var id = parseInt(event.target.closest('li').dataset.id);
    searchAndRemove(id);
    reloadPage();
  }
  if (event.target.matches('.separator-polygon')) {
    if (event.target.getAttribute('alt') === 'polygon right') {
      showNextDay();
    }
    if (event.target.getAttribute('alt') === 'polygon left') {
      showPreviousDay();
    }
    reloadPage();
  }
}

function searchAndRemove(id) {
  data.exercises.forEach((exercise, ind) => {
    if (exercise.id === id) {
      data.exercises.splice(ind, 1);
    }
  });
}

function showNextDay() {
  if (data.desktopCurrentDayView === data.organizedExercises.length - 1) {
    data.desktopCurrentDayView = 0;
  } else {
    data.desktopCurrentDayView++;
  }
}

function showPreviousDay() {
  if (data.desktopCurrentDayView === 0) {
    data.desktopCurrentDayView = data.organizedExercises.length - 1;
  } else {
    data.desktopCurrentDayView--;
  }
}

function showUpcomingWorkoutInfoModal(event) {
  var id = event.target.closest('li').dataset.id;
  var exercise = getExerciseObjectGivenId(id);
  $descTitle.textContent = exercise.title;
  $descText.textContent = exercise.description;
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
    showNewExerciseInfoModal(event);
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
    userMessage.classList.remove('hidden');
    userMessage.style.transform = `translate(${event.x + 20}px, ${
      event.y - 10
    }px)`;
    setTimeout(() => {
      userMessage.classList.add('hidden');
    }, 2000);
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
    showNewExerciseInfoModal(event);
  }
  if (
    event.target.matches('.date-button') ||
    event.target.matches('.date-polygon')
  ) {
    if (!dateInput) {
      dateInput = $workModal.querySelector('input[type="date"]');
      dateButton = $workModal.querySelector('.date-button');
      addButton = $workModal.querySelector('.add-button');
    }
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
    $workModal.classList.add('hidden');

    window.removeEventListener('click', hideModal);
  }
}

function showNewExerciseInfoModal(event) {
  var index = event.target.closest('.modal-search-result').dataset.id;
  $descText.textContent = tempSearchResults[index].description
    .split('<p>')
    .join('')
    .split('</p>')
    .join('');
  $descTitle.textContent = tempSearchResults[index].name.toUpperCase();
  $infoModal.classList.remove('hidden');
}

function pushWorkoutElement(el, el2) {
  $modResCont.appendChild(el2);
  $newExerCont.appendChild(el);
}

function createUpcomingWorkoutElementDesktop(
  title,
  tag1,
  tag2,
  img = 'images/loading.png',
  id = false
) {
  var tagContainer = createElements(
    'div',
    { class: 'muscle-tag-container row' },
    [
      createElements('p', { textContent: tag1 }),
      createElements('p', { textContent: tag2 })
    ]
  );
  return createElements(
    'li',
    {
      class: 'modal-search-result margin-auto row',
      'dataset-id': id
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
            [
              createElements('h3', { textContent: title }),
              createElements('button', {
                textContent: 'INFO',
                class: 'info-button'
              }),
              createElements('img', {
                src: 'images/x.png',
                class: 'exit-button '
              })
            ]
          ),
          tagContainer
        ]
      )
    ]
  );
}

function createSearchElementDesktop(
  title,
  tag1,
  tag2,
  img = 'images/loading.png',
  id = false
) {
  var buttonVersusImage = createElements('button', {
    textContent: 'INFO',
    class: 'info-button'
  });
  var tagContainer = createElements(
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
  return createVariedElements(
    title,
    tag1,
    tag2,
    tagContainer,
    buttonVersusImage,
    img,
    id
  );
}

function createSearchElementMobile(
  title,
  tag1,
  tag2,
  img = 'images/loading.png',
  id = false
) {
  var buttonVersusImage = createElements('img', {
    src: 'images/info.png',
    class: 'info-icon'
  });
  var tagContainer = createElements(
    'div',
    { class: 'muscle-tag-container row' },
    [
      createElements('p', { textContent: tag1 }),
      createElements('p', { textContent: tag2 })
    ]
  );
  return createVariedElements(
    title,
    tag1,
    tag2,
    tagContainer,
    buttonVersusImage,
    img,
    id
  );
}

function createVariedElements(
  title,
  tag1,
  tag2,
  tagContainer,
  buttonVersusImage,
  img = 'images/loading.png',
  id = false
) {
  return createElements(
    'li',
    {
      class: 'modal-search-result margin-auto row',
      'dataset-id': id
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
    var el2;

    tempSearchResults = results;

    for (var i = 0; i < results.length; i++) {
      title = results[i].name.toUpperCase();
      tag1 = muscleObjReverse[results[i].muscles[0]];
      tag2 = muscleObjReverse[results[i].muscles_secondary[0]];
      if (!tag2) {
        tag2 = muscleObjReverse[results[i].muscles[1]];
      }
      el = createSearchElementDesktop(title, tag1, tag2);
      el2 = createSearchElementMobile(title, tag1, tag2);
      el.dataset.id = i;
      el2.dataset.id = i;
      pushWorkoutElement(el, el2);
      getImages(results[i].name, el);
      getImages(results[i].name, el2);
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
  var parentContainerMobile = null;
  var parentContainerDesktop = null;

  parentContainerMobile = $modResCont;
  parentContainerDesktop = $newExerCont;

  lastChild = parentContainerMobile.lastElementChild;
  while (lastChild) {
    parentContainerMobile.removeChild(lastChild);
    lastChild = parentContainerMobile.lastElementChild;
  }

  lastChild = parentContainerDesktop.lastElementChild;
  while (lastChild) {
    parentContainerDesktop.removeChild(lastChild);
    lastChild = parentContainerDesktop.lastElementChild;
  }
}

function setImgOfEl(url, el) {
  var searchEntriesMobile = null;
  var searchEntriesDesktop = null;

  searchEntriesMobile = $modResCont.children;
  searchEntriesDesktop = $newExerCont.children;

  for (var i = 0; i < searchEntriesMobile.length; i++) {
    if (searchEntriesMobile[i] === el) {
      searchEntriesMobile[i].firstElementChild.firstElementChild.src = url;
      break;
    }
  }

  for (var j = 0; j < searchEntriesDesktop.length; j++) {
    if (searchEntriesDesktop[j] === el) {
      searchEntriesDesktop[j].firstElementChild.firstElementChild.src = url;
      break;
    }
  }
}

function searchForExerciseDesktop(event) {
  event.preventDefault();
  $modSearchCont.removeEventListener('click', listenForSearchResultClicks);
  saveChosenExercises();
  data.desktopCurrentDayView = 0;
  removeSearchResults();
  searchString = event.target.lastElementChild.value;
  getExercises();
  // document.documentElement.classList.add("wait-cursor");
  $modSearchCont.addEventListener('click', listenForSearchResultClicks);
  $n1SearchCont.reset();
}

function searchForExerciseMobile(event) {
  event.preventDefault();
  $modSearchCont.removeEventListener('click', listenForSearchResultClicks);
  saveChosenExercises();
  data.desktopCurrentDayView = 0;
  removeSearchResults();
  searchString =
    event.target.firstElementChild.firstElementChild.firstElementChild.value;
  getExercises();
  // document.documentElement.classList.add("wait-cursor");
  $modSearchCont.addEventListener('click', listenForSearchResultClicks);
  $addExerModForm.reset();
}

function listenForSearchResultClicks() {
  var li;
  if (!event.target.matches('input#workout-search')) {
    li = event.target.closest('li');
    if (li.classList.contains('green-border')) {
      selCount--;
      li.classList.remove('green-border');
      li.classList.add('normal-border');
      delete tempSelection[li.dataset.id];
    } else {
      selCount++;
      li.classList.add('green-border');
      li.classList.remove('normal-border');
      tempSelection[li.dataset.id] = li;
    }
    checkIfUserCanAddExercise();
    checkIfUserCanNoLongerAddExercise();
  }
}

function checkIfUserCanAddExercise() {
  if (selCount > 0 && dateValid && addButton) {
    addButton.classList.remove('low-brightness');
    addButton.removeAttribute('disabled');
    addButton.addEventListener('click', addExercises);
  }
}

function checkIfUserCanNoLongerAddExercise() {
  if (addButton && (selCount === 0 || !dateValid)) {
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
  loadDataFromLocalMobile();
  loadDataFromLocalDesktop();
}

function removeData() {
  var mobileContent = $upWorkContMob.lastElementChild;
  var desktopContent = $upWorkContDesk.lastElementChild;

  while (mobileContent) {
    $upWorkContMob.removeChild(mobileContent);
    mobileContent = $upWorkContMob.lastElementChild;
  }

  while (desktopContent) {
    $upWorkContDesk.removeChild(desktopContent);
    desktopContent = $upWorkContDesk.lastElementChild;
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
          }),
          createElements('img', {
            src: 'images/exit.png',
            alt: 'exit',
            class: 'exit-icon '
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
    $pIconDesk.classList.remove('hidden');
    $newExerCont.classList.add('hidden');
    $upWorkCont.classList.remove('hidden');
    $n1SearchCont.classList.add('hidden');
    $nav2.querySelector('.date-to-workout').classList.add('hidden');
    saveChosenExercises();
    modifyNoContent();
    data.desktopCurrentDayView = 0;
  }
  if (event.target.matches('.nav-2-date')) {
    event.target.showPicker();
  }
}

function modifyNoContent() {
  if (data.exercises.length === 0) {
    $upWorkCont.querySelector('.no-content').classList.remove('hidden');
  }
  if (data.exercises.length > 0) {
    $upWorkCont.querySelector('.no-content').classList.add('hidden');
  }
}

function clearTempData() {
  tempSearchResults = null;
  tempSelection = {};
  var el = $newExerCont.lastElementChild;
  while (el) {
    $newExerCont.removeChild(el);
    el = $newExerCont.lastElementChild;
  }
  $nav2.querySelector('.nav-2-date').value = '';
}

function saveChosenExercises() {
  var searchResults = $newExerCont.children;

  for (var i = 0; i < searchResults.length; i++) {
    if (searchResults[i].classList.contains('green-border')) {
      tempSelection[searchResults[i].dataset.id] = searchResults[i];
    }
  }

  addExercises(null);
  clearTempData();
}

function newExercisesViewChanges() {
  $noCont.classList.add('hidden');
  $pIconDesk.classList.add('hidden');
  $newExerCont.classList.remove('hidden');
  $upWorkCont.classList.add('hidden');
  $n1SearchCont.classList.remove('hidden');
  $n1SearchCont.lastElementChild.focus();
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

function showworkModalMobile(event) {
  $workModal.classList.remove('hidden');
  window.addEventListener('click', hideModal);
}

function showworkModalDesktop(event) {
  removeCurrentNavView();
  data.view = 'new-exercises';
  addCurrentNavView();
  newExercisesViewChanges();
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
