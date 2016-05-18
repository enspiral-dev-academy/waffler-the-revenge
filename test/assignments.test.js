import test from 'tape'
import nock from 'nock'

import getAssignments from 'assignments'
import assignmentList from './json/assignmentList.json'
import assignmentFile from './json/assignmentFile.json'

const org = 'dev-academy-programme'
const repo = 'curriculum-private'
const folder = 'assignments'

const assignmentsContents = nock('https://api.github.com')
  .get(`repos/${org}/${repo}/contents/${folder}`)
  .persist()
  .reply(200, assignmentList)

test('get JSON samples', (t) => {
  t.equal(1, files, 'JSON')
  t.end()
})

nock.cleanAll()
nock.restore()
