import test from 'blue-tape'
import nock from 'nock'

import * as assignments from '../assignments'
import assignmentList from './json/assignmentList.json'
import waffleFile from './json/waffleFile.json'
import checkinFile from './json/checkinFile.json'
import getFiles from './json/getFiles.json'

const org = 'dev-academy-programme'
const repo = 'curriculum-private'
const folder = 'assignments'

process.env['WTR_ACCESS_TOKEN'] = 1

test('setup', (t) => {
  nock('https://api.github.com')
    .persist()
    .get(`/repos/${org}/${repo}/contents/${folder}?access_token=1`)
    .reply(200, assignmentList)
    .get(`/repos/${org}/${repo}/contents/${folder}/1.0-how-to-waffle/README.md?access_token=1`)
    .reply(200, waffleFile)
    .get(`/repos/${org}/${repo}/contents/${folder}/p-check-ins/README.md?access_token=1`)
    .reply(200, checkinFile)
  t.end()
})

test('gets assignments for sprint', (t) => {
  const expected = []
  return assignments.get(1)
    .then((actual) => {
      t.equal(actual, expected)
    })
})

test('gets list of paths for sprint', (t) => {
  const expected = [
    'assignments/1.0-how-to-waffle',
    'assignments/p-check-ins'
  ]
  return assignments.getList(1)
    .then((actual) => {
      t.deepEqual(actual, expected)
    })
})

test('assignments.checkList rejects on nonexistent sprint', (t) => {
  return assignments.getList(12)
    .then((list) => {
      return t.shouldFail(assignments.checkList(list), Error)
    })
})

test('assignments.getFiles retrieves a list of files', (t) => {
  const expected = getFiles
  return assignments.getList(1)
    .then(assignments.getFiles)
    .then((actual) => {
      t.equal(actual[0].content, expected[0].content, 'first element correct')
      t.equal(actual[1].content, expected[1].content, 'second element correct')
    })
})

test.only('assignments.sortAndProcess sorts by version number', (t) => {
  const unsorted = [ '1.11', '1.0', '1.2', 'p', '1.3', '1.1' ]
  const expected = [ 'p', '1.0', '1.1', '1.2', '1.3', '1.11' ]
  const actual = assignments.sortAndProcess(unsorted)
  t.deepEqual(actual, expected)
  t.end()
})

test('teardown', (t) => {
  nock.cleanAll()
  nock.restore()
  t.end()
})
