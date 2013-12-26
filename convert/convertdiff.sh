#!/bin/sh
for file in `ls ../clips/*.ogg`
do
    fname=`basename $file | cut -d '.' -f1`
    if [ ! -f $fname.ogg ]
    then
    ffmpeg -loglevel panic -i ../clips/$fname.ogg -acodec libvorbis -ac 1 -ab 48k $fname.ogg
    fi
    if [ ! -f $fname.mp3 ]
    then
    ffmpeg -loglevel panic -i ../clips/$fname.ogg -acodec libmp3lame -ac 1 -ab 48k $fname.mp3
    fi
done
