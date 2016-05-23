import github from 'octonode'

export default function postAssignments (assignments, students, cohort) {
  let queue = assignments
    .map((assignment) => {
      return assign(assignment, students)
    })
    .reduce((a, b) => {
      return a.concat(b)
    }, [])

  console.log(`[ Issues: ${assignments.length} Students: ${students.length} Queue size: ${queue.length} ]`)
  return createIssues(queue, cohort, 2000)
}

function assign (issue, assignees) {
  return assignees.map((assignee) => {
    return Object.assign({}, issue, { assignee: assignee })
  })
}

export function createIssues (queue, cohort, delay) {
  // Requests from a single client, requests which trigger notifications, and large numbers of requests
  // sent concurrently are all subject to abuse rate limiting:
  // https://developer.github.com/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits
  process.stdout.write(`Posting assignments using ${delay / 1000}s delay...`)
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])

  let promises = []
  const id = setInterval(() => {
    let issue = queue.pop()
    if (!issue) {
      clearInterval(id)
      return Promise.all(promises).then(() => { console.log('\nDone.') })
    }
    promises.push(createIssue(client, issue, cohort, cohort))
    process.stdout.write('.')
  }, delay)
}

export function createIssue (client, issue, owner, repo) {
  return new Promise((resolve, reject) => {
    client.repo(`${owner}/${repo}`)
      .issue(issue, (err, response) => {
        if (err) {
          console.error(err)
          return reject(new Error(`Couldn't post issue: ${issue.title}.`))
        }
        return resolve(response)
      })
  })
}
