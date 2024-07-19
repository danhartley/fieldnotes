/* eslint-disable no-undef */
import {
  deleteFieldnotesById,
  getAdminFieldnotesStubs,
  getFirebaseAuth,
  onAdminFirebaseAuthStateChange,
} from '../data/api.js'

import { CheckBoxComponent } from '../common/ui-components.js'

import { showNotificationsDialog } from '../common/ui-actions.js'

const init = async () => {
  const d = document
  const globalAdmin = {}

  const container = d.getElementById('stubs-collection')

  const getStubs = async () => {
    const stubs = await getAdminFieldnotesStubs({})

    globalAdmin.stubs = stubs

    const collection = d.getElementById('stubs-collection-template')
    const ul = collection.content.cloneNode(true).querySelector('ul')
    const btn = collection.content.cloneNode(true).querySelector('button')

    stubs.forEach((stub) => {
      const li = d.getElementById('stubs-template').content.cloneNode(true)
      const checkbox = li.querySelector('input')
      const label = li.querySelector('label')

      checkbox.id = stub.id
      checkbox.setAttribute('data-status', stub.status)

      label.innerText = stub.title
      label.htmlFor = checkbox.id

      ul.appendChild(li)
    })

    container.appendChild(ul)
    container.appendChild(btn)

    btn.addEventListener('click', () => {
      try {
        // Find titles checked for deletion
        const checkedTitles = Array.from(
          container.querySelectorAll('input[type="checkbox"]')
        )
          .filter((checkbox) => checkbox.checked)
          .map((title) => title.id)

        globalAdmin.stubs.forEach(async (stub) => {
          // Check title has been checked, and that its status is deleted (soft delete state)
          if (checkedTitles.includes(stub.id) && stub.status === 'deleted') {
            const response = await deleteFieldnotesById({
              id: stub.id,
              fieldnotesId: stub.fieldnotesId,
            })
            showNotificationsDialog({
              message: response.message,
            })
          }
        })
      } catch (e) {
        showNotificationsDialog({
          message: e.message,
          type: 'error',
        })
      }
    })
  }

  onAdminFirebaseAuthStateChange({
    auth: getFirebaseAuth(),
    getStubs,
  })

  new CheckBoxComponent({
    selector: '#deleted-input-checkbox',
    clickHandler: (e) => {
      const checkbox = e.target
      const titles = container.querySelectorAll('input')
      if (checkbox.checked) {
        titles.forEach((title) => {
          if (title.dataset.status !== 'deleted') {
            title.parentElement.classList.add('hidden')
          }
        })
      } else {
        titles.forEach((title) => {
          if (title.dataset.status !== 'deleted') {
            title.parentElement.classList.remove('hidden')
          }
        })
      }
    },
  })
}

init()
