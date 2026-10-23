// Mi Ruta Académica: proyecto de HTML, CSS y JavaScript sin librerías.
// La información se guarda en este navegador mediante localStorage.

const STUDIES_KEY = "mi-ruta-academica-estudios-v1";
const TASKS_KEY = "mi-ruta-academica-tareas-v1";

function loadItems(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

let studies = loadItems(STUDIES_KEY);
let tasks = loadItems(TASKS_KEY);

const $ = (selector) => document.querySelector(selector);
const studyDialog = $("#studyDialog");
const taskDialog = $("#taskDialog");
const studyForm = $("#studyForm");
const taskForm = $("#taskForm");
const priorityNames = { high: "Alta", medium: "Media", low: "Baja" };

function save() {
  localStorage.setItem(STUDIES_KEY, JSON.stringify(studies));
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Los textos del usuario se escapan antes de insertarlos en HTML.
function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function dateToday() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formattedDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || "")) return "Sin fecha";
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(`${iso}T12:00:00`));
}

function dateMessage(iso) {
  if (!iso) return "Sin fecha límite";
  const today = new Date(`${dateToday()}T12:00:00`);
  const deadline = new Date(`${iso}T12:00:00`);
  const days = Math.round((deadline - today) / 86400000);
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence mañana";
  if (days > 1) return `Faltan ${days} días`;
  if (days === -1) return "Venció ayer";
  return `Venció hace ${-days} días`;
}

function renderSummary() {
  const done = tasks.filter((task) => task.completed).length;
  const percent = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  $("#studyCount").textContent = studies.length;
  $("#pendingCount").textContent = tasks.length - done;
  $("#completedCount").textContent = done;
  $("#progressCount").textContent = `${percent}%`;
  $("#progressFill").style.width = `${percent}%`;
  $("#progressBar").setAttribute("aria-valuenow", percent);
}

function renderStudies() {
  const container = $("#studiesList");
  if (!studies.length) {
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">🎓</span><h3>Todavía no agregaste estudios</h3><p>Hacé clic en «Agregar estudio» para empezar tu camino.</p></div>`;
    return;
  }
  const badgeClass = { "Inscripto/a": "pill-green", "Inscripción pendiente": "pill-rose", "Por investigar": "pill-violet" };
  const icons = { Carrera: "🎓", Curso: "💻", Taller: "🎨" };
  container.innerHTML = studies.map((study) => `
    <article class="study-card">
      <div class="study-top"><span class="study-symbol" aria-hidden="true">${icons[study.type] || "📚"}</span><span class="pill ${badgeClass[study.status] || "pill-violet"}">${safe(study.status)}</span></div>
      <div><h3>${safe(study.name)}</h3><p class="study-meta">${safe(study.type)} · ${safe(study.modality)}</p>${study.institution ? `<p class="study-meta">${safe(study.institution)}</p>` : ""}</div>
      <div class="study-deadline ${study.deadline && study.deadline < dateToday() && study.status !== "Inscripto/a" ? "is-overdue" : ""}">📅 ${study.deadline ? `Inscripción: ${formattedDate(study.deadline)} · ${dateMessage(study.deadline)}` : "Sin fecha de inscripción"}</div>
      <div class="card-actions"><button class="button button-small" data-action="edit-study" data-id="${safe(study.id)}">Editar</button><button class="button button-small button-delete" data-action="delete-study" data-id="${safe(study.id)}">Eliminar</button></div>
    </article>
  `).join("");
}

function updateStudySelect() {
  const select = $("#taskStudySelect");
  const previous = select.value;
  select.replaceChildren(new Option("General / sin estudio asignado", ""));
  studies.forEach((study) => select.add(new Option(study.name, study.id)));
  if ([...select.options].some((option) => option.value === previous)) select.value = previous;
}

