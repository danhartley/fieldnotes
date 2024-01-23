const set = ({key, value}) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const get = ({key}) => {
  return JSON.parse(localStorage.getItem(key))
}

const remove = ({key}) => {
  localStorage.removeItem(key)
}

const clear = () => {
  localStorage.clear()
}

export const appLocalStorage = {
    get
  , set
  , remove
  , clear
}