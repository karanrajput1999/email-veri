const form = document.querySelector("#form");

form.addEventListener("submit", registerUser);

async function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch("/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  }).then((res) => {
    res.json();
  });
  location.href = "/login";
}
