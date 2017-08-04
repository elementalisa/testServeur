#!/bin/bash





names=`cat /proc/cpuinfo | grep model`
echo - n "$names"