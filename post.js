import github from 'octonode'

export default function postAssignments (assignments, students, cohort) {
  console.log('Posting assignments...')
  return Promise.all(
    assignments
      .map((assignment) => {
        return createAndAssign({
          owner: cohort,
          repo: cohort,
          issue: assignment
        }, students)
      })
      .reduce((a, b) => {
        return a.concat(b)
      })
  )
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
