const API = 'http://localhost:5000/api/auth';

async function register() {

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm_password");

  // Error elements
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  // Reset errors
  [name, email, phone, password, confirmPassword].forEach(input => {
    input.classList.remove("is-invalid");
  });
  [nameError, emailError, phoneError, passwordError, confirmPasswordError]
    .forEach(err => err.classList.add("d-none"));

  let hasError = false;

  if (!name.value.trim()) {
    name.classList.add("is-invalid");
    nameError.classList.remove("d-none");
    hasError = true;
  }

  if (!email.value.trim()) {
    email.classList.add("is-invalid");
    emailError.classList.remove("d-none");
    hasError = true;
  }

  if (!phone.value.trim()) {
    phone.classList.add("is-invalid");
    phoneError.textContent = "Phone number is required";
    phoneError.classList.remove("d-none");
    hasError = true;
  } else if (!/^[0-9]{10}$/.test(phone.value)) {
    phone.classList.add("is-invalid");
    phoneError.textContent = "Phone number must be 10 digits";
    phoneError.classList.remove("d-none");
    hasError = true;
  }

  if (!password.value) {
    password.classList.add("is-invalid");
    passwordError.classList.remove("d-none");
    hasError = true;
  }

  if (!confirmPassword.value) {
    confirmPassword.classList.add("is-invalid");
    confirmPasswordError.textContent = "Confirm Password is required";
    confirmPasswordError.classList.remove("d-none");
    hasError = true;
  } else if (password.value !== confirmPassword.value) {
    confirmPassword.classList.add("is-invalid");
    confirmPasswordError.textContent = "Passwords do not match";
    confirmPasswordError.classList.remove("d-none");
    hasError = true;
  }

  if (hasError) return;

  // API call
  const response = await fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value
    })
  });

  if (response.ok) {
    showSuccessToast("Registration successful! Redirecting to login...");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);
  }

}

function showSuccessToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = "✅ " + message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

async function login() {

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const emailError = document.getElementById("loginEmailError");
  const passwordError = document.getElementById("loginPasswordError");
  const apiError = document.getElementById("loginApiError");

  // Reset errors
  [email, password].forEach(i => i.classList.remove("is-invalid"));
  [emailError, passwordError, apiError].forEach(e => e.classList.add("d-none"));

  let hasError = false;

  if (!email.value.trim()) {
    email.classList.add("is-invalid");
    emailError.textContent = "Email is required";
    emailError.classList.remove("d-none");
    hasError = true;
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    email.classList.add("is-invalid");
    emailError.textContent = "Enter a valid email";
    emailError.classList.remove("d-none");
    hasError = true;
  }

  if (!password.value) {
    password.classList.add("is-invalid");
    passwordError.classList.remove("d-none");
    hasError = true;
  }

  if (hasError) return;

  try {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value.trim(),
        password: password.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      apiError.textContent = data.msg || "Invalid email or password";
      apiError.classList.remove("d-none");
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";

  } catch (err) {
    apiError.textContent = "Server error. Try again later.";
    apiError.classList.remove("d-none");
  }
}

async function loadDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const res = await fetch(API + "/dashboard", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  const data = await res.json();
  currentUser = data.userdata;
  const { name, email, phone, createdAt } = data.userdata;

  document.getElementById("data").innerHTML = `
    <div class="info-card">
      <div class="icon-box"><i class="fa-solid fa-user"></i></div>
      <div>${name}</div>
    </div>

    <div class="info-card">
      <div class="icon-box"><i class="fa-solid fa-envelope"></i></div>
      <div>${email}</div>
    </div>

    <div class="info-card">
      <div class="icon-box"><i class="fa-solid fa-phone"></i></div>
      <div>${phone}</div>
    </div>

    <div class="info-card">
      <div class="icon-box"><i class="fa-solid fa-calendar"></i></div>
      <div>Registration Date: ${new Date(createdAt).toLocaleDateString("en-GB")}</div>
    </div>
  `;
}


function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

let currentUser = null;

function openEditModal() {
  document.getElementById("editName").value = currentUser.name;
  document.getElementById("editPhone").value = currentUser.phone;

  const modal = new bootstrap.Modal(document.getElementById("editModal"));
  modal.show();
}

async function updateProfile() {
  const token = localStorage.getItem("token");

  const name = document.getElementById("editName").value.trim();
  const phone = document.getElementById("editPhone").value.trim();

  const res = await fetch(API + "/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ name, phone })
  });

  if (res.ok) {
    location.reload();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // Login/Register page protection
  if (
    (location.pathname.includes("login") ||
      location.pathname.includes("register") ||
      location.pathname.includes("index")) &&
    token
  ) {
    window.location.href = "dashboard.html";
    return;
  }

  // Dashboard protection
  if (location.pathname.includes("dashboard")) {
    loadDashboard();
  }
});


async function confirmDelete() {
  if (!confirm("Are you sure? This account will be permanently deleted.")) return;

  const token = localStorage.getItem("token");

  const res = await fetch(API + "/delete", {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (res.ok) {
    localStorage.removeItem("token");
    window.location.href = "register.html";
  }
}