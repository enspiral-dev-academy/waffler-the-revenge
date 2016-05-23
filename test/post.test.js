import test from 'blue-tape'
import nock from 'nock'
import github from 'octonode'

import * as post from '../src/post'
import createIssue from './json/createIssue.json'

const cohort = 'waffler-test'

process.env['WTR_ACCESS_TOKEN'] = 1

test('mock API responses', (t) => {
  nock('https://api.github.com')
    .persist()
    .post(`/repos/${cohort}/${cohort}/issues?access_token=1`)
    .reply(201, createIssue)
    .post(`/repos/${cohort}/notarepo/issues?access_token=1`)
    .reply(404)
  t.end()
})

test('post.createIssue creates an issue', (t) => {
  const issue = {
    title: 'Wombats',
    body: 'Wombats.',
    assignee: 'richchurcher'
  }
  const expected = {
    body: 'Wombats.',
    assignee: {
      login: 'richchurcher'
    }
  }
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])
  return post.createIssue(client, issue, cohort, cohort)
    .then((actual) => {
      t.equal(actual.body, expected.body, 'body correct')
      t.equal(actual.assignee.login, expected.assignee.login, 'login correct')
    })
})

test('post.createIssue rejects on bad repo', (t) => {
  const issueData = {
    owner: cohort,
    repo: 'notarepo',
    issue: {
      title: 'A'
    }
  }
  return t.shouldFail(post.createIssue(issueData))
})
