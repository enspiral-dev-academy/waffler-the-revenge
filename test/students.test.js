import test from 'blue-tape'
import nock from 'nock'

import * as students from '../students'
import teams from './json/teams.json'
import members from './json/members.json'

const cohort = 'waffler-test'
const notAnOrg = '___probably_does_not_exist___'
const noTeams = 'noteams'

process.env['WTR_ACCESS_TOKEN'] = 1

test('mock API responses', (t) => {
  nock('https://api.github.com')
    .persist()
    .get(`/orgs/${cohort}/teams?access_token=1`)
    .reply(200, teams)
    .get(`/orgs/${notAnOrg}/teams?access_token=1`)
    .reply(404)
    .get(`/orgs/${noTeams}/teams?access_token=1`)
    .reply(200, [])
    .get('/teams/1/members?access_token=1')
    .reply(200, members)
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

test('students.getTeam rejects if no org', (t) => {
  return t.shouldFail(students.getTeam('___probably_does_not_exist___', Error))
})

test('students.getTeam rejects if no team', (t) => {
  return t.shouldFail(students.getTeam(noTeams))
})

test('students.getTeamMembers returns the correct usernames', (t) => {
  const expected = ['richchurcher']
  return students.getTeamMembers(1)
    .then((actual) => {
      t.deepEqual(actual, expected)
    })
})
