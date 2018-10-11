document.getElementById("wisdom").focus();
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:e0e39606-c5d2-451f-bca2-0e1a8d6a648b',
});
var lexruntime = new AWS.LexRuntime();
var lexUserId = 'RestaurantReservation' + Date.now();
var sessionAttributes = {};

function pushChat() {

  // if there is text to be sent...
  var wisdomText = document.getElementById('wisdom');
  if (wisdomText && wisdomText.value && wisdomText.value.trim().length > 0) {

    // disable input to show we're sending it
    var wisdom = wisdomText.value.trim();
    wisdomText.value = '...';
    wisdomText.locked = true;

    // send it to the Lex runtime
    var params = {
      botAlias: '$LATEST',
      botName: 'RestaurantReservation',
      inputText: wisdom,
      userId: lexUserId,
      sessionAttributes: sessionAttributes
    };
    showRequest(wisdom);
    lexruntime.postText(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        showError('Error:  ' + err.message + ' (see console for details)')
      }
      if (data) {
        // capture the sessionAttributes for the next cycle
        sessionAttributes = data.sessionAttributes;
        // show response and/or error/dialog status
        showResponse(data);
      }
      // re-enable input
      wisdomText.value = '';
      wisdomText.locked = false;
    });
  }
  // we always cancel form submission
  return false;
}

function showRequest(daText) {

  var conversationDiv = document.getElementById('conversation');
  var requestPara = document.createElement("P");
  requestPara.className = 'userRequest';
  requestPara.appendChild(document.createTextNode(daText));
  conversationDiv.appendChild(requestPara);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showError(daText) {

  var conversationDiv = document.getElementById('conversation');
  var errorPara = document.createElement("P");
  errorPara.className = 'lexError';
  errorPara.appendChild(document.createTextNode(daText));
  conversationDiv.appendChild(errorPara);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showResponse(lexResponse) {

  var conversationDiv = document.getElementById('conversation');
  var responsePara = document.createElement("P");
  responsePara.className = 'lexResponse';
  if (lexResponse.message) {
    responsePara.appendChild(document.createTextNode(lexResponse.message));
    responsePara.appendChild(document.createElement('br'));
  }
  if (lexResponse.dialogState === 'ReadyForFulfillment') {
    responsePara.appendChild(document.createTextNode(
      'Ready for fulfillment'));
    // TODO:  show slot values
  } else {
    // responsePara.appendChild(document.createTextNode(
    //   '(' + lexResponse.dialogState + ')'));
  }
  conversationDiv.appendChild(responsePara);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}
