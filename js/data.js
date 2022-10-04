/* exported data */
window.onbeforeunload = function (event) {
  localStorage.setItem('data', JSON.stringify(data));
};

window.addEventListener('pagehide', function (event) {
  localStorage.setItem('data', JSON.stringify(data));
});

var grabbedData = JSON.parse(localStorage.getItem('data'));
var badData = false;

var data = {
  view: 'upcoming-workouts',
  exercises: [],
  nextExerciseId: 1,
  organizedExercises: [],
  desktopCurrentDayView: 0
};

for (var key in grabbedData) {
  if (data[key] === undefined) {
    badData = true;
    break;
  }
}

if (!badData) {
  data = grabbedData;
}
