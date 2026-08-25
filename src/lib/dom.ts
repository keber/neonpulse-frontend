// Query helper for elements this code created itself (a locally authored
// <template> or innerHTML block — not external/untrusted content), where
// the selector is expected to always match. Using this instead of
// `querySelector(...)!` turns a silent null-deref into a descriptive
// error that names the selector that failed, which is what actually goes
// wrong if the markup and the selector ever drift apart (a rename, a
// typo, markup removed in a refactor).
export function requireElement<T extends Element = Element>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Expected element matching "${selector}" to exist`);
    }

    return element;
}
