import test from 'blue-tape'
import nock from 'nock'

import * as assignments from '../assignments'
import assignmentList from './json/assignmentList.json'
import waffleFile from './json/waffleFile.json'
import checkinFile from './json/checkinFile.json'

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
  const expected = [
    {
      title: '1.0 How to waffle? Click the number in the top left of this card...',
      body: 'IyAxLjAgSG93IHRvIHdhZmZsZT8gQ2xpY2sgdGhlIG51bWJlciBpbiB0aGUg\ndG9wIGxlZnQgb2YgdGhpcyBjYXJkLi4uCgojIyBXZWxjb21lIHRvIHlvdXIg\nZmlyc3QgdGVzdCBhc3NpZ25tZW50IQoKLSBbIF0gWW91J3JlIHJlYWR5IHRv\nIHN0YXJ0IHdvcmsgb24gYW4gYXNzaWdubWVudD8gRHJhZyBpdCB0byB0aGUg\nJ0luIHByb2dyZXNzJyBjb2x1bW4uCi0gWyBdIFRoaXMgaXMgYSB0YXNrLiBj\naGVjayBpdCB3aGVuIGl0J3MgY29tcGxldGUuIFlvdSBjYW4gY2hlY2sgdGhp\ncyBvbmUgbm93LiBOaWNlLgotIFsgXSBXaGVuIGFsbCB0aGUgdGFza3MgYXJl\nIGNoZWNrZWQsIG1vdmUgdGhlIGFzc2lnbm1lbnQgdG8gdGhlICdSZXZpZXcn\nIGNvbHVtbiEgRG8gdGhhdCBub3cuIEF3ZXNvbWUuCi0gV2UnbGwgY2hlY2sg\neW91ciB3b3JrIHRoZW4gbW92ZSBpdCB0byB0aGUgJ0RvbmUnIGNvbHVtbiB3\naGVuIHdlJ3JlIHNhdGlzZmllZC4KLSBPay4gT250byB0aGUgcmVhbCBhc3Np\nZ25tZW50cyBub3cuLi4gaGF2ZSBmdW4hCg==\n'
    },
    {
      title: 'Check in ~ 30 mins',
      body: 'IyBDaGVjayBpbiB+IDMwIG1pbnMKPkZhY2UtdGltZSBpcyBpbXBvcnRhbnQg\ndG9vCgotIFsgXSBBdHRlbmQgYSB2aWRlbyBjaGVjay1pbiB3aXRoIHlvdXIg\nY29ob3J0IGZhY2lsaXRhdG9yIDpkZWNpZHVvdXNfdHJlZTogKlRoaXMgaXMg\nYW4gaW1wb3J0YW50IGNoZWNrLWluLCAtIHlvdSBhcmUgZXhwZWN0ZWQgdG8g\nYXR0ZW5kIG9uZSBjaGVjay1pbiBwZXIgd2VlayAoeW91J3JlIHdlbGNvbWUg\ndG8gYm90aCkuIElmIHlvdSBtaXNzIGJvdGggd2Vla2x5IGNoZWNraW5zLCBw\nbGVhc2Ugc3RhdGUgd2h5IGluIGEgd2FmZmxlIGNvbW1lbnQgYmVsb3csIGFu\nZCBzdWJtaXQgdGhpcyBhc3NpZ25tZW50Ki4K\n'
    }
  ]
  return assignments.getList(1)
    .then(assignments.getFiles)
    .then((actual) => {
      t.deepEqual(actual, expected)
    })
})

test('teardown', (t) => {
  nock.cleanAll()
  nock.restore()
  t.end()
})
