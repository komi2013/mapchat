var socket = io.connect('/');
var score = 0;
function chat() {
    socket.on('connected', function() {
        socket.json.emit('init', { 'hello': 'hello' });
    });

    socket.on('session', function(u_data) {
      console.log('session '+u_data);
      guest = u_data[0];
      heya = u_data[1];
    });

    socket.on('msg', function(data) {
//       if (data[2]) {
        update(data[2]);
        console.log("guest jouken "+data[0]);
        if(guest != data[0]){
          score = 1;
        } 
//       }
    });
}

function send() {
    m_data[0] = guest;
    m_data[1] = heya;
    m_data[2] = $('#comment').val();
    m_data[3] = score;
console.log(m_data);
    socket.json.emit('msg', m_data);
    $('#comment').val("");
}
function update(data) {
  var obj = $(document.createElement('div'));
  obj.html(data);
console.log('update'+guest % 2);
  if(guest % 2 == 1){
    $('.upper').append(obj);
  }
  else{
    $('.under').append(obj);
  }
}

