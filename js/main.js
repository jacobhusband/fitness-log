var $modalContent = document.querySelector('.workout-modal');
var $plusIcon = document.querySelector('.plus-icon-container');
var $nav2 = document.querySelector('.nav-2');

$plusIcon.addEventListener('click', showWorkoutModal);
$nav2.addEventListener('click', changeViews);

function changeViews(event) {
  if (
    event.target.dataset.text === 'new-exercises' ||
    event.target.dataset.text === 'upcoming-workouts'
  ) {
    removeCurrentNavView();
    data.view = event.target.dataset.text;
    addCurrentNavView(event);
  }
}

function showWorkoutModal(event) {
  if (window.innerWidth < 768) {
    $modalContent.classList.remove('hidden');
    window.addEventListener('click', hideModal);
  } else {
    removeCurrentNavView();
    data.view = 'new-exercises';
    addCurrentNavView();
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
