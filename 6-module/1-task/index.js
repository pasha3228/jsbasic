/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  #rows;
  #elem;
  constructor(rows) {
    this.#rows = rows;
    this.#elem = document.createElement('table');
    this.render();
  }

  get elem() {
    return this.#elem;
  }

  render() {
    let template = `
    <table>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Возраст</th>
          <th>Зарплата</th>
          <th>Город</th>
          <th></th>
        </tr>
      </thead>
      <tbody>` + this.#rows.map( (row) => `
        <tr>
          <td>${row.name}</td>
          <td>${row.age}</td>
          <td>${row.salary}</td>
          <td>${row.city}</td>
          <td><button>X</button></td>
        </tr>
        `).join('') +
      `</tbody>
    </table>`;

      this.#elem.innerHTML = template;

      for ( let button of this.#elem.querySelectorAll('button')) {
        button.addEventListener('click', this.closer);
      };
  }

  closer (event) {
    let row = this.closest('tr');
    row.parentElement.removeChild(row);
  };
}
