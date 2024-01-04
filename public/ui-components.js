export class ButtonComponent {
  constructor({parent = document, elementId, clickHandler}) {
    this.buttonElement = parent.querySelector(`#${elementId}`)

    if (!this.buttonElement) {
      console.error(`Element with Id ${elementId} not found.`)
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

  toggleActiveStateByInput({str}) {
    str.length > 0
      ? this.enable()
      : this.disable()
  }

  addClickHandler({clickHandler}) {
    this.buttonElement.addEventListener('click', clickHandler)
  }

  setText({text}) {
    this.buttonElement.innerText = text
  }

  hide() {
    this.buttonElement.classList.add('hidden')
  }

  show() {
    this.buttonElement.classList.remove('hidden')
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

export class RadioButtonComponent {
  constructor({elementId, clickHandler}) {
    this.radioButtonElement = document.getElementById(elementId)

    if (!this.radioButtonElement) {
      console.error(`Element with Id ${elementId} not found.`)
      return
    }

    if(clickHandler) {
      this.radioButtonElement.addEventListener('click', clickHandler)
    }
  }
}
