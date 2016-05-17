function postAssignment (client, sprint, cohort, student, assignment, next) {
  const body = Buffer.from(assignment.content, 'base64').toString('utf8')
  const title = body.split('\n')[0]

  client.repo(`${cohort}/${cohort}`)
    .issue({
      title: title,
      body: body,
      assignee: student,
      labels: [`sprint-${sprint}`]
    }, (err, issue) => {
      if (err) {
        return next(new Error(`Couldn't post issue: ${title}`))
      }
      next(null, issue)
    })
}

function postAssignments(client, assignments, students) {
  console.log(`Posting assignments:`)
  return new Promise((resolve, reject) => {
    resolve(3)
  })
}

export default postAssignments
