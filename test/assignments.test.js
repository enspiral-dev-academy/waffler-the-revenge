import test from 'blue-tape'
import nock from 'nock'

import getAssignments from '../assignments'
import assignmentList from './json/assignmentList.json'
import assignmentFile from './json/assignmentFile.json'

const org = 'dev-academy-programme'
const repo = 'curriculum-private'
const folder = 'assignments'

const assignmentsContents = nock('https://api.github.com')
  .persist()
  .get(`repos/${org}/${repo}/contents/${folder}`)
  .reply(200, assignmentList)

test('gets an array', (t) => {
  return getAssignments(1)
    .then((assignments) => {
      t.equal(assignments, [])
    })
})

nock.cleanAll()
nock.restore()
