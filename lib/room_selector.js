var selectedRoom = "lobby";

App = {};
App.socket = io.connect();

$('button').on('click', function(){
  selectedRoom = $(this).data('room');
  App.socket.emit('joinRoom', selectedRoom);
  $('#room-selector').hide();
  $('#container').fadeIn('slow');
});

function home(){
  alert('clicked')
  window.location.replace("/");
}
