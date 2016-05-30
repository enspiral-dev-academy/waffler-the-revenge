import minimist from 'minimist'
import push from './push'

function help () {
  const help = `
      Usage
        $ wtr <action>

      Options
        -s, --sprint  Sprint number
        -c, --cohort  Team name (also org and repo name)
        -a, --assign  Specify individual assignee

      Examples
        $ wtr push -s 1 -c kauri-2016
        $ wtr push -s 9 -c kotare-2015
        $ wtr push --sprint 4 kereru-2016
        $ wtr push -s 8 --cohort nikau-2016
        $ wtr push -s 1.1 -c tieke-2016
        $ wtr push -s 3 -c nikau-2016 -a richchurcher
  `
  console.log(help)
}

function waffle () {
  const argv = minimist(process.argv, {
    alias: {
      a: 'assign',
      c: 'cohort',
      s: 'sprint'
    },
    string: [
      'action',
      'assign',
      'cohort',
      'sprint'
    ]
  })

  const action = argv._[2]
  switch (action) {
    case 'push':
      push(argv)
      break

    default:
      help()
  }
}

export default waffle
