# Auth Manager Js
Менеджер аутентификации для фронтенд разработки
Основная задача менеджера это упростить работу с JWT токеном на клиенте путем вывода простых и частых действий в переиспользуемые методы.

То есть это готовый набор методов которые приходится писать каждый раз на клиенте. И что бы их не писать каждый раз я (автор) решил вывести их в один класс с методами.

Вы можете
- Авторизация
- Деавторизация
- Валидация токена
- Выбрать провайдер хранения токена localStorage и sessionStorage
- Переопределить тип токена `TJWT` и валидатор

### Как переопределить тип токена?

По умолчанию это обычная `string` НО можно переопределить например в `object`

```ts 
    declare type TJWT = { exp: string };
```


### Как переопределить валидатор токена?
Переопределить валидатор токена можно просто наследовав класс

```ts
    export default class MyAuthManager extends LocalAuthManager {
        instanceOfIJWT(o: any): boolean {
            return typeof o === 'string' && o !== 'Vasia';
        }
    }
```
> Это простой пример наследования для демонстрации логики переопределения



## Примеры использования
#### Инициализация

```ts
    export const MyAuthManager = new LocalAuthManager(
        'sessionStorage', //Provider
        'limited-session-token' //Key
    );
```

#### Авторизация
```ts
    import MyAuthManager from './MyAuthManager'

    //...
    if (MyAuthManager.login(token)) console.log('Пользователь авторизован');
    else console.log('Токен не прошел валидадцию');
```

### Деавторизация
```ts
    import MyAuthManager from './MyAuthManager';
    //...
    if (MyAuthManager.logout()) console.log('Пользователь деавторизирован');
    else console.log('Что то пошло не так(');
```
