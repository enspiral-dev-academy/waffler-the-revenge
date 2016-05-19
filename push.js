import getAssignments from './assignments'
import getStudents from './students'
import postAssignments from './postAssignments'

function push (sprint, cohort) {
  if (!process.env['WTR_OAUTH_TOKEN']) {
    console.error('Please set WTR_OAUTH_TOKEN')
    return
  }

  console.log(`Pushing sprint ${sprint} assignments to '${cohort}'...`)

  Promise.all([
    getAssignments(sprint),
    getStudents(cohort)
  ])
    .then(([assignments, students]) => {
      return postAssignments(assignments, students)
    })
    .then(console.log)
    .catch(console.error)
}

export default push
