var $header = document.querySelector('header');
var $main = document.querySelector('main');
var $nav1 = $header.querySelector('.nav-1');
var $nav2 = $header.querySelector('.nav-2');
var $upWorkCont = $main.querySelector('.upcoming-workouts-container');
var $newExerCont = $main.querySelector('.new-exercises-container');
var $workModal = $main.querySelector('.workout-modal');
var $infoModal = $main.querySelector('.info-modal');
var $userMessage = $main.querySelector('.user-message');
var $n1SearchCont = $nav1.querySelector('.nav-1-search-container');
var $pIcon = $nav1.querySelector('.plus-icon-container');
var $n2Date2Work = $nav2.querySelector('.date-to-workout');
var $n2Date = $nav2.querySelector('.nav-2-date');
var $addButtonDesk = $n2Date2Work.querySelector('.add-button-desktop');
var $noCont = $upWorkCont.querySelector('.upcoming-workouts-empty');
var $modalContent = $workModal.querySelector('.work-mod-cont');
var $descTitle = $infoModal.querySelector('.description-title');
var $descText = $infoModal.querySelector('.description-text');
var $n1Search = $n1SearchCont.querySelector('#workout-search-desktop');
var $addExerModForm = $modalContent.querySelector('.add-exercise-modal-form');
var $modSearchCont = $modalContent.querySelector('.modal-search-and-result');
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

$nav2.addEventListener('click', changeViews);
$pIcon.addEventListener('click', handlePlusIconClicks);
$workModal.addEventListener('click', handleModalContentClicks);
$infoModal.addEventListener('click', handleInfoModalEvents);
$newExerCont.addEventListener('click', handleNewExerciseContainerClicks);
$upWorkCont.addEventListener('click', handleUpcomingWorkoutClicks);
$modSearchCont.addEventListener('click', listenForSearchResultClicks);
$n1Search.addEventListener('input', removeSearchBorder);
$n2Date.addEventListener('input', changeDate);
$n2Date2Work.addEventListener('submit', handleAddButtonClicks);
$addExerModForm.addEventListener('submit', handleAddButtonClicks);
$n1SearchCont.addEventListener('submit', function () {
  searchForExercise(event, 'desktop');
});
$addExerModForm.addEventListener('submit', function () {
  searchForExercise(event, 'mobile');
});

loadContentOntoPage();

function handlePlusIconClicks(event) {
  var mobile = window.innerWidth < 768;
  if (mobile) {
    showNewExerModal();
  } else {
    showNewExercisesView();
  }
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
    var li = event.target.closest('li');
    var id = parseInt(li.dataset.id);
    removeExerciseFromData(id);
    removeExerciseFromDOM(id);
  }
  if (event.target.matches('.separator-polygon')) {
    if (event.target.getAttribute('alt') === 'polygon right') {
      changeDayView(event, 'right');
    }
    if (event.target.getAttribute('alt') === 'polygon left') {
      changeDayView(event, 'left');
    }
  }
}

