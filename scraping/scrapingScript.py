
# import all the necessary libraries
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
import pandas as pd


# couldn't find the ChromeDriver on my machine...
#driver = webdriver.Chrome('chromedriver.exe')

# so I installed it everytime I run the script (need to change this)
driver = webdriver.Chrome(ChromeDriverManager().install())


# this will open a new tab and target the website
driver.get('https://twitchtracker.com/learnwithleon/streams')



# initialize lists for all the data
# this is where all of the data will be located
date_list = []
avg_duration_list = []
avg_ccv_list = []
max_ccv_list = []
followers_list = []
title_list = []


# range must be modified for increasing number of pages in pagination... currently 8
for pages in range(1, 8): 
    
    # select the page number you want to collect data from
    next_page = driver.find_element_by_xpath(f"//div[@id='streams_wrapper']/div/ul/li[{pages}]/a")
    
    # if targeted corretly, click the pagination number
    next_page.click()

    # this is targeting the specific td (data spots) on the page
    date = driver.find_elements_by_xpath('//tbody/tr/td[1]')
    avg_duration = driver.find_elements_by_xpath('//tbody/tr/td[2]')
    avg_ccv = driver.find_elements_by_xpath('//tbody/tr/td[3]')
    max_ccv = driver.find_elements_by_xpath('//tbody/tr/td[4]')
    followers = driver.find_elements_by_xpath('//tbody/tr/td[5]')
    title = driver.find_elements_by_xpath('//tbody/tr/td[7]')


    # loop through all the data and add to the array 
    for num in range(len(date)):
        date_list.append(date[num].text)
    
    for num in range(len(avg_duration)):
        avg_duration_list.append(avg_duration[num].text)

    for num in range(len(avg_ccv)):
        avg_ccv_list.append(avg_ccv[num].text)

    for num in range(len(max_ccv)):
        max_ccv_list.append(max_ccv[num].text)

    for num in range(len(followers)):
        followers_list.append(followers[num].text)

    for num in range(len(title)):
        title_list.append(title[num].text)  




# add all the arrays into a dataframe for easy viewing
ALL_PAGES = pd.DataFrame({"date": date_list, 
                       "duration_hrs": avg_duration_list,
                       "avg_ccv": avg_ccv_list, 
                       "max_ccv": max_ccv_list,
                       "followers": followers_list,
                       "title": title_list})
# strip the hrs and commas
for view in range(len(ALL_PAGES)):
    ALL_PAGES['duration_hrs'][view] = float(ALL_PAGES['duration_hrs'][view].replace(" hrs",""))
    ALL_PAGES['avg_ccv'][view] = int(ALL_PAGES['avg_ccv'][view].replace(",",""))
    ALL_PAGES['max_ccv'][view] = int(ALL_PAGES['max_ccv'][view].replace(",",""))
    ALL_PAGES['followers'][view] = int(ALL_PAGES['followers'][view].replace(",",""))
    
    


# view the data
#ALL_PAGES
print(ALL_PAGES)




# convert to json format
# must CHANGE <path> 
import json
ALL_PAGES_json = ALL_PAGES.to_json(r'{ <path> }/scraping/exported_data.json', orient="records")


# view the json data
ALL_PAGES_json
parsed = json.loads(ALL_PAGES_json)
json.dumps(parsed)
