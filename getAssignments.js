import github from 'octonode'

function matchSprint (sprint, assignment) {
  if (assignment.split('-')[0] === 'p') {
    return true
  }
  const prefix = assignment.split('.')[0]
  const n = parseInt(prefix, 10)
  if (isNaN(n)) {
    return false
  }
  return sprint === n
}

function getAssignmentFile (assignment, next) {
  return new Promise((resolve, reject) => {
    client.repo('dev-academy-programme/curriculum-private')
      .contents(`${assignment}/README.md`, (err, file) => {
        if (err) {
          return reject(new Error(`Couldn't get assignment content for ${assignment}`))
        }
        return resolve(file)
      })
  })
}

function getAssignmentFiles (assignments) {
  const client = github.client(process.env['WTR_OAUTH_TOKEN']);
  return Promise.resolve(assignments)
  //return Promise.all([
  //])
}

function getAssignmentList (sprint) {
  const client = github.client(process.env['WTR_OAUTH_TOKEN']);

  return new Promise((resolve, reject) => {
    client.repo('dev-academy-programme/curriculum-private')
      .contents('assignments', (err, assignments) => {
        if (err) {
          return reject(new Error(`Couldn't get the assignments from the curriculum repo.`))
        }
        if (assignments.length === 0) {
          return reject(new Error(`No assignments found for that sprint.`))
        }

        const sprintAssignments = assignments
          .filter((assignment) => {
            return matchSprint(sprint, assignment.name)
          })
          .map((assignment) => {
            return assignment.path
          })

        return resolve(sprintAssignments)
      })
  })
}

function sortAndProcess (assignments) {
  return assignments
}

function getAssignments (sprint) {
  console.log(`Getting assignments...`)
  return getAssignmentList(sprint)
    .then(getAssignmentFiles)
    .then(sortAndProcess)
}

export default getAssignments
