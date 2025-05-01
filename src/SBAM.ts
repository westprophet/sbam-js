import Cookies from 'js-cookie';

/**
 * @class SBAM
 * @alias SBAM
 * @constructor
 * @classdesc
 * Frontend authorization manager
 * Its task is to work with the local session.
 * - Stores session in local storage
 * - Can validate token
 * - Gets token
 * - When logging out, deletes data from local storages
 */
interface TArg<T> {
  storageType: 'localStorage' | 'sessionStorage' | 'cookie', // storage provider selection
  tokenKey: string,
  cookieOptions?: Cookies.CookieAttributes,

  onLogin?(newToken: T): void,

  onLogout?(oldToken: T): void,

  parse?: boolean,

  tokenValidator?(token: T): any,
}

export default class SBAM<T = string> {
  /** Storage key */
  public tokenKey: string;

  private readonly onLogin: (token: T) => void;

  private readonly onLogout: (token: T) => void;

  /** Storage type */
  protected storage: any;

  /** Storage type */
  protected storageType: 'localStorage' | 'sessionStorage' | 'cookie';

  /** Cookie options */
  protected cookieOptions?: Cookies.CookieAttributes;

  /**
     * If token is JSON then it needs to be parsed on login and logout
     */

  /** token */
  private _token: T | null = null;

  constructor({
    onLogin,
    onLogout,
    storageType = 'sessionStorage',
    tokenKey = 'wt',
    parse = false,
    tokenValidator,
    cookieOptions,
  }: TArg<T>) {
    this.storageType = storageType;
    this.cookieOptions = cookieOptions ?? { path: '/', sameSite: 'strict' };

    switch (storageType) {
      case 'localStorage':
        this.storage = localStorage;
        break;
      case 'sessionStorage':
        this.storage = sessionStorage;
        break;
      case 'cookie':
        this.storage = {
          getItem: (key: string) => Cookies.get(key),
          setItem: (key: string, value: string) => Cookies.set(key, value, this.cookieOptions),
          removeItem: (key: string) => Cookies.remove(key, this.cookieOptions),
        };
        break;
      default:
        this.storage = sessionStorage;
    }
    this.tokenKey = tokenKey;
    const localToken = this.getLocalStorageToken();
    this._token = localToken ?? null;
    this.onLogout = onLogout;
    this.onLogin = onLogin;
    if (tokenValidator) this.isValidToken = tokenValidator;
  }

  /**
     * Check if token matches types, whether the variable is of this type
     * @memberof SBAM
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
     * Set token in local storage
     * @memberof SBAM
     * @param token
     */

  // Check if token can be stringified
  // eslint-disable-next-line class-methods-use-this
  private isCanStringify(token: T): boolean {
    return typeof token === 'object';
  }

  private setStorageToken(token: T) {
    if (this.isValidToken(token)) {
      const shouldStringify = this.isCanStringify(token);
      const tokenValue = shouldStringify ? JSON.stringify(token) : token as any;

      if (this.storageType === 'cookie') {
        Cookies.set(this.tokenKey, tokenValue, this.cookieOptions);
      } else {
        this.storage.setItem(this.tokenKey, tokenValue);
      }
    }
  }

  /**
     * Get token from local storage
     * @memberof SBAM
     * @return {token | null}
     */
  public getLocalStorageToken(): T | null {
    let token: any;

    if (this.storageType === 'cookie') {
      token = Cookies.get(this.tokenKey);
    } else {
      token = this.storage.getItem(this.tokenKey);
    }

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
     * Log in locally in frontend system
     * @memberof SBAM
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
     * Log out of the system
     * Removes key from manager and storages
     * @memberof SBAM
     * @return {boolean} indicator of successful data removal from the system
     */
  public logout(): boolean {
    try {
      if (this.onLogout) this.onLogout(this.token);
      this.token = null;

      if (this.storageType === 'cookie') {
        Cookies.remove(this.tokenKey, this.cookieOptions);
      } else {
        this.storage.removeItem(this.tokenKey);
      }

      // Clear session storage in any case
      // sessionStorage.clear();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