function renderTasks() {
  const container = $("#tasksList");
  const query = $("#taskSearch").value.trim().toLocaleLowerCase("es");
  const filter = $("#taskFilter").value;
  const filtered = tasks.filter((task) => {
    const studyName = studies.find((study) => study.id === task.studyId)?.name || "";
    const matchesQuery = `${task.title} ${studyName}`.toLocaleLowerCase("es").includes(query);
    const matchesFilter = filter === "all" ||
      (filter === "pending" && !task.completed) ||
      (filter === "completed" && task.completed) ||
      (filter === "high" && task.priority === "high");
    return matchesQuery && matchesFilter;
  }).sort((a, b) => Number(a.completed) - Number(b.completed) || (a.deadline || "9999-12-31").localeCompare(b.deadline || "9999-12-31"));

  if (!filtered.length) {
    const hasAny = tasks.length > 0;
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">${hasAny ? "🔎" : "📝"}</span><h3>${hasAny ? "No hay tareas con ese filtro" : "Tu lista de tareas está vacía"}</h3><p>${hasAny ? "Probá otra búsqueda o filtro." : "Agregá tu primera tarea con el botón «Nueva tarea»."}</p></div>`;
    return;
  }
  container.innerHTML = filtered.map((task) => {
    const studyName = studies.find((study) => study.id === task.studyId)?.name;
    return `<article class="task-row ${task.completed ? "done" : ""}">
      <button class="task-toggle ${task.completed ? "completed" : ""}" data-action="toggle-task" data-id="${safe(task.id)}" type="button" aria-label="${task.completed ? "Marcar pendiente" : "Marcar completada"}: ${safe(task.title)}" aria-pressed="${task.completed}">${task.completed ? "✓" : ""}</button>
      <div class="task-body"><div class="task-title">${safe(task.title)}</div><div class="task-details">${studyName ? `<span>📚 ${safe(studyName)}</span>` : ""}<span class="${!task.completed && task.deadline && task.deadline < dateToday() ? "text-overdue" : ""}">📅 ${task.deadline ? `${formattedDate(task.deadline)} · ${dateMessage(task.deadline)}` : "Sin fecha límite"}</span><span class="priority priority-${safe(task.priority)}">Prioridad ${priorityNames[task.priority] || "Media"}</span></div></div>
      <div class="task-actions"><button type="button" class="button button-small" data-action="edit-task" data-id="${safe(task.id)}">Editar</button><button type="button" class="button button-small button-delete" data-action="delete-task" data-id="${safe(task.id)}">Eliminar</button></div>
    </article>`;
  }).join("");
}

function render() {
  renderSummary();
  renderStudies();
  updateStudySelect();
  renderTasks();
}

function openStudy(id = "") {
  studyForm.reset();
  studyForm.elements.id.value = id;
  $("#studyDialogTitle").textContent = id ? "Editar estudio" : "Agregar estudio";
  const study = studies.find((item) => item.id === id);
  if (study) {
    for (const key of ["name", "institution", "type", "modality", "deadline", "status"]) {
      studyForm.elements[key].value = study[key] || "";
    }
  }
  studyDialog.showModal();
}

function openTask(id = "") {
  taskForm.reset();
  updateStudySelect();
  taskForm.elements.id.value = id;
  $("#taskDialogTitle").textContent = id ? "Editar tarea" : "Nueva tarea";
  const task = tasks.find((item) => item.id === id);
  if (task) {
    for (const key of ["title", "studyId", "deadline", "priority"]) {
      taskForm.elements[key].value = task[key] || "";
    }
    taskForm.elements.completed.checked = task.completed;
  }
  taskDialog.showModal();
}

$("#addStudyButton").addEventListener("click", () => openStudy());
$("#addTaskButton").addEventListener("click", () => openTask());
document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => $("#" + button.dataset.close).close());
});

studyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(studyForm);
  const id = String(form.get("id") || newId());
  const study = {
    id,
    name: String(form.get("name")).trim(),
    institution: String(form.get("institution")).trim(),
    type: String(form.get("type")),
    modality: String(form.get("modality")),
    deadline: String(form.get("deadline")),
    status: String(form.get("status"))
  };
  if (!study.name) return;
  const index = studies.findIndex((item) => item.id === id);
  if (index === -1) studies.push(study); else studies[index] = study;
  save(); render(); studyDialog.close();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(taskForm);
  const id = String(form.get("id") || newId());
  const task = {
    id,
    title: String(form.get("title")).trim(),
    studyId: String(form.get("studyId")),
    deadline: String(form.get("deadline")),
    priority: String(form.get("priority")),
    completed: form.get("completed") === "on"
  };
  if (!task.title) return;
  const index = tasks.findIndex((item) => item.id === id);
  if (index === -1) tasks.push(task); else tasks[index] = task;
  save(); render(); taskDialog.close();
});

$("#studiesList").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "edit-study") openStudy(id);
  if (action === "delete-study") {
    const study = studies.find((item) => item.id === id);
    if (study && confirm(`¿Querés eliminar «${study.name}»? Las tareas asociadas quedarán como tareas generales.`)) {
      studies = studies.filter((item) => item.id !== id);
      tasks.forEach((task) => { if (task.studyId === id) task.studyId = ""; });
      save(); render();
    }
  }
});

$("#tasksList").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  if (action === "edit-task") openTask(id);
  if (action === "toggle-task") {
    task.completed = !task.completed;
    save(); render();
  }
  if (action === "delete-task" && confirm(`¿Querés eliminar «${task.title}»?`)) {
    tasks = tasks.filter((item) => item.id !== id);
    save(); render();
  }
});

$("#taskSearch").addEventListener("input", renderTasks);
$("#taskFilter").addEventListener("change", renderTasks);
$("#todayLabel").textContent = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric" }).format(new Date());
render();
