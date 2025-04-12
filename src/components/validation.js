// Функция isValid теперь принимает formElement, inputElement, настройки и customValidation
const isValid = (formElement, inputElement, validationConfig, customValidation) => {
  if (!inputElement.validity.valid) {
    // showInputError теперь получает параметром форму, настройки валидации,
    // поле и сообщение об ошибке
    showInputError(formElement, inputElement, validationConfig, inputElement.validationMessage);
  } else if (customValidation && customValidation(inputElement)){
    // showInputError теперь получает параметром форму, настройки валидации,
    // поле и сообщение об ошибке
    showInputError(formElement, inputElement, validationConfig, customValidation(inputElement));
  }
  else{
    // hideInputError теперь получает параметром форму, настройки валидации и поле
    hideInputError(formElement, inputElement, validationConfig);
  }
};

// Обновленная функция showInputError теперь использует селекторы из validationConfig
const showInputError = (formElement, inputElement, validationConfig, errorMessage) => {
  // Находим элемент ошибки внутри самой функции
  const errorElement = inputElement.nextElementSibling;
  // Добавляем класс ошибки из конфигурации
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  // Показываем сообщение об ошибке, используя класс из конфигурации
  errorElement.classList.add(validationConfig.errorClass);
};

// Обновленная функция hideInputError теперь использует селекторы из validationConfig
const hideInputError = (formElement, inputElement, validationConfig) => {
  // Находим элемент ошибки
  const errorElement = inputElement.nextElementSibling;
  // Удаляем класс ошибки, используя класс из конфигурации
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.textContent = '';
  // Скрываем сообщение об ошибке, используя класс из конфигурации
  errorElement.classList.remove(validationConfig.errorClass);
};

// Обновленная функция setEventListeners теперь использует селекторы из validationConfig
const setEventListeners = (formElement, validationConfig, customValidations) => {
  // Находим все поля внутри формы, используя селектор из конфигурации
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));

  // Функция, которая проверяет валидность всех полей и включает/выключает кнопку «Сохранить»
  const checkFormState = () => {
    // Используем селектор кнопки из конфигурации
    const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);
    const isFormValid = inputList.every(inputElement => {
      let customValidation = null;
      if (customValidations.has(inputElement)) {
        customValidation = customValidations.get(inputElement);
      }
      // Если у поля есть кастомная валидация, оно считается валидным, если функция возвращает null
      return inputElement.validity.valid && (!customValidation || customValidation(inputElement) === null);
    });

    // Обрабатываем состояние кнопки с использованием класса неактивной кнопки из конфигурации
    if (isFormValid) {
      submitButton.disabled = false;
      submitButton.classList.remove(validationConfig.inactiveButtonClass);
    } else {
      submitButton.disabled = true;
      submitButton.classList.add(validationConfig.inactiveButtonClass);
    }
  };

  // Назначаем обработчик события input для каждого поля
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      let customValidation = null;
      if (customValidations.has(inputElement)) {
        customValidation = customValidations.get(inputElement);
      }
      // Проверяем текущее поле, передавая настройки валидации
      isValid(formElement, inputElement, validationConfig, customValidation);
      // Проверяем всю форму и обновляем состояние кнопки
      checkFormState();
    });
  });

  // Инициализируем состояние кнопки при загрузке формы
  checkFormState();
};

// Обновленная функция enableValidation теперь принимает validationConfig и передает его в другие функции
export const enableValidation = (validationConfig, customValidations = new Map()) => {
  // Найдём все формы с указанным классом в DOM из конфигурации,
  // сделаем из них массив методом Array.from
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));

  // Переберём полученную коллекцию
  formList.forEach((formElement) => {
    // Для каждой формы вызовем функцию setEventListeners,
    // передав ей элемент формы и настройки валидации
    setEventListeners(formElement, validationConfig, customValidations);
  });
};

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
    // Сбрасываем состояние ошибки через существующую функцию, передавая настройки валидации
    hideInputError(formElement, inputElement, validationConfig);
  });
  
  // Находим кнопку отправки с использованием селектора из конфигурации
  const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);
  // Делаем кнопку неактивной и добавляем CSS-класс для неактивного состояния из конфигурации
  submitButton.disabled = true;
  submitButton.classList.add(validationConfig.inactiveButtonClass);
}