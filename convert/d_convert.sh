#!/bin/sh
for file in `ls ../clips/devotion/*.ogg`
do
    mkdir -p devotion
    fname=`basename $file | cut -d '.' -f1`
    rm -f devotion/$fname.mp3 devotion/$fname.ogg
    ffmpeg -loglevel panic -i ../clips/devotion/$fname.ogg -acodec libvorbis -ac 1 -ab 48k devotion/$fname.ogg
    ffmpeg -loglevel panic -i ../clips/devotion/$fname.ogg -acodec libmp3lame -ac 1 -ab 48k devotion/$fname.mp3
done
