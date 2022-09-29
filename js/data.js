/* exported data */
window.onbeforeunload = function (event) {
  localStorage.setItem('data', JSON.stringify(data));
};

var data = JSON.parse(localStorage.getItem('data'));

if (!data) {
  data = {
    view: 'upcoming-workouts',
    exercises: [],
    nextExerciseId: 1
  };
}
