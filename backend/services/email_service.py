import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def send_email(name, sender_email, message):
    receiver_email = "Mutai.brian79@gmail.com"
    email_password = os.environ.get('EMAIL_PASSWORD')

    # Email to portfolio owner
    owner_msg = MIMEMultipart()
    owner_msg['From'] = sender_email
    owner_msg['To'] = receiver_email
    owner_msg['Subject'] = f"New Portfolio Contact from {name}"

    owner_body = f"""
    Name: {name}
    Email: {sender_email}
    
    Message:
    {message}
    """
    owner_msg.attach(MIMEText(owner_body, 'plain'))

    # Auto-reply to sender
    reply_msg = MIMEMultipart()
    reply_msg['From'] = receiver_email
    reply_msg['To'] = sender_email
    reply_msg['Subject'] = "Thank you for contacting Brian Mutai"

    reply_body = f"""
    Dear {name},

    Thank you for reaching out. I have received your message and will get back to you within 24 hours.

    Best regards,
    Brian Mutai
    """
    reply_msg.attach(MIMEText(reply_body, 'plain'))

    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(receiver_email, email_password)
        server.send_message(owner_msg)
        server.send_message(reply_msg)