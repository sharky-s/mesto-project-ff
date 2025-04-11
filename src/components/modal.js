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
}

export function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

// Функция, которая вешает закрытие попапа по клику на оверлей
export function setupClosePopupByOverlay(popup) {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === evt.currentTarget) {
      closeModal(popup);
    }
  });
}


