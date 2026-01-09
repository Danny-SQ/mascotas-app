from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.pet import Pet
from app.models.activity import Activity
from datetime import datetime

activities_bp = Blueprint('activities', __name__)

@activities_bp.route('/pet/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_pet_activities(pet_id):
    current_user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    activity_type = request.args.get('type')
    limit = request.args.get('limit', type=int)
    
    query = Activity.query.filter_by(pet_id=pet_id)
    
    if activity_type:
        query = query.filter_by(activity_type=activity_type)
    
    query = query.order_by(Activity.date.desc())
    
    if limit:
        query = query.limit(limit)
    
    activities = query.all()
    return jsonify({'activities': [activity.to_dict() for activity in activities]}), 200

@activities_bp.route('', methods=['POST'])
@jwt_required()
def create_activity():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400
    
    pet = Pet.query.filter_by(id=data.get('pet_id'), user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    if 'activity_type' not in data or 'title' not in data:
        return jsonify({'error': 'Tipo de actividad y título son requeridos'}), 400
    
    activity = Activity(
        pet_id=data['pet_id'],
        activity_type=data['activity_type'],
        title=data['title'],
        description=data.get('description'),
        date=datetime.fromisoformat(data['date']) if data.get('date') else datetime.utcnow(),
        duration_minutes=data.get('duration_minutes'),
        distance_km=data.get('distance_km'),
        food_type=data.get('food_type'),
        food_amount=data.get('food_amount'),
        medication_name=data.get('medication_name'),
        medication_dose=data.get('medication_dose'),
        vet_clinic=data.get('vet_clinic'),
        vet_diagnosis=data.get('vet_diagnosis'),
        cost=data.get('cost'),
        notes=data.get('notes')
    )
    
    db.session.add(activity)
    db.session.commit()
    
    return jsonify({'activity': activity.to_dict(), 'message': 'Actividad registrada exitosamente'}), 201

@activities_bp.route('/<int:activity_id>', methods=['PUT'])
@jwt_required()
def update_activity(activity_id):
    current_user_id = get_jwt_identity()
    activity = Activity.query.get(activity_id)
    
    if not activity:
        return jsonify({'error': 'Actividad no encontrada'}), 404
    
    pet = Pet.query.filter_by(id=activity.pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'No autorizado'}), 403
    
    data = request.get_json()
    
    updatable_fields = [
        'activity_type', 'title', 'description', 'date', 'duration_minutes',
        'distance_km', 'food_type', 'food_amount', 'medication_name',
        'medication_dose', 'vet_clinic', 'vet_diagnosis', 'cost', 'notes'
    ]
    
    for field in updatable_fields:
        if field in data:
            if field == 'date' and data[field]:
                setattr(activity, field, datetime.fromisoformat(data[field]))
            else:
                setattr(activity, field, data[field])
    
    db.session.commit()
    
    return jsonify({'activity': activity.to_dict(), 'message': 'Actividad actualizada exitosamente'}), 200

@activities_bp.route('/<int:activity_id>', methods=['DELETE'])
@jwt_required()
def delete_activity(activity_id):
    current_user_id = get_jwt_identity()
    activity = Activity.query.get(activity_id)
    
    if not activity:
        return jsonify({'error': 'Actividad no encontrada'}), 404
    
    pet = Pet.query.filter_by(id=activity.pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'No autorizado'}), 403
    
    db.session.delete(activity)
    db.session.commit()
    
    return jsonify({'message': 'Actividad eliminada exitosamente'}), 200

@activities_bp.route('/stats/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_activity_stats(pet_id):
    current_user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    from sqlalchemy import func
    
    stats = db.session.query(
        Activity.activity_type,
        func.count(Activity.id).label('count')
    ).filter_by(pet_id=pet_id).group_by(Activity.activity_type).all()
    
    return jsonify({
        'stats': {stat.activity_type: stat.count for stat in stats},
        'total': sum(stat.count for stat in stats)
    }), 200
