import { Model } from "sequelize";

export default class QueryCache<T extends Model> {
    
    private _expires = -Infinity;
    private _data: T[] = [];
    
    constructor(readonly maxLifetime:number, readonly fetchFunc:()=>Promise<T[]>) {}

    /** Force the cache to update to the most recent data. */
    async forceFetch():Promise<void> {
        this._expires = Date.now() + this.maxLifetime;
        this._data = await this.fetchFunc();
    }

    /** Fetch new data for the cache if it's outdated. */
    async fetchIfOutdated():Promise<void> {
        if (Date.now() > this._expires)
            await this.forceFetch();
    }

    /** Get the data in the cache, and fetch new data if it's outdated. */
    async getData():Promise<T[]> {
        await this.fetchIfOutdated();
        return [...this._data];
    }
}
