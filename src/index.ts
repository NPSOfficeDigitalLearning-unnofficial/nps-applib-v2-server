import { loadPublicData } from "./server/static-data/static-data-fetcher";

(async () => {
    await loadPublicData();
    await import("./server/server");
})();
