/* exported data */
window.onbeforeunload = function (event) {
  localStorage.setItem('workoutData', JSON.stringify(data));
};

window.addEventListener('pagehide', function (event) {
  localStorage.setItem('workoutData', JSON.stringify(data));
});

var grabbedData = JSON.parse(localStorage.getItem('workoutData'));

var data = {
  view: 'upcoming-workouts',
  viewUpcoming: '',
  nextExerciseId: 1,
  desktopCurrentDayView: 0,
  exercises: {},
  editing: null,
  recentExercises: {},
  recentDate: null
};

data = grabbedData || data;
