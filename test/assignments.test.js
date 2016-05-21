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

test('assignments.splitList rejects on sprint with no assignments', (t) => {
  const list = [ 'p-check-ins' ]
  return t.shouldFail(assignments.splitList(list), Error)
})

test('assignments.splitList returns generic and numeric topics', (t) => {
  const list = [
    'assignments/1.0-how-to-waffle',
    'assignments/p-check-ins',
    'assignments/x.x-racer-game'
  ]
  const expected = {
    generic: [ 'assignments/p-check-ins' ],
    numeric: [ '1.0-how-to-waffle' ],
    path: 'assignments'
  }
  return assignments.splitList(list)
    .then((actual) => {
      t.deepEqual(actual, expected)
    })
})

test('assignments.sort sorts by version number (descending)', (t) => {
  const topics = {
    generic: ['assignments/p-check-ins'],
    numeric: [ '1.0-asdf', '1.2-asdf', '1.11-asdf', '1.3-asdf', '1.1-asdf' ],
    path: 'assignments'
  }
  const expected = [
    'assignments/1.11-asdf',
    'assignments/1.3-asdf',
    'assignments/1.2-asdf',
    'assignments/1.1-asdf',
    'assignments/1.0-asdf',
    'assignments/p-check-ins'
  ]

  const actual = assignments.sort(topics)
  t.deepEqual(actual, expected)
  t.end()
})

test('assignments.getFiles retrieves the correct contents', (t) => {
  const list = [
    'assignments/1.0-how-to-waffle',
    'assignments/p-check-ins'
  ]
  const expected = getFiles
  return assignments.getFiles(list)
    .then((actual) => {
      t.equal(actual[0].content, expected[0].content, 'numeric')
      t.equal(actual[1].content, expected[1].content, 'generic')
    })
})

test('teardown', (t) => {
  nock.cleanAll()
  nock.restore()
  t.end()
})
