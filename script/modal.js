let modal;

function openModal(value) {
  if(image){
    if (modal) {
        modal.style.display = "none";
      }
      modal = document.getElementById(value);
      modal.style.display = "flex"; 
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = "none";
  }
}
