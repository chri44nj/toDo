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
let currentFilter = "notDone";
let currentHeading;
const toDoListTask = {};
const ls = localStorage.getItem("Key");
if (ls !== null) {
  toDoListArr = JSON.parse(ls);
}
window.addEventListener("load", () => {
  showFilteredTaskList();
});

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

formInputCategory.addEventListener("change", toggleTaskElements);

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

addTaskIcon.addEventListener("click", toggleTaskVisibility);

function toggleTaskVisibility() {
  const form = document.querySelector(".form");

  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "flex";
    mainContent.style.filter = "blur(2px)";
    addTaskIcon.innerHTML = '<i class="fa-solid fa-circle-minus"></i>';
    playPopOpenSound();
  } else {
    mainContent.style.filter = "blur(0px)";
    addTaskIcon.innerHTML = '<i class="fa-solid fa-circle-plus"></i>';
    form.style.display = "none";
    playPopCloseSound();
  }
}

const filterButtons = document.querySelectorAll(".filter");
filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", filterList);
});

function filterList(event) {
  playFilterSound();
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
    currentHeading = "All";
  } else if (currentFilter === "done") {
    filteredTasks = toDoListArr.filter(filterTasksDone);
    currentHeading = "Completed";
  } else {
    filteredTasks = toDoListArr.filter(filterTasksNotDone);
    currentHeading = "To-Do";
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

  showList(filteredTasks, toDoList);
  setStorage();
}

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
  /*   toggleTaskVisibility(); */
  setStorage();
});

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
  const form = document.querySelector(".form");
  form.classList.add("disappear3");
  playPaperSound();
  mainContent.style.filter = "blur(0px)";
  addTaskIcon.innerHTML = '<i class="fa-solid fa-circle-plus"></i>';
  setTimeout(() => {
    form.style.display = "none";
    form.classList.remove("disappear3");
  }, 700);
  setStorage();
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
      playDeleteSound();
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
      playFilterSound();
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
      playFilterSound();
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
      const taskContainer = event.target.parentElement.parentElement.parentElement;
      const statusToUpdate = toDoListArr.find((task) => task.id === taskID);
      if (checkBox.checked) {
        statusToUpdate.status = true;
        playHellYeahSound();
        if (currentFilter === "notDone") {
          taskContainer.classList.add("disappear");
          playPaperSound();
        } else if (currentFilter === "done") {
          taskContainer.classList.add("disappear2");
          playPaperSound();
        }
      } else {
        statusToUpdate.status = false;
        if (currentFilter === "notDone") {
          taskContainer.classList.add("disappear");
          playPaperSound();
        } else if (currentFilter === "done") {
          taskContainer.classList.add("disappear2");
          playPaperSound();
        }
      }

      setTimeout(() => {
        taskContainer.classList.remove("disappear", "disappear2");
        showFilteredTaskList();
      }, 700);
      setStorage();
    });
  });
}

if (currentFilter === "all") {
  taskContainer.classList.add("disappear");
}

function setStorage() {
  localStorage.setItem("Key", JSON.stringify(toDoListArr));
}

/* SOUNDS */

const hellYeahSound = document.querySelector("#hellYeahSound");
const deleteSound = document.querySelector("#deleteSound");
const paperSound = document.querySelector("#paperSound");
const succesSound = document.querySelector("#succesSound");
const popOpenSound = document.querySelector("#popOpenSound");
const popCloseSound = document.querySelector("#popCloseSound");
const filterSound = document.querySelector("#filterSound");

function playDeleteSound() {
  deleteSound.currentTime = 0;
  deleteSound.play();
}

function playPaperSound() {
  paperSound.currentTime = 0;
  paperSound.play();
}

function playHellYeahSound() {
  hellYeahSound.currentTime = 0;
  hellYeahSound.play();
}

function playSuccesSound() {
  succesSound.currentTime = 0;
  succesSound.play();
}

function playPopOpenSound() {
  popOpenSound.currentTime = 0;
  popOpenSound.play();
  popOpenSound.volume = 0.05;
}

function playPopCloseSound() {
  popCloseSound.currentTime = 0;
  popCloseSound.play();
  popCloseSound.volume = 0.05;
}

function playFilterSound() {
  const newFilterSound = new Audio((src = "sounds/filterSound.mp4"));
  newFilterSound.volume = 0.2;
  newFilterSound.play();
}
