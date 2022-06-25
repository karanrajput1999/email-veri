const form = document.querySelector("#form");

form.addEventListener("submit", loginUser);

async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch("/user/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  location.href = "/dashboard";
}
