const $body = document.querySelector("body");
const $searchField = document.querySelector("form.search");
const $createForm = document.querySelector("form.create");
const $cancelButton = $createForm.querySelector("button.cancel");
const $searchContentUl = document.querySelector("ul.search.content");
const $viewSearch = $searchContentUl.parentElement;
const $searchContentButtons = document.querySelector(".buttons.search");
const $calendarModal = document.querySelector(".modal.calendar");
const $calendarForm = $calendarModal.querySelector("form.calendar");
const $selectedWorkoutAddButton = document.querySelector("button.add.workout");
const $muscleSearchOptions = $searchField.querySelector("select");
const $viewHome = document.querySelector(".home.view");
const $viewCreate = document.querySelector(".create.view");
const $viewSaved = document.querySelector(".saved.view");

const muscleObj = {
  biceps: 1,
  shoulders: 2,
  "serratus anterior": 3,
  chest: 4,
  triceps: 5,
  abs: 6,
  calves: 7,
  glutes: 8,
  traps: 9,
  quads: 10,
  hamstrings: 11,
  lats: "12,3",
  legs: "10,11,8,7",
  arms: "1,5,2",
  obliques: 14,
  soleus: 15,
};

const muscleObjReverse = {
  1: "Biceps",
  2: "Shoulders",
  3: "Serratus Anterior",
  4: "Chest",
  5: "Triceps",
  6: "Abs",
  7: "Calves",
  8: "Glutes",
  9: "Traps",
  10: "Quads",
  11: "Hamstrings",
  12: "Lats",
  13: "Brachialis",
  14: "Obliques",
  15: "Soleus",
};

const months = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

const workoutInfo = {};
let selectedWorkouts = {};
let selectedDate = null;
let nextFetch = null;

$searchField.addEventListener("submit", handleSearchFieldSubmit);
$createForm.addEventListener("submit", createWorkout);
$calendarForm.addEventListener("click", handleCalendarCancelClick);
$calendarForm.addEventListener("submit", handleCalendarFormSubmit);
$searchContentUl.addEventListener("click", selectWorkout);
$searchContentButtons.addEventListener("click", modifySearchItems);
$cancelButton.addEventListener("click", cancelWorkoutCreation);
window.addEventListener("hashchange", makePageSwaps);

initializePage();
buildHomepage();

function initializePage() {
  showViewFromDataObject();

  if (data.view === "search") showSearchView();
  else if (data.view === "home") showHomeView();
  else if (data.view === "create") {
    showCreateView();
    hideSearchField();
  } else if (data.view === "saved") showSavedView();
}

function makePageSwaps(event) {
  hideAllViews();
  if (window.location.hash === "#home") {
    showHomeView();
  } else if (window.location.hash === "#create") {
    showCreateView();
    hideSearchField();
  } else if (window.location.hash === "#search") {
    showSearchView();
    focusSearchField();
  } else if (window.location.hash === "#saved") {
    showSavedView();
  }
}

function createWorkout(event) {
  event.preventDefault();
  const workoutObj = getWorkoutFormInfo(event);
  getImages([{ id: workoutObj.id, name: workoutObj.name }]);
  $viewSaved.appendChild(buildLi(workoutObj));
  saveWorkoutInfo(workoutObj);
  hashToSavedView();
}

function showViewFromDataObject() {
  window.location.hash = `#${data.view}`;
  $body.dataset.view = data.view;
}

function showSavedView() {
  $body.dataset.view = "saved";
  data.view = "saved";
  $viewSaved.classList.remove("hidden");
}

function focusSearchField() {
  $muscleSearchOptions.focus();
}

function showSearchView() {
  $body.dataset.view = "search";
  data.view = "search";
  $viewSearch.classList.remove("hidden");
}

function showCreateView() {
  $body.dataset.view = "create";
  data.view = "create";
  $viewCreate.classList.remove("hidden");
}

function hideSearchField() {
  $searchField.classList.add("hidden");
}

function showHomeView() {
  $body.dataset.view = "home";
  data.view = "home";
  $viewHome.classList.remove("hidden");
}

