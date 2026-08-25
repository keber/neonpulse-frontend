// Signals a *known* failure while fetching or validating the concerts
// catalog: the backend responded with a non-ok status, the network call
// itself failed, or the payload doesn't match the expected contract.
// Distinguishing this from a plain Error lets the UI show a message
// tailored to "we couldn't reach/parse the backend", instead of the
// generic safety-net fallback reserved for truly unexpected bugs
// (see main.ts's catch block).
export class ConcertsFetchError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'ConcertsFetchError';
    }
}
