import github from 'octonode'

export function getStudents (cohort) {
  console.log('Getting students...')
  return getTeam
    .then(console.log)
}

export function getTeam (cohort) {
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])

  return new Promise((resolve, reject) => {
    client.org(cohort)
      .teams((err, teams) => {
        if (err) {
          return reject(new Error("Can't get teams for that org."))
        }
        const team = teams.find((t) => {
          return t.slug === cohort
        })
        if (!team) {
          return reject(new Error(`Can't find team for '${cohort}' on org '${cohort}'.`))
        }

        return resolve(team)
      })
  })
}

//function getTeamMembers (client, team, next) {
//console.log(`Getting the students for cohort with team id ${team}...`)
//client.team(team)
//.members((err, members) => {
//if (err) {
//return next(new Error(`Couldn't get members for the cohort team.`))
//}
//next(null, members.map((member) => {
//return member.login
//}))
//})
//}

