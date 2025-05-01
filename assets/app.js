document.addEventListener("DOMContentLoaded", () => {
  // ---------- Utils ----------
  const saveTasks = () => {
    const tasks = [];
    document.querySelectorAll("[data-js-task-item]").forEach((item) => {
      const text = item.querySelector("[data-js-task-label]").textContent;
      const done = item.querySelector("[data-js-task-checkbox]").checked;
      tasks.push({ text, done });
    });
    localStorage.setItem("todo-items", JSON.stringify(tasks));
  };

  const loadTasks = (list) => {
    const saved = JSON.parse(localStorage.getItem("todo-items") || "[]");
    saved.forEach(({ text, done }) => {
      const item = createTaskElement(text, done);
      list.appendChild(item);
    });
  };

  const createTaskElement = (text, done = false) => {
    const listItem = document.createElement("li");
    listItem.setAttribute("data-js-task-item", "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("data-js-task-checkbox", "");
    checkbox.checked = done;

    const label = document.createElement("span");
    label.setAttribute("data-js-task-label", "");
    label.textContent = text;
    if (done) label.classList.add("task-label--done");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Slet";
    deleteButton.setAttribute("data-js-task-delete", "");

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(deleteButton);
    return listItem;
  };

  // ---------- Opgaver ----------
  const taskForm = document.querySelector("[data-js-task-form]");
  const taskInput = taskForm?.elements?.task ?? null;
  const taskList = document.querySelector("[data-js-task-list]");

  if (taskForm && taskInput && taskList) {
    loadTasks(taskList);

    taskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const taskText = taskInput.value.trim();
      if (taskText === "") return;
      const item = createTaskElement(taskText);
      taskList.appendChild(item);
      taskInput.value = "";
      saveTasks();
    });

    taskList.addEventListener("change", (event) => {
      if (event.target.matches("[data-js-task-checkbox]")) {
        const label = event.target.nextElementSibling;
        if (label?.hasAttribute("data-js-task-label")) {
          label.classList.toggle("task-label--done", event.target.checked);
          saveTasks();
        }
      }
    });

    taskList.addEventListener("click", (event) => {
      if (event.target.matches("[data-js-task-delete]")) {
        const settings = JSON.parse(localStorage.getItem("todo-settings")) || {};
        if (settings.confirmDelete) {
          const confirmed = confirm("Er du sikker på, at du vil slette denne opgave?");
          if (!confirmed) return;
        }
        const item = event.target.closest("[data-js-task-item]");
        if (item) item.remove();
        saveTasks();
      }
    });
  }

  // ---------- Dark Mode ----------
  const globalSettings = JSON.parse(localStorage.getItem("todo-settings"));
  if (globalSettings?.darkmode) {
    document.body.classList.add("dark-mode");
  }

  // ---------- Profil ----------
  const profileForm = document.querySelector("[data-js-profile-form]");
  const usernameEl = document.querySelector("[data-js-username]");
  const emailEl = document.querySelector("[data-js-email]");
  const bioEl = document.querySelector("[data-js-bio]");

  if (profileForm) {
    const { name, email, bio } = profileForm.elements;
    const savedProfile = JSON.parse(localStorage.getItem("todo-profile"));

    if (savedProfile) {
      name.value = savedProfile.name || "";
      email.value = savedProfile.email || "";
      bio.value = savedProfile.bio || "";

      if (usernameEl) usernameEl.textContent = savedProfile.name;
      if (emailEl) emailEl.textContent = savedProfile.email;
      if (bioEl) bioEl.textContent = savedProfile.bio;
    }

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const profile = {
        name: name.value.trim(),
        email: email.value.trim(),
        bio: bio.value.trim(),
      };
      localStorage.setItem("todo-profile", JSON.stringify(profile));
      alert("Profil gemt!");

      if (usernameEl) usernameEl.textContent = profile.name;
      if (emailEl) emailEl.textContent = profile.email;
      if (bioEl) bioEl.textContent = profile.bio;
    });
  }

  // ---------- Indstillinger ----------
  const settingsForm = document.querySelector("[data-js-settings-form]");
  if (settingsForm) {
    const { darkmode, showCompleted, confirmDelete, viewFilter } = settingsForm.elements;
    const savedSettings = JSON.parse(localStorage.getItem("todo-settings"));

    if (savedSettings) {
      darkmode.checked = !!savedSettings.darkmode;
      showCompleted.checked = !!savedSettings.showCompleted;
      confirmDelete.checked = !!savedSettings.confirmDelete;
      viewFilter.value = savedSettings.viewFilter || "all";
    }

    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const settings = {
        darkmode: darkmode.checked,
        showCompleted: showCompleted.checked,
        confirmDelete: confirmDelete.checked,
        viewFilter: viewFilter.value,
      };
      localStorage.setItem("todo-settings", JSON.stringify(settings));
      alert("Indstillinger gemt!");
    });
  }
});
