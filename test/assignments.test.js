import test from 'blue-tape'
import nock from 'nock'

import * as assignments from '../src/assignments'
import assignmentList from './json/assignmentList.json'
import waffleFile from './json/waffleFile.json'
import checkinFile from './json/checkinFile.json'
import getFiles from './json/getFiles.json'

const org = 'dev-academy-programme'
const repo = 'curriculum-private'
const folder = 'assignments'

process.env['WTR_ACCESS_TOKEN'] = 1

test('mock API reponses', (t) => {
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
  const expected = {
    owner: org,
    repo: repo,
    path: folder,
    paths: [
      'assignments/1.0-how-to-waffle',
      'assignments/p-check-ins'
    ]
  }
  return assignments.getList('1')
    .then((actual) => {
      t.deepEqual(actual, expected)
    })
})

test('gets path for single assignment', (t) => {
  const expected = {
    owner: org,
    repo: repo,
    path: folder,
    paths: [
      'assignments/1.0-how-to-waffle'
    ]
  }
  return assignments.getList('1.0')
    .then((actual) => {
      t.deepEqual(actual, expected)
    })
})

test('assignments.checkList rejects on sprint with no assignments', (t) => {
  const list = {
    paths: [ 'p-check-ins' ]
  }
  return t.shouldFail(assignments.checkList(list), Error)
})

test('assignments.sort sorts by version number (descending)', (t) => {
  const issues = [
    { title: '1.0-asdf' },
    { title: '1.2-asdf' },
    { title: '1.11-asdf' },
    { title: '1.3-asdf' },
    { title: '0.1 asdf' },
    { title: '1.1-asdf' }
  ]
  const expected = [
    { title: '0.1 asdf' },
    { title: '1.0-asdf' },
    { title: '1.1-asdf' },
    { title: '1.2-asdf' },
    { title: '1.3-asdf' },
    { title: '1.11-asdf' }
  ]
  const actual = assignments.sort(issues)
  t.deepEqual(actual, expected)
  t.end()
})

test('assignments.getFiles retrieves the correct contents', (t) => {
  const list = {
    owner: org,
    repo: repo,
    path: folder,
    paths: [
      'assignments/p-check-ins'
    ]
  }
  const expected = getFiles
  return assignments.getFiles(list)
    .then((actual) => {
      t.equal(actual[0].body, expected[0].body)
    })
})

test('assignments.makeIssues returns issue objects', (t) => {
  const expected = getFiles[0]
  const actual = assignments.makeIssues(getFiles, '1')
  t.deepEqual(actual[0], expected)
  t.end()
})
