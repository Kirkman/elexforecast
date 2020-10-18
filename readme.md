Elex Forecast 2020
==================

![screenshot](https://raw.githubusercontent.com/Kirkman/elexforecast/master/elexforecast-animation.gif)

### What is this?

Elex Forecast is my attempt to display FiveThirtyEight's Election Forecast data on bulletin board systems in beautiful ANSI. I created this in 2016, and updated it for the 2020 election. [Read the original blog post](http://breakintochat.com/blog/2016/10/04/who-needs-svg-when-youve-got-ansi/)

### WHY?

I can waste a lot of time exploring the cool election maps developed by news organizations like the Washington Post and the New York Times. But my favorite is FiveThirtyEight's. 

In 2016, I thought it would be a fun challenge to make a retro version of their map that would render in an 80x24 ANSI BBS terminal window.

You can see it in action by visiting my BBS: telnet://guardian.synchro.net.

Use the arrow keys to move around the map and see the presidential candidates' chance of winning each state, as calculated by FiveThirtyEight.com. Press [enter] to go from screen to screen.

The final screen shows the "How the forecast has changed" graph.

### Requirements

- [Synchronet](http://www.synchro.net) [BBS software](http://cvs.synchro.net/cgi-bin/viewcvs.cgi/)
- Synchronet's JSON database featured must be enabled.
- You need Python 3 to run the data scraper/parser

### Installation

See the `readme.txt` file.

### Acknowledgments

[The data](https://github.com/fivethirtyeight/data/tree/master/election-forecasts-2020) used in this BBS door comes from the talented team at FiveThirtyEight.
