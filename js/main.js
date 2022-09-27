var $modalContent = document.querySelector('.workout-modal');
var $plusIcon = document.querySelector('.plus-icon-container');
var $nav2 = document.querySelector('.nav-2');
var $emptyContent = document.querySelector('.no-content');
var $newExercisesContainer = document.querySelector('.new-exercises-container');
var $upcomingWorkoutsContainer = document.querySelector(
  '.upcoming-workouts-container'
);
var $nav1SearchContainer = document.querySelector('.nav-1-search-container');
var $modalSearchContainer = document.querySelector('.modal-search-container');
var searchString = null;

var muscleObj = {
  biceps: 1,
  shoulders: 2,
  chest: 4,
  triceps: 5,
  abs: 6,
  calves: 7,
  glutes: 8,
  traps: 9,
  quads: 10,
  hamstrings: 11,
  lats: 12,
  legs: '10,11,8,7',
  arms: '1,5,2'
};

$plusIcon.addEventListener('click', showWorkoutModal);
$nav2.addEventListener('click', changeViews);
$nav1SearchContainer.lastElementChild.addEventListener(
  'keydown',
  searchForExercise
);
$modalSearchContainer.firstElementChild.addEventListener(
  'keydown',
  searchForExercise
);

function getExercises() {
  var xhr = new XMLHttpRequest();

  var targetUrl = encodeURIComponent(
    `https://wger.de/api/v2/exercise/?language=2&muscles=${
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
    // console.log(`response: `, xhr.response);
    // console.log(`status: `, xhr.status);
    getImages();
  });

  xhr.send();
}

function getImages(exercise) {
  var xhr = new XMLHttpRequest();
  var workoutQuery = exercise.split(' ').join('_');

  xhr.open('GET', `https://imsea.herokuapp.com/api/1?q=${workoutQuery}`);
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    // console.log(`response: `, xhr.response);
    // console.log(`status: `, xhr.status);
  });

  xhr.send();
}

function searchForExercise(event) {
  if (event.key === 'Enter') {
    searchString = event.target.value;
    event.target.value = '';
    getExercises();
  }
}

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
    $modalContent.classList.remove('hidden');
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

function hideModal(event) {
  if (
    event.target.matches('.modal-layout') ||
    event.target.matches('.workout-modal')
  ) {
    $modalContent.classList.add('hidden');

    window.removeEventListener('click', hideModal);
  }
}
