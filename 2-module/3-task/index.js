let calculator = {
  read: function(a ,b) {
    calculator.a = +a;
    calculator.b = +b;
  },

  sum: function() {
    return calculator.a + calculator.b;
  },

  mul: function() {
    return calculator.a * calculator.b;
  },
};

// НЕ УДАЛЯТЬ СТРОКУ, НУЖНА ДЛЯ ПРОВЕРКИ
window.calculator = calculator; // делает ваш калькулятор доступным глобально
