declare global {
    var mongoose: {
        conn: Object | null,
        promise: Promise,
    };
}

export {};