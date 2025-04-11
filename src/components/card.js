// src/components/card.js
import { deleteCard, likeCard, unlikeCard } from "./api.js";

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

// // Функция для создания карточки
// export function createCard({ name, link }, onDelete, onLike, onImgClick) {
//   // Клонируем структуру шаблона
//   const cardElement = cardTemplate.cloneNode(true);

//   // Находим внутренние элементы карточки
//   const cardImage = cardElement.querySelector(".card__image");
//   const cardTitle = cardElement.querySelector(".card__title");
//   const deleteButton = cardElement.querySelector(".card__delete-button");

//   const likeButton = cardElement.querySelector(".card__like-button");

//   const likeCountElement = cardElement.querySelector('.card__like-count');
  

//   // Устанавливаем данные
//   cardImage.src = link;
//   cardImage.alt = name;
//   cardTitle.textContent = name;
//   likeCountElement.textContent = cardData.likes.length;

//   // Добавляем слушатель для удаления
//   deleteButton.addEventListener("click", () => {
//     onDelete(cardElement);
//   });

//   // Добавляем слушатель для удаления
//   likeButton.addEventListener("click", () => {
//     onLike(likeButton);
//   });

//   cardImage.addEventListener("click", () => {
//     onImgClick(name, link);
//   });

//   // Возвращаем готовую карточку
//   return cardElement;
// }

// src/components/card.js

export function createCard(cardData, onDelete, onLike, onImgClick, userId) {
  const { name, link, likes, owner } = cardData;

  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector('.card__like-count');

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;
  likeCountElement.textContent = likes.length; 

  if (owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      onDelete(cardElement, cardData._id);  // обязательно передадим id карточки для удаления с сервера
    });
  }

  // deleteButton.addEventListener("click", () => {
  //   onDelete(cardElement);
  // });

  // likeButton.addEventListener("click", () => {
  //   onLike(likeButton);
  // });

  likeButton.addEventListener("click", () => {
    onLike(likeButton, cardData._id, likeCountElement);
  });
  
  if (likes.some(like => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  cardImage.addEventListener("click", () => {
    onImgClick(name, link);
  });

  return cardElement;
}

// @todo: Функция удаления карточки
// Функция для удаления карточки


export function handleDeleteCard(cardElement, cardId, onConfirmDelete) {
  onConfirmDelete(cardElement, cardId); // вызываем переданный коллбэк
}


export function handleLikeCard(likeButton, cardId, likeCountElement) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  const request = isLiked ? unlikeCard(cardId) : likeCard(cardId);

  request
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCountElement.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении лайка: ${err}`);
    });
}

