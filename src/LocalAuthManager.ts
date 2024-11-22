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
interface TArg<T> {
  storageType: 'localStorage' | 'sessionStorage', // выбор провайдера хранилища
  tokenKey: string,
  onLogin?(newToken:T):void,
  onLogout?(oldToken:T):void,
  parse?: boolean,
  tokenValidator?(token:T): any,
}
export default class LocalAuthManager<T = string> {
  /** Ключ хранения данных */
  public tokenKey: string;

  private readonly onLogin: (token: T) => void;

  private readonly onLogout: (token: T) => void;

  /** Тип хранения данних */
  protected storage: any;

  /**
     * Если токен это json то нужно парсить его при входе и выходе
     */

  /** токен */
  private _token: T | null = null;

  constructor({
    onLogin, onLogout, storageType = 'sessionStorage', tokenKey = 'wt', parse = false, tokenValidator,
  }: TArg<T>) {
    this.storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    this.tokenKey = tokenKey;
    this.onLogout = onLogout;
    this.onLogin = onLogin;
    const localToken = this.getLocalStorageToken();
    this._token = localToken ?? null;
    if (tokenValidator) this.isValidToken = tokenValidator;
  }

  /**
   * Проверка токена на соответсвие типов, является ли переменная данного типа
   * @memberof LocalAuthManager
   * @param object
   */

  // eslint-disable-next-line class-methods-use-this
  public isValidToken(object: any): boolean {
    return !!object;
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
    if (this.isValidToken(token)) {
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
    return this.isValidToken(res) ? res : null;
  }

  /**
     * Авторизоватся локально в системе фронтенда
     * @memberof LocalAuthManager
     * @param newToken
     * @public
     * @return {boolean}
     */
  public login(newToken: T): boolean {
    if (this.isValidToken(newToken)) {
      try {
        this.setStorageToken(newToken);
        this.token = newToken;
        if (this.onLogin) this.onLogin(newToken);
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
      if (this.onLogout) this.onLogout(this.token);
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
