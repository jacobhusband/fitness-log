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
  nextExerciseId: 1,
  exercises: {},
  editing: null,
  storedImages: {}
};

data = grabbedData || data;
