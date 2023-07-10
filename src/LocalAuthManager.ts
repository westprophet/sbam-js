/**
 * @class LocalAuthManager
 * @alias LocalAuthManager
 * @constructor
 * @classdesc
 * Менеджер авторизации в frontend
 * Его задача работать с локальной сессией.
 * - Хранит сессию в локальном хранилище
 * - Может валидировать токен
 * - Получает токен
 * - При разлогинизации удаляет данные с локальных хранилищь
 */

export default class LocalAuthManager<T = string> {
  /** Ключ хранения данных */
  public tokenKey: string;

  /** Тип хранения данних */
  protected storage: any;

  /**
     * Если токен это json то нужно парсить его при входе и выходе
     */

  /** токен */
  private _token: T | null = null;

  constructor(
    storageType: 'localStorage' | 'sessionStorage' = 'sessionStorage', // выбор провайдера хранилища
    tokenKey = 'wt',
    parse = false,
  ) {
    this.storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    this.tokenKey = tokenKey;
    const localToken = this.getLocalStorageToken();
    this._token = localToken ?? null;
  }

  set token(value: T | null) {
    this._token = value;
  }

  get token(): T | null {
    return this._token;
  }

  /**
     * Установка токена в локальное хранилище
     * @memberof LocalAuthManager
     * @param token
     */

  // eslint-disable-next-line class-methods-use-this
  private isCanStringify(token: T): boolean {
    return typeof token === 'object';
  }

  private setStorageToken(token: T) {
    if (this.instanceOfToken(token)) {
      const a = this.isCanStringify(token);
      this.storage.setItem(this.tokenKey, a ? JSON.stringify(token) : token);
    }
  }

  /**
     * Получение токена из локального хранилища
     * @memberof LocalAuthManager
     * @return {token | null}
     */
  public getLocalStorageToken(): T | null {
    const token: any = this.storage.getItem(this.tokenKey);
    if (!token) return null;
    let res: T;
    try {
      res = JSON.parse(token);
    } catch (e) {
      res = token;
    }
    return this.instanceOfToken(res) ? res : null;
  }

  /**
     * Проверка токена на соответсвие типов, является ли переменная данного типа
     * @memberof LocalAuthManager
     * @param object
     */
  // eslint-disable-next-line class-methods-use-this
  public instanceOfToken(object: any): boolean {
    return !!object;
  }

  /**
     * Авторизоватся локально в системе фронтенда
     * @memberof LocalAuthManager
     * @param newToken
     * @public
     * @return {boolean}
     */
  public login(newToken: T): boolean {
    if (this.instanceOfToken(newToken)) {
      try {
        this.setStorageToken(newToken);
        this.token = newToken;
      } catch (err) {
        return false;
      }
      return true;
    }
    return false;
  }

  /**
     * Разлогинится в системе
     * Удаляет ключ из менеджера и хранилищь
     * @memberof LocalAuthManager
     * @return {boolean} индикатор удачного удаления данных из системы
     */
  public logout(): boolean {
    try {
      this.token = null;
      this.storage.removeItem(this.tokenKey);
      sessionStorage.clear();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
