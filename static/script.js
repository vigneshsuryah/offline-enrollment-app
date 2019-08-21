if ('serviceWorker' in navigator) {
    // we are checking here to see if the browser supports the service worker api
     window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
           // Registration was successful
           console.log('Service Worker registration was successful with scope: ', registration.scope);
         }, function(err) {
           // registration failed :( 
           console.log('ServiceWorker registration failed: ', err);
         });

        navigator.serviceWorker.ready.then(function(registration) {
          console.log('Service Worker Ready')
          return registration.sync.register('test-tag-from-devtools')
        }).then(function () {
         console.log('sync event registered')
        }).catch(function() {
         // system was unable to register for a sync,
         // this could be an OS-level restriction
         console.log('sync registration failed')
        });
      }); 
 }

$( document ).ready(function() {
  console.log( " document ready!" );
  $.ajax({
    type: "GET",
    url: '/states',
    contentType: 'application/json',
    success: function (data) {
      console.log('states list received successfully : ' + JSON.stringify(data));
      var sel = document.getElementById('state');
      for(var i = 0; i < data.states.length; i++) {
          var opt = document.createElement('option');
          opt.innerHTML = data.states[i];
          opt.value = data.states[i];
          sel.appendChild(opt);
      }
    },
    dataType: 'json'
  });
  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOfflineStatus);
});




function submitFunction (event) {
  event.preventDefault()
  console.log('submitted', event)
  first_name = $('#first_name').val()
  middle_name = $('#middle_name').val()
  last_name = $('#last_name').val()
  state = $('#state').val()
  address = $('#address').val()
  zipcode = $('#zipcode').val()
  console.log('values,', first_name, middle_name, last_name, state, address, zipcode)
  //$('#my_form').hide()
    // send  to server
  var data = {
    first_name: first_name,
    middle_name: middle_name,
    last_name: last_name,
    state: state,
    address: address,
    zipcode: zipcode
  }
  // send message to service worker via postMessage
  var msg = {
    'form_data': data
  }
  navigator.serviceWorker.controller.postMessage(msg)  // <--- This line right here sends our data to sw.js

  $.ajax({
    type: "POST",
    url: '/submit',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function () {
      console.log('Your data has been been stored')
    },
    dataType: 'json'
  });

  message = 'Your data has been been stored'
  $('#message').text(message);

  return false
}

function clearFunction () {
  message = '';
  $('#message').text(message);
  $('#form_id').trigger("reset");
}



function updateOnlineStatus()
{
    document.getElementById("status").innerHTML = "Network is ONLINE back. Sync the Data Now.";
    document.getElementById("message").style.display = "none";
    document.getElementById("status").style.color = "blue";
}

function updateOfflineStatus()
{
    document.getElementById("status").innerHTML = "Network is OFFLINE now";
    document.getElementById("message").style.display = "none";
    document.getElementById("status").style.color = "red";
}

window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOfflineStatus);