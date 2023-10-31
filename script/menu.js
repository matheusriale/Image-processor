let submenu, currentSubmenu;

function openSubmenu(value) {
  if (submenu) {
    submenu.style.display = "none";
  }
  submenu = document.getElementById(value);
  submenu.style.display = "block";
  currentSubmenu=value
}

function closeSubmenu(){
  if (submenu) {
    submenu.style.display = "none";
  }
}
