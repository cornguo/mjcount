#!/bin/sh
for dir in `ls ../clips`
do
    for file in `ls ../clips/$dir/*.ogg`
    do
        mkdir -p $dir
        fname=`basename $file | cut -d '.' -f1`
        rm -f $dir/$fname.mp3 $dir/$fname.ogg
        ffmpeg -loglevel panic -i ../clips/$dir/$fname.ogg -acodec libvorbis -ac 1 -ab 48k $dir/$fname.ogg
        ffmpeg -loglevel panic -i ../clips/$dir/$fname.ogg -acodec libmp3lame -ac 1 -ab 48k $dir/$fname.mp3
    done
done
