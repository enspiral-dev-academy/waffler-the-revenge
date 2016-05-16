import github from 'octonode'

function getTeam (client, cohort, next) {
  console.log(`Checking for a \`${cohort}\` cohort...`)
  client.org(cohort)
    .teams((err, teams) => {
      if (err) {
        return next(new Error(`Couldn't get teams for cohort ${cohort}.`))
      }
      const team = teams.find((t) => {
        return t.slug === cohort
      })
      if (!team) {
        return next(new Error(`Can't find team '${cohort}' on org '${cohort}'.`))
      }
      next(null, team)
    })
}

function getTeamMembers (client, team, next) {
  console.log(`Getting the students for cohort with team id ${team}...`)
  client.team(team)
    .members((err, members) => {
      if (err) {
        return next(new Error(`Couldn't get members for the cohort team.`))
      }
      next(null, members.map((member) => {
        return member.login
      }))
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

function getAssignments (client, sprint, next) {
  console.log(`Getting assignment list for sprint ${1}...`)
  client.repo('dev-academy-programme/curriculum-private')
    .contents('assignments', (err, assignments) => {
      if (err) {
        return next(new Error(`Couldn't get the assignments from the curriculum repo.`))
      }
      if (assignments.length === 0) {
        return next(new Error(`No assignments found for that sprint.`))
      }
      next(null, assignments
        .filter((assignment) => {
          return matchSprint(sprint, assignment.name)
        })
        .map((assignment) => {
          return assignment.path
        }))
    })
}

function getAssignmentFile (client, assignment, next) {
  client.repo('dev-academy-programme/curriculum-private')
    .contents(`${assignment}/README.md`, (err, file) => {
      if (err) {
        return next(new Error(`Couldn't get assignment content for ${assignment}`))
      }
      next(null, file)
    })
}

function postAssignment (client, sprint, cohort, student, assignment, next) {
  const body = Buffer.from(assignment.content, 'base64').toString('utf8')
  const title = body.split('\n')[0]

  client.repo(`${cohort}/${cohort}`)
    .issue({
      title: title,
      body: body,
      assigneee: student,
      labels: [`sprint-${sprint}`]
    }, (err, issue) => {
      if (err) {
        return next(new Error(`Couldn't post issue: ${title}`))
      }
      next(null, issue)
    })
}

function push (sprint, cohort) {
  if (!process.env['WTR_OAUTH_TOKEN']) {
    console.error('Please set WTR_OAUTH_TOKEN')
    return
  }

  const client = github.client(process.env['WTR_OAUTH_TOKEN']);

  getTeam(client, cohort, (err, team) => {
    if (err) {
      console.error(err.message)
      return
    }

    getTeamMembers(client, team.id, (err, members) => {
      if (err) {
        console.error(err.message)
        return
      }
      getAssignments(client, sprint, (err, assignments) => {
        if (err) {
          console.error(err.message)
          return
        }
        assignments.forEach((assignment) => {
          getAssignmentFile(client, assignment, (err, file) => {
            if (err) {
              console.error(err.message)
              return
            }
            members.forEach((member) => {
              postAssignment(client, sprint, cohort, member, file, (err, result) => {
                if (err) {
                  console.error(err.message)
                  return
                }
                return
              })
              console.log(`Assignments pushed for ${member}.`)
            })
          })
        })
      })
    })
  })
  console.log(`Pushing sprint ${sprint} assignments to '${cohort}'...`)
}

export default push
