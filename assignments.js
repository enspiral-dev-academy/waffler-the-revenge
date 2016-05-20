import github from 'octonode'

export function get (sprint) {
  console.log('Getting assignments...')
  return getList(sprint)
    .then(checkList)
    .then(getFiles)
    .then(sortAndProcess)
}

export function getList (sprint) {
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])

  return new Promise((resolve, reject) => {
    client.repo('dev-academy-programme/curriculum-private')
      .contents('assignments', (err, assignments) => {
        if (err) {
          return reject(new Error("Couldn't get the assignments from the curriculum repo."))
        }
        if (assignments.length === 0) {
          return reject(new Error('No assignments found in that repo.'))
        }
        return resolve(sprintPaths(assignments, sprint))
      })
  })
}

// Take an array of assignment.path and check to be sure it isn't all just
// 'p' assignments, which are generic to all sprints
export function checkList (assignments) {
  return new Promise((resolve, reject) => {
    const numericOnly = assignments.filter((path) => {
      const name = path.split('/').pop()
      return !isNaN(parseInt(name[0]))
    })

    if (numericOnly.length === 0) {
      return reject(new Error('No assignments for that sprint.'))
    }
    return resolve(assignments)
  })
}

export function getFiles (assignments) {
  return Promise.all(assignments.map(getFile))
}

// In order to be posted in the right order, each issue should be created
// in reverse order (1.9 before 1.0), and 'p' assignments last.
export function sortAndProcess (files) {
  const [generic, numeric] = splitByType(files)
  return numeric
    .map(convertVersions)
    .sort(lexicographicalSort)
    .map((file) => {
      return file.join('.')
    })
}

function splitByType (files) {
  let generic = []
  let numeric = []
  files.forEach((file) => {
    if (file[0] === 'p') {
      generic.push(file)
    }
    numeric.push(file)
  })
  return [generic, numeric]
}

function convertVersions (file) {
  return file
    .split('.')
    .map((s) => {
      const n = parseInt(s, 10)
      if (isNaN(n)) {
        return s
      }
      return n
    })
}

function lexicographicalSort (a, b) {
  let first = a[0]
  let second = b[0]

  if (first === second) {
    first = a[1]
    second = b[1]
  }
  console.log(`FIRST: ${first} SECOND: ${second}`, first < second ? -1 : first > second ? 1 : 0)
  return first < second ? -1 : first > second ? 1 : 0
}

function getFile (assignment) {
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])

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

function sprintPaths (assignments, sprint) {
  return assignments
    .filter((assignment) => {
      return matchSprint(sprint, assignment.name)
    })
    .map((assignment) => {
      return assignment.path
    })
}
