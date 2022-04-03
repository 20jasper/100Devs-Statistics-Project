
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




# targeting the three elements td[1], td[2], td[3] of the website to get the data
date = driver.find_elements_by_xpath('//tbody/tr/td[1]')
avg_duration = driver.find_elements_by_xpath('//tbody/tr/td[2]')
avg_ccv = driver.find_elements_by_xpath('//tbody/tr/td[3]')



# create a new variable for each and set them to an empty array
date_list = []
avg_duration_list = []
avg_ccv_list = []

# loop through to add all the data to the specific array 
for num in range(len(date)):
    date_list.append(date[num].text)
    
for num in range(len(avg_duration)):
    avg_duration_list.append(avg_duration[num].text)
    
for num in range(len(avg_ccv)):
    avg_ccv_list.append(avg_ccv[num].text)



# add all the arrays into a dataframe for easy viewing
page_1 = pd.DataFrame({"date": date_list, 
                       "duration_hrs": avg_duration_list,
                       "avg_ccv": avg_ccv_list})

# view the data to check
page_1
