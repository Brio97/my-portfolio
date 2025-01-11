from flask import Blueprint, request, jsonify
from models.models import db, Contact

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    new_contact = Contact(
        name=data['name'],
        email=data['email'],
        message=data['message']
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify({'message': 'Message received successfully'}), 200
