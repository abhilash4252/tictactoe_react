var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var History = ReactRouter.History;

var Rebase = require('re-base');
var base = Rebase.createClass('https://bc-chat-room.firebaseio.com/');

var chatRoomStyle = {
  border: '1px solid black',
  height: '200px',
  overflow: 'scroll'
};
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var UpdateScroll = function (){
  var element = document.querySelector("#scrollableChatList");
  element.scrollTop = element.scrollHeight;
};

//pusher initialisation
var pusher = new Pusher('926b899c43b30dd50675', {
  encrypted: true
});

var channel = pusher.subscribe('test_channel');

channel.bind('my_event', function(message) {
  alert(message + " has won the game");
});

var MessageForm = React.createClass({
  sendMessage : function(event) {
    event.preventDefault();
    var timeStamp = (new Date()).getTime();
    var message = {
      desc : this.refs.message.value,
      userId : this.props.params.userId,
      sentTime : timeStamp
    };
    this.props.sendMessage(message);
    this.refs.messageForm.reset();
  },
  render : function() {
    return(
      <form onSubmit={this.sendMessage} ref="messageForm">
        <input type="text" ref="message" style={{width: '75%', height: '40px'}} placeholder="Stay Connected with your Network, Start Chatting..."/>
        <input type="submit" style={{width: '15%', height: '40px'}}/>
      </form>
    );
  }
});

var Message = React.createClass({
  render : function() {
   var sentDate = new Date(parseInt(this.props.message.sentTime));
   var month = sentDate.getMonth();
   var date = sentDate.getDate();
   var year = sentDate.getFullYear();
   var hours = sentDate.getHours();
   var minutes = sentDate.getMinutes();
    return(
      <p>
        <b>{this.props.message.userId}: </b> {hours}:{minutes} <br />
        <i className="pull-right">{monthNames[month]}, {date} {year}</i>
        {this.props.message.desc}
      </p>
    );
  }
});
var ChatRoom = React.createClass({
  renderMessage : function(key) {
    return <Message key={key} message={this.props.messages[key]} />
  },
  componentDidMount : function() {
    setInterval(function() {
      var element = document.querySelector("#scrollableChatList");
      element.scrollTop = element.scrollHeight;
    }, 100);
  },
  render : function() {
    return (
      <div style={{margin: '15px'}}>
        <h5>Chat Room</h5>
        <div style={chatRoomStyle} id="scrollableChatList">
          {Object.keys(this.props.messages).map(this.renderMessage)}
        </div>
        <MessageForm params={this.props.params} sendMessage={this.props.sendMessage} />
      </div>
    );
  }
});

var User = React.createClass({
  render : function() {
    return(
      <li>{this.props.details.name}</li>
    );
  }
});

var UsersList = React.createClass({
  renderUser : function(key) {
    return <User key={key} details={this.props.users[key]} />
    },
  render : function() {
    return(
      <div>
      <ul>
      {Object.keys(this.props.users).map(this.renderUser)}
      </ul>
      </div>
    );
  }
});

