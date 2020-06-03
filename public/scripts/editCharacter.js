window.onload = function(){
    let inputs = document.querySelectorAll(".dt-input");
    let editButton = document.querySelector("#editC");
    let cancelButton = document.querySelector("#cancelC");
    let showButtons = document.querySelectorAll(".dt-1");

    editButton.onclick = function(){
        editButton.hidden = true;
        showButtons.forEach((element) => {
            element.hidden = false;
        })
        inputs.forEach((element) => {
            element.disabled = false
        })
    }

    cancelButton.onclick = function(){
        editButton.hidden = false;
        showButtons.forEach((element) => {
            element.hidden = true;
        })
        inputs.forEach((element) => {
            element.disabled = true;
        })
    }
}

function togglePrevious(button){
    button.previousSibling.value=1-button.previousSibling.value;
}