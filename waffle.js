#!/usr/bin/env node

import minimist from 'minimist'

function waffle() {
  const argv = minimist(process.argv)
  const action = argv._[2]
  const token = process.env['WTR_OAUTH_TOKEN']
  const help = `
      Usage
        $ wtr <action>

      Options
        -s, --sprint  Sprint number
        -c, --cohort  Cohort name (also org and repo name)

      Examples
        $ wtr push -s 1 -c kauri-2016
        $ wtr push -s 9 -c kotare-2015
        $ wtr push --sprint 4 kereru-2016
        $ wtr push -s 8 --cohort nikau-2016
  `
  console.log(help)
}

export default waffle
