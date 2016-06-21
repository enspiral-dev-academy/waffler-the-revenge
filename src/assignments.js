import * as grr from 'github-readme-retriever'

export default function getAssignments (sprint, branch) {
  return getList(sprint, branch)
    .then(checkList)
    .then(getFiles)
    .then((files) => {
      return makeIssues(files, sprint)
    })
    .then(sort)
}

export function getList (sprint, branch) {
  const config = {
    owner: 'dev-academy-programme',
    repo: 'curriculum-private',
    path: 'assignments',
    branch: branch
  }
  return grr.getList(config, process.env['WTR_ACCESS_TOKEN'])
    .then((assignments) => {
      const paths = sprintPaths(assignments, sprint)
      return Object.assign(assignments, { paths: paths })
    })
}

export function checkList (assignments) {
  if (assignments.paths.find(isNumeric)) {
    return assignments
  }
  return Promise.reject(new Error('No assignments found for that sprint.'))
}

function isNumeric (assignment) {
  const name = assignment.split('/').pop()
  return !isNaN(name[0])
}

export function getFiles (assignments) {
  return grr.getFiles(assignments, process.env['WTR_ACCESS_TOKEN'])
    .then((files) => {
      return files
    })
}

export function makeIssues (assignments, sprint) {
  return assignments.map((assignment) => {
    return Object.assign({ labels: [ `sprint-${Math.floor(sprint)}` ] }, assignment)
  })
}

export function sort (issues) {
  return issues
    .map(convertVersions)
    .sort(lexicographicalSort)
    .map(cleanup)
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

function matchSingle (sprint, assignment) {
  const name = assignment.split('/').pop()
  return name.split('-')[0] === sprint
}

function matchSprint (sprint, assignment) {
  const name = assignment.split('/').pop()
  if (name.split('-')[0] === 'p') {
    return true
  }
  const prefix = name.split('.')[0]
  const n = parseInt(prefix, 10)
  if (isNaN(n)) {
    return false
  }
  return sprint === prefix
}

function sprintPaths (assignments, sprint) {
  if (sprint.toString().match(/^[\d]+\.[\d]+$/)) {
    const match = assignments.paths.find((path) => {
      return matchSingle(sprint, path)
    })
    if (match) {
      return [ match ]
    }
    return Promise.reject(new Error('No match for that asssignment'))
  }

  return assignments.paths
    .filter((path) => {
      return matchSprint(sprint, path)
    })
}
