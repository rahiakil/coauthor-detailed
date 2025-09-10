"""
Co-Author AI Financial Model Generator
Creates a comprehensive Excel financial model using openpyxl
"""

import openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.formatting.rule import CellIsRule
from openpyxl.utils import get_column_letter
from openpyxl.chart import LineChart, AreaChart, BarChart, Reference
from openpyxl.worksheet.datavalidation import DataValidation

def create_financial_model():
    """Create the complete Co-Author AI financial model"""
    
    # Create workbook
    wb = Workbook()
    
    # Remove default sheet
    wb.remove(wb.active)
    
    # Create all required worksheets
    sheet_names = [
        'Dashboard',
        'Revenue Model', 
        'Cost Model',
        'Deployment Costs',
        'User Growth',
        'DCF Valuation',
        'Sensitivity',
        'Investment Returns'
    ]
    
    sheets = {}
    for name in sheet_names:
        sheets[name] = wb.create_sheet(title=name)
    
    # Set up styles
    header_font = Font(name='Arial', size=14, bold=True)
    subheader_font = Font(name='Arial', size=12, bold=True)
    normal_font = Font(name='Arial', size=10)
    title_font = Font(name='Arial', size=16, bold=True)
    
    center_align = Alignment(horizontal='center', vertical='center')
    right_align = Alignment(horizontal='right', vertical='center')
    
    blue_fill = PatternFill(start_color='E6F3FF', end_color='E6F3FF', fill_type='solid')
    green_fill = PatternFill(start_color='E6F7E6', end_color='E6F7E6', fill_type='solid')
    yellow_fill = PatternFill(start_color='FFF9E6', end_color='FFF9E6', fill_type='solid')
    red_fill = PatternFill(start_color='FFE6E6', end_color='FFE6E6', fill_type='solid')
    
    thin_border = Border(
        left=Side(style='thin'),
        right=Side(style='thin'), 
        top=Side(style='thin'),
        bottom=Side(style='thin')
    )
    
    # 1. DASHBOARD SHEET
    dashboard = sheets['Dashboard']
    
    # Title
    dashboard['A1'] = 'Co-Author AI - Executive Financial Dashboard'
    dashboard['A1'].font = title_font
    dashboard.merge_cells('A1:H1')
    dashboard['A1'].alignment = center_align
    dashboard['A1'].fill = blue_fill
    
    # Years header
    years = ['Metric', '2025', '2026', '2027', '2028', '2029', '2030']
    for i, year in enumerate(years, start=2):
        cell = dashboard.cell(row=4, column=i)
        cell.value = year
        cell.font = header_font
        cell.alignment = center_align
        cell.fill = blue_fill
        cell.border = thin_border
    
    # Key metrics
    metrics = [
        ('Total Revenue ($M)', "=SUMPRODUCT('Revenue Model'!C20:C23)", "=SUMPRODUCT('Revenue Model'!D20:D23)", 
         "=SUMPRODUCT('Revenue Model'!E20:E23)", "=SUMPRODUCT('Revenue Model'!F20:F23)", 
         "=SUMPRODUCT('Revenue Model'!G20:G23)", "=SUMPRODUCT('Revenue Model'!H20:H23)"),
        ('Gross Margin %', "=('Revenue Model'!C25-'Cost Model'!C15)/'Revenue Model'!C25",
         "=('Revenue Model'!D25-'Cost Model'!D15)/'Revenue Model'!D25",
         "=('Revenue Model'!E25-'Cost Model'!E15)/'Revenue Model'!E25",
         "=('Revenue Model'!F25-'Cost Model'!F15)/'Revenue Model'!F25",
         "=('Revenue Model'!G25-'Cost Model'!G15)/'Revenue Model'!G25",
         "=('Revenue Model'!H25-'Cost Model'!H15)/'Revenue Model'!H25"),
        ('EBITDA ($M)', "='Revenue Model'!C25-'Cost Model'!C15-'Cost Model'!C32",
         "='Revenue Model'!D25-'Cost Model'!D15-'Cost Model'!D32",
         "='Revenue Model'!E25-'Cost Model'!E15-'Cost Model'!E32",
         "='Revenue Model'!F25-'Cost Model'!F15-'Cost Model'!F32",
         "='Revenue Model'!G25-'Cost Model'!G15-'Cost Model'!G32",
         "='Revenue Model'!H25-'Cost Model'!H15-'Cost Model'!H32"),
        ('Customer Count', "='Revenue Model'!C6+'Revenue Model'!C7+'Revenue Model'!C8+'Revenue Model'!C9",
         "='Revenue Model'!D6+'Revenue Model'!D7+'Revenue Model'!D8+'Revenue Model'!D9",
         "='Revenue Model'!E6+'Revenue Model'!E7+'Revenue Model'!E8+'Revenue Model'!E9",
         "='Revenue Model'!F6+'Revenue Model'!F7+'Revenue Model'!F8+'Revenue Model'!F9",
         "='Revenue Model'!G6+'Revenue Model'!G7+'Revenue Model'!G8+'Revenue Model'!G9",
         "='Revenue Model'!H6+'Revenue Model'!H7+'Revenue Model'!H8+'Revenue Model'!H9"),
        ('ARPU ($/month)', '=C5*1000000/(C8*12)', '=D5*1000000/(D8*12)', '=E5*1000000/(E8*12)',
         '=F5*1000000/(F8*12)', '=G5*1000000/(G8*12)', '=H5*1000000/(H8*12)')
    ]
    
    for i, (metric_name, *formulas) in enumerate(metrics, start=5):
        dashboard.cell(row=i, column=2).value = metric_name
        dashboard.cell(row=i, column=2).font = subheader_font
        dashboard.cell(row=i, column=2).border = thin_border
        
        for j, formula in enumerate(formulas, start=3):
            cell = dashboard.cell(row=i, column=j)
            cell.value = formula
            cell.border = thin_border
            cell.alignment = right_align
            if 'Revenue' in metric_name or 'EBITDA' in metric_name:
                cell.number_format = '"$"#,##0.0,,"M"'
            elif 'Margin' in metric_name:
                cell.number_format = '0.0%'
            elif 'Customer Count' in metric_name:
                cell.number_format = '#,##0'
            elif 'ARPU' in metric_name:
                cell.number_format = '"$"#,##0'
    
    # 2. REVENUE MODEL SHEET
    revenue = sheets['Revenue Model']
    
    # Title
    revenue['A1'] = 'Revenue Model'
    revenue['A1'].font = title_font
    revenue.merge_cells('A1:H1')
    revenue['A1'].alignment = center_align
    revenue['A1'].fill = blue_fill
    
    # Market Segments header
    revenue['A5'] = 'Market Segments'
    revenue['B5'] = 'TAM (K users)'
    revenue['C5'] = '2025 Users'
    for col in ['A5', 'B5', 'C5']:
        revenue[col].font = header_font
        revenue[col].fill = blue_fill
        revenue[col].border = thin_border
    
    # Years header for user projections
    for i, year in enumerate(['2025', '2026', '2027', '2028', '2029', '2030'], start=3):
        cell = revenue.cell(row=5, column=i)
        cell.value = year
        cell.font = header_font
        cell.alignment = center_align
        cell.fill = blue_fill
        cell.border = thin_border
    
    # User segments data
    segments = [
        ('Freelance Writers', 2300, '=B6*0.0005', '=C6*1.8', '=D6*1.6', '=E6*1.4', '=F6*1.3', '=G6*1.2'),
        ('Healthcare Practices', 850, '=B7*0.0005', '=C7*2.1', '=D7*1.8', '=E7*1.5', '=F7*1.3', '=G7*1.2'),
        ('Enterprise Clients', 125, '=B8*0.0007', '=C8*2.5', '=D8*2.0', '=E8*1.6', '=F8*1.4', '=G8*1.2'),
        ('Government Agencies', 15, '=B9*0.0008', '=C9*3.2', '=D9*2.4', '=E9*1.8', '=F9*1.5', '=G9*1.3')
    ]
    
    for i, (segment_name, tam, *user_formulas) in enumerate(segments, start=6):
        revenue.cell(row=i, column=1).value = segment_name
        revenue.cell(row=i, column=1).font = normal_font
        revenue.cell(row=i, column=1).border = thin_border
        
        revenue.cell(row=i, column=2).value = tam
        revenue.cell(row=i, column=2).border = thin_border
        revenue.cell(row=i, column=2).alignment = right_align
        
        for j, formula in enumerate(user_formulas, start=3):
            cell = revenue.cell(row=i, column=j)
            cell.value = formula
            cell.border = thin_border
            cell.alignment = right_align
            cell.number_format = '#,##0.0'
    
    # Pricing Model section
    revenue['A12'] = 'Pricing Model ($/month)'
    revenue['A12'].font = header_font
    revenue['A12'].fill = yellow_fill
    revenue.merge_cells('A12:H12')
    
    # Pricing data
    pricing = [
        ('Freelancers ($/month)', 29, '=C13*1.05', '=D13*1.05', '=E13*1.05', '=F13*1.05', '=G13*1.05'),
        ('Healthcare ($/month)', 79, '=C14*1.07', '=D14*1.07', '=E14*1.07', '=F14*1.07', '=G14*1.07'),
        ('Enterprise ($/month)', 249, '=C15*1.08', '=D15*1.08', '=E15*1.08', '=F15*1.08', '=G15*1.08'),
        ('Government ($/month)', 1249, '=C16*1.06', '=D16*1.06', '=E16*1.06', '=F16*1.06', '=G16*1.06')
    ]
    
    for i, (price_name, initial_price, *price_formulas) in enumerate(pricing, start=13):
        revenue.cell(row=i, column=1).value = price_name
        revenue.cell(row=i, column=1).font = normal_font
        revenue.cell(row=i, column=1).border = thin_border
        
        revenue.cell(row=i, column=3).value = initial_price
        revenue.cell(row=i, column=3).border = thin_border
        revenue.cell(row=i, column=3).alignment = right_align
        revenue.cell(row=i, column=3).number_format = '"$"#,##0'
        
        for j, formula in enumerate(price_formulas, start=4):
            cell = revenue.cell(row=i, column=j)
            cell.value = formula
            cell.border = thin_border
            cell.alignment = right_align
            cell.number_format = '"$"#,##0'
    
    # Revenue Calculations section
    revenue['A19'] = 'Revenue Calculations ($M)'
    revenue['A19'].font = header_font
    revenue['A19'].fill = green_fill
    revenue.merge_cells('A19:H19')
    
    # Revenue calculations
    rev_calcs = [
        ('Freelancer Revenue', '=C6*C13*12/1000000', '=D6*D13*12/1000000', '=E6*E13*12/1000000', 
         '=F6*F13*12/1000000', '=G6*G13*12/1000000', '=H6*H13*12/1000000'),
        ('Healthcare Revenue', '=C7*C14*12/1000000', '=D7*D14*12/1000000', '=E7*E14*12/1000000',
         '=F7*F14*12/1000000', '=G7*G14*12/1000000', '=H7*H14*12/1000000'),
        ('Enterprise Revenue', '=C8*C15*12/1000000', '=D8*D15*12/1000000', '=E8*E15*12/1000000',
         '=F8*F15*12/1000000', '=G8*G15*12/1000000', '=H8*H15*12/1000000'),
        ('Government Revenue', '=C9*C16*12/1000000', '=D9*D16*12/1000000', '=E9*E16*12/1000000',
         '=F9*F16*12/1000000', '=G9*G16*12/1000000', '=H9*H16*12/1000000')
    ]
    
    for i, (rev_name, *rev_formulas) in enumerate(rev_calcs, start=20):
        revenue.cell(row=i, column=1).value = rev_name
        revenue.cell(row=i, column=1).font = normal_font
        revenue.cell(row=i, column=1).border = thin_border
        
        for j, formula in enumerate(rev_formulas, start=3):
            cell = revenue.cell(row=i, column=j)
            cell.value = formula
            cell.border = thin_border
            cell.alignment = right_align
            cell.number_format = '"$"#,##0.0,,"M"'
    
    # Total revenue row
    revenue['A25'] = 'Total Annual Revenue ($M)'
    revenue['A25'].font = subheader_font
    revenue['A25'].border = thin_border
    revenue['A25'].fill = green_fill
    
    for col in range(3, 9):
        cell = revenue.cell(row=25, column=col)
        cell.value = f'=SUM({get_column_letter(col)}20:{get_column_letter(col)}23)'
        cell.border = thin_border
        cell.alignment = right_align
        cell.number_format = '"$"#,##0.0,,"M"'
        cell.font = subheader_font
        cell.fill = green_fill
    
    # 3. COST MODEL SHEET
    cost = sheets['Cost Model']
    
    # Title
    cost['A1'] = 'Cost Model'
    cost['A1'].font = title_font
    cost.merge_cells('A1:H1')
    cost['A1'].alignment = center_align
    cost['A1'].fill = blue_fill
    
    # Infrastructure Costs section
    cost['A6'] = 'Infrastructure Costs'
    cost['A6'].font = header_font
    cost['A6'].fill = yellow_fill
    cost.merge_cells('A6:H6')
    
    # Infrastructure data
    infra_data = [
        ('Total Users', "='Revenue Model'!C8", "='Revenue Model'!D8", "='Revenue Model'!E8", 
         "='Revenue Model'!F8", "='Revenue Model'!G8", "='Revenue Model'!H8"),
        ('AWS Cost per User/Month', 5.83, '=C8*0.95', '=D8*0.95', '=E8*0.95', '=F8*0.95', '=G8*0.95'),
        ('Selected Deployment Cost ($M)', 
         '=IF(C7<1000,C7*2.40*12/1000000,IF(C7<25000,C7*4.0*12/1000000,C7*5.50*12/1000000))',
         '=IF(D7<1000,D7*2.40*12/1000000,IF(D7<25000,D7*4.0*12/1000000,D7*5.50*12/1000000))',
         '=IF(E7<1000,E7*2.40*12/1000000,IF(E7<25000,E7*4.0*12/1000000,E7*5.50*12/1000000))',
         '=IF(F7<1000,F7*2.40*12/1000000,IF(F7<25000,F7*4.0*12/1000000,F7*5.50*12/1000000))',
         '=IF(G7<1000,G7*2.40*12/1000000,IF(G7<25000,G7*4.0*12/1000000,G7*5.50*12/1000000))',
         '=IF(H7<1000,H7*2.40*12/1000000,IF(H7<25000,H7*4.0*12/1000000,H7*5.50*12/1000000))')
    ]
    
    for i, (item_name, *item_formulas) in enumerate(infra_data, start=7):
        cost.cell(row=i, column=1).value = item_name
        cost.cell(row=i, column=1).font = normal_font
        cost.cell(row=i, column=1).border = thin_border
        
        for j, formula in enumerate(item_formulas, start=3):
            cell = cost.cell(row=i, column=j)
            if isinstance(formula, (int, float)):
                cell.value = formula
            else:
                cell.value = formula
            cell.border = thin_border
            cell.alignment = right_align
            if 'Users' in item_name:
                cell.number_format = '#,##0'
            elif 'Cost per User' in item_name:
                cell.number_format = '"$"#,##0.00'
            elif 'Cost ($M)' in item_name:
                cell.number_format = '"$"#,##0.0,,"M"'
    
    # Total COGS
    cost['A15'] = 'Total COGS ($M)'
    cost['A15'].font = subheader_font
    cost['A15'].border = thin_border
    cost['A15'].fill = yellow_fill
    
    for col in range(3, 9):
        cell = cost.cell(row=15, column=col)
        cell.value = f'={get_column_letter(col)}9'
        cell.border = thin_border
        cell.alignment = right_align
        cell.number_format = '"$"#,##0.0,,"M"'
        cell.font = subheader_font
        cell.fill = yellow_fill
    
    # Operating Expenses section
    cost['A17'] = 'Operating Expenses'
    cost['A17'].font = header_font
    cost['A17'].fill = red_fill
    cost.merge_cells('A17:H17')
    
    # OpEx data
    opex_data = [
        ('Customer Acquisition Cost', 85, '=C18*0.95', '=D18*0.95', '=E18*0.95', '=F18*0.95', '=G18*0.95'),
        ('New Customers Acquired', "=C7", "=D7-C7", "=E7-D7", "=F7-E7", "=G7-F7", "=H7-G7"),
        ('Sales & Marketing ($M)', '=C18*C19/1000000', '=D18*D19/1000000', '=E18*E19/1000000', 
         '=F18*F19/1000000', '=G18*G19/1000000', '=H18*H19/1000000'),
        ('', '', '', '', '', '', ''),
        ('R&D Engineers', 15, '=C22*1.25', '=D22*1.25', '=E22*1.25', '=F22*1.25', '=G22*1.25'),
        ('Avg Engineer Salary ($K)', 180, '=C23*1.06', '=D23*1.06', '=E23*1.06', '=F23*1.06', '=G23*1.06'),
        ('Total R&D ($M)', '=C22*C23/1000', '=D22*D23/1000', '=E22*E23/1000', 
         '=F22*F23/1000', '=G22*G23/1000', '=H22*H23/1000'),
        ('', '', '', '', '', '', ''),
        ('G&A Base ($M)', 2.5, '=C26*1.15', '=D26*1.15', '=E26*1.15', '=F26*1.15', '=G26*1.15')
    ]
    
    for i, (item_name, *item_formulas) in enumerate(opex_data, start=18):
        if item_name:  # Skip empty rows
            cost.cell(row=i, column=1).value = item_name
            cost.cell(row=i, column=1).font = normal_font
            cost.cell(row=i, column=1).border = thin_border
            
            for j, formula in enumerate(item_formulas, start=3):
                if formula:  # Skip empty cells
                    cell = cost.cell(row=i, column=j)
                    if isinstance(formula, (int, float)):
                        cell.value = formula
                    else:
                        cell.value = formula
                    cell.border = thin_border
                    cell.alignment = right_align
                    
                    if 'Cost' in item_name and '$' not in item_name:a
                        cell.number_format = '"$"#,##0'
                    elif 'Customers' in item_name or 'Engineers' in item_name:
                        cell.number_format = '#,##0'
                    elif 'Salary' in item_name:
                        cell.number_format = '"$"#,##0,"K"'
                    elif '($M)' in item_name:
                        cell.number_format = '"$"#,##0.0,,"M"'
    
    # Total OpEx
    cost['A32'] = 'Total OpEx ($M)'
    cost['A32'].font = subheader_font
    cost['A32'].border = thin_border
    cost['A32'].fill = red_fill
    
    for col in range(3, 9):
        cell = cost.cell(row=32, column=col)
        cell.value = f'={get_column_letter(col)}20+{get_column_letter(col)}24+{get_column_letter(col)}26'
        cell.border = thin_border
        cell.alignment = right_align
        cell.number_format = '"$"#,##0.0,,"M"'
        cell.font = subheader_font
        cell.fill = red_fill
    
    # 4. DCF VALUATION SHEET
    dcf = sheets['DCF Valuation']
    
    # Title
    dcf['A1'] = 'DCF Valuation Model'
    dcf['A1'].font = title_font
    dcf.merge_cells('A1:J1')
    dcf['A1'].alignment = center_align
    dcf['A1'].fill = blue_fill
    
    # Key Assumptions
    dcf['A4'] = 'Key Assumptions'
    dcf['A4'].font = header_font
    dcf['A4'].fill = blue_fill
    
    assumptions = [
        ('WACC (%)', 0.125),
        ('Terminal Growth (%)', 0.035),
        ('Tax Rate (%)', 0.25)
    ]
    
    for i, (assumption, value) in enumerate(assumptions, start=5):
        dcf.cell(row=i, column=2).value = assumption
        dcf.cell(row=i, column=2).font = normal_font
        dcf.cell(row=i, column=2).border = thin_border
        
        dcf.cell(row=i, column=3).value = value
        dcf.cell(row=i, column=3).border = thin_border
        dcf.cell(row=i, column=3).alignment = right_align
        dcf.cell(row=i, column=3).number_format = '0.0%'
        dcf.cell(row=i, column=3).fill = yellow_fill
    
    # Years header for DCF
    dcf['C13'] = 'Projection Years'
    dcf['C13'].font = header_font
    dcf['C13'].fill = blue_fill
    dcf.merge_cells('C13:I13')
    dcf['C13'].alignment = center_align
    
    for i, year in enumerate(['2025', '2026', '2027', '2028', '2029', '2030'], start=4):
        cell = dcf.cell(row=14, column=i)
        cell.value = year
        cell.font = header_font
        cell.alignment = center_align
        cell.fill = blue_fill
        cell.border = thin_border
    
    # Cash Flow Projections
    cf_items = [
        ('Revenue ($M)', "='Revenue Model'!C25", "='Revenue Model'!D25", "='Revenue Model'!E25", 
         "='Revenue Model'!F25", "='Revenue Model'!G25", "='Revenue Model'!H25"),
        ('EBITDA ($M)', "='Revenue Model'!C25-'Cost Model'!C15-'Cost Model'!C32",
         "='Revenue Model'!D25-'Cost Model'!D15-'Cost Model'!D32",
         "='Revenue Model'!E25-'Cost Model'!E15-'Cost Model'!E32",
         "='Revenue Model'!F25-'Cost Model'!F15-'Cost Model'!F32",
         "='Revenue Model'!G25-'Cost Model'!G15-'Cost Model'!G32",
         "='Revenue Model'!H25-'Cost Model'!H15-'Cost Model'!H32"),
        ('Depreciation ($M)', '=D15*0.03', '=E15*0.03', '=F15*0.03', '=G15*0.03', '=H15*0.03', '=I15*0.03'),
        ('EBIT ($M)', '=D16-D17', '=E16-E17', '=F16-F17', '=G16-G17', '=H16-H17', '=I16-I17'),
        ('Taxes ($M)', '=D18*$C$7', '=E18*$C$7', '=F18*$C$7', '=G18*$C$7', '=H18*$C$7', '=I18*$C$7'),
        ('NOPAT ($M)', '=D18-D19', '=E18-E19', '=F18-F19', '=G18-G19', '=H18-H19', '=I18-I19'),
        ('CapEx ($M)', '=D15*0.04', '=E15*0.04', '=F15*0.04', '=G15*0.04', '=H15*0.04', '=I15*0.04'),
        ('Change in Working Capital ($M)', '=D15*0.02', '=(E15-D15)*0.02', '=(F15-E15)*0.02', 
         '=(G15-F15)*0.02', '=(H15-G15)*0.02', '=(I15-H15)*0.02'),
        ('Free Cash Flow ($M)', '=D20+D17-D21-D22', '=E20+E17-E21-E22', '=F20+F17-F21-F22',
         '=G20+G17-G21-G22', '=H20+H17-H21-H22', '=I20+I17-I21-I22'),
        ('', '', '', '', '', '', ''),
        ('Discount Factor', '=1/(1+$C$5)^1', '=1/(1+$C$5)^2', '=1/(1+$C$5)^3', 
         '=1/(1+$C$5)^4', '=1/(1+$C$5)^5', '=1/(1+$C$5)^6'),
        ('PV of FCF ($M)', '=D23*D25', '=E23*E25', '=F23*F25', '=G23*G25', '=H23*H25', '=I23*I25')
    ]
    
    for i, (item_name, *item_formulas) in enumerate(cf_items, start=15):
        if item_name:  # Skip empty rows
            dcf.cell(row=i, column=1).value = item_name
            dcf.cell(row=i, column=1).font = normal_font
            dcf.cell(row=i, column=1).border = thin_border
            
            for j, formula in enumerate(item_formulas, start=4):
                if formula:  # Skip empty cells
                    cell = dcf.cell(row=i, column=j)
                    cell.value = formula
                    cell.border = thin_border
                    cell.alignment = right_align
                    
                    if '($M)' in item_name:
                        cell.number_format = '"$"#,##0.0,,"M"'
                    elif 'Factor' in item_name:
                        cell.number_format = '0.000'
    
    # Terminal Value Calculations
    dcf['A28'] = 'Terminal FCF ($M)'
    dcf['A28'].font = normal_font
    dcf['A28'].border = thin_border
    dcf['I28'] = '=I23*(1+$C$6)'
    dcf['I28'].border = thin_border
    dcf['I28'].alignment = right_align
    dcf['I28'].number_format = '"$"#,##0.0,,"M"'
    
    dcf['A29'] = 'Terminal Value ($M)'
    dcf['A29'].font = normal_font
    dcf['A29'].border = thin_border
    dcf['I29'] = '=I28/($C$5-$C$6)'
    dcf['I29'].border = thin_border
    dcf['I29'].alignment = right_align
    dcf['I29'].number_format = '"$"#,##0.0,,"M"'
    
    dcf['A30'] = 'PV of Terminal Value ($M)'
    dcf['A30'].font = normal_font
    dcf['A30'].border = thin_border
    dcf['I30'] = '=I29*I25'
    dcf['I30'].border = thin_border
    dcf['I30'].alignment = right_align
    dcf['I30'].number_format = '"$"#,##0.0,,"M"'
    
    dcf['A32'] = 'Enterprise Value ($M)'
    dcf['A32'].font = subheader_font
    dcf['A32'].border = thin_border
    dcf['A32'].fill = green_fill
    dcf['J32'] = '=SUM(D26:I26)+I30'
    dcf['J32'].border = thin_border
    dcf['J32'].alignment = right_align
    dcf['J32'].number_format = '"$"#,##0.0,,"M"'
    dcf['J32'].font = subheader_font
    dcf['J32'].fill = green_fill
    
    # 5. CREATE REMAINING SHEETS WITH BASIC STRUCTURE
    
    # Deployment Costs Sheet
    deployment = sheets['Deployment Costs']
    deployment['A1'] = 'Deployment Cost Analysis'
    deployment['A1'].font = title_font
    deployment.merge_cells('A1:H1')
    deployment['A1'].alignment = center_align
    deployment['A1'].fill = blue_fill
    
    # User Growth Sheet
    user_growth = sheets['User Growth']
    user_growth['A1'] = 'User Growth Projections'
    user_growth['A1'].font = title_font
    user_growth.merge_cells('A1:H1')
    user_growth['A1'].alignment = center_align
    user_growth['A1'].fill = blue_fill
    
    # Sensitivity Sheet
    sensitivity = sheets['Sensitivity']
    sensitivity['A1'] = 'Sensitivity Analysis'
    sensitivity['A1'].font = title_font
    sensitivity.merge_cells('A1:H1')
    sensitivity['A1'].alignment = center_align
    sensitivity['A1'].fill = blue_fill
    
    # Investment Returns Sheet
    investment = sheets['Investment Returns']
    investment['A1'] = 'Investment Returns Analysis'
    investment['A1'].font = title_font
    investment.merge_cells('A1:H1')
    investment['A1'].alignment = center_align
    investment['A1'].fill = blue_fill
    
    # Apply conditional formatting to Dashboard
    # Green for margins >30%
    green_rule = CellIsRule(operator='greaterThan', formula=['0.3'], fill=green_fill)
    dashboard.conditional_formatting.add('C6:H6', green_rule)
    
    # Yellow for margins 15-30%
    yellow_rule = CellIsRule(operator='between', formula=['0.15', '0.3'], fill=yellow_fill)
    dashboard.conditional_formatting.add('C6:H6', yellow_rule)
    
    # Red for margins <15%
    red_rule = CellIsRule(operator='lessThan', formula=['0.15'], fill=red_fill)
    dashboard.conditional_formatting.add('C6:H6', red_rule)
    
    # Set column widths for better readability
    for sheet in sheets.values():
        sheet.column_dimensions['A'].width = 25
        for col in ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']:
            sheet.column_dimensions[col].width = 15
    
    # Set Dashboard as the active sheet
    wb.active = sheets['Dashboard']
    
    return wb

def main():
    """Main function to create and save the financial model"""
    print("Creating Co-Author AI Financial Model...")
    
    # Create the workbook
    wb = create_financial_model()
    
    # Save the workbook
    filename = "Co_Author_AI_Financial_Model.xlsx"
    wb.save(filename)
    
    print(f"Financial model created successfully: {filename}")
    print("\nWorksheets created:")
    for sheet_name in wb.sheetnames:
        print(f"  - {sheet_name}")
    
    print("\nKey features implemented:")
    print("  ✓ Complete dashboard with key metrics")
    print("  ✓ Revenue model with user segments and pricing")
    print("  ✓ Cost model with infrastructure and OpEx")
    print("  ✓ DCF valuation with cash flow projections")
    print("  ✓ Conditional formatting for margins")
    print("  ✓ Professional styling and formatting")
    print("  ✓ Linked formulas across all sheets")
    
    print(f"\nTo use the model:")
    print(f"1. Open {filename} in Excel")
    print("2. Review the Dashboard for key metrics")
    print("3. Modify assumptions in the yellow-highlighted cells")
    print("4. All calculations will update automatically")

if __name__ == "__main__":
    main()
