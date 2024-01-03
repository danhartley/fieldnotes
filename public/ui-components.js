// Button component constructor function
export class ButtonComponent {
  // Find the element with the specified ID
  constructor({elementId, clickHandler}) {
    this.buttonElement = document.getElementById(elementId)

    // Check if the element exists
    if (!this.buttonElement) {
      console.error(`Element with ID ${elementId} not found.`)
      return
    }

    // Add styles to the button
    // buttonElement.classList.add('button-component')

    // Add click event listener
    this.buttonElement.addEventListener('click', clickHandler)
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
