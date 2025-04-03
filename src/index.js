// @todo: Темплейт карточки
import './pages/index.css'; // добавьте импорт главного файла стилей
import { initialCards } from './scripts/cards';
import { createCard, handleDeleteCard, handleLikeCard, showImagePopup } from './components/card.js';

import { openModal, closeModal, fillEditPopup, popupForm, popupCardForm } from './components/modal.js';



// @todo: DOM узлы
// Находим вёрстку списка и шаблон
const placesList = document.querySelector(".places__list");

// @todo: Функция создания карточки


// @todo: Вывести карточки на страницу
// Выводим все карточки на страницу, используя initialCards
initialCards.forEach((cardData) => {
  const newCard = createCard(cardData, handleDeleteCard, handleLikeCard, showImagePopup);
  placesList.append(newCard);
});


const typeEditPopup = document.querySelector(".popup_type_edit");
const typeNewCardPopup = document.querySelector(".popup_type_new-card");
const typeImagePopup = document.querySelector(".popup_type_image");


const editButton = document.querySelector(".profile__edit-button");
const newCardButton = document.querySelector(".profile__add-button");
const imageButtons = document.querySelectorAll(".card__image");
const closeButtons = document.querySelectorAll(".popup__close");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

popupForm(typeEditPopup, profileTitle, profileDescription);

editButton.addEventListener("click", function () {
  fillEditPopup(typeEditPopup, profileTitle.textContent, profileDescription.textContent);
  openModal(typeEditPopup);
});

popupCardForm(typeNewCardPopup, initialCards, placesList);

newCardButton.addEventListener("click", function () {
  openModal(typeNewCardPopup);
});

// imageButtons.forEach((button) => {
//   button.addEventListener("click", function () {
//     openModal(typeImagePopup);
//   });
// });

closeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const popup = button.closest(".popup");
    closeModal(popup);
  });
});

