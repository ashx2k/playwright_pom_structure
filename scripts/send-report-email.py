#!/usr/bin/env python3
"""Send report URL email using SMTP env vars.

Required env:
- SMTP_SERVER
- SMTP_PORT
- SMTP_USERNAME
- SMTP_PASSWORD
- REPORT_EMAIL_FROM
- REPORT_EMAIL_TO_SELECTED
- REPORT_URL
"""

import os
import smtplib
from email.mime.text import MIMEText

required = [
    'SMTP_SERVER',
    'SMTP_PORT',
    'SMTP_USERNAME',
    'SMTP_PASSWORD',
    'REPORT_EMAIL_FROM',
    'REPORT_EMAIL_TO_SELECTED',
    'REPORT_URL',
]

missing = [k for k in required if not os.getenv(k)]
if missing:
    print(f"Skipping email. Missing env vars: {', '.join(missing)}")
    raise SystemExit(0)

report_url = os.environ['REPORT_URL']
subject = os.getenv('REPORT_EMAIL_SUBJECT', 'Playwright Allure Report')
from_addr = os.environ['REPORT_EMAIL_FROM']
to_addrs = [x.strip() for x in os.environ['REPORT_EMAIL_TO_SELECTED'].split(',') if x.strip()]

html = f"""
<h3>Playwright execution completed</h3>
<p><b>Allure report URL:</b> <a href=\"{report_url}\">{report_url}</a></p>
<p>Reports older than 30 days are cleaned automatically.</p>
"""

msg = MIMEText(html, 'html')
msg['Subject'] = subject
msg['From'] = from_addr
msg['To'] = ', '.join(to_addrs)

port = int(os.environ['SMTP_PORT'])
with smtplib.SMTP(os.environ['SMTP_SERVER'], port) as smtp:
    smtp.starttls()
    smtp.login(os.environ['SMTP_USERNAME'], os.environ['SMTP_PASSWORD'])
    smtp.sendmail(from_addr, to_addrs, msg.as_string())

print(f"Email sent to: {', '.join(to_addrs)}")
