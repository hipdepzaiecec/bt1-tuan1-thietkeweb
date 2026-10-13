"use strict";

// Dữ liệu khởi tạo. Được phép chỉnh sửa hoặc thêm thuộc tính nếu cần.
const items = [
  { id: 1, title: "Viết báo cáo HTML", dueDate: "2026-10-20", priority: "Cao", status: "pending" },
  { id: 2, title: "Ôn Flexbox", dueDate: "2026-10-23", priority: "Trung bình", status: "pending" },
  { id: 3, title: "Làm bài DOM", dueDate: "2026-10-19", priority: "Cao", status: "done" },
  { id: 4, title: "Đọc tài liệu CSS", dueDate: "2026-10-25", priority: "Thấp", status: "pending" },
  { id: 5, title: "Thiết kế trang cá nhân", dueDate: "2026-10-21", priority: "Trung bình", status: "done" }
];

// DOM elements
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const dueInput = document.getElementById("task-due");
const prioritySelect = document.getElementById("task-priority");
const titleError = document.getElementById("title-error");
const taskListEl = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");

let nextId = 6;

// ========== C1: Hiển thị dữ liệu từ mảng lên DOM ==========
function renderTasks(tasks) {
  taskListEl.innerHTML = "";

  if (tasks.length === 0) {
    taskListEl.innerHTML = "<p>Không có công việc nào phù hợp.</p>";
    return;
  }

  tasks.forEach(function (task) {
    const card = document.createElement("div");
    card.className = "task-card priority-" + task.priority.replace(/\s/g, "-");
    card.dataset.id = task.id;

    // Thông tin
    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("h3");
    title.textContent = task.title;

    const due = document.createElement("p");
    due.textContent = "Hạn: " + (task.dueDate || "Chưa đặt");

    const priority = document.createElement("p");
    priority.textContent = "Ưu tiên: " + task.priority;

    const status = document.createElement("span");
    status.className = "status-badge status-" + task.status;
    status.textContent = task.status === "done" ? "Đã hoàn thành" : "Chưa hoàn thành";

    info.appendChild(title);
    info.appendChild(due);
    info.appendChild(priority);
    info.appendChild(status);

    // Nút hành động
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn-toggle";
    toggleBtn.textContent = task.status === "done" ? "Hoàn tác" : "Hoàn thành";
    toggleBtn.addEventListener("click", function () {
      toggleStatus(task.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Xóa";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(info);
    card.appendChild(actions);
    taskListEl.appendChild(card);
  });
}

// ========== C2: Đọc form, kiểm tra dữ liệu và thêm bản ghi ==========
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  if (title === "") {
    titleError.textContent = "Tên công việc không được để trống!";
    titleInput.focus();
    return;
  }
  titleError.textContent = "";

  const newTask = {
    id: nextId++,
    title: title,
    dueDate: dueInput.value || "",
    priority: prioritySelect.value,
    status: "pending"
  };

  items.push(newTask);
  renderWithFilters();

  taskForm.reset();
  prioritySelect.value = "Trung bình";
  titleInput.focus();
});

// Xóa lỗi khi người dùng nhập
titleInput.addEventListener("input", function () {
  if (titleInput.value.trim() !== "") {
    titleError.textContent = "";
  }
});

// ========== C3: Tìm kiếm & lọc trạng thái ==========
function getFilteredTasks() {
  const keyword = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;

  return items.filter(function (task) {
    const matchTitle = task.title.toLowerCase().includes(keyword);
    const matchStatus = status === "all" || task.status === status;
    return matchTitle && matchStatus;
  });
}

function renderWithFilters() {
  renderTasks(getFilteredTasks());
}

searchInput.addEventListener("input", renderWithFilters);
statusFilter.addEventListener("change", renderWithFilters);

// ========== C4: Cập nhật trạng thái & xóa theo ID ==========
function toggleStatus(id) {
  const task = items.find(function (t) {
    return t.id === id;
  });
  if (task) {
    task.status = task.status === "done" ? "pending" : "done";
    renderWithFilters();
  }
}

function deleteTask(id) {
  const index = items.findIndex(function (t) {
    return t.id === id;
  });
  if (index !== -1) {
    if (confirm("Bạn có chắc muốn xóa công việc này?")) {
      items.splice(index, 1);
      renderWithFilters();
    }
  }
}

// ========== Khởi tạo ==========
renderWithFilters();