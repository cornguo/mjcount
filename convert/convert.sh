#!/bin/sh
rm -f *.mp3 *.ogg
for file in `ls ../clips/*.ogg`
do
    fname=`basename $file | cut -d '.' -f1`
    ffmpeg -loglevel panic -i ../clips/$fname.ogg -acodec libvorbis -ac 1 -ab 32k $fname.ogg
    ffmpeg -loglevel panic -i ../clips/$fname.ogg -acodec libmp3lame -ac 1 -ab 32k $fname.mp3
done
