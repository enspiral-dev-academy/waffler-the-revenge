import getAssignments from './assignments'
import getStudents from './students'
import postAssignments from './post'

function push ({sprint, cohort, assign}) {
  if (!process.env['WTR_ACCESS_TOKEN']) {
    console.error('Please set WTR_ACCESS_TOKEN')
    return
  }

  console.log('Getting assignments and students...')

  Promise.all([
    getAssignments(sprint),
    getStudents(cohort, assign)
  ])
    .then(([assignments, students]) => {
      return postAssignments(assignments, students, cohort)
    })
    .catch(console.error)
}

export default push
