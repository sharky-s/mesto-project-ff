// Функция isValid теперь принимает formElement и inputElement,
// а не берёт их из внешней области видимости

const isValid = (formElement, inputElement, customValidation) => {
  if (!inputElement.validity.valid) {
    // showInputError теперь получает параметром форму, в которой
    // находится проверяемое поле, и само это поле
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else if (customValidation && customValidation(inputElement)){
    // showInputError теперь получает параметром форму, в которой
    // находится проверяемое поле, и само это поле
    showInputError(formElement, inputElement, customValidation(inputElement));
  }
  else{
    // hideInputError теперь получает параметром форму, в которой
    // находится проверяемое поле, и само это поле
    hideInputError(formElement, inputElement);
  }
};

const showInputError = (formElement, inputElement, errorMessage) => {
  // Находим элемент ошибки внутри самой функции
  const errorElement = inputElement.nextElementSibling;
  // Остальной код такой же
  inputElement.classList.add('form__input_type_error');
  errorElement.textContent = errorMessage;
};

const hideInputError = (formElement, inputElement) => {
  // Находим элемент ошибки
  const errorElement = inputElement.nextElementSibling;
  // Остальной код такой же
  inputElement.classList.remove('form__input_type_error');
  errorElement.textContent = '';
};


const setEventListeners = (formElement, customValidations) => {
  // Находим все поля внутри формы
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));

  // Функция, которая проверяет валидность всех полей и включает/выключает кнопку «Сохранить»
  const checkFormState = () => {
    const submitButton = formElement.querySelector('.popup__button');
    const isFormValid = inputList.every(inputElement => {
      let customValidation = null;
      if (customValidations.has(inputElement)) {
        customValidation = customValidations.get(inputElement);
      }
      // Если у поля есть кастомная валидация, оно считается валидным, если функция возвращает null
      return inputElement.validity.valid && (!customValidation || customValidation(inputElement) === null);
    });
    submitButton.disabled = !isFormValid;
  };

  // Назначаем обработчик события input для каждого поля
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      let customValidation = null;
      if (customValidations.has(inputElement)) {
        customValidation = customValidations.get(inputElement);
      }
      // Проверяем текущее поле
      isValid(formElement, inputElement, customValidation);
      // Проверяем всю форму и обновляем состояние кнопки
      checkFormState();
    });
  });

  // Инициализируем состояние кнопки при загрузке формы
  checkFormState();
};



export const enableValidation = (customValidations) => {
  // Найдём все формы с указанным классом в DOM,
  // сделаем из них массив методом Array.from
  const formList = Array.from(document.querySelectorAll('.popup__form'));

  // Переберём полученную коллекцию
  formList.forEach((formElement) => {
    // Для каждой формы вызовем функцию setEventListeners,
    // передав ей элемент формы
    setEventListeners(formElement, customValidations);
  });
};

// // Вызовем функцию
// enableValidation();

export function validateRegex(inputElement, regex, errorMessage) {
  if (regex.test(inputElement.value)) {
    return null;
  } else {
    return errorMessage;
  }
}

export function clearValidation(formElement, validationConfig) {
  // Получаем все input-элементы формы с использованием селектора из конфигурации
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  
  // Для каждого input-элемента очищаем состояние ошибки
  inputList.forEach(inputElement => {
    // Сбрасываем состояние ошибки через существующую функцию
    hideInputError(formElement, inputElement);
    
    // Убираем класс ошибки, заданный в конфигурации
    inputElement.classList.remove(validationConfig.inputErrorClass);
    
    // Если рядом с input находится блок с сообщением об ошибке, очищаем его
    const errorElement = inputElement.nextElementSibling;
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove(validationConfig.errorClass);
    }
  });
  
  // Находим кнопку отправки с использованием селектора из конфигурации
  const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);
  // Делаем кнопку неактивной и добавляем CSS-класс для неактивного состояния
  submitButton.disabled = true;
  submitButton.classList.add(validationConfig.inactiveButtonClass);
}