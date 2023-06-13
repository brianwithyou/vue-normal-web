export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
export function isExternalIcon(path) {
  return /^(\/)+([a-zA-Z0-9\s_\\.\-():/])+(.svg|.png|.jpg)$/g.test(path) || /^(https?:|mailto:|tel:)/.test(path)
}
