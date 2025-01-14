import pandas as pd
import uuid


def generate_sql_from_excel(file_path, excluded_sheets):
    # Load the Excel file
    excel_data = pd.ExcelFile(file_path)

    # Initialize a list to store the SQL script lines
    sql_script = []

    # Iterate through all sheets in the Excel file
    for sheet_name in excel_data.sheet_names:
        # Skip excluded sheets
        if sheet_name in excluded_sheets:
            continue

        # Load the sheet into a DataFrame
        df = excel_data.parse(sheet_name)

        # Extract user name from cell B1
        user_name = df.iloc[0, 1]  # Cell B1 (Row 1, Column 2 in zero-based indexing)

        # Generate a random GUID for the user
        user_guid = str(uuid.uuid4())

        # Append the User INSERT query
        sql_script.append(f"-- Sheet: {sheet_name}")
        sql_script.append(f"INSERT INTO \"Users\" (\"Id\", \"UserEmail\", \"Name\",  \"CreatedAtDate\", \"UpdatedAtDate\") VALUES ('{user_guid}', '{{UserEmail}}', /* {sheet_name} */ '{{UserName}} ', '2025-01-13 16:18:20.07363+00', '2025-01-13 16:18:20.07363+00');\n")

        # Process data rows (from row 7 to 30, 0-indexed is 6 to 29)
        for index, row in df.iterrows():
            if index < 5 or index > 29:
                continue

            day_info = row[0]  # Column A: Day
            quantity = row[1]  # Column B: Quantity

            # Check for valid data
            if pd.isna(day_info) or pd.isna(quantity):
                continue

            # Parse day number from the format "dag {number}"
            try:
                day_number = int(day_info.split()[1])
            except (IndexError, ValueError):
                continue

            # Skip rows where quantity is 0
            if quantity == 0:
                continue

            # Append the UserActivity INSERT query
            sql_script.append(
                f"INSERT INTO \"UserActivities\" (\"Id\", \"Day\", \"Month\", \"Quantity\", \"UserId\") VALUES ('{str(uuid.uuid4())}', {day_number}, 1, {quantity}, '{user_guid}');"
            )

        # Add a newline for readability between sheets
        sql_script.append("\n")

    # Join all SQL script lines into a single string
    return "\n".join(sql_script)


file_path = "computas-tikamp.xlsx"
excluded_sheets = ["readme", "poeng", "totaloversikt"]

sql_script = generate_sql_from_excel(file_path, excluded_sheets)
with open("output_script.sql", "w") as file:
    file.write(sql_script)

print("SQL script generated and saved to 'output_script.sql'.")
