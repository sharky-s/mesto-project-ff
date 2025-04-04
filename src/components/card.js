// src/components/card.js

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

// Функция для создания карточки
export function createCard({ name, link }, onDelete, onLike, onImgClick) {
  // Клонируем структуру шаблона
  const cardElement = cardTemplate.cloneNode(true);

  // Находим внутренние элементы карточки
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  const likeButton = cardElement.querySelector(".card__like-button");

  // Устанавливаем данные
  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  // Добавляем слушатель для удаления
  deleteButton.addEventListener("click", () => {
    onDelete(cardElement);
  });

  // Добавляем слушатель для удаления
  likeButton.addEventListener("click", () => {
    onLike(likeButton);
  });

  cardImage.addEventListener("click", () => {
    onImgClick(name, link);
  });

  // Возвращаем готовую карточку
  return cardElement;
}

// @todo: Функция удаления карточки
// Функция для удаления карточки
export function handleDeleteCard(cardElement) {
  cardElement.remove();
}

export function handleLikeCard(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
};

