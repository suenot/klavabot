var TelegramBot = require('node-telegram-bot-api');
var fs = require('fs');
var path = require('path');
var dictionaries;
fs.readdir(path.join(__dirname, 'dict/'), function(err, files){
  dictionaries = files.map(function(file){
    return file.substr(0, file.length-4);
  });
});

var token = '';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
var newArray = [];
var newString = '';
var starTime;
var endTime;

// Matches /start [eng_base]
bot.onText(/\/start (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var chatId = msg.chat.id;
  var resp = match[1];
  var newArray = [];
  fs.readFile(path.join(__dirname, 'dict/', resp + '.txt'), 'utf8', function (err,data) {
    if (err) {
      bot.sendMessage(chatId, 'Нет такого словаря.');
    } else if (resp === 'eng_code_python') {
      var data = data.split('\n');
      for (var i = 0; i < 3; i++) {
        newArray.push( data[Math.floor(Math.random()*data.length)].trim() );
      };
      newString = newArray.join('\n');
    } else {
      var data = data.split(' ');
      for (var i = 0; i < 10; i++) {
        newArray.push( data[Math.floor(Math.random()*data.length)] );
      };
      newString = newArray.join();
    }
    starTime = new Date();
    bot.sendMessage(chatId, newString);
  });
});

// Matches /list [whatever]
bot.onText(/\/list/, function (msg) {
  var fromId = msg.from.id;
  bot.sendMessage(fromId, dictionaries.join(' '));
});

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  var fromId = msg.from.id;
  if (newString == '') {    
  } else if (msg.text.substr(0,1) === '/') {
  } else if (msg.text == newString) {
    bot.sendMessage(chatId, 'Молодец.');
    newString == '';
    endTime = new Date();
  } else {
    bot.sendMessage(chatId, 'Попробуй еще раз.');
  }
});