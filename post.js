import github from 'octonode'

export default function postAssignments (assignments, students) {
  console.log('Posting assignments...')
  return new Promise((resolve, reject) => {
    resolve([assignments, students])
  })
}

export function createAndAssign (issueData, assignees) {
  return Promise.all(assignees.map((assignee) => {
    issueData.assignee = assignee
    return createIssue(issueData)
  }))
}

export function createIssue (issueData) {
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])

  return new Promise((resolve, reject) => {
    client.repo(`${issueData.owner}/${issueData.repo}`)
      .issue(issueData.issue, (err, response) => {
        if (err) {
          return reject(new Error(`Couldn't post issue: ${issueData.issue.title}.`))
        }
        return resolve(response)
      })
  })
}
