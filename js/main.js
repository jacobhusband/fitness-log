var $modalContent = document.querySelector('.workout-modal');
var $plusIcon = document.querySelector('.plus-icon-container');

$plusIcon.addEventListener('click', showWorkoutModal);

function showWorkoutModal(event) {
  $modalContent.classList.remove('hidden');
  window.addEventListener('click', hideModal);
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
