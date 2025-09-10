import Cookies from 'js-cookie';

type TStorageType = 'localStorage' | 'sessionStorage' | 'cookie';

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
  storageType: TStorageType, // storage provider selection
  tokenKey: string,
  cookieOptions?: Cookies.CookieAttributes,

  onLogin?(newToken: T): void,

  onLogout?(oldToken: T): void,

  // parse?: boolean,

  tokenValidator?(token: unknown): token is T,
}

export default class SBAM<T = string> {
  /** Storage key */
  public tokenKey: string;

  private readonly onLogin: (token: T) => void;

  private readonly onLogout: (token: T) => void;

  /** Storage type */
  public storage: any;

  /** Storage type */
  private _storageType: TStorageType;

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
    tokenValidator,
    cookieOptions,
  }: TArg<T>) {
    this.tokenKey = tokenKey;
    this.cookieOptions = cookieOptions ?? { path: '/', sameSite: 'strict' };
    this._storageType = storageType; // init storage
    this._token = this.getStorageToken() ?? null;

    this.onLogout = onLogout;
    this.onLogin = onLogin;
    if (tokenValidator) this.isValidToken = tokenValidator;
  }

  set storageType(value: TStorageType) {
    if (this._storageType !== value) this.migrateToStorage(value);
    this._storageType = value;
  }

  public migrateToStorage(storage: TStorageType): void {
    if (this.storage) this.storage.removeItem(this.tokenKey); // remove old storage token
    this.initStorage(storage); // init new storage with new type
    if (this.token) this.setStorageToken(this.token); // set value to new storage
  }

  /**
     * Check if token matches types, whether the variable is of this type
     * @memberof SBAM
     * @param object
     */

  // eslint-disable-next-line class-methods-use-this
  public isValidToken(object: unknown): object is T {
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
      this.storage.setItem(this.tokenKey, tokenValue);
    }
  }

  /**
     * Get token from local storage
     * @memberof SBAM
     * @return {token | null}
     */
  public getStorageToken(): T | null {
    const token = this.storage.getItem(this.tokenKey);
    if (!token) return null;
    let res: T;
    try {
      res = JSON.parse(token);
    } catch (e) {
      res = token;
    }
    return this.isValidToken(res) ? res : null;
  }

  private initStorage(storageType: TStorageType) {
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
    return this.storage;
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
        console.error('Error on login:', newToken);
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
      this.storage.removeItem(this.tokenKey);

      // Clear session storage in any case
      // sessionStorage.clear();
      return true;
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
