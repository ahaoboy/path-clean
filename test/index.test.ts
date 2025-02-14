import { clean } from '../src'
import { expect, test } from 'vitest'

test('empty path becomes current dir', () => {
  expect(clean('')).toBe('.')
})

test('single dot remains', () => {
  expect(clean('.')).toBe('.')
})

test('double dot remains', () => {
  expect(clean('..')).toBe('..')
})

test('root slash remains', () => {
  expect(clean('/')).toBe('/')
})

test('multiple slashes collapse', () => {
  expect(clean('//')).toBe('/')
  expect(clean('/path//to///thing')).toBe('/path/to/thing')
  expect(clean('path//to///thing')).toBe('path/to/thing')
})

test('eliminate current dir segments', () => {
  expect(clean('./test')).toBe('test')
  expect(clean('/./test')).toBe('/test')
  expect(clean('test/./path')).toBe('test/path')
})

test('handle parent dir segments', () => {
  expect(clean('/..')).toBe('/')
  expect(clean('/test/..')).toBe('/')
  expect(clean('test/..')).toBe('.')
  expect(clean('test/path/../..')).toBe('.')
  expect(clean('../test')).toBe('../test')
  expect(clean('../../test')).toBe('../../test')
})

test('mixed separators', () => {
  expect(clean('\\path\\to\\thing')).toBe('/path/to/thing')
  expect(clean('C:\\test\\..')).toBe('C:/')
  expect(clean('C:/path/../sub')).toBe('C:/sub')
})

test('complex cases', () => {
  expect(clean('/test/../path/')).toBe('/path')
  expect(clean('/test/../path////')).toBe('/path')
  expect(clean('test/path/../../another')).toBe('another')
  expect(clean('test/path/../../../..')).toBe('../..')
  expect(clean('/test/path/../../../..')).toBe('/')
})

test('Windows-style paths', () => {
  expect(clean('C:\\\\test\\path')).toBe('C:/test/path')
  expect(clean('C:\\..\\test')).toBe('C:/test')
  expect(clean('C:\\test\\path\\..\\..')).toBe('C:/')
})

test('more case', () => {
  expect(clean('')).to.equal('.')
  for (
    const [a, b] of [
      ['', '.'],
      ['.', '.'],
      ['..', '..'],
      ['/', '/'],
      ['/', '/'],
      ['//', '/'],
      ['///', '/'],
      ['.//', '.'],
      ['//..', '/'],
      ['..//', '..'],
      ['/..//', '/'],
      ['/.//./', '/'],
      ['././/./', '.'],
      ['path//to///thing', 'path/to/thing'],
      ['/path//to///thing', '/path/to/thing'],
      ['./', '.'],
      ['/./', '/'],
      ['./test', 'test'],
      ['./test/./path', 'test/path'],
      ['/test/./path/', '/test/path'],
      ['test/path/.', 'test/path'],
      ['/..', '/'],
      ['/../test', '/test'],
      ['test/..', '.'],
      ['test/path/..', 'test'],
      ['test/../path', 'path'],
      ['/test/../path', '/path'],
      ['test/path/../../', '.'],
      ['test/path/../../..', '..'],
      ['/test/path/../../..', '/'],
      ['/test/path/../../../..', '/'],
      ['test/path/../../../..', '../..'],
      ['test/path/../../another/path', 'another/path'],
      ['test/path/../../another/path/..', 'another'],
      ['../test', '../test'],
      ['../test/', '../test'],
      ['../test/path', '../test/path'],
      ['../test/..', '..'],
      ['\\..', '/'],
      ['\\..\\test', '/test'],
      ['test\\..', '.'],
      ['test\\path\\..\\..\\..', '..'],
      ['test\\path/..\\../another\\path', 'another/path'],
      ['test\\path\\my/path', 'test/path/my/path'],
      ['/dir\\../otherDir/test.json', '/otherDir/test.json'],
      ['c:\\test\\..', 'c:/'],
      ['c:/test/..', 'c:/'],
      ['/a/b', '/a/b'],
      ['./a/b', 'a/b'],
      ['/a/b/../c', '/a/c'],
      ['a/b', 'a/b'],
    ]
  ) {
    expect(clean(a)).toEqual(b)
  }
})
