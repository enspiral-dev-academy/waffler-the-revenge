function getTeam (client, cohort) {
  client.org(cohort)
    .teams((err, teams) => {
      if (err) {
        console.log(err.message)
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

function getStudents (client, cohort) {
  console.log(`Getting the students for cohort '${cohort}'...`)
  return new Promise((resolve, reject) => {
    resolve(2)
  })
}

export default getStudents
