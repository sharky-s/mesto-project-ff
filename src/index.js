// @todo: Темплейт карточки
import "./pages/index.css"; // добавьте импорт главного файла стилей
// import { initialCards } from "./scripts/cards";
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

import {
  validateRegex,
  enableValidation,
  clearValidation,
} from "./components/validation.js";

import {
  getUserInfo,
  getInitialCards,
  patchUserInfo,
  postNewCard,
  patchAvatar,
  deleteCard, 
} from "./components/api.js";

function renderLoading(isLoading, buttonElement, defaultButtonText) {
  if (isLoading) {
    buttonElement.textContent = "Сохранение...";
  } else {
    buttonElement.textContent = defaultButtonText;
  }
}

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

const profileImg = document.querySelector(".profile__image");

let currentUserId; // <-- добавляем сюда

typeEditPopupNameInput.value = profileTitle.textContent;
typeEditPopupAboutInput.value = profileDescription.textContent;

let customValidations = new Map();
customValidations.set(typeEditPopupNameInput, textValidation);
customValidations.set(typeEditPopupAboutInput, textValidation);
customValidations.set(typeNewCardPopupNameInput, textValidation);

function textValidation(inputElement) {
  const regex = /^[a-zA-Zа-яА-ЯёЁ \-]+$/;
  const errorMessage =
    "Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы";
  return validateRegex(inputElement, regex, errorMessage);
}

enableValidation(customValidations);

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
// initialCards.forEach((cardData) => {
//   const newCard = createCard(
//     cardData,
//     handleDeleteCard,
//     handleLikeCard,
//     showImagePopup
//   );
//   placesList.append(newCard);
// });

// popupForm(typeEditPopup, profileTitle, profileDescription);

editButton.addEventListener("click", function () {
  fillEditPopup(profileTitle.textContent, profileDescription.textContent);
  clearValidation(typeEditPopupFormElement, {
    formSelector: ".popup__form",
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
  });
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

// function handleProfileFormSubmit(evt) {
//   evt.preventDefault();

//   const name = typeEditPopupNameInput.value;
//   const job = typeEditPopupAboutInput.value;

//   profileTitle.textContent = name;
//   profileDescription.textContent = job;

//   closeModal(typeEditPopup);
// }

// function handleCardFormSubmit(evt) {
//   evt.preventDefault();
//   const cardData = {
//     name: typeNewCardPopupNameInput.value,
//     link: typeNewCardPopupUrlInput.value,
//   };

//   const newCard = createCard(
//     cardData,
//     handleDeleteCard,
//     handleLikeCard,
//     showImagePopup
//   );
//   placesList.prepend(newCard);

//   closeModal(typeNewCardPopup);
//   clearValidation(
//     typeEditPopupFormElement,
//     {
//       formSelector: '.popup__form',
//       inputSelector: '.popup__input',
//       submitButtonSelector: '.popup__button',
//       inactiveButtonClass: 'popup__button_disabled',
//       inputErrorClass: 'popup__input_type_error',
//       errorClass: 'popup__error_visible'
//     }
//   );
//   typeNewCardPopupNameInput.value = "";
//   typeNewCardPopupUrlInput.value = "";
// }

// getUserInfo().then(data => {
//   console.log(data);
//   profileTitle.textContent = data.name;
//   profileDescription.textContent = data.about;
//   profileImg.style = `background-image: url(${data.avatar})`;
//   typeEditPopupNameInput.value = data.name;
//   typeEditPopupAboutInput.value = data.about;
// })
// .catch(err => {
//   console.error(err);
// });

// ДОБАВЛЯЕМ Promise.all

Promise.all([getUserInfo(), getInitialCards()]).then(([userData, cards]) => {
  currentUserId = userData._id;

  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileImg.style.backgroundImage = `url(${userData.avatar})`;
  typeEditPopupNameInput.value = userData.name;
  typeEditPopupAboutInput.value = userData.about;

  cards.forEach((cardData) => {
    const newCard = createCard(
      cardData,
      (cardElement, cardId) => {
        cardToDelete = cardElement;
        cardIdToDelete = cardId;
        openModal(deleteCardPopup);
      },
      handleLikeCard,
      showImagePopup,
      currentUserId
    );
    placesList.append(newCard);
  });
});

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = typeEditPopupFormElement.querySelector(".popup__button");
  renderLoading(true, submitButton, "Сохранить");

  const name = typeEditPopupNameInput.value;
  const about = typeEditPopupAboutInput.value;

  patchUserInfo(name, about)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(typeEditPopup);
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении профиля: ${err}`);
    })
    .finally(() => {
      renderLoading(false, submitButton, "Сохранить");
    });
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = typeNewCardPopupFormElement.querySelector(".popup__button");
  renderLoading(true, submitButton, "Сохранить");

  const name = typeNewCardPopupNameInput.value;
  const link = typeNewCardPopupUrlInput.value;

  postNewCard(name, link)
    .then((cardData) => {
      const newCard = createCard(
        cardData,
        handleDeleteCard,
        handleLikeCard,
        showImagePopup,
        currentUserId
      );
      placesList.prepend(newCard);

      closeModal(typeNewCardPopup);
      clearValidation(typeNewCardPopupFormElement, {
        formSelector: ".popup__form",
        inputSelector: ".popup__input",
        submitButtonSelector: ".popup__button",
        inactiveButtonClass: "popup__button_disabled",
        inputErrorClass: "popup__input_type_error",
        errorClass: "popup__error_visible",
      });

      typeNewCardPopupNameInput.value = "";
      typeNewCardPopupUrlInput.value = "";
    })
    .catch((err) => {
      console.error(`Ошибка при добавлении карточки: ${err}`);
    })
    .finally(() => {
      renderLoading(false, submitButton, "Сохранить");
    });
}

const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarFormElement = avatarPopup.querySelector(".popup__form");
const avatarUrlInput = avatarFormElement.querySelector(
  ".popup__input_type_url"
);
const avatarEditButton = document.querySelector(".profile__image-edit-button"); // кнопка редактирования на аватаре

avatarEditButton.addEventListener("click", function () {
  openModal(avatarPopup);
});

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = avatarFormElement.querySelector(".popup__button");
  renderLoading(true, submitButton, "Сохранить");

  const avatarUrl = avatarUrlInput.value;

  patchAvatar(avatarUrl)
    .then((userData) => {
      profileImg.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(avatarPopup);
      avatarFormElement.reset();
    })
    .catch((err) => {
      console.error(`Ошибка при обновлении аватара: ${err}`);
    })
    .finally(() => {
      renderLoading(false, submitButton, "Сохранить");
    });
}

avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);

typeEditPopupFormElement.addEventListener("submit", handleProfileFormSubmit);
typeNewCardPopupFormElement.addEventListener("submit", handleCardFormSubmit);

const deleteCardPopup = document.querySelector(".popup_type_delete-card");
const deleteCardForm = deleteCardPopup.querySelector(".popup__form");

let cardToDelete = null;
let cardIdToDelete = null;

deleteCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitButton = deleteCardForm.querySelector(".popup__button");
  renderLoading(true, submitButton, "Удаление...");

  deleteCard(cardIdToDelete)
    .then(() => {
      if (cardToDelete) {
        cardToDelete.remove();
      }
      closeModal(deleteCardPopup);
    })
    .catch((err) => {
      console.error(`Ошибка при удалении карточки: ${err}`);
    })
    .finally(() => {
      renderLoading(false, submitButton, "Да");
      cardToDelete = null;
      cardIdToDelete = null;
    });
});

cardToDelete = null;
cardIdToDelete = null;