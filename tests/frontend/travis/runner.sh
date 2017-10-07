#!/bin/sh

#Move to the base folder
cd `dirname $0`

#start Etherpad
../../../bin/run.sh > /tmp/epl-run.log

#start remote runner
node remote_runner.js

exit $?
