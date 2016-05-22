import github from 'octonode'

export default function getAssignments (sprint) {
  console.log('Getting assignments...')
  return getList(sprint)
    .then(checkList)
    .then(getFiles)
    .then((files) => {
      return makeIssues(files, sprint)
    })
    .then(sort)
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

export function checkList (assignments) {
  if (assignments.find(isNumeric)) {
    return Promise.resolve(assignments)
  }
  return Promise.reject(new Error('No assignments found for that sprint.'))
}

function isNumeric (assignment) {
  const name = assignment.split('/').pop()
  return !isNaN(name[0])
}

export function sort (issues) {
  return issues
    .map(convertVersions)
    .sort(lexicographicalSort)
    .map(cleanup)
}

export function getFiles (assignments) {
  return Promise.all(assignments.map(getFile))
}

export function makeIssues (assignments, sprint) {
  return assignments.map((assignment) => {
    const body = Buffer.from(assignment.content, 'base64').toString()
    let title = body.split('\n')[0]
    title = title.replace(/[\W]*/, '').trim()
    return {
      title: title,
      body: body,
      labels: [ `sprint-${sprint}` ]
    }
  })
}

function convertVersions (issue) {
  const parts = /([\d]+.[\d]+)(.*)/.exec(issue.title)
  const prefix = parts[1]
    .split('.')
    .map((n) => {
      return parseInt(n, 10)
    })

  return {
    issue: issue,
    titlePrefix: prefix,
    titleBody: parts[2]
  }
}

function lexicographicalSort (a, b) {
  let first = a.titlePrefix[0]
  let second = b.titlePrefix[0]

  if (first === second) {
    first = a.titlePrefix[1]
    second = b.titlePrefix[1]
  }
  return first < second ? -1 : first > second ? 1 : 0
}

function cleanup (sortObject) {
  return sortObject.issue
}

function getFile (assignment) {
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])

  return new Promise((resolve, reject) => {
    client.repo('dev-academy-programme/curriculum-private')
      .contents(`${assignment}/README.md`, (err, file) => {
        if (err) {
          console.log(err)
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
