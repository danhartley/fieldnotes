export class ButtonComponent {
  constructor({parent = document, elementSelector, clickHandler}) {
    this.buttonElement = parent.querySelector(`#${elementSelector}`)

    if (!this.buttonElement) {
      // console.error(`Element with Id ${elementSelector} not found.`)
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

  getText() {
    return this.buttonElement.innerText
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
    elementSelector
  }) {
    super({
        elementSelector
      , clickHandler: (e) => {
          const ctrl = e.target
          ctrl.innerText = ctrl.innerText === 'HIDE' ? 'SHOW' : 'HIDE'
          const fieldset = document.getElementById(ctrl.value)
          fieldset.classList.toggle('hidden')
      }
    })
  }

  scrollIntoView({ behavior = 'smooth', block = 'start', inline = 'nearest' }) {
    if(this.buttonElement) this.buttonElement.scrollIntoView({ behavior, block, inline })
  }
}

export class RadioButtonComponent {
  constructor({elementSelector, clickHandler}) {
    this.radioButtonElement = document.getElementById(elementSelector)

    if (!this.radioButtonElement) {
      console.error(`Element with Id ${elementSelector} not found.`)
      return
    }

    if(clickHandler) {
      this.radioButtonElement.addEventListener('click', clickHandler)
    }
  }
}

class BaseComponent {
  constructor({parent = document, selector, clickHandler, changeHandler}) {
    this.element = parent.querySelector(selector)

    if (!this.element) {
      console.error(`Element with selector ${selector} not found.`)
      return
    }

    if(clickHandler) {
      this.element.addEventListener('click', clickHandler)
    }

    if(changeHandler) {
      this.element.addEventListener('change', changeHandler)
    }
  }
}

export class CheckBoxComponent extends BaseComponent {
  constructor({parent = document, selector, clickHandler, changeHandler}) {
    super({
        parent
      , selector
      , clickHandler
      , changeHandler
    })
  }
}