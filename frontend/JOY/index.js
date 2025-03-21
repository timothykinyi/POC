document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-task-form");
    const taskList = document.getElementById("tasks");
  
    form.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const taskDescription = document.getElementById("new-task-description").value.trim();
      const priority = document.getElementById("priority").value; // high, medium, or low
  
      if (taskDescription === "") {
        alert("Task cannot be blank");
        return;
      }
  
      // Create new list item with task description
      const li = document.createElement("li");
      li.textContent = taskDescription;
  
      // Set color based on priority
      if (priority === "high") {
        li.style.color = "red";
      } else if (priority === "medium") {
        li.style.color = "yellow";
      } else if (priority === "low") {
        li.style.color = "green";
      }
  
      // Append the new task to the task list
      taskList.appendChild(li);
  
      // Create an Edit button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.style.marginLeft = "15px";
      editBtn.addEventListener("click", () => { 
        // Prompt the user for a new task description
        const newTask = prompt("Edit task:", li.firstChild.textContent);
        if (newTask) {
          li.firstChild.textContent = newTask;
        }
      });
  
      // Create a Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.style.marginLeft = "8px";
      deleteBtn.addEventListener("click", () => li.remove());
  
      // Append the Edit and Delete buttons to the list item
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
  
      // Reset the form for new input
      form.reset();
  
      // Optionally sort the tasks after adding a new one
      sortTasks();
    });
  
    // Function for sorting tasks by priority (using the element's color)
    function sortTasks() {
      const tasks = Array.from(taskList.children);
      tasks.sort((a, b) => {
        const priorityOrder = { red: 1, yellow: 2, green: 3 };
        // If an element doesn't have a recognized color, it gets a default order value of 4.
        const aPriority = priorityOrder[a.style.color] || 4;
        const bPriority = priorityOrder[b.style.color] || 4;
        return aPriority - bPriority;
      });
  
      tasks.forEach(task => taskList.appendChild(task));
    }
  });
  