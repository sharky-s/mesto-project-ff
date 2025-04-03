// src/components/modal.js
import { createCard, handleDeleteCard, handleLikeCard, showImagePopup } from "./card.js";

// Вспомогательная функция — закрытие при нажатии Esc
function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

export function openModal(popup) {
  popup.classList.add("popup_is-opened");
  // При открытии подписываемся на Esc
  document.addEventListener("keydown", handleEscClose);
  setupModalCloseListeners(popup);
}

export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  // При закрытии удаляем обработчик
  document.removeEventListener("keydown", handleEscClose);
}

// Функция, которая вешает закрытие попапа по клику на оверлей
export function setupModalCloseListeners(popup) {
  popup.addEventListener("mousedown", (evt) => {
    // evt.currentTarget === сам popup
    // evt.target === элемент, по которому кликнули
    if (evt.target === evt.currentTarget) {
      closeModal(popup);
    }
  });
}

export function fillEditPopup(popup, name, about) {
  const nameInput = popup.querySelector(".popup__input_type_name");
  const aboutInput = popup.querySelector(".popup__input_type_description");

  nameInput.value = name;
  aboutInput.value = about;
}

//РАБОТА С ФОРМАМИ

export function popupForm(popup, title, description) {
  // Находим форму в DOM
  const formElement = popup.querySelector(".popup__form"); // Воспользуйтесь методом querySelector()
  // Находим поля формы в DOM
  const nameInput = popup.querySelector(".popup__input_type_name"); // Воспользуйтесь инструментом .querySelector()
  const jobInput = popup.querySelector(".popup__input_type_description"); // Воспользуйтесь инструментом .querySelector()

  // Обработчик «отправки» формы, хотя пока
  // она никуда отправляться не будет
  function handleFormSubmit(evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
    // Так мы можем определить свою логику отправки.
    // О том, как это делать, расскажем позже.

    // Получите значение полей jobInput и nameInput из свойства value
    const name = nameInput.value; // Получите значение полей jobInput и nameInput из свойства value
    const job = jobInput.value; // Получите значение полей jobInput и nameInput из свойства value

    // Выберите элементы, куда должны быть вставлены значения полей
    title.textContent = name; // Выберите элементы, куда должны быть вставлены значения полей
    description.textContent = job; // Выберите элементы, куда должны быть вставлены значения полей
    // Вставьте новые значения с помощью textContent
    // Закройте попап
    closeModal(popup);
  }
  // Прикрепляем обработчик к форме:
  // он будет следить за событием “submit” - «отправка»
  formElement.addEventListener("submit", handleFormSubmit);
}

export function popupCardForm(popup, cards, placesList) {
  // Находим форму в DOM
  const formElement = popup.querySelector(".popup__form"); // Воспользуйтесь методом querySelector()
  // Находим поля формы в DOM
  const nameInput = popup.querySelector(".popup__input_type_card-name"); // Воспользуйтесь инструментом .querySelector()
  const urlInput = popup.querySelector(".popup__input_type_url"); // Воспользуйтесь инструментом .querySelector()

  // Обработчик «отправки» формы, хотя пока
  // она никуда отправляться не будет
  function handleFormSubmit(evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
    // Так мы можем определить свою логику отправки.
    // О том, как это делать, расскажем позже.
    const cardData = {
      name: nameInput.value,
      link: urlInput.value,
    };
    cards.unshift(cardData);

    const newCard = createCard(cardData, handleDeleteCard, handleLikeCard, showImagePopup);
    placesList.prepend(newCard);

    closeModal(popup);
    nameInput.value = "";
    urlInput.value = "";
  }
  // Прикрепляем обработчик к форме:
  // он будет следить за событием “submit” - «отправка»
  formElement.addEventListener("submit", handleFormSubmit);
}
