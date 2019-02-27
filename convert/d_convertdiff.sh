#!/bin/sh
for file in `ls ../clips/devotion/*.ogg`
do
    mkdir -p devotion
    fname=`basename $file | cut -d '.' -f1`
    if [ ! -f devotion/$fname.ogg ]
    then
    ffmpeg -loglevel panic -i ../clips/devotion/$fname.ogg -acodec libvorbis -ac 1 -ab 48k devotion/$fname.ogg
    fi
    if [ ! -f devotion/$fname.mp3 ]
    then
    ffmpeg -loglevel panic -i ../clips/devotion/$fname.ogg -acodec libmp3lame -ac 1 -ab 48k devotion/$fname.mp3
    fi
done
