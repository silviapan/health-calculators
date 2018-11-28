function toggleShow(event) {
  const menuOptions = document.getElementsByClassName('menu-option');
  for  (let i = 0; i < menuOptions.length; i++) {
    if (i === parseInt(event.dataset.index)) {
      menuOptions[i].classList.add('option-selected');
    } else {
      menuOptions[i].classList.remove('option-selected');
    }
  }
}