function hideAllViews() {
  $viewSearch.classList.add("hidden");
  $viewHome.classList.add("hidden");
  $viewCreate.classList.add("hidden");
  $viewSaved.classList.add("hidden");
  $searchField.classList.remove("hidden");
}

function cancelWorkoutCreation(event) {
  $createForm.reset();
  window.history.go(-1);
}

function hashToSavedView() {
  window.location.hash = "#saved";
}

function saveWorkoutInfo(workoutObj) {
  data.nextCreatedId--;
  data.created.push(workoutObj);
}

function getWorkoutFormInfo(event) {
  const { title, description, reps, sets, mg1, mg2 } = event.target.elements;
  const muscles = [mg1.value, mg2.value];
  return {
    name: title.value,
    description: description.value,
    reps: reps.value,
    sets: sets.value,
    muscles,
    id: data.nextCreatedId,
  };
}

function buildHomepage() {
  for (const date in data.exercises) createDateUl(date);
  createSavedUl(data.created);
}

function addLiToUl(ul, li) {
  return ul.appendChild(li);
}

function createSavedUl(info) {
  const ul = buildElement("ul", {
    class: "saved content col",
    "dataset-id": info.id,
  });
  buildUl(info, ul, true);
  $viewSaved.appendChild(ul);
}

function createDateUl(date, insert = false) {
  let inserted = false;
  const arr = [];
  const ul = buildElement("ul", {
    class: "search content col",
    "dataset-id": date,
  });
  for (const workout in data.exercises[date]) {
    if (workout === "date") continue;
    arr.push(data.exercises[date][workout]);
  }
  buildUl(arr, ul, true);
  ul.insertBefore(
    buildSeparator(getSeparatorText(data.exercises[date].date)),
    ul.firstChild
  );
  if (insert) {
    for (let i = 0; i < $viewHome.children.length; i++) {
      if (Number($viewHome.children[i].dataset.id) > Number(ul.dataset.id)) {
        $viewHome.insertBefore(ul, $viewHome.children[i]);
        inserted = true;
        break;
      }
    }
    if (!inserted) $viewHome.appendChild(ul);
  } else {
    $viewHome.appendChild(ul);
  }
}

function buildSeparator(text) {
  return buildElement("div", { class: "separator" }, [
    buildElement("h2", { class: "separator-text", textContent: text }),
  ]);
}

function getSeparatorText(workoutTime) {
  const today = Math.trunc(new Date().getTime() / 86400000);
  const future = Math.trunc(
    new Date(`${workoutTime[2]}-${workoutTime[1]}-${workoutTime[0]}T00:00:00`) /
      86400000
  );
  if (future - today < 0) return null;
  else if (future - today === 0) return "Today";
  else if (future - today === 1) return "Tomorrow";
  else return `In ${future - today} days`;
}

function handleCalendarCancelClick(event) {
  $calendarModal.classList.add("hidden");
  selectedDate = null;
}

function handleCalendarFormSubmit(event) {
  event.preventDefault();
  if (!selectedDate) return;
  for (const key in selectedWorkouts) selectedWorkouts[key] = workoutInfo[key];
  const [year, month, day, date] = convertSelectedDateToStandardDate();
  saveDateInSelectedWorkout(year, month, day);
  if (data.exercises[date]) {
    addWorkoutsToExistingUl();
  } else {
    addWorkoutsToNewUl();
  }
  $calendarModal.classList.add("hidden");
  $viewHome.classList.remove("hidden");
  selectedDate = null;
  window.location.hash = "home";
}

function addWorkoutsToNewUl() {
  data.exercises[date] = selectedWorkouts;
  clearSelectedWorkouts();
  createDateUl(date, true);
}

function addWorkoutsToExistingUl() {
  const placeholder = data.exercises[date];
  mergeSelectedWorkoutsWithDataObjectWorkouts(date);
  clearSelectedWorkouts();
  for (const key in data.exercises[date])
    addNewSelectedWorkouts(placeholder, key);
}

function addNewSelectedWorkouts(placeholder, key) {
  if (!placeholder[key])
    addLiToUl(getHomeViewUlWithDate(date), buildLi(data.exercises[date][key]));
}

