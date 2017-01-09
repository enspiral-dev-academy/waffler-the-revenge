import minimist from 'minimist'
import push from './push'
import label from './label'

function help () {
  const help = `
      Usage
        $ wtr <action>

      Options
        -a, --assign  Specify individual assignee(s) (can be comma-separated list)
        -b, --branch  Specify source branch
        -c, --cohort  Team name (also org and repo name)
        -e, --except  Specify individuals NOT to assign (can be comma-separated list)
        -s, --sprint  Sprint number

      Examples
        $ wtr push -s 1 -c kauri-2016
        $ wtr push -s 9 -c kotare-2015
        $ wtr push --sprint 4 kereru-2016
        $ wtr push -s 8 --cohort nikau-2016
        $ wtr push -s 1.1 -c tieke-2016
        $ wtr push -s 3 -c nikau-2016 -a richchurcher
        $ wtr push -s 5 -c kotare-2016 -b alternate-curriculum
        $ wtr push -s 2 -c roa-2015 -e richchurcher
        $ wtr label -c kahikatea-2016
  `
  console.log(help)
}

function waffle () {
  const argv = minimist(process.argv, {
    alias: {
      a: 'assign',
      b: 'branch',
      c: 'cohort',
      e: 'except',
      s: 'sprint'

    },
    string: [
      'action',
      'assign',
      'branch',
      'cohort',
      'except',
      'sprint'
    ]
  })

  const action = argv._[2]
  switch (action) {
    case 'push':
      push(argv)
      break

    case 'label':
      label(argv)
      break

    default:
      help()
  }
}

export default waffle