function handleNewExerciseContainerClicks(event) {
  if (event.target.matches('.info-button')) {
    showNewExerciseInfoModal(event);
  }
  if (event.target.matches("img[src='images/plus.png']")) {
    var li = event.target.closest('li');
    updateUserDate();
    showInvalidDate(event, li);
    if (dateValid) {
      changeSelection(li);
      checkAddButtonIsValid();
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
  if (event.target.matches("input[type='date']")) {
    if (!testIfiOS()) {
      $dateInput.showPicker();
    }
    $dateInput.addEventListener('input', changeDateButton);
  }
  if (
    event.target.matches('.workout-modal') ||
    event.target.matches("[src='images/exit.png']")
  ) {
    $workModal.classList.add('hidden');
  }
}

function handleAddButtonClicks(event) {
  event.preventDefault();
  if (event.submitter.className === 'search-button') {
    return;
  }
  addExercisesToDataObj();
  resetSearchItems();
  tempSelection = {};

  var lis = createLiElements(data.recentExercises[data.recentDate]);
  var ulContainer = checkForUlContainer();
  if (!ulContainer) {
    ulContainer = createUlContainer(lis, data.recentDate);
    $upWorkCont.appendChild(ulContainer);
  } else {
    appendToUlContainer(lis, ulContainer);
  }
  checkContentMessage();
  showUpcomingWorkoutsView();
}

function updateUserDate() {
  userYearMonthDay = $n2Date.value.split('-');
  dateValid = checkDateIsValid(userYearMonthDay);
}

function removeExerciseFromDOM(id) {
  var element = $upWorkCont.querySelector(`[data-id='${id}']`);
  var papa = element.parentElement;
  var grandpa = papa.parentElement;
  if (papa.children.length === 2) {
    papa.remove();
  } else {
    element.remove();
  }
  if (grandpa.children.length === 1) {
    $noCont.classList.remove('hidden');
  }
}

function checkContentMessage() {
  if (Object.keys(data.exercises).length > 0) {
    $noCont.classList.add('hidden');
  } else {
    $noCont.classList.remove('hidden');
  }
}

function loadContentOntoPage() {
  checkContentMessage();
  removeOldContent();
  for (var key in data.exercises) {
    var lis = createLiElements(data.exercises[key]);
    $upWorkCont.appendChild(createUlContainer(lis, lis[0].dataset.date));
  }
  hideAllButMostRecent();
}

function removeOldContent() {
  var today = getTodaysDate(true);
  for (var key in data.exercises) {
    if (parseInt(key) < parseInt(today)) {
      delete data.exercises[key];
    }
  }
}

function getTodaysDate(simple = false) {
  var today = new Date().toLocaleDateString().split('/');
  today = [today[2], today[0], today[1]].map(x => {
    if (x.length < 2) {
      x = '0' + x[0];
    }
    return x;
  });
  if (simple) {
    return today.join('');
  }
  today = today.join('-');
  today += 'T00:00:00';
  today = Math.trunc(Date.parse(today) / 86400000);
  return today;
}

function showNewExerModal() {
  $workModal.classList.remove('hidden');
}

function changeDateButton(e) {
  userYearMonthDay = e.target.value.split('-');
  dateValid = checkDateIsValid(userYearMonthDay);
  if (dateValid) {
    checkIfUserCanAddExerciseMobile();
    $dateButton.style.borderColor = 'green';
  } else {
    checkIfUserCanAddExerciseMobile();
    $dateButton.style.borderColor = 'red';
  }
  $dateButton.textContent = userYearMonthDay
    .filter((item, ind) => ind > 0)
    .join('/');
}

function addExercisesToDataObj() {
  var tempData = null;
  var tagContainer = null;
  var firstTagText = null;
  var secondTagText = null;
  var saveDate = userYearMonthDay.join('');
  data.recentDate = saveDate;
  data.recentExercises = {};

  for (var key in tempSelection) {
    tagContainer = tempSelection[key].querySelector('.muscle-tag-container');

    if (tagContainer.children.length === 3) {
      firstTagText = tagContainer.children[0].textContent;
      secondTagText = tagContainer.children[1].textContent;
    } else if (tagContainer.children.length === 2) {
      firstTagText = tagContainer.children[0].textContent;
    }

    tempData = {
      id: data.nextExerciseId,
      imgURL: tempSelection[key].querySelector('img').getAttribute('src'),
      title: tempSelection[key].querySelector('h3').textContent,
      tag1: firstTagText,
      tag2: secondTagText,
      date: userYearMonthDay,
      description: tempSearchResults[tempSelection[key].dataset.id].description
        .split('<p>')
        .join('')
        .split('</p>')
        .join('')
    };

    if (!data.exercises[saveDate]) {
      data.exercises[saveDate] = [tempData];
    } else {
      data.exercises[saveDate].push(tempData);
    }
    if (!data.recentExercises[saveDate]) {
      data.recentExercises[saveDate] = [tempData];
    } else {
      data.recentExercises[saveDate].push(tempData);
    }
    data.nextExerciseId++;
  }
}

function createElementForDaySeparator(text) {
  return createElements('li', { class: 'row day-separator space-between' }, [
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
  ]);
}

function checkForUlContainer() {
  for (var i = 0; i < $upWorkCont.children.length; i++) {
    if ($upWorkCont.children[i].dataset.view === data.recentDate) {
      return $upWorkCont.children[i];
    }
  }
}

function createUlContainer(lis, date) {
  return createElements('ul', { class: 'day-container', 'data-view': date }, [
    createElementForDaySeparator(
      `${getDateDifferenceInDays(data.exercises[date][0].date.join('-'))}`
    ),
    ...lis
  ]);
}

function appendToUlContainer(lis, container) {
  lis.forEach(li => {
    container.appendChild(li);
  });
}

function createLiElements(arrOfExers) {
  var output = [];
  arrOfExers.forEach(ex => {
    output.push(
      createLiElement(ex.title, ex.tag1, ex.tag2, ex.imgURL, ex.id, ex.date)
    );
  });
  return output;
}

function createLiElement(
  title,
  tag1,
  tag2,
  img = 'images/loading.png',
  id = false,
  date = []
) {
  var imgElement = createSpinner(img);
  var tagContainer = createTagContainer(tag1, tag2, 'true');

  return createElements(
    'li',
    {
      class: 'upcoming-workout-entry row',
      'dataset-id': id,
      'dataset-date': date.join('')
    },
    [
      createElements('div', { class: 'image-container row' }, [imgElement]),
      createElements(
        'div',
        {
          class: 'row flex-col space-between w-100'
        },
        [
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
              class: 'exit-icon'
            }),
            createElements('button', {
              textContent: 'INFO',
              class: 'info-button'
            }),
            createElements('img', {
              src: 'images/x.png',
              class: 'exit-button '
            })
          ]),
          tagContainer
        ]
      )
    ]
  );
}

