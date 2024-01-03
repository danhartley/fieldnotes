export class ButtonComponent {
  constructor({elementId, clickHandler}) {
    this.buttonElement = document.getElementById(elementId)

    if (!this.buttonElement) {
      console.error(`Element with ID ${elementId} not found.`)
      return
    }

    if(clickHandler) {
      this.buttonElement.addEventListener('click', clickHandler)
    }
  }

  disable() {
    this.buttonElement.classList.add('disabled')
  }

  enable() {
    this.buttonElement.classList.remove('disabled')
  }

  toggleActiveState() {
    this.buttonElement.classList.toggle('disabled')
  }
}

export class ButtonHideShowComponent extends ButtonComponent {
  constructor({
    elementId
  }) {
    super({
        elementId
      , clickHandler: (e) => {
          const ctrl = e.target
          ctrl.innerText = ctrl.innerText === 'HIDE' ? 'SHOW' : 'HIDE'
          const fieldset = document.getElementById(ctrl.value)
          fieldset.classList.toggle('hidden')
      }
    })
  }

  scrollIntoView({ behavior = 'smooth', block = 'start', inline = 'nearest' }) {
    this.buttonElement.scrollIntoView({ behavior, block, inline })
  }
}
