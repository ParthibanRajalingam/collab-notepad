const socket = io();
const textarea = document.getElementById("notepad");

textarea.addEventListener("input", () => {
  socket.emit("textUpdate", textarea.value);
});

socket.on("textUpdate", (newText) => {
  if (textarea.value !== newText) {
    textarea.value = newText;
  }
});

socket.on("loadText", (text) => {
  textarea.value = text;
});