function createSpinner(img) {
  var imgElement = createElements('img', { src: img, alt: 'exercise' });
  if (img === 'images/loading.png') {
    imgElement = createElements('div', { class: 'lds-ring' }, [
      createElements('div', {}),
      createElements('div', {}),
      createElements('div', {}),
      createElements('div', {})
    ]);
  }
  return imgElement;
}

function createTagContainer(tag1, tag2, plus = false) {
  var firstTag = null;
  var secondTag = null;
  if (tag1) {
    firstTag = createElements('p', { textContent: tag1 });
  }
  if (tag2) {
    secondTag = createElements('p', { textContent: tag2 });
  }
  if (plus) {
    plus = createElements(
      'div',
      {
        class:
          'plus-icon-container pointer-cursor bright-hover ml-auto additional-workout'
      },
      [createElements('img', { src: 'images/plus.png', alt: 'plus icon' })]
    );
  }
  var tagContainer = createElements(
    'div',
    { class: 'muscle-tag-container row' },
    [firstTag, secondTag, plus]
  );
  return tagContainer;
}

function createElements(tag, attributes, children = false) {
  var el = document.createElement(tag);
  for (var key in attributes) {
    if (key === 'textContent') {
      el.textContent = attributes[key];
    } else if (key === 'dataset-id') {
      el.dataset.id = attributes[key];
    } else if (key === 'dataset-view') {
      el.dataset.view = attributes[key];
    } else if (key === 'dataset-date') {
      el.dataset.date = attributes[key];
    } else {
      el.setAttribute(key, attributes[key]);
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

function removeExerciseFromData(id) {
  for (var key in data.exercises) {
    for (var i = 0; i < data.exercises[key].length; i++) {
      if (data.exercises[key][i].id === id) {
        data.exercises[key].splice(i, 1);
        if (data.exercises[key].length === 0) {
          delete data.exercises[key];
        }
        return;
      }
    }
  }
}

function searchForExercise(event, target) {
  event.preventDefault();
  if (event.submitter.className === 'add-button') {
    return;
  }
  if (target === 'mobile') {
    searchString =
      event.target.firstElementChild.firstElementChild.firstElementChild.value;
  } else if (target === 'desktop') {
    searchString = event.target.firstElementChild.value;
  }
  if (searchString === 'muscle-group') {
    $n1Search.style.border = '3px solid red';
    return;
  }
  if (target === 'desktop') {
    $n2Date.classList.remove('hidden');
  }
  data.desktopCurrentDayView = 0;
  removeSearchResults();
  getExercises();
  document.documentElement.classList.add('wait-cursor');
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
      el = createLiElement(title, tag1, tag2);
      el2 = createLiElement(title, tag1, tag2);
      el.dataset.id = i;
      el2.dataset.id = i;
      pushWorkoutElement(el, el2);
      getImages2(results[i].name, el, el2);
    }
  });

  xhr.send();
}

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
    `https://bing-image-search1.p.rapidapi.com/images/search?q=person_doing_${exercise}_gym_workout`
  );
  xhr.setRequestHeader(
    'X-RapidAPI-Key',
    'df715051dbmshc5eedfd866e235dp134ff1jsnae215ea5e121'
  );
  xhr.setRequestHeader('X-RapidAPI-Host', 'bing-image-search1.p.rapidapi.com');

  xhr.send(data);
}

function getExerciseObjectGivenId(id) {
  for (var key in data.exercises) {
    for (var i = 0; i < data.exercises[key].length; i++) {
      if (parseInt(id) === data.exercises[key][i].id) {
        return data.exercises[key][i];
      }
    }
  }
}

function getDateDifferenceInDays(date) {
  var today = getTodaysDate();

  date += 'T00:00:00';
  date = Math.trunc(Date.parse(date) / 86400000);

  if (date - today === 0) {
    return 'Today';
  } else if (date - today === 1) {
    return 'Tomorrow';
  } else {
    return `In ${date - today} Days`;
  }
}

function pushWorkoutElement(el, el2) {
  $modResCont.appendChild(el2);
  $newExerCont.appendChild(el);
}

