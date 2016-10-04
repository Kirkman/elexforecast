import re
from string import Template
from bs4 import BeautifulSoup
import urllib2
import requests
import json
from subprocess32 import call


#########################################################
##
##  FiveThirtyEight Scraper
##  by Josh Renaud
##
##  This scraper grabs data from FiveThirtyEight's
##  2016 Election Forecast 'Who will win the Presidency?'
##
#########################################################


# the following code patches a weird JSON float conversion quirk. 
# from http://stackoverflow.com/a/1447581/566307
from json import encoder
encoder.FLOAT_REPR = lambda o: format(o, '.15g')

# Replace with path to your Sports Stats directory
exec_dir = '/sbbs/xtrn/elexforecast/'

statsObject = { 'ELEXFORECAST' : {} }

statsObject['ELEXFORECAST']['us'] = {}
statsObject['ELEXFORECAST']['states'] = []


url = 'http://projects.fivethirtyeight.com/2016-election-forecast'

response = requests.get(url)
soup = BeautifulSoup( response.text, 'lxml' )



states = soup.findAll( 'div', { 'class': 'cardset' })
for state in states:
	stateabbr = state['data-set']
	if len(stateabbr) == 2:
		thisStateObj = {}
		thisStateObj['abbr'] = stateabbr
		print '--------------------------------------------'
		print stateabbr
		electoral = state.find('p', { 'class' : 'top-powerbar' }).text
		elecMatch = re.search(r'(\d+) (statewide|electoral)', electoral)
		if elecMatch:
			electoral = elecMatch.group(1)
			print stateabbr + ' | ' + electoral + ' electoral votes'
			thisStateObj['votes'] = electoral

		cands = state.findAll('div', { 'class' : 'candidate' })
		thisStateObj['candidates'] = []
		for cand in cands:
			candname = cand.find('p', { 'class' : 'label-head' }).text
			winprob = cand.find('p', { 'class' : 'winprob' })
			candparty = winprob['data-party']
			winprob = winprob.text
			winprob = winprob.replace('%', '').replace('>', '').replace('<', '')
			winprob = float( winprob );
			print str(candname) + ' | ' + str(candparty) + ' | ' + str(winprob)
			thisStateObj['candidates'].append(
				{ 
					'name': candname,
					'party': candparty,
					'winprob': winprob,
				}
			)
		if stateabbr == 'US':
			statsObject['ELEXFORECAST']['us'] = thisStateObj
		else:
			statsObject['ELEXFORECAST']['states'].append( thisStateObj )

print statsObject

# save global stats object into Synchronet-style JSON database
filename = exec_dir + 'elexforecast.json'
f = open(filename,'wb')
f.write( json.dumps(statsObject) )
f.close()

# Tell Synchronet to refresh the JSON service
call(['/sbbs/exec/jsexec', '/sbbs/xtrn/elexforecast/json-service-refresh.js'])
