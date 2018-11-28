function toggleShow(event) {
  const menuOptions = document.getElementsByClassName('menu-option');
  const contentSections = document.getElementsByClassName('content');
  for  (let i = 0; i < menuOptions.length; i++) {
    if (i === parseInt(event.dataset.index)) {
      menuOptions[i].classList.add('option-selected');
      contentSections[i].classList.add('content-displayed');
    } else {
      menuOptions[i].classList.remove('option-selected');
      contentSections[i].classList.remove('content-displayed');
    }
  }
}
