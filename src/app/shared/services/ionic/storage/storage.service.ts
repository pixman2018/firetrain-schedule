import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
// https://github.com/ionic-team/ionic-storage

@Injectable()
//  {
//   providedIn: 'root',
// }
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this._init();
  }

  // Initialize Ionic Angular storage
  private async _init() {
    this._storage = await this.storage.create();
  }

  /**
   *
   * @param key
   * @returns storaged value {string}
   */
  public async getStorage(key: string): Promise<string | null> {
    let value = null;

      value = await this._storage?.get(key);
    return value;
  }

  /**
   *
   * @param key
   * @param value
   * Store a key value pair.
   */
  public async setStorage(key: string, value: string): Promise<any> {
    const result = await this._storage?.set(key, value);
    return result;
  }

  /**
   *
   * @param key
   * Remove item from storage based on key (name)
   */
  public async removeStorage(key: string): Promise<void> {
    if (this._storage) {
      await this._storage.remove(key);
    }
  }

  /**
   * Clear everything from storage
   */
  public async clearStorage(): Promise<void> {
    const value = await this._storage?.clear();
  }

  public async getStorageKeys(key: string): Promise<string[] | undefined> {
    let value = null;
    value = await this._storage?.keys();
    return value;
  }
}
