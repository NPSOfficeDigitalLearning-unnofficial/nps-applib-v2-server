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

    forceAdd(data:T):void {
        this._data.push(data);
    }

    async refetchOne(matcher:(t:T)=>boolean):Promise<void> {
        await this._data.find(matcher)?.reload();
    }

    forceRemove(matcher:(t:T)=>boolean):void {
        const matched = this._data.filter(matcher);
        for (const toRemove of matched)
            this._data.splice(this._data.indexOf(toRemove),1);
    }
}
