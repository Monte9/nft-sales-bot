// https://stackoverflow.com/a/61958148
export function isError(obj): boolean {
  if (!obj) {
    return false
  }

  return Object.prototype.toString.call(obj) === '[object Error]'
}
