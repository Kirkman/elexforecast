Elex Forecast 2020
==================

![screenshot](https://raw.githubusercontent.com/Kirkman/elexforecast/master/elexforecast-animation.gif)

### What is this?

Elex Forecast is my attempt to display FiveThirtyEight's Election Forecast data on bulletin board systems in beautiful ANSI. I created this in 2016, and updated it for the 2020 election. [Read the original blog post](http://breakintochat.com/blog/2016/10/04/who-needs-svg-when-youve-got-ansi/)

### WHY?

I can waste a lot of time exploring the cool election maps developed by news organizations like the Washington Post and the New York Times. But my favorite is FiveThirtyEight's. 

In 2016, I thought it would be a fun challenge to make a retro version of their map that would render in an 80x24 ANSI BBS terminal window.

### Want to try it?

See it in action by visiting my BBS: telnet://guardian.synchro.net. You'll want to do this from a terminal. The MacOS terminal will work, but [SyncTerm](https://syncterm.bbsdev.net/) will give an authentic 1990s BBSing experience.

Connect to my BBS, then follow the menus to create an account. 

Once you're at the main menu, the following sequence will launch Election Forecast:

* Press [X] for "External Programs" 
* Press [2] for the "Information" category
* Press [3] to launch "Election Forecast 2020"

Once Election Forecast opens, press [enter] to go from screen to screen. On the map screen, use the arrow keys to move from state to state and see the presidential candidates' chance of winning each state, as calculated by FiveThirtyEight.com. 

The final screen shows the "How the forecast has changed" graph.

When you're finished, feel free to explore the rest of the BBS. Whenever you're ready to log off, hit [Q] as many times as necessary to quit any submenus and return to the main menu. From the main menu, press [O] to Log Off.

### Requirements

- [Synchronet](http://www.synchro.net) [BBS software](http://cvs.synchro.net/cgi-bin/viewcvs.cgi/)
- Synchronet's JSON database featured must be enabled.
- You need Python 3 to run the data scraper/parser

### Installation

See the `readme.txt` file.

### Acknowledgments

[The data](https://github.com/fivethirtyeight/data/tree/master/election-forecasts-2020) used in this BBS door comes from the talented team at FiveThirtyEight.
