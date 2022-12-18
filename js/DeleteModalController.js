class DeleteModalController {
  constructor(element) {
    this.element = element;
    this.targetId = null;
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

  removeExercise() {
    const $view = document.querySelector(`[data-view=${data.view}]`);
    const $li = this.getListItems($view);
    if ($li.length) {
      this.removeAllListItems($li);
    }
    else this.removeSingleListItem($li);
    this.hide();
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
