// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector(".fruits__list"); // список карточек
const shuffleButton = document.querySelector(".shuffle__btn"); // кнопка перемешивания
const filterButton = document.querySelector(".filter__btn"); // кнопка фильтрации
const sortKindLabel = document.querySelector(".sort__kind"); // поле с названием сортировки
const sortTimeLabel = document.querySelector(".sort__time"); // поле с временем сортировки
const sortChangeButton = document.querySelector(".sort__change__btn"); // кнопка смены сортировки
const sortActionButton = document.querySelector(".sort__action__btn"); // кнопка сортировки
const kindInput = document.querySelector(".kind__input"); // поле с названием вида
const colorInput = document.querySelector(".color__input"); // поле с названием цвета
const weightInput = document.querySelector(".weight__input"); // поле с весом
const addActionButton = document.querySelector(".add__action__btn"); // кнопка добавления
const weighthMinInput = document.querySelector(".minweight__input");
const weightMaxInput = document.querySelector(".maxweight__input");

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

const colorClassMap = {
  // значения цветов для сравнения и формирования класса
  фиолетовый: "violet",
  зеленый: "green",
  "розово-красный": "carmazin",
  желтый: "yellow",
  "светло-коричневый": "lightbrown",
  розовый: "pink",
  красный: "red",
};
// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
console.log(fruits);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = ""; // очищаем fruitsList от вложенных элементов

  for (let i = 0; i < fruits.length; i += 1) {
    let newLi = document.createElement("li"); //формируем новый элемент
    const baseColor = fruits[i].color.toLowerCase().trim(); // цвет фрукта для формирования класса
    const colorClass = colorClassMap[baseColor] || "defult"; // наименования классов

    newLi.className = `fruit__item fruit_${colorClass}`; // доббавляем класс
    const newDiv = document.createElement("div"); // формирование нового элемента div для передачи значений из массива
    newDiv.className = "fruit__info";
    newDiv.innerHTML = `
    <div>index: ${[i]}</div>
    <div>kind: ${fruits[i].kind}</div>
    <div>color: ${fruits[i].color}</div>
    <div>weight (кг): ${fruits[i].weight}</div>
    `;

    newLi.appendChild(newDiv);

    fruitsList.appendChild(newLi);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length !== 0) {
    let j = getRandomInt(0, fruits.length - 1);
    let itemArr = fruits.splice(j, 1)[0];
    result.splice(0, 0, itemArr);
  }

  fruits = result;
};

shuffleButton.addEventListener("click", () => {
  const beforeShuffle = JSON.stringify(fruits);
  shuffleFruits();
  display();
  const afterShuffle = JSON.stringify(fruits);
  if (beforeShuffle === afterShuffle) {
    alert("Порядок не изменился!");
  }
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  const min = Number(weighthMinInput.value) || 0;
  const max = Number(weightMaxInput.value) || Infinity;
  const filtredFruit = fruits.filter(
    (fruit) => fruit.weight >= min && fruit.weight <= max
  );
  fruits = filtredFruit;
  // TODO: допишите функцию
};

filterButton.addEventListener("click", () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = "bubbleSort";
let sortTime = "-";

const priority = {
  "розово-красный": 1,
  "светло-коричневый": 2,
  желтый: 3,
  зеленый: 4,
  фиолетовый: 5,
};

const comparationColor = (a, b) => {
  return (priority[a.color] || Infinity) - (priority[b.color] || Infinity);
};

const sortAPI = {
  bubbleSort(arrayToSort, comparation) {
    for (let i = 0; i < arrayToSort.length; i++) {
      for (let j = 0; j < arrayToSort.length - 1; j++) {
        if (comparation(arrayToSort[j], arrayToSort[j + 1]) > 0) {
          [arrayToSort[j], arrayToSort[j + 1]] = [
            arrayToSort[j + 1],
            arrayToSort[j],
          ];
        }
      }
    }
  },

  quickSort(arrayToSort, comparation) {
    if (arrayToSort.length <= 1) return arrayToSort;
    const pivot = arrayToSort[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arrayToSort.length; i++) {
      comparation(arrayToSort[i], pivot) < 0
        ? left.push(arrayToSort[i])
        : right.push(arrayToSort[i]);
    }

    return [
      ...this.quickSort(left, comparation),
      pivot,
      ...this.quickSort(right, comparation),
    ];
  },

  startSort(sort, arrayToSort, comparation) {
    const start = performance.now();
    if (sort === this.quickSort) {
      fruits = sort.call(this, arrayToSort, comparation);
    } else {
      sort(arrayToSort, comparation);
    }
    const end = performance.now();
    sortTime = `${(end - start).toFixed(1)} ms`;
  },
};

sortChangeButton.addEventListener("click", () => {
  sortKind = sortKind === "bubbleSort" ? "quickSort" : "bubbleSort";
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener("click", () => {
  sortTimeLabel.textContent = "sorting...";
  setTimeout(() => {
    const sort = sortAPI[sortKind];
    sortAPI.startSort(sort, fruits, comparationColor);
    display();
    sortTimeLabel.textContent = sortTime;
  }, 0);
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener("click", () => {
  const kind = kindInput.value.trim();
  const color = colorInput.value.trim();
  const weight = Number(weightInput.value.trim());

  if (!kind || !color || isNaN(weight) || weight <= 0) {
    alert("Все поля должны быть заполнены корректно!");
    return;
  }

  // originalFruits.push({ kind, color, weight }); // Добавляем в originalFruits
  fruits.push({ kind, color, weight });
  kindInput.value = "";
  colorInput.value = "";
  weightInput.value = "";
  display();
});

// Инициализация полей сортировки
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

display();
