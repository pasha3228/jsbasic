function highlight(table) {
  for ( let i = 1; i < table.rows.length; i++) {
      let row = table.rows[i];

      for ( let n = 1; n < row.cells.length; n++) {
          let cell = row.cells[n];

          switch (n) {
              case 1 :
                  +cell.textContent > 18 ?
                      '' : row.style.textDecoration = 'line-through';
                  break;
              case 2 :
                  cell.textContent == 'f' ?
                      row.classList.add('female') : row.classList.add('male');
                  break;
              case 3 :
                  if ( cell.dataset.available) {
                      cell.dataset.available == 'true' ?
                          row.classList.add('available') : row.classList.add('unavailable');
                  } else {
                      row.setAttribute('hidden', 'true');
                  };
                  break;
              default:
                  break;
          };
      };
  };
};
