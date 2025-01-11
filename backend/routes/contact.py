from flask import Blueprint, request, jsonify
from models.models import db, Contact
from services.email_service import send_email

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    try:
        new_contact = Contact(
            name=data['name'],
            email=data['email'],
            message=data['message']
        )
        db.session.add(new_contact)
        db.session.commit()
        send_email(data['name'], data['email'], data['message'])
        return jsonify({'message': 'Message received successfully'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
