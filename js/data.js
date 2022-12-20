/* exported data */
window.onbeforeunload = function (event) {
  localStorage.setItem('workoutData', JSON.stringify(data));
};

window.addEventListener('pagehide', function (event) {
  localStorage.setItem('workoutData', JSON.stringify(data));
});

var grabbedData = JSON.parse(localStorage.getItem('workoutData'));

var data = {
  view: 'home',
  exercises: {},
  storedImages: {},
  nextCreatedId: -1,
  created: []
};

if (grabbedData && Object.keys(grabbedData).length === 5) {
  data = grabbedData;
}
