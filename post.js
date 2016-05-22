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
      }, [])
  )
}

export function createAndAssign (issueData, assignees) {
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])

  return Promise.all(assignees.map((assignee) => {
    issueData.issue.assignee = assignee
    return createIssue(issueData, client)
  }))
}

export function createIssue (issueData, client) {
  console.log(`${issueData.issue.title} ... ${issueData.issue.assignee}`)
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
