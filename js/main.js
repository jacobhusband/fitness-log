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
var $n2Date2Work = $nav2.querySelector('.date-to-workout');
var $n2Date = $nav2.querySelector('.nav-2-date');
var $upWorkContDesk = $upWorkCont.querySelector('.up-work-cont-desk');
var $upWorkContMob = $upWorkCont.querySelector('.up-work-cont-mob');
var $noCont = $upWorkCont.querySelector('.no-content');
var $modalContent = $workModal.querySelector('.work-mod-cont');
var $descTitle = $infoModal.querySelector('.description-title');
var $descText = $infoModal.querySelector('.description-text');
var $addExerModForm = $modalContent.querySelector('.add-exercise-modal-form');
var $modSearchCont = $modalContent.querySelector('.modal-search-and-result');
var $workModExit = $modalContent.querySelector('.work-mod-title img');
var $dateButton = $addExerModForm.querySelector('.date-button');
var $dateInput = $addExerModForm.querySelector('.modal-date-picker');
var $addButton = $addExerModForm.querySelector('.add-button');
var $modResCont = $modSearchCont.lastElementChild;

var tempSelection = {};
var tempSearchResults = [];
var selCount = 0;
var imageCount = 0;
var dateValid = false;

var searchString = null;
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

$pIconDesk.addEventListener('click', showWorkModalDesktop);
$pIconMob.addEventListener('click', showWorkModalMobile);
$nav2.addEventListener('click', changeViews);
$modalContent.addEventListener('click', handleModalContentClicks);
$infoModal.addEventListener('click', handleInfoModalEvents);
$newExerCont.addEventListener('click', handleNewExerciseContainerClicks);
$upWorkContMob.addEventListener('click', handleUpcomingWorkoutClicks);
$upWorkContDesk.addEventListener('click', handleUpcomingWorkoutClicks);
$workModExit.addEventListener('click', closeModal);
$n1SearchCont.addEventListener('submit', function () {
  searchForExercise(event, 'desktop');
});
$addExerModForm.addEventListener('submit', function () {
  searchForExercise(event, 'mobile');
});

modifyData();
loadDataFromLocalMobile();
loadDataFromLocalDesktop();

function modifyData() {
  var newData = Object.assign({}, data);
  newData.exercises = [];
  data.exercises.forEach((exercise, ind) => {
    exercise.whenDo = getDateDifferenceInDays(exercise.date);
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
          item.title,
          item.tag1,
          item.tag2,
          item.imgURL,
          item.id
        )
      );
    });
  });
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

