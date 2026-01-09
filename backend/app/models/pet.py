from app import db
from datetime import datetime

class Pet(db.Model):
    __tablename__ = 'pets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    species = db.Column(db.String(50), nullable=False)  # perro, gato, ave, etc.
    breed = db.Column(db.String(100))
    birth_date = db.Column(db.Date)
    weight = db.Column(db.Float)  # en kg
    color = db.Column(db.String(50))
    photo_url = db.Column(db.String(500))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    activities = db.relationship('Activity', backref='pet', lazy='dynamic', cascade='all, delete-orphan')
    reminders = db.relationship('Reminder', backref='pet', lazy='dynamic', cascade='all, delete-orphan')
    medical_records = db.relationship('MedicalRecord', backref='pet', lazy='dynamic', cascade='all, delete-orphan')
    vaccinations = db.relationship('Vaccination', backref='pet', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'species': self.species,
            'breed': self.breed,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'weight': self.weight,
            'color': self.color,
            'photo_url': self.photo_url,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'activities_count': self.activities.count(),
            'reminders_count': self.reminders.filter_by(is_completed=False).count()
        }
