#!/bin/sh
# check if git exists
gitBin=`which git`
if [ ! -f $gitBin ];
then
    echo "git not found";
    exit 1;
else
    echo "git found"
fi
# check if ffmpeg eixsts
ffmpegBin=`which ffmpeg &>/dev/null`
if [ -f $ffmpegBin ];
then
    echo "ffmpeg not found";
    exit 2;
else
    echo "ffmpeg found"
fi
# get howler.js via submodule
echo "getting howler.js..."
$gitBin submodule init
$gitBin submodule update
# convert file
echo "convert audio files..."
cd convert
./convert.sh
echo "it's ready to use :)"
