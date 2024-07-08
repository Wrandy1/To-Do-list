const taskFormEl = $('#task-form');
const taskNameInputEl = $('#task-name-input');
const taskDescriptionInputEl = $('#task-desription-input');
const taskDateInputEl = $('#taskDueDate');
const modalFormEl = $('#formModal');

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
console.log(taskList)
console.log(nextId)
// Todo: create a function to generate a unique task id
function generateTaskId() {

}


// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>');
  taskCard.addClass('card task-card draggable my-3');
  taskCard.attr('data-task-id', task.id)

  const cardHeader = $('<div>');
  cardHeader.addClass('card-header h4');
  cardHeader.text(task.name);


  const cardDueDate = $('<p>');
  cardDueDate.addClass('card-text');
  cardDueDate.text(task.dueDate);

  const cardBody = $('<div>');  
  cardBody.addClass('card-body');


  const cardDesription = $('<p>');
  cardDesription.addClass('card-text');
  cardDesription.text(task.Desription);

  const cardDeleteBtn = $('<button>');
  cardDeleteBtn.addClass('btn btn-danger delete')
  cardDeleteBtn.text('Delete');
  cardDeleteBtn.attr('data-task-id', task.id)

if (task.dueDate && task.status !== 'done') {
  const now = dayjs();
  const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

 
  if (now.isSame(taskDueDate, 'day')) {
    taskCard.addClass('bg-warning text-white');
  } else if (now.isAfter(taskDueDate)) {
    taskCard.addClass('bg-danger text-white');
    cardDeleteBtn.addClass('border-light');
  }
}
cardBody.append(cardDesription);
  cardBody.append(cardDueDate);
  cardBody.append(cardDeleteBtn);
  taskCard.append(cardBody);
  taskCard.append(cardHeader);
return taskCard;
}
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const tasks = readTasksFromStorage();

  const taskList = $('#todo-cards');
  taskList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  for (let task of tasks) {
    const taskCard = createTaskCard(task);

    if (task.status === 'to-do') {
      todoList.append(taskCard)
      
    } else if (task.status == 'in-progress') {
      inProgressList.append(taskCard)
    } else {
      doneList.append(taskCard);
    }
  }

  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    helper: function (e) {
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}


// Todo: create a function to handle adding a new task
function handleAddTask(event){
  event.preventDefault();

  let nameInput = $('#task-name-input').val()
  let typeInput = $('#task-type-input').val()
  let dateInput = $('#taskDueDate').val()


  let taskObj = {
    name: nameInput,
    type: typeInput,
    date: dateInput,
  };

  const newTask = {
    id: crypto.randomUUID(),
    name: taskNameInputEl.val(),
    Desription: taskDescriptionInputEl.val(),
    dueDate: taskDateInputEl.val(),
    status: 'to-do',
  };

  console.log(newTask);

  const tasks = readTasksFromStorage();
  tasks.push(newTask);
  
  saveTaskToStorage(task);

  renderTaskList();
  
}




// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  const taskId = $(this).attr('data-task-id');
  const tasks = readtTaskFromStorage();

  for (let i = 0; i < tasks.length; i++) {
    if (cardDeleteBtn == 'clicked') {
      tasks.splice(tasks[i])
    }

  }
  saveTaskToStorage(tasks);


 renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const tasks = readTasksFromStorage();
  const taskId = ui.draggable[0].dataset.taskId;
  const newStatus = event.target.id;
  for (let task of tasks) {
   
    if (task.id === taskId) {
      task.status = newStatus;
    }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();
}
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });

  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
})
