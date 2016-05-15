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

function isStudent (client, team, username) {
  return new Promise((resolve, reject) => {
    client.team(team)
      .getMembership(username, (err, status) => {
        if (err) {
          console.error(`Couldn't check user \`${username}\`'s role in the team.`)
          return reject()
        }
        return resolve(status)
      })
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
      //members = members.filter((member) => {
        //return isStudent(member)
      //})
      members.forEach((member) => {
        Promise.all(isStudent(client, team.id, member))
          .then((filtered) => {
            console.log(filtered)
          }
      })
    })
  })
  console.log(`Pushing sprint ${sprint} assignments to \`${cohort}\`...`)
}

export default push
