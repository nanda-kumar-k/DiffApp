from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import pandas as pd


def connect_to_chrome():
    chrome_options = Options()
    chrome_options.debugger_address = "127.0.0.1:9222"
    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 20)

    print("✅ Connected to manually opened Chrome tab")
    return driver, wait

def wait_for_college_dropdown(wait, driver):
    """Waits for the college dropdown to appear and returns the element."""
    try:
        college_element = wait.until(
            EC.presence_of_element_located((By.ID, "MainContent_DropDownList1"))
        )
        print("✅ College dropdown is available")
        return college_element
    except:
        driver.save_screenshot("dropdown_failed.png")
        print("❌ College dropdown not found")
        # driver.quit()
        # exit()

def select_college_and_branch_and_submit(wait, driver, College_index, Branch_value):
    """Selects a college and branch from the dropdowns."""
    try:
        time.sleep(2)  # Ensure the page is fully loaded
        college_element = wait_for_college_dropdown(wait, driver)
        Select(college_element).select_by_index(College_index)

        # Wait for branch dropdown to populate
        time.sleep(3)
        branch_element = driver.find_element(By.ID, "MainContent_DropDownList2")
        Select(branch_element).select_by_value(Branch_value)

        college_name = driver.find_element(By.XPATH, "/html/body/form/div[3]/div/table/tbody/tr[3]/td[2]/select/option["+ str(College_index+1) +"]").text.strip()
        # branch_name = driver.find_element(By.XPATH, "/html/body/form/div[3]/div/table/tbody/tr[4]/td[2]/select/option[3]").text.strip()
        
        driver.find_element(By.ID, "MainContent_btn_allot").click()
        time.sleep(3)  # Wait for the allotment to process
        # driver.save_screenshot("mock_allotment_result.png")
        # print("✅ Allotment screenshot saved!")

        # print(college_name)
        # print(branch_name)

        return college_name
    except Exception as e:
        return None

def get_allotment_table(driver):
    """Retrieves the allotment table and returns its rows."""
    time.sleep(1)  # Ensure the page is fully loaded
    table = driver.find_element(By.XPATH, "/html/body/form/div[3]/div/table/tbody/tr/td/span/table[2]")
    rows = table.find_elements(By.TAG_NAME, "tr")
    
    return rows

def filter_table_data(driver, College_Name, branch_name):
    MAX_RANK = MIN_RANK = 0

    MAX_FILTERED_DATA = []
    MIN_FILTERED_DATA = []
    time.sleep(1)  # Ensure the page is fully loaded
    rows = get_allotment_table(driver)
    
    for row in rows[1:]:
        cols = row.find_elements(By.TAG_NAME, "td")
        
        if cols[7].text.strip() == "BC_D_GEN_OU" or cols[7].text.strip() == "BC_D_GEN_UR" or cols[7].text.strip() == "OC_GEN_OU" or cols[7].text.strip() == "OC_GEN_UR":
            if MIN_RANK == 0 or float(cols[2].text.strip()) < MIN_RANK:
                MIN_RANK = float(cols[2].text.strip())
                MIN_FILTERED_DATA = cols
            if float(cols[2].text.strip()) > MAX_RANK:
                MAX_RANK = float(cols[2].text.strip())
                MAX_FILTERED_DATA = cols

    FILTERED_DATA_LIST = []

    if MAX_FILTERED_DATA and MIN_FILTERED_DATA:

        FILTERED_DATA_LIST.append([
            MAX_FILTERED_DATA[0].text.strip(),
            College_Name,
            branch_name,
            MAX_FILTERED_DATA[1].text.strip(),
            MAX_FILTERED_DATA[2].text.strip(),
            MAX_FILTERED_DATA[3].text.strip(),
            MAX_FILTERED_DATA[4].text.strip(),
            MAX_FILTERED_DATA[5].text.strip(),
            MAX_FILTERED_DATA[6].text.strip(),
            MAX_FILTERED_DATA[7].text.strip(),
            
            MIN_FILTERED_DATA[0].text.strip(),
            College_Name,
            branch_name,
            MIN_FILTERED_DATA[1].text.strip(),
            MIN_FILTERED_DATA[2].text.strip(),
            MIN_FILTERED_DATA[3].text.strip(),
            MIN_FILTERED_DATA[4].text.strip(),
            MIN_FILTERED_DATA[5].text.strip(),
            MIN_FILTERED_DATA[6].text.strip(),
            MIN_FILTERED_DATA[7].text.strip()
        ])
    
    return FILTERED_DATA_LIST

if __name__ == "__main__":
    driver, wait = connect_to_chrome()
    
    Final_DF = pd.DataFrame(columns=[
        "S.No", "College Name", "Branch", "Hall Ticket", "Rank", "Name", "Sex", "Caste", "Region", "Seat Category", 
        "M_S.No", "M_College Name", "M_Branch", "M_Hall Ticket", "M_Rank", "M_Name", "M_Sex", "M_Caste", "M_Region", "M_Seat Category"
    ])
    
    Branch_Name_list = ["CSE", "CSD", "CSM"]
    for index in range(45, 90):
        # Step 2: Select college and branch
        print(f"Processing College Index: {index}")
        for branch in Branch_Name_list:
            College_Name = select_college_and_branch_and_submit(wait, driver, index, branch)
            if College_Name:
                print(f"Selected College: {College_Name}, Branch: {branch}")

                # Step 3: Filter the data
                FILTERED_DATA = filter_table_data(driver, College_Name, branch)

                if FILTERED_DATA:
                    # Append to DataFrame
                    Final_DF = pd.concat([Final_DF, pd.DataFrame(FILTERED_DATA, columns=Final_DF.columns)], ignore_index=True)

    # Save filtered data to CSV files
    Final_DF.to_csv("filtered_data_2_new.csv", index=False)
    print("✅ Filtered data saved to filtered_data_2_new.csv")

    driver.quit()