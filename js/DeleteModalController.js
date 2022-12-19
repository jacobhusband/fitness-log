class DeleteModalController {
  constructor(element) {
    this.element = element;
    this.targetId = null;
    this.targetDate = null;
    this.checkSavedViewEmpty = null;
    this.view = null;
    this.handleClick = this.handleClick.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
    this.element.addEventListener('submit', this.handleClick);
  }

  handleClick(event) {
    event.preventDefault();
    if (event.submitter.className === 'yes') this.removeExercise();
    else this.hide();
  }

  show() {
    this.element.classList.remove('hidden')
  }

  hide() {
    this.element.classList.add('hidden')
  }

  setTargetId(id) {
    this.targetId = id;
  }

  setTargetDate(date) {
    this.targetDate = date;
  }

  setCheckerFunction(func) {
    this.checkSavedViewEmpty = func;
  }

  removeExercise() {
    const $view = document.querySelector(`[data-view=${data.view}]`);
    const $li = this.getListItems($view);
    if (data.view === 'saved') {
      this.removeAllListItems($li);
      this.removeAllOccurencesInDataObject(this.targetId);
    } else {
      this.removeSingleListItem($li);
      this.removeSingleExerciseObject(this.targetDate, this.targetId);
    }
    this.hide();
    this.checkSavedViewEmpty();
  }

  removeAllOccurencesInDataObject(id) {
    const { created, exercises } = data;
    id = Number(id);
    for (const key in created)
      if (created[key].id === id) created.splice(key, 1);
    for (const key in exercises)
      this.removeEntryInExerciseObject(exercises[key], id, key)
  }

  removeSingleExerciseObject(date, id) {
    const { exercises } = data;
    for (const key in exercises) {
      if (key === date)
        this.removeEntryInExerciseObject(exercises[key], id, date)
    }
  }

  removeEntryInExerciseObject(obj, id, date) {
    for (const key in obj)
      if (Number(key) === Number(id)) {
        delete obj[key]
        this.checkToRemoveEmptyDataObject(obj, date);
      }
  }

  checkToRemoveEmptyDataObject(obj, date) {
    if (Object.keys(obj).length === 1) delete data.exercises[date];
  }

  getListItems($view) {
    return (data.view === 'home')
      ? $view.querySelector(`li[data-id="${this.targetId}"]`)
      : $view.querySelectorAll(`li[data-id="${this.targetId}"]`);
  }

  removeAllListItems($li) {
    for (let i = 0; i < $li.length; i++) {
      this.checkToRemoveEmptyUl($li[i].parentElement)
      $li[i].remove();
    }
  }

  removeSingleListItem($li) {
    this.checkToRemoveEmptyUl($li.parentElement)
    $li.remove()
  }

  checkToRemoveEmptyUl($ul) {
    if ($ul.children.length === 2 && $ul.children[0].className === 'separator')
      $ul.remove();
  }
}
