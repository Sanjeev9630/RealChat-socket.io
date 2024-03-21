const socket = io()

const clientsTotal = document.getElementById('client-total')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const urlParams = new URLSearchParams(window.location.search);
const nameInput = document.getElementById('name-input').value=urlParams.get('username') 
console.log('asdasd',urlParams.get('username'))
const messageTone = new Audio('/message-tone.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
  })

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`
})

function sendMessage() {
    if (messageInput.value === '') return
    console.log(messageInput.value)
    const data = {
      name:urlParams,
      message: messageInput.value,
      dateTime: new Date(),
    }
    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
  }

  socket.on('chat-message', (data) => {
    // console.log(data)
    messageTone.play()
    addMessageToUI(false, data)
  })

  function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const element = `
        <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
              ${data.message}
              <span>${data.name} ● ${moment().format('h:mm a')}</span>
            </p>
          </li>
          `

    messageContainer.innerHTML += element
    scrollToBottom()
  }

  function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
  }

  messageInput.addEventListener('focus', (e) => {
      socket.emit('feedback', {
          feedback: `✍️ ${nameInput} is typing a message`,
        })
        
  })
  
  messageInput.addEventListener('keypress', (e) => {
      socket.emit('feedback', {
          feedback: `✍️ ${nameInput} is typing a message`,
        })
        
  })
  messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
      feedback: '',
    })
  })

  socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `
    messageContainer.innerHTML += element
  })

  function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
      element.parentNode.removeChild(element)
    })
  }

  //Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});