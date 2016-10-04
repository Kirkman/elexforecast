##########################################
#                                        #
#            ELEX FORECAST               #
#            for Synchronet              #
#                                        #
#      author: Kirkman                   #
#       email: josh [] joshrenaud.com    #
#        date: Oct. 3, 2016              #
#                                        #
##########################################



==========================================

INSTALLATION

Copy the ELEXFORECAST directory into your /xtrn/ directory.
THEN...


--------------------
A. Synchronet config
--------------------

1. Launch SCFG
2. Go to External Programs > Online Programs (Doors)
3. Choose an externals section to place ELEXFORECAST into.
4. Hit [enter] on a blank line to create a new item.
5. Change the following settings, leaving the rest as they are:

   Name                       Elex
   Internal Code              ELEX
   Start-up Directory         ../xtrn/elexforecast
   Command Line               ?elexforecast.js


-------------------------
B. JSON config
-------------------------

I highly recommend that you subscribe to the inter-BBS stats
service I'm hosting on my BBS. This service requires the json-client.js
library found in Synchronet v3.16. If you are running an older
version of Synchronet, this door will not work for you.

The included 'server.ini' file is already configured to talk to my server, 
but if you want to double-check:

1. In the Sports Stats directory (ie /xtrn/elexforecast), open 'server.ini'
2. Edit 'server.ini' to have these values:
   host = guardian.synchro.net
   port = 10088
3. Recycle services or restart Synchronet for changes to take effect.




==========================================

MY STORY:

I work at a newspaper and I love exploring the cool election maps
developed by news organizations like the Washington Post and the 
New York Times. But my favorite is FiveThirtyEight's.

I thought it would be a fun challenge to make a retro version 
of their map. Could I find a way to render the map in an 
80x24 ANSI BBS terminal window?

Yes, I did. You can see it in action by visiting my BBS: telnet://guardian.synchro.net.

Use the arrow keys to move around the map and see the presidential 
candidates' chance of winning each state, as calculated by 
FiveThirtyEight.com.

The data used in this BBS door was scraped from FiveThirtyEight. 
I hope they won't mind if a handful of retrocomputing enthusiasts 
see it in ANSI.

--Kirkman

