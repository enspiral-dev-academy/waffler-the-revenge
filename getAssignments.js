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
  const client = github.client(process.env['WTR_OAUTH_TOKEN']);

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
  return Promise.resolve(assignments)
  //return Promise.all([
  //])
}

// Take an array of assignment.path and check to be sure it isn't all just
// 'p' assignments, which are generic to all sprints
function checkAssignments (assignments) {
  return new Promise((resolve, reject) => {
    const numericOnly = assignments.reject((path) => {
      const name = path.split('/').pop()
      return isNaN(parseInt(name[0]))
    })

    if (numericOnly.length === 0) {
      return reject(new Error(`Couldn't find any assignments for that sprint.`))
    }
    return resolve (assignments)
  })
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
          return reject(new Error(`No assignments found in that repo.`))
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
    .then(checkAssignments)
    .then(getAssignmentFiles)
    .then(sortAndProcess)
}

export default getAssignments
