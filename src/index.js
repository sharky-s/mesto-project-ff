// @todo: Темплейт карточки
import "./pages/index.css"; // добавьте импорт главного файла стилей
import { initialCards } from "./scripts/cards";
import {
  createCard,
  handleDeleteCard,
  handleLikeCard,
} from "./components/card.js";
import {
  openModal,
  closeModal,
  setupClosePopupByOverlay,
} from "./components/modal.js";

// @todo: DOM узлы
// Находим вёрстку списка и шаблон
const placesList = document.querySelector(".places__list");

const popups = document.querySelectorAll(".popup");
const typeEditPopup = document.querySelector(".popup_type_edit");

const typeEditPopupFormElement = typeEditPopup.querySelector(".popup__form");
const typeEditPopupNameInput = typeEditPopup.querySelector(
  ".popup__input_type_name"
);
const typeEditPopupAboutInput = typeEditPopup.querySelector(
  ".popup__input_type_description"
);

const typeNewCardPopup = document.querySelector(".popup_type_new-card");
const typeNewCardPopupFormElement =
  typeNewCardPopup.querySelector(".popup__form");
const typeNewCardPopupNameInput = typeNewCardPopup.querySelector(
  ".popup__input_type_card-name"
);
const typeNewCardPopupUrlInput = typeNewCardPopup.querySelector(
  ".popup__input_type_url"
);

const typeImagePopup = document.querySelector(".popup_type_image");
const typeImagePopupImg = typeImagePopup.querySelector("img");
const typeImagePopupCaption = typeImagePopup.querySelector(".popup__caption");

const editButton = document.querySelector(".profile__edit-button");
const newCardButton = document.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

popups.forEach((popup) => {
  setupClosePopupByOverlay(popup);
});

// @todo: Функция создания карточки

function showImagePopup(name, link) {
  typeImagePopupImg.src = link;
  typeImagePopupCaption.textContent = name;

  openModal(typeImagePopup);
}
// @todo: Вывести карточки на страницу
// Выводим все карточки на страницу, используя initialCards
initialCards.forEach((cardData) => {
  const newCard = createCard(
    cardData,
    handleDeleteCard,
    handleLikeCard,
    showImagePopup
  );
  placesList.append(newCard);
});

// popupForm(typeEditPopup, profileTitle, profileDescription);

editButton.addEventListener("click", function () {
  fillEditPopup(profileTitle.textContent, profileDescription.textContent);
  openModal(typeEditPopup);
});

// popupCardForm(typeNewCardPopup, initialCards, placesList);

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

function fillEditPopup(name, about) {
  typeEditPopupNameInput.value = name;
  typeEditPopupAboutInput.value = about;
}

//РАБОТА С ФОРМАМИ

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const name = typeEditPopupNameInput.value;
  const job = typeEditPopupAboutInput.value;

  profileTitle.textContent = name;
  profileDescription.textContent = job;

  closeModal(typeEditPopup);
}

typeEditPopupFormElement.addEventListener("submit", handleProfileFormSubmit);

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const cardData = {
    name: typeNewCardPopupNameInput.value,
    link: typeNewCardPopupUrlInput.value,
  };

  const newCard = createCard(
    cardData,
    handleDeleteCard,
    handleLikeCard,
    showImagePopup
  );
  placesList.prepend(newCard);

  closeModal(typeNewCardPopup);
  typeNewCardPopupNameInput.value = "";
  typeNewCardPopupUrlInput.value = "";
}

typeNewCardPopupFormElement.addEventListener("submit", handleCardFormSubmit);
