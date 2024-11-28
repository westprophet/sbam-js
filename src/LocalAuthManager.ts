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
  onSave?(newToken:T):void,
  onRemove?(oldToken:T):void,
  parse?: boolean,
  tokenValidator?(token:T): any,
}
export default class LocalAuthManager<T = string> {
  /** Ключ хранения данных */
  public tokenKey: string;

  private readonly onSave: (token: T) => void;

  private readonly onRemove: (token: T) => void;

  /** Тип хранения данних */
  protected storage: any;

  /**
     * Если токен это json то нужно парсить его при входе и выходе
     */

  /** токен */
  private _token: T | null = null;

  constructor({
    onSave, onRemove, storageType = 'sessionStorage', tokenKey = 'wt', parse = false, tokenValidator,
  }: TArg<T>) {
    this.storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    this.tokenKey = tokenKey;
    const localToken = this.getStorageToken();
    this._token = localToken ?? null;
    this.onRemove = onRemove;
    this.onSave = onSave;
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
  public getStorageToken(): T | null {
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
  public save(newToken: T): boolean {
    if (this.isValidToken(newToken)) {
      try {
        this.setStorageToken(newToken);
        this.token = newToken;
        if (this.onSave) this.onSave(newToken);
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
  public remove(): boolean {
    try {
      if (this.onRemove) this.onRemove(this.token);
      this.token = null;
      this.storage.removeItem(this.tokenKey);
      // sessionStorage.clear();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
