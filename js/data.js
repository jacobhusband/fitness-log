/* exported data */
window.onbeforeunload = function (event) {
  localStorage.setItem('data', JSON.stringify(data));
};

window.addEventListener('pagehide', function (event) {
  localStorage.setItem('data', JSON.stringify(data));
});

var data = JSON.parse(localStorage.getItem('data'));

if (!data || !data.view || !data.nextExerciseId || !data.organizedExercises) {
  data = {
    view: 'upcoming-workouts',
    exercises: [],
    nextExerciseId: 1,
    organizedExercises: [],
    desktopCurrentDayView: 0
  };
}
