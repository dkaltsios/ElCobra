/*global document */
;(() => {
  const source = document.querySelectorAll('.prettyprint.source.linenums')
  let i = 0
  let lineNumber = 0
  let lineId
  let lines
  let totalLines
  let anchorHash

  if (source && source[0]) {
    anchorHash = document.location.hash.slice(1)
    lines = source[0].querySelectorAll('li')
    totalLines = lines.length

    for (; i < totalLines; i++) {
      lineNumber++
      lineId = `line${lineNumber}`
      lines[i].id = lineId
      if (lineId === anchorHash) {
        lines[i].className += ' selected'
      }
    }
  }
})()
