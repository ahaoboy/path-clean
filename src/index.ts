/**
 * Cleans a given path by:
 * 0. replace \ to /
 * 1. Reducing multiple slashes to a single slash.
 * 2. Eliminating `.` path segments.
 * 3. Handling `..` segments properly based on the path's root.
 * 4. Preserving leading `..` in relative paths.
 *
 * @param path The input path to clean.
 * @returns The cleaned path.
 */
export function clean(path: string): string {
  path = path.replaceAll(/\\/g, '/')

  // Check for Windows drive prefix (e.g., C:)
  let prefix = ''
  const driveMatch = path.match(/^([a-zA-Z]:)(\/|$)/)
  if (driveMatch) {
    prefix = driveMatch[1]
    path = path.slice(prefix.length)
  }

  const isAbsolute = path.startsWith('/')
  path = path.replaceAll(/\/+/g, '/') // Replace multiple slashes with single

  // Split into components and filter out empty strings (except for absolute paths)
  const components = path.split('/').filter((c) => c !== '')

  const stack: string[] = []

  for (const comp of components) {
    if (comp === '.') {
      continue
    } else if (comp === '..') {
      if (stack.length === 0) {
        if (!isAbsolute) {
          stack.push(comp) // Relative path, allow leading ..
        }
      } else {
        const last = stack[stack.length - 1]
        if (last === '..') {
          stack.push(comp)
        } else if (last === '') {
          // Root directory, ignore ..
          continue
        } else {
          stack.pop()
        }
      }
    } else {
      stack.push(comp)
    }
  }

  // Construct the result
  let result = prefix

  if (isAbsolute) {
    result += '/'
  }

  const joined = stack.join('/')
  result += joined

  // Handle edge cases
  if (result === '') {
    return '.'
  } else if (isAbsolute && stack.length === 1 && stack[0] === '') {
    return prefix ? `${prefix}` : '/'
  }
  return result
}
