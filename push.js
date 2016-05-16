import github from 'octonode'

function getTeam (client, cohort, cb) {
  client.org(cohort)
    .teams((err, teams) => {
      if (err) {
        console.error(`Couldn't get teams for cohort \`${cohort}\`.`)
        return
      }
      cb(teams.find((t) => {
        return t.slug === cohort
      }))
    })
}

function getTeamMembers (client, team, cb) {
  client.team(team)
    .members((err, members) => {
      if (err) {
        console.error(`Couldn't get members for the cohort team.`)
        return
      }
      cb(members.map((member) => {
        return member.login
      }))
    })
}

function getAssignments (client, sprint, cb) {
  client.repo('dev-academy-programme/curriculum-private')
    .contents('assignments', (err, assignments) => {
      if (err) {
        console.error(`Couldn't get the assignments from the curriculum repo.`)
        return
      }
      if (assignments.length === 0) {
        console.error(`No assignments found for that sprint.`)
        return
      }
      cb(assignments.map((assignment) => {
        return assignment.path
      }))
    })
}

function push (sprint, cohort) {
  if (!process.env['WTR_OAUTH_TOKEN']) {
    console.error('Please set WTR_OAUTH_TOKEN')
    return
  }

  const client = github.client(process.env['WTR_OAUTH_TOKEN']);

  getTeam(client, cohort, (team) => {
    if (!team) {
      console.error(`Can't find a team named \`${cohort}\` on org \`${cohort}\`.`)
      return
    }
    getTeamMembers(client, team.id, (members) => {
      getAssignments(client, sprint, (assignments) => {
      })
    })
  })
  console.log(`Pushing sprint ${sprint} assignments to \`${cohort}\`...`)
}

export default push