var TicTacToeElement = React.createClass({
  markAsMove : function(e) {
    e.preventDefault();
    console.log(this.props.players.player1.name);
    if((this.props.players.player1.name == this.props.params['userId'] )&&( this.props.players.player1.turn)) {
      console.log("player1 turn");
      this.props.makeTheMove(this.props.position, "player1");
    }
    else if((this.props.players.player2.name == this.props.params['userId']) && (this.props.players.player2.turn)){
      console.log("player2 turn");
      this.props.makeTheMove(this.props.position, "player2");
    }
  },
  render : function() {
    var element = "N/A";
    var position = this.props.position;
    if(this.props.tic_tac_toe[position] == "player1") {
      element = "player1";
    }
    else if(this.props.tic_tac_toe[position] == "player2"){
      element = "player2";
    }
    return(
      <td style={{width: '25px'}} >
        <div style={{width: '25px',height: '25px'}}>
        {( element == "player1" ? <i className="fa fa-circle-o"></i> : (element == "player2" ? <i className="fa fa-times"></i> : <button onClick = {this.markAsMove} ></button>) )}
        </div>
      </td>
    )
  }
});
var TicTacToe = React.createClass({
  render : function() {
    return (
      <div className="col-xs-9">
        <h3>TIC TAC TOE</h3>
        <table className="table table-bordered" style={{width: 'initial', margin: 'auto'}} >
          <tbody>
            <tr>
              <TicTacToeElement position="position1" tic_tac_toe={this.props.tic_tac_toe} players={this.props.players} params={this.props.params} makeTheMove={this.props.makeTheMove} />
              <TicTacToeElement position="position2"  tic_tac_toe={this.props.tic_tac_toe}  players={this.props.players}  params={this.props.params}  makeTheMove={this.props.makeTheMove} />
              <TicTacToeElement position="position3"  tic_tac_toe={this.props.tic_tac_toe}  players={this.props.players}  params={this.props.params}  makeTheMove={this.props.makeTheMove} />
            </tr>
            <tr>
              <TicTacToeElement position="position4"  tic_tac_toe={this.props.tic_tac_toe}  players={this.props.players}  params={this.props.params}  makeTheMove={this.props.makeTheMove} />
              <TicTacToeElement position="position5"  tic_tac_toe={this.props.tic_tac_toe}  players={this.props.players}  params={this.props.params}  makeTheMove={this.props.makeTheMove} />
              <TicTacToeElement position="position6"  tic_tac_toe={this.props.tic_tac_toe}  players={this.props.players}  params={this.props.params}  makeTheMove={this.props.makeTheMove} />
            </tr>
            <tr>
              <TicTacToeElement position="position7"  tic_tac_toe={this.props.tic_tac_toe}  players={this.props.players}  params={this.props.params}  makeTheMove={this.props.makeTheMove} />
              <TicTacToeElement position="position8"  tic_tac_toe={this.props.tic_tac_toe}  players={this.props.players}  params={this.props.params}  makeTheMove={this.props.makeTheMove} />
              <TicTacToeElement position="position9"  tic_tac_toe={this.props.tic_tac_toe} players={this.props.players}  params={this.props.params}  makeTheMove={this.props.makeTheMove} />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

var Player = React.createClass({
  render : function() {
    return(
      <li>
      {( this.props.details.name == "N/A" ? <span>Waiting</span> : <span>{this.props.details.name}</span> )}
      </li>
    )
  }
});
var Players = React.createClass({
  joinGame : function(e) {
    e.preventDefault();
    console.log("joing the game");
    if(this.props.players.player1.name == "N/A")
      this.props.joinGameAsPlayer1(this.props.params.userId);
    else if(this.props.players.player2.name == "N/A")
      this.props.joinGameAsPlayer2(this.props.params.userId)
  },
  renderUser : function(key) {
    return <Player key={key} details={this.props.players[key]} />
  },
  render : function() {
    var x = false;
    if((this.props.players.player1.name == "N/A" || this.props.players.player2.name == "N/A") && (this.props.players.player1.name != this.props.params.userId && this.props.players.player2.name != this.props.params.userId))
      x = true;

    return (
      <div className="col-xs-3">
        <h4>Players</h4>
        {( !x ? <ul>{Object.keys(this.props.players).map(this.renderUser)}</ul> : <form onSubmit={this.joinGame} ><button onCLick={this.joinGame}>Join</button> </form>)}
      </div>
    );
  }
});

var GameDome = React.createClass({
  newTicTacToe : function(e) {
    e.preventDefault();
    this.prop.newTicTacToe();
  },
  render : function() {
    return (
      <div style={{height : "300px", border : '1px solid black'} } className="row">
        <button onClick={this.props.newTicTacToe}>New Game </button>
        <TicTacToe tic_tac_toe={this.props.game_dome.tic_tac_toe} players={this.props.game_dome.players}  params={this.props.params}  makeTheMove={this.props.makeTheMove} />
        <Players players={this.props.game_dome.players} params={this.props.params} joinGameAsPlayer1={this.props.joinGameAsPlayer1} joinGameAsPlayer2={this.props.joinGameAsPlayer2}/>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState : function() {
    return {
      chat_db: {
        users: {},
        messages :{},
        game_dome: {
          tic_tac_toe : {
            position1: "N/A",
            position2: "N/A",
            position3: "N/A",
            position4: "N/A",
            position5: "N/A",
            position6: "N/A",
            position7: "N/A",
            position8: "N/A",
            position9: "N/A"
          },
          players : {
            player1: { name: "N/A", turn: false },
            player2: { name: "N/A", turn: false }
          }
        }
      }
    };
  },
  componentDidMount : function() {
    base.syncState('/',{
      context : this,
      state : 'chat_db'
    });

  },
  sendMessage : function(message) {
    this.state.chat_db.messages['message'+message.sentTime] = message;
    this.setState({chat_db : this.state.chat_db});
  },
  joinGameAsPlayer1 : function(userId) {
    this.state.chat_db.game_dome.players.player1['name'] =  userId;
    this.state.chat_db.game_dome.players.player1['turn'] =  false;
    this.setState({chat_db : this.state.chat_db});
    if( this.state.chat_db.game_dome.players.player2['name'] !=  "N/A"){
      this.state.chat_db.game_dome.players.player1['turn'] = true;
      this.setState({chat_db : this.state.chat_db});
    }
  },
  joinGameAsPlayer2 : function(userId) {
    this.state.chat_db.game_dome.players.player2['name'] =  userId;
    this.state.chat_db.game_dome.players.player2['turn'] =  false;
    this.setState({chat_db : this.state.chat_db});
    if( this.state.chat_db.game_dome.players.player1['name'] !=  "N/A"){
      this.state.chat_db.game_dome.players.player1['turn'] = true;
      this.setState({chat_db : this.state.chat_db});
    }

  },
  makeTheMove : function(position, player) {
   this.state.chat_db.game_dome.tic_tac_toe[position] = player;
   console.log("in app");
   if(player == "player1") {
     this.state.chat_db.game_dome.players.player1.turn = false;
     this.state.chat_db.game_dome.players.player2.turn = true;
   }
   else if(player == "player2") {
     this.state.chat_db.game_dome.players.player2.turn = false;
     this.state.chat_db.game_dome.players.player1.turn = true;
   }

   this.setState({chat_db : this.state.chat_db});
   //to check if game is done
   var pos1 = this.state.chat_db.game_dome.tic_tac_toe.position1;
   var pos2 = this.state.chat_db.game_dome.tic_tac_toe.position2;
   var pos3 = this.state.chat_db.game_dome.tic_tac_toe.position3;
   var pos4 = this.state.chat_db.game_dome.tic_tac_toe.position4;
   var pos5 = this.state.chat_db.game_dome.tic_tac_toe.position5;
   var pos6 = this.state.chat_db.game_dome.tic_tac_toe.position6;
   var pos7 = this.state.chat_db.game_dome.tic_tac_toe.position7;
   var pos8 = this.state.chat_db.game_dome.tic_tac_toe.position8;
   var pos9 = this.state.chat_db.game_dome.tic_tac_toe.position9;

   //win sequence [1,2,3]
   if( (pos1 == pos2) && (pos2 == pos3)) {
     if(pos1 == "player1") {
      alert(this.state.chat_db.game_dome.players.player1.name + " has won the game. Better luck in next game");
      this.newTicTacToe();
     }
     if(pos1 == "player2") {
      alert(this.state.chat_db.game_dome.players.player2.name + " has won the game. Better luck in next game");
      this.newTicTacToe();
     }
   }

   //win sequence [4,5,6]
   if( (pos4 == pos5) && (pos5 == pos6)) {
     if(pos4 == "player1") {
      alert(this.state.chat_db.game_dome.players.player1.name + " has won the game. Better luck in next game");
      this.newTicTacToe();
     }
     if(pos4 == "player2") {
       alert(this.state.chat_db.game_dome.players.player2.name + " has won the game. Better luck in next game");
      this.newTicTacToe();
     }
   }

   //win sequence [7,8,9]
   if( (pos7 == pos8) && (pos8 == pos9)) {
     if(pos7 == "player1") {
       alert(this.state.chat_db.game_dome.players.player1.name + " has won the game. Better luck in next game");
       alert("Player 1 has won the game. Better luck in next game");
       this.newTicTacToe();
     }
     if(pos7 == "player2") {
       alert(this.state.chat_db.game_dome.players.player2.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
   }
   
   //win sequence [1,4,7
   if( (pos1 == pos4) && (pos4 == pos7)) {
     if(pos1 == "player1") {
       alert(this.state.chat_db.game_dome.players.player1.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
     if(pos1 == "player2") {
       alert(this.state.chat_db.game_dome.players.player2.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
   }

   //win sequence [2,5,8]
   if( (pos2 == pos5) && (pos5 == pos8)) {
     if(pos2 == "player1") {
       alert(this.state.chat_db.game_dome.players.player1.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
     if(pos2 == "player2") {
       alert(this.state.chat_db.game_dome.players.player2.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
   }

   //win sequence [3,6,9]
   if( (pos3 == pos6) && (pos6 == pos9)) {
     if(pos3 == "player1") {
       alert(this.state.chat_db.game_dome.players.player1.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
     if(pos3 == "player2") {
       alert(this.state.chat_db.game_dome.players.player2.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
   }

   //win sequence [1,5,9]
   if( (pos1 == pos5) && (pos5 == pos9)) {
     if(pos1 == "player1") {
       alert(this.state.chat_db.game_dome.players.player1.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
     if(pos1 == "player2") {
       alert(this.state.chat_db.game_dome.players.player2.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
   }

   //win sequence [3,5,7]
   if( (pos3 == pos5) && (pos5 == pos7)) {
     if(pos3 == "player1") {
       alert(this.state.chat_db.game_dome.players.player1.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
     if(pos3 == "player2") {
       alert(this.state.chat_db.game_dome.players.player2.name + " has won the game. Better luck in next game");
       this.newTicTacToe();
     }
   }

   var drawn = true;
   for( var i = 1; i< 10; i++) {
     if(this.state.chat_db.game_dome.tic_tac_toe["position"+i] == "N/A")
       drawn = false;
   }
   if(drawn) {
     alert("It's a draw match. Well Played Folks");
     this.newTicTacToe();
   } 

  },
  
  newTicTacToe : function() {
    for(var i = 1; i<10; i++) {
      var position = "position"+i;
      this.state.chat_db.game_dome.tic_tac_toe[position] = "N/A";
      }
    this.setState({chat_db : this.state.chat_db});
  },
  goBack : function(e) {
    console.log("logout");
    if(this.props.params.userId == this.state.chat_db.game_dome.players.player1.name)
      {
        this.state.chat_db.game_dome.players.player1.name = "N/A";
        this.state.chat_db.game_dome.players.player1.turn = false;
        this.state.chat_db.game_dome.players.player2.turn = false;
        this.setState({chat_db: this.state.chat_db});
      }
      else if(this.props.params.userId == this.state.chat_db.game_dome.players.player2.name)
        {
          this.state.chat_db.game_dome.players.player2.name = "N/A";
          this.state.chat_db.game_dome.players.player1.turn = false;
          this.state.chat_db.game_dome.players.player2.turn = false;
          this.setState({chat_db: this.state.chat_db});
        }
    this.newTicTacToe();
    this.props.history.pushState(null, '/');
    location.reload();
    this.newTicTacToe();
  },
  render : function() {
    return (
      <div className="container">
      <div className="row">
        <h3>BC's Chat Room: </h3>
        <div className="col-xs-9">
          <GameDome game_dome={this.state.chat_db.game_dome} params={this.props.params} newTicTacToe = {this.newTicTacToe} makeTheMove={this.makeTheMove} joinGameAsPlayer1={this.joinGameAsPlayer1} joinGameAsPlayer2={this.joinGameAsPlayer2} />
          <ChatRoom messages={this.state.chat_db.messages} sendMessage={this.sendMessage} params={this.props.params} />
        </div>
        <div className="col-xs-3">
          <form onSubmit={this.goBack}>
            <button onClick={this.goBack}>Log Out</button>
          </form>
          <UsersList users={this.state.chat_db.users} />
        </div>
      </div>
      </div>

    );
  }
});

var UserRegistration = React.createClass({
  mixins : [History],
  getInitialState : function() {
    return {
      users : {}
    };
  },
  componentDidMount : function() {
    base.syncState('/users', {
      context : this,
      state : 'users'
    });
  },
  goToChatRoom : function(event) {
    //event.preventDefault();
    var user = {
      name : this.refs.userId.value,
      status : "active"
    };
    var alreadyPresent = false;
    for(var key in this.state.users) {
      if(this.state.users.hasOwnProperty(key)) {
        if(this.state.users[key].name == user.name)
          {
            alreadyPresent = true;
          }
      }
    }
    if(alreadyPresent) {
      this.history.pushState(null, '/users/'+this.refs.userId.value);
    }
    else {
    var timestamp = (new Date()).getTime();
    var userId = this.refs.userId.value;
    this.history.pushState(null, '/users/'+userId);
    this.state.users['user'+timestamp] = user;
    this.setState({users : this.state.users });
    }
  },
  render : function() {
    return (
      <form onSubmit={this.goToChatRoom} >
        <h2>Enter your Name</h2>
        <input type="text" ref="userId" placeholder="Your Name....!" required />
        <input type="Submit" />
      </form>
    );
  }
});

var NotFound = React.createClass({
  render : function() {
    return <h1>Not Found !</h1>
  }
});

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={UserRegistration} />
    <Route path="/users/:userId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));