function clearSelectedWorkouts() {
  selectedWorkouts = {};
}

function mergeSelectedWorkoutsWithDataObjectWorkouts(date) {
  data.exercises[date] = Object.assign(
    {},
    data.exercises[date],
    selectedWorkouts
  );
}

function saveDateInSelectedWorkout(year, month, day) {
  selectedWorkouts.date = [day, month, year];
}

function convertSelectedDateToStandardDate() {
  const month =
    selectedDate[1].toString().length === 1
      ? "0" + selectedDate[1].toString()
      : selectedDate[1].toString();
  const day =
    selectedDate[0].toString().length === 1
      ? "0" + selectedDate[0].toString()
      : selectedDate[0].toString();
  const date = Number(`${selectedDate[2]}${month}${day}`);
  const year = selectedDate[2].toString();
  return [year, month, day, date];
}

function getHomeViewUlWithDate(date) {
  return $viewHome.querySelector(`[data-id="${date}"]`);
}

function modifySearchItems(event) {
  if (event.target.matches(".add")) {
    addWorkouts();
  } else if (event.target.matches(".more")) {
    getWorkouts(nextFetch);
  }
}

function addWorkouts() {
  $calendarModal.classList.remove("hidden");

  /* eslint-disable-next-line */
  let myCalendar = new VanillaCalendar({
    selector: "#myCalendar",
    pastDates: false,
    availableWeekDays: [
      { day: "monday" },
      { day: "tuesday" },
      { day: "wednesday" },
      { day: "thursday" },
      { day: "friday" },
      { day: "saturday" },
      { day: "sunday" },
    ],
    onSelect: (data, elem) => {
      const date = data.date.split(" ");
      selectedDate = [Number(date[2]), months[date[1]], Number(date[3])];
    },
  });
}

function selectWorkout(event) {
  const li = event.target.closest("li");
  const id = li?.dataset.id;
  if (!id) return;
  if (selectedWorkouts[id]) {
    removeSelectedWorkout(id);
    makeBorderMatchBackground(li);
  } else {
    addSelectedWorkout(id, li);
    makeBorderGreen(li);
  }
  hideOrShowWorkoutButton();
}

function hideOrShowWorkoutButton() {
  !Object.keys(selectedWorkouts).length
    ? $selectedWorkoutAddButton.classList.add("hidden")
    : $selectedWorkoutAddButton.classList.remove("hidden");
}

function makeBorderGreen(li) {
  li.style.border = "1px solid green";
}

function makeBorderMatchBackground(li) {
  li.style.border = "1px solid #0e0e0e";
}

function addSelectedWorkout(id, li) {
  selectedWorkouts[id] = li;
}

function removeSelectedWorkout(id) {
  delete selectedWorkouts[id];
}

function handleSearchFieldSubmit(event) {
  event.preventDefault();
  while ($searchContentUl.lastElementChild)
    $searchContentUl.lastElementChild.remove();
  const input = event.target.elements.search.value;
  url = `https://wger.de/api/v2/exercise/?language=2&limit=5&muscles=${muscleObj[input]}`;
  getWorkouts(url);
}

