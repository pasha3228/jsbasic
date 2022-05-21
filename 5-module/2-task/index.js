function toggleText() {
  let button = document.querySelector('.toggle-text-button');

  function showHide () {
    let text = document.querySelector('#text');

    text.hidden == false ? text.hidden = true : text.hidden = false;
  };

  button.onclick = showHide;


}
