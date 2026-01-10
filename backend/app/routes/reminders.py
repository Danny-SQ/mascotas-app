from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.pet import Pet
from app.models.reminder import Reminder
from datetime import datetime

reminders_bp = Blueprint('reminders', __name__)

@reminders_bp.route('/pet/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_pet_reminders(pet_id):
    current_user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    # Capturamos el parámetro de la URL
    show_completed = request.args.get('completed', 'false').lower() == 'true'
    
    # MODIFICACIÓN AQUÍ:
    # Filtramos explícitamente por el estado que pide el frontend
    reminders = Reminder.query.filter_by(
        pet_id=pet_id, 
        is_completed=show_completed # Ahora siempre filtrará (True o False)
    ).order_by(Reminder.due_date.asc()).all()
    
    return jsonify({'reminders': [reminder.to_dict() for reminder in reminders]}), 200

@reminders_bp.route('/upcoming', methods=['GET'])
@jwt_required()
def get_upcoming_reminders():
    current_user_id = get_jwt_identity()
    pets = Pet.query.filter_by(user_id=current_user_id).all()
    pet_ids = [pet.id for pet in pets]
    
    reminders = Reminder.query.filter(
        Reminder.pet_id.in_(pet_ids),
        Reminder.is_completed == False
    ).order_by(Reminder.due_date.asc()).limit(10).all()
    
    result = []
    for reminder in reminders:
        reminder_dict = reminder.to_dict()
        pet = Pet.query.get(reminder.pet_id)
        reminder_dict['pet_name'] = pet.name if pet else 'Desconocido'
        result.append(reminder_dict)
    
    return jsonify({'reminders': result}), 200

@reminders_bp.route('', methods=['POST'])
@jwt_required()
def create_reminder():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400
    
    pet = Pet.query.filter_by(id=data.get('pet_id'), user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    required_fields = ['title', 'reminder_type', 'due_date']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'El campo {field} es requerido'}), 400
    
    reminder = Reminder(
        pet_id=data['pet_id'],
        title=data['title'],
        description=data.get('description'),
        reminder_type=data['reminder_type'],
        due_date=datetime.fromisoformat(data['due_date']),
        is_recurring=data.get('is_recurring', False),
        recurrence_interval=data.get('recurrence_interval')
    )
    
    db.session.add(reminder)
    db.session.commit()
    
    return jsonify({'reminder': reminder.to_dict(), 'message': 'Recordatorio creado exitosamente'}), 201

@reminders_bp.route('/<int:reminder_id>', methods=['PUT'])
@jwt_required()
def update_reminder(reminder_id):
    current_user_id = get_jwt_identity()
    reminder = Reminder.query.get(reminder_id)
    
    if not reminder:
        return jsonify({'error': 'Recordatorio no encontrado'}), 404
    
    pet = Pet.query.filter_by(id=reminder.pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'No autorizado'}), 403
    
    data = request.get_json()
    
    if 'title' in data:
        reminder.title = data['title']
    if 'description' in data:
        reminder.description = data['description']
    if 'reminder_type' in data:
        reminder.reminder_type = data['reminder_type']
    if 'due_date' in data:
        reminder.due_date = datetime.fromisoformat(data['due_date'])
    if 'is_recurring' in data:
        reminder.is_recurring = data['is_recurring']
    if 'recurrence_interval' in data:
        reminder.recurrence_interval = data['recurrence_interval']
    
    db.session.commit()
    
    return jsonify({'reminder': reminder.to_dict(), 'message': 'Recordatorio actualizado exitosamente'}), 200

@reminders_bp.route('/<int:reminder_id>/complete', methods=['POST'])
@jwt_required()
def complete_reminder(reminder_id):
    current_user_id = get_jwt_identity()
    reminder = Reminder.query.get(reminder_id)
    
    if not reminder:
        return jsonify({'error': 'Recordatorio no encontrado'}), 404
    
    pet = Pet.query.filter_by(id=reminder.pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'No autorizado'}), 403
    
    reminder.is_completed = True
    reminder.completed_at = datetime.utcnow()
    
    # Si es recurrente, crear el siguiente recordatorio
    if reminder.is_recurring and reminder.recurrence_interval:
        from dateutil.relativedelta import relativedelta
        
        intervals = {
            'daily': relativedelta(days=1),
            'weekly': relativedelta(weeks=1),
            'monthly': relativedelta(months=1),
            'yearly': relativedelta(years=1)
        }
        
        if reminder.recurrence_interval in intervals:
            new_reminder = Reminder(
                pet_id=reminder.pet_id,
                title=reminder.title,
                description=reminder.description,
                reminder_type=reminder.reminder_type,
                due_date=reminder.due_date + intervals[reminder.recurrence_interval],
                is_recurring=True,
                recurrence_interval=reminder.recurrence_interval
            )
            db.session.add(new_reminder)
    
    db.session.commit()
    
    return jsonify({'reminder': reminder.to_dict(), 'message': 'Recordatorio completado'}), 200

@reminders_bp.route('/<int:reminder_id>', methods=['DELETE'])
@jwt_required()
def delete_reminder(reminder_id):
    current_user_id = get_jwt_identity()
    reminder = Reminder.query.get(reminder_id)
    
    if not reminder:
        return jsonify({'error': 'Recordatorio no encontrado'}), 404
    
    pet = Pet.query.filter_by(id=reminder.pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'No autorizado'}), 403
    
    db.session.delete(reminder)
    db.session.commit()
    
    return jsonify({'message': 'Recordatorio eliminado exitosamente'}), 200
