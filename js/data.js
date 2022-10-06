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
  viewUpcoming: '',
  nextExerciseId: 1,
  desktopCurrentDayView: 0,
  exercises: {},
  recentExercises: {},
  recentDate: null
};

for (var key in data) {
  if (grabbedData[key] === undefined) {
    badData = true;
    break;
  }
}

if (!badData) {
  data = grabbedData;
}
