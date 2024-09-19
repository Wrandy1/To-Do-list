// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  currentId += 1;
  return currentId;
}


// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>');
  taskCard.addClass('card task-card draggable my-3');
  taskCard.attr('id', task.id);

  const cardHeader = $('<h3>');
  cardHeader.addClass('task-card-title');
  cardHeader.text(task.name);


  const cardDueDate = $('<p>');
  cardDueDate.addClass('task-card-due-date');
  cardDueDate.text(task.dueDate);

  const cardBody = $('<div>');  
  cardBody.addClass('task-card-body');


  const cardDesription = $('<p>');
  cardDesription.addClass('task-card-description');
  cardDesription.text(task.Desription);

  const cardDeleteBtn = $('<button>');
  cardDeleteBtn.addClass('btn btn-danger delete')
  cardDeleteBtn.text('Delete');
  cardDeleteBtn.attr('data-task-id', task.id)

if (task.taskDueDate && task.status !== 'done') {
  const now = dayjs();
  const taskDueDate = dayjs(task.DueDate, 'DD/MM/YYYY');

 
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

  const taskList = $('#todo-cards');
  taskList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  for (let i = 0; i < taskList.length; i++) {
    const taskCard = createTaskCard(taskList[i]);

    if (taskList[i].status === 'to-do') {
      todoList.append(taskCard)
      
    } else if (taskList[i].status == 'in-progress') {
      inProgressList.append(taskCard)
    } else if (taskList[i].status === 'done') {
      $('#done-cards').append(taskCard);
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


  const taskTitle = $('#task-title').val();
  const taskDescription = $('#task-description').val();
  const taskDueDate = $('#task-due-date').val();
  const task = {
      id: generateTaskId(),
      taskTitle,
      taskDescription,
      taskDueDate,
      status: 'todo'
  };

  taskList.push(task);

  localStorage.setItem('tasks', JSON.stringify(taskList));
  localStorage.setItem('nextId', JSON.stringify(nextId));

  renderTaskList();

  $('#task-form')[0].reset();
  $('#formModal').modal('hide');
}




// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  event.preventDefault();

    const taskCard = $(event.target).closest('.task-card');
    const taskId = taskCard.attr('id');
    const taskIndex = taskList.findIndex(task => task.id == taskId);

    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);

        localStorage.setItem('tasks', JSON.stringify(taskList));

        renderTaskList();
    }

    taskCard.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr('id');
  const newStatus = $(this).attr('id').split('-')[0];
  const taskIndex = taskList.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
      taskList[taskIndex].status = newStatus;
      localStorage.setItem('tasks', JSON.stringify(taskList));

      renderTaskList();
  }

  const targetColumn = $(this).find('.drop-column');
  ui.draggable.detach().appendTo(targetColumn).css({top: 0, left: 0 });
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
