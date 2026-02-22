export class Cache {
    private static store: Map<string, { value: any; expiry: number }> = new Map();

    static get(key: string): any | null {
        const item = this.store.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            this.store.delete(key);
            return null;
        }
        return item.value;
    }

    static set(key: string, value: any, ttlSeconds: number = 60) {
        if (this.store.size > 100) {
            this.cleanup();
        }
        this.store.set(key, {
            value,
            expiry: Date.now() + ttlSeconds * 1000
        });
    }

    static cleanup() {
        // Simple garbage collection
        const now = Date.now();
        for (const [key, item] of this.store.entries()) {
            if (now > item.expiry) this.store.delete(key);
        }
    }
}
