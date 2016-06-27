import github from 'octonode'

function label ({cohort}) {
  if (!process.env['WTR_ACCESS_TOKEN']) {
    console.error('Please set WTR_ACCESS_TOKEN')
    return
  }

  process.stdout.write('Creating labels...')

  createLabels(cohort)
    .then(() => {
      process.stdout.write('done.\n')
    })
    .catch(console.error)
}

// Brute-force reimplementation using octonode
function createLabels (cohort) {
  const labels = {
    'sprint-1': 'ffb366',
    'sprint-2': 'ffd966',
    'sprint-3': 'ffff66',
    'sprint-4': 'd9ff66',
    'sprint-5': '8cff66',
    'sprint-6': '66ff8c',
    'sprint-7': '66ffd9',
    'sprint-8': '66d9ff',
    'sprint-9': '668cff',
    'submitted': '0052cc',
    'reviewed': 'd4c5f9'
  }
  const repo = github
    .client(process.env['WTR_ACCESS_TOKEN'])
    .repo(`${cohort}/${cohort}`)
  let promises = []
  for (var label in labels) {
    var p = createLabel(repo, label, labels[label])
    promises.push(p)
    process.stdout.write('.')
  }
  return Promise.all(promises)
}

function createLabel (repo, name, colour) {
  return repo
    .label({
      name: name,
      color: colour
    }, (err, response) => {
      if (err) {
        return Promise.reject(err)
      }
      return Promise.resolve(response)
    })
}

export default label
