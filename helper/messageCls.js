//get error messages and show to template
function errorMessage(array, color = "red") {
  if (array.length === 0) return null;
  const errorList = [];
  for (const errObj of array) {
    errorList.push({ msg: errObj.msg, color });
  }
  return errorList;
}

//get message and show to template
function messageRawList(array) {
  if (array.length === 0) return null;
  const msgList = [];
  for (const msgObj of array) {
    msgList.push({ msg: msgObj.msg, color: msgObj.color });
  }
  return msgList;
}

module.exports = {
  errorMessage,
  messageRawList,
};
