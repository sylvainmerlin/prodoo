#!/bin/bash

# 
# INCLUDES 
# 

source extras/bash/bash-utils.sh

# 
# VARS
# 


# 
# LOGIC
# 

Stage "Assemble"

Step "Build the docker image"

git submodule init
git submodule update
docker-compose -p ${DEV_PROJECT} -f ${GPS_PROJECT_DIR}/etc/docker/docker-compose.assemble.yml up --build assembler

Check_errors $?

Done