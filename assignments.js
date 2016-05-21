import github from 'octonode'

export function getAssignments (sprint) {
  console.log('Getting assignments...')
  return getList(sprint)
    .then(splitList)
    .then(sort)
    .then(getFiles)
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

export function splitList (assignments) {
  return new Promise((resolve, reject) => {
    const topics = {
      generic: [],
      numeric: []
    }
    assignments.forEach((assignment) => {
      const parts = assignment.split('/')
      const name = parts.pop()
      topics.path = parts.join('/')
      if (!isNaN(name[0])) {
        topics.numeric.push(name)
      }
      if (name[0] === 'p') {
        topics.generic.push(assignment)
      }
    })
    if (topics.numeric.length === 0) {
      return reject(new Error('No assignments found for that sprint.'))
    }

    return resolve(topics)
  })
}

// In order to be posted in the right order, each issue should be created
// in descending order (1.11 before 1.1), and 'p' assignments last.
export function sort (topics) {
  return topics.numeric
    .map(convertVersions)
    .sort(lexicographicalSort)
    .map((topic) => {
      const prefix = topic.prefix.join('.')
      return `${topics.path}/${prefix}-${topic.name}`
    })
    .concat(topics.generic)
}

function convertVersions (fileName) {
  const parts = fileName.split('-')
  const prefix = parts[0]
    .split('.')
    .map((n) => {
      return parseInt(n, 10)
    })

  return {
    prefix: prefix,
    name: parts.splice(1).join('-')
  }
}

function lexicographicalSort (a, b) {
  let first = a.prefix[0]
  let second = b.prefix[0]

  if (first === second) {
    first = a.prefix[1]
    second = b.prefix[1]
  }
  return first > second ? -1 : first < second ? 1 : 0
}

export function getFiles (assignments) {
  return Promise.all(assignments.map(getFile))
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
