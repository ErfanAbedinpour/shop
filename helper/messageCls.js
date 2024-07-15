//get error messages and show to template
function errorMessage(array, color = 'red') {
  if (array.length < 1) return null;
  const errorList = []
  for (const errObj of array) {
    errorList.push({ msg: errObj.msg, color })
  }
}


//get message and show to template
function messageRawList(array) {
  if (array.length < 1) return null;
  const msgList = []
  for (msgObj of array) {
    msgList.push(msgObj.msg, msgObj.color)
  }
}


module.exports = {
  errorMessage,
  messageRawList
}