function getWorkouts(url) {
  let newData;

  fetch("https://lfz-cors.herokuapp.com/?url=" + encodeURIComponent(url), {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((data) => {
      nextFetch = data.next;
      newData = cleanData(data);
      buildUl(newData, $searchContentUl);
      getImages(newData);
      window.location.hash = "search";
      $searchContentButtons.classList.remove("hidden");
    })
    .catch((err) => console.error(err));
}

function getImages(results) {
  let waitTime = 0;
  results.forEach((obj, index) => {
    if (!data.storedImages[obj.id]) {
      const url = `https://imsea.herokuapp.com/api/1?q=person_doing_${obj.name}_gym_workout`;

      fetch("https://lfz-cors.herokuapp.com/?url=" + encodeURIComponent(url), {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((result) => result.json())
        .then((images) => {
          data.storedImages[obj.id] = images.results[0];
          swapSpinner(images.results[0], obj.id);
        })
        .catch(() => {
          setTimeout(() => {
            getBackupImages(obj);
          }, waitTime);
          waitTime += 500;
        });
    } else {
      swapSpinner(data.storedImages[obj.id], obj.id);
    }
  });
}

function getBackupImages(obj) {
  fetch(
    `https://bing-image-search1.p.rapidapi.com/images/search?q=person_doing_${obj.name}_gym_workout`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "7554e57ef3msh1833d2c439a50a2p14b399jsnab00643335db",
        "X-RapidAPI-Host": "bing-image-search1.p.rapidapi.com",
      },
    }
  )
    .then((result) => result.json())
    .then((images) => {
      if (!images.value) {
        swapSpinner("images/image-not-found.webp", obj.id);
        return;
      }
      const image = images.value[0].contentUrl;
      data.storedImages[obj.id] = image;
      swapSpinner(image, obj.id);
    })
    .catch((err) => {
      swapSpinner("images/image-not-found.webp", obj.id);
      console.error(err);
    });
}

function cleanData(data) {
  const results = [];
  const flag = {};
  data.results.forEach((result) => {
    if (!flag[result.id]) {
      flag[result.id] = true;
      result.description = result.description
        .replace(/<\/?(?:p|ol|li|ul|em|strong)[^>]*>/g, "")
        .split("-")
        .join("")
        .replaceAll("\n", ". ")
        .replaceAll("..", ".");
      results.push(result);
    }
  });
  return results;
}

function buildUl(data, ul, home = false) {
  data.forEach((obj) => {
    const muscles =
      obj.muscles.length === 1
        ? [obj.muscles[0], obj.muscles_secondary[0]]
        : [obj.muscles[0], obj.muscles[1]];
    const muscleArr = muscles.filter((x) => x !== undefined);
    const desc =
      obj.description === "" || obj.description.length < 10
        ? "No description received..."
        : obj.description;
    const content = {
      id: obj.id,
      description: desc,
      name: obj.name,
      muscles: muscleArr,
    };
    workoutInfo[content.id] = content;
    ul.appendChild(buildLi(content));
  });
}

function buildLi(exerciseObj) {
  const { id, name, description, muscles } = exerciseObj;
  const muscleText = convertMuscleDataToText(muscles);

  return buildElement("li", { class: "search-item row", "dataset-id": id }, [
    buildElement("div", { class: "col" }, [
      data.storedImages[id]
        ? buildElement("img", { src: data.storedImages[id] })
        : createSpinner(id),
    ]),
    buildElement("div", { class: "col w-100" }, [
      buildElement("div", { class: "row" }, [
        buildElement("h3", { textContent: name.toUpperCase() }),
        buildElement("span", { textContent: muscleText }),
      ]),
      buildElement("div", { class: "row" }, [
        buildElement("p", { textContent: description }),
      ]),
    ]),
  ]);
}

function convertMuscleDataToText(muscles) {
  if (typeof muscles[0] === "string") return `${muscles[0]}/${muscles[1]}`;
  return muscles.length === 2
    ? `(${muscleObjReverse[muscles[0]]}/${muscleObjReverse[muscles[1]]})`
    : muscles.length === 1
    ? `(${muscleObjReverse[muscles[0]]})`
    : null;
}

function buildElement(tag, attr, children) {
  const el = document.createElement(tag);
  for (var key in attr) {
    key === "textContent"
      ? (el.textContent = attr[key])
      : key.includes("dataset")
      ? (el.dataset[key.split("-")[1]] = attr[key])
      : el.setAttribute(key, attr[key]);
  }
  if (children) children.forEach((child) => child && el.appendChild(child));
  return el;
}

function createSpinner(id) {
  return buildElement("div", { class: "lds-ring", "dataset-id": id }, [
    buildElement("div", {}),
    buildElement("div", {}),
    buildElement("div", {}),
    buildElement("div", {}),
  ]);
}

function swapSpinner(img, id) {
  const image = img || "/images/image-not-found.webp";
  const spinner = document.querySelector(`.lds-ring[data-id="${id}"]`);
  const papa = spinner?.parentElement;
  if (papa) {
    spinner.remove();
    papa.appendChild(buildElement("img", { src: image }));
  }
}
