// @todo: Темплейт карточки
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

// @todo: DOM узлы
// Находим вёрстку списка и шаблон
const placesList = document.querySelector(".places__list");

// @todo: Функция создания карточки

// Функция для создания карточки
function createCard({ name, link }, onDelete) {
  // Клонируем структуру шаблона
  const cardElement = cardTemplate.cloneNode(true);

  // Находим внутренние элементы карточки
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // Устанавливаем данные
  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  // Добавляем слушатель для удаления
  deleteButton.addEventListener("click", () => {
    onDelete(cardElement);
  });

  // Возвращаем готовую карточку
  return cardElement;
}

// @todo: Функция удаления карточки
// Функция для удаления карточки
function handleDeleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу
// Выводим все карточки на страницу, используя initialCards
initialCards.forEach((cardData) => {
  const newCard = createCard(cardData, handleDeleteCard);
  placesList.append(newCard);
});