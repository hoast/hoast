window.copyToClipboard = (text) => {
  // Create element and set content.
  const element = document.createElement('textarea')
  element.value = text
  document.body.append(element)

  // Select element's content.
  element.select()
  element.setSelectionRange(0, 999999)

  // Copy to clipboard.
  document.execCommand('copy')

  // Remove element.
  element.remove()
}
