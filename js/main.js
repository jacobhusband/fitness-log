var $modalContent = document.querySelector('.workout-modal');
var $plusIcon = document.querySelector('.plus-icon-container');
var $nav2 = document.querySelector('.nav-2');
var $emptyContent = document.querySelector('.no-content');
var $newExercisesContainer = document.querySelector('.new-exercises-container');
var $upcomingWorkoutsContainer = document.querySelector(
  '.upcoming-workouts-container'
);
var $nav1SearchContainer = document.querySelector('.nav-1-search-container');

$plusIcon.addEventListener('click', showWorkoutModal);
$nav2.addEventListener('click', changeViews);

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
