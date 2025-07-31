from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import pandas as pd

# Step 1: Connect to manually launched Chrome
chrome_options = Options()
chrome_options.debugger_address = "127.0.0.1:9222"
driver = webdriver.Chrome(options=chrome_options)
wait = WebDriverWait(driver, 20)

print("✅ Connected to manually opened Chrome tab")

# Step 2: Wait for college dropdown to appear after your click
try:
    college_element = wait.until(
        EC.presence_of_element_located((By.ID, "MainContent_DropDownList1"))
    )
    print("✅ College dropdown is available")
except:
    driver.save_screenshot("dropdown_failed.png")
    print("❌ College dropdown not found")
    driver.quit()
    exit()

# Step 3: Select college
college_dropdown = Select(college_element).select_by_index(0)

# Step 4: Wait for branch dropdown to populate
time.sleep(3)
branch_element = driver.find_element(By.ID, "MainContent_DropDownList2")
branch_dropdown = Select(branch_element).select_by_value("CSE")

College_Name = driver.find_element(By.XPATH, "/html/body/form/div[3]/div/table/tbody/tr[3]/td[2]/select/option[1]").text.strip()
Branch_Name = driver.find_element(By.XPATH, "/html/body/form/div[3]/div/table/tbody/tr[4]/td[2]/select/option[3]").text.strip()

print(College_Name)
print(Branch_Name)

# print("🎓 Selected College:", college_dropdown.first_selected_option.text.strip())
# print("📚 Selected Branch :", branch_dropdown.first_selected_option.text.strip())

# Step 5: Click "Show Allotments"
driver.find_element(By.ID, "MainContent_btn_allot").click()

# Step 6: Screenshot the result
time.sleep(5)
driver.save_screenshot("mock_allotment_result.png")
print("✅ Allotment screenshot saved!")


table = driver.find_element(By.XPATH, "/html/body/form/div[3]/div/table/tbody/tr[6]/td/span/table[2]")
rows = table.find_elements(By.TAG_NAME, "tr")
print(table.text)
print(rows[0].text)  # Print header row
# print(rows[1])
# print(rows[1].find_elements(By.TAG_NAME, "td"))
cols = rows[1].find_elements(By.TAG_NAME, "td")
print(cols[0].text.strip())  # Print first column of the second row
print(cols[1].text.strip())  # Print second column of the second row
print(cols[2].text.strip())  # Print third column of the second row
print(cols[3].text.strip())  # Print fourth column of the second row
print(cols[4].text.strip())  # Print fifth column of the second row
print(cols[6].text.strip())  # Print seventh column of the second row
print(cols[7].text.strip())  # Print eighth column of the second row
# print(cols[8].text.strip())  # Print ninth column of the second row

MAX_RANK = MIN_RANK = 0

MAX_FILTERED_DATA = []
MIN_FILTERED_DATA = []

for row in rows[1:]:
    cols = row.find_elements(By.TAG_NAME, "td")
    
    if cols[5].text.strip() == "BC_D":
        if MIN_RANK == 0 or float(cols[2].text.strip()) < MIN_RANK:
            MIN_RANK = float(cols[2].text.strip())
            MIN_FILTERED_DATA = cols
        if float(cols[2].text.strip()) > MAX_RANK:
            MAX_RANK = float(cols[2].text.strip())
            MAX_FILTERED_DATA = cols

MAX_FILTERED_DATA_DF = []
MIN_FILTERED_DATA_DF = []

MAX_FILTERED_DATA_DF.append([
    MAX_FILTERED_DATA[0].text.strip(),
    College_Name,
    MAX_FILTERED_DATA[1].text.strip(),
    MAX_FILTERED_DATA[2].text.strip(),
    MAX_FILTERED_DATA[3].text.strip(),
    MAX_FILTERED_DATA[4].text.strip(),
    MAX_FILTERED_DATA[5].text.strip(),
    MAX_FILTERED_DATA[6].text.strip(),
    MAX_FILTERED_DATA[7].text.strip()
])

MIN_FILTERED_DATA_DF.append([
    MIN_FILTERED_DATA[0].text.strip(),
    College_Name,
    MIN_FILTERED_DATA[1].text.strip(),
    MIN_FILTERED_DATA[2].text.strip(),
    MIN_FILTERED_DATA[3].text.strip(),
    MIN_FILTERED_DATA[4].text.strip(),
    MIN_FILTERED_DATA[5].text.strip(),
    MIN_FILTERED_DATA[6].text.strip(),
    MIN_FILTERED_DATA[7].text.strip()
])

# Save filtered data to CSV files
max_df = pd.DataFrame(MAX_FILTERED_DATA_DF, columns=["S.No", "College Name", "Hall Ticket", "Rank", "Name", "Sex", "Caste", "Region", "Seat Category"])
min_df = pd.DataFrame(MIN_FILTERED_DATA_DF, columns=["S.No", "College Name", "Hall Ticket", "Rank", "Name", "Sex", "Caste", "Region", "Seat Category"])
max_df.to_csv("max_rank_filtered_data.csv", index=False)
min_df.to_csv("min_rank_filtered_data.csv", index=False)
print("✅ Filtered data saved to max_rank_filtered_data.csv and min_rank_filtered_data.csv")

print(f"✅ Filtered data saved to ")
# Done — don't quit if you want to explore more
# driver.quit()
