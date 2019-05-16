#!/bin/sh
for dir in `ls ../clips`
do
    for file in `ls ../clips/$dir/*.ogg`
    do
        mkdir -p $dir
        fname=`basename $file | cut -d '.' -f1`
        if [ ! -f $dir/$fname.ogg ]
        then
        ffmpeg -loglevel panic -i ../clips/$dir/$fname.ogg -acodec libvorbis -ac 1 -ab 48k $dir/$fname.ogg
        fi
        if [ ! -f $dir/$fname.mp3 ]
        then
        ffmpeg -loglevel panic -i ../clips/$dir/$fname.ogg -acodec libmp3lame -ac 1 -ab 48k $dir/$fname.mp3
        fi
    done
done
