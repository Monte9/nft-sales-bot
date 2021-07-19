// Returns a Promise that resolves after "ms" Milliseconds
export const delayBy = ms => new Promise(res => setTimeout(res, ms));
