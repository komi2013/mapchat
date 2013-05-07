var socket = io.connect('/');
var score = 0;

function marubatsu() {
    socket.on('connected', function() {
        socket.json.emit('init');
    });

    socket.on('session', function(u_data) {
      guest = u_data[0];
      heya = u_data[1];
    });

    socket.on('msg', function(data) {
        update(data);
    });
}

function send() {
    m_data[0] = guest;
    m_data[1] = heya;
    m_data[2] = s_data[2]; //turn
    m_data[3] = s_data[3];
    socket.json.emit('msg', m_data);
}
function update(data) {
console.log('update'+data);
  turn = data[2];
  s_data = data;
  var result = '';
  if(data[0] == guest){
    $('#notice').empty().append('wait or refresh');
    result = 'you are winner';
  }else{
    $('#notice').empty().append('your turn');
    result = 'you are loser';
  }
  if(data[2] % 2 == 1){
    $('#'+data[3]).empty().append('X');
  }
  else{
    $('#'+data[3]).empty().append('O');
  }

  if($('#1').text() == $('#2').text() && $('#2').text() == $('#3').text()){
    alert(result);
  }else if($('#1').text() == $('#2').text() && $('#2').text() == $('#3').text()){
    alert(result);
  }else if($('#4').text() == $('#5').text() && $('#5').text() == $('#6').text()){
    alert(result);
  }else if($('#7').text() == $('#8').text() && $('#8').text() == $('#9').text()){
    alert(result);
  }else if($('#1').text() == $('#4').text() && $('#4').text() == $('#7').text()){
    alert(result);
  }else if($('#2').text() == $('#5').text() && $('#5').text() == $('#8').text()){
    alert(result);
  }else if($('#1').text() == $('#5').text() && $('#6').text() == $('#9').text()){
    alert(result);
  }else if($('#3').text() == $('#5').text() && $('#5').text() == $('#7').text()){
    alert(result);
  }
}