function changeDayView(event, direction) {
  var ul = event.target.closest('ul');
  var ulSibling;
  var papa = ul.parentElement;
  ul.classList.add('desktop-hidden');
  if (direction === 'right') {
    ulSibling = ul.nextElementSibling;
    if (ulSibling) {
      ulSibling.classList.remove('desktop-hidden');
    } else {
      papa.firstElementChild.nextElementSibling.classList.remove(
        'desktop-hidden'
      );
    }
  } else if (direction === 'left') {
    ulSibling = ul.previousElementSibling;
    if (!ulSibling.classList.contains('no-content')) {
      ulSibling.classList.remove('desktop-hidden');
    } else {
      papa.lastElementChild.classList.remove('desktop-hidden');
    }
  }
}

function showUpcomingWorkoutInfoModal(event) {
  var id = event.target.closest('li').dataset.id;
  var exercise = getExerciseObjectGivenId(id);
  $descTitle.textContent = exercise.title;
  $descText.textContent = exercise.description;
  $infoModal.classList.remove('hidden');
}

function listenForSearchResultClicks(event) {
  if (!event.target.matches('#workout-search-mobile')) {
    var li = event.target.closest('li');
    changeSelection(li);
    checkIfUserCanAddExerciseMobile();
  }
}

function changeSelection(li) {
  if (li.style.borderColor === '') {
    li.style.borderColor = 'green';
    selCount++;
    tempSelection[li.dataset.id] = li;
  } else {
    selCount--;
    li.style.borderColor = '';
    delete tempSelection[li.dataset.id];
  }
}

function checkIfUserCanAddExerciseMobile() {
  if (userYearMonthDay) {
    dateValid = checkDateIsValid(userYearMonthDay);
  }
  if (selCount > 0 && dateValid) {
    $addButton.classList.remove('low-brightness');
    $addButton.removeAttribute('disabled');
  }
  if (selCount === 0 || !dateValid) {
    $addButton.setAttribute('disabled', 'true');
  }
}

function showInvalidDate(event, li) {
  if (!dateValid) {
    showDateMessage();
    setTimeout(() => {
      $userMessage.classList.add('hidden');
    }, 2000);
    $n2Date.showPicker();
    $n2Date.style.borderColor = 'red';
  }
}

function showDateMessage() {
  var rect = $n2Date.getBoundingClientRect();
  $userMessage.classList.remove('hidden');
  $userMessage.style.transform = `translate(${rect.x + 5 + rect.width}px, ${
    rect.y
  }px)`;
}

function checkDateIsValid(userYearMonthDay) {
  if (!userYearMonthDay) {
    return false;
  }

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

function showNewExerciseInfoModal(event) {
  var index = event.target.closest('li').dataset.id;
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

function changeViews(event) {
  if (event.target.dataset.text === 'new-exercises') {
    showNewExercisesView();
  }
  if (event.target.dataset.text === 'upcoming-workouts') {
    showUpcomingWorkoutsView();
  }
  if (event.target.matches('.nav-2-date')) {
    event.target.showPicker();
  }
}

function showNewExercisesView() {
  $nav1.dataset.view = 'new-exercises';
  $nav2.dataset.view = 'new-exercises';
  $upWorkCont.classList.add('desktop-hidden');
  $newExerCont.classList.remove('desktop-hidden');
}

function showUpcomingWorkoutsView() {
  $nav1.dataset.view = 'upcoming-workouts';
  $nav2.dataset.view = 'upcoming-workouts';
  $newExerCont.classList.add('desktop-hidden');
  $upWorkCont.classList.remove('desktop-hidden');
  hideAllButMostRecent();
}

function hideAllButMostRecent() {
  var notFirst = false;
  for (var i = 0; i < $upWorkCont.children.length; i++) {
    if ($upWorkCont.children[i].classList.contains('day-container')) {
      if (notFirst) {
        $upWorkCont.children[i].classList.add('desktop-hidden');
      } else {
        $upWorkCont.children[i].classList.remove('desktop-hidden');
      }
      notFirst = true;
    }
  }
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

function changeDate(e) {
  userYearMonthDay = e.target.value.split('-');
  if (!userYearMonthDay) {
    return;
  }
  dateValid = checkDateIsValid(userYearMonthDay);
  if (dateValid) {
    e.target.style.borderColor = 'green';
  } else {
    e.target.style.borderColor = 'red';
  }
  checkAddButtonIsValid();
}

function removeSearchBorder(e) {
  e.target.style.border = 'none';
}

function checkAddButtonIsValid() {
  if (dateValid && Object.keys(tempSelection).length > 0) {
    $addButtonDesk.classList.remove('hidden');
  } else {
    $addButtonDesk.classList.add('hidden');
  }
}

function resetSearchItems() {
  for (var key in tempSelection) {
    tempSelection[key].style.borderColor = '';
  }
  $n2Date.style.borderColor = '';
  $n2Date2Work.reset();
  $addExerModForm.reset();
  $addButtonDesk.classList.add('hidden');
}
