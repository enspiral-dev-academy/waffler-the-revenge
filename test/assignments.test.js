import test from 'blue-tape'
import nock from 'nock'

import * as assignments from '../assignments'
import assignmentList from './json/assignmentList.json'
import assignmentFile from './json/assignmentFile.json'

const org = 'dev-academy-programme'
const repo = 'curriculum-private'
const folder = 'assignments'


test('gets an array', (t) => {
  const assignments = nock('https://api.github.com')
    .get(`repos/${org}/${repo}/contents/${folder}`)
    .reply(200, assignmentList)
    .get(`repos/${org}/${repo}/contents/${folder}/1.0-how-to-waffle/README.md`)
    .reply(200, assignmentFile)

  return assignments.get(1)
    .then((assignments) => {
      t.equal(assignments, [])
    })
})
