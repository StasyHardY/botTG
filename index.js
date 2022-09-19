const TelegramApi= require('node-telegram-bot-api')
const token = '5520399226:AAElbE6_JfouDtKFvynV0Eq-Yvp1B5OjrtI'
const bot = new TelegramApi(token,{polling:true})

const chats = {} // сюда добавляем рандомное число от бота

const startGame = async (chatId) => {
   // запуск игры и загадывание числа 
   await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 5, а ты должен ее угадать!`);
   const randomNumber = Math.floor(Math.random() * 5)
   chats[chatId] = randomNumber;
   await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
    
}

// поле с кнопками
 const gameOptions = {
   reply_markup: JSON.stringify({
       inline_keyboard: [
           [{text: '1', callback_data: '1'}],[{text: '2', callback_data: '2'}],[{text: '3', callback_data: '3'}],
           [{text: '4', callback_data: '4'}],[{text: '5', callback_data: '5'}] 
           
       ]
   })
}

const start = () => {

   // Описание команд
   bot.setMyCommands([
      {command: '/start', description:'Приветствие пользователя'},
      {command: '/info', description:'Информация'},
      {command: '/game', description:'Запуск игры'}
   ])
   
   bot.on('message', async (msg) => {
      // достаем из сообщения данные
      const text = msg.text
      const chatId = msg.chat.id
      const first_name = msg.from.first_name


      try {
         if (text === '/start') {
            return bot.sendMessage(chatId, `Добро пожаловать, ${first_name} `)
         }
         if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${first_name}`)
         }
         if (text === '/game') {
            return startGame(chatId);
        }
         return bot.sendMessage(chatId,'Я тебя не понимаю') // Ответ бота, если команда не распознана
      } catch (error) {
         return bot.sendMessage(chatId, console.log(msg));
      }

   }) 

   bot.on('callback_query', async (msg) => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      
      await bot.sendMessage(chatId,`Выбрана цифра ${data}`)
      await bot.sendMessage(chatId, `Анализирую ответ...`);

      setTimeout(() => {
       bot.sendMessage(chatId, `1`);
      }, 1000)
      setTimeout(() => {
        bot.sendMessage(chatId, `2`);
        }, 2000)
        setTimeout(() => {
        bot.sendMessage(chatId, `3`);
        }, 3000)
      
      

      setTimeout(() =>{
         if (data == chats[chatId]) {
            bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`);
            bot.sendMessage(chatId, `Игра окончена, чтобы попробовать снова, напиши /game`);
        } else {
            bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`);
            bot.sendMessage(chatId, `Игра окончена, чтобы попробовать снова, напиши /game`);
        }
      }, 4000)
   })
}
start()