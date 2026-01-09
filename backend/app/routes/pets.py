from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.pet import Pet
from datetime import datetime

pets_bp = Blueprint('pets', __name__)

@pets_bp.route('', methods=['GET'])
@jwt_required()
def get_pets():
    current_user_id = get_jwt_identity()
    pets = Pet.query.filter_by(user_id=current_user_id).all()
    return jsonify({'pets': [pet.to_dict() for pet in pets]}), 200

@pets_bp.route('/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_pet(pet_id):
    current_user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    return jsonify({'pet': pet.to_dict()}), 200

@pets_bp.route('', methods=['POST'])
@jwt_required()
def create_pet():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400
    
    if 'name' not in data or 'species' not in data:
        return jsonify({'error': 'Nombre y especie son requeridos'}), 400
    
    pet = Pet(
        user_id=current_user_id,
        name=data['name'],
        species=data['species'],
        breed=data.get('breed'),
        birth_date=datetime.strptime(data['birth_date'], '%Y-%m-%d').date() if data.get('birth_date') else None,
        weight=data.get('weight'),
        color=data.get('color'),
        photo_url=data.get('photo_url'),
        notes=data.get('notes')
    )
    
    db.session.add(pet)
    db.session.commit()
    
    return jsonify({'pet': pet.to_dict(), 'message': 'Mascota creada exitosamente'}), 201

@pets_bp.route('/<int:pet_id>', methods=['PUT'])
@jwt_required()
def update_pet(pet_id):
    current_user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        pet.name = data['name']
    if 'species' in data:
        pet.species = data['species']
    if 'breed' in data:
        pet.breed = data['breed']
    if 'birth_date' in data:
        pet.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date() if data['birth_date'] else None
    if 'weight' in data:
        pet.weight = data['weight']
    if 'color' in data:
        pet.color = data['color']
    if 'photo_url' in data:
        pet.photo_url = data['photo_url']
    if 'notes' in data:
        pet.notes = data['notes']
    
    db.session.commit()
    
    return jsonify({'pet': pet.to_dict(), 'message': 'Mascota actualizada exitosamente'}), 200

@pets_bp.route('/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(pet_id):
    current_user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    db.session.delete(pet)
    db.session.commit()
    
    return jsonify({'message': 'Mascota eliminada exitosamente'}), 200
