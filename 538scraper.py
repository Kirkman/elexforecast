import re
from string import Template
import agate
import agateremote
import json
from subprocess32 import call


#########################################################
##
##  FiveThirtyEight Toplines Parser
##  by Josh Renaud
##
##  This scraper grabs data from FiveThirtyEight's
##  2020 Election Forecast
##
#########################################################

text_type = agate.Text()
date_type = agate.Date()
number_type = agate.Number()
boolean_type = agate.Boolean()

# https://gist.github.com/rogerallen/1583593
us_state_abbrev = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District of Columbia': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands':'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY',
    'US': 'US',
}



# the following code patches a weird JSON float conversion quirk. 
# from http://stackoverflow.com/a/1447581/566307
from json import encoder
# encoder.FLOAT_REPR = lambda o: format(o, '.15g')

# Replace with path to your Sports Stats directory
exec_dir = '/sbbs/xtrn/elexforecast/'

statsObject = { 'ELEXFORECAST' : {} }

statsObject['ELEXFORECAST']['us'] = {}
statsObject['ELEXFORECAST']['states'] = []


url_national = 'https://projects.fivethirtyeight.com/2020-general-data/presidential_national_toplines_2020.csv'
url_state = 'https://projects.fivethirtyeight.com/2020-general-data/presidential_state_toplines_2020.csv'


# Force Agate to infer the correct types for the columns we care about.
tester = agate.TypeTester(limit=2, force={
	'cycle': text_type,
	'branch': text_type,
	'model': text_type,
	'modeldate': date_type,
	'candidate_inc': text_type,
	'candidate_chal': text_type,
	'candidate_3rd': text_type,
	'timestamp': text_type,
})

national_table = agate.Table.from_url(url_national, column_types=tester)
national_table = (national_table
	.order_by( 'modeldate', reverse=True )
)


state_table = agate.Table.from_url(url_state, column_types=tester)
# Filter table to only today's rows, and toss out non-states
latest_date = state_table.rows[0]['modeldate']
state_table = (state_table
	.where( lambda row: row['modeldate'] == latest_date)
	.where( lambda row: row['state'] in us_state_abbrev.keys() )
	.order_by( 'state' )
	.order_by( 'modeldate', reverse=True )
)

# PARSE STATE INFORMATION
for state in state_table.rows:
	stateabbr = us_state_abbrev[ state['state'] ]
	if len(stateabbr) == 2:
		thisStateObj = {}
		thisStateObj['abbr'] = stateabbr
		print ('--------------------------------------------')
		print (stateabbr)

		thisStateObj['candidates'] = []
		for cand_type in ['_inc', '_chal', '_3rd']:
			candname = state['candidate'+cand_type]
			winprob = state['winstate'+cand_type]
			if winprob !=  None:
				winprob = round( float(winprob) * 100, 2)
			print (str(candname) + ' | '  + str(winprob))
			thisStateObj['candidates'].append(
				{ 
					'name': candname,
					'winprob': winprob,
				}
			)
		statsObject['ELEXFORECAST']['states'].append( thisStateObj )



# ADD NATIONAL INFORMATION
us = national_table.rows[0]
thisStateObj = {}
thisStateObj['abbr'] = 'US'
print ('--------------------------------------------')
print ('US')

thisStateObj['candidates'] = []
for cand_type in ['_inc', '_chal', '_3rd']:
	candname = us['candidate'+cand_type]
	winprob = us['ecwin'+cand_type]
	if winprob !=  None:
		winprob = round( float(winprob) * 100, 2)
	print (str(candname) + ' | '  + str(winprob))
	thisStateObj['candidates'].append(
		{ 
			'name': candname,
			'winprob': winprob,
		}
	)
statsObject['ELEXFORECAST']['us'] = thisStateObj



# PARSE POLL WIN PROBABILITY HISTORY

# Re-sort it from oldest to newest
national_table = (national_table
	.order_by( 'modeldate', reverse=False )
)

cands = [ national_table.rows[0]['candidate_inc'], national_table.rows[0]['candidate_chal'] ]

statsObject['ELEXFORECAST']['history'] = {}
statsObject['ELEXFORECAST']['history'][ cands[0] ] = []
statsObject['ELEXFORECAST']['history'][ cands[1] ] = []

for d in national_table.rows:
	date = d['modeldate'].strftime('%Y-%m-%d')
	ecwin_inc = d['ecwin_inc']
	if ecwin_inc !=  None:
		ecwin_inc = round( float(ecwin_inc) * 100, 2)
	ecwin_chal = d['ecwin_chal']
	if ecwin_chal !=  None:
		ecwin_chal = round( float(ecwin_chal) * 100, 2)

	statsObject['ELEXFORECAST']['history'][ d['candidate_inc'] ].append(
		[ date, ecwin_inc ]
	)
	statsObject['ELEXFORECAST']['history'][ d['candidate_chal'] ].append(
		[ date, ecwin_chal ]
	)
print(statsObject['ELEXFORECAST']['history'])

# save global stats object into Synchronet-style JSON database
filename = exec_dir + 'elexforecast.json'
f = open(filename,'w')
f.write( json.dumps(statsObject) )
f.close()

# Tell Synchronet to refresh the JSON service
call(['/sbbs/exec/jsexec', '/sbbs/xtrn/elexforecast/json-service-refresh.js'])
