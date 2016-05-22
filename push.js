import getAssignments from './assignments'
import getStudents from './students'
import postAssignments from './post'

function push (sprint, cohort) {
  if (!process.env['WTR_ACCESS_TOKEN']) {
    console.error('Please set WTR_ACCESS_TOKEN')
    return
  }

  console.log(`Pushing sprint ${sprint} assignments to '${cohort}'...`)

  Promise.all([
    getAssignments(sprint),
    getStudents(cohort)
  ])
    .then(([assignments, students]) => {
      return postAssignments(assignments, students, cohort)
    })
    .then(() => {
      console.log('Done.')
    })
    .catch(console.error)
}

export default push
