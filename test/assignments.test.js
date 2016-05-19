import test from 'blue-tape'
import nock from 'nock'

import * as assignments from '../assignments'
import assignmentList from './json/assignmentList.json'
import assignmentFile from './json/assignmentFile.json'

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
    .reply(200, assignmentFile)
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
    'assignments/p-check-ins',
    'assignments/p-read-overview',
    'assignments/p-weekly-practice'
  ]
  return assignments.getList(1)
    .then((actual) => {
      t.deepEqual(actual, expected)
    })
})

test('check errors appropriately on nonexistent sprint', (t) => {
  return assignments.getList(12)
    .then((list) => {
      return t.shouldFail(assignments.check(list), Error)
    })
})

test('teardown', (t) => {
  nock.cleanAll()
  nock.restore()
  t.end()
})
