import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

console.log(form);
console.log(chatContainer);

let loadInterval;

function loader(element) {
  console.log(element);
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function displayAnswerText(element, text) {
  let index = 0;
  let textDispayInterval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(textDispayInterval);
    }
  }, 20);
}
function generateUniqueID() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16);
  return `id-${timeStamp}-${hexaDecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
     <div class="wrapper ${isAi && "ai"}">
     <div class="chat">
     <div class="profile">
     <img
      src="${isAi ? bot : user}"
      alt="${isAi ? "bot" : "user"}"
     />
     </div>
     <div class="message" id=${uniqueId}>
     ${value}
     </div>
     </div>
     </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();
  // bot's chatstripe
  const uniqueId = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);
  // fetch the response from the openai bot
  let body = JSON.stringify({
    prompt: data.get(`prompt`),
  });
  console.log(body);
  const response = await fetch("http://localhost:4001", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get(`prompt`),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";
  if (response.ok) {
    const data = await response.json();
    const parsedData = data?.bot.trim();
    displayAnswerText(messageDiv, parsedData);
    console.log({ parsedData });
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went Wrong";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
