/***** VARIABLES *****/
const mainContent = document.querySelector("main");
const addTaskIcon = document.querySelector(".addTaskIcon");
const formInputCategory = document.querySelector(".formInputCategory");
const formInputName = document.querySelector(".formInputName");
const formDescription = document.querySelector(".formDescription");
const formInputDescription = document.querySelector(".formInputDescription");
const formInputDescriptionParagraph = document.querySelector(".formInputDescriptionParagraph");
const formAmount = document.querySelector(".formAmount");
const formInputAmount = document.querySelector(".formInputAmount");
const formInputAmountParagraph = document.querySelector(".formInputAmountParagraph");
const formButton = document.querySelector(".formButton");
const toDoList = document.querySelector(".toDoList");
let toDoListArr = [];
const toDoListTask = {};
const ls = localStorage.getItem("Key");
if (ls !== null) {
  toDoListArr = JSON.parse(ls);
}
window.addEventListener("load", () => {
  showFilteredTaskList();
});
let currentFilter = "notDone";
let currentHeading;

/***** EVENT LISTENERS *****/
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form");
  if (form.style.display === "flex") {
    form.style.display = "none";
    addTaskIcon.innerHTML = ' <i class="fa-solid fa-circle-plus"></i>';
  } else {
    form.style.display = "none";
  }
  toggleTaskElements();
});

addTaskIcon.addEventListener("click", toggleTaskVisibility);

const filterButtons = document.querySelectorAll(".filter");
filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", filterList);
});

formButton.addEventListener("click", () => {
  const inputCategoryContent = formInputCategory.value;
  const inputNameContent = formInputName.value;
  const inputAmountContent = formInputAmount.value;
  const inputDescriptionContent = formInputDescription.value;
  prepareTask(inputCategoryContent, inputNameContent, inputAmountContent, inputDescriptionContent);
  showFilteredTaskList();
  formInputName.value = "";
  formInputAmount.value = "";
  formInputDescription.value = "";
  toggleTaskVisibility();
  setStorage();
});

formInputCategory.addEventListener("change", toggleTaskElements);

/***** FUNCTIONS *****/

function filterList(event) {
  currentFilter = event.target.dataset.status;
  const currentButton = event.target;
  filterButtons.forEach((filterButton) => {
    filterButton.classList.remove("activeButton");
  });
  currentButton.classList.add("activeButton");

  showFilteredTaskList();
}

function showFilteredTaskList() {
  let filteredTasks;
  if (currentFilter === "all") {
    filteredTasks = toDoListArr;
    currentHeading = "All tasks";
  } else if (currentFilter === "done") {
    filteredTasks = toDoListArr.filter(filterTasksDone);
    currentHeading = "Completed tasks";
  } else {
    filteredTasks = toDoListArr.filter(filterTasksNotDone);
    currentHeading = "To-Do tasks";
  }

  showList(filteredTasks, toDoList);
  setStorage();
}

function filterTasksDone(task) {
  if (task.status) {
    return true;
  } else {
    return false;
  }
}

function filterTasksNotDone(task) {
  if (task.status) {
    return false;
  } else {
    return true;
  }
}

function prepareTask(taskCategory, taskName, taskAmount, taskDescription) {
  const task = Object.create(toDoListTask);
  let newID = toDoListArr.length;
  task.id = newID;
  task.category = taskCategory;
  task.name = taskName;
  task.amount = taskAmount;
  task.description = taskDescription;
  task.status = false;
  toDoListArr.unshift(task);
  setStorage();
}

function toggleTaskVisibility() {
  const form = document.querySelector(".form");

  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "flex";
    mainContent.style.filter = "blur(2px)";
    addTaskIcon.innerHTML = '<i class="fa-solid fa-circle-minus"></i>';
  } else {
    form.classList.add("disappear");
    mainContent.style.filter = "blur(0px)";
    setTimeout(() => {
      form.style.display = "none";
      addTaskIcon.innerHTML = '<i class="fa-solid fa-circle-plus"></i>';
      form.classList.remove("disappear");
    }, 700);
  }
}

function toggleTaskElements() {
  const selectedCategory = formInputCategory.value;

  if (selectedCategory === "value" || selectedCategory === "stringValue") {
    formAmount.style.display = "block";
  } else {
    formAmount.style.display = "none";
  }

  if (selectedCategory === "string" || selectedCategory === "stringValue") {
    formDescription.style.display = "block";
  } else {
    formDescription.style.display = "none";
  }
}

function showList(arr, targetElement) {
  targetElement.innerHTML = "";
  if (arr.length >= 0) {
    targetElement.innerHTML = `<h2 class="toDoHeading">${currentHeading}</h2>`;
  }
  arr.forEach((each) => {
    targetElement.innerHTML += `<div class="taskContainer">
    <div class="taskElements">
    <div class="taskElementsTop">
    <input data-checkBox=${each.id} class="checkBox" type="checkbox" ${each.status ? "checked" : ""}>
    <li>${each.name}</li>
    </div>
    <i data-delete="${each.id}" class="fa-solid fa-circle-xmark delete"></i>
    </div>

     ${
       each.category === "value" || each.category === "stringValue"
         ? `
    <div class="taskValues">
      <i data-minus="${each.id}" class="fa-solid fa-circle-minus minus"></i>
      <li class="taskAmount">${each.amount || "N/A"}</li>
      <i data-plus="${each.id}" class="fa-solid fa-circle-plus plus"></i>
       </div>
    `
         : ""
     }
    <p class="taskDescription">${each.description}</p>
    </div>`;
    setStorage();
  });

  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      const idToFind = event.target.getAttribute("data-delete");
      const index = toDoListArr.findIndex((task) => task.id == idToFind);
      if (index !== -1) {
        toDoListArr.splice(index, 1);
        showFilteredTaskList();
        setStorage();
      }
    });
  });

  const plusButtons = document.querySelectorAll(".plus");
  plusButtons.forEach((plusButton) => {
    plusButton.addEventListener("click", (event) => {
      const idToFind = event.target.getAttribute("data-plus");
      const taskToUpdate = arr.find((task) => task.id == idToFind);

      if (taskToUpdate) {
        taskToUpdate.amount = parseInt(taskToUpdate.amount) + 1;
        showFilteredTaskList();
        setStorage();
      }
    });
  });

  const minusButtons = document.querySelectorAll(".minus");
  minusButtons.forEach((minusButton) => {
    minusButton.addEventListener("click", (event) => {
      const idToFind = event.target.getAttribute("data-minus");
      const taskToUpdate = arr.find((task) => task.id == idToFind);

      if (taskToUpdate) {
        taskToUpdate.amount = parseInt(taskToUpdate.amount) - 1;
        showFilteredTaskList();
        setStorage();
      }
    });
  });

  const checkBoxes = document.querySelectorAll(".checkBox");
  checkBoxes.forEach((checkBox) => {
    checkBox.addEventListener("change", (event) => {
      const taskID = parseInt(event.target.getAttribute("data-checkBox"));
      const statusToUpdate = toDoListArr.find((task) => task.id === taskID);
      if (checkBox.checked) {
        statusToUpdate.status = true;
      } else {
        statusToUpdate.status = false;
      }
      showFilteredTaskList();
      setStorage();
    });
  });
}

function setStorage() {
  localStorage.setItem("Key", JSON.stringify(toDoListArr));
}
