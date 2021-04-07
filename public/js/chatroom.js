(function connect() {
  let socket = io.connect("/");

  let username = document.querySelector("#username");
  let usernameBtn = document.querySelector("#usernameBtn");
  let curUsername = document.querySelector(".card-header");

  usernameBtn.addEventListener("click", (e) => {
    socket.emit("change_username", { username: username.value });
    curUsername.textContent = username.value;
    username.value = "";
  });

  let message = document.querySelector("#message");
  let messageBtn = document.querySelector("#messageBtn");
  let messageList = document.querySelector("#message-list");

  messageBtn.addEventListener("click", (e) => {
    socket.emit("new_message", { message: message.value });
    message.value = "";
  });

  socket.on("receive_message", (data) => {
    let listItem = document.createElement("li");
    listItem.textContent = data.username + ": " + data.message;
    listItem.classList.add("list-group-item");
    messageList.appendChild(listItem);
  });

  let info = document.querySelector(".info");

  message.addEventListener("keypress", (e) => {
    socket.emit("typing");
  });

  socket.on("typing", (data) => {
    info.innerHTML = data.username + " is typing...";
    setTimeout(() => {
      info.textContent = "";
    }, 1000);
  });

  socket.on("user-updated", (data) => {
    let userCount = document.getElementById("total-users");
    userCount.innerHTML = data;
  });

  socket.on("new-user", (_) => {
    let listItem = document.createElement("li");
    listItem.textContent = "-------New user joined------";
    listItem.classList.add("list-group-item");
    messageList.appendChild(listItem);
  });

  socket.on("changed_username", (data) => {
    let listItem = document.createElement("li");
    listItem.textContent = `-----${data.oldName} changed to ${data.newName}----`;
    listItem.classList.add("list-group-item");
    messageList.appendChild(listItem);
  });
})();
