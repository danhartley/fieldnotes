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

class BaseComponent {
  constructor({parent = document, selector, clickHandler}) {
    this.element = parent.querySelector(selector)

    if (!this.element) {
      console.error(`Element with selector ${selector} not found.`)
      return
    }

    if(clickHandler) {
      this.element.addEventListener('click', clickHandler)
    }
  }
}

export class ULComponent extends BaseComponent {
  constructor({parent = document, selector, clickHandler}) {
    super({
        parent
      , selector
      , clickHandler
    })
  }
}

export class MenuNavItemComponent extends BaseComponent {
  constructor({parent = document, selector = 'menu > ul', callback}) {
    super({
        parent
      , selector
      , clickHandler: (e) => {
          // Prevent redirecting to the href 
          e.preventDefault()
          
          // Remove styling for all menu links
          const links = parent.querySelectorAll('menu ul li a')
          links.forEach(link => {
            link.classList.remove(...link.classList)
          })

          // Add styling for active link
          const activeLink = e.target
          activeLink.classList.add('selected')

          this.activeLink = activeLink

          callback(e)
      }
    })
  }

  // getActivelink() {
  //   return this.activeLink || Array.from(this.parent.querySelectorAll('menu ul li a')).find(link => {        
  //         return Array.from(link.classList).includes('selected')        
  //     })    
  // }

  // getActiveHref() {
  //   return this.getActivelink().href
  // }

  // getActiveValue() {
  //   return this.getActivelink().value
  // }
}
