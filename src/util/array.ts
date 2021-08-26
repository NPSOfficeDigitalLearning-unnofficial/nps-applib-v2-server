/** Check if all elements of embedded array are from a source array. */
export function allAreFromArray<T>(sourceArr:readonly T[],embeddedArr:T[]):boolean {
    return (
        embeddedArr instanceof Array &&
        embeddedArr.every(v=>sourceArr.includes(v))
    );
}
