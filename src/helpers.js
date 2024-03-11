export function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

export function getOption (key) {
  try {
    return Pear.config.options[key]
  } catch (error) {
    return null
  }
}

export const clipboard = navigator.clipboard

export async function copy (txt) {
  try {
    await clipboard.writeText(txt)
    return true
  } catch (error) {
    return false
  }
}
