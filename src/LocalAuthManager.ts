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

  /** токен */
  private _token: T | null = null;

  constructor(
    storageType: 'localStorage' | 'sessionStorage' = 'sessionStorage', // выбор провайдера хранилища
    tokenKey = 'wt',
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

  private setStorageToken(token: T) {
    if (this.instanceOfToken(token)) { this.storage.setItem(this.tokenKey, token); }
  }

  /**
   * Получение токена из локального хранилища
   * @memberof LocalAuthManager
   * @return {token | null}
   */
  public getLocalStorageToken(): T | null {
    const token: any = this.storage.getItem(this.tokenKey);
    return this.instanceOfToken(token) ? token : null;
  }

  /**
   * Проверка токена на соответсвие типов, является ли переменная данного типа
   * @memberof LocalAuthManager
   * @param object
   */
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
  public login(newToken: any): boolean {
    if (this.instanceOfToken(newToken)) {
      try {
        this.setStorageToken(newToken);
        this.token = newToken;
      } catch (err) {
        return false;
      }
      return true;
    } return false;
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
      this.storage.clear();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
