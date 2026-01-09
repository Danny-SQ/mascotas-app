from app import db
from datetime import datetime
from enum import Enum

class ActivityType(str, Enum):
    WALK = 'walk'
    FEEDING = 'feeding'
    MEDICATION = 'medication'
    VET_VISIT = 'vet_visit'
    GROOMING = 'grooming'
    TRAINING = 'training'
    PLAY = 'play'
    OTHER = 'other'

class Activity(db.Model):
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    duration_minutes = db.Column(db.Integer)  # para paseos
    distance_km = db.Column(db.Float)  # para paseos
    food_type = db.Column(db.String(100))  # para alimentación
    food_amount = db.Column(db.String(50))  # para alimentación
    medication_name = db.Column(db.String(100))  # para medicamentos
    medication_dose = db.Column(db.String(50))  # para medicamentos
    vet_clinic = db.Column(db.String(200))  # para visitas veterinarias
    vet_diagnosis = db.Column(db.Text)  # para visitas veterinarias
    cost = db.Column(db.Float)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'pet_id': self.pet_id,
            'activity_type': self.activity_type,
            'title': self.title,
            'description': self.description,
            'date': self.date.isoformat(),
            'duration_minutes': self.duration_minutes,
            'distance_km': self.distance_km,
            'food_type': self.food_type,
            'food_amount': self.food_amount,
            'medication_name': self.medication_name,
            'medication_dose': self.medication_dose,
            'vet_clinic': self.vet_clinic,
            'vet_diagnosis': self.vet_diagnosis,
            'cost': self.cost,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }
