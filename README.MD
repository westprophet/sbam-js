# LocalAuthManager

**LocalAuthManager** - это библиотека для управления аутентификацией в клиентской части приложения. Она предоставляет простой интерфейс для работы с локальной сессией пользователя, включая хранение токенов, их валидацию и базовые операции входа и выхода из системы.

## Основные функции

- **Хранение сессии**: LocalAuthManager хранит сессию пользователя в локальном хранилище браузера (localStorage или sessionStorage).

- **Валидация токена**: Библиотека позволяет валидировать токен пользователя.

- **Установка и получение токена**: Вы можете легко устанавливать и получать токены с помощью этой библиотеки.

- **Выход из системы**: Библиотека также обеспечивает простой выход пользователя из системы, удаляя данные из локального хранилища.

- **Кастомный тип токена**: Вы можете переопределить тип токена, чтобы использовать кастомный объект вместо строки.

- **Кастомная валидация токена**: Позволяет пользователю определить собственную логику валидации кастомного токена.

## Примеры кода

### Установка и использование

```javascript
// Установка LocalAuthManager
import LocalAuthManager from 'local-auth-manager';

// Создание экземпляра LocalAuthManager
const authManager = new LocalAuthManager();

// Вход пользователя
const userToken = 'exampleToken123';
if (authManager.login(userToken)) {
  console.log('Пользователь успешно вошел в систему');
}

// Получение токена пользователя
const token = authManager.token;
console.log('Текущий токен пользователя:', token);

// Выход пользователя из системы
if (authManager.logout()) {
  console.log('Пользователь успешно вышел из системы');
}
```

### Конфигурация с кастомным типом токена и валидацией

```javascript
import LocalAuthManager from 'local-auth-manager';

// Определение кастомного типа токена (например, IJWT)
interface IJWT {
  userId: number;
  username: string;
  // Добавьте другие поля вашего кастомного токена
}

// Создание экземпляра LocalAuthManager с кастомным типом токена
const authManager = new LocalAuthManager<IJWT>();

// Вход пользователя с кастомным токеном
const customToken: IJWT = { userId: 1, username: 'exampleUser' };
if (authManager.login(customToken)) {
  console.log('Пользователь успешно вошел в систему');
}

// Кастомная валидация токена
function customTokenValidation(token: IJWT | null): boolean {
  // Ваша логика валидации токена
  if (token && token.userId && token.username) {
    return true;
  }
  return false;
}

// Установка кастомной функции валидации
authManager.validateToken = customTokenValidation;

// Выход пользователя из системы
if (authManager.logout()) {
  console.log('Пользователь успешно вышел из системы');
}
```

## Установка

Вы можете установить библиотеку с помощью npm:

```shell
npm install local-auth-manager
```

## Документация

Дополнительную информацию о методах и параметрах класса LocalAuthManager вы можете найти в [документации](https://github.com/westprophet/local-auth-manager/blob/main/README.md).

## Лицензия

Этот проект лицензируется по [MIT License](LICENSE).
