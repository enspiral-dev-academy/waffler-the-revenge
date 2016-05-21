import test from 'blue-tape'
import nock from 'nock'

import * as students from '../students'
import teams from './json/teams.json'

const cohort = 'waffler-test'

process.env['WTR_ACCESS_TOKEN'] = 1

test('mock API responses', (t) => {
  nock('https://api.github.com')
    .persist()
    .get(`/orgs/${cohort}/teams?access_token=1`)
    .reply(200, teams)
  t.end()
})

test('students.getTeam returns the correct team', (t) => {
  const expected = {
    slug: 'waffler-test'
  }
  return students.getTeam(cohort)
    .then((actual) => {
      t.equal(actual.slug, expected.slug)
    })
})

//test('assignments.splitList rejects on sprint with no assignments', (t) => {
  //const list = [ 'p-check-ins' ]
  //return t.shouldFail(assignments.splitList(list), Error)
//})
