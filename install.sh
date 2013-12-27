#!/bin/sh
# check if git exists
gitBin=`which git &>/dev/null`
[ ! -z $gitBin ] || { echo "git not found"; exit 1; }
echo "git found"
# check if ffmpeg eixsts
ffmpegBin=`which ffmpeg &>/dev/null`
[ ! -z $ffmpegBin ] || { echo "ffmpeg not found"; exit 2; }
echo "ffmpeg found"
# get howler.js via submodule
echo "getting howler.js..."
$gitBin submodule init
$gitBin submodule update
# convert file
echo "convert audio files..."
cd convert
./convert.sh
echo "it's ready to use :)"
