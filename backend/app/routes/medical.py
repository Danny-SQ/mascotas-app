from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.pet import Pet
from app.models.medical import MedicalRecord, Vaccination
from datetime import datetime

medical_bp = Blueprint('medical', __name__)

# Medical Records
@medical_bp.route('/records/pet/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_medical_records(pet_id):
    current_user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    record_type = request.args.get('type')
    query = MedicalRecord.query.filter_by(pet_id=pet_id)
    
    if record_type:
        query = query.filter_by(record_type=record_type)
    
    records = query.order_by(MedicalRecord.date.desc()).all()
    return jsonify({'records': [record.to_dict() for record in records]}), 200

@medical_bp.route('/records', methods=['POST'])
@jwt_required()
def create_medical_record():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400
    
    pet = Pet.query.filter_by(id=data.get('pet_id'), user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    required_fields = ['record_type', 'title', 'date']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'El campo {field} es requerido'}), 400
    
    record = MedicalRecord(
        pet_id=data['pet_id'],
        record_type=data['record_type'],
        title=data['title'],
        description=data.get('description'),
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        vet_name=data.get('vet_name'),
        clinic_name=data.get('clinic_name'),
        diagnosis=data.get('diagnosis'),
        treatment=data.get('treatment'),
        medications=data.get('medications'),
        follow_up_date=datetime.strptime(data['follow_up_date'], '%Y-%m-%d').date() if data.get('follow_up_date') else None,
        cost=data.get('cost'),
        attachments=data.get('attachments')
    )
    
    db.session.add(record)
    db.session.commit()
    
    return jsonify({'record': record.to_dict(), 'message': 'Registro médico creado exitosamente'}), 201

@medical_bp.route('/records/<int:record_id>', methods=['PUT'])
@jwt_required()
def update_medical_record(record_id):
    current_user_id = get_jwt_identity()
    record = MedicalRecord.query.get(record_id)
    
    if not record:
        return jsonify({'error': 'Registro no encontrado'}), 404
    
    pet = Pet.query.filter_by(id=record.pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'No autorizado'}), 403
    
    data = request.get_json()
    
    updatable_fields = [
        'record_type', 'title', 'description', 'date', 'vet_name',
        'clinic_name', 'diagnosis', 'treatment', 'medications',
        'follow_up_date', 'cost', 'attachments'
    ]
    
    for field in updatable_fields:
        if field in data:
            if field == 'date' and data[field]:
                setattr(record, field, datetime.strptime(data[field], '%Y-%m-%d').date())
            elif field == 'follow_up_date' and data[field]:
                setattr(record, field, datetime.strptime(data[field], '%Y-%m-%d').date())
            else:
                setattr(record, field, data[field])
    
    db.session.commit()
    
    return jsonify({'record': record.to_dict(), 'message': 'Registro actualizado exitosamente'}), 200

@medical_bp.route('/records/<int:record_id>', methods=['DELETE'])
@jwt_required()
def delete_medical_record(record_id):
    current_user_id = get_jwt_identity()
    record = MedicalRecord.query.get(record_id)
    
    if not record:
        return jsonify({'error': 'Registro no encontrado'}), 404
    
    pet = Pet.query.filter_by(id=record.pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'No autorizado'}), 403
    
    db.session.delete(record)
    db.session.commit()
    
    return jsonify({'message': 'Registro eliminado exitosamente'}), 200

# Vaccinations
@medical_bp.route('/vaccinations/pet/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_vaccinations(pet_id):
    current_user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    vaccinations = Vaccination.query.filter_by(pet_id=pet_id).order_by(Vaccination.date_administered.desc()).all()
    return jsonify({'vaccinations': [vac.to_dict() for vac in vaccinations]}), 200

@medical_bp.route('/vaccinations', methods=['POST'])
@jwt_required()
def create_vaccination():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No se proporcionaron datos'}), 400
    
    pet = Pet.query.filter_by(id=data.get('pet_id'), user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    required_fields = ['vaccine_name', 'date_administered']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'El campo {field} es requerido'}), 400
    
    vaccination = Vaccination(
        pet_id=data['pet_id'],
        vaccine_name=data['vaccine_name'],
        date_administered=datetime.strptime(data['date_administered'], '%Y-%m-%d').date(),
        next_due_date=datetime.strptime(data['next_due_date'], '%Y-%m-%d').date() if data.get('next_due_date') else None,
        batch_number=data.get('batch_number'),
        vet_name=data.get('vet_name'),
        clinic_name=data.get('clinic_name'),
        notes=data.get('notes')
    )
    
    db.session.add(vaccination)
    db.session.commit()
    
    return jsonify({'vaccination': vaccination.to_dict(), 'message': 'Vacuna registrada exitosamente'}), 201

@medical_bp.route('/vaccinations/<int:vaccination_id>', methods=['DELETE'])
@jwt_required()
def delete_vaccination(vaccination_id):
    current_user_id = get_jwt_identity()
    vaccination = Vaccination.query.get(vaccination_id)
    
    if not vaccination:
        return jsonify({'error': 'Vacuna no encontrada'}), 404
    
    pet = Pet.query.filter_by(id=vaccination.pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'No autorizado'}), 403
    
    db.session.delete(vaccination)
    db.session.commit()
    
    return jsonify({'message': 'Vacuna eliminada exitosamente'}), 200

# Medical Summary
@medical_bp.route('/summary/pet/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_medical_summary(pet_id):
    current_user_id = get_jwt_identity()
    pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
    
    if not pet:
        return jsonify({'error': 'Mascota no encontrada'}), 404
    
    records_count = MedicalRecord.query.filter_by(pet_id=pet_id).count()
    vaccinations_count = Vaccination.query.filter_by(pet_id=pet_id).count()
    
    # Próximas vacunas pendientes
    from datetime import date
    upcoming_vaccinations = Vaccination.query.filter(
        Vaccination.pet_id == pet_id,
        Vaccination.next_due_date >= date.today()
    ).order_by(Vaccination.next_due_date.asc()).limit(5).all()
    
    # Último registro médico
    last_record = MedicalRecord.query.filter_by(pet_id=pet_id).order_by(MedicalRecord.date.desc()).first()
    
    return jsonify({
        'summary': {
            'total_records': records_count,
            'total_vaccinations': vaccinations_count,
            'upcoming_vaccinations': [vac.to_dict() for vac in upcoming_vaccinations],
            'last_record': last_record.to_dict() if last_record else None
        }
    }), 200