function handleNewExerciseContainerClicks(event) {
  if (event.target.matches('.info-button')) {
    showNewExerciseInfoModal(event);
  }
  if (event.target.matches("img[src='images/plus.png']")) {
    tryToAddWorkoutDesktop(event);
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
    event.target.matches('.date-polygon') ||
    event.target.matches("input[type='date']")
  ) {
    if (!testIfiOS()) {
      $dateInput.showPicker();
    }
    $dateInput.addEventListener('input', function change(e) {
      userYearMonthDay = e.target.value.split('-');
      var date = checkDateIsValid(userYearMonthDay);
      if (date) {
        validDate();
        $dateButton.classList.add('green-border');
        $dateButton.classList.remove('red-border');
      } else {
        invalidDate();
        $dateButton.classList.add('red-border');
        $dateButton.classList.remove('green-border');
      }
      $dateButton.textContent = userYearMonthDay
        .filter((item, ind) => ind > 0)
        .join('/');
      $dateInput.removeEventListener('input', change);
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

function createElementForDaySeparator(text) {
  return createElements('div', { class: 'day-separator' }, [
    createElements('h3', { textContent: text })
  ]);
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
            'plus-icon-container-desktop pointer-cursor bright-hover ml-auto additional-workout'
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
    { class: 'muscle-tag-container row flex-wrap' },
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

function createUpcomingWorkoutElementDesktop(
  title,
  tag1,
  tag2,
  img = 'images/loading.png',
  id = false
) {
  var imgElement = createElements('img', { src: img, alt: 'exercise' });
  if (img === 'images/loading.png') {
    imgElement = createElements('div', { class: 'lds-ring' }, [
      createElements('div', {}),
      createElements('div', {}),
      createElements('div', {}),
      createElements('div', {})
    ]);
  }
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
      createElements('div', { class: 'col modal-img-alignment' }, [imgElement]),
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

function createElementForMobileUpcomingWorkouts(
  title,
  tag1,
  tag2,
  img,
  id = false
) {
  var imgElement = createElements('img', { src: img, alt: 'exercise' });
  if (img === 'images/loading.png') {
    imgElement = createElements('div', { class: 'lds-ring' }, [
      createElements('div', {}),
      createElements('div', {}),
      createElements('div', {}),
      createElements('div', {})
    ]);
  }
  return createElements(
    'li',
    { class: 'upcoming-workout-entry row', 'dataset-id': id },
    [
      createElements('div', { class: 'image-container col' }, [imgElement]),
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

function createVariedElements(
  title,
  tag1,
  tag2,
  tagContainer,
  buttonVersusImage,
  img = 'images/loading.png',
  id = false
) {
  var imgElement = createElements('img', { src: img, alt: 'exercise' });
  if (img === 'images/loading.png') {
    imgElement = createElements('div', { class: 'lds-ring' }, [
      createElements('div', {}),
      createElements('div', {}),
      createElements('div', {}),
      createElements('div', {})
    ]);
  }
  return createElements(
    'li',
    {
      class: 'modal-search-result margin-auto row',
      'dataset-id': id
    },
    [
      createElements('div', { class: 'col modal-img-alignment' }, [imgElement]),
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

function searchAndRemove(id) {
  data.exercises.forEach((exercise, ind) => {
    if (exercise.id === id) {
      data.exercises.splice(ind, 1);
    }
  });
}

function searchForExercise(event, target) {
  $n2Date2Work.classList.remove('hidden');
  if (target === 'mobile') {
    searchString =
      event.target.firstElementChild.firstElementChild.firstElementChild.value;
  } else if (target === 'desktop') {
    searchString = event.target.firstElementChild.value;
    $n2Date.addEventListener('change', function change(e) {
      var valid = checkDateIsValid(e.target.value.split('-'));
      if (valid) {
        e.target.classList.add('green-border');
        e.target.classList.remove('red-border');
      } else {
        e.target.classList.add('red-border');
        e.target.classList.remove('green-border');
      }
    });
  }
  event.preventDefault();
  $modSearchCont.removeEventListener('click', listenForSearchResultClicks);
  saveChosenExercises();
  data.desktopCurrentDayView = 0;
  removeSearchResults();
  getExercises();
  document.documentElement.classList.add('wait-cursor');
  $modSearchCont.addEventListener('click', listenForSearchResultClicks);
  $addExerModForm.reset();
  $n1SearchCont.reset();
}

function getExercises() {
  var xhr = new XMLHttpRequest();

  var targetUrl = encodeURIComponent(
    `https://wger.de/api/v2/exercise/?language=2&limit=3&muscles=${
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
      title = results[i].name;
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
      getImages2(results[i].name, el, el2);
    }
  });

  xhr.send();
}

// function getImages(exercise, el) {
//   var xhr = new XMLHttpRequest();
//   var workoutQuery = exercise.split(" ").join("_");
//   var resultingImgURL = null;

//   var targetUrl = encodeURIComponent(
//     `https://imsea.herokuapp.com/api/1?q=person_doing_${workoutQuery}_exercise`
//   );

//   xhr.open("GET", "https://lfz-cors.herokuapp.com/?url=" + targetUrl);
//   xhr.responseType = "json";

//   xhr.addEventListener("load", function () {
//     if (xhr.status !== 200) {
//       return;
//     }
//     imageCount++;
//     if (imageCount % 3 === 0) {
//       document.documentElement.classList.remove("wait-cursor");
//     }
//     resultingImgURL = xhr.response.results[0];
//     setImgOfEl(resultingImgURL, el);
//   });

//   xhr.send();
// }

function getImages2(exercise, el, el2) {
  const data = null;
  var resultingImgURL = null;

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.responseType = 'json';

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      if (xhr.status !== 200) {
        return;
      }
      imageCount++;
      if (imageCount % 3 === 0) {
        document.documentElement.classList.remove('wait-cursor');
      }
      resultingImgURL = this.response.value[0].thumbnailUrl;
      setImgOfEl(resultingImgURL, el);
      setImgOfEl(resultingImgURL, el2);
    }
  });

  xhr.open(
    'GET',
    `https://bing-image-search1.p.rapidapi.com/images/search?q=person_doing_${exercise}_exercise`
  );
  xhr.setRequestHeader(
    'X-RapidAPI-Key',
    'df715051dbmshc5eedfd866e235dp134ff1jsnae215ea5e121'
  );
  xhr.setRequestHeader('X-RapidAPI-Host', 'bing-image-search1.p.rapidapi.com');

  xhr.send(data);
}

function getExerciseObjectGivenId(id) {
  for (var i = 0; i < data.exercises.length; i++) {
    if (data.exercises[i].id === parseInt(id)) {
      return data.exercises[i];
    }
  }
}

function getDateDifferenceInDays(date) {
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
    return { when: 'Today', time: 0 };
  } else if (date - today === 1) {
    return { when: 'Tomorrow', time: 1 };
  } else {
    return { when: `In ${date - today} Days`, time: date - today };
  }
}

function pushWorkoutElement(el, el2) {
  $modResCont.appendChild(el2);
  $newExerCont.appendChild(el);
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
  if (selCount > 0 && dateValid && $addButton) {
    $addButton.classList.remove('low-brightness');
    $addButton.removeAttribute('disabled');
    $addButton.addEventListener('click', addExercises);
  }
}

function checkIfUserCanNoLongerAddExercise() {
  if ($addButton && (selCount === 0 || !dateValid)) {
    $addButton.classList.add('low-brightness');
    $addButton.setAttribute('disabled', 'true');
    $addButton.removeEventListener('click', addExercises);
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
  $descTitle.textContent = tempSearchResults[index].name;
  $infoModal.classList.remove('hidden');
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
      searchEntriesMobile[i].firstElementChild.firstElementChild.remove();
      searchEntriesMobile[i].firstElementChild.appendChild(
        createElements('img', { src: url })
      );
      break;
    }
  }

  for (var j = 0; j < searchEntriesDesktop.length; j++) {
    if (searchEntriesDesktop[j] === el) {
      searchEntriesDesktop[j].firstElementChild.firstElementChild.remove();
      searchEntriesDesktop[j].firstElementChild.appendChild(
        createElements('img', { src: url })
      );
      break;
    }
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
  removeSearchResults();
  clearTempData();
  organizeExercisesByDay();
  loadDataFromLocalMobile();
  loadDataFromLocalDesktop();
  checkIfUserCanNoLongerAddExercise();
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
    $n2Date2Work.classList.add('hidden');
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
  selCount = 0;
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
  $n1SearchCont.firstElementChild.focus();
  $nav2
    .querySelector('[data-text="upcoming-workouts"]')
    .classList.remove('dark-bg');
}

function changeView(event) {
  removeCurrentNavView();
  data.view = event.target.dataset.text;
  addCurrentNavView(event);
}

function showWorkModalMobile(event) {
  $workModal.classList.remove('hidden');
  window.addEventListener('click', hideModal);
}

function showWorkModalDesktop(event) {
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

function closeModal(event) {
  $workModal.classList.add('hidden');
}

function testIfiOS() {
  var ua = navigator.userAgent;
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) {
    return true;
  }
  return false;
}
