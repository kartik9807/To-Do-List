let allTask = JSON.parse(localStorage.getItem("todos")) || [];
let container = document.querySelector(".taskcontainer");
let writeTask = document.getElementById("writeTask");

function saveTodo(){
    localStorage.setItem("todos",JSON.stringify(allTask)); // here it is been stringified because local storage only stores string values
    // and we are storing array of objects here
}
function renderTasks(){
    container.innerHTML = "";
    if(allTask.length === 0){
        container.innerHTML = `<h1 class="text2">Hurray !!! no pending work</h1>`;
        document.querySelector(".circle").innerText = `0/0`;
        return;
    };
    allTask.forEach((task,index)=>{
        let text = `<div class="card">
                        <input type="checkbox" name="checkbox" class="checkbox" ${task.completed ? "checked" : ""} data-index="${index}">
                        <h2 class="text ${task.completed ? "done" : ""}">${task.text}</h2>
                        <img class="edit" data-index="${index}" src="svgs/edit.svg" alt="edit" width="30" height="30">
                        <img class="delete" data-index="${index}" src="svgs/delete.svg" alt="delete" width="30" height="30">
                    </div>`;
        container.innerHTML += text;
    });
    saveTodo();
    updateProgress();
};

document.getElementById("addBtn").addEventListener("click",()=>{
    let task = writeTask.value.trim();
    if(!task){
        alert("Please Enter your task");
        writeTask.value = "";
        return;
    }
    if(allTask.some(target=> target.text === task)){
        alert("This task is already pending !!!");
        writeTask.value = "";
        return;
    }
    allTask.push({
        text: task,
        completed: false
    });
    writeTask.value = "";
    saveTodo();
    renderTasks();
});

document.getElementById("allDelete").addEventListener("click",()=>{
    if(allTask.length === 0){
        alert("No tasks to delete !!!");
        return;
    }
    for(let i=allTask.length-1;i>=0;i--){
        allTask.pop();
    }
    saveTodo();
    progressBar.style.width = 0 + '%';
    renderTasks();
});

container.addEventListener("click",(e)=>{
    // delete function 
    if(e.target.classList.contains("delete")){
        let card = e.target.closest(".card");
        const taskText = card.querySelector(".text").innerText;
        card.remove();
        const index = e.target.dataset.index || allTask.findIndex(t => t.text === taskText);
        if (index > -1) {
            allTask.splice(index, 1); // delete the task from array using splice index is the targeted value and 1 means only one value to be deleted
        }
        saveTodo();
        renderTasks();
    };
    // edit function
    if(e.target.classList.contains("edit")){
        let edit = allTask[e.target.dataset.index].text;
        let newText = prompt("Edit your task:- ",edit);
        if(allTask.some(target=>target.text === newText && target.completed == false) && newText !== edit){
            alert("This task is already pending !!!");
            return;
        }else if(allTask.some(target=>target.text === newText && target.completed == true) && newText !== edit){
            alert("This task is already completed !!!");
            return;
        }else if(!newText && newText !== null){
            alert("Task cannot be empty !!!");
            return;
        }else{
            newText ||= edit;
        }
        allTask[e.target.dataset.index].text = newText.trim(); // changing the text directly in the array
        saveTodo();
        renderTasks();
    };
});
container.addEventListener("change",(e)=>{ // change is used for checkbox
     // checkbox function
    if(e.target.classList.contains("checkbox")){
        allTask[e.target.dataset.index].completed = e.target.checked;
        saveTodo();
        renderTasks();
    }
});

function updateProgress(){
    // circle update
    let count = allTask.filter((target)=>{
        return target.completed === true;
    });
    document.querySelector(".circle").innerHTML = `${count.length}/${allTask.length}`;

    //progress bar
    const progressBar = document.getElementById('progressBar');
    let percentComplete = (count.length / allTask.length) * 100;
    if(percentComplete === 100 && allTask.length > 0){
        alert("Hurray !!! All tasks completed");
    }
    progressBar.style.width = percentComplete + '%';
}
renderTasks();