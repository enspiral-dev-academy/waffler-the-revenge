import github from 'octonode'

import getAssignments from './getAssignments'
import getStudents from './getStudents'
import postAssignments from './postAssignments'

function push (sprint, cohort) {
  if (!process.env['WTR_OAUTH_TOKEN']) {
    console.error('Please set WTR_OAUTH_TOKEN')
    return
  }

  const client = github.client(process.env['WTR_OAUTH_TOKEN']);

  console.log(`Pushing sprint ${sprint} assignments to '${cohort}'...`)

  Promise.all([
    getAssignments(client, sprint),
    getStudents(client, cohort)
  ])
    .then(([assignments, students]) => {
      return postAssignments(client, assignments, students) 
    })
    .then((result) => {
      console.log(result)
    })
    .catch((err) => {
      console.error(err)
    })
}

export default push
