import github from 'octonode'

function getTeam (client, cohort, cb) {
  client.org(cohort)
    .teams((err, teams) => {
      if (err) {
        console.error(err)
        return
      }
      cb(teams.find((t) => {
        return t.slug === cohort
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
    console.log(team)
  })
  console.log(`Pushing sprint ${sprint} assignments to \`${cohort}\`...`)
}

export default push
