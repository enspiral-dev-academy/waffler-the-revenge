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

function getAssignmentFile (client, assignment, next) {
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

function getAssignmentFiles (client, assignments) {
  return Promise.resolve(assignments)
  //return Promise.all([
  //])
}

function getAssignmentList (client, sprint) {
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

function getAssignments (client, sprint) {
  console.log(`Getting assignment list for sprint ${1}...`)
  return new Promise((resolve, reject) => {
    return getAssignmentList(client, sprint)
  })
    .then((assignments) => {
      return getAssignmentFiles(client, assignments)      
    })
    .then(sortAndProcess)
}

export default getAssignments
