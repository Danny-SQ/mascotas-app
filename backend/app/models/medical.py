from app import db
from datetime import datetime

class MedicalRecord(db.Model):
    __tablename__ = 'medical_records'
    
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    record_type = db.Column(db.String(50), nullable=False)  # diagnosis, surgery, treatment, checkup, emergency
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.Date, nullable=False)
    vet_name = db.Column(db.String(100))
    clinic_name = db.Column(db.String(200))
    diagnosis = db.Column(db.Text)
    treatment = db.Column(db.Text)
    medications = db.Column(db.Text)
    follow_up_date = db.Column(db.Date)
    cost = db.Column(db.Float)
    attachments = db.Column(db.Text)  # JSON string with file URLs
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'pet_id': self.pet_id,
            'record_type': self.record_type,
            'title': self.title,
            'description': self.description,
            'date': self.date.isoformat(),
            'vet_name': self.vet_name,
            'clinic_name': self.clinic_name,
            'diagnosis': self.diagnosis,
            'treatment': self.treatment,
            'medications': self.medications,
            'follow_up_date': self.follow_up_date.isoformat() if self.follow_up_date else None,
            'cost': self.cost,
            'attachments': self.attachments,
            'created_at': self.created_at.isoformat()
        }

class Vaccination(db.Model):
    __tablename__ = 'vaccinations'
    
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    vaccine_name = db.Column(db.String(100), nullable=False)
    date_administered = db.Column(db.Date, nullable=False)
    next_due_date = db.Column(db.Date)
    batch_number = db.Column(db.String(50))
    vet_name = db.Column(db.String(100))
    clinic_name = db.Column(db.String(200))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'pet_id': self.pet_id,
            'vaccine_name': self.vaccine_name,
            'date_administered': self.date_administered.isoformat(),
            'next_due_date': self.next_due_date.isoformat() if self.next_due_date else None,
            'batch_number': self.batch_number,
            'vet_name': self.vet_name,
            'clinic_name': self.clinic_name,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }
