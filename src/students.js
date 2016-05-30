import github from 'octonode'

export default function getStudents (cohort, assign) {
  return getTeam(cohort)
    .then((team) => {
      return getTeamMembers(team, assign)
    })
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

export function getTeamMembers (team, assign) {
  const client = github.client(process.env['WTR_ACCESS_TOKEN'])

  return new Promise((resolve, reject) => {
    client.team(team.id)
      .members((err, members) => {
        if (err) {
          return reject(new Error("Couldn't get members for the cohort team."))
        }
        if (members.length === 0) {
          return reject(new Error('No students on that team.'))
        }

        const logins = members.map((member) => {
          return member.login
        })

        if (assign) {
          return resolve(logins.filter((login) => {
            return assign.includes(login)
          }))
        }
        return resolve(logins)
      })
  })
}
